import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/components/RenderBlocks'
import { HOME_SLUG, NOT_FOUND_SLUG } from '@/lib/pagePath'
import { getPublishedPage, pageLayout } from '@/lib/pages'

type Props = { params: Promise<{ slug: string[] }> }

/**
 * Every other `pages` doc at `/<slug>` (slug keeps `/` between segments,
 * src/lib/pagePath.ts). `/home` and `/404` are not page addresses (home lives
 * at `/`, the 404 doc only renders inside not-found). Anything unpublished or
 * unknown → (frontend)/not-found.tsx. Redirect fallback, metadata and draft
 * preview come with the router unit.
 */
export default async function CmsPage({ params }: Props) {
  const { slug: segments } = await params
  // Page slugs are [a-z0-9_-] segments only, so no decoding is needed (and a
  // malformed escape can never throw here).
  const slug = segments.join('/')
  if (slug === HOME_SLUG || slug === NOT_FOUND_SLUG) notFound()

  const page = await getPublishedPage(slug)
  if (!page) notFound()

  return (
    <main>
      <RenderBlocks blocks={pageLayout(page)} />
    </main>
  )
}
