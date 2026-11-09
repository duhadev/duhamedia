import type { PricingPlansBlock, ServiceSheetBlock, SpecLedgerBlock } from '@/payload-types'

/**
 * /services redesign, direction A (owner-approved 2026-11-09). Copy for the
 * data migration src/migrations/20261109_050000_services_redesign.ts and for
 * /_showcase. Used ONCE by the migration; after it runs the words live in the
 * CMS and are edited there, never here.
 *
 * Verbatim from design-reference/services-a-2026-11-09/ (desktop-1440.html,
 * README.md), with the PM's D4 exceptions: the pricing small print keeps the
 * LIVE online-profit definition (so it is not set here at all), and FAQ
 * answers stay as stored in `faqs` (only the question list is named here).
 * Number captions carry " / " where the artboards break the line.
 */

const custom = (url: string, label: string) => ({ type: 'custom' as const, newTab: false, url, label })
const noLink = { type: 'custom' as const, newTab: false }

/* ---- 0 hero (existing block, patched) ---- */
export const HERO = {
  heading: 'We build it. Then we grow it.',
  accentPhrase: 'Then we grow it.',
  accentLine: true,
  body: 'We design and build custom Shopify stores from scratch, then run the marketing that brings in customers. Start with the store, or start with the marketing.',
  pricingCta: custom('/services#pricing', 'See pricing'),
  proofLine: 'Builds start at **$7K**. About **55 hands-on hours** per build. **7 clients** at most, at once.',
}

/* ---- 1 Build section (new serviceSheet, section) ---- */
export const BUILD_SECTION = {
  blockType: 'serviceSheet',
  presentation: 'section',
  eyebrow: 'Service 01 · Build your store',
  eyebrowTick: true,
  heading: 'First, we build it.',
  accentPhrase: null,
  intro: 'A Shopify store built from scratch, around your brand and your products. No templates.',
  numeral: '01',
  accent: false,
  why: {
    heading: null,
    body: [
      "Plenty of local businesses have the hard part figured out. The product is proven, the regulars keep coming back, and word of mouth does its work. Then a new customer lands on the online store, and it doesn't measure up.",
      'That gap is why we exist. We build the Shopify store your product has earned.',
      '**Your product is proven. Your online store should be too.**',
    ].join('\n\n'),
  },
  numbers: {
    label: 'The build, in numbers',
    layout: 'columns',
    items: [
      { value: '$7K', text: 'Starting price / for a build.', accent: false },
      { value: '~55', text: 'Hours / per build.', accent: false },
      { value: '~30', text: 'Of those on / design alone.', accent: true },
    ],
  },
  box: {
    label: 'You own it',
    body: 'From launch day, the store, the theme code and the domain belong to you.',
    link: noLink,
  },
  nextStep: { label: null, link: custom('/services/shopify-theme-development', 'See the build →') },
  included: {
    heading: null,
    groups: [
      {
        title: 'Strategy and design',
        items: [
          { lead: 'Discovery', text: 'Your business, your customers and your goals.' },
          { lead: 'Research', text: 'Your competitors, your positioning and who is winning in your market.' },
          { lead: 'Brand', text: 'One meeting to set colors, typography and look.' },
          { lead: 'Store design', text: "Every screen, revised with you until it's right." },
        ],
      },
      {
        title: 'Development',
        items: [
          { lead: 'Custom Shopify theme', text: 'Written from scratch, no template underneath.' },
          { lead: 'Our own build pipeline', text: 'AI-assisted, so the coding moves faster. The design is still planned with you.' },
        ],
      },
      {
        title: 'Launch and sales channels',
        items: [
          { lead: 'Shop sync', text: 'TikTok Shop, Instagram Shop and Facebook Shop.' },
          { lead: 'Launch', text: 'We push it live, and the store is yours.' },
        ],
      },
    ],
  },
  differentiators: {
    heading: null,
    rows: [{ label: 'No templates', line: "Designed and built from scratch, so it looks like your business and nobody else's." }],
  },
} satisfies ServiceSheetBlock

