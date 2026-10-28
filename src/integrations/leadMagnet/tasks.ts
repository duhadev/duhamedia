import { randomUUID } from 'node:crypto'

import type { Payload, PayloadRequest, TaskConfig } from 'payload'

import type { FormSubmission } from '../../payload-types'
import { retryDelaysMs, stampSubmission } from '../events/deliveryTask'
import { runJobAfterResponse } from '../jobs/runAfterResponse'
import { NEWSLETTER_QUEUE, submittedEmail } from '../newsletter/tasks'

import { deliverAsset } from './assetEmail'

/**
 * A3: `sendLeadMagnetAsset` — emails the requested lead-magnet asset
 * (./assetEmail.ts) and tracks it in the submission's `assetEmail` group,
 * separately from event delivery (the `lead_magnet` event is A1's
 * `deliverSiteEvent`, queued at create like `contact`). A down secretary never
 * holds up the email, and a Resend outage never holds up the event.
 *
 * Queue: `newsletter` — the queue that already carries every Resend-bound job
 * (A2), so all Resend traffic stays under one `limit: 10` per minute (Resend:
 * 10 req/s per team) and no third autoRun entry is needed.
 *
 * Same pattern as A1/A2: `retries: 0`; the input carries `attempt`; 5xx, 429,
 * 409, timeout or network → attempt n+1 with `waitUntil` on the locked
 * schedule (≈1 m, 5 m, 30 m, 2 h, 12 h, then `failed`); other 4xx and
 * unfixable-by-retry problems → `failed` at once. The task never throws,
 * re-reads the submission and skips unless `assetEmail.status` is `pending`.
 * The input also carries `chain` (fixed for one chain of retries, new for an
 * admin re-send): it keys Resend's Idempotency-Key, so retries never send
 * twice and a re-send sends again on purpose.
 * Logs: submissionId, attempt and outcome only — never the email, file URL or content.
 */

export const ASSET_EMAIL_TASK = 'sendLeadMagnetAsset'

type IO = { input: { submissionId: number; attempt: number; chain: string }; output: { result: string } }

export const queueAssetEmail = async (
  payload: Payload,
  args: { submissionId: number; attempt?: number; chain?: string; waitUntil?: Date; req?: PayloadRequest },
) => {
  const job = await payload.jobs.queue({
    task: ASSET_EMAIL_TASK,
    input: { submissionId: args.submissionId, attempt: args.attempt ?? 1, chain: args.chain ?? randomUUID() },
    queue: NEWSLETTER_QUEUE,
    waitUntil: args.waitUntil,
    req: args.req,
  } as Parameters<Payload['jobs']['queue']>[0])
  // On Vercel, attempt 1 runs right after the response.
  runJobAfterResponse(payload, job, args.waitUntil)
  return job
}

type AssetEmail = NonNullable<FormSubmission['assetEmail']>

export const sendLeadMagnetAssetTask: TaskConfig<IO> = {
  slug: ASSET_EMAIL_TASK,
  label: 'Email the lead-magnet asset',
  retries: 0,
  inputSchema: [
    { name: 'submissionId', type: 'number', required: true },
    { name: 'attempt', type: 'number', required: true },
    { name: 'chain', type: 'text', required: true },
  ],
  outputSchema: [{ name: 'result', type: 'text', required: true }],
  handler: async ({ input, req }) => {
    const { submissionId, chain } = input
    const attempt = Math.max(1, Math.floor(input.attempt || 1))
    const log = (msg: string) => req.payload.logger.info({ submissionId, attempt }, `[lead-magnet] asset email: ${msg}`)

    const sub = await req.payload.findByID({
      collection: 'form-submissions',
      id: submissionId,
      depth: 0,
      disableErrors: true,
      overrideAccess: true,
      req,
    })
    const ae = sub?.assetEmail
    if (!sub || ae?.status !== 'pending') {
      log('skipped (not pending)')
      return { output: { result: 'skipped' } }
    }
    const stamp = (patch: Partial<AssetEmail>) =>
      stampSubmission(req.payload, submissionId, { assetEmail: { ...patch, attempts: (ae.attempts ?? 0) + 1 } }, req)

    const to = submittedEmail(sub)
    const leadMagnetId = typeof sub.leadMagnet === 'object' ? sub.leadMagnet?.id : sub.leadMagnet
    if (!to || !leadMagnetId || !sub.eventId) {
      await stamp({ status: 'failed', note: `Attempt ${attempt}: ${!to ? 'no email field value' : 'no lead magnet on this submission'}; not retried.` })
      log('failed: incomplete submission')
      return { output: { result: 'failed' } }
    }

    const outcome = await deliverAsset(req, {
      leadMagnetId,
      to,
      idempotencyKey: `lead-magnet-asset/${sub.eventId}/${chain}`,
    })
    const at = new Date().toISOString()

    if (outcome.kind === 'sent') {
      await stamp({ status: 'sent', note: `Attempt ${attempt}: ${outcome.detail} at ${at}.` })
      log('sent')
      return { output: { result: 'sent' } }
    }
    if (outcome.kind === 'final') {
      await stamp({ status: 'failed', note: `Attempt ${attempt}: ${outcome.reason}.` })
      log('failed')
      return { output: { result: 'failed' } }
    }
    const delays = retryDelaysMs()
    if (attempt > delays.length) {
      await stamp({ status: 'failed', note: `Attempt ${attempt}: ${outcome.reason}; gave up after ${attempt} attempts.` })
      log('failed: retries exhausted')
      return { output: { result: 'failed' } }
    }
    const waitUntil = new Date(Date.now() + delays[attempt - 1])
    // Queue first: if the stamp fails, the submission is still pending and the next attempt still runs.
    await queueAssetEmail(req.payload, { submissionId, attempt: attempt + 1, chain, waitUntil, req })
    await stamp({ status: 'pending', note: `Attempt ${attempt}: ${outcome.reason}; attempt ${attempt + 1} after ${waitUntil.toISOString()}.` })
    log('retry scheduled')
    return { output: { result: 'retry-scheduled' } }
  },
}
