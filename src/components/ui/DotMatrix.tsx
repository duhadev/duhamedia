import React from 'react'

import { cx } from '@/lib/cx'

/** Light-ground dot colours seen in the finals (MERGED §2.1 "Dot matrix": .22, also .3 and .15). */
const LIGHT_DOTS = {
  default: 'bg-[radial-gradient(var(--color-geo-dot)_1.2px,transparent_1.2px)]', // .22
  strong: 'bg-[radial-gradient(rgba(17,17,17,.3)_1.2px,transparent_1.2px)]', // heroes
  soft: 'bg-[radial-gradient(rgba(17,17,17,.15)_1.2px,transparent_1.2px)]',
} as const

const FADES = {
  /** Heroes: dense top-right, fading toward bottom-left (mask 215deg, #000 15% → transparent 60%). */
  corner: '[mask-image:linear-gradient(215deg,#000_15%,transparent_60%)]',
  /** "What we do", Final CTA: dots at the top and bottom edges only. */
  edges: '[mask-image:linear-gradient(to_bottom,#000_0,transparent_25%,transparent_75%,#000_100%)]',
} as const

/**
 * The "fade-edge" dot-matrix ground (MERGED §5, R1: gradient masks allowed for
 * decorative geometry only): 1.2px dots on a 22px pitch, ink on light grounds,
 * cream on dark. Decorative (`aria-hidden`); place it first inside a
 * `relative overflow-hidden` section and give the content `relative z-10`.
 */
export function DotMatrix({
  fade = 'corner',
  onDark = false,
  intensity = 'default',
  className,
}: {
  fade?: keyof typeof FADES
  onDark?: boolean
  /** Light grounds only (dark grounds always use --geo-dot-on-dark). */
  intensity?: keyof typeof LIGHT_DOTS
  className?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={cx(
        'pointer-events-none absolute inset-0 z-0 bg-size-[22px_22px]',
        onDark ? 'bg-[radial-gradient(var(--color-geo-dot-on-dark)_1.2px,transparent_1.2px)]' : LIGHT_DOTS[intensity],
        FADES[fade],
        className,
      )}
    />
  )
}
