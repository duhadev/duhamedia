import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/sections/PageHero";

const deliverables = [
  {
    num: "01",
    title: "Clarity + GA4 installed and verified",
    body: "Session recording, heatmaps, and conversion tracking configured from day one. Every subsequent test and change has a documented baseline to measure against.",
  },
  {
    num: "02",
    title: "Full CRO audit",
    body: "A complete review of where your traffic drops off — using Clarity heatmaps, session recordings, and GA4 funnel data. Every finding documented with a hypothesis before a single change is made.",
  },
  {
    num: "03",
    title: "UX/UI improvements",
    body: "Your most important landing page or product page updated based on what the audit data shows — not what looks good. CTA placement, form structure, mobile experience.",
  },
  {
    num: "04",
    title: "One A/B test — designed, run, and documented",
    body: "A single test built on the strongest hypothesis from the audit. Run to statistical significance. Result documented in full — win or lose — with the decision made and the rationale recorded.",
  },
  {
    num: "05",
    title: "Monthly performance report",
    body: "CVR, CTR, scroll depth, form abandonment vs. the baseline we set at the start. Delivered at close of engagement.",
  },
  {
    num: "06",
    title: "Full change log",
    body: "Every update to the site logged with the audit finding that triggered it, the hypothesis it tested, and the measured outcome. Yours to keep.",
  },
];

const exchange = [
  {
    num: "01",
    title: "A detailed case study",
    body: "A documented record of the engagement — the problem, the hypothesis, the test, the result, and the methodology. We write the draft. You review and approve it. We use it in our proposals and on our website. If you prefer to stay anonymous, we'll identify you by industry and revenue range only.",
  },
  {
    num: "02",
    title: "A written testimonial",
    body: "A short statement from you about the engagement — what you expected, what happened, what you'd tell another business owner considering working with us. One paragraph is enough. You approve everything before it's published.",
  },
  {
    num: "03",
    title: "Permission to document the process",
    body: "We'll use anonymised data, findings, and screenshots in future content — teardowns, LinkedIn posts, case studies. Your site, your numbers. Nothing published without your explicit sign-off.",
  },
];

const qualifiers = [
  "Shopify store, actively trading",
  "$150K–$1M in annual revenue",
  "10,000 or more monthly sessions",
  "Running or planning paid social ads — Facebook, Instagram, or Google",
  "Owner or decision-maker is engaged and available for reviews",
  "Willing to give feedback within agreed timelines — a founding client who goes dark kills the case study",
];

const steps = [
  {
    color: "bg-brand-crimson",
    label: "Week 1–2",
    title: "Audit",
    body: "Clarity and GA4 installed. Baseline established. Heatmaps and session recordings reviewed. Full CRO audit delivered with a prioritised hypothesis backlog.",
  },
  {
    color: "bg-brand-magenta",
    label: "Week 3–5",
    title: "Build",
    body: "UX/UI improvements made to your most important page based on the audit findings. Every change logged before it goes live.",
  },
  {
    color: "bg-brand-gold",
    label: "Week 6–10",
    title: "Test",
    body: "One A/B test designed, launched, and run to statistical significance. Results documented — win or lose.",
  },
  {
    color: "bg-brand-ink",
    label: "Week 11–12",
    title: "Report",
    body: "Monthly performance report delivered. Full change log handed off. Case study drafted and sent to you for review.",
  },
];

