import type { Block, Condition, Field } from 'payload'

import { eyebrowField, headlineFields, linkField } from '../../fields'
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
 * `presentation` picks the wrapper: `page` (default, the original brochure
 * body) or `section` (the /services redesign: head row with eyebrow, heading,
 * lede and a big numeral, a 2px rule, then the same two columns).
 *
 * New block (not a variant): no existing block holds grouped lead-in bullets
 * or label rows beside a paragraph column; used by both service pages, which
 * differ only in content (`numbers.layout` columns vs rows).
 */
type BlockDataArg = { blockData?: { presentation?: string } }

const isSection: Condition = (_data, _sibling, { blockData }: BlockDataArg = {}) => blockData?.presentation === 'section'

/** Adds the section-only condition to a field (a row's children included). */
const sectionOnly = (fields: Field[]): Field[] =>
  fields.map((f) => {
    if (f.type === 'row') return { ...f, fields: sectionOnly(f.fields) } as Field
    if ('admin' in f || 'name' in f) {
      const admin = (f as { admin?: { condition?: Condition } }).admin ?? {}
      const prev = admin.condition
      return {
        ...f,
        admin: { ...admin, condition: prev ? (d, sib, ctx) => isSection(d, sib, ctx) && prev(d, sib, ctx) : isSection },
      } as Field
    }
    return f
  })

export const ServiceSheet: Block = {
  slug: 'serviceSheet',
  interfaceName: 'ServiceSheetBlock',
  labels: { singular: 'Service sheet', plural: 'Service sheets' },
  fields: [
    {
      name: 'presentation',
      type: 'select',
      defaultValue: 'page',
      options: [
        { label: 'Page body (the two columns only)', value: 'page' },
        { label: 'Section (heading, lede and big number on top, a rule, then the two columns)', value: 'section' },
      ],
      admin: { isClearable: false, description: 'Page body is what the two service pages use. Section adds the head row used on /services.' },
    },
    ...sectionOnly([
      eyebrowField({ defaultTick: true, description: 'Small uppercase line above the heading, e.g. "Service 01 · Build your store".' }),
      ...headlineFields({ required: false, description: 'The section headline, e.g. "First, we build it."' }),
      { name: 'intro', type: 'textarea', label: 'Lede', admin: { rows: 2, description: 'The grey line under the heading.' } },
      {
        name: 'numeral',
        type: 'text',
        maxLength: 4,
        admin: { description: 'The big number at the right of the head, e.g. "01". Desktop only, decorative.' },
      },
      {
        name: 'accent',
        type: 'checkbox',
        label: 'Accent colour',
        defaultValue: false,
        admin: { description: 'Draws the rule and the big number in wine instead of ink.' },
      },
    ]),
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
            { name: 'text', type: 'textarea', admin: { rows: 2, description: 'The line under (or beside) the number. Section: " / " starts a new line.' } },
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
          description: 'The bold line, as a link (Section: a plain underlined link at the end of the right column), e.g. "Book a call to talk through your build." to /book-a-call.',
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
                    { name: 'lead', type: 'text', admin: { width: '30%', description: 'Bold lead-in, e.g. "Discovery". Optional. Section shows it as "Discovery." in bold, then the text.' } },
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
