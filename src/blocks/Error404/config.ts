import type { Block } from 'payload'

import { rowLabel } from '../../components/admin/rowLabel'
import { linkField } from '../../fields'

/** The shipped wording (design 404.dc.html), shared with Component.tsx so the no-document fallback matches the field defaults. */
export const ERROR404_DEFAULTS = {
  code: '404',
  heading: 'This page leaked.',
  body: "Unlike your store's demand, it's not coming back.",
  links: [
    { link: { type: 'custom', url: '/book-a-call', label: 'Book a Call', newTab: false } },
    { link: { type: 'custom', url: '/', label: 'Home', newTab: false } },
    { link: { type: 'custom', url: '/work', label: 'Work', newTab: false } },
  ],
} as const

/**
 * Error404 block (SCHEMA §8.6 item 23, p21): the branded "page not found" state,
 * rendered from the reserved `404` page document by not-found.tsx. One variant.
 * The heading is the page's h1 (the big numeral is decorative); the first link is
 * the primary button, the rest are quiet outline buttons.
 */
export const Error404: Block = {
  slug: 'error404',
  interfaceName: 'Error404Block',
  labels: { singular: '404 error state', plural: '404 error states' },
  fields: [
    {
      name: 'code',
      type: 'text',
      defaultValue: ERROR404_DEFAULTS.code,
      admin: { description: 'The huge number. Decorative only (hidden from screen readers). Leave empty to hide it.' },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: ERROR404_DEFAULTS.heading,
      admin: { description: 'The first sentence. This is the page title that search engines and screen readers see.' },
    },
    {
      name: 'body',
      type: 'text',
      defaultValue: ERROR404_DEFAULTS.body,
      admin: { description: 'The sentence that follows the heading, on the same line.' },
    },
    {
      name: 'links',
      type: 'array',
      minRows: 1,
      maxRows: 3,
      labels: { singular: 'Button', plural: 'Buttons' },
      defaultValue: ERROR404_DEFAULTS.links,
      admin: {
        components: { RowLabel: rowLabel(['link.label'], 'Button') },
        description: 'One to three buttons. The first is the main (dark) button, the others are outlined. Drag to reorder.',
        initCollapsed: false,
      },
      fields: [linkField({ name: 'link', label: 'Button', required: true })],
    },
  ],
}
