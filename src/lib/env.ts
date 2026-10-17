import 'server-only'

/**
 * Runtime environment helpers. Server-only: read on every call, never inlined
 * at build time (no NEXT_PUBLIC_* anywhere), so one image serves every env.
 */
export type AppEnv = 'production' | 'staging' | 'development'

export function getAppEnv(): AppEnv {
  const value = process.env.APP_ENV
  return value === 'production' || value === 'staging' ? value : 'development'
}

export function isProduction(): boolean {
  return getAppEnv() === 'production'
}

export function getSiteUrl(): string {
  return (process.env.SITE_URL || 'http://localhost:3000').replace(/\/+$/, '')
}
