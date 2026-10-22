import {
  BlockquoteFeature,
  BoldFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  ItalicFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
  UploadFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import {
  ValidationError,
  slugField,
  type CheckboxFieldValidation,
  type CollectionAfterChangeHook,
  type CollectionBeforeChangeHook,
  type CollectionConfig,
  type Field,
} from 'payload'
import { checkbox } from 'payload/shared'

import { adminOrMarketingUnpublished, publishedOrStaff, staffOnly } from '../access'
import { accentPhraseAdminField, contentVersions, linkField, metricFields, richTextLinkFeature, validateAccentPhrase } from '../fields'
import { blockDeleteIfReferenced } from '../hooks/blockDeleteIfReferenced'
import { setPublishedAtOnPublish } from '../hooks/publishedAt'
import { revalidateTagHooks } from '../hooks/revalidateTag'
import { uniqueSlugHooks } from '../hooks/uniqueSlug'
import { lexicalWordCount, readTimeMinutes } from '../lib/lexicalText'

/**
 * `case-studies` (SCHEMA.md §6.2, §4.3, §5, §10 — Gate S approved 2026-10-17).
 *
 * The p2 template (`/work/<slug>`), pulled on p1, p3, p4, p5, p6, p8, p13,
 * p14, p15, p17 and p19 (SCHEMA §5 table).
 * R3 / CLAUDE.md launch state: ALL case studies are drafts at launch; public
 * reads return published only; every surface derives its fallback from an
 * empty published set (no "live" toggle exists anywhere).
 * R5: no field carries a default number; every metric is entered (and seeded
 * as a labelled placeholder). R13: metrics are results/counts, never prices.
 * R10: reading progress is a template behaviour of `/work/<slug>`, not a field.
 *
 * Publishing requires `figuresApproved` (p2 design note: "Publishes only with
 * client-approved figures"), enforced by `validateFiguresApproved` (field
 * validation, so it reports with every other field error in one attempt) and
 * backstopped by `blockUnapprovedPublish` (afterChange, rolls back).
 *
 * Deferred (not built yet): `meta` plugin-seo tab (TODO(plugins): plugin-seo
 * `collections: ['case-studies']`), live preview URL + draft mode (integrator,
 * with the `/work/<slug>` route). `linkField` targets and richText internal
 * links cover pages / case-studies / posts / lead-magnets since C10.
 *
 * Verified against payload@3.91.0: `slugField` (fields/baseFields/slug, marked
 * @experimental but the SCHEMA-mandated helper), `defaultPopulate`
 * (collections/config/types.d.ts), `ValidationError` (errors/ValidationError.d.ts),
 * `access.readVersions`; Lexical `UploadFeature({ enabledCollections,
 * collections: { media: { fields } }, maxDepth })` in
 * @payloadcms/richtext-lexical@3.91.0 dist/features/upload/server/index.d.ts.
 */

const FIGURES_ERROR = 'Tick this before publishing.'

/**
 * SCHEMA §10: no publish unless `figuresApproved`. A FIELD validator, not a
 * collection hook: collection `beforeChange` runs before field validation
 * (payload@3.91.0 collections/operations/utilities/update.js:157 vs :197), so a
 * throw there hid every other publish error until the next attempt.
 *
 * Server-side (fields/hooks/beforeChange/promise.js:109) `event` is 'submit'
 * and `data` is the stored doc merged with the incoming data, so `_status` is
 * the status being saved. Draft saves never reach here (`drafts.validate:
 * false` → `skipValidation`, update.js:191, create.js:234), but a non-draft
 * update of a draft doc does, hence the status check. A version restore that
 * publishes is validated too (restoreVersion.js:227).
 * Admin form state (`event: 'onChange'`, only after a submit attempt,
 * @payloadcms/ui views/Edit/index.js:400) is a publish-readiness check, like
 * the built-in `required` errors it is shown with, so it ignores `_status`.
 */
const validateFiguresApproved: CheckboxFieldValidation = (value, options) => {
  const base = checkbox(value, options)
  if (base !== true) return base
  if (value === true) return true
  const status = (options.data as { _status?: string | null } | undefined)?._status
  if (options.event === 'submit' && status !== 'published') return true
  return FIGURES_ERROR
}

/**
 * Backstop for any publish path that skips field validation (none known in
 * 3.91.0). Runs after the write but inside the operation's transaction
 * (updateByID.js:24/226, create.js, restoreVersion.js), so the throw rolls the
 * publish back. Must stay FIRST in `afterChange`, before revalidation.
 * Deliberately not a `beforeChange` hook: that would pre-empt field errors.
 */
const blockUnapprovedPublish: CollectionAfterChangeHook = ({ collection, doc, req }) => {
  if (doc?._status !== 'published' || doc?.figuresApproved === true) return doc
  throw new ValidationError(
    { collection: collection.slug, errors: [{ path: 'figuresApproved', message: FIGURES_ERROR }], req },
    req.t,
  )
}

/** SCHEMA §10: `readTime` fill from the narrative word count when left empty (on publish). */
const fillReadTime: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  const status = data?._status ?? originalDoc?._status
  if (status !== 'published') return data
  const current = data?.readTime ?? originalDoc?.readTime
  if (typeof current === 'number' && current > 0) return data
  const narrative = data?.narrative ?? originalDoc?.narrative
  const words = ['before', 'strategy', 'results'].reduce(
    (sum, key) => sum + lexicalWordCount(narrative?.[key]?.body),
    0,
  )
  const minutes = readTimeMinutes(words)
  return minutes ? { ...data, readTime: minutes } : data
}

