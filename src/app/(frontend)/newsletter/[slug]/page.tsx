import type { Metadata } from 'next'

import { PostRoute, postRouteMetadata } from '@/components/PostView'

type Props = { params: Promise<{ slug: string }> }

/**
 * Newsletter-issue template at `/newsletter/<slug>` (S6-T1;
 * `docPath('posts')`). Lookup, wrong-track 308, redirects fallback and 404:
 * `PostRoute` (src/components/PostView.tsx), same rules as `/work/<slug>`.
 *
 * - `/newsletter` itself is the p16 `newsletter` pages doc, served by `[...slug]`:
 *   this segment only matches `/newsletter/<one segment>`, and `pageSlugError`
 *   forbids pages under `newsletter/`, so the two can never collide.
 * - force-dynamic via the (frontend) layout; no generateStaticParams (no DB
 *   at build time).
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return postRouteMetadata('newsletter', (await params).slug)
}

export default async function NewsletterIssuePage({ params }: Props) {
  return <PostRoute route="newsletter" slug={(await params).slug} />
}
