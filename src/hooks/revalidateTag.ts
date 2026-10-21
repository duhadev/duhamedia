import { revalidatePath, revalidateTag } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
  TypeWithID,
} from 'payload'

/**
 * Tag-based revalidation for drafts-enabled collections (SCHEMA.md §10).
 *
 * Pattern: Payload website template @ v3.91.0
 * (templates/website/src/collections/Posts/hooks/revalidatePost.ts):
 * - skip when `context.disableRevalidate` (seed scripts set it);
 * - revalidate only when the PUBLIC view can have changed: the saved doc is
 *   published (publish / re-publish), or it was published and no longer is
 *   (unpublish). Plain draft/autosave edits of an unpublished doc do nothing.
 * - `revalidateTag(tag, 'max')`: next@16.3.8 requires the profile argument
 *   (server/web/spec-extension/revalidate.d.ts); 'max' = stale-while-revalidate,
 *   as in the template.
 *
 * Outside a Next request (Local API scripts, seed, migrations) Next throws
 * "Invariant: static generation store missing" (revalidate.js, E263). There is
 * no cache to purge there, so that case is logged and swallowed: an
 * afterChange throw would fail the save. Any other error is logged at error
 * level and also swallowed, for the same reason.
 *
 * Optional `paths` (C7, SCHEMA §10 revalidation map, e.g. case-studies →
 * `/work`, `/work/<slug>`): `revalidatePath` goes through the same Next
 * `revalidate()` (next@16.3.8 server/web/spec-extension/revalidate.js), so it
 * gets the same guard. Paths of both the new and the previous doc are purged,
 * so a slug change also refreshes the old URL.
 */

type Published = TypeWithID & { _status?: 'draft' | 'published' | null }

const guarded = (what: string, run: () => void, req: PayloadRequest): void => {
  try {
    run()
    req.payload.logger.info(what)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    if (message.includes('static generation store missing')) {
      req.payload.logger.debug(`${what} skipped (outside a Next request)`)
      return
    }
    req.payload.logger.error({ err, msg: `${what} failed` })
  }
}

const safeRevalidate = (tag: string, req: PayloadRequest): void =>
  guarded(`revalidateTag ${tag}`, () => revalidateTag(tag, 'max'), req)

const safeRevalidatePath = (path: string, req: PayloadRequest, type?: 'layout' | 'page'): void =>
  guarded(`revalidatePath ${path}${type ? ` (${type})` : ''}`, () => revalidatePath(path, type), req)

type PathsFor<T> = (doc: T | null | undefined) => (string | null | undefined)[]

export const revalidateTagHooks = <T extends Published = Published>(
  tag: string,
  options: { paths?: PathsFor<T> } = {},
): {
  afterChange: CollectionAfterChangeHook<T>
  afterDelete: CollectionAfterDeleteHook<T>
} => {
  const purgePaths = (req: PayloadRequest, ...docs: (T | null | undefined)[]): void => {
    if (!options.paths) return
    const unique = new Set(docs.flatMap((d) => options.paths!(d)).filter((p): p is string => !!p))
    unique.forEach((p) => safeRevalidatePath(p, req))
  }
  return {
    afterChange: ({ doc, previousDoc, req, context }) => {
      if (context.disableRevalidate) return doc
      const isPublished = doc?._status === 'published'
      const wasPublished = previousDoc?._status === 'published'
      if (isPublished || wasPublished) {
        safeRevalidate(tag, req)
        purgePaths(req, doc, previousDoc)
      }
      return doc
    },
    afterDelete: ({ doc, req, context }) => {
      if (context.disableRevalidate) return doc
      safeRevalidate(tag, req)
      purgePaths(req, doc)
      return doc
    },
  }
}

/**
 * Globals (SCHEMA §7, §10: "globals → layout-wide tag"). Globals have no
 * drafts, so every save is live: purge the global's tag and the whole
 * `(frontend)` tree (`revalidatePath('/', 'layout')`, next@16.3.8
 * server/web/spec-extension/revalidate.d.ts:32), because site-wide globals
 * render in the shared header/footer of every page. Same guard and
 * `context.disableRevalidate` opt-out as the collection hooks.
 *
 * Signature: `GlobalAfterChangeHook` = globals/config/types.d.ts:67
 * (payload@3.91.0) `{ context, data, doc, global, previousDoc, req }`.
 */
export const revalidateGlobalHook =
  (tag: string): GlobalAfterChangeHook =>
  ({ doc, req, context }) => {
    if (context.disableRevalidate) return doc
    safeRevalidate(tag, req)
    safeRevalidatePath('/', req, 'layout')
    return doc
  }

/**
 * Collections WITHOUT drafts whose docs feed public pages (P1: form-builder
 * `forms`, rendered by FormEmbed / NewsletterBand / Hero and the footer
 * nudge on every page). No `_status` exists, so every save and delete is
 * live: purge the tag and the whole `(frontend)` tree, as for globals.
 */
export const revalidateLiveCollectionHooks = (
  tag: string,
): { afterChange: CollectionAfterChangeHook; afterDelete: CollectionAfterDeleteHook } => {
  const purge = (req: PayloadRequest): void => {
    safeRevalidate(tag, req)
    safeRevalidatePath('/', req, 'layout')
  }
  return {
    afterChange: ({ doc, req, context }) => {
      if (!context.disableRevalidate) purge(req)
      return doc
    },
    afterDelete: ({ doc, req, context }) => {
      if (!context.disableRevalidate) purge(req)
      return doc
    },
  }
}
