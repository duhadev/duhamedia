import type { Access, FieldAccess, PayloadRequest } from 'payload'

// Boot scaffolding (Phase 1). Role model is revised at Gate S (Phase 2).
export const ROLES = ['admin', 'marketing'] as const
export type Role = (typeof ROLES)[number]

type MaybeUserWithRoles = { roles?: Role[] | null } | null | undefined

export const isAdmin = (user: unknown): boolean =>
  Boolean((user as MaybeUserWithRoles)?.roles?.includes('admin'))

export const authenticated = ({ req }: { req: PayloadRequest }): boolean => Boolean(req.user)

export const adminOnly: Access = ({ req }) => isAdmin(req.user)

export const adminOnlyField: FieldAccess = ({ req }) => isAdmin(req.user)

/** Admins see/edit every user; anyone else only their own document. */
export const adminOrSelf: Access = ({ req }) => {
  if (!req.user) return false
  if (isAdmin(req.user)) return true
  return { id: { equals: req.user.id } }
}
