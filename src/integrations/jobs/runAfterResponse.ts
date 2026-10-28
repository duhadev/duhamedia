import { after } from 'next/server'
import type { Payload } from 'payload'

/**
 * Runs a just-queued job right after the current response, on Vercel only.
 *
 * Why: Vercel Hobby allows one cron call a day, so without this a lead would
 * wait up to 24 h. Every queue helper (deliveryTask, newsletter/leadMagnet
 * tasks, site_error) calls this with the job it created; the daily cron in
 * vercel.json is only the backstop for anything this misses.
 *
 * - `after()` (next@16.3.8 docs 01-app/03-api-reference/04-functions/after.md):
 *   works in route handlers (incl. Payload's REST catch-all, so custom
 *   endpoints and collection hooks), Server Components and server functions;
 *   uses Vercel's `waitUntil`; may be nested, so a job that queues a follow-on
 *   (newsletter sync → `newsletter` event) schedules the follow-on's run too.
 *   Outside a request scope (scripts, local autoRun) it throws → ignored here.
 * - `payload.jobs.run({ allQueues, where, limit })` (payload@3.91.0
 *   queues/localAPI.js `run` → operations/runJobs/index.js): the `where` is
 *   ANDed with Payload's own filters (not completed, no error, `processing:
 *   false`, `waitUntil` absent or past), so a job already claimed by the cron
 *   is not picked again and a retry scheduled in the future is never forced
 *   early (we also skip scheduling it at all). Not `runByID`: that claims by id
 *   with none of those filters.
 * - Scoped to this one job id, so two concurrent requests never compete for
 *   the same job. The only possible overlap is the daily cron at the same
 *   instant; every task re-checks its own `pending` status, events dedupe on
 *   `eventId` at the secretary and the asset email on Resend's Idempotency-Key.
 * - Gated on `VERCEL`: locally `jobs.autoRun` already runs every minute
 *   in-process, and a second in-process runner would only race it.
 * - Best effort: never throws, never awaited by the visitor's response.
 */
export function runJobAfterResponse(payload: Payload, job: unknown, waitUntil?: Date): void {
  if (!process.env.VERCEL) return
  if (waitUntil && waitUntil.getTime() > Date.now()) return
  const id = job && typeof job === 'object' && 'id' in job ? (job as { id: unknown }).id : undefined
  if (typeof id !== 'number' && typeof id !== 'string') return
  try {
    after(async () => {
      try {
        await payload.jobs.run({ allQueues: true, limit: 1, where: { id: { equals: id } } })
      } catch (error) {
        payload.logger.error({ jobId: id, err: (error as Error)?.name ?? 'error' }, '[jobs] run after response failed')
      }
    })
  } catch {
    /* outside a request scope: the cron runs it */
  }
}
