import type {
  FieldHook,
  GlobalConfig,
  TextareaFieldValidation,
  TextFieldSingleValidation,
  UploadFieldSingleValidation,
} from 'payload'
import { text, textarea, upload } from 'payload/shared'

import { staffOnly } from '../access'
import { revalidateGlobalHook } from '../hooks/revalidateTag'

/**
 * `seo-defaults` global (SCHEMA.md §7.4, §4.3, §10 — Gate S approved 2026-10-17).
 *
 * Site-wide search/social fallbacks, consumed later by P3 (`@payloadcms/plugin-seo`,
 * not installed in this unit) and the JSON-LD helpers:
 * - `titleTemplate` ("%s — Duha Media"): plugin-seo `generateTitle` replaces `%s` with
 *   the document title. Must contain exactly one `%s` (validated).
 * - `defaultDescription` (≤155 chars, CLAUDE.md seo-auditor page scope): used when a
 *   document has no meta description.
 * - `defaultOgImage`: fallback Open Graph / social share image; consumers read its `og`
 *   size (media `imageSizes.og` 1200×630, src/collections/Media.ts). The validator
 *   rejects images too small for Payload to produce that size.
 * - `organization` { name, logo, foundingDate }: Organization JSON-LD. `sameAs` comes from
 *   `site-settings.socials`, `url` from server-side env `SITE_URL` — not stored here.
 * - `localBusiness` { type, areaServed, openingHours }: LocalBusiness JSON-LD; the
 *   address/geo comes from `site-settings.location` (Lombard, IL).
 *
 * Facts only (CLAUDE.md content rule 3): the only defaults are the brand name
 * "Duha Media" (`organization.name`), the SCHEMA title template, and SCHEMA's
 * `areaServed` "Chicago metropolitan area". `foundingDate`, `openingHours` and
 * `localBusiness.type` start empty (no default type is implied by SCHEMA — flagged).
 *
 * Requiredness: `titleTemplate`, `defaultDescription`, `defaultOgImage` are required per
 * SCHEMA (✓), so the first save needs an uploaded image (the seed uploads a placeholder
 * OG image). In payload@3.91.0 a global has no stored row until its first save
 * (globals/operations/findOne.js), so every consumer must treat all fields as optional.
 *
 * Verified against installed payload@3.91.0:
 * - `GlobalConfig.access` = { read, readVersions, update }: globals/config/types.d.ts:210.
 * - textarea `maxLength` + built-in `textarea` validator: fields/config/types.d.ts:471-486,
 *   fields/validations.js:137 (a custom `validate` REPLACES the built-in one,
 *   fields/hooks/beforeChange/promise.js:98-123, so each custom validator calls the
 *   `payload/shared` built-in first — repo convention).
 * - upload `maxDepth`: fields/config/types.d.ts:738; built-in async `upload` validator:
 *   fields/validations.js:513; `Validate` may return a Promise: fields/config/types.d.ts:282.
 * - image sizes smaller than the target in BOTH dimensions are stored as null
 *   (`withoutEnlargement` default): uploads/types.d.ts:100-109.
 *
 * No drafts (SCHEMA §7): a save is live immediately.
 * Access (SCHEMA §4.3 "globals (all 4)"): read public; update + readVersions staff only.
 * The pipeline user is logged in but not staff → denied.
 * Revalidation (SCHEMA §10): tag `seo-defaults` + the whole frontend layout, skipped with
 * `context.disableRevalidate` (seed) — src/hooks/revalidateTag.ts `revalidateGlobalHook`.
 */

/** The placeholder plugin-seo's `generateTitle` replaces with the document title. */
export const TITLE_PLACEHOLDER = '%s'
export const DEFAULT_DESCRIPTION_MAX = 155
export const LOCAL_BUSINESS_TYPES = ['ProfessionalService', 'MarketingAgency'] as const
const BUSINESS_TYPE_LABELS: Record<(typeof LOCAL_BUSINESS_TYPES)[number], string> = {
  ProfessionalService: 'Professional service',
  MarketingAgency: 'Marketing agency',
}

const trim: FieldHook = ({ value }) => (typeof value === 'string' ? value.trim() : value)

const isBlank = (value: unknown) => typeof value !== 'string' || value.trim() === ''

const validateTitleTemplate: TextFieldSingleValidation = (value, options) => {
  if (isBlank(value)) return 'Required. Use %s where the page title goes, e.g. "%s — Duha Media".'
  const base = text(value, options)
  if (base !== true) return base
  const uses = (value as string).split(TITLE_PLACEHOLDER).length - 1
  if (uses !== 1) {
    return uses === 0
      ? 'Add %s where the page title goes, e.g. "%s — Duha Media".'
      : 'Use %s only once (it is replaced by the page title).'
  }
  return true
}

const validateDescription: TextareaFieldValidation = (value, options) => {
  if (isBlank(value)) return 'Required: one or two sentences describing Duha Media.'
  return textarea(value, options)
}

/** Required (built-in check), then the image must be big enough for the `og` size. */
const validateOgImage: UploadFieldSingleValidation = async (value, options) => {
  const base = await upload(value, options)
  if (base !== true) return base
  const id =
    typeof value === 'number' || typeof value === 'string'
      ? value
      : ((value as { id?: number | string } | null | undefined)?.id ?? null)
  if (id === null || id === '') return true
  try {
    const media = await options.req.payload.findByID({
      collection: 'media',
      id,
      depth: 0,
      overrideAccess: true,
      req: options.req,
    })
    if (!media?.sizes?.og?.url) {
      return 'This image is too small for social previews. Upload one at least 1200 × 630 pixels.'
    }
  } catch {
    return true // a missing media doc is reported by the built-in check above
  }
  return true
}

