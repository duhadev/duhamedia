import {
  slugField,
  type ArrayFieldValidation,
  type CollectionConfig,
  type TextFieldSingleValidation,
  type UploadFieldSingleValidation,
} from 'payload'
import { text, upload } from 'payload/shared'

import { staffContentAccessDraftDelete, staffOnlyField } from '../access'
import { accentPhraseAdminField, contentVersions, validateAccentPhrase } from '../fields'
import { blockDeleteIfReferenced, leadMagnetSubmissionsSentence } from '../hooks/blockDeleteIfReferenced'
import { setPublishedAtOnPublish } from '../hooks/publishedAt'
import { revalidateTagHooks } from '../hooks/revalidateTag'
import { uniqueSlugHooks } from '../hooks/uniqueSlug'
import { docPath } from '../lib/docPath'
import { assetFileError, assetUrlError } from '../lib/leadMagnetAsset'
import { PREVIEW_BREAKPOINTS, previewUrl } from '../lib/preview'

/**
 * `lead-magnets` (SCHEMA.md §6.8, §4.3, §5, §10 — Gate S approved 2026-10-17).
 *
 * The p18 Lead Magnet template, `/resources/<slug>` (DECISIONS §C). Rendered
 * from fixed fields, no free layout: all three sections are bound to the
 * asset (p18 §Capture state → §What's inside → §Delivered state + newsletter
 * cross-sell; legal-only footer and logo-only header are template behaviour).
 * Gated template → noindexed by the template itself (SCHEMA §6.8 "flag in the
 * template"; seo-auditor page scope), so there is no `noindex` field here.
 *
 * Access: `staffContentAccessDraftDelete` (SCHEMA §4.3 + Delta 2026-10-18):
 * public and the pipeline user read published docs only; only staff write;
 * versions staff-only; marketing deletes drafts only, admin deletes any.
 * `asset` and `deliveryEmail` are staff-only on READ (field access, see below). Drafts (§5.1):
 * "required" means required to publish (`drafts.validate: false`).
 *
 * Asset rule (SCHEMA §6.8/§10): exactly one of `asset.file` (→ `downloads`)
 * or `asset.externalUrl`. Field validators (convention, PROGRESS Decision log:
 * all publish errors reported together, no throwing beforeChange), mirrored in
 * the browser by src/components/admin/LeadMagnetAssetFields.tsx.
 *
 * Slug: server-side from the title when absent, unique with `-2`, `-3` …
 * (src/hooks/uniqueSlug.ts), same mechanism as posts / case-studies.
 * `publishedAt`: SCHEMA §10 "publishedAt on first publish" (the hook needs the
 * field; it is sidebar-only and never overwrites an entered date).
 *
 * SEO: the plugin-seo `meta` tab is added by src/plugins/seo.ts (SEO_COLLECTIONS);
 * the route reads it (src/lib/leadMagnets.ts `leadMagnetMetadata`, always noindex).
 * Preview: `/_preview?path=/resources/<slug>` (S6-T2).
 *
 * Verified against payload@3.91.0: `slugField({ overrides })`
 * (fields/baseFields/slug/index.d.ts), `defaultPopulate`, `access.readVersions`
 * (collections/config/types.d.ts), array `minRows`/`maxRows` + custom
 * `validate` replacing the built-in one (fields/hooks/beforeChange/promise.js),
 * `text`/`upload` validators from `payload/shared` (fields/validations.js;
 * `upload` is async), `UploadField`/`TextField` client `validate` prop
 * (@payloadcms/ui@3.91.0 fields/Upload/index.js, fields/Text/index.js).
 */

const BULLETS_MIN = 3
const BULLETS_MAX = 6

/**
 * p18 §What's inside: 3 to 6 bullets to publish. Restated (instead of relying on
 * the built-in array check, which words it "3 Rows") so the message names bullets.
 * Server form state may pass the row count as a number, hence both shapes.
 */
const validateBullets: ArrayFieldValidation = (value, { req: { t } }) => {
  const count = Array.isArray(value) ? value.length : typeof value === 'number' ? value : 0
  if (count < BULLETS_MIN) return t('validation:requiresAtLeast', { count: BULLETS_MIN, label: 'bullets' })
  if (count > BULLETS_MAX) return t('validation:requiresNoMoreThan', { count: BULLETS_MAX, label: 'bullets' })
  return true
}

const validateAssetFile: UploadFieldSingleValidation = async (value, options) => {
  const base = await upload(value, options)
  if (base !== true) return base
  return assetFileError(value, options.siblingData)
}

const validateAssetUrl: TextFieldSingleValidation = (value, options) => {
  const base = text(value, options)
  if (base !== true) return base
  return assetUrlError(value, options.siblingData)
}

