import { revalidateTag } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
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
 */

type Published = TypeWithID & { _status?: 'draft' | 'published' | null }

const safeRevalidate = (tag: string, req: PayloadRequest): void => {
  try {
    revalidateTag(tag, 'max')
    req.payload.logger.info(`revalidateTag ${tag}`)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    if (message.includes('static generation store missing')) {
      req.payload.logger.debug(`revalidateTag ${tag} skipped (outside a Next request)`)
      return
    }
    req.payload.logger.error({ err, msg: `revalidateTag ${tag} failed` })
  }
}

export const revalidateTagHooks = (
  tag: string,
): {
  afterChange: CollectionAfterChangeHook<Published>
  afterDelete: CollectionAfterDeleteHook<Published>
} => ({
  afterChange: ({ doc, previousDoc, req, context }) => {
    if (context.disableRevalidate) return doc
    const isPublished = doc?._status === 'published'
    const wasPublished = previousDoc?._status === 'published'
    if (isPublished || wasPublished) safeRevalidate(tag, req)
    return doc
  },
  afterDelete: ({ doc, req, context }) => {
    if (!context.disableRevalidate) safeRevalidate(tag, req)
    return doc
  },
})
