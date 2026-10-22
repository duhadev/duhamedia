import type { Block } from 'payload'

import { eyebrowField, headlineFields, metricFields } from '../../fields'

/**
 * MetricEvent (SCHEMA §8.2 item 7). This unit ships ONLY the `table` variant
 * (p2 case-study "Results table": measure / baseline / after / change). `facts`
 * (p8) and `strip` are appended by later units.
 *
 * The row shape mirrors `case-studies.resultsTable.rows` after the mapping in
 * `Component.tsx` (`resultsTableToMetricEvent`): measure → `label`, after →
 * `value`, baseline → `baseline`, change → `change`.
 */
export const MetricEvent: Block = {
  slug: 'metricEvent',
  interfaceName: 'MetricEventBlock',
  labels: { singular: 'Metrics', plural: 'Metrics' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'table',
      options: [{ label: 'Table (measure / before / after / change)', value: 'table' }],
      admin: { description: 'The metrics layout. More layouts arrive with the pages that need them.' },
    },
    eyebrowField({ defaultTick: false, description: 'Small line above the table, e.g. "Results — 12 months, client-reported".' }),
    ...headlineFields({
      required: false,
      description: 'Optional heading above the table. Leave empty for the eyebrow alone.',
    }),
    {
      name: 'columns',
      type: 'group',
      label: 'Column headings',
      admin: { description: 'Headings of the four table columns. Empty ones fall back to the defaults shown.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'measure', type: 'text', admin: { width: '25%', description: 'Default "Measure".' } },
            { name: 'baseline', type: 'text', admin: { width: '25%', description: 'Default "Before".' } },
            { name: 'after', type: 'text', admin: { width: '25%', description: 'Default "After".' } },
            { name: 'change', type: 'text', admin: { width: '25%', description: 'Default "Change".' } },
          ],
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: 'Rows',
      labels: { singular: 'Row', plural: 'Rows' },
      admin: {
        description:
          'One row per measured result. Drag to reorder. On a case study this is filled from the case study itself.',
        initCollapsed: true,
      },
      fields: [
        // value (the "after" figure), label (the measure), sub, accent
        ...metricFields(),
        {
          type: 'row',
          fields: [
            {
              name: 'baseline',
              type: 'text',
              admin: { width: '50%', description: 'The figure before the engagement, e.g. "[$N]/yr". Optional.' },
            },
            {
              name: 'change',
              type: 'text',
              admin: {
                width: '50%',
                description:
                  'The change, e.g. "+[N]%" or "-[N]pt". A leading + or - shows an up/down arrow; any other text (e.g. "Handover") shows as written.',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'note',
      type: 'textarea',
      label: 'Note / method',
      admin: {
        description: 'Quiet line under the table: how the numbers were measured and who reported them.',
        placeholder: '[… fill in from client-approved records — no estimates published.]',
      },
    },
  ],
}
