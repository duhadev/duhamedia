/**
 * Postgres connection string (Vercel migration, 2026-10-28). Read at config load.
 *
 * - Runtime: the POOLED string. Neon's Vercel integration injects `DATABASE_URL`
 *   (PgBouncer, transaction mode) and `DATABASE_URL_UNPOOLED` (direct), and with
 *   preview branching it injects a per-deployment branch's values under those
 *   same names (https://neon.com/docs/guides/vercel-managed-integration).
 *   They therefore take precedence over our own `DATABASE_URI` /
 *   `DATABASE_URI_UNPOOLED`, which stay the local-dev names (docker-compose).
 * - `PAYLOAD_DB_DIRECT=true` (set by the `migrate:deploy` and `seed` package
 *   scripts): the DIRECT string, because Neon says schema migrations should use
 *   a direct connection (pooled transaction mode lacks session features such as
 *   SET and session advisory locks: https://neon.com/docs/connect/connection-pooling).
 *   Falls back to the pooled string when no direct one is set (local dev).
 *
 * Never logged. '' when unset (e.g. the DB-less CI `next build`, which never connects).
 */
export function databaseUrl(): string {
  const env = process.env
  const pooled = env.DATABASE_URL || env.DATABASE_URI || ''
  if (env.PAYLOAD_DB_DIRECT === 'true') return env.DATABASE_URL_UNPOOLED || env.DATABASE_URI_UNPOOLED || pooled
  return pooled
}
