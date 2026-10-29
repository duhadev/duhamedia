import Link from 'next/link'
import React from 'react'

import { loadFeaturedStudy } from './loadFeaturedStudy'
import type { BlockData } from '@/blocks/types'
import { RichText } from '@/components/RichText'
import { VideoFacade } from '@/components/VideoFacade'
import { ButtonLink, CMSLink, Container, Eyebrow, Media, Section } from '@/components/ui'
import { resolveLinkHref } from '@/components/ui/CMSLink'
import { AccentHeadline } from '@/components/ui/AccentHeadline'
import { cx } from '@/lib/cx'
import { docPath } from '@/lib/docPath'
import { youtubeVideoId } from '@/lib/youtube'
import type { CaseStudy, Client, Testimonial } from '@/payload-types'

type TestimonialRowProps = BlockData<'testimonialRow'>

/* ----------------------------- small pieces ----------------------------- */

const SMALL_LABEL = 'block text-[10px] font-bold uppercase tracking-[0.12em] text-gray-warm'
const MONO = "font-mono text-[10px] uppercase tracking-[0.1em]"

const SOURCE_LABELS: Record<Testimonial['source'], string | null> = {
  direct: null,
  'google-review': 'Google review',
  linkedin: 'LinkedIn',
}

/** DS Testimonial star (Phosphor "star" fill, 256 viewBox). */
function Star() {
  return (
    <svg width="15" height="15" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" className="text-accent-primary">
      <path d="M239.2 97.29a16 16 0 0 0-13.81-11L166 81.17l-23.28-55.36a15.95 15.95 0 0 0-29.44 0L90 81.17l-59.44 5.15a16 16 0 0 0-9.11 28.06l45.11 39.42-13.52 58.54a16 16 0 0 0 23.84 17.34l51.11-31 51.11 31a16 16 0 0 0 23.84-17.34l-13.51-58.54 45.1-39.42a16 16 0 0 0 4.67-17.09Z" />
    </svg>
  )
}

/** Underlined text link with a 44px hit area (the underline is drawn on the text only). */
function UnderlineText({ children }: { children: React.ReactNode }) {
  return <span className="ix-rule pb-1">{children}</span>
}
const UNDERLINE_LINK = 'inline-flex min-h-target items-center self-start text-small-mobile font-bold uppercase tracking-[0.06em] text-ink no-underline md:text-small'

/**
 * Video tile: poster + play button; a click loads the YouTube player in place
 * (VideoFacade, youtube-nocookie.com). FLAG: promote to the shared VideoTile
 * component (SCHEMA X4) when it exists.
 */
function VideoPoster({ t }: { t: Testimonial }) {
  const id = t.video?.url ? youtubeVideoId(t.video.url) : null
  const poster = typeof t.video?.poster === 'object' ? t.video.poster : null
  if (!id) {
    console.error(`[TestimonialRow] video testimonial ${t.id} has no valid YouTube URL; showing the quote only.`)
    return null
  }
  const client = typeof t.client === 'object' && t.client ? (t.client as Client) : null
  const context = [t.authorName, client?.name].filter(Boolean).join(', ')
  return (
    <VideoFacade
      videoId={id}
      label={`Play video: ${context}`}
      title={`Video testimonial from ${context}`}
      className="mb-4 aspect-video w-full overflow-hidden bg-ink"
    >
      {poster ? <Media resource={poster} fill alt="" sizes="(min-width: 768px) 520px, 100vw" /> : null}
      <span className="absolute inset-0 grid place-items-center bg-ink/20 transition-colors duration-180 group-hover:bg-ink/35">
        <span className="ix-play grid size-14 place-items-center rounded-badge bg-cream text-ink">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="ix-play-glyph">
            <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
          </svg>
        </span>
      </span>
      {t.video?.durationLabel ? (
        <span className="absolute right-2 bottom-2 bg-ink px-2 py-0.5 font-mono text-[11px] text-cream">
          {t.video.durationLabel}
        </span>
      ) : null}
    </VideoFacade>
  )
}

