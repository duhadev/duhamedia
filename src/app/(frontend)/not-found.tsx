import type { Metadata } from 'next'

import { Error404View } from '@/blocks/Error404/Component'
import { PageShell } from '@/components/chrome'
import { PageView } from '@/components/PageView'
import { clean } from '@/lib/metadata'
import { NOT_FOUND_SLUG } from '@/lib/pagePath'
import { getPage, pageLayout } from '@/lib/pages'

/**
 * p21 404 (S6-T2). Renders the reserved `404` pages doc (published, or its
 * latest draft in staff preview via `/_preview?path=/404`, src/lib/pages.ts):
 * its own header/footer variants + its `layout` (the Error404 block) through
 * the shared PageView. No doc, or a doc with an empty layout → the designed
 * Error404View with its shipped defaults inside the standard chrome, so a 404
 * is never a dead end.
 *
 * Head (next@16.3.8: a not-found module's `generateMetadata` IS honoured,
 * lib/metadata/resolve-metadata.js `collectMetadata` → `getDefinedMetadata`
 * on the error-convention module):
 * - title: the doc's SEO tab `meta.title` (absolute) → else "Page not found",
 *   which the layout's seo-defaults template turns into
 *   "Page not found — Duha Media".
 * - robots: NONE here. Next injects its own `noindex` meta on 404 responses
 *   and the layout sets none (F78 B1), so a 404 carries exactly one robots
 *   meta tag; outside production the proxy's `X-Robots-Tag` header is on top
 *   (a header, not a second tag). No canonical: a 404 has no address.
 */
export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage(NOT_FOUND_SLUG)
  const title = clean(page?.meta?.title)
  const description = clean(page?.meta?.description)
  return {
    title: title ? { absolute: title } : 'Page not found',
    ...(description ? { description } : {}),
  }
}

export default async function NotFound() {
  const page = await getPage(NOT_FOUND_SLUG)
  if (page && (pageLayout(page)?.length ?? 0) > 0) return <PageView page={page} />
  return (
    <PageShell>
      <main>
        <Error404View />
      </main>
    </PageShell>
  )
}
