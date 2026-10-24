import { createHash } from 'node:crypto'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'

import type { PayloadRequest } from 'payload'

import { DOWNLOADS_STATIC_DIR } from '../../collections/Downloads'
import { getAppEnv } from '../../lib/siteUrl'
import type { Download, LeadMagnet } from '../../payload-types'

/**
 * Lead-magnet asset delivery email (A3). ONE email per request chain, built
 * from the lead magnet's staff-only `deliveryEmail` copy (subject + intro) and
 * its staff-only `asset` (mini Gate S 2026-10-18 / 2026-10-21):
 *
 * - `asset.file` (→ `downloads`, staff-only read, no public URL): the file is
 *   read from disk HERE, server-side, and sent as an email ATTACHMENT
 *   (base64 `content`). Its URL is never put in the email or anywhere public.
 * - `asset.externalUrl`: linked in the email body.
 *
 * Transport: Resend `POST https://api.resend.com/emails` with plain `fetch`,
 * the same request `@payloadcms/email-resend@3.91.0` builds (dist/index.js),
 * plus two things that adapter cannot do (verified in its source: no request
 * timeout, and its `headers` option maps to EMAIL headers, not HTTP headers):
 *   - `Idempotency-Key` (https://resend.com/docs/api-reference/emails/send-email:
 *     unique per request, ≤ 256 chars, kept 24 h). One key per chain
 *     (`lead-magnet-asset/<eventId>/<chain>`), reused on every retry of that
 *     chain, so a retry after a timeout that Resend actually accepted does not
 *     send the asset twice. An admin re-send starts a new chain = a new email.
 *     The whole retry schedule (≈ 14.6 h) fits inside Resend's 24 h window.
 *   - a 30 s timeout, so a hung connection can never wedge the queue.
 *
 * Limits: Resend accepts ≤ 40 MB per email AFTER base64 (same page; and
 * https://resend.com/docs/dashboard/emails/attachments). PDF, CSV, XLSX and
 * ZIP (the only `downloads` mime types) are not on Resend's blocked list
 * (executables/scripts only). We cap the RAW file at 10 MB (≈ 13.4 MB
 * encoded): well inside Resend's limit and under common receiving limits
 * (Outlook ≈ 20 MB, Gmail 25 MB), and it bounds memory in a ≤ 0.5 GB container.
 * Bigger → `failed` (not retried) with a note telling staff what to do.
 *
 * Memory: Payload autoRun runs a batch of jobs in parallel
 * (payload@3.91.0 queues/operations/runJobs/index.js: `Promise.all` unless
 * `sequential`, which autoRun cannot set), so attachment sends are serialised
 * in-process by `serial()`: at most one file buffer + its base64 + the JSON
 * body are held at once.
 *
 * Never throws. Never logs or stores the recipient, the file URL, the key or
 * response bodies; notes carry the HTTP status and Resend's error `name` only.
 */

const RESEND_EMAILS_URL = 'https://api.resend.com/emails'
export const ASSET_EMAIL_TIMEOUT_MS = 30_000
export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024

export type AssetEmailOutcome =
  | { kind: 'sent'; detail: string }
  /** Retry on the schedule: 5xx, 429, 409, timeout, network, transient read error. */
  | { kind: 'retry'; reason: string }
  /** Not retried: 4xx, unconfigured, asset missing/too big. Staff fixes, then re-sends. */
  | { kind: 'final'; reason: string }

/* ------------------------------------------------------------------ serial */

let tail: Promise<unknown> = Promise.resolve()
/** Run `fn` after every previously queued call has settled (one at a time, per process). */
export function serial<T>(fn: () => Promise<T>): Promise<T> {
  const run = tail.then(fn, fn)
  tail = run.catch(() => undefined)
  return run
}

/* ------------------------------------------------------------------- email */

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

const paragraphs = (s: string) =>
  s
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean)

type Content = { subject: string; text: string; html: string }

/** Placeholder footer copy (brand voice, non-final); subject + intro are the editor's. */
const FOOTER = 'You asked for this on duhamedia.com. If that was not you, ignore this email.'

