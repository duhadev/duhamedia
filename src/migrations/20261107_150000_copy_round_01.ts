import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { ValidationError, type Payload, type PayloadRequest } from 'payload'

import { h, p, root } from '../showcase/lexical'

/**
 * Copy round 1 (docs/duha-website-copy-reply-01.md, 2026-11-07).
 * Human order 2026-11-07: "Apply it fully without approval". The brochure
 * (2026-11-07) now governs business facts: $7K builds, three quarterly
 * marketing plans, two phases + ownership (no handover), Chicago only,
 * banned words (engine, dashboard, CRM, handover, convert…).
 *
 * Content-only data migration (no schema change). Runs once per database in
 * `payload migrate` (Vercel build), like the seed migration.
 *
 * Paths are against the PRODUCTION snapshot of 2026-11-07. Every page lists
 * the blockType expected at each touched index; when a page does not match
 * (e.g. the separate Preview DB, which holds seed content), that page is
 * skipped and logged instead of being written wrongly. Validation errors are
 * logged and skipped; any other error aborts the migration (and the deploy).
 *
 * [ASK] slots (facts only the founder can give) are emptied or hidden, never
 * filled with a guess.
 */

const CTX = { disableRevalidate: true, copyRound: 1 }
const SL = '[STRATEGIC PLACEHOLDER — final copy TBD]'

type Op = ['set', string, unknown] | ['remove', string] | ['insert', string, number, unknown]
type PagePatch = { slug: string; expect: Record<number, string>; ops: Op[]; meta?: { title?: string; description?: string }; noindex?: boolean; unpublish?: boolean }

/* ---------------- path helpers ---------------- */

