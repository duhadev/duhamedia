import { commitTransaction, createLocalReq, initTransaction, killTransaction, type Payload } from 'payload'

import { stampSubmission } from '../events/deliveryTask'

import { queueContactSync } from './tasks'
import { matchesStoredHash, parseToken, signatureValid } from './token'

/**
 * The double opt-in click (GET /newsletter/confirm?token=…). Called by the
 * page server component; framework-free so scripts can call it too.
 *
 * - `confirmed`: the token is signed by us, is the link on record, has not
 *   expired, and the signup was `pending-confirmation` → in ONE transaction:
 *   `optInStatus: confirmed`, `confirmedAt`, `syncStatus: pending`, and the
 *   contact-sync job queued. The visitor never waits on Resend.
 * - `already`: a genuine link (valid signature) for a signup that is already
 *   confirmed → nothing changes (re-clicks, mail scanners re-fetching).
 * - `expired`: a genuine link past its expiry (the signup is stamped
 *   `expired`, nothing else changes), or one replaced by a newer re-send.
 * - `invalid`: malformed, tampered, unknown submission → nothing is read
 *   beyond the id, nothing changes.
 * - `error`: our side failed (DB); nothing was committed.
 */
export type ConfirmResult = 'confirmed' | 'already' | 'expired' | 'invalid' | 'error'

export async function confirmNewsletterSignup(payload: Payload, rawToken: unknown): Promise<ConfirmResult> {
  const parsed = parseToken(rawToken)
  if (!parsed || typeof rawToken !== 'string') return 'invalid'

  const req = await createLocalReq({}, payload)
  try {
    const sub = await payload.findByID({
      collection: 'form-submissions',
      id: parsed.submissionId,
      depth: 0,
      disableErrors: true,
      overrideAccess: true,
      showHiddenFields: true,
      req,
    })
    if (!sub?.eventId || !sub.newsletter?.optInStatus) return 'invalid'
    if (!signatureValid(parsed, sub.eventId)) return 'invalid'

    const nl = sub.newsletter
    if (nl.optInStatus === 'confirmed') return 'already'
    if (nl.optInStatus === 'expired') return 'expired'
    if (!matchesStoredHash(rawToken, nl.confirmTokenHash)) return 'expired' // superseded by a re-send

    // Conditional, column-targeted writes: only while still pending-confirmation
    // with this exact link on record, so two simultaneous clicks confirm once.
    const write = (patch: Record<string, unknown>) =>
      stampSubmission(payload, sub.id, { newsletter: patch }, req, {
        'newsletter.optInStatus': { equals: 'pending-confirmation' },
        'newsletter.confirmTokenHash': { equals: nl.confirmTokenHash },
      })

    if (Date.now() > parsed.expiresAtMs) {
      await write({ optInStatus: 'expired' })
      payload.logger.info({ submissionId: sub.id }, '[newsletter] confirm: link expired')
      return 'expired'
    }

    const shouldCommit = await initTransaction(req)
    try {
      const claimed = await write({ optInStatus: 'confirmed', confirmedAt: new Date().toISOString(), syncStatus: 'pending' })
      if (!claimed) {
        // Another click won the race (or a re-send replaced the link) in between.
        if (shouldCommit) await commitTransaction(req)
        return 'already'
      }
      await queueContactSync(payload, { submissionId: sub.id, req })
      if (shouldCommit) await commitTransaction(req)
    } catch (error) {
      await killTransaction(req)
      throw error
    }
    payload.logger.info({ submissionId: sub.id }, '[newsletter] confirm: confirmed; contact sync queued')
    return 'confirmed'
  } catch (error) {
    payload.logger.error({ err: (error as Error)?.name }, '[newsletter] confirm failed')
    return 'error'
  }
}
