import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { guard, patchPage, report, type PatchCtx } from '../lib/contentPatch'
import { CAPACITY, FOUNDER, PROCESS, TOOLKIT, TWO_JOBS } from '../lib/homeCopy'

/**
 * Homepage sections redesign, "home B" (owner-approved 2026-11-09; spec in
 * design-reference/home-b-2026-11-09/). Data only; every field it writes comes
 * from 20261109_150019_home_b_schema, which sorts before this file (Migration
 * order rule, 2026-11-08). Copy: src/lib/homeCopy.ts.
 *
 * 1. Home, guarded on the exact live 9-block shape:
 *      0 hero 1 proofStrip(scarcity) 2 twoTrackPanels(equal) 3 miniCTAStrip
 *      4 phaseTimeline(accordion) 5 teamIntro(intro) 6 testimonialRow
 *      7 teamIntro(founder-card) 8 finalCTA
 *    New order: hero → capacity strip → two jobs → mini CTA → process (grid,
 *    one row) → NEW toolkit → testimonialRow → founder section → final CTA. The
 *    'Chicago operators' intro (old 5) leaves the layout (it stays in version
 *    history; the variants stay in the schema). Hero, mini CTA, testimonialRow
 *    and final CTA are not touched. Any other shape is skipped and logged, so a
 *    second run is a no-op. (The local dev home is seed-shaped: skipped.)
 * 2. /services: the process grid (layout[5]) gets anchorId 'process' (the home
 *    "The full process →" link target), guarded on its post-redesign 10-block shape.
 * 3. `scarcity` global: adds the `spots` statement row unless that key exists.
 */

const CONTEXT = { disableRevalidate: true, homeB: true }

const HOME_SHAPE: [string, string | null][] = [
  ['hero', null],
  ['proofStrip', 'scarcity'],
  ['twoTrackPanels', 'equal'],
  ['miniCTAStrip', null],
  ['phaseTimeline', 'accordion'],
  ['teamIntro', 'intro'],
  ['testimonialRow', null],
  ['teamIntro', 'founder-card'],
  ['finalCTA', null],
]

const SERVICES_SHAPE: [string, string | null][] = [
  ['hero', null],
  ['serviceSheet', null],
  ['specLedger', null],
  ['serviceSheet', null],
  ['specLedger', null],
  ['phaseTimeline', 'grid'],
  ['pricingPlans', null],
  ['testimonialRow', null],
  ['accordionFAQ', null],
  ['finalCTA', null],
]

const clone = <T>(v: T): T => structuredClone(v)

const checkShape = (doc: any, shape: [string, string | null][]): void => {
  const L = doc.layout as any[]
  if (L.length !== shape.length) throw new Error(`layout has ${L.length} blocks, expected ${shape.length} (already patched?)`)
  shape.forEach(([type, variant], i) => {
    if (variant && L[i].variant !== variant) throw new Error(`layout[${i}] ${type} variant is ${L[i].variant ?? 'missing'}, expected ${variant}`)
  })
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  req.context = { ...req.context, ...CONTEXT }
  const c: PatchCtx = { payload, req, context: CONTEXT, done: [], skipped: [] }

  /* 1 Home */
  await patchPage(c, {
    slug: 'home',
    expect: Object.fromEntries(HOME_SHAPE.map(([type], i) => [i, type])),
    ops: [
      [
        'fn',
        (doc) => {
          checkShape(doc, HOME_SHAPE)
          const [, proof, twoTrack, , phase, , , founder] = doc.layout as any[]

          /* 1 capacity strip (client relationship kept as is) */
          Object.assign(proof, { variant: 'capacity', capacityStatement: CAPACITY.statement.key, pricingNote: null })
          proof.logos = { ...proof.logos, eyebrow: CAPACITY.logosEyebrow }

          /* 2 two jobs: keep both links (targets), new labels */
          const old = (twoTrack.panels ?? []) as any[]
          if (old.length !== 2) throw new Error(`twoTrackPanels has ${old.length} panels, expected 2`)
          if (old.some((p) => !p.link)) throw new Error('twoTrackPanels panel without a link')
          const { panels, ...head } = TWO_JOBS
          Object.assign(twoTrack, clone(head))
          twoTrack.panels = panels.map(({ linkLabel, ...next }, i) => ({
            ...old[i],
            ...clone(next),
            services: [],
            link: { ...old[i].link, label: linkLabel },
          }))

          /* 4 process: accordion → grid, one row (phases/steps replaced) */
          Object.assign(phase, clone(PROCESS))

          /* 7 founder: homepage section presentation (member untouched) */
          Object.assign(founder, clone(FOUNDER))
        },
      ],
      ['remove', 'layout[5]'],
      ['insert', 'layout', 5, clone(TOOLKIT)],
    ],
  })

  /* 2 /services process anchor */
  await patchPage(c, {
    slug: 'services',
    expect: Object.fromEntries(SERVICES_SHAPE.map(([type], i) => [i, type])),
    ops: [
      [
        'fn',
        (doc) => {
          checkShape(doc, SERVICES_SHAPE)
          const grid = (doc.layout as any[])[5]
          if (grid.anchorId === 'process') throw new Error('layout[5] already has anchorId "process"')
          grid.anchorId = 'process'
        },
      ],
    ],
  })

  /* 3 scarcity global: `spots` row */
  const scarcity = await payload.findGlobal({ slug: 'scarcity', depth: 0, req, overrideAccess: true })
  const statements = (scarcity.statements ?? []) as any[]
  if (statements.some((s) => s.key === CAPACITY.statement.key)) {
    c.skipped.push(`scarcity: key "${CAPACITY.statement.key}" already exists`)
  } else {
    await guard(c, `scarcity row "${CAPACITY.statement.key}"`, () =>
      payload.updateGlobal({
        slug: 'scarcity',
        data: { statements: [...statements, clone(CAPACITY.statement)] },
        depth: 0,
        req,
        overrideAccess: true,
        context: CONTEXT,
      }),
    )
  }

  report(c, 'home B')
}

// Never delete or roll back content; version history holds every previous version.
export async function down(_args: MigrateDownArgs): Promise<void> {}
