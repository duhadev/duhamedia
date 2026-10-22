'use client'

import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { useRouter } from 'next/navigation'
import React, { useEffect, useId, useRef, useState } from 'react'

import { Button, type ButtonSize, type ButtonVariant } from '@/components/ui'
import {
  FIELD_PREFIX,
  FORM_ID_KEY,
  FORM_SUBMIT_PATH,
  LEAD_MAGNET_KEY,
  MAX_LENGTH,
  SOURCE_PATH_KEY,
  type FormSubmitResponse,
  type PublicForm,
  type PublicFormField,
} from '@/integrations/forms/shared'
import { cx } from '@/lib/cx'

import { TurnstileWidget, type TurnstileAppearance } from './TurnstileWidget'

/**
 * Renders one form-builder form and submits it to POST /api/form-submit
 * (src/app/api/form-submit/route.ts: Turnstile → validation → store). Client component: it needs
 * the Turnstile widget, pending state and inline errors.
 *
 * Use it through the server wrapper `CMSForm` (./CMSForm.tsx), which loads the
 * form, strips `emails`/integration settings, reads the site key at runtime
 * and renders the rich-text confirmation + message blocks on the server.
 *
 * Styling: DS `Input` (design-system-project/components/core/Input.jsx):
 * uppercase label, 2px border, `--radius-sm`, 44px min height, accent focus.
 * Blocks restyle via `className`/`classNames` slots and `tone`, never by forking.
 *
 * With JS: `fetch` with the form's own FormData and `Accept: application/json`;
 * inputs are kept on error, the outcome is announced and focused. Before
 * hydration / without JS the plain `action`+`method="post"` posts to the same
 * route, which answers with a minimal HTML page or a 303 (no Turnstile token
 * without JS, so that visitor gets the friendly Turnstile message).
 */

/**
 * Slot classes. Layout slots (`form`, `fields`, `footer`, `turnstile`, `submit`)
 * REPLACE the default layout classes when set; the others are appended.
 * Defaults: form `flex flex-col gap-6`, fields `flex flex-wrap gap-4`,
 * footer `flex flex-col gap-3`, submit `self-start`, turnstile `min-h-[65px] w-full`
 * (`w-full` with interaction-only).
 */
export type PayloadFormClassNames = Partial<
  Record<'form' | 'fields' | 'field' | 'label' | 'control' | 'error' | 'turnstile' | 'footer' | 'submit' | 'status' | 'success', string>
>

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
  tone?: 'light' | 'dark'
  submitVariant?: ButtonVariant
  submitSize?: ButtonSize
  className?: string
  classNames?: PayloadFormClassNames
}

const LABEL = 'font-body text-label uppercase tracking-eyebrow'
const CONTROL_BASE =
  'w-full min-h-target rounded-sm border-2 px-3.5 py-3 font-body text-base font-medium outline-none transition-colors duration-180 ease-out'
const CONTROL_TONE = {
  light: 'bg-cream text-ink',
  dark: 'bg-transparent text-cream',
} as const
/** Border colour is chosen as one class (no tailwind-merge, so never two competing border colours). */
const CONTROL_BORDER = {
  light: 'border-ink focus:border-accent-primary',
  dark: 'border-cream',
} as const
const ERROR_TEXT = { light: 'text-wine', dark: 'text-gold-pale' } as const

const DEFAULT_SUCCESS = 'Thanks — we have it.'
const NO_TOKEN = "Please wait for the security check to finish, then send again."
const NETWORK = 'Something went wrong sending your message. Please check your connection and try again.'
const NO_SITE_KEY = 'This form is unavailable right now. Please try again in a few minutes.'

