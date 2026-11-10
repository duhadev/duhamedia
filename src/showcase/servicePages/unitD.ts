import { BUILD, MARKETING } from '@/lib/servicePagesCopy'
import type { ServiceSheetBlock, SpecLedgerBlock } from '@/payload-types'

import type { ShowcaseData, ShowcaseEntry } from '../registry'

/** Service pages (design-reference/service-pages-2026-11-09) unit D fixtures: ServiceSheet fit / deliverables / duties, SpecLedger tools catalog. */

const noLink = { type: 'custom' as const, newTab: false }

type SheetData = ShowcaseData<'serviceSheet'>
type LedgerData = ShowcaseData<'specLedger'>

const sheet = ({ blockType: _t, ...copy }: Partial<ServiceSheetBlock>, extra: Partial<SheetData> = {}): SheetData => ({
  box: { link: noLink },
  nextStep: { link: noLink },
  ...copy,
  ...extra,
})
const ledger = ({ blockType: _t, ...copy }: Partial<SpecLedgerBlock>, extra: Partial<LedgerData> = {}): LedgerData => ({ variant: 'tools', ...copy, ...extra })


export const unitDEntries: ShowcaseEntry[] = [
  {
    block: 'serviceSheet',
    variant: 'fit — two groups (Build)',
    label: 'Build "Who it\'s for": copy left (closing line bold), grey card right: Right for you if (wine squares) / Not for you if (outlined squares), hairline note. Card stacks under the copy below lg',
    data: sheet(BUILD.fit, { anchorId: 'sp-fit-build' }),
  },
  {
    block: 'serviceSheet',
    variant: 'fit — one group + {link} note (Marketing)',
    label: 'Marketing "Who it\'s for": one group, note "No store yet? {link}." with the link inside the sentence',
    data: sheet(MARKETING.fit, { anchorId: 'sp-fit-marketing' }),
  },
  {
    block: 'serviceSheet',
    variant: 'fit — note without {link} / no card',
    label: 'Note has no {link}: the link goes at the end of it. Second block: copy only, no groups or note, so no card and a single column',
    data: sheet(MARKETING.fit, {
      anchorId: 'sp-fit-end-link',
      box: { note: 'No store yet? Start there.', link: { type: 'custom', newTab: false, url: '/services/shopify-theme-development', label: 'Start with the build' } },
    }),
  },
  {
    block: 'serviceSheet',
    variant: 'fit — copy only',
    label: 'No groups and no box: a single column, no grey card',
    data: sheet({ presentation: 'fit', eyebrow: BUILD.fit.eyebrow, eyebrowTick: true, heading: BUILD.fit.heading, accentPhrase: BUILD.fit.accentPhrase, why: BUILD.fit.why, box: { link: noLink } }),
  },
  {
    block: 'serviceSheet',
    variant: 'deliverables (Build)',
    label: 'Build "What you get": 4 label/line rows left (200px label column from md), grey "You own it" panel right with {link} in its note. The Build tools row below is the SpecLedger tiles',
    data: sheet(BUILD.deliverables, { anchorId: 'sp-get' }),
  },
  {
    block: 'specLedger',
    variant: 'tools — tiles (under deliverables)',
    label: 'The Build tools row that sits under "What you get" (existing tiles layout, unchanged)',
    data: ledger(BUILD.tools),
  },
  {
    block: 'serviceSheet',
    variant: 'duties (Marketing)',
    label: 'Marketing "Who does what": grey band, paragraph, You (ink squares, 5) beside Us (wine squares, 10, two columns from md)',
    data: sheet(MARKETING.duties, { anchorId: 'sp-who' }),
  },
  {
    block: 'serviceSheet',
    variant: 'duties — short lists',
    label: 'Both lists at 6 items or fewer: one column each',
    data: sheet({
      ...MARKETING.duties,
      included: {
        groups: [
          { ...MARKETING.duties.included.groups[0], items: MARKETING.duties.included.groups[0].items.slice(0, 3) },
          { ...MARKETING.duties.included.groups[1], items: MARKETING.duties.included.groups[1].items.slice(0, 5) },
        ],
      },
    }),
  },
  {
    block: 'specLedger',
    variant: 'tools — catalog (Marketing toolkit)',
    label: 'Marketing "The toolkit": three groups (2, 4, 6) of hairline cards, 28px logo or ink icon on top, bold name, grey line; 1 column on phones; trademark note once. Group 1 and 2 leave an empty track on wide screens (no grey)',
    data: ledger(MARKETING.toolkit, { anchorId: 'sp-toolkit' }),
  },
  {
    block: 'specLedger',
    variant: 'tools — catalog, ungrouped',
    label: 'No group labels: one grid, no group titles; no footnote',
    data: ledger({
      ...MARKETING.toolkit,
      footnote: undefined,
      items: MARKETING.toolkit.items.slice(0, 5).map(({ groupLabel: _g, ...rest }) => rest),
    }),
  },
]
