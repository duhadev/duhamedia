import 'server-only'

/**
 * Runtime environment helpers for Next server code. Server-only: read on every
 * call, never inlined at build time (no NEXT_PUBLIC_* anywhere), so one image
 * serves every env. The implementations live in `./siteUrl` (importable from
 * the Payload config too: one shared SITE_URL helper, F65 B1).
 */
import { getAppEnv } from './siteUrl'

export { absoluteUrl, getAppEnv, getSiteUrl, type AppEnv } from './siteUrl'

export function isProduction(): boolean {
  return getAppEnv() === 'production'
}
