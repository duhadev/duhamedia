import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { patchPage, report, type PatchCtx } from '../lib/contentPatch'
import { BUILD, MARKETING } from '../lib/servicePagesCopy'
import { p, root } from '../showcase/lexical'

/**
 * Service pages redesign (owner-approved 2026-11-09; spec in
 * design-reference/service-pages-2026-11-09/). Data only; every field it writes
 * comes from 20261110_025312_service_pages_schema, which sorts before this file
 * (Migration order rule, 2026-11-08). Copy: src/lib/servicePagesCopy.ts.
 *
 * Guarded on the exact live shapes (prod = 20261108_013300_brochure_restructure):
 *   /services/shopify-theme-development (7 blocks):
 *     0 hero(service) 1 serviceSheet(page) 2 twoTrackPanels(primary-secondary)
 *     3 phaseTimeline(build-run) 4 caseStudyCards(cards) 5 accordionFAQ(mini) 6 finalCTA
 *   /services/marketing (5 blocks):
 *     0 hero(service) 1 serviceSheet(page) 2 caseStudyCards(cards) 3 accordionFAQ(mini) 4 finalCTA
 * New layouts (13 rows each) follow IMPLEMENTATION.md's mapping tables. The
 * existing rows are rewritten in place (ids kept); the rest are new rows.
 * Fields the new presentations do not render are cleared (ServiceSheet numbers,
 * next step, old groups and differentiators; hero pricing note, sub note, stats
 * and badge; the marketing proof's metrics and pricing note). FAQ answers are
 * never touched: the questions are picked by their exact stored text.
 *
 * Failure behaviour:
 * - shape mismatch (incl. a second run): WARN-skip, logged with the found shape;
 * - shape matched but the write failed, or any of the 13 FAQ questions is
 *   missing: THROW, so this migration's transaction rolls back and the deploy
 *   fails (the previous release keeps serving).
 */

const CONTEXT = { disableRevalidate: true, servicePages: true }

type Shape = [type: string, key: string | null, value: string | null][]

const BUILD_SHAPE: Shape = [
  ['hero', 'variant', 'service'],
  ['serviceSheet', 'presentation', 'page'],
  ['twoTrackPanels', 'variant', 'primary-secondary'],
  ['phaseTimeline', 'variant', 'build-run'],
  ['caseStudyCards', 'layout', 'cards'],
  ['accordionFAQ', 'variant', 'mini'],
  ['finalCTA', null, null],
]

const MARKETING_SHAPE: Shape = [
  ['hero', 'variant', 'service'],
  ['serviceSheet', 'presentation', 'page'],
  ['caseStudyCards', 'layout', 'cards'],
  ['accordionFAQ', 'variant', 'mini'],
  ['finalCTA', null, null],
]

const NO_LINK = { type: 'custom', newTab: false, url: null, label: null, reference: null }

const clone = <T>(v: T): T => structuredClone(v)

/** The found shape, for the WARN line. */
const describe = (L: any[]): string =>
  L.map((b) => `${b?.blockType}(${b?.variant ?? b?.presentation ?? b?.layout ?? '-'})`).join(' ')

const checkShape = (doc: any, shape: Shape): void => {
  const L = (doc.layout ?? []) as any[]
  const bad =
    L.length !== shape.length ||
    shape.some(([type, key, value], i) => L[i]?.blockType !== type || (key !== null && L[i]?.[key] !== value))
  if (bad) throw new Error(`layout is [${describe(L)}], expected the ${shape.length}-block pre-redesign shape (already patched?)`)
}

const omit = <T extends object, K extends string>(obj: T, ...keys: K[]): Omit<T, K & keyof T> => {
  const out = { ...obj } as Record<string, unknown>
  for (const k of keys) delete out[k]
  return out as Omit<T, K & keyof T>
}

/** Hero: service → typographic + at-a-glance card; old service-only extras cleared. */
const patchHero = (hero: any, copy: typeof BUILD.hero | typeof MARKETING.hero): void => {
  Object.assign(hero, clone(copy), {
    pricingNote: null,
    subNote: null,
    proofLine: null,
    stats: [],
    phaseStrip: [],
    callouts: [],
    badge: { ...(hero.badge ?? {}), show: false },
  })
}

/** ServiceSheet `fit` over the old brochure sheet (same row id). */
const patchFit = (sheet: any, copy: typeof BUILD.fit | typeof MARKETING.fit): void => {
  Object.assign(sheet, clone(omit(copy, 'why', 'box', 'included')), {
    intro: null,
    numeral: null,
    accent: false,
    why: { heading: null, body: copy.why.body },
    numbers: { ...(sheet.numbers ?? {}), label: null, items: [] },
    box: { label: null, body: null, note: copy.box.note, link: { ...NO_LINK, ...clone(copy.box.link) } },
    nextStep: { label: null, link: { ...NO_LINK } },
    included: { heading: null, groups: clone(copy.included.groups) },
    differentiators: { heading: null, rows: [] },
  })
}

/** New ServiceSheet rows: the required `box` / `nextStep` groups filled with empty links. */
const newSheet = (copy: typeof BUILD.deliverables | typeof MARKETING.duties) => ({
  box: { link: { ...NO_LINK } },
  nextStep: { link: { ...NO_LINK } },
  ...clone(copy),
})

/** Band copy ships plain paragraphs; the CMS stores Lexical. */
const band = (copy: typeof BUILD.band | typeof MARKETING.band) => {
  const { bodyParagraphs, ...rest } = clone(copy)
  return { ...rest, body: root(...bodyParagraphs.map((t) => p(t))) }
}

