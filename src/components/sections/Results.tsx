import Link from "next/link";
import CaseStudiesComingSoon from "@/components/ui/CaseStudiesComingSoon";

const metrics = [
  { abbr: "CVR", desc: "Primary goal — benchmarked before anything changes." },
  { abbr: "Scroll depth", desc: "Where users disengage before reaching the CTA." },
  { abbr: "CTR", desc: "CTA visibility and copy effectiveness." },
  { abbr: "Form abandonment", desc: "Last drop-off point before the sale." },
  { abbr: "Core Web Vitals", desc: "Speed and stability directly affect conversion." },
  { abbr: "Mobile CVR", desc: "Most paid traffic is mobile. Tracked separately." },
];

const studies = [
  {
    metric: "+XX%",
    label: "CVR lift",
    tier: "Class B",
    tag: "Shopify · Apparel",
    sessions: "3,200 sessions",
    desc: "Landing page redesign + checkout optimisation. CTA repositioned above fold. Checkout form reduced from 9 fields to 5. A/B tested to statistical significance.",
    slug: "apparel-landing-page",
  },
  {
    metric: "−XX%",
    label: "Form abandonment",
    tier: "Class B",
    tag: "Shopify · Supplements",
    sessions: "2,800 sessions",
    desc: "Clarity revealed 58% of users abandoned at the billing step. Form restructured and progress indicator added. Tested against original over four weeks.",
    slug: "supplements-form",
  },
  {
    metric: "+XX%",
    label: "Mobile CVR",
    tier: "Class C",
    tag: "Shopify · Beauty",
    sessions: "Baseline established",
    desc: "Full site rebuild with CRO architecture from day one. Clarity and GA4 installed at launch. Baseline established for future Class B engagement.",
    slug: "beauty-foundation",
  },
];

export default function Results() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Results</p>
            <h2 className="text-2xl font-bold text-brand-ink" style={{ letterSpacing: "-0.01em" }}>
              What we measure. What we produce.
            </h2>
          </div>
          <Link href="/results" className="font-mono text-xs text-brand-crimson underline underline-offset-2 flex-shrink-0">
            All results →
          </Link>
        </div>

        {/* Metrics strip */}
        <div className="mb-12">
          <p className="font-mono text-xs text-brand-ink/30 uppercase tracking-widest mb-4">What we track</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-black/10 border border-black/10 rounded-sm overflow-hidden">
            {metrics.map((m) => (
              <div key={m.abbr} className="bg-white px-4 py-3 flex flex-col gap-1 md:flex-row md:gap-3 md:items-start">
                <p className="font-mono text-xs font-medium text-brand-crimson md:flex-shrink-0 md:w-28">{m.abbr}</p>
                <p className="font-mono text-xs text-brand-ink/45 leading-snug">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Case studies — TODO: restore when live */}
        {/* studies array above contains placeholder data ready to populate */}
        <div>
          <p className="font-mono text-xs text-brand-ink/30 uppercase tracking-widest mb-4">Recent engagements</p>
          <CaseStudiesComingSoon />
        </div>

      </div>
    </section>
  );
}
