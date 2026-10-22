import 'server-only'

import config from '@payload-config'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import { cache } from 'react'

import { DEFAULT_TITLE_TEMPLATE, TITLE_PLACEHOLDER } from '@/globals/SeoDefaults'
import { getSiteUrl, isProduction } from '@/lib/env'
import { docPath } from '@/lib/docPath'
import { HOME_SLUG, pagePath } from '@/lib/pagePath'
import type { CaseStudy, Media, Page, SeoDefault } from '@/payload-types'
import { HOME_SEO_TITLE } from '@/plugins/seo'

/**
 * Per-page `<head>` metadata (router unit B2; next@16 `generateMetadata`,
 * node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md).
 *
 * Precedence, per field:
 * - title: the page's SEO tab `meta.title` → `HOME_SEO_TITLE` for `home` (S4/F29,
 *   same value as plugin-seo `generateTitle`) → `seo-defaults.titleTemplate`
 *   (else `DEFAULT_TITLE_TEMPLATE`) with `%s` = the page title. Emitted as
 *   `title.absolute` so the layout's template is never applied twice.
 * - description: `meta.description` → `seo-defaults.defaultDescription` → none.
 * - share image: `meta.image` → `seo-defaults.defaultOgImage`, each only via its
 *   1200×630 `og` size (Media `imageSizes.og`); none when neither has one.
 * - canonical / og:url: `SITE_URL` + `pagePath(slug)` (absolute).
 * - robots: noindex,nofollow when APP_ENV ≠ production, when the page is in
 *   draft preview, or when the page sets `noindex` or `zeroLeakage`
 *   (campaign landing pages are never indexed). `robots` is a nested field,
 *   so the page's value REPLACES the layout's (generate-metadata.md
 *   "Merging"): exactly one robots tag.
 *
 * Every global read is defensive: an unsaved global has no row (payload@3.91.0
 * globals/operations/findOne.js) and a failed read must not take a page down.
 */

export type SeoDefaultsData = Partial<SeoDefault>

export const getSeoDefaults = cache(async (): Promise<SeoDefaultsData> => {
  try {
    const payload = await getPayload({ config })
    return (await payload.findGlobal({ slug: 'seo-defaults', depth: 1, overrideAccess: false })) ?? {}
  } catch (error) {
    console.error('[metadata] could not read the seo-defaults global; using built-in fallbacks', error)
    return {}
  }
})

const clean = (value: unknown): string => (typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '')

/** `seo-defaults.titleTemplate` when it holds exactly one `%s`, else the SCHEMA default. */
export const titleTemplate = (defaults: SeoDefaultsData): string => {
  const template = clean(defaults.titleTemplate)
  return template.split(TITLE_PLACEHOLDER).length - 1 === 1 ? template : DEFAULT_TITLE_TEMPLATE
}

export const siteName = (defaults: SeoDefaultsData): string => clean(defaults.organization?.name) || 'Duha Media'

type ShareImage = { url: string; width?: number; height?: number; alt?: string }

/** The `og` size of a populated media doc, or `null` (id only, missing, or too small). */
const ogImage = (media: number | Media | null | undefined): ShareImage | null => {
  if (!media || typeof media !== 'object') return null
  const og = media.sizes?.og
  if (!og?.url) return null
  return {
    url: og.url,
    width: og.width ?? undefined,
    height: og.height ?? undefined,
    alt: clean(media.alt) || undefined,
  }
}

const NOINDEX = { index: false, follow: false } as const

type MetaInput = {
  /** Final `<title>` (already templated). */
  title: string
  description?: string | null
  image?: number | Media | null
  /** Public path for canonical / og:url, or `null` for none. */
  path: string | null
  noindex: boolean
  /** Open Graph `article` (case studies, posts): dates in ISO-8601. Omitted = `website`. */
  article?: { publishedTime?: string | null; modifiedTime?: string | null }
}

/** The shared metadata shape for a routable document (canonical, OG, Twitter, robots). */
const buildMetadata = async (input: MetaInput): Promise<Metadata> => {
  const defaults = await getSeoDefaults()
  const title = input.title
  const description = clean(input.description) || clean(defaults.defaultDescription) || undefined
  const image = ogImage(input.image) ?? ogImage(defaults.defaultOgImage)
  const url = input.path ? `${getSiteUrl()}${input.path}` : undefined
  const noindex = !isProduction() || input.noindex

  return {
    title: { absolute: title },
    description,
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      ...(input.article
        ? {
            type: 'article' as const,
            publishedTime: input.article.publishedTime ?? undefined,
            modifiedTime: input.article.modifiedTime ?? undefined,
          }
        : { type: 'website' as const }),
      siteName: siteName(defaults),
      title,
      description,
      url,
      images: image ? [image] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: noindex ? NOINDEX : { index: true, follow: true },
  }
}

