import { headers } from 'next/headers';
import { sql } from '@/lib/db';
import { redirect } from 'next/navigation';

export type AppUser = {
  id: string;
  email: string;
  name?: string | null;
  role: 'owner' | 'client';
  clientId: string | null;
};

// Fetch the session from Neon Auth directly, forwarding only the neon-auth cookies.
// We deliberately skip the set-cookie step — the middleware already handles cookie
// refresh, and Server Components cannot write cookies anyway.
async function getSessionUser(): Promise<{ id: string; email: string; name?: string | null } | null> {
  const baseUrl = process.env.NEON_AUTH_BASE_URL;
  if (!baseUrl) return null;

  try {
    const headerStore = await headers();
    const allCookies = headerStore.get('cookie') ?? '';
    const neonCookies = allCookies
      .split(';')
      .map(c => c.trim())
      .filter(c => c.startsWith('__Secure-neon-auth') || c.startsWith('neon-auth'))
      .join('; ');

    const res = await fetch(`${baseUrl}/get-session`, {
      method: 'GET',
      headers: { Cookie: neonCookies },
      cache: 'no-store',
    });

    if (!res.ok) return null;
    const body = await res.json();
    if (!body?.user) return null;

    return {
      id: body.user.id as string,
      email: body.user.email as string,
      name: (body.user.name as string | null) ?? null,
    };
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
