import Link from 'next/link'
import React from 'react'

import { buttonClasses } from '@/components/ui/Button'
import { VideoFacade } from '@/components/VideoFacade'
import { Media } from '@/components/ui/Media'
import { cx } from '@/lib/cx'
import { docPath } from '@/lib/docPath'
import { youtubeVideoId } from '@/lib/youtube'
import type { Media as MediaDoc, Testimonial } from '@/payload-types'

/**
 * Pure (server- and client-safe) pieces of the ReviewWall `feed` variant:
 * the card data model, the normaliser shared by the server render and the
 * Load More island, and the card markup (Testimonials.dc.html §Testimonial
 * feed, desktop + mobile builds). No server-only imports here.
 *
 * Breakpoints: type and padding switch to the desktop build at `md`; the
 * side-by-side video card and the two-up text pairs start at `lg` (below that
 * the desktop split leaves the quote column too narrow, same rule as Hero /
 * PhaseTimeline).
 */

export type FeedCardData = {
  id: number | string
  quote: string
  authorName: string
  authorRole: string | null
  /** Whole stars 1–5, 0 = no stars (R6: never defaulted). */
  rating: number
  source: Testimonial['source']
  /** YouTube id when this renders as a video card (format video + valid URL). */
  videoId: string | null
  poster: MediaDoc | null
  durationLabel: string | null
  metricValue: string | null
  metricLabel: string | null
  /** Client logo (video cards only) and the client name used as its alt. */
  logo: MediaDoc | null
  clientName: string | null
  /** Case-study deep link, only when the study is published and links are on. */
  studyHref: string | null
}

export type FeedLabels = {
  video: string
  googleReview: string
  linkedin: string
  play: string
  studyLink: string
}

const text = (v: unknown): string | null => (typeof v === 'string' && v.trim() ? v.trim() : null)
const asMedia = (v: unknown): MediaDoc | null => (v && typeof v === 'object' ? (v as MediaDoc) : null)

/**
 * Testimonial doc → card data, or `null` when it must not render (not
 * published, or no quote/name). A video testimonial without a usable YouTube
 * URL degrades to a text card (logged). Relations that arrive as bare ids
 * (unpopulated, or unreadable to the public) count as absent (SCHEMA §5.2).
 */
export function toFeedCard(t: unknown, showStudyLinks: boolean): FeedCardData | null {
  if (!t || typeof t !== 'object') return null
  const doc = t as Testimonial
  if (doc._status !== undefined && doc._status !== 'published') return null
  const quote = text(doc.quote)
  const authorName = text(doc.authorName)
  if (!quote || !authorName) return null

  let videoId: string | null = null
  if (doc.format === 'video') {
    videoId = doc.video?.url ? youtubeVideoId(doc.video.url) : null
    if (!videoId) console.error(`[ReviewWall] video testimonial ${doc.id} has no valid YouTube URL; showing it as a text card.`)
  }

  const client = doc.client && typeof doc.client === 'object' ? doc.client : null
  const study = doc.caseStudy && typeof doc.caseStudy === 'object' ? doc.caseStudy : null
  const studyHref = showStudyLinks && study && study._status === 'published' ? docPath('case-studies', study) : null
  const rating = typeof doc.rating === 'number' ? Math.min(5, Math.max(0, Math.round(doc.rating))) : 0

  return {
    id: doc.id,
    quote,
    authorName,
    authorRole: text(doc.authorRole),
    rating,
    source: doc.source ?? 'direct',
    videoId,
    poster: asMedia(doc.video?.poster),
    durationLabel: text(doc.video?.durationLabel),
    metricValue: text(doc.metric?.value),
    metricLabel: text(doc.metric?.label),
    logo: client ? asMedia(client.logo) : null,
    clientName: client ? text(client.name) : null,
    studyHref,
  }
}

/* --------------------------------- icons -------------------------------- */
// Phosphor icons (MIT), the set the design uses: star-fill, bold video-camera,
// bold google-logo, bold play. Inline SVG: the repo carries no icon package.

const ICONS = {
  star: 'M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z',
  video:
    'M249.45,69.31a12,12,0,0,0-12.51,1L212,88.43V72a20,20,0,0,0-20-20H32A20,20,0,0,0,12,72V184a20,20,0,0,0,20,20H192a20,20,0,0,0,20-20V167.57l24.94,18.14A12,12,0,0,0,256,176V80A12,12,0,0,0,249.45,69.31ZM188,180H36V76H188Zm44-27.57-20-14.54V118.11l20-14.54Z',
  google:
    'M228,128a100,100,0,1,1-22.86-63.64,12,12,0,0,1-18.51,15.28A76,76,0,1,0,203.05,140H128a12,12,0,0,1,0-24h88A12,12,0,0,1,228,128Z',
  play: 'M234.49,111.07,90.41,22.94A20,20,0,0,0,60,39.87V216.13a20,20,0,0,0,30.41,16.93l144.08-88.13a19.82,19.82,0,0,0,0-33.86ZM84,208.85V47.15L216.16,128Z',
} as const

