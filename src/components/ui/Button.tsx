import React from 'react'

import { cx } from '@/lib/cx'

import { CMSLink, type CMSLinkData } from './CMSLink'

export type ButtonVariant = 'primary' | 'ghost' | 'ghost-light' | 'dark'
export type ButtonSize = 'sm' | 'md' | 'lg'

// DS Button.jsx: DM Sans 700, line-height 1, 2px border, square, nowrap,
// min-height 44px (--target-min), 180ms --ease-out, press = translateY(1px).
// Transition list is explicit, NOT `all`: `all` also animates `outline`, so on keyboard
// focus the ring tweened in from currentColor (cream on the primary button) at 3px/0 offset.
const BASE =
  'inline-flex min-h-target cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-none border-2 font-body font-bold leading-none no-underline transition-[color,background-color,border-color,filter,translate] duration-180 ease-out active:translate-y-px'

// Padding sm 10×18 / md 14×26 / lg 18×32. Font 14 / 15 / 17px: 14px = --text-small;
// 15px and 17px have no token (kept exact from Button.jsx, MERGED §1).
const SIZES: Record<ButtonSize, string> = {
  sm: 'px-4.5 py-2.5 text-small',
  md: 'px-6.5 py-3.5 text-[15px]',
  lg: 'px-8 py-4.5 text-[17px]',
}

// Hover per Button.jsx: primary brightness(.9); ghost fills ink; ghost-light
// fills cream; dark brightness(1.15). ghost-light sits on ink, so its focus
// ring is cream (the global ring is ink).
const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'border-accent-primary bg-accent-primary text-on-accent hover:brightness-90',
  ghost: 'border-ink bg-transparent text-ink hover:bg-ink hover:text-cream',
  'ghost-light': 'border-cream bg-transparent text-cream hover:bg-cream hover:text-ink focus-visible:outline-cream',
  dark: 'border-ink bg-ink text-cream hover:brightness-115',
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
