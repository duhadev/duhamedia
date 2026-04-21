import { neonAuth } from './server';
import { sql } from '@/lib/db';
import { redirect } from 'next/navigation';

export type AppUser = {
  id: string;
  email: string;
  name?: string | null;
  role: 'owner' | 'client';
  clientId: string | null;
};

export async function getCurrentUser(): Promise<AppUser | null> {
  const { user } = await neonAuth();
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
      // No invite — not allowed in
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
