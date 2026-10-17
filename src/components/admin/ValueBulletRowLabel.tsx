'use client'

// Client component: Payload array RowLabels read live row data via useRowLabel (a client hook).
// Used by lead-magnets `valueBullets` so collapsed rows read as the bullet text.
import { useRowLabel } from '@payloadcms/ui'

type BulletRow = { text?: string | null }

const MAX = 60

export function ValueBulletRowLabel() {
  const { data, rowNumber } = useRowLabel<BulletRow>()
  const fallback = `Bullet ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`
  const t = data?.text?.trim() ?? ''
  const label = t.length > MAX ? `${t.slice(0, MAX - 1).trimEnd()}…` : t
  return <span>{label || fallback}</span>
}
