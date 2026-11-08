/**
 * Brochure (docs/brochure/duha-media-brochure-2026-11-07.pdf) copy for the
 * blocks the brochure restructure adds. Used ONCE by the data migration
 * (src/migrations/20261108_020100_brochure_restructure.ts) and by
 * /_showcase; after the migration the words live in the CMS and are edited
 * there, never here.
 *
 * Verbatim from the brochure, except: p2 drops "in Chicago" from "We work
 * with owner-operated businesses…" (as reply-02 BAC-H2 did); p3 "Local" line uses the founder's
 * latest location answer (Chicago + across the US, reply-02), and p3 "Details
 * on page 5." becomes a "See pricing" link.
 */

const custom = (url: string, label: string) => ({ type: 'custom' as const, newTab: false, url, label })

export const SHEET_BUILD = {
  blockType: 'serviceSheet' as const,
  why: {
    heading: 'Why it matters',
    body: [
      "Plenty of local businesses have the hard part figured out. The product is proven, the regulars keep coming back, and word of mouth does its work. Then a new customer lands on the online store, and it doesn't measure up.",
      "That gap is why Duha Media exists. We build the Shopify store your product has earned, then run the marketing that brings in customers who haven't found you yet.",
      "We work with owner-operated businesses that make something great, but whose online store and marketing don't show it yet. We stay with you, hand in hand, until your business is set up to succeed.",
      '**Your product is proven.\nYour online store should be too.**',
    ].join('\n\n'),
  },
  numbers: {
    label: 'The build, in numbers',
    layout: 'columns' as const,
    items: [
      { value: '$7K', text: 'Starting price for a build.', accent: false },
      { value: '~55', text: 'Hands-on hours per build.', accent: false },
      { value: '~30', text: 'Of those on design alone.', accent: true },
    ],
  },
  box: {
    label: 'You own it',
    body: 'From launch day, the store, the theme code and the domain belong to you.',
    link: { type: 'custom' as const, newTab: false },
  },
  nextStep: { label: 'Next step', link: custom('/book-a-call', 'Book a call to talk through your build.') },
  included: {
    heading: "What's included",
    groups: [
      {
        title: 'Strategy and design',
        items: [
          { lead: 'Discovery', text: 'We talk through your business, your customers and your goals.' },
          { lead: 'Research', text: 'We study your competitors, your positioning and who is winning in your market.' },
          { lead: 'Brand', text: 'One meeting to set colors, typography and look.' },
          { lead: 'Store design', text: "We study the best stores in your field, design your store screen by screen, and revise it with you until it's right." },
        ],
      },
      {
        title: 'Development',
        items: [
          { lead: 'Custom Shopify theme', text: 'Written from scratch for your store, with no template underneath.' },
          { lead: 'Our own build pipeline', text: 'AI-assisted, so the coding moves faster. The design is still planned with you, screen by screen.' },
        ],
      },
      {
        title: 'Launch and sales channels',
        items: [
          { lead: 'Shop sync', text: 'Your store connects to TikTok Shop, Instagram Shop and Facebook Shop.' },
          { lead: 'Launch', text: 'We push it live, and the store is yours.' },
        ],
      },
    ],
  },
  differentiators: {
    heading: 'Key differentiators',
    rows: [
      { label: 'No templates', line: "Your store is designed and built from scratch, so it looks like your business and nobody else's." },
      { label: 'Built by a developer', line: 'The person who designs your store writes its code, so what we design is what ships.' },
    ],
  },
}

