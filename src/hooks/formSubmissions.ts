import { randomUUID } from 'node:crypto'

import type { CollectionAfterChangeHook, CollectionBeforeChangeHook, PayloadRequest } from 'payload'

import { DELIVERABLE_EVENT_TYPES } from '../integrations/events/contract'
import { DELIVERY_WRITE, queueDelivery } from '../integrations/events/deliveryTask'
import { queueAssetEmail } from '../integrations/leadMagnet/tasks'
import { queueConfirmationEmail } from '../integrations/newsletter/tasks'
import type { FormSubmission } from '../payload-types'

/**
 * `form-submissions` beforeChange, create only (SCHEMA.md §6.13, §10, X13).
 *
 * - `eventId`: a fresh UUID (node:crypto) on EVERY create, whatever the
 *   caller sent. It is the idempotency key the integration job reuses on
 *   every retry and re-send (CLAUDE.md lead flow step 5); re-send is an
 *   update, so it never regenerates. Admin "Duplicate" is a create too, so a
 *   copy can never share an id.
 * - `deliveryStatus`: `pending` only when the submission's form has
 *   `sendEvent` on AND an event type other than `none`; otherwise empty
 *   (X13: the p9 homework form's event is off at launch, and a forever-pending
 *   row would pollute the "Failed deliveries" view). Caller-sent values are
 *   overwritten either way.
 *
 * Runs after the plugin's own beforeChange hooks (`createCharge`, a no-op
 * without `handlePayment`): plugin-form-builder@3.91.0
 * dist/collections/FormSubmissions/index.js:111-117. Collection beforeChange
 * runs before field beforeChange (payload@3.91.0
 * collections/operations/create.js:196-232), so the plugin's `form` validator
 * still rejects an unknown form after this hook; a missing form here just
 * means "no event".
 *
 * The form is read with `overrideAccess: true` and the same `req`
 * (transaction): forms are staff-read, and the public submitter has no user.
 */
export const stampSubmissionDelivery: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  if (operation !== 'create') return data

  const raw: unknown = data?.form
  const formId =
    typeof raw === 'number' || typeof raw === 'string'
      ? raw
      : raw && typeof raw === 'object' && 'id' in raw
        ? (raw as { id: number | string }).id
        : null

  let form: {
    sendEvent?: boolean | null
    eventType?: string | null
    newsletterSync?: boolean | null
    newsletterOptInField?: string | null
  } | null = null
  if (formId !== null && formId !== '') {
    try {
      form = await req.payload.findByID({
        collection: 'forms',
        id: formId,
        depth: 0,
        select: { sendEvent: true, eventType: true, newsletterSync: true, newsletterOptInField: true },
        disableErrors: true,
        overrideAccess: true,
        req,
      })
    } catch {
      // Malformed id: leave it to the plugin's `form` validator to reject.
      form = null
    }
  }

  const sendsEvent = form?.sendEvent === true && !!form.eventType && form.eventType !== 'none'

  // A2 double opt-in: the signup waits for the confirm click. Sync only when
  // the form syncs and, on forms with an opt-in checkbox (lead magnets), only
  // when it was ticked. Caller-sent newsletter values are always overwritten.
  const optInField = form?.newsletterOptInField?.trim()
  const rows = Array.isArray(data?.submissionData) ? (data.submissionData as { field?: unknown; value?: unknown }[]) : []
  const optedIn =
    form?.newsletterSync === true && (!optInField || rows.some((r) => r?.field === optInField && r?.value === 'true'))

  // A3: the lead magnet this submission requested. The public handler only keeps
  // a published lead magnet whose capture form is this form; re-checked here
  // for every create path. Without one (e.g. admin-entered), the single
  // published lead magnet using this form is assumed; ambiguous → none.
  const leadMagnet = formId !== null && formId !== '' && form ? await resolveLeadMagnet(req, formId, data?.leadMagnet) : null

  return {
    ...data,
    eventId: randomUUID(),
    leadMagnet,
    // A3: the asset email (newsletter queue), queued in afterChange below.
    assetEmail: leadMagnet ? { status: 'pending', attempts: 0 } : {},
    // A `newsletter` event is sent only AFTER the visitor confirms (the sync job
    // stamps `pending` then), so it starts empty rather than forever-pending.
    deliveryStatus: sendsEvent && form?.eventType !== 'newsletter' ? 'pending' : null,
    newsletter: optedIn
      ? { optInStatus: 'pending-confirmation', emailStatus: 'pending', emailAttempts: 0, syncAttempts: 0 }
      : {},
  }
}

