import type { Block } from 'payload'

import { linkField } from '../../fields'
import { rowLabel } from '../../components/admin/rowLabel'

/**
 * ServiceSheet (brochure 2026-11-07 p2 "Build your store" and p3 "Grow your
 * store"): the body of a capabilities page, in the brochure's two columns.
 *
 * Left: "Why it matters" paragraphs, a grey numbers card, an outlined box,
 * the next step. Right: "What's included" (groups of bullets with bold
 * lead-ins) and "Key differentiators" (label + line rows). Two columns from
 * `lg`, stacked below. Every part is optional; an empty part renders nothing.
 *
 * New block (not a variant): no existing block holds grouped lead-in bullets
 * or label rows beside a paragraph column; used by both service pages, which
 * differ only in content (`numbers.layout` columns vs rows).
 */
export const ServiceSheet: Block = {
  slug: 'serviceSheet',
  interfaceName: 'ServiceSheetBlock',
  labels: { singular: 'Service sheet', plural: 'Service sheets' },
  fields: [
    {
      name: 'why',
      type: 'group',
      label: 'Left column: why it matters',
      fields: [
        {
          name: 'heading',
          type: 'text',
          admin: { description: 'Section title with the diamond, e.g. "Why it matters".' },
        },
        {
          name: 'body',
          type: 'textarea',
          admin: {
            rows: 10,
            description:
              'The paragraphs. Leave a blank line between paragraphs. Wrap words in **double stars** to make them bold, e.g. the closing line.',
          },
        },
      ],
    },
    {
      name: 'numbers',
      type: 'group',
      label: 'Left column: numbers card (grey)',
      admin: { description: 'The grey card under the paragraphs, e.g. "The build, in numbers". Leave the numbers empty for no card.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', admin: { width: '60%', description: 'Small caption at the top, e.g. "Every month".' } },
            {
              name: 'layout',
              type: 'select',
              defaultValue: 'columns',
              options: [
                { label: 'Side by side (big number, short line under it)', value: 'columns' },
                { label: 'Rows (number left, bold lead and a sentence right)', value: 'rows' },
              ],
              admin: { width: '40%', isClearable: false },
            },
          ],
        },
        {
          name: 'items',
          type: 'array',
          label: 'Numbers',
          maxRows: 3,
          labels: { singular: 'Number', plural: 'Numbers' },
          admin: {
            components: { RowLabel: rowLabel(['value', 'lead'], 'Number') },
            description: 'Up to three. Add, remove and drag to reorder.',
          },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'value', type: 'text', required: true, admin: { width: '30%', description: 'e.g. "~55" or "1 hr".' } },
                {
                  name: 'lead',
                  type: 'text',
                  admin: { width: '50%', description: 'Rows layout only: the bold words before the sentence, e.g. "Planning call."' },
                },
                {
                  name: 'accent',
                  type: 'checkbox',
                  label: 'Accent colour',
                  defaultValue: false,
                  admin: { width: '20%' },
                },
              ],
            },
            { name: 'text', type: 'textarea', admin: { rows: 2, description: 'The line under (or beside) the number.' } },
          ],
        },
      ],
    },
    {
      name: 'box',
      type: 'group',
      label: 'Left column: outlined box',
      admin: { description: 'The black-outlined box, e.g. "You own it". Leave the text empty for no box.' },
      fields: [
        { name: 'label', type: 'text', admin: { description: 'Small caption at the top of the box.' } },
        { name: 'body', type: 'textarea', admin: { rows: 3 } },
        linkField({ name: 'link', label: 'Link', description: 'Optional link at the end of the box, e.g. "See pricing".' }),
      ],
    },
    {
      name: 'nextStep',
      type: 'group',
      label: 'Left column: next step',
      fields: [
        { name: 'label', type: 'text', admin: { description: 'Small caption, e.g. "Next step".' } },
        linkField({
          name: 'link',
          label: 'Next step link',
          description: 'The bold line, as a link, e.g. "Book a call to talk through your build." to /book-a-call.',
        }),
      ],
    },
    {
      name: 'included',
      type: 'group',
      label: "Right column: what's included",
      fields: [
        { name: 'heading', type: 'text', admin: { description: 'Section title with the diamond, e.g. "What\'s included".' } },
        {
          name: 'groups',
          type: 'array',
          dbName: 'ss_incl_groups', // the default table names pass Postgres's 63-character limit
          label: 'Groups',
          maxRows: 6,
          labels: { singular: 'Group', plural: 'Groups' },
          admin: {
            components: { RowLabel: rowLabel(['title'], 'Group') },
            description: 'Each group is a small title over a list. Add, remove and drag to reorder.',
          },
          fields: [
            { name: 'title', type: 'text', required: true, admin: { description: 'e.g. "Strategy and design".' } },
            {
              name: 'items',
              type: 'array',
              dbName: 'ss_incl_items',
              label: 'Bullets',
              maxRows: 10,
              labels: { singular: 'Bullet', plural: 'Bullets' },
              admin: { components: { RowLabel: rowLabel(['lead', 'text'], 'Bullet') } },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'lead', type: 'text', admin: { width: '30%', description: 'Bold lead-in, e.g. "Discovery". Optional.' } },
                    { name: 'text', type: 'textarea', required: true, admin: { width: '70%', rows: 2 } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'differentiators',
      type: 'group',
      label: 'Right column: key differentiators',
      fields: [
        { name: 'heading', type: 'text', admin: { description: 'Section title with the diamond, e.g. "Key differentiators".' } },
        {
          name: 'rows',
          type: 'array',
          dbName: 'ss_diff_rows',
          label: 'Rows',
          maxRows: 6,
          labels: { singular: 'Row', plural: 'Rows' },
          admin: {
            components: { RowLabel: rowLabel(['label'], 'Row') },
            description: 'A small caption and one line each. Add, remove and drag to reorder.',
          },
          fields: [
            { name: 'label', type: 'text', required: true, admin: { description: 'e.g. "No templates".' } },
            { name: 'line', type: 'textarea', required: true, admin: { rows: 2 } },
          ],
        },
      ],
    },
  ],
}
