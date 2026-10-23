'use client'

import React, { createContext, useContext } from 'react'

/**
 * The first word of the `name` the visitor just submitted, shared with the
 * confirmation node PayloadForm renders (server-rendered nodes can't see client
 * state). `null` when the form has no `name` field or it was blank.
 */
const FirstNameContext = createContext<string | null>(null)

export function SubmittedFirstName({ value, children }: { value: string | null; children: React.ReactNode }) {
  return <FirstNameContext.Provider value={value}>{children}</FirstNameContext.Provider>
}

/**
 * A confirmation that addresses the visitor. `template` holds `{firstName}`; with
 * a submitted name the personalised `heading` + `personal` body show on phones
 * (`md:hidden`) and `fallback` (the form's own message, untouched) from md up;
 * with no name only `fallback` renders. Both nodes are server-rendered by the caller.
 */
export function PersonalConfirmation({
  template,
  personal,
  fallback,
}: {
  template: string
  personal: React.ReactNode
  fallback: React.ReactNode
}) {
  const firstName = useContext(FirstNameContext)
  if (!firstName) return <>{fallback}</>
  return (
    <>
      <div className="md:hidden">
        <h3>{template.replaceAll('{firstName}', firstName)}</h3>
        {personal}
      </div>
      <div className="hidden md:block">{fallback}</div>
    </>
  )
}