function Icon({ name, className }: { name: keyof typeof ICONS; className?: string }) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" className={className}>
      <path d={ICONS[name]} />
    </svg>
  )
}

/* --------------------------------- card --------------------------------- */

/** Stars + source tag row (design: space-between, 16px gap desktop / 10–12px mobile). */
function TopRow({ card, labels, isVideo }: { card: FeedCardData; labels: FeedLabels; isVideo: boolean }) {
  let tag: string | null = null
  let icon: keyof typeof ICONS | null = null
  if (isVideo) {
    tag = [text(labels.video), card.metricLabel].filter(Boolean).join(' · ') || null
    icon = 'video'
  } else if (card.source === 'google-review') {
    tag = text(labels.googleReview)
    icon = 'google'
  } else if (card.source === 'linkedin') {
    tag = text(labels.linkedin)
  }
  if (!card.rating && !tag) return null
  return (
    <div className="flex items-center justify-between gap-2.5 md:gap-4">
      {card.rating ? (
        <span role="img" aria-label={`${card.rating} out of 5 stars`} className="flex shrink-0 gap-0.5 text-accent-primary">
          {Array.from({ length: card.rating }, (_, i) => (
            <Icon key={i} name="star" className="size-4 md:size-4.5" />
          ))}
        </span>
      ) : (
        <span />
      )}
      {tag ? (
        <span className="text-right font-mono text-[10px] leading-[1.4] tracking-[0.1em] text-gray-warm uppercase md:text-[11px]">
          {icon ? <Icon name={icon} className="mr-1 inline-block size-[1.1em] align-[-0.2em]" /> : null}
          {tag}
        </span>
      ) : null}
    </div>
  )
}

function Caption({ card, withLogo }: { card: FeedCardData; withLogo: boolean }) {
  const logo = withLogo ? card.logo : null
  return (
    <figcaption className="mt-3 flex items-center gap-3 text-small-mobile font-bold md:mt-4.5 md:text-small">
      {logo ? <Media resource={logo} alt={card.clientName ?? logo.alt ?? ''} sizes="96px" className="h-6 w-auto shrink-0" /> : null}
      <span>
        {card.authorName}
        {card.authorRole ? <span className="font-medium text-gray-warm"> · {card.authorRole}</span> : null}
      </span>
    </figcaption>
  )
}

function StudyLink({ card, labels }: { card: FeedCardData; labels: FeedLabels }) {
  const label = text(labels.studyLink)
  if (!card.studyHref || !label) return null
  return (
    <div className="mt-4 md:mt-6">
      <Link href={card.studyHref} className={buttonClasses({ variant: 'ghost', size: 'md', className: 'w-full lg:w-auto' })}>
        {label}
      </Link>
    </div>
  )
}

/** Inline metric for a TEXT card (the design only shows metrics on video posters; kept so the field never silently disappears). */
function TextMetric({ card }: { card: FeedCardData }) {
  if (!card.metricValue) return null
  return (
    <p className="m-0 mt-3.5 flex flex-wrap items-center gap-2.5 md:mt-4.5">
      <span className="bg-accent-primary px-2.5 py-0.5 font-display text-[1.1rem] leading-[normal] text-on-accent md:px-3.5 md:py-1 md:text-[1.5rem]">
        {card.metricValue}
      </span>
      {card.metricLabel ? (
        <span className="font-mono text-[10px] tracking-[0.1em] text-gray-warm uppercase md:text-[11px]">{card.metricLabel}</span>
      ) : null}
    </p>
  )
}

