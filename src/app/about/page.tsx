"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DualCTA from "@/components/sections/DualCTA";
import PageHero from "@/components/sections/PageHero";

const beliefs = [
  {
    title: "Documentation is not a deliverable. It's how we work.",
    body: "Most agencies produce documentation at the end of an engagement — a final report, a handoff deck, something to mark the close of a project. We document continuously. Every change to your site is logged before any traffic sees it, with the audit finding that triggered it, the hypothesis it's testing, and the outcome it's targeting. The paper trail isn't a byproduct of the work. It is the work.",
  },
  {
    title: "A change without a hypothesis is just a guess.",
    body: "We don't deploy changes because they feel right. Every fix has a documented hypothesis, a specific target metric, and a measurement window agreed before it ships. For Class A engagements running structured A/B tests, statistical significance is not negotiable — a test that hasn't reached it isn't finished, regardless of what the numbers look like. Losing tests are documented and archived with the same rigour as winning ones. A failed test that's properly recorded is as valuable as a successful one.",
  },
  {
    title: "We won't take on an engagement that can't produce results.",
    body: "CRO methodology depends on traffic volume. Below 10,000 monthly sessions, even heuristic CRO can't separate behavioural patterns from noise — that's why Class B requires it. A/B testing requires more: 25,000+ monthly sessions to reach statistical significance within a useful test window, which is why it's exclusive to Class A. We decline engagements where the conditions for meaningful results don't exist — not because we're selective for its own sake, but because taking on the wrong engagement produces bad outcomes for everyone. If you don't qualify yet, we'll tell you what needs to be in place before we can work together.",
  },
  {
    title: "The work should make you less dependent on us, not more.",
    body: "Every playbook, every change log, every piece of documentation we produce is designed so your team can understand and act on it without us. If the retainer ends, you leave with a fully operational system — a live dashboard, a documented methodology, and assets that belong to you entirely. We build systems that compound. We don't build dependency.",
  },
];

const comparisons = [
  {
    left: "Changes made based on experience and instinct",
    right: "Every change tied to a specific audit finding and documented hypothesis",
  },
  {
    left: "A/B tests run until the client asks for results",
    right: "Tests run to pre-agreed sample sizes with documented significance requirements (Class A only — where traffic supports it)",
  },
  {
    left: "Monthly report delivered as a PDF summary",
    right: "Live client dashboard — accessible at any time, not just when a report lands",
  },
  {
    left: "Documentation produced at engagement close",
    right: "Documentation runs continuously from day one — the change log is always live",
  },
  {
    left: "The agency holds the institutional knowledge",
    right: "Everything documented so your team can run it independently if the engagement ends",
  },
  {
    left: "Scope defined loosely — additions billed as they come up",
    right: "Fixed scope agreed in writing. Nothing added without sign-off",
  },
];

const tools = [
  {
    name: "Microsoft Clarity",
    accent: "border-brand-crimson",
    rationale:
      "Free, privacy-compliant, and the fastest way to see what visitors are actually trying to do on your site. Heatmaps, session recordings, dead-click and rage-click detection. The behavioural layer of our three-layer measurement stack.",
  },
  {
    name: "GA4",
    accent: "border-brand-crimson",
    rationale:
      "The traffic layer. Every engagement starts with a verified GA4 configuration — goals, events, and funnels — before any change is made. Configured properly so the data is actually trustworthy.",
  },
  {
    name: "Shopify Analytics",
    accent: "border-brand-crimson",
    rationale:
      "The commerce layer — straight from the platform. Native funnel data, product-level conversion, repeat-purchase reporting. We reconcile GA4 and Shopify so the numbers actually agree before we start optimising anything.",
  },
  {
    name: "GrowthBook (Class A only)",
    accent: "border-brand-crimson",
    rationale:
      "Open-source, privacy-focused, and warehouse-native — clients own their data entirely and the methodology is fully auditable. Used exclusively on Class A engagements, where traffic crosses 25,000 monthly sessions and structured A/B testing becomes statistically productive. Below that threshold, we run heuristic CRO instead — and don't pretend otherwise.",
  },
  {
    name: "Slack + Loom",
    accent: "border-brand-ink",
    rationale:
      "Async-first communication. Updates when they're ready, not on a schedule. Short Loom walkthroughs replace status calls — you see the screen and hear the rationale without needing to be available at a fixed time.",
  },
  {
    name: "Duha Media Client Dashboard",
    accent: "border-brand-magenta",
    rationale:
      "Self-hosted, built in-house, no third-party tool. Real-time CVR, the full change log, monthly reports, and the original audit findings — all in one place, accessible any time, kept forever. The portal you check instead of waiting for a PDF. Included with every Class A, B, and C engagement.",
  },
  {
    name: "n8n",
    accent: "border-brand-ink",
    rationale:
      "Open-source workflow automation. Pulls Shopify Analytics, GA4, and Clarity data into the Client Dashboard in real time. Self-hosted so the integration is auditable and the data stays under client control — not relayed through a vendor's pipeline.",
  },
];

