import { isProduction } from '@/lib/env'

/** /_showcase exists on local dev and staging only: 404 when APP_ENV=production. */
export const showcaseEnabled = (): boolean => !isProduction()
