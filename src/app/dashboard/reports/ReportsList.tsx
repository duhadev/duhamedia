'use client';
import { useState } from 'react';
import { getReportUrl } from './actions';

type Report = { id: string; title: string; created_at: string };

export default function ReportsList({ reports }: { reports: Report[] }) {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleDownload(id: string) {
    setLoading(id);
    try {
      const url = await getReportUrl(id);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      alert('Could not load report. Please try again.');
    } finally {
      setLoading(null);
    }
  }

  if (reports.length === 0) {
    return <p className="text-brand-ink/40 text-sm">No reports available yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {reports.map((r) => (
        <div
          key={r.id}
          className="bg-white border border-neutral-200 rounded-sm px-5 py-4 flex items-center gap-4"
        >
          <div className="flex-1 min-w-0">
            <p className="font-medium text-brand-ink text-sm">{r.title}</p>
            <p className="font-mono text-xs text-brand-ink/40 mt-0.5">
              {new Date(r.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
          <button
            onClick={() => handleDownload(r.id)}
            disabled={loading === r.id}
            className="bg-brand-magenta text-white font-bold text-sm rounded-sm px-4 py-2 min-h-[44px] hover:bg-brand-crimson transition-colors disabled:opacity-50"
          >
            {loading === r.id ? 'Loading…' : 'Download PDF'}
          </button>
        </div>
      ))}
    </div>
  );
}
