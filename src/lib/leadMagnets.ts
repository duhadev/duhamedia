import 'server-only'

import config from '@payload-config'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import { cache } from 'react'

import { DEFAULT_DESCRIPTION_MAX, TITLE_PLACEHOLDER } from '@/globals/SeoDefaults'
import { docPath } from '@/lib/docPath'
import { buildMetadata, clean, getSeoDefaults, titleTemplate } from '@/lib/metadata'
import { getPreviewUser } from '@/lib/pages'
import type { LeadMagnet } from '@/payload-types'
import { truncate } from '@/plugins/seo'

/**
 * Lead-magnet loader for the p18 template `/resources/<slug>` (S6-T2). Same
 * rules as `getPage` / `getCaseStudy`:
 *
 * - Public: the PUBLISHED doc only (`overrideAccess: false` → `publishedOrStaff`,
 *   plus an explicit `_status` filter and `draft: false`).
 * - Draft preview: only when Next draft mode is on AND `getPreviewUser()`
 *   returns a staff user; then the latest draft, queried as that user.
 *
 * `asset` and `deliveryEmail` are NEVER loaded here (SCHEMA Delta 2026-10-18
 * (1)): field access already strips them for the public, and the exclusion
 * `select` keeps them out of a staff preview too, so the template cannot render
 * a download link even by mistake (`PublicLeadMagnet` has no such keys).
 * payload@3.91.0 `select` with `false` values = exclude mode
 * (utilities/getSelectMode.js).
 *
 * Depth 1: the capture `form` relationship (forms are staff-read, so a public
 * read gets the bare id; CMSForm re-reads the form server-side anyway).
 */
export type PublicLeadMagnet = Omit<LeadMagnet, 'asset' | 'deliveryEmail'>

const SELECT = { asset: false, deliveryEmail: false } as const

export const getLeadMagnet = cache(async (slug: string): Promise<PublicLeadMagnet | null> => {
  const payload = await getPayload({ config })
  const user = await getPreviewUser()
  if (user) {
    const { docs } = await payload.find({
      collection: 'lead-magnets',
      where: { slug: { equals: slug } },
      select: SELECT,
      limit: 1,
      depth: 1,
      draft: true,
      user,
      overrideAccess: false,
      pagination: false,
    })
    return (docs[0] as PublicLeadMagnet | undefined) ?? null
  }
  const { docs } = await payload.find({
    collection: 'lead-magnets',
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    select: SELECT,
    limit: 1,
    depth: 1,
    draft: false,
    overrideAccess: false,
    pagination: false,
  })
  return (docs[0] as PublicLeadMagnet | undefined) ?? null
})

/**
 * `/resources/<slug>` head. Gated template (SCHEMA §6.8, §9 p18): ALWAYS
 * `noindex, nofollow`, in every environment, and never listed in the sitemap.
 * Same precedence as case studies (plugin-seo `meta` tab is on lead magnets,
 * src/plugins/seo.ts SEO_COLLECTIONS):
 * - title: `meta.title` → seo-defaults template with `%s` = the title.
 * - description: `meta.description` → the pitch cut to 155 at a word
 *   boundary → seo-defaults.
 * - share image: `meta.image` (its `og` size) → seo-defaults.
 * - canonical: own path (harmless on a noindexed page, keeps share URLs clean).
 */
export const leadMagnetMetadata = async (doc: PublicLeadMagnet): Promise<Metadata> => {
  const defaults = await getSeoDefaults()
  const pitch = clean(doc.pitch)
  return buildMetadata({
    title: clean(doc.meta?.title) || titleTemplate(defaults).replace(TITLE_PLACEHOLDER, clean(doc.title)),
    description: clean(doc.meta?.description) || (pitch ? truncate(pitch, DEFAULT_DESCRIPTION_MAX) : null),
    image: doc.meta?.image,
    path: docPath('lead-magnets', doc),
    noindex: true,
  })
}
