import 'server-only'

import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { CMSLinkData } from '@/components/ui'
import { resolveLinkHref } from '@/components/ui/CMSLink'
import { pagePath } from '@/lib/pagePath'
import type { Navigation, SiteSetting } from '@/payload-types'

/**
 * Site-chrome data loader (B1). Both globals are read once per request (React
 * `cache`) through the Local API with public access (`overrideAccess: false`,
 * both globals have `read: () => true`). Globals revalidate themselves on save
 * (`revalidateGlobalHook`); the frontend is force-dynamic anyway.
 *
 * A global that has never been saved comes back as `{}`-shaped data, and a
 * failed read (database down, bad row) must not take the page down with it:
 * the failure is logged server-side and the chrome renders its minimal form
 * (logo, no links, bare legal bar). Every field is treated as optional.
 */
export type Chrome = {
  navigation: Partial<Navigation>
  settings: Partial<SiteSetting>
}

export const getChrome = cache(async (): Promise<Chrome> => {
  try {
    const payload = await getPayload({ config })
    const [navigation, settings] = await Promise.all([
      payload.findGlobal({ slug: 'navigation', depth: 1, overrideAccess: false }),
      payload.findGlobal({ slug: 'site-settings', depth: 1, overrideAccess: false }),
    ])
    return { navigation, settings }
  } catch (error) {
    console.error('[chrome] could not load the navigation / site-settings globals; rendering minimal chrome', error)
    return { navigation: {}, settings: {} }
  }
})

/** A link that is known to resolve: text + href + target flag. */
export type NavItem = { href: string; label: string; newTab: boolean }

/** `linkField` rows → only those with both text and a resolvable destination (F10/F23: never a dead link). */
export const toNavItems = (rows: { link: CMSLinkData }[] | null | undefined): NavItem[] =>
  (rows ?? []).flatMap(({ link }) => {
    const href = resolveLinkHref(link)
    const label = link?.label?.trim()
    return href && label ? [{ href, label, newTab: Boolean(link.newTab) }] : []
  })

/** A single `linkField` group → item, or `null` when empty/unresolved. */
export const toNavItem = (link: CMSLinkData | null | undefined): NavItem | null => toNavItems(link ? [{ link }] : [])[0] ?? null

/**
 * Where the footer's newsletter nudge sends visitors: the published `newsletter`
 * page (SCHEMA p16), or `null` while it does not exist so no dead link renders.
 */
export const getNewsletterHref = cache(async (): Promise<string | null> => {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'pages',
      where: { and: [{ slug: { equals: 'newsletter' } }, { _status: { equals: 'published' } }] },
      limit: 1,
      depth: 0,
      draft: false,
      overrideAccess: false,
      pagination: false,
      select: { slug: true },
    })
    return docs[0]?.slug ? pagePath(docs[0].slug) : null
  } catch (error) {
    console.error('[chrome] could not look up the newsletter page', error)
    return null
  }
})
