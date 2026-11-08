import config from '@payload-config'
import { getPayload, type Where } from 'payload'
import React from 'react'

import type { BlockData } from '@/blocks/types'

import { CMSForm, type PayloadFormClassNames } from '@/components/forms'
import { RichText, type RichTextData } from '@/components/RichText'
import { AccentHeadline, CMSLink, DotMatrix, Eyebrow, resolveLinkHref, Section } from '@/components/ui'
import { cx } from '@/lib/cx'
import { docPath } from '@/lib/docPath'

import { BookingFlow, type FlowStep } from './BookingFlow'
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
  <svg aria-hidden="true" viewBox="0 0 256 256" fill="currentColor" className="ix-arrow-ne size-[1.1em] shrink-0">
    <path d="M204 64v104a12 12 0 0 1-24 0V93L72.49 200.49a12 12 0 0 1-17-17L163 76H88a12 12 0 0 1 0-24h104a12 12 0 0 1 12 12Z" />
  </svg>
)

const ARROW_RIGHT = (
  <svg aria-hidden="true" viewBox="0 0 256 256" fill="currentColor" className="ix-arrow size-[1.1em] shrink-0">
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
  'flex min-h-target w-full flex-1 cursor-pointer items-center justify-center gap-2.5 bg-ink p-4.5 font-display text-[1.1rem] font-normal uppercase leading-none tracking-[0.04em] text-cream no-underline transition-[translate] duration-180 ease-out active:translate-y-px focus-visible:outline-offset-[-6px] focus-visible:outline-cream'

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
          <p className="mt-3 max-w-[52ch] whitespace-pre-line text-[0.9375rem] leading-normal text-gray-warm md:mt-5 md:text-body">{paragraph}</p>
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
  flow: flowData,
  settingsOverride,
}: BookingEmbedData & { settingsOverride?: BookingSettingsOverride }) {
  const flow = flowData?.enabled === true ? flowData : null
  const loaded = settingsOverride
    ? {
        bookingUrl: safeBookingUrl(settingsOverride.bookingUrl),
        bookingMode: settingsOverride.bookingMode ?? 'link-out',
        thankYouHref: settingsOverride.thankYouHref ?? null,
      }
    : await load(thankYouPage)
  const { bookingUrl, bookingMode } = loaded
  // The flow keeps the visitor on this page (step 2 is the homework), so no move to Thank You.
  const thankYouHref = flow ? null : loaded.thankYouHref
  // Homework + next steps only exist while booking is online: offline, step 1 (write to us) is the whole widget.
  const homework = flow && bookingUrl ? await loadHomework(flow.homeworkForm) : null

  return (
    <BookingEmbedView
      {...{ heading, accentPhrase, body, buttonLabel, noteUnderButton, newTabLabel, fallbackHeading, fallbackBody, fallbackLink, id }}
      bookingUrl={bookingUrl}
      bookingMode={bookingMode}
      thankYouHref={thankYouHref}
      flow={flow}
      homework={homework}
    />
  )
}

type FlowData = NonNullable<BookingEmbedData['flow']>
type Homework = { id: number; message: RichTextData | null }

/** Trusted read of the homework form (forms are staff-read): existence + its own "sent" message. */
async function loadHomework(value: FlowData['homeworkForm']): Promise<Homework | null> {
  const id = typeof value === 'object' && value !== null ? value.id : value
  if (typeof id !== 'number') return null
  try {
    const payload = await getPayload({ config })
    const doc = await payload.findByID({ collection: 'forms', id, depth: 0, disableErrors: true, overrideAccess: true })
    if (!doc) {
      console.error(`[BookingEmbed] flow homework form ${id} not found (deleted?); homework step skipped`)
      return null
    }
    const message = doc.confirmationType !== 'redirect' && doc.confirmationMessage ? (doc.confirmationMessage as RichTextData) : null
    return { id, message }
  } catch (error) {
    console.error('[BookingEmbed] could not load the flow homework form; step skipped', error instanceof Error ? error.name : error)
    return null
  }
}

/** Steps 2 and 3 sit in the same 2px ink frame as the booking panel, on white. */
const FRAME = 'relative border-2 border-ink bg-cream px-6 pb-8 pt-7 md:px-12 md:py-12'

/** FormEmbed `standard` form slots (FormEmbed/Component.tsx `standardForm`): same look as the homework form had. */
const HOMEWORK_FORM: PayloadFormClassNames = {
  fields: 'flex flex-wrap gap-x-4 gap-y-5',
  submit: 'w-full md:w-auto md:self-start',
}

const CHECK = (
  <svg aria-hidden="true" viewBox="0 0 256 256" fill="currentColor" className="mt-0.5 size-5 shrink-0 text-success-strong">
    <path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" />
  </svg>
)

function HomeworkStep({ flow, formId }: { flow: FlowData; formId: number }) {
  const eyebrow = flow.homeworkEyebrow?.trim()
  const title = flow.homeworkHeading?.trim()
  const lead = flow.homeworkBody?.trim()
  return (
    <div className={FRAME}>
      {eyebrow ? <Eyebrow muted>{eyebrow}</Eyebrow> : null}
      {title ? <AccentHeadline text={title} level={2} as="h2" className={eyebrow ? 'mt-4' : undefined} /> : null}
      {lead ? <p className="mt-4 max-w-[48ch] whitespace-pre-line text-body-mobile md:text-body">{lead}</p> : null}
      <div className={eyebrow || title || lead ? 'mt-8' : undefined}>
        <CMSForm
          form={formId}
          submitLabel={flow.homeworkSubmitLabel?.trim() || undefined}
          tone="light"
          submitVariant="dark"
          submitSize="md"
          classNames={HOMEWORK_FORM}
          confirmationHeadingTag={title ? 'h3' : 'h2'}
        />
      </div>
    </div>
  )
}

