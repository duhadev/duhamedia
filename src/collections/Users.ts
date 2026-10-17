import type { CollectionConfig } from 'payload'

import { ROLES, adminOnly, adminOnlyField, adminOrSelf, authenticated } from '../access/roles'

/**
 * BOOT SCAFFOLDING (Phase 1). Minimal on purpose; the full `users` schema
 * (incl. the pipeline API user) is designed in SCHEMA.md and approved at Gate S.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'roles', 'updatedAt'],
  },
  auth: {
    // Login lockout (CLAUDE.md, Security #2). Verified against
    // https://payloadcms.com/docs/v3/authentication/overview
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000, // ms
  },
  access: {
    admin: authenticated,
    create: adminOnly,
    read: adminOrSelf,
    update: adminOrSelf,
    delete: adminOnly,
    unlock: adminOnly,
  },
  hooks: {
    beforeChange: [
      // The very first user (created via /admin/create-first-user, which runs
      // with overrideAccess) is always an admin, whatever the form sent.
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data
        const { totalDocs } = await req.payload.count({ collection: 'users', req })
        if (totalDocs === 0) data.roles = ['admin']
        return data
      },
    ],
  },
  fields: [
    // email + password are added by `auth`
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['marketing'],
      saveToJWT: true,
      options: ROLES.map((value) => ({ label: value.charAt(0).toUpperCase() + value.slice(1), value })),
      access: {
        create: adminOnlyField,
        update: adminOnlyField,
      },
      admin: { position: 'sidebar' },
    },
  ],
}
