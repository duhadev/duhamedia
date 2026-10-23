import React from 'react'

import { CaseStudyCardsBlock } from '@/blocks/CaseStudyCards/Component'
import { FinalCTABlock } from '@/blocks/FinalCTA/Component'
import { HeroBlock } from '@/blocks/Hero/Component'
import { MetricEventBlock, resultsTableToMetricEvent } from '@/blocks/MetricEvent/Component'
import { NewsletterBandBlock } from '@/blocks/NewsletterBand/Component'
import { RichContentBlock } from '@/blocks/RichContent/Component'
import { TestimonialClientVoiceView } from '@/blocks/TestimonialRow/Component'
import type { BlockData } from '@/blocks/types'
import { PageShell } from '@/components/chrome'
import { ReadingProgress } from '@/components/ReadingProgress'
import { type CaseStudyLabels, resolveCaseStudyLabels } from '@/lib/caseStudyLabels'
import { getChrome } from '@/lib/chrome'
import type { CaseStudy } from '@/payload-types'

/**
 * The p2 Case Study template (S4-12, SCHEMA §9 p2, CLAUDE.md p2 locked order):
 * one `case-studies` doc fed into the EXISTING block components, no visual
 * code of its own. Order (locked): 1 Hero `article` → 2 RichContent article
 * body (The Before / The Strategy / The Results) → 3 MetricEvent `table` →
 * 4 TestimonialRow `client-voice` → 5 CaseStudyCards `next-link` →
 * 6 NewsletterBand `band` → 7 FinalCTA. Standard header + footer, reading
 * progress on (R10: a template behaviour, not a field).
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

type Narrative = CaseStudy['narrative']
type LexicalRoot = BlockData<'richContent'>['body']
type LexicalNode = LexicalRoot['root']['children'][number]

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

const textNode = (text: string): LexicalNode => ({
  type: 'text',
  version: 1,
  text,
  format: 0,
  detail: 0,
  mode: 'normal',
  style: '',
})

/**
 * The three narrative sections as ONE Lexical document: each section's title
 * becomes an H2 (numbered 01/02/03 by RichContent's `numberSections`) followed
 * by that section's body. The narrative editor has no headings of its own, so
 * the numbering is exactly the three section titles.
 */
const narrativeBody = (narrative: Narrative): LexicalRoot => {
  const children: LexicalNode[] = []
  for (const key of ['before', 'strategy', 'results'] as const) {
    const section = narrative?.[key]
    const title = section?.title?.trim()
    if (title) {
      children.push({
        type: 'heading',
        tag: 'h2',
        version: 1,
        direction: 'ltr',
        format: '',
        indent: 0,
        children: [textNode(title)],
      })
    }
    children.push(...((section?.body?.root?.children as LexicalNode[] | undefined) ?? []))
  }
  return { root: { type: 'root', version: 1, direction: 'ltr', format: '', indent: 0, children } }
}

export function CaseStudyView({ study, labels }: { study: CaseStudy; labels: CaseStudyLabels }) {
  const meta = metaLine(study, labels)

  const hero: BlockData<'hero'> = {
    blockType: 'hero',
    variant: 'article',
    heading: study.title,
    accentPhrase: study.accentPhrase,
    geometry: true,
    breadcrumb: caseStudyBreadcrumb(study, labels),
    resultMetric: study.headlineMetric,
    body: study.engagementLine,
    metaLine: meta || null,
    summary: { label: labels.inShort, body: study.inShort },
    media: study.heroMedia,
    mediaFrame: 'browser',
  }

  const article: BlockData<'richContent'> = {
    blockType: 'richContent',
    variant: 'article',
    numberSections: true,
    body: narrativeBody(study.narrative),
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
        <RichContentBlock {...article} />
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
