import 'server-only'

import React from 'react'

import { getChrome } from '@/lib/chrome'
import { getSiteUrl } from '@/lib/env'
import { absoluteMediaUrl, clean, getSeoDefaults, siteName } from '@/lib/metadata'
import { HOME_SLUG } from '@/lib/pagePath'

/** Pages that carry the company's structured data (F92): the brand page and Contact (p12). */
export const CONTACT_SLUG = 'contact'
export const ORGANIZATION_JSONLD_SLUGS: readonly string[] = [HOME_SLUG, CONTACT_SLUG]

type Json = string | number | Json[] | { [key: string]: Json | undefined } | undefined

/** Drops empty strings, non-finite numbers, empty arrays and objects left with nothing but `@type`. */
const compact = (value: Json): Json => {
  if (typeof value === 'string') return clean(value) || undefined
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined
  if (Array.isArray(value)) {
    const items = value.map(compact).filter((v) => v !== undefined)
    return items.length ? items : undefined
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value)
      .map(([k, v]) => [k, compact(v)] as const)
      .filter(([, v]) => v !== undefined)
    return entries.some(([k]) => !k.startsWith('@')) ? Object.fromEntries(entries) : undefined
  }
  return undefined
}

/**
 * ONE Organization / LocalBusiness JSON-LD script (Gate 2 fix F92), rendered by
 * PageView on `home` and `contact` only.
 *
 * `@type` is `seo-defaults.localBusiness.type` (only `ProfessionalService`, a
 * schema.org LocalBusiness subtype, S2) when set, else `Organization`. Facts
 * only (CLAUDE.md content rule 3): every property comes from the two globals
 * or `SITE_URL`; empty ones are omitted, nothing (hours, street, phone) is
 * hardcoded. Shapes per schema.org Organization / LocalBusiness and Google's
 * Organization + Local business structured-data docs:
 * - name, legalName, url, logo (original upload, not the OG crop), email,
 *   foundingDate, address (PostalAddress: locality / region / country from
 *   `site-settings.location`), sameAs (social profile URLs + the GBP link).
 * - LocalBusiness only: geo (GeoCoordinates), areaServed, openingHours.
 * - No aggregateRating: Google's review-snippet rules exclude self-serving
 *   ratings a business publishes about itself.
 *
 * Revalidation: both globals' `revalidateGlobalHook` purge the whole
 * `(frontend)` layout on save, which covers `/` and `/contact`.
 */
export async function OrganizationJsonLd() {
  const [defaults, { settings }] = await Promise.all([getSeoDefaults(), getChrome()])
  const site = getSiteUrl()
  const businessType = defaults.localBusiness?.type
  const location = settings.location
  const logo = absoluteMediaUrl(defaults.organization?.logo, 'original')

  const sameAs = [...new Set([...(settings.socials ?? []).map((s) => clean(s.url)), clean(settings.gbpUrl)])]

  const data = compact({
    '@context': 'https://schema.org',
    '@type': businessType || 'Organization',
    name: siteName(defaults),
    legalName: settings.legalName ?? undefined,
    url: site,
    logo: logo ? { '@type': 'ImageObject', url: logo } : undefined,
    email: settings.contactEmail ?? undefined,
    foundingDate: defaults.organization?.foundingDate ?? undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: location?.locality ?? undefined,
      addressRegion: location?.region ?? undefined,
      addressCountry: location?.country ?? undefined,
    },
    sameAs,
    ...(businessType
      ? {
          geo:
            typeof location?.latitude === 'number' && typeof location?.longitude === 'number'
              ? { '@type': 'GeoCoordinates', latitude: location.latitude, longitude: location.longitude }
              : undefined,
          areaServed: defaults.localBusiness?.areaServed ?? undefined,
          // several entries are stored "a; b"; schema.org wants one Text value per entry
          openingHours: (defaults.localBusiness?.openingHours ?? '').split(';'),
        }
      : {}),
  })

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
