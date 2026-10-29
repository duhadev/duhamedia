import type { Block } from 'payload'

import { metricFields, pricingNote, scarcityRef } from '../../fields'
import { rowLabel } from '../../components/admin/rowLabel'

/**
 * ProofStrip block (SCHEMA §8.2 item 5). `scarcity` (stored value; admin label "Numbers", homepage):
 * 1-4 big number + big text items typed on the block, then the logo row. `metrics` (p15 Campaign LP,
 * S6-4): up to three metrics + an optional capacity statement (from the scarcity global, with its
 * reason) + the logo row, left-aligned in the 820 column.
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
        { label: 'Numbers (big number + label, plus client logos)', value: 'scarcity' },
        { label: 'Metrics (up to three metrics + capacity + client logos, Campaign LP)', value: 'metrics' },
      ],
      admin: { description: 'The strip layout. Numbers is the homepage strip; Metrics is the compact Campaign LP strip.' },
    },
    {
      // Stored name stays `statements` (table `pages_blocks_proof_strip_statements`); since
      // 2026-10-29 each row holds its own number + label, typed on the block (human decision,
      // overriding the loud/quiet scarcity rule for THIS strip only: no reason line).
      name: 'statements',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      labels: { singular: 'Number', plural: 'Numbers' },
      admin: {
        condition: (_data, siblingData) => siblingData?.variant !== 'metrics',
        components: { RowLabel: rowLabel(['number', 'label'], 'Number') },
        description:
          'The big numbers, side by side (two fit best; up to four). Each is a big number with its big text underneath. Add, remove or drag to reorder. The first number is shown in the accent colour.',
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'number',
              type: 'text',
              required: true,
              maxLength: 12,
              label: 'Number',
              admin: {
                width: '30%',
                description: 'The big number. Text, so you can write "3", "7", "55h" or "$1K".',
              },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Big text',
              admin: { width: '70%', description: 'Big text under the number, e.g. "Projects ongoing".' },
            },
          ],
        },
      ],
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
      admin: { description: 'The row of client names / monochrome logos under the numbers.' },
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
