import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { guard, patchPage, report, type PagePatch, type PatchCtx } from '../lib/contentPatch'
import { p, root } from '../showcase/lexical'

/**
 * Copy round 2 (docs/duha-website-copy-reply-02.md, 2026-11-07): the founder's
 * answers to round 1's questions. Founder answers: 5-week builds, plan within
 * 72 hours, 3 in progress, revisions offered, sign-offs (payment, theme build,
 * marketing start, renewal), free 45-minute call, monthly newsletter, Abu Oud
 * study approved, all build promises real, clients across the US.
 * Paths against the production snapshot taken after v1.0.14.
 */

const CONTEXT = { disableRevalidate: true, copyRound: 2 }
const STUDY_METRIC = { value: '50+', label: 'Products listed', sub: 'Abu Oud · Oud and attar' }

const PAGES: PagePatch[] = [
  {
    slug: 'home',
    expect: { 0: 'hero', 2: 'twoTrackPanels', 6: 'testimonialRow' },
    ops: [
      [
        'set',
        'layout[0].body',
        'We design and build your Shopify store from scratch, with no templates. Then we run the marketing that brings in customers, so the store you paid for actually sells. Based in Chicago, working with businesses across the United States.',
      ],
      [
        'set',
        'layout[2].panels[0].body',
        "A Shopify store built from scratch, or a revision of the one you have. No templates. Every page is designed around your brand and your products, then built and revised with you until it's right. You get a store that looks like your business and is easy to buy from.",
      ],
      ['set', 'layout[6].studyCard.show', true],
      ['set', 'layout[6].studyCard.fallbackMetric', STUDY_METRIC],
    ],
  },
  {
    slug: 'work',
    expect: { 3: 'newsletterBand', 4: 'finalCTA' },
    ops: [
      ['set', 'layout[3].heading', 'New studies go to the newsletter first.'],
      ['set', 'layout[4].heading', 'Want a store like these?'],
    ],
  },
  {
    slug: 'services',
    expect: { 1: 'twoTrackPanels', 5: 'phaseTimeline', 6: 'testimonialRow', 8: 'finalCTA' },
    ops: [
      [
        'set',
        'layout[1].panels[0].body',
        "For a business with no online store, or one that doesn't show what you make. A new theme built from scratch, or a revision of the store you have, connected to TikTok, Instagram and Facebook Shop. Yours from launch.",
      ],
      ['set', 'layout[5].closingLine', "Nothing is signed or paid before step 02. If the plan doesn't fit, it stops there, and you've lost nothing but a free call."],
      ['set', 'layout[5].steps[0].title', 'A free call, 45 minutes'],
      ['set', 'layout[5].steps[1].detail', "Scope and price in writing within 72 hours, with the steps and what you'll sign off along the way."],
      ['set', 'layout[5].steps[1].tag', 'Within 72 hours'],
      ['set', 'layout[5].steps[1].outcomes[0].text', 'A written scope and price, before you pay anything'],
      ['set', 'layout[5].steps[2].tag', 'After you sign off'],
      ['set', 'layout[6].studyCard.show', true],
      ['set', 'layout[6].studyCard.fallbackMetric', STUDY_METRIC],
      ['set', 'layout[8].heading', 'Start with a call. Leave with a written plan in 72 hours.'],
    ],
  },
  {
    slug: 'services/shopify-theme-development',
    expect: { 0: 'hero', 1: 'twoTrackPanels', 3: 'specLedger', 4: 'phaseTimeline' },
    ops: [
      // SHP-3/SHP-4: the stat carries "5 weeks / Typical build"; subNote keeps the shop-sync line.
      ['set', 'layout[0].stats', [{ value: '5 weeks', label: 'Typical build' }]],
      ['set', 'layout[1].conclusion', 'Your price is set in writing within 72 hours of the call, before anything is signed.'],
      [
        'set',
        'layout[1].panels[0].body',
        "Keep what's already working in your current store. We redesign and rebuild the parts that aren't, with no template underneath.",
      ],
      // L12: whether a revision starts at $7K is still open (Q23).
      ['set', 'layout[1].panels[0].pricingNote', 'Priced on the call.'],
      ['set', 'layout[1].panels[0].link.label', 'Start with a revision'],
      ['set', 'layout[1].panels[1].body', 'A blank page and the same six steps, from discovery to launch.'],
      [
        'set',
        'layout[3].items[1].what',
        'Category read, buyer read, and the sentence the homepage has to earn — agreed with you before a screen is designed.',
      ],
      ['set', 'layout[3].items[2].proof', 'Customers find what they want without hunting for it.'],
      ['set', 'layout[3].items[4].proof', 'Pages indexed by Google and passing Core Web Vitals at launch.'],
      ['set', 'layout[3].items[5].what', 'A launch checklist, monitoring after launch, and a walkthrough of your theme so you can run it yourself.'],
      ['set', 'layout[3].items[5].proof', 'We watch the store after launch, so nothing breaks unnoticed.'],
      ['set', 'layout[4].heading', 'Six steps, two sign-offs.'],
      [
        'set',
        'layout[4].closingLine',
        'You sign off twice: when you pay to start, and when you approve the theme build. Marketing comes next, if you want it.',
      ],
      ['set', 'layout[4].steps[0].tag', 'Your sign-off: payment'],
      ['set', 'layout[4].steps[0].isSignOff', true],
      ['set', 'layout[4].steps[2].tag', 'Your feedback'],
      ['set', 'layout[4].steps[2].isSignOff', false],
      ['set', 'layout[4].steps[3].tag', 'Your feedback'],
      ['set', 'layout[4].steps[3].isSignOff', false],
      ['set', 'layout[4].steps[4].tag', 'Your sign-off: theme build'],
      ['set', 'layout[4].steps[4].isSignOff', true],
    ],
  },
  {
    slug: 'services/marketing',
    expect: { 0: 'hero', 2: 'specLedger' },
    ops: [
      ['set', 'layout[0].subNote', 'Two-quarter terms that renew. You approve each renewal.'],
      // L14: one order in both places (E-01 Paid ads … E-06 Newsletter); social and collaborations split.
      [
        'fn',
        (doc) => {
          const items: any[] = doc.layout[2].items
          const by = (t: string) => {
            const it = items.find((i) => i.title === t)
            if (!it) throw new Error(`marketing spec: no "${t}"`)
            return it
          }
          const social = by('Social content and collaborations')
          doc.layout[2].items = [
            { ...by('Paid ads'), code: 'E-01' },
            {
              ...social,
              code: 'E-02',
              title: 'Social content',
              what: 'We film with you in person each month, then post to Facebook, Instagram, Reels and TikTok.',
            },
            {
              code: 'E-03',
              title: 'Collaborations',
              line: 'Creators who already reach your customers.',
              whatLabel: social.whatLabel ?? 'What we run',
              what: 'We scout and manage influencer collaborations. Nothing is sent without your approval.',
            },
            { ...by('Google Business Profile'), code: 'E-04' },
            { ...by('SEO and GEO'), code: 'E-05' },
            { ...by('Newsletter'), code: 'E-06' },
          ]
        },
      ],
    ],
  },
  {
    slug: 'about',
    expect: { 0: 'hero' },
    meta: {
      description:
        'One founder, no layers. Abdurrahman Choudhary designs, builds and markets custom Shopify stores, from Chicago, for owner-operated businesses.',
    },
    ops: [['set', 'layout[0].body', 'Based in Chicago. We work with businesses in Chicago and across the United States.']],
  },
  {
    slug: 'thank-you',
    expect: { 0: 'hero', 1: 'formEmbed' },
    ops: [
      [
        'set',
        'layout[0].body',
        "45 minutes on your business, your customers and your goals. We'll read what you sent before we talk, and your written plan follows within 72 hours.",
      ],
      ['set', 'layout[1].reasons[1].text', 'The 45 minutes go to strategy, not intake'],
    ],
  },
  {
    slug: 'book-a-call',
    expect: { 0: 'hero', 1: 'bookingEmbed', 3: 'phaseTimeline' },
    meta: {
      description:
        "A free 45-minute call with Duha Media's founder about your business, your customers and your goals. A written plan follows within 72 hours.",
    },
    ops: [
      ['set', 'layout[0].eyebrow', 'Book a Free Growth Strategy Call'],
      ['set', 'layout[0].heading', '45 minutes. Straight answers.'],
      ['set', 'layout[0].accentPhrase', 'Straight answers.'],
      ['set', 'layout[0].subNote', "For owner-operated businesses that make something great, but whose online store doesn't show it yet."],
      [
        'set',
        'layout[0].callouts[0].text',
        "a free working session on your business, your customers and your goals, and whether we're the right fit.",
      ],
      [
        'set',
        'layout[1].body',
        "A free 45-minute call. We'll talk through your business, your customers and your goals, and tell you honestly if we're the right fit. The calendar opens in a new tab; this page shows what to prepare.",
      ],
      ['set', 'layout[3].steps[2].detail', 'A free 45-minute call on your business, your customers and your goals, and a clear answer on fit.'],
    ],
  },
  {
    slug: 'contact',
    expect: { 0: 'hero', 2: 'directContact' },
    meta: { description: 'Email hello@duhamedia.com or call 312-296-4564. Book a free 45-minute call for questions about fit and pricing.' },
    ops: [
      [
        'set',
        'layout[0].body',
        "Questions about fit and pricing get real answers on a free 45-minute call. Everything else — press, partnerships, or if you're already a client — use the form below or email hello@duhamedia.com.",
      ],
      ['set', 'layout[2].map.caption', 'Based in Chicago, IL, working with businesses across the United States.'],
    ],
  },
  {
    slug: 'newsletter',
    expect: { 1: 'postList' },
    meta: { description: "One email a month from Duha Media: what we're learning building and marketing Shopify stores, straight from the work." },
    ops: [
      [
        'set',
        'layout[1].emptyBody',
        "Each issue covers one store problem, what we did about it, and what we'd do differently. Join above and the first one lands in your inbox.",
      ],
    ],
  },
]

