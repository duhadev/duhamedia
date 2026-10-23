import type { Block, Condition, Field, TextFieldSingleValidation } from 'payload'
import { text } from 'payload/shared'

import { eyebrowField, headlineFields, LINK_TARGETS, linkField, metricFields, pricingNote, validateYouTubeUrl } from '../../fields'
import { rowLabel } from '../../components/admin/rowLabel'

/**
 * Hero block (SCHEMA §8.1 item 1). Variants: `typographic` (homepage, p3 +
 * `stats`, p4 + `phaseStrip`, p7/p9-p12 compact, p16/p18 + the form slot),
 * `service` (p5/p6), `article` (p2, p8 and the p13/p14 article templates, +
 * `standfirst`) and `vsl` (p15 Campaign LP Hero A: headline + video + one CTA).
 */

/** Admin helper: show a field only for the listed variants. */
const forVariants =
  (...variants: string[]): Condition =>
  (_data, siblingData) => variants.includes((siblingData?.variant as string | undefined) ?? 'typographic')

/** Breadcrumb address: a site path (/…) or an https:// address; empty is allowed. */
const validateCrumbUrl: TextFieldSingleValidation = (value, options) => {
  const base = text(value, options)
  if (base !== true) return base
  if (typeof value !== 'string' || value.trim() === '') return true
  const v = value.trim()
  if (/^\/(?!\/)/.test(v)) return true
  try {
    if (new URL(v).protocol === 'https:') return true
  } catch {
    /* falls through to the message */
  }
  return 'Use a site path starting with "/" or a full https:// address.'
}

