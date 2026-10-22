import type { MetadataRoute } from 'next'

import { getSiteUrl, isProduction } from '@/lib/env'

/**
 * /robots.txt (router unit B2; next@16 metadata route, docs 01-app/03-api-reference/
 * 03-file-conventions/01-metadata/robots.md). Request-time (`force-dynamic`),
 * so the one image answers per `APP_ENV`:
 * - not production (staging, local dev): disallow everything (pages are also
 *   noindex via metadata).
 * - production: allow the site and the media files (`/api/media/file/`, so
 *   images can be indexed), disallow the admin, the rest of the API, the
 *   showcase sandbox and the preview routes. Google applies the most specific
 *   (longest) matching rule, so the media allow wins over `/api/`.
 */
export const dynamic = 'force-dynamic'

export default function robots(): MetadataRoute.Robots {
  const sitemap = `${getSiteUrl()}/sitemap.xml`
  if (!isProduction()) {
    return { rules: { userAgent: '*', disallow: '/' }, sitemap }
  }
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/api/media/file/'],
      disallow: ['/admin', '/api/', '/_showcase', '/_preview'],
    },
    sitemap,
  }
}
