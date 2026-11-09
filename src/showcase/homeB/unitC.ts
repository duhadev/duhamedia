import { PROCESS, TOOLKIT } from '@/lib/homeCopy'

import type { ShowcaseData, ShowcaseEntry } from '../registry'

/** Home B (design-reference/home-b-2026-11-09) unit C fixtures. Owned by the unit C block-coder. Copy: src/lib/homeCopy.ts. */

// The showcase already renders an AccordionFAQ group with anchor "process" (p11); a distinct id keeps the sandbox free of duplicate DOM ids.
const processRow: ShowcaseData<'phaseTimeline'> = { ...PROCESS, anchorId: 'home-b-process' }

const { blockType: _b, ...toolkitGrid } = TOOLKIT

export const unitCEntries: ShowcaseEntry[] = [
  { block: 'phaseTimeline', variant: 'grid (row, home B)', label: 'one 8-column row from 1280px, stacked below', data: processRow },
  { block: 'specLedger', variant: 'tools (grid, home B)', label: 'hairline 4x3 grid + ink link tile; 2 columns, no tags on phones', data: toolkitGrid },
]
