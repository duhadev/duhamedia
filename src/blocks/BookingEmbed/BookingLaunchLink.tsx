'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

/**
 * Client island (the only one in BookingEmbed). Why client: the locked
 * link-out behaviour (DECISIONS §Q option b) needs TWO navigations from one
 * click: the booking page in a new tab AND this tab to the Thank You page.
 * The anchor's native `target="_blank"` opens the booking page (no
 * `window.open`, so popup blockers never interfere and it works without JS);
 * after that, this tab is moved with the router. Without JS, or with no
 * published Thank You page (`thankYouHref` null), it is a plain new-tab link.
 * Every click also bubbles `booking:opened` (BookingFlow listens; elsewhere nothing does).
 */
export function BookingLaunchLink({
  href,
  thankYouHref,
  className,
  children,
}: {
  href: string
  thankYouHref: string | null
  className?: string
  children: React.ReactNode
}) {
  const router = useRouter()
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={(event) => {
        // Tells a surrounding BookingFlow the calendar was opened (it then offers "I've booked my call").
        event.currentTarget.dispatchEvent(new CustomEvent('booking:opened', { bubbles: true }))
        if (!thankYouHref) return
        // Let the default action open the new tab first, then move this tab.
        window.setTimeout(() => router.push(thankYouHref), 0)
      }}
    >
      {children}
    </a>
  )
}
