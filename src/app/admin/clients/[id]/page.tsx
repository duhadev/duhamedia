import { requireOwner } from '@/lib/auth/helpers';
import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';
import { addExperiment, updateExperiment, addMetric, uploadReport } from '../actions';

export const dynamic = 'force-dynamic';

type Client = { id: string; name: string; email: string; shop_domain: string | null };
type Experiment = {
  id: string;
  name: string;
  hypothesis: string | null;
  status: string;
  result: string | null;
  uplift: number | null;
  started_at: string;
};
type Metric = { id: string; recorded_at: string; cvr: number | null; aov: number | null; revenue_lift: number | null };
type Report = { id: string; title: string; storage_path: string; created_at: string };

const STATUS_BADGE: Record<string, string> = {
  running: 'bg-blue-50 text-blue-700',
  won: 'bg-green-50 text-green-700',
  lost: 'bg-red-50 text-red-700',
  paused: 'bg-neutral-100 text-brand-ink/40',
};

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireOwner();
  const { id } = await params;

  const clients = (await sql`SELECT id, name, email, shop_domain FROM public.clients WHERE id = ${id}`) as Client[];
  if (!clients.length) notFound();
  const client = clients[0];

  const [experiments, metrics, reports] = (await Promise.all([
    sql`SELECT id, name, hypothesis, status, result, uplift, started_at FROM public.experiments WHERE client_id = ${id} ORDER BY started_at DESC`,
    sql`SELECT id, recorded_at, cvr, aov, revenue_lift FROM public.cro_metrics WHERE client_id = ${id} ORDER BY recorded_at DESC`,
    sql`SELECT id, title, storage_path, created_at FROM public.reports WHERE client_id = ${id} ORDER BY created_at DESC`,
  ])) as [Experiment[], Metric[], Report[]];

  const addExperimentAction = addExperiment.bind(null, id);
  const addMetricAction = addMetric.bind(null, id);
  const uploadReportAction = uploadReport.bind(null, id);

  return (
    <>
      <div className="mb-8">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-1">{client.email}</p>
        <h1 className="text-2xl font-bold text-brand-ink" style={{ letterSpacing: '-0.02em' }}>
          {client.name}
        </h1>
        {client.shop_domain && (
          <p className="text-sm text-brand-ink/40 mt-1">{client.shop_domain}</p>
        )}
      </div>

      {/* Experiments */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-brand-ink mb-4">Experiments</h2>
        <form action={addExperimentAction} className="bg-white border border-neutral-200 rounded-sm p-5 mb-4 flex flex-col gap-3">
          <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest">Add experiment</p>
          <div className="flex gap-3 flex-col md:flex-row">
            <input name="name" required placeholder="Experiment name" className="flex-1 border border-neutral-200 rounded-sm px-3 py-2.5 text-sm min-h-[44px]" />
            <input name="hypothesis" placeholder="Hypothesis (optional)" className="flex-1 border border-neutral-200 rounded-sm px-3 py-2.5 text-sm min-h-[44px]" />
            <select name="status" className="border border-neutral-200 rounded-sm px-3 py-2.5 text-sm min-h-[44px] bg-white">
              <option value="running">Running</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
              <option value="paused">Paused</option>
            </select>
            <button type="submit" className="bg-brand-magenta text-white font-bold text-sm rounded-sm px-5 py-2.5 min-h-[44px] hover:bg-brand-crimson transition-colors shrink-0">
              Add
            </button>
          </div>
        </form>

        {experiments.length > 0 && (
          <div className="flex flex-col gap-2">
            {experiments.map((exp) => (
              <details key={exp.id} className="bg-white border border-neutral-200 rounded-sm">
                <summary className="px-5 py-4 flex items-center gap-3 cursor-pointer list-none">
                  <span className="flex-1 font-medium text-brand-ink text-sm">{exp.name}</span>
                  {exp.uplift != null && (
                    <span className="font-mono text-xs text-green-700">+{exp.uplift}%</span>
                  )}
                  <span className={`font-mono text-xs uppercase tracking-widest px-2 py-0.5 rounded-sm ${STATUS_BADGE[exp.status] ?? ''}`}>
                    {exp.status}
                  </span>
                </summary>
                <div className="px-5 pb-5 border-t border-neutral-100 pt-4">
                  {exp.hypothesis && <p className="text-sm text-brand-ink/60 mb-4">{exp.hypothesis}</p>}
                  <form
                    action={async (fd: FormData) => {
                      'use server';
                      await updateExperiment(exp.id, id, fd);
                    }}
                    className="flex gap-3 flex-col md:flex-row"
                  >
                    <select name="status" defaultValue={exp.status} className="border border-neutral-200 rounded-sm px-3 py-2 text-sm min-h-[44px] bg-white">
                      <option value="running">Running</option>
                      <option value="won">Won</option>
                      <option value="lost">Lost</option>
                      <option value="paused">Paused</option>
                    </select>
                    <input name="result" defaultValue={exp.result ?? ''} placeholder="Result notes" className="flex-1 border border-neutral-200 rounded-sm px-3 py-2 text-sm min-h-[44px]" />
                    <input name="uplift" type="number" step="0.01" defaultValue={exp.uplift ?? ''} placeholder="Uplift %" className="w-28 border border-neutral-200 rounded-sm px-3 py-2 text-sm min-h-[44px]" />
                    <button type="submit" className="bg-brand-ink text-white font-bold text-sm rounded-sm px-4 py-2 min-h-[44px] hover:bg-brand-ink/80 transition-colors shrink-0">
                      Update
                    </button>
                  </form>
                </div>
              </details>
            ))}
          </div>
        )}
      </section>

      {/* Metrics */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-brand-ink mb-4">CRO Metrics</h2>
        <form action={addMetricAction} className="bg-white border border-neutral-200 rounded-sm p-5 mb-4 flex flex-col gap-3">
          <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest">Add metric snapshot</p>
          <div className="flex gap-3 flex-col md:flex-row">
            <input name="recorded_at" type="date" required className="border border-neutral-200 rounded-sm px-3 py-2.5 text-sm min-h-[44px]" />
            <input name="cvr" type="number" step="0.01" placeholder="CVR %" className="w-28 border border-neutral-200 rounded-sm px-3 py-2.5 text-sm min-h-[44px]" />
            <input name="aov" type="number" step="0.01" placeholder="AOV £" className="w-28 border border-neutral-200 rounded-sm px-3 py-2.5 text-sm min-h-[44px]" />
            <input name="revenue_lift" type="number" step="0.01" placeholder="Rev lift £" className="w-32 border border-neutral-200 rounded-sm px-3 py-2.5 text-sm min-h-[44px]" />
            <button type="submit" className="bg-brand-magenta text-white font-bold text-sm rounded-sm px-5 py-2.5 min-h-[44px] hover:bg-brand-crimson transition-colors shrink-0">
              Add
            </button>
          </div>
        </form>

        {metrics.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-neutral-200">
                  {['Date', 'CVR %', 'AOV', 'Revenue lift'].map((h) => (
                    <th key={h} className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest text-left py-2 pr-6">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {metrics.map((m) => (
                  <tr key={m.id} className="border-b border-neutral-100">
                    <td className="py-2.5 pr-6 font-mono text-xs text-brand-ink/60">{m.recorded_at}</td>
                    <td className="py-2.5 pr-6">{m.cvr != null ? `${m.cvr}%` : '—'}</td>
                    <td className="py-2.5 pr-6">{m.aov != null ? `£${m.aov}` : '—'}</td>
                    <td className="py-2.5 pr-6">{m.revenue_lift != null ? `£${m.revenue_lift}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Reports */}
      <section>
        <h2 className="text-lg font-bold text-brand-ink mb-4">Reports</h2>
        <form action={uploadReportAction} className="bg-white border border-neutral-200 rounded-sm p-5 mb-4 flex flex-col gap-3">
          <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest">Upload PDF report</p>
          <div className="flex gap-3 flex-col md:flex-row items-end">
            <div className="flex-1">
              <label htmlFor="title" className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest block mb-1">Report title</label>
              <input id="title" name="title" required placeholder="e.g. Q1 CRO Report" className="w-full border border-neutral-200 rounded-sm px-3 py-2.5 text-sm min-h-[44px]" />
            </div>
            <div className="flex-1">
              <label htmlFor="file" className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest block mb-1">PDF file</label>
              <input id="file" name="file" type="file" accept=".pdf,application/pdf" required className="w-full text-sm text-brand-ink/60 min-h-[44px] pt-2.5" />
            </div>
            <button type="submit" className="bg-brand-magenta text-white font-bold text-sm rounded-sm px-5 py-2.5 min-h-[44px] hover:bg-brand-crimson transition-colors shrink-0">
              Upload
            </button>
          </div>
        </form>

        {reports.length > 0 && (
          <div className="flex flex-col gap-2">
            {reports.map((r) => (
              <div key={r.id} className="bg-white border border-neutral-200 rounded-sm px-5 py-3 flex items-center gap-4">
                <p className="flex-1 text-sm text-brand-ink">{r.title}</p>
                <p className="font-mono text-xs text-brand-ink/40">
                  {new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
