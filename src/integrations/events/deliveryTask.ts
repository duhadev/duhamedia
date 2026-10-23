import type { Payload, PayloadRequest, TaskConfig } from 'payload'

import type { FormSubmission } from '../../payload-types'

import { DELIVERABLE_EVENT_TYPES, buildSubmissionEvent, serializeEvent } from './contract'
import { sendSignedEvent, type SendOutcome } from './send'

/**
 * Payload Jobs task that delivers ONE submission's v1 event (DECISIONS §J).
 *
 * Verified against payload@3.91.0 (installed dist):
 * - queues/config/types/taskTypes.d.ts: TaskConfig { slug, handler, inputSchema,
 *   outputSchema, retries }; handler returns `{ output }`; `retries: 0` = never retried.
 * - queues/localAPI.js: `payload.jobs.queue({ task, input, queue, waitUntil, req })`
 *   inserts with `req` (same transaction as the caller); `waitUntil` → not picked up before.
 * - queues/operations/runJobs/index.js: jobs run with `isolateObjectProperty(req,
 *   'transactionID')` (no wrapping transaction); picks `waitUntil` < now only.
 * - config/defaults.js: `deleteJobOnComplete: true`, so finished jobs vanish.
 *
 * The schedule is ours (native backoff is only fixed/exponential): the task never
 * throws; on 5xx/timeout it queues attempt n+1 with `waitUntil = now + RETRY_DELAYS[n-1]`
 * and leaves the submission `pending`; after the last delay it stamps `failed`.
 * 4xx → `failed` immediately. 2xx (incl. {"duplicate": true}) → `delivered`.
 * The submission's `eventId` (stamped at create, never regenerated) is the
 * idempotency key on every attempt and re-send.
 */

export const DELIVERY_TASK = 'deliverSiteEvent'
export const EVENTS_QUEUE = 'events'

/** ≈ 1 min, 5 min, 30 min, 2 h, 12 h (CLAUDE.md, locked). Six attempts in total. */
const LOCKED_DELAYS_MS = [60_000, 300_000, 1_800_000, 7_200_000, 43_200_000]

/**
 * Development only: `SITE_EVENT_RETRY_DELAYS_S=5,5,5,5,5` compresses the schedule
 * for Gate A proofs. Ignored unless APP_ENV=development (so it can never shorten
 * staging/production), and ignored unless it lists exactly five positive numbers.
 */
export function retryDelaysMs(): number[] {
  const override = process.env.SITE_EVENT_RETRY_DELAYS_S
  if (process.env.APP_ENV === 'development' && override) {
    const parsed = override.split(',').map((s) => Number(s.trim()) * 1000)
    if (parsed.length === LOCKED_DELAYS_MS.length && parsed.every((n) => Number.isFinite(n) && n > 0)) return parsed
  }
  return LOCKED_DELAYS_MS
}

type DeliverIO = { input: { submissionId: number; attempt: number }; output: { result: string } }

/** Queue an attempt. Pass the caller's `req` so it joins the caller's transaction. */
export const queueDelivery = (
  payload: Payload,
  args: { submissionId: number; attempt?: number; waitUntil?: Date; req?: PayloadRequest },
) =>
  payload.jobs.queue({
    task: DELIVERY_TASK,
    input: { submissionId: args.submissionId, attempt: args.attempt ?? 1 },
    queue: EVENTS_QUEUE,
    waitUntil: args.waitUntil,
    req: args.req,
  } as Parameters<Payload['jobs']['queue']>[0])

/** Context flag on our own status writes, so submission hooks never react to them. */
export const DELIVERY_WRITE = 'siteEventDeliveryWrite'

type Stamp = Pick<FormSubmission, 'deliveryStatus' | 'deliveryNote'>