/* YYYY, YYYY-MM or YYYY-MM-DD (schema.org `foundingDate` is an ISO 8601 date). */
const FOUNDING_DATE_RE = /^\d{4}(-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?)?$/
const validateFoundingDate: TextFieldSingleValidation = (value, options) => {
  const base = text(value, options)
  if (base !== true) return base
  if (isBlank(value)) return true
  return FOUNDING_DATE_RE.test((value as string).trim())
    ? true
    : 'Use the year (2021), year and month (2021-04) or full date (2021-04-15).'
}

/* schema.org `openingHours` text, e.g. "Mo-Fr 09:00-17:00"; several entries separated by ";". */
const DAY = '(Mo|Tu|We|Th|Fr|Sa|Su)'
const DAYS = `${DAY}(-${DAY})?(,${DAY}(-${DAY})?)*`
const TIME = '([01]\\d|2[0-3]):[0-5]\\d'
const HOURS_ENTRY_RE = new RegExp(`^${DAYS} ${TIME}-${TIME}$`)
const validateOpeningHours: TextFieldSingleValidation = (value, options) => {
  const base = text(value, options)
  if (base !== true) return base
  if (isBlank(value)) return true
  const entries = (value as string).split(';').map((e) => e.trim())
  return entries.every((e) => HOURS_ENTRY_RE.test(e))
    ? true
    : 'Use the format "Mo-Fr 09:00-17:00". Separate several entries with ";", e.g. "Mo-Fr 09:00-17:00; Sa 10:00-14:00".'
}

export const SeoDefaults: GlobalConfig = {
  slug: 'seo-defaults',
  label: 'SEO defaults',
  admin: {
    description:
      'Fallbacks for how the site looks in Google and in social shares (LinkedIn, Facebook, X, iMessage). Each page can override these in its own SEO tab. Changes go live as soon as you save.',
  },
  access: {
    read: () => true,
    readVersions: staffOnly,
    update: staffOnly,
  },
  hooks: {
    afterChange: [revalidateGlobalHook('seo-defaults')],
  },
  fields: [
    {
      name: 'titleTemplate',
      type: 'text',
      label: 'Title template',
      required: true,
      defaultValue: '%s — Duha Media',
      validate: validateTitleTemplate,
      hooks: { beforeValidate: [trim] },
      admin: {
        description:
          'How page titles appear in the browser tab and Google results. %s is replaced by the page title, e.g. "%s — Duha Media" becomes "About — Duha Media". Use %s exactly once.',
      },
    },
    {
      name: 'defaultDescription',
      type: 'textarea',
      label: 'Default description',
      required: true,
      maxLength: DEFAULT_DESCRIPTION_MAX,
      validate: validateDescription,
      hooks: { beforeValidate: [trim] },
      admin: {
        rows: 3,
        description:
          'The grey text under the title in Google results and in social share cards, used when a page has no description of its own. Up to 155 characters so Google does not cut it off.',
      },
    },
    {
      name: 'defaultOgImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Default social share image',
      required: true,
      maxDepth: 1,
      validate: validateOgImage,
      admin: {
        description:
          'The picture shown when a link to the site is shared on LinkedIn, Facebook, X or in a message, for any page without its own share image. Use a landscape image at least 1200 × 630 pixels; it is cropped to that shape around its focal point.',
      },
    },
    {
      name: 'organization',
      type: 'group',
      label: 'Company (for Google)',
      admin: {
        description:
          'Facts Google reads about the company (structured data, not shown on the page). Social profiles come from Site settings. Only enter real facts.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Company name',
              defaultValue: 'Duha Media',
              maxLength: 80,
              hooks: { beforeValidate: [trim] },
              admin: { width: '50%', description: 'The brand name, e.g. "Duha Media".' },
            },
            {
              name: 'foundingDate',
              type: 'text',
              label: 'Founded',
              validate: validateFoundingDate,
              hooks: { beforeValidate: [trim] },
              admin: {
                width: '50%',
                description: 'Optional. The real founding year (e.g. 2021) or date (2021-04-15). Leave empty if unsure.',
              },
            },
          ],
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: 'Logo',
          maxDepth: 1,
          admin: {
            description:
              'Optional. The logo Google may show beside the company in search results. Use a square or near-square image, at least 112 × 112 pixels, on a plain background.',
          },
        },
      ],
    },
    {
      name: 'localBusiness',
      type: 'group',
      label: 'Local business (for Google)',
      admin: {
        description:
          'How Google understands the business locally (structured data, not shown on the page). The address comes from Site settings → Location.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'type',
              type: 'select',
              label: 'Business type',
              options: LOCAL_BUSINESS_TYPES.map((value) => ({ label: BUSINESS_TYPE_LABELS[value], value })),
              admin: {
                width: '50%',
                description: 'The kind of business Google is told this is. "Professional service" is recommended.',
              },
            },
            {
              name: 'areaServed',
              type: 'text',
              label: 'Area served',
              defaultValue: 'Chicago metropolitan area',
              maxLength: 120,
              hooks: { beforeValidate: [trim] },
              admin: { width: '50%', description: 'Where clients are served, e.g. "Chicago metropolitan area".' },
            },
          ],
        },
        {
          name: 'openingHours',
          type: 'text',
          label: 'Opening hours',
          validate: validateOpeningHours,
          hooks: { beforeValidate: [trim] },
          admin: {
            description:
              'Optional. Only real hours, in the format "Mo-Fr 09:00-17:00" (several entries separated by ";"). Leave empty if there are no set hours.',
          },
        },
      ],
    },
  ],
}
