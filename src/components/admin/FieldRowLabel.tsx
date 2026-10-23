'use client'

// Shared array RowLabel (F62): collapsed/expanded rows read as the row's own title-ish
// field(s) instead of the stock "Step 01". Configured per array through `clientProps`
// (see ./rowLabel.ts). Client component: useRowLabel is a client hook reading live row data.
import { useRowLabel } from '@payloadcms/ui'

import { SCARCITY_KEY_LABELS } from '../../lib/scarcity'

type Props = {
  /** Field names (dot paths allowed, e.g. `link.label`) tried in order; every non-empty value is joined with " — ". */
  fields: string[]
  /** Stock-style fallback noun, e.g. "Step" -> "Step 01" when no field has a value yet. */
  fallback: string
  /** Map stored select values to their labels (scarcity keys). */
  scarcityKeys?: boolean
}

const read = (data: unknown, path: string): string => {
  let cur: unknown = data
  for (const part of path.split('.')) {
    if (cur === null || typeof cur !== 'object') return ''
    cur = (cur as Record<string, unknown>)[part]
  }
  if (Array.isArray(cur)) return cur.filter((v) => typeof v === 'string' && v.trim()).join(', ')
  return typeof cur === 'string' || typeof cur === 'number' ? String(cur).trim() : ''
}

export function FieldRowLabel({ fields, fallback, scarcityKeys }: Props) {
  const { data, rowNumber } = useRowLabel<Record<string, unknown>>()
  const stock = `${fallback} ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`
  const parts = (fields ?? [])
    .map((f) => read(data, f))
    .filter((v) => v && !(scarcityKeys && v === 'none'))
    .map((v) => (scarcityKeys ? (SCARCITY_KEY_LABELS[v] ?? v) : v))
  return <span>{parts.length ? parts.join(' — ') : stock}</span>
}