type LeadMagnetDoc = { id: number | string; _status?: 'draft' | 'published' | null; slug?: string | null }

/** SCHEMA §10 revalidation map: `/resources/<slug>` (+ tag `lead-magnets` for link targets). */
const revalidate = revalidateTagHooks<LeadMagnetDoc>('lead-magnets', {
  paths: (doc) => [doc?.slug ? `/resources/${doc.slug}` : null],
})

const slug = uniqueSlugHooks('lead-magnets')

/**
 * Delta 2026-10-18 (1): `asset` and `deliveryEmail` are staff-only on READ.
 * Public visitors and the pipeline user must never receive the file link, the
 * external URL or the delivery email text: the asset is only ever sent by
 * email after a Turnstile-verified sign-up.
 *
 * Mechanism (payload@3.91.0): field `access.read` runs in the afterRead field
 * traversal (fields/hooks/afterRead/promise.js:223, `delete siblingDoc[name]`
 * and no defaultValue backfill), which every read path goes through: REST and
 * GraphQL find/findByID, relationship population of a lead magnet from another
 * doc (incl. `populate`/`select` overrides) and versions. Query paths are
 * checked too: `where`/`sort` on a field the caller cannot read is rejected
 * (database/queryValidation/validateSearchParams.js → getEntityPermissions),
 * so the values cannot be probed by filtering either. Write access is
 * untouched (staff only through `staffContentAccessDraftDelete`).
 *
 * NOTE for the lead-magnet delivery job (automation-engineer): it runs without
 * a staff user, so it MUST read the doc with `overrideAccess: true` (the Local
 * API default) or these groups come back empty.
 */
const staffReadOnly = { read: staffOnlyField }

