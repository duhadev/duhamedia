import { type NextRequest, NextResponse } from 'next/server'

import { REQUEST_PATH_HEADER } from '@/lib/requestPathHeader'

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
 * - Every matched request also forwards its pathname to the render as the
 *   `x-request-path` REQUEST header (src/lib/requestPath.ts), so chrome and blocks
 *   rendered outside the page router (footer newsletter form, NewsletterBand) can
 *   record which page a form was submitted from (`sourcePath`, F75).
 *
 * Matcher skips only `/api/*` and `/admin`, `/admin/*`: when a proxy runs, Next
 * buffers the request body (proxyClientMaxBodySize, default 10 MB, silently
 * truncating above it), which must never touch media uploads, form posts or the
 * admin's server functions. Those paths are disallowed in staging's robots.txt
 * (`Disallow: /`) and never linked publicly.
 *
 * Security (F75): the header is always OVERWRITTEN (`set`), so a visitor cannot
 * spoof it on any request the proxy sees. Every other path is matched — incl.
 * bare `/api` and `/_next/static|image` misses — because those fall through to
 * the frontend `[...slug]` 404, whose footer form reads the header; skipping
 * them let a client-supplied `x-request-path` through. Nothing under `/api/*`
 * or `/admin*` reads it.
 */
export function proxy(request: NextRequest): NextResponse {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(REQUEST_PATH_HEADER, request.nextUrl.pathname)
  const response = NextResponse.next({ request: { headers: requestHeaders } })
  if (process.env.APP_ENV !== 'production') {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }
  return response
}

export const config = {
  matcher: ['/((?!api/|admin/|admin$).*)'],
}
