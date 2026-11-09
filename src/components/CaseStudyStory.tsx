import React from 'react'

import { ArticleBody, type ArticleBodyData } from '@/blocks/RichContent/Component'
import { Container, Section } from '@/components/ui'
import { cx } from '@/lib/cx'
import type { CaseStudy } from '@/payload-types'

/**
 * The case study's story, laid out like brochure p6 (owner, 2026-11-08):
 * under a 2px ink rule, two columns from `lg`: Why (`narrative.before`) and
 * How (`strategy`) on the left; What (`results`), What's next (`next`,
 * optional) and the black pull line (`aside`, optional) on the right. One
 * column below `lg`, in that same order. Locked p2 order is kept: these are
 * still The Before → The Strategy → The Results, retitled.
 * Server component; the prose is the article typography (RichContent).
 */

type Narrative = CaseStudy['narrative']

/** True when the Lexical state holds at least one non-blank text node. */
const hasText = (node: unknown): boolean => {
  if (!node || typeof node !== 'object') return false
  const n = node as { text?: unknown; children?: unknown; root?: unknown }
  if (typeof n.text === 'string' && n.text.trim()) return true
  if (n.root) return hasText(n.root)
  return Array.isArray(n.children) && n.children.some(hasText)
}

function Part({ title, body }: { title?: string | null; body?: unknown }) {
  if (!hasText(body)) return null
  const heading = title?.trim()
  return (
    <section className="flex flex-col gap-3.5 md:gap-4">
      {heading ? <h2 className="font-display text-[1.25rem] font-normal uppercase leading-[1.15] md:text-[1.375rem]">{heading}</h2> : null}
      <ArticleBody data={body as ArticleBodyData} numbered={false} />
    </section>
  )
}

export function CaseStudyStory({ narrative }: { narrative: Narrative }) {
  const quote = narrative?.aside?.quote?.trim()
  const caption = narrative?.aside?.caption?.trim()
  const right = [narrative?.results, narrative?.next].some((p) => hasText(p?.body)) || Boolean(quote)

  return (
    <Section tone="light" pad="none" className="pt-4 pb-12 md:pt-6 md:pb-20">
      <Container>
        <div className={cx('grid grid-cols-1 gap-10 border-t-2 border-ink pt-8 md:gap-12 md:pt-10', right && 'lg:grid-cols-2 lg:gap-x-16')}>
          <div className="flex min-w-0 flex-col gap-10 md:gap-12">
            <Part title={narrative?.before?.title} body={narrative?.before?.body} />
            <Part title={narrative?.strategy?.title} body={narrative?.strategy?.body} />
          </div>
          {right ? (
            <div className="flex min-w-0 flex-col gap-10 md:gap-12">
              <Part title={narrative?.results?.title} body={narrative?.results?.body} />
              <Part title={narrative?.next?.title} body={narrative?.next?.body} />
              {quote ? (
                <figure className="m-0 bg-ink px-6 py-6 text-cream md:px-7 md:py-7">
                  <blockquote className="m-0 font-display text-[1.25rem] font-normal uppercase leading-[1.25] whitespace-pre-line md:text-[1.375rem]">
                    {quote}
                  </blockquote>
                  {caption ? (
                    <figcaption className="mt-4 text-[11px] font-bold uppercase tracking-[0.12em] text-cream/70">{caption}</figcaption>
                  ) : null}
                </figure>
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  )
}
