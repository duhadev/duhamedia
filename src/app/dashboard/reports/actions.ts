'use server';
import { requireClient } from '@/lib/auth/helpers';
import { sql } from '@/lib/db';

export async function getReportUrl(reportId: string): Promise<string> {
  const user = await requireClient();

  const rows = await sql`
    SELECT storage_path FROM public.reports
    WHERE id = ${reportId} AND client_id = ${user.clientId}
  `;
  if (!rows.length) throw new Error('Report not found');

  return rows[0].storage_path as string;
}
