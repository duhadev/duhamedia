import { createHash, randomUUID } from 'node:crypto'
import type { AfterErrorHook, Payload } from 'payload'

import { MAX_BODY_BYTES, TRUNCATION_KEY, eventEnv } from '../events/contract'

/**
 * A4 `site_error` reporter (CLAUDE.md "site_error rules", INTEGRATIONS.md).
 *
 * Server-side errors → one signed v1 `site_error` event, via the same `events`
 * jobs queue as the lead events (task `deliverSiteError`, ./task.ts). Callers:
 * - Next `onRequestError` (src/instrumentation.ts): Server Components, route
 *   handlers, server actions, proxy (next@16.3.8 server/instrumentation/types.d.ts).
 * - Payload `hooks.afterError` (payload@3.91.0 utilities/routeError.js; also
 *   @payloadcms/next routes/graphql/handler.js): REST / GraphQL / custom endpoint
 *   errors, which Payload answers itself so Next never sees them.
 * - `/api/form-submit` store failures (a lead that could not be saved), which
 *   that route catches itself.
 *
 * Guarantees:
 * - `reportSiteError` is synchronous, never throws and never awaits: the job is
 *   queued fire-and-forget, without the failing request's `req` (its
 *   transaction is usually being rolled back).
 * - No recursion: a re-entrancy guard, errors from inside the reporter/job are
 *   never reported, `/api/payload-jobs*` is skipped, and the rate limit bounds
 *   anything else.
 * - No PII: never reads request bodies, cookies or headers (Next's `request.headers`
 *   is ignored). Message, stack and path are scrubbed (emails, Postgres
 *   `params:` / `Key (...)=(...)` values, JWT/long tokens) and the query string
 *   is dropped from the URL.
 * - Rate limit: ≤ 1 event per fingerprint per 10 minutes, in memory, process-wide
 *   (state on globalThis: Next bundles instrumentation and route code separately,
 *   so module state is not shared between them). Occurrences inside the window
 *   are counted and flushed as ONE event when the window ends (`count` = the
 *   occurrences that event stands for), so no total is lost while the process lives.
 */

export const SITE_ERROR_TASK = 'deliverSiteError'

const WINDOW_MS = 10 * 60_000
const MAX_TRACKED = 500
const STACK_LINES = 20
const MAX_MESSAGE = 1000
const MAX_LINE = 300

export const INTERNAL = Symbol.for('duhamedia.siteError.internal')
const STATE_KEY = Symbol.for('duhamedia.siteError.state')

type Source = 'next' | 'payload' | 'forms'

export type SiteErrorContext = {
  source: Source
  /** Stable route key for the fingerprint: Next routePath, or a normalised API path. */
  route: string
  /** Request path (query string is dropped here). */
  path?: string
  method?: string
  digest?: string
  status?: number
  routeType?: string
}

export type SiteErrorEventV1 = {
  v: 1
  eventId: string
  env: 'production' | 'staging'
  type: 'site_error'
  fields: Record<string, string>
  timestamp: string
  error: { fingerprint: string; message: string; stack: string; url: string; count: number }
}

type Sample = {
  fingerprint: string
  message: string
  stack: string
  url: string
  fields: Record<string, string>
  at: number
}

type Entry = { lastSentAt: number; suppressed: number; firstSuppressedAt?: number; sample?: Sample; timer?: ReturnType<typeof setTimeout> }

type State = { entries: Map<string, Entry>; payload?: Payload; depth: number; lastDropLog: number }

const state = (): State => {
  const g = globalThis as unknown as Record<symbol, State | undefined>
  return (g[STATE_KEY] ??= { entries: new Map(), depth: 0, lastDropLog: 0 })
}

/** Payload `onInit`: the instance the reporter queues jobs on (shared across Next bundles). */
export const registerSiteErrorPayload = (payload: Payload): void => {
  state().payload = payload
}

/**
 * Development only: `SITE_ERROR_WINDOW_S` shortens the 10-minute window for
 * Gate A proofs. Ignored unless APP_ENV=development.
 */
const windowMs = (): number => {
  const raw = process.env.SITE_ERROR_WINDOW_S
  if (process.env.APP_ENV === 'development' && raw) {
    const n = Number(raw) * 1000
    if (Number.isFinite(n) && n > 0) return n
  }
  return WINDOW_MS
}

