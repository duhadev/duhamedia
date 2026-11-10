import type {
  AccordionFAQBlock,
  CaseStudyCardsBlock,
  CategoryTabsBlock,
  FinalCTABlock,
  HeroBlock,
  PhaseTimelineBlock,
  PricingPlansBlock,
  RichContentBlock,
  ServiceSheetBlock,
  SpecLedgerBlock,
  TwoTrackPanelsBlock,
} from '@/payload-types'

import { BUILD_TOOLS } from './servicesCopy'

/**
 * Service pages redesign (owner-approved 2026-11-09, "Go ahead and build.").
 * Copy for /services/shopify-theme-development (BUILD) and /services/marketing
 * (MARKETING). Used ONCE by the data migration and by /_showcase; after the
 * migration the words live in the CMS and are edited there, never here.
 *
 * Source: design-reference/service-pages-2026-11-09/ (Build.dc.html,
 * Marketing.dc.html), verbatim, with IMPLEMENTATION.md S2 and README P1–P7
 * applied: CONFIRM spans dropped; the "Mobile-first" deliverable row dropped
 * (P1); FAQ answers are NOT copy (P6), only the question texts, in artboard
 * order, which pick the stored `faqs` docs; the marketing fine print keeps the
 * LIVE definition (S2); the marketing Terms use the artboard wording (S2); the
 * final CTAs keep the live FinalCTA (P7), only the heading and lines are here.
 *
 * Each page object lists its sections in the IMPLEMENTATION.md mapping-table
 * order (Build rows 1–12, Marketing rows 1–13). Every section `satisfies` its
 * generated block type (a partial row: the migration merges it into the live
 * row). Two keys are not block fields: a band body is plain paragraphs
 * (`bodyParagraphs`, turned into Lexical by the migration and the showcase),
 * and an FAQ lists the stored question texts (`questions`, resolved to ids).
 */

export { BUILD_TOOLS }

/** A partial block row: the migration (and the showcase) fill the rest. */
type Row<T extends { blockType: string }> = Partial<T> & Pick<T, 'blockType'>
type BandCopy = Row<Omit<RichContentBlock, 'body'>> & { bodyParagraphs: string[] }
type FaqCopy = Row<AccordionFAQBlock> & { questions: string[] }

const custom = (url: string, label: string) => ({ type: 'custom' as const, newTab: false, url, label })
const noLink = { type: 'custom' as const, newTab: false }

const BUILD_URL = '/services/shopify-theme-development'
const MARKETING_URL = '/services/marketing'

/* ======================================================================
 * BUILD — /services/shopify-theme-development
 * ====================================================================== */

