import 'server-only'

import config from '@payload-config'
import { getPayload } from 'payload'

import { docPath } from '@/lib/docPath'

/**
 * Redirect fallback for unknown paths (router unit B2, Flag F22 accepted
 * 2026-10-21: a redirect never overrides a live page, so this runs only after
 * the page lookup found nothing — website-template pattern,
 * templates/website/src/components/PayloadRedirects at v3.91.0).
 *
 * `redirects` (plugin-redirects@3.91.0, src/plugins/redirects.ts) is publicly
 * readable and has no drafts, so a saved redirect is live at once. `from` is
 * stored normalised (leading "/", no trailing slash, no query) and unique.
 *
 * Targets:
 * - `custom`: the stored `to.url` (an https:// address or a site path, both
 *   validated on save).
 * - `reference`: the target doc's public path (`docPath`), and only while
 *   that doc is PUBLISHED (field help: "Visitors are only redirected once it
 *   is published"); otherwise no redirect (the caller 404s).
 *
 * Status: `type` '301' → permanent, '302' → temporary. In the App Router a
 * page can only emit 308 (`permanentRedirect`) / 307 (`redirect`); search
 * engines treat 308 as 301 and 307 as 302.
 */
export type ResolvedRedirect = { location: string; permanent: boolean }

/** Both the raw and the decoded form of the request path (catch-all params may arrive encoded). */
const candidates = (path: string): string[] => {
  const set = new Set([path])
  try {
    set.add(decodeURIComponent(path))
  } catch {
    // Malformed escape: only the raw form is looked up.
  }
  return [...set]
}

export const findRedirect = async (path: string): Promise<ResolvedRedirect | null> => {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'redirects',
      where: { from: { in: candidates(path) } },
      limit: 1,
      depth: 0,
      overrideAccess: false,
      pagination: false,
    })
    const redirect = docs[0]
    if (!redirect) return null
    const permanent = redirect.type !== '302'

    if (redirect.to?.type === 'custom') {
      const url = redirect.to.url?.trim()
      return url ? { location: url, permanent } : null
    }

    const ref = redirect.to?.reference
    if (!ref) return null
    const id = typeof ref.value === 'object' ? ref.value?.id : ref.value
    if (id === undefined || id === null) return null
    const { docs: targets } = await payload.find({
      collection: ref.relationTo,
      where: { and: [{ id: { equals: id } }, { _status: { equals: 'published' } }] },
      limit: 1,
      depth: 0,
      draft: false,
      overrideAccess: false,
      pagination: false,
    })
    const target = targets[0] as { slug?: string | null; track?: string | null } | undefined
    const location = target ? docPath(ref.relationTo, target) : null
    return location && location !== path ? { location, permanent } : null
  } catch (error) {
    console.error('[redirects] lookup failed; treating the path as not found', error)
    return null
  }
}
