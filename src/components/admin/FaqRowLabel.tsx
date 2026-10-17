'use client'

// Client component: Payload array RowLabels read live row data via useRowLabel (a client hook).
// Collapsed FAQ rows read as the question text instead of "Question 01".
import { useRowLabel } from '@payloadcms/ui'

type FaqRow = { question?: string | null }

const MAX = 60

export function FaqRowLabel() {
  const { data, rowNumber } = useRowLabel<FaqRow>()
  const fallback = `Question ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`
  const q = data?.question?.trim() ?? ''
  const label = q.length > MAX ? `${q.slice(0, MAX - 1).trimEnd()}…` : q
  return <span>{label || fallback}</span>
}
