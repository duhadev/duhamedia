import config from '@payload-config'
import { getPayload, type Where } from 'payload'
import React from 'react'

import type { BlockData } from '@/blocks/types'

import { AccentHeadline, CMSLink, DotMatrix, resolveLinkHref, Section } from '@/components/ui'
import { docPath } from '@/lib/docPath'

import { BookingLaunchLink } from './BookingLaunchLink'

/** The generated `bookingEmbed` row type (src/payload-types.ts `BookingEmbedBlock`). */
export type BookingEmbedData = BlockData<'bookingEmbed'>

export type BookingMode = 'embed' | 'link-out'

/**
 * Showcase/testing only: forces the state by supplying the two Site settings
 * values instead of reading the global (`bookingUrl: null` = no-URL state).
 * Never set by page content (it is not a schema field).
 */
export type BookingSettingsOverride = { bookingUrl: string | null; bookingMode?: BookingMode; thankYouHref?: string | null }

const LOGO_MASK: React.CSSProperties = {
  WebkitMaskImage: "url('/logo-duha.png')",
  maskImage: "url('/logo-duha.png')",
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
}

const THANK_YOU_SLUG = 'thank-you'

type Loaded = { bookingUrl: string | null; bookingMode: BookingMode; thankYouHref: string | null }

/** https only; anything else is treated as "no URL" (fallback) and logged. */
function safeBookingUrl(raw: string | null | undefined): string | null {
  const value = raw?.trim()
  if (!value) {
    console.warn('[BookingEmbed] Site settings > Booking has no booking page address; showing the fallback panel')
    return null
  }
  try {
    if (new URL(value).protocol === 'https:') return value
  } catch {
    /* falls through */
  }
  console.error('[BookingEmbed] Site settings > Booking address is not a valid https:// URL; showing the fallback panel')
  return null
}

/**
 * Public path of the Thank You page: the chosen page if published, else the
 * published page with slug `thank-you`, else null (no redirect).
 */
async function resolveThankYou(
  payload: Awaited<ReturnType<typeof getPayload>>,
  chosen: BookingEmbedData['thankYouPage'],
): Promise<string | null> {
  const chosenId = typeof chosen === 'object' && chosen !== null ? chosen.id : chosen
  const where: Where = chosenId ? { id: { equals: chosenId } } : { slug: { equals: THANK_YOU_SLUG } }
  const { docs } = await payload.find({ collection: 'pages', where, limit: 1, depth: 0, overrideAccess: false, draft: false })
  const href = docPath('pages', docs[0])
  if (!href) console.warn('[BookingEmbed] no published Thank You page; the booking button opens the calendar without moving this tab')
  return href
}

/** Public Local API reads; failure is logged and the block shows its fallback state. */
async function load(thankYouPage: BookingEmbedData['thankYouPage']): Promise<Loaded> {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: false })
    const bookingUrl = safeBookingUrl(settings.bookingUrl)
    const bookingMode: BookingMode = settings.bookingMode === 'embed' ? 'embed' : 'link-out'
    const thankYouHref = bookingUrl && bookingMode === 'link-out' ? await resolveThankYou(payload, thankYouPage) : null
    return { bookingUrl, bookingMode, thankYouHref }
  } catch (error) {
    console.error('[BookingEmbed] could not read site-settings / pages', error)
    return { bookingUrl: null, bookingMode: 'link-out', thankYouHref: null }
  }
}

const ARROW_UP_RIGHT = (
  <svg aria-hidden="true" viewBox="0 0 256 256" fill="currentColor" className="size-[1.1em] shrink-0">
    <path d="M204 64v104a12 12 0 0 1-24 0V93L72.49 200.49a12 12 0 0 1-17-17L163 76H88a12 12 0 0 1 0-24h104a12 12 0 0 1 12 12Z" />
  </svg>
)

const ARROW_RIGHT = (
  <svg aria-hidden="true" viewBox="0 0 256 256" fill="currentColor" className="size-[1.1em] shrink-0">
    <path d="M224.49 136.49l-72 72a12 12 0 0 1-17-17L187 140H40a12 12 0 0 1 0-24h147l-51.49-51.51a12 12 0 0 1 17-17l72 72a12 12 0 0 1-.02 17Z" />
  </svg>
)

/** Phosphor bold calendar-blank (the design's `ph-bold ph-calendar-blank`). */
const CALENDAR = (
  <svg aria-hidden="true" viewBox="0 0 256 256" fill="currentColor" className="size-8 text-gray-warm">
    <path d="M208 28h-20v-4a12 12 0 0 0-24 0v4H92v-4a12 12 0 0 0-24 0v4H48a20 20 0 0 0-20 20v160a20 20 0 0 0 20 20h160a20 20 0 0 0 20-20V48a20 20 0 0 0-20-20ZM68 52a12 12 0 0 0 24 0h72a12 12 0 0 0 24 0h16v24H52V52Zm136 152H52V100h152Z" />
  </svg>
)

/** Book a Call mobile "Booking flow" footer button: full-width ink bar, display face. */
const BAR =
  'flex min-h-target w-full flex-1 cursor-pointer items-center justify-center gap-2.5 bg-ink p-4.5 font-display text-[1.1rem] font-normal uppercase leading-none tracking-[0.04em] text-cream no-underline transition-[filter] duration-180 ease-out hover:brightness-115 focus-visible:outline-offset-[-6px] focus-visible:outline-cream'

/**
 * The bordered booking panel (Book a Call.dc.html "Booking flow" frame,
 * mobile build: 2px ink border on cream, dot matrix + wine logo shape in the
 * top-right, display headline, a full-width bar button along the bottom).
 * Desktop proportions follow the desktop "Booking widget" frame (820px
 * column, min-height 420px, centred content). DERIVED: the design has no
 * link-out or fallback panel (MERGED Conflict 8); both reuse this frame.
 */