export const pageMetadata = async (page: Page, { preview = false }: { preview?: boolean } = {}): Promise<Metadata> => {
  const defaults = await getSeoDefaults()
  const title =
    clean(page.meta?.title) ||
    (page.slug === HOME_SLUG ? HOME_SEO_TITLE : titleTemplate(defaults).replace(TITLE_PLACEHOLDER, clean(page.title)))
  return buildMetadata({
    title,
    description: page.meta?.description,
    image: page.meta?.image,
    path: pagePath(page.slug),
    noindex: preview || page.noindex === true || page.zeroLeakage === true,
  })
}

/** `/` before a `home` doc is published (fresh DB): brand title + seo-defaults description/image. */
export const homeFallbackMetadata = (): Promise<Metadata> =>
  buildMetadata({ title: HOME_SEO_TITLE, path: '/', noindex: false })

/**
 * `/work/<slug>` (S4-12). Same precedence as pages, with the study's own
 * fallbacks in between (the same ones plugin-seo's generate buttons use,
 * src/plugins/seo.ts `summaryOf` / `generateImage`):
 * - title: `meta.title` → seo-defaults template with `%s` = the study title.
 * - description: `meta.description` → `cardSummary` → `inShort` → seo-defaults.
 * - share image: `meta.image` → `heroMedia` (its `og` size) → seo-defaults.
 * - canonical `/work/<slug>`; noindex outside production and in draft preview.
 * - Open Graph type `article` with published / modified times.
 */
export const caseStudyMetadata = async (
  study: CaseStudy,
  { preview = false }: { preview?: boolean } = {},
): Promise<Metadata> => {
  const defaults = await getSeoDefaults()
  const title = clean(study.meta?.title) || titleTemplate(defaults).replace(TITLE_PLACEHOLDER, clean(study.title))
  const image = ogImage(study.meta?.image) ? study.meta?.image : ogImage(study.heroMedia) ? study.heroMedia : null
  return buildMetadata({
    title,
    description: clean(study.meta?.description) || clean(study.cardSummary) || clean(study.inShort) || null,
    image,
    path: docPath('case-studies', study),
    noindex: preview,
    article: { publishedTime: study.publishedAt, modifiedTime: study.updatedAt },
  })
}

/** Absolute URL for a media doc's public path (Media URLs are site-relative). */
const absoluteMediaUrl = (media: number | Media | null | undefined): string | undefined => {
  if (!media || typeof media !== 'object') return undefined
  const url = media.sizes?.og?.url || media.url
  if (!url) return undefined
  return /^https?:\/\//.test(url) ? url : `${getSiteUrl()}${url.startsWith('/') ? '' : '/'}${url}`
}

/**
 * schema.org `Article` for a case study (headline, dates, image, author and
 * publisher = the Organization from seo-defaults, url = canonical). Facts
 * only: everything comes from the document or seo-defaults; nothing invented.
 * Serialised by the route with `<` escaped.
 */
export const caseStudyJsonLd = async (study: CaseStudy): Promise<Record<string, unknown>> => {
  const defaults = await getSeoDefaults()
  const site = getSiteUrl()
  const path = docPath('case-studies', study)
  const url = path ? `${site}${path}` : undefined
  const logo = absoluteMediaUrl(defaults.organization?.logo)
  const organization = {
    '@type': 'Organization',
    name: siteName(defaults),
    url: site,
    ...(logo ? { logo: { '@type': 'ImageObject', url: logo } } : {}),
  }
  const image = absoluteMediaUrl(study.heroMedia)
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: clean(study.title),
    ...(study.publishedAt ? { datePublished: study.publishedAt } : {}),
    ...(study.updatedAt ? { dateModified: study.updatedAt } : {}),
    ...(image ? { image: [image] } : {}),
    ...(url ? { url, mainEntityOfPage: { '@type': 'WebPage', '@id': url } } : {}),
    author: organization,
    publisher: organization,
  }
}