const describe = (o: SendOutcome): string => {
  switch (o.kind) {
    case 'delivered':
      return o.duplicate ? `already received (duplicate), HTTP ${o.status}` : `delivered, HTTP ${o.status}`
    case 'rejected':
      return `rejected, HTTP ${o.status}${o.excerpt ? ` "${o.excerpt}"` : ''}; not retried`
    case 'unconfigured':
      return `not sent: ${o.reason}; not retried`
    case 'retry':
      return o.reason
  }
}

export const deliverSiteEventTask: TaskConfig<DeliverIO> = {
  slug: DELIVERY_TASK,
  label: 'Deliver site event to the secretary',
  retries: 0,
  inputSchema: [
    { name: 'submissionId', type: 'number', required: true },
    { name: 'attempt', type: 'number', required: true },
  ],
  outputSchema: [{ name: 'result', type: 'text', required: true }],
  handler: async ({ input, req }) => {
    const { payload } = req
    const { submissionId } = input
    const attempt = Math.max(1, Math.floor(input.attempt || 1))
    const log = (msg: string) => payload.logger.info({ submissionId, attempt }, `[site-event] ${msg}`)

    const sub = await payload.findByID({
      collection: 'form-submissions',
      id: submissionId,
      depth: 0,
      disableErrors: true,
      overrideAccess: true,
      req,
    })
    // Deleted, or already settled by another chain / a re-send: nothing to do.
    if (!sub || sub.deliveryStatus !== 'pending') {
      log('skipped (not pending)')
      return { output: { result: 'skipped' } }
    }

    const stamp = async (data: Stamp) => {
      await payload.update({
        collection: 'form-submissions',
        id: submissionId,
        data: { ...data, deliveryAttempts: (sub.deliveryAttempts ?? 0) + 1, lastAttemptAt: new Date().toISOString() },
        depth: 0,
        overrideAccess: true,
        context: { [DELIVERY_WRITE]: true },
        req,
      })
    }

    let outcome: SendOutcome
    try {
      const formId = typeof sub.form === 'object' ? sub.form.id : sub.form
      const form = await payload.findByID({ collection: 'forms', id: formId, depth: 0, overrideAccess: true, req })
      if (!DELIVERABLE_EVENT_TYPES.includes(form.eventType)) {
        outcome = { kind: 'unconfigured', reason: `event type "${form.eventType}" is not built yet` }
      } else {
        outcome = await sendSignedEvent(serializeEvent(buildSubmissionEvent(sub, form)))
      }
    } catch (error) {
      // Our side failed before/around the send (e.g. DB blip): retry on the schedule.
      outcome = { kind: 'retry', reason: `internal ${(error as Error)?.name ?? 'error'}` }
    }

    if (outcome.kind === 'delivered') {
      await stamp({ deliveryStatus: 'delivered', deliveryNote: `Attempt ${attempt}: ${describe(outcome)}.` })
      log(describe(outcome))
      return { output: { result: 'delivered' } }
    }
    if (outcome.kind !== 'retry') {
      await stamp({ deliveryStatus: 'failed', deliveryNote: `Attempt ${attempt}: ${describe(outcome)}.` })
      log(`failed: ${outcome.kind}`)
      return { output: { result: 'failed' } }
    }

    const delays = retryDelaysMs()
    if (attempt > delays.length) {
      await stamp({
        deliveryStatus: 'failed',
        deliveryNote: `Attempt ${attempt}: ${outcome.reason}; gave up after ${attempt} attempts.`,
      })
      log(`failed: retries exhausted (${outcome.reason})`)
      return { output: { result: 'failed' } }
    }
    const waitUntil = new Date(Date.now() + delays[attempt - 1])
    // Queue first: if the stamp below fails, the submission is still pending and the next attempt still runs.
    await queueDelivery(payload, { submissionId, attempt: attempt + 1, waitUntil, req })
    await stamp({
      deliveryStatus: 'pending',
      deliveryNote: `Attempt ${attempt}: ${outcome.reason}; attempt ${attempt + 1} after ${waitUntil.toISOString()}.`,
    })
    log(`retry scheduled (${outcome.reason})`)
    return { output: { result: 'retry-scheduled' } }
  },
}
