import type { Payload, PayloadRequest } from 'payload'

import { seedGlobals } from './globals'
import { seedLibrary } from './library'
import { SEED_CONTEXT, emptyLog, type SeedCtx, type SeedLog } from './lib'
import { seedPages } from './pages'

/**
 * The seed core, shared by the CLI runner (`pnpm seed`, ./index.ts) and the
 * deploy-time data migration (src/migrations/*_seed_placeholder_content.ts).
 *
 * It writes on the caller's `req` and does NOT open, commit or roll back a
 * transaction: the caller owns it (the CLI opens one; `payload migrate` runs
 * each migration in its own, @payloadcms/drizzle@3.91.0 dist/migrate.js
 * `runMigrationFile`). Create-only and idempotent (./lib.ts).
 */
export type SeedOptions = {
  /** false = no file uploads; see `SeedCtx.withMedia`. */
  withMedia: boolean
  /** Dry-run "fresh" mode only: treat every global as never saved. */
  pretendGlobalsEmpty?: boolean
}

export async function seedContent(payload: Payload, req: PayloadRequest, opts: SeedOptions): Promise<SeedLog> {
  // Every write also passes SEED_CONTEXT itself; this covers reads/hooks on the shared req.
  req.context = { ...req.context, ...SEED_CONTEXT }
  const log = emptyLog()
  const ctx: SeedCtx = { payload, req, log, withMedia: opts.withMedia, pretendGlobalsEmpty: opts.pretendGlobalsEmpty ?? false }

  console.log('Library')
  const ids = await seedLibrary(ctx)
  console.log('Globals')
  await seedGlobals(ctx, ids)
  console.log('Pages')
  await seedPages(ctx, ids)
  return log
}

/** One-line-per-list summary of a seed log. */
export function summarize(log: SeedLog, created = 'Created'): string {
  const byKind = (list: { kind: string }[]) =>
    Object.entries(list.reduce<Record<string, number>>((acc, d) => ({ ...acc, [d.kind]: (acc[d.kind] ?? 0) + 1 }), {}))
      .map(([k, n]) => `${k} ${n}`)
      .join(', ') || 'none'
  return [
    `${created}: ${log.created.length} (${byKind(log.created)})`,
    `Skipped (already existed): ${log.skipped.length} (${byKind(log.skipped)})`,
    `Omitted (images off): ${log.omitted.length} (${byKind(log.omitted)})`,
  ].join('\n')
}
