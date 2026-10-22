import type { PayloadFormClassNames } from '@/components/forms'

/**
 * Styles the shared PayloadForm into the design's inline "email + Join" row
 * (Case Study / Work / Services Hub "Newsletter CTA").
 *
 * Layout slots (`form`, `fields`, `footer`, `turnstile`, `submit`) REPLACE
 * PayloadForm's defaults, so they carry the whole layout and need no `!`.
 * `footer: contents` lifts the status line and the button into the form's
 * flex row; status and Turnstile (interaction-only: zero height unless
 * Cloudflare needs a click) wrap onto their own full-width line below.
 *
 * `control` is APPENDED to the base input classes (no tailwind-merge), so the
 * band's flat underline-free input still overrides background, radius and size
 * with the important modifier: the band's own visual classes, kept as designed.
 */
export const bandFormClassNames: PayloadFormClassNames = {
  form: 'flex flex-row flex-wrap items-start gap-x-2 gap-y-3',
  fields: 'flex min-w-0 flex-1 flex-wrap gap-4 md:w-60 md:flex-none',
  label: 'sr-only',
  control:
    'bg-transparent! rounded-none! text-[15px]! md:text-small! placeholder:text-gray-warm',
  footer: 'contents',
  submit: 'self-stretch',
  turnstile: 'order-last basis-full',
  status: 'order-last basis-full',
  success: 'text-small',
}
