import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DualCTA from "@/components/sections/DualCTA";
import TierProgression from "@/components/sections/TierProgression";
import CommonQuestions from "@/components/sections/CommonQuestions";
import ConversionGuarantee from "@/components/sections/ConversionGuarantee";
import PDFLeadCapture from "@/components/ui/PDFLeadCapture";
import CaseStudiesComingSoon from "@/components/ui/CaseStudiesComingSoon";
import PageHero from "@/components/sections/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { serviceSchema, faqSchema, breadcrumbSchema, jsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Class B — CRO Core | Duha Media",
  description:
    "Continuous heuristic CRO for Shopify stores doing 10,000+ monthly sessions. Three-layer measurement (Shopify Analytics + GA4 + Clarity). Live client dashboard. Backed by the Conversion Guarantee.",
};

const prerequisites = [
  {
    num: "10,000+",
    title: "Monthly sessions",
    why: "Below this, heuristic CRO can't isolate behavioural patterns from noise. We need enough traffic to read funnel data, drop-off points, and Clarity recordings with statistical confidence — week over week, not quarter over quarter.",
  },
  {
    num: "Paid",
    title: "Active or planned ads",
    why: "Ad spend signals you're already invested in driving traffic. CRO compounds that investment — improving what happens after the click, not just before it.",
  },
];

const setupDeliverables = [
  { num: "01", title: "Three-layer measurement baseline", body: "Shopify Analytics, GA4, and Microsoft Clarity reconciled into a single baseline. Goals, events, and funnels validated end-to-end. No optimisation is possible without a reliable baseline — this is the first thing we fix." },
  { num: "02", title: "Full site CRO audit", body: "A complete review of where your traffic drops off — using Shopify Analytics conversion funnels, Clarity heatmaps, session recordings, and GA4 path data. Every finding is documented with a hypothesis before a single change is made." },
  { num: "03", title: "Prioritized leak report", body: "Conversion leaks ranked by estimated revenue impact. Each leak documented with the data that surfaced it, the proposed fix, and the expected lift — so you know exactly why each fix is sequenced where it is." },
  { num: "04", title: "Measurement framework", body: "Pre/post measurement windows defined for every fix: 60 days of pre-fix baseline, 90 days of post-fix observation. Page-level isolation when other UX changes happen outside scope." },
  { num: "05", title: "Initial fix batch", body: "First wave of conversion fixes deployed against the highest-impact leaks. Each fix isolated to its own page or flow so before/after measurement is clean." },
  { num: "06", title: "Client dashboard live", body: "Your Duha Media Client Dashboard provisioned and live from setup day one. Real-time CVR, change log, audit findings, and monthly reports — all in one place, kept forever." },
];

const tools = [
  {
    name: "Microsoft Clarity",
    cost: "Free",
    desc: "Session recording, heatmaps, dead-click detection, rage-click detection. The behavioural layer.",
    why: "Free, privacy-compliant, and the fastest way to see what visitors are actually trying to do — and where they give up.",
  },
  {
    name: "GA4",
    cost: "Free",
    desc: "Path exploration, conversion events, attribution. The traffic layer — where visitors come from and what they do next.",
    why: "The standard. Configured properly so the data is actually trustworthy.",
  },
  {
    name: "Shopify Analytics",
    cost: "Included",
    desc: "Native funnel data, product-level conversion, repeat-purchase reporting. The commerce layer — straight from the platform.",
    why: "The source of truth for revenue. We reconcile GA4 and Shopify so the numbers actually agree before we start.",
  },
  {
    name: "Duha Media Client Dashboard",
    cost: "Included",
    desc: "Real-time CVR, full change log, monthly reports, and the original audit — all in one place, accessible any time.",
    why: "Self-hosted, no third-party tool, no vendor lock-in. The portal you check instead of waiting for a PDF.",
  },
];

const primaryMetrics = [
  { name: "CVR", desc: "Primary goal. Every engagement benchmarked here from day one." },
  { name: "Revenue per session", desc: "What every visit is actually worth." },
  { name: "AOV", desc: "Average order value, tracked alongside CVR." },
];

const diagnosticMetrics = [
  { name: "Funnel drop-off", desc: "Where in the path users leave before checkout." },
  { name: "Form abandonment", desc: "Last drop-off before the sale. Often the most fixable." },
  { name: "Mobile vs desktop CVR", desc: "Most paid traffic is mobile. Most sites are built for desktop." },
  { name: "Scroll depth", desc: "Where users disengage before reaching the CTA." },
  { name: "CTR", desc: "CTA visibility and copy effectiveness on key elements." },
  { name: "Core Web Vitals", desc: "LCP, INP, CLS — speed and stability affect conversion directly." },
];

