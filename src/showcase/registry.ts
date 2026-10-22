import type { BlockData, PageBlockType } from '@/blocks/types'
import type { CaseStudy, Client, Faq, Media, TeamMember, Testimonial } from '@/payload-types'

import { customLink, figure, h, hr, internalLink, p, quote, root, text, ul } from './lexical'

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

/* ---- Big step 4 fixtures (static) ---- */

/** Static link targets for Lexical internal links (only `slug` is read, via `docPath`). */
const linkPage = (id: number, slug: string) => ({ relationTo: 'pages' as const, value: { id, slug } })

/** Published fixture FAQs (copy from Services Hub.dc.html "FAQ mini", placeholder-marked). */
const fq = (id: number, question: string, category: Faq['category'], answer: Faq['answer'], status: Faq['_status'] = 'published'): Faq => ({
  id,
  question,
  answer,
  category,
  _status: status,
  createdAt: '',
  updatedAt: '',
})

const faqPricing = fq(
  951,
  'What does it cost?',
  'pricing-contracts',
  root(
    p(
      'Builds start at $5K. Engines start at $1K/mo. Exact scope is priced on the call — see the ',
      internalLink('FAQ', linkPage(9011, 'faq')),
      ' for why. [Placeholder copy.]',
    ),
  ),
)
const faqBuilds = fq(
  952,
  'Can I do the build without the engine?',
  'builds',
  root(
    p("Yes. Phase 1 is fixed-scope and stands alone. We'll tell you on the call whether an engine makes sense for your numbers. [Placeholder copy.]"),
    p('Second paragraph, to show spacing. ', customLink('Book a Call', '/book-a-call'), ' [Placeholder copy.]'),
  ),
)
const faqRetainers = fq(
  953,
  'Do you lock clients into retainers?',
  'process-trust',
  root(p('No — the endgame is your team running it. Phase 3 is a scheduled handover, not a renewal conversation. [Placeholder copy.]')),
)
const faqDraft = fq(954, '[Draft question — must never render]', 'builds', root(p('[Draft answer]')), 'draft')

/** Two-paragraph "What we'd do differently" (placeholder; one internal link). */
const doDifferently = root(
  p("[Placeholder] What we would change with hindsight, in the client's terms — one honest paragraph, never a humble-brag."),
  p('[Placeholder] A second paragraph naming what that would have saved. See ', internalLink('how the build works', linkPage(9012, 'services')), '.'),
)

const clientVoiceBase = {
  variant: 'client-voice',
  differentlyNumber: '04',
  differentlyHeading: "What we'd do differently",
  phaseLabel: 'How this maps to our phases',
} satisfies Partial<BlockData<'testimonialRow'>>

/** Article body (Case Study.dc.html "Article body" grammar; placeholder copy, no real figures). */
const articleBody = root(
  h('h2', 'The Before'),
  p(
    '[Placeholder] What the audit found, in two or three sentences. Traffic grew while revenue stayed flat: a conversion problem, a measurement problem, or ',
    text('both', { bold: true }),
    '.',
  ),
  ul('[Placeholder] Legacy apps blocking first paint', '[Placeholder] A checkout with too many fields', '[Placeholder] Tracking that double-counted returning customers'),
  figure(placeholderImage, 'Fig. 1 — [Placeholder caption: the checkout funnel at audit.]'),
  h('h2', 'The Strategy'),
  p('[Placeholder] The order of work, and why: tracking first, then the store, then acquisition. ', internalLink('See the two tracks', linkPage(9012, 'services')), '.'),
  quote('Scaling spend into a store that leaks demand just buys more leaks.'),
  p('[Placeholder] The tempting alternative, and why it fails. ', internalLink('An unresolved link renders as plain text', null), '.'),
  hr(),
  h('h2', 'The Results'),
  h('h3', '[Placeholder] Month by month'),
  p('[Placeholder] What changed, in order, with figures only from client-approved records ([N]% → [N]%).'),
  h('h4', '[Placeholder] Handover'),
  p('[Placeholder] Who took over what, and when.'),
)

