import type { Block } from 'payload'

import { eyebrowField, headlineFields, linkField, pricingNote } from '../../fields'

/**
 * Hero block (SCHEMA §8.1 item 1). This unit ships ONLY the `typographic`
 * variant (homepage); later units append `service` / `article` / `vsl` to
 * `variant.options` together with their own fields.
 */

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
      options: [{ label: 'Typographic (cream, dot matrix, wine logo shape)', value: 'typographic' }],
      admin: { description: 'The hero layout. More layouts arrive with the pages that need them.' },
    },
    eyebrowField({
      description: 'Small uppercase line above the headline, e.g. "Integrated ecommerce growth partner — Chicago".',
    }),
    ...headlineFields({ description: 'The page headline (the only h1 on the page). Shown in capitals.' }),
    {
      name: 'badge',
      type: 'group',
      label: 'Authority badge',
      admin: { description: 'Dark pill under the headline, e.g. "$X.XM client revenue tracked".' },
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
      admin: { description: 'The supporting paragraph under the headline.' },
    },
    pricingNote(),
    {
      name: 'ctas',
      type: 'array',
      label: 'Buttons',
      maxRows: 2,
      labels: { singular: 'Button', plural: 'Buttons' },
      admin: { description: 'Up to two. The first is the solid main button, the second is the outlined one.', initCollapsed: false },
      fields: [linkField({ name: 'link', label: 'Button', required: true })],
    },
    {
      name: 'subNote',
      type: 'text',
      label: 'Small note under the buttons',
      admin: { description: 'Optional quiet line, e.g. a minimum-term note.' },
    },
    {
      name: 'verticalMicrocopy',
      type: 'text',
      label: 'Side microcopy',
      admin: { description: 'Short uppercase line, e.g. "Build · Operate · Hand over". Runs vertically down the left on desktop; sits under the paragraph on mobile.' },
    },
    {
      name: 'geometry',
      type: 'checkbox',
      label: 'Show the wine logo shape',
      defaultValue: true,
      admin: { description: 'The large decorative logo silhouette behind the headline.' },
    },
  ],
}
