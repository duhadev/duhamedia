import type { Access, CollectionConfig, FieldAccess, Where } from 'payload'

import { isAdmin, isMarketing, isPipeline, isStaff } from './roles'

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
 * Delete for drafts-enabled content (SCHEMA §4.3 + Delta log 2026-10-18):
 * admin deletes any doc; marketing only docs whose LIVE `_status` is not
 * `published` (never published, or unpublished); pipeline and public never.
 * Used by `case-studies`, `posts`, `lead-magnets`, `pages`.
 *
 * Verified payload@3.91.0: deleteByID / delete apply the returned Where to the
 * MAIN collection row (collections/operations/deleteByID.js `db.findOne` on the
 * combined query → Forbidden), not to the latest version, so a published doc
 * with a newer staff draft on top still counts as published. `not_equals`
 * matches NULL too (@payloadcms/drizzle@3.91.0 queries/parseParams.js:
 * `or(isNull(col), ne(col, value))`), so rows predating drafts are deletable.
 */
export const adminOrMarketingUnpublished: Access = ({ req }) => {
  if (isAdmin(req.user)) return true
  if (isMarketing(req.user)) return { _status: { not_equals: 'published' } }
  return false
}

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
/* These helpers must ONLY be attached to `posts` (C8);                        */
/* every other collection uses the staff/    */
/* published helpers above, which give the pipeline nothing beyond public read. */
/*                                                                            */
/* The `_status = draft` constraint alone is NOT enough on update (verified */
/* C8, payload@3.91.0): updates look the doc up via its LATEST VERSION       */
/* (versions/getLatestCollectionVersion.js), so a published post with a      */
/* newer staff draft on top matches it. `forbidPipelineOnPublished`          */
/* (./pipeline.ts) therefore re-reads the main row and rejects any pipeline  */
/* write to a live post; `forbidPipelinePublish` blocks publishing itself.   */
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

/**
 * Access preset for the drafts-enabled content collections that only staff
 * write (SCHEMA.md §4.3 row "pages, testimonials, clients, team-members, faqs,
 * lead-magnets"). Public and the pipeline user get published docs only; the
 * pipeline gets NO write anywhere here. `readVersions` (collections/config/
 * types.d.ts:462, payload@3.91.0) is staff-only so drafts never leak through
 * /api/<slug>/versions.
 */
export const staffContentAccess = {
  read: publishedOrStaff,
  readVersions: staffOnly,
  create: staffOnly,
  update: staffOnly,
  delete: staffOnly,
} satisfies NonNullable<CollectionConfig['access']>

/**
 * `staffContentAccess` with draft-only delete for marketing (Delta log
 * 2026-10-18): `pages` and `lead-magnets`. `faqs`, `team-members`, `clients`,
 * `testimonials` keep staff delete (SCHEMA §4.3).
 */
export const staffContentAccessDraftDelete = {
  ...staffContentAccess,
  delete: adminOrMarketingUnpublished,
} satisfies NonNullable<CollectionConfig['access']>
