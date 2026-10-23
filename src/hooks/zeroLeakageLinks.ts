import type { Block, Field, PayloadRequest, Validate } from 'payload'
import { checkbox, richText } from 'payload/shared'

import { docPath } from '../lib/docPath'

/**
 * F137 (Gate 2 S6): zero-leakage link rules for `pages` (p15 Campaign LP).
 * On a page with `zeroLeakage: true`, at publish:
 *
 * 1. A TestimonialRow `row` with its "A study in full" card on (and no lead
 *    figure, which replaces the card) links away: error on `studyCard.show`.
 * 2. Single destination: every button (Hero `ctas[].link` — vsl shows only the
 *    first —, MiniCTAStrip `link`, OfferBlock `cta`, TestimonialRow row `cta`)
 *    must resolve to the same place as the first one found, top to bottom.
 *    Error on the other link's destination field (`reference` or `url`).
 * 3. A link in OfferBlock `body` that is not `#…` and not that destination
 *    leaves the page: error on `body`.
 *
 * Validation only: these rules are wrapped around the existing field
 * validators of the page's copies of the blocks (`withZeroLeakageRules`), so
 * they are reported with every other field error at the offending path and,
 * like all publish rules, are skipped on draft saves (`drafts.validate: false`,
 * PROGRESS Decision log 2026-10-17). `zeroLeakageLinkErrors` is also the
 * `afterChange` backstop's source. No schema or DB change.
 *
 * Destinations are compared as resolved paths (same rules as the frontend's
 * `resolveLinkHref` → `docPath`): an internal link is looked up (slug, track)
 * so "Page: Book a Call" equals a custom "/book-a-call".
 *
 * Verified against payload@3.91.0: field validate options carry `data`
 * (doc merged with incoming data), `blockData`, `path` (string segments on the
 * server) and `req` (fields/hooks/beforeChange/promise.js:98-120); fields
 * hidden by `admin.condition` skip validation (promise.js:37-44); a field
 * without `validate` gets the type default at sanitize time only when
 * `validate` is undefined (fields/config/sanitize.js:153), so a wrapper calls
 * the default (`checkbox`, `richText` from payload/shared) itself.
 */

export const ZERO_LEAKAGE_STUDY_CARD_ERROR = 'Turn off the case study card on a zero-leakage page (it links away).'
export const ZERO_LEAKAGE_OFFER_BODY_ERROR = "Links in the offer text can't leave the page."

type Ref = { relationTo?: string; value?: unknown } | null | undefined
type LinkValue = { type?: string | null; reference?: Ref; url?: string | null; label?: string | null } | null | undefined
type Row = Record<string, unknown> & { blockType?: string | null }
export type FieldError = { message: string; path: string }

const BLOCK_LABELS: Record<string, string> = {
  hero: 'Hero',
  miniCTAStrip: 'Mini CTA strip',
  offerBlock: 'Offer',
  testimonialRow: 'Testimonial row',
}

const HERO_CTA_VARIANTS = ['typographic', 'service', 'vsl']

/** Per-request memo of internal-link lookups (validators run once per wrapped field). */
const lookups = new WeakMap<object, Map<string, Promise<string | null>>>()

const idOf = (value: unknown): number | string | null => {
  if (typeof value === 'number' || typeof value === 'string') return value
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id?: unknown }).id
    return typeof id === 'number' || typeof id === 'string' ? id : null
  }
  return null
}

/** `/x/` → `/x`; keeps `/`, full URLs and `#…` as typed (trimmed). */
const normalise = (url: string): string => {
  const u = url.trim()
  return u.length > 1 && u.startsWith('/') && u.endsWith('/') ? u.replace(/\/+$/, '') : u
}

