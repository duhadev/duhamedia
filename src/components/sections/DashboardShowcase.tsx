import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function DashboardShowcase() {
  return (
    <section className="bg-brand-offwhite px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Client dashboard</p>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-ink mb-3" style={{ letterSpacing: "-0.01em" }}>
            One dashboard. Every metric. Every change. Always live.
          </h2>
          <p className="text-base text-brand-ink/60 leading-relaxed mb-10 max-w-2xl">
            Most agencies send a monthly PDF. We built a portal you can check any time — real-time CVR, a full change log, every monthly report, and your audit findings, all in one place.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="bg-white border border-black/10 rounded-sm overflow-hidden">
            <div className="bg-brand-ink px-5 py-3 flex items-center justify-between">
              <p className="font-mono text-xs text-white/70 tracking-wide">dashboard.duhamedia.com</p>
              <p className="font-mono text-xs text-brand-gold tracking-wide">● LIVE</p>
            </div>
            <div className="grid grid-cols-3 border-b border-black/10">
              <div className="px-5 py-5 border-r border-black/10">
                <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-wide mb-1">CVR</p>
                <p className="text-xl font-bold text-brand-ink">3.42%</p>
                <p className="font-mono text-xs text-brand-magenta">+0.81</p>
              </div>
              <div className="px-5 py-5 border-r border-black/10">
                <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-wide mb-1">RPV</p>
                <p className="text-xl font-bold text-brand-ink">$2.17</p>
                <p className="font-mono text-xs text-brand-magenta">+$0.42</p>
              </div>
              <div className="px-5 py-5">
                <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-wide mb-1">AOV</p>
                <p className="text-xl font-bold text-brand-ink">$63.50</p>
                <p className="font-mono text-xs text-brand-ink/40">flat</p>
              </div>
            </div>
            <div className="px-5 py-5">
              <svg viewBox="0 0 600 80" className="w-full h-20" role="img" aria-label="CVR trend">
                <line x1="0" y1="40" x2="600" y2="40" stroke="#0F172A" strokeOpacity="0.08" strokeDasharray="3 3" />
                <path
                  d="M0,60 L60,58 L120,55 L180,56 L240,50 L300,44 L360,38 L420,30 L480,24 L540,20 L600,18"
                  fill="none"
                  stroke="#e82561"
                  strokeWidth="2"
                />
                <circle cx="420" cy="30" r="4" fill="#e82561" />
              </svg>
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-8">
          <Link href="/dashboard" className="font-mono text-xs text-brand-crimson underline underline-offset-2">
            See the dashboard →
          </Link>
        </div>
      </div>
    </section>
  );
}
