import { TWO_JOBS } from '@/lib/homeCopy'

import type { ShowcaseData, ShowcaseEntry } from '../registry'

/** Home B (design-reference/home-b-2026-11-09) unit B fixtures. Owned by the unit B block-coder. */

const LINK_URLS = ['/services/shopify-theme-development', '/services/marketing']

const twoJobs = {
  variant: 'equal',
  ...TWO_JOBS,
  panels: TWO_JOBS.panels.map(({ linkLabel, ...panel }, i) => ({
    ...panel,
    id: `hb-tt-${i + 1}`,
    link: { type: 'custom' as const, url: LINK_URLS[i], label: linkLabel },
  })),
} satisfies ShowcaseData<'twoTrackPanels'>

export const unitBEntries: ShowcaseEntry[] = [
  {
    block: 'twoTrackPanels',
    variant: 'equal — Home B',
    label: 'Home B "Two jobs. One team." (stats, points, numerals, link + inline note)',
    data: twoJobs,
  },
  {
    block: 'twoTrackPanels',
    variant: 'equal — Home B, sparse',
    label: 'fallback: second panel has no stats, points, link or note; no intro, no accent phrase',
    data: {
      ...twoJobs,
      intro: undefined,
      accentPhrase: undefined,
      panels: [
        twoJobs.panels[0],
        { id: 'hb-tt-3', label: 'Service 02', title: 'Then we grow it.', body: 'Marketing, run by the same team that built your store.' },
      ],
    },
  },
]
