import type { Page } from '@/payload-types'
import { customLink, h, p, root } from '@/showcase/lexical'

import type { LibraryIds } from './library'
import { SEED_CONTEXT, ensure, link, noLink, ph, phSub, type SeedCtx } from './lib'

/**
 * The 21 page types as `pages` documents (p2/p13/p14/p18 are templates and are
 * seeded as draft documents in library.ts). Sections follow SCHEMA.md §9 in
 * the LOCKED order — one block per section, nothing added, removed or merged.
 * Header/footer variants per CLAUDE.md rule 4; noindex on p10, p15, p17, p21
 * (SCHEMA §6.1, F65). Pages are published so every route renders; their copy
 * is placeholder (F61: Gate 3 blocks any bracket placeholder on a public page).
 *
 * Links are custom site paths (as typed by an editor), so a page can point at
 * a page created later in the same run.
 */

type Layout = Page['layout']

type PageSpec = {
  slug: string
  title: string
  description: string
  headerVariant?: Page['headerVariant']
  footerVariant?: Page['footerVariant']
  zeroLeakage?: boolean
  readingProgress?: boolean
  noindex?: boolean
  layout: Layout
}

const L = link
const bookACall = () => L('Book a Call', '/book-a-call')

/** Ledger fallback rows (F61 proposal: capacity numbers only; prices only in the small pricing note). */
const ledgerRows = [
  { value: '[7]', label: 'Client cap', sub: 'Capacity is the quality gate, not a countdown.', accent: true },
  { value: '3', label: 'Phases, one team', sub: 'Build the foundation. Operate the engine. Build independence.' },
]
const BOTH_PRICES = 'Builds start at $5K. Engines start at $1K/mo.'

const counsel = (extra = '') => p(`[Placeholder — counsel-provided content.${extra}]`)

const legalDoc = (name: string, sections: string[]): Layout => [
  {
    blockType: 'richContent',
    variant: 'legal',
    eyebrow: `Legal — ${name}`,
    heading: name,
    lastUpdatedLabel: 'Last updated',
    navLabel: 'On this page',
    body: root(
      ...sections.flatMap((s, i) => [h('h2', `${i + 1}. ${s}`), counsel(i === 0 ? ' This page defines structure only; no policy text is invented.' : '')]),
      h('h2', `${sections.length + 1}. Contact`),
      p('[Placeholder — counsel-provided content. Questions route to ', customLink('Contact', '/contact'), '.]'),
    ),
  },
]

