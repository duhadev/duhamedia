const metrics = [
  { name: "CVR", desc: "Primary goal. Every engagement benchmarked here." },
  { name: "Scroll depth", desc: "Where users disengage before the CTA." },
  { name: "CTR", desc: "CTA visibility and copy effectiveness." },
  { name: "Form abandonment", desc: "Last drop-off before the sale." },
  { name: "Core Web Vitals", desc: "Speed and stability affect conversion." },
  { name: "Mobile CVR", desc: "Most paid traffic is mobile." },
];

export default function WhatWeTrack() {
  return (
    <section className="bg-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-2">
          Results
        </p>
        <h2
          className="text-2xl font-bold text-brand-ink mb-8"
          style={{ letterSpacing: "-0.01em" }}
        >
          What we track and why it matters.
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {metrics.map((m) => (
            <div key={m.name} className="bg-brand-offwhite rounded-sm p-4">
              <p className="font-mono text-xs font-medium text-brand-ink uppercase tracking-wide mb-1">
                {m.name}
              </p>
              <p className="text-sm text-brand-ink/60 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
