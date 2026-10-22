import config from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import type { BlockData } from '@/blocks/types'
import { AccentHeadline, CMSLink, Container, Eyebrow, Media, Section } from '@/components/ui'
import { cx } from '@/lib/cx'
import type { CaseStudy, Client } from '@/payload-types'

type CaseStudyCardsProps = BlockData<'caseStudyCards'>

const clampLimit = (n: number | null | undefined): number => Math.min(3, Math.max(1, Math.round(n ?? 3)))

/**
 * Published studies only (CLAUDE.md rule 1 / SCHEMA §5). Manual picks that
 * arrive as bare ids (unpublished or unreadable: relationship population runs
 * through access) or as a non-published object are dropped. Automatic sources
 * query with `draft: false`, `overrideAccess: false` and an explicit
 * `_status` filter. A failed read is logged and degrades to the fallback.
 */
async function loadStudies(
  source: CaseStudyCardsProps['source'],
  picks: CaseStudyCardsProps['caseStudies'],
  limit: number,
): Promise<CaseStudy[]> {
  if (source === 'manual') {
    return (picks ?? [])
      .filter((s): s is CaseStudy => typeof s === 'object' && s !== null && s._status === 'published')
      .slice(0, limit)
  }
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'case-studies',
      draft: false,
      overrideAccess: false,
      depth: 1,
      limit,
      sort: '-publishedAt',
      where: {
        and: [
          { _status: { equals: 'published' } },
          ...(source === 'latest' ? [] : [{ featured: { equals: true } }]),
        ],
      },
    })
    return docs.filter((d) => d._status === 'published')
  } catch (error) {
    console.error('[CaseStudyCards] could not load published case studies; rendering the fallback state', error)
    return []
  }
}

/**
 * CaseStudyCards, `cards` layout (Homepage.dc.html "Featured case studies",
 * desktop + mobile builds). Async server component: reads published studies
 * through the Local API; no interactivity (hover is CSS).
 *
 * Fallback modes derive from the design's `csFallback` branch (ledger of
 * label/value rows) with the Work.dc.html ledger grammar; the design's
 * ledger rows were prices, which CLAUDE.md rule 5 forbids as a block, so
 * rows are editable `metricFields` and any price is the small `pricingNote`.
 */
