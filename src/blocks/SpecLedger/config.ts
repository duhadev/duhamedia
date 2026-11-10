import type { Block, Condition } from 'payload'

import { eyebrowField, headlineFields, linkField, pricingNote } from '../../fields'
import { anchorIdField } from '../../fields/anchorId'
import { rowLabel } from '../../components/admin/rowLabel'
import { toolLogoOptions } from './toolLogos'

/**
 * SpecLedger block (SCHEMA §8.3 item 14, new, X7): a coded deliverable ledger.
 * Four variants:
 * - `cards`       p5 §Template anatomy (T-01…T-04, mockup image per card) and
 *                 p6 §Camera work (two image cards); `cardLayout` picks which.
 * - `expandable`  p5 §Specification (D-01…D-07), p6 §Channel specification
 *                 (E-01…E-06): native <details> rows with a "+" marker.
 * - `signal-flow` p6 §Signal flow: the coded tiles converge on a hub card
 *                 ("Everything reports here" + dashboard image).
 * - `tools`       brochure p4 "Preferred tools": a ruled row of tool logos +
 *                 names (`logo` select or `logoImage` upload) and a footnote.
 * - `list`        p18 §What's inside: a narrow column of check bullets
 *                 (`items[].title` only; the lead-magnet template fills it
 *                 from the lead magnet's value bullets).
 *
 * Conditions read the parent block's `variant` from `blockData` (verified:
 * payload@3.91.0 fields/config/types.d.ts `Condition`, third argument).
 */

type Variant = 'cards' | 'expandable' | 'signal-flow' | 'list' | 'tools'
type BlockDataArg = { blockData?: { variant?: string } }

const variantIs =
  (...variants: Variant[]): Condition =>
  (_data, _sibling, { blockData }: BlockDataArg = {}) =>
    variants.includes((blockData?.variant ?? 'cards') as Variant)

const isExpandable = variantIs('expandable')

const isAnatomyCards: Condition = (_data, _sibling, { blockData }: { blockData?: { variant?: string; cardLayout?: string } } = {}) =>
  (blockData?.variant ?? 'cards') === 'cards' && (blockData?.cardLayout ?? 'anatomy') === 'anatomy'

