import type { Payload, PayloadRequest } from 'payload'

import { docPath } from '@/lib/docPath'
import type { Form, FormSubmission } from '@/payload-types'

import { verifyTurnstile } from '../turnstile'
import {
  FIELD_PREFIX,
  FORM_ID_KEY,
  LEAD_MAGNET_KEY,
  MAX_LENGTH,
  SOURCE_PATH_KEY,
  TURNSTILE_RESPONSE_KEY,
  type FormSubmitResult,
} from './shared'

/**
 * Server-side form submission path (CLAUDE.md canonical lead flow steps 1–2,
 * Security §1). Framework-free core: the route handler (src/app/api/form-submit/route.ts)
 * is a thin wrapper, and `payload run` scripts call this directly.
 *
 * Order (locked):
 *  1. Turnstile siteverify. Invalid → friendly error, NOTHING is read or stored.
 *  2. Load the form (Local API, trusted read: forms are staff-read).
 *  3. Validate the submitted values against the form's OWN field definitions.
 *     Unknown fields reject the whole submission; nothing client-supplied
 *     beyond the definition is stored.
 *  4. `payload.create('form-submissions')` with `overrideAccess: false` and
 *     `context.turnstileVerified = true` — the ONLY code path that sets that
 *     flag (`turnstileVerifiedOrAdmin`, src/access/index.ts). Collection
 *     hooks then run as usual: `stampSubmissionDelivery` (eventId,
 *     deliveryStatus) and the plugin's notification email.
 *
 * Event sending is NOT here. The enqueue belongs in the `form-submissions`
 * afterChange hook (src/plugins/formBuilder.ts, `formSubmissionOverrides.hooks`
 * TODO(integration)), so every create path, not just this one, enqueues.
 *
 * Rate limiting is Cloudflare's (OPS_REQUESTS.md), not ours.
 * Logs carry error names/codes only, never field values (PII).
 */

export type SubmissionInput = {
  formId: unknown
  /** Field values keyed by form-builder field name (prefix already stripped). */
  values: Record<string, string>
  /** Keys that could not be accepted while parsing (duplicates, files). Any → reject. */
  rejectedKeys?: string[]
  turnstileToken: unknown
  remoteIp?: string | null
  sourcePath?: unknown
  leadMagnetId?: unknown
}

export type SubmissionOutcome = {
  result: FormSubmitResult
  /** Set when stored. Server-side only: never returned to the browser. */
  submissionId?: number
  /** The form's redirect confirmation, resolved server-side from the form doc. */
  redirectUrl?: string
}

const MSG = {
  turnstile: "We couldn't confirm you're a person. Please try again.",
  unavailable: 'This form is unavailable right now. Please try again in a few minutes.',
  stale: 'This form has changed since the page loaded. Please refresh the page and try again.',
  invalid: 'Please check the highlighted fields.',
  storage: 'Something went wrong sending your message. Please try again.',
} as const

const fail = (message: string, fieldErrors?: Record<string, string>): SubmissionOutcome => ({
  result: fieldErrors ? { ok: false, message, fieldErrors } : { ok: false, message },
})

/* -------------------------------------------------------------------------- */
/* FormData → input                                                            */
/* -------------------------------------------------------------------------- */

/** Parse the renderer's FormData. Pure; never throws. */
export function parseSubmissionFormData(formData: FormData, remoteIp?: string | null): SubmissionInput {
  const values: Record<string, string> = {}
  const rejectedKeys: string[] = []
  const seen = new Set<string>()
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith(FIELD_PREFIX)) continue
    const name = key.slice(FIELD_PREFIX.length)
    if (seen.has(name) || typeof value !== 'string') {
      rejectedKeys.push(name)
      continue
    }
    seen.add(name)
    values[name] = value
  }
  const single = (key: string): string | undefined => {
    const all = formData.getAll(key)
    return all.length === 1 && typeof all[0] === 'string' ? all[0] : undefined
  }
  return {
    formId: single(FORM_ID_KEY),
    values,
    rejectedKeys,
    turnstileToken: single(TURNSTILE_RESPONSE_KEY),
    remoteIp: remoteIp ?? null,
    sourcePath: single(SOURCE_PATH_KEY),
    leadMagnetId: single(LEAD_MAGNET_KEY),
  }
}

