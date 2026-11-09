import Link from 'next/link'
import React from 'react'

import { AccentHeadline, ArrowText, Media } from '@/components/ui'
import { serviceLabels } from '@/lib/caseStudyServices'
import { cx } from '@/lib/cx'
import { docPath } from '@/lib/docPath'
import type { CaseStudy, Media as MediaDoc } from '@/payload-types'

/**
 * The one way a case study is previewed anywhere on the site (owner,
 * 2026-11-08: "it's not clear what is going on"). Every preview shows, in
 * this order: the finished store (desktop screenshot in a browser frame, the
 * phone screenshot beside it), the client and the services delivered, the
 * study headline, one sentence of what was made (`cardSummary`), the labelled
 * facts (brochure p6: label, value, context), then "Read the case study" and
 * the live store link. The headline metric is NOT shown here: a lone number
 * with a unit ("30+ HOURS") read as a result it is not.
 *
 * Sizes: `feature` (the Work page: screens left, text right, facts panel
 * below), `row` (a proof pull with one study: screens left, text right,
 * facts inline) and `card` (2–3 studies side by side: screens on top).
 *
 * Never falls back to `heroMedia`: without store screenshots the preview is
 * text only, so a placeholder can never pose as the store.
 * Server component, no client JS.
 */

export type StudyPreviewSize = 'feature' | 'row' | 'card'
export type StudyFact = NonNullable<CaseStudy['facts']>[number]

const SMALL_LABEL = 'text-[11px] font-bold uppercase tracking-[0.12em] text-gray-warm'

/** A populated media doc with a file, else null (id-only relations render nothing). */
const mediaDoc = (m: unknown): MediaDoc | null =>
  m && typeof m === 'object' && typeof (m as MediaDoc).url === 'string' ? (m as MediaDoc) : null

export const studyScreens = (study: Pick<CaseStudy, 'screens'>): { desktop: MediaDoc | null; mobile: MediaDoc | null } => ({
  desktop: mediaDoc(study.screens?.desktop),
  mobile: mediaDoc(study.screens?.mobile),
})

const clientOf = (study: Pick<CaseStudy, 'client'>) =>
  typeof study.client === 'object' && study.client !== null ? study.client : null

/** "Abu Oud", "Brand · Design · Custom Shopify build" (each part only when present). */
export const studyKicker = (study: Pick<CaseStudy, 'client' | 'services'>): { client: string | null; services: string | null } => {
  const services = serviceLabels(study.services).join(' · ')
  return { client: clientOf(study)?.name?.trim() || null, services: services || null }
}

/** The client's live store as a link target + its bare host for the label ("abuoud.net"). */
export const studySite = (study: Pick<CaseStudy, 'client'>): { href: string; host: string } | null => {
  const url = clientOf(study)?.website?.trim()
  if (!url) return null
  try {
    const u = new URL(url)
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null
    return { href: u.toString(), host: u.hostname.replace(/^www\./, '') }
  } catch {
    return null
  }
}

/** Facts with both a label and a value, at most three. */
export const usableFacts = (facts: CaseStudy['facts']): StudyFact[] =>
  (facts ?? []).filter((f) => f?.label?.trim() && f?.value?.trim()).slice(0, 3)

/* --------------------------------- screens -------------------------------- */

/**
 * The desktop screenshot in the site's browser frame (2px ink, hard 6px
 * shadow, the ArticleHero `browser` frame) with the phone screenshot
 * overlapping its lower-right corner. The phone column is reserved inside the
 * wrapper (desktop 86% wide, wrapper padded below), so nothing overflows the
 * container. Without a desktop shot the phone shows alone, centred.
 */
export function StudyScreens({
  desktop,
  mobile,
  sizes,
  preload = false,
  compact = false,
}: {
  desktop: MediaDoc | null
  mobile: MediaDoc | null
  /** `sizes` of the desktop shot; the phone is about a fifth of it. */
  sizes: string
  preload?: boolean
  /** Smaller browser bar (row and card sizes). */
  compact?: boolean
}) {
  if (!desktop && !mobile) return null
  const phone = mobile ? (
    <div
      className={cx(
        'border-2 border-ink bg-ink shadow-[4px_4px_0_#111]',
        desktop ? 'absolute right-0 bottom-0 z-10 w-[22%]' : 'mx-auto w-2/5 max-w-60',
      )}
    >
      <div className="relative aspect-[390/844] w-full">
        <Media resource={mobile} fill preload={preload} sizes="(min-width: 768px) 240px, 25vw" className="object-cover object-top" />
      </div>
    </div>
  ) : null
  if (!desktop) return phone

  return (
    <div className={cx('relative', mobile && 'pb-[6%]')}>
      <div className={cx('border-2 border-ink bg-cream shadow-[6px_6px_0_#111]', mobile ? 'w-[86%]' : 'w-full')}>
        <div
          aria-hidden="true"
          className={cx(
            'flex items-center border-b-2 border-ink bg-gray-light',
            compact ? 'h-6 gap-1.5 px-2.5 md:h-7' : 'h-7 gap-1.5 px-2.5 md:h-9 md:gap-2 md:px-3',
          )}
        >
          {[0, 1, 2].map((i) => (
            <span key={i} className={cx('rounded-badge border-[1.5px] border-ink', compact ? 'size-2' : 'size-2 md:size-2.5')} />
          ))}
        </div>
        <div className="relative aspect-[16/10] w-full">
          <Media resource={desktop} fill preload={preload} sizes={sizes} className="object-cover object-top" />
        </div>
      </div>
      {phone}
    </div>
  )
}

