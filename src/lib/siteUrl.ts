/**
 * The ONE place that reads `SITE_URL` and `APP_ENV` (F65 B1). Deliberately not
 * `server-only` and free of `next/*`, so the Payload config (plugin-seo
 * `generateURL`, collection preview URLs) and the Payload CLI can import it
 * too. `src/lib/env.ts` re-exports these for the Next server code.
 *
 * Read lazily on every call, never at module load: `next build` runs in CI
 * with no SITE_URL and no database, and must still pass (DECISIONS §F). The
 * check therefore fires at request time, on first use.
 */
export type AppEnv = 'production' | 'staging' | 'development'

/** `APP_ENV`; anything other than `production` / `staging` counts as `development`. */
export function getAppEnv(): AppEnv {
  const value = process.env.APP_ENV
  return value === 'production' || value === 'staging' ? value : 'development'
}

/** Only `next dev` / local work may run without a SITE_URL. */
const DEV_FALLBACK = 'http://localhost:3000'

/** The http(s) origin of `SITE_URL` (no path, no trailing slash), or '' when unset/invalid. */
export const siteOrigin = (): string => {
  const raw = (process.env.SITE_URL ?? '').trim()
  if (!raw) return ''
  try {
    const url = new URL(raw)
    return /^https?:$/.test(url.protocol) ? url.origin : ''
  } catch {
    return ''
  }
}

/**
 * The canonical site origin for absolute URLs (canonicals, sitemap, robots,
 * JSON-LD, Open Graph). Falls back to localhost ONLY when APP_ENV is
 * development; on staging/production an unset or invalid SITE_URL throws, so a
 * misconfigured container fails loudly (and /api/health reports 503) instead
 * of publishing localhost canonicals.
 */
export function getSiteUrl(): string {
  const origin = siteOrigin()
  if (origin) return origin
  if (getAppEnv() === 'development') return DEV_FALLBACK
  throw new Error(
    `SITE_URL is ${process.env.SITE_URL?.trim() ? 'not a valid http(s) URL' : 'not set'} but APP_ENV=${getAppEnv()}. ` +
      'Set SITE_URL to the canonical origin (e.g. https://duhamedia.com); only APP_ENV=development may run without it.',
  )
}

/** Absolute URL of a site path. The home path `/` is the bare origin — the same form Next prints for the canonical (F65 B2). */
export const absoluteUrl = (path: string): string => {
  const site = getSiteUrl()
  return path === '/' || path === '' ? site : `${site}${path.startsWith('/') ? '' : '/'}${path}`
}