export function pageSpecs(ids: LibraryIds): PageSpec[] {
  const t = ids.testimonials
  const f = ids.faqs
  const img = ids.media.image

  return [
    /* ---------------- p1 Homepage ---------------- */
    {
      slug: 'home',
      title: 'Integrated ecommerce growth partner, Chicago',
      description: 'One team builds your Shopify store, runs the growth engine, then trains your team to take over. Builds start at $5K. Chicago.',
      layout: [
        {
          blockType: 'hero',
          variant: 'typographic',
          eyebrow: 'Integrated ecommerce growth partner — Chicago',
          eyebrowTick: true,
          heading: ph("Your ecommerce growth team, until you don't need one."),
          accentPhrase: "until you don't need one.",
          badge: { show: true, text: '[$X.XM client revenue tracked]' },
          body: phSub('One team builds your store, runs your marketing, and trains yours to take over.'),
          pricingNote: BOTH_PRICES,
          ctas: [{ link: bookACall() }, { link: L('See the Work', '/work') }],
          verticalMicrocopy: 'Build · Operate · Hand over',
          geometry: true,
        },
        {
          blockType: 'proofStrip',
          variant: 'scarcity',
          statements: [{ key: 'ongoing' }, { key: 'capacity' }],
          pricingNote: 'Builds start at $5K',
          logos: { show: true, eyebrow: "Stores we've run numbers for", source: 'flagged' },
        },
        {
          blockType: 'caseStudyCards',
          layout: 'cards',
          eyebrow: 'Selected work',
          heading: 'The work, in numbers.',
          accentPhrase: 'in numbers.',
          source: 'featured',
          limit: 3,
          cardLinkLabel: 'Read the case study',
          allLink: L('All studies →', '/work'),
          fallbackMode: 'ledger',
          fallbackEyebrow: 'The numbers we can show',
          fallbackHeading: 'Numbers anyway.',
          fallbackAccentPhrase: 'anyway.',
          fallbackBody: 'Studies publish here as clients sign off.',
          fallbackMetrics: ledgerRows,
          pricingNote: BOTH_PRICES,
        },
        { blockType: 'miniCTAStrip', variant: 'band', text: 'One team. One dashboard. A handover date.', link: bookACall() },
        {
          blockType: 'twoTrackPanels',
          variant: 'equal',
          heading: 'What we actually do',
          accentPhrase: 'actually',
          panels: [
            {
              title: 'First, we build it.',
              body: 'A Shopify store that converts, built from scratch or rebuilt. [Placeholder copy.]',
              pricingNote: 'Builds start at $5K.',
              link: L('How the build works →', '/services/shopify-theme-development'),
            },
            {
              title: 'Then we grow it.',
              accentTitle: true,
              body: 'Email, ads, content, SEO, GBP and CRM run by one team. [Placeholder copy.]',
              pricingNote: 'Engines start at $1K/mo.',
              link: L('What we run →', '/services/marketing'),
            },
          ],
        },
        {
          blockType: 'phaseTimeline',
          variant: 'accordion',
          eyebrow: 'How it runs',
          heading: 'Three phases. The last one is the point.',
          accentPhrase: 'the point.',
          intro: 'Eight steps, one calendar. You approve at dated checkpoints and finish owning the whole thing.',
          phases: [
            { number: 'Phase 1', title: 'Build the foundation' },
            { number: 'Phase 2', title: 'Operate the engine' },
            { number: 'Phase 3', title: 'Build independence' },
          ],
          steps: [
            { number: '01', title: 'Intake', phase: '1', detail: 'We start from your P&L, not your homepage. Margins, repeat rate, and what actually sells.' },
            { number: '02', title: 'Research', phase: '1', detail: 'Competitors, category language, and the one objection that stalls your buyer.' },
            { number: '03', title: 'Branding', phase: '1', detail: 'Positioning is decided before a single visual. The look follows the claim.' },
            { number: '04', title: 'Design', phase: '1', detail: 'Every screen is drawn against the funnel step it has to carry.' },
            { number: '05', title: 'Development', phase: '1', detail: 'Analytics and server events go live before the theme, so launch has a baseline.' },
            { number: '06', title: 'Onboarding', phase: '2', detail: 'Your team meets the dashboard they will own, while we are still on the hook.' },
            { number: '07', title: 'Engine launch', phase: '2', detail: 'Content and acquisition run on one calendar with one owner of the number.' },
            { number: '08', title: 'Handover', phase: '3', detail: 'Documentation, training, and the keys. The goal is your team running this without us.' },
          ],
        },
        {
          blockType: 'teamIntro',
          variant: 'intro',
          eyebrow: "Who you'd work with",
          heading: 'Chicago operators, not account managers.',
          body: "You've managed five freelancers who never talked to each other. [Placeholder body — final copy TBD.]",
          photo: img,
          link: L('More about us →', '/about'),
        },
        {
          blockType: 'testimonialRow',
          variant: 'row',
          eyebrow: 'What clients say',
          heading: 'Proof, in their words.',
          testimonials: [t.quote, t.handover, t.short],
          studyCard: {
            show: true,
            label: 'A study in full',
            source: 'featured',
            readLabel: 'Read the study',
            fallbackMetric: { value: '[N]%', label: '[Metric label]', sub: '[Client A · placeholder]' },
          },
          cta: L('All studies', '/work'),
        },
        {
          blockType: 'teamIntro',
          variant: 'founder-card',
          heading: 'One founder, no layers.',
          accentPhrase: 'no layers.',
          body: 'The person who scopes the work is the person who does it. [One-sentence bio, founder-authored.]',
          member: ids.founder,
          link: noLink,
        },
        {
          blockType: 'finalCTA',
          heading: "Your store already has the demand. It's leaking it.",
          capacity: 'builds-line',
          buttons: [{ link: bookACall() }, { link: L('Contact us', '/contact') }],
        },
      ],
    },

    /* ---------------- p3 Work ---------------- */
    {
      slug: 'work',
      title: 'Work',
      description: 'Case studies from stores we built, ran and handed over — published as clients sign off on the figures.',
      layout: [
        {
          blockType: 'hero',
          variant: 'typographic',
          eyebrow: 'Work',
          eyebrowTick: true,
          heading: ph('The work, in numbers'),
          accentPhrase: 'in numbers',
          body: phSub('One team built the store, ran the engine, then handed it over.'),
          geometry: true,
          stats: [
            { value: '$[X.X]M', label: 'Client revenue added' },
            { value: '[N]', label: 'Teams running it themselves' },
          ],
        },
        {
          blockType: 'caseStudyCards',
          layout: 'ledger',
          source: 'latest',
          allLink: noLink,
          ledgerLabels: {
            number: '№',
            client: 'Client',
            summary: 'What was leaking / what we changed',
            metric: 'Returned',
            kind: 'Case study',
            readLabel: 'Read the study →',
          },
          pageSize: 6,
          loadMore: true,
          loadMoreLabel: 'Load more studies',
          loadMoreLoadingLabel: 'Loading…',
          loadMoreErrorLabel: 'Could not load more studies. Try again.',
          fallbackMode: 'ledger',
          fallbackEyebrow: 'The numbers we can show',
          fallbackHeading: 'Numbers anyway.',
          fallbackAccentPhrase: 'anyway.',
          fallbackBody: 'Studies publish here as clients sign off.',
          fallbackMetrics: ledgerRows,
          pricingNote: BOTH_PRICES,
        },
        {
          blockType: 'testimonialRow',
          variant: 'row',
          eyebrow: 'What clients say',
          heading: 'Proof, in their words.',
          testimonials: [t.video, t.linkedin],
          studyCard: { show: false },
        },
        {
          blockType: 'newsletterBand',
          variant: 'band',
          heading: 'Studies land here first.',
          accentPhrase: 'first',
          line: 'One useful email a month. Numbers included.',
          tone: 'light',
          spacing: 'roomy',
        },
        { blockType: 'finalCTA', heading: 'Want numbers like these for your store?', capacity: 'builds-line', buttons: [{ link: bookACall() }] },
      ],
    },

    /* ---------------- p4 Services Hub ---------------- */
    {
      slug: 'services',
      title: 'Services',
      description: 'Two tracks, one team: Shopify theme development and a marketing engine, ending in a handover to your team.',
      layout: [
        {
          blockType: 'hero',
          variant: 'typographic',
          heading: ph('We build it. Then we grow it.'),
          accentPhrase: 'grow it.',
          body: phSub('Two tracks, one team. Start wherever the problem is.'),
          ctas: [{ link: bookACall() }],
          geometry: true,
          phaseStrip: [
            { number: '01', label: 'Build the foundation' },
            { number: '02', label: 'Operate the engine' },
            { number: '03', label: 'Build independence' },
          ],
        },
        {
          blockType: 'twoTrackPanels',
          variant: 'doors',
          heading: 'Two doors.',
          panels: [
            {
              title: 'Shopify Theme Development',
              body: "For no store, or one that isn't working. Conversion-focused theme, tracking that tells the truth, SEO groundwork. Fixed scope. [Placeholder copy.]",
              pricingNote: 'Builds start at $5K.',
              link: L('See the build →', '/services/shopify-theme-development'),
            },
            {
              title: 'Marketing',
              accentTitle: true,
              body: 'For a store with no growth plan. Email, ads, content, SEO, GBP, CRM, one team on one dashboard. [Placeholder copy.]',
              pricingNote: 'Engines start at $1K/mo.',
              link: L('See the engine →', '/services/marketing'),
            },
          ],
        },
        {
          blockType: 'twoTrackPanels',
          variant: 'contrast',
          eyebrow: 'Why both together',
          eyebrowTick: true,
          heading: "Half an offer is why it didn't work.",
          panels: [
            { label: 'Sold to you as', claim: '"We\'ll build you a beautiful store."', title: 'A build with no engine is a parked car.', link: noLink },
            { label: 'Sold to you as', claim: '"Just hire a specialist for each channel."', title: 'You became the manager you were paying to avoid.', link: noLink },
          ],
          conclusion: 'One team through both phases, and a handover date set at the start. [Placeholder copy.]',
        },
        { blockType: 'newsletterBand', variant: 'band' },
        {
          blockType: 'phaseTimeline',
          variant: 'arc',
          heading: 'Where both doors end',
          phases: [
            {
              number: 'Phase 01',
              title: 'Build the foundation',
              body: 'A Shopify theme built around the questions buyers actually ask, analytics wired so the numbers mean something, and the SEO groundwork. [Placeholder — final copy TBD.]',
              link: L('See Phase 01 →', '/services/shopify-theme-development'),
            },
            {
              number: 'Phase 02',
              title: 'Operate the engine',
              body: 'Email, ads, content, SEO, Google Business Profile and CRM, run by the same people who built the store, reporting into one dashboard. [Placeholder — final copy TBD.]',
              link: L('See Phase 02 →', '/services/marketing'),
            },
            {
              number: 'Phase 03',
              title: 'Build independence',
              body: 'Your team takes the engine over on a date set at the start. We document the systems, train the person who will own them, and hand over the accounts. [Placeholder — final copy TBD.]',
            },
          ],
        },
        {
          blockType: 'phaseTimeline',
          variant: 'steps',
          heading: 'Either door starts the same way.',
          steps: [
            { number: 'Step 01', title: 'A call, 30 minutes', tag: '[Day 0]', detail: "Your numbers and what's leaking. We say which door fits — including “neither, yet.”", outcomes: [{ text: 'An honest read on which phase you need' }] },
            { number: 'Step 02', title: 'A dated plan', tag: '[Within N days]', detail: 'Scope, price and the calendar in writing — deliverables, sign-off points, and the handover date.', outcomes: [{ text: 'A fixed scope and a price, before you commit' }] },
            { number: 'Step 03', title: 'Work starts', tag: '[Week 1]', detail: 'Same team through both phases, no account-manager layer. You see the dashboard we see.', outcomes: [{ text: 'Dashboard access and a named contact' }] },
          ],
          closingLine: "Nothing is signed before step 02. If the plan doesn't fit, that's where it stops. [Placeholder]",
          cta: bookACall(),
        },
        {
          blockType: 'testimonialRow',
          variant: 'row',
          eyebrow: 'Featured proof',
          heading: 'Proof, in their words.',
          testimonials: [t.handover, t.quote],
          studyCard: {
            show: true,
            label: 'A study in full',
            source: 'featured',
            readLabel: 'Read the study',
            fallbackMetric: { value: '[N]%', label: '[Metric label]', sub: '[Client A · placeholder]' },
          },
        },
        {
          blockType: 'accordionFAQ',
          variant: 'mini',
          heading: 'Routing questions',
          source: 'selected',
          faqs: [f.price, f.buildOnly, f.retainer],
          openFirst: true,
          limit: 6,
          allLink: L('All questions, answered straight →', '/faq'),
        },
        { blockType: 'finalCTA', heading: 'Start with a call. Leave with a dated plan.', capacity: 'builds-line', buttons: [{ link: bookACall() }] },
      ],
    },

    /* ---------------- p5 Shopify Theme Development ---------------- */
    {
      slug: 'services/shopify-theme-development',
      title: 'Shopify Theme Development',
      description: 'Shopify theme builds and revisions with tracking and SEO shipped inside the build. Builds start at $5K, scoped in writing.',
      layout: [
        {
          blockType: 'hero',
          variant: 'service',
          eyebrow: 'Phase 01 of three — build the foundation',
          eyebrowTick: true,
          heading: ph('The store build'),
          body: phSub('Six steps from a broken store to a foundation that converts, with tracking and SEO shipped inside the build.'),
          pricingNote: 'Builds start at $5K',
          subNote: '[Placeholder — typical revision length]',
          ctas: [{ link: L('Book a call', '/book-a-call') }],
          breadcrumb: [{ label: 'Services', url: '/services' }, { label: 'Shopify theme development' }, { label: 'Phase 01 — build the foundation' }],
          stats: [{ value: '[N weeks]', label: 'Typical revision' }],
        },
        {
          blockType: 'twoTrackPanels',
          variant: 'primary-secondary',
          eyebrow: 'Where people usually start',
          eyebrowTick: true,
          heading: 'Most start with a revision.',
          accentPhrase: 'revision',
          panels: [
            {
              label: 'Default starting point',
              title: 'Revision',
              body: 'Keep what converts, fix what leaks. [Placeholder copy.]',
              pricingNote: 'Builds start at $5K.',
              link: L('Start with a revision', '/book-a-call'),
            },
            {
              label: 'When the math says so',
              title: 'Scratch build',
              body: 'A blank theme, the same six steps. [Placeholder copy.]',
              link: L('Ask about a scratch build →', '/book-a-call'),
            },
          ],
          conclusion: 'Exact scope is priced on the call. [Placeholder copy.]',
        },
        {
          blockType: 'specLedger',
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
          ].map(([code, title, line]) => ({ code, title, line, image: img })),
        },
        {
          blockType: 'specLedger',
          variant: 'expandable',
          eyebrow: 'Specification — what every build ships with',
          firstOpen: true,
          items: [
            ['D-01', 'Conversion build', 'Templates around buyer questions, speed as a feature.', 'The four templates above, laid out around what buyers arrive asking. Speed budgeted before features are added.', 'Conversion and add-to-cart by template, against the store you had.'],
            ['D-02', 'Brand positioning', "What the store says and who it's for. Before design.", 'Category read, buyer read, and the sentence the homepage has to earn — signed off before a screen is designed.', 'A stranger describes your store the way your team does.'],
            ['D-03', 'UX', "Navigation and checkout paths that don't leak demand.", 'Menu structure, filtering, product page order — the handful of decisions that turn a visit into an order.', 'Drop-off by step, before and after. Leaks get named.'],
            ['D-04', 'Analytics + tracking', 'In before launch, so the numbers tell the truth.', 'Analytics, ecommerce events and ad attribution wired and tested on the live theme.', 'Store revenue reconciles with the ad accounts.'],
            ['D-05', 'SEO foundations', 'Structure, speed and metadata at build time.', 'Crawlable structure, clean templates, titles and schema, plus a speed pass.', 'Indexation and Core Web Vitals pass at launch.'],
            ['D-06', 'Launch support', "We're there when it goes live.", 'A launch checklist, a monitored first stretch, and a walkthrough of the theme your team now owns.', 'Nothing silently breaks in week one. [Placeholder copy.]'],
          ].map(([code, title, line, what, proof]) => ({ code, title, line, whatLabel: 'What we build', what, proofLabel: "How you'll know it worked", proof })),
          pricingNote: 'Builds start at $5K. Exact scope is priced on the call.',
        },
        {
          blockType: 'phaseTimeline',
          variant: 'build-run',
          eyebrow: 'How a build runs',
          eyebrowTick: true,
          heading: 'Six steps, two sign-offs',
          steps: [
            { number: '01', title: 'Intake', tag: 'Dated plan', detail: 'You leave with a dated plan.' },
            { number: '02', title: 'Research', tag: 'Findings', detail: 'Buyers, category, competitors.' },
            { number: '03', title: 'Positioning', tag: 'Your sign-off', isSignOff: true },
            { number: '04', title: 'Design', tag: 'Your sign-off', isSignOff: true },
            { number: '05', title: 'Development', tag: 'The store', detail: 'Theme, tracking and SEO together.' },
            { number: '06', title: 'Launch', tag: 'We stay live', detail: 'We stay through go-live.' },
          ],
          closingLine: 'Then Phase 02, if the numbers say it fits.',
        },
        {
          blockType: 'caseStudyCards',
          layout: 'cards',
          tone: 'grey',
          source: 'track',
          track: ['build', 'build-and-growth'],
          allLink: noLink,
          limit: 2,
          fallbackMode: 'testimonials',
          fallbackEyebrow: 'What clients say',
          fallbackHeading: 'Proof it converts.',
          fallbackAccentPhrase: 'converts.',
          fallbackTestimonials: [t.quote, t.handover],
        },
        {
          blockType: 'accordionFAQ',
          variant: 'mini',
          heading: 'Build questions',
          source: 'category',
          category: 'builds',
          openFirst: true,
          limit: 6,
          allLink: L('All questions, answered straight →', '/faq'),
        },
        { blockType: 'finalCTA', heading: 'Get the build scoped in writing.', accentPhrase: 'scoped', capacity: 'builds-line', buttons: [{ link: bookACall() }] },
      ],
    },

    /* ---------------- p6 Marketing ---------------- */
    {
      slug: 'services/marketing',
      title: 'Marketing',
      description: 'Email, ads, content, SEO, Google Business Profile and CRM run by one team on one dashboard. Engines start at $1K/mo.',
      layout: [
        {
          blockType: 'hero',
          variant: 'service',
          eyebrow: 'Phase 02 of three — operate the engine',
          eyebrowTick: true,
          heading: ph('The marketing engine'),
          body: phSub('Six channels wired into one dashboard and run by one team.'),
          pricingNote: 'Engines start at $1K/mo',
          subNote: '[Placeholder minimum-term note]',
          ctas: [{ link: L('Book a call', '/book-a-call') }],
          breadcrumb: [{ label: 'Services', url: '/services' }, { label: 'Marketing' }, { label: 'Phase 02 — operate the engine' }],
        },
        {
          blockType: 'specLedger',
          variant: 'signal-flow',
          eyebrow: 'How the signal moves',
          eyebrowTick: true,
          items: ['Email', 'Ads', 'Content', 'SEO', 'GBP', 'CRM'].map((title, i) => ({ code: `E-0${i + 1}`, title })),
          hub: {
            kicker: 'Everything reports here',
            heading: 'One dashboard. You see what we see.',
            body: "Every channel writes to the same place, plus a monthly written readout: what we did, what it returned, what's next. [Placeholder copy.]",
            note: 'No deck theatre. No assembling five reports yourself.',
            image: img,
          },
        },
        {
          blockType: 'specLedger',
          variant: 'expandable',
          eyebrow: 'Specification — what each channel is for',
          firstOpen: true,
          items: [
            ['E-01', 'Email', 'The list you already own — built first because it pays for the rest.', 'Welcome, browse-abandon, cart, post-purchase and win-back flows, plus a campaign calendar built around what actually sells.', 'Revenue per send, flow revenue split from campaign revenue, list growth and churn.'],
            ['E-02', 'Paid ads', 'Spend scales only on tracking that tells the truth.', 'Meta and Google, structured around your margins. If attribution is broken we fix it before a dollar moves.', "Spend, blended return, and cost per new customer next to repeat revenue — so a good ROAS can't hide an unprofitable account."],
            ['E-03', 'Social / content', 'We show up with a camera — shot at your business, not stock.', 'Shoot days on site: product, place, people. One shoot feeds organic posts, ad creative, email and product pages.', 'Which assets earned attention and which earned money.'],
            ['E-04', 'SEO', 'Compounding capture on the Phase 01 foundations.', 'Category and product page work first, then the articles that answer what buyers actually ask.', 'Non-brand traffic and the revenue behind it, tracked monthly.'],
            ['E-05', 'GBP', 'For hybrid businesses the profile is a storefront. Run like one.', 'Categories, hours, products and photos kept current, posts on a schedule, and a review routine your staff can keep.', 'Calls, direction requests and profile-driven visits alongside online orders.'],
            ['E-06', 'CRM', 'Repeat purchase decides whether ads are profitable.', 'One customer record wired to the store, email and ads: segments, lifecycle stages, and the lists every other channel targets from.', 'Repeat rate, time between orders and lifetime value by cohort. [Placeholder copy.]'],
          ].map(([code, title, line, what, proof]) => ({ code, title, line, whatLabel: 'What we run', what, proofLabel: "What you'll see on the dashboard", proof })),
          pricingNote: "You can't buy ads alone: the mix is priced on the call.",
        },
        {
          blockType: 'phaseTimeline',
          variant: 'engine-rollout',
          eyebrow: 'Rollout after signing',
          eyebrowTick: true,
          heading: 'Order matters more than effort',
          steps: [
            { number: '01', title: 'Audit', tag: '[Week 1–2]', detail: 'Tracking, list, spend history.' },
            { number: '02', title: 'Foundations', tag: 'Before spend', detail: 'Attribution and CRM wired — before any spend.' },
            { number: '03', title: 'Email flows', tag: '[Month 1]', detail: 'The owned channel goes first.' },
            { number: '04', title: 'Ads live', tag: '[Month 1–2]', detail: 'Budget follows evidence.' },
            { number: '05', title: 'Content + SEO', tag: '[Month 2+]', detail: 'The compounding layers.' },
            { number: '06', title: 'Independence', tag: 'Phase 03', detail: 'Phase 03 — your team takes over.' },
          ],
          closingLine: 'It ends the same way every time: your team running it without us.',
        },
        {
          blockType: 'specLedger',
          variant: 'cards',
          cardLayout: 'feature',
          items: [
            { title: 'Shot at your business', line: 'Content built from what your store actually sells — no lifestyle stock.', image: img },
            { title: 'GBP, run on numbers', line: 'Local demand tracked with the same discipline as the ads account. [Placeholder copy.]', image: img },
          ],
        },
        {
          blockType: 'caseStudyCards',
          layout: 'cards',
          source: 'track',
          track: ['growth', 'build-and-growth'],
          allLink: noLink,
          limit: 2,
          fallbackMode: 'metric-strip',
          fallbackEyebrow: 'The numbers we can show',
          fallbackHeading: 'The engine, in numbers.',
          fallbackAccentPhrase: 'in numbers.',
          fallbackBody: 'Studies publish here as clients sign off.',
          fallbackMetrics: [
            { value: '6', label: 'Channels, one team', sub: 'Email, ads, content, SEO, GBP, CRM', accent: true },
            { value: '1', label: 'Dashboard', sub: 'You see what we see, always' },
            { value: '[N] MO', label: 'Minimum term', sub: '[The honest window to judge an engine]' },
          ],
          pricingNote: 'Engines start at $1K/mo.',
        },
        {
          blockType: 'accordionFAQ',
          variant: 'mini',
          heading: 'Marketing questions',
          source: 'category',
          category: 'marketing',
          openFirst: true,
          limit: 6,
          allLink: L('All questions, answered straight →', '/faq'),
        },
        { blockType: 'finalCTA', heading: 'One engine. One owner of the number.', capacity: 'engines-line', buttons: [{ link: bookACall() }] },
      ],
    },

    /* ---------------- p7 Testimonials ---------------- */
    {
      slug: 'testimonials',
      title: 'Testimonials',
      description: 'Clients on camera and in writing — their numbers, their words. Case studies link through as they publish.',
      layout: [
        {
          blockType: 'hero',
          variant: 'typographic',
          size: 'compact',
          width: 'wide',
          eyebrow: 'Testimonials',
          eyebrowTick: true,
          geometry: true,
          heading: ph("Don't take our word for it. Take theirs."),
          accentPhrase: 'Take theirs.',
          body: phSub('On camera and in writing — clients, their numbers, their words. Case studies link through as they publish.'),
          showAggregateRating: true,
        },
        {
          blockType: 'reviewWall',
          variant: 'feed',
          source: 'manual',
          testimonials: [t.video, t.google, t.quote, t.linkedin, t.handover, t.short],
          pageSize: 24,
          showStudyLinks: true,
          studyLinkLabel: 'Read the full case study',
          labels: { video: 'Video', googleReview: 'Google review', linkedin: 'LinkedIn', play: 'Play the video testimonial from' },
          loadMore: { label: 'Load more', loadingLabel: 'Loading…', errorLabel: 'Could not load more testimonials. Try again.' },
        },
        { blockType: 'finalCTA', heading: 'Your numbers could be next.', capacity: 'builds-line', buttons: [{ link: bookACall() }] },
      ],
    },

    /* ---------------- p8 About ---------------- */
    {
      slug: 'about',
      title: 'About',
      readingProgress: true,
      description: 'Duha Media is one accountable team: we build the store, operate the growth engine, then hand it over. Lombard, IL — serving Chicagoland.',
      layout: [
        {
          blockType: 'hero',
          variant: 'article',
          eyebrow: 'About',
          eyebrowTick: true,
          heading: ph('One team. Store, engine, then yours to run.'),
          accentPhrase: 'then yours to run.',
          body: phSub('Lombard, IL — serving the greater Chicagoland area.'),
          stats: [
            { value: 'Lombard, IL', label: 'Based' },
            { value: 'Build · Operate · Hand over', label: 'Scope' },
            { value: '[7] clients', label: 'Capacity' },
          ],
          media: img,
          mediaFrame: 'full-bleed',
        },
        {
          blockType: 'richContent',
          variant: 'article',
          numberSections: true,
          body: root(
            h('h2', 'Story'),
            p("[Placeholder — the founder's story, in his own words. Nothing here is invented; final copy comes from the founder.]"),
            h('h2', 'How we work'),
            p('Three phases, one team. Phase 1 builds the foundation: the store, the tracking, the SEO groundwork. Phase 2 operates the engine: email, ads, content, SEO, GBP and CRM on one dashboard. [Placeholder copy.]'),
            p('Phase 3 is the point: we build independence. Your team takes the engine over on a date set at the start — documentation, training and the keys. [Placeholder copy.]'),
            h('h2', 'Values'),
            p('[Placeholder — the values and approach, final copy TBD.]'),
          ),
        },
        {
          blockType: 'metricEvent',
          variant: 'facts',
          eyebrow: 'The company, in numbers',
          items: [
            { label: 'Concurrent clients, capped', value: '[N]', accent: true },
            { label: 'Builds in progress today', value: '[N]' },
            { label: 'Client revenue band we serve', value: '$500K–$5M' },
            { label: 'Typical handover', value: '[Month N]' },
          ],
          note: '[Founding year, headcount and engagement counts fill in from client-approved records — no estimates published.]',
        },
        {
          blockType: 'teamIntro',
          variant: 'founder-card',
          heading: 'One founder, no layers.',
          accentPhrase: 'no layers.',
          body: 'The person who scopes the work is the person who does it. [One-sentence bio, founder-authored.]',
          member: ids.founder,
          link: noLink,
        },
        {
          blockType: 'caseStudyCards',
          layout: 'cards',
          source: 'latest',
          limit: 3,
          allLink: noLink,
          fallbackMode: 'logo-strip',
          fallbackEyebrow: 'Stores we have run numbers for',
          fallbackHeading: 'Our clients, for now.',
          fallbackAccentPhrase: 'for now.',
          fallbackBody: 'Case studies publish here as clients sign off.',
        },
        { blockType: 'finalCTA', heading: 'Talk to the person who does the work.', capacity: 'builds-line', buttons: [{ link: bookACall() }] },
      ],
    },

    /* ---------------- p10 Thank You (before p9: Book a Call's booking block points at it) ---------------- */
    {
      slug: 'thank-you',
      title: 'Thank you',
      footerVariant: 'reduced-nav',
      noindex: true,
      description: 'Your call is booked. One thing left before it: the pre-call homework.',
      layout: [
        {
          blockType: 'hero',
          variant: 'typographic',
          size: 'compact',
          eyebrowTick: true,
          geometry: true,
          eyebrow: 'Thank you',
          // F80: the headline confirms, in the '[Got it — see you on the call]' placeholder style.
          heading: ph('Got it — see you on the call.'),
          accentPhrase: 'see you on the call.',
          body: phSub('30 minutes, your numbers, straight answers. We read your homework before we dial.'),
        },
        {
          blockType: 'formEmbed',
          variant: 'reminder',
          form: ids.forms.homework,
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
        { blockType: 'newsletterBand', variant: 'band', heading: 'While you wait: one useful email a month.', line: 'Numbers included. Unsubscribe anytime.' },
      ],
    },

    /* ---------------- p9 Book a Call ---------------- */
    {
      slug: 'book-a-call',
      title: 'Book a call',
      footerVariant: 'reduced-nav',
      description: 'Book a 30-minute growth strategy call: your store, your channels, and whether we are the right fit — with numbers on the table.',
      layout: [
        {
          blockType: 'hero',
          variant: 'typographic',
          size: 'compact',
          eyebrowTick: true,
          geometry: true,
          eyebrow: 'Book a Growth Strategy Call',
          heading: ph('30 minutes. Your numbers, straight answers.'),
          accentPhrase: 'straight answers.',
          callouts: [
            { label: 'What it is:', text: "a working session on your store, your channels, and whether we're the right fit — with numbers on the table." },
            { label: "What it isn't:", text: "a pitch deck, a hard close, or a script. If we're not the fit, we'll say who is." },
          ],
          subNote: phSub('For established businesses netting $500K–$5M a year.'),
        },
        {
          blockType: 'bookingEmbed',
          heading: 'Pick a time that works for you.',
          accentPhrase: 'works for you.',
          body: 'Thirty minutes on your numbers. The calendar opens in a new tab; this page moves on to what to prepare. [Placeholder copy.]',
          buttonLabel: 'Book your call',
          noteUnderButton: 'Opens our booking calendar in a new tab. Times show in your time zone.',
          newTabLabel: 'Trouble with the calendar? Open it in a new tab',
          // Set in seedPages to the Thank You page created just before.
          thankYouPage: null,
          fallbackHeading: 'Booking is offline. Write to us instead.',
          fallbackBody: 'Send a line with two or three times that suit you and we will confirm one. [Placeholder copy.]',
          fallbackLink: L('Contact us', '/contact'),
        },
        {
          blockType: 'formEmbed',
          variant: 'standard',
          form: ids.forms.homework,
          eyebrow: 'Pre-call homework',
          heading: 'A few fields. It makes the call worth both our time.',
          submitLabel: 'Submit homework',
          ground: 'light',
          mobileLayout: 'stacked',
        },
        {
          blockType: 'phaseTimeline',
          variant: 'steps',
          heading: 'What happens next',
          steps: [
            { number: 'Step 01', title: 'Book', detail: 'Pick a time. The invite lands in your inbox.' },
            { number: 'Step 02', title: 'Homework', detail: 'A few fields about your store, so the call starts at strategy, not intake.' },
            { number: 'Step 03', title: 'The call', detail: 'Thirty minutes, your numbers, a straight answer on fit.' },
          ],
        },
        {
          blockType: 'testimonialRow',
          variant: 'row',
          eyebrow: 'What clients say',
          testimonials: [t.quote, t.short],
          studyCard: { show: false },
        },
        { blockType: 'miniCTAStrip', variant: 'inline', text: 'Have a quick question first?', link: L('Contact us', '/contact') },
      ],
    },

    /* ---------------- p11 FAQ ---------------- */
    {
      slug: 'faq',
      title: 'FAQ',
      readingProgress: true,
      description: 'Straight answers on pricing, builds, marketing and how we work. Builds start at $5K; engines start at $1K/mo.',
      layout: [
        {
          blockType: 'hero',
          variant: 'typographic',
          size: 'compact',
          eyebrowTick: true,
          geometry: true,
          eyebrow: 'FAQ',
          heading: ph("We'll give it to you straight."),
          accentPhrase: 'straight.',
        },
        { blockType: 'categoryTabs', ariaLabel: 'FAQ categories' },
        { blockType: 'accordionFAQ', variant: 'group', anchorId: 'pricing', spacing: 'first', heading: 'Pricing & Contracts', source: 'category', category: 'pricing-contracts', openFirst: true, allLink: noLink },
        { blockType: 'accordionFAQ', variant: 'group', anchorId: 'builds', spacing: 'middle', heading: 'Builds', source: 'category', category: 'builds', allLink: noLink },
        { blockType: 'accordionFAQ', variant: 'group', anchorId: 'marketing', spacing: 'middle', heading: 'Marketing', source: 'category', category: 'marketing', allLink: noLink },
        { blockType: 'accordionFAQ', variant: 'group', anchorId: 'process', spacing: 'last', heading: 'Process & Trust', source: 'category', category: 'process-trust', allLink: noLink },
        { blockType: 'finalCTA', heading: 'Still have questions?', capacity: 'none', buttons: [{ link: bookACall() }, { link: L('Contact us', '/contact') }] },
      ],
    },

    /* ---------------- p12 Contact ---------------- */
    {
      slug: 'contact',
      title: 'Contact',
      description: 'Partnerships, press and existing clients: write to us here. Prospects: book a 30-minute call. We reply within 1 business day.',
      layout: [
        {
          blockType: 'hero',
          variant: 'typographic',
          size: 'compact',
          eyebrowTick: true,
          geometry: true,
          eyebrow: 'Contact',
          heading: ph('Prospect? Book a call. Everything else, here.'),
          accentPhrase: 'Book a call.',
          body: phSub('Fit and pricing questions get real answers on a 30-minute call. Partnerships, press, and existing clients: the form below.'),
        },
        {
          blockType: 'formEmbed',
          variant: 'standard',
          form: ids.forms.contact,
          ground: 'grey',
          mobileLayout: 'stepped',
          steps: [
            { fieldNames: ['name'], heading: 'Who’s reaching out?', accentPhrase: 'reaching out?', hint: 'First name is plenty.' },
            { fieldNames: ['email', 'company'], heading: 'What’s your email?', accentPhrase: 'email?', hint: 'So we can reply. We won’t add you to anything.' },
            { fieldNames: ['reason'], heading: 'What’s this about?', accentPhrase: 'about?' },
            { fieldNames: ['message'], heading: 'The short version.', accentPhrase: 'version.', hint: 'Direct works best here too.' },
          ],
          stepped: {
            progressLabel: 'Question {n} of {m}',
            confirmationHeading: 'Got it, {firstName}.',
            startLabel: 'Start',
            nextLabel: 'Next',
            backLabel: 'Back',
            sendAnotherLabel: 'Send another',
            selectAsOptions: true,
          },
        },
        {
          blockType: 'directContact',
          showEmail: true,
          showSocials: true,
          showLocation: true,
          skipFormLine: 'Skip the form',
          rowLabels: { email: 'Email', socials: 'Socials', location: 'Location', replyTime: 'Reply time' },
          // F109: caption EMPTY → built from site-settings town + radius.
          map: { show: true, zoom: 1 },
        },
      ],
    },

    /* ---------------- p15 Campaign LP (zero leakage: one destination, no newsletter band) ---------------- */
    {
      slug: 'lp/sample-campaign',
      title: '[Sample campaign] landing page',
      zeroLeakage: true,
      headerVariant: 'logo-only',
      footerVariant: 'legal-only',
      noindex: true,
      description: '[Placeholder] Campaign landing page — one offer, one call to action.',
      layout: [
        {
          blockType: 'hero',
          variant: 'typographic',
          eyebrow: '[Campaign eyebrow]',
          eyebrowTick: true,
          heading: ph('[Single campaign message, matched to the ad creative]'),
          body: phSub('[One line on who it is for and what the call delivers.]'),
          ctas: [{ link: bookACall() }],
          geometry: true,
        },
        {
          blockType: 'proofStrip',
          variant: 'metrics',
          metrics: [
            { value: '[N]', label: '[Result]', accent: true },
            { value: '[N]', label: '[Count]', sub: '[sub]' },
          ],
          capacityStatement: 'capacity',
          pricingNote: 'Builds start at $5K · Engines start at $1K/mo',
          logos: { show: false },
        },
        { blockType: 'miniCTAStrip', variant: 'button', text: 'Ready when you are.', link: bookACall() },
        {
          blockType: 'offerBlock',
          eyebrow: 'The offer',
          heading: '[Campaign-specific promise, stated as scope.]',
          accentPhrase: 'stated as scope',
          body: root(p('[Placeholder: what the prospect gets, in deliverable terms, with the number first. No countdown timers; capacity is the only true urgency and it carries its reason.]')),
          cta: bookACall(),
          capacity: 'offer-line',
        },
        {
          blockType: 'caseStudyCards',
          layout: 'cards',
          source: 'featured',
          limit: 1,
          allLink: noLink,
          fallbackMode: 'metric-strip',
          fallbackEyebrow: 'The numbers we can show',
          fallbackHeading: 'Numbers anyway.',
          fallbackAccentPhrase: 'anyway.',
          fallbackMetrics: ledgerRows,
          pricingNote: BOTH_PRICES,
        },
        { blockType: 'miniCTAStrip', variant: 'button', link: bookACall() },
        {
          blockType: 'testimonialRow',
          variant: 'row',
          heading: 'What owners said after.',
          testimonials: [t.quote],
          // F137: the study card links away → off on a zero-leakage page.
          studyCard: { show: false },
          cta: bookACall(),
          ctaStyle: 'button',
        },
      ],
    },

    /* ---------------- p16 Newsletter ---------------- */
    {
      slug: 'newsletter',
      title: 'Newsletter',
      description: 'One useful email a month: what worked across client stores, what did not, with the data attached. Unsubscribe anytime.',
      layout: [
        {
          blockType: 'hero',
          variant: 'typographic',
          eyebrow: 'The newsletter',
          eyebrowTick: true,
          heading: ph('One useful email a month. Numbers included.'),
          accentPhrase: 'Numbers included.',
          body: phSub("What we're seeing across client stores — what worked, what didn't, with the data attached."),
          stats: [
            { label: 'Cadence', value: 'Monthly' },
            { label: 'Length', value: '[N] min read' },
            { label: 'Filler', value: 'None' },
          ],
          showForm: true,
          // Empty → the newsletter form chosen in Site settings.
          form: null,
          formStyle: 'card',
          formHeading: 'Join the list',
          formBody: 'Unsubscribe anytime. We never sell the list.',
          submitLabel: 'Join',
        },
        {
          blockType: 'postList',
          track: 'newsletter-issue',
          eyebrow: 'Recent issues',
          eyebrowTick: true,
          featureLatest: true,
          limit: 3,
          archiveLink: L('Full archive →', '/newsletter'),
          labels: {
            latestLabel: 'Latest —',
            newBadge: 'New',
            previouslyLabel: 'Previously',
            countSuffix: 'issues',
            countSuffixSingular: 'issue',
            readLabel: 'Read issue',
            issueWord: 'Issue',
          },
          emptyHeading: 'The first issue is on its way.',
          emptyBody: 'Each issue is one store problem, the number it moved and what we would do differently. Join above and the first one lands in your inbox.',
        },
        {
          blockType: 'testimonialRow',
          variant: 'row',
          testimonials: [t.reader],
          leadMetric: { value: '[N]', label: 'Subscribers', sub: '[Placeholder — real count at launch, marked non-final]' },
        },
      ],
    },

    /* ---------------- p17 Link-in-Bio ---------------- */
    {
      slug: 'links',
      title: 'Links',
      headerVariant: 'none',
      footerVariant: 'legal-only',
      noindex: true,
      description: 'Duha Media — book a call, follow along, and find the work.',
      layout: [
        {
          blockType: 'linkStack',
          identity: { showStudyMetric: true, fallbackLine: '[STRATEGIC PLACEHOLDER] Integrated ecommerce growth partner — Chicago' },
          primary: { link: L('Book a call', '/book-a-call'), capacity: 'slots-line' },
          showSocials: true,
          followLabel: 'Follow',
          siteLabel: 'On the site',
          links: [
            { icon: 'chart-line-up', link: L('The work', '/work') },
            { icon: 'quotes', link: L('Clients', '/testimonials') },
            { icon: 'envelope-simple', link: L('Newsletter', '/newsletter') },
          ],
          latestCaseStudy: true,
          latestCaseStudyLabel: 'Case study',
          currentPush: { show: false },
        },
      ],
    },

    /* ---------------- p19 Review Hub ---------------- */
    {
      slug: 'reviews',
      title: 'Reviews',
      description: 'Reviews from clients, quoted verbatim from where they posted them, so you can verify every one.',
      layout: [
        {
          blockType: 'hero',
          variant: 'typographic',
          size: 'compact',
          eyebrowTick: true,
          geometry: true,
          eyebrow: 'Reviews',
          heading: ph('Reviews you can check.'),
          accentPhrase: 'you can check.',
          body: phSub('Every review lives somewhere you can verify it.'),
          showAggregateRating: true,
        },
        {
          blockType: 'reviewWall',
          variant: 'wall',
          source: 'manual',
          testimonials: [t.google, t.linkedin, t.quote, t.video, t.handover, t.short],
          wallNote: '[Demonstrative wall: reviews import verbatim at launch]',
          inserts: [
            { kind: 'metric', position: 2, metric: { value: '[N]', label: '[What it measures]', sub: '[Quiet sub-line]', accent: true } },
            { kind: 'scarcity', position: 4, statement: 'capacity' },
          ],
        },
        {
          blockType: 'caseStudyCards',
          layout: 'cards',
          source: 'featured',
          limit: 2,
          allLink: noLink,
          fallbackMode: 'note',
          fallbackEyebrow: 'Case studies',
          fallbackHeading: 'The full stories, as they sign off.',
          fallbackAccentPhrase: 'as they sign off.',
          fallbackBody: 'Full case studies publish here as clients sign off on the figures.',
        },
        { blockType: 'finalCTA', heading: 'Add your store to the wall.', capacity: 'builds-line', buttons: [{ link: bookACall() }] },
      ],
    },

    /* ---------------- p20 Legal ×4 (structure only — counsel provides every word) ---------------- */
    {
      slug: 'privacy',
      title: 'Privacy Policy',
      description: '[Placeholder] Privacy policy — counsel-provided content to follow.',
      layout: legalDoc('Privacy Policy', ['Scope', 'Data we collect', "How it's used", 'Sharing & processors', 'Your rights']),
    },
    {
      slug: 'terms',
      title: 'Terms',
      description: '[Placeholder] Terms — counsel-provided content to follow.',
      layout: legalDoc('Terms', ['Scope', 'Using this site', 'Intellectual property', 'Limitations']),
    },
    {
      slug: 'cookies',
      title: 'Cookie Policy',
      description: '[Placeholder] Cookie policy — counsel-provided content to follow.',
      layout: legalDoc('Cookie Policy', ['Scope', 'Cookies we use', 'Your choices']),
    },
    {
      slug: 'gdpr',
      title: 'GDPR',
      description: '[Placeholder] GDPR notice — counsel-provided content to follow.',
      layout: legalDoc('GDPR', ['Scope', 'Lawful basis', 'Your rights', 'Data transfers']),
    },

    /* ---------------- p21 404 ---------------- */
    {
      slug: '404',
      title: 'Page not found',
      noindex: true,
      description: 'This page does not exist. Try the homepage, the work, or book a call.',
      layout: [
        {
          blockType: 'error404',
          code: '404',
          heading: 'This page leaked.',
          body: "Unlike your store's demand, it's not coming back.",
          links: [{ link: bookACall() }, { link: L('Home', '/') }, { link: L('Work', '/work') }],
        },
      ],
    },
  ]
}

export async function seedPages(ctx: SeedCtx, ids: LibraryIds) {
  const { payload, req } = ctx
  const created: Record<string, number> = {}
  for (const spec of pageSpecs(ids)) {
    const { slug, title, description, ...flags } = spec
    // Book a Call's booking block hands the original tab to the Thank You page (created earlier in this list).
    const layout: Layout = spec.layout.map((block) =>
      block.blockType === 'bookingEmbed' ? { ...block, thankYouPage: created['thank-you'] ?? null } : block,
    )
    created[slug] = await ensure(ctx, 'pages', slug, { slug: { equals: slug } }, () =>
      payload.create({
        collection: 'pages',
        data: {
          _status: 'published',
          title,
          slug,
          generateSlug: false,
          headerVariant: flags.headerVariant ?? 'standard',
          footerVariant: flags.footerVariant ?? 'standard',
          zeroLeakage: flags.zeroLeakage ?? false,
          readingProgress: flags.readingProgress ?? false,
          noindex: flags.noindex ?? false,
          meta: { description },
          layout,
        },
        context: SEED_CONTEXT,
        overrideAccess: true,
        req,
      }),
    )
  }
  return created
}