/** One testimonial card (DS Testimonial: figure, 1px divider border, stars + source tag, quote, caption). */
function TestimonialCard({ t }: { t: Testimonial }) {
  const sourceLabel = SOURCE_LABELS[t.source]
  const rating = typeof t.rating === 'number' ? Math.min(5, Math.max(0, Math.round(t.rating))) : 0
  const client = typeof t.client === 'object' && t.client ? (t.client as Client) : null
  const logo = client && typeof client.logo === 'object' ? client.logo : null
  const metric = t.metric?.value?.trim() ? t.metric : null
  const hasTopRow = rating > 0 || sourceLabel

  return (
    <figure className="m-0 border border-divider bg-cream p-5">
      {t.format === 'video' ? <VideoPoster t={t} /> : null}
      {hasTopRow ? (
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="flex gap-0.5" role={rating ? 'img' : undefined} aria-label={rating ? `${rating} out of 5 stars` : undefined}>
            {Array.from({ length: rating }, (_, i) => (
              <Star key={i} />
            ))}
          </span>
          {sourceLabel ? <span className={cx(MONO, 'text-gray-warm')}>{sourceLabel}</span> : null}
        </div>
      ) : null}
      <blockquote className="m-0 text-[1.0625rem] leading-normal font-medium text-pretty whitespace-pre-line">{t.quote}</blockquote>
      {metric ? (
        <p className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-h3-mobile text-ground-accent md:text-h3">{metric.value}</span>
          {metric.label ? <span className="text-label font-bold uppercase text-gray-warm">{metric.label}</span> : null}
        </p>
      ) : null}
      <figcaption className="mt-3 flex items-center gap-3 text-small-mobile font-bold">
        {logo ? <Media resource={logo} alt={client?.name ?? ''} className="h-6 w-auto shrink-0" /> : null}
        <span>
          {t.authorName}
          {t.authorRole ? <span className="font-medium text-gray-warm"> · {t.authorRole}</span> : null}
        </span>
      </figcaption>
    </figure>
  )
}

/* ------------------------------ study card ------------------------------ */

type Study =
  | { kind: 'study'; doc: CaseStudy }
  | { kind: 'metric'; value: string; label: string; sub?: string | null }

/** Published-only (R3). A draft or id-only relation never becomes a study card. */
function usableStudy(cs: unknown): CaseStudy | null {
  if (!cs || typeof cs !== 'object') return null
  const doc = cs as CaseStudy
  if (doc._status !== 'published' || !doc.slug) return null
  if (!doc.headlineMetric?.value?.trim() || !doc.headlineMetric?.label?.trim()) return null
  return doc
}

function resolveStudy(card: TestimonialRowProps['studyCard'], featured: CaseStudy | null): Study | null {
  if (!card || card.show === false) return null
  const doc = usableStudy(card.source === 'manual' ? card.caseStudy : featured)
  if (doc) return { kind: 'study', doc }
  const m = card.fallbackMetric
  if (m?.value?.trim() && m?.label?.trim()) return { kind: 'metric', value: m.value, label: m.label, sub: m.sub }
  return null
}

const CARD = 'flex flex-col gap-3 border-2 border-ink bg-cream px-5 py-5.5 text-ink md:gap-3.5 md:px-7 md:pt-7 md:pb-6.5'
const NUMBER = 'font-display text-metric-mobile leading-none text-ground-accent md:text-[3.5rem]'
const NUMBER_LABEL = '-mt-1.5 text-[0.8125rem] font-bold uppercase tracking-[0.04em] text-gray-warm md:text-[0.875rem]'

function StudyCard({ study, readLabel }: { study: Study; readLabel: string }) {
  if (study.kind === 'metric') {
    return (
      <div className={CARD}>
        {study.sub ? <span className={SMALL_LABEL}>{study.sub}</span> : null}
        <span className={NUMBER}>{study.value}</span>
        <span className={NUMBER_LABEL}>{study.label}</span>
      </div>
    )
  }
  const { doc } = study
  const href = docPath('case-studies', doc)
  const client = typeof doc.client === 'object' && doc.client ? doc.client.name : null
  const kicker = [client, doc.engagementLine].filter((s) => s?.trim()).join(' · ')
  const inner = (
    <>
      {kicker ? <span className={SMALL_LABEL}>{kicker}</span> : null}
      <span className={NUMBER}>{doc.headlineMetric.value}</span>
      <span className={NUMBER_LABEL}>{doc.headlineMetric.label}</span>
      {doc.cardSummary ? <p className="m-0 whitespace-pre-line text-[0.9375rem] leading-[1.6] md:text-base">{doc.cardSummary}</p> : null}
      {readLabel ? (
        <span className="mt-1 inline-flex min-h-target items-center self-start text-[13px] font-bold uppercase tracking-[0.06em] md:text-small">
          <UnderlineText>
            {readLabel} <span aria-hidden="true" className="ix-arrow">→</span>
          </UnderlineText>
        </span>
      ) : null}
    </>
  )
  return href ? (
    <Link
      href={href}
      // Linked card: the CaseStudyCard reference lift (interaction system), no lift under reduced motion.
      className={cx(
        CARD,
        'no-underline transition-[box-shadow,translate] duration-180 ease-out hover:shadow-lift focus-visible:shadow-lift motion-safe:hover:-translate-y-1 motion-safe:focus-visible:-translate-y-1',
      )}
    >
      {inner}
    </Link>
  ) : (
    <div className={CARD}>{inner}</div>
  )
}