/* ---- 2 Build tools (new specLedger, tools tiles) ---- */
export const BUILD_TOOLS = {
  blockType: 'specLedger',
  variant: 'tools',
  toolsLayout: 'tiles',
  heading: 'Preferred tools · Build',
  note: null,
  footnote: null,
  items: [
    { title: 'Claude Design', line: 'Store design', logo: 'claude' },
    { title: 'Shopify', line: 'Custom theme', logo: 'shopify' },
    { title: 'Instagram Shop', line: 'Sales channel', logo: 'instagram' },
    { title: 'Facebook Shop', line: 'Sales channel', logo: 'facebook' },
    { title: 'TikTok Shop', line: 'Sales channel', logo: 'tiktok' },
  ],
} satisfies SpecLedgerBlock

/* ---- 3 Grow section (new serviceSheet, section, accent) ---- */
export const GROW_SECTION = {
  blockType: 'serviceSheet',
  presentation: 'section',
  eyebrow: 'Service 02 · Grow your store',
  eyebrowTick: true,
  heading: 'Then we grow it.',
  accentPhrase: 'grow it.',
  intro: 'Marketing, run by the same team that built your store. Every plan includes the full toolkit.',
  numeral: '02',
  accent: true,
  why: {
    heading: null,
    body: [
      "A new store doesn't sell itself. Someone has to bring people to it, and keep bringing them.",
      'We start with paid ads, then shift effort between tools based on what the numbers show. If the budget is too small to scale ads, more goes into organic content and creators.',
      "**You made something great. Now let's make sure people know.**",
    ].join('\n\n'),
  },
  numbers: {
    label: 'Every month',
    layout: 'rows',
    items: [
      { value: '1 hr', lead: 'Planning call.', text: 'We agree what to film, post and run.', accent: false },
      { value: '3–4 hr', lead: 'Filming, in person.', text: 'Scripts and articles get written in the same session.', accent: true },
    ],
  },
  box: {
    label: "How it's paid",
    body: 'One of three plans, settled quarterly. Ad spend and influencer costs are paid by you, separately.',
    link: custom('/services#pricing', 'See plans'),
  },
  nextStep: { label: null, link: custom('/services/marketing', 'See the marketing →') },
  included: {
    heading: null,
    groups: [
      {
        title: 'Paid ads',
        items: [
          { lead: 'Meta ads', text: 'Facebook and Instagram campaigns. This is where we start.' },
          { lead: 'Campaign landing pages', text: 'One per campaign, so the ad and the store say the same thing.' },
        ],
      },
      {
        title: 'Organic social and creators',
        items: [
          { lead: 'Social posting', text: 'Facebook, Instagram, Reels and TikTok, filmed with you each month.' },
          { lead: 'Collaborations', text: 'We scout, reach out and manage partnerships. Nothing is sent without your approval.' },
        ],
      },
      {
        title: 'Search, email and print',
        items: [
          { lead: 'Google Business Profile', text: 'Search and Maps, with review growth and prompt replies.' },
          { lead: 'SEO and GEO', text: 'Showing up when people search, and when they ask AI tools, for what you sell.' },
          { lead: 'Newsletter', text: 'Sent through Shopify Email.' },
          { lead: 'Flyers', text: 'On-brand, on request.' },
        ],
      },
    ],
  },
  differentiators: {
    heading: null,
    rows: [{ label: 'One person accountable', line: 'You deal with the person doing the work. Everything is done in-house.' }],
  },
} satisfies ServiceSheetBlock

/* ---- 4 Grow tools (existing specLedger, patched to tiles) ---- */
export const GROW_TOOLS = {
  toolsLayout: 'tiles',
  heading: 'Preferred tools · Grow · accounts in your name',
  note: null,
  footnote: 'Product names and logos are trademarks of their respective owners and are shown to identify the tools we work with.',
  items: [
    { title: 'Meta Ads', line: 'Paid ads', logo: 'meta' },
    { title: 'Instagram', line: 'Posts, Reels, Shop', logo: 'instagram' },
    { title: 'Facebook', line: 'Posts, Shop', logo: 'facebook' },
    { title: 'TikTok', line: 'Posts, Shop', logo: 'tiktok' },
    { title: 'Collaborations', line: 'Through Instagram DMs', logo: 'handshake' },
    { title: 'Google Business Profile', line: 'Search and Maps', logo: 'google' },
    { title: 'Google Search Console', line: 'SEO', logo: 'google-search-console' },
    { title: 'GEO', line: 'Answers in AI tools', logo: 'sparkle' },
    { title: 'Shopify Email', line: 'Newsletter', logo: 'shopify' },
    { title: 'Claude Design', line: 'Flyers', logo: 'claude' },
    { title: 'Microsoft Clarity', line: 'What visitors do', logo: 'microsoft-clarity' },
  ],
} satisfies Partial<SpecLedgerBlock>

