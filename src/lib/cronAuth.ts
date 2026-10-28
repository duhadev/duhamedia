import { createHash, timingSafeEqual } from 'node:crypto'

/**
 * Vercel Cron authorisation for GET /api/payload-jobs/run (src/payload.config.ts
 * `jobs.access.run`). Vercel sends the project's `CRON_SECRET` as
 * `Authorization: Bearer <CRON_SECRET>` on every cron invocation
 * (https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs); the
 * pattern matches Payload's own with-vercel-website template at v3.91.0
 * (templates/with-vercel-website/src/payload.config.ts), minus its "any
 * logged-in user" branch (our pipeline user is logged in).
 *
 * No secret configured => always false. Compared in constant time over SHA-256
 * digests (equal length by construction). The secret is never logged.
 */
const digest = (value: string) => createHash('sha256').update(value, 'utf8').digest()

export function isCronRequest(headers: Headers | undefined): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret || secret.length < 16) return false
  const header = headers?.get('authorization') ?? ''
  return timingSafeEqual(digest(header), digest(`Bearer ${secret}`))
}
