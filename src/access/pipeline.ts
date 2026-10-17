import { Forbidden, type CollectionBeforeChangeHook } from 'payload'

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
