import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { seedContent, summarize } from '../seed/run'

// One-time placeholder seed (human-approved 2026-10-28). Runs once per database
// inside `payload migrate` (Vercel build), create-only, images off while the
// Blob stores are private (OPS #20). Re-seed later with `pnpm seed`.
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const log = await seedContent(payload, req, { withMedia: false })
  payload.logger.info(summarize(log))
}

// Never delete content.
export async function down(_args: MigrateDownArgs): Promise<void> {}
