import type { Metadata } from 'next'
import { notFound, permanentRedirect, redirect } from 'next/navigation'
import React from 'react'

import { AccordionFAQItemsView, type FaqItem } from '@/blocks/AccordionFAQ/Component'
import { CaseStudyCardsBlock } from '@/blocks/CaseStudyCards/Component'
import { FinalCTABlock } from '@/blocks/FinalCTA/Component'
import { HeroBlock } from '@/blocks/Hero/Component'
import { NewsletterBandBlock } from '@/blocks/NewsletterBand/Component'
import { RichContentBlock } from '@/blocks/RichContent/Component'
import type { BlockData } from '@/blocks/types'
import { PageShell } from '@/components/chrome'
import { ReadingProgress } from '@/components/ReadingProgress'
import { getChrome } from '@/lib/chrome'
import { docPath } from '@/lib/docPath'
import { lexicalWordCount } from '@/lib/lexicalText'
import { postJsonLd, postMetadata } from '@/lib/metadata'
import { getPreviewUser } from '@/lib/pages'
import { type PostLabels, resolvePostLabels } from '@/lib/postLabels'
import { getPost, POST_ROUTE_TRACKS, servesTrack } from '@/lib/posts'
import { findRedirect } from '@/lib/redirects'
import type { Post } from '@/payload-types'

/**
 * The posts templates (S6-T1, SCHEMA §9 p13 / p14, CLAUDE.md locked order):
 * one `posts` doc fed into the EXISTING block components, no visual code of
 * its own (same pattern as CaseStudyView). Standard header + footer, reading
 * progress on for every track (R10; plan open question 19: issues too).
 *
 * - p13 DEV-SEO: 1 Hero article → 2 RichContent article (+ "How we do it"
 *   callout ← `howWeDoIt`) → 3 RichContent band (DIY ← `diyBridge`, pricing
 *   note ← `pricingNote`) → 4 CaseStudyCards cards (← `proof`; fallback
 *   testimonials) → 5 RichContent band (Educational ← `educational`) →
 *   6 AccordionFAQ items view (← `faq`) → 7 NewsletterBand → 8 FinalCTA
 *   (builds line).
 * - p14 MKT-SEO: 1 Hero article → 2 RichContent article → 3 RichContent band
 *   (DIY) → 4 RichContent band framed light (How Duha does it ← `howWeDoIt`,
 *   pricing note ← `pricingNote`) → 5 CaseStudyCards cards (fallback metric
 *   strip) → 6 FAQ → 7 NewsletterBand → 8 FinalCTA (engines line).
 * - Newsletter issue (no design; plan open question 7, derived): Hero article
 *   ("Issue 011", dek, sent date · read time) → RichContent article,
 *   unnumbered → NewsletterBand.
 *
 * Optional sections (DIY, How Duha does it, Educational, FAQ, callout) render
 * nothing when their content is empty; the blocks keep their own empty states
 * (no published study → the proof fallback; no newsletter form → no band).
 *
 * Fixed wording comes from Site settings > Template labels > "Article and
 * newsletter pages" (`site-settings.postLabels`, S6-S), per field falling back
 * to the design copy (src/lib/postLabels.ts). The FAQ JSON-LD is emitted ONCE
 * by the route (src/lib/metadata.ts `postJsonLd`), so the FAQ view here
 * renders with `emitJsonLd={false}`.
 */

/** The post template labels for this request (never throws: a failed read falls back to the defaults). */
export const getPostLabels = async (): Promise<PostLabels> =>
  resolvePostLabels((await getChrome()).settings.postLabels)

type LexicalRoot = BlockData<'richContent'>['body']
type LexicalNode = LexicalRoot['root']['children'][number]

const DATE_FORMAT = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

/** "Jun 12, 2026" (the format ArticleHero wraps in a <time>), or null. */
const formatDate = (value: string | null | undefined): string | null => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : DATE_FORMAT.format(date)
}

const trimmed = (value: string | null | undefined): string => (typeof value === 'string' ? value.trim() : '')

const readTimeText = (post: Post, labels: PostLabels): string | null =>
  typeof post.readTime === 'number' && post.readTime > 0 ? `${post.readTime} ${labels.readTimeSuffix}` : null

/** "By [Author], Duha Media", or "By Duha Media" while no (published) author is set. */
const byline = (post: Post, labels: PostLabels): string => {
  const author = typeof post.author === 'object' && post.author !== null ? trimmed(post.author.name) : ''
  return author
    ? `${labels.bylinePrefix} ${author}, ${labels.bylineOrganisation}`
    : `${labels.bylinePrefix} ${labels.bylineOrganisation}`
}

/** "Published Jun 12, 2026 · Updated Jul 24, 2026 · 9 min read" (each part only when it exists). */
const articleMetaLine = (post: Post, labels: PostLabels): string => {
  const published = formatDate(post.publishedAt)
  const updated = formatDate(post.updatedAtDisplay)
  return [
    published ? `${labels.publishedPrefix} ${published}` : null,
    updated ? `${labels.updatedPrefix} ${updated}` : null,
    readTimeText(post, labels),
  ]
    .filter(Boolean)
    .join(' · ')
}