/** AccordionFAQ mini → split, selected questions (ids in artboard order), wine accent. */
const patchFaq = (faq: any, copy: typeof BUILD.faq | typeof MARKETING.faq, ids: number[]): void => {
  Object.assign(faq, clone(omit(copy, 'questions')), { intro: null, source: 'selected', faqs: ids })
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  req.context = { ...req.context, ...CONTEXT }
  const c: PatchCtx = { payload, req, context: CONTEXT, done: [], skipped: [] }

  /* FAQ ids by exact question text (answers are never edited here). */
  const questions = [...BUILD.faq.questions, ...MARKETING.faq.questions]
  const found = await payload.find({
    collection: 'faqs',
    where: { question: { in: questions } },
    limit: 100,
    depth: 0,
    sort: 'id',
    req,
    overrideAccess: true,
  })
  const missing: string[] = []
  const idsFor = (list: readonly string[]): number[] =>
    list.flatMap((q) => {
      const doc = found.docs.find((d) => d.question === q)
      if (!doc) missing.push(q)
      return doc ? [doc.id as number] : []
    })
  const buildFaqIds = idsFor(BUILD.faq.questions)
  const marketingFaqIds = idsFor(MARKETING.faq.questions)

  /** Runs one page patch with the loud-failure rule (IMPLEMENTATION.md "Migrations"). */
  const run = async (slug: string, shape: Shape, rewrite: (L: any[]) => any[]): Promise<void> => {
    let shaped = false
    const before = c.done.length
    await patchPage(c, {
      slug,
      expect: Object.fromEntries(shape.map(([type], i) => [i, type])),
      ops: [
        [
          'fn',
          (doc) => {
            checkShape(doc, shape)
            shaped = true
            if (missing.length) throw new Error(`FAQ question(s) not found: ${missing.map((q) => `"${q}"`).join(', ')}`)
            doc.layout = rewrite(doc.layout as any[])
          },
        ],
      ],
    })
    if (shaped && c.done.length === before) throw new Error(`${slug}: shape matched but the write failed: ${c.skipped.at(-1)}`)
  }

  /* /services/shopify-theme-development: 7 → 13 rows */
  await run('services/shopify-theme-development', BUILD_SHAPE, (L) => {
    const [hero, sheet, twoTrack, steps, proof, faq, finalCTA] = L

    patchHero(hero, BUILD.hero)
    patchFit(sheet, BUILD.fit)

    /* Revision or scratch: primary-secondary → compare (panel ids kept; card-only fields cleared) */
    const oldPanels = (twoTrack.panels ?? []) as any[]
    Object.assign(twoTrack, clone(omit(BUILD.compare, 'panels')), {
      claim: null,
      panels: BUILD.compare.panels.map((next, i) => ({
        ...(oldPanels[i]?.id ? { id: oldPanels[i].id } : {}),
        ...clone(next),
        claim: null,
        accentPhrase: null,
        accentTitle: false,
        body: null,
        share: null,
        pricingNote: null,
        services: [],
        stats: [],
        points: [],
        link: { ...NO_LINK },
      })),
    })

    /* The six steps: build-run → detail (strip + 6 rows, steps replaced) */
    Object.assign(steps, clone(BUILD.steps), { phases: [] })

    /* The work, up close */
    Object.assign(proof, clone(BUILD.proof))

    patchFaq(faq, BUILD.faq, buildFaqIds)

    /* Final CTA (P7): heading kept, accent cleared (S5), body cleared (the scarcity reason is the quiet line) */
    Object.assign(finalCTA, clone(BUILD.finalCta))

    return [
      hero,
      clone(BUILD.jump),
      sheet,
      twoTrack,
      steps,
      clone(BUILD.hours),
      newSheet(BUILD.deliverables),
      clone(BUILD.tools),
      proof,
      { marketing: { nextLink: { ...NO_LINK } }, ...clone(BUILD.price) },
      band(BUILD.band),
      faq,
      finalCTA,
    ]
  })

  /* /services/marketing: 5 → 13 rows */
  await run('services/marketing', MARKETING_SHAPE, (L) => {
    const [hero, sheet, proof, faq, finalCTA] = L

    patchHero(hero, MARKETING.hero)
    patchFit(sheet, MARKETING.fit)

    /* Proof: growth track only (Abu Oud stops matching) → testimonial fallback (S10a) */
    Object.assign(proof, clone(MARKETING.proof), { fallbackAccentPhrase: null, fallbackMetrics: [], pricingNote: null })

    patchFaq(faq, MARKETING.faq, marketingFaqIds)

    /* Final CTA: body cleared (the scarcity reason is the quiet line) */
    Object.assign(finalCTA, clone(MARKETING.finalCta))

    return [
      hero,
      clone(MARKETING.jump),
      sheet,
      clone(MARKETING.month),
      clone(MARKETING.flow),
      clone(MARKETING.toolkit),
      newSheet(MARKETING.duties),
      clone(MARKETING.quarters),
      { build: { nextLink: { ...NO_LINK } }, ...clone(MARKETING.plans) },
      proof,
      faq,
      band(MARKETING.band),
      finalCTA,
    ]
  })

  report(c, 'service pages')
}

// Never delete or roll back content; version history holds every previous version.
export async function down(_args: MigrateDownArgs): Promise<void> {}