function NextStep({ flow, message }: { flow: FlowData; message: RichTextData | null }) {
  const title = flow.nextHeading?.trim()
  const lead = flow.nextBody?.trim()
  const items = (flow.nextSteps ?? []).filter((s) => s.title?.trim())
  return (
    <div className={FRAME}>
      {message ? (
        <div className="mb-8 flex items-start gap-3 border border-success-strong bg-success-tint p-4 text-body-mobile text-success-deep md:px-6">
          {CHECK}
          <div className="[&_p+p]:mt-2">
            <RichText data={message} disableContainer />
          </div>
        </div>
      ) : null}
      {title ? <AccentHeadline text={title} level={2} as="h2" /> : null}
      {lead ? <p className="mt-4 max-w-[48ch] whitespace-pre-line text-body-mobile md:text-body">{lead}</p> : null}
      {items.length > 0 ? (
        <ol className={cx('border-t border-divider', title || lead ? 'mt-6' : undefined)}>
          {items.map((s, i) => (
            <li key={s.id ?? i} className="grid grid-cols-[2.25rem_1fr] gap-x-3 border-b border-divider py-4 md:grid-cols-[3rem_1fr] md:py-5">
              <span aria-hidden="true" className="pt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-gray-warm md:text-xs">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="font-display text-[1.1rem] uppercase leading-tight tracking-headline md:text-[1.25rem]">{s.title}</p>
                {s.detail?.trim() ? <p className="mt-1.5 whitespace-pre-line text-body-mobile text-gray-warm">{s.detail}</p> : null}
              </div>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  )
}

/** Sync view so `useId` can make the heading id unique per instance (the showcase repeats the block). */
function BookingEmbedView({
  heading,
  accentPhrase,
  body,
  buttonLabel,
  noteUnderButton,
  newTabLabel,
  fallbackHeading,
  fallbackBody,
  fallbackLink,
  id,
  bookingUrl,
  bookingMode,
  thankYouHref,
  flow,
  homework,
}: Omit<BookingEmbedData, 'thankYouPage' | 'blockType' | 'flow'> & {
  bookingUrl: string | null
  bookingMode: BookingMode
  thankYouHref: string | null
  flow?: FlowData | null
  homework?: Homework | null
}) {
  const instance = React.useId().replace(/[^a-zA-Z0-9]/g, '')
  const headingId = `booking-${id ?? `panel-${instance}`}`
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
            <p id={headingId} className="sr-only">
              {title}
            </p>
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
                  className="ix-rule inline-flex min-h-target items-center gap-1.5 font-bold no-underline"
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

  if (flow) {
    const question = flow.questionText?.trim()
    const questionLink = flow.questionLink && resolveLinkHref(flow.questionLink) && flow.questionLink.label?.trim() ? flow.questionLink : null
    const steps: FlowStep[] = [
      {
        kind: 'book',
        label: flow.bookLabel?.trim() || 'Book',
        node: content,
        // Offline, the fallback panel already links to Contact: no second line.
        after:
          bookingUrl && (question || questionLink) ? (
            <p className="mt-6 flex flex-wrap items-center gap-x-2 text-small-mobile text-gray-warm md:justify-center md:text-small">
              {question ? <span>{question}</span> : null}
              {questionLink ? (
                <CMSLink link={questionLink} className="ix-rule inline-flex min-h-target items-center font-bold text-ink no-underline">
                  {questionLink.label}
                </CMSLink>
              ) : null}
            </p>
          ) : null,
      },
    ]
    if (bookingUrl && homework) {
      steps.push({ kind: 'form', label: flow.homeworkLabel?.trim() || 'Homework', node: <HomeworkStep flow={flow} formId={homework.id} />, formId: homework.id })
    }
    if (bookingUrl && (flow.nextHeading?.trim() || flow.nextSteps?.length || homework?.message)) {
      steps.push({ kind: 'end', label: flow.nextLabel?.trim() || "What's next", node: <NextStep flow={flow} message={homework?.message ?? null} /> })
    }
    return (
      // White ground, opt-in (the non-flow block keeps its grey band).
      <Section tone="light" pad="none" className="pb-section-mobile pt-6 md:pb-section md:pt-8" aria-labelledby={headingId}>
        <div className="mx-auto max-w-205 px-container-mobile md:px-container">
          <BookingFlow
            steps={steps}
            embedded={bookingMode === 'embed'}
            bookedLabel={flow.bookedLabel?.trim() || "I've booked my call"}
            backLabel={flow.backLabel?.trim() || 'Back'}
            stepBarLabel="Booking steps"
          />
        </div>
      </Section>
    )
  }

  return (
    <Section tone="grey" pad="none" className="py-12 md:py-16" aria-labelledby={headingId}>
      <div className="mx-auto max-w-205 px-container-mobile md:px-container">{content}</div>
    </Section>
  )
}
