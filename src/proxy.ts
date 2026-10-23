import { NextResponse } from 'next/server'

/**
 * Staging / local-dev search exclusion (F78 B1), next@16 `proxy` convention
 * (the renamed `middleware`; node_modules/next/dist/docs/01-app/03-api-reference/
 * 03-file-conventions/proxy.md; Node.js runtime by default, so `process.env` is
 * read at REQUEST time — one image, behaviour from env only, never a build flag).
 *
 * - APP_ENV ≠ production → `X-Robots-Tag: noindex, nofollow` on the response.
 *   Unset / unknown APP_ENV counts as non-production (same rule as
 *   src/lib/siteUrl.ts `getAppEnv`), so a misconfigured container is never indexed.
 * - production → untouched; indexing is per page (robots meta from SEO fields).
 * - This replaces the layout's old env robots meta, which doubled up with
 *   Next's own not-found `noindex` tag on every non-production 404.
 *
 * Matcher skips `/api/*`, `/admin*` and Next's static/image paths: when a proxy
 * runs, Next buffers the request body (proxyClientMaxBodySize, default 10 MB,
 * silently truncating above it), which must never touch media uploads, form
 * posts or the admin's server functions. Those paths are disallowed in
 * staging's robots.txt (`Disallow: /`) and never linked publicly.
 */
export function proxy(): NextResponse {
  const response = NextResponse.next()
  if (process.env.APP_ENV !== 'production') {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }
  return response
}

export const config = {
  matcher: ['/((?!api/|api$|admin/|admin$|_next/static|_next/image).*)'],
}
