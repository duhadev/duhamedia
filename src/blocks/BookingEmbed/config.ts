import type { Block, Condition, Field } from 'payload'

import { headlineFields, linkField } from '../../fields'
import { rowLabel } from '../../components/admin/rowLabel'

/** Flow sub-fields show (and validate) only while the flow is switched on. */
const flowOn: Condition = (_data, siblingData) => siblingData?.enabled === true

const flowText = (name: string, label: string, description: string, defaultValue?: string): Field => ({
  name,
  type: 'text',
  label,
  ...(defaultValue ? { defaultValue } : {}),
  admin: { condition: flowOn, description },
})

const flowFields: Field[] = [
  {
    name: 'enabled',
    type: 'checkbox',
    label: 'Show as a step-by-step flow (Book → Homework → What happens next)',
    defaultValue: false,
    admin: {
      description:
        'On: this widget is the whole booking section and shows one step at a time on a white ground. Step 1 is the booking panel above; the visitor moves on with the "I\'ve booked my call" button; sending the homework moves them to the last step. Off: the booking panel alone on a grey band.',
    },
  },
  {
    type: 'row',
    admin: { condition: flowOn },
    fields: [
      { name: 'bookLabel', type: 'text', label: 'Step 1 name', defaultValue: 'Book', admin: { width: '33%', description: 'Names in the step bar at the top.' } },
      { name: 'homeworkLabel', type: 'text', label: 'Step 2 name', defaultValue: 'Homework', admin: { width: '33%' } },
      { name: 'nextLabel', type: 'text', label: 'Step 3 name', defaultValue: "What's next", admin: { width: '33%' } },
    ],
  },
  flowText(
    'bookedLabel',
    '"Booked" button text',
    'Step 1: the button that moves on to the homework. It appears once the visitor has opened the calendar (or beside an embedded calendar). Not shown while booking is offline.',
    "I've booked my call",
  ),
  flowText('backLabel', '"Back" button text', 'Step 2: goes back to the booking step.', 'Back'),
  flowText('questionText', 'Quick-question line', 'Step 1: small line under the booking panel, e.g. "Have a quick question first?". Leave empty for none. Hidden while booking is offline (that panel already links to Contact).'),
  {
    ...linkField({ name: 'questionLink', label: 'Quick-question link' }),
    admin: { condition: flowOn, description: 'Usually "Contact us", linking to the Contact page.' },
  },
  {
    name: 'homeworkForm',
    type: 'relationship',
    relationTo: 'forms',
    maxDepth: 0,
    label: 'Homework form',
    admin: {
      condition: flowOn,
      description:
        'Step 2: the form to show (Forms collection, usually "Pre-call homework"). Its questions and the message shown after sending are edited on the form. Leave empty to skip this step.',
    },
  },
  flowText('homeworkEyebrow', 'Homework small line', 'Step 2: small uppercase line above the heading, e.g. "Pre-call homework". Optional.'),
  flowText('homeworkHeading', 'Homework heading', 'Step 2: the heading above the form.'),
  { name: 'homeworkBody', type: 'textarea', label: 'Homework paragraph', admin: { condition: flowOn, description: 'Step 2: optional short line under the heading.' } },
  flowText('homeworkSubmitLabel', 'Homework send button', 'Step 2: text on the send button. Leave empty to use the label set on the form.'),
  flowText('nextHeading', 'Last step heading', 'Step 3: heading, e.g. "What happens next". The form\'s own "sent" message shows above it.'),
  { name: 'nextBody', type: 'textarea', label: 'Last step paragraph', admin: { condition: flowOn, description: 'Step 3: optional short line under the heading.' } },
  {
    name: 'nextSteps',
    type: 'array',
    label: 'Last step: what happens next',
    labels: { singular: 'Item', plural: 'Items' },
    maxRows: 6,
    admin: {
      condition: flowOn,
      components: { RowLabel: rowLabel(['title'], 'Item') },
      description: 'Step 3: a short numbered list. Add, remove or drag to reorder.',
    },
    fields: [
      { name: 'title', type: 'text', required: true },
      { name: 'detail', type: 'textarea' },
    ],
  },
]

