import React from 'react'

import type { BlockData } from '@/blocks/types'
import { AccentHeadline, DotMatrix, Eyebrow, Media, Section } from '@/components/ui'
import { cx } from '@/lib/cx'

import { Breadcrumb } from './Breadcrumb'
import { LOGO_MASK } from './logoMask'

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
const DATE_RE = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.? (?:(\d{1,2}),? )?(\d{4})\b/

/**
 * The meta line is plain text; wrap a recognised date ("Feb 2026", "Feb 12, 2026")
 * in a machine-readable <time>. Placeholders / unrecognised text stay plain.
 */
function MetaText({ text }: { text: string }) {
  const m = DATE_RE.exec(text)
  if (!m) return <>{text}</>
  const month = String(MONTHS.indexOf(m[1].toLowerCase()) + 1).padStart(2, '0')
  const dateTime = m[2] ? `${m[3]}-${month}-${m[2].padStart(2, '0')}` : `${m[3]}-${month}`
  return (
    <>
      {text.slice(0, m.index)}
      <time dateTime={dateTime}>{m[0]}</time>
      {text.slice(m.index + m[0].length)}
    </>
  )
}

/**
 * Hero, `article` variant (Case Study.dc.html "Article header", desktop +
 * mobile builds): 820px column on the dot-matrix ground with the wine logo
 * shape, breadcrumb, h1, a meta rule (left = `body`, right = `metaLine`) and
 * the grey summary box. `standfirst` (p13/p14 post `dek`) sits between the
 * h1 and the meta rule. SCHEMA R2 additions with no design source: the
 * oversized `resultMetric` under the headline and the lead image under the
 * header (`browser` frame, `full-bleed`, or plain). In the case-study template
 * every prop is fed from the study document (see the dev docs mapping).
 * Server component. The only h1.
 */
export function ArticleHero({
  eyebrow,
  eyebrowTick,
  heading,
  accentPhrase,
  body,
  standfirst,
  breadcrumb,
  geometry,
  resultMetric,
  metaLine,
  summary,
  stats,
  media,
  mediaFrame,
}: BlockData<'hero'>) {
  const scope = body?.trim()
  const dek = standfirst?.trim()
  const meta = metaLine?.trim()
  const summaryBody = summary?.body?.trim()
  const metricValue = resultMetric?.value?.trim()
  const hasMedia = typeof media === 'object' && media !== null && Boolean(media.url)
  const frame = mediaFrame ?? 'none'
  const figures = stats ?? []

  return (
    <Section tone="light" pad="none" className="relative overflow-hidden pt-9 md:pt-18">
      <DotMatrix fade="corner" />
      {geometry !== false ? (
        <div
          aria-hidden="true"
          style={LOGO_MASK}
          className="pointer-events-none absolute -right-25 -top-12.5 z-0 size-52.5 bg-ground-accent md:-right-40 md:-top-20 md:size-85"
        />
      ) : null}
      <div className="relative z-10 mx-auto max-w-205 px-container-mobile md:px-container">
        {breadcrumb?.length ? <Breadcrumb items={breadcrumb} tone="light" /> : null}
        {eyebrow ? (
          <Eyebrow tick={eyebrowTick !== false} className="mt-4">
            {eyebrow}
          </Eyebrow>
        ) : null}
        <AccentHeadline
          text={heading}
          accent={accentPhrase}
          level={1}
          as="h1"
          accentColor="ground"
          className="mt-3.5 max-md:!text-[2.125rem] max-md:!leading-[.98] md:mt-5"
        />
        {dek ? (
          // DEV-SEO / MKT-SEO Article.dc.html "Article header": the dek between the h1 and the meta rule
          <p className="mt-4 text-[1.0625rem] leading-[1.55] whitespace-pre-line md:mt-5 md:max-w-[62ch] md:text-[1.1875rem]">{dek}</p>
        ) : null}
        {metricValue ? (
          <div className="mt-6 md:mt-8">
            <p className={cx('font-display text-metric-mobile md:text-metric', resultMetric?.accent ? 'text-ground-accent' : 'text-ink')}>
              {metricValue}
            </p>
            {resultMetric?.label ? <p className="mt-2 text-label uppercase text-gray-warm">{resultMetric.label}</p> : null}
            {resultMetric?.sub ? <p className="mt-1 text-small-mobile text-gray-warm md:text-small">{resultMetric.sub}</p> : null}
          </div>
        ) : null}
        {scope || meta ? (
          <div className="mt-5 flex flex-col gap-1 border-y border-divider py-3 md:mt-7 md:flex-row md:flex-wrap md:items-baseline md:justify-between md:gap-4 md:py-3.5">
            {scope ? <span className="text-small-mobile font-bold md:text-[0.9375rem]">{scope}</span> : null}
            {meta ? <span className="text-small-mobile text-gray-warm md:text-small"><MetaText text={meta} /></span> : null}
          </div>
        ) : null}
        {summaryBody ? (
          <div className="mt-5 bg-gray-light px-4.5 py-4 md:mt-6 md:max-w-[64ch] md:px-5.5 md:py-4.5">
            {summary?.label ? (
              <p className="text-[11px] font-bold uppercase tracking-eyebrow text-gray-warm md:text-xs">{summary.label}</p>
            ) : null}
            <p className={cx('text-[0.9375rem] leading-[1.6] whitespace-pre-line', summary?.label && 'mt-2')}>{summaryBody}</p>
          </div>
        ) : null}
        {figures.length > 0 ? (
          <dl className="mt-7 flex flex-wrap gap-x-6 gap-y-4 border-y border-t-2 border-divider border-t-ink py-4 md:mt-10 md:gap-x-10 md:gap-y-5 md:py-[18px]">
            {figures.map((f, i) => (
              <div key={f.id ?? i} className="min-w-[130px] flex-[1_1_130px]">
                <dt className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-warm">{f.label}</dt>
                <dd className="mt-1 font-display text-base uppercase md:mt-1.5 md:text-lg">{f.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
      {hasMedia && frame === 'full-bleed' ? (
        <div className="relative z-10 mt-8 aspect-[4/3] w-full md:mt-12 md:aspect-[21/9]">
          <Media resource={media} fill preload sizes="100vw" />
        </div>
      ) : null}
      {hasMedia && frame !== 'full-bleed' ? (
        <div className="relative z-10 mx-auto mt-8 w-full max-w-site px-container-mobile pb-8 md:mt-12 md:px-container md:pb-12">
          {frame === 'browser' ? (
            <div className="border-2 border-ink bg-cream shadow-[6px_6px_0_#111]">
              <div aria-hidden="true" className="flex h-9 items-center gap-2 border-b-2 border-ink bg-gray-light px-3">
                <span className="size-2.5 rounded-badge border-[1.5px] border-ink" />
                <span className="size-2.5 rounded-badge border-[1.5px] border-ink" />
                <span className="size-2.5 rounded-badge border-[1.5px] border-ink" />
              </div>
              <div className="relative aspect-[16/10] w-full">
                <Media resource={media} fill preload sizes="(min-width: 1200px) 1152px, 100vw" />
              </div>
            </div>
          ) : (
            <div className="relative aspect-[16/10] w-full shadow-ring">
              <Media resource={media} fill preload sizes="(min-width: 1200px) 1152px, 100vw" />
            </div>
          )}
        </div>
      ) : null}
    </Section>
  )
}
