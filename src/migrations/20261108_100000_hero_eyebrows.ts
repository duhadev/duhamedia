import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { patchPage, report, type PagePatch, type PatchCtx } from '../lib/contentPatch'

/**
 * Hero eyebrows (2026-11-08, owner). Every top-level hero carries an eyebrow,
 * so /services gets "Services" (matching Work / About / FAQ), and its
 * "01 / 02 / 03" phase steps are cleared (owner: "we don't need this one, two,
 * three thing"). No other copy changes; the eyebrow restyle is code only.
 * Indices from the production snapshot after v1.0.15.
 */

const CONTEXT = { disableRevalidate: true, heroEyebrows: true }

const PAGES: PagePatch[] = [
  {
    slug: 'services',
    expect: { 0: 'hero' },
    ops: [
      ['set', 'layout[0].eyebrow', 'Services'],
      ['set', 'layout[0].phaseStrip', []],
    ],
  },
  {
    // Owner 2026-11-08: the long eyebrow ran over the corner shape at 390px.
    slug: 'book-a-call',
    expect: { 0: 'hero', 1: 'bookingEmbed' },
    ops: [['set', 'layout[0].eyebrow', 'Book a free call']],
  },
]

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  req.context = { ...req.context, ...CONTEXT }
  const c: PatchCtx = { payload, req, context: CONTEXT, done: [], skipped: [] }
  for (const patch of PAGES) await patchPage(c, patch)
  report(c, 'hero eyebrows')
}

// Never roll back content; version history holds the previous version.
export async function down(_args: MigrateDownArgs): Promise<void> {}
