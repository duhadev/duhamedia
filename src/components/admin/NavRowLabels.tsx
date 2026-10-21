'use client'

// Client components: Payload array RowLabels read live row data via useRowLabel (a client hook).
// Used by the `navigation` global so collapsed rows read as the link text ("Work",
// "Book a Call") or the footer column title ("Pages") instead of "Link 01".
import { useRowLabel } from '@payloadcms/ui'

type LinkRow = { link?: { label?: string | null; url?: string | null } | null }
type ColumnRow = { title?: string | null; links?: unknown[] | null }

const pad = (n: number | undefined) => String((n ?? 0) + 1).padStart(2, '0')

export function NavLinkRowLabel() {
  const { data, rowNumber } = useRowLabel<LinkRow>()
  const label = data?.link?.label?.trim() || data?.link?.url?.trim() || ''
  return <span>{label || `Link ${pad(rowNumber)}`}</span>
}

export function FooterColumnRowLabel() {
  const { data, rowNumber } = useRowLabel<ColumnRow>()
  const title = data?.title?.trim() ?? ''
  const count = Array.isArray(data?.links) ? data.links.length : 0
  const base = title || `Column ${pad(rowNumber)}`
  return <span>{count > 0 ? `${base} (${count} ${count === 1 ? 'link' : 'links'})` : base}</span>
}
