import config from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { BlockData } from '@/blocks/types'

import { CMSForm, type PayloadFormClassNames, type PayloadFormProps } from '@/components/forms'
import { RichText } from '@/components/RichText'
import { AccentHeadline, Eyebrow, Section } from '@/components/ui'
import { splitAccentPhrase } from '@/lib/accentPhrase'
import { cx } from '@/lib/cx'

import { ReminderSwitch } from './ReminderSwitch'
import { SendAnother } from './SendAnother'

/** The generated `formEmbed` row type (src/payload-types.ts `FormEmbedBlock`). */
export type FormEmbedData = BlockData<'formEmbed'>

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
  checkCircle:
    'M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z',
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

/*
 * Stepped phone build (Contact.dc.html, `isMobile`, "Contact form"): a 2px ink
 * card on the grey ground, min 520px tall, with the progress block on top, the
 * step in the middle and the nav bar pinned to the bottom behind a 2px rule.
 * Slots shared with the stacked layout (form, fields, field-level, submit,
 * turnstile, status, success) are scoped with `max-md:` so the stacked
 * rendering (md and up) keeps its defaults; stepped-only slots (progress,
 * step, stepHeader, stepNav) are plain because they only render below md.
 * Layout slots REPLACE PayloadForm's defaults, so the defaults are restated.
 */
/* Class strings are spelled out in full: Tailwind only generates what it can read as literals. */
const steppedCard = cx(
  'flex flex-col gap-6',
  'max-md:relative max-md:isolate max-md:min-h-[520px] max-md:gap-0 max-md:overflow-hidden max-md:border-2 max-md:border-ink max-md:bg-cream',
  // Dotted ground: step 1 only (the design's step 2 dots are cream on cream, invisible).
  'max-md:before:absolute max-md:before:inset-0 max-md:before:-z-10 max-md:before:hidden',
  'max-md:before:[background-image:radial-gradient(rgba(17,17,17,.22)_1.2px,transparent_1.2px)] max-md:before:[background-size:22px_22px]',
  'max-md:before:[mask-image:linear-gradient(215deg,#000_15%,transparent_65%)]',
  "max-md:has-[[data-step='0']:not([hidden])]:before:block",
  // Wine mark bleeding off the top-right corner: steps 1 and 2. The design lets it sit under the progress bar and
  // heading; here it is pushed up so its lower edge stops above the bar (card padding 26px), keeping both clear.
  'max-md:after:absolute max-md:after:-top-[118px] max-md:after:-right-10 max-md:after:-z-10 max-md:after:hidden max-md:after:size-[140px] max-md:after:bg-ground-accent',
  'max-md:after:[mask-image:url(/logo-duha.png)] max-md:after:[mask-size:contain] max-md:after:[mask-repeat:no-repeat]',
  "max-md:has-[[data-step='0']:not([hidden])]:after:block max-md:has-[[data-step='1']:not([hidden])]:after:block",
)

/** Underlined text input (steps 1-2) and the 2px-framed textarea (step 4); no radius. */
const steppedControl = cx(
  'max-md:rounded-none max-md:[&:is(textarea)]:min-h-[150px] max-md:[&:is(textarea)]:resize-none',
  'max-md:[&:not(textarea)]:border-0 max-md:[&:not(textarea)]:border-b-[3px] max-md:[&:not(textarea)]:bg-transparent',
  'max-md:[&:not(textarea)]:px-0.5 max-md:[&:not(textarea)]:py-2 max-md:[&:not(textarea)]:text-2xl',
)

/** Nav bar: 64px Back (right rule) + the flex-1 ink Next/Send, display type 1.1rem. */
const steppedNav = cx(
  'mt-auto flex border-t-2 border-ink',
  '[&>button:first-child]:min-h-16 [&>button:first-child]:w-16 [&>button:first-child]:border-0 [&>button:first-child]:border-r-2 [&>button:first-child]:border-ink',
  '[&>button:first-child]:bg-cream [&>button:first-child:disabled]:bg-gray-light [&>button:first-child:disabled]:text-gray-warm [&>button:first-child:disabled]:opacity-100',
  '[&>button:last-child]:min-h-16 [&>button:last-child]:gap-2.5 [&>button:last-child]:border-0 [&>button:last-child]:py-4.5 [&>button:last-child]:font-display',
  '[&>button:last-child]:text-[1.1rem] [&>button:last-child]:font-normal [&>button:last-child]:uppercase [&>button:last-child]:tracking-[0.04em]',
)

