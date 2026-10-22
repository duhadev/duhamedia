import React from 'react'

import { splitAccentPhrase } from '@/lib/accentPhrase'
import { cx } from '@/lib/cx'

const LEVELS = {
  1: 'text-h1-mobile md:text-h1', // 2.5rem / 4.5rem, lh 1
  2: 'text-h2-mobile md:text-h2', // 2rem / 3rem, lh 1.05
  3: 'text-h3-mobile md:text-h3', // 1.375rem / 1.75rem, lh 1.15
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
 * `level` = visual size; `as` = the HTML element (pick it for the page outline:
 * only the hero is `h1`).
 */
export function AccentHeadline({
  text,
  accent,
  level = 2,
  as: Tag = 'h2',
  accentColor = 'primary',
  className,
  id,
}: {
  text: string
  accent?: string | null
  level?: keyof typeof LEVELS
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p'
  accentColor?: keyof typeof ACCENTS
  className?: string
  id?: string
}) {
  const parts = splitAccentPhrase(text, accent)
  return (
    <Tag id={id} className={cx('font-display font-normal uppercase tracking-headline text-balance', LEVELS[level], className)}>
      {parts ? (
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
