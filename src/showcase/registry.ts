import type { BlockData, PageBlockType } from '@/blocks/types'
import type { CaseStudy, Client, Media, TeamMember, Testimonial } from '@/payload-types'

/**
 * /_showcase registry (B0; CLAUDE.md "Block showcase sandbox"): every block and
 * every variant/state of every block, rendered back to back in this order.
 * A block or variant in the schema but missing here is a Gate K finding.
 *
 * Fixtures are STATIC objects typed to the generated block row types (not DB
 * documents), so the sandbox also proves fallback/empty states. Relationship
 * and upload fields may hold populated objects shaped like the generated
 * collection types (e.g. a `Media` with `url`, `width`, `height`, `alt`).
 *
 * `viewport` is the code-level viewport-scope annotation for anything that is
 * intentionally single-viewport; the label shows it. The block component
 * itself does the hiding (`md:hidden` for mobile-only, `max-md:hidden` for
 * desktop-only).
 */
export type ShowcaseViewport = 'mobile-only' | 'desktop-only'

type ShowcaseEntryFor<K extends PageBlockType> = {
  /** Block slug (`blockType`). */
  block: K
  /** Variant value, or the state name for single-variant blocks (e.g. 'default', 'no-url'). */
  variant: string
  viewport?: ShowcaseViewport
  /** Short scaffolding note, e.g. "fallback: no published case studies". */
  label: string
  /** The block row without `blockType` (taken from `block`). */
  data: Omit<BlockData<K>, 'blockType'>
}

export type ShowcaseEntry = { [K in PageBlockType]: ShowcaseEntryFor<K> }[PageBlockType]

/* ---- Shared fixture documents (static, shaped like the generated types) ---- */

/** Placeholder monochrome logo: public/logo.svg (100×100). SVGs render unoptimized (ui/Media). */
const logoMedia: Media = {
  id: 1,
  alt: '[Client logo]',
  url: '/logo.svg',
  width: 100,
  height: 100,
  mimeType: 'image/svg+xml',
  updatedAt: '',
  createdAt: '',
}

/** Six placeholder clients (never real names, CLAUDE.md content rule 3); every other one has a logo. */
const fixtureClients: Client[] = ['[Client A]', '[Client B]', '[Client C]', '[Client D]', '[Client E]', '[Client F]'].map(
  (name, i) => ({ id: i + 1, name, logo: i % 2 ? logoMedia : null, updatedAt: '', createdAt: '' }),
)

const wordmarkClients: Client[] = fixtureClients.map((c) => ({ ...c, logo: null }))

/**
 * Placeholder image: public/logo.svg (the square Duha mark, 100×100). Used for the TeamIntro
 * photo/portrait and the video-testimonial poster: the only square-ish asset in public/, so a
 * 4:5 or 16:9 `object-cover` crop still reads as a placeholder rather than a sliced wordmark.
 */
const placeholderImage: Media = {
  id: 2,
  alt: 'Placeholder image (Duha mark)',
  url: '/logo.svg',
  width: 100,
  height: 100,
  mimeType: 'image/svg+xml',
  updatedAt: '',
  createdAt: '',
}

/** Empty Lexical document for the required rich-text fields of a fixture case study. */
const emptyRichText = {
  root: { type: 'root', children: [], direction: null, format: '', indent: 0, version: 1 },
} satisfies CaseStudy['narrative']['before']['body']

/**
 * A PUBLISHED fixture case study (static; never a DB document). Placeholder client and figures
 * only (CLAUDE.md content rule 3). `heroMedia` is a bare id, which `Media` renders as nothing,
 * so the card shows its ink 16:9 media frame.
 */
