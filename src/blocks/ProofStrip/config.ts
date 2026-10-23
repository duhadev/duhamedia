import type { Block } from 'payload'

import { metricFields, pricingNote, scarcityRef } from '../../fields'
import { rowLabel } from '../../components/admin/rowLabel'

/**
 * ProofStrip block (SCHEMA §8.2 item 5). `scarcity` (homepage) and `metrics` (p15 Campaign LP,
 * S6-4): up to three metrics + an optional capacity statement + the logo row, left-aligned in the
 * 820 column.
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
      options: [
        { label: 'Scarcity (capacity statements + client logos)', value: 'scarcity' },
        { label: 'Metrics (up to three metrics + capacity + client logos, Campaign LP)', value: 'metrics' },
      ],
      admin: { description: 'The strip layout. Scarcity is the homepage strip; Metrics is the compact Campaign LP strip.' },
    },
    {
      name: 'statements',
      type: 'array',
      maxRows: 2,
      labels: { singular: 'Statement', plural: 'Statements' },
      admin: {
        condition: (_data, siblingData) => siblingData?.variant !== 'metrics',
        components: { RowLabel: rowLabel(['key'], 'Statement', { scarcityKeys: true }) },
        description:
          'Up to two capacity statements, shown side by side. Each shows a big line with its reason quietly underneath; both come from "Capacity & scarcity".',
        initCollapsed: false,
      },
      fields: [scarcityRef()],
    },
    {
      name: 'metrics',
      type: 'array',
      maxRows: 3,
      labels: { singular: 'Metric', plural: 'Metrics' },
      admin: {
        condition: (_data, siblingData) => siblingData?.variant === 'metrics',
        components: { RowLabel: rowLabel(['value', 'label'], 'Metric') },
        description:
          'Up to three proof numbers (results or counts, never prices). Prices go in the "Pricing note" below. Leave empty to show none.',
        initCollapsed: false,
      },
      fields: metricFields(),
    },
    (() => {
      const f = scarcityRef({
        name: 'capacityStatement',
        label: 'Capacity statement',
        description:
          'Optional capacity tile beside the metrics: a big line with its reason quietly beneath, both from "Capacity & scarcity". Edit the numbers and wording there. Choose "None" to hide it.',
      })
      return { ...f, admin: { ...f.admin, condition: (_data, siblingData) => siblingData?.variant === 'metrics' } } satisfies typeof f
    })(),
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
