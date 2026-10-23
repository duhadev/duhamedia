import type { Block, Condition } from 'payload'

import { eyebrowField, headlineFields, metricFields } from '../../fields'

/**
 * MetricEvent (SCHEMA §8.2 item 7). Variants shipped: `table` (p2 case-study
 * "Results table": measure / baseline / after / change) and `facts` (p8
 * "The company, in numbers": label / value rows). `strip` is appended by a later unit.
 *
 * The row shape mirrors `case-studies.resultsTable.rows` after the mapping in
 * `Component.tsx` (`resultsTableToMetricEvent`): measure → `label`, after →
 * `value`, baseline → `baseline`, change → `change`.
 */
const isTable: Condition = (_data, _sibling, { blockData }) => (blockData?.variant ?? 'table') === 'table'

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
      options: [
        { label: 'Table (measure / before / after / change)', value: 'table' },
        { label: 'Company facts (label and value rows)', value: 'facts' },
      ],
      admin: { description: 'The metrics layout. More layouts arrive with the pages that need them.' },
    },
    eyebrowField({
      defaultTick: false,
      description:
        'Small line above the table, e.g. "Results — 12 months, client-reported". For Company facts this is the caption, e.g. "The company, in numbers".',
    }),
    ...headlineFields({
      required: false,
      description: 'Optional heading above the table. Leave empty for the eyebrow alone.',
    }),
    {
      name: 'columns',
      type: 'group',
      label: 'Column headings',
      admin: { condition: isTable, description: 'Headings of the four table columns. Empty ones fall back to the defaults shown.' },
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
          'Table: one row per measured result (measure, before, after, change). Company facts: one row per fact (label and value). Drag to reorder. On a case study the table rows come from the case study itself.',
        initCollapsed: true,
      },
      fields: [
        // value (the "after" figure), label (the measure), sub, accent
        ...metricFields(),
        {
          type: 'row',
          admin: { condition: isTable },
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
        description: 'Quiet line under the table or facts: how the numbers were measured and who reported them.',
        placeholder: '[… fill in from client-approved records — no estimates published.]',
      },
    },
  ],
}
