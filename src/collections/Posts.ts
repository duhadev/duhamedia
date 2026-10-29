import {
  BlockquoteFeature,
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  ItalicFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
  UploadFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import {
  slugField,
  type CollectionBeforeChangeHook,
  type CollectionConfig,
  type Condition,
  type FieldAccess,
  type NumberFieldSingleValidation,
} from 'payload'
import { number } from 'payload/shared'

import { adminOrMarketingUnpublished, postsRead, staffOnly, staffOnlyField, staffOrPipeline, staffOrPipelineDrafts } from '../access'
import { forbidPipelineOnPublished, forbidPipelinePublish, pipelineNeverPublishes } from '../access/pipeline'
import { accentPhraseAdminField, contentVersions, linkField, metricFields, neverShown, pricingNote, richTextLinkFeature, validateAccentPhrase } from '../fields'
import { blockDeleteIfReferenced } from '../hooks/blockDeleteIfReferenced'
import { setPublishedAtOnPublish } from '../hooks/publishedAt'
import { revalidateTagHooks } from '../hooks/revalidateTag'
import { uniqueSlugHooks } from '../hooks/uniqueSlug'
import { docPath } from '../lib/docPath'
import { lexicalWordCount, readTimeMinutes } from '../lib/lexicalText'
import { PREVIEW_BREAKPOINTS, previewUrl } from '../lib/preview'
import { rowLabel } from '../components/admin/rowLabel'

/**
 * `posts` (SCHEMA.md §2.1, §6.3, §4.3, §5, §10, X11 — Gate S approved 2026-10-17).
 *
 * ONE collection for three tracks (Gate S §2.1):
 * - `dev-seo`  → p13 DEV-SEO template, `/insights/<slug>`
 * - `mkt-seo`  → p14 MKT-SEO template, `/insights/<slug>`
 * - `newsletter-issue` → p16 issue rows; public page `/newsletter/<slug>`
 *   (article template; Gate S Q3 default, PROGRESS Decision log)
 * Track-specific fields are hidden by `admin.condition` on `track`; a hidden
 * field is never validated (fields/hooks/beforeChange/promise.js:44).
 *
 * The ONLY collection the pipeline API user writes (CLAUDE.md, SCHEMA §4.1):
 * create + update drafts, never publish, delete, read versions, set the
 * author / publish dates / hero image / proof (staff-only field access: the
 * value is silently dropped, fields/hooks/beforeValidate/promise.js), nor
 * touch any other collection. Guards, in order:
 * - access: read/update `_status = draft` for the pipeline (src/access);
 * - beforeChange `forbidPipelinePublish`: any non-draft `_status` → 403;
 * - beforeChange `forbidPipelineOnPublished`: any write to a post whose live
 *   row is published → 403 (the access query alone matches the latest
 *   VERSION, see src/access/pipeline.ts);
 * - afterChange `pipelineNeverPublishes`: rollback backstop.
 * The pipeline must send `?draft=true`: without it Payload validates the
 * save as complete (required fields), though it is still stored as a draft.
 *
 * Slug: server-side from the title when absent, unique with `-2`, `-3` …
 * (src/hooks/uniqueSlug.ts), because the pipeline creates over REST and
 * `slugField()` alone fails/collides there.
 *
 * X11: the FAQ is an inline array (pipeline-writable, keyword-specific);
 * it feeds FAQPage JSON-LD and renders through the AccordionFAQ component.
 * R10: reading progress is a template behaviour, not a field.
 * R13: prices only via `pricingNote` (and `diyBridge` facts are never prices).
 *
 * `meta` SEO tab: plugin-seo (SEO_COLLECTIONS). Preview (S6-T1, with the
 * `/insights/<slug>` and `/newsletter/<slug>` routes): `admin.preview` +
 * `admin.livePreview` → `/_preview?path=<docPath>` (src/lib/preview.ts), the
 * same staff-only draft mode as pages / case studies; the path follows the
 * track. richText internal links: `richTextLinkFeature` (C10).
 *
 * Verified against payload@3.91.0: `slugField({ overrides })`
 * (fields/baseFields/slug/index.d.ts), tab `admin.condition` (TabBase has
 * FieldBase admin; @payloadcms/ui fields/Tabs honours `passesCondition`),
 * field access create/update (boolean), `access.readVersions`,
 * `defaultPopulate`; Lexical `HeadingFeature({ enabledHeadingSizes })`,
 * `UploadFeature`, `LinkFeature` in @payloadcms/richtext-lexical@3.91.0.
 */

type Track = 'dev-seo' | 'mkt-seo' | 'newsletter-issue'

const trackOf = (data: unknown): Track | undefined =>
  (data as { track?: Track | null } | undefined)?.track ?? undefined

const isArticle: Condition = (data) => {
  const track = trackOf(data)
  return track === 'dev-seo' || track === 'mkt-seo'
}
const isDevSeo: Condition = (data) => trackOf(data) === 'dev-seo'
const isIssue: Condition = (data) => trackOf(data) === 'newsletter-issue'

/** SCHEMA §6.3 "Edit: S" fields — the pipeline cannot set these. */
const staffWrites: { create: FieldAccess; update: FieldAccess } = {
  create: staffOnlyField,
  update: staffOnlyField,
}

/** `issueNumber` is required to publish a newsletter issue ("ISSUE 011", p16). */
const validateIssueNumber: NumberFieldSingleValidation = (value, options) => {
  const base = number(value, options)
  if (base !== true) return base
  if (trackOf(options.data) !== 'newsletter-issue') return true
  return typeof value === 'number' ? true : 'Required for newsletter issues.'
}

/** SCHEMA §10: `readTime` fill from the body word count when left empty (on publish). */
const fillReadTime: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  const status = data?._status ?? originalDoc?._status
  if (status !== 'published') return data
  const current = data?.readTime ?? originalDoc?.readTime
  if (typeof current === 'number' && current > 0) return data
  const minutes = readTimeMinutes(lexicalWordCount(data?.body ?? originalDoc?.body))
  return minutes ? { ...data, readTime: minutes } : data
}

