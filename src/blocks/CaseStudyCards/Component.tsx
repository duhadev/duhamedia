import config from '@payload-config'
import Link from 'next/link'
import { getPayload, type Where } from 'payload'
import React from 'react'

import type { BlockData } from '@/blocks/types'
import { AccentHeadline, ArrowText, CMSLink, Container, Eyebrow, Media, Section } from '@/components/ui'
import { resolveLinkHref } from '@/components/ui/CMSLink'
import { cx } from '@/lib/cx'
import { docPath } from '@/lib/docPath'
import type { CaseStudy, Client, Testimonial } from '@/payload-types'

import { LEDGER_COLS, LEDGER_LIST, LedgerRow, toLedgerRow, type LedgerRowLabels } from './ledger'
import { LedgerLoadMore } from './LoadMore'

type CaseStudyCardsData = BlockData<'caseStudyCards'>

/**
 * The study being read, passed by the case-study template (p2 §Next study) to
 * the `next-link` layout. Not a block field: it is page context, not content.
 */
export type CurrentStudy = Pick<CaseStudy, 'id'> & Partial<Pick<CaseStudy, 'studyNumber' | 'publishedAt'>>

type CaseStudyCardsProps = CaseStudyCardsData & { currentStudy?: CurrentStudy | null }

const clampLimit = (n: number | null | undefined): number => Math.min(3, Math.max(1, Math.round(n ?? 3)))
const clampPageSize = (n: number | null | undefined): number => Math.min(24, Math.max(1, Math.round(n ?? 6)))

const PUBLISHED: Where = { _status: { equals: 'published' } }

/**
 * The `where` for an automatic source (published only, twice over: this
 * filter plus `overrideAccess: false` / public REST access). `null` = the
 * source cannot match anything (track source with no type ticked).
 */
function sourceWhere(source: CaseStudyCardsData['source'], track: CaseStudyCardsData['track']): Where | null {
  if (source === 'latest') return { and: [PUBLISHED] }
  if (source === 'track') {
    const tracks = (track ?? []).filter(Boolean)
    if (tracks.length === 0) {
      console.error('[CaseStudyCards] source "track" has no engagement type ticked; rendering the fallback state')
      return null
    }
    return { and: [PUBLISHED, { track: { in: tracks } }] }
  }
  return { and: [PUBLISHED, { featured: { equals: true } }] }
}

/**
 * Published studies only (CLAUDE.md rule 1 / SCHEMA §5). Manual picks that
 * arrive as bare ids (unpublished or unreadable: relationship population runs
 * through access) or as a non-published object are dropped. Automatic sources
 * query with `draft: false`, `overrideAccess: false` and an explicit
 * `_status` filter. A failed read is logged and degrades to the fallback.
 * (`cards` layout; its featured/latest/manual behaviour is unchanged from B3.)
 */
async function loadStudies(
  source: CaseStudyCardsData['source'],
  picks: CaseStudyCardsData['caseStudies'],
  limit: number,
  track: CaseStudyCardsData['track'],
): Promise<CaseStudy[]> {
  if (source === 'manual') {
    return (picks ?? [])
      .filter((s): s is CaseStudy => typeof s === 'object' && s !== null && s._status === 'published')
      .slice(0, limit)
  }
  const where = sourceWhere(source, track)
  if (!where) return []
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'case-studies',
      draft: false,
      overrideAccess: false,
      depth: 1,
      limit,
      sort: '-publishedAt',
      where,
    })
    return docs.filter((d) => d._status === 'published')
  } catch (error) {
    console.error('[CaseStudyCards] could not load published case studies; rendering the fallback state', error)
    return []
  }
}

/**
 * Manual picks for `ledger` / `next-link`, in the editor's order. A picked
 * study populated by a page arrives trimmed to the collection's
 * `defaultPopulate` (no `studyNumber` / `engagementLine`, possibly no
 * `_status`) or as a bare id, so anything that is not a complete published
 * object is re-read by id (published only). Complete published objects (the
 * showcase's static fixtures) are used as they are; drafts are dropped.
 */
