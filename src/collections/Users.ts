import {
  AuthenticationError,
  ValidationError,
  type Access,
  type CollectionBeforeChangeHook,
  type CollectionBeforeLoginHook,
  type CollectionConfig,
  type FieldAccess,
} from 'payload'

import { ROLES, ROLE_LABELS, adminOnly, adminOnlyField, isAdmin, isMarketing, isStaff, roleOf } from '../access'

/**
 * `users` (SCHEMA.md §6.11, §4, §10 — Gate S approved 2026-10-17).
 *
 * Roles: `admin` (the human), `marketing`, `pipeline` (the external content
 * pipeline; API key only, can only create/update drafts in `posts`, never logs
 * in interactively, never opens the admin panel).
 *
 * Verified against payload@3.91.0 (installed `payload/dist`):
 * - auth options `maxLoginAttempts`, `lockTime` (ms), `useAPIKey`,
 *   `tokenExpiration` (s), `useSessions` (default true): auth/types.d.ts
 * - `access.admin` / `access.unlock`: collections/config/types.d.ts:455
 * - `hooks.beforeLogin({ collection, context, req, user })`:
 *   collections/config/types.d.ts:164; runs in auth/operations/login.js AND
 *   resetPassword.js (both issue a JWT), after the password check
 * - API-key fields: auth/baseFields/apiKey/index.js. A custom `apiKey` field's
 *   `access.create/update` is propagated to `enableAPIKey`/`apiKeyIndex` and
 *   its `update` becomes `hasAPIKey` read (getAPIKeyFields); the default would
 *   be "anyone with admin-panel access", i.e. marketing too. Docs:
 *   https://payloadcms.com/docs/authentication/api-keys (3.x branch).
 */

/** Admin: every user. Marketing: own document only. Pipeline: none. */
const adminAllMarketingSelf: Access = ({ req }) => {
  if (isAdmin(req.user)) return true
  if (isMarketing(req.user) && req.user) return { id: { equals: req.user.id } }
  return false
}

/**
 * API-key field access (create/update). Admin only, AND only when the user
 * being edited is (or is being made) a `pipeline` user.
 *
 * Why field access and not `admin.condition`: on 3.91.0 the key widget is not
 * rendered by the field renderer (all API-key base fields have
 * `admin.components.Field: false`). It is rendered by the Auth edit view
 * (@payloadcms/ui dist/views/Edit/Auth/index.js), gated ONLY by
 * `useAPIKey && docPermissions.fields.apiKey[operation]`. Doc permissions are
 * computed with the stored doc as `data`/`doc`
 * (payload dist/utilities/getEntityPermissions/populateFieldPermissions.js) and
 * re-fetched after every save (ui useGetDocPermissions). So:
 * - create form: no doc yet → hidden (save as Pipeline first, then generate);
 * - edit, stored role admin/marketing → hidden; stored role pipeline → shown.
 * Payload propagates this to `enableAPIKey`/`apiKeyIndex` and to `hasAPIKey`
 * read (getAPIKeyFields). Server side, field access runs in beforeValidate and
 * strips a disallowed key from the request (fields/hooks/beforeValidate/promise.js);
 * `apiKeyOnlyForPipeline` below remains the backstop (e.g. overrideAccess paths)
 * and still revokes on demotion, since collection beforeChange runs later.
 */
const apiKeyFieldAccess: FieldAccess = ({ data, doc, req }) =>
  isAdmin(req.user) && roleOf({ role: data?.role ?? doc?.role }) === 'pipeline'

/**
 * The very first user (created via /admin/create-first-user, which runs with
 * overrideAccess, so field access does not apply) is always an admin.
 */
const firstUserIsAdmin: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  if (operation !== 'create') return data
  const { totalDocs } = await req.payload.count({ collection: 'users', overrideAccess: true, req })
  // The first-user form also renders the API-key fields; an admin never holds a
  // key, so drop them here instead of letting apiKeyOnlyForPipeline reject the signup.
  if (totalDocs === 0) return { ...data, role: 'admin', enableAPIKey: false, apiKey: null, apiKeyIndex: null }
  return data
}