/* -------------------------------------------------------------------------- */
/* Validation against the form definition                                      */
/* -------------------------------------------------------------------------- */

type FormField = NonNullable<Form['fields']>[number]
type InputField = Exclude<FormField, { blockType: 'message' }>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const CHECKBOX_ON = new Set(['true', 'on'])
const CHECKBOX_OFF = new Set(['', 'false'])

const tooLong = (max: number) => `Please keep this under ${max} characters.`

/**
 * Validate `values` against the form's fields. Returns the rows to store
 * (`submissionData`) or field errors. Values are stored as typed (trimmed);
 * empty optional fields are omitted (the plugin's `value` is required).
 */
export function validateSubmission(
  fields: Form['fields'],
  values: Record<string, string>,
):
  | { ok: true; submissionData: { field: string; value: string }[] }
  | { ok: false; unknown: string[]; fieldErrors: Record<string, string> } {
  const inputFields = (fields ?? []).filter((f): f is InputField => f.blockType !== 'message')
  const known = new Set(inputFields.map((f) => f.name))
  const unknown = Object.keys(values).filter((name) => !known.has(name))
  const fieldErrors: Record<string, string> = {}
  const submissionData: { field: string; value: string }[] = []

  for (const field of inputFields) {
    const raw = values[field.name]
    const required = field.required === true

    if (field.blockType === 'checkbox') {
      const value = raw ?? ''
      if (!CHECKBOX_ON.has(value) && !CHECKBOX_OFF.has(value)) {
        fieldErrors[field.name] = 'Please tick or untick this box.'
        continue
      }
      const checked = CHECKBOX_ON.has(value)
      if (required && !checked) {
        fieldErrors[field.name] = 'Please tick this box to continue.'
        continue
      }
      submissionData.push({ field: field.name, value: checked ? 'true' : 'false' })
      continue
    }

    const value = (raw ?? '').trim()
    if (value === '') {
      if (required) fieldErrors[field.name] = 'This field is required.'
      continue
    }

    switch (field.blockType) {
      case 'text':
      case 'textarea': {
        const max = MAX_LENGTH[field.blockType]
        if (value.length > max) fieldErrors[field.name] = tooLong(max)
        break
      }
      case 'email':
        if (value.length > MAX_LENGTH.email || !EMAIL_PATTERN.test(value)) {
          fieldErrors[field.name] = 'Please enter a valid email address.'
        }
        break
      case 'select': {
        const allowed = (field.options ?? []).map((o) => o.value)
        if (!allowed.includes(value)) fieldErrors[field.name] = 'Please choose one of the options.'
        break
      }
      case 'number':
        if (value.length > MAX_LENGTH.number || !Number.isFinite(Number(value))) {
          fieldErrors[field.name] = 'Please enter a number.'
        }
        break
      case 'date': {
        const time = Date.parse(`${value}T00:00:00Z`)
        if (!DATE_PATTERN.test(value) || Number.isNaN(time) || new Date(time).toISOString().slice(0, 10) !== value) {
          fieldErrors[field.name] = 'Please enter a valid date.'
        }
        break
      }
    }
    if (!fieldErrors[field.name]) submissionData.push({ field: field.name, value })
  }

  if (unknown.length > 0 || Object.keys(fieldErrors).length > 0) return { ok: false, unknown, fieldErrors }
  return { ok: true, submissionData }
}

/* -------------------------------------------------------------------------- */

const toId = (value: unknown): number | null => {
  const n = typeof value === 'number' ? value : typeof value === 'string' && /^\d{1,12}$/.test(value) ? Number(value) : NaN
  return Number.isSafeInteger(n) && n > 0 ? n : null
}

/** Same-site path only: `/`, no protocol-relative `//`, no whitespace, bounded. */
const cleanSourcePath = (value: unknown): string | undefined =>
  typeof value === 'string' && /^\/(?!\/)\S{0,299}$/.test(value) ? value : undefined

