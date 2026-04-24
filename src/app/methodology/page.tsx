import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/sections/PageHero";
import DualCTA from "@/components/sections/DualCTA";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { breadcrumbSchema, jsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Methodology — How Duha Media runs CRO",
  description:
    "Three-layer measurement (Shopify Analytics + GA4 + Microsoft Clarity), heuristic CRO vs. structured A/B testing, 60-day baselines and 90-day measurement windows, and the change log that keeps every decision auditable.",
};

const layers = [
  {
    name: "Shopify Analytics",
    role: "Revenue truth",
    body: "Orders, AOV, conversion rate at the storefront. The authoritative record of what actually paid.",
  },
  {
    name: "GA4",
    role: "Traffic + funnel",
    body: "Source, medium, landing, exit. Where sessions come from and where in the funnel they die.",
  },
  {
    name: "Microsoft Clarity",
    role: "Behaviour",
    body: "Session recordings, heatmaps, rage-clicks, dead-clicks. Why the behaviour is what it is, not just that it is.",
  },
];

const heuristic = {
  title: "Heuristic CRO (Class B)",
  meta: "10,000+ monthly sessions",
  body: "We observe real user behaviour in Clarity, cross-reference funnel drop-offs in GA4, and ship targeted fixes against the highest-leverage leaks first. No split traffic — every fix ships to 100% of visitors. Measurement is before/after against the 60-day baseline, with a 90-day post-deployment window.",
  bullets: [
    "No statistical-significance claims — we don't split traffic at this tier",
    "Fixes ship weekly, measured monthly against baseline",
    "Reverted if the next month's data shows a regression",
  ],
};

const ab = {
  title: "Structured A/B testing (Class A)",
  meta: "25,000+ monthly sessions",
  body: "At 25K+ monthly sessions, structured A/B testing starts producing statistically meaningful results within a reasonable time window. We run tests via GrowthBook with pre-registered sample sizes, significance thresholds agreed before the test starts, and outcome documentation regardless of win or loss.",
  bullets: [
    "Sample size + significance threshold set before any test runs",
    "Primary metric declared before the test — no post-hoc reframing",
    "Losers and inconclusives documented as carefully as winners",
  ],
};

const windows = [
  { label: "60-day baseline", body: "The window before any fix is deployed — the thing every subsequent measurement is compared against." },
  { label: "Fix deployed", body: "Change goes live with rationale, before/after screenshots, and the primary metric it's targeting logged in the dashboard." },
  { label: "90-day post-window", body: "The window we measure the fix across. Shorter windows can be noisy on small stores — we default to 90 days for stability." },
  { label: "If baseline shifts ±25%", body: "Traffic mix changes break the apples-to-apples comparison. We pause the comparison, re-baseline, and flag it in the change log." },
];

const discipline = [
  { title: "Every decision logged.", body: "Even decisions not to ship. The archive is the institutional memory of your store." },
  { title: "Every result measured.", body: "Win, loss, inconclusive — all three are documented with the same rigour. Nothing gets to hide." },
  { title: "Every page-scope isolated.", body: "If you make UX changes to pages we're working on, we pause the measurement for those pages and re-baseline. Attribution stays clean." },
];