const goodFit = [
  "Shopify brands doing $150K–$1M in annual revenue",
  "Founders and operators who are still close to the numbers",
  "Teams running paid traffic on Facebook, Instagram, or Google",
  "Brands that want evidence, not assurances",
  "Clients who will review documentation and give feedback within agreed timelines",
  "Businesses that understand CRO is a system, not a one-time fix",
];

const notFit = [
  "You don't have traffic yet — CRO requires data to work from",
  "You want a redesign with no interest in ongoing optimisation",
  "You need a guarantee on specific revenue numbers before signing",
  "You want to approve every change before it goes live — that's not compatible with the pace of continuous optimisation",
  "You're looking for the cheapest option — we're not it",
];

export default function AboutPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "about-newsletter" }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Header activePage="About" />
      <main id="main-content">

        {/* Hero */}
        <PageHero
          label="About"
          heading="Most agencies work in a black box. We don't."
          subhead="This page isn't a team page or a founder story. It's an explanation of how Duha Media thinks, what we believe about CRO, and why that thinking produces better outcomes for the brands we work with."
        />

        {/* What We Believe */}
        <section className="bg-brand-offwhite px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">What we believe</p>
            <h2 className="text-2xl font-bold text-brand-ink mb-10" style={{ letterSpacing: "-0.01em" }}>
              Four principles behind everything we do.
            </h2>
            <div className="flex flex-col gap-10">
              {beliefs.map((belief, i) => (
                <div key={i} className="border-t border-black/10 pt-8">
                  <p className="font-mono text-[10px] text-brand-ink/30 uppercase tracking-widest mb-3">
                    0{i + 1}
                  </p>
                  <h3 className="text-base font-bold text-brand-ink mb-3 leading-snug">
                    {belief.title}
                  </h3>
                  <p className="text-sm text-brand-ink/60 leading-relaxed">{belief.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How We're Different */}
        <section className="bg-white px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">How we&apos;re different</p>
            <h2 className="text-2xl font-bold text-brand-ink mb-4" style={{ letterSpacing: "-0.01em" }}>
              Not the way most agencies work.
            </h2>
            <p className="text-sm text-brand-ink/60 leading-relaxed mb-10 max-w-2xl">
              This isn&apos;t a criticism of the industry. It&apos;s an honest description of what&apos;s standard practice at most agencies — and what we do instead.
            </p>

            {/* Comparison table */}
            <div className="border border-black/10 rounded-sm overflow-hidden">
              {/* Headers */}
              <div className="grid grid-cols-2">
                <div className="bg-black/[0.06] px-5 py-3 border-r border-black/10">
                  <p className="font-mono text-[11px] text-brand-ink/40 uppercase tracking-widest">Most agencies</p>
                </div>
                <div className="bg-white px-5 py-3 border-l-2 border-brand-crimson">
                  <p className="font-mono text-[11px] text-brand-crimson uppercase tracking-widest">Duha Media</p>
                </div>
              </div>
              {/* Rows */}
              {comparisons.map((row, i) => (
                <div key={i} className="grid grid-cols-2 border-t border-black/10">
                  <div className="bg-black/[0.06] px-5 py-3 border-r border-black/10">
                    <p className="text-sm text-brand-ink/55 leading-relaxed">{row.left}</p>
                  </div>
                  <div className="bg-white px-5 py-3 border-l-2 border-brand-crimson">
                    <p className="text-sm text-brand-ink/80 leading-relaxed">{row.right}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tool Stack */}
        <section className="bg-brand-offwhite px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Tool stack</p>
            <h2 className="text-2xl font-bold text-brand-ink mb-4" style={{ letterSpacing: "-0.01em" }}>
              Chosen deliberately. Not by default.
            </h2>
            <p className="text-sm text-brand-ink/60 leading-relaxed mb-8 max-w-2xl">
              Every tool in our stack was chosen for a specific reason. We don&apos;t use enterprise platforms at SMB pricing, and we don&apos;t use free tools that compromise on quality. Here&apos;s what we use and why.
            </p>
            <div className="divide-y divide-black/10">
              {tools.map((tool) => (
                <div key={tool.name} className="py-6">
                  <p className="font-mono text-[13px] font-medium text-brand-ink mb-3">{tool.name}</p>
                  <div className="w-full h-px bg-black/10 mb-3" />
                  <div className={`pl-4 border-l-[3px] ${tool.accent}`}>
                    <p className="text-sm text-brand-ink/60 leading-relaxed">{tool.rationale}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter mid-page */}
        <section className="bg-brand-ink px-6 py-14">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex-1">
                <p className="font-mono text-xs text-white/30 uppercase tracking-widest mb-3">Insights newsletter</p>
                <p className="text-xl font-bold text-white leading-snug" style={{ letterSpacing: "-0.01em" }}>
                  If this is how you think about CRO, you&apos;ll want to read what we publish.
                </p>
              </div>
              {submitted ? (
                <div className="bg-white/10 border border-white/20 rounded-sm px-5 py-4 flex-1 max-w-sm">
                  <p className="font-bold text-white text-sm mb-1">You&apos;re on the list.</p>
                  <p className="font-mono text-xs text-white/50">We&apos;ll send the next insight your way.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-1 flex-1 max-w-sm">
                  <form
                    onSubmit={handleSubscribe}
                    className="flex gap-2"
                    aria-label="Subscribe to insights newsletter"
                  >
                    <label htmlFor="about-newsletter-email" className="sr-only">Email address</label>
                    <input
                      id="about-newsletter-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="flex-1 bg-white/10 border border-white/20 rounded-sm px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 min-h-[44px]"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-brand-magenta text-white font-bold text-xs px-4 py-3 rounded-sm hover:bg-brand-crimson transition-colors min-h-[44px] flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "…" : "Subscribe"}
                    </button>
                  </form>
                  {error && (
                    <p className="font-mono text-xs text-brand-cream" role="alert">{error}</p>
                  )}
                </div>
              )}
            </div>
            <p className="font-mono text-xs text-white/25 mt-5">No pitch. Just the findings.</p>
          </div>
        </section>

        {/* Who We Work With */}
        <section className="bg-white px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Who we work with</p>
            <h2 className="text-2xl font-bold text-brand-ink mb-10" style={{ letterSpacing: "-0.01em" }}>
              The right fit matters more than the right budget.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* Good fit */}
              <div>
                <p className="font-mono text-[10px] text-brand-crimson uppercase tracking-wide mb-4">
                  We work well with
                </p>
                <div className="flex flex-col gap-3">
                  {goodFit.map((item) => (
                    <div key={item} className="flex gap-3 items-start">
                      <div
                        className="w-0.5 bg-brand-crimson flex-shrink-0 mt-1.5"
                        style={{ height: "1.1rem" }}
                        aria-hidden="true"
                      />
                      <p className="text-sm text-brand-ink/60 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Not a fit */}
              <div>
                <p className="font-mono text-[10px] text-brand-ink/40 uppercase tracking-wide mb-4">
                  Probably not the right fit if
                </p>
                <div className="flex flex-col gap-3">
                  {notFit.map((item) => (
                    <div key={item} className="flex gap-3 items-start">
                      <div
                        className="w-0.5 bg-brand-ink/20 flex-shrink-0 mt-1.5"
                        style={{ height: "1.1rem" }}
                        aria-hidden="true"
                      />
                      <p className="text-sm text-brand-ink/50 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
                <p className="font-mono text-xs text-brand-ink/40 italic mt-6 leading-relaxed">
                  If you&apos;re not sure which side you&apos;re on, the free audit will tell you. We&apos;ll be direct about whether it&apos;s a good fit.
                </p>
              </div>
            </div>
          </div>
        </section>

        <DualCTA heading="See what we find on your site." />
      </main>
      <Footer />
    </>
  );
}
