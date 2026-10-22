import type { Block } from 'payload'

import { headlineFields, linkField, scarcityRef } from '../../fields'

/**
 * FinalCTA block (SCHEMA §8.1 item 3): the dark closing band before the footer.
 * One variant; geometry (dot matrix + wine mark) is fixed by the design.
 */
export const FinalCTA: Block = {
  slug: 'finalCTA',
  interfaceName: 'FinalCTABlock',
  labels: { singular: 'Final call to action', plural: 'Final calls to action' },
  fields: [
    ...headlineFields({
      required: false,
      description:
        'The big closing line. Leave empty to use the default from Site settings > Default closing sections.',
    }),
    {
      name: 'body',
      type: 'textarea',
      admin: { description: 'Optional supporting line under the headline.' },
    },
    scarcityRef({
      name: 'capacity',
      label: 'Capacity line',
      defaultValue: 'builds-line',
      description:
        'Which capacity statement to show under the headline (big line with its reason quietly beneath). Numbers and wording are edited once, in "Capacity & scarcity". Choose "None" to hide it.',
    }),
    {
      name: 'buttons',
      type: 'array',
      minRows: 1,
      maxRows: 2,
      labels: { singular: 'Button', plural: 'Buttons' },
      admin: {
        description:
          'One or two buttons. The first is the main one. Leave empty to use the default button from Site settings > Default closing sections.',
        initCollapsed: false,
      },
      fields: [linkField({ name: 'link', label: 'Button', required: true })],
    },
  ],
}