const steppedForm: PayloadFormClassNames = {
  ...standardForm,
  form: steppedCard,
  fields: 'flex flex-wrap gap-x-4 gap-y-5 max-md:px-6 max-md:pt-6.5 max-md:pb-5.5',
  control: steppedControl,
  option: 'font-display! text-[1.05rem] font-normal! uppercase',
  progress: 'flex flex-col gap-4 px-6 pt-6.5',
  step: 'flex flex-1 flex-col',
  stepHeader: 'flex flex-col gap-3 px-6 pt-5.5',
  stepNav: steppedNav,
  submit: 'w-full max-md:flex-1 md:w-auto md:self-start',
  turnstile: 'min-h-[65px] w-full max-md:px-6 max-md:pb-4',
  status: 'max-md:px-6 max-md:pb-3',
  // Dark confirmation panel, cream dots, mark bleeding off the bottom-left.
  success: cx(
    'max-md:relative max-md:isolate max-md:flex max-md:min-h-[520px] max-md:flex-col max-md:overflow-hidden max-md:bg-ink max-md:text-cream!',
    'max-md:before:absolute max-md:before:inset-0 max-md:before:-z-10 max-md:before:content-[\'\']',
    'max-md:before:[background-image:radial-gradient(rgba(250,247,242,.18)_1.2px,transparent_1.2px)] max-md:before:[background-size:22px_22px]',
    'max-md:before:[mask-image:linear-gradient(215deg,#000_15%,transparent_65%)]',
    'max-md:after:absolute max-md:after:-bottom-[50px] max-md:after:-left-[70px] max-md:after:-z-10 max-md:after:size-40 max-md:after:bg-ground-accent max-md:after:opacity-90 max-md:after:content-[\'\']',
    'max-md:after:[mask-image:url(/logo-duha.png)] max-md:after:[mask-size:contain] max-md:after:[mask-repeat:no-repeat]',
  ),
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
 * desktop builds). Phones: single column, full-width send button, or with
 * `mobileLayout: 'stepped'` (Contact mobile) PayloadForm's stepped layout below
 * md: the block's `steps` + `stepped` labels map 1:1 onto its props.
 */
/** Step heading with its accent span (PayloadForm renders it inside its own step h3). */
function stepHeading(text: string | null | undefined, accent: string | null | undefined): React.ReactNode | undefined {
  const t = text?.trim()
  if (!t) return undefined
  const parts = splitAccentPhrase(t, accent)
  if (!parts) return t
  return (
    <>
      {parts[0]}
      <span className="text-accent-primary">{parts[1]}</span>
      {parts[2]}
    </>
  )
}

/** `steps` rows → PayloadForm `FormStep[]` (blank names dropped; empty steps are dropped by resolveSteps). */
function toFormSteps(steps: FormEmbedData['steps']): PayloadFormProps['steps'] {
  const out = (steps ?? []).map((s) => ({
    fieldNames: (s.fieldNames ?? []).map((n) => n.trim()).filter(Boolean),
    heading: stepHeading(s.heading, s.accentPhrase),
    hint: s.hint?.trim() || undefined,
  }))
  return out.length > 0 ? out : undefined
}

/** PayloadForm props for the stepped phone layout; `{}` (stacked) unless `mobileLayout` is `stepped`. */
type SteppedProps = Partial<
  Pick<PayloadFormProps, 'layout' | 'steppedBelow' | 'steps' | 'selectAsOptions' | 'progressLabel' | 'startLabel' | 'nextLabel' | 'backLabel'>
>

