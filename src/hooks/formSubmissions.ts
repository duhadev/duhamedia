import { randomUUID } from 'node:crypto'

import type { CollectionBeforeChangeHook } from 'payload'

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
