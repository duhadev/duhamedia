'use client'

// Client island: scroll-spy (IntersectionObserver + scroll offset math) and
// smooth scrolling need browser APIs and state for aria-current.
import React, { useEffect, useRef, useState } from 'react'

import { Container } from '@/components/ui'
import { cx } from '@/lib/cx'

import type { CategoryTab } from './Component'

// Header (60 mobile / 72 desktop) + this bar (~44 / 46) + breathing room.
// The jump bar is taller (60 desktop / 52 phone): header + bar + breathing room.
const spyOffset = (jump: boolean) => {
  const md = window.matchMedia('(min-width: 768px)').matches
  return jump ? (md ? 72 + 60 + 24 : 60 + 52 + 16) : md ? 72 + 46 + 24 : 60 + 56 + 16
}
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function CategoryTabsNav({
  ariaLabel,
  tabs,
  variant = 'faq',
  label,
}: {
  ariaLabel: string
  tabs: CategoryTab[]
  variant?: 'faq' | 'jump'
  label?: string
}) {
  const [active, setActive] = useState<string | null>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const jump = variant === 'jump'

  useEffect(() => {
    const targets = tabs
      .map((t) => document.getElementById(t.anchorId))
      .filter((el): el is HTMLElement => el !== null)
    if (targets.length === 0) return
    const update = () => {
      const off = spyOffset(jump)
      let current: string | null = null
      for (const el of targets) if (el.getBoundingClientRect().top <= off) current = el.id
      setActive(current)
    }
    const io = new IntersectionObserver(update, { rootMargin: '0px 0px -40% 0px', threshold: [0, 1] })
    targets.forEach((el) => io.observe(el))
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [tabs, jump])

  // Phones: keep the current link visible inside the sideways-scrolling bar (moves the bar only, never the page).
  useEffect(() => {
    const box = scroller.current
    if (!jump || !box || !active) return
    const el = box.querySelector<HTMLElement>('[aria-current="location"]')
    if (!el) return
    const left = el.offsetLeft - (box.clientWidth - el.offsetWidth) / 2
    box.scrollTo({ left: Math.max(0, left), behavior: reduced() ? 'auto' : 'smooth' })
  }, [active, jump])

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id)
    if (!el) return // missing target: let the browser handle the hash
    e.preventDefault()
    const top = el.getBoundingClientRect().top + window.scrollY - (spyOffset(jump) - 16)
    window.scrollTo({ top, behavior: reduced() ? 'auto' : 'smooth' })
    history.replaceState(null, '', `#${id}`)
    setActive(id)
  }

  if (jump) {
    return (
      <nav
        aria-label={ariaLabel}
        className="sticky top-header-mobile z-10 border-t border-b-2 border-t-divider border-b-ink bg-cream md:top-header"
      >
        <Container>
          {/* The label sits outside the scroller so a sideways scroll (phones) can never clip it. */}
          <div className="flex min-h-13 items-stretch md:min-h-15">
            <span className="mr-2 flex shrink-0 items-center gap-2.5 border-r border-divider pr-5 text-[11px] font-bold uppercase tracking-[0.1em] text-gray-warm md:pr-4 lg:pr-6">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M4 6h16M4 12h16M4 18h10" />
              </svg>
              {label || 'Jump to'}
            </span>
            <div
              ref={scroller}
              className="relative -mr-container-mobile flex min-w-0 flex-1 items-stretch overflow-x-auto pr-container-mobile text-sm font-bold whitespace-nowrap [scrollbar-width:none] md:mr-0 md:pr-0 [&::-webkit-scrollbar]:hidden"
            >
              {tabs.map((t, i) => {
                const on = active === t.anchorId
                return (
                  <a
                    key={t.anchorId}
                    href={`#${t.anchorId}`}
                    aria-current={on ? 'location' : undefined}
                    onClick={(e) => onClick(e, t.anchorId)}
                    className={cx(
                      'flex min-h-target shrink-0 items-center gap-2 px-4 lg:px-3 whitespace-nowrap text-ink no-underline transition-colors hover:bg-gray-light md:min-h-15',
                      on && 'shadow-[inset_0_-4px_0_var(--color-ground-accent)]',
                    )}
                  >
                    <span className="text-gray-warm">{String(i + 1).padStart(2, '0')}</span>
                    {t.label}
                  </a>
                )
              })}
            </div>
          </div>
        </Container>
      </nav>
    )
  }

  return (
    <div className="sticky top-header-mobile z-10 border-y border-divider bg-cream md:top-header">
      <Container className="md:max-w-[820px] md:px-container">
        <nav
          aria-label={ariaLabel}
          className="-mx-container-mobile flex gap-2 overflow-x-auto px-container-mobile py-2 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:py-0 [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((t) => {
            const on = active === t.anchorId
            return (
              <a
                key={t.anchorId}
                href={`#${t.anchorId}`}
                aria-current={on ? 'location' : undefined}
                onClick={(e) => onClick(e, t.anchorId)}
                className={cx(
                  // ix-draw: on hover an ink rule draws in along the (transparent) desktop bottom border; the active
                  // tab keeps its solid border. On the mobile pills the rule sits under the opaque pill border.
                  'ix-draw inline-flex min-h-target shrink-0 items-center rounded-full border-2 border-ink px-4 text-[13px] font-bold whitespace-nowrap text-ink no-underline',
                  'md:min-h-11.5 md:rounded-none md:border-0 md:border-b-2 md:px-[18px] md:py-3.5 md:text-sm',
                  on
                    ? 'bg-ink text-cream md:border-ground-accent md:bg-transparent md:text-ink'
                    : 'md:border-transparent',
                )}
              >
                {t.label}
              </a>
            )
          })}
        </nav>
      </Container>
    </div>
  )
}
