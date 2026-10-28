import config from '@payload-config'
import { getPayload } from 'payload'

import { handleFormSubmission, parseSubmissionFormData } from '@/integrations/forms/handleSubmission'
import { MAX_BODY_BYTES, SOURCE_PATH_KEY, type FormSubmitResponse } from '@/integrations/forms/shared'
import { ownOrigins } from '@/lib/siteUrl'

/**
 * POST /api/form-submit — the ONE public form submission path (S4-7).
 *
 * A static route outside both route groups, like /api/health: Next resolves a
 * static segment before `(payload)/api/[...slug]`, so Payload's REST
 * catch-all never sees this path, and no collection/global is called
 * `form-submit`. A stable path lets the Cloudflare rate-limit rule match on
 * path alone (Free/Pro rules cannot match method or headers).
 *
 * Request: same-origin POST, `multipart/form-data` or
 * `application/x-www-form-urlencoded`, ≤ MAX_BODY_BYTES. Keys: `_form`,
 * `f:<field>`, optional `_source`, `_leadMagnet`, and `cf-turnstile-response`.
 *
 * Response:
 * - `Accept: application/json` (PayloadForm's fetch): JSON `FormSubmitResponse`,
 *   200 on success, 400 on a rejected submission, 503 when Turnstile is misconfigured server-side (same JSON body), 403/405/413/415 on a bad request.
 * - Otherwise (no-JS form post): 303 to the form's redirect, or a minimal HTML
 *   page with the outcome and a link back.
 * Always `Cache-Control: no-store`.
 */
export const dynamic = 'force-dynamic'

const NO_STORE = { 'Cache-Control': 'no-store, max-age=0' }
const ALLOWED_TYPES = ['multipart/form-data', 'application/x-www-form-urlencoded']

const json = (body: FormSubmitResponse, status: number) => Response.json(body, { status, headers: NO_STORE })
const reject = (status: number, message: string) => json({ ok: false, message }, status)

const allowedOrigins = (request: Request): Set<string> => {
  // SITE_URL, plus the branch/deployment origins on Vercel Preview only (src/lib/siteUrl.ts).
  const origins = new Set<string>(ownOrigins())
  if (process.env.APP_ENV !== 'production' && process.env.APP_ENV !== 'staging') {
    const host = request.headers.get('host')
    if (host) origins.add(`http://${host}`)
  }
  return origins
}

/** Browsers send `Sec-Fetch-Site` and/or `Origin` on every POST; a request with neither is not a browser form. */
const isSameOrigin = (request: Request): boolean => {
  const site = request.headers.get('sec-fetch-site')
  if (site && site !== 'same-origin') return false
  const origin = request.headers.get('origin')
  if (origin) return allowedOrigins(request).has(origin)
  return site === 'same-origin'
}

/** Read the body with a hard byte cap (Content-Length can be absent or lie). */
async function readCapped(request: Request): Promise<Uint8Array | null> {
  const declared = Number(request.headers.get('content-length') ?? '0')
  if (declared > MAX_BODY_BYTES) return null
  if (!request.body) return new Uint8Array()
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    total += value.byteLength
    if (total > MAX_BODY_BYTES) {
      await reader.cancel()
      return null
    }
    chunks.push(value)
  }
  const out = new Uint8Array(total)
  let offset = 0
  for (const c of chunks) {
    out.set(c, offset)
    offset += c.byteLength
  }
  return out
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

/** No-JS fallback page. Deliberately minimal: a no-JS visitor cannot pass Turnstile anyway. */
const htmlPage = (message: string, backPath: string, status: number) =>
  new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Duha Media</title></head><body style="font-family:system-ui,sans-serif;max-width:36rem;margin:4rem auto;padding:0 1.25rem;line-height:1.6"><p>${escapeHtml(message)}</p><p><a href="${escapeHtml(backPath)}">Go back</a></p></body></html>`,
    { status, headers: { ...NO_STORE, 'Content-Type': 'text/html; charset=utf-8' } },
  )

export async function POST(request: Request): Promise<Response> {
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json')

  if (!isSameOrigin(request)) return reject(403, 'Forbidden.')
  // Keep the original header for parsing: the multipart boundary is case-sensitive.
  const contentType = request.headers.get('content-type') ?? ''
  if (!ALLOWED_TYPES.some((t) => contentType.toLowerCase().startsWith(t))) return reject(415, 'Unsupported content type.')

  const body = await readCapped(request).catch(() => null)
  if (!body) return reject(413, 'This message is too long. Please shorten it and try again.')

  let formData: FormData
  try {
    formData = await new Response(body as BodyInit, { headers: { 'Content-Type': contentType } }).formData()
  } catch {
    return reject(400, 'Something went wrong sending your message. Please try again.')
  }

  const remoteIp =
    request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
  const payload = await getPayload({ config, cron: true })
  const outcome = await handleFormSubmission(payload, parseSubmissionFormData(formData, remoteIp))

  if (wantsJson) {
    return outcome.result.ok
      ? json(outcome.redirectUrl ? { ok: true, redirect: outcome.redirectUrl } : { ok: true }, 200)
      : json(outcome.result, outcome.unavailable ? 503 : 400)
  }

  const source = formData.get(SOURCE_PATH_KEY)
  const back = typeof source === 'string' && /^\/(?!\/)\S{0,299}$/.test(source) ? source : '/'
  if (outcome.result.ok && outcome.redirectUrl) {
    return new Response(null, { status: 303, headers: { ...NO_STORE, Location: outcome.redirectUrl } })
  }
  return outcome.result.ok
    ? htmlPage('Thanks — we have it.', back, 200)
    : htmlPage(outcome.result.message, back, outcome.unavailable ? 503 : 400)
}

const methodNotAllowed = () =>
  new Response(null, { status: 405, headers: { ...NO_STORE, Allow: 'POST' } })

export { methodNotAllowed as GET, methodNotAllowed as PUT, methodNotAllowed as PATCH, methodNotAllowed as DELETE }
export const HEAD = methodNotAllowed
export const OPTIONS = methodNotAllowed
