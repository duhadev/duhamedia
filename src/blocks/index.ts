import type { Block } from 'payload'

import { AccordionFAQ } from './AccordionFAQ/config'
import { CaseStudyCards } from './CaseStudyCards/config'
import { FinalCTA } from './FinalCTA/config'
import { Hero } from './Hero/config'
import { MetricEvent } from './MetricEvent/config'
import { MiniCTAStrip } from './MiniCTAStrip/config'
import { PhaseTimeline } from './PhaseTimeline/config'
import { ProofStrip } from './ProofStrip/config'
import { RichContent } from './RichContent/config'
import { SpecLedger } from './SpecLedger/config'
import { TeamIntro } from './TeamIntro/config'
import { TestimonialRow } from './TestimonialRow/config'
import { TwoTrackPanels } from './TwoTrackPanels/config'

/**
 * Block CONFIG registry (B0): the one place a page-layout block is registered
 * on the Payload side. `pages.layout` is built from this list
 * (src/collections/Pages.ts → `pageLayoutField(pageBlocks)`), so adding a
 * block = one import + one array entry here.
 *
 * Config only. This file is loaded by payload.config.ts (CLI, migrations,
 * type generation), so it must never import a React component or CSS.
 * Components are registered in src/blocks/components.ts.
 *
 * Order = the order of the "Add section" picker in the admin; keep SCHEMA.md
 * §8 order (Hero, MiniCTAStrip, FinalCTA, OfferBlock, ProofStrip, …).
 *
 * While this list is EMPTY, `pages.layout` is left out of the collection
 * entirely: payload@3.91.0's admin crashes on a blocks field with `blocks: []`
 * (see `pageLayoutField` in src/collections/Pages.ts). An empty blocks field
 * creates no tables, so the first block's migration is the one that adds the
 * `pages_blocks_*` tables.
 */
export const pageBlocks: Block[] = [
  Hero,
  MiniCTAStrip,
  FinalCTA,
  ProofStrip,
  CaseStudyCards,
  MetricEvent,
  TestimonialRow,
  TwoTrackPanels,
  PhaseTimeline,
  TeamIntro,
  RichContent,
  SpecLedger,
  AccordionFAQ,
]
