import type { Block, Condition } from 'payload'

import {
  accentPhraseAdminField,
  eyebrowField,
  headlineFields,
  linkField,
  metricFields,
  neverShown,
  pricingNote,
  validateAccentPhrase,
} from '../../fields'
import { rowLabel } from '../../components/admin/rowLabel'

/**
 * CaseStudyCards block (SCHEMA §8.2 item 6).
 * - B3 (p1): the `cards` layout with fallback modes `ledger` and `note`.
 * - S4-2 (p2, p3, p5, p6): layouts `ledger` (p3 §Study ledger, Load More) and
 *   `next-link` (p2 §Next study), the `track` source, `tone`, and the
 *   `testimonials` / `metric-strip` fallback modes with their fields.
 *   Not built (flagged): the `staggered` layout (Gate S Q1 default: the Work
 *   page uses the ledger look).
 * - S5-4 (p8): the `logo-strip` fallback mode (client logo row) and its
 *   optional `fallbackLogos` override.
 *
 * LAUNCH STATE (CLAUDE.md rule 1, SCHEMA §5): there is deliberately NO field
 * that forces the "live" state. The component renders cards only from
 * PUBLISHED case studies; with none, it renders the designed fallback.
 */

type Sibling = Record<string, unknown> | undefined
const layoutOf = (s: Sibling): string => (typeof s?.layout === 'string' ? s.layout : 'cards')
const modeOf = (s: Sibling): string => (typeof s?.fallbackMode === 'string' ? s.fallbackMode : 'ledger')

const isManual: Condition = (_data, siblingData) => siblingData?.source === 'manual'
const isTrack: Condition = (_data, siblingData) => siblingData?.source === 'track'
const isCards: Condition = (_data, siblingData) => layoutOf(siblingData) === 'cards'
const isLedgerLayout: Condition = (_data, siblingData) => layoutOf(siblingData) === 'ledger'
const isLoadMore: Condition = (_data, siblingData) => layoutOf(siblingData) === 'ledger' && siblingData?.loadMore === true
const isNextLink: Condition = (_data, siblingData) => layoutOf(siblingData) === 'next-link'
const notNextLink: Condition = (_data, siblingData) => layoutOf(siblingData) !== 'next-link'
const hasFallbackMetrics: Condition = (_data, siblingData) =>
  layoutOf(siblingData) !== 'next-link' && ['ledger', 'metric-strip'].includes(modeOf(siblingData))
const isLogoStripFallback: Condition = (_data, siblingData) =>
  layoutOf(siblingData) !== 'next-link' && modeOf(siblingData) === 'logo-strip'
const isTestimonialsFallback: Condition = (_data, siblingData) =>
  layoutOf(siblingData) !== 'next-link' && modeOf(siblingData) === 'testimonials'

