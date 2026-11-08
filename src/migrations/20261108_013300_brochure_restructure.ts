import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { BOOK_A_CALL_LINE, FOUNDER_BODY, PRICING, PROCESS_GRID, SHEET_BUILD, SHEET_GROW, TOOLS } from '../lib/brochureCopy'
import { guard, patchPage, report, type PagePatch, type PatchCtx } from '../lib/contentPatch'
import { customLink, p, root } from '../showcase/lexical'

/**
 * Brochure restructure (docs/brochure/duha-media-brochure-2026-11-07.pdf,
 * plan: brochure-plan.md, owner-approved 2026-11-08). Data only; the blocks
 * and variants it uses come from 20261108_013207_brochure_blocks.
 *
 * - /services/shopify-theme-development: p2 service sheet replaces the
 *   template cards + spec rows; revision panels, build steps, studies, FAQ,
 *   closing stay.
 * - /services/marketing: p3 service sheet replaces signal flow, spec rows,
 *   rollout band and feature cards.
 * - /services: p4 process grid + tools row + p5 pricing section (#pricing)
 *   replace "Two jobs. One team." and the phase arc; newsletter moves below
 *   the proof.
 * - / (home): process steps 01–08 titles + details = brochure p4 (layout[4] only).
 * - /faq: p7 founder card before the closing; closing gets the p7 call line.
 * - /about: founder card copy from p7; facts strip wide; fallback eyebrow.
 * - FAQs: the p7 question set (wording verbatim; location per reply-02).
 *
 * Every touched layout index is guarded by blockType (and variant where a
 * block is removed); layout[0] (the hero) is carried over untouched. Paths
 * are against the production state after copy round 2 + hero_consistency.
 */

const CONTEXT = { disableRevalidate: true, brochureRestructure: true }

/** Throws (→ page skipped and logged by patchPage) unless every listed index has that variant. */
const expectVariants = (doc: any, want: Record<number, string>): void => {
  for (const [i, v] of Object.entries(want)) {
    const got = doc.layout?.[Number(i)]?.variant
    if (got !== v) throw new Error(`layout[${i}].variant is ${got ?? 'missing'}, expected ${v}`)
  }
}

