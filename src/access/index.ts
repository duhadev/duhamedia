import type { Access, FieldAccess, Where } from 'payload'

import { isAdmin, isPipeline, isStaff } from './roles'

/**
 * Shared access helpers (SCHEMA.md §4.2). Every collection and global sets
 * read/create/update/delete explicitly from these: Payload's default ("any
 * logged-in user") would include the pipeline API user, which IS logged in.
 *
 * Verified against payload@3.91.0: `Access` / `AccessArgs` in
 * `payload/dist/config/types.d.ts`, `FieldAccess` (boolean only) in
 * `payload/dist/fields/config/types.d.ts`, `RequestContext` in
 * `payload/dist/index.d.ts`.
 */
export { ROLES, ROLE_LABELS, isAdmin, isMarketing, isPipeline, isStaff, roleOf } from './roles'
export type { Role } from './roles'

const published: Where = { _status: { equals: 'published' } }
const draftOnly: Where = { _status: { equals: 'draft' } }

/** Admin only. */
export const adminOnly: Access = ({ req }) => isAdmin(req.user)

/** Admin or marketing. */
export const staffOnly: Access = ({ req }) => isStaff(req.user)

/** Field-level: admin only (field access is boolean-only). */
export const adminOnlyField: FieldAccess = ({ req }) => isAdmin(req.user)

/** Field-level: admin or marketing. */
export const staffOnlyField: FieldAccess = ({ req }) => isStaff(req.user)

/**
 * Read for drafts-enabled content collections: staff see everything, everyone
 * else (public AND the pipeline user) sees published docs only.
 */
export const publishedOrStaff: Access = ({ req }) => (isStaff(req.user) ? true : published)

/**
 * Public create for `form-submissions`, gated by Turnstile. The flag is set only
 * by the server-side form handler after Cloudflare siteverify passes. REST
 * requests start with `context: {}` (payload/dist/utilities/createPayloadRequest.js)
 * so a public caller cannot forge it. Admin may create directly (support/re-entry).
 */
export const turnstileVerifiedOrAdmin: Access = ({ req }) =>
  req.context?.turnstileVerified === true || isAdmin(req.user)

/* -------------------------------------------------------------------------- */
/* Pipeline API user: drafts in `posts` only (CLAUDE.md, SCHEMA.md §4.1/§4.3). */
/* `posts` does not exist yet (unit C8). These helpers are written for it and   */
/* must ONLY be attached to `posts`; every other collection uses the staff/    */
/* published helpers above, which give the pipeline nothing beyond public read. */
/*                                                                            */
/* Why a `_status = draft` constraint is enough on update: with drafts on,    */
/* saving a draft over a published doc leaves the main row `_status:          */
/* published` (payload/dist/collections/operations/utilities/update.js,       */
/* `isSavingDraft` skips `db.updateOne`), so the pipeline can only ever match */
/* never-published docs. Publishing itself is blocked by                      */
/* `forbidPipelinePublish` (./pipeline.ts), attached as a posts beforeChange. */
/* -------------------------------------------------------------------------- */

/** posts.read: staff → all · pipeline → drafts · public → published. */
export const postsRead: Access = ({ req }) => {
  if (isStaff(req.user)) return true
  if (isPipeline(req.user)) return draftOnly
  return published
}

/** posts.create: staff or pipeline (pipeline output is forced to draft by hook). */
export const staffOrPipeline: Access = ({ req }) => isStaff(req.user) || isPipeline(req.user)

/** posts.update: staff → all · pipeline → drafts only · public → none. */
export const staffOrPipelineDrafts: Access = ({ req }) => {
  if (isStaff(req.user)) return true
  if (isPipeline(req.user)) return draftOnly
  return false
}
