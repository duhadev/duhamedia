'use server';
import { sql } from '@/lib/db';
import { requireOwner } from '@/lib/auth/helpers';
import { revalidatePath } from 'next/cache';

export async function markRead(id: string) {
  await requireOwner();
  await sql`UPDATE public.form_submissions SET read = true WHERE id = ${id}`;
  revalidatePath('/admin/inbox');
}

export async function markUnread(id: string) {
  await requireOwner();
  await sql`UPDATE public.form_submissions SET read = false WHERE id = ${id}`;
  revalidatePath('/admin/inbox');
}
