'use client'

import { useSearchParams } from 'next/navigation'
import React, { Suspense } from 'react'

/**
 * Client island for the `reminder` variant (p10): blocks receive only their
 * own data (RenderBlocks passes the row), not the page's searchParams, so
 * `?homework=done` is read here with `useSearchParams`. Both states are
 * server-rendered and passed in; this only picks one. If the router ever passes
 * searchParams to blocks, this can become a server-side branch.
 */
function Switch({ pending, done }: { pending: React.ReactNode; done: React.ReactNode }) {
  const params = useSearchParams()
  return <>{params.get('homework') === 'done' ? done : pending}</>
}

export function ReminderSwitch({ pending, done }: { pending: React.ReactNode; done: React.ReactNode }) {
  // Suspense: required by Next for useSearchParams outside a dynamic render; the
  // fallback is the form (the safe default: a visitor can always send it).
  return (
    <Suspense fallback={pending}>
      <Switch pending={pending} done={done} />
    </Suspense>
  )
}
