/**
 * Seed runner (CLAUDE.md Phase 4 "Seed script rules"): `pnpm seed`.
 *
 *   pnpm seed                          create whatever is missing, commit
 *   SEED_DRY_RUN=1 pnpm seed           do everything inside the transaction, then ROLL BACK
 *   SEED_DRY_RUN=fresh pnpm seed       dry run that also writes every global as if it were
 *                                      never saved (proves the global path; rolled back)
 *
 * (An env var, not a CLI flag: `payload run` re-parses argv with minimist and
 * forwards positional arguments only, so `--dry-run` would be silently dropped.)
 *
 * Idempotent and CREATE-ONLY: it never updates or deletes an existing document
 * or a saved global (lib.ts). It never runs on deploy. Running it against
 * staging or production is a human-approved action, logged in PROGRESS.md.
 *
 * Runs through `payload run` (payload@3.91.0 bin/index.js `run`: imports this
 * file with the project's .env and tsconfig paths). The package script sets
 * `PAYLOAD_MIGRATING=true`, which makes @payloadcms/db-postgres@3.91.0 skip the
 * dev-mode schema push on connect (dist/connect.js:110): the seed writes data
 * only and never touches the schema. Apply migrations (or let `pnpm dev` push)
 * first.
 *
 * Everything runs in ONE database transaction (payload `initTransaction` /
 * `commitTransaction` / `killTransaction`), so a failure leaves the database as
 * it was. Uploads go through Payload's Local API (`payload.create({ file })`),
 * so they land wherever the config stores them: local disk (MEDIA_DIR) in dev,
 * Vercel Blob when BLOB_READ_WRITE_TOKEN is set (src/plugins/storage.ts). Files
 * are written before the commit, so a failed or dry run can leave an orphan
 * file/blob (never a DB row).
 *
 * Against Neon from a laptop (human-approved, logged): put the target
 * environment's variables in a file Next/Payload do NOT auto-load, e.g.
 *   vercel env pull .env.vercel-production --environment=production
 *   set -a && . ./.env.vercel-production && set +a && SEED_DRY_RUN=1 pnpm seed
 * Exported variables win over `.env` (@next/env never overrides process.env).
 * The script sets PAYLOAD_DB_DIRECT=true, so it uses DATABASE_URL_UNPOOLED
 * (src/lib/databaseUrl.ts). Run `pnpm migrate:deploy` the same way first only if
 * the deploy has not already migrated that database.
 *
 * Output: one line per document (create / skip) and a summary. No secrets are
 * printed (the only env read here is APP_ENV and SEED_DRY_RUN). Exit code 1 on any error.
 */
import { commitTransaction, createLocalReq, getPayload, initTransaction, killTransaction } from 'payload'
import config from '@payload-config'

import { seedGlobals } from './globals'
import { seedLibrary } from './library'
import { SEED_CONTEXT, type SeedCtx, type SeedLog } from './lib'
import { seedPages } from './pages'

const dryRunEnv = (process.env.SEED_DRY_RUN ?? '').trim().toLowerCase()
const dryRun = dryRunEnv !== '' && dryRunEnv !== '0' && dryRunEnv !== 'false'
const fresh = dryRunEnv === 'fresh'

const main = async (): Promise<number> => {
  const payload = await getPayload({ config })
  const log: SeedLog = { created: [], skipped: [] }
  const req = await createLocalReq({ context: { ...SEED_CONTEXT } }, payload)
  const ctx: SeedCtx = { payload, req, log, pretendGlobalsEmpty: dryRun && fresh }

  console.log(`\nSeed — APP_ENV=${process.env.APP_ENV ?? '(unset)'}${dryRun ? ` — DRY RUN${fresh ? ' (fresh globals)' : ''}, rolled back at the end` : ''}\n`)

  const inTransaction = await initTransaction(req)
  if (!inTransaction) {
    console.error('Seed aborted: the database adapter did not open a transaction (all-or-nothing is required).')
    return 1
  }

  try {
    console.log('Library')
    const ids = await seedLibrary(ctx)
    console.log('Globals')
    await seedGlobals(ctx, ids)
    console.log('Pages')
    await seedPages(ctx, ids)

    if (dryRun) {
      await killTransaction(req)
      console.log('\nDry run: transaction rolled back, nothing was saved.')
    } else {
      await commitTransaction(req)
    }
  } catch (err) {
    await killTransaction(req)
    console.error('\nSeed FAILED — transaction rolled back, nothing was saved.')
    const e = err as { message?: string; data?: { errors?: { path?: string; message?: string }[] } }
    console.error(e?.message ?? err)
    for (const fe of e?.data?.errors ?? []) console.error(`  - ${fe.path}: ${fe.message}`)
    return 1
  }

  const byKind = (list: SeedLog['created']) =>
    Object.entries(list.reduce<Record<string, number>>((acc, d) => ({ ...acc, [d.kind]: (acc[d.kind] ?? 0) + 1 }), {}))
      .map(([k, n]) => `${k} ${n}`)
      .join(', ') || 'none'
  console.log(`\n${dryRun ? 'Would create' : 'Created'}: ${log.created.length} (${byKind(log.created)})`)
  console.log(`Skipped (already existed): ${log.skipped.length} (${byKind(log.skipped)})`)
  return 0
}

// Top-level await: `payload run` exits as soon as this module's evaluation settles.
try {
  process.exit(await main())
} catch (err) {
  console.error('Seed FAILED:', err instanceof Error ? err.message : err)
  process.exit(1)
}
