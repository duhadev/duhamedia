import { cookies } from 'next/headers';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { sql } from '@/lib/db';
import { redirect } from 'next/navigation';

export type AppUser = {
  id: string;
  email: string;
  name?: string | null;
  role: 'owner' | 'client';
  clientId: string | null;
};

// Verify the Neon Auth session JWT directly from the cookie.
// This avoids calling neonAuth() which tries to set cookies from a Server Component — not allowed in Next.js.
async function getSessionUser(): Promise<{ id: string; email: string; name?: string | null } | null> {
  const SESSION_COOKIE = '__Secure-neon-auth.session_token';
  const JWKS_URL = `${process.env.NEON_AUTH_BASE_URL}/.well-known/jwks.json`;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const JWKS = createRemoteJWKSet(new URL(JWKS_URL));
    const { payload } = await jwtVerify(token, JWKS);

    const sub = payload.sub as string | undefined;
    const email = (payload.email ?? payload['https://auth.neon.tech/email']) as string | undefined;
    const name = (payload.name ?? payload['https://auth.neon.tech/name']) as string | null | undefined;
    if (!sub || !email) return null;

    return { id: sub, email, name: name ?? null };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<AppUser | null> {
  const user = await getSessionUser();
  if (!user) return null;

  const rows = await sql`
    SELECT role, client_id
    FROM public.user_profiles
    WHERE id = ${user.id}
  `;

  if (rows.length === 0) {
    const isOwner = user.email === process.env.OWNER_EMAIL;
    let clientId: string | null = null;

    if (!isOwner) {
      const inviteRows = await sql`
        SELECT client_id FROM public.client_invites WHERE email = ${user.email}
      `;
      if (inviteRows.length === 0) return null;
      clientId = inviteRows[0].client_id as string;
    }

    await sql`
      INSERT INTO public.user_profiles (id, role, client_id)
      VALUES (${user.id}, ${isOwner ? 'owner' : 'client'}, ${clientId})
      ON CONFLICT (id) DO NOTHING
    `;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: isOwner ? 'owner' : 'client',
      clientId,
    };
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: rows[0].role as 'owner' | 'client',
    clientId: (rows[0].client_id as string) ?? null,
  };
}

export async function requireOwner(): Promise<AppUser> {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/sign-in');
  if (user.role !== 'owner') redirect('/dashboard');
  return user;
}

export async function requireClient(): Promise<AppUser & { clientId: string }> {
  const user = await getCurrentUser();
  if (!user || user.role !== 'client') redirect('/auth/sign-in');
  if (!user.clientId) redirect('/auth/sign-in');
  return user as AppUser & { clientId: string };
}