/** Resolved destination of an internal reference: its public path, else a stable id key. */
const resolveRef = async (ref: Ref, req: PayloadRequest | undefined): Promise<string | null> => {
  const relationTo = ref?.relationTo
  const id = idOf(ref?.value)
  if (!relationTo || id === null) return null
  const fallback = `doc:${relationTo}:${id}`
  const populated = ref?.value && typeof ref.value === 'object' ? (ref.value as { slug?: string | null; track?: string | null }) : null
  if (populated?.slug) return docPath(relationTo, populated) ?? fallback
  if (!req?.payload) return fallback
  let memo = lookups.get(req)
  if (!memo) {
    memo = new Map()
    lookups.set(req, memo)
  }
  const cached = memo.get(fallback)
  if (cached) return cached
  const pending = req.payload
    .findByID({
      collection: relationTo as 'pages',
      id,
      depth: 0,
      select: { slug: true, ...(relationTo === 'posts' ? { track: true } : {}) },
      overrideAccess: true,
      disableErrors: true,
      req,
    })
    .then((doc) => (doc ? (docPath(relationTo, doc as { slug?: string | null; track?: string | null }) ?? fallback) : fallback))
    .catch(() => fallback)
  memo.set(fallback, pending)
  return pending
}

/** Destination of a `linkField` value (`resolveLinkHref` semantics), or null when it has none. */
const linkDestination = async (link: LinkValue, req: PayloadRequest | undefined): Promise<string | null> => {
  if (!link) return null
  if ((link.type ?? 'internal') === 'custom') {
    const url = link.url?.trim()
    return url ? normalise(url) : null
  }
  return resolveRef(link.reference, req)
}

type Button = { path: string; link: LinkValue; section: number; blockType: string }

/** Every button on the page, top to bottom, with the data path of its `linkField` group. */
const collectButtons = (layout: unknown): Button[] => {
  if (!Array.isArray(layout)) return []
  const out: Button[] = []
  layout.forEach((raw, i) => {
    const row = raw as Row | null
    const blockType = row?.blockType
    if (!row || !blockType) return
    const push = (path: string, link: unknown) => out.push({ path: `layout.${i}.${path}`, link: link as LinkValue, section: i + 1, blockType })
    if (blockType === 'hero') {
      const variant = (row.variant as string | undefined) ?? 'typographic'
      if (!HERO_CTA_VARIANTS.includes(variant) || !Array.isArray(row.ctas)) return
      const ctas = variant === 'vsl' ? row.ctas.slice(0, 1) : row.ctas
      ctas.forEach((c, j) => push(`ctas.${j}.link`, (c as { link?: unknown } | null)?.link))
    } else if (blockType === 'miniCTAStrip') {
      push('link', row.link)
    } else if (blockType === 'offerBlock') {
      push('cta', row.cta)
    } else if (blockType === 'testimonialRow' && ((row.variant as string | undefined) ?? 'row') === 'row') {
      push('cta', row.cta)
    }
  })
  return out
}

type LexicalNode = { type?: string; children?: unknown; fields?: { linkType?: string; url?: string | null; doc?: Ref } | null }

/** Link/autolink nodes anywhere in a Lexical state. */
const linkNodes = (state: unknown): LexicalNode[] => {
  const out: LexicalNode[] = []
  const walk = (node: unknown) => {
    if (!node || typeof node !== 'object') return
    const n = node as LexicalNode
    if (n.type === 'link' || n.type === 'autolink') out.push(n)
    if (Array.isArray(n.children)) n.children.forEach(walk)
  }
  walk((state as { root?: unknown } | null)?.root)
  return out
}

const describe = (b: Button, destination: string): string => {
  const label = b.link?.label?.trim()
  const what = label ? `"${label}"` : 'the first button'
  const where = destination.startsWith('doc:') ? 'the page chosen there' : destination
  return `Every button on a zero-leakage page must go to the same place (${what} in section ${b.section}, ${BLOCK_LABELS[b.blockType] ?? b.blockType}, goes to ${where}).`
}

/**
 * All zero-leakage link errors of a page, with data paths
 * (`layout.<i>.<field…>`). Empty unless `zeroLeakage` is on.
 */
