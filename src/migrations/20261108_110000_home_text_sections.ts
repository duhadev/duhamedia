import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { patchPage, report, type PagePatch, type PatchCtx } from '../lib/contentPatch'

/**
 * Homepage "Proof, in their words." as text, not cards (owner 2026-11-08:
 * "very cardy… I don't want too many cards on my page"). Data only; the
 * `presentation` field comes from 20261108_095000_home_text_sections_schema.
 *
 * Only the homepage testimonial row opts in. "Two jobs. One team." (home
 * layout[2], `equal`) and /services "Two doors." (layout[1], `doors`) need no
 * data change: those variants are used on those pages only and were restyled
 * in the component.
 *
 * Guarded against the PRODUCTION home layout: [2] twoTrackPanels, [6]
 * testimonialRow (variant `row`). Content is untouched.
 */

const CONTEXT = { disableRevalidate: true, homeTextSections: true }

const PAGES: PagePatch[] = [
  {
    slug: 'home',
    expect: { 2: 'twoTrackPanels', 6: 'testimonialRow' },
    ops: [
      [
        'fn',
        (doc: any) => {
          const row = doc.layout[6]
          if ((row.variant ?? 'row') !== 'row') throw new Error(`layout[6].variant is ${row.variant}, expected row`)
          row.presentation = 'text'
        },
      ],
    ],
  },
]

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  req.context = { ...req.context, ...CONTEXT }
  const c: PatchCtx = { payload, req, context: CONTEXT, done: [], skipped: [] }
  for (const patch of PAGES) await patchPage(c, patch)
  report(c, 'home text sections')
}

// Never roll back content; version history holds the previous version.
export async function down(_args: MigrateDownArgs): Promise<void> {}
