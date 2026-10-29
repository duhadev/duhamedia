import type { Block } from 'payload'

import { headlineFields, linkField } from '../../fields'

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
          'After the visitor clicks the booking button, this tab moves to this page while the calendar opens in a new tab. Leave empty to use the page at /thank-you. If that page is not published, this tab stays put.',
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
  ],
}