export const zeroLeakageLinkErrors = async (
  data: { zeroLeakage?: unknown; layout?: unknown } | null | undefined,
  req: PayloadRequest | undefined,
): Promise<FieldError[]> => {
  if (data?.zeroLeakage !== true || !Array.isArray(data.layout)) return []
  const errors: FieldError[] = []

  // 1. "A study in full" card.
  data.layout.forEach((raw, i) => {
    const row = raw as Row | null
    if (row?.blockType !== 'testimonialRow' || ((row.variant as string | undefined) ?? 'row') !== 'row') return
    const card = row.studyCard as { show?: boolean | null } | null | undefined
    const lead = row.leadMetric as { value?: string | null; label?: string | null } | null | undefined
    // Same test as the component: a lead figure needs both parts, and only then replaces the card.
    const hasLead = Boolean(lead?.value?.trim() && lead?.label?.trim())
    if (card?.show !== false && !hasLead) errors.push({ path: `layout.${i}.studyCard.show`, message: ZERO_LEAKAGE_STUDY_CARD_ERROR })
  })

  // 2. Single destination.
  const buttons = await Promise.all(
    collectButtons(data.layout).map(async (b) => ({ ...b, destination: await linkDestination(b.link, req) })),
  )
  const first = buttons.find((b) => b.destination !== null)
  if (first?.destination) {
    for (const b of buttons) {
      if (b === first || b.destination === null || b.destination === first.destination) continue
      const field = (b.link?.type ?? 'internal') === 'custom' ? 'url' : 'reference'
      errors.push({ path: `${b.path}.${field}`, message: describe(first, first.destination) })
    }
  }

  // 3. Offer body links.
  const allowed = first?.destination ?? null
  for (const [i, raw] of data.layout.entries()) {
    const row = raw as Row | null
    if (row?.blockType !== 'offerBlock') continue
    for (const node of linkNodes(row.body)) {
      const f = node.fields
      const custom = (f?.linkType ?? 'custom') === 'custom'
      const url = f?.url?.trim() ?? ''
      if (custom && url.startsWith('#')) continue
      const destination = custom ? (url ? normalise(url) : null) : await resolveRef(f?.doc, req)
      if (destination === null || destination === allowed) continue
      errors.push({ path: `layout.${i}.body`, message: ZERO_LEAKAGE_OFFER_BODY_ERROR })
      break
    }
  }
  return errors
}

/** Wraps a field's validator: the original (or the type default) first, then its zero-leakage error, if any. */
const wrapValidate = (field: Field): Field => {
  const own = (field as { validate?: Validate }).validate
  const type = (field as { type: string }).type
  const prior: Validate | undefined = own ?? (type === 'checkbox' ? (checkbox as Validate) : type === 'richText' ? (richText as Validate) : undefined)
  const validate: Validate = async (value, options) => {
    const base = prior ? await prior(value, options) : true
    if (base !== true) return base
    try {
      const path = Array.isArray(options?.path) ? options.path.join('.') : ''
      const data = options?.data as { zeroLeakage?: unknown; layout?: unknown } | undefined
      if (!path || data?.zeroLeakage !== true) return true
      const hit = (await zeroLeakageLinkErrors(data, options.req)).find((e) => e.path === path)
      return hit ? hit.message : true
    } catch {
      // Never throw from a validator (admin form state); the afterChange backstop re-checks on publish.
      return true
    }
  }
  return { ...field, validate } as Field
}

/** Clones `fields`, wrapping the field at `path` (names of data fields; unnamed rows/collapsibles are transparent). */
const wrapAt = (fields: Field[], path: string[]): Field[] =>
  fields.map((f) => {
    if (!('name' in f) || !f.name) {
      return 'fields' in f && Array.isArray(f.fields) ? ({ ...f, fields: wrapAt(f.fields, path) } as Field) : f
    }
    if (f.name !== path[0]) return f
    if (path.length === 1) return wrapValidate(f)
    return 'fields' in f && Array.isArray(f.fields) ? ({ ...f, fields: wrapAt(f.fields, path.slice(1)) } as Field) : f
  })

/** Field paths (inside each block) that carry a zero-leakage rule. */
const RULE_PATHS: Record<string, string[][]> = {
  hero: [
    ['ctas', 'link', 'reference'],
    ['ctas', 'link', 'url'],
  ],
  miniCTAStrip: [
    ['link', 'reference'],
    ['link', 'url'],
  ],
  offerBlock: [
    ['cta', 'reference'],
    ['cta', 'url'],
    ['body'],
  ],
  testimonialRow: [
    ['cta', 'reference'],
    ['cta', 'url'],
    ['studyCard', 'show'],
  ],
}

/** The `pages` copies of the layout blocks, with the zero-leakage rules attached (block configs untouched). */
export const withZeroLeakageRules = (blocks: Block[]): Block[] =>
  blocks.map((block) => {
    const paths = RULE_PATHS[block.slug]
    if (!paths) return block
    return { ...block, fields: paths.reduce((fields, p) => wrapAt(fields, p), block.fields) }
  })
