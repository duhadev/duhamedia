import type { Page } from '@/payload-types'
import { customLink, h, p, root } from '@/showcase/lexical'

import type { LibraryIds } from './library'
import { SEED_CONTEXT, ensure, link, noLink, ph, phSub, type SeedCtx } from './lib'

/**
 * The 21 page types as `pages` documents (p2/p13/p14/p18 are templates and are
 * seeded as draft documents in library.ts). Sections follow SCHEMA.md §9 in
 * the LOCKED order — one block per section, nothing added, removed or merged.
 * Header/footer variants per CLAUDE.md rule 4; noindex on p10, p15, p17, p21
 * (SCHEMA §6.1, F65) and on the four p20 legal pages until counsel content
 * exists (F190). Explicit `metaTitle`s per F191. Pages are published so
 * every route renders; their copy is placeholder (F61: Gate 3 blocks any bracket placeholder on a public page).
 *
 * Links are custom site paths (as typed by an editor), so a page can point at
 * a page created later in the same run.
 */

type Layout = Page['layout']

type PageSpec = {
  slug: string
  title: string
  /** SEO tab `meta.title`, rendered as-is (`title.absolute`, src/lib/metadata.ts): carries its own brand suffix. ≤ 60 chars (F191). */
  metaTitle?: string
  description: string
  headerVariant?: Page['headerVariant']
  footerVariant?: Page['footerVariant']
  zeroLeakage?: boolean
  readingProgress?: boolean
  noindex?: boolean
  layout: Layout
}

const L = link

/** Testimonial ids for a relationship list, dropping any omitted in this run (images off: t3 video). */
const picks = (...ids: (number | null)[]): number[] => ids.filter((id): id is number => id !== null)
const bookACall = () => L('Book a Call', '/book-a-call')

