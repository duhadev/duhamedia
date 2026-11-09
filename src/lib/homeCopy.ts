import type { PhaseTimelineBlock, SpecLedgerBlock } from '@/payload-types'

import { GROW_TOOLS, PROCESS as SERVICES_PROCESS } from './servicesCopy'

/**
 * Homepage sections redesign, "home B" (owner-approved 2026-11-09). Copy for the
 * data migration src/migrations/20261109_151000_home_b.ts and for the /_showcase
 * home B fixtures (src/showcase/homeB/). Used ONCE by the migration; after it
 * runs the words live in the CMS and are edited there, never here.
 *
 * Verbatim from design-reference/home-b-2026-11-09/*.dc.html (TwoJobs, Process,
 * Toolkit, Founder, Main). The process intro + Day 0 strip and the trademark
 * footnote are shared with /services (servicesCopy.ts), as the README asks.
 * The toolkit list is its own list, not /services' GROW_TOOLS: the homepage grid
 * is a different selection, order and wording (Shopify + Claude Design as BUILD
 * tiles, "Search Console", no "Collaborations", one Claude Design tile).
 */

const custom = (url: string, label: string) => ({ type: 'custom' as const, newTab: false, url, label })

/* ---- 2 Capacity strip (ProofStrip `capacity`) + its scarcity-global row ---- */
export const CAPACITY = {
  logosEyebrow: "Stores we've built",
  /** New row for the `scarcity` global (key `spots`); `{active}` / `{capacity}` are filled from its counts. */
  statement: {
    key: 'spots' as const,
    statistic: '{active} / {capacity}',
    label: 'Client spots in use',
    reason: 'We cap at {capacity}, so every store gets our full attention.',
  },
}

/* ---- 3 Two jobs. One team. (TwoTrackPanels `equal`) ---- */
export const TWO_JOBS = {
  eyebrow: 'What we do',
  eyebrowTick: true,
  heading: 'Two jobs. One team.',
  accentPhrase: 'One team.',
  intro: 'Start with the store, or start with the marketing. Same people either way.',
  panels: [
    {
      label: 'Service 01 · Build your store',
      title: 'First, we build it.',
      accentPhrase: null,
      accentTitle: false,
      body: 'A Shopify store built from scratch, around your brand and your products. No templates.',
      stats: [
        { value: '$7K', label: 'Builds start at', accent: false },
        { value: '55hrs', label: 'Hands-on, per build', accent: false },
        { value: '30hrs', label: 'Of those on design', accent: true },
      ],
      points: [
        { lead: 'Custom Shopify theme.', text: 'Written from scratch, no template underneath.' },
        { lead: 'Every screen designed', text: "and revised with you until it's right." },
        { lead: 'Shops connected.', text: 'TikTok Shop, Instagram Shop and Facebook Shop.' },
        { lead: 'You own it.', text: 'The store, the theme code and the domain, from launch day.' },
      ],
      pricingNote: null,
      linkLabel: 'How the build works →',
    },
    {
      label: 'Service 02 · Grow your store',
      title: 'Then we grow it.',
      accentPhrase: 'grow it.',
      accentTitle: true,
      body: 'Marketing, run by the same team that built your store. Every plan includes the full toolkit.',
      stats: [
        { value: '1hr', label: 'Planning call, monthly', accent: false },
        { value: '3–4hrs', label: 'Filming with you, in person', accent: false },
        { value: '3', label: 'Plans, settled quarterly', accent: true },
      ],
      points: [
        { lead: 'Meta ads first.', text: 'Then effort shifts to what the numbers show.' },
        { lead: 'Social content', text: 'filmed with you each month.' },
        { lead: 'Creators, Google Business Profile,', text: 'SEO and GEO.' },
        { lead: 'Newsletter', text: 'through Shopify Email.' },
      ],
      pricingNote: 'Marketing: three plans, settled quarterly. Ad spend is separate.',
      linkLabel: 'What we run →',
    },
  ],
}

