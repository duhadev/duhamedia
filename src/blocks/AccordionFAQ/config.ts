import type { Block, Field } from 'payload'

import { Faqs } from '../../collections/Faqs'
import { eyebrowField, linkField } from '../../fields'

/**
 * The four category options come from the `faqs` collection itself, so the
 * block can never drift from the values a FAQ can be saved with.
 */
const categoryField = Faqs.fields.find((f): f is Extract<Field, { type: 'select' }> => 'name' in f && f.name === 'category')
const categoryOptions = categoryField?.options ?? []

/**
 * AccordionFAQ (SCHEMA §8.5 item 19). This unit ships ONLY the `mini` variant
 * (p4, p5, p6 FAQ section); `group` (p11) is appended later together with
 * `anchorId`.
 */
export const AccordionFAQ: Block = {
  slug: 'accordionFAQ',
  interfaceName: 'AccordionFAQBlock',
  labels: { singular: 'FAQ accordion', plural: 'FAQ accordions' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'mini',
      options: [{ label: 'Mini (short list of questions on a service page)', value: 'mini' }],
      admin: { description: 'The accordion layout. The full FAQ-page layout arrives with that page.' },
    },
    eyebrowField({ description: 'Optional small uppercase line above the heading.' }),
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: { description: 'Section heading, e.g. "Routing questions". Shown in capitals.' },
    },
    {
      name: 'source',
      type: 'select',
      required: true,
      defaultValue: 'selected',
      options: [
        { label: 'Pick the questions myself (in order)', value: 'selected' },
        { label: 'All questions from one category', value: 'category' },
      ],
      admin: { description: 'Only published questions are ever shown.' },
    },
    {
      name: 'category',
      type: 'select',
      options: categoryOptions,
      admin: {
        description: 'Show the published questions of this FAQ category.',
        condition: (_data, siblingData) => siblingData?.source === 'category',
      },
    },
    {
      name: 'faqs',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
      maxDepth: 1,
      label: 'Questions',
      admin: {
        description: 'Drag to set the order. Unpublished questions are skipped on the live site.',
        condition: (_data, siblingData) => (siblingData?.source ?? 'selected') === 'selected',
      },
    },
    {
      name: 'limit',
      type: 'number',
      min: 1,
      max: 12,
      defaultValue: 6,
      admin: { step: 1, description: 'Most questions to show (1–12).' },
    },
    {
      name: 'openFirst',
      type: 'checkbox',
      label: 'Open the first question by default',
      defaultValue: false,
    },
    linkField({
      name: 'allLink',
      label: 'Link to all questions',
      description: 'Optional underlined link under the list, e.g. "All questions, answered straight →".',
    }),
  ],
}
