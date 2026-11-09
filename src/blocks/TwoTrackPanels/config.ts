import type { Block } from 'payload'

import {
  accentPhraseAdminField,
  eyebrowField,
  headlineFields,
  linkField,
  pricingNote,
  validateAccentPhrase,
} from '../../fields'
import { rowLabel } from '../../components/admin/rowLabel'

/**
 * TwoTrackPanels block (SCHEMA §8.3 item 10). Variants: `equal` (homepage
 * "Two jobs. One team."; Home B redesign 2026-11-09: header with lede, two
 * text columns split by a hairline, big numeral, one-line lede, 3-stat row,
 * bullet points, link + small grey pricing note; no price tag), `contrast` (Services Hub "Why both together":
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
        { label: 'Doors (one reading column: title, paragraph with price note, link)', value: 'doors' },
      ],
      admin: { description: 'The panel layout. Equal = two paragraphs; Contrast = two "sold to you as" cards; Primary / secondary = a lead option plus a quieter alternative.' },
    },
    eyebrowField({ description: 'Optional small uppercase line above the headline.', defaultTick: false }),
    // Accent shows in Contrast and Equal (wine); the other layouts render it ink on ink.
    ...headlineFields({
      description: 'The section headline, e.g. "What we actually do".',
      accent: (_data, siblingData) => siblingData?.variant === 'contrast' || siblingData?.variant === 'equal',
    }),
    {
      name: 'intro',
      type: 'textarea',
      label: 'Intro line',
      admin: {
        description: 'Short lede shown on the right of the headline (Equal layout only). Leave empty to hide.',
        condition: (_data, siblingData) => siblingData?.variant === 'equal',
      },
    },
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
          name: 'accentPhrase',
          type: 'text',
          label: 'Accent phrase',
          validate: validateAccentPhrase('title'),
          admin: {
            components: { Field: accentPhraseAdminField('title') },
            description: 'Optional (Equal layout): one word or phrase copied from the title to show in wine, e.g. "grow it."',
            condition: isVariant('equal'),
          },
        },
        {
          name: 'accentTitle',
          type: 'checkbox',
          label: 'Show the title in the accent colour',
          defaultValue: false,
          admin: {
            description: 'In the Equal layout this makes the big 01/02 numeral wine (use the accent phrase below to colour part of the title).',
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
            description: 'Optional short items listed under the paragraph, e.g. "SEO". Drag to reorder. Leave empty to hide.',
            // Hidden since the Home B redesign (the Equal layout no longer renders chips); column kept, no migration.
            condition: () => false,
            initCollapsed: true,
          },
          fields: [{ name: 'label', type: 'text', required: true, maxLength: 40 }],
        },
        {
          name: 'stats',
          type: 'array',
          label: 'Stats (3-across row)',
          maxRows: 3,
          labels: { singular: 'Stat', plural: 'Stats' },
          admin: {
            components: { RowLabel: rowLabel(['value', 'label'], 'Stat') },
            description: 'Up to three figures between hairlines, e.g. "55hrs" / "Hands-on, per build". Leave empty to hide the row.',
            condition: isVariant('equal'),
            initCollapsed: true,
          },
          fields: [
            { name: 'value', type: 'text', required: true, maxLength: 12, admin: { description: 'The figure as it shows, e.g. "$7K", "3–4hrs".' } },
            { name: 'label', type: 'text', required: true, maxLength: 48, admin: { description: 'Small caption under the figure.' } },
            { name: 'accent', type: 'checkbox', label: 'Show the figure in wine', defaultValue: false },
          ],
        },
        {
          name: 'points',
          type: 'array',
          label: 'Points (bullets)',
          maxRows: 6,
          labels: { singular: 'Point', plural: 'Points' },
          admin: {
            components: { RowLabel: rowLabel(['lead', 'text'], 'Point') },
            description: 'Short bullets with a bold lead-in. Drag to reorder. Leave empty to hide.',
            condition: isVariant('equal'),
            initCollapsed: true,
          },
          fields: [
            { name: 'lead', type: 'text', required: true, maxLength: 80, admin: { description: 'Bold opening words, e.g. "Custom Shopify theme."' } },
            { name: 'text', type: 'text', maxLength: 160, admin: { description: 'The rest of the line (optional).' } },
          ],
        },
        {
          ...pricingNote(),
          admin: {
            ...pricingNote().admin,
            description:
              "Short note, e.g. 'Builds start at $7K'. A small grey inline note: beside the link in the Equal layout, under the text elsewhere.",
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
