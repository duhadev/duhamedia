'use client'

import React, { useEffect, useRef, useState } from 'react'

/** Fired (bubbling) by PayloadForm on the `<form>` element after a successful JS submit. */
export const CMSFORM_SUBMITTED_EVENT = 'cmsform:submitted'

/**
 * p18 Lead Magnet state switch (S6-T2, SCHEMA §9 p18 "replaces 1–2 after
 * submit"). Client island because it reacts to the capture form's success:
 * PayloadForm dispatches `cmsform:submitted` on its `<form>`; when the event's
 * `formId` is this lead magnet's capture form, the capture sections (Hero +
 * What's inside) are swapped for the delivered state and focus moves to the
 * delivered heading (`headingId`, focusable `tabIndex=-1` h2), so screen
 * readers announce the outcome and keyboard users start from it.
 *
 * Both states are server-rendered nodes passed in as props; the delivered one
 * is mounted only after the swap (no hidden duplicate heading before submit).
 * No JS / before hydration: the form posts normally and the form-submit
 * route's own success response shows. `delivered` null (no delivered heading
 * in a draft) → no swap: the form's own confirmation shows in place.
 */
export function LeadMagnetStates({
  formId,
  headingId,
  capture,
  delivered,
}: {
  formId: number | null
  headingId: string
  capture: React.ReactNode
  delivered: React.ReactNode | null
}) {
  const [done, setDone] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root || !delivered || formId === null) return
    const onSubmitted = (event: Event) => {
      const detail = (event as CustomEvent<{ formId?: unknown }>).detail
      if (detail?.formId === formId) setDone(true)
    }
    root.addEventListener(CMSFORM_SUBMITTED_EVENT, onSubmitted)
    return () => root.removeEventListener(CMSFORM_SUBMITTED_EVENT, onSubmitted)
  }, [delivered, formId])

  useEffect(() => {
    if (done) document.getElementById(headingId)?.focus()
  }, [done, headingId])

  return <div ref={rootRef}>{done ? delivered : capture}</div>
}
