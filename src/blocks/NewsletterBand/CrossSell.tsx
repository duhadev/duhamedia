import config from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { ButtonLink, Eyebrow, resolveLinkHref, Section } from '@/components/ui'
import { splitAccentPhrase } from '@/lib/accentPhrase'
import { docPath } from '@/lib/docPath'
import type { BlockData } from '@/blocks/types'

type Data = BlockData<'newsletterBand'>

/** Stable anchor: the lead-magnet template moves focus here after a submit. */
export const DELIVERED_HEADING_ID = 'lead-magnet-delivered'

async function loadDefaults() {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: false })
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'newsletter' } },
      limit: 1,
      depth: 0,
      overrideAccess: false,
      draft: false,
    })
    return { defaults: settings.templateDefaults ?? null, newsletterHref: docPath('pages', docs[0]) }
  } catch (error) {
    console.error('[NewsletterBand cross-sell] could not read site-settings / pages', error)
    return { defaults: null, newsletterHref: null }
  }
}

/**
 * NewsletterBand `cross-sell` (Lead Magnet "Delivered state", desktop + mobile).
 * The headline is an h2 at h1 scale (the page keeps its one h1), focusable
 * (tabIndex -1) with a stable id so the template can move focus after submit.
 * Never renders an asset/download link: the asset is emailed only. Link-only
 * (no inline form), as designed. No usable link and no default Newsletter page
 * -> the delivered message alone (box omitted). No heading -> renders nothing.
 */
export async function NewsletterCrossSell({ delivered, heading, line, buttonLabel, crossSellLink }: Data) {
  const title = delivered?.heading?.trim()
  if (!title) {
    console.error('[NewsletterBand cross-sell] no delivered heading; rendering nothing')
    return null
  }
  const { defaults, newsletterHref } = await loadDefaults()

  const ownHeading = heading?.trim()
  const boxTitle = ownHeading || defaults?.newsletterHeading?.trim() || ''
  const boxLine = line?.trim() || (ownHeading ? '' : defaults?.newsletterLine?.trim() || '')
  const linkOk = crossSellLink ? resolveLinkHref(crossSellLink) : null
  const href = linkOk ?? newsletterHref
  const btn = buttonLabel?.trim()
  const label = crossSellLink?.label?.trim() || (btn && btn !== 'Join' ? btn : 'Join the newsletter')
  const link = linkOk && crossSellLink ? { ...crossSellLink, label } : href ? { type: 'custom' as const, url: href, label } : null
  const showBox = Boolean(boxTitle && link)
  const parts = splitAccentPhrase(title, delivered?.accentPhrase)
  const lead = showBox ? delivered?.crossSellLine?.trim() : undefined

  return (
    <Section tone="light" pad="none" className="py-14 md:py-24" aria-labelledby={DELIVERED_HEADING_ID}>
      {/* same 820px column + padding as the Lead Magnet capture hero (Wrap in Hero/Component.tsx), so both left edges line up */}
      <div className="mx-auto w-full max-w-205 px-container-mobile md:px-container">
        <div>
        {delivered?.eyebrow?.trim() ? <Eyebrow tick>{delivered.eyebrow}</Eyebrow> : null}
        <h2
          id={DELIVERED_HEADING_ID}
          tabIndex={-1}
          className="mt-4 font-display text-h2-mobile font-normal uppercase tracking-headline text-balance outline-none md:mt-5 md:text-h1"
        >
          {parts ? (
            <>
              {parts[0]}
              <span className="text-accent-primary">{parts[1]}</span>
              {parts[2]}
            </>
          ) : (
            title
          )}
        </h2>
        {delivered?.body?.trim() || lead ? (
          <p className="mt-5 max-w-[52ch] text-[1.0625rem] leading-[1.6] md:mt-6 md:text-body">
            {[delivered?.body?.trim(), lead].filter(Boolean).join(' ')}
          </p>
        ) : null}
        {showBox ? (
          <div className="mt-6 flex flex-col gap-4 border-2 border-ink bg-gray-light p-5 py-6 md:mt-8 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-6 md:p-7">
            <div>
              <h3 className="font-display text-[1.375rem] font-normal uppercase md:text-h3">{boxTitle}</h3>
              {boxLine ? <p className="mt-2 text-small text-gray-warm">{boxLine}</p> : null}
            </div>
            <ButtonLink link={link} variant="dark" size="md" className="w-full md:w-auto" />
          </div>
        ) : null}
        </div>
      </div>
    </Section>
  )
}
