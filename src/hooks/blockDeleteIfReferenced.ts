import type {
  CollectionBeforeDeleteHook,
  CollectionSlug,
  FlattenedBlock,
  FlattenedField,
  GlobalSlug,
  PayloadRequest,
  SanitizedConfig,
  Where,
} from 'payload'
import { APIError } from 'payload'

/**
 * S3-1 (standing rule 2026-10-21 "proper error reporting throughout"; F10,
 * F14, F18, F19, F23): refuse to delete a document that is still used
 * somewhere LIVE, with a plain-language message that names every place
 * (max 5, then "+N more") and says how to fix it.
 *
 * Why beforeDelete: in payload@3.91.0 `deleteByID` runs the collection's
 * beforeDelete hooks (collections/operations/deleteByID.js:70-79) BEFORE it
 * unlinks the upload files (:90, uploads/deleteAssociatedFiles.js) and before
 * the row is deleted (:127). A failed FK delete would already have removed
 * the files from disk, and its error is a raw "Failed query". Bulk delete
 * (operations/delete.js:105-116) runs the same hooks per doc and collects
 * each thrown message in `errors[]` (:222-231), so the admin's bulk toast
 * lists one line per blocked doc (ui elements/DeleteMany/index.js:265-267).
 *
 * The error is `APIError(message, 409)`: any non-500 APIError is public
 * (errors/APIError.js `isPublic = status !== 500`), so REST returns the
 * message verbatim and the single-doc delete shows it as a toast
 * (ui elements/DeleteDocument/index.js:120-121). Not `ValidationError`, which
 * prefixes "The following field is invalid:".
 *
 * How references are found (derived from the running config, cached per
 * target slug for the life of the process):
 * - every relationship / upload field whose `relationTo` includes the target,
 *   at any depth: groups, named tabs, arrays, blocks (incl. block
 *   references), walked over `flattenedFields` (payload/dist/utilities/
 *   flattenAllFields.js: rows, collapsibles, unnamed tabs and unnamed groups
 *   are already folded into their parent);
 * - in every collection except Payload's internal `payload-*` ones (locked
 *   documents, preferences, query presets, jobs, migrations), and in every
 *   global.
 * NOT covered, by decision:
 * - draft-only references: for drafts-enabled referencing collections only
 *   published docs count (main table `_status = published`; version tables
 *   are never read). Human, 2026-10-22.
 * - links/uploads inside rich text (Lexical JSON, no FK): not queryable; the
 *   renderer must drop links whose target no longer resolves.
 * - join fields (virtual, no stored value).
 * - a doc referencing itself (e.g. a case study linking to itself).
 *
 * Queries run through the Local API with `overrideAccess: true` and the
 * operation's `req` (same transaction): collections via `payload.find` with
 * one OR of all matching paths, depth 0; globals via `findGlobal`. Polymorphic
 * paths query `{ relationTo, value }` (@payloadcms/drizzle@3.91.0
 * queries/getTableColumnFromPath.js:576, `isPolymorphicRelationship(value)`).
 * Paths inside a blocks field are NOT queried: drizzle resolves `layout.<field>`
 * against the FIRST block that has a field of that name only
 * (getTableColumnFromPath.js:140, `.some(...)`), so a second block with the same
 * field name would be missed. A collection with such a path is scanned instead
 * (all published docs, depth 0; pages are a few dozen docs).
 * Matching docs are then walked to name the exact place ("row 2").
 *
 * Bypass: `context.skipReferenceCheck = true` (seed resets, QA scripts).
 */

type Ref = { relationTo: string; value: unknown }

type Step =
  | { kind: 'container'; name: string; label: string | null }
  | { kind: 'array'; name: string; label: string }
  | { kind: 'blocks'; name: string; label: string; blockSlug: string; blockLabel: string }
  | { kind: 'leaf'; name: string; label: string; polymorphic: boolean }

type Source =
  | { kind: 'collection'; slug: CollectionSlug; paths: Step[][] }
  | { kind: 'global'; slug: GlobalSlug; paths: Step[][] }

type Place = string

export type BlockDeleteOptions = {
  /** Lower-case noun in the message, e.g. "image". Default: the collection's singular label. */
  noun?: string
  /**
   * Referencing collections reported as a COUNT with their own sentence
   * instead of a list (S3-2: form submissions). The callback gets the target's
   * display name and the count; the referencing collection is then left out
   * of the place list.
   */
  counted?: Partial<Record<CollectionSlug, (name: string, count: number) => string>>
  /**
   * Extra sentence when a specific place blocks the delete (S3-2: the default
   * social share image). Key: `<collection-or-global slug>:<dot path>`.
   */
  hints?: Record<string, string>
}

