import { requireClient } from '@/lib/auth/helpers';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

type Experiment = {
  id: string;
  name: string;
  hypothesis: string | null;
  status: string;
  result: string | null;
  uplift: number | null;
  started_at: string;
  ended_at: string | null;
};

const STATUS_BADGE: Record<string, string> = {
  running: 'bg-blue-50 text-blue-700',
  won: 'bg-green-50 text-green-700',
  lost: 'bg-red-50 text-red-700',
  paused: 'bg-neutral-100 text-brand-ink/40',
};

export default async function ExperimentsPage() {
  const user = await requireClient();
  const experiments = (await sql`
    SELECT id, name, hypothesis, status, result, uplift, started_at, ended_at
    FROM public.experiments
    WHERE client_id = ${user.clientId}
    ORDER BY started_at DESC
  `) as Experiment[];

  return (
    <>
      <h1 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: '-0.02em' }}>
        Experiments
      </h1>

      {experiments.length === 0 ? (
        <p className="text-brand-ink/40 text-sm">No experiments recorded yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {experiments.map((exp) => (
            <div key={exp.id} className="bg-white border border-neutral-200 rounded-sm px-5 py-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <p className="font-medium text-brand-ink">{exp.name}</p>
                <div className="flex items-center gap-2 shrink-0">
                  {exp.uplift != null && (
                    <span className="font-mono text-xs font-bold text-green-700">
                      +{exp.uplift}%
                    </span>
                  )}
                  <span
                    className={`font-mono text-xs uppercase tracking-widest px-2 py-0.5 rounded-sm ${STATUS_BADGE[exp.status] ?? ''}`}
                  >
                    {exp.status}
                  </span>
                </div>
              </div>

              {exp.hypothesis && (
                <p className="text-sm text-brand-ink/55 mb-2">{exp.hypothesis}</p>
              )}

              {exp.result && (
                <p className="text-sm text-brand-ink/70 bg-brand-offwhite rounded-sm px-3 py-2 mt-2">
                  {exp.result}
                </p>
              )}

              <div className="flex gap-4 mt-3">
                <p className="font-mono text-xs text-brand-ink/30">
                  Started{' '}
                  {new Date(exp.started_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
                {exp.ended_at && (
                  <p className="font-mono text-xs text-brand-ink/30">
                    Ended{' '}
                    {new Date(exp.ended_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
