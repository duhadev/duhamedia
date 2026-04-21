'use server';
import { sql } from '@/lib/db';

export async function checkEmailAllowed(email: string): Promise<boolean> {
  if (email === process.env.OWNER_EMAIL) return true;
  const rows = await sql`
    SELECT 1 FROM public.client_invites WHERE email = ${email} LIMIT 1
  `;
  return rows.length > 0;
}
