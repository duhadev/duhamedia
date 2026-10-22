import type React from 'react'

import type { PublicFormField } from '@/integrations/forms/shared'

/** One step of the stepped (phone) layout. `fieldNames` are form-builder field names. */
export type FormStep = {
  fieldNames: string[]
  /** Visible step heading. Default: the field's label when the step has one field. */
  heading?: React.ReactNode
  hint?: React.ReactNode
}

export type ResolvedStep = {
  heading: React.ReactNode | null
  hint: React.ReactNode | null
  /** Fields in FORM order (message blocks included). */
  fields: PublicFormField[]
  /** Exactly one input field: its label is visually hidden when a heading shows. */
  inputCount: number
}

/**
 * Split a form into steps.
 * - No `steps`: one step per input field, heading = the field label.
 * - With `steps`: each input field goes to the first step naming it; unknown
 *   names are ignored, empty steps dropped, and input fields no step names are
 *   appended to the LAST step, so nothing a server-side rule needs can be skipped.
 * - Message blocks travel with the next input field (or the last step).
 */
export function resolveSteps(fields: PublicFormField[], steps?: FormStep[]): ResolvedStep[] {
  const inputs = fields.filter((f): f is Exclude<PublicFormField, { blockType: 'message' }> => f.blockType !== 'message')
  const defs: FormStep[] =
    steps && steps.length > 0 ? steps : inputs.map((f) => ({ fieldNames: [f.name], heading: f.label }))

  const stepOf = new Map<string, number>()
  defs.forEach((def, i) => {
    for (const name of def.fieldNames) if (!stepOf.has(name)) stepOf.set(name, i)
  })
  // Drop steps that ended up with no real field, re-index.
  const used = [...new Set(inputs.map((f) => stepOf.get(f.name)).filter((i): i is number => i !== undefined))].sort(
    (a, b) => a - b,
  )
  if (used.length === 0) return [{ heading: null, hint: null, fields, inputCount: inputs.length }]
  const reindex = new Map(used.map((old, i) => [old, i]))
  const last = used.length - 1

  const out: ResolvedStep[] = used.map((old) => ({
    heading: defs[old].heading ?? null,
    hint: defs[old].hint ?? null,
    fields: [],
    inputCount: 0,
  }))

  const pendingMessages: PublicFormField[] = []
  for (const f of fields) {
    if (f.blockType === 'message') {
      pendingMessages.push(f)
      continue
    }
    const old = stepOf.get(f.name)
    const idx = old === undefined ? last : reindex.get(old)!
    out[idx].fields.push(...pendingMessages.splice(0), f)
    out[idx].inputCount += 1
  }
  out[last].fields.push(...pendingMessages)

  // A single-field step with no explicit heading uses the field label.
  for (const s of out) {
    if (s.heading === null && s.inputCount === 1) {
      const only = s.fields.find((f) => f.blockType !== 'message')
      if (only && 'label' in only) s.heading = only.label
    }
  }
  return out
}