const tokens = (path: string): (string | number)[] =>
  path.split('.').flatMap((seg) => {
    const out: (string | number)[] = []
    const m = seg.match(/^([^[]+)((?:\[\d+\])*)$/)
    if (!m) throw new Error(`bad path ${path}`)
    out.push(m[1])
    for (const i of m[2].matchAll(/\[(\d+)\]/g)) out.push(Number(i[1]))
    return out
  })

const parentOf = (obj: any, path: string): [any, string | number] => {
  const t = tokens(path)
  let cur = obj
  for (const k of t.slice(0, -1)) {
    if (cur[k] === undefined || cur[k] === null) cur[k] = typeof k === 'number' ? {} : {}
    cur = cur[k]
  }
  return [cur, t[t.length - 1]]
}

const apply = (doc: any, op: Op): void => {
  if (op[0] === 'set') {
    const [parent, key] = parentOf(doc, op[1])
    parent[key] = op[2]
  } else if (op[0] === 'remove') {
    const [parent, key] = parentOf(doc, op[1])
    if (!Array.isArray(parent) || typeof key !== 'number' || key >= parent.length) throw new Error(`remove: no ${op[1]}`)
    parent.splice(key, 1)
  } else {
    const [parent, key] = parentOf(doc, op[1])
    const arr = parent[key]
    if (!Array.isArray(arr)) throw new Error(`insert: ${op[1]} is not an array`)
    arr.splice(op[2], 0, op[3])
  }
}

/* ---------------- shared copy ---------------- */

const BUILD_PRICE = 'Builds start at $7K.'
const MKT_PRICE = 'Marketing: three plans, settled quarterly. Ad spend is separate.'
const PLANS = 'Three plans, settled quarterly. Ad spend is separate.'
const NEWS_LINE = 'Straight from the work. Unsubscribe anytime.'
const CAP_REASON = 'The founder does the work himself, so we cap the list.'

/* ---------------- pages ---------------- */

const PAGES: PagePatch[] = [
  {
    slug: 'home',
    expect: { 0: 'hero', 1: 'proofStrip', 2: 'twoTrackPanels', 3: 'miniCTAStrip', 4: 'phaseTimeline', 6: 'testimonialRow' },
    meta: {
      title: 'Custom Shopify Stores in Chicago | Duha Media',
      description:
        'We design and build custom Shopify stores from scratch, then run the marketing that brings in customers. No templates. Chicago. Builds start at $7K.',
    },
    ops: [
      ['set', 'layout[0].eyebrow', 'Custom Shopify stores · Chicago'],
      ['set', 'layout[0].verticalMicrocopy', 'Build · Grow'],
      [
        'set',
        'layout[0].body',
        'We design and build your Shopify store from scratch, with no templates. Then we run the marketing that brings in customers, so the store you paid for actually sells. Based in Chicago.',
      ],
      ['set', 'layout[1].logos.eyebrow', "Stores we've built"],
      [
        'set',
        'layout[2].panels[0].body',
        "A Shopify store built from scratch, around your brand and your products. No templates. Every page is designed with you and revised until it's right. You get a store that looks like your business and is easy to buy from.",
      ],
      ['set', 'layout[2].panels[0].pricingNote', BUILD_PRICE],
      [
        'set',
        'layout[2].panels[1].body',
        'We start with paid ads to bring customers to your store. Then we shift effort to what the numbers show: social content filmed with you each month, influencer collaborations, Google Business Profile, SEO, GEO and a newsletter. Every plan includes the full toolkit, run by the team that built your store.',
      ],
      ['set', 'layout[2].panels[1].pricingNote', MKT_PRICE],
      ['set', 'layout[3].text', 'NO TEMPLATES. NO MIDDLEMEN. ONE PERSON ACCOUNTABLE.'],
      ['set', 'layout[4].intro', 'Eight steps in two phases, so you always know what comes next. Marketing is optional.'],
      ['set', 'layout[4].closingLine', 'Build only? Steps 7 and 8 are optional.'],
      ['set', 'layout[4].steps[4].title', 'Build'],
      ['set', 'layout[4].steps[4].detail', 'We code the approved design into a custom theme, through our own AI-assisted build pipeline.'],
      ['set', 'layout[4].steps[5].number', '07'],
      ['set', 'layout[4].steps[6].number', '08'],
      [
        'insert',
        'layout[4].steps',
        5,
        { number: '06', title: 'Launch', phase: '1', detail: "We connect your shops and push the store live. It's yours.", tag: null, isSignOff: false, outcomes: [] },
      ],
      ['set', 'layout[6].studyCard.show', false],
    ],
  },
  {
    slug: 'work',
    expect: { 0: 'hero', 1: 'caseStudyCards', 3: 'newsletterBand' },
    meta: {
      title: 'Our Work: Custom Shopify Stores | Duha Media',
      description:
        "Custom Shopify stores we've designed and built from scratch for Chicago businesses. Case studies are published once each client approves them.",
    },
    ops: [
      ['set', 'layout[0].accentPhrase', 'so far.'],
      ['set', 'layout[1].pricingNote', 'Builds start at $7K. Marketing: three plans, settled quarterly.'],
      ['set', 'layout[1].fallbackMetrics[0].value', '7'],
      ['set', 'layout[1].fallbackMetrics[0].sub', CAP_REASON],
      ['set', 'layout[1].fallbackMetrics[1].value', '2'],
      ['set', 'layout[1].fallbackMetrics[1].sub', 'Build your store. Then grow it.'],
      ['set', 'layout[3].line', 'One useful email a month. Straight from the work.'],
    ],
  },
  {
    slug: 'services',
    expect: { 0: 'hero', 1: 'twoTrackPanels', 2: 'twoTrackPanels', 3: 'newsletterBand', 4: 'phaseTimeline', 5: 'phaseTimeline', 6: 'testimonialRow', 8: 'finalCTA' },
    meta: {
      title: 'Shopify Build and Marketing Services | Duha Media',
      description:
        'Two jobs, one team. We build your custom Shopify store from scratch, then grow it with ads, social content and search. Based in Chicago.',
    },
    ops: [
      ['set', 'layout[0].heading', 'We build it. Then we grow it.'],
      ['set', 'layout[0].accentPhrase', 'grow it.'],
      ['set', 'layout[0].body', 'Two jobs, one team. Start with the store, or start with the marketing.'],
      ['set', 'layout[0].phaseStrip[0].label', 'Build your store'],
      ['set', 'layout[0].phaseStrip[1].label', 'Grow your store'],
      ['set', 'layout[0].phaseStrip[2].label', 'You own it'],
      [
        'set',
        'layout[1].panels[0].body',
        "For a business with no online store, or one that doesn't show what you make. A custom Shopify theme built from scratch, connected to TikTok, Instagram and Facebook Shop. Yours from launch.",
      ],
      ['set', 'layout[1].panels[0].pricingNote', BUILD_PRICE],
      [
        'set',
        'layout[1].panels[1].body',
        "For a store that isn't reaching new customers. Paid ads first, then social content, collaborations, search and a newsletter, run by one team.",
      ],
      ['set', 'layout[1].panels[1].pricingNote', 'Three plans, settled quarterly.'],
      ['set', 'layout[1].panels[1].link.label', 'See the marketing →'],
      ['set', 'layout[2].heading', 'Two jobs. One team.'],
      ['set', 'layout[2].conclusion', 'One team through both phases, so the person who built your store is the one marketing it.'],
      ['set', 'layout[2].panels[0].label', null],
      ['set', 'layout[2].panels[0].claim', null],
      // Contrast variant needs struck claims (X19 removes them) → equal variant, bodies from approved site copy.
      ['set', 'layout[2].variant', 'equal'],
      ['set', 'layout[2].panels[0].title', "A store nobody visits doesn't sell."],
      ['set', 'layout[2].panels[0].body', 'The person who designed it runs the ads, so the store and the marketing say the same thing.'],
      ['set', 'layout[2].panels[1].label', null],
      ['set', 'layout[2].panels[1].claim', null],
      ['set', 'layout[2].panels[1].title', 'One person knows your store from the first sketch to the latest ad.'],
      ['set', 'layout[2].panels[1].body', 'No briefing a new agency. No five freelancers who never talk to each other.'],
      ['set', 'layout[3].line', NEWS_LINE],
      ['set', 'layout[4].phases[0].title', 'Build your store'],
      [
        'set',
        'layout[4].phases[0].body',
        'A Shopify theme designed and coded from scratch around your brand and products, with Shopify Analytics and Microsoft Clarity set up so you can see what visitors do.',
      ],
      ['set', 'layout[4].phases[1].title', 'Grow your store'],
      [
        'set',
        'layout[4].phases[1].body',
        'Paid ads, social content filmed in person each month, collaborations, Google Business Profile, SEO and a newsletter, run by the people who built your store.',
      ],
      ['set', 'layout[4].phases[2].title', 'You own it.'],
      [
        'set',
        'layout[4].phases[2].body',
        'The store, the theme code and the domain are yours from launch. Every ad, post, landing page and account is in your name too. Nothing is held back, and nothing is rented to you.',
      ],
      ['set', 'layout[5].closingLine', "Nothing is signed before step 02. If the plan doesn't fit, it stops there, and you've lost nothing but a call."],
      ['set', 'layout[5].steps[0].title', 'A call'],
      ['set', 'layout[5].steps[0].detail', 'Your business, your customers and your goals. We say which job fits, including “neither, yet.”'],
      ['set', 'layout[5].steps[0].tag', 'Day 0'],
      ['set', 'layout[5].steps[1].detail', "Scope and price in writing, with the steps and what you'll approve along the way."],
      ['set', 'layout[5].steps[1].tag', null],
      ['set', 'layout[5].steps[1].outcomes[0].text', 'A written scope and price, before you commit'],
      ['set', 'layout[5].steps[2].detail', 'The same person through both phases. No account managers, no middlemen.'],
      ['set', 'layout[5].steps[2].tag', null],
      ['set', 'layout[5].steps[2].outcomes[0].text', 'A direct line to the person doing the work'],
      ['set', 'layout[6].studyCard.show', false],
      ['set', 'layout[8].heading', 'Start with a call. Leave with a written plan.'],
    ],
  },
  {
    slug: 'services/shopify-theme-development',
    expect: { 0: 'hero', 1: 'twoTrackPanels', 2: 'specLedger', 3: 'specLedger', 4: 'phaseTimeline', 5: 'caseStudyCards' },
    meta: {
      title: 'Custom Shopify Store Design in Chicago | Duha Media',
      description:
        'A Shopify store designed and coded from scratch, around your brand and products. No templates. You own the store, code and domain. Builds start at $7K.',
    },
    ops: [
      ['set', 'layout[0].eyebrow', 'Phase 01 — build your store'],
      ['set', 'layout[0].heading', 'Your custom Shopify store'],
      ['set', 'layout[0].accentPhrase', 'custom Shopify store'],
      ['set', 'layout[0].body', 'Six steps from first call to launch. Designed with you screen by screen, coded from scratch, and yours from day one.'],
      ['set', 'layout[0].pricingNote', 'Builds start at $7K'],
      ['set', 'layout[0].subNote', 'Connected to TikTok Shop, Instagram Shop and Facebook Shop at launch.'],
      ['set', 'layout[0].breadcrumb[2].label', 'Phase 01 — build your store'],
      ['set', 'layout[1].conclusion', 'Your price is set on the call, in writing, before anything is signed.'],
      ['set', 'layout[1].panels[0].body', 'Keep your products, customers and domain. We redesign the store around them and rebuild the theme from scratch.'],
      ['set', 'layout[1].panels[0].pricingNote', BUILD_PRICE],
      ['set', 'layout[1].panels[0].link.label', 'Talk about your current store'],
      ['set', 'layout[1].panels[1].body', 'A blank page and the same six steps: discovery, research, brand, design, build and launch.'],
      ['set', 'layout[2].items[3].line', 'Checkout: as few steps as it takes to place an order.'],
      ['set', 'layout[3].pricingNote', 'Builds start at $7K. Exact scope is priced on the call.'],
      ['set', 'layout[3].items[0].title', 'Custom theme'],
      ['set', 'layout[3].items[0].what', 'Every template designed and coded from scratch around your products and the questions your buyers ask.'],
      ['set', 'layout[3].items[0].proof', 'Every page works on phone and desktop at launch.'],
      ['set', 'layout[3].items[1].title', 'Brand'],
      ['set', 'layout[3].items[3].what', 'Shopify Analytics and Microsoft Clarity set up before launch.'],
      ['set', 'layout[3].items[3].proof', 'You can see where visitors come from and what they do on each page.'],
      ['set', 'layout[3].items[4].proof', 'Pages are set up for search from launch day: titles, descriptions and structure.'],
      ['set', 'layout[3].items[5].proof', 'Every page and checkout works on launch day.'],
      ['set', 'layout[4].heading', 'Six steps, start to launch.'],
      ['set', 'layout[4].closingLine', 'Marketing comes next, if you want it.'],
      ['set', 'layout[4].steps[0].title', 'Discovery'],
      ['set', 'layout[4].steps[0].detail', 'We talk through your business, your customers and your goals.'],
      ['set', 'layout[4].steps[1].detail', 'We study your competitors, your positioning and who is winning in your market.'],
      ['set', 'layout[4].steps[2].title', 'Brand'],
      ['set', 'layout[4].steps[2].detail', 'One meeting to set your colors, typography and look.'],
      ['set', 'layout[4].steps[3].detail', "We design every screen of the store and revise it with you until it's right."],
      ['set', 'layout[4].steps[4].title', 'Build'],
      ['set', 'layout[4].steps[4].detail', 'We code the approved design into a custom theme, through our own AI-assisted build pipeline.'],
      ['set', 'layout[4].steps[5].detail', "We connect your shops and push the store live. It's yours."],
      ['set', 'layout[5].fallbackHeading', 'Proof it works.'],
      ['set', 'layout[5].fallbackAccentPhrase', 'works.'],
      // SHP-4: typical length is [ASK Q1] — hide the stat until he answers.
      ['remove', 'layout[0].stats[0]'],
    ],
  },
  {
    slug: 'services/marketing',
    expect: { 0: 'hero', 1: 'specLedger', 2: 'specLedger', 3: 'phaseTimeline', 4: 'specLedger', 5: 'caseStudyCards', 7: 'finalCTA' },
    meta: {
      title: 'Shopify Marketing in Chicago | Duha Media',
      description:
        'Paid ads, social content filmed in person, collaborations, SEO and a newsletter, run by the team that built your store. Three plans, settled quarterly.',
    },
    ops: [
      ['set', 'layout[0].eyebrow', 'Phase 02 — grow your store'],
      ['set', 'layout[0].heading', 'Then we grow it.'],
      ['set', 'layout[0].accentPhrase', 'grow it.'],
      [
        'set',
        'layout[0].body',
        'Paid ads, social content, collaborations, search and a newsletter, run by the team that built your store. Every plan includes all of it.',
      ],
      ['set', 'layout[0].pricingNote', PLANS],
      ['set', 'layout[0].subNote', 'Two-quarter terms that renew. Cancel with notice before the next term.'],
      ['set', 'layout[0].breadcrumb[2].label', 'Phase 02 — grow your store'],
      ['set', 'layout[1].eyebrow', 'What every plan includes'],
      ['set', 'layout[1].items[0].title', 'Paid ads'],
      ['set', 'layout[1].items[1].title', 'Social content'],
      ['set', 'layout[1].items[2].title', 'Collaborations'],
      ['set', 'layout[1].items[3].title', 'Google Business Profile'],
      ['set', 'layout[1].items[4].title', 'SEO and GEO'],
      ['set', 'layout[1].items[5].title', 'Newsletter'],
      ['set', 'layout[1].hub.kicker', 'Every quarter'],
      ['set', 'layout[1].hub.heading', 'You see what we see.'],
      [
        'set',
        'layout[1].hub.body',
        "Every quarter you get the numbers your plan is settled on, what we ran, what it returned and what we'll change next. The ad and shop accounts are in your name, so you can check any of it yourself.",
      ],
      ['set', 'layout[1].hub.note', 'One readout, from the person who ran the work.'],
      ['set', 'layout[2].pricingNote', 'Every plan includes all of it. Ads first, then what the numbers show.'],
      ['set', 'layout[2].items[0].title', 'Newsletter'],
      ['set', 'layout[2].items[0].line', 'Your customers, in their inbox.'],
      [
        'set',
        'layout[2].items[0].what',
        'Regular emails to the customers who already know you, sent through Shopify Email. How often depends on what we have to say; every two weeks is the usual aim.',
      ],
      ['set', 'layout[2].items[0].proofLabel', null],
      ['set', 'layout[2].items[0].proof', null],
      [
        'set',
        'layout[2].items[1].what',
        'Meta ads on Facebook and Instagram, with a landing page built for each campaign, so the ad and the store say the same thing. This is where we start.',
      ],
      ['set', 'layout[2].items[1].proofLabel', "What you'll see"],
      ['set', 'layout[2].items[1].proof', 'What you spent, what it brought in, and what each new customer cost.'],
      ['set', 'layout[2].items[2].title', 'Social content and collaborations'],
      [
        'set',
        'layout[2].items[2].what',
        'We film with you in person each month, then post to Facebook, Instagram, Reels and TikTok. We also scout and manage influencer collaborations; nothing is sent without your approval.',
      ],
      ['set', 'layout[2].items[2].proofLabel', null],
      ['set', 'layout[2].items[2].proof', null],
      ['set', 'layout[2].items[3].title', 'SEO and GEO'],
      ['set', 'layout[2].items[3].line', 'Found in search, and recommended by AI tools.'],
      ['set', 'layout[2].items[3].what', 'Showing up when people search for what you sell, and getting recommended when they ask AI tools like ChatGPT.'],
      ['set', 'layout[2].items[3].proofLabel', null],
      ['set', 'layout[2].items[3].proof', null],
      ['set', 'layout[2].items[4].title', 'Google Business Profile'],
      ['set', 'layout[2].items[4].what', 'Your listing on Google Search and Maps, kept current, with review growth and prompt replies.'],
      ['set', 'layout[2].items[4].proofLabel', null],
      ['set', 'layout[2].items[4].proof', null],
      [
        'set',
        'layout[3].steps',
        [
          { number: '01', title: 'Plan', phase: '1', detail: 'A planning call each month: up to an hour, usually less.', tag: null, isSignOff: false, outcomes: [] },
          { number: '02', title: 'Film', phase: '1', detail: 'Three to four hours in person. Scripts and articles are written in the same session.', tag: null, isSignOff: false, outcomes: [] },
          { number: '03', title: 'Ads live', phase: '1', detail: 'Budget follows evidence.', tag: null, isSignOff: false, outcomes: [] },
          { number: '04', title: 'Social and collaborations', phase: '1', detail: "Posts and collaborations built from each month's filming.", tag: null, isSignOff: false, outcomes: [] },
          { number: '05', title: 'Search and newsletter', phase: '1', detail: 'SEO, GEO and the newsletter, building over time.', tag: null, isSignOff: false, outcomes: [] },
        ],
      ],
      ['set', 'layout[3].closingLine', 'Everything we run stays in your name.'],
      ['set', 'layout[4].items[1].line', 'Your Google Business Profile, run like the ads: reviews grown, replies sent promptly, results checked.'],
      ['set', 'layout[5].fallbackHeading', 'Marketing, in numbers.'],
      ['set', 'layout[5].fallbackAccentPhrase', 'in numbers.'],
      ['set', 'layout[5].pricingNote', PLANS],
      ['set', 'layout[5].fallbackMetrics[0].sub', 'Ads, social, collaborations, GBP, search, newsletter'],
      ['set', 'layout[5].fallbackMetrics[1].label', 'Person accountable'],
      ['set', 'layout[5].fallbackMetrics[1].sub', 'The founder runs the work himself'],
      ['set', 'layout[5].fallbackMetrics[2].value', '6 MO'],
      ['set', 'layout[5].fallbackMetrics[2].sub', 'Two quarters: long enough to film, run ads and see what works.'],
      ['set', 'layout[7].heading', 'One team. One person accountable.'],
      ['remove', 'layout[2].items[5]'], // E-06 CRM: not offered
    ],
  },
  {
    slug: 'testimonials',
    expect: { 0: 'hero' },
    noindex: true,
    meta: {
      title: 'Client Testimonials | Duha Media',
      description: 'What Chicago business owners say about working with Duha Media, quoted exactly and published with their permission.',
    },
    ops: [
      ['set', 'layout[0].heading', "Don't take our word for it. Take theirs."],
      ['set', 'layout[0].body', 'Clients in their own words, on camera and in writing. Quoted exactly, with their permission.'],
    ],
  },
  {
    slug: 'about',
    expect: { 0: 'hero', 1: 'richContent', 2: 'metricEvent', 3: 'teamIntro' },
    meta: {
      title: 'About Duha Media: Chicago Shopify Developer',
      description:
        'One founder, no layers. Abdurrahman Choudhary designs, builds and markets custom Shopify stores for owner-operated businesses in Chicago.',
    },
    ops: [
      ['set', 'layout[0].heading', 'One founder. Your store, built and grown.'],
      ['set', 'layout[0].accentPhrase', 'built and grown.'],
      ['set', 'layout[0].body', 'Based in Chicago. We work with businesses across Chicago and the Chicagoland area.'],
      ['set', 'layout[0].stats[0].value', 'Chicago, Illinois'],
      ['set', 'layout[0].stats[1].value', 'Build · Grow'],
      ['set', 'layout[0].stats[2].value', '7 clients'],
      [
        'set',
        'layout[1].body',
        root(
          h('h2', 'How we work'),
          p(
            'Two phases, one team. First we build your store: discovery, research, brand, design, build and launch, with you approving the design screen by screen. The store, the theme code and the domain are yours from launch.',
          ),
          p(
            'Then, if you want it, we grow it. Paid ads come first, then social content filmed with you each month, collaborations, search and a newsletter. We shift effort to whatever the numbers show is working. Marketing is optional, and everything we run stays in your name.',
          ),
          h('h2', 'Values'),
          p(
            "Local owners pour themselves into what they make. Too often, the store and the marketing behind it don't show it, and that keeps good businesses from reaching the rest of Chicago. We exist to close that gap.",
          ),
          p(
            "We do it by working side by side with you: one person accountable, no middlemen, nothing built on a template. We cap the client list so every store gets the hours it needs. And we stay with you until the business is set up to succeed, because we're here to build businesses in our community, not just to make a sale.",
          ),
        ),
      ],
      ['set', 'layout[2].note', null],
      ['set', 'layout[2].items[0].value', '7'],
      ['set', 'layout[2].items[1].value', '3'],
      ['set', 'layout[2].items[3].value', '~55'],
      ['set', 'layout[2].items[3].label', 'Hands-on hours per build'],
      [
        'set',
        'layout[3].body',
        "The person who plans your store is the person who builds it. I'm Abdurrahman Choudhary, a Chicago developer and entrepreneur who started out freelancing websites and now builds and markets Shopify stores for local business owners.",
      ],
      ['remove', 'layout[2].items[2]'], // revenue band: not approved
    ],
  },
  {
    slug: 'thank-you',
    expect: { 0: 'hero', 2: 'newsletterBand' },
    noindex: true,
    ops: [
      ['set', 'layout[0].heading', 'Got it. See you on the call.'],
      ['set', 'layout[0].accentPhrase', 'See you on the call.'],
      ['set', 'layout[0].body', "We'll read what you sent before we talk, so the call goes straight to your store, your customers and your goals."],
      ['set', 'layout[2].line', NEWS_LINE],
    ],
  },
  {
    slug: 'book-a-call',
    expect: { 0: 'hero', 1: 'bookingEmbed' },
    meta: {
      title: 'Book a Call | Duha Media',
      description: "Talk through your business, your customers and your goals with Duha Media's founder. We'll tell you honestly if we're the right fit.",
    },
    ops: [
      ['set', 'layout[0].heading', '30 minutes. Straight answers.'],
      ['set', 'layout[0].accentPhrase', 'Straight answers.'],
      ['set', 'layout[0].subNote', "For owner-operated businesses in Chicago that make something great, but whose online store doesn't show it yet."],
      [
        'set',
        'layout[1].body',
        "We'll talk through your business, your customers and your goals, and tell you honestly if we're the right fit. The calendar opens in a new tab; this page shows what to prepare.",
      ],
      ['set', 'layout[1].fallbackBody', "The calendar isn't loading right now. Email hello@duhamedia.com with two or three times that suit you, and we'll confirm one."],
    ],
  },
  {
    slug: 'faq',
    expect: { 0: 'hero' },
    meta: {
      title: 'Shopify Build and Marketing FAQ | Duha Media',
      description: 'Straight answers on cost, ownership, contracts and timelines for a custom Shopify store and marketing from Duha Media in Chicago.',
    },
    ops: [
      ['set', 'layout[0].heading', 'Straight answers.'],
      ['set', 'layout[0].accentPhrase', 'Straight answers.'],
    ],
  },
  {
    slug: 'contact',
    expect: { 0: 'hero', 1: 'formEmbed' },
    meta: {
      title: 'Contact Duha Media | Chicago',
      description: 'Email hello@duhamedia.com or call 312-296-4564. Book a call for questions about fit and pricing.',
    },
    ops: [
      ['set', 'layout[0].heading', 'Thinking of working with us? Book a call.'],
      ['set', 'layout[0].accentPhrase', 'Book a call.'],
      [
        'set',
        'layout[0].body',
        "Questions about fit and pricing get real answers on a call. Everything else — press, partnerships, or if you're already a client — use the form below or email hello@duhamedia.com.",
      ],
      ['set', 'layout[1].doneHeading', "Message received. We'll reply by email."],
    ],
  },
  { slug: 'lp/sample-campaign', expect: {}, unpublish: true, ops: [] },
  {
    slug: 'newsletter',
    expect: { 0: 'hero', 2: 'testimonialRow' },
    ops: [
      ['set', 'layout[0].heading', 'One useful email a month. Straight from the work.'],
      ['set', 'layout[0].accentPhrase', 'Straight from the work.'],
      [
        'set',
        'layout[0].body',
        "What we're learning building and marketing Shopify stores for Chicago businesses: what worked, what didn't, and what we'd do differently.",
      ],
      ['set', 'layout[2].leadMetric.value', null],
      ['set', 'layout[2].leadMetric.sub', null],
      ['remove', 'layout[0].stats[1]'], // issue length: [ASK Q8]
    ],
  },
  {
    slug: 'links',
    expect: { 0: 'linkStack' },
    ops: [['set', 'layout[0].identity.fallbackLine', 'Custom Shopify stores · Chicago']],
  },
  {
    slug: 'reviews',
    expect: { 0: 'hero', 1: 'reviewWall' },
    noindex: true,
    ops: [
      ['set', 'layout[0].heading', 'Reviews you can check.'],
      ['set', 'layout[0].body', 'Every review links to where it was posted, so you can read it in full.'],
      ['set', 'layout[1].wallNote', 'Quoted exactly as posted.'],
      ['remove', 'layout[1].inserts[0]'], // placeholder metric tile
    ],
  },
]

/* ---------------- runners ---------------- */

type Ctx = { payload: Payload; req: PayloadRequest; done: string[]; skipped: string[] }

const guard = async (c: Ctx, what: string, run: () => Promise<unknown>): Promise<void> => {
  try {
    await run()
    c.done.push(what)
  } catch (err) {
    if (err instanceof ValidationError) {
      c.skipped.push(`${what}: ${err.message} ${JSON.stringify(err.data?.errors ?? [])}`)
      return
    }
    throw err
  }
}

async function patchPage(c: Ctx, patch: PagePatch): Promise<void> {
  const { payload, req } = c
  const found = await payload.find({ collection: 'pages', where: { slug: { equals: patch.slug } }, limit: 1, depth: 0, req, overrideAccess: true })
  const doc = found.docs[0] as any
  if (!doc) return void c.skipped.push(`page ${patch.slug}: not found`)

  for (const [i, type] of Object.entries(patch.expect)) {
    if (doc.layout?.[Number(i)]?.blockType !== type) {
      return void c.skipped.push(`page ${patch.slug}: layout[${i}] is ${doc.layout?.[Number(i)]?.blockType ?? 'missing'}, expected ${type}`)
    }
  }
  if (patch.unpublish) {
    return guard(c, `page ${patch.slug} unpublished`, () =>
      payload.update({ collection: 'pages', id: doc.id, data: { _status: 'draft' }, depth: 0, req, overrideAccess: true, context: CTX }),
    )
  }
  try {
    for (const op of patch.ops) apply(doc, op)
  } catch (err) {
    return void c.skipped.push(`page ${patch.slug}: ${(err as Error).message}`)
  }
  const data: Record<string, unknown> = { layout: doc.layout, _status: 'published' }
  if (patch.meta) data.meta = { ...(doc.meta ?? {}), ...patch.meta }
  if (patch.noindex !== undefined) data.noindex = patch.noindex
  await guard(c, `page ${patch.slug}`, () => payload.update({ collection: 'pages', id: doc.id, data, depth: 0, req, overrideAccess: true, context: CTX }))
}

async function patchGlobals(c: Ctx): Promise<void> {
  const { payload, req } = c
  const o = { depth: 0, req, overrideAccess: true, context: CTX } as const

  const site = (await payload.findGlobal({ slug: 'site-settings', ...o })) as any
  await guard(c, 'site-settings', () =>
    payload.updateGlobal({
      slug: 'site-settings',
      data: {
        footerTagline: 'Made by hand. Then made known.',
        location: { ...site.location, locality: 'Chicago', displayLine: 'Chicago, IL', latitude: 41.8781, longitude: -87.6298 },
        templateDefaults: {
          ...site.templateDefaults,
          newsletterLine: NEWS_LINE,
          finalCtaHeading: 'Ready to build a store that shows what you make?',
        },
      },
      ...o,
    }),
  )

  const sc = (await payload.findGlobal({ slug: 'scarcity', ...o })) as any
  const BUILD_REASON = 'Each build gets about 55 hands-on hours, about 30 of them on design. No templates.'
  const statements = (sc.statements ?? []).map((s: any) => {
    if (s.key === 'engines-line') {
      return { ...s, statistic: 'We cap at {capacity} clients.', reason: 'The founder does the work himself, so every store gets the hours it needs.' }
    }
    if (typeof s.reason === 'string' && s.reason.startsWith('Each build gets about 55')) return { ...s, reason: BUILD_REASON }
    return s
  })
  await guard(c, 'scarcity', () => payload.updateGlobal({ slug: 'scarcity', data: { statements }, ...o }))

  const nav = (await payload.findGlobal({ slug: 'navigation', ...o })) as any
  const drop = (links: any[] = []) => links.filter((l) => !['/testimonials', '/reviews'].includes(l?.link?.url))
  await guard(c, 'navigation', () =>
    payload.updateGlobal({
      slug: 'navigation',
      data: {
        header: { ...nav.header, links: drop(nav.header?.links) },
        footer: {
          ...nav.footer,
          standard: {
            ...nav.footer?.standard,
            columns: (nav.footer?.standard?.columns ?? []).map((col: any) => ({ ...col, links: drop(col.links) })),
            newsletterNudge: { ...nav.footer?.standard?.newsletterNudge, line: 'One useful email a month. Straight from the work.' },
          },
        },
      },
      ...o,
    }),
  )
}

async function patchLibrary(c: Ctx): Promise<void> {
  const { payload, req } = c
  const o = { depth: 0, req, overrideAccess: true, context: CTX } as const

  // Testimonials: every live one is a placeholder (T-1 under a real name). Hide all until real, approved quotes exist.
  const ts = await payload.find({ collection: 'testimonials', where: { _status: { equals: 'published' } }, limit: 100, ...o })
  for (const t of ts.docs as any[]) {
    if (!/\[|placeholder/i.test(String(t.quote))) continue
    await guard(c, `testimonial ${t.id} unpublished`, () => payload.update({ collection: 'testimonials', id: t.id, data: { _status: 'draft' }, ...o }))
  }

  // Abu Oud case study: hidden pending client sign-off (reply Q12).
  const cs = await payload.find({ collection: 'case-studies', where: { slug: { equals: 'abu-oud-shopify-store' } }, limit: 1, ...o })
  if (cs.docs[0]) await guard(c, 'case study abu-oud unpublished', () => payload.update({ collection: 'case-studies', id: cs.docs[0].id, data: { _status: 'draft' }, ...o }))

  const cl = await payload.find({ collection: 'clients', where: { name: { equals: 'Abu OUd' } }, limit: 1, ...o })
  if (cl.docs[0]) await guard(c, 'client Abu Oud spelling', () => payload.update({ collection: 'clients', id: cl.docs[0].id, data: { name: 'Abu Oud' }, ...o }))

  const tm = await payload.find({ collection: 'team-members', where: { name: { equals: 'Abdur-Rahman Ch' } }, limit: 1, ...o })
  if (tm.docs[0]) {
    await guard(c, 'team member name', () =>
      payload.update({ collection: 'team-members', id: tm.docs[0].id, data: { name: 'Abdurrahman Choudhary', role: 'Founder, Duha Media' }, ...o }),
    )
  }

  const alts: [string, string][] = [
    ["Abdur-Rahman's profile photo", 'Abdurrahman Choudhary, founder of Duha Media'],
    ['Duha Media service area, Lombard', "Map of Chicago, Duha Media's service area"],
  ]
  for (const [from, to] of alts) {
    const m = await payload.find({ collection: 'media', where: { alt: { equals: from } }, limit: 1, ...o })
    if (m.docs[0]) await guard(c, `media alt "${to}"`, () => payload.update({ collection: 'media', id: m.docs[0].id, data: { alt: to }, ...o }))
  }

  await patchFaqs(c)
}

type FaqCat = 'pricing-contracts' | 'builds' | 'marketing' | 'process-trust'
type FaqRow = { match: string; question: string; category: FaqCat; sortOrder: number; answer: string }

const FAQS: FaqRow[] = [
  {
    match: 'What does it cost?',
    question: 'What does it cost?',
    category: 'pricing-contracts',
    sortOrder: 1,
    answer:
      'Builds start at $7K. Marketing is paid through one of three plans, settled quarterly: Standard (20% of online revenue or 30% of online profit, nothing upfront), Prepaid ($1,000 for the first quarter, then $1,500 a quarter), or Ramp-up (10% of online revenue the first quarter, then the Standard rate). Ad spend and influencer costs are paid by you, separately. Your exact price is set on the call, in writing, before anything is signed.',
  },
  {
    match: 'What happens at $100,000 a year?',
    question: 'What happens at $100,000 a year?',
    category: 'pricing-contracts',
    sortOrder: 2,
    answer:
      "Your plan switches to a fixed rate once your online store reaches $100,000 a year. The rate is set for your store, based on the work it needs, and agreed in writing. When your quarterly results show you're on pace, we offer the switch early. It's your choice until you reach the revenue.",
  },
  {
    match: 'Do you lock clients into retainers?',
    question: 'Do you lock clients into retainers?',
    category: 'pricing-contracts',
    sortOrder: 3,
    answer:
      'No. The marketing runs on two-quarter terms that renew, and either side can cancel with notice before the next term. You own everything we make for you: the store, the code, the domain, the content and the accounts.',
  },
  {
    match: 'How long are contracts?',
    question: 'How long are contracts?',
    category: 'pricing-contracts',
    sortOrder: 4,
    answer: 'Two quarters, then they renew for another two. Either side can cancel by giving notice before the next term starts, and the current term is finished in full.',
  },
  {
    match: 'Who pays for ads?',
    question: 'Who pays for ads?',
    category: 'pricing-contracts',
    sortOrder: 5,
    answer: 'You do. Ad spend, influencer costs and other marketing expenses are separate from our fees.',
  },
  {
    match: 'I already have a store. Do I have to start over?',
    question: 'I already have a store. Do I have to start over?',
    category: 'builds',
    sortOrder: 1,
    answer: 'No. Your products, customers and domain stay. We redesign the store around them and build the theme from scratch.',
  },
  {
    match: 'Can I do the build without the engine?',
    question: 'Can I do the build without the marketing?',
    category: 'builds',
    sortOrder: 2,
    answer: "Yes. The marketing steps are optional. We'll tell you on the call whether marketing makes sense for your store right now.",
  },
  {
    match: 'How long does a build take?',
    question: 'How long does a build take?',
    category: 'builds',
    sortOrder: 3,
    // Weeks are [ASK Q1]; only the confirmed hours go live.
    answer: 'A build takes about 55 hands-on hours, about 30 of them on design alone.',
  },
  {
    match: 'Do you use AI?',
    question: 'Do you use AI?',
    category: 'builds',
    sortOrder: 4,
    answer: 'Yes, in our build pipeline, to code faster. The design is still planned and approved with you, screen by screen.',
  },
  {
    match: 'Is there a minimum term for the engine?',
    question: 'Is there a minimum term for marketing?',
    category: 'marketing',
    sortOrder: 1,
    answer:
      "Yes: two quarters. That's long enough to film, run ads and see what works before deciding. After that it renews for two quarters at a time, and you can cancel with notice before the next term.",
  },
  {
    match: 'Can I just get ads?',
    question: 'Can I just get ads?',
    category: 'marketing',
    sortOrder: 2,
    answer:
      'Every plan includes the full toolkit, and paid ads are where we start. If the numbers show organic content or collaborations will do more for your store, we shift effort there. You pay the same plan either way.',
  },
  {
    match: 'Will this work for my business?',
    question: 'Will this work for my business?',
    category: 'process-trust',
    sortOrder: 1,
    answer:
      "It's built for owner-operated businesses in Chicago with a proven product, whose online store and marketing don't show it yet. We don't guarantee results. On the call, we'll tell you honestly whether we're the right fit.",
  },
  {
    match: 'What makes you different?',
    question: 'What makes you different?',
    category: 'process-trust',
    sortOrder: 2,
    answer:
      'One person is accountable for your store, from the first call to the marketing. No templates: every store is designed and coded from scratch. No middlemen: the founder does the work, in-house. And we cap at 7 clients, so every store gets the hours it needs.',
  },
  {
    match: 'Do I own my store?',
    question: 'Do I own my store?',
    category: 'process-trust',
    sortOrder: 3,
    answer: 'Yes. The store, the theme code and the domain are yours from launch. Ads, content and accounts are in your name too.',
  },
  {
    match: 'Where are you based?',
    question: 'Where are you based?',
    category: 'process-trust',
    sortOrder: 4,
    answer: 'Chicago. We film in person, so we work with businesses in Chicago and the Chicagoland area.',
  },
]

async function patchFaqs(c: Ctx): Promise<void> {
  const { payload, req } = c
  const o = { depth: 0, req, overrideAccess: true, context: CTX } as const
  for (const f of FAQS) {
    const found = await payload.find({ collection: 'faqs', where: { question: { equals: f.match } }, limit: 1, ...o })
    const data = { question: f.question, category: f.category, sortOrder: f.sortOrder, answer: root(p(f.answer)), _status: 'published' as const }
    const existing = found.docs[0]
    await guard(c, `faq "${f.question}"`, () =>
      existing
        ? payload.update({ collection: 'faqs', id: existing.id, data, ...o })
        : payload.create({ collection: 'faqs', data: { ...data, listOnFaqPage: true }, ...o }),
    )
  }
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  req.context = { ...req.context, ...CTX }
  const c: Ctx = { payload, req, done: [], skipped: [] }
  await patchLibrary(c)
  await patchGlobals(c)
  for (const patch of PAGES) await patchPage(c, patch)
  payload.logger.info(`copy round 1: applied ${c.done.length}: ${c.done.join(' | ')}`)
  if (c.skipped.length) payload.logger.warn(`copy round 1: SKIPPED ${c.skipped.length}: ${c.skipped.join(' | ')}`)
}

// Never delete or roll back content; version history holds every previous version.
export async function down(_args: MigrateDownArgs): Promise<void> {}
