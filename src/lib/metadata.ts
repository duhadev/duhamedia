import 'server-only'

import config from '@payload-config'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import { cache } from 'react'

import { type FaqItem, faqJsonLdItems } from '@/blocks/AccordionFAQ/Component'
import { DEFAULT_DESCRIPTION_MAX, DEFAULT_TITLE_TEMPLATE, TITLE_PLACEHOLDER } from '@/globals/SeoDefaults'
import { absoluteUrl, getSiteUrl, isProduction } from '@/lib/env'
import { docPath } from '@/lib/docPath'
import { HOME_SLUG, pagePath } from '@/lib/pagePath'
import type { CaseStudy, Media, Page, Post, SeoDefault } from '@/payload-types'
import { HOME_SEO_TITLE, META_TITLE_TARGET, truncate } from '@/plugins/seo'

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
 * - robots meta: noindex,nofollow when the page is in draft preview, or sets
 *   `noindex` or `zeroLeakage` (campaign landing pages are never indexed);
 *   otherwise `index, follow` in production and NO robots meta elsewhere.
 *   The environment rule (staging / dev never indexed) is NOT metadata any
 *   more: src/proxy.ts sends `X-Robots-Tag: noindex, nofollow` on every
 *   non-production response (F78 B1), so no route ever prints two robots
 *   meta tags (the layout sets none).
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

export const clean = (value: unknown): string => (typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '')

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

export type MetaInput = {
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
export const buildMetadata = async (input: MetaInput): Promise<Metadata> => {
  const defaults = await getSeoDefaults()
  const title = input.title
  const description = clean(input.description) || clean(defaults.defaultDescription) || undefined
  const image = ogImage(input.image) ?? ogImage(defaults.defaultOgImage)
  const url = input.path ? absoluteUrl(input.path) : undefined

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
    robots: input.noindex ? NOINDEX : isProduction() ? { index: true, follow: true } : undefined,
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

/**
 * `/` before a `home` doc is published (fresh DB): brand title + seo-defaults
 * description/image, and NOINDEX (F65 B3): the placeholder is not the
 * homepage, and the sitemap (published pages only) does not list it either.
 */
export const homeFallbackMetadata = (): Promise<Metadata> =>
  buildMetadata({ title: HOME_SEO_TITLE, path: '/', noindex: true })

/** A case study's own description: `meta.description`, else its summary cut to 155 (F78 B2); '' when none. */
const caseStudyDescription = (study: CaseStudy): string => {
  const own = clean(study.meta?.description)
  if (own) return own
  const summary = clean(study.cardSummary) || clean(study.inShort)
  return summary ? truncate(summary, DEFAULT_DESCRIPTION_MAX) : ''
}

/**
 * `/work/<slug>` (S4-12). Same precedence as pages, with the study's own
 * fallbacks in between (the same ones plugin-seo's generate buttons use,
 * src/plugins/seo.ts `summaryOf` / `generateImage`):
 * - title: `meta.title` → seo-defaults template with `%s` = the study title.
 * - description: `meta.description` (≤155 by validation) → `cardSummary` →
 *   `inShort` (either cut to 155 at a word boundary, F78 B2) → seo-defaults.
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
    description: caseStudyDescription(study) || null,
    image,
    path: docPath('case-studies', study),
    noindex: preview,
    article: { publishedTime: study.publishedAt, modifiedTime: study.updatedAt },
  })
}

/**
 * Absolute URL for a media doc's public path (Media URLs are site-relative).
 * `og` (default) prefers the 1200×630 share crop; `original` is the uploaded
 * file, for logos, which must not be cropped to 1.91:1 (Google Organization
 * `logo`: min 112×112, developers.google.com/search/docs/appearance/structured-data/organization).
 */
export const absoluteMediaUrl = (
  media: number | Media | null | undefined,
  size: 'og' | 'original' = 'og',
): string | undefined => {
  if (!media || typeof media !== 'object') return undefined
  const url = (size === 'og' ? media.sizes?.og?.url : null) || media.url
  if (!url) return undefined
  return /^https?:\/\//.test(url) ? url : `${getSiteUrl()}${url.startsWith('/') ? '' : '/'}${url}`
}

export type Crumb = { label: string; href: string | null }

/** Google: `headline` should not exceed 110 characters. */
const HEADLINE_MAX = 110

/** `href` → absolute http(s) URL, or `null` (unresolved, mailto:, tel:, …). */
const absoluteHref = (href: string | null): string | null => {
  if (!href) return null
  if (href.startsWith('/') && !href.startsWith('//')) return absoluteUrl(href)
  return /^https?:\/\//.test(href) ? href : null
}

/**
 * schema.org `BreadcrumbList` mirroring a VISIBLE breadcrumb trail (Hero
 * `breadcrumb`, F78 INFO recipe): same labels, same order. The last crumb is
 * the current page (`item` = its canonical URL). Earlier crumbs without a
 * resolvable destination are left out (Google requires `item` on every
 * non-last element) and positions renumber. `null` when fewer than two remain.
 */
export const breadcrumbJsonLd = (
  crumbs: readonly Crumb[],
  currentUrl: string | undefined,
): Record<string, unknown> | null => {
  const named = crumbs.map((c) => ({ label: clean(c.label), href: c.href })).filter((c) => c.label)
  if (named.length < 2) return null
  const last = named[named.length - 1]
  const trail = named
    .slice(0, -1)
    .map((c) => ({ name: c.label, item: absoluteHref(c.href) }))
    .filter((c): c is { name: string; item: string } => Boolean(c.item))
  const items = [...trail, { name: last.label, item: currentUrl }]
  if (items.length < 2) return null
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      ...(c.item ? { item: c.item } : {}),
    })),
  }
}

