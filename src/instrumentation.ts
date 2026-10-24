import type { Instrumentation } from 'next'

/**
 * A4: server-side request errors → `site_error` (src/integrations/siteError/report.ts).
 * next@16.3.8 docs 01-app/03-api-reference/03-file-conventions/instrumentation.md:
 * `onRequestError(error, request, context)` runs for Server Components, route
 * handlers, server actions and proxy; Next awaits it, so the reporter only
 * does synchronous work and queues the job fire-and-forget. Node runtime only
 * (the reporter uses node:crypto; NEXT_RUNTIME is inlined, so the edge build
 * drops the import). Never throws.
 */
export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  try {
    const { reportNextRequestError } = await import('./integrations/siteError/report')
    reportNextRequestError(error, request, context)
  } catch {
    /* reporting must never affect the request */
  }
}