const mk = (n: number, client: string, value: string, label: string): CaseStudy => ({
  id: 900 + n,
  _status: 'published',
  title: `[Fixture study ${n}]`,
  slug: `fx-${n}`,
  client: { id: 900 + n, name: client, createdAt: '', updatedAt: '' },
  track: 'build',
  engagementLine: '[Engagement line]',
  headlineMetric: { value, label },
  cardSummary: '[Placeholder summary of the work.]',
  inShort: '[Placeholder in-short line.]',
  heroMedia: 900 + n,
  narrative: {
    before: { title: 'The before', body: emptyRichText },
    strategy: { title: 'The strategy', body: emptyRichText },
    results: { title: 'The results', body: emptyRichText },
  },
  resultsTable: { rows: [] },
  clientVoice: { link: { type: 'custom' } },
  createdAt: '',
  updatedAt: '',
})

const fixtureStudies: CaseStudy[] = [
  mk(1, '[Client A]', '[+N%]', 'Revenue, [N] months'),
  mk(2, '[Client B]', '[N×]', 'ROAS after restructure'),
  mk(3, '[Client C]', '[$N]', 'Agency fees after handover'),
]

/**
 * Published fixture testimonials. The video one uses the YouTube id `PLACEHOLDER` (11 characters,
 * accepted by src/lib/youtube.ts): the tile links out to a video that does not exist, which is
 * the point — no real third-party video in the sandbox.
 */
const tm = (id: number, rest: Partial<Testimonial> & Pick<Testimonial, 'quote' | 'authorName'>): Testimonial => ({
  id,
  _status: 'published',
  source: 'direct',
  format: 'text',
  createdAt: '',
  updatedAt: '',
  ...rest,
})

const textTestimonials: Testimonial[] = [
  tm(901, {
    quote: '[Placeholder quote — a client in their own words, one or two sentences.]',
    authorName: '[Client name]',
    authorRole: '[Role, Company]',
    source: 'google-review',
    rating: 5,
  }),
  tm(902, {
    quote: '[Placeholder quote about the handover, not the agency.]',
    authorName: '[Client name]',
    authorRole: '[Role, Company]',
    client: fixtureClients[1],
    metric: { value: '[N]%', label: '[Metric label]' },
  }),
  tm(903, { quote: '[Placeholder quote, short.]', authorName: '[Client name]' }),
]

const mixedTestimonials: Testimonial[] = [
  tm(904, {
    format: 'video',
    quote: '[Placeholder pull quote from the video.]',
    authorName: '[Client name]',
    authorRole: '[Role, Company]',
    video: { url: 'https://www.youtube.com/watch?v=PLACEHOLDER', poster: placeholderImage, durationLabel: '1:42' },
  }),
  tm(905, {
    quote: '[Placeholder LinkedIn recommendation.]',
    authorName: '[Client name]',
    authorRole: '[Role, Company]',
    source: 'linkedin',
    rating: 4,
  }),
  tm(906, { quote: '[Placeholder quote, plain.]', authorName: '[Client name]' }),
]

/** Published fixture team member (placeholder name/role/bio; socials point at the platforms' roots). */
const fixtureMember: TeamMember = {
  id: 901,
  _status: 'published',
  name: '[Founder name]',
  role: '[Role]',
  bio: '[One-line bio — from the founder]',
  photo: placeholderImage,
  socials: [
    { id: 'fx-sm-1', platform: 'linkedin', url: 'https://www.linkedin.com/' },
    { id: 'fx-sm-2', platform: 'x', url: 'https://x.com/' },
    { id: 'fx-sm-3', platform: 'github', url: 'https://github.com/' },
  ],
  createdAt: '',
  updatedAt: '',
}

const homepageSteps: NonNullable<BlockData<'phaseTimeline'>['steps']> = [
  { id: 'fx-pt-s1', number: '01', title: 'Intake', phase: '1', detail: 'We start from your P&L, not your homepage. Margins, repeat rate, and what actually sells.' },
  { id: 'fx-pt-s2', number: '02', title: 'Research', phase: '1', detail: 'Competitors, category language, and the one objection that stalls your buyer.' },
  { id: 'fx-pt-s3', number: '03', title: 'Branding', phase: '1', detail: 'Positioning is decided before a single visual. The look follows the claim.' },
  { id: 'fx-pt-s4', number: '04', title: 'Design', phase: '1', detail: 'Every screen is drawn against the funnel step it has to carry.' },
  { id: 'fx-pt-s5', number: '05', title: 'Development', phase: '1', detail: 'GA4 and server events go live before the theme, so launch has a baseline.' },
  { id: 'fx-pt-s6', number: '06', title: 'Onboarding', phase: '2', detail: 'Your team meets the dashboard they will own, while we are still on the hook.' },
  { id: 'fx-pt-s7', number: '07', title: 'Engine launch', phase: '2', detail: 'Content and acquisition run on one calendar with one owner of the number.' },
  { id: 'fx-pt-s8', number: '08', title: 'Handover', phase: '3', detail: 'Documentation, training, and the keys. The goal is your team running this without us.' },
]

