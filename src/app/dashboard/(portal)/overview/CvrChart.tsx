'use client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type DataPoint = { date: string; cvr: number | null };

export default function CvrChart({ data }: { data: DataPoint[] }) {
  if (data.length < 2) {
    return (
      <div className="h-48 flex items-center justify-center text-brand-ink/30 text-sm">
        Not enough data yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', fill: '#0F172A66' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', fill: '#0F172A66' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => `${v}%`}
        />
        <Tooltip
          formatter={(v) => [`${v}%`, 'CVR']}
          contentStyle={{
            fontSize: 12,
            fontFamily: 'IBM Plex Mono, monospace',
            border: '1px solid #e5e7eb',
            borderRadius: 2,
          }}
        />
        <Line
          type="monotone"
          dataKey="cvr"
          stroke="#e82561"
          strokeWidth={2}
          dot={{ r: 3, fill: '#e82561' }}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
