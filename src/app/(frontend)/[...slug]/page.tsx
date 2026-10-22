import type { Metadata } from 'next'
import { notFound, permanentRedirect, redirect } from 'next/navigation'

import { PageView } from '@/components/PageView'
import { pageMetadata } from '@/lib/metadata'
import { HOME_SLUG, NOT_FOUND_SLUG } from '@/lib/pagePath'
import { getPage, getPreviewUser } from '@/lib/pages'
import { findRedirect } from '@/lib/redirects'

type Props = { params: Promise<{ slug: string[] }> }

/**
 * Every other `pages` doc at `/<slug>` (slug keeps `/` between segments,
 * src/lib/pagePath.ts), published or (staff preview only) its latest draft.
 *
 * - `/home` → 308 to `/` (one URL per page; the doc lives at `/`).
 * - `/404` is not an address (the 404 doc renders inside not-found).
 * - No page → the redirects collection (F22: only when no page exists at the
 *   path, src/lib/redirects.ts) → else (frontend)/not-found.tsx.
 */
const slugOf = async (params: Props['params']): Promise<string> => (await params).slug.join('/')

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = await slugOf(params)
  if (slug === HOME_SLUG || slug === NOT_FOUND_SLUG) return {}
  const page = await getPage(slug)
  if (!page) return {}
  return pageMetadata(page, { preview: Boolean(await getPreviewUser()) })
}

export default async function CmsPage({ params }: Props) {
  const slug = await slugOf(params)
  if (slug === HOME_SLUG) permanentRedirect('/')
  if (slug === NOT_FOUND_SLUG) notFound()

  const page = await getPage(slug)
  if (page) return <PageView page={page} />

  const target = await findRedirect(`/${slug}`)
  if (target) {
    if (target.permanent) permanentRedirect(target.location)
    redirect(target.location)
  }
  notFound()
}