async function resolvePicks(picks: CaseStudyCardsData['caseStudies']): Promise<CaseStudy[]> {
  const items = (picks ?? []).filter((s) => s !== null && s !== undefined)
  const complete = (s: number | CaseStudy): boolean =>
    typeof s === 'object' && s._status === 'published' && 'studyNumber' in s
  const ids = items
    .filter((s) => !complete(s) && (typeof s === 'number' || s._status !== 'draft'))
    .map((s) => (typeof s === 'number' ? s : s.id))
  let fetched: CaseStudy[] = []
  if (ids.length) {
    try {
      const payload = await getPayload({ config })
      fetched = (
        await payload.find({
          collection: 'case-studies',
          draft: false,
          overrideAccess: false,
          depth: 1,
          limit: ids.length,
          pagination: false,
          where: { and: [PUBLISHED, { id: { in: ids } }] },
        })
      ).docs
    } catch (error) {
      console.error('[CaseStudyCards] could not load the picked case studies; skipping them', error)
    }
  }
  return items.flatMap((s) => {
    if (typeof s === 'object' && complete(s)) return [s]
    const id = typeof s === 'number' ? s : s.id
    const doc = fetched.find((f) => f.id === id)
    return doc && doc._status === 'published' ? [doc] : []
  })
}

/* -------------------------------------------------------------------------- */
/* Dispatcher                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * CaseStudyCards (SCHEMA §8.2 item 6). Async server component; the only
 * client code is the ledger's Load More island (LoadMore.tsx).
 * Layouts: `cards` (B3, p1/p5/p6), `ledger` (p3), `next-link` (p2).
 * LAUNCH STATE: every layout derives its state from PUBLISHED studies only;
 * with none, `cards`/`ledger` render the designed fallback and `next-link`
 * renders only the optional "All studies" link (else nothing).
 */
export async function CaseStudyCardsBlock(props: CaseStudyCardsProps) {
  const layout = props.layout ?? 'cards'
  if (layout === 'next-link') return <NextStudy {...props} />
  if (layout === 'ledger') return <StudyLedger {...props} />
  return <StudyCards {...props} />
}

/* -------------------------------------------------------------------------- */
/* `cards` (B3, cleared Gate 1: markup unchanged)                              */
/* -------------------------------------------------------------------------- */

/**
 * CaseStudyCards, `cards` layout (Homepage.dc.html "Featured case studies",
 * desktop + mobile builds). Reads published studies through the Local API;
 * no interactivity (hover is CSS).
 */
async function StudyCards(props: CaseStudyCardsProps) {
  const { eyebrow, eyebrowTick, heading, accentPhrase, source, caseStudies, limit, cardLinkLabel, allLink, track } = props
  const tone = props.tone ?? 'light'
  const studies = await loadStudies(source ?? 'featured', caseStudies, clampLimit(limit), track)

  if (studies.length > 0) {
    const cols = studies.length === 1 ? 'md:grid-cols-1' : studies.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'
    return (
      <Section tone={tone}>
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
            className="ix-rule mt-8 inline-flex min-h-target items-center text-small font-bold"
          />
        </Container>
      </Section>
    )
  }

  return <Fallback {...props} />
}

/** DS CaseStudyCard (CaseStudyCard.jsx): gray card, 16:9 ink media, metric, summary, underlined link. */
function StudyCard({ study, linkLabel }: { study: CaseStudy; linkLabel: string }) {
  const client = typeof study.client === 'object' && study.client !== null ? (study.client as Client).name : null
  const metric = study.headlineMetric
  const hero = typeof study.heroMedia === 'object' ? study.heroMedia : null
  const href = docPath('case-studies', study)

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
        {study.cardSummary ? <p className="mt-2.5 whitespace-pre-line text-[0.9375rem] leading-normal">{study.cardSummary}</p> : null}
        {href ? (
          <span className="ix-rule mt-3.5 inline-block text-small font-bold">
            <ArrowText text={linkLabel} />
          </span>
        ) : null}
      </div>
    </>
  )

  // Reference lift of the interaction system. Tailwind 4's translate-* sets `translate`, not `transform`,
  // so the transition list names `translate` (with `transform` the lift jumped instead of easing).
  const cls =
    'flex flex-col bg-gray-light text-ink no-underline transition-[box-shadow,translate] duration-180 ease-out hover:shadow-lift focus-visible:shadow-lift motion-safe:hover:-translate-y-1 motion-safe:focus-visible:-translate-y-1'
  return href ? (
    <Link href={href} className={cls}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  )
}

/* -------------------------------------------------------------------------- */
/* `ledger` (p3 §Study ledger)                                                */
/* -------------------------------------------------------------------------- */

