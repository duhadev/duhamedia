import { draftMode } from 'next/headers'
import { getSafeRedirect } from 'payload/shared'

/**
 * GET /_preview/exit[?path=/<page-path>] — leave draft preview (router unit B2;
 * website template @ v3.91.0 next/exit-preview). Clears the draft-mode cookie
 * and returns to `path` (same-origin only) or `/`. Never cached.
 */
export const dynamic = 'force-dynamic'

export async function GET(request: Request): Promise<Response> {
  ;(await draftMode()).disable()
  const path = new URL(request.url).searchParams.get('path') ?? '/'
  return new Response(null, {
    status: 307,
    headers: { 'Cache-Control': 'private, no-store, max-age=0', Location: getSafeRedirect({ redirectTo: path, fallbackTo: '/' }) },
  })
}