export const LeadMagnets: CollectionConfig = {
  slug: 'lead-magnets',
  labels: { singular: 'Lead magnet', plural: 'Lead magnets' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'publishedAt', 'updatedAt'],
    description:
      'Free downloads (/resources/…): the page, what\'s inside, the file or link, and the delivery email. Pages are hidden from search engines.',
    // S6-T2: draft preview (new tab) + live preview pane, as on pages / case
    // studies: both open `/_preview?path=/resources/<slug>` (src/lib/preview.ts),
    // which enables Next draft mode for staff only. No URL until the doc has a
    // slug. payload@3.91.0 collections/config/types.d.ts `preview` / `livePreview`.
    preview: (doc) => previewUrl(docPath('lead-magnets', { slug: typeof doc?.slug === 'string' ? doc.slug : null })),
    livePreview: {
      url: ({ data }) => previewUrl(docPath('lead-magnets', { slug: typeof data?.slug === 'string' ? data.slug : null })),
      breakpoints: PREVIEW_BREAKPOINTS,
    },
  },
  // Published first, newest first, then drafts (no nulls-last in @payloadcms/drizzle@3.91.0; see case-studies).
  defaultSort: ['-_status', '-publishedAt'],
  // Link targets (linkField → lead-magnets) need only these. Never the asset or the delivery email.
  // _status: defaultPopulate is the populated doc's select (payload@3.91.0 relationshipPopulationPromise.js:38) and is never forced in (sanitizeSelect.js); link renderers check it.
  defaultPopulate: { title: true, slug: true, _status: true },
  access: staffContentAccessDraftDelete,
  versions: contentVersions,
  hooks: {
    beforeValidate: [slug.beforeValidate],
    beforeChange: [setPublishedAtOnPublish],
    afterChange: [revalidate.afterChange],
    // S3-1: refuse to delete while still used somewhere live (named message).
    beforeDelete: [blockDeleteIfReferenced({ counted: { 'form-submissions': leadMagnetSubmissionsSentence } })],
    afterDelete: [revalidate.afterDelete],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Capture',
          admin: { description: 'The top of the page: what the download is, and the sign-up form.' },
          fields: [
            {
              name: 'eyebrow',
              type: 'text',
              defaultValue: 'Free download',
              admin: { description: 'Small line above the headline.' },
            },
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: { description: 'The headline (H1): the asset name and its pitch, e.g. "The 20-point store leak checklist."' },
            },
            {
              name: 'accentPhrase',
              type: 'text',
              label: 'Accent phrase',
              validate: validateAccentPhrase('title'),
              admin: {
                components: { Field: accentPhraseAdminField('title') },
                description: 'Optional: one word or phrase from the headline to show in the accent colour.',
              },
            },
            {
              name: 'pitch',
              type: 'textarea',
              required: true,
              admin: {
                description: 'One paragraph: what the asset is, who it is for, the problem it solves. Lead with the number.',
              },
            },
            {
              // P1 (SCHEMA §6.8): the capture form (email + newsletter opt-in checkbox).
              // Required to publish (drafts.validate false). Forms are staff-read, so
              // public reads get the id only; the frontend loads the form server-side.
              name: 'form',
              type: 'relationship',
              relationTo: 'forms',
              maxDepth: 1,
              required: true,
              label: 'Capture form',
              admin: { description: 'The form visitors fill in to get the asset (Forms in the admin).' },
            },
            {
              name: 'formNote',
              type: 'text',
              label: 'Form note',
              admin: {
                description: 'Small line under the form, e.g. "Email delivery. No drip sequence ambush — one send, plus the monthly newsletter if you opt in."',
              },
            },
          ],
        },
        {
          label: "What's inside",
          fields: [
            {
              // Delta 2026-10-18 (2). Default = the design's section heading (design-reference/project/Lead Magnet.dc.html, "What's inside" eyebrow).
              name: 'whatsInsideHeading',
              type: 'text',
              label: 'Heading',
              defaultValue: "What's inside",
              admin: { description: 'The small heading above the bullets.' },
            },
            {
              name: 'valueBullets',
              type: 'array',
              label: 'Value bullets',
              labels: { singular: 'Bullet', plural: 'Bullets' },
              required: true,
              minRows: BULLETS_MIN,
              maxRows: BULLETS_MAX,
              validate: validateBullets,
              admin: {
                description: '3 to 6 concrete things the asset gives the reader. Drag to reorder.',
                components: { RowLabel: '/components/admin/ValueBulletRowLabel#ValueBulletRowLabel' },
              },
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  admin: { description: 'e.g. "The benchmark conversion rate for your store size".' },
                },
              ],
            },
          ],
        },
        {
          label: 'Asset & email',
          admin: { description: 'What gets delivered, and the one email that delivers it.' },
          fields: [
            {
              name: 'asset',
              type: 'group',
              label: 'Asset',
              access: staffReadOnly,
              admin: { description: 'Upload the file OR link to it. Exactly one is needed to publish.' },
              fields: [
                {
                  name: 'file',
                  type: 'upload',
                  relationTo: 'downloads',
                  maxDepth: 1,
                  validate: validateAssetFile,
                  admin: {
                    components: { Field: '/components/admin/LeadMagnetAssetFields#LeadMagnetAssetFileField' },
                    description: 'A PDF, spreadsheet, CSV or zip from Downloads.',
                  },
                },
                {
                  name: 'externalUrl',
                  type: 'text',
                  label: 'Or a link',
                  validate: validateAssetUrl,
                  admin: {
                    components: { Field: '/components/admin/LeadMagnetAssetFields#LeadMagnetAssetUrlField' },
                    description: 'A full https:// address, if the asset lives somewhere else (e.g. a shared doc).',
                  },
                },
              ],
            },
            {
              name: 'deliveryEmail',
              type: 'group',
              label: 'Delivery email',
              access: staffReadOnly,
              admin: { description: 'The single email that sends the asset. No follow-up sequence.' },
              fields: [
                {
                  name: 'subject',
                  type: 'text',
                  required: true,
                  admin: { description: 'e.g. "Your store leak checklist".' },
                },
                {
                  name: 'intro',
                  type: 'textarea',
                  required: true,
                  admin: { description: 'Short text above the download link.' },
                },
              ],
            },
          ],
        },
        {
          label: 'Delivered state',
          admin: { description: 'What the page shows after someone signs up.' },
          fields: [
            {
              name: 'deliveredState',
              type: 'group',
              label: 'Delivered state',
              fields: [
                {
                  name: 'eyebrow',
                  type: 'text',
                  defaultValue: 'Sent',
                  admin: { description: 'Small line above the heading.' },
                },
                {
                  name: 'heading',
                  type: 'text',
                  required: true,
                  admin: { description: 'e.g. "Check your inbox. It\'s on the way."' },
                },
                {
                  name: 'accentPhrase',
                  type: 'text',
                  label: 'Accent phrase',
                  validate: validateAccentPhrase('heading'),
                  admin: {
                    components: { Field: accentPhraseAdminField('heading') },
                    description: 'Optional: one word or phrase from the heading to show in the accent colour.',
                  },
                },
                {
                  name: 'body',
                  type: 'textarea',
                  admin: { description: 'e.g. "If it\'s not there in five minutes, check spam — then email us."' },
                },
                {
                  name: 'crossSellLine',
                  type: 'text',
                  label: 'Newsletter cross-sell line',
                  admin: { description: 'Leads into the newsletter sign-up, e.g. "While you\'re here:".' },
                },
              ],
            },
          ],
        },
      ],
    },
    slugField({ overrides: slug.slugFieldOverrides }),
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Published',
      index: true,
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' },
        description: 'Set automatically on first publish.',
      },
    },
  ],
}