export function PayloadForm({
  form,
  siteKey,
  confirmation,
  messages,
  sourcePath,
  leadMagnetId,
  submitLabel,
  turnstileAppearance = 'always',
  tone = 'light',
  submitVariant = 'primary',
  submitSize = 'md',
  className,
  classNames = {},
}: PayloadFormProps) {
  const router = useRouter()
  const [state, setState] = useState<FormSubmitResponse | null>(null)
  const [pending, setPending] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const turnstileRef = useRef<TurnstileInstance | undefined>(undefined)
  const statusRef = useRef<HTMLDivElement>(null)
  const idBase = useId()

  // Tokens are single-use: reset after every server response; move focus to the outcome.
  useEffect(() => {
    if (!state) return
    if (!state.ok) turnstileRef.current?.reset()
    statusRef.current?.focus()
  }, [state])

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pending) return
    if (!siteKey) return setLocalError(NO_SITE_KEY)
    if (!turnstileRef.current?.getResponse()) return setLocalError(NO_TOKEN)
    setLocalError(null)
    const data = new FormData(event.currentTarget)
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
        setPending(false)
        setState(result)
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
        {confirmation ?? <p>{DEFAULT_SUCCESS}</p>}
      </div>
    )
  }

  const fieldErrors = state && !state.ok ? (state.fieldErrors ?? {}) : {}
  const message = localError ?? (state && !state.ok ? state.message : null)

  return (
    <form
      action={FORM_SUBMIT_PATH}
      method="post"
      onSubmit={onSubmit}
      aria-busy={pending}
      className={cx(classNames.form ?? 'flex flex-col gap-6', className)}
    >
      <input type="hidden" name={FORM_ID_KEY} value={form.id} />
      {sourcePath ? <input type="hidden" name={SOURCE_PATH_KEY} value={sourcePath} /> : null}
      {leadMagnetId ? <input type="hidden" name={LEAD_MAGNET_KEY} value={leadMagnetId} /> : null}

      <div className={classNames.fields ?? 'flex flex-wrap gap-4'}>
        {form.fields.map((field) =>
          field.blockType === 'message' ? (
            <div key={field.key} className={cx('w-full font-body', classNames.field)}>
              {messages?.[field.key]}
            </div>
          ) : (
            <FieldControl
              key={field.name}
              field={field}
              id={`${idBase}-${field.name}`}
              error={fieldErrors[field.name]}
              tone={tone}
              classNames={classNames}
            />
          ),
        )}
      </div>

      {siteKey ? (
        // interaction-only: no reserved height, so the row collapses unless Cloudflare needs a click.
        <div className={classNames.turnstile ?? (turnstileAppearance === 'interaction-only' ? 'w-full' : 'min-h-[65px] w-full')}>
          <TurnstileWidget
            ref={turnstileRef}
            siteKey={siteKey}
            theme={tone}
            appearance={turnstileAppearance}
            onTokenChange={() => setLocalError(null)}
          />
        </div>
      ) : null}

      <div className={classNames.footer ?? 'flex flex-col gap-3'}>
        <div
          ref={statusRef}
          tabIndex={-1}
          aria-live="polite"
          className={cx('font-body text-small outline-none', ERROR_TEXT[tone], classNames.status)}
        >
          {message ? <p role="alert">{message}</p> : null}
        </div>
        <Button
          type="submit"
          variant={submitVariant}
          size={submitSize}
          disabled={pending}
          aria-disabled={pending}
          className={cx(classNames.submit ?? 'self-start', 'disabled:cursor-wait disabled:opacity-70')}
        >
          {pending ? 'Sending…' : submitLabel || form.submitButtonLabel}
        </Button>
      </div>
    </form>
  )
}

function FieldControl({
  field,
  id,
  error,
  tone,
  classNames,
}: {
  field: Exclude<PublicFormField, { blockType: 'message' }>
  id: string
  error?: string
  tone: 'light' | 'dark'
  classNames: PayloadFormClassNames
}) {
  const name = `${FIELD_PREFIX}${field.name}`
  const errorId = `${id}-error`
  const describedBy = error ? errorId : undefined
  const control = cx(CONTROL_BASE, CONTROL_TONE[tone], error ? 'border-wine' : CONTROL_BORDER[tone], classNames.control)
  const width = field.width && field.width < 100 ? field.width : null
  const wrapper = cx(
    'flex w-full flex-col gap-1.5 font-body',
    width !== null && 'sm:w-[calc(var(--field-w)-0.5rem)]',
    tone === 'dark' ? 'text-cream' : 'text-ink',
    classNames.field,
  )
  const style = width ? ({ '--field-w': `${width}%` } as React.CSSProperties) : undefined
  const errorNode = error ? (
    <span id={errorId} className={cx('text-small', ERROR_TEXT[tone], classNames.error)}>
      {error}
    </span>
  ) : null
  const label = (
    <span className={cx(LABEL, classNames.label)}>
      {field.label}
      {field.required ? <span aria-hidden="true"> *</span> : null}
    </span>
  )

  if (field.blockType === 'checkbox') {
    return (
      <div className={wrapper} style={style}>
        <label htmlFor={id} className="flex min-h-target cursor-pointer items-center gap-3">
          <input
            id={id}
            name={name}
            type="checkbox"
            value="true"
            defaultChecked={field.defaultValue === true}
            required={field.required}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className="size-5 shrink-0 cursor-pointer accent-ink"
          />
          <span className={cx('text-small', classNames.label)}>
            {field.label}
            {field.required ? <span aria-hidden="true"> *</span> : null}
          </span>
        </label>
        {errorNode}
      </div>
    )
  }

  const common = {
    id,
    name,
    required: field.required,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    className: control,
  } as const

  let input: React.ReactNode
  switch (field.blockType) {
    case 'textarea':
      input = (
        <textarea
          {...common}
          rows={4}
          maxLength={MAX_LENGTH.textarea}
          placeholder={field.placeholder}
          defaultValue={field.defaultValue}
        />
      )
      break
    case 'select':
      input = (
        <select {...common} defaultValue={field.defaultValue ?? ''}>
          <option value="" disabled={field.required}>
            {field.placeholder || 'Choose one'}
          </option>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )
      break
    case 'number':
      input = <input {...common} type="number" inputMode="decimal" defaultValue={field.defaultValue} />
      break
    case 'date':
      input = <input {...common} type="date" defaultValue={field.defaultValue} />
      break
    case 'email':
      input = (
        <input
          {...common}
          type="email"
          autoComplete="email"
          maxLength={MAX_LENGTH.email}
          placeholder={field.placeholder}
          defaultValue={field.defaultValue}
        />
      )
      break
    default:
      input = (
        <input
          {...common}
          type="text"
          autoComplete={/name/i.test(field.name) ? 'name' : /company/i.test(field.name) ? 'organization' : undefined}
          maxLength={MAX_LENGTH.text}
          placeholder={field.placeholder}
          defaultValue={field.defaultValue}
        />
      )
  }

  return (
    <div className={wrapper} style={style}>
      <label htmlFor={id}>{label}</label>
      {input}
      {errorNode}
    </div>
  )
}
