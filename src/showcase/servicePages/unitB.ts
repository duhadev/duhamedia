import { BUILD, MARKETING } from '@/lib/servicePagesCopy'
import type { Faq } from '@/payload-types'

import { p, root } from '../lexical'
import type { ShowcaseData, ShowcaseEntry } from '../registry'

/** Service pages (design-reference/service-pages-2026-11-09) unit B fixtures. Owned by the unit B block-coder. */

const NO_LINK = { type: 'custom', newTab: false } as const

// `questions` picks the stored FAQ docs in the migration; the showcase passes static `faqs` instead.
const faqBlock = (
  { blockType: _t, questions: _q, ...copy }: typeof BUILD.faq | typeof MARKETING.faq,
  extra: Partial<ShowcaseData<'accordionFAQ'>>,
): ShowcaseData<'accordionFAQ'> => ({ ...copy, ...extra })
const pricing = (
  { blockType: _t, ...copy }: typeof BUILD.price | typeof MARKETING.plans,
  extra: Partial<ShowcaseData<'pricingPlans'>> = {},
): ShowcaseData<'pricingPlans'> => ({ build: { nextLink: NO_LINK }, marketing: { nextLink: NO_LINK }, ...copy, ...extra })

const fq = (id: number, question: string, answer: string): Faq => ({
  id,
  question,
  answer: root(p(answer)),
  category: 'builds',
  _status: 'published',
  createdAt: '',
  updatedAt: '',
})

/** Artboard answers (Build.dc.html / Marketing.dc.html #faq). Fixtures only; the live answers are never touched. */
const buildFaqs: Faq[] = [
  fq(9701, 'Do you use templates?', 'No. Every store is designed and coded from scratch.'),
  fq(9702, 'How long does a build take?', 'About 5 weeks. A build takes about 55 hands-on hours, about 30 of them on design alone.'),
  fq(9703, 'I already have a store. Do I have to start over?', "No. We can revise the store you have: keep what's working, and redesign and rebuild what isn't. If it needs more than that, we'll build a new theme from scratch. We'll tell you which on the call."),
  fq(9704, 'Do you use AI?', 'Yes, in our build pipeline, to code faster. The design is still planned and approved with you.'),
  fq(9705, 'Can I hire you for just the build?', 'Yes. The marketing steps are optional.'),
  fq(9706, 'How do sign-offs work?', 'For the build, you sign off twice: payment to start, and the finished theme build. Nothing moves to the next stage without your approval.'),
  fq(9707, 'Who does the work?', 'The founder, in-house. No middlemen. We cap at 7 clients so every store gets the hours it needs.'),
]
const marketingFaqs: Faq[] = [
  fq(9711, 'Is there a minimum term for marketing?', "Yes: two quarters. That's long enough to film, run ads and see what works before deciding. After that it renews for two quarters at a time, and you can cancel with notice before the next term."),
  fq(9712, 'Can I just get ads?', 'Every plan includes the full toolkit, and paid ads are where we start. If the numbers show organic content or collaborations will do more for your store, we shift effort there. You pay the same plan either way.'),
  fq(9713, 'Who pays for ads?', 'You do. Ad spend, influencer costs and other marketing expenses are separate from our fees.'),
  fq(9714, 'Do you lock clients into retainers?', 'No. The marketing runs on two-quarter terms that renew, and either side can cancel with notice before the next term. You own everything we make for you: the store, the code, the domain, the content and the accounts.'),
  fq(9715, 'What happens at $100,000 a year?', 'Your plan switches to a fixed rate, set for your store based on the work it needs.'),
  fq(9716, 'Do you guarantee results?', 'No. We watch the numbers and shift effort to what works.'),
]

export const unitBEntries: ShowcaseEntry[] = [
  {
    block: 'accordionFAQ',
    variant: 'mini split — accent + anchor (Build, 7)',
    label: 'Build page FAQ: split, wine "answers.", anchor sp-b-faq-build, first open. Exclusive: open one, the others close. + closed / – open',
    data: faqBlock(BUILD.faq, { faqs: buildFaqs, anchorId: 'sp-b-faq-build' }),
  },
  {
    block: 'accordionFAQ',
    variant: 'mini split — accent + anchor (Marketing, 6)',
    label: 'Marketing page FAQ: same grammar, 6 questions, anchor sp-b-faq-marketing',
    data: faqBlock(MARKETING.faq, { faqs: marketingFaqs, anchorId: 'sp-b-faq-marketing' }),
  },
  {
    block: 'accordionFAQ',
    variant: 'mini stacked — accent + anchor',
    label: 'stacked mini with an accent phrase (wine) and an anchor (scroll-mt clears the sticky header); each block is its own exclusive group',
    data: faqBlock(BUILD.faq, {
      layout: 'stacked',
      heading: 'Straight answers on the build',
      accentPhrase: 'answers',
      eyebrow: 'Build questions',
      faqs: buildFaqs.slice(0, 4),
      anchorId: 'sp-b-faq-stacked',
      openFirst: false,
      allLink: { type: 'custom' },
    }),
  },
  {
    block: 'accordionFAQ',
    variant: 'mini stacked — no accent (unchanged)',
    label: 'stacked mini with NO accent phrase and NO anchor: the heading renders in ink exactly as before; still exclusive with the new +/– icon',
    data: faqBlock(BUILD.faq, {
      layout: 'stacked',
      heading: 'Plain heading, no accent',
      accentPhrase: null,
      anchorId: null,
      eyebrow: null,
      faqs: marketingFaqs.slice(0, 3),
      openFirst: true,
      allLink: { type: 'custom' },
    }),
  },
  {
    block: 'pricingPlans',
    variant: 'build — price rows + link',
    label: 'layout build: headline left, ink build box right; price rows with an inline link after the value ("Optional, separate plans"); solid next-step button; anchor sp-b-price',
    data: pricing(BUILD.price, { anchorId: 'sp-b-price' }),
  },
  {
    block: 'pricingPlans',
    variant: 'build — no rows, with bullets',
    label: 'layout build with no price rows: the box falls back to the bullets list; no link, no next-step caption',
    data: pricing(BUILD.price, {
      anchorId: 'sp-b-price-plain',
      build: {
        label: 'Build your store',
        lead: 'Builds start at',
        price: '$7K',
        rows: [],
        bullets: [{ id: 'sp-b-bl1', text: 'Written scope before you sign.' }, { id: 'sp-b-bl2', text: 'You own everything from launch.' }],
        nextLink: { type: 'custom' },
      },
    }),
  },
  {
    block: 'pricingPlans',
    variant: 'plans — table + terms + statement',
    label: 'layout plans: head, full-width wine plans box (table desktop / one card per plan mobile), fine print under it, exclusive terms left, statement + ghost button right; anchor sp-b-plans',
    data: pricing(MARKETING.plans, { anchorId: 'sp-b-plans' }),
  },
  {
    block: 'pricingPlans',
    variant: 'plans — minimal',
    label: 'layout plans with no head, no terms and no statement: just the wine plans box and the button',
    data: pricing(MARKETING.plans, {
      anchorId: 'sp-b-plans-min',
      eyebrow: null,
      heading: null,
      accentPhrase: null,
      intro: null,
      terms: [],
      statement: null,
      statementAccent: null,
    }),
  },
]