/* -------------------------------- block --------------------------------- */

const COLS = { 1: '', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3' } as const

/**
 * Pure render of the `row` variant (Homepage.dc.html "Testimonials", desktop +
 * mobile builds). `featuredStudy` is the already-fetched featured study (or null).
 *
 * Empty choices (decided): only published testimonials render (public reads
 * already exclude drafts; `_status` is re-checked). With nothing to show in
 * either column the whole section renders nothing (no empty frame). With no
 * testimonials but a study/figure, only the study column renders. With no
 * study and no fallback figure, the testimonials reflow into a row.
 */
export function TestimonialRowView({
  eyebrow,
  eyebrowTick,
  heading,
  accentPhrase,
  testimonials,
  studyCard,
  cta,
  ctaStyle,
  leadMetric,
  featuredStudy = null,
}: TestimonialRowProps & { featuredStudy?: CaseStudy | null }) {
  const cards = (testimonials ?? []).flatMap((t) => {
    if (!t || typeof t !== 'object') return []
    return t._status === undefined || t._status === 'published' ? [t] : []
  })
  const lead = leadMetric?.value?.trim() && leadMetric?.label?.trim() ? leadMetric : null
  // leadMetric layout (p16 Social proof): metric tile + quote(s); the "A study in full" card is not part of it.
  const study = lead ? null : resolveStudy(studyCard, featuredStudy)
  if (cards.length === 0 && !study && !lead) return null

  const showCta = Boolean(resolveLinkHref(cta) && cta?.label?.trim())
  const twoCol = cards.length > 0 && study !== null
  // A video card beside a text card: the text card must not stretch to the video card's height (empty body).
  const mixedFormats = cards.some((t) => t.format === 'video') && cards.some((t) => t.format !== 'video')
  const studyLabel = studyCard?.label?.trim()

  const eyebrowEl = eyebrow ? (
    <span className={cx(SMALL_LABEL, eyebrowTick && 'flex items-center gap-2.5')}>
      {eyebrowTick ? <span aria-hidden="true" className="size-2.25 shrink-0 rotate-45 bg-ground-accent" /> : null}
      {eyebrow}
    </span>
  ) : null

  const asButton = showCta && ctaStyle === 'button'
  const buttonEl = asButton ? (
    <div className="mt-6 grid md:mt-8 md:flex">
      <ButtonLink link={cta} variant="primary" size="md" />
    </div>
  ) : null

  const ctaEl = showCta && !asButton ? (
    <CMSLink link={cta} className={UNDERLINE_LINK}>
      <UnderlineText>
        {cta?.label} <span aria-hidden="true" className="ix-arrow">→</span>
      </UnderlineText>
    </CMSLink>
  ) : null

  if (lead) {
    return (
      <Section tone="light" pad="none" className="py-12 md:pt-20 md:pb-24">
        <Container>
          {heading ? <AccentHeadline text={heading} accent={accentPhrase} level={2} className="mb-6 md:mb-10" /> : null}
          <div className={cx('grid items-stretch gap-6 md:gap-8', cards.length > 0 && 'md:grid-cols-[1fr_2fr]')}>
            <div className="flex flex-col justify-center gap-1.5 md:bg-gray-light md:p-8">
              <span className={NUMBER}>{lead.value}</span>
              <span className="text-[12px] font-bold uppercase tracking-[0.1em]">{lead.label}</span>
              {lead.sub?.trim() ? <span className="mt-1.5 text-[0.8125rem] leading-normal text-gray-warm">{lead.sub}</span> : null}
            </div>
            {cards.length > 0 ? (
              <div className="flex flex-col gap-3.5 md:gap-5">
                {eyebrowEl}
                <div className="grid gap-4 md:gap-5">
                  {cards.map((t) => (
                    <TestimonialCard key={t.id} t={t} />
                  ))}
                </div>
                {ctaEl}
              </div>
            ) : null}
          </div>
          {buttonEl}
        </Container>
      </Section>
    )
  }

  return (
    <Section tone="light" divider="top" className="max-md:pt-11 max-md:pb-12">
      <Container>
        {heading ? (
          <AccentHeadline text={heading} accent={accentPhrase} level={2} className="mb-6 md:mb-10" />
        ) : null}
        <div className={cx('grid items-start gap-7 md:gap-14', twoCol && 'md:grid-cols-2')}>
          {cards.length > 0 ? (
            <div className="flex flex-col gap-3.5 md:gap-5">
              {eyebrowEl}
              <div className={cx('grid gap-4 md:gap-5', !twoCol && COLS[Math.min(cards.length, 3) as 1 | 2 | 3], mixedFormats && 'md:items-start')}>
                {cards.map((t) => (
                  <TestimonialCard key={t.id} t={t} />
                ))}
              </div>
              {!twoCol ? ctaEl : null}
            </div>
          ) : null}
          {study ? (
            <div className="flex flex-col gap-3.5 md:gap-5">
              {studyLabel ? <span className={SMALL_LABEL}>{studyLabel}</span> : null}
              <StudyCard study={study} readLabel={studyCard?.readLabel?.trim() ?? ''} />
              {twoCol || cards.length === 0 ? ctaEl : null}
            </div>
          ) : null}
        </div>
        {buttonEl}
      </Container>
    </Section>
  )
}

/* ---------------------------- client-voice variant ---------------------------- */

type ClientVoiceData = NonNullable<TestimonialRowProps['clientVoice']>

/** True when the Lexical state holds at least one non-blank text node. */
function hasText(node: unknown): boolean {
  if (!node || typeof node !== 'object') return false
  const n = node as { text?: unknown; children?: unknown }
  if (typeof n.text === 'string' && n.text.trim()) return true
  return Array.isArray(n.children) && n.children.some(hasText)
}

/**
 * Pure render of the `client-voice` variant (Case Study.dc.html "Client voice",
 * desktop + mobile builds). Takes the same shape as `case-studies.clientVoice`,
 * so the case-study template passes the study's group straight through.
 *
 * Video-first: a video testimonial shows its poster (link-out to YouTube) above
 * the quote; a text testimonial shows the quote only. Only a PUBLISHED, populated
 * testimonial renders; without one the whole section renders nothing (the case
 * study still reads whole) and a server-side warning is logged.
 */
export function TestimonialClientVoiceView({
  clientVoice,
  differentlyNumber,
  differentlyHeading,
  phaseLabel,
}: Pick<TestimonialRowProps, 'differentlyNumber' | 'differentlyHeading' | 'phaseLabel'> & { clientVoice?: ClientVoiceData | null }) {
  const t = clientVoice?.testimonial
  const testimonial = t && typeof t === 'object' && (t._status === undefined || t._status === 'published') ? t : null
  if (!testimonial) {
    console.warn('[TestimonialRow] client-voice has no published testimonial; rendering nothing')
    return null
  }

  const differently = hasText(clientVoice?.doDifferently?.root) ? clientVoice?.doDifferently : null
  const phases = clientVoice?.phaseMapping?.trim() ? clientVoice.phaseMapping : null
  const hasLink = Boolean(resolveLinkHref(clientVoice?.link) && clientVoice?.link?.label?.trim())
  const heading = differentlyHeading?.trim()
  const number = differentlyNumber?.trim()

  return (
    <Section tone="light" pad="none" className="pt-9 pb-2 md:py-14">
      <Container>
        <div className="mx-auto max-w-205">
          <TestimonialCard t={testimonial} />
          {differently ? (
            <div className="mt-8 flex max-w-[66ch] flex-col gap-4 text-[1.0625rem] leading-[1.7] md:mt-10 md:gap-5.5">
              {heading || number ? (
                <div className="flex flex-col gap-1.5 md:gap-2">
                  {number ? <span className="font-display text-[0.8125rem] text-wine md:text-[0.875rem]">{number}</span> : null}
                  {heading ? (
                    <h2 className="m-0 font-display text-[1.25rem] leading-[1.15] font-normal uppercase md:text-[1.375rem]">{heading}</h2>
                  ) : null}
                </div>
              ) : null}
              <div className="flex flex-col gap-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:m-0 [&_ul]:list-disc [&_ul]:pl-6">
                <RichText data={differently} linkClassName="ix-rule no-underline" disableContainer />
              </div>
            </div>
          ) : null}
          {phases || hasLink ? (
            <div className="mt-6 max-w-[66ch] border-2 border-ink p-5 md:mt-7 md:px-6 md:py-5.5">
              {phaseLabel?.trim() ? <Eyebrow muted>{phaseLabel}</Eyebrow> : null}
              {phases ? <p className="m-0 mt-2.5 text-[0.9375rem] leading-[1.6] whitespace-pre-line">{phases}</p> : null}
              {hasLink ? (
                <div className="mt-4">
                  <ButtonLink link={clientVoice?.link} variant="ghost" size="md" className="max-md:flex max-md:w-full" />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  )
}

/** Server component: resolves the featured study (only when needed), then renders the view. */
export async function TestimonialRowBlock(props: TestimonialRowProps) {
  if (props.variant === 'client-voice') return <TestimonialClientVoiceView {...props} />
  const needsFeatured = props.studyCard?.show !== false && (props.studyCard?.source ?? 'featured') === 'featured'
  const featuredStudy = needsFeatured ? await loadFeaturedStudy() : null
  return <TestimonialRowView {...props} featuredStudy={featuredStudy} />
}
