import type { Form, FormSubmission } from '../../payload-types'

/**
 * Site event contract v1 (CLAUDE.md "Integration architecture", INTEGRATIONS.md).
 * Built here from a stored submission; signed and sent by ./send.ts.
 *
 * - `name`, `email`, `company` are top-level whenever the FORM defines a field
 *   with that exact name ("" when the visitor left it blank); they are not
 *   repeated inside `fields`. `fields` holds every other submitted value,
 *   keyed by form-builder field name, in submission order.
 * - `timestamp` is the submission's `createdAt` (when the lead happened), so it
 *   is identical on every retry and re-send. The freshness timestamp the
 *   secretary checks is the signed `X-Duha-Timestamp` header, computed at send.
 * - `env` is `production` only when APP_ENV=production; anything else
 *   (staging, development) sends `staging`, so a non-production server can
 *   never announce a lead as real.
 */

export type SiteEventType = 'contact' | 'newsletter' | 'lead_magnet' | 'site_error'

export type SiteEventV1 = {
  v: 1
  eventId: string
  env: 'production' | 'staging'
  type: SiteEventType
  form: string
  submissionId: string
  name?: string
  email?: string
  company?: string
  fields: Record<string, string>
  timestamp: string
}

/**
 * Event types the delivery job can build today (A1 contact, A2 newsletter).
 * `newsletter` is queued by the contact-sync job after double opt-in, never at create.
 */
export const DELIVERABLE_EVENT_TYPES: readonly string[] = ['contact', 'newsletter']

export const MAX_BODY_BYTES = 32 * 1024
export const TRUNCATION_KEY = '_truncated'
const TOP_LEVEL = ['name', 'email', 'company'] as const

export const eventEnv = (): SiteEventV1['env'] => (process.env.APP_ENV === 'production' ? 'production' : 'staging')

export function buildSubmissionEvent(
  submission: Pick<FormSubmission, 'id' | 'eventId' | 'submissionData' | 'createdAt'>,
  form: Pick<Form, 'formKey' | 'eventType' | 'fields'>,
): SiteEventV1 {
  if (!submission.eventId) throw new Error('submission has no eventId')
  if (!form.eventType || form.eventType === 'none') throw new Error('form sends no event')

  const defined = new Set((form.fields ?? []).map((f) => ('name' in f ? f.name : undefined)).filter(Boolean))
  const values = new Map<string, string>()
  for (const row of submission.submissionData ?? []) values.set(row.field, String(row.value ?? ''))

  const event: SiteEventV1 = {
    v: 1,
    eventId: submission.eventId,
    env: eventEnv(),
    type: form.eventType,
    form: form.formKey,
    submissionId: String(submission.id),
    fields: {},
    timestamp: new Date(submission.createdAt).toISOString(),
  }
  for (const key of TOP_LEVEL) if (defined.has(key)) event[key] = values.get(key) ?? ''
  for (const [key, value] of values) if (!(TOP_LEVEL as readonly string[]).includes(key)) event.fields[key] = value
  // Fixed key order (contract order) so the bytes are stable for a given submission.
  const { v, eventId, env, type, form: formKey, submissionId, name, email, company, fields, timestamp } = event
  return { v, eventId, env, type, form: formKey, submissionId, name, email, company, fields, timestamp }
}

const bytes = (s: string) => Buffer.byteLength(s, 'utf8')

/** Cut to `max` code points (never splits a surrogate pair), with an ellipsis. */
const cut = (s: string, max: number) => {
  const chars = Array.from(s)
  return chars.length > max ? `${chars.slice(0, max).join('')}…` : s
}

/**
 * Serialise to the exact body that is signed and sent, ≤ 32 KB.
 * Deterministic: if the full body is too big, every `fields` value longer than
 * the cap is cut to the cap, trying caps 8192 → 64 characters; the first cap
 * that fits wins, and `fields._truncated` names the cut fields and the cap.
 * Same input → same output, so a retry signs the same body.
 * `name` / `company` are already ≤ 500 characters (form validation) and are never cut.
 */
export function serializeEvent(event: SiteEventV1): string {
  const full = JSON.stringify(event)
  if (bytes(full) <= MAX_BODY_BYTES) return full

  for (const cap of [8192, 4096, 2048, 1024, 512, 256, 128, 64]) {
    const cutKeys: string[] = []
    const fields: Record<string, string> = {}
    for (const [key, value] of Object.entries(event.fields)) {
      const next = cut(value, cap)
      if (next !== value) cutKeys.push(key)
      fields[key] = next
    }
    fields[TRUNCATION_KEY] = `${cutKeys.join(', ')} cut to ${cap} characters (body limit 32 KB)`
    const body = JSON.stringify({ ...event, fields })
    if (bytes(body) <= MAX_BODY_BYTES) return body
  }
  // Pathological (thousands of fields): drop them all, say so.
  return JSON.stringify({ ...event, fields: { [TRUNCATION_KEY]: 'all fields omitted (body limit 32 KB)' } })
}