/** Video card: poster (opens the YouTube video in a new tab) + the quote panel. `mirrored` puts the poster on the right at `lg`. */
function VideoCard({ card, labels, mirrored }: { card: FeedCardData; labels: FeedLabels; mirrored: boolean }) {
  const play = text(labels.play)
  return (
    <figure
      className={cx(
        'm-0 overflow-hidden border border-divider lg:grid',
        mirrored ? 'lg:grid-cols-[1fr_1.15fr]' : 'lg:grid-cols-[1.15fr_1fr]',
      )}
    >
      <VideoFacade
        videoId={card.videoId ?? ''}
        label={play ? `${play} ${card.authorName}` : `Play video: ${card.authorName}`}
        title={`Video testimonial from ${card.authorName}`}
        className={cx(
          'border-b border-divider bg-gray-light lg:border-b-0',
          mirrored ? 'lg:order-2 lg:border-l' : 'lg:border-r',
        )}
      >
        {/* 16:9 minimum; at lg the tile also stretches to a taller quote column (poster crops via object-cover). */}
        <span aria-hidden="true" className="block aspect-video" />
        {card.poster ? <Media resource={card.poster} fill alt="" sizes="(min-width: 1024px) 640px, 100vw" /> : null}
        <span className="absolute top-1/2 left-1/2 grid size-13 -translate-1/2 place-items-center bg-ink text-cream transition-transform duration-180 ease-out group-hover:scale-105 md:size-16">
          <Icon name="play" className="size-5 md:size-6" />
        </span>
        {card.metricValue ? (
          <span className="absolute top-2.5 right-2.5 bg-accent-primary px-2.5 py-0.5 font-display text-[1.1rem] leading-[normal] text-on-accent md:top-3.5 md:right-3.5 md:px-3.5 md:py-1 md:text-[1.5rem]">
            {card.metricValue}
          </span>
        ) : null}
        {card.durationLabel ? (
          <span className="absolute right-2.5 bottom-2.5 bg-ink px-2 py-0.5 font-mono text-[11px] text-cream md:right-3.5 md:bottom-3.5">
            {card.durationLabel}
          </span>
        ) : null}
      </VideoFacade>
      <div className={cx('flex flex-col justify-center px-5 pt-4.5 pb-5 md:px-9 md:py-8', mirrored && 'lg:order-1')}>
        <TopRow card={card} labels={labels} isVideo />
        <blockquote className="m-0 mt-3.5 text-[1.0625rem] leading-normal font-medium text-pretty md:mt-5 md:text-[1.375rem] md:leading-[1.45]">
          {card.quote}
        </blockquote>
        <Caption card={card} withLogo />
        <StudyLink card={card} labels={labels} />
      </div>
    </figure>
  )
}

/** Text card: written quote, Google or LinkedIn review. */
export function TextCard({ card, labels, compact = false }: { card: FeedCardData; labels: FeedLabels; compact?: boolean }) {
  return (
    <figure className={cx('m-0 h-full border border-divider', compact ? 'p-5.5 md:p-6' : 'p-5.5 md:px-9 md:py-8')}>
      <TopRow card={card} labels={labels} isVideo={false} />
      <blockquote
        className={cx(
          'm-0 mt-3.5 text-[1.0625rem] leading-normal font-medium text-pretty',
          compact ? 'md:mt-4 md:text-[1.0625rem] md:leading-[1.5]' : 'md:mt-5 md:text-[1.25rem] md:leading-[1.45]',
        )}
      >
        {card.quote}
      </blockquote>
      <TextMetric card={card} />
      <Caption card={card} withLogo={false} />
      <StudyLink card={card} labels={labels} />
    </figure>
  )
}

export const FEED_LIST = 'm-0 grid list-none gap-3.5 p-0 md:gap-6 lg:grid-cols-2'

/** Per card: is the poster mirrored (video) / does an unpaired text card span the row. Pure, computed before render. */
function layoutOf(cards: FeedCardData[]): { mirrored: boolean; lone: boolean }[] {
  const out: { mirrored: boolean; lone: boolean }[] = []
  let videos = 0
  let run = 0
  cards.forEach((card, i) => {
    if (card.videoId) {
      run = 0
      out.push({ mirrored: videos++ % 2 === 1, lone: false })
      return
    }
    run++
    const next = cards[i + 1]
    out.push({ mirrored: false, lone: run % 2 === 1 && (!next || Boolean(next.videoId)) })
  })
  return out
}

/**
 * The feed items in DOM (= reading) order. Video cards span the row and
 * alternate poster side (design: Alvarez left, Okafor mirrored, Patel left).
 * Consecutive text cards pair two-up at `lg`; an unpaired one spans the row.
 */
export function FeedItems({
  cards,
  labels,
  focusIndex,
  focusRef,
}: {
  cards: FeedCardData[]
  labels: FeedLabels
  focusIndex?: number | null
  focusRef?: React.Ref<HTMLLIElement>
}) {
  const layout = layoutOf(cards)
  return (
    <>
      {cards.map((card, i) => {
        const focusProps = i === focusIndex ? { ref: focusRef, tabIndex: -1 } : {}
        const { mirrored, lone } = layout[i]
        return (
          <li key={card.id} className={cx((card.videoId || lone) && 'lg:col-span-2', 'focus:outline-none')} {...focusProps}>
            {card.videoId ? <VideoCard card={card} labels={labels} mirrored={mirrored} /> : <TextCard card={card} labels={labels} />}
          </li>
        )
      })}
    </>
  )
}
