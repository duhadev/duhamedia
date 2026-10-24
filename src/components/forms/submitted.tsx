'use client'

import React, { createContext, useContext } from 'react'

/**
 * The first word of the `name` the visitor just submitted, shared with the
 * confirmation node PayloadForm renders (server-rendered nodes can't see client
 * state). `null` when the form has no `name` field or it was blank.
 */
const FirstNameContext = createContext<string | null>(null)
/** Heading level of the personalised confirmation heading (h3 under a section h2; h2 when the page has none above). */
const HeadingTagContext = createContext<'h2' | 'h3'>('h3')

export function SubmittedFirstName({
  value,
  headingTag = 'h3',
  children,
}: {
  value: string | null
  headingTag?: 'h2' | 'h3'
  children: React.ReactNode
}) {
  return (
    <HeadingTagContext.Provider value={headingTag}>
      <FirstNameContext.Provider value={value}>{children}</FirstNameContext.Provider>
    </HeadingTagContext.Provider>
  )
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
  const headingTag = useContext(HeadingTagContext)
  if (!firstName) return <>{fallback}</>
  return (
    <>
      <div className="md:hidden">
        {React.createElement(headingTag, null, template.replaceAll('{firstName}', firstName))}
        {personal}
      </div>
      <div className="hidden md:block">{fallback}</div>
    </>
  )
}
