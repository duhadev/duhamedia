import {
  slugField,
  ValidationError,
  type Block,
  type BlocksField,
  type BlocksFieldValidation,
  type CollectionAfterChangeHook,
  type CollectionBeforeValidateHook,
  type CollectionConfig,
  type FieldHook,
  type RowField,
  type TextField,
  type TextFieldSingleValidation,
} from 'payload'
import { blocks, text } from 'payload/shared'

import { staffContentAccessDraftDelete } from '../access'
import { contentVersions } from '../fields'
import { blockDeleteIfReferenced } from '../hooks/blockDeleteIfReferenced'
import { setPublishedAtOnPublish } from '../hooks/publishedAt'
import { revalidateTagHooks } from '../hooks/revalidateTag'
import { uniqueSlugHooks } from '../hooks/uniqueSlug'
import { pagePath, pageSlugError, slugifyPath } from '../lib/pagePath'

/**
 * `pages` (SCHEMA.md §6.1, §4.3, §5, §9, §10, X2, X6 — Gate S approved 2026-10-17).
 *
 * The single-document page types, assembled from layout blocks: p1 `home`,
 * p3 `work`, p4 `services`, p5 `services/shopify-theme-development`, p6
 * `services/marketing`, p7 `testimonials`, p8 `about`, p9 `book-a-call`,
 * p10 `thank-you`, p11 `faq`, p12 `contact`, p15 `lp/<campaign>`, p16
 * `newsletter`, p17 `links`, p19 `reviews`, p20 `privacy` / `terms` /
 * `cookies` / `gdpr`, p21 `404`. Templates p2/p13/p14/p18 are their own
 * collections. URL rules: src/lib/pagePath.ts (`home` → `/`, `404` →
 * not-found route, `/` kept between slug segments, template/admin paths
 * reserved).
 *
 * X2: the hero is the first `layout` block, not a fixed group.
 * X6: reading progress is a page flag, not a block.
 *
 * Page-level features (SCHEMA §1, §9):
 * - `headerVariant` — logo-only on p15 (and the p18 template), none on p17.
 * - `footerVariant` — reduced-nav on p9, p10; legal-only on p15, p17 (p18
 *   template). CLAUDE.md rule 4.
 * - `zeroLeakage` — p15. `beforeValidate` forces the logo-only header and the
 *   legal-only footer on every save (draft or publish); publishing with a
 *   NewsletterBand in `layout` is a field error on `layout`, backstopped in
 *   `afterChange` (PROGRESS Decision log: publish rules = field `validate` +
 *   afterChange backstop, never a throwing beforeChange).
 * - `readingProgress` — p8, p11 (R10).
 * - `noindex` — p10, p15, p17, p21.
 *
 * `layout` is NOT registered yet (rework 2026-10-17): payload@3.91.0's admin
 * crashes on a blocks field with `blocks: []` (see `pageLayoutField`). The
 * integrator adds `pageLayoutField([...])` with the first cleared block. Until
 * then: pages save and publish without sections, and the zero-leakage
 * NewsletterBand check is dormant (header/footer forcing stays live).
 *
 * Access: `staffContentAccessDraftDelete` (SCHEMA §4.3 + Delta 2026-10-18):
 * public and the pipeline user read published docs only; only staff write;
 * versions staff-only; marketing deletes drafts only, admin deletes any.
 *
 * Deferred: `meta` plugin-seo tab (TODO(P3): plugin-seo `collections:
 * ['pages']`); live preview + draft mode (integrator, URL from server-side
 * `SITE_URL`); the frontend router (`[...slug]`, `not-found.tsx` reading the
 * `404` doc).
 *
 * Verified against payload@3.91.0: `slugField({ slugify, overrides })` and the
 * `Slugify` signature (fields/baseFields/slug/index.d.ts; the custom slugify
 * is also used by the admin "Generate" button via `custom.slugify`),
 * field `hooks.beforeValidate`, `BlocksFieldValidation` + `blocks()`/`text()`
 * from `payload/shared` (fields/validations.js), `ValidationError`,
 * `defaultPopulate`, `access.readVersions`.
 */

/**
 * Block slug of the NewsletterBand block (SCHEMA §8.4 #15, "Forbidden on
 * `zeroLeakage` pages"). The block does not exist yet; its unit must use this
 * slug (or update it here).
 */