const PAGES: PagePatch[] = [
  {
    slug: 'services/shopify-theme-development',
    expect: { 0: 'hero', 1: 'twoTrackPanels', 2: 'specLedger', 3: 'specLedger', 4: 'phaseTimeline', 5: 'caseStudyCards', 6: 'accordionFAQ', 7: 'finalCTA' },
    ops: [
      [
        'fn',
        (doc) => {
          if (doc.layout.length !== 8) throw new Error(`expected 8 sections, found ${doc.layout.length}`)
          expectVariants(doc, { 1: 'primary-secondary', 2: 'cards', 3: 'expandable', 4: 'build-run' })
          const L = doc.layout
          doc.layout = [L[0], SHEET_BUILD, L[1], L[4], L[5], L[6], L[7]]
        },
      ],
    ],
  },
  {
    slug: 'services/marketing',
    expect: { 0: 'hero', 1: 'specLedger', 2: 'specLedger', 3: 'phaseTimeline', 4: 'specLedger', 5: 'caseStudyCards', 6: 'accordionFAQ', 7: 'finalCTA' },
    ops: [
      [
        'fn',
        (doc) => {
          if (doc.layout.length !== 8) throw new Error(`expected 8 sections, found ${doc.layout.length}`)
          expectVariants(doc, { 1: 'signal-flow', 2: 'expandable', 3: 'engine-rollout', 4: 'cards' })
          const L = doc.layout
          doc.layout = [L[0], SHEET_GROW, L[5], L[6], L[7]]
        },
      ],
    ],
  },
  {
    slug: 'services',
    expect: {
      0: 'hero',
      1: 'twoTrackPanels',
      2: 'twoTrackPanels',
      3: 'newsletterBand',
      4: 'phaseTimeline',
      5: 'phaseTimeline',
      6: 'testimonialRow',
      7: 'accordionFAQ',
      8: 'finalCTA',
    },
    ops: [
      [
        'fn',
        (doc) => {
          if (doc.layout.length !== 9) throw new Error(`expected 9 sections, found ${doc.layout.length}`)
          expectVariants(doc, { 1: 'doors', 2: 'equal', 4: 'arc', 5: 'steps' })
          const L = doc.layout
          doc.layout = [L[0], L[1], PROCESS_GRID, TOOLS, PRICING, L[5], L[6], L[3], L[7], L[8]]
        },
      ],
    ],
  },
  {
    // Homepage process = brochure p4 wording (owner: align titles + details 01–08). Production
    // layout; the local seed's home differs and is skipped there (logged).
    slug: 'home',
    expect: { 0: 'hero', 1: 'proofStrip', 2: 'twoTrackPanels', 3: 'miniCTAStrip', 4: 'phaseTimeline' },
    ops: [
      [
        'fn',
        (doc) => {
          expectVariants(doc, { 4: 'accordion' })
          const steps = doc.layout[4].steps
          if (!Array.isArray(steps) || steps.length !== 8) throw new Error(`home process: expected 8 steps, found ${steps?.length}`)
          PROCESS_GRID.steps.forEach((b, i) => {
            steps[i].title = b.title
            steps[i].detail = b.detail
          })
        },
      ],
    ],
  },
  {
    slug: 'faq',
    expect: { 0: 'hero', 1: 'categoryTabs', 6: 'finalCTA' },
    ops: [
      [
        'fn',
        (doc) => {
          if (doc.layout.length !== 7) throw new Error(`expected 7 sections, found ${doc.layout.length}`)
        },
      ],
      [
        'insert',
        'layout',
        6,
        {
          blockType: 'teamIntro',
          variant: 'founder-card',
          eyebrow: 'Work with us',
          eyebrowTick: false,
          heading: 'One founder, no layers.',
          body: FOUNDER_BODY,
          member: null, // set below from /about's founder card
          link: { type: 'custom', newTab: false },
        },
      ],
      ['set', 'layout[7].body', BOOK_A_CALL_LINE],
    ],
  },
  {
    slug: 'about',
    expect: { 0: 'hero', 2: 'metricEvent', 3: 'teamIntro', 4: 'caseStudyCards' },
    ops: [
      [
        'fn',
        (doc) => {
          expectVariants(doc, { 2: 'facts', 3: 'founder-card' })
        },
      ],
      ['set', 'layout[2].width', 'wide'],
      ['set', 'layout[3].eyebrow', 'Work with us'],
      ['set', 'layout[3].body', FOUNDER_BODY],
      ['set', 'layout[4].fallbackEyebrow', "Stores we've built"],
    ],
  },
]

type FaqCat = 'pricing-contracts' | 'builds' | 'marketing' | 'process-trust'
type FaqAnswer = ReturnType<typeof root>
type FaqRow = { match: string | null; question: string; category: FaqCat; sortOrder: number; answer?: FaqAnswer }

const a = (text: string): FaqAnswer => root(p(text))

