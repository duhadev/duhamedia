import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DualCTA from "@/components/sections/DualCTA";
import ScrollReveal from "@/components/ui/ScrollReveal";
import PageHero from "@/components/sections/PageHero";
import TierProgression from "@/components/sections/TierProgression";

const neverAskItems = [
  {
    q: '"What are you working on right now?"',
    a: "The client dashboard shows every active test, queued change, and upcoming priority — updated in real time, not on a monthly schedule.",
  },
  {
    q: '"Why did you make that change?"',
    a: "Every update to the site is logged in the change log with the audit finding that triggered it, the hypothesis, and the expected outcome — before any traffic sees it.",
  },
  {
    q: '"Did the test work?"',
    a: "Every A/B test has a documented result — win or lose — with the sample size, confidence level, and the decision made. Losing tests are recorded and archived.",
  },
  {
    q: '"What\'s happening with our conversion rate?"',
    a: "Monthly performance report — CVR vs baseline, scroll depth, form abandonment, Core Web Vitals. Every metric against its starting point, not just the current number.",
  },
  {
    q: '"What\'s coming next?"',
    a: "The 90-day roadmap is updated every month — prioritised tests, planned changes, and expected outcomes. You know what's coming before it happens.",
  },
  {
    q: '"Can you explain this to our marketing team?"',
    a: "Inter-departmental documentation is produced for every engagement — written so your internal team can understand and act on it without needing to be on every call.",
  },
];

const channels = [
  {
    name: "RocketChat",
    freq: "Day-to-day",
    desc: "Dedicated channel. Quick questions, test updates, early findings.",
    logo: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-label="RocketChat" role="img">
        <path d="M12 3C7.03 3 3 6.58 3 11c0 2.1.9 4 2.38 5.42L4 21l4.72-1.52A9.7 9.7 0 0012 20c4.97 0 9-3.58 9-9s-4.03-8-9-8z" fill="#e82561" fillOpacity="0.15" stroke="#e82561" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M8.5 13.5l2-4 2 3 2-2" stroke="#e82561" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: "Loom",
    freq: "With every update",
    desc: "Short video walkthrough of any significant change or result.",
    logo: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-label="Loom" role="img">
        <circle cx="12" cy="12" r="10" fill="#625DF5" />
        <circle cx="12" cy="12" r="4" fill="white" />
        <circle cx="12" cy="5.5" r="2" fill="white" />
        <circle cx="17.9" cy="9" r="2" fill="white" />
        <circle cx="17.9" cy="15" r="2" fill="white" />
        <circle cx="12" cy="18.5" r="2" fill="white" />
        <circle cx="6.1" cy="15" r="2" fill="white" />
        <circle cx="6.1" cy="9" r="2" fill="white" />
      </svg>
    ),
  },
  {
    name: "Check-in calls",
    freq: "Monthly (B) · Weekly or bi-weekly (A)",
    desc: "30 minutes. Focused on decisions — status lives in the dashboard.",
    logo: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-label="Video call" role="img">
        <rect x="2" y="7" width="13" height="10" rx="2" fill="#0F172A" fillOpacity="0.12" stroke="#0F172A" strokeOpacity="0.3" strokeWidth="1.5" />
        <path d="M15 10.5l5-2.5v8l-5-2.5V10.5z" fill="#0F172A" fillOpacity="0.2" stroke="#0F172A" strokeOpacity="0.3" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "Monthly report",
    freq: "Every month",
    desc: "Full performance report. CVR vs baseline, tests, changes, next priorities.",
    logo: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-label="Report" role="img">
        <rect x="4" y="3" width="13" height="17" rx="2" fill="#0F172A" fillOpacity="0.08" stroke="#0F172A" strokeOpacity="0.25" strokeWidth="1.5" />
        <path d="M8 8h7M8 12h7M8 16h4" stroke="#0F172A" strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="14" y="13" width="6" height="8" rx="1" fill="#c20e59" fillOpacity="0.15" stroke="#c20e59" strokeOpacity="0.5" strokeWidth="1" />
        <path d="M15.5 18v-3M17 18v-4.5M19 18v-2" stroke="#c20e59" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
  },
];