export default function FoundingClientPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero */}
        <PageHero
          label="Limited offer · One spot"
          heading="We're looking for one Shopify store to work with for free."
          subhead="One founding client. Full Class B engagement — audit, heuristic CRO, monthly report, live client dashboard, full change log. No cost. In exchange for a case study, a written testimonial, and permission to document the results."
          tags={["One spot only", "Shopify stores", "$150K–$1M revenue", "10,000+ monthly sessions"]}
        />

        {/* What's included */}
        <section className="bg-brand-offwhite px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">What&apos;s included</p>
            <h2 className="text-2xl font-bold text-brand-ink mb-3" style={{ letterSpacing: "-0.01em" }}>
              The same engagement a paying client receives. At no cost.
            </h2>
            <p className="text-base text-brand-ink/60 leading-relaxed mb-10 max-w-2xl">
              This is not a stripped-down trial. It is a full Class B engagement — the same process, the same
              deliverables, and the same documentation standards as a client paying full price. The only difference is
              what you pay.
            </p>
            <div className="flex flex-col gap-3">
              {deliverables.map((d) => (
                <div key={d.num} className="border border-black/10 rounded-sm overflow-hidden bg-white">
                  <div className="bg-black/5 border-b border-black/10 px-5 py-3 flex items-center gap-3">
                    <span className="font-mono text-xs text-brand-crimson">{d.num}</span>
                    <p className="font-bold text-brand-ink text-base">{d.title}</p>
                  </div>
                  <p className="px-5 py-4 text-base text-brand-ink/60 leading-relaxed">{d.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What we ask in return */}
        <section className="bg-white px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">What we ask for</p>
            <h2 className="text-2xl font-bold text-brand-ink mb-10" style={{ letterSpacing: "-0.01em" }}>
              Three things. Nothing more.
            </h2>
            <div className="flex flex-col gap-8">
              {exchange.map((item) => (
                <div key={item.num} className="flex gap-6 items-start">
                  <p className="font-mono text-3xl font-bold text-brand-crimson flex-shrink-0 leading-none mt-1">
                    {item.num}
                  </p>
                  <div>
                    <p className="font-bold text-brand-ink text-base mb-2">{item.title}</p>
                    <p className="text-base text-brand-ink/60 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="font-mono text-xs text-brand-ink/40 italic border-t border-black/10 pt-5 mt-10 leading-relaxed">
              That&apos;s it. No ongoing obligation. No pitch for paid services during the engagement. If you want to
              continue to Class B at the end, the conversation is yours to start — we won&apos;t push it.
            </p>
          </div>
        </section>

        {/* Who this is for */}
        <section className="bg-brand-offwhite px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Qualifying criteria</p>
            <h2 className="text-2xl font-bold text-brand-ink mb-3" style={{ letterSpacing: "-0.01em" }}>
              This engagement works best for a specific type of store.
            </h2>
            <p className="text-base text-brand-ink/60 leading-relaxed mb-8 max-w-2xl">
              CRO requires data. Below a certain traffic threshold, tests produce noise instead of signal. Below a
              certain revenue level, the improvement isn&apos;t large enough to be worth documenting. These aren&apos;t
              gatekeeping rules — they&apos;re the conditions under which the engagement produces a result worth talking
              about.
            </p>
            <div className="flex flex-col divide-y divide-black/10 border border-black/10 rounded-sm overflow-hidden bg-white">
              {qualifiers.map((q) => (
                <div key={q} className="flex gap-4 px-5 py-4 items-start">
                  <div className="w-1 self-stretch bg-brand-crimson rounded-full flex-shrink-0 mt-0.5" />
                  <p className="text-base text-brand-ink/70 leading-relaxed">{q}</p>
                </div>
              ))}
            </div>
            <p className="font-mono text-xs text-brand-ink/40 italic border-t border-black/10 pt-5 mt-6 leading-relaxed">
              Not a fit if you&apos;re pre-launch, don&apos;t have traffic yet, or need a guarantee on specific revenue
              numbers before starting. The audit will surface what&apos;s possible — not promise a specific outcome.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-white px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">The process</p>
            <h2 className="text-2xl font-bold text-brand-ink mb-10" style={{ letterSpacing: "-0.01em" }}>
              Four steps. Same as any Class B engagement.
            </h2>
            <div className="flex flex-col gap-5">
              {steps.map((s) => (
                <div key={s.title} className="flex gap-0 border border-black/10 rounded-sm overflow-hidden">
                  <div className={`w-1 flex-shrink-0 ${s.color}`} />
                  <div className="px-5 py-5 flex-1">
                    <p className="font-mono text-xs text-brand-ink/40 mb-1">{s.label}</p>
                    <p className="font-bold text-brand-ink text-base mb-2">{s.title}</p>
                    <p className="text-base text-brand-ink/60 leading-relaxed">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Apply CTA */}
        <section className="bg-brand-ink px-6 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4" style={{ letterSpacing: "-0.01em" }}>
              One spot. Apply now.
            </h2>
            <p className="text-base text-white/55 leading-relaxed max-w-lg mx-auto mb-8">
              Applications are reviewed as they come in. The spot goes to the store that&apos;s the best fit — not the
              first to apply. If your store qualifies and the timing is right, we&apos;ll be in touch within 48 hours.
            </p>
            <Link
              href="/founding-client/apply"
              className="inline-flex items-center bg-brand-magenta text-white font-bold text-sm px-6 py-3 rounded-sm hover:bg-brand-crimson transition-colors min-h-[44px]"
            >
              Apply for the founding client spot →
            </Link>
            <p className="font-mono text-xs text-white/30 mt-4">
              No pitch. No obligation. Just an honest assessment of whether it&apos;s a fit.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