export const SHEET_GROW = {
  blockType: 'serviceSheet' as const,
  why: {
    heading: 'Why it matters',
    body: [
      "A new store doesn't sell itself. Someone has to bring people to it, and keep bringing them.",
      'We start with paid ads that bring customers to your online store. Then we shift effort between tools based on what the numbers show.',
      'If the budget is too small to scale paid ads, we put more into organic content and influencers.',
      "You built the product. Our job is to put it in front of the people who haven't found you yet. Every plan comes with the full toolkit ready to go: ads, social content, creators, search and email. We use each tool when your store needs it, and we use it well.",
      "**You made something great. Now let's make sure the world knows.**",
    ].join('\n\n'),
  },
  numbers: {
    label: 'Every month',
    layout: 'rows' as const,
    items: [
      { value: '1 hr', lead: 'Planning call.', text: 'Up to an hour, usually less. We agree what to film, post and run.', accent: false },
      {
        value: '3–4 hr',
        lead: 'Filming, in person.',
        text: "Scripts and articles get written in the same session, so the month's content is ready when it ends.",
        accent: true,
      },
    ],
  },
  box: {
    label: "How it's paid",
    body: 'One of three plans, settled quarterly. Ad spend and influencer costs are paid by you, separately.',
    link: custom('/services#pricing', 'See pricing'),
  },
  nextStep: { label: 'Next step', link: custom('/book-a-call', 'Book a call to plan your marketing.') },
  included: {
    heading: "What's included",
    groups: [
      {
        title: 'Paid ads',
        items: [
          { lead: 'Meta ads', text: 'Campaigns on Facebook and Instagram. This is where we start.' },
          { lead: 'Campaign landing pages', text: 'A page built for each campaign, so the ad and the store say the same thing.' },
        ],
      },
      {
        title: 'Organic social and influencers',
        items: [
          { lead: 'Social posting', text: 'Content for Facebook, Instagram, Reels and TikTok, filmed with you each month.' },
          { lead: 'Collaborations', text: 'We scout, reach out and manage partnerships. Nothing is sent without your approval.' },
        ],
      },
      {
        title: 'Search, email and print',
        items: [
          { lead: 'Google Business Profile', text: 'Your listing on Google Search and Maps, with review growth and prompt replies.' },
          { lead: 'SEO', text: 'Showing up when people search for what you sell.' },
          { lead: 'GEO', text: 'Getting recommended when people ask AI tools like ChatGPT for what you sell.' },
          { lead: 'Newsletter', text: 'Sent through Shopify Email.' },
          { lead: 'Flyers', text: 'On-brand, on request.' },
        ],
      },
    ],
  },
  differentiators: {
    heading: 'Key differentiators',
    rows: [
      { label: 'One person accountable', line: 'You deal with the person doing the work. No middlemen, no layers. Everything is done in-house.' },
      { label: 'Small on purpose', line: 'We cap at 7 clients, so every store gets the hours it needs.' },
      // Brochure p3 says "the Chicagoland area"; founder's latest answer (reply-02): across the US.
      { label: 'Local', line: 'Based in Chicago. We film in person and work with businesses in Chicago and across the United States.' },
    ],
  },
}

export const PROCESS_GRID = {
  blockType: 'phaseTimeline' as const,
  variant: 'grid' as const,
  eyebrow: 'How we work',
  eyebrowTick: true,
  heading: 'Your project, start to finish.',
  accentPhrase: 'start to finish.',
  intro: 'Eight steps in two phases, so you always know what comes next. Marketing is optional.',
  phases: [
    { number: 'Phase 1', title: 'Build your store', continuedLabel: 'Phase 1 · Build, continued' },
    { number: 'Phase 2', title: 'Grow your store (optional)' },
  ],
  steps: [
    { number: '1', phase: '1' as const, title: 'Discovery', detail: 'We talk through your business, your customers and your goals.' },
    { number: '2', phase: '1' as const, title: 'Research', detail: 'We study your competitors, your positioning and who is winning in your market.' },
    { number: '3', phase: '1' as const, title: 'Brand', detail: 'One meeting to set your colors, typography and look.' },
    { number: '4', phase: '1' as const, title: 'Design', detail: "We design every screen of the store and revise it with you until it's right." },
    { number: '5', phase: '1' as const, title: 'Build', detail: 'We code the approved design into a custom theme, through our own AI-assisted build pipeline.' },
    { number: '6', phase: '1' as const, title: 'Launch', detail: "We connect your shops and push the store live. It's yours." },
    { number: '7', phase: '2' as const, title: 'Marketing plan', detail: 'Ads first, then whatever fits your store.' },
    {
      number: '8',
      phase: '2' as const,
      title: 'Run and refine',
      detail: 'We run the marketing and keep improving the store, including campaign landing pages. Ongoing.',
    },
  ],
}

