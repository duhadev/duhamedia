import type { Block, TextFieldSingleValidation } from 'payload'

import { eyebrowField, headlineFields, linkField } from '../../fields'
import { rowLabel } from '../../components/admin/rowLabel'

/**
 * PricingPlans (brochure 2026-11-07 p5 "Pricing"): the build price card, the
 * marketing plan cards (dark title bar, sentence, grey "First quarter / After
 * that" footer), the $100K note, the small print, the closing statement and a
 * row of labelled paragraphs (At $100,000 a year / Switching early / The
 * agreement).
 *
 * The brochure governs pricing since 2026-11-07 (CLAUDE.md "Business facts
 * were superseded"); this block replaces the old "inline notes only" rule for
 * the pricing section on /services. New block: no existing block renders
 * plan cards or a price card.
 */
export const PricingPlans: Block = {
  slug: 'pricingPlans',
  interfaceName: 'PricingPlansBlock',
  labels: { singular: 'Pricing plans', plural: 'Pricing plans' },
  fields: [
    {
      name: 'anchorId',
      type: 'text',
      label: 'Section link name',
      defaultValue: 'pricing',
      admin: {
        description: 'Lets other pages link straight to this section, e.g. "pricing" → /services#pricing. Letters, numbers and dashes only.',
      },
      validate: ((v) => !v || /^[a-z0-9-]+$/.test(String(v)) || 'Use lowercase letters, numbers and dashes only.') as TextFieldSingleValidation,
    },
    eyebrowField({ defaultTick: true, description: 'Small uppercase line above the headline, e.g. "Pricing".' }),
    ...headlineFields({ required: false, description: 'e.g. "Two jobs. Two ways to pay."' }),
    { name: 'intro', type: 'textarea', admin: { rows: 2, description: 'One line under the headline.' } },
    {
      name: 'build',
      type: 'group',
      label: 'Build box (ink outline)',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', admin: { width: '40%', description: 'Caption, e.g. "Build your store".' } },
            { name: 'lead', type: 'text', admin: { width: '40%', description: 'Words above the price, e.g. "Builds start at".' } },
            { name: 'price', type: 'text', admin: { width: '20%', description: 'e.g. "$7K".' } },
          ],
        },
        {
          name: 'bullets',
          type: 'array',
          maxRows: 8,
          labels: { singular: 'Bullet', plural: 'Bullets' },
          admin: { components: { RowLabel: rowLabel(['text'], 'Bullet') }, description: 'Add, remove and drag to reorder.' },
          fields: [{ name: 'text', type: 'textarea', required: true, admin: { rows: 2 } }],
        },
        { name: 'nextLabel', type: 'text', label: 'Next step caption', admin: { description: 'e.g. "Next step".' } },
        linkField({ name: 'nextLink', label: 'Next step link', description: 'e.g. "Book a call to talk through your build." to /book-a-call.' }),
      ],
    },
    {
      name: 'marketing',
      type: 'group',
      label: 'Marketing plans (wine outline)',
      fields: [
        { name: 'label', type: 'text', admin: { description: 'Caption, e.g. "Marketing plan".' } },
        { name: 'intro', type: 'text', admin: { description: 'e.g. "Three plans, settled quarterly. Every plan includes the full toolkit."' } },
        {
          type: 'row',
          fields: [
            { name: 'firstLabel', type: 'text', defaultValue: 'First quarter', admin: { width: '50%', description: 'Left footer caption on every plan.' } },
            { name: 'afterLabel', type: 'text', defaultValue: 'After that', admin: { width: '50%', description: 'Right footer caption on every plan.' } },
          ],
        },
        {
          name: 'plans',
          type: 'array',
          maxRows: 4,
          labels: { singular: 'Plan', plural: 'Plans' },
          admin: { components: { RowLabel: rowLabel(['name', 'tag'], 'Plan') }, description: 'Add, remove and drag to reorder.' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'name', type: 'text', required: true, admin: { width: '40%', description: 'e.g. "Standard".' } },
                { name: 'tag', type: 'text', admin: { width: '60%', description: 'Right of the name, e.g. "Best for steady sales".' } },
              ],
            },
            {
              name: 'body',
              type: 'textarea',
              admin: { rows: 2, description: 'The sentence. Wrap words in **double stars** to make them bold.' },
            },
            {
              type: 'row',
              fields: [
                { name: 'first', type: 'text', label: 'First quarter', admin: { width: '50%', description: 'Plain-text fallback, shown only when "First-quarter figures" below is empty. e.g. "$1,000 flat".' } },
                { name: 'after', type: 'text', label: 'After that', admin: { width: '50%', description: 'Shown in bold, e.g. "$1,500 a quarter".' } },
              ],
            },
            {
              name: 'figures',
              type: 'array',
              label: 'First-quarter figures',
              dbName: 'pp_plan_figures',
              maxRows: 2,
              labels: { singular: 'Figure', plural: 'Figures' },
              admin: {
                components: { RowLabel: rowLabel(['value', 'unit'], 'Figure') },
                description:
                  'Big numbers for the "First quarter" cell, each with a small unit under it, e.g. "20%" + "of online revenue". Two figures show side by side with "or" between. Leave empty to show the plain "First quarter" text instead.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'value', type: 'text', required: true, admin: { width: '40%', description: 'e.g. "$1,000" or "20%".' } },
                    { name: 'unit', type: 'text', admin: { width: '60%', description: 'e.g. "flat" or "of online revenue".' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'threshold',
          type: 'text',
          label: 'Boxed note',
          admin: { description: 'The outlined line under the plans. **Double stars** for bold.' },
        },
        linkField({ name: 'nextLink', label: 'Marketing link (outlined button)', description: 'e.g. "Book a call about marketing" to /book-a-call. Leave empty for no button.' }),
        { name: 'finePrint', type: 'textarea', label: 'Small print', admin: { rows: 3 } },
      ],
    },
    {
      name: 'statement',
      type: 'textarea',
      label: 'Closing statement',
      admin: { rows: 2, description: 'The bold statement under the cards.' },
    },
    {
      name: 'statementAccent',
      type: 'text',
      label: 'Statement accent',
      admin: { description: 'Optional: a sentence copied from the statement to show in the accent colour.' },
    },
    {
      name: 'terms',
      type: 'array',
      label: 'Terms',
      maxRows: 3,
      labels: { singular: 'Term', plural: 'Terms' },
      admin: {
        components: { RowLabel: rowLabel(['label'], 'Term') },
        description: 'Up to three closed-by-default rows (click to open), e.g. "Switching early". Add, remove and drag to reorder.',
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'body', type: 'textarea', required: true, admin: { rows: 3 } },
      ],
    },
  ],
}