const MAX_PLACES = 5

/* ------------------------------------------------------------------------ */
/* labels                                                                     */
/* ------------------------------------------------------------------------ */

const humanize = (name: string): string => {
  const words = name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .trim()
    .toLowerCase()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

/** Static label (string or per-language record) or a label function; `false` = no label. */
const labelText = (label: unknown, fallback: string, req: PayloadRequest): string | null => {
  if (label === false) return null
  if (typeof label === 'string' && label.trim()) return label
  if (typeof label === 'function') {
    try {
      const out: unknown = label({ i18n: req.i18n, t: req.t })
      if (typeof out === 'string' && out.trim()) return out
    } catch {
      // fall through to the fallback
    }
  }
  if (label && typeof label === 'object') {
    const record = label as Record<string, unknown>
    const en = record.en ?? Object.values(record)[0]
    if (typeof en === 'string' && en.trim()) return en
  }
  return fallback ? humanize(fallback) : null
}

const singularLabel = (labels: unknown, slug: string, req: PayloadRequest): string => {
  const singular = labels && typeof labels === 'object' ? (labels as { singular?: unknown }).singular : undefined
  return labelText(singular, slug, req) ?? humanize(slug)
}

/* ------------------------------------------------------------------------ */
/* reference discovery (cached)                                              */
/* ------------------------------------------------------------------------ */

const includesTarget = (relationTo: string | string[], target: string): boolean =>
  Array.isArray(relationTo) ? relationTo.includes(target) : relationTo === target

const collectPaths = (
  fields: FlattenedField[],
  target: string,
  req: PayloadRequest,
  prefix: Step[] = [],
  depth = 0,
): Step[][] => {
  if (depth > 12) return []
  const out: Step[][] = []
  for (const field of fields) {
    switch (field.type) {
      case 'relationship':
      case 'upload': {
        if (includesTarget(field.relationTo, target)) {
          out.push([
            ...prefix,
            {
              kind: 'leaf',
              name: field.name,
              label: labelText(field.label, field.name, req) ?? humanize(field.name),
              polymorphic: Array.isArray(field.relationTo),
            },
          ])
        }
        break
      }
      case 'group':
      case 'tab': {
        const step: Step = { kind: 'container', name: field.name, label: labelText(field.label, field.name, req) }
        out.push(...collectPaths(field.flattenedFields, target, req, [...prefix, step], depth + 1))
        break
      }
      case 'array': {
        const step: Step = {
          kind: 'array',
          name: field.name,
          label: labelText(field.label, field.name, req) ?? humanize(field.name),
        }
        out.push(...collectPaths(field.flattenedFields, target, req, [...prefix, step], depth + 1))
        break
      }
      case 'blocks': {
        const blocks = (field.blockReferences ?? field.blocks)
          .map((b) => (typeof b === 'string' ? (req.payload.blocks as Record<string, FlattenedBlock | undefined>)[b] : b))
          .filter((b): b is FlattenedBlock => !!b)
        for (const block of blocks) {
          const step: Step = {
            kind: 'blocks',
            name: field.name,
            label: labelText(field.label, field.name, req) ?? humanize(field.name),
            blockSlug: block.slug,
            blockLabel: singularLabel(block.labels, block.slug, req),
          }
          out.push(...collectPaths(block.flattenedFields, target, req, [...prefix, step], depth + 1))
        }
        break
      }
      default:
        break
    }
  }
  return out
}

const cache = new WeakMap<SanitizedConfig, Map<string, Source[]>>()

const sourcesFor = (target: string, req: PayloadRequest): Source[] => {
  const config = req.payload.config
  let perConfig = cache.get(config)
  if (!perConfig) {
    perConfig = new Map()
    cache.set(config, perConfig)
  }
  const hit = perConfig.get(target)
  if (hit) return hit

  const sources: Source[] = []
  // Globals first: they are site-wide, so they lead the message.
  for (const global of config.globals) {
    const paths = collectPaths(global.flattenedFields, target, req)
    if (paths.length) sources.push({ kind: 'global', slug: global.slug as GlobalSlug, paths })
  }
  for (const collection of config.collections) {
    if (collection.slug.startsWith('payload-')) continue
    const paths = collectPaths(collection.flattenedFields, target, req)
    if (paths.length) sources.push({ kind: 'collection', slug: collection.slug as CollectionSlug, paths })
  }
  perConfig.set(target, sources)
  return sources
}

/* ------------------------------------------------------------------------ */
/* matching                                                                  */
/* ------------------------------------------------------------------------ */

const queryPath = (steps: Step[]): string => steps.map((s) => s.name).join('.')

const pathCondition = (steps: Step[], target: string, id: number | string): Where => {
  const leaf = steps[steps.length - 1]
  const value = leaf.kind === 'leaf' && leaf.polymorphic ? { relationTo: target, value: id } : id
  return { [queryPath(steps)]: { equals: value } }
}

const sameId = (a: unknown, b: number | string): boolean =>
  (typeof a === 'number' || typeof a === 'string') && String(a) === String(b)

const isRef = (v: unknown): v is Ref =>
  !!v && typeof v === 'object' && typeof (v as Ref).relationTo === 'string' && 'value' in (v as Ref)

const valueMatches = (value: unknown, target: string, id: number | string): boolean => {
  const items = Array.isArray(value) ? value : [value]
  return items.some((item) => {
    if (isRef(item)) {
      if (item.relationTo !== target) return false
      const inner = item.value
      return sameId(inner, id) || (!!inner && typeof inner === 'object' && sameId((inner as { id?: unknown }).id, id))
    }
    if (item && typeof item === 'object') return sameId((item as { id?: unknown }).id, id)
    return sameId(item, id)
  })
}

/** Every place in `data` where `steps` holds the target; one breadcrumb per hit. */
const findPlaces = (
  data: unknown,
  steps: Step[],
  target: string,
  id: number | string,
  crumbs: string[] = [],
): string[][] => {
  if (!data || typeof data !== 'object') return []
  const [step, ...rest] = steps
  const value = (data as Record<string, unknown>)[step.name]
  switch (step.kind) {
    case 'leaf':
      // A polymorphic `reference` is the destination of a link group (linkField,
      // redirects `to`, form-builder `redirect`): the group already names it.
      if (!valueMatches(value, target, id)) return []
      return [step.polymorphic && step.name === 'reference' ? crumbs : [...crumbs, step.label]]
    case 'container':
      return findPlaces(value, rest, target, id, step.label ? [...crumbs, step.label] : crumbs)
    case 'array':
      return Array.isArray(value)
        ? value.flatMap((row, i) => findPlaces(row, rest, target, id, [...crumbs, `${step.label} (row ${i + 1})`]))
        : []
    case 'blocks':
      return Array.isArray(value)
        ? value.flatMap((row, i) =>
            (row as { blockType?: unknown })?.blockType === step.blockSlug
              ? findPlaces(row, rest, target, id, [...crumbs, `${step.label} (${step.blockLabel}, row ${i + 1})`])
              : [],
          )
        : []
  }
}

/* ------------------------------------------------------------------------ */
/* the hook                                                                  */
/* ------------------------------------------------------------------------ */

const quote = (s: string): string => `"${s.length > 60 ? `${s.slice(0, 57)}…` : s}"`

const docTitle = (doc: Record<string, unknown> | null | undefined, useAsTitle: string | undefined): string | null => {
  if (!doc) return null
  const raw = useAsTitle ? doc[useAsTitle] : undefined
  if (typeof raw === 'string' && raw.trim()) return raw.trim()
  if (typeof raw === 'number') return String(raw)
  return null
}

export const blockDeleteIfReferenced = (options: BlockDeleteOptions = {}): CollectionBeforeDeleteHook => {
  return async ({ collection, context, id, req }) => {
    if (context?.skipReferenceCheck) return

    const target = collection.slug
    const { payload } = req
    const places: Place[] = []
    const hints = new Set<string>()
    const countedSentences: string[] = []
    let unseen = 0

    // Display name of the doc being deleted (only needed if something blocks it).
    let name: string | null = null
    const nameOf = async (): Promise<string> => {
      if (name) return name
      const noun = options.noun
        ? options.noun.charAt(0).toUpperCase() + options.noun.slice(1)
        : singularLabel(collection.labels, target, req)
      const useAsTitle = collection.admin?.useAsTitle
      const doc = (await payload.findByID({
        collection: target as CollectionSlug,
        id,
        depth: 0,
        overrideAccess: true,
        req,
        disableErrors: true,
      })) as Record<string, unknown> | null
      const title = docTitle(doc, useAsTitle) ?? (typeof doc?.filename === 'string' ? doc.filename : null)
      name = title ? `${noun} ${quote(title)}` : `This ${noun.toLowerCase()}`
      return name
    }

    for (const source of sourcesFor(target, req)) {
      if (source.kind === 'global') {
        const data = await payload.findGlobal({
          slug: source.slug,
          depth: 0,
          overrideAccess: true,
          showHiddenFields: true,
          req,
        })
        const globalConfig = payload.config.globals.find((g) => g.slug === source.slug)
        const globalLabel = labelText(globalConfig?.label, source.slug, req) ?? humanize(source.slug)
        for (const steps of source.paths) {
          const hits = findPlaces(data, steps, target, id)
          if (hits.length) {
            const hint = options.hints?.[`${source.slug}:${queryPath(steps)}`]
            if (hint) hints.add(hint)
          }
          for (const crumbs of hits) places.push([globalLabel, ...crumbs].join(' → '))
        }
        continue
      }

      const refConfig = payload.collections[source.slug]?.config
      if (!refConfig) continue
      const or = source.paths.map((steps) => pathCondition(steps, target, id))
      const and: Where[] = [{ or }]
      if (refConfig.versions && typeof refConfig.versions === 'object' && refConfig.versions.drafts) {
        and.push({ _status: { equals: 'published' } })
      }
      if (source.slug === target) and.push({ id: { not_equals: id } })
      const where: Where = { and }

      const counted = options.counted?.[source.slug]
      if (counted) {
        const { totalDocs } = await payload.count({ collection: source.slug, where, overrideAccess: true, req })
        if (totalDocs > 0) countedSentences.push(counted(await nameOf(), totalDocs))
        continue
      }

      const scan = source.paths.some((steps) => steps.some((s) => s.kind === 'blocks'))
      const result = await payload.find({
        collection: source.slug,
        where: scan ? (and.length > 1 ? { and: and.slice(1) } : undefined) : where,
        depth: 0,
        ...(scan ? { pagination: false } : { limit: MAX_PLACES }),
        overrideAccess: true,
        showHiddenFields: true,
        req,
      })
      if (!result.docs.length) continue
      const refNoun = singularLabel(refConfig.labels, source.slug, req)
      for (const doc of result.docs as unknown as Record<string, unknown>[]) {
        const title = docTitle(doc, refConfig.admin?.useAsTitle) ?? `#${String(doc.id)}`
        const prefix = `${refNoun} ${quote(title)}`
        let found = 0
        for (const steps of source.paths) {
          const hits = findPlaces(doc, steps, target, id)
          if (hits.length) {
            const hint = options.hints?.[`${source.slug}:${queryPath(steps)}`]
            if (hint) hints.add(hint)
          }
          for (const crumbs of hits) {
            places.push([prefix, ...crumbs].join(' → '))
            found++
          }
        }
        // The query matched but the walk could not name the field: still list the doc.
        if (!found && !scan) places.push(prefix)
      }
      if (!scan) unseen += result.totalDocs - result.docs.length
    }

    if (!places.length && !countedSentences.length) return

    const who = await nameOf()
    const noun = options.noun ?? singularLabel(collection.labels, target, req).toLowerCase()
    const shown = places.slice(0, MAX_PLACES)
    const more = places.length - shown.length + unseen
    const list = `${shown.join('; ')}${more > 0 ? ` (+${more} more)` : ''}`
    const those = places.length + unseen > 1 ? 'those places' : 'that place'

    const parts: string[] = []
    if (countedSentences.length) {
      parts.push(...countedSentences)
      if (shown.length) parts.push(`It's also used in: ${list}. Remove it from ${those} too.`)
    } else {
      parts.push(
        `${who} can't be deleted yet. It's still used in: ${list}.`,
        `Remove it from ${those} or choose a different ${noun} there, then delete again.`,
      )
    }
    parts.push(...hints)
    throw new APIError(parts.join(' '), 409)
  }
}

/* ------------------------------------------------------------------------ */
/* S3-2 specials                                                             */
/* ------------------------------------------------------------------------ */

const plural = (n: number, one: string, many: string): string => `${n} ${n === 1 ? one : many}`

/** forms: blocked while submissions exist (F18); the leads stay on record. */
export const formSubmissionsSentence = (name: string, count: number): string =>
  `${name} has ${plural(count, 'submission', 'submissions')}, so it can't be deleted and the leads stay on record. If you really want it gone, delete its submissions first (Form submissions, filter by this form).`

/** lead-magnets: blocked while submissions requested it (human, 2026-10-22). */
export const leadMagnetSubmissionsSentence = (name: string, count: number): string =>
  `${name} has ${plural(count, 'submission', 'submissions')} requesting it, so it can't be deleted and the leads stay on record. If you really want it gone, delete those submissions first (Form submissions, filter by Lead magnet).`

/** media used as the site's default social share image (F14). */
export const DEFAULT_OG_IMAGE_HINT =
  'How: Globals → SEO defaults → Default social share image → choose another image → Save.'