export function buildAssetEmail(
  copy: { subject: string; intro: string },
  asset: { kind: 'file'; label: string; filename: string } | { kind: 'link'; label: string; url: string },
): Content {
  const intro = paragraphs(copy.intro)
  const assetLineText =
    asset.kind === 'file' ? `Attached: ${asset.label} (${asset.filename}).` : `Get ${asset.label} here:\n${asset.url}`
  const assetLineHtml =
    asset.kind === 'file'
      ? `<p style="margin:0 0 16px"><strong>Attached:</strong> ${esc(asset.label)} (${esc(asset.filename)}).</p>`
      : `<p style="margin:0 0 24px"><a href="${esc(asset.url)}" style="display:inline-block;padding:12px 20px;background:#111;color:#fff;text-decoration:none;font-weight:bold">Get ${esc(asset.label)}</a></p>
<p style="margin:0 0 16px;font-size:14px;color:#555">Or paste this link into your browser:<br>${esc(asset.url)}</p>`
  return {
    subject: copy.subject.replace(/[\r\n]+/g, ' ').trim(),
    text: [...intro, assetLineText, FOOTER, 'Duha Media, Chicago'].join('\n\n'),
    html: `<!doctype html><html><body style="margin:0;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#111;line-height:1.5">
${intro.map((p) => `<p style="margin:0 0 16px">${esc(p).replace(/\r?\n/g, '<br>')}</p>`).join('\n')}
${assetLineHtml}
<p style="margin:0 0 16px;font-size:14px;color:#555">${esc(FOOTER)}</p>
<p style="margin:0;font-size:14px;color:#555">Duha Media, Chicago</p>
</body></html>`,
  }
}

/* ------------------------------------------------------------------ resend */

const errName = (raw: string) => {
  try {
    const name = (JSON.parse(raw) as { name?: unknown })?.name
    return typeof name === 'string' ? ` ${name.replace(/[^a-z0-9_]/gi, '').slice(0, 60)}` : ''
  } catch {
    return ''
  }
}

async function postToResend(
  key: string,
  idempotencyKey: string,
  body: Record<string, unknown>,
): Promise<AssetEmailOutcome> {
  let res: Response
  try {
    res = await fetch(RESEND_EMAILS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(body),
      redirect: 'manual',
      cache: 'no-store',
      signal: AbortSignal.timeout(ASSET_EMAIL_TIMEOUT_MS),
    })
  } catch (error) {
    const err = error as { name?: string; cause?: { code?: string } }
    const reason =
      err?.name === 'TimeoutError' ? `timeout after ${ASSET_EMAIL_TIMEOUT_MS / 1000}s` : (err?.cause?.code ?? err?.name ?? 'network error')
    return { kind: 'retry', reason: `Resend: ${reason}` }
  }
  const raw = (await res.text().catch(() => '')).slice(0, 4096)
  if (res.ok) {
    let id = ''
    try {
      const parsed = (JSON.parse(raw) as { id?: unknown })?.id
      if (typeof parsed === 'string') id = parsed.replace(/[^a-z0-9_-]/gi, '').slice(0, 80)
    } catch {
      // A 2xx without JSON still means accepted.
    }
    return { kind: 'sent', detail: `Resend accepted${id ? ` (email id ${id})` : ''}` }
  }
  const what = `Resend HTTP ${res.status}${errName(raw)}`
  // 409 = idempotency conflict / concurrent request with the same key; 429 = rate limit.
  if (res.status >= 500 || res.status === 429 || res.status === 409) return { kind: 'retry', reason: what }
  return { kind: 'final', reason: `${what}; not retried` }
}

/* -------------------------------------------------------------- deliverAsset */

type AssetDoc = Pick<LeadMagnet, 'id' | 'title'> & {
  asset?: { file?: number | Download | null; externalUrl?: string | null } | null
  deliveryEmail?: { subject?: string | null; intro?: string | null } | null
}

const mb = (n: number) => `${(n / 1024 / 1024).toFixed(1)} MB`

/**
 * Build and send the asset email for one request chain. The lead magnet is
 * read with `overrideAccess: true`: `asset` / `deliveryEmail` are staff-only
 * on read (field access) and the job has no user. `draft: false` = the
 * published content the visitor saw.
 */
