'use client'

import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from 'react'

import { Button, type ButtonSize, type ButtonVariant } from '@/components/ui'
import {
  FIELD_PREFIX,
  FORM_ID_KEY,
  FORM_SUBMIT_PATH,
  LEAD_MAGNET_KEY,
  SOURCE_PATH_KEY,
  type FormSubmitResponse,
  type PublicForm,
} from '@/integrations/forms/shared'
import { cx } from '@/lib/cx'

import { ERROR_TEXT, FieldControl } from './FieldControl'
import { SubmittedFirstName } from './submitted'
import { resolveSteps, type FormStep } from './steps'
import { TurnstileWidget, type TurnstileAppearance } from './TurnstileWidget'

/**
 * Renders one form-builder form and submits it to POST /api/form-submit
 * (src/app/api/form-submit/route.ts: Turnstile → validation → store). Client
 * component: it needs the Turnstile widget, pending state, inline errors and
 * the stepped layout's state.
 *
 * Use it through the server wrapper `CMSForm` (./CMSForm.tsx), which loads the
 * form, strips `emails`/integration settings, reads the site key at runtime
 * and renders the rich-text confirmation + message blocks on the server.
 *
 * With JS: `fetch` with the form's own FormData and `Accept: application/json`;
 * inputs are kept on error, the outcome is announced and focused. Before
 * hydration / without JS the plain `action`+`method="post"` posts to the same
 * route, which answers with a minimal HTML page or a 303.
 *
 * Stepped layout (`layout="stepped"`, p12 Contact phone build): progressive
 * enhancement. Server render, no-JS and viewports at/above `steppedBelow` are
 * the stacked form; below it, after hydration, one step shows at a time. All
 * fields stay in the DOM (hidden), so the submission is the same FormData.
 * Per-step validation is inline (the field's own error slot, cleared on edit); a
 * step change moves focus to the step heading, a failed field/server error to
 * that field (jumping to its step). Turnstile mounts on the last step only.
 * No step animation is built in (reduced-motion safe by construction); a block
 * may add one via `classNames.step` with `motion-safe:`.
 */

/**
 * Slot classes. Layout slots REPLACE the defaults when set: `form`
 * (`flex flex-col gap-6`), `fields` (`flex flex-wrap gap-4`, also each step's
 * field area), `footer` (`flex flex-col gap-3`), `submit` (`self-start`),
 * `turnstile` (`min-h-[65px] w-full`; `w-full` with interaction-only),
 * `progress`, `progressLabel` (the "Question n of m" line), `stepHeader`, `stepNav`, `step` (stepped-only, defaults below).
 * `fieldWide` is appended to a textarea / full-width field's wrapper (and to message blocks), so a grid layout can
 * span it across columns; unset by default.
 * The others (`field`, `label`, `control`, `error`, `option`, `status`,
 * `success`) are appended.
 */
export type PayloadFormClassNames = Partial<
  Record<
    | 'form'
    | 'fields'
    | 'field'
    | 'label'
    | 'control'
    | 'error'
    | 'option'
    | 'turnstile'
    | 'footer'
    | 'submit'
    | 'status'
    | 'success'
    | 'progress'
    | 'progressLabel'
    | 'fieldWide'
    | 'step'
    | 'stepHeader'
    | 'stepNav',
    string
  >
>

export type { FormStep }

