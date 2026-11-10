import { BUILD, MARKETING } from '@/lib/servicePagesCopy'

import type { ShowcaseData, ShowcaseEntry } from '../registry'

/** Service pages (design-reference/service-pages-2026-11-09) unit C fixtures. Owned by the unit C block-coder. */

type PhaseCopy = typeof BUILD.steps | typeof MARKETING.month | typeof MARKETING.flow | typeof MARKETING.quarters

const data = ({ blockType: _t, ...copy }: PhaseCopy, anchorId: string): ShowcaseData<'phaseTimeline'> => ({ ...copy, anchorId })

export const unitCEntries: ShowcaseEntry[] = [
  {
    block: 'phaseTimeline',
    variant: 'detail',
    label: 'Build "The six steps": strip + schedule line, rows with sign-off lines and You / You get, wine numeral on 04',
    data: data(BUILD.steps, 'sp-steps'),
  },
  {
    block: 'phaseTimeline',
    variant: 'detail — minimal',
    label: 'no strip, no closing line, no You / You get on the second row, custom labels',
    data: {
      variant: 'detail',
      heading: 'Two steps, nothing optional',
      youLabel: 'Your part',
      youGetLabel: 'Your result',
      steps: [
        { id: 'sp-pd-1', phase: '1', number: '01', title: 'Brief', detail: 'We agree the scope with you.', you: 'Join the call.', youGet: 'A written brief.' },
        { id: 'sp-pd-2', phase: '1', number: '02', title: 'Build', detail: 'We build it.', isSignOff: true, tag: 'Your sign-off: the build.', accent: true },
      ],
    },
  },
  {
    block: 'phaseTimeline',
    variant: 'cells',
    label: 'Marketing "How a month runs": intro beside the head, 4 hairline cells, wine label on 02, closing line',
    data: data(MARKETING.month, 'sp-month'),
  },
  {
    block: 'phaseTimeline',
    variant: 'cells — minimal',
    label: 'minimal: 3 cells (odd count), no intro, no closing line',
    data: {
      variant: 'cells',
      heading: 'Three cells, nothing else',
      steps: [
        { id: 'sp-pc-1', title: 'One', detail: 'First cell.' },
        { id: 'sp-pc-2', number: '02', tag: 'With you', title: 'Two', detail: 'Second cell.' },
        { id: 'sp-pc-3', number: '03', title: 'Three' },
      ],
    },
  },
  {
    block: 'phaseTimeline',
    variant: 'flow',
    label: 'Marketing "Ads first": 2 panels with arrows, outcomes column, bold closing line',
    data: data(MARKETING.flow, 'sp-flow'),
  },
  {
    block: 'phaseTimeline',
    variant: 'flow — panels only',
    label: 'minimal: panels only (no outcomes, no arrow after the last), no closing line',
    data: {
      variant: 'flow',
      heading: 'Just the panels',
      steps: [
        { id: 'sp-pf-1', phase: '1', tag: 'First', title: 'Panel one', detail: 'Text.' },
        { id: 'sp-pf-2', phase: '1', tag: 'Then', title: 'Panel two' },
        { id: 'sp-pf-3', phase: '1', title: 'Panel three' },
      ],
    },
  },
  {
    block: 'phaseTimeline',
    variant: 'ruled',
    label: 'Marketing "Your first two quarters": ruled row of 4, intro under the head',
    data: data(MARKETING.quarters, 'sp-quarters'),
  },
]
