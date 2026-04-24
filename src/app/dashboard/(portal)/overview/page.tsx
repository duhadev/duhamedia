import { requireClient } from '@/lib/auth/helpers';
import { sql } from '@/lib/db';
import CvrChart from './CvrChart';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await requireClient();
  const clientId = user.clientId;

  const [clientRows, metricsRows, expRows, reportsRows] = await Promise.all([
    sql`SELECT name FROM public.clients WHERE id = ${clientId}`,
    sql`
      SELECT recorded_at::text AS date, cvr
      FROM public.cro_metrics
      WHERE client_id = ${clientId}
      ORDER BY recorded_at ASC
      LIMIT 30
    `,
    sql`
      SELECT status, COUNT(*) AS n
      FROM public.experiments
      WHERE client_id = ${clientId}
      GROUP BY status
    `,
    sql`
      SELECT title, created_at FROM public.reports
      WHERE client_id = ${clientId}
      ORDER BY created_at DESC
      LIMIT 1
    `,
  ]);

  const clientName = clientRows[0]?.name as string ?? 'Your store';

  type MetricRow = { date: string; cvr: number | null };
  const chartData: MetricRow[] = (metricsRows as MetricRow[]).map((r) => ({
    date: r.date,
    cvr: r.cvr != null ? Number(r.cvr) : null,
  }));

  const expByStatus = Object.fromEntries(
    (expRows as { status: string; n: string }[]).map((r) => [r.status, Number(r.n)])
  );
  const running = expByStatus['running'] ?? 0;
  const won = expByStatus['won'] ?? 0;

  const latestMetric = metricsRows.length
    ? (metricsRows[metricsRows.length - 1] as { date: string; cvr: number | null })
    : null;

  const latestReport = reportsRows[0] as { title: string; created_at: string } | undefined;

  return (
    <>
      <div className="mb-8">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-1">CRO Dashboard</p>
        <h1 className="text-2xl font-bold text-brand-ink" style={{ letterSpacing: '-0.02em' }}>
          {clientName}
        </h1>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label="Current CVR" value={latestMetric?.cvr != null ? `${latestMetric.cvr}%` : '—'} />
        <Stat label="Running tests" value={String(running)} />
        <Stat label="Tests won" value={String(won)} />
        <Stat label="Latest report" value={latestReport ? 'Available' : '—'} small />
      </div>

      {/* CVR chart */}
      <div className="bg-white border border-neutral-200 rounded-sm p-6 mb-8">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-4">
          Conversion rate over time
        </p>
        <CvrChart data={chartData} />
      </div>

      {latestReport && (
        <div className="bg-brand-ink text-white rounded-sm px-6 py-5 flex items-center justify-between">
          <div>
            <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Latest report</p>
            <p className="font-medium">{latestReport.title}</p>
          </div>
          <a
            href="/dashboard/reports"
            className="bg-brand-magenta text-white font-bold text-sm rounded-sm px-5 py-2.5 hover:bg-brand-crimson transition-colors"
          >
            View reports
          </a>
        </div>
      )}
    </>
  );
}

function Stat({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-sm p-5">
      <p className={`font-bold text-brand-ink ${small ? 'text-lg' : 'text-3xl'}`}>{value}</p>
      <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mt-1">{label}</p>
    </div>
  );
}
