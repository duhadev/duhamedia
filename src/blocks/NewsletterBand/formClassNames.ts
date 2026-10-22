import type { PayloadFormClassNames } from '@/components/forms'

/**
 * Styles the shared PayloadForm into the design's inline "email + Join" row
 * (Case Study / Work / Services Hub "Newsletter CTA"). PayloadForm's base
 * classes are not merged (no tailwind-merge), so the layout overrides use the
 * important modifier (`!`).
 */
export const bandFormClassNames: PayloadFormClassNames = {
  form: 'flex-row! flex-wrap! items-start gap-x-2! gap-y-3!',
  fields: 'min-w-0 flex-1 md:w-60 md:flex-none',
  field: 'gap-0!',
  label: 'sr-only',
  control:
    'bg-transparent! rounded-none! text-[15px]! md:text-small! placeholder:text-gray-warm',
  footer: 'contents!',
  submit: 'self-stretch!',
  turnstile: 'order-last w-0! min-w-full',
  status: 'order-last w-0! min-w-full',
  success: 'text-small',
}
