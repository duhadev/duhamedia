'use client'

import React from 'react'

/**
 * "Send another" on the stepped phone confirmation (Contact.dc.html mobile
 * step 5). Client island: a click handler. The form's sent state lives inside
 * PayloadForm, which has no reset, so a reload gives a fresh, empty form (a
 * second submission needs a fresh Turnstile token anyway).
 */
export function SendAnother({ label, className }: { label: string; className?: string }) {
  return (
    <button type="button" onClick={() => window.location.reload()} className={className}>
      <svg aria-hidden="true" viewBox="0 0 256 256" fill="currentColor" className="size-5 shrink-0">
        <path d="M228,128a100,100,0,0,1-98.66,100H128a99.39,99.39,0,0,1-68.62-27.29,12,12,0,0,1,16.48-17.45,76,76,0,1,0-1.57-109c-.13.13-.25.25-.39.37L54.89,92H72a12,12,0,0,1,0,24H24a12,12,0,0,1-12-12V56a12,12,0,0,1,24,0V76.72L57.48,57.06A100,100,0,0,1,228,128Z" />
      </svg>
      {label}
    </button>
  )
}
