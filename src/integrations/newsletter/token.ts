import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Double opt-in confirm token (DECISIONS §K2, Gate 0 Q2).
 *
 * Token = `<submissionId>.<expiresAtMs>.<sig>`, where
 * sig = base64url(HMAC-SHA256(key, "nl-confirm:v1:<submissionId>:<eventId>:<expiresAtMs>"))
 * and key = HMAC-SHA256(PAYLOAD_SECRET, "duha:newsletter-confirm:v1") — a key derived
 * from the existing secret, so no new env var; rotating PAYLOAD_SECRET voids pending links.
 *
 * - Signed: forging needs the key; the submission's random `eventId` is in the MAC.
 * - Expiring: `expiresAtMs` is in the MAC and checked against now.
 * - Deterministic for a given (id, eventId, expiry), so a retried email job
 *   re-sends the SAME link. Only `sha256(token)` is stored
 *   (`newsletter.confirmTokenHash`); a re-send picks a new expiry, which
 *   replaces the hash and voids the older link.
 * - Single use: the confirm step only acts while `optInStatus` is
 *   `pending-confirmation` (src/integrations/newsletter/confirm.ts).
 * Node's built-in crypto; no dependency.
 */

/** How long a confirm link stays valid. */
export const CONFIRM_TTL_MS = 72 * 60 * 60 * 1000

const key = (): Buffer => {
  const secret = process.env.PAYLOAD_SECRET
  if (!secret) throw new Error('PAYLOAD_SECRET is not set')
  return createHmac('sha256', secret).update('duha:newsletter-confirm:v1').digest()
}

const sign = (submissionId: number, eventId: string, expiresAtMs: number): string =>
  createHmac('sha256', key()).update(`nl-confirm:v1:${submissionId}:${eventId}:${expiresAtMs}`).digest('base64url')

export const hashToken = (token: string): string => createHash('sha256').update(token, 'utf8').digest('hex')

export const issueToken = (submissionId: number, eventId: string, expiresAtMs: number): string =>
  `${submissionId}.${expiresAtMs}.${sign(submissionId, eventId, expiresAtMs)}`

export type ParsedToken = { submissionId: number; expiresAtMs: number; sig: string }

/** Shape check only (no DB, no key). `null` for anything malformed. */
export function parseToken(raw: unknown): ParsedToken | null {
  if (typeof raw !== 'string' || raw.length > 200) return null
  const m = /^([1-9]\d{0,9})\.(\d{13})\.([A-Za-z0-9_-]{43})$/.exec(raw)
  if (!m) return null
  return { submissionId: Number(m[1]), expiresAtMs: Number(m[2]), sig: m[3] }
}

const safeEqual = (a: string, b: string) => {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

/** True when the signature matches this submission's eventId (constant-time). */
export const signatureValid = (t: ParsedToken, eventId: string): boolean =>
  safeEqual(t.sig, sign(t.submissionId, eventId, t.expiresAtMs))

/** True when `token` is the link currently on record (constant-time). */
export const matchesStoredHash = (token: string, storedHash: string | null | undefined): boolean =>
  !!storedHash && safeEqual(hashToken(token), storedHash)