/** Server-side unique slug from the title (src/hooks/uniqueSlug.ts; same mechanism as posts). */
const slug = uniqueSlugHooks('case-studies')

/** SCHEMA §10 revalidation map: `/work`, `/work/<slug>`, tag `case-studies`. */
const revalidate = revalidateTagHooks<{ id: number | string; _status?: 'draft' | 'published' | null; slug?: string | null }>(
  'case-studies',
  { paths: (doc) => ['/work', doc?.slug ? `/work/${doc.slug}` : null] },
)

/** Narrative bodies: paragraphs, emphasis, lists, pull quotes, links, captioned figures (p2 §Article body). */
const narrativeEditor = lexicalEditor({
  features: [
    ParagraphFeature(),
    BoldFeature(),
    ItalicFeature(),
    UnorderedListFeature(),
    OrderedListFeature(),
    BlockquoteFeature(),
    richTextLinkFeature(),
    UploadFeature({
      enabledCollections: ['media'],
      maxDepth: 1,
      collections: {
        media: {
          fields: [
            {
              name: 'caption',
              type: 'text',
              admin: { description: 'Shown under the image, e.g. "Fig. 1 — Checkout before the rebuild".' },
            },
          ],
        },
      },
    }),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
})

/** Small editor for short asides ("What we'd do differently"). */
const asideEditor = lexicalEditor({
  features: [
    ParagraphFeature(),
    BoldFeature(),
    ItalicFeature(),
    UnorderedListFeature(),
    OrderedListFeature(),
    richTextLinkFeature(),
    InlineToolbarFeature(),
  ],
})

const narrativeSection = (name: 'before' | 'strategy' | 'results', label: string, example: string): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Heading',
      required: true,
      admin: { description: `Section heading, e.g. "${example}".` },
    },
    {
      name: 'body',
      type: 'richText',
      label: 'Text',
      required: true,
      editor: narrativeEditor,
      admin: { description: 'Type "/" or use the toolbar to add an image with a caption.' },
    },
  ],
})

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  labels: { singular: 'Case study', plural: 'Case studies' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'track', 'figuresApproved', '_status', 'publishedAt', 'updatedAt'],
    description:
      'Client case studies (/work). All are drafts at launch; a study publishes only with client-approved figures.',
  },
  // Postgres sorts NULLs first on DESC and @payloadcms/drizzle@3.91.0 has no
  // nulls-last option (queries/buildOrderBy.js), so published studies are put
  // first explicitly ('published' > 'draft'), newest first, then drafts.
  // Public queries are published-only, so for them this is just -publishedAt.
  // The admin list honours an array via find's fallback (operations/find.js:89).
  defaultSort: ['-_status', '-publishedAt'],
  // SCHEMA §6.2: card fields only, so pulls (cards, ledger, testimonial deep links) never over-fetch.
  defaultPopulate: {
    title: true,
    slug: true,
    client: true,
    track: true,
    headlineMetric: true,
    cardSummary: true,
    heroMedia: true,
    publishedAt: true,
  },
  access: {
    read: publishedOrStaff,
    readVersions: staffOnly,
    create: staffOnly,
    update: staffOnly,
    delete: adminOrMarketingUnpublished, // SCHEMA §4.3: marketing never deletes a published case study
  },
  versions: contentVersions,
  hooks: {
    beforeValidate: [slug.beforeValidate],
    beforeChange: [setPublishedAtOnPublish, fillReadTime],
    afterChange: [blockUnapprovedPublish, revalidate.afterChange],
    // S3-1: refuse to delete while still used somewhere live (named message).
    beforeDelete: [blockDeleteIfReferenced()],
    afterDelete: [revalidate.afterDelete],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Summary',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: { description: 'The study headline (H1), e.g. "The demand was already there. The store was leaking it."' },
            },
            {
              name: 'accentPhrase',
              type: 'text',
              label: 'Accent phrase',
              validate: validateAccentPhrase('title'),
              admin: { components: { Field: accentPhraseAdminField('title') }, description: 'Optional: one word or phrase from the headline to show in the accent colour.' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'client',
                  type: 'relationship',
                  relationTo: 'clients',
                  maxDepth: 1,
                  required: true,
                  admin: { width: '50%', description: 'The client this study is about.' },
                },
                {
                  name: 'track',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Build', value: 'build' },
                    { label: 'Growth engine', value: 'growth' },
                    { label: 'Build + engine', value: 'build-and-growth' },
                    { label: 'Handover complete', value: 'handover' },
                  ],
                  admin: {
                    width: '50%',
                    description: 'Engagement type. Decides which service pages show this study as proof.',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'studyNumber',
                  type: 'number',
                  label: 'Study number',
                  min: 1,
                  admin: { width: '30%', step: 1, description: 'Shown as "Study 01" / "№ 01".' },
                },
                {
                  name: 'engagementLine',
                  type: 'text',
                  label: 'Engagement line',
                  admin: {
                    width: '70%',
                    description: 'e.g. "Build + engine, 12 months · Hardgoods retail, 3 locations".',
                  },
                },
              ],
            },
            {
              name: 'headlineMetric',
              type: 'group',
              label: 'Headline metric',
              admin: {
                description: 'The oversized result on the study and on every study card, e.g. "+212%" / "Revenue, 12 months".',
              },
              fields: metricFields(),
            },
            {
              name: 'cardSummary',
              type: 'textarea',
              label: 'Card summary',
              required: true,
              maxLength: 160,
              admin: { description: 'One or two lines for cards and the Work ledger (max 160 characters).' },
            },
            {
              name: 'inShort',
              type: 'textarea',
              label: 'In short',
              required: true,
              admin: { description: 'The "In short" box under the headline.' },
            },
            {
              name: 'heroMedia',
              type: 'upload',
              label: 'Hero media',
              relationTo: 'media',
              maxDepth: 1,
              required: true,
              admin: { description: 'Main visual, shown in a browser frame (e.g. a screenshot of the store).' },
            },
          ],
        },
        {
          label: 'Story',
          fields: [
            {
              name: 'narrative',
              type: 'group',
              label: 'Story sections',
              admin: { description: 'The three numbered sections of the study, always in this order.' },
              fields: [
                narrativeSection('before', '01 — The before', 'What we found'),
                narrativeSection('strategy', '02 — The strategy', 'The order of work, and why'),
                narrativeSection('results', '03 — The results', 'What changed, month by month'),
              ],
            },
          ],
        },
        {
          label: 'Results',
          fields: [
            {
              name: 'resultsTable',
              type: 'group',
              label: 'Results table',
              fields: [
                {
                  name: 'eyebrow',
                  type: 'text',
                  admin: { description: 'e.g. "Results — 12 months, client-reported".' },
                },
                {
                  name: 'columns',
                  type: 'group',
                  label: 'Column headings',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'measure', type: 'text', admin: { width: '25%', description: 'e.g. "Measure".' } },
                        { name: 'baseline', type: 'text', admin: { width: '25%', description: 'e.g. "Before".' } },
                        { name: 'after', type: 'text', admin: { width: '25%', description: 'e.g. "After 12 mo".' } },
                        { name: 'change', type: 'text', admin: { width: '25%', description: 'e.g. "Change".' } },
                      ],
                    },
                  ],
                },
                {
                  name: 'rows',
                  type: 'array',
                  required: true,
                  minRows: 1,
                  label: 'Results',
                  labels: { singular: 'Result', plural: 'Results' },
                  // The built-in array validator words this as "1 Rows" (it ignores
                  // `labels`); restate it so the tooltip matches the admin banner.
                  validate: (value, { req: { t } }) =>
                    (Array.isArray(value) && value.length >= 1) ||
                    t('validation:requiresAtLeast', { count: 1, label: 'Result' }),
                  admin: {
                    description: 'One row per measured result. Drag to reorder.',
                    components: { RowLabel: '/components/admin/ResultRowLabel#ResultRowLabel' },
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'measure',
                          type: 'text',
                          required: true,
                          admin: { width: '25%', description: 'e.g. "Online revenue".' },
                        },
                        { name: 'baseline', type: 'text', admin: { width: '25%' } },
                        { name: 'after', type: 'text', required: true, admin: { width: '25%' } },
                        { name: 'change', type: 'text', admin: { width: '25%', description: 'e.g. "+212%".' } },
                      ],
                    },
                  ],
                },
                {
                  name: 'method',
                  type: 'textarea',
                  label: 'How it was measured',
                  admin: { description: 'How the numbers were measured and who reported them.' },
                },
              ],
            },
          ],
        },
        {
          label: 'Client voice & closing',
          fields: [
            {
              name: 'clientVoice',
              type: 'group',
              label: 'Client voice',
              fields: [
                {
                  name: 'testimonial',
                  type: 'relationship',
                  relationTo: 'testimonials',
                  maxDepth: 2,
                  admin: {
                    description: 'The client\'s testimonial. A video testimonial plays first; a text one shows as a quote.',
                  },
                },
                {
                  name: 'doDifferently',
                  type: 'richText',
                  label: 'What we\'d do differently',
                  editor: asideEditor,
                },
                {
                  name: 'phaseMapping',
                  type: 'textarea',
                  label: 'How this maps to our phases',
                },
                linkField({
                  name: 'link',
                  label: 'Link',
                  description: 'Optional link under this section, e.g. "See the two tracks".',
                }),
              ],
            },
            {
              name: 'closing',
              type: 'group',
              label: 'Closing',
              admin: { description: 'Optional per-study headings. Empty = the site-wide defaults.' },
              fields: [
                {
                  name: 'newsletterHeading',
                  type: 'text',
                  label: 'Newsletter heading',
                  admin: { description: 'e.g. "Want this written about your store?"' },
                },
                {
                  name: 'finalCtaHeading',
                  type: 'text',
                  label: 'Final CTA heading',
                },
              ],
            },
          ],
        },
      ],
    },
    slugField({ overrides: slug.slugFieldOverrides }),
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Show on the homepage, Services and Review Hub "featured" spots.',
      },
    },
    {
      name: 'figuresApproved',
      type: 'checkbox',
      label: 'Client approved the figures',
      defaultValue: false,
      validate: validateFiguresApproved,
      admin: {
        position: 'sidebar',
        description:
          'Required to publish: studies go live only with client-approved numbers. Tick once the client has signed off every figure.',
      },
    },
    {
      name: 'readTime',
      type: 'number',
      label: 'Read time',
      min: 1,
      admin: {
        position: 'sidebar',
        step: 1,
        description: 'Minutes. Leave empty to calculate from the story when publishing.',
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
        description: 'Set automatically on first publish. Orders the Work page and "Next study".',
      },
    },
  ],
}
