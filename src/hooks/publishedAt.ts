import type { CollectionBeforeChangeHook } from 'payload'

/**
 * SCHEMA §10 "`publishedAt` on first publish" (pages, case-studies, posts,
 * lead-magnets). Collection `beforeChange`, verified against payload@3.91.0
 * collections/operations/utilities/update.js: a draft save has already set
 * `data._status = 'draft'` before this runs; a non-draft update without
 * `_status` keeps the stored status, hence the `originalDoc` fallback.
 * An editor-entered date is never overwritten.
 */
export const setPublishedAtOnPublish: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  const status = data?._status ?? originalDoc?._status
  if (status !== 'published') return data
  if (data?.publishedAt || originalDoc?.publishedAt) return data
  return { ...data, publishedAt: new Date().toISOString() }
}