export const TOOLS = {
  blockType: 'specLedger' as const,
  variant: 'tools' as const,
  heading: 'Preferred tools',
  note: 'A small, proven stack. The accounts are in your name.',
  items: [
    { title: 'Shopify' },
    { title: 'Instagram', line: 'Shop' },
    { title: 'Facebook', line: 'Shop' },
    { title: 'TikTok', line: 'Shop' },
    { title: 'Meta', line: 'Ads' },
    { title: 'Shopify', line: 'Email' },
    { title: 'Microsoft', line: 'Clarity' },
  ],
}

export const PRICING = {
  blockType: 'pricingPlans' as const,
  anchorId: 'pricing',
  eyebrow: 'Pricing',
  eyebrowTick: true,
  heading: 'Two jobs. Two ways to pay.',
  accentPhrase: 'Two ways to pay.',
  intro: 'Building the store and growing it are priced differently, so each is clear on its own.',
  build: {
    label: 'Build your store',
    lead: 'Builds start at',
    price: '$7K',
    bullets: [
      { text: 'A custom Shopify theme, written from scratch. No templates.' },
      { text: 'About 55 hands-on hours, about 30 of them on design alone.' },
      { text: "Brand, design, build and launch, with revisions until it's right." },
      { text: 'Shop sync with TikTok Shop, Instagram Shop and Facebook Shop.' },
      { text: 'The store, the theme code and the domain are yours from launch.' },
    ],
    nextLabel: 'Next step',
    nextLink: custom('/book-a-call', 'Book a call to talk through your build.'),
  },
  marketing: {
    label: 'Marketing plan',
    intro: 'Three plans, settled quarterly. Every plan includes the full toolkit.',
    firstLabel: 'First quarter',
    afterLabel: 'After that',
    plans: [
      {
        name: 'Standard',
        tag: 'Best for steady sales',
        body: '**20% of online revenue** or **30% of online profit**, your choice. Nothing upfront, so the fee moves with your sales.',
        first: '20% or 30%',
        after: 'Same rate',
      },
      {
        name: 'Prepaid',
        tag: 'Best for a fixed cost',
        body: 'A flat **$1,000** for the first quarter, then **$1,500** a quarter. No percentage on top, however much you sell.',
        first: '$1,000 flat',
        after: '$1,500 a quarter',
      },
      {
        name: 'Ramp-up',
        tag: 'Best for new stores',
        body: '**10% of online revenue** in the first quarter while the marketing gets going, then the Standard rate.',
        first: '10% of revenue',
        after: '20% or 30%',
      },
    ],
    threshold: '**At $100K a year,** every plan moves to a fixed rate. See below.',
    finePrint:
      'Ad spend and influencer costs are paid by you, separately. Online revenue is the total money taken through your online store, not counting refunds, chargebacks, shipping and losses. Online profit is gross profit: online revenue minus the cost of the products sold.',
  },
  statement:
    'We build and grow your store for one reason: we want your business to succeed. Everything we charge is set up to help you grow, not hold you back.',
  statementAccent: 'Everything we charge is set up to help you grow, not hold you back.',
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
}

export const FOUNDER_BODY =
  "I'm Abdurrahman Choudhary, a Chicago developer and entrepreneur who started out freelancing websites and now builds and markets Shopify stores for local business owners. I do the work myself, which is why we cap at 7 clients."

export const BOOK_A_CALL_LINE = "We'll talk through your business, your customers and your goals."