export async function deliverAsset(
  req: PayloadRequest,
  args: { leadMagnetId: number; to: string; idempotencyKey: string },
): Promise<AssetEmailOutcome> {
  const key = process.env.RESEND_API_KEY
  if (!key && getAppEnv() !== 'development') {
    return { kind: 'final', reason: 'not sent: RESEND_API_KEY is not set; not retried' }
  }

  let doc: AssetDoc | null
  try {
    doc = (await req.payload.findByID({
      collection: 'lead-magnets',
      id: args.leadMagnetId,
      depth: 1,
      draft: false,
      disableErrors: true,
      overrideAccess: true,
      select: { title: true, asset: true, deliveryEmail: true },
      req,
    })) as AssetDoc | null
  } catch (error) {
    return { kind: 'retry', reason: `internal ${(error as Error)?.name ?? 'error'} reading the lead magnet` }
  }
  if (!doc) return { kind: 'final', reason: 'the lead magnet no longer exists; not retried' }

  const subject = doc.deliveryEmail?.subject?.trim()
  const intro = doc.deliveryEmail?.intro?.trim()
  if (!subject || !intro) {
    return { kind: 'final', reason: 'the lead magnet has no delivery email subject/intro; fill them in, then re-send' }
  }

  const fileRef = doc.asset?.file
  const url = doc.asset?.externalUrl?.trim()

  if (!fileRef && url) {
    const content = buildAssetEmail({ subject, intro }, { kind: 'link', label: doc.title, url })
    if (!key) return { kind: 'sent', detail: 'link email built; development without RESEND_API_KEY, not delivered' }
    const outcome = await postToResend(key, args.idempotencyKey, {
      from: fromAddress(req),
      to: [args.to],
      subject: content.subject,
      html: content.html,
      text: content.text,
    })
    return outcome.kind === 'sent' ? { kind: 'sent', detail: `link email: ${outcome.detail}` } : outcome
  }

  if (!fileRef || typeof fileRef !== 'object' || !fileRef.filename) {
    return { kind: 'final', reason: 'the lead magnet has no file or link; add one, then re-send' }
  }
  const file = fileRef
  const filename = file.filename as string
  const label = file.title?.trim() || doc.title

  return serial(async (): Promise<AssetEmailOutcome> => {
    // Never trust a stored name as a path: basename only, and it must stay inside the downloads dir.
    const dir = path.resolve(DOWNLOADS_STATIC_DIR)
    const full = path.join(dir, path.basename(filename))
    if (path.dirname(full) !== dir || path.basename(filename) !== filename) {
      return { kind: 'final', reason: 'invalid stored filename; not retried' }
    }
    let bytes: Buffer
    try {
      const st = await stat(full)
      if (st.size > MAX_ATTACHMENT_BYTES) {
        return {
          kind: 'final',
          reason: `the file is ${mb(st.size)}; attachments are limited to ${mb(MAX_ATTACHMENT_BYTES)}. Upload a smaller file or use a link, then re-send`,
        }
      }
      bytes = await readFile(full)
    } catch (error) {
      const code = (error as { code?: string })?.code
      if (code === 'ENOENT') return { kind: 'final', reason: 'the file is missing on disk; re-upload it in Downloads, then re-send' }
      return { kind: 'retry', reason: `file read error ${code ?? (error as Error)?.name ?? ''}`.trim() }
    }

    const content = buildAssetEmail({ subject, intro }, { kind: 'file', label, filename })
    const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 16)
    const what = `${filename}, ${bytes.length} bytes, sha256 ${hash}…`
    if (!key) return { kind: 'sent', detail: `attachment email built (${what}); development without RESEND_API_KEY, not delivered` }

    const outcome = await postToResend(key, args.idempotencyKey, {
      from: fromAddress(req),
      to: [args.to],
      subject: content.subject,
      html: content.html,
      text: content.text,
      attachments: [{ filename, content: bytes.toString('base64') }],
    })
    return outcome.kind === 'sent' ? { kind: 'sent', detail: `attachment ${what}: ${outcome.detail}` } : outcome
  })
}

/** The configured adapter's sender (`Duha Media <no-reply@duhamedia.com>`, src/payload.config.ts). */
const fromAddress = (req: PayloadRequest) => `${req.payload.email.defaultFromName} <${req.payload.email.defaultFromAddress}>`