export const BUILD = {
  /* 1 Hero + at-a-glance card (hero, typographic) */
  hero: {
    blockType: 'hero',
    variant: 'typographic',
    breadcrumb: [
      { label: 'Services', url: '/services' },
      { label: 'Shopify theme development', url: null },
    ],
    eyebrow: 'Service 01 · Build your store',
    heading: 'Your custom Shopify store.',
    accentPhrase: 'Shopify store.',
    accentLine: false,
    accentWine: true,
    body: 'Six steps from first call to launch. Designed with you screen by screen, coded from scratch, and yours from day one.',
    ctas: [{ link: custom('/book-a-call', 'Book a Call') }, { link: custom(`${BUILD_URL}#steps`, 'See the six steps') }],
    glance: {
      title: 'The build at a glance',
      rows: [
        { label: 'Builds start at', value: '$7K', accent: false },
        { label: 'First call to launch', value: '~5wks', accent: false },
        { label: 'Hands-on hours', value: '~55', accent: false },
        { label: 'Of those on design', value: '~30', accent: true },
      ],
      footer: 'No templates. Yours from launch day.',
    },
  } satisfies Row<HeroBlock>,

  /* 2 Jump-to index (categoryTabs, jump) */
  jump: {
    blockType: 'categoryTabs',
    variant: 'jump',
    label: 'Jump to',
    ariaLabel: 'On this page',
    links: [
      { label: "Who it's for", anchorId: 'fit' },
      { label: 'Revision or scratch', anchorId: 'start' },
      { label: 'The six steps', anchorId: 'steps' },
      { label: 'Where the hours go', anchorId: 'hours' },
      { label: 'What you get', anchorId: 'get' },
      { label: 'Price', anchorId: 'price' },
      { label: 'Questions', anchorId: 'faq' },
    ],
  } satisfies Row<CategoryTabsBlock>,

  /* 3 Who it's for + fit card (serviceSheet, fit) */
  fit: {
    blockType: 'serviceSheet',
    presentation: 'fit',
    anchorId: 'fit',
    eyebrow: "Who it's for",
    eyebrowTick: true,
    heading: 'Built for a proven product.',
    accentPhrase: 'proven product.',
    why: {
      body: [
        "Plenty of local businesses have the hard part figured out. The product is proven, the regulars keep coming back, and word of mouth does its work. Then a new customer lands on the online store, and it doesn't measure up.",
        'That gap is what a build closes. We build the Shopify store your product has earned, around your logo, your colors and your customers.',
        '**Your product is proven. Your online store should be too.**',
      ].join('\n\n'),
    },
    included: {
      groups: [
        {
          title: 'Right for you if',
          marker: 'wine',
          items: [
            { text: 'You run an owner-operated business.' },
            { text: 'Your product is proven. The regulars keep coming back.' },
            { text: "Your online store doesn't show it yet." },
            { text: 'You want to own the store, the code and the domain.' },
          ],
        },
        {
          title: 'Not for you if',
          marker: 'outlined',
          items: [
            { text: "You're still testing whether the product sells." },
            { text: 'You want a template store for less than $7K.' },
            { text: 'You need the store live in days, not about 5 weeks.' },
          ],
        },
      ],
    },
    box: {
      note: "Not sure? On a free 45-minute call we'll tell you honestly whether we're the right fit.",
      link: noLink,
    },
  } satisfies Row<ServiceSheetBlock>,

  /* 4 Revision or scratch (twoTrackPanels, compare) */
  compare: {
    blockType: 'twoTrackPanels',
    variant: 'compare',
    anchorId: 'start',
    eyebrow: 'Where people usually start',
    eyebrowTick: true,
    heading: 'Most start with a revision.',
    accentPhrase: 'a revision.',
    intro:
      "Already have a store? You don't have to start over. Keep what's working, and we redesign and rebuild what isn't. If it needs more than that, we build a new theme from scratch. We'll tell you which on the call.",
    rowsLabel: 'Compare',
    panels: [
      { title: 'Revision', label: 'The default' },
      { title: 'Scratch build', label: 'When the math says so' },
    ],
    rows: [
      { label: 'You start from', first: 'Your current store', second: 'A blank page' },
      {
        label: 'What happens',
        first: "We keep what's working, and redesign and rebuild the parts that aren't.",
        second: 'All six steps, from discovery to launch.',
      },
      { label: 'Template underneath', first: 'None', second: 'None' },
      { label: 'Price', first: 'Priced on the call', second: 'From **$7K**' },
    ],
    conclusion: 'Either way, your price is set in writing within 72 hours of the call, before anything is signed.',
  } satisfies Row<TwoTrackPanelsBlock>,

  /* 5 The six steps (phaseTimeline, detail) */
  steps: {
    blockType: 'phaseTimeline',
    variant: 'detail',
    anchorId: 'steps',
    eyebrow: 'How a build runs',
    eyebrowTick: true,
    heading: 'Six steps. Two sign-offs.',
    accentPhrase: 'Two sign-offs.',
    intro:
      'Every step below says what we do, what we need from you, and what you have at the end of it. Nothing moves to the next stage without your approval.',
    youLabel: 'You',
    youGetLabel: 'You get',
    steps: [
      /* phase '0' = the hairline strip above the rows */
      { phase: '0', tag: 'Day 0', title: 'A free 45-minute call.' },
      { phase: '0', tag: 'Within 72 hours', title: 'A dated plan and your price, in writing.' },
      { phase: '0', tag: 'After you sign off', title: 'Work starts at step 1.' },
      {
        phase: '1',
        number: '01',
        title: 'Discovery',
        detail:
          'We talk through your business, your customers and your goals: what sells, who buys it, and where the current store lets them down.',
        isSignOff: true,
        tag: 'Your sign-off: payment to start.',
        you: 'Join the call and sign off on the plan.',
        youGet: 'A clear brief everyone agrees on.',
        accent: false,
      },
      {
        phase: '1',
        number: '02',
        title: 'Research',
        detail:
          'We study your competitors, your positioning and who is winning in your market, so the design starts from what already works in your field.',
        isSignOff: false,
        tag: null,
        you: 'Nothing required. Name stores you admire, if you have them.',
        youGet: 'The findings, before design starts.',
        accent: false,
      },
      {
        phase: '1',
        number: '03',
        title: 'Brand',
        detail: 'One meeting to set your colors, typography and look. Built around the logo and colors you already have.',
        isSignOff: false,
        tag: null,
        you: 'One meeting.',
        youGet: 'Colors, type and look, agreed.',
        accent: false,
      },
      {
        phase: '1',
        number: '04',
        title: 'Design',
        detail:
          "We study the best stores in your field, design every screen of yours, and revise it with you until it's right. This is where most of the hours go.",
        isSignOff: false,
        tag: null,
        you: 'Review the screens and ask for changes.',
        youGet: 'Every screen designed and approved.',
        accent: true,
      },
      {
        phase: '1',
        number: '05',
        title: 'Build',
        detail:
          'We code the approved design into a custom Shopify theme, written from scratch with no template underneath. Our own AI-assisted build pipeline makes the coding faster. The design is still planned with you.',
        isSignOff: true,
        tag: 'Your sign-off: the theme build.',
        you: 'Approve the theme build.',
        youGet: 'A working store, built to the approved design.',
        accent: false,
      },
      {
        phase: '1',
        number: '06',
        title: 'Launch',
        detail: "We connect your store to TikTok Shop, Instagram Shop and Facebook Shop, and push it live. It's yours.",
        isSignOff: false,
        tag: null,
        you: 'Nothing. Watch it go live.',
        youGet: 'The store, the theme code and the domain, in your name.',
        accent: false,
      },
    ],
    closingLine: "The week-by-week schedule is set with you on the call, and it's in the dated plan.",
  } satisfies Row<PhaseTimelineBlock>,

  /* 6 Where the hours go (twoTrackPanels, bar) */
  hours: {
    blockType: 'twoTrackPanels',
    variant: 'bar',
    anchorId: 'hours',
    eyebrow: 'Where the hours go',
    eyebrowTick: true,
    heading: 'About 55 hours. 30 on design.',
    accentPhrase: '30 on design.',
    intro: "More than half the hours go into design, because that's what your customers see.",
    panels: [
      {
        title: 'hrs on design',
        accentTitle: true,
        share: 30,
        stats: [{ value: '~30' }],
        body: "Studying the best stores in your field. Every screen, revised with you until it's right.",
      },
      {
        title: 'hrs on the rest',
        accentTitle: false,
        share: 25,
        stats: [{ value: '~25' }],
        body: 'Discovery, research, brand, build and launch.',
      },
    ],
  } satisfies Row<TwoTrackPanelsBlock>,

  /* 7a What you get + You own it (serviceSheet, deliverables). P1: "Mobile-first" row dropped. */
  deliverables: {
    blockType: 'serviceSheet',
    presentation: 'deliverables',
    anchorId: 'get',
    eyebrow: 'What you get',
    eyebrowTick: true,
    heading: 'Yours at launch. All of it.',
    accentPhrase: 'All of it.',
    differentiators: {
      rows: [
        { label: 'Custom Shopify theme', line: 'Written from scratch for your store. No template underneath.' },
        { label: 'Every screen designed', line: "Planned with you screen by screen, and revised until it's right." },
        { label: 'Your brand, set', line: 'Colors, typography and look, agreed in one meeting.' },
        { label: 'Shop sync', line: 'Connected to TikTok Shop, Instagram Shop and Facebook Shop at launch.' },
      ],
    },
    box: {
      label: 'You own it',
      body: 'From launch day, the store, the theme code and the domain belong to you.',
      note: "Not part of the build: marketing. That's {link}, separate and optional.",
      link: custom(MARKETING_URL, 'Grow your store'),
    },
  } satisfies Row<ServiceSheetBlock>,

  /* 7b Preferred tools · Build (specLedger tools tiles; re-used, not duplicated) */
  tools: BUILD_TOOLS,

  /* 8 The work, up close (caseStudyCards; the study's own words live in the case study) */
  proof: {
    blockType: 'caseStudyCards',
    eyebrow: 'The work, up close',
    eyebrowTick: true,
    tone: 'grey',
    centerFacts: true,
    spacing: 'tight',
  } satisfies Row<CaseStudyCardsBlock>,

  /* 9 Price (pricingPlans, build) */
  price: {
    blockType: 'pricingPlans',
    layout: 'build',
    anchorId: 'price',
    eyebrow: 'Price',
    eyebrowTick: true,
    heading: 'One price, in writing, before you sign.',
    accentPhrase: 'before you sign.',
    intro: 'Your price is set in writing within 72 hours of the call, before anything is signed. You pay to start, at step 1.',
    build: {
      label: 'Build your store',
      lead: 'Builds start at',
      price: '$7K',
      rows: [
        { label: 'Scratch build', value: 'From $7K', link: noLink },
        { label: 'Revision', value: 'Priced on the call', link: noLink },
        { label: 'Marketing, after launch', value: 'Optional,', link: custom(MARKETING_URL, 'separate plans') },
      ],
      nextLink: custom('/book-a-call', 'Book a call about a build'),
    },
  } satisfies Row<PricingPlansBlock>,

  /* 10 Then we grow it (richContent band, split) */
  band: {
    blockType: 'richContent',
    variant: 'band',
    bandLayout: 'split',
    eyebrow: 'After launch · Optional',
    heading: 'Then we grow it.',
    accentPhrase: 'grow it.',
    bodyParagraphs: [
      'Ads, social content, creators, search and email, run by the team that built your store. Three plans, settled quarterly. Ad spend is separate.',
    ],
    link: custom(MARKETING_URL, 'How the marketing works →'),
  } satisfies BandCopy,

  /* 11 Build questions (accordionFAQ mini, split). Question texts only (P6). */
  faq: {
    blockType: 'accordionFAQ',
    variant: 'mini',
    layout: 'split',
    anchorId: 'faq',
    eyebrow: 'Build questions',
    eyebrowTick: true,
    heading: 'Straight answers.',
    accentPhrase: 'answers.',
    source: 'selected',
    limit: 7,
    openFirst: true,
    questions: [
      'Do you use templates?',
      'How long does a build take?',
      'I already have a store. Do I have to start over?',
      'Do you use AI?',
      'Can I hire you for just the build?',
      'How do sign-offs work?',
      'Who does the work?',
    ],
    allLink: custom('/faq', 'All questions →'),
  } satisfies FaqCopy,

  /* 12 Final CTA (live FinalCTA, P7; accent cleared, S5). Capacity line AND its quiet line both come
   * from the scarcity global (`builds-line` statistic + reason), so `body` is cleared: setting it
   * would render the reason twice. */
  finalCta: {
    blockType: 'finalCTA',
    heading: 'Get the build scoped in writing.',
    accentPhrase: null,
    capacity: 'builds-line',
    body: null,
  } satisfies Row<FinalCTABlock>,
}

