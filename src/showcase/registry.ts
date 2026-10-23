import type { BookingSettingsOverride } from '@/blocks/BookingEmbed/Component'
import type { CategoryTab } from '@/blocks/CategoryTabs/Component'
import type { LinkStackData } from '@/blocks/LinkStack/Component'
import type { PostItem, PostListData } from '@/blocks/PostList/Component'
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
  /** The block row without `blockType` (taken from `block`), plus any showcase-only props. */
  data: Omit<BlockData<K>, 'blockType'> & (K extends keyof ShowcaseExtras ? ShowcaseExtras[K] : unknown)
}

/**
 * Showcase-only props that are NOT schema fields (big step 5):
 * - `bookingEmbed.settingsOverride`: forces the link-out / embed / no-URL state
 *   instead of reading Site settings (BookingEmbed/Component.tsx).
 * - `categoryTabs.tabs`: on a real page RenderBlocks derives the tabs from the
 *   page's AccordionFAQ `group` blocks; the showcase renders one block at a
 *   time, so the fixture supplies them (RenderBlocks keeps a row's own `tabs`).
 * - `linkStack.previewStudy` (big step 6): a static PUBLISHED study standing in
 *   for "the latest published case study" (LinkStack/Component.tsx).
 * - `postList.previewPosts` / `previewTotal` (big step 6): static published
 *   stand-ins for the posts query; `[]` forces the empty state.
 */
