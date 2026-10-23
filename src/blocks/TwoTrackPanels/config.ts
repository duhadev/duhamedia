import type { Block } from 'payload'

import { eyebrowField, headlineFields, linkField, pricingNote } from '../../fields'
import { rowLabel } from '../../components/admin/rowLabel'

/**
 * TwoTrackPanels block (SCHEMA §8.3 item 10). Variants: `equal` (homepage
 * "What we do"; unchanged), `contrast` (Services Hub "Why both together":
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
    ...headlineFields({ description: 'The section headline, e.g. "What we actually do".' }),
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
          admin: { condition: isVariant('equal', 'primary-secondary', 'doors') },
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
            description: 'What this track is. Runs on straight after the title.',
            condition: isVariant('equal', 'primary-secondary', 'doors'),
          },
        },
        {
          ...pricingNote(),
          admin: { ...pricingNote().admin, condition: isVariant('equal', 'primary-secondary', 'doors') },
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