type PostDoc = {
  id: number | string
  _status?: 'draft' | 'published' | null
  slug?: string | null
  track?: Track | null
}

/**
 * SCHEMA §10 revalidation map: tag `posts` (PostList on p16) + the doc's own
 * route per track. Old + new doc are both purged, so a slug or track change
 * also refreshes the previous URL.
 */
const revalidate = revalidateTagHooks<PostDoc>('posts', {
  paths: (doc) => {
    if (!doc?.slug) return []
    return doc.track === 'newsletter-issue'
      ? ['/newsletter', `/newsletter/${doc.slug}`]
      : [`/insights/${doc.slug}`]
  },
})

const slug = uniqueSlugHooks('posts')

/** The routable part of a (possibly unsaved) post: no track yet → no preview URL. */
const previewDoc = (doc: Record<string, unknown> | undefined) => {
  const track = trackOf(doc)
  return track && typeof doc?.slug === 'string' ? { slug: doc.slug, track } : null
}

/** Article body (p13/p14 §Article body): H2/H3, lists, pull quote, links, captioned figures. */
const bodyEditor = lexicalEditor({
  features: [
    ParagraphFeature(),
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
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
              admin: { description: 'Shown under the image, e.g. "Fig. 1 — …".' },
            },
          ],
        },
      },
    }),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
})