/** Flattens a nested object into Payload's bracketed REST query (`where[and][0][_status][equals]=published`). */
function toQuery(value: unknown, prefix: string, out: URLSearchParams): URLSearchParams {
  if (Array.isArray(value)) value.forEach((v, i) => toQuery(v, `${prefix}[${i}]`, out))
  else if (value && typeof value === 'object')
    for (const [k, v] of Object.entries(value)) toQuery(v, prefix ? `${prefix}[${k}]` : k, out)
  else if (value !== undefined && value !== null) out.append(prefix, String(value))
  return out
}

/** Only the fields a ledger row reads (LedgerSource), so Load More never over-fetches. */
const LEDGER_SELECT = {
  title: true,
  slug: true,
  client: true,
  studyNumber: true,
  engagementLine: true,
  headlineMetric: true,
  cardSummary: true,
  _status: true,
} as const

/**
 * CaseStudyCards, `ledger` layout (Work.dc.html "Study ledger", desktop +
 * mobile builds): optional eyebrow/headline, a desktop column header, one
 * row per published study. Automatic sources show `pageSize` rows and, with
 * `loadMore` on and more studies published, hand the list to the Load More
 * island. Manual picks show every published pick (no Load More).
 */
async function StudyLedger(props: CaseStudyCardsProps) {
  const { eyebrow, eyebrowTick, heading, accentPhrase, source, caseStudies, track, ledgerLabels: l } = props
  const tone = props.tone ?? 'light'
  const pageSize = clampPageSize(props.pageSize)
  let studies: CaseStudy[] = []
  let hasMore = false
  let query = ''

  if ((source ?? 'featured') === 'manual') {
    studies = await resolvePicks(caseStudies)
  } else {
    const where = sourceWhere(source ?? 'featured', track)
    if (where) {
      try {
        const payload = await getPayload({ config })
        const res = await payload.find({
          collection: 'case-studies',
          draft: false,
          overrideAccess: false,
          depth: 1,
          limit: pageSize,
          sort: '-publishedAt',
          where,
        })
        studies = res.docs.filter((d) => d._status === 'published')
        hasMore = res.hasNextPage
        query = toQuery(
          { where, sort: '-publishedAt', select: LEDGER_SELECT, populate: { clients: { name: true } } },
          '',
          new URLSearchParams(),
        ).toString()
      } catch (error) {
        console.error('[CaseStudyCards] could not load published case studies; rendering the fallback state', error)
      }
    }
  }

  if (studies.length === 0) return <Fallback {...props} />

  const rows = studies.map(toLedgerRow)
  const labels: LedgerRowLabels = { kind: l?.kind?.trim() ?? '', readLabel: l?.readLabel?.trim() ?? '' }
  const headers = [l?.number, l?.client, l?.summary, l?.metric].map((h) => h?.trim() ?? '')
  const HEAD = 'text-[10px] font-bold uppercase tracking-[0.12em] text-gray-warm'

  return (
    <Section tone={tone} pad="none" className="lg:pb-6">
      <Container>
        {eyebrow || heading ? (
          <div className="pt-section-mobile pb-7 md:pt-section md:pb-9">
            {eyebrow ? (
              <Eyebrow tick={eyebrowTick !== false} className="mb-4.5">
                {eyebrow}
              </Eyebrow>
            ) : null}
            {heading ? <AccentHeadline text={heading} accent={accentPhrase} level="section" /> : null}
          </div>
        ) : null}
        {headers.some(Boolean) ? (
          <div aria-hidden="true" className={cx('hidden items-end border-b-2 border-ink pb-2.5 lg:grid', LEDGER_COLS)}>
            <span className="font-mono text-[10px] font-bold tracking-[0.12em] text-gray-warm">{headers[0]}</span>
            <span className={HEAD}>{headers[1]}</span>
            <span className={HEAD}>{headers[2]}</span>
            <span className={HEAD}>{headers[3]}</span>
            <span />
          </div>
        ) : null}
        {props.loadMore !== false && hasMore && query ? (
          <LedgerLoadMore
            initialRows={rows}
            query={query}
            pageSize={pageSize}
            labels={labels}
            buttonLabel={props.loadMoreLabel?.trim() || 'Load more studies'}
            loadingLabel={props.loadMoreLoadingLabel?.trim() || 'Loading…'}
            errorLabel={props.loadMoreErrorLabel?.trim() || 'Could not load more studies. Try again.'}
          />
        ) : (
          <ul className={LEDGER_LIST}>
            {rows.map((row) => (
              <LedgerRow key={row.id} row={row} labels={labels} />
            ))}
          </ul>
        )}
      </Container>
    </Section>
  )
}

