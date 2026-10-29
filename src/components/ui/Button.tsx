import React from 'react'

import { cx } from '@/lib/cx'

import { CMSLink, type CMSLinkData } from './CMSLink'

export type ButtonVariant = 'primary' | 'ghost' | 'ghost-light' | 'dark'
export type ButtonSize = 'sm' | 'md' | 'lg'

// DS Button.jsx: DM Sans 700, line-height 1, 2px border, square, nowrap,
// min-height 44px (--target-min). Hover/focus/press timing (180ms --ease-out,
// explicit transition list, never `all`, so the focus ring does not tween) and
// the press (translateY(1px)) live in the interaction system, styles.css `ix-*`.
const BASE =
  'inline-flex min-h-target cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-none border-2 font-body font-bold leading-none no-underline'

// Padding sm 10×18 / md 14×26 / lg 18×32. Font 14 / 15 / 17px: 14px = --text-small;
// 15px and 17px have no token (kept exact from Button.jsx, MERGED §1).
const SIZES: Record<ButtonSize, string> = {
  sm: 'px-4.5 py-2.5 text-small',
  md: 'px-6.5 py-3.5 text-[15px]',
  lg: 'px-8 py-4.5 text-[17px]',
}

// Hover (interaction system, approved 2026-10-29; replaces Button.jsx's
// brightness filters): filled variants lift onto a hard ink shadow (ix-lift);
// outlined variants fill from the left (ix-wipe-*). ghost-light sits on ink, so
// its focus ring is cream (the global ring is ink).
const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'ix-lift border-accent-primary bg-accent-primary text-on-accent',
  ghost: 'ix-wipe-ink border-ink bg-transparent text-ink',
  'ghost-light': 'ix-wipe-cream border-cream bg-transparent text-cream focus-visible:outline-cream',
  dark: 'ix-lift border-ink bg-ink text-cream',
}

/** Class string of a DS button, for elements that must look like one. */
export const buttonClasses = ({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
} = {}): string => cx(BASE, SIZES[size], VARIANTS[variant], className)

/** A real `<button>` (forms, toggles). Default `type="button"`. */
export function Button({
  variant,
  size,
  className,
  type = 'button',
  ...rest
}: { variant?: ButtonVariant; size?: ButtonSize } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={buttonClasses({ variant, size, className })} {...rest} />
}

/**
 * A `linkField` value styled as a DS button (CTAs). Renders nothing when the
 * link does not resolve (see CMSLink). `children` override the stored label.
 */
export function ButtonLink({
  link,
  variant,
  size,
  className,
  children,
}: {
  link: CMSLinkData | null | undefined
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children?: React.ReactNode
}) {
  return (
    <CMSLink link={link} className={buttonClasses({ variant, size, className })}>
      {children}
    </CMSLink>
  )
}