/** "Issue 011", or null without an issue number. */
export const issueLabel = (post: Pick<Post, 'issueNumber'>, labels: PostLabels): string | null =>
  typeof post.issueNumber === 'number' ? `${labels.issueWord} ${String(post.issueNumber).padStart(3, '0')}` : null

const hasText = (root: LexicalRoot | null | undefined): root is LexicalRoot => lexicalWordCount(root) > 0

const textNode = (text: string): LexicalNode => ({ type: 'text', version: 1, text, format: 0, detail: 0, mode: 'normal', style: '' })

/** A textarea value as Lexical paragraphs (blank line = new paragraph). */
const paragraphs = (value: string): LexicalRoot => ({
  root: {
    type: 'root',
    version: 1,
    direction: 'ltr',
    format: '',
    indent: 0,
    children: value
      .split(/\n\s*\n/)
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => ({
        type: 'paragraph',
        version: 1,
        direction: 'ltr',
        format: '',
        indent: 0,
        textFormat: 0,
        children: [textNode(part.replace(/\s*\n\s*/g, ' '))],
      })),
  },
})

/** The FAQ rows exactly as rendered (also the FAQPage JSON-LD source). */
export const postFaqItems = (post: Post): FaqItem[] =>
  post.track === 'newsletter-issue'
    ? []
    : (post.faq ?? [])
        .filter((f) => trimmed(f.question) !== '' && hasText(f.answer))
        .map((f) => ({ id: f.id, question: f.question.trim(), answer: f.answer }))

/** Engagement types shown as proof per article track (dispatch S6-T1; SCHEMA §5 p13 / p14 rows). */
const PROOF_TRACKS = {
  'dev-seo': ['build', 'build-and-growth'],
  'mkt-seo': ['growth', 'build-and-growth', 'handover'],
} as const satisfies Record<'dev-seo' | 'mkt-seo', NonNullable<BlockData<'caseStudyCards'>['track']>>

/** p13 / p14 §Proof: two cards (both designs), fallback per `proof.fallbackMode`, else the track default. */
const proofBlock = (post: Post, track: 'dev-seo' | 'mkt-seo'): BlockData<'caseStudyCards'> => {
  const proof = post.proof
  const mode = proof?.fallbackMode ?? (track === 'dev-seo' ? 'testimonials' : 'metricStrip')
  return {
    blockType: 'caseStudyCards',
    layout: 'cards',
    tone: 'light',
    source: proof?.source ?? 'track',
    track: [...PROOF_TRACKS[track]],
    caseStudies: proof?.caseStudies ?? [],
    limit: 2,
    allLink: { type: 'custom' },
    fallbackMode: mode === 'metricStrip' ? 'metric-strip' : 'testimonials',
    fallbackTestimonials: proof?.fallbackTestimonials ?? [],
    fallbackMetrics: proof?.fallbackMetrics ?? [],
    fallbackBody: trimmed(proof?.fallbackNote) || null,
  }
}

/** DIY vs done-for-you bridge (grey band), or null when the group is empty. */
const diyBand = (post: Post, pricingNote: string | null): BlockData<'richContent'> | null => {
  const diy = post.diyBridge
  const facts = diy?.facts ?? []
  if (!trimmed(diy?.heading) && !hasText(diy?.body) && facts.length === 0) return null
  return {
    blockType: 'richContent',
    variant: 'band',
    tone: 'grey',
    eyebrow: diy?.eyebrow,
    heading: diy?.heading,
    accentPhrase: diy?.accentPhrase,
    body: hasText(diy?.body) ? diy.body : paragraphs(''),
    facts,
    pricingNote,
  }
}

