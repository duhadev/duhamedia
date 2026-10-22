import type React from 'react'

import { AccordionFAQBlock } from './AccordionFAQ/Component'
import { CaseStudyCardsBlock } from './CaseStudyCards/Component'
import { FinalCTABlock } from './FinalCTA/Component'
import { HeroBlock } from './Hero/Component'
import { MetricEventBlock } from './MetricEvent/Component'
import { MiniCTAStripBlock } from './MiniCTAStrip/Component'
import { NewsletterBandBlock } from './NewsletterBand/Component'
import { PhaseTimelineBlock } from './PhaseTimeline/Component'
import { ProofStripBlock } from './ProofStrip/Component'
import { RichContentBlock } from './RichContent/Component'
import { SpecLedgerBlock } from './SpecLedger/Component'
import { TeamIntroBlock } from './TeamIntro/Component'
import { TestimonialRowBlock } from './TestimonialRow/Component'
import { TwoTrackPanelsBlock } from './TwoTrackPanels/Component'
import type { BlockData, PageBlockType } from './types'

/**
 * Block COMPONENT registry (B0): `blockType` → React component, used by
 * src/components/RenderBlocks.tsx (pages) and /_showcase.
 *
 * Typed against the generated `Page['layout']` union: once a block's config is
 * in src/blocks/index.ts and `generate:types` has run, TypeScript REQUIRES its
 * entry here (missing key = type error), and each component's props are that
 * block's generated row type.
 *
 * Add: `import { HeroBlock } from './Hero/Component'` and `hero: HeroBlock,`.
 */
export type BlockComponents = {
  [K in PageBlockType]: React.ComponentType<BlockData<K>>
}

export const blockComponents: BlockComponents = {
  hero: HeroBlock,
  miniCTAStrip: MiniCTAStripBlock,
  finalCTA: FinalCTABlock,
  proofStrip: ProofStripBlock,
  caseStudyCards: CaseStudyCardsBlock,
  metricEvent: MetricEventBlock,
  testimonialRow: TestimonialRowBlock,
  twoTrackPanels: TwoTrackPanelsBlock,
  phaseTimeline: PhaseTimelineBlock,
  teamIntro: TeamIntroBlock,
  richContent: RichContentBlock,
  specLedger: SpecLedgerBlock,
  newsletterBand: NewsletterBandBlock,
  accordionFAQ: AccordionFAQBlock,
}
