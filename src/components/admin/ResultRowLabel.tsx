'use client'

// Client component: Payload array RowLabels read live row data via useRowLabel (a client hook).
// Used by case-studies `resultsTable.rows` so collapsed rows read "Online revenue — +212%".
import { useRowLabel } from '@payloadcms/ui'

type ResultRow = { measure?: string | null; change?: string | null; after?: string | null }

export function ResultRowLabel() {
  const { data, rowNumber } = useRowLabel<ResultRow>()
  const fallback = `Result ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`
  const label = [data?.measure, data?.change || data?.after].filter(Boolean).join(' — ')
  return <span>{label || fallback}</span>
}