type ShowcaseExtras = {
  bookingEmbed: { settingsOverride?: BookingSettingsOverride }
  categoryTabs: { tabs?: CategoryTab[] }
  linkStack: Pick<LinkStackData, 'previewStudy'>
  postList: Pick<PostListData, 'previewPosts' | 'previewTotal'>
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

/* ---- Big step 5 fixtures (static; pages 7–12) ---- */

/** p8 logo-strip fallback clients (placeholder names, no logos → wordmarks). */
const stripClients: Client[] = ['[Client A]', '[Client B]', '[Client C]', '[Client D]'].map((name, i) => ({
  id: i + 1,
  name,
  logo: null,
  showInLogoStrip: true,
  _status: 'published',
  updatedAt: '',
  createdAt: '',
}))

const logoStripBase = {
  layout: 'cards',
  source: 'latest',
  fallbackEyebrow: 'Stores we have run numbers for',
  fallbackHeading: 'Our clients, for now.',
  fallbackAccentPhrase: 'for now.',
  fallbackBody: 'Case studies publish here as clients sign off.',
  pricingNote: null,
  allLink: { type: 'custom' },
} satisfies Partial<BlockData<'caseStudyCards'>>

const compactHero = { variant: 'typographic', size: 'compact', eyebrowTick: true, geometry: true } satisfies Partial<BlockData<'hero'>>

/* ReviewWall (p7). The draft study on card 4 proves "no link to an unpublished study". */
const VIDEO_URL = 'https://www.youtube.com/watch?v=PLACEHOLDER'
const draftStudy = { ...fixtureStudies[1], id: 950, slug: 'fx-draft', _status: 'draft' } as CaseStudy
const feedTestimonials: Testimonial[] = [
  tm(911, {
    format: 'video',
    quote: '[Placeholder pull quote from the video — they rebuilt the store, ran the ads, then trained our manager to run it.]',
    authorName: '[Client name]',
    authorRole: '[Business type, Chicago]',
    rating: 5,
    client: fixtureClients[1],
    video: { url: VIDEO_URL, poster: placeholderImage, durationLabel: '1:42' },
    metric: { value: '[+N%]', label: 'Revenue, [N] mo' },
    caseStudy: fixtureStudies[0],
  }),
  tm(912, {
    quote: '[GBP review placeholder — pulled verbatim from Google at launch, never paraphrased.]',
    authorName: '[Reviewer]',
    authorRole: 'Google review',
    source: 'google-review',
    sourceUrl: 'https://www.google.com/maps',
    verbatim: true,
    rating: 5,
  }),
  tm(913, {
    quote: '[Placeholder quote — the call alone was worth it; they told me not to spend on ads yet, and why.]',
    authorName: '[Client name]',
    authorRole: '[Online-only, category]',
    source: 'google-review',
    sourceUrl: 'https://www.google.com/maps',
    verbatim: true,
    rating: 5,
  }),
  tm(914, {
    format: 'video',
    quote: '[Placeholder pull quote — the first team that showed us the dashboard instead of a deck.]',
    authorName: '[Client name]',
    authorRole: '[Online-only, category]',
    rating: 5,
    client: fixtureClients[0],
    video: { url: VIDEO_URL, poster: placeholderImage },
    metric: { value: '[N×]', label: 'ROAS after restructure' },
    caseStudy: draftStudy,
  }),
  tm(915, {
    format: 'video',
    quote: "[Placeholder pull quote about the independence handover, in the client's words.]",
    authorName: '[Client name]',
    authorRole: '[Hybrid retail, N locations]',
    rating: 5,
    client: fixtureClients[3],
    video: { url: VIDEO_URL, poster: placeholderImage },
    metric: { value: 'MO [N]', label: 'Independence handover' },
    caseStudy: fixtureStudies[2],
  }),
  tm(916, {
    quote: '[Placeholder LinkedIn recommendation, quoted as posted.]',
    authorName: '[Client name]',
    authorRole: '[Role, Company]',
    source: 'linkedin',
    sourceUrl: 'https://www.linkedin.com/',
    rating: 4,
  }),
  tm(917, {
    quote: '[Placeholder direct quote with a headline figure.]',
    authorName: '[Client name]',
    authorRole: '[Role, Company]',
    metric: { value: '[N]%', label: '[Metric label]' },
    caseStudy: fixtureStudies[1],
  }),
]
const reviewWallBase = {
  variant: 'feed',
  source: 'manual',
  pageSize: 24,
  showStudyLinks: true,
  studyLinkLabel: 'Read the full case study',
  labels: { video: 'Video', googleReview: 'Google review', linkedin: 'LinkedIn', play: 'Play the video testimonial from' },
  loadMore: { label: 'Load more', loadingLabel: 'Loading…', errorLabel: 'Could not load more testimonials. Try again.' },
} satisfies Partial<BlockData<'reviewWall'>>

/* BookingEmbed (p9). */
const bookingBase = {
  heading: 'Pick a time that works for you.',
  accentPhrase: 'works for you.',
  body: 'Thirty minutes on your numbers. The calendar opens in a new tab; this page moves on to what to prepare. [STRATEGIC PLACEHOLDER — final copy TBD]',
  buttonLabel: 'Book your call',
  noteUnderButton: 'Opens our booking calendar in a new tab. Times show in your time zone.',
  newTabLabel: 'Trouble with the calendar? Open it in a new tab',
  thankYouPage: null,
  fallbackHeading: 'Booking is offline. Write to us instead.',
  fallbackBody: 'Send a line with two or three times that suit you and we will confirm one. [Placeholder — final copy TBD]',
  fallbackLink: { type: 'custom', url: '/contact', label: 'Contact us', newTab: false },
} satisfies Partial<BlockData<'bookingEmbed'>>

/* AccordionFAQ group (p11) questions. */
const a = (t: string) => root(p(`${t} [Placeholder copy.]`))
const gPrice = fq(
  961,
  'What does it cost?',
  'pricing-contracts',
  root(p('Builds start at $5K. Engines start at $1K/mo. Exact scope is priced on the call, because a $500K retailer and a $5M brand need different machines. [Placeholder copy.]')),
)
const gP2 = fq(962, 'Do you lock clients into retainers?', 'pricing-contracts', a('No. The endgame is your team running it.'))
const gP3 = fq(963, 'How long are contracts?', 'pricing-contracts', a('Builds are fixed-scope projects.'))
const gB1 = fq(964, 'I already have a store. Do I have to start over?', 'builds', a('Usually not.'))
const gB2 = fq(965, 'How long does a build take?', 'builds', root(p('Scope-dependent.'), p('Second paragraph. ', customLink('Book a Call', '/book-a-call'), ' [Placeholder copy.]')))
const gM1 = fq(966, 'Why the 6-month minimum?', 'marketing', a('Six months is the honest window.'))
const gM2 = fq(967, 'Can I just get ads?', 'marketing', a('No.'))
const gT1 = fq(968, 'Will this work for my business?', 'process-trust', a('If you net $500K to $5M a year, probably.'))
const gT2 = fq(969, 'What makes you different?', 'process-trust', a('Leaving is the deliverable.'))

/* DirectContact (p12). */
const rowLabels = { email: 'Email', socials: 'Socials', location: 'Location', replyTime: 'Reply time' }
/* Deliberate editor override (the 'map only' entry); other entries leave caption empty → auto caption from site settings (F109). */
const mapCaption =
  'Based in Lombard, IL — serving the greater Chicagoland area within a ~30-mile radius. Outside the ring? We work remote-first, so reach out anyway.'

/* ---- Big step 6 fixtures (pages 13–21, static; .claude/handoff/s6/*.md) ---- */

const S6_P = '[STRATEGIC PLACEHOLDER — final copy TBD]'

/** A custom link with an explicit `newTab: false` (LP / LinkStack / Error404 fixtures). */
const L = (label: string, url = '/book-a-call') => ({ type: 'custom' as const, url, label, newTab: false })

/** RichContent legal: counsel-only placeholder paragraphs (never invented policy text). */
const counsel = (extra = '') => p(`[Placeholder — counsel-provided content.${extra}]`)

/* ProofStrip metrics / OfferBlock (p15). Capacity keys read the LIVE scarcity global. */
const lpLogos = { show: true, eyebrow: "Stores we've run numbers for", source: 'flagged' } satisfies BlockData<'proofStrip'>['logos']
const offerBase = {
  eyebrow: 'The offer',
  eyebrowTick: false,
  heading: '[Campaign-specific promise, stated as scope.]',
  accentPhrase: 'stated as scope',
  body: root(
    p(
      '[Placeholder: what the prospect gets, in deliverable terms, with the number first. No countdown timers; capacity is the only true urgency and it carries its reason.]',
    ),
  ),
  cta: L('Book a Call'),
  capacity: 'offer-line',
} satisfies Omit<BlockData<'offerBlock'>, 'blockType'>

/* TestimonialRow reader quote (p15/p16). */
const readerQuote = tm(990, {
  quote: '[Reader quote slot — demonstrative placeholder, non-final.]',
  authorName: '[Reader name]',
  authorRole: '[Store type]',
})
const subscribersMetric = { value: '[N]', label: 'Subscribers', sub: '[Placeholder — real count at launch, marked non-final]' }

/* PostList (p16): showcase-only `previewPosts` stand in for published issues. */
const issue = (n: number, title: string): PostItem => ({
  id: n,
  slug: `sample-issue-${n}`,
  track: 'newsletter-issue',
  title,
  issueNumber: n,
  issueMetric: '[metric]',
  dek: '[One-line summary placeholder. The setup, the number it moved, and what we would do differently.]',
  sentAt: `2026-09-1${n % 10}T12:00:00Z`,
})
const sampleIssues = [
  issue(12, '[The email flow that pays the ad bill]'),
  issue(11, '[What broke when the pixel lied]'),
  issue(10, '[The handover checklist, published]'),
]
const postListBase = {
  track: 'newsletter-issue',
  eyebrow: 'Recent issues',
  eyebrowTick: true,
  featureLatest: true,
  limit: 3,
  archiveLink: { type: 'custom', url: '/newsletter', label: 'Full archive →' },
  labels: { latestLabel: 'Latest —', newBadge: 'New', previouslyLabel: 'Previously', countSuffix: 'issues', readLabel: 'Read issue', issueWord: 'Issue' },
  emptyHeading: 'The first issue is on its way.',
  emptyBody:
    'Each issue is one store problem, the number it moved and what we would do differently. Join above and the first one lands in your inbox.',
} satisfies Omit<BlockData<'postList'>, 'blockType'>

/* LinkStack (p17): socials + capacity read the LIVE globals; the study comes from `previewStudy` (showcase-only). */
const lsBase = {
  identity: { showStudyMetric: true, fallbackLine: '[STRATEGIC PLACEHOLDER] Integrated ecommerce growth partner — Chicago' },
  primary: { link: L('Book a call'), capacity: 'slots-line' },
  showSocials: true,
  followLabel: 'Follow',
  siteLabel: 'On the site',
  links: [
    { id: 'ls-work', icon: 'chart-line-up', link: L('The work', '/work') },
    { id: 'ls-clients', icon: 'quotes', link: L('Clients', '/testimonials') },
    { id: 'ls-news', icon: 'envelope-simple', link: L('Newsletter', '/newsletter') },
  ],
  latestCaseStudy: true,
  latestCaseStudyLabel: 'Case study',
  currentPush: { show: false, icon: 'file-text', link: L('', '') },
} satisfies Omit<BlockData<'linkStack'>, 'blockType'>

/* SpecLedger list (p18). */
const listBullets = [
  '[Value bullet placeholder — concrete deliverable inside the asset]',
  '[Value bullet placeholder — the number/benchmark it gives them]',
  '[Value bullet placeholder — the mistake it prevents]',
  '[Value bullet placeholder — time to apply it]',
].map((title, i) => ({ id: `fx-list-${i + 1}`, title }))

/* NewsletterBand cross-sell (p18). */
const deliveredState = {
  eyebrow: 'Sent',
  heading: "Check your inbox. It's on the way.",
  accentPhrase: "It's on the way.",
  body: "If it's not there in five minutes, check spam, then email us.",
  crossSellLine: "While you're here:",
}

/* ReviewWall wall (p19): the p7 feed testimonials (video ones render as written cards on the wall). */
const draftClient: Client = { ...fixtureClients[2], _status: 'draft' }

/* Error404 (p21). */
const error404Copy = { code: '404', heading: 'This page leaked.', body: "Unlike your store's demand, it's not coming back." }

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
   * MetricEvent (p2) → TestimonialRow client-voice (p2) → NewsletterBand (p2, p3) →
 * CaseStudyCards next-link (p2), ledger (p3),
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
        { id: 'fx-me-4', label: '[Agency fees, month N on]', value: '$[N]/mo', baseline: '$[N]/mo', change: 'Handover' },
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
    block: 'newsletterBand',
    variant: 'band',
    label:
      'p2 band, template defaults (form shows only if Site settings > newsletter form is set; else Join links to the published /newsletter page; neither → renders nothing)',
    data: { variant: 'band' },
  },
  {
    block: 'newsletterBand',
    variant: 'band — light, roomy',
    label: 'p3 Work: custom heading + accent, white with a thin line underneath, roomier spacing',
    data: {
      variant: 'band',
      heading: 'Studies land here first.',
      accentPhrase: 'first',
      line: 'One useful email a month. Numbers included.',
      tone: 'light',
      spacing: 'roomy',
    },
  },
  {
    block: 'newsletterBand',
    variant: 'band — custom button',
    label: 'custom heading, line and button label',
    data: {
      variant: 'band',
      heading: 'One useful email a month.',
      line: 'Numbers included. Unsubscribe anytime.',
      buttonLabel: 'Subscribe',
    },
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
    label: 'p3 live: 3 published fixture studies (manual), numbered rows — pageSize 2 so the Load More button shows',
    data: { layout: 'ledger', source: 'manual', allLink: { type: 'custom' }, caseStudies: numberedStudies, ledgerLabels, pageSize: 2, loadMore: true, fallbackMode: 'ledger' },
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
        { id: 'fx-cs-m3', value: '[N]', label: 'Dashboard', sub: '[You see what we see, always]' },
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
  /* ==== Big step 5 (pages 7–12), in page order ==== */

  /* ---- p7 Testimonials ---- */
  {
    block: 'hero',
    variant: 'typographic compact + rating',
    label: 'p7 testimonials hero (rating from published testimonials; hidden if none)',
    data: {
      ...compactHero,
      width: 'wide',
      eyebrow: 'Testimonials',
      heading: "[STRATEGIC PLACEHOLDER — final copy TBD] Don't take our word for it. Take theirs.",
      accentPhrase: 'Take theirs.',
      body: 'On camera and in writing — clients, their numbers, their words. Case studies link through as they publish.',
      showAggregateRating: true,
    },
  },
  {
    block: 'reviewWall',
    variant: 'feed',
    label: 'p7 testimonial feed: hand-picked mix (video + Google + LinkedIn + direct); study links on (draft study on card 4 → no link)',
    data: { ...reviewWallBase, testimonials: feedTestimonials },
  },
  {
    block: 'reviewWall',
    variant: 'feed',
    label: 'state: case-study links switched off',
    data: { ...reviewWallBase, showStudyLinks: false, testimonials: feedTestimonials.slice(0, 3) },
  },
  {
    block: 'reviewWall',
    variant: 'feed',
    label: 'state: Load More (2 per load, hand-picked)',
    data: { ...reviewWallBase, pageSize: 2, testimonials: feedTestimonials },
  },
  {
    block: 'reviewWall',
    variant: 'feed',
    label: 'live: all published testimonials from the DB (renders nothing while none are published)',
    data: { ...reviewWallBase, source: 'all', pageSize: 6 },
  },
  {
    block: 'reviewWall',
    variant: 'feed',
    label: 'fallback: nothing matches, with an empty note (LinkedIn-only filter)',
    data: {
      ...reviewWallBase,
      source: 'all',
      sourceFilter: ['linkedin'],
      eyebrow: 'Reviews',
      eyebrowTick: true,
      heading: 'In their words.',
      accentPhrase: 'their words.',
      emptyNote: '[Placeholder note — reviews publish here verbatim as clients post them.]',
    },
  },

  /* ---- p8 About ---- */
  {
    block: 'metricEvent',
    variant: 'facts',
    label: 'Facts (4 rows + note)',
    data: {
      variant: 'facts',
      eyebrow: 'The company, in numbers',
      items: [
        { id: 'a', label: 'Concurrent builds, capped', value: '[N]', accent: true },
        { id: 'b', label: 'Builds in progress today', value: '[N]' },
        { id: 'c', label: 'Client revenue band we serve', value: '$500K–$5M' },
        { id: 'd', label: 'Typical handover', value: '[Month N]', sub: 'Quiet sub line' },
      ],
      note: '[Founding year, headcount and engagement counts fill in from client-approved records — no estimates published.]',
    },
  },
  {
    block: 'metricEvent',
    variant: 'facts',
    label: 'Facts (sparse)',
    data: { variant: 'facts', items: [{ id: 'z', label: 'Base of operations', value: 'Chicago' }] },
  },
  {
    block: 'caseStudyCards',
    variant: 'logo-strip',
    label: 'Logo strip (4 fixture clients)',
    data: { ...logoStripBase, fallbackMode: 'logo-strip', fallbackLogos: stripClients },
  },
  {
    block: 'caseStudyCards',
    variant: 'logo-strip',
    label: 'Logo strip (grey, 2 clients)',
    data: { ...logoStripBase, fallbackMode: 'logo-strip', tone: 'grey', fallbackLogos: stripClients.slice(0, 2) },
  },
  {
    block: 'caseStudyCards',
    variant: 'logo-strip',
    label: 'Logo strip (DB-backed; zero clients → note)',
    data: { ...logoStripBase, fallbackMode: 'logo-strip' },
  },

  /* ---- p9 Book a Call ---- */
  {
    block: 'hero',
    variant: 'typographic compact + callouts',
    label: 'p9 book hero',
    data: {
      ...compactHero,
      eyebrow: 'Book a Growth Strategy Call',
      heading: '[STRATEGIC PLACEHOLDER — final copy TBD] 30 minutes. Your numbers, straight answers.',
      accentPhrase: 'straight answers.',
      callouts: [
        { label: 'What it is:', text: "a working session on your store, your channels, and whether we're the right fit — with numbers on the table." },
        { label: "What it isn't:", text: "a pitch deck, a hard close, or a junior SDR reading a script. If we're not the fit, we'll say who is." },
      ],
      subNote: 'For established businesses netting $500K–$5M a year. [Demonstrative CTA variant — final copy TBD]',
    },
  },
  {
    block: 'bookingEmbed',
    variant: 'link-out',
    label: 'link-out (launch state): opens booking in a new tab, this tab → /thank-you',
    data: {
      ...bookingBase,
      settingsOverride: { bookingUrl: 'https://example.com/index.php/apps/calendar/appointment/placeholder', bookingMode: 'link-out', thankYouHref: '/thank-you' },
    },
  },
  {
    block: 'bookingEmbed',
    variant: 'embed',
    label: 'embed: iframe from md up, link-out panel below md',
    data: { ...bookingBase, settingsOverride: { bookingUrl: 'https://example.com/', bookingMode: 'embed' } },
  },
  {
    block: 'bookingEmbed',
    variant: 'no-url',
    label: 'fallback: no booking URL in Site settings',
    data: { ...bookingBase, settingsOverride: { bookingUrl: null } },
  },
  {
    block: 'formEmbed',
    variant: 'standard',
    label: 'FormEmbed · standard (homework, p9; dev form 14 stands in for the homework form) — renders nothing if form 14 is missing',
    data: {
      variant: 'standard',
      form: 14, // TODO(seed): form id — hardcoded dev id; the seed must create this form on staging
      eyebrow: 'Pre-call homework',
      eyebrowTick: false,
      heading: 'A few fields. It makes the call worth both our time. [STRATEGIC PLACEHOLDER — final copy TBD]',
      submitLabel: 'Submit homework',
      ground: 'light',
      mobileLayout: 'stacked',
    },
  },
  {
    block: 'miniCTAStrip',
    variant: 'inline',
    label: 'p9 quick-question escape line',
    data: { variant: 'inline', text: 'Have a quick question first?', link: { type: 'custom', url: '/contact', newTab: false, label: 'Contact us' } },
  },
  {
    block: 'miniCTAStrip',
    variant: 'inline — link unresolved',
    label: 'fallback: link does not resolve (sentence only)',
    data: { variant: 'inline', text: 'Have a quick question first?', link: { type: 'internal', reference: null, label: 'Contact us' } },
  },

  /* ---- p10 Thank You ---- */
  {
    block: 'hero',
    variant: 'typographic compact',
    label: 'p10 confirmation hero, no CTAs',
    data: {
      ...compactHero,
      eyebrow: 'Booked',
      heading: "[STRATEGIC PLACEHOLDER — final copy TBD] Call booked. Invite's in your inbox.",
      accentPhrase: "Invite's in your inbox.",
      body: '30 minutes, your numbers, straight answers. We read your homework before we dial.',
    },
  },
  {
    block: 'formEmbed',
    variant: 'reminder',
    label: 'FormEmbed · reminder (p10; add ?homework=done for the done line; dev form 14 stands in for the homework form) — renders nothing if form 14 is missing',
    data: {
      variant: 'reminder',
      form: 14, // TODO(seed): form id — hardcoded dev id; the seed must create this form on staging
      alertLabel: 'Required before your call',
      heading: 'One thing left: the homework.',
      body: 'A few fields, a few minutes. Calls with homework done cover more ground — that is why we ask.',
      reasons: [
        { icon: 'chart', text: 'We arrive knowing your numbers, not asking for them' },
        { icon: 'clock', text: 'The 30 minutes goes to strategy, not intake' },
        { icon: 'target', text: 'We can flag your biggest bottleneck before we dial' },
      ],
      submitLabel: 'Send the homework',
      doneHeading: 'Homework received.',
      doneBody: "We'll have read it before the call.",
    },
  },

  /* ---- p11 FAQ: hero → CategoryTabs → the four groups (tabs target their anchors) ---- */
  {
    block: 'hero',
    variant: 'typographic compact — minimal',
    label: 'p11 FAQ hero (eyebrow + heading only)',
    data: { ...compactHero, eyebrow: 'FAQ', heading: "[STRATEGIC PLACEHOLDER — final copy TBD] We'll give it to you straight.", accentPhrase: 'straight.' },
  },
  {
    block: 'categoryTabs',
    variant: 'default',
    label: 'CategoryTabs / 4 categories (tabs supplied here; on a page they are derived from the group blocks)',
    data: {
      ariaLabel: 'FAQ categories',
      tabs: [
        { label: 'Pricing & Contracts', anchorId: 'pricing' },
        { label: 'Builds', anchorId: 'builds' },
        { label: 'Marketing', anchorId: 'marketing' },
        { label: 'Process & Trust', anchorId: 'process' },
      ],
    },
  },
  {
    block: 'accordionFAQ',
    variant: 'group — pricing',
    label: 'p11 group 1: Pricing & Contracts (openFirst, anchor pricing, first spacing)',
    data: { variant: 'group', anchorId: 'pricing', spacing: 'first', heading: 'Pricing & Contracts', source: 'selected', faqs: [gPrice, gP2, gP3], openFirst: true, limit: 6, allLink: { type: 'custom' } },
  },
  {
    block: 'accordionFAQ',
    variant: 'group — builds',
    label: 'p11 group 2: Builds',
    data: { variant: 'group', anchorId: 'builds', spacing: 'middle', heading: 'Builds', source: 'selected', faqs: [gB1, gB2], limit: 6, allLink: { type: 'custom' } },
  },
  {
    block: 'accordionFAQ',
    variant: 'group — marketing',
    label: 'p11 group 3: Marketing',
    data: { variant: 'group', anchorId: 'marketing', spacing: 'middle', heading: 'Marketing', source: 'selected', faqs: [gM1, gM2], limit: 6, allLink: { type: 'custom' } },
  },
  {
    block: 'accordionFAQ',
    variant: 'group — process',
    label: 'p11 group 4: Process & Trust (last spacing)',
    data: { variant: 'group', anchorId: 'process', spacing: 'last', heading: 'Process & Trust', source: 'selected', faqs: [gT1, gT2], limit: 6, allLink: { type: 'custom' } },
  },
  {
    block: 'categoryTabs',
    variant: 'zero tabs',
    label: 'CategoryTabs / zero tabs (renders nothing, console.warn)',
    data: { ariaLabel: 'FAQ categories', tabs: [] },
  },

  /* ---- p12 Contact ---- */
  {
    block: 'hero',
    variant: 'typographic compact',
    label: 'p12 contact hero',
    data: {
      ...compactHero,
      eyebrow: 'Contact',
      heading: '[STRATEGIC PLACEHOLDER — final copy TBD] Prospect? Book a call. Everything else, here.',
      accentPhrase: 'Book a call.',
      body: 'Fit and pricing questions get real answers on a 30-minute call. Partnerships, press, and existing clients: the form below.',
    },
  },
  /*
   * Stepped entries: the stepped layout applies below md only; from md the
   * whole form shows. Not single-viewport, so no `viewport` tag (the type only
   * has 'mobile-only' | 'desktop-only', which mean "hidden elsewhere").
   */
  {
    block: 'formEmbed',
    variant: 'standard — stepped (4 steps)',
    label: 'FormEmbed — standard, stepped (Contact phone, 4 steps; stepped below md, full form from md)',
    data: {
      variant: 'standard',
      form: 14, // TODO(seed): form id — hardcoded dev id; the seed must create this form on staging
      ground: 'grey',
      mobileLayout: 'stepped',
      steps: [
        { fieldNames: ['name'], heading: 'Who’s reaching out?', accentPhrase: 'reaching out?', hint: 'First name is plenty.' },
        { fieldNames: ['email'], heading: 'What’s your email?', accentPhrase: 'email?', hint: 'So we can reply. We won’t add you to anything.' },
        { fieldNames: ['reason'], heading: 'What’s this about?', accentPhrase: 'about?' },
        { fieldNames: ['message'], heading: 'The short version.', accentPhrase: 'version.', hint: 'Direct works best here too.' },
      ],
      stepped: { progressLabel: 'Question {n} of {m}', startLabel: 'Start', nextLabel: 'Next', backLabel: 'Back', sendAnotherLabel: 'Send another', confirmationHeading: 'Got it, {firstName}.', selectAsOptions: true },
    },
  },
  {
    block: 'formEmbed',
    variant: 'standard — stepped (default steps)',
    label: 'FormEmbed — standard, stepped (default one question per step; stepped below md, full form from md)',
    data: {
      variant: 'standard',
      form: 14, // TODO(seed): form id — hardcoded dev id; the seed must create this form on staging
      ground: 'grey',
      mobileLayout: 'stepped',
      stepped: { progressLabel: 'Question {n} of {m}', startLabel: 'Start', nextLabel: 'Next', backLabel: 'Back', sendAnotherLabel: 'Send another', confirmationHeading: 'Got it, {firstName}.', selectAsOptions: true },
    },
  },
  {
    block: 'directContact',
    variant: 'default',
    label: 'DirectContact — all rows + map (auto caption from site settings)',
    data: { showEmail: true, showSocials: true, showLocation: true, skipFormLine: 'Skip the form', rowLabels, map: { show: true, zoom: 1 } },
  },
  {
    block: 'directContact',
    variant: 'no map',
    label: 'DirectContact — no map (info only)',
    data: { showEmail: true, showSocials: true, showLocation: true, skipFormLine: 'Skip the form', rowLabels, map: { show: false } },
  },
  {
    block: 'directContact',
    variant: 'email only',
    label: 'DirectContact — email only',
    data: { showEmail: true, showSocials: false, showLocation: false, skipFormLine: 'Skip the form', rowLabels, map: { show: false } },
  },
  {
    block: 'directContact',
    variant: 'map only',
    label: 'DirectContact — map only, zoom 1.5, caption override',
    data: { showEmail: false, showSocials: false, showLocation: false, map: { show: true, caption: mapCaption, zoom: 1.5 } },
  },
  {
    block: 'formEmbed',
    variant: 'standard — empty',
    label: 'FormEmbed · empty (no form) — renders nothing (server console.error)',
    // `form` is required in the schema; null is the runtime state after the chosen form is deleted (FK set null).
    data: { variant: 'standard', form: null as unknown as BlockData<'formEmbed'>['form'], heading: 'Should not show' },
  },

  /* ==== Big step 6 (pages 13–21), in page order ==== */

  /* ---- p13 DEV-SEO / p14 MKT-SEO (posts templates: Hero article, RichContent article/band) ---- */
  {
    block: 'hero',
    variant: 'article — standfirst',
    label: 'p13/p14 article header: standfirst (post dek) between the h1 and the byline rule',
    data: {
      variant: 'article',
      eyebrow: 'Shopify Theme Development — Chicago',
      heading: `${S6_P} Shopify development in Chicago, scoped in writing.`,
      standfirst:
        "[Placeholder] Most stores we see don't need a rebuild — they need the leak found first. Two-week audit, fixed scope after it, three dated checkpoints.",
      body: 'By [Author], Duha Media',
      metaLine: 'Updated Jul 2026 · [N] min read',
      geometry: false,
    },
  },
  {
    block: 'richContent',
    variant: 'article + callout',
    label: 'p13 article body with the closing "How we do it" box (eyebrow, text, ghost button) — no prices in the box',
    data: {
      variant: 'article',
      numberSections: true,
      body: root(
        h('h2', "Why you're searching this"),
        p('[Placeholder] The pattern behind this page, in two sentences. You want the store to convert and one name accountable when it does not.'),
        h('h2', 'Revision before rebuild'),
        p('[Placeholder] Our default is the Revision, not the scratch build. We keep what converts and replace what leaks.'),
      ),
      callout: {
        eyebrow: 'How we do it',
        body: '[Placeholder] Fixed after the audit, by the team that also runs the growth engine afterwards — so the store is built for the marketing that follows. The build ends with training, not a support retainer.',
        link: link('Full build scope', '/shopify-theme-development'),
      },
    },
  },
  {
    block: 'richContent',
    variant: 'article + callout — text only',
    label: 'fallback: callout link unresolved (internal, no target) → box with eyebrow + text, no button',
    data: {
      variant: 'article',
      numberSections: false,
      body: root(p('[Placeholder] One paragraph of article text.')),
      callout: {
        eyebrow: 'How we do it',
        body: '[Placeholder] A closing note without a button.',
        link: { type: 'internal' as const, reference: null, label: 'Unresolved' },
      },
    },
  },
  {
    block: 'richContent',
    variant: 'article + callout — empty',
    label: 'fallback: empty callout group → no box (markup identical to the plain article)',
    data: {
      variant: 'article',
      numberSections: false,
      body: root(p('[Placeholder] One paragraph of article text; the closing box is empty.')),
      callout: { eyebrow: '', body: '', link: { type: 'internal' as const, reference: null, label: '' } },
    },
  },
  {
    block: 'richContent',
    variant: 'band',
    label: 'p13 DIY vs done: grey band, eyebrow + H2 + text, 3 facts (accent on one), pricing note under the strip — placeholder copy, no prices in prose or facts',
    data: {
      variant: 'band',
      tone: 'grey',
      framed: false,
      eyebrow: 'Hiring a freelancer vs. hiring a team',
      heading: 'Some stores should just hire a freelancer.',
      body: root(
        p(
          '[Placeholder] If the work is a handful of template edits and you already have someone who owns the numbers, a good freelancer is the right call — no fear-mongering here. The integrated case starts when the store has to carry acquisition spend, because then the build decisions and the marketing decisions are the same decisions. That is a math question, not a courage question.',
        ),
      ),
      facts: [
        { id: 'fx-rcb-1', value: '[N–N]', label: 'Weeks', sub: '[Placeholder] Signed scope to launch.', accent: true },
        { id: 'fx-rcb-2', value: '3', label: 'Checkpoints', sub: '[Placeholder] Audit, tracking live, launch + training.' },
        { id: 'fx-rcb-3', value: '1', label: 'Team, one dashboard', sub: '[Placeholder] One owner of the revenue number.' },
      ],
      pricingNote: 'Builds start at $5K',
    },
  },
  {
    block: 'richContent',
    variant: 'band — educational',
    label: 'p13 Educational block (R, DERIVED grey band): accent phrase, two paragraphs (in-text link), ghost button',
    data: {
      variant: 'band',
      tone: 'grey',
      eyebrow: '[Placeholder] Before you brief anyone',
      heading: '[Placeholder] Three questions to ask any developer.',
      accentPhrase: 'any developer.',
      body: root(
        p('[Placeholder] A short teaching note in brand voice. What to ask, and what a straight answer sounds like.'),
        p('[Placeholder] Second paragraph with an ', customLink('in-text link', '/services'), '.'),
      ),
      link: link('[Placeholder] Read the build scope', '/services'),
    },
  },
  {
    block: 'richContent',
    variant: 'band — no facts',
    label: 'p14 DIY vs done-for-you bridge: grey band, text only (fallback: empty facts → no strip, no note, no button)',
    data: {
      variant: 'band',
      tone: 'grey',
      eyebrow: 'Doing this yourself vs. having it done',
      heading: 'Some businesses should run this in-house.',
      body: root(
        p(
          '[Placeholder] If you have a marketing hire with channel experience and the patience to build systems, the worksheet above is enough to start — no fear-mongering here. The integrated-team case is for owners whose time is worth more running the business than running the marketing.',
        ),
      ),
      facts: [],
    },
  },
  {
    block: 'richContent',
    variant: 'band — framed',
    label: 'p14 How Duha does it (R, DERIVED): white ground, 2px ink box, eyebrow + text + ghost button (full width on phones)',
    data: {
      variant: 'band',
      tone: 'light',
      framed: true,
      eyebrow: 'How Duha does it',
      body: root(
        p(
          '[Placeholder] Email, ads, content, SEO, GBP and CRM run as one engine — same briefs, same data, one owner of the revenue number. And because the endgame is your team running it, the engagement ends with a handover, not a renewal pitch.',
        ),
      ),
      pricingNote: 'Engines start at $1K/mo',
      link: link('See the engine', '/marketing'),
    },
  },
  {
    block: 'richContent',
    variant: 'band — 2 facts + link',
    label: 'layout check: two facts (2-column strip), pricing note, button centred under the strip; light ground',
    data: {
      variant: 'band',
      tone: 'light',
      heading: '[Placeholder] Two facts only.',
      body: root(p('[Placeholder] The strip divides into as many columns as there are facts (1–3).')),
      facts: [
        { id: 'fx-rcb-4', value: '[N]', label: '[Placeholder] Vendors replaced' },
        { id: 'fx-rcb-5', value: '1', label: '[Placeholder] Owner of the number', accent: true },
      ],
      pricingNote: 'Builds start at $5K',
      link: link('[Placeholder] Book a call', '/book-a-call'),
    },
  },

  /* ---- p15 Campaign LP ---- */
  {
    block: 'hero',
    variant: 'vsl',
    label: 'p15 Campaign LP Hero A: headline (no accent), click-to-load video, one CTA',
    data: {
      variant: 'vsl',
      eyebrow: '[Campaign eyebrow]',
      heading: `${S6_P} [Single campaign message, matched to the ad creative]`,
      video: { url: VIDEO_URL, poster: placeholderImage },
      ctas: [{ id: 'fx-vsl-cta', link: { type: 'custom', url: '/book-a-call', label: 'Book a Call' } }],
    },
  },
  {
    block: 'hero',
    variant: 'vsl — no video',
    label: 'p15 Hero A fallback: no video link -> no tile (logged), headline + CTA only',
    data: {
      variant: 'vsl',
      eyebrow: '[Campaign eyebrow]',
      heading: `${S6_P} [Single campaign message, matched to the ad creative]`,
      video: { url: '', poster: null } as unknown as BlockData<'hero'>['video'],
      ctas: [{ id: 'fx-vsl-cta2', link: { type: 'custom', url: '/book-a-call', label: 'Book a Call' } }],
    },
  },
  {
    block: 'proofStrip',
    variant: 'metrics',
    label: 'p15 metrics: 2 metrics + capacity (live scarcity `capacity`) + pricing note + logos',
    data: {
      variant: 'metrics',
      metrics: [
        { id: 'fx-pm-1', value: '[N]', label: '[Result]', accent: true },
        { id: 'fx-pm-2', value: '[N]', label: '[Count]', sub: '[sub]' },
      ],
      capacityStatement: 'capacity',
      pricingNote: 'Builds start at $5K · Engines start at $1K/mo',
      logos: lpLogos,
    },
  },
  {
    block: 'proofStrip',
    variant: 'metrics — pricing note only',
    label: 'metrics: pricing note only',
    data: { variant: 'metrics', metrics: [], capacityStatement: 'none', pricingNote: 'Builds start at $5K', logos: { show: false } },
  },
  {
    block: 'proofStrip',
    variant: 'metrics — empty',
    label: 'metrics: nothing set (renders nothing)',
    data: { variant: 'metrics', metrics: [], capacityStatement: 'none', logos: { show: false } },
  },
  {
    block: 'proofStrip',
    variant: 'metrics — capacity key missing',
    label: 'metrics: capacity key missing in the global (`offer-line` until seeded): tile skipped, logged',
    data: { variant: 'metrics', metrics: [{ id: 'fx-pm-3', value: '[N]', label: '[Result]' }], capacityStatement: 'offer-line', logos: { show: false } },
  },
  {
    block: 'miniCTAStrip',
    variant: 'button',
    label: 'p15 CTA repeat: button with lead-in line',
    data: { variant: 'button', text: 'Ready when you are.', link: L('Book a Call') },
  },
  {
    block: 'miniCTAStrip',
    variant: 'button — alone',
    label: 'p15 CTA repeat: button alone',
    data: { variant: 'button', link: L('Book a Call') },
  },
  {
    block: 'miniCTAStrip',
    variant: 'button — unresolved link',
    label: 'button unresolved link (renders nothing)',
    data: { variant: 'button', text: 'x', link: { type: 'custom', url: '', label: 'Book', newTab: false } },
  },
  {
    block: 'offerBlock',
    variant: 'default',
    label: 'p15 offer: populated (capacity line needs `offer-line` with a reason in the scarcity global)',
    data: offerBase,
  },
  {
    block: 'offerBlock',
    variant: 'capacity none',
    label: 'offer: capacity none (button only)',
    data: { ...offerBase, capacity: 'none' },
  },
  {
    block: 'offerBlock',
    variant: 'capacity missing',
    label: 'offer: `offer-line` missing / no reason → no capacity line, logged (same data as populated; DB-dependent)',
    data: offerBase,
  },
  {
    block: 'offerBlock',
    variant: 'minimal',
    label: 'offer: minimal (heading + button)',
    data: { heading: '[Promise]', cta: L('Book a Call'), capacity: 'none' },
  },
  {
    block: 'testimonialRow',
    variant: 'row — ctaStyle button',
    label: 'p15: heading + testimonial + study card (fallback figure), CTA as primary button below the row (full width on mobile)',
    data: {
      variant: 'row',
      heading: 'What owners said after.',
      testimonials: [readerQuote],
      studyCard: {
        show: true,
        source: 'featured',
        label: 'A study in full',
        readLabel: 'Read the study',
        fallbackMetric: { value: '[N]%', label: '[Metric label]', sub: '[Client A · placeholder]' },
      },
      cta: { type: 'custom', url: '/book-a-call', label: 'Book a Call' },
      ctaStyle: 'button',
    },
  },

  /* ---- p16 Newsletter ---- */
  {
    block: 'hero',
    variant: 'typographic — form card',
    label: 'p16 Newsletter hero: signup card above the fold (form empty -> site-settings newsletter form), Cadence/Length/Filler stats',
    data: {
      variant: 'typographic',
      eyebrow: 'The newsletter',
      heading: `${S6_P} One useful email a month. Numbers included.`,
      accentPhrase: 'Numbers included.',
      body: "[Placeholder] What we're seeing across client stores — what worked, what didn't, with the data attached. Case studies land here before they land anywhere else.",
      stats: [
        { id: 'fx-nl-1', label: 'Cadence', value: 'Monthly' },
        { id: 'fx-nl-2', label: 'Length', value: '[N] min read' },
        { id: 'fx-nl-3', label: 'Filler', value: 'None' },
      ],
      showForm: true,
      form: null,
      formStyle: 'card',
      formHeading: 'Join the list',
      formBody: 'Unsubscribe anytime. We never sell the list.',
      submitLabel: 'Join',
    },
  },
  {
    block: 'postList',
    variant: 'default',
    label: 'p16 PostList populated (latest + 2 previously, 12 total; static previewPosts)',
    data: { ...postListBase, previewPosts: sampleIssues, previewTotal: 12 },
  },
  {
    block: 'postList',
    variant: 'one issue',
    label: 'PostList one issue (featured card only)',
    data: { ...postListBase, previewPosts: sampleIssues.slice(0, 1), previewTotal: 1 },
  },
  {
    block: 'postList',
    variant: 'empty',
    label: 'PostList empty state (no published issue — launch state)',
    data: { ...postListBase, previewPosts: [] },
  },
  {
    block: 'postList',
    variant: 'no featured',
    label: 'PostList no featured (rows only)',
    data: { ...postListBase, featureLatest: false, previewPosts: sampleIssues, previewTotal: 12 },
  },
  {
    block: 'testimonialRow',
    variant: 'row — leadMetric + quote',
    label: 'p16 Social proof: [N] Subscribers tile (1fr) + reader quote (2fr); stacked on mobile',
    data: { variant: 'row', testimonials: [readerQuote], leadMetric: subscribersMetric },
  },
  {
    block: 'testimonialRow',
    variant: 'row — leadMetric alone',
    label: 'fallback: no published testimonial → metric tile alone',
    data: { variant: 'row', testimonials: [], leadMetric: subscribersMetric },
  },
  {
    block: 'testimonialRow',
    variant: 'row — leadMetric incomplete',
    label: 'fallback: metric missing label and no testimonials → renders nothing (empty space by design)',
    data: { variant: 'row', testimonials: [], leadMetric: { value: '[N]' } },
  },

  /* ---- p17 Link-in-Bio (one 480px column at every width; not single-viewport) ---- */
  {
    block: 'linkStack',
    variant: 'default',
    label: 'populated: latest published study metric + case-study link, socials, slots line, current push',
    data: {
      ...lsBase,
      previewStudy: fixtureStudies[0],
      currentPush: { show: true, icon: 'file-text', link: { type: 'custom', url: 'https://example.com/guide', label: '[Current push: the guide]', newTab: true } },
    },
  },
  {
    block: 'linkStack',
    variant: 'no study',
    label: 'fallback: no published case study (fallback line, no case-study link) — launch state',
    data: { ...lsBase },
  },
  {
    block: 'linkStack',
    variant: 'no socials',
    label: 'no socials: Follow hidden',
    data: { ...lsBase, showSocials: false, previewStudy: fixtureStudies[0] },
  },
  {
    block: 'linkStack',
    variant: 'capacity none',
    label: 'slots line off: no capacity line (a missing `slots-line` row in the global gives the same result and logs)',
    data: { ...lsBase, primary: { ...lsBase.primary, capacity: 'none' }, previewStudy: fixtureStudies[0] },
  },
  {
    block: 'linkStack',
    variant: 'minimal',
    label: 'minimal: identity + Book a call only',
    data: { ...lsBase, showSocials: false, links: [], latestCaseStudy: false, primary: { ...lsBase.primary, capacity: 'none' } },
  },

  /* ---- p18 Lead Magnet (lead-magnets template) ---- */
  {
    block: 'hero',
    variant: 'typographic — inline form',
    label: 'p18 Lead Magnet capture state: compact narrow hero + inline email row + note',
    data: {
      variant: 'typographic',
      size: 'compact',
      width: 'narrow',
      eyebrow: 'Free download',
      heading: `${S6_P} [Asset name placeholder — the checklist/worksheet pitch.]`,
      accentPhrase: 'the checklist/worksheet pitch.',
      body: "[Placeholder — one paragraph: what the asset is, who it's for, the specific problem it solves. Number first.]",
      badge: { show: false },
      showForm: true,
      form: 15, // TODO(seed): form id — hardcoded dev id; the seed must create this form on staging
      formStyle: 'inline',
      submitLabel: 'Get the download',
      formNote: 'Email delivery. No drip sequence ambush — one send, plus the monthly newsletter if you opt in.',
    },
  },
  {
    block: 'hero',
    variant: 'typographic — form missing',
    label: 'Form slot on but the form is deleted: hero renders without the form or its note (logged)',
    data: {
      variant: 'typographic',
      size: 'compact',
      eyebrow: 'Free download',
      heading: `${S6_P} Form missing: hero renders without it`,
      body: '[Placeholder paragraph.]',
      badge: { show: false },
      showForm: true,
      form: 999999,
      formStyle: 'inline',
      submitLabel: 'Get the download',
      formNote: 'This note is not shown when the form is missing.',
    },
  },
  {
    block: 'specLedger',
    variant: 'list',
    label: "p18 What's inside: check-bullet list",
    data: { variant: 'list', tone: 'auto', eyebrow: "What's inside", eyebrowTick: false, items: listBullets },
  },
  {
    block: 'specLedger',
    variant: 'list — headline',
    label: 'SpecLedger list + headline (2 items)',
    data: { variant: 'list', heading: 'Everything in the worksheet', accentPhrase: 'worksheet', eyebrow: "What's inside", items: listBullets.slice(0, 2) },
  },
  {
    block: 'specLedger',
    variant: 'list — empty',
    label: 'SpecLedger list EMPTY (renders nothing)',
    data: { variant: 'list', eyebrow: "What's inside", items: [] },
  },
  {
    block: 'newsletterBand',
    variant: 'cross-sell',
    label: 'p18 delivered state: message + newsletter box',
    data: {
      variant: 'cross-sell',
      delivered: deliveredState,
      line: 'More like the asset you just grabbed. Numbers included.',
      buttonLabel: 'Join the newsletter',
      crossSellLink: { type: 'custom', url: '/newsletter', label: 'Join the newsletter' },
    },
  },
  {
    block: 'newsletterBand',
    variant: 'cross-sell — no link',
    label: 'fallback: no cross-sell link (box uses site-settings defaults + the published /newsletter page, else omitted)',
    data: {
      variant: 'cross-sell',
      delivered: { heading: 'Delivered only', body: 'No link.' },
      crossSellLink: null as unknown as BlockData<'newsletterBand'>['crossSellLink'],
    },
  },
  {
    block: 'newsletterBand',
    variant: 'cross-sell — empty link',
    label: 'fallback: empty link group',
    data: { variant: 'cross-sell', delivered: deliveredState, crossSellLink: { type: 'custom' } },
  },

  /* ---- p19 Review Hub ---- */
  {
    block: 'reviewWall',
    variant: 'wall',
    label: 'p19 wall: populated (7 testimonials) with metric, scarcity (live `capacity`) and client inserts',
    data: {
      variant: 'wall',
      source: 'manual',
      testimonials: feedTestimonials,
      wallNote: '[Demonstrative wall: reviews import verbatim at launch]',
      inserts: [
        { id: 'fx-wi-1', kind: 'metric', position: 2, metric: { value: '[N]', label: '[What it measures]', sub: '[Quiet sub-line]', accent: true } },
        { id: 'fx-wi-2', kind: 'scarcity', position: 4, statement: 'capacity' },
        { id: 'fx-wi-3', kind: 'client', position: 5, client: fixtureClients[1] },
      ],
    },
  },
  {
    block: 'reviewWall',
    variant: 'wall — empty with note',
    label: 'Wall: empty with note',
    data: { variant: 'wall', source: 'manual', testimonials: [], emptyNote: '[Empty note: reviews appear here as they are published.]' },
  },
  {
    block: 'reviewWall',
    variant: 'wall — empty',
    label: 'Wall: empty, no note (renders nothing)',
    data: { variant: 'wall', source: 'manual', testimonials: [] },
  },
  {
    block: 'reviewWall',
    variant: 'wall — inserts skipped',
    label: 'Wall: draft client insert + scarcity "none" insert → both tiles skipped',
    data: {
      variant: 'wall',
      source: 'manual',
      testimonials: textTestimonials,
      inserts: [
        { id: 'fx-wi-4', kind: 'client', position: 1, client: draftClient },
        { id: 'fx-wi-5', kind: 'scarcity', position: 1, statement: 'none' },
      ],
    },
  },

  /* ---- p20 Legal ---- */
  {
    block: 'richContent',
    variant: 'legal',
    label: 'p20 legal document: eyebrow, H1 title, last-updated date, 6 H2 sections → desktop sticky sidebar / mobile sticky rail — counsel placeholders only',
    data: {
      variant: 'legal',
      eyebrow: 'Legal — [Privacy Policy]',
      heading: '[Document title]',
      lastUpdated: '2026-10-01T12:00:00.000Z',
      lastUpdatedLabel: 'Last updated',
      navLabel: 'On this page',
      body: root(
        h('h2', '1. Scope'),
        counsel(' This template defines structure and typography only.'),
        h('h2', '2. Data we collect'),
        counsel(),
        h('h2', "3. How it's used"),
        counsel(),
        h('h2', '4. Sharing & processors'),
        counsel(),
        h('h2', '5. Your rights'),
        counsel(),
        h('h2', '6. Contact'),
        p('[Placeholder — counsel-provided content. Routes to ', customLink('Contact', '/contact'), '.]'),
      ),
    },
  },
  {
    block: 'richContent',
    variant: 'legal — anchor guard',
    label: 'anchors: H2 "Main" (reserved id → section-main), two H2 "Contact" (→ contact, contact-2), empty date (line hidden)',
    data: {
      variant: 'legal',
      eyebrow: 'Legal — [Terms]',
      heading: '[Document title]',
      lastUpdated: null,
      lastUpdatedLabel: 'Last updated',
      navLabel: 'On this page',
      body: root(h('h2', 'Main'), counsel(), h('h2', 'Contact'), counsel(), h('h2', 'Contact'), counsel()),
    },
  },
  {
    block: 'richContent',
    variant: 'legal — no sections',
    label: 'fallback: no H2s → no sidebar / rail, single column; no date line',
    data: {
      variant: 'legal',
      heading: '[Document title]',
      navLabel: 'On this page',
      body: root(counsel(' A document without section headings.')),
    },
  },

  /* ---- p21 404 ---- */
  {
    block: 'error404',
    variant: 'default',
    label: 'Error404 default: Book a Call (primary) + Home + Work',
    data: {
      ...error404Copy,
      links: [
        { id: 'fx-404-1', link: L('Book a Call') },
        { id: 'fx-404-2', link: L('Home', '/') },
        { id: 'fx-404-3', link: L('Work', '/work') },
      ],
    },
  },
  {
    block: 'error404',
    variant: 'one link',
    label: 'Error404 one link',
    data: { ...error404Copy, links: [{ id: 'fx-404-4', link: L('Back to Home', '/') }] },
  },
  {
    block: 'error404',
    variant: 'custom wording',
    label: 'Error404 custom wording (410)',
    data: {
      code: '410',
      heading: 'That page is gone.',
      body: 'We retired it. The useful part moved.',
      links: [
        { id: 'fx-404-5', link: L('See the work', '/work') },
        { id: 'fx-404-6', link: L('Contact', '/contact') },
      ],
    },
  },
]
