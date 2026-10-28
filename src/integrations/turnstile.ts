import { randomUUID } from 'node:crypto'

import { ownOrigins } from '../lib/siteUrl'

/**
 * Cloudflare Turnstile server-side verification (DECISIONS.md §L, CLAUDE.md
 * lead flow step 1). Runs BEFORE anything is stored.
 *
 * Verified against https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 * (2026-10-21): POST `https://challenges.cloudflare.com/turnstile/v0/siteverify`,
 * JSON or form-encoded body `{ secret, response, remoteip?, idempotency_key? }`;
 * JSON reply `{ success, challenge_ts, hostname, 'error-codes', action, cdata }`.
 * Tokens: ≤ 2048 chars, valid 300 s, single use (`timeout-or-duplicate`).
 * Cloudflare's example uses a 10 s timeout. No dependency (Node fetch + crypto).
 *
 * Never throws. Logs failures server-side with error codes only (no token,
 * no IP, no form data). Not `server-only`-guarded so `payload run` scripts can
 * import it; it reads only non-public env, which is undefined in any client
 * bundle anyway.
 */

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const TIMEOUT_MS = 10_000
const MAX_TOKEN_LENGTH = 2048

/** Cloudflare's public testing keys (https://developers.cloudflare.com/turnstile/troubleshooting/testing/). */
export const TURNSTILE_TEST_SITE_KEY = '1x00000000000000000000AA'
const TEST_SECRET_PASS = '1x0000000000000000000000000000000AA'
const TEST_SECRETS = new Set([
  TEST_SECRET_PASS,
  '2x0000000000000000000000000000000AA',
  '3x0000000000000000000000000000000AA',
])

export type TurnstileResult = {
  ok: boolean
  /** Cloudflare `error-codes`, or our own: `missing-secret`, `test-secret-in-production`, `hostname-mismatch`, `network-error`, `timeout`, `bad-response`. */
  codes: string[]
}

const appEnv = (): 'production' | 'staging' | 'development' => {
  const value = process.env.APP_ENV
  return value === 'production' || value === 'staging' ? value : 'development'
}

/**
 * The secret to use, or `null` = fail closed.
 * - production / staging: `TURNSTILE_SECRET_KEY` is required and must not be
 *   one of Cloudflare's test secrets (those accept the public dummy token, so
 *   protection would be off).
 * - development: falls back to the always-pass test secret when unset.
 */
const resolveSecret = (): { secret: string | null; code?: string } => {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim()
  if (appEnv() === 'development') return { secret: secret || TEST_SECRET_PASS }
  if (!secret) return { secret: null, code: 'missing-secret' }
  if (TEST_SECRETS.has(secret)) return { secret: null, code: 'test-secret-in-production' }
  return { secret }
}

/**
 * Site key for the widget, read at runtime (no NEXT_PUBLIC_*; DECISIONS §F.3).
 * Development falls back to Cloudflare's always-pass test site key; elsewhere
 * an unset key returns `null` (the form renders, submissions fail closed).
 */
export const getTurnstileSiteKey = (): string | null => {
  const key = process.env.TURNSTILE_SITE_KEY?.trim()
  if (key) return key
  return appEnv() === 'development' ? TURNSTILE_TEST_SITE_KEY : null
}

/**
 * Hostnames of SITE_URL (plus, on Vercel Preview only, the branch/deployment
 * hosts: src/lib/siteUrl.ts `ownOrigins`), for the hostname check outside
 * development. Empty = no expectation configured (check skipped, as before).
 */
const expectedHostnames = (): Set<string> => new Set(ownOrigins().map((o) => new URL(o).hostname))

const fail = (codes: string[]): TurnstileResult => {
  console.error(`[turnstile] verification failed: ${codes.join(', ') || 'unknown'}`)
  return { ok: false, codes }
}

export async function verifyTurnstile(token: unknown, remoteIp?: string | null): Promise<TurnstileResult> {
  const { secret, code } = resolveSecret()
  if (!secret) return fail([code ?? 'missing-secret'])

  // Cheap local rejects; nothing is sent to Cloudflare for these.
  if (typeof token !== 'string' || token === '') return { ok: false, codes: ['missing-input-response'] }
  if (token.length > MAX_TOKEN_LENGTH) return { ok: false, codes: ['invalid-input-response'] }

  const body: Record<string, string> = {
    secret,
    response: token,
    idempotency_key: randomUUID(),
  }
  if (remoteIp) body.remoteip = remoteIp

  let data: unknown
  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    })
    data = await res.json()
  } catch (err) {
    const name = err instanceof Error ? err.name : ''
    return fail([name === 'TimeoutError' || name === 'AbortError' ? 'timeout' : 'network-error'])
  }

  if (!data || typeof data !== 'object' || typeof (data as { success?: unknown }).success !== 'boolean') {
    return fail(['bad-response'])
  }
  const reply = data as { success: boolean; hostname?: unknown; 'error-codes'?: unknown }
  const codes = Array.isArray(reply['error-codes'])
    ? reply['error-codes'].filter((c): c is string => typeof c === 'string')
    : []

  if (!reply.success) return fail(codes)

  // Cloudflare recommends checking the hostname. Test keys report a dummy
  // hostname, so development skips it.
  if (appEnv() !== 'development') {
    const expected = expectedHostnames()
    if (expected.size > 0 && typeof reply.hostname === 'string' && !expected.has(reply.hostname)) {
      return fail(['hostname-mismatch'])
    }
  }

  return { ok: true, codes: [] }
}