/* ---------------------------------- facts --------------------------------- */

/** "12 → 50+" (before in ink, the arrow quiet, the value in wine when `accent`). */
function FactValue({ fact }: { fact: StudyFact }) {
  const before = fact.before?.trim()
  return (
    <>
      {before ? (
        <>
          {before}
          <span aria-hidden="true" className="mx-[0.15em] align-middle text-[0.5em] text-gray-warm">
            →
          </span>
          <span className="sr-only"> to </span>
        </>
      ) : null}
      <span className={fact.accent ? 'text-ground-accent' : undefined}>{fact.value}</span>
    </>
  )
}

/**
 * The facts. `panel`: the brochure p6 grey strip, three equal cells (label,
 * big value, context) from 640px, stacked below. `inline`: a compact ruled list for
 * previews (label above value, context only when `withContext`).
 */
export function StudyFacts({
  facts,
  variant,
  withContext = false,
  align = 'start',
  className,
}: {
  facts: StudyFact[]
  variant: 'panel' | 'inline'
  withContext?: boolean
  /** `inline` only: `center` = equal columns with label and number centred. */
  align?: 'start' | 'center'
  className?: string
}) {
  if (facts.length === 0) return null
  if (variant === 'panel') {
    const cols = facts.length === 1 ? '' : facts.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'
    return (
      <dl className={cx('m-0 grid grid-cols-1 bg-gray-light', cols, className)}>
        {facts.map((f, i) => (
          <div
            key={f.id ?? i}
            className={cx(
              'flex flex-col gap-2.5 px-5 py-5.5 md:gap-3 md:px-6.5 md:py-7',
              i > 0 && 'border-t border-divider sm:border-t-0 sm:border-l',
            )}
          >
            <dt className={SMALL_LABEL}>{f.label}</dt>
            <dd className="m-0 font-display text-[2.5rem] leading-none sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem]">
              <FactValue fact={f} />
            </dd>
            {f.context?.trim() ? (
              <dd className="m-0 max-w-[36ch] whitespace-pre-line text-small-mobile leading-[1.55] md:text-small">{f.context}</dd>
            ) : null}
          </div>
        ))}
      </dl>
    )
  }
  if (align === 'center') {
    return (
      <dl className={cx('m-0 grid border-t border-divider pt-4 text-center', facts.length === 1 ? 'grid-cols-1' : facts.length === 2 ? 'grid-cols-2' : 'grid-cols-3', 'gap-x-3 gap-y-4 md:gap-x-6', className)}>
        {facts.map((f, i) => (
          <div key={f.id ?? i} className="flex min-w-0 flex-col items-center gap-1">
            <dt className="flex flex-1 items-end justify-center text-[10px] font-bold uppercase tracking-[0.12em] text-gray-warm">{f.label}</dt>
            <dd className="m-0 font-display text-[1.25rem] leading-none md:text-[1.75rem]">
              <FactValue fact={f} />
            </dd>
            {withContext && f.context?.trim() ? (
              <dd className="m-0 text-small-mobile leading-[1.5] text-gray-warm">{f.context}</dd>
            ) : null}
          </div>
        ))}
      </dl>
    )
  }
  return (
    // Flex-wrap, not fixed columns: a fact keeps its natural width and wraps to the next line
    // instead of running into its neighbour in a narrow card ("12 → 50+" is wider than a third).
    <dl className={cx('m-0 flex flex-wrap gap-x-8 gap-y-4 border-t border-divider pt-4 md:gap-x-10', className)}>
      {facts.map((f, i) => (
        <div key={f.id ?? i} className="flex flex-col gap-1">
          <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-warm">{f.label}</dt>
          <dd className="m-0 font-display text-[1.5rem] leading-none whitespace-nowrap md:text-[1.75rem]">
            <FactValue fact={f} />
          </dd>
          {withContext && f.context?.trim() ? (
            <dd className="m-0 text-small-mobile leading-[1.5] text-gray-warm">{f.context}</dd>
          ) : null}
        </div>
      ))}
    </dl>
  )
}

/* --------------------------------- preview -------------------------------- */

const withArrow = (label: string): string => (/[→↗]\s*$/u.test(label) ? label : `${label} →`)

