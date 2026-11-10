import { BUILD, MARKETING } from '@/lib/servicePagesCopy'

import type { ShowcaseData, ShowcaseEntry } from '../registry'
import { p, root } from '../lexical'

/** Service pages (design-reference/service-pages-2026-11-09) unit E fixtures. Owned by the unit E block-coder. */

const NO_LINK = { type: 'custom', newTab: false } as const

type TwoTrackData = ShowcaseData<'twoTrackPanels'>
type StudyData = ShowcaseData<'caseStudyCards'>
type RichData = ShowcaseData<'richContent'>

const two = ({ blockType: _t, ...copy }: typeof BUILD.compare | typeof BUILD.hours, extra: Partial<TwoTrackData> = {}): TwoTrackData => ({ ...copy, ...extra })
const study = ({ blockType: _t, ...copy }: typeof BUILD.proof | typeof MARKETING.proof, extra: Partial<StudyData> = {}): StudyData => ({
  layout: 'cards',
  source: 'featured',
  allLink: NO_LINK,
  ...copy,
  ...extra,
})
/** The copy ships a band body as `bodyParagraphs` (the migration makes Lexical); the showcase builds the same Lexical here. */
const band = ({ blockType: _t, bodyParagraphs, ...copy }: typeof BUILD.band | typeof MARKETING.band, extra: Partial<RichData> = {}): RichData => ({
  ...copy,
  body: root(...bodyParagraphs.map((t) => p(t))),
  tone: 'grey',
  ...extra,
})


export const unitEEntries: ShowcaseEntry[] = [
  {
    block: 'twoTrackPanels',
    variant: 'compare (Build)',
    label: 'Build "Revision or scratch": one table, first column + header on gray-light with 4px ink top bar, 2px ink outer border, **bold** price, intro beside head, conclusion under. Phones: stacked rows, no sideways scroll',
    data: two(BUILD.compare),
  },
  {
    block: 'twoTrackPanels',
    variant: 'compare — minimal',
    label: 'no anchor, no intro, no conclusion, no column tags, default "Compare" corner label, two rows',
    data: two(BUILD.compare, {
      anchorId: null,
      intro: null,
      conclusion: null,
      rowsLabel: null,
      eyebrow: null,
      heading: 'Two ways in.',
      accentPhrase: 'Two ways',
      panels: [{ title: 'Option one' }, { title: 'Option two' }],
      rows: [
        { label: 'Speed', first: 'Fast, **days**', second: 'Slower, **weeks**' },
        { label: 'Fit', first: 'Good for most', second: 'Good for a few' },
      ],
    }),
  },
  {
    block: 'twoTrackPanels',
    variant: 'bar (Build)',
    label: 'Build "Where the hours go": ~30 wine segment (accentTitle) / ~25 gray-light, weights 30:25, caption under each segment, intro beside head. No stat row',
    data: two(BUILD.hours),
  },
  {
    block: 'twoTrackPanels',
    variant: 'bar — lopsided, no stats, no intro',
    label: '70:30 weights; the second segment has no figure (label only); no anchor, no intro',
    data: two(BUILD.hours, {
      anchorId: null,
      intro: null,
      panels: [
        { ...BUILD.hours.panels[0], share: 70 },
        { ...BUILD.hours.panels[1], share: 30, stats: [] },
      ],
    }),
  },
  {
    block: 'caseStudyCards',
    variant: 'cards — centred facts, tight spacing (Build)',
    label: 'Build "The work, up close": the real published study (DB), eyebrow only, facts centred, 64 top / 40 bottom from md. With no published study: the ledger fallback at the same spacing',
    data: study(BUILD.proof, { layout: 'cards', source: 'featured', limit: 1, fallbackMode: 'note', fallbackHeading: null, fallbackBody: null }),
  },
  {
    block: 'caseStudyCards',
    variant: 'cards — default spacing (control)',
    label: 'same data without centred facts or tight spacing, to compare against the entry above',
    data: study(BUILD.proof, {
      centerFacts: false,
      spacing: 'default',
      layout: 'cards',
      source: 'featured',
      limit: 1,
      fallbackMode: 'note',
      fallbackHeading: null,
      fallbackBody: null,
    }),
  },
  {
    block: 'caseStudyCards',
    variant: 'cards — tight, testimonials fallback (Marketing)',
    label: 'Marketing proof slot: growth track has no published study, so the designed testimonial fallback shows (quiet note until a testimonial is published), grey ground, tight spacing',
    data: study(MARKETING.proof, { layout: 'cards', fallbackTestimonials: [], allLink: NO_LINK }),
  },
  {
    block: 'richContent',
    variant: 'band — split (Build)',
    label: 'Build "Then we grow it": site width, text left, ghost button right (under the text on phones), heading accent in wine, grey ground',
    data: band(BUILD.band),
  },
  {
    block: 'richContent',
    variant: 'band — split (Marketing)',
    label: 'Marketing "No store yet? First, we build it."',
    data: band(MARKETING.band),
  },
  {
    block: 'richContent',
    variant: 'band — split, white, no button',
    label: 'white ground, no link: text only',
    data: band(MARKETING.band, { tone: 'light', link: NO_LINK }),
  },
]
