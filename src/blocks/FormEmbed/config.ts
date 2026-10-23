import type { Block, Condition } from 'payload'

import { eyebrowField, headlineFields } from '../../fields'
import { rowLabel } from '../../components/admin/rowLabel'

/**
 * FormEmbed block (SCHEMA §8.4 item 16): one form-builder form rendered on a
 * page section, always behind Turnstile (in the shared CMSForm, not a field).
 *
 * - `standard`: p9 §Homework form (white, roomy) and p12 §Contact form (grey
 *   band). `mobileLayout` = stacked / stepped (p12 phones: one question at a
 *   time; `steps` + `stepped` labels feed PayloadForm's stepped layout).
 * - `reminder`: p10 §Homework reminder. Shows the form in a card unless the
 *   visitor arrives with `?homework=done`, then the done line.
 *
 * Extra fields beyond SCHEMA §8.4 (flagged): `ground` (p9 white vs p12 grey
 * band), `alertLabel` + `reasons` (p10 phone build's "Required before your
 * call" bar and the three reasons with icons).
 */

const forVariants =
  (...variants: string[]): Condition =>
  (_data, siblingData) => variants.includes((siblingData?.variant as string | undefined) ?? 'standard')

export const REASON_ICONS = ['chart', 'clock', 'target', 'check'] as const