/* -------------------------------------------------------------------------- */
/* `next-link` (p2 §Next study)                                               */
/* -------------------------------------------------------------------------- */

/** Reading order: study number ascending (unnumbered last), then publish date, then id. */
function compareStudies(a: CurrentStudy, b: CurrentStudy): number {
  const na = typeof a.studyNumber === 'number' ? a.studyNumber : Number.POSITIVE_INFINITY
  const nb = typeof b.studyNumber === 'number' ? b.studyNumber : Number.POSITIVE_INFINITY
  if (na !== nb) return na < nb ? -1 : 1
  const pa = a.publishedAt ?? ''
  const pb = b.publishedAt ?? ''
  if (pa !== pb) return pa < pb ? -1 : 1
  return String(a.id) < String(b.id) ? -1 : String(a.id) > String(b.id) ? 1 : 0
}

/**
 * The next published study after `current` in reading order, wrapping to the
 * first; never the current study itself. `null` when no other study is published.
 */
async function loadNextStudy(current: CurrentStudy): Promise<CaseStudy | null> {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'case-studies',
      draft: false,
      overrideAccess: false,
      depth: 1,
      limit: 200,
      pagination: false,
      where: { and: [PUBLISHED, { id: { not_equals: current.id } }] },
    })
    const others = docs.filter((d) => d._status === 'published' && d.id !== current.id).sort(compareStudies)
    return others.find((d) => compareStudies(d, current) > 0) ?? others[0] ?? null
  } catch (error) {
    console.error('[CaseStudyCards] could not load the next study; rendering no next-study line', error)
    return null
  }
}

/**
 * CaseStudyCards, `next-link` layout (Case Study.dc.html "Next study",
 * desktop + mobile builds): one boxed line "Next study / <client> — <summary>
 * / Read it →" in the 820px article column. Manual source: the first
 * published pick. Otherwise the next published study after `currentStudy`
 * (passed by the case-study template). With no other published study the
 * section renders only `allLink` when one is set, else nothing.
 */
async function NextStudy(props: CaseStudyCardsProps) {
  const { source, caseStudies, currentStudy, nextLabels, allLink } = props
  const tone = props.tone ?? 'light'
  let study: CaseStudy | null = null
  if ((source ?? 'featured') === 'manual') {
    study = (await resolvePicks(caseStudies)).find((s) => s.id !== currentStudy?.id) ?? null
  } else if (currentStudy) {
    study = await loadNextStudy(currentStudy)
  } else {
    console.error('[CaseStudyCards] next-link without a current study (only the case-study template provides one); rendering nothing')
  }

  const href = study ? docPath('case-studies', study) : null
  const allHref = resolveLinkHref(allLink) && allLink?.label?.trim() ? allLink : null
  if (!study || !href) {
    if (!allHref) return null
    return (
      <Section tone={tone} pad="none" className="pt-7 pb-9 md:pt-0 md:pb-14">
        <div className="mx-auto w-full max-w-[820px] px-container-mobile md:px-container">
          <CMSLink link={allHref} className="ix-rule inline-flex min-h-target items-center text-small font-bold" />
        </div>
      </Section>
    )
  }

  const client = typeof study.client === 'object' && study.client !== null ? study.client.name?.trim() : null
  const summary = study.cardSummary?.trim() || study.title
  const line = client ? `${client} — ${summary}` : summary
  const label = nextLabels?.label?.trim()
  const readLabel = nextLabels?.readLabel?.trim()

  return (
    <Section tone={tone} pad="none" className="pt-7 pb-9 md:pt-0 md:pb-14">
      <div className="mx-auto w-full max-w-[820px] px-container-mobile md:px-container">
        <Link
          href={href}
          className="flex min-h-target flex-col gap-1.5 border-2 border-ink px-5 py-4.5 text-ink no-underline transition-colors duration-180 ease-out hover:bg-gray-light md:flex-row md:items-center md:justify-between md:gap-8 md:px-7 md:py-6"
        >
          <span>
            {label ? (
              <span className="block text-[10px] font-bold uppercase tracking-[0.1em] text-gray-warm">{label}</span>
            ) : null}
            <span className={cx('block text-[0.9375rem] leading-normal', label && 'mt-1.5')}>{line}</span>
          </span>
          {readLabel ? (
            <span className="mt-1 text-[12px] font-bold uppercase tracking-[0.08em] md:mt-0 md:whitespace-nowrap">
              <ArrowText text={readLabel} />
            </span>
          ) : null}
        </Link>
      </div>
    </Section>
  )
}

