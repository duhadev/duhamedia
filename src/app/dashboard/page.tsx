import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/sections/PageHero";
import DualCTA from "@/components/sections/DualCTA";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { breadcrumbSchema, jsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "The Duha Media Client Dashboard — Every metric, every change, always live",
  description:
    "A live portal — not a monthly PDF. Real-time CVR, change log, monthly reports, and audit findings. Self-hosted, not a third-party tool. Included with every Class A, B, and C engagement.",
};

const pillars = [
  {
    title: "What you see when you log in",
    body: "The landing view: current conversion rate vs. baseline, revenue per session, and AOV — rolling 7/30/90-day comparisons. Below it, the change log: every fix, date deployed, rationale, and the measurement attached to it.",
  },
  {
    title: "Data flowing in real time",
    body: "n8n pulls from Shopify Analytics, GA4, and Microsoft Clarity on a tight cadence. The dashboard renders from our own database — so when you check at 11pm, what you see reflects what happened today, not what happened last month.",
  },
  {
    title: "The change log",
    body: "Sortable by date, by page, by tier. Filterable by 'deployed', 'planned', or 'reverted'. Every row links to the rationale we wrote, the before/after screenshots, and the metric comparison. No change lives outside of it.",
  },
  {
    title: "Monthly reports — kept forever",
    body: "Every monthly report is generated inside the dashboard and archived there permanently. No hunting through email attachments from six months ago. The full trajectory of the engagement is one click away.",
  },
  {
    title: "Audit findings, permanently parked",
    body: "Your initial CRO audit lives here too — not as a disposable deliverable, but as a referenceable record. Which leaks we found, which we fixed, which we flagged for later, and why.",
  },
  {
    title: "For Class A clients",
    body: "Campaign-to-conversion correlation, active GrowthBook A/B tests with live statistical confidence, and attribution across channels. The paid spend, the landing page, and the conversion — in one view.",
  },
];

