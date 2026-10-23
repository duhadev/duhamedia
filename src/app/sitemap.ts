import config from '@payload-config'
import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'

import { docPath } from '@/lib/docPath'
import { absoluteUrl } from '@/lib/env'
import { NOT_FOUND_SLUG, pagePath } from '@/lib/pagePath'

/**
 * /sitemap.xml (router unit B2; next@16 metadata route, docs 01-app/03-api-reference/
 * 03-file-conventions/01-metadata/sitemap.md).
 *
 * - Request-time only (`force-dynamic`): `next build` never queries the DB
 *   (DECISIONS §F). Edits show up on the next request; nothing to revalidate.
 * - PUBLISHED `pages` only (public access + `_status` filter + `draft: false`),
 *   absolute URLs from server-side `SITE_URL`, `lastModified` = `updatedAt`.
 * - Left out: the reserved `404` doc, pages with `noindex`, zero-leakage
 *   (campaign landing) pages. `home` is listed once, as the bare origin
 *   (`absoluteUrl('/')`), the same form as its canonical (F65 B2). The `/`
 *   placeholder shown before a home doc is published is noindex and, having
 *   no published doc, is not listed (F65 B3). `/_showcase`
 *   and `/_preview` are not pages and never appear.
 * - PUBLISHED `case-studies` at `/work/<slug>` (S4-12), after the pages, newest
 *   first. posts / lead-magnets join when their template routes land.
 * - A DB failure is a 500 (crawlers retry), never a silently empty sitemap.
 */
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'pages',
    where: {
      and: [
        { _status: { equals: 'published' } },
        { slug: { not_equals: NOT_FOUND_SLUG } },
      ],
    },
    depth: 0,
    draft: false,
    overrideAccess: false,
    pagination: false,
    limit: 0,
    sort: 'slug',
    // Flags filtered here, not in SQL: `<> true` would also drop NULL rows.
    select: { slug: true, updatedAt: true, noindex: true, zeroLeakage: true },
  })
  const { docs: studies } = await payload.find({
    collection: 'case-studies',
    where: { _status: { equals: 'published' } },
    depth: 0,
    draft: false,
    overrideAccess: false,
    pagination: false,
    limit: 0,
    sort: '-publishedAt',
    select: { slug: true, updatedAt: true },
  })
  const pageEntries = docs.flatMap((doc) => {
    if (doc.noindex === true || doc.zeroLeakage === true) return []
    const path = pagePath(doc.slug)
    return path ? [{ url: absoluteUrl(path), lastModified: doc.updatedAt }] : []
  })
  const studyEntries = studies.flatMap((doc) => {
    const path = docPath('case-studies', doc)
    return path ? [{ url: absoluteUrl(path), lastModified: doc.updatedAt }] : []
  })
  return [...pageEntries, ...studyEntries]
}