export default function HowItWorksPage() {
  return (
    <>
      <Header activePage="How it works" />
      <main id="main-content">
        {/* Hero */}
        <PageHero
          label="How it works"
          heading="What it actually feels like to work with us."
          subhead="Not a process diagram. A walk through what you never have to ask, what you always receive, and what actually changes."
        />

        {/* CRO explainer */}
        <section className="bg-brand-offwhite px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-4">What is CRO?</p>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-ink mb-6 leading-snug" style={{ letterSpacing: "-0.01em" }}>
              More traffic isn&apos;t the answer.<br />Making the traffic you have work harder is.
            </h2>
            <p className="text-base text-brand-ink/60 leading-relaxed mb-4">
              Conversion Rate Optimisation is the practice of systematically improving what happens after someone lands on your site. Not guessing, not redesigning because it looks dated — testing specific changes against real user behaviour, measuring the outcome, and only shipping what the data supports.
            </p>
            <p className="text-base text-brand-ink/60 leading-relaxed mb-10">
              Most Shopify brands invest heavily in driving traffic. Very few invest in what happens after the click. That&apos;s the gap CRO fills.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              <div className="bg-black/5 border border-black/10 rounded-sm p-5">
                <p className="font-mono text-xs font-medium uppercase tracking-wide text-brand-ink/40 mb-4">Not CRO</p>
                <ul className="text-sm text-brand-ink/60 space-y-2">
                  {["Redesigning because it looks old", "Changing copy on instinct", "Running ads to weak pages", "Guessing why sales stalled"].map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-brand-ink/30 mt-0.5">×</span>{i}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white border-2 border-brand-crimson rounded-sm p-5">
                <p className="font-mono text-xs font-medium uppercase tracking-wide text-brand-crimson mb-4">CRO</p>
                <ul className="text-sm text-brand-ink/60 space-y-2">
                  {["Finding where users leave and why", "Testing one change at a time", "Measuring the outcome", "Documenting the result"].map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-brand-crimson mt-0.5">→</span>{i}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-black/10 pt-8">
              <div className="flex items-start gap-4">
                <p className="font-mono text-3xl font-bold text-brand-crimson flex-shrink-0">+25%</p>
                <p className="text-sm text-brand-ink/60 leading-relaxed">Relative CVR lift on a $500K Shopify store ≈ $125K additional annual revenue from traffic you already have</p>
              </div>
              <div className="flex items-start gap-4">
                <p className="font-mono text-3xl font-bold text-brand-crimson flex-shrink-0">10,000+</p>
                <p className="text-sm text-brand-ink/60 leading-relaxed">Monthly sessions — the floor where heuristic CRO from Clarity + Shopify Analytics starts paying off (Class B)</p>
              </div>
              <div className="flex items-start gap-4">
                <p className="font-mono text-3xl font-bold text-brand-crimson flex-shrink-0">25,000+</p>
                <p className="text-sm text-brand-ink/60 leading-relaxed">Monthly sessions — the threshold where structured A/B testing via GrowthBook produces statistical significance (Class A)</p>
              </div>
            </div>
          </div>
        </section>

        {/* Principle bar */}
        <div className="bg-brand-ink px-6 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-mono text-xs text-white/30 uppercase tracking-widest mb-4">Core principle</p>
            <p className="text-xl md:text-2xl font-bold text-white leading-snug" style={{ letterSpacing: "-0.01em" }}>
              &ldquo;Every change has a rationale. Every test has a record. You always know what&apos;s happening and why.&rdquo;
            </p>
          </div>
        </div>

        {/* Never have to ask */}
        <section className="bg-white px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">What working with us feels like</p>
            <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: "-0.01em" }}>
              Six things you&apos;ll never have to ask.
            </h2>
            <div className="border border-black/10 rounded-sm overflow-hidden divide-y divide-black/10">
              {neverAskItems.map((item, i) => (
                <div key={i} className="px-5 py-5">
                  <p className="font-bold text-brand-ink text-sm leading-snug mb-3">{item.q}</p>
                  <p className="text-base text-brand-ink/60 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>



        {/* Documentation examples */}
        <section className="bg-brand-offwhite px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">How documentation works</p>
            <h2 className="text-2xl font-bold text-brand-ink mb-3" style={{ letterSpacing: "-0.01em" }}>Every change has a paper trail. Always.</h2>
            <p className="text-base text-brand-ink/60 leading-relaxed mb-10">Documentation runs from day one — through every audit, every test, every update. Not delivered at the end. Continuous.</p>

            {/* Change log */}
            <ScrollReveal delay={0}>
              <div className="border border-black/10 rounded-sm overflow-hidden mb-5">
                <div className="bg-black/5 border-b border-black/10 px-4 py-3 flex items-center gap-3">
                  <div className="w-3 h-3 rounded-sm bg-brand-crimson" />
                  <p className="font-bold text-brand-ink text-base">Change log entry</p>
                </div>
                <div className="p-4">
                  <p className="text-base text-brand-ink/60 leading-relaxed mb-4">Every site update logged with: what changed, the finding that triggered it, the hypothesis, and the target outcome.</p>
                  <div className="bg-black/5 rounded-sm p-4 font-mono text-sm text-brand-ink/60 leading-relaxed">
                    <span className="text-brand-ink font-medium">2024-03-14</span> · CTA moved above fold · /products/hero<br />
                    <span className="text-brand-ink font-medium">Finding:</span> 67% of mobile users never reached original CTA<br />
                    <span className="text-brand-ink font-medium">Hypothesis:</span> Moving CTA above fold → +8–12% mobile CVR<br />
                    <span className="text-brand-ink font-medium">Status:</span> Live — monitoring
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* A/B test record */}
            <ScrollReveal delay={150}>
              <div className="border border-black/10 rounded-sm overflow-hidden mb-5">
                <div className="bg-black/5 border-b border-black/10 px-4 py-3 flex items-center gap-3">
                  <div className="w-3 h-3 rounded-sm bg-brand-magenta" />
                  <p className="font-bold text-brand-ink text-base">A/B test record</p>
                </div>
                <div className="p-4">
                  <p className="text-base text-brand-ink/60 leading-relaxed mb-4">Every test documented before it runs. Results recorded when it closes — win or lose.</p>
                  <div className="bg-black/5 rounded-sm p-4 font-mono text-sm text-brand-ink/60 leading-relaxed">
                    <span className="text-brand-ink font-medium">Test #007</span> · &ldquo;Buy now&rdquo; vs &ldquo;Complete order&rdquo;<br />
                    <span className="text-brand-ink font-medium">Target:</span> Checkout CVR · <span className="text-brand-ink font-medium">Sample:</span> 2,400 sessions<br />
                    <span className="text-brand-ink font-medium">Result:</span> &ldquo;Complete order&rdquo; +14.2% · Significance: 96%<br />
                    <span className="text-brand-ink font-medium">Decision:</span> Variant shipped · <span className="text-brand-ink font-medium">Next:</span> Form field reduction
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Monthly report */}
            <ScrollReveal delay={300}>
              <div className="border border-black/10 rounded-sm overflow-hidden">
                <div className="bg-black/5 border-b border-black/10 px-4 py-3 flex items-center gap-3">
                  <div className="w-3 h-3 rounded-sm bg-brand-gold" />
                  <p className="font-bold text-brand-ink text-base">Monthly report — sample structure</p>
                </div>
                <div className="p-4">
                  <p className="text-base text-brand-ink/60 leading-relaxed mb-4">Same format every month — track changes over time without translating between structures.</p>
                  <div className="border border-black/10 rounded-sm overflow-hidden">
                    <div className="bg-brand-ink px-4 py-3 flex items-center justify-between">
                      <p className="font-bold text-white text-base">March 2024 — Performance report</p>
                      <p className="font-mono text-xs text-white/40">Class B · Month 3</p>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {[{ num: "2.4%", label: "CVR (was 1.8%)" }, { num: "−18%", label: "Form abandon" }, { num: "94", label: "Clarity score" }].map((m) => (
                          <div key={m.label} className="bg-black/5 rounded-sm p-3 text-center">
                            <p className="font-mono text-sm font-bold text-brand-crimson">{m.num}</p>
                            <p className="font-mono text-xs text-brand-ink/40 mt-1">{m.label}</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-brand-ink/60 italic">Sections: CVR vs baseline · Test results · Changes + rationale · Next month priorities · Updated roadmap</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
                {/* How we communicate */}
        <section className="bg-white px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">How we communicate</p>
            <h2 className="text-2xl font-bold text-brand-ink mb-3" style={{ letterSpacing: "-0.01em" }}>
              Async-first. Updates when they&apos;re ready.
            </h2>
            <p className="text-base text-brand-ink/55 leading-relaxed mb-8">
              No chasing for updates. No calls that could be a message. Every channel has a purpose and a cadence.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {channels.map((c) => (
                <div key={c.name} className="bg-white border border-black/10 rounded-sm p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-shrink-0">{c.logo}</div>
                    <div className="flex items-center justify-between flex-1 gap-2 min-w-0">
                      <p className="font-mono text-sm font-medium text-brand-ink">{c.name}</p>
                      <p className="font-mono text-xs text-brand-crimson flex-shrink-0">{c.freq}</p>
                    </div>
                  </div>
                  <p className="text-sm text-brand-ink/60 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tier overview */}
        <TierProgression
          label="Service tiers"
          heading="Every tier builds on the last."
          description="Start at the right level for where you are today. Each tier contains everything in the tier below — plus a deeper layer of capability added on top."
        />

        <DualCTA heading="See it in action on your site." />
      </main>
      <Footer />
    </>
  );
}
