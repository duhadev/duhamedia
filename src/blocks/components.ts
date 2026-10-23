import type React from 'react'

import { AccordionFAQBlock } from './AccordionFAQ/Component'
import { BookingEmbedBlock } from './BookingEmbed/Component'
import { CaseStudyCardsBlock } from './CaseStudyCards/Component'
import { CategoryTabsBlock } from './CategoryTabs/Component'
import { DirectContactBlock } from './DirectContact/Component'
import { Error404Block } from './Error404/Component'
import { FinalCTABlock } from './FinalCTA/Component'
import { FormEmbedBlock } from './FormEmbed/Component'
import { HeroBlock } from './Hero/Component'
import { LinkStackBlock } from './LinkStack/Component'
import { MetricEventBlock } from './MetricEvent/Component'
import { MiniCTAStripBlock } from './MiniCTAStrip/Component'
import { NewsletterBandBlock } from './NewsletterBand/Component'
import { OfferBlockBlock } from './OfferBlock/Component'
import { PhaseTimelineBlock } from './PhaseTimeline/Component'
import { PostListBlock } from './PostList/Component'
import { ProofStripBlock } from './ProofStrip/Component'
import { ReviewWallBlock } from './ReviewWall/Component'
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
  offerBlock: OfferBlockBlock,
  proofStrip: ProofStripBlock,
  caseStudyCards: CaseStudyCardsBlock,
  metricEvent: MetricEventBlock,
  reviewWall: ReviewWallBlock,
  testimonialRow: TestimonialRowBlock,
  twoTrackPanels: TwoTrackPanelsBlock,
  phaseTimeline: PhaseTimelineBlock,
  teamIntro: TeamIntroBlock,
  richContent: RichContentBlock,
  specLedger: SpecLedgerBlock,
  newsletterBand: NewsletterBandBlock,
  formEmbed: FormEmbedBlock,
  bookingEmbed: BookingEmbedBlock,
  directContact: DirectContactBlock,
  accordionFAQ: AccordionFAQBlock,
  categoryTabs: CategoryTabsBlock,
  linkStack: LinkStackBlock,
  postList: PostListBlock,
  error404: Error404Block,
}