function ArticleTemplate({ post, labels, track }: { post: Post; labels: PostLabels; track: 'dev-seo' | 'mkt-seo' }) {
  const meta = articleMetaLine(post, labels)
  const pricingNote = trimmed(post.pricingNote) || null
  const how = post.howWeDoIt
  const howBody = trimmed(how?.body)
  const howEyebrow = trimmed(how?.eyebrow) || labels.howWeDoItEyebrow
  const faqItems = postFaqItems(post)
  const faqEyebrow = trimmed(post.faqHeading) || [trimmed(post.targetKeyword), labels.faqEyebrowSuffix].filter(Boolean).join(' ')

  const hero: BlockData<'hero'> = {
    blockType: 'hero',
    variant: 'article',
    eyebrow: post.eyebrow,
    heading: post.title,
    standfirst: post.dek,
    body: byline(post, labels),
    metaLine: meta || null,
    geometry: false,
    media: post.heroImage,
    mediaFrame: 'none',
  }

  const article: BlockData<'richContent'> = {
    blockType: 'richContent',
    variant: 'article',
    numberSections: true,
    body: post.body,
    // p13 only: the "How we do it" box closes the body (p14 gives it its own section).
    ...(track === 'dev-seo' && howBody
      ? { callout: { eyebrow: howEyebrow, body: howBody, link: how?.link ?? { type: 'internal' } } }
      : {}),
  }

  // p13: the pricing note sits under the DIY facts strip; p14: in the How Duha does it box (designs).
  const diy = diyBand(post, track === 'dev-seo' ? pricingNote : null)

  const howDuha: BlockData<'richContent'> | null =
    track === 'mkt-seo' && howBody
      ? {
          blockType: 'richContent',
          variant: 'band',
          tone: 'light',
          framed: true,
          eyebrow: howEyebrow,
          body: paragraphs(howBody),
          pricingNote,
          link: how?.link,
        }
      : null

  const edu = post.educational
  const educational: BlockData<'richContent'> | null =
    track === 'dev-seo' && (trimmed(edu?.heading) || hasText(edu?.body))
      ? {
          blockType: 'richContent',
          variant: 'band',
          tone: 'grey',
          eyebrow: edu?.eyebrow,
          heading: edu?.heading,
          body: hasText(edu?.body) ? edu.body : paragraphs(''),
        }
      : null

  const newsletter: BlockData<'newsletterBand'> = {
    blockType: 'newsletterBand',
    variant: 'band',
    heading: post.closing?.newsletterHeading,
  }

  const finalCta: BlockData<'finalCTA'> = {
    blockType: 'finalCTA',
    heading: post.closing?.finalCtaHeading,
    capacity: track === 'mkt-seo' ? 'engines-line' : 'builds-line',
    buttons: [],
  }

  return (
    <main>
      <HeroBlock {...hero} />
      <RichContentBlock {...article} />
      {diy ? <RichContentBlock {...diy} /> : null}
      {howDuha ? <RichContentBlock {...howDuha} /> : null}
      <CaseStudyCardsBlock {...proofBlock(post, track)} />
      {educational ? <RichContentBlock {...educational} /> : null}
      <AccordionFAQItemsView eyebrow={faqEyebrow || null} items={faqItems} emitJsonLd={false} />
      <NewsletterBandBlock {...newsletter} />
      <FinalCTABlock {...finalCta} />
    </main>
  )
}

function IssueTemplate({ post, labels }: { post: Post; labels: PostLabels }) {
  const meta = [formatDate(post.sentAt ?? post.publishedAt), readTimeText(post, labels)].filter(Boolean).join(' · ')

  const hero: BlockData<'hero'> = {
    blockType: 'hero',
    variant: 'article',
    eyebrow: issueLabel(post, labels) ?? post.eyebrow,
    heading: post.title,
    standfirst: post.dek,
    metaLine: meta || null,
    geometry: false,
    media: post.heroImage,
    mediaFrame: 'none',
  }

  const article: BlockData<'richContent'> = {
    blockType: 'richContent',
    variant: 'article',
    numberSections: false,
    body: post.body,
  }

  const newsletter: BlockData<'newsletterBand'> = {
    blockType: 'newsletterBand',
    variant: 'band',
    heading: post.closing?.newsletterHeading,
  }

  return (
    <main>
      <HeroBlock {...hero} />
      <RichContentBlock {...article} />
      <NewsletterBandBlock {...newsletter} />
    </main>
  )
}

export function PostView({ post, labels }: { post: Post; labels: PostLabels }) {
  return (
    <PageShell header="standard" footer="standard">
      <ReadingProgress />
      {post.track === 'newsletter-issue' ? (
        <IssueTemplate post={post} labels={labels} />
      ) : (
        <ArticleTemplate post={post} labels={labels} track={post.track} />
      )}
    </PageShell>
  )
}

type RouteKey = keyof typeof POST_ROUTE_TRACKS

/**
 * The body of both post routes (`/insights/<slug>`, `/newsletter/<slug>`),
 * like `/work/<slug>`:
 * - the PUBLISHED post, or (staff draft preview only) its latest draft;
 * - a post of another track (e.g. an issue at `/insights/<slug>`) → 308 to its
 *   canonical `docPath` (plan open question 20);
 * - no post → the redirects collection (F22: only when nothing lives at the
 *   path) → else (frontend)/not-found.tsx (404).
 * One JSON-LD script: the post `@graph` (Article / BlogPosting + one FAQPage).
 */
export async function PostRoute({ route, slug }: { route: RouteKey; slug: string }) {
  const post = await getPost(slug)
  if (post) {
    if (!servesTrack(post, POST_ROUTE_TRACKS[route])) {
      const canonical = docPath('posts', post)
      if (canonical) permanentRedirect(canonical)
      notFound()
    }
    const labels = await getPostLabels()
    const jsonLd = await postJsonLd(post, postFaqItems(post))
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        <PostView post={post} labels={labels} />
      </>
    )
  }

  const target = await findRedirect(`/${route}/${slug}`)
  if (target) {
    if (target.permanent) permanentRedirect(target.location)
    redirect(target.location)
  }
  notFound()
}

/** `generateMetadata` for both post routes: none for a missing or wrong-track post (it 404s / redirects). */
export async function postRouteMetadata(route: RouteKey, slug: string): Promise<Metadata> {
  const post = await getPost(slug)
  if (!post || !servesTrack(post, POST_ROUTE_TRACKS[route])) return {}
  return postMetadata(post, { preview: Boolean(await getPreviewUser()) })
}
