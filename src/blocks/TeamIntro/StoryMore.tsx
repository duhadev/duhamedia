'use client'

import React, { useId, useState, useSyncExternalStore } from 'react'

const noop = () => () => {}

/**
 * "Read more" for the founder story: the ordinary web pattern. The toggle is a text link that sits
 * directly under the last visible line of the story — under paragraph 1 when closed, under the last
 * paragraph when open — so it travels down with the text. It is a block-level row of its own: an
 * inline toggle shares a line box with the inline-flex CTA that follows the story, which is how it
 * ended up beside "Get in touch" (human, 2026-11-08).
 *
 * The hidden paragraphs are always server-rendered (SEO) and open with a grid-rows 0fr → 1fr
 * transition; reduced motion = instant. Without JS (`scripting: none`) the full text shows and the
 * toggle is hidden. `inert` is applied only after hydration, so no-JS readers are never locked out.
 */
export function StoryMore({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  // false in the server HTML, true once hydrated (no setState-in-effect).
  const hydrated = useSyncExternalStore(noop, () => true, () => false)
  const id = useId()
  return (
    <>
      <div
        id={id}
        inert={hydrated && !open}
        className={`grid transition-[grid-template-rows,opacity] duration-450 ease-out motion-reduce:transition-none [@media(scripting:none)]:grid-rows-[1fr] [@media(scripting:none)]:opacity-100 ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="flex flex-col gap-4 pt-4">{children}</div>
        </div>
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="-my-1 flex min-h-target w-fit cursor-pointer items-center gap-1.5 text-[15px] font-bold text-ink [@media(scripting:none)]:hidden"
      >
        <span className="ix-rule py-1">{open ? 'Show less' : 'Read more'}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className={`size-3.5 transition-transform duration-180 ease-out motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="square"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </>
  )
}
