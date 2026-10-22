import React from 'react'

import { cx } from '@/lib/cx'

export type SectionTone = 'light' | 'grey' | 'dark'
export type SectionPad = 'default' | 'tight' | 'none'

const TONES: Record<SectionTone, string> = {
  light: 'bg-cream text-ink', // var(--cream) ground
  grey: 'bg-gray-light text-ink', // var(--gray-light) band (Proof strip, Process, Newsletter)
  dark: 'bg-ink text-cream', // ink band (Mini CTA, Final CTA)
}

const PADS: Record<SectionPad, string> = {
  default: 'py-section-mobile md:py-section', // 56px mobile build / 96px --section-pad
  tight: 'py-section-mobile md:py-section-tight', // 56px / 64px --section-pad-tight
  none: '',
}

const DIVIDERS = {
  none: '',
  top: 'border-t border-divider',
  bottom: 'border-b border-divider',
  both: 'border-y border-divider',
} as const

/**
 * One page section band (Homepage.dc.html `<section>` grammar): tone sets the
 * ground and the text colour; pad sets the vertical rhythm; divider adds the
 * hairline rules some sections carry (Proof strip both, Testimonials top).
 * Does not add a Container, because geometry layers often sit full-bleed
 * inside the section. Add `relative overflow-hidden` via className when the
 * section holds absolutely positioned geometry.
 */
export function Section({
  tone = 'light',
  pad = 'default',
  divider = 'none',
  className,
  children,
  ...rest
}: {
  tone?: SectionTone
  pad?: SectionPad
  divider?: keyof typeof DIVIDERS
  className?: string
  children: React.ReactNode
} & Omit<React.HTMLAttributes<HTMLElement>, 'className' | 'children'>) {
  return (
    <section
      data-tone={tone}
      className={cx(TONES[tone], PADS[pad], DIVIDERS[divider], className)}
      {...rest}
    >
      {children}
    </section>
  )
}
