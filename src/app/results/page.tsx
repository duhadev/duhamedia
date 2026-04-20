import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DualCTA from "@/components/sections/DualCTA";
import CaseStudiesComingSoon from "@/components/ui/CaseStudiesComingSoon";
import PageHero from "@/components/sections/PageHero";

const metrics = [
  { abbr: "CVR", name: "Conversion rate" },
  { abbr: "CTR", name: "Click-through rate" },
  { abbr: "FAR", name: "Form abandonment" },
  { abbr: "CWV", name: "Core Web Vitals" },
  { abbr: "MOB", name: "Mobile vs desktop CVR" },
  { abbr: "μCV", name: "Micro-conversions" },
];

const methodology = [
  { title: "Baseline first", desc: "Every metric is measured before any change is made — no result without a starting point." },
  { title: "Statistical significance", desc: "No A/B test is called until statistical significance is reached. Sample size is set before each test begins." },
  { title: "Documented outcomes", desc: "Win or lose — every test result is recorded with the decision made and the rationale." },
  { title: "Revenue impact", desc: "CVR improvements are translated into estimated revenue impact at actual traffic and AOV." },
];

const studies = [
  { metric: "+XX%", label: "CVR · Class B", tag: "Shopify · Homewares", desc: "Landing page redesign + form optimisation.", slug: "homewares-cvr" },
  { metric: "−XX%", label: "Form abandon · Class B", tag: "Shopify · Supplements", desc: "Checkout flow and field reduction.", slug: "supplements-form" },
  { metric: "+XX%", label: "Mobile CVR · Class C", tag: "Shopify · Beauty", desc: "Full site foundation + Clarity install.", slug: "beauty-mobile" },
  { metric: "+XX%", label: "CVR · Class A", tag: "Shopify · Outdoor gear", desc: "12-week intensive + campaign attribution.", slug: "outdoor-class-a" },
];

export default function ResultsPage() {
  return (
    <>
      <Header activePage="Results" />
      <main id="main-content">
        {/* Hero */}
        <PageHero
          label="Results"
          heading="What the data says after the work is done."
          subhead="Conversion rate improvements, documented and measured. Every result tied to a specific change and a specific test."
        />

        {/* Metrics overview */}
        <section className="bg-brand-offwhite px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">What we track</p>
            <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: "-0.01em" }}>Seven metrics. All tied to revenue.</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
              {metrics.map((m) => (
                <div key={m.abbr} className="bg-white border border-black/10 rounded-sm p-4 text-center">
                  <p className="font-mono text-sm font-bold text-brand-crimson mb-1">{m.abbr}</p>
                  <p className="font-mono text-xs text-brand-ink/60 uppercase tracking-wide leading-tight">{m.name}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {methodology.map((m) => (
                <div key={m.title} className="bg-white border border-black/10 rounded-sm p-5">
                  <p className="font-mono text-xs font-medium text-brand-ink uppercase tracking-wide mb-2">{m.title}</p>
                  <p className="text-sm text-brand-ink/60 leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Results</p>
            <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: "-0.01em" }}>Every engagement documented.</h2>

            {/* Featured result placeholder */}
            <div className="border border-black/10 rounded-sm overflow-hidden mb-6">
              <div className="bg-brand-ink px-6 py-5 flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs text-white/30 uppercase tracking-widest mb-2">Featured result</p>
                  <p className="font-mono text-3xl font-bold text-white/20 leading-none">+XX%</p>
                </div>
                <p className="font-mono text-xs text-white/20 text-right flex-shrink-0">CVR · Class B</p>
              </div>
              <div className="bg-brand-offwhite px-6 py-10 text-center">
                <p className="font-mono text-xs text-brand-ink/30 uppercase tracking-widest mb-3">Case studies in progress</p>
                <p className="text-sm text-brand-ink/45 leading-relaxed max-w-md mx-auto">Full engagement documentation will be published here as studies complete and are verified.</p>
              </div>
            </div>

            {/* 2×2 case study preview grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {studies.map((study) => (
                <div key={study.slug} className="border border-black/10 rounded-sm overflow-hidden opacity-50">
                  <div className="bg-brand-ink px-4 py-3 flex items-center justify-between">
                    <p className="font-mono text-lg font-bold text-white">{study.metric}</p>
                    <p className="font-mono text-xs text-white/40">{study.label}</p>
                  </div>
                  <div className="bg-white px-4 py-4">
                    <p className="font-mono text-xs text-brand-ink/35 uppercase tracking-wide mb-2">{study.tag}</p>
                    <p className="text-sm text-brand-ink/55 leading-relaxed mb-4">{study.desc}</p>
                    <span className="font-mono text-xs text-brand-ink/25">Read → (in progress)</span>
                  </div>
                </div>
              ))}
            </div>

            <CaseStudiesComingSoon />
          </div>
        </section>

        <DualCTA heading="Get a result like this for your site." />
      </main>
      <Footer />
    </>
  );
}