/**
 * schema.org `Article` + `BreadcrumbList` for a case study, as one `@graph`
 * (F78 LOW). Facts only: everything comes from the document or seo-defaults.
 * - headline: the title, cut to 110 at a word boundary (Google limit).
 * - description: the same text as the meta description (own fields only).
 * - image: the share image first (the same `og` crop as og:image:
 *   `meta.image` → `heroMedia`), then the hero's original upload (other aspect
 *   ratio, larger), de-duplicated.
 * - inLanguage `en` (the site is English only, `<html lang="en">`).
 * - author / publisher = the Organization from seo-defaults; url = canonical.
 * - breadcrumb = the visible Hero trail (Work → this study).
 * Never Review / AggregateRating (F64 A6). Serialised by the route with `<` escaped.
 */
export const caseStudyJsonLd = async (study: CaseStudy, crumbs: readonly Crumb[]): Promise<Record<string, unknown>> => {
  const defaults = await getSeoDefaults()
  const site = getSiteUrl()
  const path = docPath('case-studies', study)
  const url = path ? absoluteUrl(path) : undefined
  const logo = absoluteMediaUrl(defaults.organization?.logo, 'original')
  const organization = {
    '@id': `${site}/#organization`,
    '@type': 'Organization',
    name: siteName(defaults),
    url: site,
    ...(logo ? { logo: { '@type': 'ImageObject', url: logo } } : {}),
  }
  const share = ogImage(study.meta?.image) ? study.meta?.image : study.heroMedia
  const images = [absoluteMediaUrl(share), absoluteMediaUrl(study.heroMedia, 'original')].filter(
    (u, i, all): u is string => Boolean(u) && all.indexOf(u) === i,
  )
  const description = caseStudyDescription(study)
  const breadcrumb = breadcrumbJsonLd(crumbs, url)
  const article = {
    '@type': 'Article',
    headline: truncate(clean(study.title), HEADLINE_MAX),
    ...(description ? { description } : {}),
    inLanguage: 'en',
    ...(study.publishedAt ? { datePublished: study.publishedAt } : {}),
    ...(study.updatedAt ? { dateModified: study.updatedAt } : {}),
    ...(images.length ? { image: images } : {}),
    ...(url ? { url, mainEntityOfPage: { '@type': 'WebPage', '@id': url } } : {}),
    author: organization,
    publisher: organization,
  }
  return { '@context': 'https://schema.org', '@graph': breadcrumb ? [article, breadcrumb] : [article] }
}

/** A post's own description: `meta.description`, else its `dek` cut to 155; '' when none. */
const postDescription = (post: Post): string => {
  const own = clean(post.meta?.description)
  if (own) return own
  const dek = clean(post.dek)
  return dek ? truncate(dek, DEFAULT_DESCRIPTION_MAX) : ''
}

/**
 * The search title of a post: `meta.title`, else exactly what plugin-seo's
 * `generateTitle` builds (src/plugins/seo.ts): the seo-defaults template with
 * `%s` = the title, or `%s` = the capitalised `targetKeyword` when the
 * templated title runs past ~60 characters and a keyword is set.
 */
const postTitle = (post: Post, defaults: SeoDefaultsData): string => {
  const own = clean(post.meta?.title)
  if (own) return own
  const template = titleTemplate(defaults)
  const full = template.replace(TITLE_PLACEHOLDER, clean(post.title))
  const keyword = clean(post.targetKeyword)
  if (keyword && full.length > META_TITLE_TARGET) {
    return template.replace(TITLE_PLACEHOLDER, keyword.charAt(0).toUpperCase() + keyword.slice(1))
  }
  return full
}

/** The date a post shows as published: issues show their send date first. */
const postPublished = (post: Post): string | null | undefined =>
  post.track === 'newsletter-issue' ? (post.sentAt ?? post.publishedAt) : post.publishedAt

/**
 * The modified date: the shown "Updated" date (`updatedAtDisplay`) when it is
 * not before the published date, else the document's `updatedAt`, so
 * dateModified never precedes datePublished.
 */
