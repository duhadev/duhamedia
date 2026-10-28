import type { Payload, PayloadRequest, TaskConfig } from 'payload'

import { absoluteUrl, getAppEnv } from '../../lib/siteUrl'
import type { FormSubmission } from '../../payload-types'
import { queueDelivery, retryDelaysMs, stampSubmission } from '../events/deliveryTask'
import { runJobAfterResponse } from '../jobs/runAfterResponse'

import { confirmationEmail } from './email'
import { syncNewsletterContact, type SyncOutcome } from './resendContacts'
import { CONFIRM_TTL_MS, hashToken, issueToken } from './token'

/**
 * Newsletter double opt-in jobs (CLAUDE.md lead flow step 7, DECISIONS §J/§K2),
 * on the `newsletter` queue, tracked in the submission's `newsletter` group,
 * separately from event delivery:
 *
 *  1. `sendNewsletterConfirmation` — emails the signed, expiring confirm link
 *     (Payload's email adapter = @payloadcms/email-resend). `emailStatus`
 *     pending → sent | failed.
 *  2. `syncNewsletterContact` — after the visitor confirmed: Resend Contact +
 *     Segment + Topic opt-in (./resendContacts.ts). `syncStatus` pending →
 *     synced | failed. On `synced`, and only for forms whose event type is
 *     `newsletter` with Send event on, it stamps `deliveryStatus: pending` and
 *     queues the A1 `deliverSiteEvent` job (events queue, same eventId).
 *     So a down secretary never holds up the sync, and vice versa.
 *
 * Same pattern as A1 (src/integrations/events/deliveryTask.ts): `retries: 0`,
 * the input carries `attempt`, 5xx/timeout/429 re-queue attempt n+1 with
 * `waitUntil` on the locked schedule (≈1 m, 5 m, 30 m, 2 h, 12 h, then
 * `failed`), 4xx → `failed` at once. The task never throws, re-reads the
 * submission and skips unless its step is still `pending` (a stray or
 * duplicate job is harmless). Status writes touch only their own columns
 * (`stampSubmission`), so the parallel events/newsletter jobs never clobber each other.
 * Logs: submissionId, attempt and outcome only — never the email or link.
 */

export const NEWSLETTER_QUEUE = 'newsletter'
export const CONFIRM_EMAIL_TASK = 'sendNewsletterConfirmation'
export const CONTACT_SYNC_TASK = 'syncNewsletterContact'

type IO = { input: { submissionId: number; attempt: number }; output: { result: string } }

const queueStep =
  (task: string) =>
  async (payload: Payload, args: { submissionId: number; attempt?: number; waitUntil?: Date; req?: PayloadRequest }) => {
    const job = await payload.jobs.queue({
      task,
      input: { submissionId: args.submissionId, attempt: args.attempt ?? 1 },
      queue: NEWSLETTER_QUEUE,
      waitUntil: args.waitUntil,
      req: args.req,
    } as Parameters<Payload['jobs']['queue']>[0])
    // On Vercel, an immediate step runs right after the response.
    runJobAfterResponse(payload, job, args.waitUntil)
    return job
  }

export const queueConfirmationEmail = queueStep(CONFIRM_EMAIL_TASK)
export const queueContactSync = queueStep(CONTACT_SYNC_TASK)

type Newsletter = NonNullable<FormSubmission['newsletter']>

/** The submitted `email` field value (forms with newsletter sync must have one). */
export const submittedEmail = (sub: Pick<FormSubmission, 'submissionData'>): string =>
  (sub.submissionData ?? []).find((r) => r.field === 'email')?.value?.trim() ?? ''

const loadPending = async (req: PayloadRequest, id: number) =>
  req.payload.findByID({
    collection: 'form-submissions',
    id,
    depth: 0,
    disableErrors: true,
    overrideAccess: true,
    showHiddenFields: true, // confirmTokenHash is `hidden`
    req,
  })

/** Column-targeted write of newsletter (and optionally delivery) fields; see `stampSubmission`. */
const writeNewsletter = (req: PayloadRequest, sub: FormSubmission, patch: Partial<Newsletter>, extra: Partial<FormSubmission> = {}) =>
  stampSubmission(req.payload, sub.id, { ...extra, newsletter: patch }, req)

type Step = 'retry' | 'final'
/** Next attempt per the locked schedule, or null when retries are exhausted. */
const nextAttempt = (attempt: number): Date | null => {
  const delays = retryDelaysMs()
  return attempt > delays.length ? null : new Date(Date.now() + delays[attempt - 1])
}

/* -------------------------------------------------------------------------- */
/* 1. Confirmation email                                                        */
/* -------------------------------------------------------------------------- */