function steppedProps({ mobileLayout, steps, stepped }: FormEmbedData): SteppedProps {
  if (mobileLayout !== 'stepped') return {}
  return {
    layout: 'stepped',
    steppedBelow: 'md',
    steps: toFormSteps(steps),
    selectAsOptions: stepped?.selectAsOptions !== false,
    progressLabel: stepped?.progressLabel?.trim() || undefined,
    startLabel: stepped?.startLabel?.trim() || undefined,
    nextLabel: stepped?.nextLabel?.trim() || undefined,
    backLabel: stepped?.backLabel?.trim() || undefined,
  }
}

/**
 * Stepped phone confirmation (Contact.dc.html mobile step 5): the form's own
 * success message (editable on the form) on the dark panel, with the check mark
 * above and the "Send another" bar below. Phone-only decoration: from md the
 * wrapper adds nothing but the message, same as the stacked layout always had.
 * Undefined (use CMSForm's own handling) for redirect-type forms.
 */
async function steppedConfirmation(
  value: FormEmbedData['form'],
  sendAnotherLabel?: string | null,
): Promise<React.ReactNode | undefined> {
  const id = typeof value === 'object' && value !== null ? value.id : value
  if (typeof id !== 'number') return undefined
  try {
    const payload = await getPayload({ config })
    const doc = await payload.findByID({ collection: 'forms', id, depth: 0, disableErrors: true, overrideAccess: true })
    if (!doc || doc.confirmationType === 'redirect' || !doc.confirmationMessage) return undefined
    return (
      <>
        <div
          className={cx(
            'max-md:flex max-md:flex-1 max-md:flex-col max-md:justify-center max-md:px-6 max-md:py-10',
            // The form's own message headed like the design's "Got it, …" (display 2.1rem) with a quiet body.
            'max-md:[&_h1]:font-display max-md:[&_h2]:font-display max-md:[&_h3]:font-display max-md:[&_h4]:font-display',
            'max-md:[&_h1]:text-[2.1rem] max-md:[&_h2]:text-[2.1rem] max-md:[&_h3]:text-[2.1rem] max-md:[&_h4]:text-[2.1rem]',
            'max-md:[&_h1]:leading-[1.02] max-md:[&_h2]:leading-[1.02] max-md:[&_h3]:leading-[1.02] max-md:[&_h4]:leading-[1.02]',
            'max-md:[&_h1]:font-normal max-md:[&_h2]:font-normal max-md:[&_h3]:font-normal max-md:[&_h4]:font-normal',
            'max-md:[&_h1]:uppercase max-md:[&_h2]:uppercase max-md:[&_h3]:uppercase max-md:[&_h4]:uppercase',
            'max-md:[&_h1]:mb-4 max-md:[&_h2]:mb-4 max-md:[&_h3]:mb-4 max-md:[&_h4]:mb-4',
            'max-md:[&_p]:leading-[1.6] max-md:[&_p]:text-cream/80',
          )}
        >
          <Icon name="checkCircle" className="mb-5 size-11 text-ground-accent md:hidden" />
          <RichText data={doc.confirmationMessage} disableContainer />
        </div>
        <SendAnother
          label={sendAnotherLabel?.trim() || 'Send another'}
          className="inline-flex min-h-16 w-full cursor-pointer items-center justify-center gap-2.5 border-t-2 border-cream/25 py-4 font-display text-base font-normal uppercase tracking-[0.04em] md:hidden"
        />
      </>
    )
  } catch (error) {
    console.error('[FormEmbed] could not load the form confirmation', error instanceof Error ? error.name : error)
    return undefined
  }
}

async function Standard(props: FormEmbedData) {
  const { form, eyebrow, eyebrowTick, heading, accentPhrase, body, submitLabel, ground } = props
  const grey = ground === 'grey'
  const title = heading?.trim()
  const lead = body?.trim()
  const hasHeader = Boolean(eyebrow?.trim() || title || lead)
  const stepped = props.mobileLayout === 'stepped'
  const confirmation = stepped ? await steppedConfirmation(form, props.stepped?.sendAnotherLabel) : undefined

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
          <CMSForm
            form={form}
            submitLabel={submitLabel?.trim() || undefined}
            tone="light"
            submitVariant="dark"
            submitSize="md"
            classNames={stepped ? steppedForm : standardForm}
            confirmation={confirmation}
            {...steppedProps(props)}
          />
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