export default function MethodologyPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Methodology", path: "/methodology" },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumb)} />
      <Header />
      <main id="main-content">
        <PageHero
          label="Methodology"
          heading="How we run CRO — in more detail than most agencies put on a website."
          subhead="The three-layer measurement framework, the change log, and why Class B uses heuristic CRO while only Class A runs A/B tests."
        />

        {/* Three-layer measurement */}
        <section className="bg-brand-offwhite px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Three-layer measurement</p>
              <h2 className="text-2xl font-bold text-brand-ink mb-3" style={{ letterSpacing: "-0.01em" }}>
                No single source of truth. Three, triangulated.
              </h2>
              <p className="text-base text-brand-ink/60 leading-relaxed mb-10">
                Shopify, GA4, and Clarity each answer a different question. Together they tell you what happened, where, and why. Missing one of the three means guessing at the answer to something the other two can&apos;t see.
              </p>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {layers.map((l, i) => (
                <ScrollReveal key={l.name} delay={i * 60}>
                  <div className="bg-white border border-black/10 rounded-sm p-5 h-full">
                    <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-wide mb-2">{l.role}</p>
                    <p className="font-bold text-brand-ink text-base mb-2">{l.name}</p>
                    <p className="text-sm text-brand-ink/60 leading-relaxed">{l.body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Heuristic vs A/B */}
        <section className="bg-white px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Heuristic CRO vs. A/B testing</p>
              <h2 className="text-2xl font-bold text-brand-ink mb-3" style={{ letterSpacing: "-0.01em" }}>
                Traffic decides which tool applies.
              </h2>
              <p className="text-base text-brand-ink/60 leading-relaxed mb-10">
                Running A/B tests under 25,000 monthly sessions means waiting months for any one test to reach significance — by which point the test is measuring a different market than the one it started in. So we don&apos;t. Instead, we run heuristic CRO until the traffic supports the statistical tool.
              </p>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[heuristic, ab].map((tier) => (
                <div key={tier.title} className="border border-black/10 rounded-sm p-6">
                  <p className="font-mono text-xs text-brand-magenta uppercase tracking-wide mb-1">{tier.meta}</p>
                  <p className="font-bold text-brand-ink text-lg mb-3">{tier.title}</p>
                  <p className="text-sm text-brand-ink/60 leading-relaxed mb-4">{tier.body}</p>
                  <ul className="space-y-1.5">
                    {tier.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-xs text-brand-ink/60">
                        <span className="text-brand-crimson mt-0.5 flex-shrink-0">→</span>{b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Measurement windows */}
        <section className="bg-brand-offwhite px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Measurement windows</p>
              <h2 className="text-2xl font-bold text-brand-ink mb-10" style={{ letterSpacing: "-0.01em" }}>
                60 days of baseline. 90 days of measurement. Everything anchored.
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {windows.map((w, i) => (
                <ScrollReveal key={w.label} delay={i * 60}>
                  <div className="bg-white border border-black/10 rounded-sm p-5 h-full">
                    <p className="font-bold text-brand-ink text-base mb-2">{w.label}</p>
                    <p className="text-sm text-brand-ink/60 leading-relaxed">{w.body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Change log */}
        <section className="bg-white px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">The change log</p>
              <h2 className="text-2xl font-bold text-brand-ink mb-3" style={{ letterSpacing: "-0.01em" }}>
                Every change, every rationale, in one place.
              </h2>
              <p className="text-base text-brand-ink/60 leading-relaxed mb-10">
                The change log is the institutional memory of your store. Every row is a fix we shipped, a test we ran, or a decision we made not to ship. It lives in the <Link href="/dashboard" className="text-brand-crimson underline underline-offset-2">Client Dashboard</Link> forever.
              </p>
            </ScrollReveal>
            <div className="border border-black/10 rounded-sm overflow-hidden mb-10">
              <div className="bg-brand-ink px-5 py-3">
                <p className="font-mono text-xs text-white/60 uppercase tracking-widest">Example entry</p>
              </div>
              <div className="px-5 py-5 space-y-3 text-sm">
                <p><span className="font-mono text-xs text-brand-ink/40 uppercase tracking-wide mr-2">Date</span><span className="font-mono text-brand-ink">2026-03-28</span></p>
                <p><span className="font-mono text-xs text-brand-ink/40 uppercase tracking-wide mr-2">Page</span><span className="font-mono text-brand-ink">/products/[handle]</span></p>
                <p><span className="font-mono text-xs text-brand-ink/40 uppercase tracking-wide mr-2">Change</span><span className="text-brand-ink">Added trust strip (returns, shipping, support) above add-to-cart.</span></p>
                <p><span className="font-mono text-xs text-brand-ink/40 uppercase tracking-wide mr-2">Rationale</span><span className="text-brand-ink/70">Clarity recordings showed 34% of visitors scrolling past ATC without clicking. GA4 cross-referenced with a 22% PDP→cart drop. Trust strip addresses the dominant hesitation pattern observed in recordings (return policy ambiguity).</span></p>
                <p><span className="font-mono text-xs text-brand-ink/40 uppercase tracking-wide mr-2">Result</span><span className="font-mono text-brand-magenta">+0.34 CVR (90-day window, baseline 2.76%)</span></p>
              </div>
            </div>
          </div>
        </section>

        {/* Documentation discipline */}
        <section className="bg-brand-offwhite px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Documentation discipline</p>
              <h2 className="text-2xl font-bold text-brand-ink mb-10" style={{ letterSpacing: "-0.01em" }}>
                The rules we hold ourselves to.
              </h2>
            </ScrollReveal>
            <div className="space-y-4">
              {discipline.map((d, i) => (
                <ScrollReveal key={d.title} delay={i * 60}>
                  <div className="bg-white border border-black/10 rounded-sm p-5">
                    <p className="font-bold text-brand-ink text-base mb-2">{d.title}</p>
                    <p className="text-sm text-brand-ink/60 leading-relaxed">{d.body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <DualCTA heading="Want to see this methodology applied to your store?" />
      </main>
      <Footer />
    </>
  );
}