export const Hero: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'typographic',
      options: [
        { label: 'Typographic (cream, dot matrix, wine logo shape)', value: 'typographic' },
        { label: 'Service (dark band with a breadcrumb bar)', value: 'service' },
        { label: 'Article (case study / article header)', value: 'article' },
        { label: 'Video (campaign landing page: headline, video, one button)', value: 'vsl' },
      ],
      admin: { description: 'The hero layout. More layouts arrive with the pages that need them.' },
    },
    {
      name: 'size',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default (large, homepage proportions)', value: 'default' },
        { label: 'Compact (shorter, narrow column, small corner logo shape)', value: 'compact' },
      ],
      admin: {
        description:
          'Compact is the shorter header used on the testimonials, book-a-call, thank-you, FAQ and contact pages: less padding, a narrow text column and a small logo shape tucked in the corner.',
        condition: forVariants('typographic'),
      },
    },
    {
      name: 'width',
      type: 'select',
      label: 'Text column width',
      options: [
        { label: 'Narrow (820px reading column)', value: 'narrow' },
        { label: 'Wide (full site width)', value: 'wide' },
      ],
      admin: {
        description:
          'Compact heroes only. Narrow keeps the text in a tight column; wide lets it span the full page width. Left empty, the hero picks automatically (wide when it shows figures or the average rating, otherwise narrow).',
        condition: (_data, siblingData) => siblingData?.variant === 'typographic' && siblingData?.size === 'compact',
      },
    },
    eyebrowField({
      description: 'Small uppercase line above the headline, e.g. "Integrated ecommerce growth partner — Chicago".',
    }),
    // The video layout shows its headline without an accent (Campaign LP.dc.html "Hero variant A — VSL").
    ...headlineFields({ description: 'The page headline (the only h1 on the page). Shown in capitals.' }).map((field) =>
      'name' in field && field.name === 'accentPhrase'
        ? ({ ...field, admin: { ...field.admin, condition: (_data, siblingData) => siblingData?.variant !== 'vsl' } } as Field)
        : field,
    ),
    {
      name: 'badge',
      type: 'group',
      label: 'Authority badge',
      admin: {
        description: 'Dark pill under the headline, e.g. "$X.XM client revenue tracked".',
        condition: forVariants('typographic'),
      },
      fields: [
        {
          name: 'show',
          type: 'checkbox',
          label: 'Show the badge',
          defaultValue: true,
        },
        {
          name: 'text',
          type: 'text',
          admin: { description: 'Badge text. Leave empty to hide the badge.', condition: (_data, siblingData) => siblingData?.show !== false },
        },
      ],
    },
    {
      name: 'body',
      type: 'textarea',
      admin: {
        description:
          'The supporting paragraph under the headline. In the article layout it is the left line of the thin rule under the headline (e.g. the engagement scope).',
      },
    },
    {
      name: 'standfirst',
      type: 'textarea',
      label: 'Standfirst',
      admin: {
        description:
          'Article layout: the one- or two-sentence introduction between the headline and the thin byline rule (articles feed it from their "Dek"). Leave empty to skip it.',
        condition: forVariants('article'),
      },
    },
    {
      ...pricingNote(),
      admin: { ...pricingNote().admin, condition: forVariants('typographic', 'service') },
    },
    {
      name: 'ctas',
      type: 'array',
      label: 'Buttons',
      maxRows: 2,
      labels: { singular: 'Button', plural: 'Buttons' },
      admin: {
        components: { RowLabel: rowLabel(['link.label'], 'Button') },
        description:
          'Up to two. The first is the solid main button, the second is the outlined one. The video layout shows only the first (one button, e.g. Book a Call).',
        initCollapsed: false,
        condition: forVariants('typographic', 'service', 'vsl'),
      },
      fields: [linkField({ name: 'link', label: 'Button', required: true })],
    },
    {
      name: 'callouts',
      type: 'array',
      label: 'Two-up callouts',
      maxRows: 2,
      labels: { singular: 'Callout', plural: 'Callouts' },
      admin: {
        components: { RowLabel: rowLabel(['label'], 'Callout') },
        description:
          'Short bold-label statements under the paragraph, side by side on desktop, e.g. "What it is:" / "What it isn\'t:".',
        initCollapsed: true,
        condition: forVariants('typographic'),
      },
      fields: [
        { name: 'label', type: 'text', required: true, admin: { description: 'Bold lead-in, e.g. "What it is:".' } },
        { name: 'text', type: 'textarea', required: true, admin: { description: 'The statement after the label.' } },
      ],
    },
    {
      name: 'showAggregateRating',
      type: 'checkbox',
      label: 'Show the average rating',
      defaultValue: false,
      admin: {
        description:
          'Adds the average star rating and count to the line above the headline (e.g. "Testimonials · 5.0 avg · 12 ratings"). Calculated from published testimonials that have a rating; if none do, nothing is shown.',
        condition: forVariants('typographic'),
      },
    },
    {
      name: 'subNote',
      type: 'text',
      label: 'Small note under the buttons',
      admin: {
        description: 'Optional quiet line, e.g. a minimum-term note.',
        condition: forVariants('typographic', 'service'),
      },
    },
    {
      name: 'verticalMicrocopy',
      type: 'text',
      label: 'Side microcopy',
      admin: {
        description:
          'Short uppercase line, e.g. "Build · Operate · Hand over". Runs vertically down the left on desktop; sits under the paragraph on mobile.',
        condition: forVariants('typographic'),
      },
    },
    {
      name: 'geometry',
      type: 'checkbox',
      label: 'Show the wine logo shape',
      defaultValue: true,
      admin: {
        description: 'The large decorative logo silhouette behind the headline.',
        condition: forVariants('typographic', 'article', 'vsl'),
      },
    },
    {
      name: 'video',
      type: 'group',
      label: 'Video',
      admin: {
        description:
          'The video under the headline. It loads only when a visitor presses play (privacy-friendly YouTube player). If the link is missing, the video tile is left out.',
        condition: forVariants('vsl'),
      },
      fields: [
        {
          name: 'url',
          type: 'text',
          label: 'YouTube link',
          required: true,
          validate: validateYouTubeUrl,
          admin: { description: 'The YouTube link of the video (unlisted videos work), e.g. https://youtu.be/…' },
        },
        {
          name: 'poster',
          type: 'upload',
          relationTo: 'media',
          maxDepth: 1,
          required: true,
          label: 'Poster image',
          admin: { description: 'The still frame shown before the video plays (16:9 works best).' },
        },
      ],
    },
    {
      name: 'showForm',
      type: 'checkbox',
      label: 'Show a signup form in the hero',
      defaultValue: false,
      admin: {
        description:
          'Puts a form inside the hero (newsletter page: the signup card beside the headline; download pages: the email row under the paragraph).',
        condition: forVariants('typographic'),
      },
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      maxDepth: 1,
      label: 'Form',
      admin: {
        description:
          'The form to show (Forms collection). Leave empty to use the newsletter form chosen in Site settings. If the form is deleted, the hero shows without it.',
        condition: (_data, siblingData) => (siblingData?.variant ?? 'typographic') === 'typographic' && siblingData?.showForm === true,
      },
    },
    {
      name: 'formStyle',
      type: 'select',
      label: 'Form style',
      defaultValue: 'card',
      options: [
        { label: 'Card (grey box with its own heading, beside the headline on desktop)', value: 'card' },
        { label: 'Inline (email row straight under the paragraph)', value: 'inline' },
      ],
      admin: {
        description:
          'Card is the newsletter-page layout: the box sits in a right-hand column on desktop and the key figures move under the paragraph. Inline keeps the normal hero layout and adds the form under the paragraph.',
        condition: (_data, siblingData) => (siblingData?.variant ?? 'typographic') === 'typographic' && siblingData?.showForm === true,
      },
    },
    {
      name: 'formHeading',
      type: 'text',
      label: 'Card heading',
      admin: {
        description: 'Heading inside the card, e.g. "Join the list". Leave empty for no heading.',
        condition: (_data, siblingData) =>
          (siblingData?.variant ?? 'typographic') === 'typographic' && siblingData?.showForm === true && siblingData?.formStyle !== 'inline',
      },
    },
    {
      name: 'formBody',
      type: 'textarea',
      label: 'Card text',
      admin: {
        description: 'Quiet line under the card heading, e.g. "Unsubscribe anytime. We never sell the list."',
        condition: (_data, siblingData) =>
          (siblingData?.variant ?? 'typographic') === 'typographic' && siblingData?.showForm === true && siblingData?.formStyle !== 'inline',
      },
    },
    {
      name: 'submitLabel',
      type: 'text',
      label: 'Button text',
      admin: {
        description: 'Text on the form\'s send button, e.g. "Join" or "Get the download". Leave empty to use the button text set on the form itself.',
        condition: (_data, siblingData) => (siblingData?.variant ?? 'typographic') === 'typographic' && siblingData?.showForm === true,
      },
    },
    {
      name: 'formNote',
      type: 'text',
      label: 'Note under the form',
      admin: {
        description: 'Small grey line under the form, e.g. "Email delivery. One send, plus the monthly newsletter if you opt in."',
        condition: (_data, siblingData) => (siblingData?.variant ?? 'typographic') === 'typographic' && siblingData?.showForm === true,
      },
    },
    {
      name: 'breadcrumb',
      type: 'array',
      label: 'Breadcrumb',
      maxRows: 4,
      labels: { singular: 'Crumb', plural: 'Crumbs' },
      admin: {
        components: { RowLabel: rowLabel(['label'], 'Crumb') },
        description:
          'The trail above the headline, e.g. Services / Shopify theme development / Phase 01. The LAST crumb is the current page and never links. Leave a middle crumb without a destination to show it as plain text.',
        initCollapsed: false,
        condition: forVariants('service', 'article'),
      },
      fields: [
        { name: 'label', type: 'text', required: true, admin: { description: 'The crumb text.' } },
        {
          type: 'row',
          fields: [
            {
              name: 'page',
              type: 'relationship',
              relationTo: [...LINK_TARGETS],
              maxDepth: 1,
              label: 'Page',
              admin: { width: '50%', description: 'Pick a page on this site, or use the address instead.' },
            },
            {
              name: 'url',
              type: 'text',
              label: 'Address (instead of a page)',
              validate: validateCrumbUrl,
              admin: { width: '50%', description: 'A site path like /work or a full https:// address.' },
            },
          ],
        },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Key figures',
      maxRows: 5,
      labels: { singular: 'Figure', plural: 'Key figures' },
      admin: {
        components: { RowLabel: rowLabel(['value', 'label'], 'Figure') },
        description:
          'Short facts shown beside the headline on desktop and as a strip under it on mobile (article: a facts strip under the intro, e.g. Based / Scope / Capacity / Read), e.g. "$3.1M" / "Client revenue added". Results or counts only, never a price.',
        initCollapsed: true,
        condition: forVariants('typographic', 'service', 'article'),
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'value', type: 'text', required: true, admin: { width: '40%', description: 'The figure, e.g. "$3.1M".' } },
            { name: 'label', type: 'text', required: true, admin: { width: '60%', description: 'What it measures.' } },
          ],
        },
      ],
    },
    {
      name: 'phaseStrip',
      type: 'array',
      label: 'Phase strip',
      maxRows: 3,
      labels: { singular: 'Phase', plural: 'Phases' },
      admin: {
        components: { RowLabel: rowLabel(['number', 'label'], 'Phase') },
        description:
          'A compact three-step strip under the buttons, e.g. 01 Build / 02 Operate / 03 Independence. The last step is always shown at full weight.',
        initCollapsed: true,
        condition: forVariants('typographic'),
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'number', type: 'text', required: true, admin: { width: '25%', description: 'e.g. "01".' } },
            { name: 'label', type: 'text', required: true, admin: { width: '75%', description: 'The step name, e.g. "Build", "Operate", "Independence".' } },
          ],
        },
      ],
    },
    {
      name: 'resultMetric',
      type: 'group',
      label: 'Result metric',
      admin: {
        description: 'The oversized result figure under the headline, e.g. "+212%" / "Revenue, 12 months". Results only, never a price.',
        condition: forVariants('article'),
      },
      fields: metricFields({ required: false }),
    },
    {
      name: 'metaLine',
      type: 'text',
      label: 'Meta line',
      admin: {
        description: 'Right side of the thin rule under the headline: byline, date and read time as plain text.',
        condition: forVariants('article'),
      },
    },
    {
      name: 'summary',
      type: 'group',
      label: 'Summary box',
      admin: { description: 'The grey "In short" box.', condition: forVariants('article') },
      fields: [
        { name: 'label', type: 'text', defaultValue: 'In short', admin: { description: 'Small uppercase title of the box.' } },
        { name: 'body', type: 'textarea', admin: { description: 'The summary. Leave empty to hide the whole box.' } },
      ],
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      maxDepth: 1,
      label: 'Lead image',
      admin: { description: 'Image shown under the header (a screenshot of the work, for example).', condition: forVariants('article') },
    },
    {
      name: 'mediaFrame',
      type: 'select',
      label: 'Image frame',
      defaultValue: 'none',
      options: [
        { label: 'None (plain image)', value: 'none' },
        { label: 'Browser window frame', value: 'browser' },
        { label: 'Full width, edge to edge', value: 'full-bleed' },
      ],
      admin: { description: 'How the lead image is presented.', condition: forVariants('article') },
    },
  ],
}
