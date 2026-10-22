'use client'

// Client island: scroll-spy (IntersectionObserver + scroll offset math) and
// smooth scrolling need browser APIs and state for aria-current.
import React, { useEffect, useState } from 'react'

import { Container } from '@/components/ui'
import { cx } from '@/lib/cx'

import type { CategoryTab } from './Component'

// Header (60 mobile / 72 desktop) + this bar (~44 / 46) + breathing room.
const spyOffset = () => (window.matchMedia('(min-width: 768px)').matches ? 72 + 46 + 24 : 60 + 56 + 16)
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function CategoryTabsNav({ ariaLabel, tabs }: { ariaLabel: string; tabs: CategoryTab[] }) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const targets = tabs
      .map((t) => document.getElementById(t.anchorId))
      .filter((el): el is HTMLElement => el !== null)
    if (targets.length === 0) return
    const update = () => {
      const off = spyOffset()
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
  }, [tabs])

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id)
    if (!el) return // missing target: let the browser handle the hash
    e.preventDefault()
    const top = el.getBoundingClientRect().top + window.scrollY - (spyOffset() - 16)
    window.scrollTo({ top, behavior: reduced() ? 'auto' : 'smooth' })
    history.replaceState(null, '', `#${id}`)
    setActive(id)
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
                aria-current={on ? 'true' : undefined}
                onClick={(e) => onClick(e, t.anchorId)}
                className={cx(
                  'inline-flex min-h-target shrink-0 items-center rounded-full border-2 border-ink px-4 text-[13px] font-bold whitespace-nowrap text-ink no-underline',
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