/**
 * `form-submissions` afterChange, create only (lead flow step 3).
 *
 * Enqueues the delivery job, never sends inline: the visitor's request only
 * pays for one row insert. `payload.jobs.queue` is passed `req`, so the job row
 * is written in the SAME transaction as the submission (payload@3.91.0
 * queues/localAPI.js → db.create with req): no job without its lead, no lead
 * without its job. `deliveryStatus: pending` was already stamped in
 * beforeChange (above); only event types the job can build are queued here.
 * Newsletter events are sent after double opt-in confirmation, not at create
 * (src/integrations/newsletter/tasks.ts); here only the confirmation email is queued.
 *
 * Runs after the plugin's own `sendEmail` (plugin-form-builder@3.91.0
 * FormSubmissions/index.js:105-110), which is not gated on the event.
 * Our own status writes are adapter-level updates (`stampSubmission`, no
 * hooks) and never `create`, so they never re-enter here; the
 * `context[DELIVERY_WRITE]` guard stays for any Local API update that sets it.
 */
export const enqueueSubmissionDelivery: CollectionAfterChangeHook<FormSubmission> = async ({
  doc,
  operation,
  req,
  context,
}) => {
  if (operation !== 'create' || context?.[DELIVERY_WRITE]) return doc

  // A2: the double opt-in email, same transaction as the signup (newsletter queue).
  if (doc.newsletter?.emailStatus === 'pending') await queueConfirmationEmail(req.payload, { submissionId: doc.id, req })
  // A3: the lead-magnet asset email, same transaction (newsletter queue).
  if (doc.assetEmail?.status === 'pending') await queueAssetEmail(req.payload, { submissionId: doc.id, req })

  if (doc.deliveryStatus !== 'pending') return doc

  const formId = typeof doc.form === 'object' ? doc.form.id : doc.form
  const form = await req.payload.findByID({
    collection: 'forms',
    id: formId,
    depth: 0,
    select: { eventType: true },
    disableErrors: true,
    overrideAccess: true,
    req,
  })
  if (!form?.eventType || !DELIVERABLE_EVENT_TYPES.includes(form.eventType)) return doc

  await queueDelivery(req.payload, { submissionId: doc.id, req })
  return doc
}

const idOf = (raw: unknown): number | string | null =>
  typeof raw === 'number' || (typeof raw === 'string' && raw !== '')
    ? raw
    : raw && typeof raw === 'object' && 'id' in raw
      ? (raw as { id: number | string }).id
      : null

/**
 * A3: the lead magnet a new submission requested, or null. A given id counts
 * only if it is a lead magnet whose capture form is this form (published:
 * the public handler already insists on that; an admin may enter one for a
 * draft). No id → the one published lead magnet using this form, if exactly one.
 * Trusted read (`overrideAccess`, same `req`/transaction).
 */
async function resolveLeadMagnet(req: PayloadRequest, formId: number | string, raw: unknown): Promise<number | null> {
  const given = idOf(raw)
  if (given !== null && !/^\d+$/.test(String(given))) return null
  const { docs } = await req.payload.find({
    collection: 'lead-magnets',
    where:
      given !== null
        ? { and: [{ id: { equals: given } }, { form: { equals: formId } }] }
        : { and: [{ form: { equals: formId } }, { _status: { equals: 'published' } }] },
    depth: 0,
    limit: 2,
    pagination: false,
    select: { form: true },
    overrideAccess: true,
    req,
  })
  return docs.length === 1 ? docs[0].id : null
}