/* -------------------------------------------------------------------------- */
/* Fallback states (no published study)                                       */
/* -------------------------------------------------------------------------- */

const SMALL_LABEL = 'block text-[10px] font-bold uppercase tracking-[0.12em] text-gray-warm'

/** Published testimonials only (SCHEMA §5.2: a non-object relation is absent; drafts are skipped). */
const usableTestimonials = (items: CaseStudyCardsData['fallbackTestimonials']): Testimonial[] =>
  (items ?? [])
    .filter((t): t is Testimonial => typeof t === 'object' && t !== null && (t._status === undefined || t._status === 'published'))
    .slice(0, 3)

/**
 * The designed fallback (CLAUDE.md rule 1, SCHEMA §5): never "coming soon".
 * - `ledger` / `note` (B3): Homepage.dc.html `csFallback` text block, with the
 *   ruled list of facts in ledger mode. Markup unchanged from B3.
 * - `testimonials` (p5 Shopify "Proof" `csFallback`): headline, then the
 *   small label and up to three picked quotes. The design's "A study in full"
 *   card is NOT rendered (SCHEMA §5: "selected testimonials, no study card";
 *   with nothing published there is no study to show).
 * - `metric-strip` (p6 Marketing `fallbackStrip`, DS MetricStrip): the text
 *   block, then a strip of up to three facts. Prices only via `pricingNote`.
 * - `logo-strip` (p8 About "Logo strip at launch"): the text block, then the
 *   client logo row (ProofStrip's rendering and client rule).
 * A mode with nothing to show (no usable testimonials / no facts / no clients) degrades to
 * the `note` text block, so the section never renders an empty frame.
 */