export const FormEmbed: Block = {
  slug: 'formEmbed',
  interfaceName: 'FormEmbedBlock',
  labels: { singular: 'Form', plural: 'Forms' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'standard',
      options: [
        { label: 'Standard (heading and the form on the page)', value: 'standard' },
        { label: 'Homework reminder (form in a card, hidden once the homework is sent)', value: 'reminder' },
      ],
      admin: {
        description:
          'Standard: the Book a Call homework form and the Contact form. Homework reminder: the Thank You page card, which switches to the "done" line when the visitor has already sent the homework.',
      },
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      maxDepth: 1,
      required: true,
      admin: {
        description:
          'The form to show (Forms collection). Its fields, their order, the submit label and what happens after sending are edited on the form itself. If the form is deleted, this whole section is hidden.',
      },
    },
    {
      ...eyebrowField({ defaultTick: false, description: 'Small uppercase line above the heading, e.g. "Pre-call homework". Optional.' }),
      admin: { condition: forVariants('standard') },
    },
    {
      name: 'alertLabel',
      type: 'text',
      admin: {
        condition: forVariants('reminder'),
        description:
          'Phones only: the bar across the top of the card with a warning icon, e.g. "Required before your call". Leave empty for no bar. (The desktop design has no bar.)',
      },
    },
    ...headlineFields({
      required: false,
      description: 'The heading above the form. Optional (the Contact page has none, its hero says it all).',
    }),
    {
      name: 'body',
      type: 'textarea',
      admin: { description: 'A short line under the heading, e.g. "Five fields, five minutes." Optional.' },
    },
    {
      name: 'reasons',
      type: 'array',
      maxRows: 5,
      labels: { singular: 'Reason', plural: 'Reasons' },
      admin: {
        components: { RowLabel: rowLabel(['text'], 'Reason') },
        condition: forVariants('reminder'),
        description:
          'Phones only: short reasons listed between the heading and the form, each with an icon. Add, remove or drag to reorder. (The desktop design shows none.)',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'icon',
              type: 'select',
              required: true,
              defaultValue: 'check',
              options: [
                { label: 'Rising chart', value: 'chart' },
                { label: 'Clock', value: 'clock' },
                { label: 'Target', value: 'target' },
                { label: 'Tick', value: 'check' },
              ],
              admin: { width: '30%' },
            },
            { name: 'text', type: 'text', required: true, admin: { width: '70%' } },
          ],
        },
      ],
    },
    {
      name: 'submitLabel',
      type: 'text',
      admin: {
        description: 'Text on the send button, e.g. "Submit homework". Leave empty to use the label set on the form.',
      },
    },
    {
      name: 'ground',
      type: 'select',
      defaultValue: 'light',
      options: [
        { label: 'White, roomy (Book a Call)', value: 'light' },
        { label: 'Grey band, tighter (Contact)', value: 'grey' },
      ],
      admin: { condition: forVariants('standard'), description: 'Background and spacing of the section.' },
    },
    {
      name: 'mobileLayout',
      type: 'select',
      defaultValue: 'stacked',
      options: [
        { label: 'Stacked (all fields at once)', value: 'stacked' },
        { label: 'Stepped (one question at a time)', value: 'stepped' },
      ],
      admin: {
        condition: forVariants('standard'),
        description:
          'How the form looks on phones. Stepped is the Contact page design: one question at a time, with a progress bar and Back / Next buttons. Tablets and desktops always show the whole form.',
      },
    },
    /*
     * Stepped phone layout (integrator, big step 5). Shapes map 1:1 onto
     * PayloadForm's stepped props (src/components/forms/PayloadForm.tsx
     * `steps`, `selectAsOptions`, `progressLabel`, `startLabel`, `nextLabel`,
     * `backLabel`; FormStep in src/components/forms/steps.ts). No steps = one
     * question per step, each headed by the field's own label.
     */
    {
      name: 'steps',
      type: 'array',
      maxRows: 10,
      labels: { singular: 'Step', plural: 'Steps' },
      admin: {
        components: { RowLabel: rowLabel(['heading', 'fieldNames'], 'Step') },
        condition: (_data, siblingData) =>
          ((siblingData?.variant as string | undefined) ?? 'standard') === 'standard' && siblingData?.mobileLayout === 'stepped',
        description:
          'Optional: group the form’s questions into steps and give each step its own heading. Leave empty for one question per step, headed by the question’s label. A form field no step names is added to the last step, so nothing required can be skipped. Add, remove or drag to reorder.',
      },
      fields: [
        {
          name: 'fieldNames',
          type: 'text',
          hasMany: true,
          required: true,
          label: 'Form fields in this step',
          admin: {
            description:
              'The "Name" of each form field shown in this step (as set on the form, e.g. name, email, reason, message). Type a name and press Enter.',
          },
        },
        ...headlineFields({ required: false, description: 'Step heading, e.g. "Who’s reaching out?". Optional: a one-question step uses the field’s label.' }),
        {
          name: 'hint',
          type: 'text',
          admin: { description: 'Quiet line under the step heading, e.g. "First name is plenty." Optional.' },
        },
      ],
    },
    {
      name: 'stepped',
      type: 'group',
      label: 'Stepped layout: buttons and progress',
      admin: {
        condition: (_data, siblingData) =>
          ((siblingData?.variant as string | undefined) ?? 'standard') === 'standard' && siblingData?.mobileLayout === 'stepped',
      },
      fields: [
        {
          name: 'progressLabel',
          type: 'text',
          defaultValue: 'Question {n} of {m}',
          admin: { description: 'Progress line above each step. {n} = this step, {m} = number of steps.' },
        },
        {
          name: 'confirmationHeading',
          type: 'text',
          defaultValue: 'Got it, {firstName}.',
          admin: {
            description:
              'Phones only: the heading of the thank-you panel. {firstName} becomes the first word of the name the visitor typed. If they gave no name, or you leave this empty, the thank-you message from the form itself is shown as written.',
          },
        },
        { name: 'startLabel', type: 'text', defaultValue: 'Start', admin: { description: 'Button on the first step.' } },
        { name: 'nextLabel', type: 'text', defaultValue: 'Next', admin: { description: 'Button on the following steps.' } },
        {
          name: 'backLabel',
          type: 'text',
          defaultValue: 'Back',
          admin: { description: 'Read aloud by screen readers for the Back arrow button (not shown as text).' },
        },
        {
          name: 'sendAnotherLabel',
          type: 'text',
          defaultValue: 'Send another',
          admin: {
            description:
              'Phones only: the button under the thank-you message that clears the form so the visitor can send a second message. Leave empty for "Send another".',
          },
        },
        {
          name: 'selectAsOptions',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Show drop-down questions (e.g. "What’s this about?") as tap-to-pick rows.' },
        },
      ],
    },
    {
      name: 'doneHeading',
      type: 'text',
      defaultValue: 'Homework received.',
      admin: {
        condition: forVariants('reminder'),
        description:
          'Shown instead of the form when the visitor has already sent the homework (they arrive with ?homework=done, or have just sent it here).',
      },
    },
    {
      name: 'doneBody',
      type: 'text',
      admin: {
        condition: forVariants('reminder'),
        description: 'Follows the done heading on the same line, e.g. "We\'ll have read it before the call."',
      },
    },
  ],
}
