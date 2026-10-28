import { createHmac } from 'node:crypto'

/**
 * Signed POST of one v1 event body to the secretary (`SITE_EVENT_URL`, an
 * https URL behind Cloudflare Access in the cloud; see `accessHeaders`).
 *
 * Signing (CLAUDE.md, locked): `X-Duha-Timestamp: <unix seconds>` and
 * `X-Duha-Signature: sha256=<hex HMAC-SHA256(SITE_EVENT_SECRET, timestamp + "." + rawBody)>`.
 * The timestamp is taken HERE, at send time (the secretary rejects > 5 min old),
 * and the HMAC is computed over the same UTF-8 bytes that go on the wire.
 * Node's built-in crypto + fetch; no dependency.
 *
 * Never throws. Never logs or returns the URL, secret, body or response body
 * beyond a short sanitised excerpt for 4xx notes.
 */

export const SEND_TIMEOUT_MS = 10_000

export type SendOutcome =
  /** 2xx: delivered (`duplicate` when the secretary answered {"duplicate": true}). */
  | { kind: 'delivered'; status: number; duplicate: boolean }
  /** 4xx or other non-retryable answer: failed now, no retry. */
  | { kind: 'rejected'; status: number; excerpt: string }
  /** 5xx, timeout or network error: retry on the schedule. */
  | { kind: 'retry'; reason: string }
  /** SITE_EVENT_URL / SITE_EVENT_SECRET missing or invalid: failed now. */
  | { kind: 'unconfigured'; reason: string }

export const signBody = (secret: string, timestamp: string, body: Buffer): string =>
  `sha256=${createHmac('sha256', secret).update(`${timestamp}.`, 'utf8').update(body).digest('hex')}`

const excerpt = (text: string) =>
  text
    .replace(/[\u0000-\u001f\u007f]+/g, ' ')
    .trim()
    .slice(0, 200)

/**
 * Cloudflare Access service-token headers (Vercel migration, 2026-10-28):
 * `SITE_EVENT_URL` is now a public HTTPS hostname on the secretary's Cloudflare
 * tunnel, gated by an Access application with a Service Auth policy. Access
 * reads `CF-Access-Client-Id` / `CF-Access-Client-Secret` on each request
 * (https://developers.cloudflare.com/cloudflare-one/identity/service-tokens/).
 * Sent only when BOTH env vars are set (none = the old internal-address
 * behaviour, e.g. a local stub receiver). Transport auth only: the HMAC above
 * still covers the body and is unchanged; these headers are not signed.
 */
const accessHeaders = (): Record<string, string> => {
  const id = process.env.SITE_EVENT_ACCESS_CLIENT_ID?.trim()
  const secret = process.env.SITE_EVENT_ACCESS_CLIENT_SECRET?.trim()
  return id && secret ? { 'CF-Access-Client-Id': id, 'CF-Access-Client-Secret': secret } : {}
}

export async function sendSignedEvent(body: string): Promise<SendOutcome> {
  const url = process.env.SITE_EVENT_URL
  const secret = process.env.SITE_EVENT_SECRET
  if (!secret) return { kind: 'unconfigured', reason: 'SITE_EVENT_SECRET is not set' }
  let target: URL
  try {
    target = new URL(url ?? '')
    if (target.protocol !== 'http:' && target.protocol !== 'https:') throw new Error()
  } catch {
    return { kind: 'unconfigured', reason: 'SITE_EVENT_URL is not set or not an http(s) URL' }
  }

  const raw = Buffer.from(body, 'utf8')
  const timestamp = String(Math.floor(Date.now() / 1000))

  let res: Response
  try {
    res = await fetch(target, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Duha-Timestamp': timestamp,
        'X-Duha-Signature': signBody(secret, timestamp, raw),
        ...accessHeaders(),
      },
      body: raw,
      redirect: 'manual',
      cache: 'no-store',
      signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
    })
  } catch (error) {
    const err = error as { name?: string; cause?: { code?: string } }
    const reason = err?.name === 'TimeoutError' ? `timeout after ${SEND_TIMEOUT_MS / 1000}s` : (err?.cause?.code ?? err?.name ?? 'network error')
    return { kind: 'retry', reason }
  }

  let text = ''
  try {
    text = (await res.text()).slice(0, 2048)
  } catch {
    // Body unreadable: the status still decides.
  }

  if (res.status >= 200 && res.status < 300) {
    let duplicate = false
    try {
      duplicate = (JSON.parse(text) as { duplicate?: unknown })?.duplicate === true
    } catch {
      // Not JSON: a plain 2xx is still delivered.
    }
    return { kind: 'delivered', status: res.status, duplicate }
  }
  if (res.status >= 500) return { kind: 'retry', reason: `HTTP ${res.status}` }
  // 4xx (bad signature / schema / stale timestamp) and anything else (3xx = misconfigured URL): no retry.
  return { kind: 'rejected', status: res.status, excerpt: excerpt(text) }
}