/* ---- 5 How we work (existing phaseTimeline grid, patched) ---- */
export const PROCESS = {
  intro: 'A free call, a written plan, then eight steps in two phases. Marketing is optional.',
  /** Prepended as phase '0' steps (the strip above the phase bars). */
  stepZero: [
    { phase: '0' as const, tag: 'Day 0', title: 'A free call, 45 minutes', detail: 'We say which job fits, including "neither, yet."' },
    { phase: '0' as const, tag: 'Within 72 hours', title: 'A dated plan, in writing', detail: 'Scope and price, before you pay anything.' },
    { phase: '0' as const, tag: 'After you sign off', title: 'Work starts', detail: 'Nothing is signed or paid before this.' },
  ],
  /** Step number → artboard detail (titles and phases stay as stored). */
  details: {
    '1': 'Your business, your customers and your goals.',
    '2': 'Your competitors and who is winning in your market.',
    '3': 'One meeting to set colors, typography and look.',
    '4': "Every screen, revised with you until it's right.",
    '5': 'The approved design, coded into a custom theme.',
    '6': "Shops connected, store live. It's yours.",
    '7': 'Ads first, then whatever fits your store.',
    '8': 'We run the marketing and keep improving the store. Ongoing.',
  } as Record<string, string>,
}

/* ---- 6 Pricing (existing pricingPlans, patched; small print NOT touched, D4) ---- */
type Plan = NonNullable<NonNullable<PricingPlansBlock['marketing']>['plans']>[number]

export const PRICING = {
  build: {
    bullets: [
      'A custom Shopify theme, written from scratch.',
      'About 55 hands-on hours, about 30 on design.',
      "Brand, design, build and launch, revised until it's right.",
      'The store, the theme code and the domain are yours from launch.',
    ],
    nextLink: custom('/book-a-call', 'Book a call about a build'),
  },
  marketing: {
    label: 'Grow your store',
    nextLink: custom('/book-a-call', 'Book a call about marketing'),
    /** Plan name → first-quarter figures + "After that". */
    plans: {
      Standard: {
        figures: [
          { value: '20%', unit: 'of online revenue' },
          { value: '30%', unit: 'of online profit' },
        ],
        after: 'Same rate',
      },
      Prepaid: { figures: [{ value: '$1,000', unit: 'flat' }], after: '$1,500 a quarter' },
      'Ramp-up': { figures: [{ value: '10%', unit: 'of online revenue' }], after: 'Standard rate' },
    } as Record<string, Pick<Plan, 'after'> & { figures: { value: string; unit: string }[] }>,
  },
  terms: [
    { label: 'At $100,000 a year', body: 'Every plan switches to a fixed rate, set for your store based on the work it needs, and agreed in writing.' },
    { label: 'Switching early', body: "When your quarterly results show you're on pace, we offer the switch early. It's your choice." },
    {
      label: 'The agreement',
      body: 'Two-quarter terms that renew. Either side can cancel with notice before the next term. You own all content, ads and accounts. No guaranteed results.',
    },
  ],
}

/* ---- 7 The work, up close (existing testimonialRow, patched) ---- */
export const PROOF = { eyebrow: 'The work, up close', eyebrowTick: true, centerFacts: true }

/* ---- 8 FAQ (existing accordionFAQ, patched; answers stay as stored, D4) ---- */
export const FAQ = {
  layout: 'split' as const,
  eyebrow: 'Questions',
  eyebrowTick: true,
  heading: 'Straight answers.',
  intro: 'The questions owners ask most, before they book a call.',
  questions: ['How much does a build cost?', 'Can I hire you for just the build?', 'Who pays for ads?', 'Do you guarantee results?'],
  allLink: custom('/faq', 'All questions →'),
}

/* ---- 9 Final CTA (existing; only the heading changes, D5) ---- */
export const FINAL_CTA_HEADING = 'Start with a call, leave with a plan.'
