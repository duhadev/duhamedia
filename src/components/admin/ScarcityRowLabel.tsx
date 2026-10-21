'use client'

// Client component: Payload array RowLabels read live row data via useRowLabel (a client hook).
// Used by the `scarcity` global's `statements` so collapsed rows read
// "Builds line (Final CTA) — {builds} builds in progress. We cap at {capacity}."
import { useRowLabel } from '@payloadcms/ui'

import { SCARCITY_KEY_LABELS } from '../../lib/scarcity'

type StatementRow = { key?: string | null; statistic?: string | null }

export function ScarcityRowLabel() {
  const { data, rowNumber } = useRowLabel<StatementRow>()
  const fallback = `Statement ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`
  const type = data?.key ? (SCARCITY_KEY_LABELS[data.key] ?? data.key) : ''
  const label = [type, data?.statistic?.trim()].filter(Boolean).join(' — ')
  return <span>{label || fallback}</span>
}
