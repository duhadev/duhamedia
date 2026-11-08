import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { patchPage, report, type PagePatch, type PatchCtx } from '../lib/contentPatch'

/**
 * Hero consistency (2026-11-08). Layout fields only, no copy changes.
 * Rule: top-level pages use the typographic hero on the full site width with
 * their figures in a right-hand column on desktop (the /work model); service
 * subpages keep the `service` hero (breadcrumb + price note).
 * About: article hero (820px column) -> typographic default, so its three
 * figures sit top-right like /work; its article text goes to the new `wide`
 * width (schema migration 20261108_011630_richcontent_article_width), which
 * lines it up with the hero. Indices from the production snapshot after v1.0.14.
 */

const CONTEXT = { disableRevalidate: true, heroConsistency: true }

const PAGES: PagePatch[] = [
  {
    slug: 'about',
    expect: { 0: 'hero', 1: 'richContent', 2: 'metricEvent' },
    ops: [
      ['set', 'layout[0].variant', 'typographic'],
      ['set', 'layout[0].size', 'default'],
      ['set', 'layout[1].width', 'wide'],
    ],
  },
]

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  req.context = { ...req.context, ...CONTEXT }
  const c: PatchCtx = { payload, req, context: CONTEXT, done: [], skipped: [] }
  for (const patch of PAGES) await patchPage(c, patch)
  report(c, 'hero consistency')
}

// Never roll back content; version history holds the previous version.
export async function down(_args: MigrateDownArgs): Promise<void> {}