const faqs = [
  { q: "How long before we see results?", a: "Setup takes 4–6 weeks. The first batch of fixes deploys inside that window. Meaningful CVR movement is usually visible within 60–90 days as the three-layer measurement (Shopify Analytics + GA4 + Clarity) accumulates pre/post data on each fix. The change log starts from day one — you're never waiting to see what's happening." },
  { q: "How do we know the changes you make actually caused the improvement?", a: "Every fix is measured against a 60-day pre-deployment baseline and observed for 90 days post-deployment. We isolate fixes to specific pages or flows so the before/after comparison is clean. Shopify Analytics, GA4, and Clarity are all reconciled — three independent data sources pointing at the same conclusion is how you trust a number. We're not claiming statistical significance at this tier — that's Class A's GrowthBook framework, which requires 25,000+ monthly sessions." },
  { q: "Why doesn't Class B include A/B testing?", a: "A/B testing only works when traffic supports statistical significance — typically 25,000+ monthly sessions per variant per week. Below that, you're optimising for noise. Class B uses heuristic CRO instead: behavioural data (Clarity, funnels, session recordings) drives high-confidence fixes, measured against pre/post baselines. It's the right methodology for stores in the 10K–25K range. Once you grow past 25K, Class A's GrowthBook framework becomes available." },
  { q: "What if we want to A/B test something specific during Class B?", a: "If a particular question genuinely needs an A/B test and your traffic supports it for that specific page or flow, we'll discuss it case-by-case. The default isn't to A/B test — it's to deploy the highest-confidence fix and measure the impact. Most Class B engagements never need a formal test because the data already says what to change." },
  { q: "What if our traffic drops mid-engagement?", a: "If traffic drops more than 25% below the engagement-start baseline, we pause new fix deployments — running before/after measurement on shifting traffic is misleading and we won't do it. The retainer shifts to deeper audit and analysis work until traffic recovers. You're not paying for noise." },
  { q: "Who owns the work when the retainer ends?", a: "You do. All design files, documentation, and change logs are yours. The Client Dashboard data is yours. There's no lock-in on assets or data." },
  { q: "How much of our team's time does this require?", a: "Minimal. We work async via shared chat and Loom. There's a monthly strategy call (30–45 minutes). Fixes need approval within 7 business days of delivery. Most clients spend under 2 hours a month on active involvement." },
  { q: "What does the first 30 days actually look like?", a: "Week 1: Shopify Analytics + GA4 reconciliation, Clarity install verified. Weeks 2–3: full CRO audit with prioritised leak report. Week 4: dashboard goes live, first fix batch deploys. By day 30 you have a complete picture of what's broken, a ranked list of what to fix first, and the first fixes already shipping." },
  { q: "Can we pause or end the retainer?", a: "Opt-out is in writing at any time — no notice period required. The retainer is a month-to-month commitment because the work has to keep earning the relationship." },
  { q: "How is this different from hiring a CRO consultant?", a: "A consultant gives you a report. We give you a documented, running system — deployed fixes, a live change log, a hypothesis backlog, and a dashboard you can check any time. Plus the Conversion Guarantee. The retainer is designed to compound, not repeat itself each month." },
];

