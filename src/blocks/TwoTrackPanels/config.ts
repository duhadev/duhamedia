import type { Block } from 'payload'

import { eyebrowField, headlineFields, linkField, pricingNote } from '../../fields'
import { rowLabel } from '../../components/admin/rowLabel'

/**
 * TwoTrackPanels block (SCHEMA §8.3 item 10). Variants: `equal` (homepage
 * "What we do"; restyled 2026-10-29 as two cards with number tags, paragraph +
 * **bold** body, optional service chips and a price-tag footer; the price tag
 * is a human-approved exception to the small-inline-pricing rule for this
 * variant only), `contrast` (Services Hub "Why both together":
 * struck claim + reality line per panel, then a conclusion) and
 * `primary-secondary` (Shopify page "Where people usually start": first panel
 * full weight, second visibly softer). New fields are optional / variant
 * conditional, so existing `equal` documents are untouched.
 */
const isVariant =
  (...vs: string[]) =>
  (_data: unknown, _sibling: unknown, ctx?: { blockData?: { variant?: unknown } }) =>
    vs.includes(String(ctx?.blockData?.variant ?? 'equal'))

export const TwoTrackPanels: Block = {
  slug: 'twoTrackPanels',
  interfaceName: 'TwoTrackPanelsBlock',
  labels: { singular: 'Two Track Panels', plural: 'Two Track Panels' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'equal',
      options: [
        { label: 'Equal (two tracks, same weight)', value: 'equal' },
        { label: 'Contrast (struck claim vs reality, then a conclusion)', value: 'contrast' },
        { label: 'Primary / secondary (first track full weight, second softer)', value: 'primary-secondary' },
        { label: 'Doors (two linked cards: title, paragraph, button)', value: 'doors' },
      ],
      admin: { description: 'The panel layout. Equal = two paragraphs; Contrast = two "sold to you as" cards; Primary / secondary = a lead option plus a quieter alternative.' },
    },
    eyebrowField({ description: 'Optional small uppercase line above the headline.', defaultTick: false }),
    // Accent shows only in Contrast (wine); the other layouts render it ink on ink.
    ...headlineFields({
      description: 'The section headline, e.g. "What we actually do".',
      accent: (_data, siblingData) => siblingData?.variant === 'contrast',
    }),
    {
      name: 'panels',
      type: 'array',
      label: 'Tracks',
      minRows: 2,
      maxRows: 2,
      labels: { singular: 'Track', plural: 'Tracks' },
      admin: {
        components: { RowLabel: rowLabel(['label', 'title'], 'Track') },
        description: 'Exactly two tracks, shown in this order.',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          admin: {
            description:
              'Optional small uppercase tag above the track, e.g. "Phase 1". In the Contrast layout this is the small label above the struck claim (e.g. "Sold to you as").',
            condition: isVariant('equal', 'contrast', 'primary-secondary'),
          },
        },
        {
          name: 'claim',
          type: 'text',
          admin: {
            description: 'The claim that was sold, shown struck through, quotes included, e.g. "We\'ll build you a beautiful store."',
            condition: isVariant('contrast'),
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description:
              'The track lead-in, shown in capitals, e.g. "First, we build it." In the Contrast layout this is the reality line under the struck claim.',
          },
        },
        {
          name: 'accentTitle',
          type: 'checkbox',
          label: 'Show the title in the accent colour',
          defaultValue: false,
          admin: {
            description: 'In the Equal layout this also gives the card a wine left edge and a wine price tag.',
            condition: isVariant('equal', 'primary-secondary', 'doors'),
          },
        },
        {
          name: 'body',
          type: 'textarea',
          // Not `required: true`: that would make the DB column NOT NULL, and the Contrast
          // layout has no body. Required for the other two layouts via validate.
          validate: (value: string | null | undefined, { blockData }: { blockData?: { variant?: unknown } }) =>
            blockData?.variant === 'contrast' || (typeof value === 'string' && value.trim() !== '')
              ? true
              : 'This field is required.',
          admin: {
            description:
              'What this track is. Leave a blank line between paragraphs to start a new paragraph. Wrap a phrase in **double asterisks** to make it bold.',
            condition: isVariant('equal', 'primary-secondary', 'doors'),
          },
        },
        {
          name: 'services',
          type: 'array',
          label: 'Services (chips)',
          maxRows: 8,
          labels: { singular: 'Service', plural: 'Services' },
          admin: {
            components: { RowLabel: rowLabel(['label'], 'Service') },
            description: 'Optional small bordered chips under the paragraph, e.g. "SEO". Drag to reorder. Leave empty to hide.',
            condition: isVariant('equal'),
            initCollapsed: true,
          },
          fields: [{ name: 'label', type: 'text', required: true, maxLength: 40 }],
        },
        {
          ...pricingNote(),
          admin: {
            ...pricingNote().admin,
            description:
              "Short note, e.g. 'Builds start at $5K'. In the Equal layout it shows as a tag at the foot of the card with the amount ($5K, $1K/mo) enlarged; elsewhere it is a small inline note.",
            condition: isVariant('equal', 'primary-secondary', 'doors'),
          },
        },
        {
          ...linkField({
            name: 'link',
            label: 'Link',
            description: 'Optional "how it works" link after the paragraph, e.g. "How the build works →".',
          }),
          admin: {
            description: 'Optional "how it works" link after the paragraph, e.g. "How the build works →".',
            condition: isVariant('equal', 'primary-secondary', 'doors'),
          },
        },
      ],
    },
    {
      name: 'conclusion',
      type: 'textarea',
      admin: {
        description: 'Closing statement under the two tracks (Contrast and Primary / secondary layouts). Leave empty to hide.',
        condition: isVariant('contrast', 'primary-secondary', 'doors'),
      },
    },
  ],
}
