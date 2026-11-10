import type { Block, Condition, TextFieldSingleValidation } from 'payload'
import { text } from 'payload/shared'

import { rowLabel } from '../../components/admin/rowLabel'

/**
 * CategoryTabs block (SCHEMA §8.5 item 20). Two variants:
 * - `faq` (default, p11 §Category nav): sticky under the header; the tabs are
 *   NOT fields, they are derived from the `accordionFAQ` `group` blocks on the
 *   same page (heading + anchorId) so the nav can never drift from the sections.
 * - `jump` (service pages, 2026-11-09): a numbered "Jump to" index whose links
 *   are written by hand (`links`) and point at section anchors on the same page.
 */
const onlyJump: Condition = (_data, siblingData) => siblingData?.variant === 'jump'

/** A link target: lowercase words joined by single hyphens. Empty is rejected by `required`. */
const validateLinkTarget: TextFieldSingleValidation = (value, options) => {
  const base = text(value, options)
  if (base !== true) return base
  if (typeof value !== 'string' || value.trim() === '') return true
  if (/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value.trim())) return true
  return 'Use lowercase letters, digits and single hyphens only, e.g. "price" or "how-it-works". No "#" and no spaces.'
}

export const CategoryTabs: Block = {
  slug: 'categoryTabs',
  interfaceName: 'CategoryTabsBlock',
  labels: { singular: 'Category tabs', plural: 'Category tabs' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      // Not `required`: rows saved before this field existed (and seed / showcase fixtures without it) mean `faq`.
      defaultValue: 'faq',
      options: [
        { label: 'FAQ category tabs (built from the FAQ groups on this page)', value: 'faq' },
        { label: 'Jump-to index (numbered links you write, for long service pages)', value: 'jump' },
      ],
      admin: {
        description:
          'FAQ tabs follow the FAQ category groups on the page automatically. The jump-to index is a sticky bar of numbered links to sections of the same page.',
      },
    },
    {
      name: 'label',
      type: 'text',
      defaultValue: 'Jump to',
      admin: {
        description: 'The small grey word at the start of the bar, e.g. "Jump to".',
        condition: onlyJump,
      },
    },
    {
      name: 'ariaLabel',
      type: 'text',
      required: true,
      defaultValue: 'FAQ categories',
      admin: {
        description:
          'Name read aloud by screen readers for this navigation (not shown on the page), e.g. "FAQ categories" or "On this page". For FAQ tabs, the visible tabs are built automatically from the FAQ category groups on this page: add or reorder those groups and the tabs follow.',
      },
    },
    {
      name: 'links',
      type: 'array',
      label: 'Links',
      minRows: 1,
      maxRows: 10,
      labels: { singular: 'Link', plural: 'Links' },
      admin: {
        components: { RowLabel: rowLabel(['label'], 'Link') },
        description:
          'The numbered links, in order (01, 02, ...). Each one scrolls to a section on this page: type the same "Section link name" that you set on that section. A link whose section is missing from the page is left out automatically. Add, remove and drag to reorder.',
        initCollapsed: false,
        condition: onlyJump,
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', required: true, admin: { width: '55%', description: 'The link text, e.g. "Who it\'s for".' } },
            {
              name: 'anchorId',
              type: 'text',
              required: true,
              validate: validateLinkTarget,
              admin: { width: '45%', description: 'The section link name it jumps to, e.g. "fit". Letters, digits and hyphens.' },
            },
          ],
        },
      ],
    },
  ],
}
