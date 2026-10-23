import React from 'react'

import { HeroBlock } from '@/blocks/Hero/Component'
import { DELIVERED_HEADING_ID } from '@/blocks/NewsletterBand/CrossSell'
import { NewsletterBandBlock } from '@/blocks/NewsletterBand/Component'
import { SpecLedgerBlock } from '@/blocks/SpecLedger/Component'
import type { BlockData } from '@/blocks/types'
import { PageShell } from '@/components/chrome'
import { LeadMagnetStates } from '@/components/LeadMagnetStates'
import type { PublicLeadMagnet } from '@/lib/leadMagnets'

/**
 * The p18 Lead Magnet template (S6-T2, SCHEMA §6.8 + §9 p18, Lead Magnet.dc.html):
 * one `lead-magnets` doc fed into the EXISTING block components, no visual code
 * of its own. Logo-only header, legal-only footer (template behaviour, not fields).
 *
 * Capture state: 1 Hero `typographic` compact/narrow with the inline capture
 * form (`leadMagnetId` ties the submission to this asset; the server accepts
 * it only for a published lead magnet whose capture form is this form) →
 * 2 SpecLedger `list` ("What's inside"). Delivered state (replaces 1–2 after a
 * successful submit, LeadMagnetStates island): 3 NewsletterBand `cross-sell`
 * fed from `deliveredState` (its h2 at h1 scale, focus target).
 *
 * NEVER renders the asset or a download link (SCHEMA Delta 2026-10-18 (1)):
 * the doc type here has no `asset` / `deliveryEmail`; the asset is emailed by
 * the `lead_magnet` delivery unit only.
 */
const formIdOf = (form: PublicLeadMagnet['form'] | null | undefined): number | null =>
  typeof form === 'number' ? form : typeof form === 'object' && form !== null ? form.id : null

export function LeadMagnetView({ doc }: { doc: PublicLeadMagnet }) {
  const formId = formIdOf(doc.form)

  const hero: BlockData<'hero'> = {
    blockType: 'hero',
    variant: 'typographic',
    size: 'compact',
    width: 'narrow',
    eyebrow: doc.eyebrow,
    heading: doc.title,
    accentPhrase: doc.accentPhrase,
    body: doc.pitch,
    badge: { show: false },
    // No form chosen (draft) → no slot at all: the Hero's empty-form fallback
    // is the newsletter form, which must never stand in for a capture form.
    showForm: formId !== null,
    form: formId,
    formStyle: 'inline',
    formNote: doc.formNote,
  }

  const inside: BlockData<'specLedger'> = {
    blockType: 'specLedger',
    variant: 'list',
    tone: 'auto',
    eyebrow: doc.whatsInsideHeading,
    eyebrowTick: false,
    items: (doc.valueBullets ?? []).map((b) => ({ id: b.id, title: b.text })),
  }

  const deliveredHeading = doc.deliveredState?.heading?.trim()
  const delivered: BlockData<'newsletterBand'> | null = deliveredHeading
    ? { blockType: 'newsletterBand', variant: 'cross-sell', delivered: doc.deliveredState }
    : null

  return (
    <PageShell header="logo-only" footer="legal-only">
      <main>
        <LeadMagnetStates
          formId={formId}
          headingId={DELIVERED_HEADING_ID}
          capture={
            <>
              <HeroBlock {...hero} leadMagnetId={doc.id} />
              <SpecLedgerBlock {...inside} />
            </>
          }
          delivered={delivered ? <NewsletterBandBlock {...delivered} /> : null}
        />
      </main>
    </PageShell>
  )
}