export const NEWSLETTER_BAND_BLOCK_SLUG = 'newsletterBand'

const ZERO_LEAKAGE_NEWSLETTER_ERROR =
  'Zero-leakage pages cannot contain a Newsletter band. Remove it, or turn off Zero leakage.'

type LayoutBlock = { blockType?: string | null }

const hasNewsletterBand = (layout: unknown): boolean =>
  Array.isArray(layout) &&
  layout.some((block) => (block as LayoutBlock | null)?.blockType === NEWSLETTER_BAND_BLOCK_SLUG)

/** SCHEMA §10 `beforeValidate`: zero leakage forces the LP header and footer. */
const enforceZeroLeakage: CollectionBeforeValidateHook = ({ data, originalDoc }) => {
  if (!data) return data
  const zeroLeakage = data.zeroLeakage !== undefined ? data.zeroLeakage : originalDoc?.zeroLeakage
  if (zeroLeakage !== true) return data
  return { ...data, headerVariant: 'logo-only', footerVariant: 'legal-only' }
}

/** `layout`: the built-in blocks check (required, min 1), then the zero-leakage rule. */
const validateLayout: BlocksFieldValidation = async (value, options) => {
  const base = await blocks(value, options)
  if (base !== true) return base
  const zeroLeakage = (options.data as { zeroLeakage?: boolean | null } | undefined)?.zeroLeakage
  return zeroLeakage === true && hasNewsletterBand(value) ? ZERO_LEAKAGE_NEWSLETTER_ERROR : true
}

/**
 * The `layout` field (SCHEMA §6.1, X2), ready for the integrator to re-attach
 * with the first cleared block: `pageLayoutField([HeroBlock])`.
 *
 * NOT in `fields` while the block list is empty. In payload@3.91.0 an empty
 * blocks field crashes the admin edit view: `createClientField`
 * (payload/dist/fields/config/client.js) only sets `field.blocks` when
 * `incomingField.blocks?.length` (same guard for `blockReferences`), and
 * `@payloadcms/ui` buildClientFieldSchemaMap/traverseFields.js:41 then runs
 * `(field.blockReferences ?? field.blocks).map(...)` on `undefined`
 * ("Cannot read properties of undefined (reading 'map')"). An empty blocks
 * field creates no DB tables, so adding/removing it is migration-neutral.
 */
export const pageLayoutField = (layoutBlocks: Block[]): BlocksField => ({
  name: 'layout',
  type: 'blocks',
  label: 'Sections',
  labels: { singular: 'Section', plural: 'Sections' },
  required: true,
  minRows: 1,
  blocks: layoutBlocks,
  validate: validateLayout,
  admin: { description: 'The page sections, top to bottom. Drag to reorder.' },
})

/**
 * Backstop for any publish path that skips field validation (none known in
 * 3.91.0): runs inside the operation's transaction, so the throw rolls the
 * publish back. FIRST in `afterChange`, before revalidation.
 */
const blockLeakyPublish: CollectionAfterChangeHook = ({ collection, doc, req }) => {
  if (doc?._status !== 'published' || doc?.zeroLeakage !== true) return doc
  const errors: { message: string; path: string }[] = []
  if (hasNewsletterBand(doc.layout)) errors.push({ path: 'layout', message: ZERO_LEAKAGE_NEWSLETTER_ERROR })
  if (doc.headerVariant !== 'logo-only') {
    errors.push({ path: 'headerVariant', message: 'Zero-leakage pages use the logo-only header.' })
  }
  if (doc.footerVariant !== 'legal-only') {
    errors.push({ path: 'footerVariant', message: 'Zero-leakage pages use the legal-only footer.' })
  }
  if (errors.length === 0) return doc
  throw new ValidationError({ collection: collection.slug, errors, req }, req.t)
}

/** Slug: normalise each `/` segment before validation (also for hand-typed slugs). */
const normaliseSlug: FieldHook = ({ value }) => (typeof value === 'string' ? (slugifyPath(value) ?? null) : value)

/** Slug: built-in text checks (required), then the path rules. */
const validateSlug: TextFieldSingleValidation = (value, options) => {
  const base = text(value, options)
  if (base !== true) return base
  if (typeof value !== 'string' || value === '') return true
  return pageSlugError(value) ?? true
}

