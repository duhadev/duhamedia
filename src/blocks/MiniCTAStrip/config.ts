import type { Block } from 'payload'

import { linkField } from '../../fields'

/**
 * MiniCTAStrip block (SCHEMA §8.1 item 2). `band` (homepage) and `inline`
 * (p9) ship so far; `button` (p15) is appended by a later unit.
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
      options: [
        { label: 'Band (dark strip with an outlined button)', value: 'band' },
        { label: 'Inline (quiet one-line question with an underlined link)', value: 'inline' },
      ],
      admin: { description: 'The strip layout. Band is the dark call-to-action strip; Inline is a quiet one-liner such as "Have a quick question first? Contact us".' },
    },
    {
      name: 'text',
      type: 'text',
      required: true,
      admin: { description: 'The one-line statement on the strip. Band: e.g. "One team. One dashboard. A handover date." (shown in capitals). Inline: the lead-in before the link, e.g. "Have a quick question first?" (shown as written).' },
    },
    linkField({
      name: 'link',
      label: 'Button',
      required: true,
      description: 'The link text and where it goes. Band: the whole strip is clickable and this is the button text. Inline: this is the underlined link after the sentence, e.g. "Contact us".',
    }),
  ],
}