export async function CaseStudyCardsBlock({
  eyebrow,
  eyebrowTick,
  heading,
  accentPhrase,
  source,
  caseStudies,
  limit,
  cardLinkLabel,
  allLink,
  fallbackMode,
  fallbackEyebrow,
  fallbackHeading,
  fallbackAccentPhrase,
  fallbackBody,
  fallbackMetrics,
  pricingNote,
}: CaseStudyCardsProps) {
  const studies = await loadStudies(source ?? 'featured', caseStudies, clampLimit(limit))

  if (studies.length > 0) {
    const cols = studies.length === 1 ? 'md:grid-cols-1' : studies.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'
    return (
      <Section tone="light">
        <Container>
          {eyebrow ? (
            <Eyebrow tick={eyebrowTick !== false} className="mb-4.5">
              {eyebrow}
            </Eyebrow>
          ) : null}
          {heading ? <AccentHeadline text={heading} accent={accentPhrase} level="section" /> : null}
          <ul className={cx('m-0 grid list-none grid-cols-1 items-start gap-4 p-0 pt-7 md:gap-5 md:pt-9', cols)}>
            {studies.map((study) => (
              <li key={study.id}>
                <StudyCard study={study} linkLabel={cardLinkLabel?.trim() || 'Read the case study'} />
              </li>
            ))}
          </ul>
          <CMSLink
            link={allLink}
            className="mt-8 inline-flex min-h-target items-center border-b-2 border-ink text-small font-bold"
          />
        </Container>
      </Section>
    )
  }

  const metrics = (fallbackMetrics ?? []).slice(0, 3)
  const showLedger = (fallbackMode ?? 'ledger') === 'ledger' && metrics.length > 0
  const note = pricingNote?.trim()

  return (
    <Section tone="light">
      <Container>
        <div className={cx('grid grid-cols-1 items-start gap-6', showLedger && 'md:grid-cols-2 md:gap-16')}>
          <div>
            {fallbackEyebrow ? (
              <Eyebrow muted>
                {fallbackEyebrow}
              </Eyebrow>
            ) : null}
            {fallbackHeading ? (
              <AccentHeadline
                text={fallbackHeading}
                accent={fallbackAccentPhrase}
                level="section"
                accentColor="primary"
                className="mt-3.5 md:mt-4.5"
              />
            ) : null}
            {fallbackBody ? (
              <p className="mt-3.5 max-w-[44ch] text-body-mobile text-gray-warm md:mt-5 md:text-body">{fallbackBody}</p>
            ) : null}
            {!showLedger && note ? <p className="mt-3 text-small-mobile text-gray-warm md:text-small">{note}</p> : null}
          </div>
          {showLedger ? (
            <div>
              <dl className="m-0 border-2 border-ink">
                {metrics.map((row, i) => (
                  <div
                    key={row.id ?? i}
                    className={cx(
                      'flex items-baseline justify-between gap-4 px-4.5 py-4 md:gap-6 md:px-6.5 md:py-5.5',
                      i < metrics.length - 1 && 'border-b border-divider',
                    )}
                  >
                    <dt className="text-[0.9375rem] font-bold uppercase tracking-[0.04em]">
                      {row.label}
                      {row.sub ? (
                        <span className="mt-1 block text-small-mobile font-medium normal-case tracking-normal text-gray-warm md:text-small">
                          {row.sub}
                        </span>
                      ) : null}
                    </dt>
                    <dd
                      className={cx(
                        'm-0 shrink-0 font-display text-[1.75rem] md:text-[2.25rem]',
                        row.accent ? 'text-ground-accent' : 'text-ink',
                      )}
                    >
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
              {note ? <p className="mt-3 text-small-mobile text-gray-warm md:text-small">{note}</p> : null}
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  )
}

/** DS CaseStudyCard (CaseStudyCard.jsx): gray card, 16:9 ink media, metric, summary, underlined link. */
function StudyCard({ study, linkLabel }: { study: CaseStudy; linkLabel: string }) {
  const client = typeof study.client === 'object' && study.client !== null ? (study.client as Client).name : null
  const metric = study.headlineMetric
  const hero = typeof study.heroMedia === 'object' ? study.heroMedia : null
  const href = study.slug ? `/work/${study.slug}` : null

  const body = (
    <>
      <div className="relative aspect-video overflow-hidden bg-ink">
        {hero ? <Media resource={hero} fill sizes="(min-width: 768px) 33vw, 100vw" alt={hero.alt} /> : null}
      </div>
      <div className="p-5">
        {client ? (
          <span className="text-label uppercase tracking-eyebrow text-gray-warm">{client}</span>
        ) : null}
        {metric?.value ? (
          <span className="mt-2 block font-display text-[2.5rem] leading-[1.05] text-accent-primary">{metric.value}</span>
        ) : null}
        {metric?.label ? (
          <span className="mt-1 block text-small font-bold uppercase tracking-[0.04em]">{metric.label}</span>
        ) : null}
        {study.cardSummary ? <p className="mt-2.5 text-[0.9375rem] leading-normal">{study.cardSummary}</p> : null}
        {href ? (
          <span className="mt-3.5 inline-block border-b-2 border-ink text-small font-bold">{linkLabel}</span>
        ) : null}
      </div>
    </>
  )

  const cls =
    'flex flex-col bg-gray-light text-ink no-underline transition-[box-shadow,transform] duration-180 ease-out hover:-translate-y-1 hover:shadow-lift'
  return href ? (
    <Link href={href} className={cls}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  )
}
