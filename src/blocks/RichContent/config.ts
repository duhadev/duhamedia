import {
  BlockquoteFeature,
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  ItalicFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
  UploadFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block, Condition, Field, RowField, TextField, TextFieldSingleValidation } from 'payload'
import { text } from 'payload/shared'

import { rowLabel } from '../../components/admin/rowLabel'
import { eyebrowField, headlineFields, linkField, metricFields, pricingNote, richTextLinkFeature } from '../../fields'

/**
 * Article body editor: every feature the article typography styles.
 * Headings are limited to H2-H4 (the page's only H1 is the Hero; the block
 * heading is the section H2). Images carry a caption ("Fig. 1 - ...").
 * The same editor serves `legal` (H2 = a section of the document and an
 * "On this page" link) and `band` (short prose; headings render as H3).
 */
const articleEditor = lexicalEditor({
  features: [
    ParagraphFeature(),
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
    BoldFeature(),
    ItalicFeature(),
    UnorderedListFeature(),
    OrderedListFeature(),
    BlockquoteFeature(),
    HorizontalRuleFeature(),
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

type Variant = 'article' | 'band' | 'legal'

/** Admin helper: show a field only for the listed variants (stored rows without a variant are `article`). */
const forVariants =
  (...variants: Variant[]): Condition =>
  (_data, siblingData) => variants.includes(((siblingData?.variant as Variant | undefined) ?? 'article') as Variant)

/**
 * The shared eyebrow row, with the diamond checkbox shown for `article` only:
 * the band, legal and callout eyebrows are the muted, tick-less DS Eyebrow in
 * every design (DEV-SEO / MKT-SEO "DIY vs done", Legal.dc.html).
 * Admin-only change: field names and DB shape are the factory's.
 */
const eyebrowRow = (): RowField => {
  const row = eyebrowField({ description: 'Optional small uppercase line above the heading.' })
  return {
    ...row,
    fields: row.fields.map((f) =>
      'name' in f && f.name === 'eyebrowTick' ? { ...f, admin: { ...f.admin, condition: forVariants('article') } } : f,
    ) as RowField['fields'],
  }
}

/**
 * The shared heading pair. `legal` renders the heading as the page's only H1
 * (p20 has no Hero), so it is required to publish there; for `article` and
 * `band` it stays optional. Same field, same DB column: only `validate` and the
 * admin description are layered on.
 */
const headingFields = (): Field[] =>
  headlineFields({
    required: false,
    description:
      'Article and grey band: optional heading above the text. Legal document: the document title (required; it is the page title, e.g. "Privacy Policy").',
  }).map((f): Field => {
    if (!('name' in f) || f.name !== 'heading' || f.type !== 'text') return f
    const validate: TextFieldSingleValidation = (value, options) => {
      const base = text(value, options)
      if (base !== true) return base
      const variant = (options.siblingData as { variant?: string } | undefined)?.variant
      if (variant === 'legal' && (typeof value !== 'string' || value.trim() === '')) {
        return 'A legal document needs its title (it is the main heading of the page).'
      }
      return true
    }
    return { ...(f as TextField), validate } as TextField
  })

/**
 * RichContent (SCHEMA §8.3 item 13). Variants: `article` (p2 case-study body,
 * p8 About, p13/p14 article body, + optional `callout` box), `band` (p13 DIY vs
 * done + Educational, p14 DIY bridge + How Duha does it) and `legal` (p20).
 */
export const RichContent: Block = {
  slug: 'richContent',
  interfaceName: 'RichContentBlock',
  labels: { singular: 'Rich content', plural: 'Rich content blocks' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'article',
      options: [
        { label: 'Article (long-form text with numbered sections and figures)', value: 'article' },
        { label: 'Band (eyebrow, heading, short text, up to three facts and a link)', value: 'band' },
        { label: 'Legal document (title, last-updated date, "On this page" links)', value: 'legal' },
      ],
      admin: {
        description:
          'The text layout. Legal document is for Privacy / Terms / Cookies / GDPR pages and shows the page title itself (no Hero above it).',
      },
    },
    eyebrowRow(),
    ...headingFields(),
    {
      name: 'numberSections',
      type: 'checkbox',
      label: 'Number the section headings',
      defaultValue: true,
      admin: {
        condition: forVariants('article'),
        description:
          'Adds 01, 02, 03… above every big (H2) heading in the text, in order. Untick for text where numbers would be wrong.',
      },
    },
    {
      name: 'lastUpdated',
      type: 'date',
      label: 'Last updated',
      admin: {
        condition: forVariants('legal'),
        date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' },
        description: 'Shown under the title. Leave empty to hide the line.',
      },
    },
    {
      type: 'row',
      admin: { condition: forVariants('legal') },
      fields: [
        {
          name: 'lastUpdatedLabel',
          type: 'text',
          label: 'Date line text',
          defaultValue: 'Last updated',
          admin: { width: '50%', description: 'Words before the date, e.g. "Last updated".' },
        },
        {
          name: 'navLabel',
          type: 'text',
          label: 'Section links title',
          defaultValue: 'On this page',
          admin: { width: '50%', description: 'Title of the list of section links beside / above the document.' },
        },
      ],
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      editor: articleEditor,
      admin: {
        description:
          'Use "Heading 2" for each section title: in Article they are numbered, in Legal document each one becomes a link under "On this page" (keep them short). Type "/" or use the toolbar to add an image with a caption, a quote or a divider (Article only).',
      },
    },
    {
      name: 'facts',
      type: 'array',
      label: 'Facts',
      maxRows: 3,
      labels: { singular: 'Fact', plural: 'Facts' },
      admin: {
        condition: forVariants('band'),
        description:
          'Optional: up to three big numbers in a strip under the text (counts, timelines, results). Never a price — prices go in the price note. Leave empty for no strip.',
        components: { RowLabel: rowLabel(['value', 'label'], 'Fact') },
      },
      fields: metricFields(),
    },
    {
      ...pricingNote(),
      admin: {
        ...pricingNote().admin,
        condition: forVariants('band'),
        description:
          "Optional small quiet line under the facts (or the text), e.g. 'Builds start at $5K'. The only place a price may appear in this band.",
      },
    },
    {
      ...linkField({
        name: 'link',
        label: 'Link',
        description: 'Optional button under the text. Leave empty for none.',
      }),
      admin: {
        condition: forVariants('band'),
        description: 'Optional button under the text. Leave empty for none.',
      },
    },
    {
      type: 'row',
      admin: { condition: forVariants('band') },
      fields: [
        {
          name: 'tone',
          type: 'select',
          label: 'Background',
          defaultValue: 'grey',
          options: [
            { label: 'Grey band', value: 'grey' },
            { label: 'White', value: 'light' },
          ],
          admin: { width: '50%', isClearable: false },
        },
        {
          name: 'framed',
          type: 'checkbox',
          label: 'Draw a box around the content',
          defaultValue: false,
          admin: {
            width: '50%',
            description: 'The black-outlined "How we do it" box. Usually with the White background.',
          },
        },
      ],
    },
    {
      name: 'callout',
      type: 'group',
      label: 'Closing box',
      admin: {
        condition: forVariants('article'),
        description:
          'Optional black-outlined box at the end of the text (e.g. "How we do it" with a link). Leave everything empty for no box.',
      },
      fields: [
        { name: 'eyebrow', type: 'text', admin: { description: 'Small grey uppercase line at the top of the box.' } },
        {
          name: 'body',
          type: 'textarea',
          admin: { description: 'A few sentences. No prices here — keep pricing to the pricing notes.' },
        },
        linkField({ name: 'link', label: 'Button', description: 'Optional button inside the box.' }),
      ],
    },
  ],
}
