import { Forbidden, type CollectionAfterChangeHook, type CollectionBeforeChangeHook, type CollectionSlug } from 'payload'

import { isPipeline } from './roles'

/**
 * `posts` beforeChange (SCHEMA.md §10: "Pipeline can never produce
 * `_status: published`"). Written in C1, attached by C8 when `posts` exists.
 *
 * Collection beforeChange runs before field beforeChange
 * (payload/dist/collections/operations/utilities/update.js and create.js,
 * payload@3.91.0), and with localization disabled `_status` comes only from
 * the request data, so forcing it here is final. An explicit publish attempt
 * is rejected (403) rather than silently downgraded, so the pipeline sees it.
 */
export const forbidPipelinePublish: CollectionBeforeChangeHook = ({ data, req }) => {
  if (!isPipeline(req.user)) return data
  if (data?._status !== undefined && data._status !== 'draft') {
    throw new Forbidden(req.t)
  }
  return { ...data, _status: 'draft' }
}

/**
 * `posts` beforeChange, after `forbidPipelinePublish` (C8). The pipeline may
 * never write to a post whose LIVE row is published.
 *
 * Why the update access (`_status = draft`) is not enough on its own
 * (payload@3.91.0): updateByID/update look the doc up through
 * `getLatestCollectionVersion` (versions/getLatestCollectionVersion.js), which
 * applies the access query to the LATEST VERSION (`version._status`), not to
 * the main row. A published post with a newer staff draft on top therefore
 * matches `_status = draft`, and a pipeline save without `?draft=true` would
 * then overwrite the main row with `_status: 'draft'` — unpublishing the live
 * post. So the main row is read directly here (db adapter, no hooks, same
 * transaction) and any pipeline write to a live post is rejected with 403.
 * A post that was unpublished by staff is a draft again and is editable.
 */
export const forbidPipelineOnPublished: CollectionBeforeChangeHook = async ({
  collection,
  data,
  operation,
  originalDoc,
  req,
}) => {
  if (!isPipeline(req.user) || operation !== 'update') return data
  const id = (originalDoc as { id?: number | string } | undefined)?.id
  if (id === undefined || id === null) throw new Forbidden(req.t)
  const live = await req.payload.db.findOne<{ id: number | string; _status?: string | null }>({
    collection: collection.slug as CollectionSlug,
    where: { id: { equals: id } },
    req,
  })
  if (!live || live._status === 'published') throw new Forbidden(req.t)
  return data
}

/**
 * `posts` afterChange backstop (FIRST in the list): if any path ever let a
 * pipeline write end up published, throw inside the operation's transaction
 * so the write rolls back. No known 3.91.0 path reaches it.
 */
export const pipelineNeverPublishes: CollectionAfterChangeHook = ({ doc, req }) => {
  if (isPipeline(req.user) && doc?._status === 'published') throw new Forbidden(req.t)
  return doc
}
