import type { Metadata } from 'next'
import { notFound, permanentRedirect, redirect } from 'next/navigation'

import { LeadMagnetView } from '@/components/LeadMagnetView'
import { getLeadMagnet, leadMagnetMetadata } from '@/lib/leadMagnets'
import { findRedirect } from '@/lib/redirects'

type Props = { params: Promise<{ slug: string }> }

/**
 * p18 Lead Magnet template at `/resources/<slug>` (S6-T2; `docPath('lead-magnets')`).
 *
 * - The PUBLISHED lead magnet, or (staff draft preview only) its latest draft
 *   (src/lib/leadMagnets.ts, same rules as pages / case studies).
 * - None → the redirects collection (F22: only when nothing lives at the
 *   path) → else (frontend)/not-found.tsx (404).
 * - `/resources` itself is not a template route: it falls to `[...slug]`
 *   (a `resources` pages doc, if one is ever made); `pageSlugError` forbids
 *   pages under `resources/`, so the two never collide.
 * - Always noindex, nofollow (gated template); never in the sitemap.
 * - force-dynamic via the (frontend) layout; no generateStaticParams.
 */
const slugOf = async (params: Props['params']): Promise<string> => (await params).slug

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const doc = await getLeadMagnet(await slugOf(params))
  if (!doc) return {}
  return leadMagnetMetadata(doc)
}

export default async function LeadMagnetPage({ params }: Props) {
  const slug = await slugOf(params)
  const doc = await getLeadMagnet(slug)
  if (doc) return <LeadMagnetView doc={doc} />

  const target = await findRedirect(`/resources/${slug}`)
  if (target) {
    if (target.permanent) permanentRedirect(target.location)
    redirect(target.location)
  }
  notFound()
}
