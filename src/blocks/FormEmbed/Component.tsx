import config from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { CMSForm, type PayloadFormClassNames } from '@/components/forms'
import { AccentHeadline, Eyebrow, Section } from '@/components/ui'
import { cx } from '@/lib/cx'
import type { Form } from '@/payload-types'

import type { REASON_ICONS } from './config'
import { ReminderSwitch } from './ReminderSwitch'

/**
 * Row shape of the `formEmbed` block. Local interface matching config.ts
 * exactly, until the integrator registers the block and `BlockData<'formEmbed'>`
 * resolves (then swap this for the generated type).
 */
export type FormEmbedData = {
  variant: 'standard' | 'reminder'
  form: number | Form | null
  eyebrow?: string | null
  eyebrowTick?: boolean | null
  alertLabel?: string | null
  heading?: string | null
  accentPhrase?: string | null
  body?: string | null
  reasons?: { icon: (typeof REASON_ICONS)[number]; text: string; id?: string | null }[] | null
  submitLabel?: string | null
  ground?: 'light' | 'grey' | null
  mobileLayout?: 'stacked' | 'stepped' | null
  doneHeading?: string | null
  doneBody?: string | null
  id?: string | null
  blockName?: string | null
  blockType: 'formEmbed'
}

/* Phosphor bold (the design's icon set, ph-bold), 256 viewBox. */
const ICON_PATHS = {
  chart:
    'M236,208a12,12,0,0,1-12,12H32a12,12,0,0,1-12-12V48a12,12,0,0,1,24,0v99l43.51-43.52a12,12,0,0,1,17,0L128,127l43-43H160a12,12,0,0,1,0-24h40a12,12,0,0,1,12,12v40a12,12,0,0,1-24,0V101l-51.51,51.52a12,12,0,0,1-17,0L96,129,44,181v15H224A12,12,0,0,1,236,208Z',
  clock:
    'M236,137A108.13,108.13,0,1,1,119,20,12,12,0,0,1,121,44,84.12,84.12,0,1,0,212,135,12,12,0,1,1,236,137ZM116,76v52a12,12,0,0,0,12,12h52a12,12,0,0,0,0-24H140V76a12,12,0,0,0-24,0Zm92,20a16,16,0,1,0-16-16A16,16,0,0,0,208,96ZM176,64a16,16,0,1,0-16-16A16,16,0,0,0,176,64Z',
  target:
    'M229.26,90.4a108,108,0,0,1-177.63,114A108,108,0,0,1,195.41,43.63l20.1-20.11a12,12,0,0,1,17,17l-96,96a12,12,0,1,1-17-17l24-24a36,36,0,1,0,19.76,39.65,12,12,0,0,1,23.53,4.74,60,60,0,1,1-25.73-62L178.3,60.74a84,84,0,1,0,28.46,38,12,12,0,1,1,22.5-8.35Z',
  check:
    'M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z',
  warning:
    'M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z',
} as const

function Icon({ name, className }: { name: keyof typeof ICON_PATHS; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 256 256" fill="currentColor" className={cx('shrink-0', className)}>
      <path d={ICON_PATHS[name]} />
    </svg>
  )
}

/**
 * Form-builder field `width` (percent) drives the two-column grid: PayloadForm
 * sizes a field with width < 100 as `calc(width% - 0.5rem)` from `sm`, which
 * assumes a 1rem column gap, so the column gap stays `gap-x-4` (design 20px/24px).
 */
const standardForm: PayloadFormClassNames = {
  fields: 'flex flex-wrap gap-x-4 gap-y-5',
  submit: 'w-full md:w-auto md:self-start',
}

const reminderForm: PayloadFormClassNames = {
  fields: 'flex flex-wrap gap-x-4 gap-y-4 md:gap-y-5',
  label: 'text-gray-warm',
  submit: 'w-full md:w-auto md:self-start',
}

/** The block's own container: the design's 820px reading column (no token). */
const COLUMN = 'mx-auto w-full max-w-[820px] px-container-mobile md:px-container'

/**
 * Trusted existence check (forms are staff-read, so a public request gets a
 * bare id). A missing or deleted form hides the whole section: a heading that
 * promises a form with nothing under it is worse than no section.
 */
async function formExists(value: FormEmbedData['form']): Promise<boolean> {
  const id = typeof value === 'object' && value !== null ? value.id : value
  if (typeof id !== 'number') {
    console.error('[FormEmbed] no form chosen; section hidden')
    return false
  }
  try {
    const payload = await getPayload({ config })
    const { totalDocs } = await payload.count({ collection: 'forms', where: { id: { equals: id } }, overrideAccess: true })
    if (totalDocs === 0) console.error(`[FormEmbed] form ${id} not found (deleted?); section hidden`)
    return totalDocs > 0
  } catch (error) {
    console.error('[FormEmbed] could not check the form; section hidden', error instanceof Error ? error.name : error)
    return false
  }
}

/**
 * FormEmbed (SCHEMA §8.4 item 16). Server component; the form itself is the
 * shared `CMSForm` (client `PayloadForm` + Turnstile, always on). The reminder
 * variant adds one tiny client island (`ReminderSwitch`) to read `?homework=done`.
 */