function Fallback(props: CaseStudyCardsProps) {
  const { fallbackMode, fallbackEyebrow, fallbackHeading, fallbackAccentPhrase, fallbackBody, fallbackMetrics, pricingNote } =
    props
  const tone = props.tone ?? 'light'
  const metrics = (fallbackMetrics ?? []).slice(0, 3)
  const mode = fallbackMode ?? 'ledger'
  const note = pricingNote?.trim()

  if (mode === 'testimonials') {
    const quotes = usableTestimonials(props.fallbackTestimonials)
    if (quotes.length > 0) return <TestimonialsFallback {...props} tone={tone} quotes={quotes} />
  }
  if (mode === 'metric-strip' && metrics.length > 0) return <MetricStripFallback {...props} tone={tone} />
  if (mode === 'logo-strip') return <LogoStripFallback {...props} tone={tone} />

  const showLedger = mode === 'ledger' && metrics.length > 0

  return (
    <Section tone={tone}>
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
              <p className="mt-3.5 max-w-[44ch] whitespace-pre-line text-body-mobile text-gray-warm md:mt-5 md:text-body">{fallbackBody}</p>
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

type Tone = NonNullable<CaseStudyCardsData['tone']>

/** p5 Shopify Theme Development.dc.html "Proof" `csFallback` (desktop + mobile builds), without the study card. */
function TestimonialsFallback({
  tone,
  quotes,
  fallbackEyebrow,
  fallbackHeading,
  fallbackAccentPhrase,
  fallbackBody,
  pricingNote,
}: CaseStudyCardsProps & { tone: Tone; quotes: Testimonial[] }) {
  const cols = quotes.length === 1 ? '' : quotes.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'
  const note = pricingNote?.trim()
  return (
    <Section tone={tone} pad="tight">
      <Container>
        {fallbackHeading ? (
          <AccentHeadline
            text={fallbackHeading}
            accent={fallbackAccentPhrase}
            level="section"
            accentColor="primary"
            className={fallbackBody ? 'mb-3.5 md:mb-5' : 'mb-6 md:mb-10'}
          />
        ) : null}
        {fallbackBody ? (
          <p className="mb-6 max-w-[44ch] whitespace-pre-line text-body-mobile text-gray-warm md:mb-10 md:text-body">{fallbackBody}</p>
        ) : null}
        <div className="flex flex-col gap-3.5 md:gap-5">
          {fallbackEyebrow ? <span className={SMALL_LABEL}>{fallbackEyebrow}</span> : null}
          <ul className={cx('m-0 grid list-none items-start gap-4 p-0 md:gap-5', cols)}>
            {quotes.map((t) => (
              <li key={t.id}>
                <QuoteCard t={t} />
              </li>
            ))}
          </ul>
        </div>
        {note ? <p className="mt-6 text-small-mobile text-gray-warm md:text-small">{note}</p> : null}
      </Container>
    </Section>
  )
}

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

/**
 * DS Testimonial card (figure, 1px divider border, stars + source tag, quote,
 * caption), the same markup and classes as TestimonialRow's card so the two
 * read as one component. FLAG: promote one shared card to src/components/
 * (it is private to TestimonialRow today). Video testimonials show their quote
 * here (no poster tile).
 */
function QuoteCard({ t }: { t: Testimonial }) {
  const sourceLabel = SOURCE_LABELS[t.source]
  const rating = typeof t.rating === 'number' ? Math.min(5, Math.max(0, Math.round(t.rating))) : 0
  const client = typeof t.client === 'object' && t.client ? (t.client as Client) : null
  const logo = client && typeof client.logo === 'object' ? client.logo : null
  const metric = t.metric?.value?.trim() ? t.metric : null
  const hasTopRow = rating > 0 || sourceLabel

  return (
    <figure className="m-0 border border-divider bg-cream p-5">
      {hasTopRow ? (
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="flex gap-0.5" role={rating ? 'img' : undefined} aria-label={rating ? `${rating} out of 5 stars` : undefined}>
            {Array.from({ length: rating }, (_, i) => (
              <Star key={i} />
            ))}
          </span>
          {sourceLabel ? <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-gray-warm">{sourceLabel}</span> : null}
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

/**
 * DS MetricStrip (MERGED §4.1: flex-wrap, gap 48, padding 32, `--gray-light`
 * ground; Marketing.dc.html `fallbackStrip` centres it) under the fallback
 * text block. On a grey section the strip takes the white ground so it stays
 * visible. FLAG: MetricEvent `strip` (SCHEMA §8.2 item 7) is the shared strip
 * component; it is being built in parallel and is not composable yet.
 */
function MetricStripFallback({
  tone,
  fallbackEyebrow,
  fallbackHeading,
  fallbackAccentPhrase,
  fallbackBody,
  fallbackMetrics,
  pricingNote,
}: CaseStudyCardsProps & { tone: Tone }) {
  const metrics = (fallbackMetrics ?? []).slice(0, 3)
  const note = pricingNote?.trim()
  return (
    <Section tone={tone} pad="tight">
      <Container>
        {fallbackEyebrow ? <Eyebrow muted>{fallbackEyebrow}</Eyebrow> : null}
        {fallbackHeading ? (
          <AccentHeadline
            text={fallbackHeading}
            accent={fallbackAccentPhrase}
            level="section"
            accentColor="primary"
            className={fallbackEyebrow ? 'mt-3.5 md:mt-4.5' : undefined}
          />
        ) : null}
        {fallbackBody ? (
          <p className="mt-3.5 max-w-[44ch] whitespace-pre-line text-body-mobile text-gray-warm md:mt-5 md:text-body">{fallbackBody}</p>
        ) : null}
        <ul
          className={cx(
            'm-0 flex list-none flex-wrap justify-center gap-8 p-6 text-center md:gap-12 md:p-8',
            fallbackEyebrow || fallbackHeading || fallbackBody ? 'mt-7 md:mt-9' : undefined,
            tone === 'grey' ? 'bg-cream' : 'bg-gray-light',
          )}
        >
          {metrics.map((m, i) => (
            <li key={m.id ?? i}>
              <span
                className={cx(
                  'block font-display text-metric-mobile md:text-[3rem] md:leading-none',
                  m.accent ? 'text-ground-accent' : 'text-ink',
                )}
              >
                {m.value}
              </span>
              {m.label ? <span className="mt-2 block text-label uppercase tracking-eyebrow">{m.label}</span> : null}
              {m.sub ? <span className="mt-1 block text-small-mobile font-medium text-gray-warm">{m.sub}</span> : null}
            </li>
          ))}
        </ul>
        {note ? <p className="mt-3 text-small-mobile text-gray-warm md:text-small">{note}</p> : null}
      </Container>
    </Section>
  )
}

/* -------------------------------------------------------------------------- */
/* `logo-strip` fallback (p8 About: "Logo strip at launch, case study pull later") */
/* -------------------------------------------------------------------------- */

const LOGO_COLS = ['', 'md:grid-cols-1', 'md:grid-cols-2', 'md:grid-cols-3', 'md:grid-cols-2', 'md:grid-cols-3', 'md:grid-cols-3']

/**
 * Same rule as ProofStrip: picked clients if any (published only), otherwise
 * every published client flagged `showInLogoStrip`, in `sortOrder`. Never throws.
 * FLAG: ProofStrip keeps this resolver and the row markup private, so both are
 * duplicated here (ProofStrip is a cleared block and must not be touched).
 */
async function resolveLogoClients(picks: CaseStudyCardsData['fallbackLogos']): Promise<Client[]> {
  const published = (c: Client) => c._status !== 'draft'
  try {
    const items = picks ?? []
    if (items.length > 0) {
      const ids = items.filter((c): c is number => typeof c === 'number')
      let fetched: Client[] = []
      if (ids.length) {
        const payload = await getPayload({ config })
        fetched = (
          await payload.find({
            collection: 'clients',
            where: { id: { in: ids }, _status: { equals: 'published' } },
            depth: 1,
            limit: ids.length,
            pagination: false,
            overrideAccess: false,
          })
        ).docs
      }
      return items
        .map((c) => (typeof c === 'number' ? fetched.find((f) => f.id === c) : c))
        .filter((c): c is Client => !!c && published(c))
    }
    const payload = await getPayload({ config })
    return (
      await payload.find({
        collection: 'clients',
        where: { showInLogoStrip: { equals: true }, _status: { equals: 'published' } },
        sort: 'sortOrder',
        depth: 1,
        limit: 12,
        pagination: false,
        overrideAccess: false,
      })
    ).docs
  } catch (error) {
    console.error('[CaseStudyCards] could not load clients for the logo strip; falling back to the note', error)
    return []
  }
}

async function LogoStripFallback({ tone, ...props }: CaseStudyCardsProps & { tone: Tone }) {
  const { fallbackEyebrow, fallbackHeading, fallbackAccentPhrase, fallbackBody, pricingNote } = props
  const clients = await resolveLogoClients(props.fallbackLogos)
  // Zero clients: the designed `note` fallback (text block only).
  if (clients.length === 0) return <Fallback {...props} tone={tone} fallbackMode="note" />
  const note = pricingNote?.trim()
  return (
    <Section tone={tone} pad="tight">
      <Container>
        {fallbackEyebrow ? <Eyebrow muted>{fallbackEyebrow}</Eyebrow> : null}
        {fallbackHeading ? (
          <AccentHeadline
            text={fallbackHeading}
            accent={fallbackAccentPhrase}
            level="section"
            accentColor="primary"
            className={fallbackEyebrow ? 'mt-3.5 md:mt-4.5' : undefined}
          />
        ) : null}
        {fallbackBody ? (
          <p className="mt-3.5 max-w-[44ch] whitespace-pre-line text-body-mobile text-gray-warm md:mt-5 md:text-body">{fallbackBody}</p>
        ) : null}
        <ul
          className={cx(
            'm-0 grid list-none grid-cols-2 items-start justify-items-center gap-x-4 gap-y-5 p-0 opacity-55 md:items-center md:gap-x-10 md:gap-y-6 lg:flex lg:flex-wrap lg:justify-center lg:gap-14',
            LOGO_COLS[Math.min(clients.length, 6)],
            fallbackEyebrow || fallbackHeading || fallbackBody ? 'mt-7 md:mt-9' : undefined,
          )}
        >
          {clients.map((c) => (
            <li key={c.id} className="flex min-h-7 items-center">
              {c.logo && typeof c.logo === 'object' ? (
                <Media resource={c.logo} alt={c.name} className="h-7 w-auto max-w-36 object-contain grayscale md:h-8" />
              ) : (
                <span className="whitespace-nowrap font-display text-[0.9375rem] uppercase tracking-[0.01em] md:text-[1.25rem] md:tracking-[0.02em]">
                  {c.name}
                </span>
              )}
            </li>
          ))}
        </ul>
        {note ? <p className="mt-3 text-small-mobile text-gray-warm md:text-small">{note}</p> : null}
      </Container>
    </Section>
  )
}
