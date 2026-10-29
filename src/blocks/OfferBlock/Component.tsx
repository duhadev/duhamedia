import config from '@payload-config'
import { getPayload } from 'payload'
import React, { useId } from 'react'

import type { BlockData } from '@/blocks/types'
import { AccentHeadline, ButtonLink, Container, Eyebrow, resolveLinkHref, Section } from '@/components/ui'
import { RichText } from '@/components/RichText'
import { fillScarcityTokens } from '@/lib/scarcity'
import type { Scarcity } from '@/payload-types'

/** The generated `offerBlock` row type (src/payload-types.ts `OfferBlockBlock`). */
export type OfferBlockData = BlockData<'offerBlock'>

type Resolved = { statistic: string; reason: string }

/** Public Local API read of the scarcity global; a failure or a bad row is logged and the capacity line is skipped. */
async function resolveCapacity(key: string): Promise<Resolved | null> {
  let scarcity: Scarcity
  try {
    const payload = await getPayload({ config })
    scarcity = await payload.findGlobal({ slug: 'scarcity', depth: 0, overrideAccess: false })
  } catch (error) {
    console.error('[OfferBlock] could not read the scarcity global; capacity line skipped', error)
    return null
  }
  const row = scarcity.statements?.find((s) => s.key === key)
  const statistic = row ? fillScarcityTokens(row.statistic, scarcity) : null
  if (!row || !statistic) {
    console.error(`[OfferBlock] scarcity statement "${key}" is missing or has unfilled counts; capacity line skipped`)
    return null
  }
  const reason = row.reason?.trim()
  if (!reason) {
    console.error(`[OfferBlock] scarcity statement "${key}" has no reason; capacity line skipped (no bare numbers)`)
    return null
  }
  return { statistic, reason }
}

/**
 * OfferBlock (Campaign LP.dc.html "Offer block", desktop + mobile builds). Server component, async:
 * the capacity line is read from the scarcity global at render, so it is edited in one place.
 * Loud/quiet contract: statistic loud, its reason quiet beneath; a missing/blank reason or an
 * unfillable token drops the line entirely, there is no reason-less render path. The design draws
 * only a small grey line here; rule 2 wins (loud statistic + quiet reason).
 */
export async function OfferBlockBlock(props: OfferBlockData) {
  const key = props.capacity && props.capacity !== 'none' ? props.capacity : null
  const capacity = key ? await resolveCapacity(key) : null
  return <OfferView {...props} resolved={capacity} />
}

/** Presentational half (also lets the showcase/preview render a resolved capacity line directly). */
export function OfferView({ eyebrow, eyebrowTick, heading, accentPhrase, body, cta, resolved }: OfferBlockData & { resolved: Resolved | null }) {
  const title = heading?.trim()
  const hasBody = Boolean(body?.root?.children?.length)
  const eyebrowText = eyebrow?.trim()
  const linked = Boolean(resolveLinkHref(cta) && cta?.label?.trim())
  if (!title && !hasBody) return null

  return (
    <Section tone="light" pad="none" className="py-12 md:py-section-tight">
      <Container className="md:max-w-205">
        {eyebrowText ? (
          <Eyebrow muted tick={Boolean(eyebrowTick)}>
            {eyebrowText}
          </Eyebrow>
        ) : null}
        {title ? (
          <AccentHeadline
            text={title}
            accent={accentPhrase}
            level="section"
            className={eyebrowText ? 'mt-3.5 md:mt-4' : undefined}
          />
        ) : null}
        {hasBody ? (
          <RichText
            data={body}
            className="mt-4 text-base leading-[1.6] md:mt-5 md:text-[1.0625rem] [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:m-0 [&_p+p]:mt-4 [&_ul]:list-disc [&_ul]:pl-5"
            linkClassName="ix-rule no-underline"
            disableContainer
          />
        ) : null}
        {linked || resolved ? (
          <div className="mt-6 flex flex-col gap-3 md:mt-8 md:flex-row md:items-center md:gap-4">
            {linked ? <ButtonLink link={cta} variant="primary" size="md" className="w-full md:w-auto md:min-w-40" /> : null}
            {resolved ? <Capacity statistic={resolved.statistic} reason={resolved.reason} /> : null}
          </div>
        ) : null}
      </Container>
    </Section>
  )
}

/** Loud statistic + quiet reason as one group for assistive tech (F55). Own component for `useId`. */
function Capacity({ statistic, reason }: Resolved) {
  const uid = useId()
  return (
    <div role="group" aria-labelledby={`${uid}-s`} aria-describedby={`${uid}-r`}>
      <p id={`${uid}-s`} className="m-0 text-[0.9375rem] font-bold leading-[1.3]">
        {statistic}
      </p>
      <p id={`${uid}-r`} className="m-0 mt-0.5 text-[0.8125rem] leading-[1.4] text-gray-warm">
        {reason}
      </p>
    </div>
  )
}
