import { pagePath } from './pagePath'

/**
 * Public path of a document in one of the routable collections
 * (`LINK_TARGETS` in src/fields/index.ts; routes per SCHEMA.md §10 and the
 * collections' own revalidation maps):
 * - `pages` → `pagePath(slug)` (`home` → `/`, the `404` doc → `null`)
 * - `case-studies` → `/work/<slug>`
 * - `posts` → `/newsletter/<slug>` for newsletter issues, else `/insights/<slug>`
 * - `lead-magnets` → `/resources/<slug>`
 *
 * Returns `null` when the doc has no slug or no public path. Used by the
 * redirects self-loop check (P2) and meant for the frontend router/link
 * resolver, so the rules live in one place.
 */
export type RoutableDoc = { slug?: string | null; track?: string | null }

export const docPath = (collection: string, doc: RoutableDoc | null | undefined): string | null => {
  const slug = doc?.slug
  if (!slug) return null
  switch (collection) {
    case 'pages':
      return pagePath(slug)
    case 'case-studies':
      return `/work/${slug}`
    case 'posts':
      return doc?.track === 'newsletter-issue' ? `/newsletter/${slug}` : `/insights/${slug}`
    case 'lead-magnets':
      return `/resources/${slug}`
    default:
      return null
  }
}
