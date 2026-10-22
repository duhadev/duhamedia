import config from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { BlockData } from '@/blocks/types'
import { AccentHeadline, ButtonLink, DotMatrix, Section } from '@/components/ui'
import type { CMSLinkData } from '@/components/ui'
import { fillScarcityTokens } from '@/lib/scarcity'
import type { Scarcity, SiteSetting } from '@/payload-types'

const LOGO_MASK: React.CSSProperties = {
  WebkitMaskImage: "url('/logo-duha.png')",
  maskImage: "url('/logo-duha.png')",
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
}

type Loaded = { scarcity: Partial<Scarcity> | null; defaults: SiteSetting['templateDefaults'] | null }

/** Public Local API reads; a failure is logged and the band degrades (no capacity line, no defaults). */
async function load(needScarcity: boolean): Promise<Loaded> {
  try {
    const payload = await getPayload({ config })
    const [scarcity, settings] = await Promise.all([
      needScarcity ? payload.findGlobal({ slug: 'scarcity', depth: 0, overrideAccess: false }) : null,
      payload.findGlobal({ slug: 'site-settings', depth: 1, overrideAccess: false }),
    ])
    return { scarcity, defaults: settings.templateDefaults ?? null }
  } catch (error) {
    console.error('[FinalCTA] could not read the scarcity / site-settings globals', error)
    return { scarcity: null, defaults: null }
  }
}

/**
 * FinalCTA (Homepage.dc.html "Final CTA", desktop + mobile builds). Server
 * component (async: reads the scarcity global at render, so capacity is edited
 * in one place). Loud/quiet contract: the capacity statement renders loud with
 * its reason quiet beneath; a missing/blank reason or an unfillable token skips
 * the line entirely (logged), never a bare number.
 */
export async function FinalCTABlock({ heading, accentPhrase, body, capacity, buttons }: BlockData<'finalCTA'>) {
  const key = capacity ?? 'none'
  const { scarcity, defaults } = await load(key !== 'none')

  const title = heading?.trim() || defaults?.finalCtaHeading?.trim() || ''
  const accent = heading?.trim() ? accentPhrase : null
  if (!title) console.error('[FinalCTA] no heading set and no default in Site settings > Default closing sections')

  const rows = (buttons ?? []).slice(0, 2)
  const links: { id: string; link: CMSLinkData }[] = rows.length
    ? rows.map((b, i) => ({ id: b.id ?? String(i), link: b.link }))
    : defaults?.finalCtaButton
      ? [{ id: 'default', link: defaults.finalCtaButton as CMSLinkData }]
      : []

  let statistic: string | null = null
  let reason: string | null = null
  if (key !== 'none' && scarcity) {
    const row = scarcity.statements?.find((s) => s.key === key)
    const text = row ? fillScarcityTokens(row.statistic, scarcity) : null
    const why = row?.reason?.trim()
    if (!row || !text) {
      console.error(`[FinalCTA] scarcity statement "${key}" is missing or has unfilled counts; capacity line skipped`)
    } else if (!why) {
      console.error(`[FinalCTA] scarcity statement "${key}" has no reason; capacity line skipped (no bare numbers)`)
    } else {
      statistic = text
      reason = why
    }
  }

  return (
    <Section tone="dark" pad="none" className="relative overflow-hidden pt-16 pb-18 md:py-24">
      <DotMatrix fade="edges" onDark />
      <div
        aria-hidden="true"
        style={LOGO_MASK}
        className="pointer-events-none absolute -bottom-22.5 -left-22.5 z-0 size-55 bg-ground-accent md:-bottom-25 md:-left-25 md:size-60"
      />
      <div className="relative z-10 mx-auto max-w-190 px-container-mobile text-center md:px-container">
        {title ? <AccentHeadline text={title} accent={accent} level={2} accentColor="ground" /> : null}
        {body?.trim() ? <p className="mt-4.5 text-body-mobile opacity-85 md:mt-5 md:text-body">{body}</p> : null}
        {statistic && reason ? (
          <div className="mt-4.5 md:mt-5">
            <p className="text-body-mobile font-bold md:text-body">{statistic}</p>
            <p className="mt-1 text-small-mobile opacity-70 md:text-small">{reason}</p>
          </div>
        ) : null}
        {links.length ? (
          <div className="mt-7 flex flex-col items-center justify-center gap-3 md:mt-8 md:flex-row md:gap-3.5">
            {links.map((b, i) => (
              <ButtonLink
                key={b.id}
                link={b.link}
                variant="ghost-light"
                size="md"
                className={`w-full justify-center md:w-auto md:min-w-55${i > 0 ? ' border-cream/50' : ''}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </Section>
  )
}
