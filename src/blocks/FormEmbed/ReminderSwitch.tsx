'use client'

import { useSearchParams } from 'next/navigation'
import React from 'react'

/**
 * Client island for the `reminder` variant (p10): blocks receive only their
 * own data (RenderBlocks passes the row), not the page's searchParams, so
 * `?homework=done` is read here with `useSearchParams`. Both states are
 * server-rendered and passed in; this only picks one. No <Suspense> on purpose:
 * the (frontend) segment is force-dynamic, so useSearchParams never bails out of a
 * static prerender, and a Suspense fallback of `pending` would put the same form
 * (same ids) into the streamed HTML twice. If the router ever passes
 * searchParams to blocks, this can become a server-side branch.
 */
export function ReminderSwitch({ pending, done }: { pending: React.ReactNode; done: React.ReactNode }) {
  const params = useSearchParams()
  return <>{params.get('homework') === 'done' ? done : pending}</>
}
