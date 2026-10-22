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
 */

type Narrative = CaseStudy['narrative']
type LexicalRoot = BlockData<'richContent'>['body']
type LexicalNode = LexicalRoot['root']['children'][number]

const pad2 = (n: number): string => String(n).padStart(2, '0')

const clientName = (study: CaseStudy): string | null =>
  typeof study.client === 'object' && study.client !== null ? study.client.name?.trim() || null : null

/** "Study 01 — Client", "Study 01", "Client" or "Study" (current crumb, never a link). */
const studyCrumb = (study: CaseStudy): string => {
  const number = typeof study.studyNumber === 'number' ? `Study ${pad2(study.studyNumber)}` : null
  const client = clientName(study)
  if (number && client) return `${number} — ${client}`
  return number ?? client ?? 'Study'
}

/** "Published Feb 2026 · Client-approved figures · 8 min read" (each part only when it exists). */
const metaLine = (study: CaseStudy): string => {
  const parts: string[] = []
  if (study.publishedAt) {
    const date = new Date(study.publishedAt)
    if (!Number.isNaN(date.getTime())) {
      parts.push(
        `Published ${new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date)}`,
      )
    }
  }
  if (study.figuresApproved === true) parts.push('Client-approved figures')
  if (typeof study.readTime === 'number' && study.readTime > 0) parts.push(`${study.readTime} min read`)
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

export function CaseStudyView({ study }: { study: CaseStudy }) {
  const meta = metaLine(study)

  const hero: BlockData<'hero'> = {
    blockType: 'hero',
    variant: 'article',
    heading: study.title,
    accentPhrase: study.accentPhrase,
    geometry: true,
    breadcrumb: [{ label: 'Work', url: '/work' }, { label: studyCrumb(study) }],
    resultMetric: study.headlineMetric,
    body: study.engagementLine,
    metaLine: meta || null,
    summary: { label: 'In short', body: study.inShort },
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
    nextLabels: { label: 'Next study', readLabel: 'Read it →' },
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
    capacity: 'builds-line',
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
          differentlyNumber="04"
          differentlyHeading="What we'd do differently"
          phaseLabel="How this maps to our phases"
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
