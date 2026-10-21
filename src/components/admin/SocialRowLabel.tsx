'use client'

// Client component: Payload array RowLabels read live row data via useRowLabel (a client hook).
import { useRowLabel } from '@payloadcms/ui'

// Mirrors the `platform` select options in src/collections/TeamMembers.ts and
// src/globals/SiteSettings.ts (same six platforms). Kept here because a
// 'use client' module cannot share plain constants with the server-side collection config.
const PLATFORM_LABELS: Record<string, string> = {
  linkedin: 'LinkedIn',
  x: 'X (Twitter)',
  github: 'GitHub',
  instagram: 'Instagram',
  youtube: 'YouTube',
  facebook: 'Facebook',
}

// `handle` exists only on site-settings socials; team-member rows fall back to the URL.
type SocialRow = { platform?: string | null; handle?: string | null; url?: string | null }

export function SocialRowLabel() {
  const { data, rowNumber } = useRowLabel<SocialRow>()
  const fallback = `Social link ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`
  const platform = data?.platform ? (PLATFORM_LABELS[data.platform] ?? data.platform) : ''
  const url = data?.url?.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') ?? ''
  const label = [platform, data?.handle?.trim() || url].filter(Boolean).join(' — ')
  return <span>{label || fallback}</span>
}
