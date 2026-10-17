/**
 * Role model (SCHEMA.md §4.1, Gate S approved 2026-10-17).
 *
 * One `role` per user (`users.role`, single select, `saveToJWT: true`). Roles are
 * mutually exclusive on purpose: the pipeline user must never also be staff.
 * An unknown or missing role means NO access, never "logged-in = allowed".
 */
export const ROLES = ['admin', 'marketing', 'pipeline'] as const
export type Role = (typeof ROLES)[number]

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Admin',
  marketing: 'Marketing',
  pipeline: 'Pipeline (API key only)',
}

type MaybeUser = { role?: string | null } | null | undefined

/** The user's role, or `null` when absent/unknown (=> no access anywhere). */
export const roleOf = (user: unknown): Role | null => {
  const role = (user as MaybeUser)?.role
  return typeof role === 'string' && (ROLES as readonly string[]).includes(role) ? (role as Role) : null
}

export const isAdmin = (user: unknown): boolean => roleOf(user) === 'admin'
export const isMarketing = (user: unknown): boolean => roleOf(user) === 'marketing'
/** Staff = the humans: admin or marketing. Never the pipeline user. */
export const isStaff = (user: unknown): boolean => isAdmin(user) || isMarketing(user)
export const isPipeline = (user: unknown): boolean => roleOf(user) === 'pipeline'

