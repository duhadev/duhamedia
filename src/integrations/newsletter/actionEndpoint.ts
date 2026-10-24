import { commitTransaction, initTransaction, killTransaction, type Endpoint } from 'payload'

import { isStaff } from '../../access/roles'
import { stampSubmission } from '../events/deliveryTask'

import { queueConfirmationEmail, queueContactSync } from './tasks'

/**
 * `POST /api/form-submissions/:id/newsletter/:action` — admin newsletter actions (A2).
 * Staff only (admin + marketing; never the pipeline user or the public → 403).
 *
 * - `resend-confirmation`: allowed while the signup is `pending-confirmation`
 *   or `expired` and the email is not mid-chain. Issues a NEW link (expiry and
 *   stored hash cleared; the job pins new ones), which voids the old link.
 *   The signup goes back to `pending-confirmation`.
 * - `resync`: allowed once `confirmed` and the sync is `failed` or `synced`.
 *   Resend calls are idempotent; the newsletter event is never re-announced
 *   by a re-sync (the job only queues it while `deliveryStatus` is empty).
 *   Re-sending the EVENT itself is A1's "Re-send to secretary" (same eventId).
 *
 * Responses: 200 {ok}, 400 not a newsletter signup / unknown action,
 * 404 unknown id, 409 not allowed in the current state.
 */
export const newsletterActionEndpoint: Endpoint = {
  path: '/:id/newsletter/:action',
  method: 'post',
  handler: async (req) => {
    const headers = { 'Cache-Control': 'no-store' }
    const reply = (status: number, message: string, ok = false) => Response.json({ ok, message }, { status, headers })
    if (!isStaff(req.user)) return reply(403, 'Forbidden')

    const id = Number(req.routeParams?.id)
    const action = String(req.routeParams?.action ?? '')
    if (!Number.isInteger(id) || id <= 0) return reply(404, 'Not found')
    if (action !== 'resend-confirmation' && action !== 'resync') return reply(400, 'Unknown action.')

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
    const nl = sub.newsletter
    if (!nl?.optInStatus) return reply(400, 'This submission does not join the newsletter.')

    let patch: Record<string, unknown>
    if (action === 'resend-confirmation') {
      if (nl.optInStatus === 'confirmed') return reply(409, 'Already confirmed; nothing to re-send.')
      if (nl.emailStatus === 'pending') return reply(409, 'Already queued; wait for it to finish.')
      patch = {
        optInStatus: 'pending-confirmation',
        emailStatus: 'pending',
        emailNote: `Re-send requested ${new Date().toISOString()}.`,
        confirmTokenHash: null,
        confirmExpiresAt: null,
      }
    } else {
      if (nl.optInStatus !== 'confirmed') return reply(409, 'Not confirmed yet; nothing to sync.')
      if (nl.syncStatus === 'pending') return reply(409, 'Already queued; wait for it to finish.')
      patch = { syncStatus: 'pending', syncNote: `Re-sync requested ${new Date().toISOString()}.` }
    }

    const shouldCommit = await initTransaction(req)
    try {
      await stampSubmission(req.payload, id, { newsletter: patch }, req)
      await (action === 'resync' ? queueContactSync : queueConfirmationEmail)(req.payload, { submissionId: id, req })
      if (shouldCommit) await commitTransaction(req)
    } catch (error) {
      await killTransaction(req)
      req.payload.logger.error({ submissionId: id, err: (error as Error)?.name }, `[newsletter] ${action} failed`)
      return reply(500, 'Could not queue it.')
    }
    req.payload.logger.info({ submissionId: id }, `[newsletter] ${action} queued`)
    return reply(200, action === 'resync' ? 'Re-sync queued.' : 'New confirmation email queued.', true)
  },
}