/** `match` = current question text (null = create). No `answer` = keep the current answer. */
const FAQS: FaqRow[] = [
  // Pricing & Contracts — opens with the direct price answer (FAQ rule).
  { match: 'What does it cost?', question: 'How much does a build cost?', category: 'pricing-contracts', sortOrder: 1, answer: a('Builds start at $7K.') },
  {
    match: null,
    question: 'How is marketing priced?',
    category: 'pricing-contracts',
    sortOrder: 2,
    // Brochure: "… See page 5." → a link to the pricing section.
    answer: root(p('Through one of three plans, settled quarterly. ', customLink('See pricing', '/services#pricing'), '.')),
  },
  { match: 'Who pays for ads?', question: 'Who pays for ads?', category: 'pricing-contracts', sortOrder: 3 },
  {
    match: 'What happens at $100,000 a year?',
    question: 'What happens at $100,000 a year?',
    category: 'pricing-contracts',
    sortOrder: 4,
    answer: a('Your plan switches to a fixed rate, set for your store based on the work it needs.'),
  },
  {
    match: 'How long are contracts?',
    question: 'How long is the marketing agreement?',
    category: 'pricing-contracts',
    sortOrder: 5,
    answer: a('Two-quarter terms that renew. Either side can cancel with notice before the next term.'),
  },
  { match: 'Do you lock clients into retainers?', question: 'Do you lock clients into retainers?', category: 'pricing-contracts', sortOrder: 6 },
  // Builds
  { match: null, question: 'Do you use templates?', category: 'builds', sortOrder: 1, answer: a('No. Every store is designed and coded from scratch.') },
  {
    match: 'Can I do the build without the marketing?',
    question: 'Can I hire you for just the build?',
    category: 'builds',
    sortOrder: 2,
    answer: a('Yes. The marketing steps are optional.'),
  },
  {
    match: 'Do you use AI?',
    question: 'Do you use AI?',
    category: 'builds',
    sortOrder: 3,
    answer: a('Yes, in our build pipeline, to code faster. The design is still planned and approved with you.'),
  },
  { match: 'I already have a store. Do I have to start over?', question: 'I already have a store. Do I have to start over?', category: 'builds', sortOrder: 4 },
  { match: 'How long does a build take?', question: 'How long does a build take?', category: 'builds', sortOrder: 5 },
  // Process & Trust
  {
    match: null,
    question: 'Who does the work?',
    category: 'process-trust',
    sortOrder: 1,
    answer: a('The founder, in-house. No middlemen. We cap at 7 clients so every store gets the hours it needs.'),
  },
  {
    match: 'Do I own my store?',
    question: 'Do I own my store?',
    category: 'process-trust',
    sortOrder: 2,
    answer: a('Yes. The store, the theme code and the domain are yours from launch.'),
  },
  {
    match: null,
    question: 'Do you guarantee results?',
    category: 'process-trust',
    sortOrder: 3,
    answer: a('No. We watch the numbers and shift effort to what works.'),
  },
  // Location: founder's latest answer (reply-02), set by copy round 2; only re-ordered here.
  { match: 'Where are you based?', question: 'Where are you based?', category: 'process-trust', sortOrder: 4 },
  { match: 'Will this work for my business?', question: 'Will this work for my business?', category: 'process-trust', sortOrder: 5 },
  { match: 'What makes you different?', question: 'What makes you different?', category: 'process-trust', sortOrder: 6 },
  { match: 'How do sign-offs work?', question: 'How do sign-offs work?', category: 'process-trust', sortOrder: 7 },
]

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  req.context = { ...req.context, ...CONTEXT }
  const c: PatchCtx = { payload, req, context: CONTEXT, done: [], skipped: [] }
  const o = { depth: 0, req, overrideAccess: true, context: CONTEXT } as const

  // The /faq founder card uses the same team member as /about's.
  const about = await payload.find({ collection: 'pages', where: { slug: { equals: 'about' } }, limit: 1, ...o })
  const founder = (about.docs[0] as any)?.layout?.find((b: any) => b?.blockType === 'teamIntro' && b?.variant === 'founder-card')
  const memberId = founder?.member && typeof founder.member === 'object' ? founder.member.id : (founder?.member ?? null)
  const faqPatch = PAGES.find((pg) => pg.slug === 'faq')!
  const card = faqPatch.ops.find((op) => op[0] === 'insert')![3] as { member: unknown }
  card.member = memberId

  for (const patch of PAGES) await patchPage(c, patch)

  for (const f of FAQS) {
    const existing = f.match
      ? (await payload.find({ collection: 'faqs', where: { question: { equals: f.match } }, limit: 1, ...o })).docs[0]
      : (await payload.find({ collection: 'faqs', where: { question: { equals: f.question } }, limit: 1, ...o })).docs[0]
    if (f.match && !existing) {
      c.skipped.push(`faq "${f.match}": not found`)
      continue
    }
    const data = {
      question: f.question,
      category: f.category,
      sortOrder: f.sortOrder,
      ...(f.answer ? { answer: f.answer } : {}),
      _status: 'published' as const,
    }
    await guard(c, `faq "${f.question}"`, () =>
      existing
        ? payload.update({ collection: 'faqs', id: existing.id, data, ...o })
        : payload.create({ collection: 'faqs', data: { ...data, answer: f.answer!, listOnFaqPage: true }, ...o }),
    )
  }

  report(c, 'brochure restructure')
}

// Never delete or roll back content; version history holds every previous version.
export async function down(_args: MigrateDownArgs): Promise<void> {}
