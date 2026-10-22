import type { Block } from 'payload'

import { eyebrowField, headlineFields, linkField, pricingNote } from '../../fields'

/**
 * TwoTrackPanels block (SCHEMA §8.3 item 10). This unit ships ONLY the `equal`
 * variant (homepage "What we do"). `contrast` and `primary-secondary` are
 * added later as new options together with their own fields (`claim`,
 * `conclusion`), never as restyles.
 */
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
      options: [{ label: 'Equal (two tracks, same weight)', value: 'equal' }],
      admin: { description: 'The panel layout. More layouts arrive with the pages that need them.' },
    },
    eyebrowField({ description: 'Optional small uppercase line above the headline.', defaultTick: false }),
    ...headlineFields({ description: 'The section headline, e.g. "What we actually do".' }),
    {
      name: 'panels',
      type: 'array',
      label: 'Tracks',
      minRows: 2,
      maxRows: 2,
      labels: { singular: 'Track', plural: 'Tracks' },
      admin: { description: 'Exactly two tracks, shown in this order.', initCollapsed: false },
      fields: [
        {
          name: 'label',
          type: 'text',
          admin: { description: 'Optional small uppercase tag above the track, e.g. "Phase 1".' },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: { description: 'The track lead-in, shown in capitals, e.g. "First, we build it."' },
        },
        {
          name: 'accentTitle',
          type: 'checkbox',
          label: 'Show the title in the accent colour',
          defaultValue: false,
        },
        {
          name: 'body',
          type: 'textarea',
          required: true,
          admin: { description: 'What this track is. Runs on straight after the title.' },
        },
        pricingNote(),
        linkField({
          name: 'link',
          label: 'Link',
          description: 'Optional "how it works" link after the paragraph, e.g. "How the build works →".',
        }),
      ],
    },
  ],
}
