import React from 'react'

import { splitAccentPhrase } from '@/lib/accentPhrase'
import { cx } from '@/lib/cx'

const LEVELS = {
  1: 'text-h1-mobile md:text-h1', // 2.5rem / 4.5rem, lh 1
  2: 'text-h2-mobile md:text-h2', // 2rem / 3rem, lh 1.05
  3: 'text-h3-mobile md:text-h3', // 1.375rem / 1.75rem, lh 1.15
  /**
   * Section headline of the finals (Homepage.dc.html): the mobile build uses DS
   * `AccentHeadline level 3` = `--text-h3` (1.75rem, lh 1.15) and the desktop
   * build DS `level 2` = `--text-h2` (3rem, lh 1.05). Not the `-mobile` tokens:
   * the DS component always reads the desktop-named size var.
   */
  section: 'text-h3 md:text-h2', // 1.75rem / 3rem
} as const

const ACCENTS = {
  /** DS default: --accent-primary (renders ink in the finals, e.g. the homepage hero). */
  primary: 'text-accent-primary',
  /** Finals' inline recolour to --ground-accent (wine), e.g. "Then we grow it.". */
  ground: 'text-ground-accent',
} as const

/**
 * DS AccentHeadline (_ds_bundle.js AccentHeadline.jsx; MERGED §4.1, §2.2):
 * Archivo Black, uppercase, −0.01em, `text-wrap: balance`, ONE accent phrase.
 * `accent` must be a substring of `text` (case-insensitive, the same rule as
 * `headlineFields()` validation, src/lib/accentPhrase.ts); a non-matching
 * accent renders the plain heading. Colour is inherited (ink on light
 * sections, cream on dark), except the accent span.
 *
 * `level` = visual size (decoupled from the element); `as` = the HTML element
 * (pick it for the page outline: only the hero is `h1`). `level="section"` is
 * the finals' section-headline pair (1.75rem mobile / 3rem desktop); use it
 * instead of overriding the size with a class.
 */
export function AccentHeadline({
  text,
  accent,
  level = 2,
  as: Tag = 'h2',
  accentColor = 'primary',
  className,
  id,
  words = false,
}: {
  text: string
  accent?: string | null
  level?: keyof typeof LEVELS
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p'
  accentColor?: keyof typeof ACCENTS
  className?: string
  id?: string
  /**
   * Opt-in motion hooks (typographic Hero load-in, src/blocks/Hero/heroMotion.css):
   * each word becomes `.hm-w > .hm-wi[--i]`, accent text inside it `.hm-acc`.
   * Same text content and colours; off everywhere else.
   */
  words?: boolean
}) {
  const parts = splitAccentPhrase(text, accent)
  return (
    <Tag id={id} className={cx('font-display font-normal uppercase tracking-headline text-balance', LEVELS[level], className)}>
      {words ? (
        splitWords(text, parts, ACCENTS[accentColor])
      ) : parts ? (
        <>
          {parts[0]}
          <span className={ACCENTS[accentColor]}>{parts[1]}</span>
          {parts[2]}
        </>
      ) : (
        text
      )}
    </Tag>
  )
}

/**
 * Splits a headline into per-word spans for the Hero load-in. Separators
 * (whitespace and the zero-width break that `slashBreaks` inserts) stay as
 * plain text between the words, so wrapping and the accessible name are
 * unchanged. The accent range is applied per word (it may start or end
 * mid-word), in the same colour class as the unsplit render.
 */
function splitWords(
  text: string,
  parts: [string, string, string] | null,
  accentClass: string,
): React.ReactNode[] {
  const start = parts ? parts[0].length : -1
  const end = parts ? start + parts[1].length : -1
  const nodes: React.ReactNode[] = []
  let offset = 0
  let i = 0
  for (const token of text.split(/(\s+|\u200B)/)) {
    const from = offset
    offset += token.length
    if (!token) continue
    if (/^(\s+|\u200B)$/.test(token)) {
      nodes.push(token)
      continue
    }
    const to = from + token.length
    const a = Math.min(Math.max(start, from), to)
    const b = Math.max(Math.min(end, to), a)
    const word =
      parts && b > a ? (
        <>
          {text.slice(from, a)}
          <span className={cx(accentClass, 'hm-acc')}>{text.slice(a, b)}</span>
          {text.slice(b, to)}
        </>
      ) : (
        token
      )
    nodes.push(
      <span key={from} className="hm-w">
        <span className="hm-wi" style={{ '--i': i } as React.CSSProperties}>
          {word}
        </span>
      </span>,
    )
    i += 1
  }
  return nodes
}
