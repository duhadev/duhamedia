'use server';
import { sql } from '@/lib/db';
import { requireOwner } from '@/lib/auth/helpers';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sendClientInvite } from '@/lib/email';

export async function inviteClient(formData: FormData) {
  await requireOwner();
  const name = (formData.get('name') as string).trim();
  const email = (formData.get('email') as string).trim().toLowerCase();
  const shopDomain = (formData.get('shopDomain') as string | null)?.trim() || null;

  const rows = await sql`
    INSERT INTO public.clients (name, email, shop_domain)
    VALUES (${name}, ${email}, ${shopDomain})
    ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, shop_domain = EXCLUDED.shop_domain
    RETURNING id
  `;
  const clientId = rows[0].id as string;

  await sql`
    INSERT INTO public.client_invites (email, client_id)
    VALUES (${email}, ${clientId})
    ON CONFLICT (email) DO UPDATE SET client_id = ${clientId}
  `;

  sendClientInvite({ name, email }).catch(console.error);

  revalidatePath('/admin/clients');
  redirect(`/admin/clients/${clientId}`);
}

export async function addExperiment(clientId: string, formData: FormData) {
  await requireOwner();
  const name = (formData.get('name') as string).trim();
  const hypothesis = (formData.get('hypothesis') as string | null)?.trim() || null;
  const status = (formData.get('status') as string) || 'running';

  await sql`
    INSERT INTO public.experiments (client_id, name, hypothesis, status)
    VALUES (${clientId}, ${name}, ${hypothesis}, ${status})
  `;
  revalidatePath(`/admin/clients/${clientId}`);
}

export async function updateExperiment(experimentId: string, clientId: string, formData: FormData) {
  await requireOwner();
  const status = formData.get('status') as string;
  const result = (formData.get('result') as string | null)?.trim() || null;
  const uplift = formData.get('uplift') ? Number(formData.get('uplift')) : null;
  const endedAt = status !== 'running' ? new Date().toISOString() : null;

  await sql`
    UPDATE public.experiments
    SET status = ${status}, result = ${result}, uplift = ${uplift}, ended_at = ${endedAt}
    WHERE id = ${experimentId}
  `;
  revalidatePath(`/admin/clients/${clientId}`);
}

export async function addMetric(clientId: string, formData: FormData) {
  await requireOwner();
  const recordedAt = formData.get('recorded_at') as string;
  const cvr = formData.get('cvr') ? Number(formData.get('cvr')) : null;
  const aov = formData.get('aov') ? Number(formData.get('aov')) : null;
  const revenueLift = formData.get('revenue_lift') ? Number(formData.get('revenue_lift')) : null;

  await sql`
    INSERT INTO public.cro_metrics (client_id, recorded_at, cvr, aov, revenue_lift)
    VALUES (${clientId}, ${recordedAt}, ${cvr}, ${aov}, ${revenueLift})
    ON CONFLICT (client_id, recorded_at) DO UPDATE
    SET cvr = EXCLUDED.cvr, aov = EXCLUDED.aov, revenue_lift = EXCLUDED.revenue_lift
  `;
  revalidatePath(`/admin/clients/${clientId}`);
}

export async function uploadReport(clientId: string, formData: FormData) {
  await requireOwner();
  const title = (formData.get('title') as string).trim();
  const file = formData.get('file') as File;
  if (!file || file.size === 0) throw new Error('No file provided');

  const ext = file.name.split('.').pop() ?? 'pdf';
  const pathname = `reports/${clientId}/${Date.now()}.${ext}`;

  const { url } = await put(pathname, file, {
    access: 'public',
    contentType: file.type || 'application/pdf',
  });

  await sql`
    INSERT INTO public.reports (client_id, title, storage_path)
    VALUES (${clientId}, ${title}, ${url})
  `;
  revalidatePath(`/admin/clients/${clientId}`);
}
