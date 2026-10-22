import type { Block, Condition } from 'payload'

import {
  accentPhraseAdminField,
  eyebrowField,
  headlineFields,
  linkField,
  metricFields,
  pricingNote,
  validateAccentPhrase,
} from '../../fields'

/**
 * CaseStudyCards block (SCHEMA §8.2 item 6). This unit ships ONLY the `cards`
 * layout (homepage p1 §Featured case studies) with fallback modes `ledger` and
 * `note`. Later units append `ledger` / `staggered` / `next-link` layouts,
 * the `track` source, `loadMore`, and the `testimonials` / `metric-strip` /
 * `logo-strip` fallback modes together with their own fields.
 *
 * LAUNCH STATE (CLAUDE.md rule 1, SCHEMA §5): there is deliberately NO field
 * that forces the "live" state. The component renders cards only from
 * PUBLISHED case studies; with none, it renders the designed fallback.
 */

const isManual: Condition = (_data, siblingData) => siblingData?.source === 'manual'
const isLedger: Condition = (_data, siblingData) => (siblingData?.fallbackMode ?? 'ledger') === 'ledger'

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
      options: [{ label: 'Cards (1–3 study cards in a row)', value: 'cards' }],
      admin: { description: 'The layout of the studies. More layouts arrive with the pages that need them.' },
    },
    eyebrowField({ description: 'Small uppercase line above the headline (shown only when studies are live).' }),
    ...headlineFields({
      required: false,
      description: 'Headline shown above the study cards, e.g. "The work, in numbers." Shown only when studies are live.',
    }),
    {
      name: 'source',
      type: 'select',
      required: true,
      defaultValue: 'featured',
      options: [
        { label: 'Featured studies (ticked "Featured" on the study)', value: 'featured' },
        { label: 'Latest published studies', value: 'latest' },
        { label: 'Pick studies by hand', value: 'manual' },
      ],
      admin: {
        description:
          'Which studies appear. Only PUBLISHED studies ever show; a draft study is never shown, even if picked here.',
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
        description: 'Pick up to three, in order. Draft studies are skipped on the site until they are published.',
      },
    },
    {
      name: 'limit',
      type: 'number',
      min: 1,
      max: 3,
      defaultValue: 3,
      admin: { step: 1, description: 'How many cards to show (1 to 3).' },
    },
    {
      name: 'cardLinkLabel',
      type: 'text',
      label: 'Card link text',
      defaultValue: 'Read the case study',
      admin: { description: 'The underlined text at the bottom of every card.' },
    },
    linkField({
      name: 'allLink',
      label: '"All studies" link',
      description: 'Optional link under the cards, e.g. "All studies →". Shown only when studies are live.',
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
      ],
      admin: {
        description:
          'What this section shows while no case study is published (and again if all are unpublished). It switches to the cards on its own once a study is published.',
      },
    },
    {
      name: 'fallbackEyebrow',
      type: 'text',
      label: 'Fallback eyebrow',
      defaultValue: 'No studies live yet — the numbers we can show',
      admin: { description: 'Small uppercase line above the fallback headline.' },
    },
    {
      name: 'fallbackHeading',
      type: 'text',
      label: 'Fallback headline',
      defaultValue: 'Numbers anyway.',
      admin: { description: 'Headline of the fallback state.' },
    },
    {
      name: 'fallbackAccentPhrase',
      type: 'text',
      label: 'Fallback accent phrase',
      defaultValue: 'anyway.',
      validate: validateAccentPhrase('fallbackHeading'),
      admin: {
        components: { Field: accentPhraseAdminField('fallbackHeading') },
        description: 'Optional: one word or phrase copied from the fallback headline to show in the accent colour.',
      },
    },
    {
      name: 'fallbackBody',
      type: 'textarea',
      label: 'Fallback text',
      defaultValue: 'Studies publish here as clients sign off.',
      admin: { description: 'The line under the fallback headline. State what is true; never "coming soon".' },
    },
    {
      name: 'fallbackMetrics',
      type: 'array',
      label: 'Ledger rows',
      maxRows: 3,
      labels: { singular: 'Row', plural: 'Rows' },
      admin: {
        condition: isLedger,
        description:
          'Up to three facts shown as a ruled list (ledger mode). Real, approved figures or counts only; never a price.',
        initCollapsed: false,
      },
      fields: metricFields(),
    },
    pricingNote(),
  ],
}
