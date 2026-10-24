import type { Payload, TaskConfig } from 'payload'

import { EVENTS_QUEUE, retryDelaysMs } from '../events/deliveryTask'
import { sendSignedEvent } from '../events/send'
import { SITE_ERROR_TASK } from './report'

/**
 * A4: deliver ONE `site_error` event (queue `events`, `retries: 0`, the locked
 * schedule by self re-queue, exactly like `deliverSiteEvent`; payload@3.91.0
 * APIs as verified in ../events/deliveryTask.ts).
 *
 * Job-only, no collection: a site error is not a lead (CLAUDE.md: Postgres is
 * the durable record of LEADS), so nothing is stored beyond the queued job row
 * (`payload_jobs`, deleted on completion). The input carries the exact body,
 * already scrubbed and fixed at first enqueue (same `eventId` + bytes on every
 * retry; the signed timestamp header is fresh per attempt). Outcomes are
 * logged (`[site-error] …`, fingerprint/eventId/attempt only); there is no
 * admin re-send for errors.
 *
 * Never throws (a throw would be recorded by the job runner, and when run via
 * /api/payload-jobs the reporter skips that path anyway).
 */

type IO = {
  input: { body: string; eventId: string; fingerprint: string; attempt: number }
  output: { result: string }
}

export const deliverSiteErrorTask: TaskConfig<IO> = {
  slug: SITE_ERROR_TASK,
  label: 'Deliver site error to the secretary',
  retries: 0,
  inputSchema: [
    { name: 'body', type: 'text', required: true },
    { name: 'eventId', type: 'text', required: true },
    { name: 'fingerprint', type: 'text', required: true },
    { name: 'attempt', type: 'number', required: true },
  ],
  outputSchema: [{ name: 'result', type: 'text', required: true }],
  handler: async ({ input, req }) => {
    const { payload } = req
    const attempt = Math.max(1, Math.floor(input.attempt || 1))
    const meta = { fingerprint: input.fingerprint, eventId: input.eventId, attempt }
    try {
      const outcome = await sendSignedEvent(input.body)
      if (outcome.kind === 'delivered') {
        payload.logger.info(meta, `[site-error] delivered, HTTP ${outcome.status}${outcome.duplicate ? ' (duplicate)' : ''}`)
        return { output: { result: 'delivered' } }
      }
      if (outcome.kind === 'rejected') {
        payload.logger.error(meta, `[site-error] failed: rejected, HTTP ${outcome.status}; not retried`)
        return { output: { result: 'failed' } }
      }
      if (outcome.kind === 'unconfigured') {
        payload.logger.error(meta, `[site-error] failed: ${outcome.reason}; not retried`)
        return { output: { result: 'failed' } }
      }
      const delays = retryDelaysMs()
      if (attempt > delays.length) {
        payload.logger.error(meta, `[site-error] failed: ${outcome.reason}; gave up after ${attempt} attempts`)
        return { output: { result: 'failed' } }
      }
      const waitUntil = new Date(Date.now() + delays[attempt - 1])
      await payload.jobs.queue({
        task: SITE_ERROR_TASK,
        input: { ...input, attempt: attempt + 1 },
        queue: EVENTS_QUEUE,
        waitUntil,
        req,
      } as Parameters<Payload['jobs']['queue']>[0])
      payload.logger.info(meta, `[site-error] ${outcome.reason}; attempt ${attempt + 1} after ${waitUntil.toISOString()}`)
      return { output: { result: 'retry-scheduled' } }
    } catch (error) {
      payload.logger.error({ ...meta, err: (error as Error)?.name ?? 'error' }, '[site-error] failed: internal error; not retried')
      return { output: { result: 'failed' } }
    }
  },
}
