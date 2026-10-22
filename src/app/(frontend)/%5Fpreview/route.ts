import config from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { getSafeRedirect } from 'payload/shared'

import { isStaff } from '@/access'

/**
 * GET /_preview?path=/<page-path> — enter draft preview (router unit B2).
 *
 * Pattern: Payload website template @ v3.91.0
 * (templates/website/src/app/(frontend)/next/preview/route.ts), tightened:
 * - Auth is the gate: the request must carry a valid Payload session
 *   (`payload.auth` reads the admin's `payload-token` cookie / auth header,
 *   payload@3.91.0 auth/operations/auth.d.ts) of a STAFF user (admin or
 *   marketing). The pipeline API user and the public get 403. No shared
 *   PREVIEW_SECRET: it would sit in every admin preview URL and add nothing
 *   on top of the session check.
 * - `path` must be a same-origin relative path (`getSafeRedirect`,
 *   payload/shared), so this can never be an open redirect.
 * - The page loader re-checks the staff session on EVERY request
 *   (src/lib/pages.ts `getPreviewUser`); the draft-mode cookie alone never
 *   shows a draft.
 * - Every response is `Cache-Control: no-store` (CLAUDE.md Security §5: never
 *   cache preview responses). Next merges the draft-mode cookie into a returned
 *   Response (next@16.3.8 server/route-modules/app-route/module.js:524).
 * - `_` first segment: reserved, so no page or redirect can take this path.
 */
export const dynamic = 'force-dynamic'

const NO_STORE = { 'Cache-Control': 'private, no-store, max-age=0' }

const refuse = async (status: number, message: string): Promise<Response> => {
  ;(await draftMode()).disable()
  return new Response(message, { status, headers: { ...NO_STORE, 'Content-Type': 'text/plain; charset=utf-8' } })
}

export async function GET(request: Request): Promise<Response> {
  const path = new URL(request.url).searchParams.get('path') ?? ''
  const safePath = getSafeRedirect({ redirectTo: path, fallbackTo: '' })
  if (!safePath) return refuse(400, 'Preview needs a page path on this site.')

  let allowed = false
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: request.headers, canSetHeaders: false })
    allowed = Boolean(user && user.collection === 'users' && isStaff(user))
  } catch {
    allowed = false
  }
  if (!allowed) return refuse(403, 'You are not allowed to preview this page. Log in to the admin first.')

  ;(await draftMode()).enable()
  return new Response(null, { status: 307, headers: { ...NO_STORE, Location: safePath } })
}