/** "Read the case study →" + "abuoud.net ↗" (new tab), each with a 44px hit area. */
function StudyLinks({ href, label, client, site }: { href: string | null; label: string; client: string | null; site: { href: string; host: string } | null }) {
  if (!href && !site) return null
  return (
    <div className="flex flex-wrap items-center gap-x-7 gap-y-1">
      {href && label ? (
        <Link href={href} className="inline-flex min-h-target items-center text-small font-bold text-ink no-underline">
          <span className="ix-rule pb-0.5">
            <ArrowText text={withArrow(label)} />
            {client ? <span className="sr-only">: {client}</span> : null}
          </span>
        </Link>
      ) : null}
      {site ? (
        <a
          href={site.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-target items-center text-small font-bold text-gray-warm no-underline hover:text-ink"
        >
          <span className="ix-rule pb-0.5">
            <ArrowText text={`${site.host} ↗`} />
            <span className="sr-only"> (opens in a new tab)</span>
          </span>
        </a>
      ) : null}
    </div>
  )
}

/** Client (ink) · services (grey), the small line above the headline. */
export function StudyKicker({ study, className }: { study: Pick<CaseStudy, 'client' | 'services'>; className?: string }) {
  const { client, services } = studyKicker(study)
  if (!client && !services) return null
  return (
    <p className={cx(SMALL_LABEL, className)}>
      {client ? <span className="text-ink">{client}</span> : null}
      {client && services ? <span aria-hidden="true"> · </span> : null}
      {services ? <span>{client ? <span className="sr-only">, </span> : null}{services}</span> : null}
    </p>
  )
}

export function StudyPreview({
  study,
  size,
  linkLabel,
  headingAs = 'h3',
  label,
  factsAlign = 'start',
  preload = false,
}: {
  study: CaseStudy
  size: StudyPreviewSize
  linkLabel: string
  /** The study title's element: `h2` when the section has no heading of its own. */
  headingAs?: 'h2' | 'h3'
  /** Optional small label above everything (e.g. "A study in full"). */
  label?: string | null
  /** `center`: the inline facts (row / card) render as equal centred columns. */
  factsAlign?: 'start' | 'center'
  preload?: boolean
}) {
  const href = docPath('case-studies', study)
  const { desktop, mobile } = studyScreens(study)
  const hasScreens = Boolean(desktop || mobile)
  const facts = usableFacts(study.facts)
  const site = studySite(study)
  const client = studyKicker(study).client
  const summary = study.cardSummary?.trim()

  const screensSizes =
    size === 'feature'
      ? '(min-width: 1024px) 620px, 100vw'
      : size === 'row'
        ? '(min-width: 768px) 460px, 100vw'
        : '(min-width: 768px) 520px, 100vw'

  // The screenshots link to the study too (a big target), hidden from the
  // accessibility tree and the tab order: the text link below is the real one.
  const screens = hasScreens ? (
    href ? (
      <Link href={href} aria-hidden="true" tabIndex={-1} className="block">
        <StudyScreens desktop={desktop} mobile={mobile} sizes={screensSizes} preload={preload} compact={size !== 'feature'} />
      </Link>
    ) : (
      <StudyScreens desktop={desktop} mobile={mobile} sizes={screensSizes} preload={preload} compact={size !== 'feature'} />
    )
  ) : null

  const text = (
    <div className="flex min-w-0 flex-col gap-3.5 md:gap-4">
      <StudyKicker study={study} />
      <AccentHeadline
        text={study.title}
        accent={study.accentPhrase}
        as={headingAs}
        level={3}
        accentColor="ground"
        className={size === 'feature' ? 'lg:!text-[2.25rem] lg:!leading-[1.05]' : undefined}
      />
      {summary ? (
        <p className={cx('m-0 max-w-[60ch] whitespace-pre-line', size === 'feature' ? 'text-body-mobile md:text-body' : 'text-[0.9375rem] leading-[1.6] md:text-base')}>
          {summary}
        </p>
      ) : null}
      {size !== 'feature' ? <StudyFacts facts={size === 'card' ? facts.slice(0, 2) : facts} variant="inline" align={factsAlign} className="mt-1" /> : null}
      <StudyLinks href={href} label={linkLabel} client={client} site={site} />
    </div>
  )

  const top = label?.trim() ? <p className={cx(SMALL_LABEL, 'mb-4 md:mb-5')}>{label}</p> : null

  if (size === 'feature') {
    return (
      <article>
        {top}
        <div className={cx('grid grid-cols-1 gap-8 md:gap-10', hasScreens && 'lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-14')}>
          {screens}
          {text}
        </div>
        <StudyFacts facts={facts} variant="panel" className="mt-9 md:mt-12" />
      </article>
    )
  }

  if (size === 'row') {
    return (
      <article>
        {top}
        <div className={cx('grid grid-cols-1 gap-7', hasScreens && 'md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-center md:gap-10 lg:gap-14')}>
          {screens}
          {text}
        </div>
      </article>
    )
  }

  return (
    <article className="flex flex-col gap-6">
      {top}
      {screens}
      {text}
    </article>
  )
}