const postModified = (post: Post): string | null | undefined => {
  const published = Date.parse(postPublished(post) ?? '')
  const shown = post.updatedAtDisplay ? Date.parse(post.updatedAtDisplay) : Number.NaN
  if (!Number.isNaN(shown) && (Number.isNaN(published) || shown >= published)) return post.updatedAtDisplay
  return post.updatedAt
}

/** The share image: `meta.image` → `heroImage` (each only with an `og` size) → seo-defaults (in buildMetadata). */
const postShareImage = (post: Post): number | Media | null | undefined =>
  ogImage(post.meta?.image) ? post.meta?.image : ogImage(post.heroImage) ? post.heroImage : null

/**
 * `/insights/<slug>` and `/newsletter/<slug>` (S6-T1). Same precedence as
 * case studies, with the post's own fallbacks (the ones plugin-seo's generate
 * buttons use):
 * - title: `meta.title` → plugin `generateTitle` logic (template, or the
 *   target keyword when the templated title is over ~60) → template.
 * - description: `meta.description` → `dek` (cut to 155) → seo-defaults.
 * - share image: `meta.image` → `heroImage` (its `og` size) → seo-defaults.
 * - canonical `docPath('posts', post)`; noindex in draft preview (production
 *   only indexes; the proxy noindexes every other environment).
 * - Open Graph `article`: published (issues: sent) / modified times.
 */
export const postMetadata = async (post: Post, { preview = false }: { preview?: boolean } = {}): Promise<Metadata> => {
  const defaults = await getSeoDefaults()
  return buildMetadata({
    title: postTitle(post, defaults),
    description: postDescription(post) || null,
    image: postShareImage(post),
    path: docPath('posts', post),
    noindex: preview,
    article: { publishedTime: postPublished(post), modifiedTime: postModified(post) },
  })
}

/**
 * schema.org JSON-LD for a post, as one `@graph` (S6-T1). Facts only:
 * - `BlogPosting` for articles (dev-seo / mkt-seo), `Article` for newsletter
 *   issues; headline = the title cut to 110; description = the meta
 *   description; datePublished (issues: send date) / dateModified
 *   (`postModified`: the shown Updated date, else `updatedAt`); image = share crop then the hero's
 *   original upload; url + mainEntityOfPage = canonical; inLanguage `en`
 *   (matches `<html lang="en">` and the case-study Article).
 * - author: the post's team member as a `Person` (name, jobTitle, worksFor),
 *   else the Organization; publisher = the Organization with its ORIGINAL
 *   logo (`absoluteMediaUrl(…, 'original')`).
 * - ONE `FAQPage` with exactly the rendered questions (`faqItems`, the same
 *   list the FAQ section renders); none for issues or an empty FAQ.
 * - No BreadcrumbList: there is no /insights hub and no visible trail (plan
 *   open question 6).
 */
export const postJsonLd = async (post: Post, faqItems: FaqItem[]): Promise<Record<string, unknown>> => {
  const defaults = await getSeoDefaults()
  const path = docPath('posts', post)
  const url = path ? absoluteUrl(path) : undefined
  const logo = absoluteMediaUrl(defaults.organization?.logo, 'original')
  const organization = {
    '@id': `${getSiteUrl()}/#organization`,
    '@type': 'Organization',
    name: siteName(defaults),
    url: getSiteUrl(),
    ...(logo ? { logo: { '@type': 'ImageObject', url: logo } } : {}),
  }
  const authorDoc = typeof post.author === 'object' && post.author !== null ? post.author : null
  const author = authorDoc && clean(authorDoc.name)
    ? {
        '@type': 'Person',
        name: clean(authorDoc.name),
        ...(clean(authorDoc.role) ? { jobTitle: clean(authorDoc.role) } : {}),
        worksFor: { '@type': 'Organization', name: siteName(defaults) },
      }
    : organization
  const images = [absoluteMediaUrl(postShareImage(post)), absoluteMediaUrl(post.heroImage, 'original')].filter(
    (u, i, all): u is string => Boolean(u) && all.indexOf(u) === i,
  )
  const description = postDescription(post)
  const published = postPublished(post)
  const modified = postModified(post)
  const article = {
    '@type': post.track === 'newsletter-issue' ? 'Article' : 'BlogPosting',
    headline: truncate(clean(post.title), HEADLINE_MAX),
    ...(description ? { description } : {}),
    inLanguage: 'en',
    ...(published ? { datePublished: published } : {}),
    ...(modified ? { dateModified: modified } : {}),
    ...(images.length ? { image: images } : {}),
    ...(url ? { url, mainEntityOfPage: { '@type': 'WebPage', '@id': url } } : {}),
    author,
    publisher: organization,
  }
  const faq =
    post.track !== 'newsletter-issue' && faqItems.length > 0
      ? { '@type': 'FAQPage', ...(url ? { url } : {}), mainEntity: faqJsonLdItems(faqItems) }
      : null
  return { '@context': 'https://schema.org', '@graph': faq ? [article, faq] : [article] }
}
