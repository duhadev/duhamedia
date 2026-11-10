import { BUILD, MARKETING } from '@/lib/servicePagesCopy'

import type { ShowcaseData, ShowcaseEntry } from '../registry'

/** Service pages (design-reference/service-pages-2026-11-09) unit A fixtures. Owned by the unit A block-coder. */

const hero = ({ blockType: _t, ...copy }: typeof BUILD.hero | typeof MARKETING.hero, extra: Partial<ShowcaseData<'hero'>> = {}): ShowcaseData<'hero'> => ({ ...copy, ...extra })
const jump = (
  { blockType: _t, ...copy }: typeof BUILD.jump | typeof MARKETING.jump,
  extra: Partial<ShowcaseData<'categoryTabs'>> = {},
): ShowcaseData<'categoryTabs'> => ({ ...copy, ...extra })

export const unitAEntries: ShowcaseEntry[] = [
  {
    block: 'hero',
    variant: 'typographic — glance (Build)',
    label: 'Build hero: 2-crumb light breadcrumb, wine inline accent, at-a-glance card (4 rows, one wine, footer). Card stacks after the buttons on phones',
    data: hero(BUILD.hero),
  },
  {
    block: 'hero',
    variant: 'typographic — glance (Marketing)',
    label: 'Marketing hero: same card, wine value in row 2',
    data: hero(MARKETING.hero),
  },
  {
    block: 'hero',
    variant: 'typographic — glance, minimal',
    label: 'card with no title and no footer, no breadcrumb, no inline wine accent (accent line off)',
    data: hero(BUILD.hero, {
      breadcrumb: [],
      accentWine: false,
      accentPhrase: null,
      glance: { rows: [{ label: 'Rows only', value: '3', accent: false }, { label: 'Second row', value: '5d', accent: true }] },
    }),
  },
  {
    block: 'categoryTabs',
    variant: 'jump — Build',
    label: 'sticky jump-to bar, 7 numbered links (sticks under the header; scrolls sideways on phones). Showcase links are not filtered against page sections',
    data: jump(BUILD.jump),
  },
  {
    block: 'categoryTabs',
    variant: 'jump — Marketing',
    label: 'same bar, Marketing links',
    data: jump(MARKETING.jump),
  },
  {
    block: 'categoryTabs',
    variant: 'jump — custom label',
    label: 'custom "label" and three links',
    data: jump(BUILD.jump, {
      label: 'On this page',
      ariaLabel: 'Page sections',
      links: [
        { id: 'sp-j-1', label: 'First', anchorId: 'first' },
        { id: 'sp-j-2', label: 'Second', anchorId: 'second' },
        { id: 'sp-j-3', label: 'Third', anchorId: 'third' },
      ],
    }),
  },
]