const specExpandableP5: NonNullable<BlockData<'specLedger'>['items']> = [
  ['D-01', 'Conversion build', 'Templates around buyer questions, speed as a feature.', 'The four templates above, laid out around what buyers arrive asking. Speed budgeted before features are added.', 'Conversion and add-to-cart by template, against the store you had.'],
  ['D-02', 'Brand positioning', "What the store says and who it's for. Before design.", 'Category read, buyer read, and the sentence the homepage has to earn — signed off before a screen is designed.', "A stranger describes your store the way your team does."],
  ['D-03', 'UX', "Navigation and checkout paths that don't leak demand.", 'Menu structure, filtering, product page order — the handful of decisions that turn a visit into an order.', 'Drop-off by step, before and after. Leaks get named.'],
  ['D-04', 'Analytics + tracking', 'In before launch, so the numbers tell the truth.', 'Analytics, ecommerce events and ad attribution wired and tested on the live theme.', 'Store revenue reconciles with the ad accounts.'],
  ['D-05', 'SEO foundations', 'Structure, speed and metadata at build time.', 'Crawlable structure, clean templates, titles and schema, plus a speed pass.', 'Indexation and Core Web Vitals pass at launch.'],
  ['D-06', 'Launch support', "We're there when it goes live.", 'A launch checklist, a monitored first fortnight, and a walkthrough of the theme your team now owns.', 'Nothing silently breaks in week one. [Placeholder copy.]'],
].map(([code, title, line, what, proof], i) => ({
  id: `fx-sl-d${i + 1}`,
  code,
  title,
  line,
  whatLabel: 'What we build',
  what,
  proofLabel: "How you'll know it worked",
  proof,
}))
specExpandableP5.push({
  id: 'fx-sl-d7',
  code: 'D-07',
  title: 'Revision',
  line: 'Keep what works, fix what leaks. The default starting point.',
  whatLabel: 'What we build',
  what: "You paid for a store already — we keep what converts and fix what leaks, so you don't waste another [$N] rebuilding from zero.",
  proofLabel: 'No store worth saving?',
  proof: 'Same six steps from a blank theme instead of a broken one. Scratch builds happen only when the math says so. [Placeholder copy.]',
})

const specExpandableP6: NonNullable<BlockData<'specLedger'>['items']> = [
  ['E-01', 'Email', 'The list you already own — built first because it pays for the rest.', 'Welcome, browse-abandon, cart, post-purchase and win-back flows, plus a campaign calendar built around what actually sells. Segmentation from the CRM, not guesswork.', "Revenue per send, flow revenue split from campaign revenue, list growth and churn. Email is the first line because it's the cheapest evidence the engine works."],
  ['E-02', 'Paid ads', 'Spend scales only on tracking that tells the truth.', 'Meta and Google, structured around your margins. Creative tested against the content we shoot in E-03. If attribution is broken we fix it before a dollar moves.', 'Spend, blended return, and cost per new customer next to repeat revenue — so a "good ROAS" can\'t hide an unprofitable account.'],
  ['E-03', 'Social / content', 'We show up with a camera — shot at your business, not stock.', 'Scheduled shoot days on site: product, place, people. One shoot feeds organic posts, ad creative, email and product pages — the same asset working four times.', 'Which assets earned attention and which earned money. Content is judged on the ad account and the store, not on follower count.'],
  ['E-04', 'SEO', 'Compounding capture on the Phase 01 foundations.', 'Category and product page work first, then the articles that answer what buyers actually ask. Built on the structure and speed shipped in Phase 01, so nothing is retrofitted.', 'Non-brand traffic and the revenue behind it, tracked monthly. Slow by design — the line that makes month twelve cheap.'],
  ['E-05', 'GBP', 'For hybrid businesses the profile is a storefront. Run like one.', 'Categories, hours, products and photos kept current, posts on a schedule, and a review routine your staff can actually keep. Same discipline as the ads account.', 'Calls, direction requests and profile-driven visits alongside online orders — local demand counted, not assumed.'],
  ['E-06', 'CRM', 'Repeat purchase decides whether ads are profitable.', 'One customer record wired to the store, email and ads: segments, lifecycle stages, and the lists every other channel targets from.', 'Repeat rate, time between orders and lifetime value by cohort — the quiet numbers that decide how hard you can afford to spend. [Placeholder copy.]'],
].map(([code, title, line, what, proof], i) => ({
  id: `fx-sl-e${i + 1}`,
  code,
  title,
  line,
  whatLabel: 'What we run',
  what,
  proofLabel: "What you'll see on the dashboard",
  proof,
}))

const signalTiles: NonNullable<BlockData<'specLedger'>['items']> = ['Email', 'Ads', 'Content', 'SEO', 'GBP', 'CRM'].map((title, i) => ({
  id: `fx-sl-s${i + 1}`,
  code: `E-0${i + 1}`,
  title,
}))

/* ---- Big step 4, batch B fixtures (static) ---- */

/** A custom link field value. */
const link = (label: string, url: string) => ({ type: 'custom' as const, url, label })

/** Fixture studies with `studyNumber` (the ledger's № column and the next-link). */
const numberedStudies: CaseStudy[] = fixtureStudies.map((s, i) => ({ ...s, studyNumber: i + 1 }))

