import type { Block } from 'payload'

import { pricingNote, scarcityRef } from '../../fields'

/**
 * ProofStrip block (SCHEMA §8.2 item 5). This unit ships ONLY the `scarcity` variant (homepage);
 * the `metrics` variant (p15) is appended later with its own fields.
 */
export const ProofStrip: Block = {
  slug: 'proofStrip',
  interfaceName: 'ProofStripBlock',
  labels: { singular: 'Proof strip', plural: 'Proof strips' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'scarcity',
      options: [{ label: 'Scarcity (capacity statements + client logos)', value: 'scarcity' }],
      admin: { description: 'The strip layout. More layouts arrive with the pages that need them.' },
    },
    {
      name: 'statements',
      type: 'array',
      maxRows: 2,
      labels: { singular: 'Statement', plural: 'Statements' },
      admin: {
        description:
          'Up to two capacity statements, shown side by side. Each shows a big line with its reason quietly underneath; both come from "Capacity & scarcity".',
        initCollapsed: false,
      },
      fields: [scarcityRef()],
    },
    pricingNote(),
    {
      name: 'logos',
      type: 'group',
      label: 'Client logos',
      admin: { description: 'The row of client names / monochrome logos under the statements.' },
      fields: [
        { name: 'show', type: 'checkbox', label: 'Show the logo row', defaultValue: true },
        {
          name: 'eyebrow',
          type: 'text',
          defaultValue: "Stores we've run numbers for",
          admin: {
            description: 'Small line above the logos.',
            condition: (_data, siblingData) => siblingData?.show !== false,
          },
        },
        {
          name: 'source',
          type: 'select',
          defaultValue: 'flagged',
          options: [
            { label: 'Clients marked "show in logo strip"', value: 'flagged' },
            { label: 'Pick clients by hand', value: 'manual' },
          ],
          admin: {
            description: 'Automatic uses every published client ticked "Show in logo strip" (in their order).',
            condition: (_data, siblingData) => siblingData?.show !== false,
          },
        },
        {
          name: 'clients',
          type: 'relationship',
          relationTo: 'clients',
          hasMany: true,
          maxDepth: 2,
          admin: {
            description: 'Shown in this order. Unpublished clients are skipped. If none remain, the row is hidden.',
            condition: (_data, siblingData) => siblingData?.show !== false && siblingData?.source === 'manual',
          },
        },
      ],
    },
  ],
}
