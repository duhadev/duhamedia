'use client'

import React from 'react'

import { FIELD_PREFIX, MAX_LENGTH, type PublicFormField } from '@/integrations/forms/shared'
import { cx } from '@/lib/cx'

/**
 * One form-builder input field (PayloadForm's renderer). DS `Input` look:
 * uppercase label, 2px border, `--radius-sm`, 44px min height, accent focus.
 */

export type InputField = Exclude<PublicFormField, { blockType: 'message' }>

export type FieldSlots = Partial<Record<'field' | 'label' | 'control' | 'error' | 'option', string>>

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
export const ERROR_TEXT = { light: 'text-wine', dark: 'text-gold-pale' } as const

/** Same rule as the server's EMAIL_PATTERN (handleSubmission.ts), so the browser catches it first. */
const EMAIL_PATTERN = '[^\\s@]+@[^\\s@.]+(\\.[^\\s@.]+)+'

/** Option rows (selectAsOptions): real radios, so no-JS posting and native validation still work. */
const OPTION_ROW = {
  light:
    'flex min-h-target cursor-pointer items-center justify-between gap-3 border-2 border-ink px-4 py-3.5 font-body font-bold has-[:checked]:bg-ink has-[:checked]:text-cream has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink',
  dark: 'flex min-h-target cursor-pointer items-center justify-between gap-3 border-2 border-cream px-4 py-3.5 font-body font-bold has-[:checked]:bg-cream has-[:checked]:text-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-cream',
} as const

export function FieldControl({
  field,
  id,
  error,
  tone,
  slots,
  hideLabel = false,
  selectAsOptions = false,
}: {
  field: InputField
  id: string
  error?: string
  tone: 'light' | 'dark'
  slots: FieldSlots
  /** Visually hide the label (kept for screen readers): a step heading already names the field. */
  hideLabel?: boolean
  /** Render a select as tap-to-pick radio rows. */
  selectAsOptions?: boolean
}) {
  const name = `${FIELD_PREFIX}${field.name}`
  const errorId = `${id}-error`
  const describedBy = error ? errorId : undefined
  const control = cx(CONTROL_BASE, CONTROL_TONE[tone], error ? 'border-wine' : CONTROL_BORDER[tone], slots.control)
  const width = field.width && field.width < 100 ? field.width : null
  const wrapper = cx(
    'flex w-full flex-col gap-1.5 font-body',
    width !== null && 'sm:w-[calc(var(--field-w)-0.5rem)]',
    tone === 'dark' ? 'text-cream' : 'text-ink',
    slots.field,
  )
  const style = width ? ({ '--field-w': `${width}%` } as React.CSSProperties) : undefined
  const errorNode = error ? (
    <span id={errorId} className={cx('text-small', ERROR_TEXT[tone], slots.error)}>
      {error}
    </span>
  ) : null
  const labelText = (
    <>
      {field.label}
      {field.required ? <span aria-hidden="true"> *</span> : null}
    </>
  )
  const labelClass = hideLabel ? 'sr-only' : cx(LABEL, slots.label)

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
          <span className={cx('text-small', slots.label)}>{labelText}</span>
        </label>
        {errorNode}
      </div>
    )
  }

  if (field.blockType === 'select' && selectAsOptions) {
    return (
      <fieldset
        className={cx(wrapper, 'm-0 border-0 p-0')}
        style={style}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
      >
        <legend className={labelClass}>{labelText}</legend>
        <div className="flex flex-col gap-2.5">
          {field.options.map((o, i) => (
            <label key={o.value} className={cx(OPTION_ROW[tone], slots.option)}>
              <span>{o.label}</span>
              <input
                id={i === 0 ? id : undefined}
                type="radio"
                name={name}
                value={o.value}
                required={field.required}
                defaultChecked={field.defaultValue === o.value}
                className="peer sr-only"
              />
              <span aria-hidden="true" className="hidden peer-checked:inline">
                ✓
              </span>
            </label>
          ))}
        </div>
        {errorNode}
      </fieldset>
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
          pattern={EMAIL_PATTERN}
          title="An email address like name@example.com"
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
      <label htmlFor={id} className={hideLabel ? 'sr-only' : undefined}>
        {hideLabel ? labelText : <span className={labelClass}>{labelText}</span>}
      </label>
      {input}
      {errorNode}
    </div>
  )
}