export type PayloadFormProps = {
  form: PublicForm
  /** From `TURNSTILE_SITE_KEY` (server). `null` = misconfigured: the form shows, submit explains. */
  siteKey: string | null
  /** Rendered confirmation message (server-rendered rich text). Shown in place of the form on success. */
  confirmation?: React.ReactNode
  /** Server-rendered nodes for `message` blocks, keyed by `PublicFormField.key`. */
  messages?: Record<string, React.ReactNode>
  /** Page path stored on the submission (`sourcePath`), e.g. "/newsletter". */
  sourcePath?: string
  /** Lead-magnet id (p18); the server accepts it only if this form is that lead magnet's capture form. */
  leadMagnetId?: number
  /** Overrides the form's own `submitButtonLabel`. */
  submitLabel?: string
  /**
   * Turnstile footprint. `'always'` (default): the managed widget shows (≈65px row).
   * `'interaction-only'`: invisible and zero-height unless Cloudflare needs the visitor
   * to click; the token is still issued and verified the same way. For inline layouts.
   */
  turnstileAppearance?: TurnstileAppearance
  /** `'stepped'`: one step at a time below `steppedBelow` (default `'md'`); stacked above it. Default `'stacked'`. */
  layout?: 'stacked' | 'stepped'
  steppedBelow?: 'sm' | 'md' | 'lg'
  /** Step grouping for the stepped layout. Omitted: one field per step, heading = field label. */
  steps?: FormStep[]
  /** Stepped layout only: render select fields as tap-to-pick option rows. */
  selectAsOptions?: boolean
  /** Progress text; `{n}` and `{m}` are replaced. Default "Question {n} of {m}". */
  progressLabel?: string
  /** Next button text. Default "Next". */
  nextLabel?: string
  /** Next button text on the first step (design: "Start"). Default = `nextLabel`. */
  startLabel?: string
  /** Accessible name of the Back button (it shows an arrow). Default "Back". */
  backLabel?: string
  /**
   * Stepped layout only: icons in place of the text glyphs (✓ ← →). Omitted entries keep the glyph;
   * `send` is appended inside the submit button. Server-rendered nodes are fine.
   */
  icons?: Partial<Record<'check' | 'back' | 'next' | 'send', React.ReactNode>>
  tone?: 'light' | 'dark'
  submitVariant?: ButtonVariant
  submitSize?: ButtonSize
  className?: string
  classNames?: PayloadFormClassNames
  /** Unique per-instance prefix for element ids (CMSForm supplies it); falls back to `useId()` alone. */
  idPrefix?: string
}

const DEFAULT_SUCCESS = 'Thanks — we have it.'
const NO_TOKEN = 'Please wait for the security check to finish, then send again.'
const NETWORK = 'Something went wrong sending your message. Please check your connection and try again.'
const NO_SITE_KEY = 'This form is unavailable right now. Please try again in a few minutes.'

/** Tailwind 4 default breakpoints. */
const BREAKPOINT = { sm: '40rem', md: '48rem', lg: '64rem' } as const

/** True below the breakpoint, false on the server and before hydration (→ stacked SSR markup). */
function useBelow(bp: keyof typeof BREAKPOINT, enabled: boolean): boolean {
  const query = `(width < ${BREAKPOINT[bp]})`
  const subscribe = useCallback(
    (notify: () => void) => {
      if (!enabled) return () => {}
      const mql = window.matchMedia(query)
      mql.addEventListener('change', notify)
      return () => mql.removeEventListener('change', notify)
    },
    [enabled, query],
  )
  return useSyncExternalStore(
    subscribe,
    () => enabled && window.matchMedia(query).matches,
    () => false,
  )
}

const CONTROLS = 'input:not([type=hidden]),select,textarea'

