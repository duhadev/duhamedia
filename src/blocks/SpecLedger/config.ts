import type { Block, Condition } from 'payload'

import { eyebrowField, headlineFields, pricingNote } from '../../fields'
import { rowLabel } from '../../components/admin/rowLabel'

/**
 * SpecLedger block (SCHEMA §8.3 item 14, new, X7): a coded deliverable ledger.
 * This unit ships three variants (`list`, template p18, is added later):
 * - `cards`       p5 §Template anatomy (T-01…T-04, mockup image per card) and
 *                 p6 §Camera work (two image cards); `cardLayout` picks which.
 * - `expandable`  p5 §Specification (D-01…D-07), p6 §Channel specification
 *                 (E-01…E-06): native <details> rows with a "+" marker.
 * - `signal-flow` p6 §Signal flow: the coded tiles converge on a hub card
 *                 ("Everything reports here" + dashboard image).
 *
 * Conditions read the parent block's `variant` from `blockData` (verified:
 * payload@3.91.0 fields/config/types.d.ts `Condition`, third argument).
 */

type Variant = 'cards' | 'expandable' | 'signal-flow'
type BlockDataArg = { blockData?: { variant?: string } }

const variantIs =
  (...variants: Variant[]): Condition =>
  (_data, _sibling, { blockData }: BlockDataArg = {}) =>
    variants.includes((blockData?.variant ?? 'cards') as Variant)

const isExpandable = variantIs('expandable')

const isAnatomyCards: Condition = (_data, _sibling, { blockData }: { blockData?: { variant?: string; cardLayout?: string } } = {}) =>
  (blockData?.variant ?? 'cards') === 'cards' && (blockData?.cardLayout ?? 'anatomy') === 'anatomy'

export const SpecLedger: Block = {
  slug: 'specLedger',
  interfaceName: 'SpecLedgerBlock',
  labels: { singular: 'Spec ledger', plural: 'Spec ledgers' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'cards',
      options: [
        { label: 'Cards (framed cards with a picture each)', value: 'cards' },
        { label: 'Expandable rows (coded rows that open: what we do / how you will know)', value: 'expandable' },
        { label: 'Signal flow (coded tiles feeding into one dashboard card)', value: 'signal-flow' },
      ],
      admin: { description: 'Which layout to use.' },
    },
    {
      name: 'cardLayout',
      type: 'select',
      defaultValue: 'anatomy',
      label: 'Card style',
      options: [
        { label: 'Template cards (title and code on top, picture, one line under, 2 x 2 grid)', value: 'anatomy' },
        { label: 'Feature cards (title and line on top, large picture below, side by side)', value: 'feature' },
      ],
      admin: {
        condition: variantIs('cards'),
        description: 'Template cards suit a coded set such as T-01 to T-04. Feature cards suit two big pictures.',
      },
    },
    {
      name: 'tone',
      type: 'select',
      defaultValue: 'auto',
      label: 'Background',
      options: [
        { label: 'Automatic (the usual one for this layout)', value: 'auto' },
        { label: 'White', value: 'light' },
        { label: 'Light grey', value: 'grey' },
      ],
      admin: { description: 'Automatic: grey for template cards and signal flow, white for the others.' },
    },
    eyebrowField({
      defaultTick: false,
      description:
        'The small grey caption above the content, e.g. "Specification — what every build ships with". Optional.',
    }),
    ...headlineFields({
      required: false,
      description: 'Optional headline above the caption. The designs use only the small caption, so leave this empty unless you need a full headline.',
    }),
    {
      name: 'note',
      type: 'text',
      label: 'Side note',
      admin: {
        condition: isAnatomyCards,
        description: 'Short grey line beside the caption (under the cards on mobile), e.g. "Four templates carry almost every order."',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Items',
      maxRows: 10,
      labels: { singular: 'Item', plural: 'Items' },
      admin: {
        components: { RowLabel: rowLabel(['code', 'title'], 'Item') },
        initCollapsed: true,
        description: 'The cards, rows or tiles. Add, remove and drag to reorder.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'code',
              type: 'text',
              maxLength: 8,
              admin: { width: '25%', description: 'Short code, e.g. "D-01", "T-02" or "E-03". Optional.' },
            },
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: { width: '75%', description: 'The item name, e.g. "Conversion build". Shown in capitals.' },
            },
          ],
        },
        {
          name: 'line',
          type: 'text',
          label: 'One-line summary',
          admin: {
            description:
              'The short line beside the title (rows), under the picture (template cards), or under the title (feature cards). Not used by signal flow tiles.',
            condition: variantIs('cards', 'expandable'),
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          maxDepth: 1,
          admin: {
            condition: variantIs('cards'),
            description: 'The picture for this card (template cards 4:3, feature cards wide). The card keeps its shape if left empty.',
          },
        },
        {
          name: 'whatLabel',
          type: 'text',
          label: 'First detail label',
          admin: {
            condition: isExpandable,
            description: 'Small label above the first detail, e.g. "What we build" or "What we run".',
          },
        },
        {
          name: 'what',
          type: 'textarea',
          label: 'First detail',
          admin: { condition: isExpandable, description: 'Shown when the row is opened.' },
        },
        {
          name: 'proofLabel',
          type: 'text',
          label: 'Second detail label',
          admin: {
            condition: isExpandable,
            description: 'Small label above the second detail, e.g. "How you\'ll know it worked" or "What you\'ll see on the dashboard".',
          },
        },
        {
          name: 'proof',
          type: 'textarea',
          label: 'Second detail',
          admin: { condition: isExpandable, description: 'Shown when the row is opened, next to the first detail.' },
        },
      ],
    },
    {
      name: 'firstOpen',
      type: 'checkbox',
      label: 'Open the first row',
      defaultValue: true,
      admin: {
        condition: isExpandable,
        description: 'Show the first row already open. Visitors can open and close any number of rows.',
      },
    },
    {
      name: 'hub',
      type: 'group',
      label: 'Dashboard card',
      admin: {
        condition: variantIs('signal-flow'),
        description: 'The card the tiles feed into. Leave empty to show only the tiles.',
      },
      fields: [
        {
          name: 'kicker',
          type: 'text',
          label: 'Small caption',
          admin: { description: 'e.g. "Everything reports here".' },
        },
        { name: 'heading', type: 'text', admin: { description: 'The card headline, e.g. "One dashboard. You see what we see."' } },
        { name: 'body', type: 'textarea', admin: { description: 'The supporting paragraph.' } },
        { name: 'note', type: 'text', label: 'Quiet line', admin: { description: 'Optional small grey line under the paragraph (desktop only).' } },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          maxDepth: 1,
          label: 'Dashboard picture',
          admin: { description: 'A screenshot of the dashboard. The card keeps its shape if left empty.' },
        },
      ],
    },
    pricingNote(),
  ],
}
