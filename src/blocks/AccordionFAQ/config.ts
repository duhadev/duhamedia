import type { Block, Field } from 'payload'

import { Faqs } from '../../collections/Faqs'
import { anchorIdField } from '../../fields/anchorId'
import { eyebrowField, headlineFields, linkField } from '../../fields'
import { RESERVED_ANCHOR_IDS } from '../../lib/anchors'

/**
 * The four category options come from the `faqs` collection itself, so the
 * block can never drift from the values a FAQ can be saved with.
 */
const categoryField = Faqs.fields.find((f): f is Extract<Field, { type: 'select' }> => 'name' in f && f.name === 'category')
const categoryOptions = categoryField?.options ?? []

/** Re-exported from its new home (src/lib/anchors.ts) so existing imports keep working. */
export { RESERVED_ANCHOR_IDS }

const isGroup = (_data: unknown, siblingData: { variant?: string } | undefined) => siblingData?.variant === 'group'

/**
 * AccordionFAQ (SCHEMA §8.5 item 19). `mini` (p4, p5, p6 FAQ section) and
 * `group` (p11, one block per category; `spacing` belongs to it). `anchorId` works on both; `accentPhrase` (wine words in the heading) is for `mini`.
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
      options: [
        { label: 'Mini (short list of questions on a service page)', value: 'mini' },
        { label: 'Group (one category section of the FAQ page)', value: 'group' },
      ],
      admin: { description: 'Mini is the compact boxed list; Group is one category section on the full FAQ page (add one block per category).' },
    },
    anchorIdField({
      label: 'Anchor ID',
      description:
        'The jump-link target for this section, lowercase, e.g. "faq" or (Group) "pricing", "builds", "marketing", "process". For a Group it must match what the category tabs link to. Optional on a Mini list.',
    }),
    {
      name: 'spacing',
      type: 'select',
      defaultValue: 'middle',
      options: [
        { label: 'Middle (between other groups)', value: 'middle' },
        { label: 'First group (extra space above)', value: 'first' },
        { label: 'Last group (extra space below)', value: 'last' },
        { label: 'Only group (extra space above and below)', value: 'only' },
      ],
      admin: {
        description: 'Group only. Where this section sits in the stack of groups, so the first and last get the page-edge spacing.',
        condition: isGroup,
      },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'stacked',
      options: [
        { label: 'Stacked (heading above the questions)', value: 'stacked' },
        { label: 'Split (heading, intro and link left; questions right)', value: 'split' },
      ],
      admin: {
        description: 'Mini only. Split puts the heading, intro and "all questions" link in a left column and the questions on the right (one column on mobile).',
        condition: (_data, siblingData) => siblingData?.variant !== 'group',
      },
    },
    eyebrowField({ description: 'Optional small uppercase line above the heading.' }),
    ...headlineFields({
      description: 'Section heading, e.g. "Routing questions". Shown in capitals.',
      accent: (_data, siblingData) => siblingData?.variant !== 'group',
    }),
    {
      name: 'intro',
      type: 'textarea',
      admin: {
        description: 'Split layout only. A short grey lede under the heading.',
        condition: (_data, siblingData) => siblingData?.variant !== 'group' && siblingData?.layout === 'split',
      },
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
      admin: {
        step: 1,
        description: 'Mini list only: most questions to show (1–12). A group always shows every published question in its category.',
        condition: (_data, siblingData) => siblingData?.variant !== 'group',
      },
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
