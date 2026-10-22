import type { Block } from 'payload'

import { linkField } from '../../fields'

/**
 * MiniCTAStrip block (SCHEMA §8.1 item 2). This unit ships ONLY the `band`
 * variant (homepage); later units append `inline` / `button` to
 * `variant.options`.
 */
export const MiniCTAStrip: Block = {
  slug: 'miniCTAStrip',
  interfaceName: 'MiniCTAStripBlock',
  labels: { singular: 'Mini CTA strip', plural: 'Mini CTA strips' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'band',
      options: [{ label: 'Band (dark strip with an outlined button)', value: 'band' }],
      admin: { description: 'The strip layout. More layouts arrive with the pages that need them.' },
    },
    {
      name: 'text',
      type: 'text',
      required: true,
      admin: { description: 'The one-line statement on the strip, e.g. "One team. One dashboard. A handover date." Shown in capitals.' },
    },
    linkField({
      name: 'link',
      label: 'Button',
      required: true,
      description: 'The button text and where it goes. The whole strip is clickable.',
    }),
  ],
}