export function PayloadForm({
  form,
  siteKey,
  confirmation,
  messages,
  sourcePath,
  leadMagnetId,
  submitLabel,
  turnstileAppearance = 'always',
  layout = 'stacked',
  steppedBelow = 'md',
  steps: stepDefs,
  selectAsOptions = false,
  progressLabel = 'Question {n} of {m}',
  nextLabel = 'Next',
  startLabel,
  backLabel = 'Back',
  icons,
  tone = 'light',
  submitVariant = 'primary',
  submitSize = 'md',
  className,
  classNames = {},
  idPrefix,
}: PayloadFormProps) {
  const router = useRouter()
  const [state, setState] = useState<FormSubmitResponse | null>(null)
  const [pending, setPending] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  /** First word of the submitted `name` field (null when the form has none): lets a confirmation address the visitor. */
  const [firstName, setFirstName] = useState<string | null>(null)
  const turnstileRef = useRef<TurnstileInstance | undefined>(undefined)
  const statusRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const reactId = useId()
  const idBase = idPrefix ? `${idPrefix}-${reactId}` : reactId

  const stepped = useBelow(steppedBelow, layout === 'stepped')
  const steps = useMemo(() => resolveSteps(form.fields, stepDefs), [form.fields, stepDefs])
  const lastStep = steps.length - 1
  const [step, setStepState] = useState(0)
  const [reachedLast, setReachedLast] = useState(false)
  /** What to focus after the next step change (`name: null` = the step's first control). */
  const focusTarget = useRef<{ name: string | null } | null>(null)
  /** Per-step validation messages (stepped only; the form is noValidate there), keyed by field name. */
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({})
  const current = Math.min(step, lastStep)

  /** `name` = the errored control; null = the new step's heading (or its first control when it has none). */
  const focusIn = (index: number, name: string | null) => {
    const group = formRef.current?.querySelector<HTMLElement>(`[data-step="${index}"]`)
    const target: HTMLElement | null | undefined = name
      ? group?.querySelector<HTMLElement>(`[name="${CSS.escape(FIELD_PREFIX + name)}"]`)
      : (document.getElementById(`${idBase}-step-${index}`) ?? group?.querySelector<HTMLElement>(CONTROLS))
    target?.focus()
  }

  const goTo = (index: number, focusName: string | null = null) => {
    if (index === current) return focusIn(index, focusName)
    focusTarget.current = { name: focusName }
    setStepState(index)
    if (index === lastStep) setReachedLast(true)
  }

  // Move focus to the new step's heading (or the errored field) once it is visible.
  useEffect(() => {
    if (!stepped || !focusTarget.current) return
    const { name } = focusTarget.current
    focusTarget.current = null
    focusIn(current, name)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- focusIn only reads refs and `idBase`
  }, [current, stepped])

  // After a server response: move focus to the outcome, unless `onResult` jumped to an errored step.
  const skipStatusFocus = useRef(false)
  useEffect(() => {
    if (!state) return
    if (skipStatusFocus.current) skipStatusFocus.current = false
    else statusRef.current?.focus()
  }, [state])

  /** Handle a server response (event-handler path, not an effect). */
  const onResult = (result: FormSubmitResponse) => {
    if (!result.ok) turnstileRef.current?.reset() // tokens are single-use
    setPending(false)
    setState(result)
    if (stepped && !result.ok && result.fieldErrors) {
      const errored = Object.keys(result.fieldErrors)
      for (const [index, s] of steps.entries()) {
        const hit = s.fields.find((f) => 'name' in f && errored.includes(f.name))
        if (hit && 'name' in hit) {
          skipStatusFocus.current = true
          goTo(index, hit.name)
          return
        }
      }
    }
  }

  /** First invalid control within `root` (native constraint validation), or null. */
  const firstInvalid = (root: ParentNode | null | undefined) =>
    root
      ? ([...root.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(CONTROLS)].find(
          (c) => !c.checkValidity(),
        ) ?? null)
      : null

  /** Show a stepped-layout validation failure inline on its field and focus it (jumping step if needed). */
  const showInvalid = (invalid: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
    const name = invalid.name.slice(FIELD_PREFIX.length)
    setClientErrors({ [name]: invalid.validationMessage || 'Please check this field.' })
    goTo(Number(invalid.closest<HTMLElement>('[data-step]')?.dataset.step ?? current), name)
  }

  const next = () => {
    const invalid = firstInvalid(formRef.current?.querySelector(`[data-step="${current}"]`))
    if (invalid) return showInvalid(invalid)
    setClientErrors({})
    if (current < lastStep) goTo(current + 1)
  }

  /** Editing a field clears its own inline validation message. */
  const onChange = (event: React.FormEvent<HTMLFormElement>) => {
    const name = (event.target as HTMLInputElement).name?.slice(FIELD_PREFIX.length)
    if (name && clientErrors[name]) setClientErrors(({ [name]: _drop, ...rest }) => rest)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (!stepped || current === lastStep || event.key !== 'Enter') return
    const target = event.target as HTMLElement
    if (target.tagName === 'INPUT') {
      event.preventDefault()
      next()
    }
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pending) return
    if (stepped) {
      // The form is noValidate while stepped (hidden steps can't show a native bubble): validate here.
      const invalid = firstInvalid(formRef.current)
      if (invalid) return showInvalid(invalid)
    }
    if (!siteKey) return setLocalError(NO_SITE_KEY)
    if (!turnstileRef.current?.getResponse()) return setLocalError(NO_TOKEN)
    setLocalError(null)
    const data = new FormData(event.currentTarget)
    const submittedName = data.get(`${FIELD_PREFIX}name`)
    setFirstName(typeof submittedName === 'string' ? (submittedName.trim().split(/\s+/)[0] ?? null) || null : null)
    setPending(true)
    fetch(FORM_SUBMIT_PATH, { method: 'POST', body: data, headers: { Accept: 'application/json' }, cache: 'no-store' })
      .then(async (res): Promise<FormSubmitResponse> => {
        const body: unknown = await res.json().catch(() => null)
        return body && typeof body === 'object' && 'ok' in body ? (body as FormSubmitResponse) : { ok: false, message: NETWORK }
      })
      .catch((): FormSubmitResponse => ({ ok: false, message: NETWORK }))
      .then((result) => {
        if (result.ok && result.redirect) {
          if (result.redirect.startsWith('/')) router.push(result.redirect)
          else window.location.assign(result.redirect)
          return // stay pending while navigating
        }
        onResult(result)
      })
  }

  if (state?.ok) {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className={cx('font-body outline-none', tone === 'dark' ? 'text-cream' : 'text-ink', classNames.success, className)}
      >
        <SubmittedFirstName value={firstName}>{confirmation ?? <p>{DEFAULT_SUCCESS}</p>}</SubmittedFirstName>
      </div>
    )
  }

  const serverErrors = state && !state.ok ? (state.fieldErrors ?? {}) : {}
  const fieldErrors = stepped ? { ...serverErrors, ...clientErrors } : serverErrors
  const message = localError ?? (state && !state.ok ? state.message : null)
  const fieldsClass = classNames.fields ?? 'flex flex-wrap gap-4'

  const renderFields = (list: PublicForm['fields'], hideSingleLabel: boolean) =>
    list.map((field) =>
      field.blockType === 'message' ? (
        <div key={field.key} className={cx('w-full font-body', classNames.field, classNames.fieldWide)}>
          {messages?.[field.key]}
        </div>
      ) : (
        <FieldControl
          key={field.name}
          field={field}
          id={`${idBase}-${field.name}`}
          error={fieldErrors[field.name]}
          tone={tone}
          slots={classNames}
          hideLabel={hideSingleLabel}
          selectAsOptions={stepped && selectAsOptions}
          optionCheck={stepped ? icons?.check : undefined}
        />
      ),
    )

  const turnstile =
    siteKey && (!stepped || reachedLast || lastStep === 0) ? (
      // interaction-only: no reserved height, so the row collapses unless Cloudflare needs a click.
      <div
        hidden={stepped && current !== lastStep}
        className={classNames.turnstile ?? (turnstileAppearance === 'interaction-only' ? 'w-full' : 'min-h-[65px] w-full')}
      >
        <TurnstileWidget
          ref={turnstileRef}
          siteKey={siteKey}
          id={`${idBase}-turnstile`}
          theme={tone}
          appearance={turnstileAppearance}
          onTokenChange={() => setLocalError(null)}
        />
      </div>
    ) : null

  const status = (
    <div
      ref={statusRef}
      tabIndex={-1}
      aria-live="polite"
      className={cx('font-body text-small outline-none', ERROR_TEXT[tone], classNames.status)}
    >
      {message ? <p role="alert">{message}</p> : null}
    </div>
  )

  const submitButton = (
    <Button
      type="submit"
      variant={submitVariant}
      size={submitSize}
      disabled={pending}
      aria-disabled={pending}
      className={cx(classNames.submit ?? (stepped ? 'flex-1' : 'self-start'), 'disabled:cursor-wait disabled:opacity-70')}
    >
      {pending ? 'Sending…' : submitLabel || form.submitButtonLabel}
      {stepped && !pending ? icons?.send : null}
    </Button>
  )

  const hidden = (
    <>
      <input type="hidden" name={FORM_ID_KEY} value={form.id} />
      {sourcePath ? <input type="hidden" name={SOURCE_PATH_KEY} value={sourcePath} /> : null}
      {leadMagnetId ? <input type="hidden" name={LEAD_MAGNET_KEY} value={leadMagnetId} /> : null}
    </>
  )

  if (!stepped) {
    return (
      <form
        ref={formRef}
        action={FORM_SUBMIT_PATH}
        method="post"
        onSubmit={onSubmit}
        aria-busy={pending}
        className={cx(classNames.form ?? 'flex flex-col gap-6', className)}
      >
        {hidden}
        <div className={fieldsClass}>{renderFields(form.fields, false)}</div>
        {turnstile}
        <div className={classNames.footer ?? 'flex flex-col gap-3'}>
          {status}
          {submitButton}
        </div>
      </form>
    )
  }

  const total = steps.length
  const progressText = progressLabel.replace('{n}', String(current + 1)).replace('{m}', String(total))
  const ink = tone === 'dark' ? 'bg-cream' : 'bg-ink'

  return (
    <form
      ref={formRef}
      action={FORM_SUBMIT_PATH}
      method="post"
      noValidate
      onSubmit={onSubmit}
      onKeyDown={onKeyDown}
      onChange={onChange}
      onInput={onChange}
      aria-busy={pending}
      className={cx(classNames.form ?? 'flex flex-col gap-6', className)}
    >
      {hidden}

      <div className={classNames.progress ?? 'flex flex-col gap-4'}>
        <div className="flex gap-1.5" aria-hidden="true">
          {steps.map((_, i) => (
            <span key={i} className={cx('h-[5px] flex-1', i <= current ? ink : 'bg-divider')} />
          ))}
        </div>
        <p
          aria-live="polite"
          className={classNames.progressLabel ?? 'font-mono text-label uppercase tracking-eyebrow text-gray-warm'}
        >
          {progressText}
        </p>
      </div>

      {steps.map((s, i) => {
        const headingId = `${idBase}-step-${i}`
        return (
          <div
            key={i}
            data-step={i}
            hidden={i !== current}
            role="group"
            aria-labelledby={s.heading ? headingId : undefined}
            className={classNames.step ?? 'flex flex-col gap-6'}
          >
            {s.heading || s.hint ? (
              <div className={classNames.stepHeader ?? 'flex flex-col gap-3'}>
                {s.heading ? (
                  <h3 id={headingId} tabIndex={-1} className="font-display text-h2-mobile font-normal uppercase outline-none">
                    {s.heading}
                  </h3>
                ) : null}
                {s.hint ? <div className="font-body text-small text-gray-warm">{s.hint}</div> : null}
              </div>
            ) : null}
            <div className={fieldsClass}>{renderFields(s.fields, !!s.heading && s.inputCount === 1)}</div>
          </div>
        )
      })}

      {turnstile}
      {status}

      <div className={classNames.stepNav ?? 'flex gap-3'}>
        <button
          type="button"
          disabled={current === 0}
          onClick={() => goTo(current - 1)}
          className={cx(
            'inline-flex min-h-target w-16 shrink-0 cursor-pointer items-center justify-center border-2 font-body text-body font-bold disabled:cursor-not-allowed disabled:opacity-40',
            tone === 'dark' ? 'border-cream text-cream' : 'border-ink text-ink',
          )}
        >
          {icons?.back ?? <span aria-hidden="true">←</span>}
          <span className="sr-only">{backLabel}</span>
        </button>
        {current === lastStep ? (
          // Distinct keys: the two buttons share a slot, and React would otherwise reuse the DOM node, flipping
          // type=button → submit mid-click so the Next click that arrived here also submitted (and errored) the form.
          React.cloneElement(submitButton, { key: 'send' })
        ) : (
          <Button key="next" variant={submitVariant} size={submitSize} onClick={next} className="flex-1">
            {current === 0 ? (startLabel ?? nextLabel) : nextLabel}
            {icons?.next ?? (
              <>
                {' '}
                <span aria-hidden="true">→</span>
              </>
            )}
          </Button>
        )}
      </div>
    </form>
  )
}