type EmailOutcome = { kind: 'sent'; via: string } | { kind: Step; reason: string }

async function sendConfirmation(req: PayloadRequest, to: string, link: string): Promise<EmailOutcome> {
  // Without a key Payload falls back to its console transport, which "sends"
  // nothing. That is only acceptable on a developer machine.
  if (!process.env.RESEND_API_KEY && getAppEnv() !== 'development') {
    return { kind: 'final', reason: 'not sent: RESEND_API_KEY is not set; not retried' }
  }
  try {
    await req.payload.sendEmail({ to, ...confirmationEmail(link) })
    return { kind: 'sent', via: process.env.RESEND_API_KEY ? 'Resend' : 'console transport (development, not delivered)' }
  } catch (error) {
    // @payloadcms/email-resend@3.91.0 throws APIError(message, statusCode); the
    // message can echo the recipient, so only the status is kept.
    const status = Number((error as { status?: unknown; statusCode?: unknown })?.status ?? 0)
    if (status >= 400 && status < 500 && status !== 429 && status !== 409) {
      return { kind: 'final', reason: `rejected by Resend, HTTP ${status}; not retried` }
    }
    return { kind: 'retry', reason: status ? `Resend HTTP ${status}` : `send error ${(error as Error)?.name ?? ''}`.trim() }
  }
}

export const sendNewsletterConfirmationTask: TaskConfig<IO> = {
  slug: CONFIRM_EMAIL_TASK,
  label: 'Send newsletter confirmation email (double opt-in)',
  retries: 0,
  inputSchema: [
    { name: 'submissionId', type: 'number', required: true },
    { name: 'attempt', type: 'number', required: true },
  ],
  outputSchema: [{ name: 'result', type: 'text', required: true }],
  handler: async ({ input, req }) => {
    const { submissionId } = input
    const attempt = Math.max(1, Math.floor(input.attempt || 1))
    const log = (msg: string) => req.payload.logger.info({ submissionId, attempt }, `[newsletter] confirm email: ${msg}`)

    const sub = await loadPending(req, submissionId)
    const nl = sub?.newsletter
    if (!sub || nl?.emailStatus !== 'pending' || nl.optInStatus !== 'pending-confirmation') {
      log('skipped (not pending)')
      return { output: { result: 'skipped' } }
    }
    const stamp = (patch: Partial<Newsletter>) =>
      writeNewsletter(req, sub, { ...patch, emailAttempts: (nl.emailAttempts ?? 0) + 1 })

    const to = submittedEmail(sub)
    if (!to || !sub.eventId) {
      await stamp({ emailStatus: 'failed', emailNote: `Attempt ${attempt}: no email field value; not retried.` })
      log('failed: no email')
      return { output: { result: 'failed' } }
    }

    // The link's expiry is fixed on the first attempt of a chain and reused on
    // retries (same link); a re-send clears it, so the new chain issues a new link.
    let expiresAtMs = nl.confirmExpiresAt ? Date.parse(nl.confirmExpiresAt) : NaN
    let token: string
    try {
      if (!Number.isFinite(expiresAtMs) || !nl.confirmTokenHash) expiresAtMs = Date.now() + CONFIRM_TTL_MS
      token = issueToken(sub.id, sub.eventId, expiresAtMs)
    } catch {
      await stamp({ emailStatus: 'failed', emailNote: `Attempt ${attempt}: PAYLOAD_SECRET is not set; not retried.` })
      return { output: { result: 'failed' } }
    }
    const link = `${absoluteUrl(CONFIRM_PATH)}?token=${encodeURIComponent(token)}`
    const pinned = { confirmTokenHash: hashToken(token), confirmExpiresAt: new Date(expiresAtMs).toISOString() }

    const outcome = await sendConfirmation(req, to, link)
    const at = new Date().toISOString()
    if (outcome.kind === 'sent') {
      await stamp({ ...pinned, emailStatus: 'sent', emailNote: `Attempt ${attempt}: sent via ${outcome.via} at ${at}; link valid until ${pinned.confirmExpiresAt}.` })
      log('sent')
      return { output: { result: 'sent' } }
    }
    if (outcome.kind === 'final') {
      await stamp({ ...pinned, emailStatus: 'failed', emailNote: `Attempt ${attempt}: ${outcome.reason}.` })
      log('failed')
      return { output: { result: 'failed' } }
    }
    const waitUntil = nextAttempt(attempt)
    if (!waitUntil) {
      await stamp({ ...pinned, emailStatus: 'failed', emailNote: `Attempt ${attempt}: ${outcome.reason}; gave up after ${attempt} attempts.` })
      log('failed: retries exhausted')
      return { output: { result: 'failed' } }
    }
    await queueConfirmationEmail(req.payload, { submissionId, attempt: attempt + 1, waitUntil, req })
    await stamp({ ...pinned, emailStatus: 'pending', emailNote: `Attempt ${attempt}: ${outcome.reason}; attempt ${attempt + 1} after ${waitUntil.toISOString()}.` })
    log('retry scheduled')
    return { output: { result: 'retry-scheduled' } }
  },
}

