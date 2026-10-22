import type { PublicForm, PublicFormField } from '@/integrations/forms/shared'
import type { Form } from '@/payload-types'

/**
 * The client-safe projection of a form-builder form: field definitions and
 * the submit label only. `emails` (notification addresses), `redirect`,
 * `confirmationMessage` (rendered server-side instead) and the integration
 * fields (`eventType`, `sendEvent`, `newsletterSync`, …) never reach the browser.
 */
export function toPublicForm(form: Form): PublicForm {
  const fields: PublicFormField[] = []
  for (const [index, f] of (form.fields ?? []).entries()) {
    if (f.blockType === 'message') {
      fields.push({ blockType: 'message', key: f.id ?? `message-${index}` })
      continue
    }
    const base = { name: f.name, label: f.label || f.name, required: f.required === true, width: f.width ?? undefined }
    switch (f.blockType) {
      case 'checkbox':
        fields.push({ ...base, blockType: 'checkbox', defaultValue: f.defaultValue ?? undefined })
        break
      case 'number':
        fields.push({ ...base, blockType: 'number', defaultValue: f.defaultValue ?? undefined })
        break
      case 'select':
        fields.push({
          ...base,
          blockType: 'select',
          defaultValue: f.defaultValue ?? undefined,
          placeholder: f.placeholder ?? undefined,
          options: (f.options ?? []).map((o) => ({ label: o.label, value: o.value })),
        })
        break
      case 'email':
        fields.push({ ...base, blockType: 'email', placeholder: f.placeholder ?? undefined })
        break
      case 'text':
      case 'textarea':
        fields.push({
          ...base,
          blockType: f.blockType,
          defaultValue: f.defaultValue ?? undefined,
          placeholder: f.placeholder ?? undefined,
        })
        break
      case 'date':
        fields.push({ ...base, blockType: 'date', defaultValue: f.defaultValue ?? undefined })
        break
    }
  }
  return { id: form.id, formKey: form.formKey, fields, submitButtonLabel: form.submitButtonLabel || 'Send' }
}
