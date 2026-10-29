import config from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { BlockData } from '@/blocks/types'
import { CMSForm, type PayloadFormClassNames } from '@/components/forms'
import { getRequestPath } from '@/lib/requestPath'

/**
 * The hero's form slot (typographic variant, `showForm`): p16 Newsletter
 * "Newsletter hero" signup card and p18 Lead Magnet "Capture state" email row.
 * Server-only helpers; the form itself is the shared CMSForm (client
 * PayloadForm + Turnstile).
 */

export type HeroFormSlot = { id: number; sourcePath?: string; leadMagnetId?: number }

/**
 * Picks the form (the block's own `form`, else `site-settings.newsletterForm`)
 * and checks it still exists with a trusted count (forms are staff-read, so a
 * public request carries a bare id). Missing / deleted / unreadable -> null and
 * the hero renders without the form (logged).
 */
export async function resolveHeroForm(
  value: BlockData<'hero'>['form'],
  leadMagnetId?: number,
): Promise<HeroFormSlot | null> {
  try {
    const payload = await getPayload({ config })
    let id = typeof value === 'object' && value !== null ? value.id : value
    if (typeof id !== 'number') {
      const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: false })
      const fallback = settings.newsletterForm
      id = typeof fallback === 'object' && fallback !== null ? fallback.id : fallback
      if (typeof id !== 'number') {
        console.error('[Hero] form slot on, but no form chosen and no newsletter form in Site settings; hero shown without a form')
        return null
      }
    }
    const { totalDocs } = await payload.count({ collection: 'forms', where: { id: { equals: id } }, overrideAccess: true })
    if (totalDocs === 0) {
      console.error(`[Hero] form ${id} not found (deleted?); hero shown without a form`)
      return null
    }
    return { id, sourcePath: await getRequestPath(), leadMagnetId }
  } catch (error) {
    console.error('[Hero] could not resolve the form; hero shown without a form', error instanceof Error ? error.name : error)
    return null
  }
}

/**
 * Text-like fields: the design shows a placeholder only ("you@store.com"), so a
 * label is hidden visually (kept for screen readers) only when its control HAS
 * a placeholder. Checkbox labels (the lead-magnet newsletter opt-in) stay visible.
 */
const HIDE_PLACEHOLDER_LABEL = '[&>label:has(+input[placeholder])]:sr-only [&>label:has(+textarea[placeholder])]:sr-only'

/** Newsletter.dc.html signup card: input over a full-width Join button (gap 10 mobile / 12 desktop), 52/48px tall. */
const cardForm: PayloadFormClassNames = {
  form: 'flex flex-col',
  fields: 'flex flex-col gap-2.5 md:gap-3',
  field: HIDE_PLACEHOLDER_LABEL,
  control: 'rounded-none! min-h-13! md:min-h-12! md:py-2.5! md:text-[15px]!',
  // Turnstile (interaction-only) is zero-height unless Cloudflare asks for a click; no gap is spent on it.
  turnstile: 'w-full',
  footer: 'mt-2.5 flex flex-col md:mt-3',
  status: 'mb-3 empty:hidden',
  submit: 'w-full min-h-13! md:min-h-12!',
  success: 'text-small',
}

/** Lead Magnet.dc.html capture row: 280px transparent input + button side by side from md (gap 8); stacked full width below. */
const inlineForm: PayloadFormClassNames = {
  form: 'flex flex-col md:flex-row md:flex-wrap md:items-end md:gap-x-2',
  fields: 'flex flex-col gap-2.5 md:w-70',
  field: HIDE_PLACEHOLDER_LABEL,
  control: 'bg-transparent! rounded-none! min-h-13! md:min-h-12! md:py-2.5! md:text-[15px]!',
  turnstile: 'order-last w-full basis-full',
  footer: 'mt-2.5 flex flex-col md:mt-0',
  status: 'mb-3 empty:hidden',
  submit: 'w-full min-h-13! md:min-h-12! md:w-auto',
  success: 'text-small',
}

function Form({ slot, submitLabel, style }: { slot: HeroFormSlot; submitLabel?: string | null; style: 'card' | 'inline' }) {
  return (
    <CMSForm
      form={slot.id}
      sourcePath={slot.sourcePath}
      leadMagnetId={slot.leadMagnetId}
      submitLabel={submitLabel?.trim() || undefined}
      tone="light"
      submitVariant="primary"
      submitSize="md"
      turnstileAppearance="interaction-only"
      classNames={style === 'card' ? cardForm : inlineForm}
    />
  )
}

function Note({ text }: { text?: string | null }) {
  const note = text?.trim()
  return note ? <p className="mt-2.5 text-[0.8125rem] text-gray-warm">{note}</p> : null
}

/** p18 capture: the email row + quiet note, straight under the hero paragraph. */
export function HeroInlineForm({ slot, submitLabel, formNote }: { slot: HeroFormSlot; submitLabel?: string | null; formNote?: string | null }) {
  return (
    <div className="mt-6.5 md:mt-8">
      <Form slot={slot} submitLabel={submitLabel} style="inline" />
      <Note text={formNote} />
    </div>
  )
}

/** p16 signup card: grey box, 2px ink frame, card shadow, own h2 + quiet line. */
export function HeroFormCard({
  slot,
  submitLabel,
  formHeading,
  formBody,
  formNote,
  className,
}: {
  slot: HeroFormSlot
  submitLabel?: string | null
  formHeading?: string | null
  formBody?: string | null
  formNote?: string | null
  className?: string
}) {
  const heading = formHeading?.trim()
  const body = formBody?.trim()
  return (
    <div className={className}>
      <div className="border-2 border-ink bg-gray-light px-5 py-5.5 shadow-card md:p-8">
        {heading ? <h2 className="font-display text-[1.25rem] font-normal uppercase md:text-[1.375rem]">{heading}</h2> : null}
        {body ? <p className="mt-2 text-[0.9375rem] leading-[1.6] whitespace-pre-line text-gray-warm md:mt-2.5">{body}</p> : null}
        <div className={heading || body ? 'mt-4.5 md:mt-5' : undefined}>
          <Form slot={slot} submitLabel={submitLabel} style="card" />
        </div>
        <Note text={formNote} />
      </div>
    </div>
  )
}
