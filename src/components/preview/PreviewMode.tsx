import React from 'react'

import { getSiteUrl } from '@/lib/env'
import { getPreviewUser } from '@/lib/pages'
import { EXIT_PREVIEW_ROUTE } from '@/lib/preview'

import { PreviewBar } from './PreviewBar'

/**
 * Renders the draft-preview island (live-preview refresh + "Previewing draft ·
 * Exit" banner) ONLY when Next draft mode is on AND the request carries a
 * valid staff session — the same `getPreviewUser()` gate the page loaders use
 * (src/lib/pages.ts; request-cached, so no extra auth call). Public visitors
 * (no draft-mode cookie) get nothing: `getPreviewUser` returns before any
 * auth lookup. Mounted once in the (frontend) layout.
 */
export async function PreviewMode() {
  const user = await getPreviewUser()
  if (!user) return null
  return <PreviewBar serverURL={getSiteUrl()} exitRoute={EXIT_PREVIEW_ROUTE} />
}