const slug = uniqueSlugHooks('pages')

type SingleTextField = Extract<TextField, { hasMany?: false }>

/** `slugField()` + server-side unique fill (shared hook) + the page path rules. */
const pageSlugOverrides = (field: RowField): RowField => {
  const withUnique = slug.slugFieldOverrides(field)
  return {
    ...withUnique,
    fields: withUnique.fields.map((f) =>
      'name' in f && f.name === 'slug' && f.type === 'text' && !f.hasMany
        ? ({
            ...(f as SingleTextField),
            validate: validateSlug,
            hooks: { ...f.hooks, beforeValidate: [...(f.hooks?.beforeValidate ?? []), normaliseSlug] },
            admin: {
              ...f.admin,
              description:
                'The page address. "home" is the homepage (/). "404" is the not-found page. Use "/" between parts, e.g. services/marketing or lp/spring-offer.',
            },
          } satisfies SingleTextField)
        : f,
    ),
  }
}

type PageDoc = { id: number | string; _status?: 'draft' | 'published' | null; slug?: string | null }

/** SCHEMA §10 revalidation map: tag `pages` + the page's own path (old and new). */
const revalidate = revalidateTagHooks<PageDoc>('pages', {
  paths: (doc) => [pagePath(doc?.slug)],
})

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'footerVariant', '_status', 'updatedAt'],
    description: 'Site pages built from sections. Case studies, posts and lead magnets have their own collections.',
  },
  // Link targets (linkField → pages, rich-text internal links) need only these.
  defaultPopulate: { title: true, slug: true },
  access: staffContentAccessDraftDelete,
  versions: contentVersions,
  hooks: {
    beforeValidate: [slug.beforeValidate, enforceZeroLeakage],
    beforeChange: [setPublishedAtOnPublish],
    afterChange: [blockLeakyPublish, revalidate.afterChange],
    // S3-1: refuse to delete while still used somewhere live (named message).
    beforeDelete: [blockDeleteIfReferenced()],
    afterDelete: [revalidate.afterDelete],
  },
  fields: [
    // P3: the main fields sit in a "Content" tab so plugin-seo's `tabbedUI` appends
    // its SEO tab beside it and leaves the sidebar fields below top-level
    // (plugin-seo@3.91.0 dist/index.js:161-183). An unnamed tab stores nothing of
    // its own: no DB change.
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: { description: 'Admin title and the default browser-tab title.' },
            },
            // TODO(blocks): add `pageLayoutField([<first block>])` here, inside the Content tab
            // (required, minRows 1), with the first block.
          ],
        },
      ],
    },
    slugField({ slugify: ({ valueToSlugify }) => slugifyPath(valueToSlugify), overrides: pageSlugOverrides }),
    {
      name: 'headerVariant',
      type: 'select',
      label: 'Header',
      required: true,
      defaultValue: 'standard',
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Logo only', value: 'logo-only' },
        { label: 'None', value: 'none' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Logo only: campaign landing pages. None: Link-in-Bio. Forced to Logo only when Zero leakage is on.',
      },
    },
    {
      name: 'footerVariant',
      type: 'select',
      label: 'Footer',
      required: true,
      defaultValue: 'standard',
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Reduced navigation', value: 'reduced-nav' },
        { label: 'Legal only', value: 'legal-only' },
      ],
      admin: {
        position: 'sidebar',
        description:
          'Reduced: Book a Call, Thank You. Legal only: campaign landing pages, Link-in-Bio. Forced to Legal only when Zero leakage is on.',
      },
    },
    {
      name: 'zeroLeakage',
      type: 'checkbox',
      label: 'Zero leakage',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'Campaign landing pages: logo-only header, legal-only footer, no newsletter band. Visitors can only take the page’s offer.',
      },
    },
    {
      name: 'readingProgress',
      type: 'checkbox',
      label: 'Reading progress bar',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Thin progress bar on long pages (About, FAQ).' },
    },
    {
      name: 'noindex',
      type: 'checkbox',
      label: 'Hide from search engines',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Adds noindex and leaves the page out of the sitemap. For Thank You, landing pages, Link-in-Bio, 404.',
      },
    },
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
