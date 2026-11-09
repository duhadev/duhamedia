import React from 'react'

import { CaseStudyCardsBlock } from '@/blocks/CaseStudyCards/Component'
import { FinalCTABlock } from '@/blocks/FinalCTA/Component'
import { HeroBlock } from '@/blocks/Hero/Component'
import { MetricEventBlock, resultsTableToMetricEvent } from '@/blocks/MetricEvent/Component'
import { NewsletterBandBlock } from '@/blocks/NewsletterBand/Component'
import { TestimonialClientVoiceView } from '@/blocks/TestimonialRow/Component'
import type { BlockData } from '@/blocks/types'
import { CaseStudyStory } from '@/components/CaseStudyStory'
import { PageShell } from '@/components/chrome'
import { StudyFacts, StudyScreens, studyKicker, studyScreens, studySite, usableFacts } from '@/components/StudyPreview'
import { ArrowText, Container, Section } from '@/components/ui'
import { ReadingProgress } from '@/components/ReadingProgress'
import { type CaseStudyLabels, resolveCaseStudyLabels } from '@/lib/caseStudyLabels'
import { getChrome } from '@/lib/chrome'
import type { CaseStudy } from '@/payload-types'

/**
 * The p2 Case Study template (S4-12, SCHEMA §9 p2, CLAUDE.md p2 locked order),
 * laid out like brochure p6 since 2026-11-08 (owner: the study must say who,
 * what was made and what it looks like). One `case-studies` doc fed into the
 * existing block components plus the shared study pieces
 * (src/components/StudyPreview.tsx, CaseStudyStory.tsx). Order (locked):
 * 1 Hero `article` (services kicker, headline, client + meta line, "In
 * short") then the finished store (desktop + phone screenshots, live-store
 * link) and the facts panel → 2 the story: Why / How / What / What's next
 * (The Before / The Strategy / The Results, retitled) → 3 MetricEvent
 * `table` → 4 TestimonialRow `client-voice` → 5 CaseStudyCards `next-link` →
 * 6 NewsletterBand `band` → 7 FinalCTA. Standard header + footer, reading
 * progress on (R10: a template behaviour, not a field).
 *
 * The headline metric and `heroMedia` are no longer shown here: the facts
 * carry the numbers with their context, and only the store screenshots are
 * shown as the work (never a fallback image posing as the store).
 *
 * Each section keeps its block's own empty state (no client voice → nothing;
 * no other published study → no next line; no newsletter form/page → no band).
 *
 * F76 (human 2026-10-23): every fixed label comes from Site settings >
 * Template labels (`site-settings.caseStudyLabels`), falling back per field to
 * the current copy (src/lib/caseStudyLabels.ts). The global is read through
 * the request-cached chrome loader (same read the header/footer make; the
 * route loads them once and passes them in), and
 * `site-settings` saves already purge the whole frontend layout.
 * The closing FinalCTA capacity line follows the study's `track`.
 */

/** The template labels for this request (never throws: a failed read falls back to the defaults). */
export const getCaseStudyLabels = async (): Promise<CaseStudyLabels> =>
  resolveCaseStudyLabels((await getChrome()).settings.caseStudyLabels)

/**
 * F76: the closing capacity line follows the engagement. A growth-engine study
 * closes on the engines line; build, build + engine, handover or anything
 * unknown keeps the builds line (the previous behaviour).
 */
const capacityForTrack = (track: CaseStudy['track'] | null | undefined): 'builds-line' | 'engines-line' =>
  track === 'growth' ? 'engines-line' : 'builds-line'

const pad2 = (n: number): string => String(n).padStart(2, '0')

const clientName = (study: CaseStudy): string | null =>
  typeof study.client === 'object' && study.client !== null ? study.client.name?.trim() || null : null

/**
 * The visible Hero trail: "Work" → "Study 01 — Client" / "Study 01" / "Client"
 * / "Study" (current crumb, never a link). Exported so the route's
 * BreadcrumbList JSON-LD mirrors exactly what is shown (F78).
 */
export const caseStudyBreadcrumb = (study: CaseStudy, labels: CaseStudyLabels): Array<{ label: string; url?: string }> => [
  { label: labels.breadcrumbWork, url: '/work' },
  { label: studyCrumb(study, labels) },
]

