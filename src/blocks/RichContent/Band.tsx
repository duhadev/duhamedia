import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import { RichText } from '@/components/RichText'
import { AccentHeadline, ButtonLink, Eyebrow, resolveLinkHref, Section } from '@/components/ui'
import { cx } from '@/lib/cx'

import type { RichContentProps } from './Component'

type Fact = NonNullable<RichContentProps['facts']>[number]

// Site text-link grammar (interaction system): bold, 2px rule that redraws L->R on hover. Replaces the
// former underline + wine hover, which the final page designs do not use (their links hover to ink).
const LINK_CLASS = 'ix-rule font-bold no-underline'

/**
 * Band prose: short paragraphs (DEV-SEO "DIY vs done": 1rem / 1.0625rem, lh 1.6).
 * The band's own heading is the section H2, so any heading in the text renders
 * as H3 (H2 when the band has no title of its own). Images and dividers belong to the article layout: skipped (logged).
 */
const bandConverters = (hasTitle: boolean): JSXConvertersFunction => () => ({
  // With no band title the first in-text heading is the section's only heading: h2, else h3 under the band H2.
  heading: ({ node, nodesToJSX }) => {
    const Tag = hasTitle ? 'h3' : 'h2'
    return (
      <Tag className="font-display text-[1.125rem] font-normal uppercase leading-[1.2] [&:not(:first-child)]:mt-2">
        {nodesToJSX({ nodes: node.children })}
      </Tag>
    )
  },
  quote: ({ node, nodesToJSX }) => (
    <blockquote className="border-l-4 border-ground-accent py-1 pl-4 font-display text-[1.125rem] font-normal uppercase leading-[1.3] md:pl-5">
      {nodesToJSX({ nodes: node.children })}
    </blockquote>
  ),
  upload: () => {
    console.warn('[RichContent band] images are not shown in a band; use the Article layout for figures')
    return null
  },
  horizontalrule: () => null,
})

function BandProse({ data, compact, hasTitle }: { data: RichContentProps['body']; compact: boolean; hasTitle: boolean }) {
  return (
    <RichText
      data={data}
      converters={bandConverters(hasTitle)}
      linkClassName={LINK_CLASS}
      className={cx(
        'flex flex-col gap-4',
        compact ? 'text-[0.9375rem] leading-[1.6]' : 'text-body-mobile md:text-[1.0625rem] md:leading-[1.6]',
        '[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li+li]:mt-2 [&_li]:marker:text-ground-accent [&_strong]:font-bold',
      )}
    />
  )
}

/**
 * The facts sub-strip (DEV-SEO Article.dc.html "DIY vs done" > "Proof"): up to
 * three typographic facts between hairlines, divided by rules. Mobile build:
 * 1.75rem numbers, 8px side padding; desktop: 3.25rem, 18px.
 */
function FactsStrip({ facts }: { facts: Fact[] }) {
  return (
    <ul
      className={cx(
        'grid border-y border-divider',
        facts.length === 1 ? 'grid-cols-1' : facts.length === 2 ? 'grid-cols-2' : 'grid-cols-3',
      )}
    >
      {facts.map((f, i) => (
        <li
          key={f.id ?? i}
          className={cx('px-2 py-5.5 text-center md:px-4.5 md:py-7', i < facts.length - 1 && 'border-r border-divider')}
        >
          <span
            className={cx(
              'block font-display text-[1.75rem] leading-[0.9] md:text-[3.25rem]',
              f.accent && 'text-ground-accent',
            )}
          >
            {f.value}
          </span>
          <span className="mt-2.5 block font-display text-[0.75rem] uppercase tracking-[0.02em] md:text-[0.9375rem]">
            {f.label}
          </span>
          {f.sub?.trim() ? (
            <span className="mt-1.5 block text-[0.6875rem] leading-[1.4] text-gray-warm md:mt-2 md:text-[0.75rem]">
              {f.sub}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  )
}

/**
 * RichContent `band` (DEV-SEO / MKT-SEO Article.dc.html "DIY vs done", desktop
 * + mobile builds). Grey (default) or white ground; eyebrow (muted, no tick),
 * section H2, prose, optional facts strip (widens to 984px on desktop, as in
 * the design), optional quiet pricing note, optional ghost button.
 *
 * `framed`: everything sits in the 2px ink "How we do it" box of the article
 * body (DERIVED for p14 "How Duha does it" — flag). Server component.
 */
export function RichContentBand({
  eyebrow,
  heading,
  accentPhrase,
  body,
  facts,
  pricingNote,
  link,
  tone,
  framed,
}: RichContentProps) {
  const hasBody = Array.isArray(body?.root?.children) && body.root.children.length > 0
  const title = heading?.trim()
  const validFacts = (facts ?? []).filter((f) => f?.value?.trim() && f?.label?.trim())
  const note = pricingNote?.trim()
  const hasLink = Boolean(resolveLinkHref(link) && link?.label?.trim())
  if (!hasBody && !title && !eyebrow?.trim() && validFacts.length === 0) {
    console.warn('[RichContent band] block has no content; rendering nothing')
    return null
  }

  const ground = tone === 'light' ? 'light' : 'grey'
  const boxed = framed === true

  const head = (
    <>
      {eyebrow?.trim() ? <Eyebrow muted>{eyebrow}</Eyebrow> : null}
      {title ? (
        <AccentHeadline
          text={title}
          accent={accentPhrase}
          level={boxed ? 3 : 'section'}
          as="h2"
          className={eyebrow?.trim() ? (boxed ? 'mt-2.5' : 'mt-3.5 md:mt-4') : undefined}
        />
      ) : null}
      {hasBody ? (
        <div className={cx(eyebrow?.trim() || title ? (boxed ? 'mt-2.5' : 'mt-4 md:mt-5') : undefined)}>
          <BandProse data={body} compact={boxed} hasTitle={Boolean(title)} />
        </div>
      ) : null}
    </>
  )

  const noteEl = (align: 'center' | 'left') =>
    note ? (
      <p className={cx('text-[0.75rem] leading-[1.5] text-gray-warm', align === 'center' ? 'mt-3.5 text-center' : 'mt-4')}>
        {note}
      </p>
    ) : null

  const button = hasLink ? (
    <div className={cx('w-full md:w-auto', boxed ? 'mt-4' : 'mt-6 md:mt-8')}>
      <ButtonLink link={link} variant="ghost" size="md" className="w-full md:w-auto" />
    </div>
  ) : null

  if (boxed) {
    return (
      <Section tone={ground} pad="none" className="py-12 md:py-16">
        <div className="mx-auto w-full max-w-205 px-container-mobile md:px-container">
          <div className="border-2 border-ink p-5 md:px-6 md:py-5.5">
            {head}
            {validFacts.length ? (
              <div className="mt-6">
                <FactsStrip facts={validFacts} />
              </div>
            ) : null}
            {noteEl(validFacts.length ? 'center' : 'left')}
            {button}
          </div>
        </div>
      </Section>
    )
  }

  return (
    <Section tone={ground} pad="none" className="py-12 md:py-16">
      <div className="mx-auto w-full max-w-205 px-container-mobile md:px-container">
        {head}
        {validFacts.length === 0 ? noteEl('left') : null}
        {button && validFacts.length === 0 ? button : null}
      </div>
      {validFacts.length ? (
        <div className="mx-auto mt-7 w-full max-w-246 px-container-mobile md:mt-10 md:px-container">
          <FactsStrip facts={validFacts} />
          {noteEl('center')}
          {button ? <div className="flex justify-center">{button}</div> : null}
        </div>
      ) : null}
    </Section>
  )
}
