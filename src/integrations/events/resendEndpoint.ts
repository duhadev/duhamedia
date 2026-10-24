import { commitTransaction, initTransaction, killTransaction, type Endpoint } from 'payload'

import { isStaff } from '../../access/roles'
import { queueDelivery, stampSubmission } from './deliveryTask'

/**
 * `POST /api/form-submissions/:id/resend` — the admin "Re-send" action (lead flow step 5).
 *
 * Staff only (admin + marketing; never the pipeline user or the public).
 * Allowed when the submission's delivery is `failed` or `delivered`; refused
 * while `pending` (a chain is already queued) and for forms that send no event.
 * Sets `pending` and queues attempt 1 of a fresh chain in one transaction. The
 * submission's `eventId` is NOT touched, so the secretary dedupes a delivered
 * event (`{"duplicate": true}`, no second announcement).
 *
 * Verified payload@3.91.0: collection `endpoints` (config/types.d.ts `Endpoint`
 * { path, method, handler(req) }), mounted under /api/<slug>; `:id` arrives in
 * `req.routeParams`. Transaction helpers exported from `payload`.
 */
export const resendDeliveryEndpoint: Endpoint = {
  path: '/:id/resend',
  method: 'post',
  handler: async (req) => {
    const headers = { 'Cache-Control': 'no-store' }
    if (!isStaff(req.user)) return Response.json({ message: 'Forbidden' }, { status: 403, headers })

    const id = Number(req.routeParams?.id)
    if (!Number.isInteger(id) || id <= 0) return Response.json({ message: 'Not found' }, { status: 404, headers })

    const sub = await req.payload.findByID({
      collection: 'form-submissions',
      id,
      depth: 0,
      disableErrors: true,
      overrideAccess: false,
      user: req.user,
      req,
    })
    if (!sub) return Response.json({ message: 'Not found' }, { status: 404, headers })
    if (!sub.eventId || !sub.deliveryStatus) {
      return Response.json({ message: 'This form sends no event.' }, { status: 400, headers })
    }
    if (sub.deliveryStatus === 'pending') {
      return Response.json({ message: 'Already queued; wait for it to finish.' }, { status: 409, headers })
    }

    const shouldCommit = await initTransaction(req)
    try {
      await stampSubmission(
        req.payload,
        id,
        { deliveryStatus: 'pending', deliveryNote: `Re-send requested ${new Date().toISOString()}.` },
        req,
      )
      await queueDelivery(req.payload, { submissionId: id, req })
      if (shouldCommit) await commitTransaction(req)
    } catch (error) {
      await killTransaction(req)
      req.payload.logger.error({ submissionId: id, err: (error as Error)?.name }, '[site-event] re-send failed')
      return Response.json({ message: 'Could not queue the re-send.' }, { status: 500, headers })
    }
    req.payload.logger.info({ submissionId: id }, '[site-event] re-send queued')
    return Response.json({ ok: true, message: 'Re-send queued.' }, { status: 200, headers })
  },
}
