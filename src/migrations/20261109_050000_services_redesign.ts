import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { patchPage, report, type PatchCtx } from '../lib/contentPatch'
import { BUILD_SECTION, BUILD_TOOLS, FAQ, FINAL_CTA_HEADING, GROW_SECTION, GROW_TOOLS, HERO, PRICING, PROCESS, PROOF } from '../lib/servicesCopy'

/**
 * /services redesign, direction A (owner-approved 2026-11-09; spec in
 * design-reference/services-a-2026-11-09/). Data only; every field it writes
 * comes from 20261109_045545_services_redesign_schema, which sorts before this
 * file (Migration order rule, 2026-11-08). Copy: src/lib/servicesCopy.ts.
 *
 * Guarded on the exact live 10-block shape:
 *   0 hero(typographic) 1 twoTrackPanels(doors) 2 phaseTimeline(grid)
 *   3 specLedger(tools) 4 pricingPlans 5 phaseTimeline(steps) 6 testimonialRow
 *   7 newsletterBand 8 accordionFAQ(mini) 9 finalCTA
 * Anything else is skipped and logged, so a second run is a no-op.
 *
 * New layout: hero → Build section → Build tools → Grow section → Grow tools
 * (the existing tools block) → How we work (existing grid, step 0 prepended) →
 * Pricing → The work, up close → FAQ (split) → Final CTA. The old 1 (doors),
 * 5 (steps) and 7 (newsletter band) leave the layout (they stay in version
 * history; the variants stay in the schema, D6). The pricing small print and
 * the FAQ answers are not touched (D4).
 */

const CONTEXT = { disableRevalidate: true, servicesRedesign: true }

const SHAPE: [string, string | null][] = [
  ['hero', 'typographic'],
  ['twoTrackPanels', 'doors'],
  ['phaseTimeline', 'grid'],
  ['specLedger', 'tools'],
  ['pricingPlans', null],
  ['phaseTimeline', 'steps'],
  ['testimonialRow', null],
  ['newsletterBand', null],
  ['accordionFAQ', 'mini'],
  ['finalCTA', null],
]

const clone = <T>(v: T): T => structuredClone(v)

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  req.context = { ...req.context, ...CONTEXT }
  const c: PatchCtx = { payload, req, context: CONTEXT, done: [], skipped: [] }

  /* FAQ ids by question text (answers are never edited here). */
  const found = await payload.find({
    collection: 'faqs',
    where: { question: { in: FAQ.questions } },
    limit: 50,
    depth: 0,
    sort: 'id',
    req,
    overrideAccess: true,
  })
  const faqIds: number[] = []
  for (const q of FAQ.questions) {
    const doc = found.docs.find((d) => d.question === q)
    if (doc) faqIds.push(doc.id as number)
    else c.skipped.push(`faq "${q}": not found, left out`)
  }

  await patchPage(c, {
    slug: 'services',
    expect: Object.fromEntries(SHAPE.map(([type], i) => [i, type])),
    ops: [
      [
        'fn',
        (doc) => {
          const L = doc.layout as any[]
          if (L.length !== SHAPE.length) throw new Error(`layout has ${L.length} blocks, expected ${SHAPE.length} (already redesigned?)`)
          SHAPE.forEach(([type, variant], i) => {
            if (variant && L[i].variant !== variant) throw new Error(`layout[${i}] ${type} variant is ${L[i].variant ?? 'missing'}, expected ${variant}`)
          })
          const [hero, , grid, tools, pricing, , proof, , faq, finalCTA] = L

          /* 0 hero */
          Object.assign(hero, {
            heading: HERO.heading,
            accentPhrase: HERO.accentPhrase,
            accentLine: HERO.accentLine,
            body: HERO.body,
            proofLine: HERO.proofLine,
            ctas: [...(hero.ctas ?? []).slice(0, 1), { link: clone(HERO.pricingCta) }],
          })

          /* 4 Grow tools: the existing tools block, as tiles */
          Object.assign(tools, clone(GROW_TOOLS))

          /* 5 How we work: step 0 strip + artboard details */
          if ((grid.steps ?? []).some((s: any) => s.phase === '0')) throw new Error('grid already has phase-0 steps')
          grid.intro = PROCESS.intro
          grid.steps = [
            ...clone(PROCESS.stepZero),
            ...(grid.steps ?? []).map((s: any) => ({ ...s, detail: PROCESS.details[String(s.number ?? '').trim()] ?? s.detail })),
          ]

          /* 6 Pricing */
          pricing.build = {
            ...pricing.build,
            bullets: PRICING.build.bullets.map((text) => ({ text })),
            nextLabel: null,
            nextLink: clone(PRICING.build.nextLink),
          }
          const unknownPlans: string[] = []
          pricing.marketing = {
            ...pricing.marketing,
            label: PRICING.marketing.label,
            threshold: null,
            nextLink: clone(PRICING.marketing.nextLink),
            plans: (pricing.marketing?.plans ?? []).map((p: any) => {
              const next = PRICING.marketing.plans[p.name]
              if (!next) unknownPlans.push(p.name)
              return { ...p, body: null, ...(next ? { figures: clone(next.figures), after: next.after } : {}) }
            }),
          }
          if (unknownPlans.length) c.skipped.push(`pricing: no figures for plan(s) ${unknownPlans.map((n) => `"${n}"`).join(', ')} (body cleared, rest kept)`)
          pricing.terms = PRICING.terms.map((t) => {
            const old = (pricing.terms ?? []).find((o: any) => o.label === t.label)
            return { ...(old?.id ? { id: old.id } : {}), label: t.label, body: t.body }
          })

          /* 7 The work, up close */
          Object.assign(proof, { heading: null, accentPhrase: null, eyebrow: PROOF.eyebrow, eyebrowTick: PROOF.eyebrowTick })
          proof.studyCard = { ...proof.studyCard, centerFacts: PROOF.centerFacts }

          /* 8 FAQ */
          Object.assign(faq, {
            layout: FAQ.layout,
            eyebrow: FAQ.eyebrow,
            eyebrowTick: FAQ.eyebrowTick,
            heading: FAQ.heading,
            intro: FAQ.intro,
            source: 'selected',
            faqs: faqIds,
            allLink: clone(FAQ.allLink),
          })

          /* 9 Final CTA: heading only (D5) */
          finalCTA.heading = FINAL_CTA_HEADING

          doc.layout = [hero, clone(BUILD_SECTION), clone(BUILD_TOOLS), clone(GROW_SECTION), tools, grid, pricing, proof, faq, finalCTA]
        },
      ],
    ],
  })

  report(c, 'services redesign')
}

// Never delete or roll back content; version history holds every previous version.
export async function down(_args: MigrateDownArgs): Promise<void> {}
