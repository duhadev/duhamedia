import config from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { BlockData } from '@/blocks/types'

import { Container, Section } from '@/components/ui'
import { cx } from '@/lib/cx'
import type { SiteSetting } from '@/payload-types'

import { mapStamp, ServiceAreaMap } from './ServiceAreaMap'

/** The generated `directContact` row type (src/payload-types.ts `DirectContactBlock`). */
export type DirectContactData = BlockData<'directContact'>

async function loadSettings(): Promise<Partial<SiteSetting>> {
  try {
    const payload = await getPayload({ config })
    return await payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: false })
  } catch (error) {
    console.error('[DirectContact] could not read site-settings; rendering without contact details', error)
    return {}
  }
}

const LABEL =
  'font-mono text-[11px] uppercase tracking-[0.12em] text-gray-warm md:font-body md:text-label md:font-bold md:tracking-eyebrow md:text-ink'
const VALUE = 'text-[0.9375rem] font-bold md:text-body md:font-medium'
const ROW = 'flex justify-between gap-3 md:block md:border-t-2 md:border-ink md:pt-3.5'

const ICON = 'size-5 shrink-0'
function SocialIcon({ platform }: { platform: string }) {
  const common = { 'aria-hidden': true, className: ICON, viewBox: '0 0 24 24' } as const
  switch (platform) {
    case 'linkedin':
      return (
        <svg {...common} fill="currentColor">
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
        </svg>
      )
    case 'x':
      return (
        <svg {...common} fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    case 'facebook':
      return (
        <svg {...common} fill="currentColor">
          <path d="M14 8V6.3c0-.8.2-1.3 1.4-1.3H17V1.5C16.6 1.4 15.6 1.3 14.6 1.3 12 1.3 10 2.9 10 5.9V8H7v4h3v10.5h4V12h3l.5-4z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'youtube':
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2.5" y="5" width="19" height="14" rx="4" />
          <path d="M10 9.5v5l4.5-2.5z" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'github':
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
        </svg>
      )
    default:
      return null
  }
}

const ExternalCue = () => (
  <svg aria-hidden="true" viewBox="0 0 256 256" fill="currentColor" className="size-3 shrink-0 text-gray-warm">
    <path d="M200 64v104a8 8 0 0 1-16 0V83.3L69.7 197.7a8 8 0 0 1-11.4-11.4L172.7 72H88a8 8 0 0 1 0-16h104a8 8 0 0 1 8 8z" />
  </svg>
)

/** Caption built from Site settings > Location when the editor leaves the caption empty. Missing parts are omitted; nothing if all are missing. */
function autoCaption(locality?: string | null, region?: string | null, radius?: number | null): string | null {
  const place = [locality?.trim(), region?.trim()].filter(Boolean).join(', ')
  const miles = radius && radius > 0 ? Math.round(radius) : 0
  const parts = [
    place ? `Based in ${place}` : '',
    miles ? `${place ? 'serving clients' : 'Serving clients'} within about ${miles} ${miles === 1 ? 'mile' : 'miles'}` : '',
  ].filter(Boolean)
  return parts.length ? `${parts.join(', ')}.` : null
}

/**
 * DirectContact (Contact.dc.html "Direct info + map" desktop / "Direct line"
 * mobile; one section at both breakpoints). Server component, no
 * interactivity: async because email, socials, location and coordinates are
 * read from the `site-settings` global at render (public Local API read). The
 * map is a static SVG (see ServiceAreaMap). Rows with no value are omitted; if
 * no row and no map would render, the block renders nothing and warns.
 */
export async function DirectContactBlock({ showEmail, showSocials, showLocation, skipFormLine, rowLabels, map }: DirectContactData) {
  const s = await loadSettings()

  const email = showEmail !== false ? s.contactEmail?.trim() || null : null
  const reply = email ? s.responseTimeNote?.trim() || null : null
  const socials =
    showSocials !== false
      ? (s.socials ?? []).filter((x) => x?.handle?.trim() && /^https?:\/\//i.test(x.url ?? ''))
      : []
  const loc = s.location
  const locationText =
    showLocation !== false ? loc?.displayLine?.trim() || [loc?.locality, loc?.region].filter(Boolean).join(', ') || null : null

  // The map needs a centre and a service radius from Site settings; nothing is invented when they are missing.
  const lat = typeof loc?.latitude === 'number' ? loc.latitude : null
  const lon = typeof loc?.longitude === 'number' ? loc.longitude : null
  const radius = loc?.serviceRadiusMiles && loc.serviceRadiusMiles > 0 ? loc.serviceRadiusMiles : null
  const mapReady = lat !== null && lon !== null && radius !== null
  const showMap = map?.show !== false && mapReady
  if (map?.show !== false && !mapReady) {
    console.warn('[DirectContact] map hidden: Site settings → Location needs latitude, longitude and service radius')
  }
  const hasInfo = Boolean(email || socials.length || locationText)
  if (!hasInfo && !showMap) {
    console.warn('[DirectContact] every row is off (or has no value in Site settings) and the map is hidden; rendering nothing')
    return null
  }

  const zoom = Math.min(2, Math.max(0.5, map?.zoom ?? 1))
  const placeName = loc?.locality?.trim() || ''
  const caption = map?.caption?.trim() || autoCaption(loc?.locality, loc?.region, loc?.serviceRadiusMiles)
  const mapProps = mapReady
    ? {
        lat,
        lon,
        radiusMiles: radius,
        zoom,
        placeName,
        description: `Schematic map: ${placeName ? `${placeName} marked` : 'Location marked'} at the centre of a ${Math.round(radius)}-mile service-area ring, with Chicago, O'Hare, Schaumburg, Naperville, Aurora and Joliet for reference, and Lake Michigan to the east.${caption ? ` ${caption}` : ''}`,
      }
    : null
  const stamp = mapReady
    ? placeName
      ? mapStamp(placeName, lat, lon)
      : `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'} ${Math.abs(lon).toFixed(2)}°${lon >= 0 ? 'E' : 'W'}`
    : ''
  const skip = skipFormLine?.trim()

  return (
    <Section tone="light" pad="none" className="py-12 md:py-section">
      <Container className={cx('grid items-start gap-8 md:gap-12', hasInfo && showMap && 'lg:grid-cols-[1fr_1.4fr]')}>
        {hasInfo && (
          <div className="flex flex-col gap-5 border-t-2 border-ink pt-[22px] md:gap-6 md:border-t-0 md:pt-0">
            {email && skip && <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-gray-warm md:hidden">{skip}</span>}
            {email && (
              <div className="md:border-t-2 md:border-ink md:pt-3.5">
                <span className={cx(LABEL, 'hidden md:block')}>{rowLabels?.email}</span>
                <a
                  href={`mailto:${email}`}
                  className="flex min-h-target items-center font-display text-[1.25rem] font-normal uppercase leading-[1.05] text-ink no-underline [overflow-wrap:anywhere] md:-mb-3 md:-mt-[6.5px] md:font-body md:text-body md:font-medium md:normal-case md:underline md:underline-offset-4"
                >
                  {email}
                </a>
              </div>
            )}
            {email && (locationText || reply) && <div aria-hidden="true" className="h-0.5 bg-divider md:hidden" />}
            {socials.length > 0 && (
              <div className="order-last mt-1 flex flex-col gap-2.5 border-t-2 border-divider pt-[18px] md:order-none md:mt-0 md:border-ink md:pt-3.5">
                <span className={cx(LABEL, 'hidden md:block')}>{rowLabels?.socials}</span>
                <ul className="flex flex-col gap-2.5 md:mt-1.5 md:flex-row md:flex-wrap md:gap-x-6 md:gap-y-1">
                  {socials.map((x, i) => (
                    <li key={`${x.platform}-${i}`}>
                      <a
                        href={x.url}
                        target="_blank"
                        rel="noopener noreferrer me"
                        className="flex min-h-target items-center gap-3 text-ink no-underline md:gap-2"
                      >
                        <SocialIcon platform={x.platform} />
                        <span className={VALUE}>{x.handle}</span>
                        <ExternalCue />
                        <span className="sr-only"> ({x.platform}, opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {locationText && (
              <div className={ROW}>
                <span className={LABEL}>{rowLabels?.location}</span>
                <span className={cx(VALUE, 'text-right md:mt-1.5 md:block md:text-left')}>{locationText}</span>
              </div>
            )}
            {reply && (
              <div className={ROW}>
                <span className={LABEL}>{rowLabels?.replyTime}</span>
                <span className={cx(VALUE, 'text-right md:mt-1.5 md:block md:text-left')}>{reply}</span>
              </div>
            )}
          </div>
        )}

        {showMap && mapProps && (
          <figure className="m-0">
            <div className="relative h-[360px] overflow-hidden border-2 border-ink bg-gray-light md:h-[340px]">
              <div className="size-full sm:hidden">
                <ServiceAreaMap size="mobile" {...mapProps} />
              </div>
              <div className="hidden size-full sm:block">
                <ServiceAreaMap size="desktop" {...mapProps} />
              </div>
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 bg-ink px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-cream"
              >
                {stamp}
              </span>
            </div>
            {caption && <figcaption className="mt-3.5 text-[0.9375rem] leading-normal text-gray-warm">{caption}</figcaption>}
          </figure>
        )}
      </Container>
    </Section>
  )
}