function Panel({
  heading,
  accentPhrase,
  body,
  footer,
  headingId,
}: {
  heading: string
  accentPhrase?: string | null
  body?: string | null
  footer: React.ReactNode
  headingId: string
}) {
  const paragraph = body?.trim()
  return (
    <div className="relative flex flex-col overflow-hidden border-2 border-ink bg-cream md:min-h-105">
      <DotMatrix fade="corner" />
      <div
        aria-hidden="true"
        style={LOGO_MASK}
        className="pointer-events-none absolute -right-17.5 -top-10 z-0 size-37.5 bg-ground-accent md:-right-20 md:-top-12 md:size-50"
      />
      <div className="relative z-10 flex flex-1 flex-col justify-center px-6 pb-8 pt-7 md:items-center md:px-12 md:py-14 md:text-center">
        <span className="hidden md:block">{CALENDAR}</span>
        <AccentHeadline
          id={headingId}
          text={heading}
          accent={accentPhrase}
          level={2}
          as="h2"
          className="max-md:pr-14 max-md:!leading-[1.02] md:mt-4 md:max-w-[18ch]"
        />
        {paragraph ? (
          <p className="mt-3 max-w-[52ch] text-[0.9375rem] leading-normal text-gray-warm md:mt-5 md:text-body">{paragraph}</p>
        ) : null}
      </div>
      {footer ? <div className="relative z-10 flex border-t-2 border-ink">{footer}</div> : null}
    </div>
  )
}

function Note({ text }: { text?: string | null }) {
  const note = text?.trim()
  return note ? <p className="mt-3.5 text-small-mobile text-gray-warm md:mt-4 md:text-center md:text-small">{note}</p> : null
}

/**
 * BookingEmbed (p9 Book a Call §Booking widget; SCHEMA §8.4 item 17). Async
 * server component: reads Site settings > Booking at render, so the booking
 * address and mode are edited in one place. States:
 *
 * - link-out (default): panel + bar button opening the booking page in a new
 *   tab (client island `BookingLaunchLink` moves this tab to Thank You).
 * - embed: framed booking page from `md` up + "open in a new tab" link; the
 *   link-out panel below `md` (MERGED R8).
 * - no-URL fallback: fallback heading/body + Contact link (logged).
 *
 * `settingsOverride` is for /_showcase and tests only.
 */
export async function BookingEmbedBlock({
  heading,
  accentPhrase,
  body,
  buttonLabel,
  noteUnderButton,
  newTabLabel,
  thankYouPage,
  fallbackHeading,
  fallbackBody,
  fallbackLink,
  id,
  settingsOverride,
}: BookingEmbedData & { settingsOverride?: BookingSettingsOverride }) {
  const { bookingUrl, bookingMode, thankYouHref } = settingsOverride
    ? {
        bookingUrl: safeBookingUrl(settingsOverride.bookingUrl),
        bookingMode: settingsOverride.bookingMode ?? 'link-out',
        thankYouHref: settingsOverride.thankYouHref ?? null,
      }
    : await load(thankYouPage)

  const headingId = `booking-${id ?? 'panel'}`
  const label = buttonLabel?.trim() || 'Book your call'
  const title = heading?.trim() || label

  let content: React.ReactNode
  if (!bookingUrl) {
    const hasContact = Boolean(resolveLinkHref(fallbackLink) && fallbackLink?.label?.trim())
    if (!hasContact) console.error('[BookingEmbed] no booking address and no resolvable Contact link: the fallback panel has no way forward')
    content = (
      <Panel
        heading={fallbackHeading?.trim() || title}
        body={fallbackBody}
        headingId={headingId}
        footer={
          hasContact ? (
            <CMSLink link={fallbackLink} className={BAR}>
              {fallbackLink?.label}
              {ARROW_RIGHT}
            </CMSLink>
          ) : null
        }
      />
    )
  } else {
    // Embed mode renders this panel below `md` next to the frame's own heading: distinct id.
    const linkOut = (
      <>
        <Panel
          heading={title}
          accentPhrase={accentPhrase}
          body={body}
          headingId={bookingMode === 'embed' ? `${headingId}-mobile` : headingId}
          footer={
            <BookingLaunchLink href={bookingUrl} thankYouHref={bookingMode === 'link-out' ? thankYouHref : null} className={BAR}>
              {label}
              {ARROW_UP_RIGHT}
              <span className="sr-only">(opens in a new tab)</span>
            </BookingLaunchLink>
          }
        />
        <Note text={noteUnderButton} />
      </>
    )

    content =
      bookingMode === 'embed' ? (
        <>
          <div className="md:hidden">{linkOut}</div>
          <div className="max-md:hidden">
            <h2 id={headingId} className="sr-only">
              {title}
            </h2>
            <iframe
              src={bookingUrl}
              title={title}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
              className="block h-180 min-h-105 w-full border-2 border-ink bg-cream"
            />
            {newTabLabel?.trim() ? (
              <p className="mt-4 text-center text-small">
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-target items-center gap-1.5 border-b-2 border-ink font-bold no-underline"
                >
                  {newTabLabel.trim()}
                  {ARROW_UP_RIGHT}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </p>
            ) : null}
          </div>
        </>
      ) : (
        linkOut
      )
  }

  return (
    <Section tone="grey" pad="none" className="py-12 md:py-16" aria-labelledby={headingId}>
      <div className="mx-auto max-w-205 px-container-mobile md:px-container">{content}</div>
    </Section>
  )
}