/* ======================================================================
 * MARKETING — /services/marketing
 * ====================================================================== */

export const MARKETING = {
  /* 1 Hero + at-a-glance card (hero, typographic) */
  hero: {
    blockType: 'hero',
    variant: 'typographic',
    breadcrumb: [
      { label: 'Services', url: '/services' },
      { label: 'Marketing', url: null },
    ],
    eyebrow: 'Service 02 · Grow your store',
    heading: 'Then we grow it.',
    accentPhrase: 'grow it.',
    accentLine: false,
    accentWine: true,
    body: 'Paid ads, social content, collaborations, search and a newsletter, run by the team that built your store. Every plan includes all of it.',
    ctas: [{ link: custom('/book-a-call', 'Book a Call') }, { link: custom(`${MARKETING_URL}#plans`, 'See the plans') }],
    glance: {
      title: 'Marketing at a glance',
      rows: [
        { label: 'Planning call, monthly', value: '1hr', accent: false },
        { label: 'Filming with you, in person', value: '3–4hrs', accent: true },
        { label: 'Plans, settled quarterly', value: '3', accent: false },
        { label: 'Minimum term', value: '2qtrs', accent: false },
      ],
      footer: 'Ad spend is separate. Accounts in your name.',
    },
  } satisfies Row<HeroBlock>,

  /* 2 Jump-to index (categoryTabs, jump) */
  jump: {
    blockType: 'categoryTabs',
    variant: 'jump',
    label: 'Jump to',
    ariaLabel: 'On this page',
    links: [
      { label: "Who it's for", anchorId: 'fit' },
      { label: 'How a month runs', anchorId: 'month' },
      { label: 'Where we start', anchorId: 'start' },
      { label: 'The toolkit', anchorId: 'toolkit' },
      { label: 'Who does what', anchorId: 'who' },
      { label: 'Plans and terms', anchorId: 'plans' },
      { label: 'Questions', anchorId: 'faq' },
    ],
  } satisfies Row<CategoryTabsBlock>,

  /* 3 Who it's for + card (serviceSheet, fit). P4: no ad-budget tag. */
  fit: {
    blockType: 'serviceSheet',
    presentation: 'fit',
    anchorId: 'fit',
    eyebrow: "Who it's for",
    eyebrowTick: true,
    heading: "A new store doesn't sell itself.",
    accentPhrase: "doesn't sell itself.",
    why: {
      body: [
        "Someone has to bring people to it, and keep bringing them. You built the product. Our job is to put it in front of the people who haven't found you yet.",
        'Every plan comes with the full toolkit ready to go: ads, social content, creators, search and email. We use each tool when your store needs it, and we use it well.',
        "**You made something great. Now let's make sure the world knows.**",
      ].join('\n\n'),
    },
    included: {
      groups: [
        {
          title: 'Right for you if',
          marker: 'wine',
          items: [
            { text: 'Your store is ready for traffic. We built it, or it already shows your product well.' },
            { text: 'You can give us one planning call and 3–4 hours of filming a month.' },
            { text: 'You can fund ad spend separately from our fee.' },
            { text: 'You want the ads, the content and the accounts in your name.' },
          ],
        },
      ],
    },
    box: {
      note: 'No store yet? {link}.',
      link: custom(BUILD_URL, 'Start with the build'),
    },
  } satisfies Row<ServiceSheetBlock>,

  /* 4 How a month runs (phaseTimeline, cells). P3: closing line without the tag. */
  month: {
    blockType: 'phaseTimeline',
    variant: 'cells',
    anchorId: 'month',
    eyebrow: 'How a month runs',
    eyebrowTick: true,
    heading: 'About 5 hours of yours. The rest is ours.',
    accentPhrase: 'The rest is ours.',
    intro: "One call to plan, one session to film. Then we run it all month and let the numbers decide next month's plan.",
    steps: [
      {
        number: '01',
        tag: 'With you',
        title: 'Plan',
        detail: 'A planning call, up to an hour, usually less. We agree what to film, post and run.',
        accent: false,
      },
      {
        number: '02',
        tag: 'With you, in person',
        title: 'Film',
        detail: "3–4 hours. Scripts and articles get written in the same session, so the month's content is ready when it ends.",
        accent: true,
      },
      {
        number: '03',
        tag: 'Us, all month',
        title: 'Post and run ads',
        detail: 'We post the content, run the campaigns and manage collaborations. Nothing goes to a creator without your approval.',
        accent: false,
      },
      {
        number: '04',
        tag: 'Us, then you',
        title: 'Read the numbers',
        detail: "We shift effort between tools based on what the numbers show, and bring it to next month's call.",
        accent: false,
      },
    ],
    closingLine: 'Filming is in person, in Chicago.',
  } satisfies Row<PhaseTimelineBlock>,

  /* 5 Ads first, then the numbers decide (phaseTimeline, flow) */
  flow: {
    blockType: 'phaseTimeline',
    variant: 'flow',
    anchorId: 'start',
    eyebrow: 'Where we start',
    eyebrowTick: true,
    heading: 'Ads first. Then the numbers decide.',
    accentPhrase: 'Then the numbers decide.',
    steps: [
      /* phase '1' = the grey panels; phase '2' = the outcomes column */
      {
        phase: '1',
        tag: 'Month one',
        title: 'Paid ads',
        detail: 'Meta campaigns on Facebook and Instagram, each with its own landing page, so the ad and the store say the same thing.',
      },
      {
        phase: '1',
        tag: 'Every month',
        title: 'Read the numbers',
        detail: 'What sold, what it cost, and what visitors did on the store.',
      },
      { phase: '2', tag: 'If ads can scale', title: 'More into paid ads.' },
      { phase: '2', tag: 'If the budget is too small to scale', title: 'More into organic content and creators.' },
    ],
    closingLine: 'You pay the same plan either way.',
  } satisfies Row<PhaseTimelineBlock>,

  /* 6 The toolkit (specLedger tools, catalog). A new `groupLabel` starts a new group. */
  toolkit: {
    blockType: 'specLedger',
    variant: 'tools',
    toolsLayout: 'catalog',
    anchorId: 'toolkit',
    eyebrow: 'The toolkit',
    eyebrowTick: true,
    heading: 'Every tool. Accounts in your name.',
    accentPhrase: 'Accounts in your name.',
    note: 'Every plan includes all of it. Here is what each tool is for and what we do with it.',
    items: [
      { groupLabel: 'Paid ads', title: 'Meta Ads', line: 'Campaigns on Facebook and Instagram. This is where we start.', logo: 'meta' },
      {
        groupLabel: 'Paid ads',
        title: 'Campaign landing pages',
        line: 'A page on your store built for each campaign, so the ad and the store say the same thing.',
        logo: 'shopify',
      },
      {
        groupLabel: 'Organic social and creators',
        title: 'Instagram',
        line: 'Posts, Reels and your Shop. Filmed with you each month.',
        logo: 'instagram',
      },
      {
        groupLabel: 'Organic social and creators',
        title: 'Facebook',
        line: 'Posts and your Shop, from the same filming session.',
        logo: 'facebook',
      },
      {
        groupLabel: 'Organic social and creators',
        title: 'TikTok',
        line: 'Posts and your Shop, from the same filming session.',
        logo: 'tiktok',
      },
      {
        groupLabel: 'Organic social and creators',
        title: 'Collaborations',
        line: 'We scout creators, reach out through Instagram DMs and manage the partnership. Nothing is sent without your approval.',
        logo: 'handshake',
      },
      {
        groupLabel: 'Search, email and print',
        title: 'Google Business Profile',
        line: 'Your listing on Google Search and Maps, with review growth and prompt replies.',
        logo: 'google',
      },
      {
        groupLabel: 'Search, email and print',
        title: 'SEO',
        line: 'Showing up when people search for what you sell. Tracked in Google Search Console.',
        logo: 'google-search-console',
      },
      {
        groupLabel: 'Search, email and print',
        title: 'GEO',
        line: 'Getting recommended when people ask AI tools like ChatGPT for what you sell.',
        logo: 'sparkle',
      },
      { groupLabel: 'Search, email and print', title: 'Newsletter', line: 'Sent through Shopify Email.', logo: 'shopify' },
      { groupLabel: 'Search, email and print', title: 'Flyers', line: 'On-brand, made in Claude Design, on request.', logo: 'claude' },
      {
        groupLabel: 'Search, email and print',
        title: 'Microsoft Clarity',
        line: 'Shows what visitors do on your store.',
        logo: 'microsoft-clarity',
      },
    ],
    footnote: 'Product names and logos are trademarks of their owners.',
  } satisfies Row<SpecLedgerBlock>,

  /* 7 Who does what (serviceSheet, duties) */
  duties: {
    blockType: 'serviceSheet',
    presentation: 'duties',
    anchorId: 'who',
    eyebrow: 'Who does what',
    eyebrowTick: true,
    heading: 'One person accountable.',
    accentPhrase: 'accountable.',
    why: { body: 'You deal with the person doing the work. No middlemen, no layers. Everything is done in-house.' },
    included: {
      groups: [
        {
          title: 'You',
          marker: 'ink',
          items: [
            { text: 'One planning call a month, up to an hour.' },
            { text: '3–4 hours of filming, in person.' },
            { text: "Approve every collaboration before it's sent." },
            { text: 'Pay ad spend and influencer costs directly.' },
            { text: 'Approve each renewal.' },
          ],
        },
        {
          title: 'Us',
          marker: 'wine',
          items: [
            { text: 'Plan the month with you.' },
            { text: 'Write the scripts and articles.' },
            { text: 'Film with you.' },
            { text: 'Post to every channel.' },
            { text: 'Run the ads.' },
            { text: 'Build the campaign pages.' },
            { text: 'Find and manage creators.' },
            { text: 'Run your Google listing.' },
            { text: 'SEO, GEO and the newsletter.' },
            { text: 'Read the numbers, shift the effort.' },
          ],
        },
      ],
    },
  } satisfies Row<ServiceSheetBlock>,

  /* 8 Your first two quarters (phaseTimeline, ruled) */
  quarters: {
    blockType: 'phaseTimeline',
    variant: 'ruled',
    eyebrow: 'Your first two quarters',
    eyebrowTick: true,
    heading: 'Two quarters to see what works.',
    accentPhrase: 'to see what works.',
    intro:
      "That's long enough to film, run ads and see what works before deciding. After that it renews for two quarters at a time.",
    steps: [
      { tag: 'Sign-off', title: 'You approve the start of marketing.' },
      { tag: 'Quarter 1', title: 'First-quarter rate', detail: 'Ads start. The first filming sessions.' },
      { tag: 'Quarter 2', title: "Your plan's rate", detail: 'Effort shifts to what the numbers show.' },
      { tag: 'Sign-off', title: 'Renew for two more quarters, or cancel with notice.' },
    ],
  } satisfies Row<PhaseTimelineBlock>,

  /* 9 Plans and terms (pricingPlans, plans). Fine print = LIVE definition (S2); Terms = artboard wording (S2). */
  plans: {
    blockType: 'pricingPlans',
    layout: 'plans',
    anchorId: 'plans',
    eyebrow: 'Plans and terms',
    eyebrowTick: true,
    heading: 'Three plans. Settled quarterly.',
    accentPhrase: 'Settled quarterly.',
    intro: 'Every plan includes the full toolkit. Ad spend and influencer costs are paid by you, separately.',
    marketing: {
      firstLabel: 'First quarter',
      afterLabel: 'After that',
      plans: [
        {
          name: 'Standard',
          tag: 'Best for steady sales',
          figures: [
            { value: '20%', unit: 'of online revenue' },
            { value: '30%', unit: 'of online profit' },
          ],
          after: 'Same rate',
        },
        { name: 'Prepaid', tag: 'Best for a fixed cost', figures: [{ value: '$1,000', unit: 'flat' }], after: '$1,500 a quarter' },
        { name: 'Ramp-up', tag: 'Best for new stores', figures: [{ value: '10%', unit: 'of online revenue' }], after: 'The Standard rate' },
      ],
      finePrint:
        'Online revenue is the total money taken through your online store, not counting refunds, chargebacks, shipping and losses. Online profit is gross profit: online revenue minus the cost of the products sold.',
      nextLink: custom('/book-a-call', 'Book a call about marketing'),
    },
    terms: [
      {
        label: 'At $100,000 a year',
        body: 'Every plan switches to a fixed rate once your online store reaches $100,000 a year. The rate is set for your store, based on the work it needs, and agreed in writing.',
      },
      {
        label: 'Switching early',
        body: "When your quarterly results show you're on pace, we offer the switch early. It's your choice. If you wait, it's required once the revenue is reached.",
      },
      {
        label: 'The agreement',
        body: 'Two-quarter terms that renew. Either side can cancel with notice before the next term. You own all content, ads and accounts. No guaranteed results.',
      },
    ],
    statement:
      'We build and grow your store for one reason: we want your business to succeed. Everything we charge is set up to help you grow, not hold you back.',
    statementAccent: 'Everything we charge is set up to help you grow, not hold you back.',
  } satisfies Row<PricingPlansBlock>,

  /* 10 Proof (caseStudyCards; testimonial fallback, P5 / S10a) */
  proof: {
    blockType: 'caseStudyCards',
    source: 'track',
    track: ['growth'],
    tone: 'grey',
    spacing: 'tight',
    fallbackMode: 'testimonials',
    fallbackEyebrow: 'Proof, in their words',
    fallbackHeading: null,
  } satisfies Row<CaseStudyCardsBlock>,

  /* 11 Marketing questions (accordionFAQ mini, split). Question texts only (P6). */
  faq: {
    blockType: 'accordionFAQ',
    variant: 'mini',
    layout: 'split',
    anchorId: 'faq',
    eyebrow: 'Marketing questions',
    eyebrowTick: true,
    heading: 'Straight answers.',
    accentPhrase: 'answers.',
    source: 'selected',
    limit: 6,
    openFirst: true,
    questions: [
      'Is there a minimum term for marketing?',
      'Can I just get ads?',
      'Who pays for ads?',
      'Do you lock clients into retainers?',
      'What happens at $100,000 a year?',
      'Do you guarantee results?',
    ],
    allLink: custom('/faq', 'All questions →'),
  } satisfies FaqCopy,

  /* 12 No store yet? First, we build it. (richContent band, split) */
  band: {
    blockType: 'richContent',
    variant: 'band',
    bandLayout: 'split',
    eyebrow: 'No store yet?',
    heading: 'First, we build it.',
    accentPhrase: 'build it.',
    bodyParagraphs: ['A custom Shopify store, designed with you and coded from scratch. Builds start at $7K.'],
    link: custom(BUILD_URL, 'How the build works →'),
  } satisfies BandCopy,

  /* 13 Final CTA (live FinalCTA, P7). Capacity line AND its quiet line both come from the scarcity
   * global (`engines-line` statistic + reason), so `body` is cleared: setting it would render the
   * reason twice. */
  finalCta: {
    blockType: 'finalCTA',
    heading: 'Start with a call, leave with a plan.',
    accentPhrase: null,
    capacity: 'engines-line',
    body: null,
  } satisfies Row<FinalCTABlock>,
}