export async function FormEmbedBlock(props: FormEmbedData) {
  if (!(await formExists(props.form))) return null
  return props.variant === 'reminder' ? <Reminder {...props} /> : <Standard {...props} />
}

/**
 * `standard` (Book a Call.dc.html §Homework form; Contact.dc.html §Contact form,
 * desktop builds). Phones: single column, full-width send button. `stepped`
 * (Contact mobile) is not built yet and renders stacked: PayloadForm has no
 * step API (reported to the PM).
 */
function Standard({ form, eyebrow, eyebrowTick, heading, accentPhrase, body, submitLabel, ground }: FormEmbedData) {
  const grey = ground === 'grey'
  const title = heading?.trim()
  const lead = body?.trim()
  const hasHeader = Boolean(eyebrow?.trim() || title || lead)

  return (
    <Section
      tone={grey ? 'grey' : 'light'}
      pad="none"
      // p9: 96px desktop (mobile build 56px); p12: 64px desktop, 48px mobile build.
      className={grey ? 'py-12 md:py-section-tight' : 'py-section-mobile md:py-section'}
    >
      <div className={COLUMN}>
        {eyebrow?.trim() ? (
          <Eyebrow muted tick={eyebrowTick === true}>
            {eyebrow}
          </Eyebrow>
        ) : null}
        {title ? (
          <AccentHeadline text={title} accent={accentPhrase} level={2} as="h2" className={eyebrow?.trim() ? 'mt-4' : undefined} />
        ) : null}
        {lead ? <p className="mt-4 max-w-[48ch] text-body-mobile md:text-body">{lead}</p> : null}
        <div className={hasHeader ? 'mt-8' : undefined}>
          <CMSForm form={form} submitLabel={submitLabel?.trim() || undefined} tone="light" submitVariant="dark" submitSize="md" classNames={standardForm} />
        </div>
      </div>
    </Section>
  )
}

/**
 * `reminder` (Thank You.dc.html §Homework reminder). Desktop: grey band, card
 * with heading + line, form in a two-column grid. Phone build: white ground,
 * the card gains the alert bar and the reasons list (both phone-only, as
 * designed). With `?homework=done` the card is replaced by the success line.
 */
function Reminder({ form, alertLabel, heading, accentPhrase, body, reasons, submitLabel, doneHeading, doneBody }: FormEmbedData) {
  const title = heading?.trim()
  const lead = body?.trim()
  const doneText = [doneHeading?.trim(), doneBody?.trim()].filter(Boolean).join(' ')
  const items = (reasons ?? []).filter((r) => r.text?.trim())

  const done = doneText ? (
    <div
      role="status"
      className="flex items-center gap-3.5 border border-success-strong bg-success-tint p-5 text-success-deep md:px-8 md:py-6"
    >
      <Icon name="check" className="size-5 text-success-strong" />
      <p className="text-body-mobile">{doneText}</p>
    </div>
  ) : null

  const pending = (
    <div className="flex flex-col border-2 border-ink bg-cream shadow-card">
      {alertLabel?.trim() ? (
        <p className="flex items-center gap-2 border-b-2 border-ink px-4 py-2.25 text-[12px] font-bold uppercase tracking-eyebrow md:hidden">
          <Icon name="warning" className="size-4 text-ground-accent" />
          {alertLabel}
        </p>
      ) : null}
      <div className="flex flex-col gap-4.5 px-5 py-6 md:gap-0 md:p-0">
        {title || lead ? (
          <div className="md:px-8 md:pt-8">
            {title ? <AccentHeadline text={title} accent={accentPhrase} level={3} as="h2" /> : null}
            {lead ? <p className={cx('text-body-mobile md:max-w-[48ch]', title && 'mt-2')}>{lead}</p> : null}
          </div>
        ) : null}
        {items.length > 0 ? (
          <ul className="flex flex-col gap-3 border-t border-divider pt-4 md:hidden">
            {items.map((r, i) => (
              <li key={r.id ?? i} className="flex items-start gap-2.5 text-[15px] leading-normal">
                <Icon name={r.icon in ICON_PATHS ? r.icon : 'check'} className="mt-0.75 size-3.75 text-accent-primary" />
                {r.text}
              </li>
            ))}
          </ul>
        ) : null}
        <div
          className={cx(
            'md:px-8 md:pt-7 md:pb-8',
            (title || lead || items.length > 0) && 'border-t border-divider pt-4.5 md:border-t-0',
          )}
        >
          <CMSForm
            form={form}
            submitLabel={submitLabel?.trim() || undefined}
            tone="light"
            submitVariant="dark"
            submitSize="md"
            classNames={reminderForm}
            confirmation={doneText ? <p className="text-body-mobile">{doneText}</p> : undefined}
          />
        </div>
      </div>
    </div>
  )

  return (
    // Desktop band grey/64px; the phone build sits on white with 48px.
    <Section tone="light" pad="none" className="py-12 md:bg-gray-light md:py-section-tight">
      <div className={COLUMN}>
        <ReminderSwitch pending={pending} done={done ?? pending} />
      </div>
    </Section>
  )
}
