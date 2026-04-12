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
                <div key={m.title} className="bg-black/5 rounded-sm p-5">
                  <p className="font-mono text-xs font-medium text-brand-ink uppercase tracking-wide mb-2">{m.title}</p>
                  <p className="text-sm text-brand-ink/60 leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured result + case study grid — TODO: restore when live */}
        {/* studies array above contains placeholder data ready to populate */}
        <section className="bg-white px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Results</p>
            <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: "-0.01em" }}>Every engagement documented.</h2>
            <CaseStudiesComingSoon />
          </div>
        </section>

        <DualCTA heading="Get a result like this for your site." />
      </main>
      <Footer />
    </>
  );
}
