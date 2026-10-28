import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import type {
  Field,
  FieldHook,
  Plugin,
  RelationshipFieldSingleValidation,
  SelectField,
  TextFieldSingleValidation,
} from 'payload'
import { relationship, text } from 'payload/shared'

import { staffOnly } from '../access'
import { LINK_TARGETS } from '../fields'
import { revalidateLiveCollectionHooks } from '../hooks/revalidateTag'
import { docPath, type RoutableDoc } from '../lib/docPath'
import { ownOrigins } from '../lib/siteUrl'

/**
 * P2: `@payloadcms/plugin-redirects@3.91.0` with the Gate S overrides
 * (SCHEMA.md §0 row "plugin-redirects options", §4.1 marketing row, §4.3
 * redirects row, §6.14, §10 revalidation map). No cutover redirects are
 * seeded (DECISIONS §C / Gate 0: kill and overwrite, no redirect map).
 *
 * Verified against the INSTALLED plugin (node_modules/@payloadcms/
 * plugin-redirects/dist, 3.91.0):
 * - types.d.ts:6-13: options are `collections`, `overrides` (any collection
 *   config key except `fields`, plus `fields({ defaultFields })`),
 *   `redirectTypeFieldOverride`, `redirectTypes`.
 * - index.js:24-87: default fields `from` (text, required, unique, index),
 *   `to` group { `type` radio reference/custom (default reference),
 *   `reference` relationship → `collections` (required, shown when
 *   reference; NO maxDepth), `url` text (required, shown when custom) },
 *   and the `type` select only when `redirectTypes` is set (required, NO
 *   default; options = redirectTypes.js:8-29 filtered by `redirectTypes`,
 *   then `redirectTypeFieldOverride` is spread over it, index.js:15-23).
 * - `to.reference` is polymorphic (relationTo = array), so its value is
 *   `{ relationTo, value }`.
 * - index.js:88-106: `overrides` is spread FIRST (so `hooks` pass through
 *   untouched; the plugin adds none), then `access` = `{ read: () => true,
 *   ...overrides.access }` and `admin` = `{ defaultColumns, ...overrides.admin }`.
 *   create/update/delete are NOT set by the plugin → Payload's default "any
 *   logged-in user" (incl. the pipeline). All four are set below.
 * - The plugin adds no admin components (nothing for the import map).
 *
 * Field-level behaviour (payload@3.91.0):
 * - required/validate on `reference` / `url` are skipped while the field is
 *   hidden by `admin.condition` (fields/hooks/beforeChange/promise.js:37-44).
 * - a custom `validate` REPLACES the built-in one (promise.js:98), so every
 *   validator below calls `text()` / `relationship()` first.
 * - `relationship()` skips DB checks on `event === 'onChange'`
 *   (fields/validations.js:619); the self-loop lookup does the same.
 * - redirects has no drafts, so validation runs on every save.
 */

/** Hosts that mean "this site" (a pasted full URL on them is reduced to its path). */
const ownHosts = (): Set<string> => {
  const hosts = new Set(['duhamedia.com', 'www.duhamedia.com'])
  // SITE_URL (+ Vercel Preview hosts); an invalid SITE_URL is reported elsewhere.
  for (const origin of ownOrigins()) hosts.add(new URL(origin).host)
  return hosts
}

/**
 * `from` normaliser (field `beforeValidate`): trims, turns a pasted full URL
 * on this site into its path, and drops trailing slashes, so `/old/` and
 * `/old` are the same redirect (and collide on the unique index).
 */
const normaliseFrom: FieldHook = ({ value }) => {
  if (typeof value !== 'string') return value
  let path = value.trim()
  if (/^https?:\/\//i.test(path)) {
    try {
      const url = new URL(path)
      if (ownHosts().has(url.host.toLowerCase()) && !url.search && !url.hash) path = url.pathname
    } catch {
      // Left as typed; validation explains the error.
    }
  }
  if (path.length > 1) path = path.replace(/\/+$/, '')
  return path === '' ? value.trim() : path
}

