import type { Metadata } from 'next'

import { PostRoute, postRouteMetadata } from '@/components/PostView'

type Props = { params: Promise<{ slug: string }> }

/**
 * p13 DEV-SEO / p14 MKT-SEO article template at `/insights/<slug>` (S6-T1;
 * `docPath('posts')`). Lookup, wrong-track 308, redirects fallback and 404:
 * `PostRoute` (src/components/PostView.tsx), same rules as `/work/<slug>`.
 *
 * - `/insights` itself is only a page if a `pages` doc `insights` exists (no hub is planned, open question 6):
 *   this segment only matches `/insights/<one segment>`, and `pageSlugError`
 *   forbids pages under `insights/`, so the two can never collide.
 * - force-dynamic via the (frontend) layout; no generateStaticParams (no DB
 *   at build time).
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return postRouteMetadata('insights', (await params).slug)
}

export default async function InsightPage({ params }: Props) {
  return <PostRoute route="insights" slug={(await params).slug} />
}