const FAQS: { match: string; question: string; category: 'pricing-contracts' | 'builds' | 'marketing' | 'process-trust'; sortOrder: number; answer: string }[] = [
  {
    match: 'I already have a store. Do I have to start over?',
    question: 'I already have a store. Do I have to start over?',
    category: 'builds',
    sortOrder: 1,
    answer:
      "No. We can revise the store you have: keep what's working, and redesign and rebuild what isn't. If it needs more than that, we'll build a new theme from scratch. We'll tell you which on the call.",
  },
  {
    match: 'How long does a build take?',
    question: 'How long does a build take?',
    category: 'builds',
    sortOrder: 3,
    answer: 'About 5 weeks. A build takes about 55 hands-on hours, about 30 of them on design alone.',
  },
  {
    match: 'Will this work for my business?',
    question: 'Will this work for my business?',
    category: 'process-trust',
    sortOrder: 1,
    answer:
      "It's built for owner-operated businesses with a proven product, whose online store and marketing don't show it yet. We don't guarantee results. On a free 45-minute call, we'll tell you honestly whether we're the right fit.",
  },
  {
    match: 'How do sign-offs work?',
    question: 'How do sign-offs work?',
    category: 'process-trust',
    sortOrder: 5,
    answer:
      'You sign off at four points: payment to start the build, the finished theme build, the start of marketing, and each renewal at two quarters. Nothing moves to the next stage without your approval.',
  },
  {
    match: 'Where are you based?',
    question: 'Where are you based?',
    category: 'process-trust',
    sortOrder: 4,
    answer: 'Chicago. We work with businesses in Chicago and across the United States.',
  },
]

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  req.context = { ...req.context, ...CONTEXT }
  const c: PatchCtx = { payload, req, context: CONTEXT, done: [], skipped: [] }
  const o = { depth: 0, req, overrideAccess: true, context: CONTEXT } as const

  // Q12: Abu Oud approved the case study — publish it again.
  const cs = await payload.find({ collection: 'case-studies', where: { slug: { equals: 'abu-oud-shopify-store' } }, limit: 1, draft: true, ...o })
  if (cs.docs[0]) await guard(c, 'case study abu-oud published', () => payload.update({ collection: 'case-studies', id: cs.docs[0].id, data: { _status: 'published' }, ...o }))

  const site = (await payload.findGlobal({ slug: 'site-settings', ...o })) as any
  await guard(c, 'site-settings', () =>
    payload.updateGlobal({
      slug: 'site-settings',
      data: {
        responseTimeNote: 'We reply by email.', // L6: 1 business day not confirmed (Q22)
        templateDefaults: { ...site.templateDefaults, finalCtaButton: { type: 'custom', newTab: false, url: '/book-a-call', label: 'Book a Free Call' } },
      },
      ...o,
    }),
  )

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

  for (const patch of PAGES) await patchPage(c, patch)
  report(c, 'copy round 2')
}

// Never delete or roll back content; version history holds every previous version.
export async function down(_args: MigrateDownArgs): Promise<void> {}