/**
 * BookingEmbed block (SCHEMA §8.4 item 17; p9 Book a Call §Booking widget
 * desktop / §Booking flow mobile → link-out, MERGED R8). One variant, three
 * states, chosen at render from `site-settings` (Booking tab):
 *
 * - **link-out** (default, launch: DECISIONS §M/§M2): on-brand "Book your call"
 *   panel; the button opens `bookingUrl` in a new tab and sends this tab to the
 *   Thank You page (DECISIONS §Q, option b).
 * - **embed** (`bookingMode: embed` + URL): the booking page in a frame from
 *   `md` up, with an "open in a new tab" link; below `md` the link-out panel
 *   (R8: no custom mobile slot picker at launch).
 * - **no-URL fallback** (`bookingUrl` empty or not https): fallback heading /
 *   body + a link to Contact.
 *
 * - **stepped flow** (`flow.enabled`, opt-in; p9 owner brief 2026-11-08): the
 *   block becomes the page's one widget and shows one step at a time: 1 Book
 *   (any state above) → 2 Pre-call homework (a form-builder form, same
 *   CMSForm / Turnstile / submission path as FormEmbed) → 3 What happens next.
 *   Off by default, so every other use keeps its look.
 *
 * The booking address itself is NOT a block field: it lives once in Site
 * settings > Booking, so every booking surface changes together.
 */
export const BookingEmbed: Block = {
  slug: 'bookingEmbed',
  interfaceName: 'BookingEmbedBlock',
  labels: { singular: 'Booking widget', plural: 'Booking widgets' },
  // Single-variant block: no `variant` select (SCHEMA §8.4 "Variants: 1 (3 states)").
  fields: [
    ...headlineFields({
      description:
        'The headline on the booking panel, e.g. "Pick a time that works." Shown in capitals. Also names the booking calendar for screen readers.',
      accent: false, // rendered in --accent-primary = ink, same as the headline
    }),
    {
      name: 'body',
      type: 'textarea',
      admin: {
        description: 'Optional short paragraph under the headline: what happens when they click.',
      },
    },
    {
      name: 'buttonLabel',
      type: 'text',
      required: true,
      defaultValue: 'Book your call',
      admin: {
        description:
          'Text on the booking button. The button opens the booking calendar (set in Site settings > Booking) in a new tab.',
      },
    },
    {
      name: 'noteUnderButton',
      type: 'text',
      admin: {
        description: 'Optional small line under the panel, e.g. "Opens our calendar in a new tab. Times shown in your time zone."',
      },
    },
    {
      name: 'newTabLabel',
      type: 'text',
      label: '"Open in a new tab" link text',
      defaultValue: 'Trouble with the calendar? Open it in a new tab',
      admin: {
        description:
          'Only used when the calendar is shown inside the page (Site settings > Booking): the small link under it.',
      },
    },
    {
      name: 'thankYouPage',
      type: 'relationship',
      relationTo: 'pages',
      maxDepth: 0,
      label: 'Thank You page',
      admin: {
        description:
          'After the visitor clicks the booking button, this tab moves to this page while the calendar opens in a new tab. Leave empty to use the page at /thank-you. If that page is not published, this tab stays put. Not used by the step-by-step flow (the visitor stays on the page and moves to the homework step).',
      },
    },
    {
      type: 'collapsible',
      label: 'When no booking link is set',
      admin: {
        description:
          'Shown instead of the booking button while Site settings > Booking has no booking page address: the headline, an optional paragraph and a link (usually to Contact).',
      },
      fields: [
        {
          name: 'fallbackHeading',
          type: 'text',
          required: true,
          defaultValue: 'Booking is offline. Write to us instead.',
          admin: { description: 'Headline shown while there is no booking link. Shown in capitals.' },
        },
        {
          name: 'fallbackBody',
          type: 'textarea',
          admin: { description: 'Optional short paragraph under it.' },
        },
        linkField({
          name: 'fallbackLink',
          label: 'Contact link',
          description: 'Usually "Contact us", linking to the Contact page.',
        }),
      ],
    },
    {
      name: 'flow',
      type: 'group',
      label: 'Step-by-step flow',
      fields: flowFields,
    },
  ],
}
