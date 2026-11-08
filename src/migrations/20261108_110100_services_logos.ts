import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { patchPage, report, type PatchCtx } from '../lib/contentPatch'

/**
 * /services "Preferred tools" gets its logos back (owner, 2026-11-08; brochure
 * 2026-11-07 p4). Data only; the `logo` / `logoImage` / `footnote` fields come
 * from 20261108_095100_services_logos_schema (which sorts before this file).
 *
 * Guarded against the production layout (2026-11-08): layout[3] must be the
 * specLedger `tools` row. Each item gets the built-in logo matching its name
 * (title + line), only when it has none yet; the footnote is set only when
 * empty. An item whose name is not recognised is left alone (logged).
 */

const CONTEXT = { disableRevalidate: true, servicesLogos: true }

const FOOTNOTE = 'Product names are trademarks of their respective owners and are shown to identify the tools we work with.'

const LOGO_BY_NAME: Record<string, string> = {
  shopify: 'shopify',
  'instagram shop': 'instagram',
  'facebook shop': 'facebook',
  'tiktok shop': 'tiktok',
  'meta ads': 'meta',
  'shopify email': 'shopify',
  'microsoft clarity': 'microsoft-clarity',
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  req.context = { ...req.context, ...CONTEXT }
  const c: PatchCtx = { payload, req, context: CONTEXT, done: [], skipped: [] }
  const unknown: string[] = []

  await patchPage(c, {
    slug: 'services',
    expect: { 3: 'specLedger' },
    ops: [
      [
        'fn',
        (doc) => {
          const block = doc.layout[3]
          if (block.variant !== 'tools') throw new Error(`layout[3].variant is ${block.variant ?? 'missing'}, expected tools`)
          for (const item of block.items ?? []) {
            if (item.logo || item.logoImage) continue
            const name = [item.title, item.line].filter(Boolean).join(' ').trim().toLowerCase()
            const logo = LOGO_BY_NAME[name]
            if (logo) item.logo = logo
            else unknown.push(name)
          }
          if (!block.footnote?.trim()) block.footnote = FOOTNOTE
        },
      ],
    ],
  })

  if (unknown.length) c.skipped.push(`services tools: no built-in logo for ${unknown.map((n) => `"${n}"`).join(', ')}`)
  report(c, 'services logos')
}

// Never delete or roll back content; version history holds every previous version.
export async function down(_args: MigrateDownArgs): Promise<void> {}