/** Public confirm page (src/app/(frontend)/newsletter/confirm/page.tsx). */
export const CONFIRM_PATH = '/newsletter/confirm'

/* -------------------------------------------------------------------------- */
/* 2. Resend Contact + Segment + Topic                                          */
/* -------------------------------------------------------------------------- */

const describeSync = (o: Exclude<SyncOutcome, { kind: 'synced' }>) =>
  o.kind === 'rejected' ? `${o.excerpt}; not retried` : o.kind === 'unconfigured' ? `not synced: ${o.reason}; not retried` : o.reason

export const syncNewsletterContactTask: TaskConfig<IO> = {
  slug: CONTACT_SYNC_TASK,
  label: 'Sync newsletter contact to Resend (contact, segment, topic)',
  retries: 0,
  inputSchema: [
    { name: 'submissionId', type: 'number', required: true },
    { name: 'attempt', type: 'number', required: true },
  ],
  outputSchema: [{ name: 'result', type: 'text', required: true }],
  handler: async ({ input, req }) => {
    const { submissionId } = input
    const attempt = Math.max(1, Math.floor(input.attempt || 1))
    const log = (msg: string) => req.payload.logger.info({ submissionId, attempt }, `[newsletter] contact sync: ${msg}`)

    const sub = await loadPending(req, submissionId)
    const nl = sub?.newsletter
    if (!sub || nl?.syncStatus !== 'pending' || nl.optInStatus !== 'confirmed') {
      log('skipped (not pending)')
      return { output: { result: 'skipped' } }
    }
    const attempts = (nl.syncAttempts ?? 0) + 1

    const email = submittedEmail(sub)
    let outcome: SyncOutcome = email
      ? await syncNewsletterContact(email)
      : { kind: 'rejected', status: 0, excerpt: 'no email field value' }

    if (outcome.kind === 'synced') {
      // Hand over to event delivery (A1) — once per submission. A re-sync of an
      // already-announced signup never re-announces it.
      const formId = typeof sub.form === 'object' ? sub.form.id : sub.form
      const form = await req.payload
        .findByID({ collection: 'forms', id: formId, depth: 0, disableErrors: true, overrideAccess: true, req })
        .catch(() => null)
      const announce = form?.eventType === 'newsletter' && form.sendEvent === true && !sub.deliveryStatus
      try {
        if (announce) await queueDelivery(req.payload, { submissionId, req })
        await writeNewsletter(
          req,
          sub,
          {
            syncStatus: 'synced',
            syncAttempts: attempts,
            contactId: outcome.contactId,
            syncNote: `Attempt ${attempt}: ${outcome.created ? 'contact created' : 'existing contact updated'}; in segment, topic opt-in, at ${new Date().toISOString()}.`,
          },
          announce ? { deliveryStatus: 'pending', deliveryNote: 'Queued after newsletter confirmation.' } : {},
        )
      } catch (error) {
        outcome = { kind: 'retry', reason: `internal ${(error as Error)?.name ?? 'error'} after sync` }
      }
      if (outcome.kind === 'synced') {
        log(announce ? 'synced; newsletter event queued' : 'synced')
        return { output: { result: 'synced' } }
      }
    }

    if (outcome.kind !== 'retry') {
      await writeNewsletter(req, sub, { syncStatus: 'failed', syncAttempts: attempts, syncNote: `Attempt ${attempt}: ${describeSync(outcome)}.` })
      log(`failed: ${outcome.kind}`)
      return { output: { result: 'failed' } }
    }
    const waitUntil = nextAttempt(attempt)
    if (!waitUntil) {
      await writeNewsletter(req, sub, { syncStatus: 'failed', syncAttempts: attempts, syncNote: `Attempt ${attempt}: ${outcome.reason}; gave up after ${attempt} attempts.` })
      log('failed: retries exhausted')
      return { output: { result: 'failed' } }
    }
    await queueContactSync(req.payload, { submissionId, attempt: attempt + 1, waitUntil, req })
    await writeNewsletter(req, sub, { syncStatus: 'pending', syncAttempts: attempts, syncNote: `Attempt ${attempt}: ${outcome.reason}; attempt ${attempt + 1} after ${waitUntil.toISOString()}.` })
    log('retry scheduled')
    return { output: { result: 'retry-scheduled' } }
  },
}