export default function DashboardMarketingPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Client Dashboard", path: "/dashboard" },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumb)} />
      <Header />
      <main id="main-content">
        <PageHero
          label="Client dashboard"
          heading="One dashboard. Every metric. Every change. Always live."
          subhead="Most agencies send a monthly PDF. We built a portal you can check any time — included with every Class A, B, and C engagement."
          meta="Self-hosted · Real-time · Not a third-party tool"
        />

        {/* Dashboard mockup */}
        <section className="bg-brand-offwhite px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">
                What you see when you log in
              </p>
              <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: "-0.01em" }}>
                The landing view.
              </h2>
            </ScrollReveal>
            <div className="bg-white border border-black/10 rounded-sm overflow-hidden">
              {/* Top bar */}
              <div className="bg-brand-ink px-5 py-3 flex items-center justify-between">
                <p className="font-mono text-xs text-white/70 tracking-wide">dashboard.duhamedia.com</p>
                <p className="font-mono text-xs text-brand-gold tracking-wide">● LIVE</p>
              </div>
              {/* Summary metrics */}
              <div className="grid grid-cols-3 border-b border-black/10">
                <div className="px-5 py-6 border-r border-black/10">
                  <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-wide mb-2">CVR</p>
                  <p className="text-2xl font-bold text-brand-ink mb-1">3.42%</p>
                  <p className="font-mono text-xs text-brand-magenta">+0.81 vs. baseline</p>
                </div>
                <div className="px-5 py-6 border-r border-black/10">
                  <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-wide mb-2">RPV</p>
                  <p className="text-2xl font-bold text-brand-ink mb-1">$2.17</p>
                  <p className="font-mono text-xs text-brand-magenta">+$0.42</p>
                </div>
                <div className="px-5 py-6">
                  <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-wide mb-2">AOV</p>
                  <p className="text-2xl font-bold text-brand-ink mb-1">$63.50</p>
                  <p className="font-mono text-xs text-brand-ink/40">flat</p>
                </div>
              </div>
              {/* CVR trend SVG */}
              <div className="px-5 py-6 border-b border-black/10">
                <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-wide mb-4">
                  CVR — last 90 days
                </p>
                <svg viewBox="0 0 600 140" className="w-full h-32" role="img" aria-label="CVR trend chart">
                  <line x1="0" y1="70" x2="600" y2="70" stroke="#0F172A" strokeOpacity="0.08" strokeDasharray="3 3" />
                  <line x1="0" y1="110" x2="600" y2="110" stroke="#0F172A" strokeOpacity="0.08" strokeDasharray="3 3" />
                  <path
                    d="M0,100 L60,95 L120,90 L180,92 L240,80 L300,72 L360,65 L420,55 L480,48 L540,42 L600,40"
                    fill="none"
                    stroke="#e82561"
                    strokeWidth="2"
                  />
                  <circle cx="420" cy="55" r="4" fill="#e82561" />
                  <text x="425" y="48" fontSize="10" fill="#0F172A" fontFamily="monospace">fix deployed</text>
                </svg>
              </div>
              {/* Change log preview */}
              <div>
                <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-wide px-5 pt-5 pb-3">
                  Change log — most recent
                </p>
                <div className="divide-y divide-black/10">
                  {[
                    { date: "2026-04-18", page: "/products/*", change: "Added trust strip above ATC", impact: "+0.34 CVR" },
                    { date: "2026-04-09", page: "/cart", change: "Reduced form fields 7 → 4", impact: "−18% abandon" },
                    { date: "2026-03-28", page: "/", change: "Hero CTA copy + contrast", impact: "+0.22 CVR" },
                  ].map((row) => (
                    <div key={row.date} className="px-5 py-3 grid grid-cols-12 gap-3 text-xs">
                      <p className="font-mono text-brand-ink/50 col-span-2">{row.date}</p>
                      <p className="font-mono text-brand-ink/70 col-span-2">{row.page}</p>
                      <p className="text-brand-ink col-span-5">{row.change}</p>
                      <p className="font-mono text-brand-magenta col-span-3 text-right">{row.impact}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="font-mono text-xs text-brand-ink/40 mt-4 text-center">
              Illustrative. Real dashboards render live data from your store.
            </p>
          </div>
        </section>

        {/* Feature pillars */}
        <section className="bg-white px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">
                What&apos;s inside
              </p>
              <h2 className="text-2xl font-bold text-brand-ink mb-10" style={{ letterSpacing: "-0.01em" }}>
                Six things your dashboard does that a monthly PDF can&apos;t.
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pillars.map((p, i) => (
                <ScrollReveal key={p.title} delay={i * 60}>
                  <div className="border border-black/10 rounded-sm p-5 h-full">
                    <p className="font-bold text-brand-ink text-base mb-2">{p.title}</p>
                    <p className="text-sm text-brand-ink/60 leading-relaxed">{p.body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Data flow diagram */}
        <section className="bg-brand-offwhite px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">How it stays live</p>
              <h2 className="text-2xl font-bold text-brand-ink mb-3" style={{ letterSpacing: "-0.01em" }}>
                n8n moves the data. We render it.
              </h2>
              <p className="text-base text-brand-ink/60 leading-relaxed mb-10">
                Three data sources, one orchestration layer, one dashboard. Nothing is stitched together manually, and nothing relies on a third-party SaaS we can&apos;t audit.
              </p>
            </ScrollReveal>
            <div className="bg-white border border-black/10 rounded-sm p-8">
              <div className="grid grid-cols-3 gap-3 mb-6">
                {["Shopify Analytics", "GA4", "Microsoft Clarity"].map((src) => (
                  <div key={src} className="border border-black/10 rounded-sm p-3 text-center">
                    <p className="font-mono text-xs text-brand-ink/70 tracking-wide">{src}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mb-6">
                <svg width="20" height="24" viewBox="0 0 20 24" aria-hidden="true">
                  <path d="M10 0v20M10 20l-6-6M10 20l6-6" stroke="#c20e59" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <div className="bg-brand-ink rounded-sm px-4 py-3 text-center mb-6">
                <p className="font-mono text-xs text-white/60 uppercase tracking-widest mb-1">Orchestration</p>
                <p className="font-mono text-sm text-white">n8n (self-hosted)</p>
              </div>
              <div className="flex justify-center mb-6">
                <svg width="20" height="24" viewBox="0 0 20 24" aria-hidden="true">
                  <path d="M10 0v20M10 20l-6-6M10 20l6-6" stroke="#c20e59" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <div className="border-2 border-brand-magenta rounded-sm px-4 py-3 text-center">
                <p className="font-mono text-xs text-brand-magenta uppercase tracking-widest mb-1">You see this</p>
                <p className="font-mono text-sm text-brand-ink">Duha Media Client Dashboard</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why / not-a-third-party */}
        <section className="bg-white px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Why we built it</p>
                <h3 className="text-xl font-bold text-brand-ink mb-3">The monthly PDF is broken.</h3>
                <p className="text-sm text-brand-ink/60 leading-relaxed">
                  A report your client reads once and files away is a reporting artefact, not an accountability system. We wanted a single place where the numbers, the changes, and the rationale all live — and where both sides of the engagement can check the work at any time.
                </p>
              </div>
              <div>
                <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Not a third-party tool</p>
                <h3 className="text-xl font-bold text-brand-ink mb-3">Self-hosted. No vendor lock-in.</h3>
                <p className="text-sm text-brand-ink/60 leading-relaxed">
                  The dashboard runs on our own infrastructure. If you leave us, we can export every row of your change log, every monthly report, and every audit finding as a permanent archive. Nothing disappears behind someone else&apos;s paywall.
                </p>
              </div>
            </div>
            <div className="mt-10 text-center">
              <Link href="/services" className="font-mono text-xs text-brand-crimson underline underline-offset-2">
                See which tier includes which dashboard features →
              </Link>
            </div>
          </div>
        </section>

        <DualCTA heading="Want to see what your dashboard would look like?" />
      </main>
      <Footer />
    </>
  );
}
