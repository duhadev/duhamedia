import type { Block } from 'payload'

import { eyebrowField, headlineFields, linkField, metricFields } from '../../fields'

/**
 * TestimonialRow block (SCHEMA §8.2 item 9). This unit ships ONLY the `row`
 * variant (homepage §Testimonials); `client-voice` (p2) is added later as a new
 * option with its own fields. `leadMetric` (p16) is deliberately omitted until
 * the Newsletter page builds it.
 *
 * `fallbackMetric` reuses the `metricFields()` shape with `required: false`:
 * the whole fallback is optional (R3: with nothing set, the row reflows to
 * testimonials only), so its value/label must not block publishing when the
 * editor leaves it empty. Once one is filled the component needs both (it
 * renders nothing for a half metric).
 */

export const TestimonialRow: Block = {
  slug: 'testimonialRow',
  interfaceName: 'TestimonialRowBlock',
  labels: { singular: 'Testimonial row', plural: 'Testimonial rows' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'row',
      options: [{ label: 'Row (testimonial cards + "A study in full")', value: 'row' }],
      admin: { description: 'The layout. More layouts arrive with the pages that need them.' },
    },
    eyebrowField({
      defaultTick: false,
      description: 'Small uppercase line above the testimonial cards, e.g. "What clients say".',
    }),
    ...headlineFields({ required: false, description: 'The section headline, e.g. "Proof, in their words."' }),
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      minRows: 1,
      maxRows: 3,
      maxDepth: 2,
      admin: {
        description:
          'Pick 1 to 3 testimonials, in the order shown. Only published testimonials appear on the site; drafts are skipped.',
      },
    },
    {
      name: 'studyCard',
      type: 'group',
      label: '"A study in full" card',
      admin: {
        description:
          'The case-study card beside the testimonials. It only ever shows a PUBLISHED case study. Until one is published, the quiet figure below is shown instead, or nothing.',
      },
      fields: [
        { name: 'show', type: 'checkbox', label: 'Show this card', defaultValue: true },
        {
          name: 'label',
          type: 'text',
          defaultValue: 'A study in full',
          admin: { description: 'Small uppercase line above the card.', condition: (_d, s) => s?.show !== false },
        },
        {
          name: 'source',
          type: 'select',
          required: true,
          defaultValue: 'featured',
          options: [
            { label: 'The featured case study', value: 'featured' },
            { label: 'A case study I choose', value: 'manual' },
          ],
          admin: {
            description: '"Featured" uses the newest published study ticked "Featured".',
            condition: (_d, s) => s?.show !== false,
          },
        },
        {
          name: 'caseStudy',
          type: 'relationship',
          relationTo: 'case-studies',
          maxDepth: 1,
          admin: {
            description: 'Shown only once this study is published.',
            condition: (_d, s) => s?.show !== false && s?.source === 'manual',
          },
        },
        {
          name: 'readLabel',
          type: 'text',
          label: 'Link text',
          defaultValue: 'Read the study',
          admin: { description: 'Underlined text at the bottom of the card.', condition: (_d, s) => s?.show !== false },
        },
        {
          name: 'fallbackMetric',
          type: 'group',
          label: 'Quiet figure while no study is published',
          admin: {
            description:
              'Optional. Shown in the card slot until a case study is published. Leave empty to show testimonials only. Only enter a real, approved figure.',
            condition: (_d, s) => s?.show !== false,
          },
          fields: metricFields({ required: false }),
        },
      ],
    },
    linkField({
      name: 'cta',
      label: 'Link under the cards',
      description: 'Optional, e.g. "All studies". Leave empty to hide.',
    }),
  ],
}