/**
 * An API key may exist ONLY on a `pipeline` user (SCHEMA.md §6.11).
 * - Enabling/setting a key on a non-pipeline user is rejected.
 * - Changing a user's role away from `pipeline` revokes its key in the same save.
 * (apiKeyFieldAccess already strips key fields unless admin + pipeline; this
 * is the backstop for overrideAccess paths and performs the demotion revoke.)
 */
const apiKeyOnlyForPipeline: CollectionBeforeChangeHook = ({ data, originalDoc, req }) => {
  // On update, `data` here is the original doc merged with the incoming
  // changes (observed on 3.91.0), so it also carries the stored key state.
  const nextRole = roleOf({ role: data?.role ?? originalDoc?.role })
  if (nextRole === 'pipeline') return data

  // Demotion away from pipeline: revoke the key in the same save. `apiKeyIndex`
  // (what API-key auth matches on) must be nulled explicitly; field
  // beforeValidate has already run by now.
  if (originalDoc?.role === 'pipeline') {
    return { ...data, enableAPIKey: false, apiKey: null, apiKeyIndex: null }
  }

  const hasKey =
    data?.enableAPIKey === true ||
    (typeof data?.apiKey === 'string' && data.apiKey.length > 0) ||
    (typeof data?.apiKeyIndex === 'string' && data.apiKeyIndex.length > 0)
  if (hasKey) {
    throw new ValidationError({
      collection: 'users',
      errors: [{ message: 'Only Pipeline users can have an API key.', path: 'role' }],
      req,
    })
  }
  return data
}

/** The pipeline authenticates only with `Authorization: users API-Key <key>`. */
const blockPipelineLogin: CollectionBeforeLoginHook = ({ req, user }) => {
  if (roleOf(user) === 'pipeline') {
    // Generic "email or password is incorrect": do not reveal the account type.
    throw new AuthenticationError(req.t)
  }
  return user
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'updatedAt'],
  },
  auth: {
    // Login lockout (CLAUDE.md Security #2): 5 failures → locked 10 min.
    maxLoginAttempts: 5,
    lockTime: 600000,
    // Pipeline user only (enforced by apiKeyOnlyForPipeline). `reveal` stays
    // false (default): the key is shown once at generation, never again.
    useAPIKey: true,
    tokenExpiration: 7200, // seconds (2 h)
    // useSessions: default true
  },
  access: {
    // Admin panel: humans only. The pipeline key cannot open /admin.
    admin: ({ req }) => isStaff(req.user),
    create: adminOnly,
    read: adminAllMarketingSelf,
    update: adminAllMarketingSelf,
    delete: adminOnly,
    unlock: adminOnly,
  },
  hooks: {
    beforeChange: [firstUserIsAdmin, apiKeyOnlyForPipeline],
    beforeLogin: [blockPipelineLogin],
  },
  fields: [
    // email + password (+ lockout, sessions, API-key fields) are added by `auth`.
    {
      name: 'name',
      type: 'text',
      admin: { description: 'Display name in the admin.' },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'marketing',
      saveToJWT: true,
      options: ROLES.map((value) => ({ label: ROLE_LABELS[value], value })),
      access: {
        create: adminOnlyField,
        update: adminOnlyField,
      },
      admin: {
        position: 'sidebar',
        description:
          'Admin: everything. Marketing: content, not users or form definitions. Pipeline: API key only, drafts in Posts only, cannot log in. To issue a key, save the user as Pipeline first.',
      },
    },
    // Override of the auth-generated API-key field: only admins, and only on a
    // pipeline user, may create, change or see the presence of a key
    // (propagated to enableAPIKey, apiKeyIndex and hasAPIKey by Payload).
    // Everything else is inherited. See apiKeyFieldAccess.
    {
      name: 'apiKey',
      type: 'text',
      access: {
        create: apiKeyFieldAccess,
        update: apiKeyFieldAccess,
      },
    },
  ],
}
