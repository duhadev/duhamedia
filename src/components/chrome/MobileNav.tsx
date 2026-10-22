'use client'

/**
 * The only client code in the chrome (B1). Reason: the mobile menu toggle needs
 * state, the Escape key and focus return, none of which a server component can
 * do. The panel's CONTENT (links + CTA) is rendered on the server and passed in
 * as `children`, so no link data crosses into the client bundle.
 *
 * Disclosure pattern: button[aria-expanded][aria-controls] + a panel that is
 * `hidden` while closed. Esc closes and returns focus to the button; following a
 * link (path change) closes it. The panel hangs directly under the sticky bar
 * (absolute, full width) so it looks exactly like SiteHeaderMobile.dc.html's
 * panel without shifting the page down. It is short (links + CTA) and not a
 * modal overlay, so there is no body scroll lock and no focus trap.
 */
import { usePathname } from 'next/navigation'
import React, { useEffect, useId, useRef, useState } from 'react'

export function MobileNav({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [seenPath, setSeenPath] = useState<string | null>(null)
  const pathname = usePathname()
  const panelId = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close after navigating (adjust state during render, per React docs).
  if (pathname !== seenPath) {
    setSeenPath(pathname)
    if (open) setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      buttonRef.current?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Menu"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="-mr-2.5 flex size-11 cursor-pointer flex-col justify-center gap-1.25 border-0 bg-transparent px-2.5 md:hidden"
      >
        <span className="block h-0.5 bg-ink" />
        <span className="block h-0.5 bg-ink" />
        <span className="block h-0.5 bg-ink" />
      </button>
      <div id={panelId} hidden={!open} className="absolute inset-x-0 top-full md:hidden">
        {children}
      </div>
    </>
  )
}