const teamIntroCopy = {
  eyebrow: "Who you'd work with",
  eyebrowTick: false,
  heading: 'Chicago operators, not account managers.',
  body: "You've managed five freelancers who never talked to each other. [Placeholder body — final copy TBD.]",
  link: { type: 'custom', url: '/about', label: 'More about us →' },
} satisfies Partial<BlockData<'teamIntro'>>

const testimonialRowBase = {
  variant: 'row',
  eyebrow: 'What clients say',
  heading: 'Proof, in their words.',
  cta: { type: 'custom', url: '/work', label: 'All studies' },
} satisfies Partial<BlockData<'testimonialRow'>>

const ledgerFallback = {
  fallbackEyebrow: 'No studies live yet — the numbers we can show',
  fallbackHeading: 'Numbers anyway.',
  fallbackAccentPhrase: 'anyway.',
} satisfies Partial<BlockData<'caseStudyCards'>>

/*
 * Entries are grouped by block in p1 Homepage order (SCHEMA §9): Hero → ProofStrip →
 * CaseStudyCards → MiniCTAStrip → TwoTrackPanels → PhaseTimeline → TeamIntro (intro) →
 * TestimonialRow → TeamIntro (founder-card) → FinalCTA. TeamIntro appears twice on p1, so
 * its two variants sit in their own slots.
 *
 * DB-backed entries: CaseStudyCards `source: 'featured'` and TestimonialRow `studyCard.source:
 * 'featured'` read published case studies through the Local API, so they show the REAL launch
 * state (fallback while nothing is published). Every other relation holds static fixtures.
 *
 * Scarcity-backed entries (ProofStrip, FinalCTA) read the LIVE `scarcity` global: a key the
 * global has no statement for is skipped with a server console.error by design (no bare
 * numbers). The `capacity` key is used so at least one loud/quiet line renders on a DB
 * whose global holds only that statement.
 */