type ToolsCtx = { blockData?: { variant?: string; toolsLayout?: string } }
const isToolsGrid: Condition = (_d, _s, { blockData }: ToolsCtx = {}) => blockData?.variant === 'tools' && blockData?.toolsLayout === 'grid'
const isToolsCatalog: Condition = (_d, _s, { blockData }: ToolsCtx = {}) => blockData?.variant === 'tools' && blockData?.toolsLayout === 'catalog'
/** Grid and catalog both show the big headline with the wine accent phrase. */
const isToolsBigHead: Condition = (d, s, c) => isToolsGrid(d, s, c) || isToolsCatalog(d, s, c)

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
        { label: 'Signal flow (coded tiles feeding into one summary card)', value: 'signal-flow' },
        { label: 'Check list (a short column of ticked bullets, e.g. "What\'s inside")', value: 'list' },
        { label: 'Tools row (a row of tool logos and names, e.g. "Preferred tools")', value: 'tools' },
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
      name: 'toolsLayout',
      type: 'select',
      defaultValue: 'row',
      label: 'Tools layout',
      options: [
        { label: 'Row (logos over names, ruled top and bottom)', value: 'row' },
        { label: 'Tiles (bordered tiles: logo left, name and what it is for)', value: 'tiles' },
        { label: 'Grid (hairline grid of tools with a BUILD / GROW tag each and a dark link tile last, big headline)', value: 'grid' },
        { label: 'Catalog (tool cards in labelled groups: logo, name and what we do with it; big headline)', value: 'catalog' },
      ],
      admin: {
        condition: variantIs('tools'),
        isClearable: false,
        description: 'Tiles show the heading as a small grey caption. Grid shows it as a big headline with the side note beside it.',
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
      accent: isToolsBigHead, // ink everywhere except the tools grid and catalog, where the accent phrase is wine
    }),
    anchorIdField({
      condition: variantIs('tools'),
      description:
        'Tools layouts: lets the "Jump to" bar and other pages link straight to this section, e.g. "toolkit" → /services/marketing#toolkit. Lowercase letters, numbers and single hyphens. Must be unique on the page. Optional.',
    }),
    {
      name: 'note',
      type: 'text',
      label: 'Side note',
      admin: {
        condition: (data, sibling, ctx) => isAnatomyCards(data, sibling, ctx) || variantIs('tools')(data, sibling, ctx),
        description:
          'Short grey line beside the caption (under the cards on mobile), e.g. "Four templates carry almost every order." Tools row: the line under the heading, e.g. "A small, proven stack." Tools grid and catalog: the lede beside the headline.',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Items',
      maxRows: 16,
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
              admin: { width: '75%', description: 'The item name, e.g. "Custom theme". Shown in capitals. In the check list it is the bullet sentence, shown as written.' },
            },
          ],
        },
        {
          name: 'groupLabel',
          type: 'text',
          label: 'Group label',
          admin: {
            condition: isToolsCatalog,
            description:
              'Catalog only: a new label starts a new group (a small grey title over its own grid of cards), e.g. "Paid ads". Items with the same label as the one above stay in that group; leave empty to continue the group above.',
          },
        },
        {
          name: 'line',
          type: 'text',
          label: 'One-line summary',
          admin: {
            description:
              'Tools tiles: what the tool is for, e.g. "Paid ads". The short line beside the title (rows), under the picture (template cards), or under the title (feature cards). Not used by signal flow tiles.',
            condition: variantIs('cards', 'expandable', 'tools'),
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'logo',
              type: 'select',
              label: 'Logo',
              options: toolLogoOptions,
              admin: {
                width: '50%',
                condition: variantIs('tools'),
                description: 'Pick the tool\'s logo (built in, in its brand colours; the two icons are drawn in ink). Leave empty for no logo, or upload one on the right for a tool not in the list.',
              },
            },
            {
              name: 'logoImage',
              type: 'upload',
              relationTo: 'media',
              maxDepth: 1,
              label: 'Other logo (upload)',
              admin: {
                width: '50%',
                condition: variantIs('tools'),
                description: 'Only for a tool not in the list. A square logo, ideally SVG or PNG on transparent. Used instead of the picked logo.',
              },
            },
          ],
        },
        {
          name: 'tag',
          type: 'select',
          label: 'Tag',
          defaultValue: 'none',
          options: [
            { label: 'None', value: 'none' },
            { label: 'BUILD (grey)', value: 'build' },
            { label: 'GROW (wine)', value: 'grow' },
          ],
          admin: {
            condition: isToolsGrid,
            isClearable: false,
            description: 'Tools grid: the small tag at the right of the tile. Shown on computers only.',
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
            description: 'Small label above the second detail, e.g. "How you\'ll know it worked" or "What you\'ll see".',
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
      label: 'Summary card',
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
        { name: 'heading', type: 'text', admin: { description: 'The card headline, e.g. "You see what we see."' } },
        { name: 'body', type: 'textarea', admin: { description: 'The supporting paragraph.' } },
        { name: 'note', type: 'text', label: 'Quiet line', admin: { description: 'Optional small grey line under the paragraph (desktop only).' } },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          maxDepth: 1,
          label: 'Summary picture',
          admin: { description: 'A picture for the summary card, e.g. a screenshot of a report. The card keeps its shape if left empty.' },
        },
      ],
    },
    {
      name: 'linkTile',
      type: 'group',
      label: 'Link tile (last cell)',
      admin: {
        condition: isToolsGrid,
        description: 'The dark cell after the last tool, e.g. "See every tool on Services". Leave the link text empty for no link tile.',
      },
      fields: [
        linkField({ name: 'link', label: 'Link', description: 'Where the tile goes. The link text is the tile label, e.g. "See every tool on Services".' }),
        {
          name: 'shortLabel',
          type: 'text',
          label: 'Short label (phones)',
          admin: { description: 'The label on phones, e.g. "Every tool". Leave empty to use the link text.' },
        },
      ],
    },
    {
      name: 'footnote',
      type: 'text',
      label: 'Footnote',
      admin: {
        condition: variantIs('tools'),
        description:
          'Small grey line under the row, e.g. "Product names are trademarks of their respective owners and are shown to identify the tools we work with." Optional.',
      },
    },
    pricingNote(),
  ],
}
