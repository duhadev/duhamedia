import ScrollReveal from "@/components/ui/ScrollReveal";

const tools = [
  { name: "Shopify Analytics", role: "Revenue truth" },
  { name: "GA4", role: "Traffic + funnel" },
  { name: "Microsoft Clarity", role: "Behaviour + recordings" },
  { name: "GrowthBook", role: "A/B testing (Class A)" },
  { name: "Duha Client Dashboard", role: "Live reporting" },
  { name: "n8n", role: "Data orchestration" },
];

export default function ToolStackStrip() {
  return (
    <section className="bg-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">The stack</p>
          <h2 className="text-2xl font-bold text-brand-ink mb-10" style={{ letterSpacing: "-0.01em" }}>
            Six tools. One measurement discipline.
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {tools.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 40}>
              <div className="border border-black/10 rounded-sm p-4">
                <p className="font-mono text-sm font-bold text-brand-ink mb-1">{t.name}</p>
                <p className="font-mono text-xs text-brand-ink/50 uppercase tracking-wide">{t.role}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