export default function ClassBPage() {
  const schemas = [
    serviceSchema({
      name: "Class B — CRO Core",
      description:
        "Continuous heuristic CRO for Shopify stores doing 10,000+ monthly sessions. Three-layer measurement with Shopify Analytics, GA4, and Clarity. Backed by the Conversion Guarantee.",
      path: "/services/class-b",
      tier: "B",
      priceDescription: "From $5,000 setup + from $500/mo retainer",
    }),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "Class B — CRO Core", path: "/services/class-b" },
    ]),
  ];
  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={jsonLd(s)} />
      ))}
      <Header activePage="Services" />
      <main id="main-content">
        {/* Hero */}
        <PageHero
          label="Class B · CRO Core"
          heading={"“Data-driven conversion rate optimisation — turning your existing traffic into measurable revenue.”"}
          headingSize="sm"
          subhead="For Shopify stores with 10,000+ monthly sessions and active paid campaigns. We systematically improve what happens after the click — using heuristic CRO, not A/B testing."
          meta="From $5,000 setup + from $500/mo retainer · Min. 10,000 monthly sessions · Backed by the Conversion Guarantee"
          subNote="Live client dashboard included from day one."
        />

        {/* Prerequisites */}
        <section className="bg-brand-offwhite px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Prerequisites</p>
              <h2 className="text-2xl font-bold text-brand-ink mb-3" style={{ letterSpacing: "-0.01em" }}>Class B requires a qualifying site.</h2>
              <p className="text-base text-brand-ink/60 leading-relaxed mb-8">
                We won&apos;t take on an engagement that can&apos;t produce reliable signal. These aren&apos;t arbitrary thresholds — they&apos;re the conditions under which heuristic CRO actually works.
              </p>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              {prerequisites.map((p, index) => (
                <ScrollReveal key={p.title} delay={index * 80}>
                  <div className="bg-white border border-black/10 rounded-sm p-5">
                    <p className="font-mono text-4xl font-bold text-brand-crimson mb-2">{p.num}</p>
                    <p className="font-bold text-brand-ink text-base mb-3">{p.title}</p>
                    <p className="text-sm text-brand-ink/60 leading-relaxed border-t border-black/10 pt-3 italic">{p.why}</p>
                    {p.num === "10,000+" && (
                      <p className="font-mono text-[10px] text-brand-ink/40 mt-2">Under 10K sessions → noise · 10K–25K → heuristic CRO · 25K+ → A/B testing (Class A)</p>
                    )}
                    {p.num === "Paid" && (
                      <p className="font-mono text-[10px] text-brand-ink/40 mt-2">Ad spend = you already care about ROI</p>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
            <p className="text-xs text-brand-ink/40 italic border-t border-black/10 pt-5 leading-relaxed">
              Don&apos;t qualify yet? Class C builds the foundation and installs Clarity + GA4 from day one. Most Class C clients hit the Class B threshold within 6–12 months.{" "}
              <Link href="/services/class-c" className="text-brand-crimson underline underline-offset-2 not-italic">See Class C →</Link>
            </p>
          </div>
        </section>

        {/* Conversion Guarantee — moved higher per brief */}
        <ConversionGuarantee />

        {/* Setup deliverables */}
        <section className="bg-white px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Setup phase — one-time</p>
              <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: "-0.01em" }}>What happens before the retainer begins.</h2>
            </ScrollReveal>
            <div className="flex flex-col">
              {setupDeliverables.map((d, index) => (
                <ScrollReveal key={d.num} delay={Math.min(index, 4) * 60}>
                  <div className="flex flex-row items-start">
                    <div className="flex flex-col items-center flex-shrink-0 w-8">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0" style={{ borderWidth: "1.5px", borderStyle: "solid", borderColor: "#c20e59" }}>
                        <span className="font-mono text-[12px] text-brand-crimson">{d.num}</span>
                      </div>
                      {index < setupDeliverables.length - 1 && (
                        <div className="flex-1 w-px bg-brand-ink/15 mx-auto mt-2 mb-2 min-h-[24px]" />
                      )}
                    </div>
                    <div className={`ml-4 flex-1 ${index < setupDeliverables.length - 1 ? "pb-6" : "pb-0"}`}>
                      <p className="text-[13px] font-bold text-brand-ink mb-1">{d.title}</p>
                      <p className="text-[12px] text-brand-ink/60 leading-relaxed">{d.body}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Retainer cadence */}
        <section className="bg-brand-offwhite px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Retainer — ongoing</p>
              <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: "-0.01em" }}>What you get every month.</h2>
            </ScrollReveal>
            <div className="grid grid-cols-4 gap-3">
              <div className="grid grid-cols-4 gap-3 col-span-4 mb-2">
                {["Week 1", "Week 2", "Week 3", "Week 4"].map((w) => (
                  <p key={w} className="font-mono text-[10px] text-brand-ink/40">{w}</p>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <div className="bg-brand-crimson text-white rounded-sm px-2 py-1 font-mono text-[11px] text-center">Fix deploy</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="bg-brand-magenta text-white rounded-sm px-2 py-1 font-mono text-[11px] text-center">Clarity + Shopify review</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="bg-brand-offwhite text-brand-ink rounded-sm px-2 py-1 font-mono text-[11px] text-center" style={{ borderWidth: "0.5px", borderStyle: "solid", borderColor: "#c20e59" }}>Strategy call</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="bg-brand-ink text-white rounded-sm px-2 py-1 font-mono text-[11px] text-center">Monthly report</div>
                <div className="bg-brand-offwhite text-brand-ink rounded-sm px-2 py-1 font-mono text-[11px] text-center border border-black/20">Roadmap update</div>
              </div>
            </div>
            <p className="font-mono text-[11px] text-brand-ink/40 mt-4">Cadence repeats every month. Async chat + Loom between calls. Dashboard live the whole time.</p>
          </div>
        </section>

        {/* Documentation */}
        <section className="bg-white px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">How we document the work</p>
            <h2 className="text-2xl font-bold text-brand-ink mb-3" style={{ letterSpacing: "-0.01em" }}>Every change has a paper trail. Always.</h2>
            <p className="text-base text-brand-ink/60 leading-relaxed mb-10">Every change is logged before traffic sees it. Every leak documented with the data that surfaced it. Every fix measured against the 60-day pre-deployment baseline. Documentation runs continuously — not delivered at the end of the engagement.</p>

            <ScrollReveal delay={0}>
              <div className="border border-black/10 rounded-sm overflow-hidden mb-5">
                <div className="bg-black/5 border-b border-black/10 px-4 py-3 flex items-center gap-3">
                  <div className="w-3 h-3 rounded-sm bg-brand-crimson" />
                  <p className="font-bold text-brand-ink text-base">Change log entry</p>
                </div>
                <div className="p-4">
                  <p className="text-base text-brand-ink/60 leading-relaxed mb-4">Every site update logged with: what changed, the finding that triggered it, the hypothesis, and the target outcome.</p>
                  <div className="bg-black/5 rounded-sm p-4 font-mono text-sm text-brand-ink/60 leading-relaxed">
                    <span className="text-brand-ink font-medium">2026-03-14</span> · CTA moved above fold · /products/hero<br />
                    <span className="text-brand-ink font-medium">Finding:</span> 67% of mobile users never reached original CTA<br />
                    <span className="text-brand-ink font-medium">Hypothesis:</span> Moving CTA above fold → +8–12% mobile CVR<br />
                    <span className="text-brand-ink font-medium">Status:</span> Live — measuring against 60-day baseline
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <div className="border border-black/10 rounded-sm overflow-hidden mb-5">
                <div className="bg-black/5 border-b border-black/10 px-4 py-3 flex items-center gap-3">
                  <div className="w-3 h-3 rounded-sm bg-brand-magenta" />
                  <p className="font-bold text-brand-ink text-base">Conversion leak report</p>
                </div>
                <div className="p-4">
                  <p className="text-base text-brand-ink/60 leading-relaxed mb-4">Every conversion leak documented with the data source, the proposed fix, the estimated revenue impact, and the measurement window.</p>
                  <div className="bg-black/5 rounded-sm p-4 font-mono text-sm text-brand-ink/60 leading-relaxed">
                    <span className="text-brand-ink font-medium">Leak #014</span> · Checkout · billing-step abandonment<br />
                    <span className="text-brand-ink font-medium">Source:</span> Shopify funnel + Clarity rage-click on country dropdown<br />
                    <span className="text-brand-ink font-medium">Fix:</span> Auto-detect country from IP, default state list<br />
                    <span className="text-brand-ink font-medium">Est. impact:</span> +6–9% checkout completion · <span className="text-brand-ink font-medium">Window:</span> 60d pre / 90d post
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="border border-black/10 rounded-sm overflow-hidden">
                <div className="bg-black/5 border-b border-black/10 px-4 py-3 flex items-center gap-3">
                  <div className="w-3 h-3 rounded-sm bg-brand-gold" />
                  <p className="font-bold text-brand-ink text-base">Monthly report — sample structure</p>
                </div>
                <div className="p-4">
                  <p className="text-base text-brand-ink/60 leading-relaxed mb-4">Same format every month — track changes over time without translating between structures. Lives in the Client Dashboard, kept forever.</p>
                  <div className="border border-black/10 rounded-sm overflow-hidden">
                    <div className="bg-brand-ink px-4 py-3 flex items-center justify-between">
                      <p className="font-bold text-white text-base">March 2026 — Performance report</p>
                      <p className="font-mono text-xs text-white/40">Class B · Month 3</p>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {[{ num: "2.4%", label: "CVR (was 1.8%)" }, { num: "−18%", label: "Form abandon" }, { num: "$3.20", label: "Revenue / session" }].map((m) => (
                          <div key={m.label} className="bg-black/5 rounded-sm p-3 text-center">
                            <p className="font-mono text-sm font-bold text-brand-crimson">{m.num}</p>
                            <p className="font-mono text-xs text-brand-ink/40 mt-1">{m.label}</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-brand-ink/60 italic">Sections: CVR vs baseline · Fixes deployed + measurement · Leak findings · Next month priorities · Updated roadmap</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Tool stack */}
        <section className="bg-white px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Tool stack</p>
              <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: "-0.01em" }}>Three layers of measurement. One dashboard.</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {tools.map((t, index) => {
                const accents = ["#c20e59", "#e82561", "#f5c842", "#0F172A"];
                const accent = accents[index % accents.length];
                return (
                  <ScrollReveal key={t.name} delay={index * 60}>
                    <div className="border border-black/10 rounded-sm p-5">
                      <p className="font-mono text-sm font-medium text-brand-ink mb-1">{t.name}</p>
                      <p className="font-mono text-xs text-brand-ink/40 mb-3">{t.cost}</p>
                      <p className="text-sm text-brand-ink/60 leading-relaxed mb-3">{t.desc}</p>
                      <p className="text-[11px] italic text-brand-ink/50 leading-relaxed border-l-[3px] pl-3 mt-3" style={{ borderColor: accent }}>{t.why}</p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
            <p className="font-mono text-xs text-brand-ink/40 border-t border-black/10 pt-4 mt-6">
              GrowthBook A/B testing is Class A (25,000+ monthly sessions). Class B is heuristic CRO — driven by Clarity, Shopify Analytics, and GA4.
            </p>
          </div>
        </section>

        {/* Key metrics */}
        <section className="bg-brand-offwhite px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">What we track</p>
              <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: "-0.01em" }}>Primary outcomes. Diagnostic signals.</h2>
            </ScrollReveal>

            <p className="font-mono text-xs text-brand-magenta uppercase tracking-widest mb-3">Primary metrics</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
              {primaryMetrics.map((m) => (
                <div key={m.name} className="bg-white border border-black/10 border-l-[3px] border-l-brand-magenta rounded-sm p-3">
                  <p className="font-mono text-[11px] font-bold text-brand-ink">{m.name}</p>
                  <p className="font-mono text-[11px] text-brand-ink/50 mt-0.5">{m.desc}</p>
                </div>
              ))}
            </div>

            <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Diagnostic metrics</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {diagnosticMetrics.map((m) => (
                <div key={m.name} className="bg-white border border-black/10 rounded-sm p-3">
                  <p className="font-mono text-[11px] font-bold text-brand-ink">{m.name}</p>
                  <p className="font-mono text-[11px] text-brand-ink/50 mt-0.5">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Results — TODO: replace with real case study when live */}
        <section className="bg-white px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Results</p>
            <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: "-0.01em" }}>What Class B actually produces.</h2>
            <CaseStudiesComingSoon variant="compact" />
          </div>
        </section>

        {/* Not included */}
        <section className="bg-brand-offwhite px-6 py-12">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-5">Not included</p>
              <div className="bg-black/5 border border-black/10 rounded-sm p-5 space-y-3">
                {[
                  { text: "Structured A/B testing (GrowthBook framework)", link: { label: "Class A →", href: "/services/class-a" } },
                  { text: "Paid advertising management or campaign strategy", link: { label: "Class A →", href: "/services/class-a" } },
                  { text: "Cross-channel campaign correlation + attribution", link: { label: "Class A →", href: "/services/class-a" } },
                  { text: "CRM development or custom CRM builds", link: null },
                ].map((item) => (
                  <div key={item.text} className="flex items-center justify-between gap-4">
                    <p className="text-sm text-brand-ink/50 line-through">{item.text}</p>
                    {item.link && (
                      <Link href={item.link.href} className="font-mono text-xs text-brand-crimson underline underline-offset-2 flex-shrink-0">
                        {item.link.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        <CommonQuestions
          heading="What comes up before teams sign off."
          items={faqs}
          bg="bg-white"
        />

        <PDFLeadCapture
          tier="Class B"
          description="Setup deliverables, retainer cadence, tool stack, FAQ, and pricing — ready to forward to your team."
        />

        <TierProgression />
        <DualCTA heading="Ready to turn traffic into revenue?" />
      </main>
      <Footer />
    </>
  );
}
