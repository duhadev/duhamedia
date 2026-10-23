
import type { Block, TextFieldSingleValidation } from 'payload'
import { text } from 'payload/shared'

import { linkField } from '../../fields'

/**
 * MiniCTAStrip block (SCHEMA §8.1 item 2). `band` (homepage), `inline` (p9) and `button`
 * (p15 Campaign LP, S6-6: one centred primary button in the 820 column, optional lead-in line).
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
        { label: 'Button (one centred button, optional short line above; Campaign LP repeats)', value: 'button' },
      ],
      admin: { description: 'The strip layout. Band is the dark call-to-action strip; Inline is a quiet one-liner such as "Have a quick question first? Contact us"; Button is a single centred button (the Campaign LP repeats it after each major section).' },
    },
    {
      name: 'text',
      type: 'text',
      // Required for band and inline only; the button variant's line is optional (so not `required: true`).
      validate: ((value, options) => {
        const base = text(value, options)
        if (base !== true) return base
        const variant = (options.siblingData as { variant?: string } | undefined)?.variant
        if (variant === 'button') return true
        return typeof value === 'string' && value.trim() ? true : 'Add the one-line statement.'
      }) satisfies TextFieldSingleValidation,
      admin: { description: 'The one-line statement on the strip. Band: e.g. "One team. One dashboard. A handover date." (shown in capitals). Inline: the lead-in before the link, e.g. "Have a quick question first?" (shown as written). Button: optional short line above the button (shown as written); leave empty for the button alone.' },
    },
    linkField({
      name: 'link',
      label: 'Button',
      required: true,
      description: 'The link text and where it goes. Band: the whole strip is clickable and this is the button text. Inline: this is the underlined link after the sentence, e.g. "Contact us". Button: this is the button.',
    }),
  ],
}
