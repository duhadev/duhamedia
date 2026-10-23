import { randomUUID } from 'node:crypto'

import type { CollectionAfterChangeHook, CollectionBeforeChangeHook } from 'payload'

import { DELIVERABLE_EVENT_TYPES } from '../integrations/events/contract'
import { DELIVERY_WRITE, queueDelivery } from '../integrations/events/deliveryTask'
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

  let form: { sendEvent?: boolean | null; eventType?: string | null } | null = null
  if (formId !== null && formId !== '') {
    try {
      form = await req.payload.findByID({
        collection: 'forms',
        id: formId,
        depth: 0,
        select: { sendEvent: true, eventType: true },
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

  return {
    ...data,
    eventId: randomUUID(),
    deliveryStatus: sendsEvent ? 'pending' : null,
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
 * Newsletter events are sent after double opt-in confirmation, not at create.
 *
 * Runs after the plugin's own `sendEmail` (plugin-form-builder@3.91.0
 * FormSubmissions/index.js:105-110), which is not gated on the event.
 * Our own status writes are updates (never `create`) and carry
 * `context[DELIVERY_WRITE]`, so they never re-enter here.
 */
export const enqueueSubmissionDelivery: CollectionAfterChangeHook<FormSubmission> = async ({
  doc,
  operation,
  req,
  context,
}) => {
  if (operation !== 'create' || context?.[DELIVERY_WRITE] || doc.deliveryStatus !== 'pending') return doc

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