/** "Study 01 — Client", "Study 01", "Client" or "Study" (current crumb, never a link). */
const studyCrumb = (study: CaseStudy, labels: CaseStudyLabels): string => {
  const number = typeof study.studyNumber === 'number' ? `${labels.studyWord} ${pad2(study.studyNumber)}` : null
  const client = clientName(study)
  if (number && client) return `${number} — ${client}`
  return number ?? client ?? labels.studyWord
}

/** "Published Feb 2026 · Client-approved figures · 8 min read" (each part only when it exists). */
const metaLine = (study: CaseStudy, labels: CaseStudyLabels): string => {
  const parts: string[] = []
  if (study.publishedAt) {
    const date = new Date(study.publishedAt)
    if (!Number.isNaN(date.getTime())) {
      parts.push(
        `${labels.publishedPrefix} ${new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date)}`,
      )
    }
  }
  if (study.figuresApproved === true) parts.push(labels.figuresApproved)
  if (typeof study.readTime === 'number' && study.readTime > 0) parts.push(`${study.readTime} ${labels.readTimeSuffix}`)
  return parts.join(' · ')
}

export function CaseStudyView({ study, labels }: { study: CaseStudy; labels: CaseStudyLabels }) {
  const meta = metaLine(study, labels)
  const { client, services } = studyKicker(study)
  const { desktop, mobile } = studyScreens(study)
  const facts = usableFacts(study.facts)
  const site = studySite(study)

  const hero: BlockData<'hero'> = {
    blockType: 'hero',
    variant: 'article',
    eyebrow: services,
    heading: study.title,
    accentPhrase: study.accentPhrase,
    // No corner shape: on phones it sat under the kicker and the headline (text over the shape).
    geometry: false,
    breadcrumb: caseStudyBreadcrumb(study, labels),
    body: [client, study.engagementLine?.trim()].filter(Boolean).join(' · ') || null,
    metaLine: meta || null,
    summary: { label: labels.inShort, body: study.inShort },
  }

  const nextStudy: BlockData<'caseStudyCards'> = {
    blockType: 'caseStudyCards',
    layout: 'next-link',
    source: 'latest',
    nextLabels: { label: labels.nextStudy, readLabel: labels.nextStudyRead },
    // No "All studies" fallback link: the design shows only the next-study line.
    allLink: { type: 'custom' },
  }

  const newsletter: BlockData<'newsletterBand'> = {
    blockType: 'newsletterBand',
    variant: 'band',
    heading: study.closing?.newsletterHeading,
  }

  const finalCta: BlockData<'finalCTA'> = {
    blockType: 'finalCTA',
    heading: study.closing?.finalCtaHeading,
    capacity: capacityForTrack(study.track),
    buttons: [],
  }

  return (
    <PageShell header="standard" footer="standard">
      <ReadingProgress />
      <main>
        <HeroBlock {...hero} />
        {desktop || mobile || facts.length > 0 ? (
          <Section tone="light" pad="none" className="pt-8 pb-10 md:pt-12 md:pb-14">
            <Container>
              <StudyScreens desktop={desktop} mobile={mobile} sizes="(min-width: 1200px) 990px, 90vw" preload />
              {site ? (
                <p className="mt-4 flex justify-end md:mt-5">
                  <a
                    href={site.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-target items-center text-small font-bold text-ink no-underline"
                  >
                    <span className="ix-rule pb-0.5">
                      <ArrowText text={`${site.host} ↗`} />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </span>
                  </a>
                </p>
              ) : null}
              <StudyFacts facts={facts} variant="panel" className={desktop || mobile ? 'mt-6 md:mt-8' : undefined} />
            </Container>
          </Section>
        ) : null}
        <CaseStudyStory narrative={study.narrative} />
        <MetricEventBlock {...resultsTableToMetricEvent(study.resultsTable)} />
        <TestimonialClientVoiceView
          clientVoice={study.clientVoice}
          differentlyNumber={labels.clientVoiceNumber}
          differentlyHeading={labels.clientVoiceDifferently}
          phaseLabel={labels.clientVoicePhases}
        />
        <CaseStudyCardsBlock
          {...nextStudy}
          currentStudy={{ id: study.id, studyNumber: study.studyNumber, publishedAt: study.publishedAt }}
        />
        <NewsletterBandBlock {...newsletter} />
        <FinalCTABlock {...finalCta} />
      </main>
    </PageShell>
  )
}