export const showcaseEntries: ShowcaseEntry[] = [
  {
    block: 'hero',
    variant: 'typographic',
    label: 'homepage hero, placeholder copy',
    data: {
      variant: 'typographic',
      eyebrow: 'Integrated ecommerce growth partner — Chicago',
      eyebrowTick: true,
      heading: "[STRATEGIC PLACEHOLDER — final copy TBD] Your ecommerce growth team, until you don't need one.",
      accentPhrase: "until you don't need one.",
      badge: { show: true, text: '$X.XM client revenue tracked' },
      body: 'One team builds your store, runs your marketing, and trains yours to take over.',
      pricingNote: 'Builds from $5K. Engines from $1K/mo.',
      ctas: [
        { link: { type: 'custom', url: '/book-a-call', label: 'Book a Call' } },
        { link: { type: 'custom', url: '/work', label: 'See the Work' } },
      ],
      subNote: '[Placeholder sub-note]',
      verticalMicrocopy: 'Build · Operate · Hand over',
      geometry: true,
    },
  },
  {
    block: 'hero',
    variant: 'typographic — minimal',
    label: 'empty-field fallback: heading only, no eyebrow/badge/body/CTAs, geometry off',
    data: {
      variant: 'typographic',
      heading: '[STRATEGIC PLACEHOLDER — final copy TBD] Heading only.',
      geometry: false,
    },
  },
  {
    block: 'proofStrip',
    variant: 'scarcity',
    label: 'statements ongoing + capacity (from the scarcity global), pricing note, 6 manual logos',
    data: {
      variant: 'scarcity',
      statements: [
        { id: 'fx-ps-1', key: 'ongoing' },
        { id: 'fx-ps-2', key: 'capacity' },
      ],
      pricingNote: 'Builds start at $5K',
      logos: { show: true, eyebrow: "Stores we've run numbers for", source: 'manual', clients: wordmarkClients },
    },
  },
  {
    block: 'proofStrip',
    variant: 'scarcity — logos hidden',
    label: 'fallback: logo row hidden, statements only',
    data: {
      variant: 'scarcity',
      statements: [
        { id: 'fx-ps-3', key: 'ongoing' },
        { id: 'fx-ps-4', key: 'capacity' },
      ],
      logos: { show: false },
    },
  },
  {
    block: 'proofStrip',
    variant: 'scarcity — one statement',
    label: 'one statement (capacity) + logos',
    data: {
      variant: 'scarcity',
      statements: [{ id: 'fx-ps-5', key: 'capacity' }],
      logos: { show: true, eyebrow: "Stores we've run numbers for", source: 'manual', clients: wordmarkClients },
    },
  },
  {
    block: 'proofStrip',
    variant: 'scarcity — logo images',
    label: 'logo images for all six clients',
    data: {
      variant: 'scarcity',
      statements: [
        { id: 'fx-ps-6', key: 'ongoing' },
        { id: 'fx-ps-7', key: 'capacity' },
      ],
      pricingNote: 'Builds start at $5K',
      logos: {
        show: true,
        eyebrow: "Stores we've run numbers for",
        source: 'manual',
        clients: fixtureClients.map((c) => ({ ...c, logo: logoMedia })),
      },
    },
  },
  {
    block: 'caseStudyCards',
    variant: 'cards',
    label: 'live: 3 published fixture studies (manual picks), all-studies link',
    data: {
      layout: 'cards',
      eyebrow: 'Selected work',
      heading: 'The work, in numbers.',
      accentPhrase: 'in numbers.',
      source: 'manual',
      caseStudies: fixtureStudies,
      limit: 3,
      cardLinkLabel: 'Read the case study',
      allLink: { type: 'custom', url: '/work', label: 'All studies →' },
      fallbackMode: 'ledger',
    },
  },
  {
    block: 'caseStudyCards',
    variant: 'cards — featured (DB)',
    label:
      'REAL launch state: source featured, read from the database (published + featured only). With no published study this is the ledger fallback',
    data: {
      layout: 'cards',
      heading: 'The work, in numbers.',
      accentPhrase: 'in numbers.',
      source: 'featured',
      limit: 3,
      allLink: { type: 'custom', url: '/work', label: 'All studies →' },
      fallbackMode: 'ledger',
      ...ledgerFallback,
      fallbackBody: 'Studies publish here as clients sign off.',
      fallbackMetrics: [
        { id: 'fx-cs-1', label: '[Metric label]', value: '[N]', sub: '[quiet line]' },
        { id: 'fx-cs-2', label: '[Capacity]', value: '[N]', accent: true },
      ],
    },
  },
  {
    block: 'caseStudyCards',
    variant: 'cards — fallback ledger',
    label: 'fallback: ledger (no published studies), 3 rows incl. sub-line + accent, pricing note',
    data: {
      layout: 'cards',
      source: 'manual',
      caseStudies: [],
      allLink: { type: 'custom' },
      fallbackMode: 'ledger',
      ...ledgerFallback,
      fallbackBody: 'Studies publish here as clients sign off.',
      fallbackMetrics: [
        { id: 'fx-cs-3', label: '[Metric label]', value: '[N]', sub: '[quiet line]' },
        { id: 'fx-cs-4', label: '[Metric label]', value: '[N]' },
        { id: 'fx-cs-5', label: '[Capacity]', value: '[N]', accent: true },
      ],
      pricingNote: '[Pricing note, small inline]',
    },
  },
  {
    block: 'caseStudyCards',
    variant: 'cards — fallback note',
    label: 'fallback: note (text block only)',
    data: {
      layout: 'cards',
      source: 'manual',
      caseStudies: [],
      allLink: { type: 'custom' },
      fallbackMode: 'note',
      ...ledgerFallback,
      fallbackBody: '[Full case studies publish here as clients sign off.]',
    },
  },
  {
    block: 'miniCTAStrip',
    variant: 'band',
    label: 'homepage mini CTA, linked strip',
    data: {
      variant: 'band',
      text: 'One team. One dashboard. A handover date.',
      link: { type: 'custom', url: '/book-a-call', newTab: false, label: 'Book a Call' },
    },
  },
  {
    block: 'miniCTAStrip',
    variant: 'band — link unresolved',
    label: 'fallback: link does not resolve (text only, no button)',
    data: {
      variant: 'band',
      text: 'One team. One dashboard. A handover date.',
      link: { type: 'internal', reference: null, label: 'Book a Call' },
    },
  },
  {
    block: 'twoTrackPanels',
    variant: 'equal',
    label: 'homepage What we do, placeholder copy',
    data: {
      variant: 'equal',
      heading: 'What we actually do',
      accentPhrase: 'actually',
      panels: [
        {
          id: 'fx-tt-1',
          title: 'First, we build it.',
          body: 'A Shopify store that converts, built from scratch or rebuilt. [Placeholder copy.]',
          pricingNote: 'Builds start at $5K.',
          link: { type: 'custom', url: '/services/shopify-theme-development', label: 'How the build works →' },
        },
        {
          id: 'fx-tt-2',
          title: 'Then we grow it.',
          accentTitle: true,
          body: 'Email, ads, content, SEO, GBP and CRM run by one team. [Placeholder copy.]',
          pricingNote: 'Engines start at $1K/mo.',
          link: { type: 'custom', url: '/services/marketing', label: 'What we run →' },
        },
      ],
    },
  },
  {
    block: 'twoTrackPanels',
    variant: 'equal — no links/pricing',
    label: 'fallback: panels without link or pricing note',
    data: {
      variant: 'equal',
      heading: 'What we actually do',
      panels: [
        { id: 'fx-tt-3', title: 'First, we build it.', body: 'Placeholder body without link or price.', link: { type: 'internal' } },
        {
          id: 'fx-tt-4',
          title: 'Then we grow it.',
          accentTitle: true,
          body: 'Placeholder body without link or price.',
          link: { type: 'internal' },
        },
      ],
    },
  },
  {
    block: 'phaseTimeline',
    variant: 'accordion',
    label: 'homepage process: 8 steps / 3 phases, placeholder copy',
    data: {
      variant: 'accordion',
      eyebrow: 'How it runs',
      eyebrowTick: false,
      heading: 'Three phases. The last one is the point.',
      accentPhrase: 'the point.',
      intro: 'Eight steps, one calendar. You approve at dated checkpoints and finish owning the whole thing.',
      phases: [
        { id: 'fx-pt-p1', number: 'Phase 1', title: 'Build foundation' },
        { id: 'fx-pt-p2', number: 'Phase 2', title: 'Operate engine' },
        { id: 'fx-pt-p3', number: 'Phase 3', title: 'Build independence' },
      ],
      steps: homepageSteps,
    },
  },
  {
    block: 'phaseTimeline',
    variant: 'accordion — minimal',
    label: 'minimal: 1 phase / 3 steps (last phase at full weight), one step without detail, closing line',
    data: {
      variant: 'accordion',
      heading: 'One phase, three steps.',
      phases: [{ id: 'fx-pt-p4', number: 'Phase 1', title: 'Build independence' }],
      steps: [
        { id: 'fx-pt-s9', number: '01', title: 'Audit', phase: '1', detail: '[Placeholder] What we look at first, in one sentence.' },
        { id: 'fx-pt-s10', number: '02', title: 'Train', phase: '1', detail: '[Placeholder] Who on your team learns what.' },
        { id: 'fx-pt-s11', number: '03', title: 'Hand over', phase: '1' },
      ],
      closingLine: '[Placeholder closing line]',
    },
  },
  {
    block: 'teamIntro',
    variant: 'intro',
    label: 'homepage founder #1: text + 4:5 photo, link',
    data: { variant: 'intro', ...teamIntroCopy, photo: placeholderImage },
  },
  {
    block: 'teamIntro',
    variant: 'intro — no photo',
    label: 'fallback: no photo (single column, text only)',
    data: { variant: 'intro', ...teamIntroCopy },
  },
  {
    block: 'testimonialRow',
    variant: 'row',
    label:
      '3 text testimonials (first: 5 stars + Google review; second: client logo + metric) + study card source featured (DB) → no published study → quiet fallback figure',
    data: {
      ...testimonialRowBase,
      testimonials: textTestimonials,
      studyCard: {
        show: true,
        label: 'A study in full',
        source: 'featured',
        readLabel: 'Read the study',
        fallbackMetric: { value: '[N]%', label: '[Metric label]', sub: '[Client A · placeholder]' },
      },
    },
  },
  {
    block: 'testimonialRow',
    variant: 'row — mixed, no study',
    label: 'video (placeholder YouTube id) + LinkedIn (4 stars) + plain; card shown but no study and no figure → testimonials reflow into a row',
    data: {
      ...testimonialRowBase,
      testimonials: mixedTestimonials,
      studyCard: { show: true, label: 'A study in full', source: 'featured', readLabel: 'Read the study', fallbackMetric: {} },
    },
  },
  {
    block: 'testimonialRow',
    variant: 'row — published study (manual)',
    label: 'populated: study card from a published fixture study picked by hand',
    data: {
      ...testimonialRowBase,
      testimonials: textTestimonials.slice(0, 2),
      studyCard: { show: true, label: 'A study in full', source: 'manual', caseStudy: fixtureStudies[0], readLabel: 'Read the study' },
    },
  },
  {
    block: 'testimonialRow',
    variant: 'row — empty',
    label: 'fallback: zero testimonials and no study → renders nothing (empty space below is by design)',
    data: { ...testimonialRowBase, testimonials: [], studyCard: { show: false } },
  },
  {
    block: 'teamIntro',
    variant: 'founder-card',
    label: 'homepage founder #2: headline, body, published placeholder member card with socials',
    data: {
      variant: 'founder-card',
      heading: 'One founder, no layers.',
      accentPhrase: 'no layers.',
      body: 'The person who scopes the work is the person who does it. [One-sentence bio, founder-authored.]',
      member: fixtureMember,
      link: { type: 'custom' },
    },
  },
  {
    block: 'teamIntro',
    variant: 'founder-card — no member',
    label: 'fallback: no member → renders nothing + server console.error (by design; empty space below)',
    data: {
      variant: 'founder-card',
      heading: 'One founder, no layers.',
      accentPhrase: 'no layers.',
      body: 'x',
      member: null,
      link: { type: 'custom' },
    },
  },
  {
    block: 'finalCTA',
    variant: 'default',
    label: 'capacity line (capacity statement from the scarcity global) + 2 buttons',
    data: {
      heading: "Your store already has the demand. It's leaking it.",
      capacity: 'capacity',
      buttons: [
        { id: 'fx-fc-1', link: { type: 'custom', url: '/book-a-call', label: 'Book a Call' } },
        { id: 'fx-fc-2', link: { type: 'custom', url: '/contact', label: 'Contact us' } },
      ],
    },
  },
  {
    block: 'finalCTA',
    variant: 'default — no capacity',
    label: 'capacity none, 1 button, accent phrase',
    data: {
      heading: 'Get the build scoped in writing.',
      accentPhrase: 'scoped',
      capacity: 'none',
      buttons: [{ id: 'fx-fc-3', link: { type: 'custom', url: '/book-a-call', label: 'Book a Call' } }],
    },
  },
  {
    block: 'finalCTA',
    variant: 'default — template defaults',
    label:
      'fallback: empty heading + no buttons → Site settings defaults; engines-line (skipped while the global has no such statement)',
    data: { heading: '', capacity: 'engines-line', buttons: [] },
  },
]
