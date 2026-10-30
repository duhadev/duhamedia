'use client'

import React, { useId, useState } from 'react'

/**
 * "Read more" for the founder story. Client: the toggle must sit BELOW the revealed text, which
 * a native <details> cannot do (its <summary> always renders first). The hidden paragraphs stay
 * server-rendered in the DOM (inert while closed) and open with a grid-rows 0fr → 1fr transition;
 * reduced motion = instant.
 */
export function StoryMore({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <>
      <div
        id={id}
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-450 ease-out motion-reduce:transition-none ${
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
        className="mt-3 inline-flex min-h-target cursor-pointer items-center gap-2 font-bold text-ink"
      >
        <span className="ix-rule py-1">{open ? 'Show less' : 'Read more'}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className={`size-4 transition-transform duration-180 ease-out ${open ? 'rotate-180' : ''}`}
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
