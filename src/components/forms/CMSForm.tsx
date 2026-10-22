import 'server-only'

import config from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { RichText } from '@/components/RichText'
import { getTurnstileSiteKey } from '@/integrations/turnstile'
import type { Form } from '@/payload-types'

import { PayloadForm, type PayloadFormProps } from './PayloadForm'
import { toPublicForm } from './publicForm'

/**
 * Server wrapper for `PayloadForm`: what blocks (NewsletterBand, FormEmbed,
 * the lead-magnet capture, the footer nudge) render.
 *
 * - Loads the form by id with a trusted read (forms are staff-read, so a
 *   relationship populated in a public request arrives as a bare id).
 *   Always re-read here even when a populated doc is passed, so a client
 *   never receives `emails` or integration settings (`toPublicForm`).
 * - Reads `TURNSTILE_SITE_KEY` at request time (no NEXT_PUBLIC_*).
 * - Renders the rich-text confirmation and `message` blocks on the server and
 *   hands them to the client as nodes.
 * - Renders nothing when the form is missing (deleted / not chosen yet); the
 *   calling block owns any designed empty state.
 */
export type CMSFormProps = Omit<PayloadFormProps, 'form' | 'siteKey' | 'confirmation' | 'messages'> & {
  /** The block's form relationship value (id or populated doc). */
  form: number | Form | null | undefined
  /** Replace the form's own confirmation message (e.g. a block's designed success state). */
  confirmation?: React.ReactNode
}

async function loadForm(value: CMSFormProps['form']): Promise<Form | null> {
  const id = typeof value === 'object' && value !== null ? value.id : value
  if (typeof id !== 'number') return null
  try {
    const payload = await getPayload({ config })
    return await payload.findByID({ collection: 'forms', id, depth: 1, disableErrors: true, overrideAccess: true })
  } catch (error) {
    console.error('[CMSForm] could not load form; rendering nothing', error instanceof Error ? error.name : error)
    return null
  }
}

export async function CMSForm({ form: formValue, confirmation, ...rest }: CMSFormProps) {
  const form = await loadForm(formValue)
  if (!form) return null

  const messages: Record<string, React.ReactNode> = {}
  for (const [index, field] of (form.fields ?? []).entries()) {
    if (field.blockType === 'message' && field.message) {
      messages[field.id ?? `message-${index}`] = <RichText data={field.message} disableContainer />
    }
  }

  const confirmationNode =
    confirmation ??
    (form.confirmationType !== 'redirect' && form.confirmationMessage ? (
      <RichText data={form.confirmationMessage} disableContainer />
    ) : undefined)

  return (
    <PayloadForm
      {...rest}
      form={toPublicForm(form)}
      siteKey={getTurnstileSiteKey()}
      confirmation={confirmationNode}
      messages={messages}
    />
  )
}
