import type { PayloadFormClassNames } from '@/components/forms'

/**
 * Styles the shared PayloadForm into the footer's compact "email + Join" row
 * (dark ground). Layout slots replace PayloadForm's defaults: `footer: contents`
 * lifts the button into the form's flex row; status and Turnstile (interaction-only:
 * zero height unless Cloudflare needs a click) wrap onto their own line below.
 * The label stays for screen readers only; the input is the design's underline-free
 * bordered field, sized for a 44px touch target (FieldControl's `min-h-target`).
 */
export const footerNudgeFormClassNames: PayloadFormClassNames = {
  form: 'flex flex-row flex-wrap items-start gap-x-2 gap-y-2',
  fields: 'flex min-w-0 flex-1 flex-wrap gap-4',
  field: 'gap-0!', // the sr-only label is out of flow but the column gap still offset the input 6px
  label: 'sr-only',
  control: 'text-[15px]! md:text-small! placeholder:text-cream/60',
  footer: 'contents',
  submit: 'self-stretch',
  turnstile: 'order-last basis-full',
  status: 'order-last basis-full',
  success: 'text-small',
}