const log = (level: 'info' | 'warn' | 'error', obj: Record<string, unknown>, msg: string) => {
  try {
    const logger = state().payload?.logger
    if (logger) logger[level](obj, `[site-error] ${msg}`)
    else console[level === 'info' ? 'log' : level](`[site-error] ${msg}`, JSON.stringify(obj))
  } catch {
    /* logging must never throw */
  }
}

// ---------------------------------------------------------------- scrubbing

const cwd = (() => {
  try {
    return process.cwd()
  } catch {
    return ''
  }
})()

/** Remove anything that could carry visitor data from a free-text string. */
export function scrub(text: string): string {
  let s = text
  if (cwd) s = s.split(cwd).join('')
  return (
    s
      .replace(/file:\/\//g, '')
      // pnpm store paths: /node_modules/.pnpm/<pkg@ver_peers>/node_modules/x → /node_modules/x
      .replace(/\/node_modules\/\.pnpm\/[^/\s]+\/node_modules\//g, '/node_modules/')
      // drizzle: "Failed query: <sql>\nparams: <values>"
      .replace(/(\bparams:)[^\n]*/gi, '$1 [redacted]')
      // postgres detail: Key (email)=(x@y.z) already exists
      .replace(/(\([^()\n]*\))=\([^)\n]*\)/g, '$1=([redacted])')
      .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[email]')
      .replace(/\beyJ[\w-]+\.[\w-]+\.[\w-]+/g, '[token]')
      .replace(/\b[A-Za-z0-9_-]{40,}\b/g, '[token]')
  )
}

const cut = (s: string, max: number) => {
  const chars = Array.from(s)
  return chars.length > max ? `${chars.slice(0, max).join('')}…` : s
}

/** Path without query/fragment, scrubbed. */
const cleanPath = (path: string | undefined): string => {
  if (!path) return ''
  const bare = path.split(/[?#]/)[0] ?? ''
  return cut(scrub(bare), 300)
}

/** API path → stable route key: ids/files collapsed so one bug = one fingerprint. */
export function normaliseApiRoute(pathname: string): string {
  const segs = cleanPath(pathname).split('/')
  const out: string[] = []
  for (let i = 0; i < segs.length; i++) {
    const seg = segs[i]
    if (out[out.length - 1] === 'file' && i === segs.length - 1) out.push(':file')
    else if (/^\d+$/.test(seg) || /^[0-9a-f-]{20,}$/i.test(seg) || seg === '[token]') out.push(':id')
    else out.push(seg)
  }
  return out.join('/').replace(/\/+$/, '') || '/'
}

// ---------------------------------------------------------------- filters

const IGNORED_DIGEST = /^(NEXT_|DYNAMIC_SERVER_USAGE|BAILOUT_TO_CLIENT_SIDE_RENDERING)/
/** Payload client-upload path with no handler response (reachable anonymously; S3 note). */
const IGNORED_MESSAGES = new Set(['Expected response from the upload handler.'])
/** Client went away mid-request: not a server fault. */
const IGNORED_NAMES = new Set(['AbortError', 'ResponseAborted'])

const isObj = (v: unknown): v is Record<string | symbol, unknown> => typeof v === 'object' && v !== null

function ignored(error: unknown, ctx: SiteErrorContext): boolean {
  if (isObj(error) && error[INTERNAL] === true) return true
  const path = cleanPath(ctx.path)
  if (path === '/api/health' || ctx.route === '/api/health' || ctx.route.startsWith('/api/health/')) return true
  if (path.startsWith('/api/payload-jobs') || ctx.route.startsWith('/api/payload-jobs')) return true
  if (ctx.digest && IGNORED_DIGEST.test(ctx.digest)) return true
  if (typeof ctx.status === 'number' && ctx.status < 500) return true
  if (isObj(error)) {
    if (typeof error.message === 'string' && IGNORED_MESSAGES.has(error.message)) return true
    if (typeof error.name === 'string' && IGNORED_NAMES.has(error.name)) return true
  }
  return false
}

// ---------------------------------------------------------------- sample

const str = (v: unknown): string => (typeof v === 'string' ? v : '')

function buildSample(error: unknown, ctx: SiteErrorContext, now: number): Sample {
  const name = (isObj(error) && (str(error.name) || str((error.constructor as { name?: unknown } | undefined)?.name))) || 'Error'
  const rawMessage = isObj(error) ? str(error.message) : typeof error === 'string' ? error : ''
  const rawStack = isObj(error) ? str(error.stack) : ''

  const lines = scrub(rawStack)
    .split('\n')
    .filter((l) => l.trim())
    .slice(0, STACK_LINES)
    .map((l) => cut(l.trimEnd(), MAX_LINE))
  const topFrame = lines.find((l) => /^\s*at\s/.test(l))?.trim() ?? ''
  const route = ctx.route || '/'
  const fingerprint = createHash('sha256').update(`${name}\n${topFrame}\n${route}`).digest('hex').slice(0, 16)

  const fields: Record<string, string> = { source: ctx.source, route, errorName: cut(scrub(name), 100) }
  if (ctx.method) fields.method = cut(ctx.method.toUpperCase().replace(/[^A-Z]/g, ''), 10)
  if (ctx.routeType) fields.routeType = cut(ctx.routeType, 20)
  if (ctx.digest) fields.digest = cut(scrub(ctx.digest), 100)
  if (typeof ctx.status === 'number') fields.status = String(ctx.status)

  return {
    fingerprint,
    message: cut(scrub(rawMessage), MAX_MESSAGE) || name, // receiver requires a non-empty message
    stack: lines.join('\n'),
    url: cleanPath(ctx.path) || route,
    fields,
    at: now,
  }
}

// ---------------------------------------------------------------- event + queue

/** Exact body to sign and send; ≤ 32 KB by construction, cut further if ever needed. */
export function serializeSiteErrorEvent(event: SiteErrorEventV1): string {
  const full = JSON.stringify(event)
  if (Buffer.byteLength(full, 'utf8') <= MAX_BODY_BYTES) return full
  const smaller: SiteErrorEventV1 = {
    ...event,
    fields: { ...event.fields, [TRUNCATION_KEY]: 'error.message and error.stack cut (body limit 32 KB)' },
    error: { ...event.error, message: cut(event.error.message, 200), stack: event.error.stack.split('\n').slice(0, 5).map((l) => cut(l, 200)).join('\n') },
  }
  return JSON.stringify(smaller)
}

function enqueue(sample: Sample, count: number, firstSeen: number): void {
  const { payload } = state()
  if (!payload) {
    log('warn', { fingerprint: sample.fingerprint }, 'not queued: Payload not initialised')
    return
  }
  if (process.env.APP_ENV === 'development' && (!process.env.SITE_EVENT_URL || !process.env.SITE_EVENT_SECRET)) {
    log('info', { fingerprint: sample.fingerprint, count }, 'not queued: SITE_EVENT_URL/SECRET unset (development)')
    return
  }
  const event: SiteErrorEventV1 = {
    v: 1,
    eventId: randomUUID(),
    env: eventEnv(),
    type: 'site_error',
    fields: { ...sample.fields, firstSeenAt: new Date(firstSeen).toISOString(), lastSeenAt: new Date(sample.at).toISOString() },
    timestamp: new Date(sample.at).toISOString(),
    error: { fingerprint: sample.fingerprint, message: sample.message, stack: sample.stack, url: sample.url, count },
  }
  const body = serializeSiteErrorEvent(event)
  try {
    payload.jobs
      .queue({
        task: SITE_ERROR_TASK,
        input: { body, eventId: event.eventId, fingerprint: sample.fingerprint, attempt: 1 },
        queue: 'events',
      } as Parameters<Payload['jobs']['queue']>[0])
      .then(
        () => log('info', { fingerprint: sample.fingerprint, eventId: event.eventId, count }, 'queued'),
        (err: unknown) => log('error', { fingerprint: sample.fingerprint, err: (err as Error)?.name ?? 'error' }, 'not queued: queue failed'),
      )
  } catch (err) {
    log('error', { fingerprint: sample.fingerprint, err: (err as Error)?.name ?? 'error' }, 'not queued: queue threw')
  }
}

function flush(fingerprint: string): void {
  const s = state()
  s.depth++
  try {
    const e = s.entries.get(fingerprint)
    if (!e) return
    e.timer = undefined
    if (e.suppressed === 0 || !e.sample) return
    const now = Date.now()
    enqueue(e.sample, e.suppressed, e.firstSuppressedAt ?? now)
    e.lastSentAt = now
    e.suppressed = 0
    e.firstSuppressedAt = undefined
    e.sample = undefined
  } catch {
    /* never throw from a timer */
  } finally {
    s.depth--
  }
}

function prune(s: State, now: number, window: number): void {
  for (const [fp, e] of s.entries) if (!e.timer && e.suppressed === 0 && now - e.lastSentAt >= window) s.entries.delete(fp)
}

/** Report one server-side error. Synchronous, never throws, never blocks. */
export function reportSiteError(error: unknown, ctx: SiteErrorContext): void {
  let s: State
  try {
    s = state()
  } catch {
    return
  }
  if (s.depth > 0) return
  s.depth++
  try {
    if (ignored(error, ctx)) return
    const now = Date.now()
    const window = windowMs()
    const sample = buildSample(error, ctx, now)

    let e = s.entries.get(sample.fingerprint)
    if (!e) {
      if (s.entries.size >= MAX_TRACKED) prune(s, now, window)
      if (s.entries.size >= MAX_TRACKED) {
        if (now - s.lastDropLog > 60_000) {
          s.lastDropLog = now
          log('warn', { tracked: s.entries.size }, 'dropped: too many distinct fingerprints in the window')
        }
        return
      }
      e = { lastSentAt: 0, suppressed: 0 }
      s.entries.set(sample.fingerprint, e)
    }

    if (now - e.lastSentAt >= window) {
      // Window over: send now, carrying anything still unflushed.
      const count = 1 + e.suppressed
      const firstSeen = e.firstSuppressedAt ?? now
      if (e.timer) clearTimeout(e.timer)
      Object.assign(e, { lastSentAt: now, suppressed: 0, firstSuppressedAt: undefined, sample: undefined, timer: undefined })
      enqueue(sample, count, firstSeen)
      return
    }
    e.suppressed++
    e.firstSuppressedAt ??= now
    e.sample = sample
    if (!e.timer) {
      const fp = sample.fingerprint
      e.timer = setTimeout(() => flush(fp), Math.max(0, e.lastSentAt + window - now))
      e.timer.unref?.()
    }
  } catch (err) {
    log('error', { err: (err as Error)?.name ?? 'error' }, 'reporter failed (not reported)')
  } finally {
    s.depth--
  }
}

// ---------------------------------------------------------------- adapters

/** Next `onRequestError` → report. Ignores `request.headers` entirely. */
export function reportNextRequestError(
  error: unknown,
  request: Readonly<{ path: string; method: string }>,
  context: Readonly<{ routePath: string; routeType: string }>,
): void {
  try {
    const digest = isObj(error) && error.digest !== undefined ? String(error.digest) : undefined
    reportSiteError(error, {
      source: 'next',
      route: context.routePath || cleanPath(request.path) || '/',
      path: request.path,
      method: request.method,
      digest,
      routeType: context.routeType,
    })
  } catch {
    /* never throw */
  }
}

/**
 * Payload config `hooks.afterError`: report status ≥ 500 only (missing status = 500;
 * GraphQL wraps the thrown error in `originalError`). Returns nothing, so the
 * response is untouched; runs synchronously, so the response is not delayed.
 */
export const reportPayloadError: AfterErrorHook = ({ error, req, collection }) => {
  try {
    const original = isObj(error) && isObj(error.originalError) ? error.originalError : error
    const status = isObj(original) && typeof original.status === 'number' ? original.status : 500
    let pathname = ''
    try {
      pathname = new URL(req.url ?? '', 'http://x').pathname
    } catch {
      /* no usable url */
    }
    const route = collection?.slug && !pathname ? `/api/${collection.slug}` : normaliseApiRoute(pathname || '/api')
    reportSiteError(original, { source: 'payload', route, path: pathname, method: req.method, status })
  } catch {
    /* never throw */
  }
}
