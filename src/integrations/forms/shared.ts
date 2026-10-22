/**
 * Client-safe contract shared by the form renderer (src/components/forms/)
 * and the server-side submission path (./handleSubmission.ts via the route
 * src/app/api/form-submit/route.ts).
 * No server imports here: this file ends up in the client bundle.
 */

/** The one public submission endpoint (POST only). The Cloudflare rate-limit rule matches this path. */
export const FORM_SUBMIT_PATH = '/api/form-submit'
/** Request body cap for that endpoint (413 above it). */
export const MAX_BODY_BYTES = 64 * 1024

/** FormData key prefix for form-builder field values (keeps them apart from our own keys and Next's `$ACTION_*`). */
export const FIELD_PREFIX = 'f:'
/** FormData keys the renderer sets besides the field values. */
export const FORM_ID_KEY = '_form'
export const SOURCE_PATH_KEY = '_source'
export const LEAD_MAGNET_KEY = '_leadMagnet'
/** The hidden input @marsidev/react-turnstile (Cloudflare's script) adds to the form. */
export const TURNSTILE_RESPONSE_KEY = 'cf-turnstile-response'

/** Server-side length caps per field type; the renderer mirrors them as `maxLength`. */
export const MAX_LENGTH = {
  text: 500,
  email: 254,
  textarea: 5000,
  number: 50,
  date: 10,
  select: 200,
} as const

/** The form-builder field types this site enables (src/plugins/formBuilder.ts), minus payment/country/state/upload. */
export type PublicFormField =
  | { blockType: 'text' | 'email' | 'textarea'; name: string; label: string; required: boolean; defaultValue?: string; width?: number }
  | { blockType: 'number'; name: string; label: string; required: boolean; defaultValue?: number; width?: number }
  | { blockType: 'date'; name: string; label: string; required: boolean; defaultValue?: string; width?: number }
  | {
      blockType: 'select'
      name: string
      label: string
      required: boolean
      defaultValue?: string
      placeholder?: string
      options: { label: string; value: string }[]
      width?: number
    }
  | { blockType: 'checkbox'; name: string; label: string; required: boolean; defaultValue?: boolean; width?: number }
  /** Rich-text "message" block: rendered on the server and passed in as a node, never submitted. */
  | { blockType: 'message'; key: string }

/** What the client renderer receives: the form definition WITHOUT `emails` or integration settings. */
export type PublicForm = {
  id: number
  formKey: string
  fields: PublicFormField[]
  submitButtonLabel: string
}

/** Result of a submission. `fieldErrors` is keyed by form-builder field name. */
export type FormSubmitResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: Record<string, string> }

/** JSON body of POST /api/form-submit. `redirect` = the form's redirect confirmation (from the stored form). */
export type FormSubmitResponse =
  | { ok: true; redirect?: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string> }
