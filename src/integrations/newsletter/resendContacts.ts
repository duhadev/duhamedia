/**
 * Resend Contacts sync for ONE confirmed newsletter signup (DECISIONS §K2):
 * global Contact + the newsletter Segment + the newsletter Topic (opt-in).
 * Never the deprecated Audiences API.
 *
 * Plain `fetch` against Resend's REST API, no SDK: the same approach as the
 * installed `@payloadcms/email-resend@3.91.0` (dist/index.js POSTs to
 * https://api.resend.com/emails with fetch), no new dependency, and the HTTP
 * status drives retry/fail directly. Endpoints and bodies verified 2026-10-23
 * against https://resend.com/docs/api-reference/contacts/* and the official
 * SDK `resend@6.34.1` (dist/index.mjs: contacts.create → POST /contacts with
 * `segments`/`topics`; contacts.segments.add → POST /contacts/{id}/segments/{segmentId},
 * no body; contacts.topics.update → PATCH /contacts/{id}/topics with the topics
 * ARRAY as the body).
 *
 * Idempotent by construction, so a retry or an admin re-sync is safe:
 *   GET /contacts/{email}
 *     404 → POST /contacts { email, unsubscribed: false, segments: [{id}], topics: [{id, subscription: 'opt_in'}] }  (one call)
 *     200 → [PATCH /contacts/{id} { unsubscribed: false } only if globally unsubscribed]
 *           → GET /contacts/{id}/segments → POST /contacts/{id}/segments/{segmentId} only if missing
 *           → PATCH /contacts/{id}/topics [{ id, subscription: 'opt_in' }]
 * Reached only after the visitor clicked the double opt-in link, which is the
 * explicit consent that justifies clearing a previous global unsubscribe.
 *
 * Never throws. Never returns or logs the key, the email or response bodies;
 * a 4xx note carries only the status and Resend's error `name`.
 */

const API = 'https://api.resend.com'
export const RESEND_TIMEOUT_MS = 10_000

export type SyncOutcome =
  | { kind: 'synced'; contactId: string; created: boolean }
  /** 4xx (bad key/permission/validation): failed now, no retry. */
  | { kind: 'rejected'; status: number; excerpt: string }
  /** 5xx, 429, 409 (locked/concurrent), timeout or network error: retry on the schedule. */
  | { kind: 'retry'; reason: string }
  /** RESEND_API_KEY / segment / topic env missing: failed now. */
  | { kind: 'unconfigured'; reason: string }

type Call = { ok: true; status: number; json: Record<string, unknown> } | { ok: false; outcome: SyncOutcome }

const errName = (json: Record<string, unknown>) =>
  typeof json.name === 'string' ? json.name.replace(/[^a-z0-9_]/gi, '').slice(0, 60) : ''

/** Encode the email for a path segment but keep `@` and `+` literal, as the official SDK sends it. */
const emailPath = (email: string) => encodeURIComponent(email).replace(/%40/g, '@').replace(/%2B/gi, '+')

async function call(key: string, method: string, path: string, body?: unknown, allow404 = false): Promise<Call> {
  let res: Response
  try {
    res = await fetch(`${API}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${key}`,
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      redirect: 'manual',
      cache: 'no-store',
      signal: AbortSignal.timeout(RESEND_TIMEOUT_MS),
    })
  } catch (error) {
    const err = error as { name?: string; cause?: { code?: string } }
    const reason =
      err?.name === 'TimeoutError' ? `timeout after ${RESEND_TIMEOUT_MS / 1000}s` : (err?.cause?.code ?? err?.name ?? 'network error')
    return { ok: false, outcome: { kind: 'retry', reason: `Resend ${method} ${label(path)}: ${reason}` } }
  }
  let json: Record<string, unknown> = {}
  try {
    const parsed: unknown = JSON.parse((await res.text()).slice(0, 65_536))
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) json = parsed as Record<string, unknown>
  } catch {
    // Not JSON: the status decides.
  }
  if (res.ok || (allow404 && res.status === 404)) return { ok: true, status: res.status, json }
  const what = `Resend ${method} ${label(path)}: HTTP ${res.status}${errName(json) ? ` ${errName(json)}` : ''}`
  if (res.status >= 500 || res.status === 429 || res.status === 409) {
    return { ok: false, outcome: { kind: 'retry', reason: what } }
  }
  return { ok: false, outcome: { kind: 'rejected', status: res.status, excerpt: what } }
}

/** Path for notes/logs with the email and ids removed. */
const label = (path: string) =>
  path
    .replace(/^\/contacts\/[^/]+/, '/contacts/{contact}')
    .replace(/\/segments\/[^/]+$/, '/segments/{segment}')

export async function syncNewsletterContact(email: string): Promise<SyncOutcome> {
  const key = process.env.RESEND_API_KEY
  const segmentId = process.env.RESEND_NEWSLETTER_SEGMENT_ID
  const topicId = process.env.RESEND_NEWSLETTER_TOPIC_ID
  const missing = [
    !key && 'RESEND_API_KEY',
    !segmentId && 'RESEND_NEWSLETTER_SEGMENT_ID',
    !topicId && 'RESEND_NEWSLETTER_TOPIC_ID',
  ].filter(Boolean)
  if (!key || !segmentId || !topicId) return { kind: 'unconfigured', reason: `${missing.join(', ')} not set` }

  const found = await call(key, 'GET', `/contacts/${emailPath(email)}`, undefined, true)
  if (!found.ok) return found.outcome

  if (found.status === 404) {
    const created = await call(key, 'POST', '/contacts', {
      email,
      unsubscribed: false,
      segments: [{ id: segmentId }],
      topics: [{ id: topicId, subscription: 'opt_in' }],
    })
    if (!created.ok) return created.outcome
    const id = created.json.id
    // A 2xx without an id is not something we can confirm: retry (the next attempt takes the GET path).
    if (typeof id !== 'string' || !id) return { kind: 'retry', reason: 'Resend POST /contacts: no contact id in reply' }
    return { kind: 'synced', contactId: id, created: true }
  }

  const contactId = found.json.id
  if (typeof contactId !== 'string' || !contactId) return { kind: 'retry', reason: 'Resend GET /contacts: no contact id in reply' }
  const cid = encodeURIComponent(contactId)

  if (found.json.unsubscribed === true) {
    const resub = await call(key, 'PATCH', `/contacts/${cid}`, { unsubscribed: false })
    if (!resub.ok) return resub.outcome
  }

  const segs = await call(key, 'GET', `/contacts/${cid}/segments`)
  if (!segs.ok) return segs.outcome
  const inSegment = Array.isArray(segs.json.data) && segs.json.data.some((s) => (s as { id?: unknown })?.id === segmentId)
  if (!inSegment) {
    const added = await call(key, 'POST', `/contacts/${cid}/segments/${encodeURIComponent(segmentId)}`)
    if (!added.ok) return added.outcome
  }

  const topics = await call(key, 'PATCH', `/contacts/${cid}/topics`, [{ id: topicId, subscription: 'opt_in' }])
  if (!topics.ok) return topics.outcome

  return { kind: 'synced', contactId, created: false }
}
