import type { Block } from 'payload'

/**
 * CategoryTabs block (SCHEMA §8.5 item 20). p11 §Category nav, sticky under
 * the header. The tabs themselves are NOT fields: they are derived from the
 * `accordionFAQ` `group` blocks on the same page (heading + anchorId) so the
 * nav can never drift from the sections. Only the accessible name is editable.
 */
export const CategoryTabs: Block = {
  slug: 'categoryTabs',
  interfaceName: 'CategoryTabsBlock',
  labels: { singular: 'Category tabs', plural: 'Category tabs' },
  fields: [
    {
      name: 'ariaLabel',
      type: 'text',
      required: true,
      defaultValue: 'FAQ categories',
      admin: {
        description:
          'Name read aloud by screen readers for this navigation (not shown on the page). The visible tabs are built automatically from the FAQ category groups on this page: add or reorder those groups and the tabs follow.',
      },
    },
  ],
}