/** Short sections and FAQ answers: paragraphs, emphasis, lists, links. */
const shortEditor = lexicalEditor({
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

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Post', plural: 'Posts' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'track', '_status', 'publishedAt', 'updatedAt'],
    description:
      'Articles (DEV-SEO and MKT-SEO, /insights) and newsletter issues (/newsletter). The content pipeline drafts here; publishing is always a person.',
    // Draft preview (new tab) + live preview pane, as on case studies: both open
    // `/_preview?path=<docPath>`, which enables Next draft mode for staff only.
    // No URL until the doc has a slug and a track. payload@3.91.0
    // collections/config/types.d.ts `preview` / `livePreview`.
    preview: (doc) => previewUrl(docPath('posts', previewDoc(doc))),
    livePreview: {
      url: ({ data }) => previewUrl(docPath('posts', previewDoc(data))),
      breakpoints: PREVIEW_BREAKPOINTS,
    },
  },
  // Published first, newest first, then drafts (same reasoning as case-studies:
  // no nulls-last in @payloadcms/drizzle@3.91.0).
  defaultSort: ['-_status', '-publishedAt'],
  // Link targets (linkField → posts) and lists only need these; never the body.
  // _status: defaultPopulate is the populated doc's select (payload@3.91.0 relationshipPopulationPromise.js:38) and is never forced in (sanitizeSelect.js); link renderers check it.
  defaultPopulate: {
    title: true,
    slug: true,
    track: true,
    dek: true,
    publishedAt: true,
    issueNumber: true,
    _status: true,
  },
  access: {
    read: postsRead,
    readVersions: staffOnly,
    create: staffOrPipeline,
    update: staffOrPipelineDrafts,
    delete: adminOrMarketingUnpublished, // Delta 2026-10-18: marketing drafts only; pipeline never
  },
  versions: contentVersions,
  hooks: {
    beforeValidate: [slug.beforeValidate],
    beforeChange: [forbidPipelinePublish, forbidPipelineOnPublished, setPublishedAtOnPublish, fillReadTime],
    afterChange: [pipelineNeverPublishes, revalidate.afterChange],
    // S3-1: refuse to delete while still used somewhere live (named message).
    beforeDelete: [blockDeleteIfReferenced()],
    afterDelete: [revalidate.afterDelete],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Article',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: {
                description:
                  'Keyword-targeted headline (H1), e.g. "Shopify development in Chicago, scoped and priced in writing."',
              },
            },
            {
              type: 'row',
              admin: { condition: isIssue },
              fields: [
                {
                  name: 'issueNumber',
                  type: 'number',
                  label: 'Issue number',
                  min: 1,
                  validate: validateIssueNumber,
                  admin: {
                    width: '25%',
                    step: 1,
                    condition: isIssue,
                    description: 'Required for newsletter issues. Shown as "ISSUE 011".',
                  },
                },
                {
                  name: 'sentAt',
                  type: 'date',
                  label: 'Sent on',
                  admin: {
                    width: '35%',
                    condition: isIssue,
                    date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' },
                  },
                },
                {
                  name: 'issueMetric',
                  type: 'text',
                  label: 'Issue metric',
                  admin: { width: '40%', condition: isIssue, description: 'The number shown on the issue row.' },
                },
              ],
            },
            {
              name: 'eyebrow',
              type: 'text',
              admin: { description: 'Small line above the headline, e.g. "Shopify Theme Development — Chicago".' },
            },
            {
              name: 'dek',
              type: 'textarea',
              label: 'Standfirst',
              required: true,
              maxLength: 300,
              admin: {
                description: 'The paragraph under the headline. Also the excerpt on newsletter cards (max 300 characters).',
              },
            },
            {
              name: 'heroImage',
              type: 'upload',
              label: 'Hero image',
              relationTo: 'media',
              maxDepth: 1,
              access: staffWrites,
              admin: { description: 'Optional. Set by staff (the pipeline cannot upload or pick images).' },
            },
            {
              name: 'body',
              type: 'richText',
              required: true,
              editor: bodyEditor,
              admin: {
                description: 'The article. H2 headings are numbered 01, 02 … on the site. Type "/" to add an image with a caption.',
              },
            },
            pricingNote(),
          ],
        },
        {
          label: 'Sections',
          admin: { condition: isArticle, description: 'Sections around the article body (DEV-SEO and MKT-SEO only).' },
          fields: [
            {
              name: 'diyBridge',
              type: 'group',
              label: 'DIY vs done-for-you',
              admin: { condition: isArticle, description: 'e.g. "Some stores should just hire a freelancer."' },
              fields: [
                { name: 'eyebrow', type: 'text' },
                { name: 'heading', type: 'text' },
                {
                  name: 'accentPhrase',
                  type: 'text',
                  label: 'Accent phrase',
                  validate: validateAccentPhrase('heading'),
                  // Hidden: the grey band renders it in --accent-primary = ink, same as the heading.
                  admin: { condition: neverShown, components: { Field: accentPhraseAdminField('heading') }, description: 'Optional: one word or phrase from the heading to show in the accent colour.' },
                },
                { name: 'body', type: 'richText', editor: shortEditor },
                {
                  name: 'facts',
                  type: 'array',
                  maxRows: 3,
                  labels: { singular: 'Fact', plural: 'Facts' },
                  admin: {
                    components: { RowLabel: rowLabel(['value', 'label'], 'Fact') },
                    description: 'Up to 3 short facts, e.g. "4–6 / Weeks". Never a price: use the pricing note. Drag to reorder.',
                  },
                  fields: metricFields(),
                },
              ],
            },
            {
              name: 'howWeDoIt',
              type: 'group',
              label: 'How we do it',
              admin: {
                condition: isArticle,
                description: 'DEV-SEO: the box at the end of the body. MKT-SEO: its own section after the DIY bridge.',
              },
              fields: [
                { name: 'eyebrow', type: 'text' },
                { name: 'body', type: 'textarea' },
                linkField({ name: 'link', label: 'Link', description: 'Optional link under this box.' }),
              ],
            },
            {
              name: 'educational',
              type: 'group',
              label: 'Educational block',
              admin: { condition: isDevSeo, description: 'DEV-SEO only: after Proof, before the FAQ.' },
              fields: [
                { name: 'eyebrow', type: 'text' },
                { name: 'heading', type: 'text' },
                { name: 'body', type: 'richText', editor: shortEditor },
              ],
            },
            {
              name: 'proof',
              type: 'group',
              label: 'Proof',
              access: staffWrites,
              admin: {
                condition: isArticle,
                description: 'Case studies shown as proof. While none is published, the fallback below shows instead.',
              },
              fields: [
                {
                  name: 'source',
                  type: 'select',
                  defaultValue: 'track',
                  options: [
                    { label: 'Featured studies', value: 'featured' },
                    { label: 'Studies of this track (build / growth)', value: 'track' },
                    { label: 'Pick studies', value: 'manual' },
                  ],
                },
                {
                  name: 'caseStudies',
                  type: 'relationship',
                  label: 'Case studies',
                  relationTo: 'case-studies',
                  hasMany: true,
                  maxDepth: 1,
                  admin: {
                    condition: (_data, siblingData) => siblingData?.source === 'manual',
                    description: 'In display order. Only published studies show.',
                  },
                },
                {
                  name: 'fallbackMode',
                  type: 'select',
                  label: 'Fallback',
                  options: [
                    { label: 'Testimonials', value: 'testimonials' },
                    { label: 'Metric strip', value: 'metricStrip' },
                  ],
                  admin: {
                    description: 'Shown while no case study is published. Empty = the track default (DEV-SEO: testimonials, MKT-SEO: metric strip).',
                  },
                },
                {
                  name: 'fallbackTestimonials',
                  type: 'relationship',
                  label: 'Fallback testimonials',
                  relationTo: 'testimonials',
                  hasMany: true,
                  maxDepth: 2,
                  admin: { condition: (_data, siblingData) => siblingData?.fallbackMode !== 'metricStrip' },
                },
                {
                  name: 'fallbackMetrics',
                  type: 'array',
                  label: 'Fallback metrics',
                  labels: { singular: 'Metric', plural: 'Metrics' },
                  admin: {
                    components: { RowLabel: rowLabel(['value', 'label'], 'Metric') },
                    condition: (_data, siblingData) => siblingData?.fallbackMode !== 'testimonials',
                    description: 'e.g. "5 / Vendors" → "1 / Team". Drag to reorder.',
                  },
                  fields: metricFields(),
                },
                { name: 'fallbackNote', type: 'textarea', label: 'Fallback note' },
              ],
            },
          ],
        },
        {
          label: 'FAQ',
          admin: {
            condition: isArticle,
            description: 'Questions for this article (DEV-SEO and MKT-SEO only). Also published as FAQ rich results.',
          },
          fields: [
            {
              name: 'faqHeading',
              type: 'text',
              label: 'FAQ heading',
              admin: { description: 'e.g. "On consolidating your marketing".' },
            },
            {
              name: 'faq',
              type: 'array',
              label: 'Questions',
              maxRows: 8,
              labels: { singular: 'Question', plural: 'Questions' },
              admin: {
                condition: isArticle,
                description: 'Up to 8. Drag to reorder.',
                components: { RowLabel: '/components/admin/FaqRowLabel#FaqRowLabel' },
              },
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'richText', required: true, editor: shortEditor },
              ],
            },
          ],
        },
        {
          label: 'Closing',
          fields: [
            {
              name: 'closing',
              type: 'group',
              label: 'Closing',
              admin: { description: 'Optional per-post headings. Empty = the site-wide defaults.' },
              fields: [
                {
                  name: 'newsletterHeading',
                  type: 'text',
                  label: 'Newsletter heading',
                  admin: { description: 'e.g. "More like this, monthly."' },
                },
                {
                  name: 'finalCtaHeading',
                  type: 'text',
                  label: 'Final CTA heading',
                  admin: { description: 'e.g. "Run the numbers on your setup with us."' },
                },
              ],
            },
          ],
        },
      ],
    },
    slugField({ overrides: slug.slugFieldOverrides }),
    {
      name: 'track',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'DEV-SEO article', value: 'dev-seo' },
        { label: 'MKT-SEO article', value: 'mkt-seo' },
        { label: 'Newsletter issue', value: 'newsletter-issue' },
      ],
      admin: { position: 'sidebar', description: 'Decides the page template and which sections appear.' },
    },
    {
      name: 'targetKeyword',
      type: 'text',
      label: 'Target keyword',
      admin: { position: 'sidebar', description: 'e.g. "Shopify development Chicago". Feeds the SEO title and FAQ eyebrow.' },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'team-members',
      maxDepth: 1,
      access: staffWrites,
      admin: { position: 'sidebar', description: '"By …, Duha Media". Set by staff in review.' },
    },
    {
      name: 'readTime',
      type: 'number',
      label: 'Read time',
      min: 1,
      admin: { position: 'sidebar', step: 1, description: 'Minutes. Leave empty to calculate from the body when publishing.' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Published',
      index: true,
      access: staffWrites,
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' },
        description: 'Set automatically on first publish.',
      },
    },
    {
      name: 'updatedAtDisplay',
      type: 'date',
      label: 'Updated (shown)',
      access: staffWrites,
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' },
        description: 'Optional "Updated …" date shown on the article.',
      },
    },
  ],
}
