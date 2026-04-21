import { requireClient } from '@/lib/auth/helpers';
import { sql } from '@/lib/db';
import ReportsList from './ReportsList';

export const dynamic = 'force-dynamic';

type Report = { id: string; title: string; created_at: string };

export default async function ReportsPage() {
  const user = await requireClient();
  const reports = (await sql`
    SELECT id, title, created_at
    FROM public.reports
    WHERE client_id = ${user.clientId}
    ORDER BY created_at DESC
  `) as Report[];

  return (
    <>
      <h1 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: '-0.02em' }}>
        Reports
      </h1>
      <ReportsList reports={reports} />
    </>
  );
}