/** Why a (normalised) `from` path cannot be used, or `null` when it is fine. */
const fromPathError = (path: string): string | null => {
  if (!/^\/(?!\/)/.test(path)) {
    return 'Enter the old address on this site, starting with "/", e.g. /old-services.'
  }
  if (/\s/.test(path)) return 'The address cannot contain spaces.'
  if (/[?#]/.test(path)) {
    return 'Leave out anything after "?" or "#"; enter only the path, e.g. /old-services.'
  }
  if (path === '/') return 'The homepage cannot be redirected.'
  const segments = path.slice(1).split('/')
  if (segments.some((s) => s === '')) return 'The address cannot contain "//".'
  if (segments.some((s) => s.startsWith('_'))) {
    return 'A part of the address cannot start with "_" (reserved for the site itself).'
  }
  if (segments[0] === 'admin' || segments[0] === 'api') {
    return `"/${segments[0]}" is reserved for the admin and API and cannot be redirected.`
  }
  return null
}

const validateFrom: TextFieldSingleValidation = (value, options) => {
  const base = text(value, options)
  if (base !== true) return base
  if (typeof value !== 'string' || value === '') return true
  return fromPathError(value) ?? true
}

/** Compare a target to the (normalised) `from`, ignoring trailing slashes. */
const samePath = (a: string, b: string): boolean =>
  (a.length > 1 ? a.replace(/\/+$/, '') : a) === (b.length > 1 ? b.replace(/\/+$/, '') : b)

const fromOf = (data: unknown): string | null => {
  const from = (data as { from?: unknown } | undefined)?.from
  return typeof from === 'string' && from.trim() !== '' ? from.trim() : null
}

/** `to.url`: an https:// address or a path on this site; never back to `from`. */
const validateUrl: TextFieldSingleValidation = (value, options) => {
  const base = text(value, options)
  if (base !== true) return base
  if (typeof value !== 'string' || value.trim() === '') return true
  const target = value.trim()
  const from = fromOf(options.data)
  if (/^\/(?!\/)/.test(target)) {
    if (/\s/.test(target)) return 'The address cannot contain spaces.'
    if (from && samePath(target.split(/[?#]/)[0], from)) return 'A redirect cannot point back to its own old address.'
    return true
  }
  let url: URL
  try {
    url = new URL(target)
  } catch {
    return 'Enter a full https:// address, or a path on this site starting with "/".'
  }
  if (url.protocol !== 'https:') return 'Enter a full https:// address, or a path on this site starting with "/".'
  if (from && ownHosts().has(url.host.toLowerCase()) && samePath(url.pathname, from)) {
    return 'A redirect cannot point back to its own old address.'
  }
  return true
}

/** `to.reference`: built-in checks, then the target's path must differ from `from`. */
const validateReference: RelationshipFieldSingleValidation = async (value, options) => {
  // `relationship()` is async in payload@3.91.0 (fields/validations.js:569).
  const base = await relationship(value, options)
  if (base !== true) return base
  if (options.event === 'onChange') return true
  const ref = value as { relationTo?: unknown; value?: unknown } | null | undefined
  if (!ref || typeof ref !== 'object' || typeof ref.relationTo !== 'string') return true
  const collection = ref.relationTo as (typeof LINK_TARGETS)[number]
  if (!(LINK_TARGETS as readonly string[]).includes(collection)) return true
  let doc: RoutableDoc | null = null
  if (ref.value && typeof ref.value === 'object') {
    doc = ref.value as RoutableDoc
  } else if (typeof ref.value === 'number' || typeof ref.value === 'string') {
    doc = (await options.req.payload
      .findByID({
        collection,
        id: ref.value,
        depth: 0,
        disableErrors: true,
        overrideAccess: true,
        req: options.req,
      })
      .catch(() => null)) as RoutableDoc | null
  }
  if (!doc) return true // The built-in check above already rejects unknown IDs.
  const path = docPath(collection, doc)
  if (path === null) {
    return 'This document has no public address (for example the 404 page). Choose another one.'
  }
  const from = fromOf(options.data)
  if (from && samePath(path, from)) return 'A redirect cannot point back to its own old address.'
  return true
}

/** Type select (SCHEMA §6.14: 301 + 302 only), 301 by default. */
const typeFieldOverride: Partial<SelectField> = {
  label: 'Redirect type',
  defaultValue: '301',
  options: [
    { label: '301 — Permanent (the old address is gone for good)', value: '301' },
    { label: '302 — Temporary (the old address will come back)', value: '302' },
  ],
  admin: {
    description:
      'Use 301 (permanent) unless the old address will be used again. Search engines move rankings to the new address only with 301.',
  },
}

/** Applies the overrides to the plugin's own field defs (index.js:24-87), by name. */
const shapeFields = ({ defaultFields }: { defaultFields: Field[] }): Field[] =>
  defaultFields.map((field) => {
    if (!('name' in field)) return field
    if (field.name === 'from' && field.type === 'text') {
      return {
        ...field,
        label: 'Old address',
        validate: validateFrom,
        hooks: { ...field.hooks, beforeValidate: [...(field.hooks?.beforeValidate ?? []), normaliseFrom] },
        admin: {
          ...field.admin,
          description:
            'The address visitors arrive at, starting with "/", e.g. /old-services. Each old address can be redirected only once.',
        },
      } as Field
    }
    if (field.name === 'to' && field.type === 'group') {
      return {
        ...field,
        fields: field.fields.map((sub) => {
          if (!('name' in sub)) return sub
          if (sub.name === 'type' && sub.type === 'radio') {
            return {
              ...sub,
              label: 'Send visitors to',
              options: [
                { label: 'A page on this site', value: 'reference' },
                { label: 'Another address', value: 'custom' },
              ],
              admin: {
                ...sub.admin,
                description:
                  'Prefer "A page on this site": the redirect keeps working if that page\'s address changes later.',
              },
            } as Field
          }
          if (sub.name === 'reference' && sub.type === 'relationship') {
            return {
              ...sub,
              label: 'Page',
              maxDepth: 1,
              validate: validateReference,
              admin: {
                ...sub.admin,
                description:
                  'A page, case study, post or free download. Visitors are only redirected once it is published.',
              },
            } as Field
          }
          if (sub.name === 'url' && sub.type === 'text') {
            return {
              ...sub,
              label: 'Address',
              validate: validateUrl,
              admin: {
                ...sub.admin,
                description: 'A full https:// address, or a path on this site starting with "/".',
              },
            } as Field
          }
          return sub
        }),
      } as Field
    }
    return field
  })

/** SCHEMA §10: `redirects` → redirect cache tag. No drafts, so every save is live. */
const revalidate = revalidateLiveCollectionHooks('redirects')

export const redirects: Plugin = redirectsPlugin({
  collections: [...LINK_TARGETS],
  redirectTypes: ['301', '302'],
  redirectTypeFieldOverride: typeFieldOverride,
  overrides: {
    labels: { singular: 'Redirect', plural: 'Redirects' },
    // §4.3: read public (redirect behaviour is public anyway); writes staff
    // (§4.1: marketing manages redirects). Pipeline and public: no writes.
    access: {
      read: () => true,
      create: staffOnly,
      update: staffOnly,
      delete: staffOnly,
    },
    admin: {
      useAsTitle: 'from',
      defaultColumns: ['from', 'to.type', 'type', 'updatedAt'],
      description:
        'Send visitors from an old address to a new one. Changes apply straight away; there is no draft step.',
    },
    hooks: {
      afterChange: [revalidate.afterChange],
      afterDelete: [revalidate.afterDelete],
    },
    fields: shapeFields,
  },
})
