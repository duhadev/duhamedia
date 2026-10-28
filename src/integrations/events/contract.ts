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
 * Event types the delivery job can build today (A1 contact, A2 newsletter, A3 lead_magnet).
 * `newsletter` is queued by the contact-sync job after double opt-in, never at create.
 */
export const DELIVERABLE_EVENT_TYPES: readonly string[] = ['contact', 'newsletter', 'lead_magnet']

export const MAX_BODY_BYTES = 32 * 1024
export const TRUNCATION_KEY = '_truncated'
const TOP_LEVEL = ['name', 'email', 'company'] as const

export const eventEnv = (): SiteEventV1['env'] => (process.env.APP_ENV === 'production' ? 'production' : 'staging')

/**
 * `extraFields` (A3): server-derived values appended to `fields` AFTER the
 * submitted ones, in the given order (they win over a submitted field of the
 * same name). `lead_magnet` uses it to name the asset and carry the opt-in.
 */
export function buildSubmissionEvent(
  submission: Pick<FormSubmission, 'id' | 'eventId' | 'submissionData' | 'createdAt'>,
  form: Pick<Form, 'formKey' | 'eventType' | 'fields'>,
  extraFields: Record<string, string> = {},
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
  for (const [key, value] of Object.entries(extraFields)) {
    delete event.fields[key] // re-insert so derived keys always come last, in their own order
    event.fields[key] = value
  }
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

/** Receiver limits on `fields` (secretary contract, 2026-10-28): ≤ 50 keys, each value ≤ 5000 chars. */
export const MAX_FIELD_VALUE_CHARS = 5000
export const MAX_FIELD_KEYS = 50

/**
 * Serialise to the exact body that is signed and sent. Deterministic (same
 * input → same output, so a retry signs the same body), two stages:
 *
 * 1. ALWAYS: every `fields` value is capped at 5000 characters and `fields` at
 *    50 keys (first 49 kept, in order, when more). Anything cut or dropped is
 *    named in `fields._truncated`. This is the receiver's hard limit.
 * 2. Only if the body is still over 32 KB: values are cut further, caps
 *    4096 → 64, first that fits wins; if none does, all fields are omitted.
 *
 * `name` / `company` are already ≤ 500 characters (form validation) and are never cut.
 */
export function serializeEvent(event: SiteEventV1): string {
  const build = (cap: number, reason: string): string => {
    const entries = Object.entries(event.fields).filter(([key]) => key !== TRUNCATION_KEY)
    const cutKeys: string[] = []
    const fields: Record<string, string> = {}
    for (const [key, value] of entries) {
      const next = cut(value, cap)
      if (next !== value) cutKeys.push(key)
      fields[key] = next
    }
    const dropped = entries.slice(MAX_FIELD_KEYS - 1).map(([key]) => key)
    const overflow = entries.length > MAX_FIELD_KEYS
    if (overflow) for (const key of dropped) delete fields[key]
    if (!cutKeys.length && !overflow && !reason) return JSON.stringify({ ...event, fields })
    const notes: string[] = []
    const keptCut = cutKeys.filter((k) => !overflow || !dropped.includes(k))
    if (keptCut.length) notes.push(`${keptCut.join(', ')} cut to ${cap} characters${reason}`)
    if (overflow) notes.push(`${dropped.join(', ')} omitted (max ${MAX_FIELD_KEYS} fields)`)
    if (!notes.length) notes.push(`body limit 32 KB`)
    fields[TRUNCATION_KEY] = notes.join('; ')
    return JSON.stringify({ ...event, fields })
  }

  const first = build(MAX_FIELD_VALUE_CHARS, '')
  if (bytes(first) <= MAX_BODY_BYTES) return first
  for (const cap of [4096, 2048, 1024, 512, 256, 128, 64]) {
    const body = build(cap, ' (body limit 32 KB)')
    if (bytes(body) <= MAX_BODY_BYTES) return body
  }
  // Pathological (thousands of fields): drop them all, say so.
  return JSON.stringify({ ...event, fields: { [TRUNCATION_KEY]: 'all fields omitted (body limit 32 KB)' } })
}

/**
 * A3 `lead_magnet` event fields (INTEGRATIONS.md): `asset` (lead magnet title),
 * `assetSlug`, `assetId`, and `newsletterOptIn` ("yes" | "no": whether the
 * visitor ticked the form's opt-in checkbox — the signup itself is still
 * pending double opt-in at that point). Missing lead magnet → empty strings,
 * so the lead is still announced.
 */
export function leadMagnetEventFields(
  leadMagnet: { id: number | string; title?: string | null; slug?: string | null } | null,
  form: Pick<Form, 'newsletterSync' | 'newsletterOptInField'>,
  submission: Pick<FormSubmission, 'submissionData'>,
): Record<string, string> {
  const optInField = form.newsletterOptInField?.trim()
  const ticked =
    form.newsletterSync === true &&
    (!optInField || (submission.submissionData ?? []).some((r) => r.field === optInField && r.value === 'true'))
  return {
    asset: leadMagnet?.title ?? '',
    assetSlug: leadMagnet?.slug ?? '',
    assetId: leadMagnet ? String(leadMagnet.id) : '',
    newsletterOptIn: ticked ? 'yes' : 'no',
  }
}