/* ---- 5 Your project, start to finish. (PhaseTimeline `grid`, one row) ---- */
const STEPS: [string, string][] = [
  ['Discovery', 'Your business, your customers and your goals.'],
  ['Research', 'Your competitors and who is winning in your market.'],
  ['Brand', 'One meeting to set colors, typography and look.'],
  ['Design', "Every screen, revised with you until it's right."],
  ['Build', 'The approved design, coded into a custom theme.'],
  ['Launch', "Shops connected, store live. It's yours."],
  ['Marketing plan', 'Ads first, then whatever fits your store.'],
  ['Run and refine', 'We run the marketing and keep improving the store.'],
]

export const PROCESS = {
  variant: 'grid',
  gridLayout: 'row',
  eyebrow: 'How it runs',
  eyebrowTick: true,
  heading: 'Your project, start to finish.',
  accentPhrase: 'start to finish.',
  intro: SERVICES_PROCESS.intro,
  phases: [
    { number: 'Phase 1', title: 'Build your store' },
    { number: 'Phase 2', title: 'Grow (optional)' },
  ],
  steps: [
    ...SERVICES_PROCESS.stepZero,
    ...STEPS.map(([title, detail], i) => ({
      number: String(i + 1).padStart(2, '0'),
      phase: (i < 6 ? '1' : '2') as '1' | '2',
      title,
      detail,
    })),
  ],
  closingLine: 'Build only? Steps 7 and 8 are optional.',
  cta: custom('/services#process', 'The full process →'),
} satisfies Partial<PhaseTimelineBlock>

/* ---- 6 The toolkit (NEW SpecLedger `tools`, grid) ---- */
const TOOLKIT_ITEMS: [string, string, NonNullable<NonNullable<SpecLedgerBlock['items']>[number]['logo']>, 'build' | 'grow'][] = [
  ['Shopify', 'Custom theme', 'shopify', 'build'],
  ['Claude Design', 'Store design, flyers', 'claude', 'build'],
  ['Meta Ads', 'Paid ads', 'meta', 'grow'],
  ['Instagram', 'Posts, Reels, Shop', 'instagram', 'grow'],
  ['Facebook', 'Posts, Shop', 'facebook', 'grow'],
  ['TikTok', 'Posts, Shop', 'tiktok', 'grow'],
  ['Google Business Profile', 'Search and Maps', 'google', 'grow'],
  ['Search Console', 'SEO', 'google-search-console', 'grow'],
  ['GEO', 'Answers in AI tools', 'sparkle', 'grow'],
  ['Microsoft Clarity', 'What visitors do', 'microsoft-clarity', 'grow'],
  ['Shopify Email', 'Newsletter', 'shopify', 'grow'],
]

export const TOOLKIT = {
  blockType: 'specLedger',
  variant: 'tools',
  toolsLayout: 'grid',
  eyebrow: 'The toolkit',
  eyebrowTick: true,
  heading: 'Tools you know. Accounts in your name.',
  accentPhrase: 'Accounts in your name.',
  note: 'Every plan includes the full toolkit. The store, the ads and the audience stay yours.',
  items: TOOLKIT_ITEMS.map(([title, line, logo, tag]) => ({ title, line, logo, tag })),
  linkTile: { link: custom('/services', 'See every tool on Services'), shortLabel: 'Every tool' },
  footnote: GROW_TOOLS.footnote,
} satisfies SpecLedgerBlock

/* ---- 8 One founder, no layers. (TeamIntro `founder-card`, section) ---- */
export const FOUNDER = {
  presentation: 'section' as const,
  eyebrow: "Who you'd work with",
  eyebrowTick: true,
  heading: 'One founder, no layers.',
  accentPhrase: 'no layers.',
  body: [
    'I started out building websites as a freelancer, and I kept running into the same kind of owner. Amazing reputation. Amazing product. And an online store that did none of it justice.',
    "That gap is why Duha Media exists. I design the store, build it, and market it, so the thing you've worked years to get right finally reaches people who don't know about it.",
    "I'm a Muslim entrepreneur, born and working in Chicago. I'd like to help you build something that does your name justice.",
  ].join('\n\n'),
  pullQuote: null,
  link: custom('/book-a-call', 'Book a Call'),
  moreLink: custom('/about', 'More about us →'),
}