async function resolveRedirect(payload: Payload, form: Form, req?: Partial<PayloadRequest>): Promise<string | undefined> {
  if (form.confirmationType !== 'redirect' || !form.redirect) return undefined
  if (form.redirect.type === 'custom') {
    const url = form.redirect.url?.trim()
    return url && (/^\/(?!\/)/.test(url) || /^https?:\/\//i.test(url)) ? url : undefined
  }
  const ref = form.redirect.reference
  if (!ref) return undefined
  const page =
    typeof ref.value === 'object'
      ? ref.value
      : await payload.findByID({
          collection: 'pages',
          id: ref.value,
          depth: 0,
          draft: false,
          select: { slug: true },
          disableErrors: true,
          overrideAccess: true,
          req,
        })
  return docPath('pages', page) ?? undefined
}

/** Lead-magnet id is accepted only when it is a published lead magnet whose capture form IS this form. */
async function resolveLeadMagnet(
  payload: Payload,
  formId: number,
  value: unknown,
  req?: Partial<PayloadRequest>,
): Promise<number | undefined> {
  const id = toId(value)
  if (id === null) return undefined
  const { docs } = await payload.find({
    collection: 'lead-magnets',
    where: { and: [{ id: { equals: id } }, { form: { equals: formId } }, { _status: { equals: 'published' } }] },
    depth: 0,
    limit: 1,
    pagination: false,
    select: { form: true },
    overrideAccess: true,
    req,
  })
  return docs[0]?.id
}

/**
 * Run one submission end to end. Never throws; every failure is a friendly
 * `{ ok: false }`. `txReq` is optional and only threads a transaction
 * (verification scripts); the route passes nothing.
 */
export async function handleFormSubmission(
  payload: Payload,
  input: SubmissionInput,
  txReq?: Pick<PayloadRequest, 'transactionID'>,
): Promise<SubmissionOutcome> {
  // A fresh req per Local API call, carrying only the transaction: Payload's
  // createLocalReq mutates the req it is given (incl. `context`), so a shared
  // req would carry `turnstileVerified` into later, unrelated operations.
  const fresh = (): Partial<PayloadRequest> | undefined =>
    txReq?.transactionID ? { transactionID: txReq.transactionID } : undefined
  // 1. Turnstile FIRST. Nothing is loaded or stored before this passes.
  const turnstile = await verifyTurnstile(input.turnstileToken, input.remoteIp)
  if (!turnstile.ok) {
    const misconfigured = turnstile.codes.some((c) =>
      ['missing-secret', 'test-secret-in-production', 'invalid-input-secret', 'missing-input-secret'].includes(c),
    )
    return fail(misconfigured ? MSG.unavailable : MSG.turnstile)
  }

  try {
    // 2. The form, as stored. Trusted read (forms are staff-read; the visitor has no user).
    const formId = toId(input.formId)
    const form =
      formId === null
        ? null
        : await payload.findByID({ collection: 'forms', id: formId, depth: 0, disableErrors: true, overrideAccess: true, req: fresh() })
    if (!form) return fail(MSG.stale)

    // 3. Validate against the form's own definition.
    if (input.rejectedKeys && input.rejectedKeys.length > 0) return fail(MSG.stale)
    const checked = validateSubmission(form.fields, input.values)
    if (!checked.ok) {
      if (checked.unknown.length > 0) return fail(MSG.stale)
      return fail(MSG.invalid, checked.fieldErrors)
    }

    const data: Omit<FormSubmission, 'id' | 'createdAt' | 'updatedAt'> = {
      form: form.id,
      submissionData: checked.submissionData,
    }
    const sourcePath = cleanSourcePath(input.sourcePath)
    if (sourcePath) data.sourcePath = sourcePath
    const leadMagnet = await resolveLeadMagnet(payload, form.id, input.leadMagnetId, fresh())
    if (leadMagnet) data.leadMagnet = leadMagnet

    // 4. Store. Access is enforced (public user = none); the context flag is the Turnstile proof.
    const created = await payload.create({
      collection: 'form-submissions',
      data,
      depth: 0,
      overrideAccess: false,
      context: { turnstileVerified: true },
      req: fresh(),
    })

    const redirectUrl = await resolveRedirect(payload, form, fresh()).catch(() => undefined)
    return { result: { ok: true }, submissionId: created.id, redirectUrl }
  } catch (err) {
    payload.logger.error(`[forms] submission failed: ${err instanceof Error ? err.name : 'unknown error'}`)
    return fail(MSG.storage)
  }
}