const ledgerLabels = {
  number: '№',
  client: 'Client',
  summary: 'What was leaking / what we changed',
  metric: 'Returned',
  kind: 'Case study',
  readLabel: 'Read the study →',
} satisfies BlockData<'caseStudyCards'>['ledgerLabels']

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
  /* ---- Big step 4 (batches A + B): appended after the homepage groups, grouped by block in
   * SCHEMA §9 page order of first use, variants within a group in page order:
   * Hero article (p2), stats (p3), phaseStrip (p4), service (p5, p6) → RichContent (p2) →
   * MetricEvent (p2) → TestimonialRow client-voice (p2) → CaseStudyCards next-link (p2), ledger (p3),
   * track build (p5), track growth (p6) → TwoTrackPanels doors/contrast (p4), primary-secondary (p5)
   * → PhaseTimeline arc/steps (p4), build-run (p5), engine-rollout (p6) → AccordionFAQ (p4) →
   * SpecLedger (p5, p6). */
  {
    block: 'hero',
    variant: 'article — browser media',
    label: 'p2 case-study header: breadcrumb, oversized result metric, summary, browser-framed visual',
    data: {
      variant: 'article',
      heading: '[STRATEGIC PLACEHOLDER — final copy TBD] The demand was already there. The store was leaking it.',
      accentPhrase: 'The store was leaking it.',
      geometry: true,
      breadcrumb: [{ label: 'Work', url: '/work' }, { label: 'Study 01 — [Client A]' }],
      resultMetric: { value: '+[N]%', label: 'Online revenue, [N] months', accent: true },
      body: '[Engagement scope] · [Sector, N locations]',
      metaLine: '[Published date] · [Client-approved figures] · [N] min read',
      summary: { label: 'In short', body: '[Placeholder summary of the situation, the order of work and the outcome, in two or three sentences.]' },
      media: placeholderImage,
      mediaFrame: 'browser',
    },
  },
  {
    block: 'hero',
    variant: 'article — no media',
    label: 'fallback: no metric, no media',
    data: {
      variant: 'article',
      heading: 'Article without media',
      breadcrumb: [{ label: 'Work', url: '/work' }, { label: 'Study 02' }],
      body: '[Engagement scope]',
      metaLine: '[Date] · [N] min read',
      summary: { label: 'In short', body: '[Placeholder summary.]' },
    },
  },
  {
    block: 'hero',
    variant: 'article — full-bleed media',
    label: 'full-bleed lead image',
    data: { variant: 'article', heading: 'Full bleed media', body: '[Scope]', media: placeholderImage, mediaFrame: 'full-bleed' },
  },
  {
    block: 'hero',
    variant: 'typographic + stats',
    label: 'p3 work hero, 2 key figures',
    data: {
      variant: 'typographic',
      eyebrow: 'Work — [N] studies, signed off',
      eyebrowTick: true,
      heading: '[STRATEGIC PLACEHOLDER — final copy TBD] The work, in numbers',
      accentPhrase: 'in numbers',
      body: 'One team built the store, ran the engine, then handed it over.',
      geometry: true,
      stats: [
        { value: '$[X.X]M', label: 'Client revenue added' },
        { value: '[N]', label: 'Teams running it themselves' },
      ],
    },
  },
  {
    block: 'hero',
    variant: 'typographic + stats x5',
    label: 'stats stress: 5 figures',
    data: { variant: 'typographic', heading: 'Five stats', stats: [1, 2, 3, 4, 5].map((n) => ({ value: `[${n}]`, label: `Figure ${n}` })) },
  },
  {
    block: 'hero',
    variant: 'typographic + phaseStrip',
    label: 'p4 services hero, 3-phase strip',
    data: {
      variant: 'typographic',
      heading: '[STRATEGIC PLACEHOLDER — final copy TBD] We build it. Then we grow it.',
      accentPhrase: 'grow it.',
      body: 'Two tracks, one team. Start wherever the problem is.',
      geometry: true,
      phaseStrip: [
        { number: '01', label: 'Build the foundation' },
        { number: '02', label: 'Operate the engine' },
        { number: '03', label: 'Build independence' },
      ],
    },
  },
  {
    block: 'hero',
    variant: 'service — build',
    label: 'p5 dev hero, pricing note, one key figure',
    data: {
      variant: 'service',
      eyebrow: 'Phase 01 of three — build the foundation',
      eyebrowTick: true,
      heading: '[STRATEGIC PLACEHOLDER — final copy TBD] The store build',
      body: 'Six steps from a broken store to a foundation that converts, with tracking and SEO shipped inside the build.',
      pricingNote: 'Builds start at $5K',
      subNote: 'A typical revision runs weeks, not months.',
      ctas: [{ link: link('Book a call', '/book-a-call') }],
      breadcrumb: [{ label: 'Services', url: '/services' }, { label: 'Shopify theme development' }, { label: 'Phase 01 — build the foundation' }],
      stats: [{ value: 'Weeks', label: 'Typical revision' }],
    },
  },
  {
    block: 'hero',
    variant: 'service — growth',
    label: 'p6 marketing hero, pricing note, no figures',
    data: {
      variant: 'service',
      eyebrow: 'Phase 02 of three — operate the engine',
      eyebrowTick: true,
      heading: '[STRATEGIC PLACEHOLDER — final copy TBD] The marketing engine',
      body: 'Six channels wired into one dashboard and run by one team.',
      pricingNote: 'Engines start at $1K/mo',
      subNote: '[Placeholder minimum-term note]',
      ctas: [{ link: link('Book a call', '/book-a-call') }],
      breadcrumb: [{ label: 'Services', url: '/services' }, { label: 'Marketing' }, { label: 'Phase 02 — operate the engine' }],
    },
  },
  {
    block: 'hero',
    variant: 'service — minimal',
    label: 'fallback: heading only',
    data: { variant: 'service', heading: 'Heading only' },
  },
  {
    block: 'richContent',
    variant: 'article',
    label: 'p2 article body: 3 numbered H2 sections, bold, bullet list, figure + caption, internal link, unresolved link (plain text), quote, divider, H3/H4 — placeholder copy',
    data: { variant: 'article', numberSections: true, body: articleBody },
  },
  {
    block: 'richContent',
    variant: 'article — minimal',
    label: 'one paragraph, numberSections off, with eyebrow + heading',
    data: {
      variant: 'article',
      eyebrow: '[Placeholder eyebrow]',
      heading: '[Placeholder] One paragraph, no numbers.',
      numberSections: false,
      body: root(p('[Placeholder] A single paragraph of body text. Section numbers are switched off.')),
    },
  },
  {
    block: 'metricEvent',
    variant: 'table',
    label: 'Four rows (placeholders): accent row, sub-line, text change ("Handover"), method note',
    data: {
      variant: 'table',
      eyebrow: 'Results — [12 months], client-reported',
      note: '[Method: how baseline and after were measured, who supplied the figures — fill in from client-approved records. No estimates published.]',
      items: [
        { id: 'fx-me-1', label: '[Online revenue]', value: '$[N]/yr', baseline: '$[N]/yr', change: '+[N]%', accent: true },
        { id: 'fx-me-2', label: '[Checkout completion]', value: '[N]%', baseline: '[N]%', change: '+[N]pt' },
        { id: 'fx-me-3', label: '[Cost metric]', value: '$[N]', baseline: '$[N]', change: '-[N]%', sub: '[quiet detail line]' },
        { id: 'fx-me-4', label: '[Agency fees, month N on]', value: '$0/mo', baseline: '$[N]/mo', change: 'Handover' },
      ],
    },
  },
  {
    block: 'metricEvent',
    variant: 'table — one row',
    label: 'One row, heading instead of eyebrow',
    data: {
      variant: 'table',
      heading: '[Results] in numbers',
      items: [{ id: 'fx-me-5', label: '[Measure]', value: '[N]x', baseline: '[N]x', change: '+[N]x' }],
    },
  },
  {
    block: 'metricEvent',
    variant: 'table — sparse rows',
    label: 'value only / no change / no baseline',
    data: {
      variant: 'table',
      eyebrow: 'Sparse rows',
      items: [
        { id: 'fx-me-6', label: '[Value only]', value: '[N]' },
        { id: 'fx-me-7', label: '[No change]', value: '[N]%', baseline: '[N]%' },
        { id: 'fx-me-8', label: '[No baseline]', value: '[N]%', change: '+[N]pt', accent: true },
      ],
    },
  },
  {
    block: 'metricEvent',
    variant: 'table — empty',
    label: 'fallback: no rows → renders nothing (empty space below is by design)',
    data: { variant: 'table', items: [] },
  },
  {
    block: 'testimonialRow',
    variant: 'client-voice',
    label: 'p2 client voice: video testimonial (placeholder YouTube id) + what we\'d do differently + phases box + link',
    data: {
      ...clientVoiceBase,
      clientVoice: {
        testimonial: tm(910, {
          format: 'video',
          quote: '[Placeholder pull quote from the video.]',
          authorName: '[Client name]',
          authorRole: '[Role, Company]',
          video: { url: 'https://www.youtube.com/watch?v=PLACEHOLDER', poster: placeholderImage, durationLabel: '1:42' },
        }),
        doDifferently,
        phaseMapping: '[Placeholder] Phase 1 built the foundation. Phase 2 ran the engine. Phase 3 handed it over.',
        link: { type: 'custom', url: '/services', label: 'See the two tracks' },
      },
    },
  },
  {
    block: 'testimonialRow',
    variant: 'client-voice — text only',
    label: 'text testimonial (5 stars), same aside',
    data: {
      ...clientVoiceBase,
      clientVoice: {
        testimonial: tm(911, { quote: '[Placeholder text-only quote.]', authorName: '[Client name]', authorRole: '[Role, Company]', rating: 5 }),
        doDifferently,
        phaseMapping: '[Placeholder] Phase 1 built the foundation. Phase 2 ran the engine. Phase 3 handed it over.',
        link: { type: 'custom', url: '/services', label: 'See the two tracks' },
      },
    },
  },
  {
    block: 'testimonialRow',
    variant: 'client-voice — no testimonial',
    label: 'fallback: testimonial missing → renders nothing + server warning (by design; empty space below)',
    data: { ...clientVoiceBase, clientVoice: { testimonial: null, link: { type: 'custom' } } },
  },
  {
    block: 'caseStudyCards',
    variant: 'next-link',
    label: 'p2 next study line (manual pick; the template passes the current study)',
    data: { layout: 'next-link', source: 'manual', allLink: { type: 'custom' }, caseStudies: [numberedStudies[1]], nextLabels: { label: 'Next study', readLabel: 'Read it →' } },
  },
  {
    block: 'caseStudyCards',
    variant: 'ledger',
    label: 'p3 live: 3 published fixture studies (manual), numbered rows',
    data: { layout: 'ledger', source: 'manual', allLink: { type: 'custom' }, caseStudies: numberedStudies, ledgerLabels, pageSize: 6, loadMore: true, fallbackMode: 'ledger' },
  },
  {
    block: 'caseStudyCards',
    variant: 'ledger — latest (DB)',
    label: 'p3 REAL launch state: all published, Load More; with none published this is the ledger fallback',
    data: {
      layout: 'ledger',
      source: 'latest',
      allLink: { type: 'custom' },
      ledgerLabels,
      pageSize: 6,
      loadMore: true,
      loadMoreLabel: 'Load more studies',
      loadMoreLoadingLabel: 'Loading…',
      loadMoreErrorLabel: 'Could not load more studies. Try again.',
      fallbackMode: 'ledger',
      ...ledgerFallback,
      fallbackBody: 'Studies publish here as clients sign off.',
      fallbackMetrics: [
        { id: 'fx-cs-l1', label: '[Metric label]', value: '[N]', sub: '[quiet line]' },
        { id: 'fx-cs-l2', label: '[Capacity]', value: '[N]', accent: true },
      ],
    },
  },
  {
    block: 'caseStudyCards',
    variant: 'cards — track build, fallback testimonials',
    label: 'p5 proof: track build + build-and-growth (DB); none published → testimonials fallback',
    data: {
      layout: 'cards',
      tone: 'grey',
      source: 'track',
      track: ['build', 'build-and-growth'],
      allLink: { type: 'custom' },
      limit: 2,
      fallbackMode: 'testimonials',
      fallbackEyebrow: 'What clients say',
      fallbackHeading: 'Proof it converts.',
      fallbackBody: '',
      fallbackTestimonials: textTestimonials.slice(0, 2),
    },
  },
  {
    block: 'caseStudyCards',
    variant: 'cards — track growth, fallback metric strip',
    label: 'p6 proof: track growth + build-and-growth (DB); none published → metric strip',
    data: {
      layout: 'cards',
      source: 'track',
      track: ['growth', 'build-and-growth'],
      allLink: { type: 'custom' },
      limit: 2,
      fallbackMode: 'metric-strip',
      fallbackEyebrow: 'No studies live yet — the numbers we can show',
      fallbackHeading: 'The engine, in numbers.',
      fallbackAccentPhrase: 'in numbers.',
      fallbackBody: '[Placeholder: studies publish here as clients sign off.]',
      fallbackMetrics: [
        { id: 'fx-cs-m1', value: '[N]', label: 'Channels, one team', sub: '[Email, ads, content, SEO, GBP, CRM]', accent: true },
        { id: 'fx-cs-m2', value: '[N] MO', label: 'Minimum term', sub: '[The honest window to judge an engine]' },
        { id: 'fx-cs-m3', value: '1', label: 'Dashboard', sub: '[You see what we see, always]' },
      ],
      pricingNote: 'Engines start at $1K/mo.',
    },
  },
  {
    block: 'twoTrackPanels',
    variant: 'doors',
    label: 'p4 Two doors, placeholder',
    data: {
      variant: 'doors',
      heading: '[Placeholder] Two doors.',
      panels: [
        {
          id: 'fx-d1',
          title: 'Shopify Theme Development',
          body: "For no store, or one that isn't working. Conversion-focused theme, tracking that tells the truth, SEO groundwork. Fixed scope. [Placeholder copy.]",
          pricingNote: 'Builds start at $5K.',
          link: { type: 'custom', url: '/services/shopify-theme-development', label: 'See the build →' },
        },
        {
          id: 'fx-d2',
          title: 'Marketing',
          accentTitle: true,
          body: 'For a store with no growth plan. Email, ads, content, SEO, GBP, CRM, one team on one dashboard. [Placeholder copy.]',
          pricingNote: 'Engines start at $1K/mo.',
          link: { type: 'custom', url: '/services/marketing', label: 'See the engine →' },
        },
      ],
    },
  },
  {
    block: 'twoTrackPanels',
    variant: 'doors — no links/pricing',
    label: 'fallback: no pricing note, link unresolved',
    data: {
      variant: 'doors',
      heading: '[Placeholder] Two doors.',
      panels: [
        { id: 'fx-d3', title: 'Shopify Theme Development', body: 'Placeholder body. [Placeholder copy.]', link: { type: 'internal' } },
        { id: 'fx-d4', title: 'Marketing', accentTitle: true, body: 'Placeholder body. [Placeholder copy.]', link: { type: 'internal' } },
      ],
    },
  },
  {
    block: 'twoTrackPanels',
    variant: 'contrast',
    label: 'p4 Why both together, placeholder',
    data: {
      variant: 'contrast',
      eyebrow: 'Why both together',
      eyebrowTick: true,
      heading: "Half an offer is why it didn't work.",
      panels: [
        { id: 'fx-c1', label: 'Sold to you as', claim: '"We\'ll build you a beautiful store."', title: 'A build with no engine is a parked car.', link: { type: 'custom' } },
        {
          id: 'fx-c2',
          label: 'Sold to you as',
          claim: '"Just hire a specialist for each channel."',
          title: 'You became the manager you were paying to avoid.',
          link: { type: 'custom' },
        },
      ],
      conclusion: 'One team through both phases, and a handover date set at the start. [Placeholder copy.]',
    },
  },
  {
    block: 'twoTrackPanels',
    variant: 'contrast — no panels',
    label: 'fallback: no valid panels (no claims)',
    data: {
      variant: 'contrast',
      heading: "Half an offer is why it didn't work.",
      panels: [
        { id: 'fx-c3', title: 'x', link: { type: 'custom' } },
        { id: 'fx-c4', title: 'y', link: { type: 'custom' } },
      ],
    },
  },
  {
    block: 'twoTrackPanels',
    variant: 'primary-secondary',
    label: 'p5 Where people usually start, placeholder',
    data: {
      variant: 'primary-secondary',
      eyebrow: 'Where people usually start',
      eyebrowTick: true,
      heading: 'Most start with a revision.',
      accentPhrase: 'revision',
      panels: [
        {
          id: 'fx-p1',
          label: 'Default starting point',
          title: 'Revision',
          body: 'Keep what converts, fix what leaks. [Placeholder copy.]',
          pricingNote: 'Builds start at $5K.',
          link: { type: 'custom', url: '/contact', label: 'Start with a revision' },
        },
        {
          id: 'fx-p2',
          label: 'When the math says so',
          title: 'Scratch build',
          body: 'A blank theme, the same six steps. [Placeholder copy.]',
          link: { type: 'custom', url: '/contact', label: 'Ask about a scratch build →' },
        },
      ],
      conclusion: 'Exact scope is priced on the call. [Placeholder copy.]',
    },
  },
  {
    block: 'phaseTimeline',
    variant: 'arc',
    label: 'p4 the arc: 3 phases, body + link (last phase accent)',
    data: {
      variant: 'arc',
      heading: 'Where both doors end',
      phases: [
        { id: 'fx-pt-a1', number: 'Phase 01', title: 'Build the foundation', body: 'A Shopify theme built around the questions buyers actually ask, analytics wired so the numbers mean something, and the SEO groundwork that stops paid traffic being the only traffic. [Placeholder — final copy TBD.]', link: link('See Phase 01 →', '/services/shopify-theme-development') },
        { id: 'fx-pt-a2', number: 'Phase 02', title: 'Operate the engine', body: 'Email, ads, content, SEO, Google Business Profile and CRM, run by the same people who built the store, reporting into one dashboard instead of six inboxes. [Placeholder — final copy TBD.]', link: link('See Phase 02 →', '/services/marketing') },
        { id: 'fx-pt-a3', number: 'Phase 03', title: 'Build independence', body: 'Your team takes the engine over on a date set at the start. We document the systems, train the person who will own them, and hand over the accounts in your name. [Placeholder — final copy TBD.]' },
      ],
    },
  },
  {
    block: 'phaseTimeline',
    variant: 'arc — minimal',
    label: 'minimal: 2 phases, no links, no number on the last (last phase still at full weight)',
    data: {
      variant: 'arc',
      heading: 'Two phases, no links',
      accentPhrase: 'no links',
      phases: [
        { id: 'fx-pt-a4', number: 'Phase 01', title: 'Build the foundation' },
        { id: 'fx-pt-a5', title: 'Build independence', body: '[Placeholder] The last phase keeps its accent title whatever is filled in.' },
      ],
    },
  },
  {
    block: 'phaseTimeline',
    variant: 'steps',
    label: 'p4 how it starts: 3 step cards, tags, outcomes, closing line, button',
    data: {
      variant: 'steps',
      heading: 'Either door starts the same way.',
      steps: [
        { id: 'fx-pt-c1', number: 'Step 01', title: 'A call, 30 minutes', tag: '[Day 0]', detail: "Your numbers and what's leaking. We say which door fits — including “neither, yet.”", outcomes: [{ id: 'fx-pt-o1', text: 'An honest read on which phase you need' }] },
        { id: 'fx-pt-c2', number: 'Step 02', title: 'A dated plan', tag: '[Within N days]', detail: 'Scope, price and the calendar in writing — deliverables, sign-off points, and the handover date.', outcomes: [{ id: 'fx-pt-o2', text: 'A fixed scope and a price, before you commit' }] },
        { id: 'fx-pt-c3', number: 'Step 03', title: 'Work starts', tag: '[Week 1]', detail: 'Same team through both phases, no account-manager layer. You see the dashboard we see.', outcomes: [{ id: 'fx-pt-o3', text: 'Dashboard access and a named contact' }] },
      ],
      closingLine: "Nothing is signed before step 02. If the plan doesn't fit, that's where it stops. [Placeholder]",
      cta: link('Book a Call', '/book-a-call'),
    },
  },
  {
    block: 'phaseTimeline',
    variant: 'steps — minimal',
    label: 'minimal: 2 cards (first title only), no closing line/button; last card at full weight',
    data: {
      variant: 'steps',
      heading: 'Two steps, nothing optional',
      steps: [
        { id: 'fx-pt-c4', title: 'First step' },
        { id: 'fx-pt-c5', number: 'Step 02', title: 'Handover', detail: '[Placeholder] The last card renders at the same full weight as the others.', outcomes: [{ id: 'fx-pt-o4', text: '[Placeholder outcome]' }, { id: 'fx-pt-o5', text: '[Second placeholder outcome]' }] },
      ],
    },
  },
  {
    block: 'phaseTimeline',
    variant: 'steps — empty',
    label: 'fallback: no steps (heading only)',
    data: { variant: 'steps', heading: 'Heading only (no steps)' },
  },
  {
    block: 'phaseTimeline',
    variant: 'build-run',
    label: 'p5 build run: 6 steps, 2 sign-offs (phones: swipe row)',
    data: {
      variant: 'build-run',
      eyebrow: 'How a build runs',
      eyebrowTick: true,
      heading: 'Six steps, two sign-offs',
      steps: [
        { id: 'fx-pt-b1', number: '01', title: 'Intake', tag: 'Dated plan', detail: 'You leave with a dated plan.' },
        { id: 'fx-pt-b2', number: '02', title: 'Research', tag: 'Findings', detail: 'Buyers, category, competitors.' },
        { id: 'fx-pt-b3', number: '03', title: 'Positioning', tag: 'Your sign-off', isSignOff: true },
        { id: 'fx-pt-b4', number: '04', title: 'Design', tag: 'Your sign-off', isSignOff: true },
        { id: 'fx-pt-b5', number: '05', title: 'Development', tag: 'The store', detail: 'Theme, tracking and SEO together.' },
        { id: 'fx-pt-b6', number: '06', title: 'Launch', tag: 'We stay live', detail: 'We stay through go-live.' },
      ],
      closingLine: 'Then Phase 02, if the numbers say it fits.',
    },
  },
  {
    block: 'phaseTimeline',
    variant: 'build-run — minimal',
    label: 'minimal: 2 steps, no eyebrow/closing (grid filler cell; last step full weight)',
    data: {
      variant: 'build-run',
      heading: 'Two steps, no eyebrow',
      steps: [
        { id: 'fx-pt-b7', number: '01', title: 'Intake', tag: 'Dated plan' },
        { id: 'fx-pt-b8', number: '02', title: 'Handover', detail: '[Placeholder] Last step at full weight.' },
      ],
    },
  },
  {
    block: 'phaseTimeline',
    variant: 'engine-rollout',
    label: 'p6 engine rollout: 6 steps, placeholder timings, ends Independence — Phase 03 (desktop row from xl)',
    data: {
      variant: 'engine-rollout',
      eyebrow: 'Rollout after signing',
      eyebrowTick: true,
      heading: 'Order matters more than effort',
      steps: [
        { id: 'fx-pt-e1', number: '01', title: 'Audit', tag: '[Week 1–2]', detail: 'Tracking, list, spend history. [Week 1–2]' },
        { id: 'fx-pt-e2', number: '02', title: 'Foundations', tag: 'Before spend', detail: 'Attribution and CRM wired — before any spend.' },
        { id: 'fx-pt-e3', number: '03', title: 'Email flows', tag: '[Month 1]', detail: 'The owned channel goes first. [Month 1]' },
        { id: 'fx-pt-e4', number: '04', title: 'Ads live', tag: '[Month 1–2]', detail: 'Budget follows evidence. [Month 1–2]' },
        { id: 'fx-pt-e5', number: '05', title: 'Content + SEO', tag: '[Month 2+]', detail: 'The compounding layers. [Month 2 onward]' },
        { id: 'fx-pt-e6', number: '06', title: 'Independence', tag: 'Phase 03', detail: 'Phase 03 — your team takes over.' },
      ],
      closingLine: 'It ends the same way every time: your team running it without us.',
    },
  },
  {
    block: 'phaseTimeline',
    variant: 'engine-rollout — minimal',
    label: 'minimal: 1 step (the handover) at full weight, eyebrow without diamond, no swipe hint/bars',
    data: { variant: 'engine-rollout', eyebrow: 'No diamond', heading: 'One step', steps: [{ id: 'fx-pt-e7', number: '01', title: 'Independence', tag: 'Phase 03' }] },
  },
  {
    block: 'accordionFAQ',
    variant: 'mini',
    label: 'p4 selected (3 published + 1 draft, draft skipped), openFirst, all-questions link; answers carry an internal + a custom link',
    data: {
      variant: 'mini',
      heading: 'Routing questions',
      source: 'selected',
      faqs: [faqPricing, faqBuilds, faqDraft, faqRetainers],
      openFirst: true,
      limit: 6,
      allLink: { type: 'custom', url: '/faq', label: 'All questions, answered straight →' },
    },
  },
  {
    block: 'accordionFAQ',
    variant: 'mini — category (DB)',
    label: 'category source, read from the database (published only); with no published FAQ in that category → renders nothing',
    data: { variant: 'mini', heading: 'Builds questions', source: 'category', category: 'builds', limit: 6, allLink: { type: 'custom' } },
  },
  {
    block: 'accordionFAQ',
    variant: 'mini — empty',
    label: 'fallback: no questions → renders nothing + server warning (empty space below is by design)',
    data: { variant: 'mini', heading: 'Routing questions', source: 'selected', faqs: [], allLink: { type: 'custom' } },
  },
  {
    block: 'specLedger',
    variant: 'cards — anatomy',
    label: 'p5 Template anatomy T-01…T-04 (design copy; placeholder image)',
    data: {
      variant: 'cards',
      cardLayout: 'anatomy',
      tone: 'auto',
      eyebrow: 'What gets built, template by template',
      eyebrowTick: true,
      note: 'Four templates carry almost every order.',
      items: [
        ['T-01', 'Home', "Says what you sell and who it's for above the fold."],
        ['T-02', 'Collection', 'Filtering and order that match how buyers shop.'],
        ['T-03', 'Product', 'Answers the objection before it becomes an exit.'],
        ['T-04', 'Checkout', 'The shortest honest path from intent to order. [Placeholder copy.]'],
      ].map(([code, title, line], i) => ({ id: `fx-sl-t${i + 1}`, code, title, line, image: placeholderImage })),
    },
  },
  {
    block: 'specLedger',
    variant: 'expandable — p5',
    label: 'p5 Specification D-01…D-07 (first open), pricing note',
    data: {
      variant: 'expandable',
      eyebrow: 'Specification — what every build ships with',
      firstOpen: true,
      items: specExpandableP5,
      pricingNote: 'Builds start at $5K. Exact scope is priced on the call.',
    },
  },
  {
    block: 'specLedger',
    variant: 'signal-flow',
    label: 'p6 Signal flow E-01…E-06 → dashboard hub (placeholder image)',
    data: {
      variant: 'signal-flow',
      eyebrow: 'How the signal moves',
      eyebrowTick: true,
      items: signalTiles,
      hub: {
        kicker: 'Everything reports here',
        heading: 'One dashboard. You see what we see.',
        body: "Every channel writes to the same place, plus a monthly written readout: what we did, what it returned, what's next. Access from day one, including during the audit. [Placeholder copy.]",
        note: 'No deck theatre. No assembling five reports yourself.',
        image: placeholderImage,
      },
    },
  },
  {
    block: 'specLedger',
    variant: 'expandable — p6',
    label: 'p6 Channel specification E-01…E-06, pricing note',
    data: {
      variant: 'expandable',
      eyebrow: 'Specification — what each channel is for',
      firstOpen: true,
      items: specExpandableP6,
      pricingNote: "You can't buy ads alone: the mix is priced on the call.",
    },
  },
  {
    block: 'specLedger',
    variant: 'cards — feature',
    label: 'p6 Camera work: two feature cards, no caption (placeholder image)',
    data: {
      variant: 'cards',
      cardLayout: 'feature',
      items: [
        { id: 'fx-sl-f1', title: 'Shot at your business', line: 'Content built from what your store actually sells — no lifestyle stock.', image: placeholderImage },
        { id: 'fx-sl-f2', title: 'GBP, run on numbers', line: 'Local demand tracked with the same discipline as the ads account. [Placeholder copy.]', image: placeholderImage },
      ],
    },
  },
  {
    block: 'specLedger',
    variant: 'expandable — sparse',
    label: 'fallback: one row with no details → plain row, no "+" marker',
    data: { variant: 'expandable', eyebrow: 'Specification', items: [{ id: 'fx-sl-x1', code: 'D-01', title: 'Conversion build', line: '[Placeholder line]' }] },
  },
  {
    block: 'specLedger',
    variant: 'cards — anatomy, no image',
    label: 'fallback: one card without an image (frame keeps its shape)',
    data: { variant: 'cards', cardLayout: 'anatomy', eyebrow: 'What gets built', items: [{ id: 'fx-sl-x2', code: 'T-01', title: 'Home', line: '[Placeholder line]' }] },
  },
  {
    block: 'specLedger',
    variant: 'signal-flow — hub, no image',
    label: 'fallback: one tile, hub without an image',
    data: {
      variant: 'signal-flow',
      eyebrow: 'How the signal moves',
      items: [{ id: 'fx-sl-x3', code: 'E-01', title: 'Email' }],
      hub: { kicker: 'Everything reports here', heading: '[Placeholder] One dashboard.' },
    },
  },
]