/** Ledger fallback rows (F61 proposal: capacity numbers only; prices only in the small pricing note). */
const ledgerRows = [
  { value: '[7]', label: 'Client cap', sub: 'Capacity is the quality gate, not a countdown.', accent: true },
  { value: '2', label: 'Phases, one team', sub: 'Build your store. Then grow it.' },
]
const BOTH_PRICES = 'Builds start at $7K. Marketing: three plans, settled quarterly. Ad spend is separate.'

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
      title: 'Custom Shopify stores, Chicago',
      description: 'We design and build custom Shopify stores from scratch, then run the marketing that brings in customers. No templates. Chicago. Builds start at $7K.',
      layout: [
        {
          blockType: 'hero',
          variant: 'typographic',
          eyebrow: 'Custom Shopify stores · Chicago',
          eyebrowTick: true,
          heading: ph('Your store, built and grown.'),
          accentPhrase: 'built and grown.',
          badge: { show: true, text: '[$X.XM client revenue tracked]' },
          body: phSub('We design and build your Shopify store from scratch, with no templates. Then we run the marketing that brings in customers.'),
          pricingNote: BOTH_PRICES,
          ctas: [{ link: bookACall() }, { link: L('See the Work', '/work') }],
          verticalMicrocopy: 'Build · Grow',
          geometry: true,
        },
        {
          blockType: 'proofStrip',
          variant: 'scarcity',
          statements: [
            { number: '3', label: 'Projects ongoing' },
            { number: '7', label: 'Max client capacity' },
          ],
          pricingNote: 'Builds start at $7K',
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
        { blockType: 'miniCTAStrip', variant: 'band', text: 'No templates. No middlemen. One person accountable.', link: bookACall() },
        {
          blockType: 'twoTrackPanels',
          variant: 'equal',
          heading: 'What we actually do',
          accentPhrase: 'actually',
          panels: [
            {
              title: 'First, we build it.',
              body: 'A Shopify store built from scratch, around your brand and your products. No templates.',
              pricingNote: 'Builds start at $7K.',
              link: L('How the build works →', '/services/shopify-theme-development'),
            },
            {
              title: 'Then we grow it.',
              accentTitle: true,
              body: 'Marketing, run by the same team that built your store. Every plan includes the full toolkit.',
              services: [
                { label: 'Organic social' },
                { label: 'Influencer collabs' },
                { label: 'SEO' },
                { label: 'GEO' },
                { label: 'Google Business Profile' },
              ],
              pricingNote: 'Marketing: three plans, settled quarterly. Ad spend is separate.',
              link: L('What we run →', '/services/marketing'),
            },
          ],
        },
        {
          blockType: 'phaseTimeline',
          variant: 'accordion',
          eyebrow: 'How it runs',
          heading: 'Your project, start to finish.',
          accentPhrase: 'start to finish.',
          intro: 'Eight steps in two phases, so you always know what comes next. Marketing is optional.',
          phases: [
            { number: 'Phase 1', title: 'Build your store' },
            { number: 'Phase 2', title: 'Grow (optional)' },
          ],
          steps: [
            { number: '01', title: 'Discovery', phase: '1', detail: 'Your business, your customers and your goals.' },
            { number: '02', title: 'Research', phase: '1', detail: 'Your competitors and who is winning in your market.' },
            { number: '03', title: 'Brand', phase: '1', detail: 'One meeting to set colors, typography and look.' },
            { number: '04', title: 'Design', phase: '1', detail: "Every screen, revised with you until it's right." },
            { number: '05', title: 'Build', phase: '1', detail: 'The approved design, coded into a custom theme.' },
            { number: '06', title: 'Launch', phase: '1', detail: "Shops connected, store live. It's yours." },
            { number: '07', title: 'Marketing plan', phase: '2', detail: 'Ads first, then whatever fits your store.' },
            { number: '08', title: 'Run and refine', phase: '2', detail: 'We run the marketing and keep improving the store.' },
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
      metaTitle: 'Ecommerce Case Studies and Results — Duha Media',
      title: 'Work',
      description: "Custom Shopify stores we've designed and built from scratch for Chicago businesses. Case studies are published once each client approves them.",
      layout: [
        {
          blockType: 'hero',
          variant: 'typographic',
          eyebrow: 'Work',
          eyebrowTick: true,
          heading: ph('The work, in numbers'),
          accentPhrase: 'in numbers',
          body: phSub('One team built the store, then grew it.'),
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
          testimonials: picks(t.video, t.linkedin),
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
      metaTitle: 'Shopify Development and Ecommerce Marketing — Duha Media',
      title: 'Services',
      description: 'Two jobs, one team. We build your custom Shopify store from scratch, then grow it with ads, social content and search. Based in Chicago.',
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
            { number: '01', label: 'Build your store' },
            { number: '02', label: 'Grow your store' },
            { number: '03', label: 'You own it' },
          ],
        },
        {
          blockType: 'twoTrackPanels',
          variant: 'doors',
          heading: 'Two doors.',
          panels: [
            {
              title: 'Shopify Theme Development',
              body: "For a business with no online store, or one that doesn't show what you make. A custom Shopify theme built from scratch, connected to TikTok, Instagram and Facebook Shop. Yours from launch.",
              pricingNote: 'Builds start at $7K.',
              link: L('See the build →', '/services/shopify-theme-development'),
            },
            {
              title: 'Marketing',
              accentTitle: true,
              body: "For a store that isn't reaching new customers. Paid ads first, then social content, collaborations, search and a newsletter, run by one team.",
              pricingNote: 'Three plans, settled quarterly.',
              link: L('See the marketing →', '/services/marketing'),
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
            { label: 'Sold to you as', claim: '"We\'ll build you a beautiful store."', title: "A store nobody visits doesn't sell.", link: noLink },
            { label: 'Sold to you as', claim: '"Just hire a specialist for each channel."', title: 'You became the manager you were paying to avoid.', link: noLink },
          ],
          conclusion: 'One team through both phases, so the person who built your store is the one marketing it.',
        },
        { blockType: 'newsletterBand', variant: 'band' },
        {
          blockType: 'phaseTimeline',
          variant: 'arc',
          heading: 'Where both doors end',
          phases: [
            {
              number: 'Phase 01',
              title: 'Build your store',
              body: 'A Shopify theme designed and coded from scratch around your brand and products, with Shopify Analytics and Microsoft Clarity set up so you can see what visitors do.',
              link: L('See Phase 01 →', '/services/shopify-theme-development'),
            },
            {
              number: 'Phase 02',
              title: 'Grow your store',
              body: 'Paid ads, social content filmed in person each month, collaborations, Google Business Profile, SEO and a newsletter, run by the people who built your store.',
              link: L('See Phase 02 →', '/services/marketing'),
            },
            {
              number: 'Phase 03',
              title: 'You own it.',
              body: 'The store, the theme code and the domain are yours from launch. Every ad, post, landing page and account is in your name too. Nothing is held back, and nothing is rented to you.',
            },
          ],
        },
        {
          blockType: 'phaseTimeline',
          variant: 'steps',
          heading: 'Either door starts the same way.',
          steps: [
            { number: 'Step 01', title: 'A call, 30 minutes', tag: '[Day 0]', detail: "Your numbers and what's leaking. We say which door fits — including “neither, yet.”", outcomes: [{ text: 'An honest read on which phase you need' }] },
            { number: 'Step 02', title: 'A dated plan', tag: '[Within N days]', detail: "Scope and price in writing, with the steps and what you'll approve along the way.", outcomes: [{ text: 'A written scope and price, before you commit' }] },
            { number: 'Step 03', title: 'Work starts', tag: '[Week 1]', detail: 'The same person through both phases. No account managers, no middlemen.', outcomes: [{ text: 'A direct line to the person doing the work' }] },
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
      metaTitle: 'Shopify Theme Development, Chicago — Duha Media',
      title: 'Shopify Theme Development',
      description: 'A Shopify store designed and coded from scratch, around your brand and products. No templates. You own the store, code and domain. Builds start at $7K.',
      layout: [
        {
          blockType: 'hero',
          variant: 'service',
          eyebrow: 'Phase 01 — build your store',
          eyebrowTick: true,
          heading: ph('The store build'),
          body: phSub('Six steps from first call to launch. Designed with you screen by screen, coded from scratch, and yours from day one.'),
          pricingNote: 'Builds start at $7K',
          subNote: '[Placeholder — typical revision length]',
          ctas: [{ link: L('Book a call', '/book-a-call') }],
          breadcrumb: [{ label: 'Services', url: '/services' }, { label: 'Shopify theme development' }, { label: 'Phase 01 — build your store' }],
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
              body: 'Keep your products, customers and domain. We redesign the store around them and rebuild the theme from scratch.',
              pricingNote: 'Builds start at $7K.',
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
            ['D-01', 'Custom theme', 'Templates around buyer questions, speed as a feature.', 'Every template designed and coded from scratch around your products and the questions your buyers ask.', 'Every page works on phone and desktop at launch.'],
            ['D-02', 'Brand positioning', "What the store says and who it's for. Before design.", 'Category read, buyer read, and the sentence the homepage has to earn — signed off before a screen is designed.', 'A stranger describes your store the way your team does.'],
            ['D-03', 'UX', "Navigation and checkout paths that don't leak demand.", 'Menu structure, filtering, product page order — the handful of decisions that turn a visit into an order.', 'Drop-off by step, before and after. Leaks get named.'],
            ['D-04', 'Analytics + tracking', 'In before launch, so the numbers tell the truth.', 'Analytics, ecommerce events and ad attribution wired and tested on the live theme.', 'Store revenue reconciles with the ad accounts.'],
            ['D-05', 'SEO foundations', 'Structure, speed and metadata at build time.', 'Crawlable structure, clean templates, titles and schema, plus a speed pass.', 'Indexation and Core Web Vitals pass at launch.'],
            ['D-06', 'Launch support', "We're there when it goes live.", 'A launch checklist, a monitored first stretch, and a walkthrough of the theme your team now owns.', 'Nothing silently breaks in week one. [Placeholder copy.]'],
          ].map(([code, title, line, what, proof]) => ({ code, title, line, whatLabel: 'What we build', what, proofLabel: "How you'll know it worked", proof })),
          pricingNote: 'Builds start at $7K. Exact scope is priced on the call.',
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
          fallbackHeading: 'Proof it works.',
          fallbackAccentPhrase: 'works.',
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
      metaTitle: 'Shopify Marketing in Chicago | Duha Media',
      title: 'Marketing',
      description: 'Paid ads, social content filmed in person, collaborations, SEO and a newsletter, run by the team that built your store. Three plans, settled quarterly.',
      layout: [
        {
          blockType: 'hero',
          variant: 'service',
          eyebrow: 'Phase 02 — grow your store',
          eyebrowTick: true,
          heading: ph('Then we grow it.'),
          body: phSub('Paid ads, social content, collaborations, search and a newsletter, run by the team that built your store. Every plan includes all of it.'),
          pricingNote: 'Three plans, settled quarterly. Ad spend is separate.',
          subNote: 'Two-quarter terms that renew. Cancel with notice before the next term.',
          ctas: [{ link: L('Book a call', '/book-a-call') }],
          breadcrumb: [{ label: 'Services', url: '/services' }, { label: 'Marketing' }, { label: 'Phase 02 — grow your store' }],
        },
        {
          blockType: 'specLedger',
          variant: 'signal-flow',
          eyebrow: 'How the signal moves',
          eyebrowTick: true,
          items: ['Paid ads', 'Social content', 'Collaborations', 'Google Business Profile', 'SEO and GEO', 'Newsletter'].map((title, i) => ({ code: `E-0${i + 1}`, title })),
          hub: {
            kicker: 'Every quarter',
            heading: 'You see what we see.',
            body: "Every quarter you get the numbers your plan is settled on, what we ran, what it returned and what we'll change next. The ad and shop accounts are in your name, so you can check any of it yourself.",
            note: 'One readout, from the person who ran the work.',
            image: img,
          },
        },
        {
          blockType: 'specLedger',
          variant: 'expandable',
          eyebrow: 'Specification — what each channel is for',
          firstOpen: true,
          items: [
            ['E-01', 'Newsletter', 'Your customers, in their inbox.', 'Regular emails to the customers who already know you, sent through Shopify Email.', '[STRATEGIC PLACEHOLDER — final copy TBD]'],
            ['E-02', 'Paid ads', 'Spend scales only on tracking that tells the truth.', 'Meta ads on Facebook and Instagram, with a landing page built for each campaign, so the ad and the store say the same thing. This is where we start.', 'What you spent, what it brought in, and what each new customer cost.'],
            ['E-03', 'Social content and collaborations', 'We show up with a camera — shot at your business, not stock.', 'We film with you in person each month, then post to Facebook, Instagram, Reels and TikTok. We also scout and manage influencer collaborations; nothing is sent without your approval.', '[STRATEGIC PLACEHOLDER — final copy TBD]'],
            ['E-04', 'SEO and GEO', 'Found in search, and recommended by AI tools.', 'Showing up when people search for what you sell, and getting recommended when they ask AI tools like ChatGPT.', '[STRATEGIC PLACEHOLDER — final copy TBD]'],
            ['E-05', 'Google Business Profile', 'For hybrid businesses the profile is a storefront. Run like one.', 'Your listing on Google Search and Maps, kept current, with review growth and prompt replies.', '[STRATEGIC PLACEHOLDER — final copy TBD]'],
          ].map(([code, title, line, what, proof]) => ({ code, title, line, whatLabel: 'What we run', what, proofLabel: "What you'll see", proof })),
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
            { number: '02', title: 'Foundations', tag: 'Before spend', detail: 'Tracking set up before any spend.' },
            { number: '03', title: 'Film', tag: '[Month 1]', detail: 'Three to four hours in person. Scripts and articles are written in the same session.' },
            { number: '04', title: 'Ads live', tag: '[Month 1–2]', detail: 'Budget follows evidence.' },
            { number: '05', title: 'Search and newsletter', tag: '[Month 2+]', detail: 'SEO, GEO and the newsletter, building over time.' },
            { number: '06', title: 'Run and refine', tag: 'Ongoing', detail: 'We run the marketing and keep improving the store.' },
          ],
          closingLine: 'Everything we run stays in your name.',
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
          fallbackHeading: 'Marketing, in numbers.',
          fallbackAccentPhrase: 'in numbers.',
          fallbackBody: 'Studies publish here as clients sign off.',
          fallbackMetrics: [
            { value: '6', label: 'Channels, one team', sub: 'Ads, social, collaborations, GBP, search, newsletter', accent: true },
            { value: '1', label: 'Person accountable', sub: 'The founder runs the work himself' },
            { value: '6 MO', label: 'Minimum term', sub: 'Two quarters: long enough to film, run ads and see what works.' },
          ],
          pricingNote: 'Three plans, settled quarterly. Ad spend is separate.',
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
        { blockType: 'finalCTA', heading: 'One team. One person accountable.', capacity: 'engines-line', buttons: [{ link: bookACall() }] },
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
          testimonials: picks(t.video, t.google, t.quote, t.linkedin, t.handover, t.short),
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
      metaTitle: 'About Duha Media: Chicago Shopify Developer',
      title: 'About',
      readingProgress: true,
      description: 'One founder, no layers. Abdurrahman Choudhary designs, builds and markets custom Shopify stores for owner-operated businesses in Chicago.',
      layout: [
        {
          blockType: 'hero',
          variant: 'article',
          eyebrow: 'About',
          eyebrowTick: true,
          heading: ph('One founder. Your store, built and grown.'),
          accentPhrase: 'built and grown.',
          body: phSub('Based in Chicago. We work with businesses in Chicago and across the United States.'),
          stats: [
            { value: 'Chicago, Illinois', label: 'Based' },
            { value: 'Build · Grow', label: 'Scope' },
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
            p('Two phases, one team. First we build your store: discovery, research, brand, design, build and launch, with you approving the design screen by screen. The store, the theme code and the domain are yours from launch.'),
            p('Then, if you want it, we grow it. Paid ads come first, then social content filmed with you each month, collaborations, search and a newsletter. We shift effort to whatever the numbers show is working. Marketing is optional, and everything we run stays in your name.'),
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
            { label: 'Hands-on hours per build', value: '~55' },
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
      metaTitle: 'Book a Growth Strategy Call — Duha Media',
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
      metaTitle: 'FAQ: Pricing, Builds and Marketing — Duha Media',
      title: 'FAQ',
      readingProgress: true,
      description: 'Straight answers on cost, ownership, contracts and timelines for a custom Shopify store and marketing from Duha Media in Chicago.',
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
      metaTitle: 'Contact Duha Media — Partnerships, Press, Clients',
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
          pricingNote: 'Builds start at $7K · Marketing: three plans, settled quarterly',
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
      metaTitle: 'Ecommerce Growth Newsletter — Duha Media',
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
          identity: { showStudyMetric: true, fallbackLine: '[STRATEGIC PLACEHOLDER] Custom Shopify stores · Chicago' },
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
      metaTitle: 'Client Reviews — Duha Media',
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
          testimonials: picks(t.google, t.linkedin, t.quote, t.video, t.handover, t.short),
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
      noindex: true, // F190: until counsel content exists (Gate 3 step clears it)
      title: 'Privacy Policy',
      description: '[Placeholder] Privacy policy — counsel-provided content to follow.',
      layout: legalDoc('Privacy Policy', ['Scope', 'Data we collect', "How it's used", 'Sharing & processors', 'Your rights']),
    },
    {
      slug: 'terms',
      noindex: true, // F190: until counsel content exists (Gate 3 step clears it)
      title: 'Terms',
      description: '[Placeholder] Terms — counsel-provided content to follow.',
      layout: legalDoc('Terms', ['Scope', 'Using this site', 'Intellectual property', 'Limitations']),
    },
    {
      slug: 'cookies',
      noindex: true, // F190: until counsel content exists (Gate 3 step clears it)
      title: 'Cookie Policy',
      description: '[Placeholder] Cookie policy — counsel-provided content to follow.',
      layout: legalDoc('Cookie Policy', ['Scope', 'Cookies we use', 'Your choices']),
    },
    {
      slug: 'gdpr',
      noindex: true, // F190: until counsel content exists (Gate 3 step clears it)
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
    const { slug, title, metaTitle, description, ...flags } = spec
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
          meta: { description, ...(metaTitle ? { title: metaTitle } : {}) },
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
