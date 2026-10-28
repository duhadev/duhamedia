import config from '@payload-config'
import { sql } from '@payloadcms/db-postgres'
import { getPayload } from 'payload'

import { getSiteUrl } from '@/lib/siteUrl'

// GET /api/health — 200 {"status":"ok"} when Payload is initialised and the DB
// answers, else 503 {"status":"unavailable"}. No detail in the body. Polled
// publicly by the secretary (every 5 min). Never cached: `no-store` + dynamic
// (Vercel's CDN does not cache a function response without s-maxage/public cache headers).
// A Next route handler (not a Payload `endpoints` entry) so that a failed
// Payload init — e.g. Postgres (Neon) unreachable — is caught here and
// reported as 503 instead of an unhandled 500.
// Also 503 when SITE_URL is missing/invalid outside development (F65 B1:
// `getSiteUrl()` throws; Vercel Preview falls back to its own URL, see
// src/lib/siteUrl.ts), and on Vercel when no Blob token is configured (uploads
// would hit the read-only filesystem).
// The reason is logged server-side only, never in the body.
export const dynamic = 'force-dynamic'

const headers = { 'Cache-Control': 'no-store, max-age=0' }
const TIMEOUT_MS = 3000

function withTimeout<T>(promise: Promise<T>): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS)),
  ])
}

export async function GET(): Promise<Response> {
  try {
    getSiteUrl()
    if (process.env.VERCEL && !process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error('BLOB_READ_WRITE_TOKEN is not set on Vercel (uploads have no storage)')
    }
  } catch (error) {
    console.error('[health]', error instanceof Error ? error.message : error)
    return Response.json({ status: 'unavailable' }, { status: 503, headers })
  }
  try {
    // cron: true starts the in-process jobs cron in LOCAL DEV only (autoRun is
    // off on Vercel, where Vercel Cron drives /api/payload-jobs/run).
    const payload = await getPayload({ config, cron: true })
    await withTimeout(payload.db.drizzle.execute(sql`select 1`))
    return Response.json({ status: 'ok' }, { status: 200, headers })
  } catch {
    return Response.json({ status: 'unavailable' }, { status: 503, headers })
  }
}