export const CaseStudyCards: Block = {
  slug: 'caseStudyCards',
  interfaceName: 'CaseStudyCardsBlock',
  labels: { singular: 'Case study cards', plural: 'Case study cards' },
  fields: [
    {
      name: 'layout',
      type: 'select',
      required: true,
      defaultValue: 'cards',
      options: [
        { label: 'Cards (1–3 study cards in a row)', value: 'cards' },
        { label: 'Ledger (numbered rows, one per study, e.g. the Work page)', value: 'ledger' },
        { label: 'Next study (one boxed line linking to the next study)', value: 'next-link' },
      ],
      admin: {
        description:
          'The layout of the studies. "Next study" is meant for the case-study template: it links to the study after the one being read.',
      },
    },
    {
      name: 'tone',
      type: 'select',
      // Optional (empty = White) so rows saved before this field existed stay valid.
      defaultValue: 'light',
      label: 'Background',
      options: [
        { label: 'White', value: 'light' },
        { label: 'Light grey band', value: 'grey' },
      ],
      admin: { description: 'Background colour of the whole section (live and fallback).' },
    },
    eyebrowField({ description: 'Small uppercase line above the headline (shown only when studies are live).' }),
    ...headlineFields({
      required: false,
      description: 'Headline shown above the study cards, e.g. "The work, in numbers." Shown only when studies are live.',
      accent: false, // rendered in --accent-primary = ink, same as the headline
    }),
    {
      name: 'source',
      type: 'select',
      required: true,
      defaultValue: 'featured',
      options: [
        { label: 'Featured studies (ticked "Featured" on the study)', value: 'featured' },
        { label: 'Latest published studies', value: 'latest' },
        { label: 'Studies of one or more engagement types', value: 'track' },
        { label: 'Pick studies by hand', value: 'manual' },
      ],
      admin: {
        description:
          'Which studies appear. Only PUBLISHED studies ever show; a draft study is never shown, even if picked here. For "Next study", anything but "Pick by hand" means: the next study after the one being read.',
      },
    },
    {
      name: 'track',
      type: 'select',
      hasMany: true,
      label: 'Engagement types',
      options: [
        { label: 'Build', value: 'build' },
        { label: 'Growth engine', value: 'growth' },
        { label: 'Build + engine', value: 'build-and-growth' },
        { label: 'Handover complete', value: 'handover' },
      ],
      admin: {
        condition: isTrack,
        description:
          'Show studies whose engagement type is any of these, e.g. Build + "Build + engine" on the Shopify page, Growth engine + "Build + engine" on the Marketing page.',
      },
    },
    {
      name: 'caseStudies',
      type: 'relationship',
      relationTo: 'case-studies',
      hasMany: true,
      // 2 so each study's own `client` and `heroMedia` populate (nested population is capped at maxDepth).
      maxDepth: 2,
      label: 'Studies to show',
      admin: {
        condition: isManual,
        description:
          'Pick studies in order (cards show up to three; "Next study" uses the first). Draft studies are skipped on the site until they are published.',
      },
    },
    {
      name: 'limit',
      type: 'number',
      min: 1,
      max: 3,
      defaultValue: 3,
      admin: { step: 1, condition: isCards, description: 'How many cards to show (1 to 3).' },
    },
    {
      name: 'cardLinkLabel',
      type: 'text',
      label: 'Card link text',
      defaultValue: 'Read the case study',
      admin: { condition: isCards, description: 'The underlined text at the bottom of every card.' },
    },
    {
      type: 'row',
      admin: { condition: isLedgerLayout },
      fields: [
        {
          name: 'pageSize',
          type: 'number',
          label: 'Rows per load',
          min: 1,
          max: 24,
          defaultValue: 6,
          admin: { step: 1, width: '50%', description: 'How many rows show at first (and per "Load more" click).' },
        },
        {
          name: 'loadMore',
          type: 'checkbox',
          label: 'Show a "Load more" button',
          defaultValue: true,
          admin: {
            width: '50%',
            description: 'Adds the next rows under the list on click (no page numbers). Hidden when every study is already shown.',
          },
        },
      ],
    },
    {
      type: 'row',
      admin: { condition: isLoadMore },
      fields: [
        {
          name: 'loadMoreLabel',
          type: 'text',
          label: 'Button text',
          defaultValue: 'Load more studies',
          admin: { width: '34%' },
        },
        {
          name: 'loadMoreLoadingLabel',
          type: 'text',
          label: 'Button text while loading',
          defaultValue: 'Loading…',
          admin: { width: '33%' },
        },
        {
          name: 'loadMoreErrorLabel',
          type: 'text',
          label: 'Message if loading fails',
          defaultValue: 'Could not load more studies. Try again.',
          admin: { width: '33%' },
        },
      ],
    },
    {
      name: 'ledgerLabels',
      type: 'group',
      label: 'Ledger labels',
      admin: { condition: isLedgerLayout, description: 'Fixed text of the ledger. The rows themselves come from the studies.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'number', type: 'text', label: 'Number column heading', defaultValue: '№', admin: { width: '25%' } },
            { name: 'client', type: 'text', label: 'Client column heading', defaultValue: 'Client', admin: { width: '25%' } },
            {
              name: 'summary',
              type: 'text',
              label: 'Summary column heading',
              defaultValue: 'What was leaking / what we changed',
              admin: { width: '25%' },
            },
            { name: 'metric', type: 'text', label: 'Result column heading', defaultValue: 'Returned', admin: { width: '25%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'kind',
              type: 'text',
              label: 'Row tag (small screens)',
              defaultValue: 'Case study',
              admin: { width: '50%', description: 'Shown after the client name on phones, e.g. "Client A · Case study".' },
            },
            {
              name: 'readLabel',
              type: 'text',
              label: 'Row link text (small screens)',
              defaultValue: 'Read the study →',
              admin: { width: '50%', description: 'Bottom line of every row on phones. Large screens show an arrow.' },
            },
          ],
        },
      ],
    },
    {
      name: 'nextLabels',
      type: 'group',
      label: 'Next study labels',
      admin: { condition: isNextLink },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', label: 'Small label', defaultValue: 'Next study', admin: { width: '50%' } },
            { name: 'readLabel', type: 'text', label: 'Link text', defaultValue: 'Read it →', admin: { width: '50%' } },
          ],
        },
      ],
    },
    linkField({
      name: 'allLink',
      label: '"All studies" link',
      description:
        'Optional link, e.g. "All studies →". Cards: under the cards, only when studies are live. Next study: shown on its own when there is no other published study to link to.',
    }),
    {
      name: 'fallbackMode',
      type: 'select',
      required: true,
      defaultValue: 'ledger',
      label: 'When no study is published',
      options: [
        { label: 'Ledger: a short text block beside a ruled list of facts', value: 'ledger' },
        { label: 'Note: a short text block only', value: 'note' },
        { label: 'Testimonials: the headline, then picked client quotes', value: 'testimonials' },
        { label: 'Metric strip: the text block, then a grey strip of up to three facts', value: 'metric-strip' },
        { label: 'Logo strip: the text block, then the client logos (falls back to the note if there are none)', value: 'logo-strip' },
      ],
      admin: {
        condition: notNextLink,
        description:
          'What this section shows while no case study is published (and again if all are unpublished). It switches to the cards on its own once a study is published.',
      },
    },
    {
      name: 'fallbackEyebrow',
      type: 'text',
      label: 'Fallback eyebrow',
      defaultValue: 'The numbers we can show',
      admin: {
        condition: notNextLink,
        description: 'Small uppercase line above the fallback headline. In Testimonials mode it sits above the quotes, e.g. "What clients say".',
      },
    },
    {
      name: 'fallbackHeading',
      type: 'text',
      label: 'Fallback headline',
      defaultValue: 'Numbers anyway.',
      admin: { condition: notNextLink, description: 'Headline of the fallback state.' },
    },
    {
      name: 'fallbackAccentPhrase',
      type: 'text',
      label: 'Fallback accent phrase',
      defaultValue: 'anyway.',
      validate: validateAccentPhrase('fallbackHeading'),
      admin: {
        // Hidden: every fallback renders it in --accent-primary = ink, same as the headline.
        condition: neverShown,
        components: { Field: accentPhraseAdminField('fallbackHeading') },
        description: 'Optional: one word or phrase copied from the fallback headline to show in the accent colour.',
      },
    },
    {
      name: 'fallbackBody',
      type: 'textarea',
      label: 'Fallback text',
      defaultValue: 'Studies publish here as clients sign off.',
      admin: {
        condition: notNextLink,
        description: 'The line under the fallback headline (leave empty for none). State what is true; never "coming soon".',
      },
    },
    {
      name: 'fallbackMetrics',
      type: 'array',
      label: 'Fallback facts',
      maxRows: 3,
      labels: { singular: 'Fact', plural: 'Facts' },
      admin: {
        components: { RowLabel: rowLabel(['value', 'label'], 'Fact') },
        condition: hasFallbackMetrics,
        description:
          'Up to three facts: a ruled list in Ledger mode, a grey strip in Metric strip mode. Real, approved figures or counts only; never a price (use the pricing note).',
        initCollapsed: false,
      },
      fields: metricFields(),
    },
    {
      name: 'fallbackTestimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      maxRows: 3,
      // 2 so each testimonial's own `client` (logo) and video poster populate.
      maxDepth: 2,
      label: 'Fallback testimonials',
      admin: {
        condition: isTestimonialsFallback,
        description: 'Up to three quotes, in order (Testimonials mode). Draft testimonials are skipped until published.',
      },
    },
    {
      name: 'fallbackLogos',
      type: 'relationship',
      relationTo: 'clients',
      hasMany: true,
      maxRows: 12,
      maxDepth: 1,
      label: 'Fallback logos (optional)',
      admin: {
        condition: isLogoStripFallback,
        description:
          'Leave empty to show every client ticked "Show in logo strip" (Clients, in their set order). Pick clients here to choose and order them by hand. Draft clients are skipped.',
      },
    },
    { ...pricingNote(), admin: { ...pricingNote().admin, condition: notNextLink } },
  ],
}
