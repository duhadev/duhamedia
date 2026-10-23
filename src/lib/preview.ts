import { getSiteUrl } from './siteUrl'

/**
 * Draft-preview URLs (router unit B2). Used by collection `admin.preview` /
 * `admin.livePreview.url` (payload@3.91.0 config/types.d.ts `GeneratePreviewURL`,
 * `LivePreviewConfig.url`), so this file must stay importable outside Next
 * (Payload CLI): no `server-only`, no `next/*`.
 *
 * The URL points at the frontend preview route (`/_preview`, src/app/(frontend)/
 * %5Fpreview/route.ts), which turns Next draft mode on for a logged-in STAFF
 * user only and then redirects to `path`. Origin = server-side `SITE_URL`
 * (never NEXT_PUBLIC_*) via the shared `getSiteUrl()` (src/lib/siteUrl.ts):
 * absolute, which the admin needs — it posts the live-preview messages with the
 * preview URL as `targetOrigin`. If SITE_URL is missing outside development
 * (getSiteUrl throws), the URL degrades to relative so the admin edit view
 * still opens (the admin and the site share one origin); the site itself
 * reports the misconfiguration (F65 B1, /api/health 503).
 *
 * `_`-prefixed first segments are reserved for the site itself (pagePath.ts,
 * redirects `from` validation), so no page or redirect can collide with it.
 */
export const PREVIEW_ROUTE = '/_preview'
export const EXIT_PREVIEW_ROUTE = '/_preview/exit'

/** Live preview iframe sizes offered in the admin toolbar (mobile / tablet / desktop QA widths). */
export const PREVIEW_BREAKPOINTS = [
  { name: 'mobile', label: 'Mobile (390)', width: 390, height: 844 },
  { name: 'tablet', label: 'Tablet (768)', width: 768, height: 1024 },
  { name: 'desktop', label: 'Desktop (1440)', width: 1440, height: 900 },
]

/** `SITE_URL` + `/_preview?path=<path>`, or `null` when the doc has no public path yet. */
export const previewUrl = (path: string | null | undefined): string | null => {
  if (!path) return null
  let origin = ''
  try {
    origin = getSiteUrl()
  } catch {
    origin = ''
  }
  return `${origin}${PREVIEW_ROUTE}?${new URLSearchParams({ path }).toString()}`
}
