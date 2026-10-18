import { slugify } from 'payload/shared'

/**
 * URL rules for `pages` documents (SCHEMA.md §6.1), shared by the collection
 * (slug normalisation, validation, revalidation) and the frontend router.
 *
 * - The slug IS the path, without the leading `/`. `/` is kept between
 *   segments so a flat site can still have `services/marketing` and
 *   `lp/<campaign>` (plugin-nested-docs is rejected, DECISIONS §I).
 * - `home` renders at `/`.
 * - `404` is the reserved p21 doc rendered by `not-found.tsx`; it has no
 *   path of its own.
 * - Paths owned by other routes can never be a page: the template
 *   collections' detail routes (`/work/<slug>` case studies, `/insights/<slug>`
 *   and `/newsletter/<slug>` posts, `/resources/<slug>` lead magnets; the hub
 *   pages `work`, `newsletter`, … themselves ARE pages), Payload's `/admin`
 *   and `/api`, and any `_`-prefixed segment (`/_showcase`, Next internals).
 */
export const HOME_SLUG = 'home'
export const NOT_FOUND_SLUG = '404'

/** First segments whose sub-paths belong to a template collection route. */
export const TEMPLATE_PREFIXES = ['work', 'insights', 'newsletter', 'resources'] as const

/** First segments that are never a page. */
const RESERVED_FIRST_SEGMENTS = ['admin', 'api'] as const

const SLUG_PATTERN = /^[a-z0-9_-]+(\/[a-z0-9_-]+)*$/

/** Slugify each `/`-separated segment; drops empty segments (no leading/trailing/double `/`). */
export const slugifyPath = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined
  const path = value
    .split('/')
    .map((segment) => slugify(segment) ?? '')
    .filter((segment) => segment !== '')
    .join('/')
  return path === '' ? undefined : path
}

/** Why a (normalised) slug cannot be used, or `null` when it is fine. */
export const pageSlugError = (slug: string): string | null => {
  if (!SLUG_PATTERN.test(slug)) {
    return 'Use lowercase letters, numbers and hyphens, with "/" between parts, e.g. services/marketing.'
  }
  const [first, ...rest] = slug.split('/')
  if (slug.split('/').some((segment) => segment.startsWith('_'))) {
    return 'A part of the address cannot start with "_" (reserved for the site itself).'
  }
  if ((RESERVED_FIRST_SEGMENTS as readonly string[]).includes(first)) {
    return `"/${first}" is reserved for the admin and API.`
  }
  if (rest.length > 0 && (TEMPLATE_PREFIXES as readonly string[]).includes(first)) {
    return `Addresses under "/${first}/" belong to ${
      first === 'work'
        ? 'case studies'
        : first === 'resources'
          ? 'lead magnets'
          : 'posts'
    }. Use "${first}" alone for the hub page, or another address.`
  }
  if (first === HOME_SLUG && rest.length > 0) {
    return '"home" is the homepage (shown at /). It cannot have sub-pages.'
  }
  if (first === NOT_FOUND_SLUG && rest.length > 0) {
    return '"404" is the not-found page. It cannot have sub-pages.'
  }
  return null
}

/** Public path of a page, or `null` for the not-found doc / an empty slug. */
export const pagePath = (slug: string | null | undefined): string | null => {
  if (!slug) return null
  if (slug === HOME_SLUG) return '/'
  if (slug === NOT_FOUND_SLUG) return null
  return `/${slug}`
}
