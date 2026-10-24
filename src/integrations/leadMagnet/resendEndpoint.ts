import { commitTransaction, initTransaction, killTransaction, type Endpoint } from 'payload'

import { isStaff } from '../../access/roles'
import { stampSubmission } from '../events/deliveryTask'

import { queueAssetEmail } from './tasks'

/**
 * `POST /api/form-submissions/:id/asset-email/resend` — admin "Re-send asset email" (A3).
 * Staff only (admin + marketing; never the pipeline user or the public → 403).
 *
 * Allowed when the asset email is `failed` or `sent` (the visitor says it never
 * arrived); refused while `pending` (a chain is queued) and for submissions
 * that requested no lead magnet. Sets `pending` and queues attempt 1 of a NEW
 * chain in one transaction: a new chain id = a new Resend Idempotency-Key, so
 * the asset is really sent again. Re-sending the EVENT is A1's
 * "Re-send to secretary" (same eventId → secretary dedupes).
 *
 * Responses: 200 {ok}, 400 not a lead-magnet request, 404 unknown id, 409 pending.
 */
export const resendAssetEmailEndpoint: Endpoint = {
  path: '/:id/asset-email/resend',
  method: 'post',
  handler: async (req) => {
    const headers = { 'Cache-Control': 'no-store' }
    const reply = (status: number, message: string, ok = false) => Response.json({ ok, message }, { status, headers })
    if (!isStaff(req.user)) return reply(403, 'Forbidden')

    const id = Number(req.routeParams?.id)
    if (!Number.isInteger(id) || id <= 0) return reply(404, 'Not found')

    const sub = await req.payload.findByID({
      collection: 'form-submissions',
      id,
      depth: 0,
      disableErrors: true,
      overrideAccess: false,
      user: req.user,
      req,
    })
    if (!sub) return reply(404, 'Not found')
    if (!sub.assetEmail?.status || !sub.leadMagnet) return reply(400, 'This submission did not request a lead magnet.')
    if (sub.assetEmail.status === 'pending') return reply(409, 'Already queued; wait for it to finish.')

    const shouldCommit = await initTransaction(req)
    try {
      await stampSubmission(
        req.payload,
        id,
        { assetEmail: { status: 'pending', note: `Re-send requested ${new Date().toISOString()}.` } },
        req,
      )
      await queueAssetEmail(req.payload, { submissionId: id, req })
      if (shouldCommit) await commitTransaction(req)
    } catch (error) {
      await killTransaction(req)
      req.payload.logger.error({ submissionId: id, err: (error as Error)?.name }, '[lead-magnet] asset email re-send failed')
      return reply(500, 'Could not queue the re-send.')
    }
    req.payload.logger.info({ submissionId: id }, '[lead-magnet] asset email re-send queued')
    return reply(200, 'Asset email queued.', true)
  },
}
