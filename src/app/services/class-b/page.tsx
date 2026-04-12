import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DualCTA from "@/components/sections/DualCTA";
import TierProgression from "@/components/sections/TierProgression";
import CommonQuestions from "@/components/sections/CommonQuestions";
import PDFLeadCapture from "@/components/ui/PDFLeadCapture";
import CaseStudiesComingSoon from "@/components/ui/CaseStudiesComingSoon";
import PageHero from "@/components/sections/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";

const prerequisites = [
  {
    num: "500+",
    title: "Monthly sessions",
    why: "Below this, A/B tests produce noise, not signal. You need enough traffic to reach statistical significance within a reasonable test window.",
  },
  {
    num: "Paid",
    title: "Active or planned ads",
    why: "Ad spend signals you're already invested in driving traffic. CRO compounds that investment — improving what happens after the click, not just before it.",
  },
];

const setupDeliverables = [
  { num: "01", title: "GA4 conversion tracking configuration", body: "Goals, events, and funnels set up from scratch or rebuilt on your existing install. No optimisation is possible without a reliable baseline — this is the first thing we fix." },
  { num: "02", title: "Full site CRO audit", body: "A complete review of where your traffic drops off — using Clarity heatmaps, session recordings, and GA4 funnel data. Every finding is documented with a hypothesis before a single change is made." },
  { num: "03", title: "UX/UI refinements", body: "CTA placement, form structure, page hierarchy, and mobile experience updated to reflect what the data says, not what looks good." },
  { num: "04", title: "Convert.com A/B testing framework", body: "Platform configured, integrated with Clarity, and first test launched. Every test has a documented hypothesis, a target metric, and a minimum sample size before it's called." },
  { num: "05", title: "Landing page redesigns", body: "Key pages rebuilt around conversion architecture — especially those receiving paid traffic where the cost of leaking visitors is highest." },
  { num: "06", title: "Heatmap + session recording analysis", body: "Baseline established from Clarity data. Behavioural patterns identified and ranked into a hypothesis backlog — the fuel for every A/B test that follows." },
];

const retainerItems = [
  { title: "Continuous UX updates", desc: "Changes informed by live traffic data, not scheduled sprints." },
  { title: "Monthly performance report", desc: "CVR, CTR, scroll depth, form abandonment, Core Web Vitals vs. baseline." },
  { title: "A/B test results + next-test recommendations", desc: "Winners documented, losers analysed, next hypothesis queued." },
  { title: "Full change log", desc: "Every update logged with its rationale and measured outcome." },
  { title: "Bi-weekly check-in calls", desc: "Async Slack + Loom updates between calls." },
  { title: "Inter-departmental docs", desc: "Documentation your marketing and product teams can actually use." },
];

const tools = [
  {
    name: "Microsoft Clarity",
    cost: "Free",
    desc: "Session recording, heatmaps, UTM campaign filtering. Installed at Class C — data collecting before Class B begins.",
    why: "Free, privacy-compliant, integrates directly with Convert.com for combined experiment + session analysis.",
  },
  {
    name: "Convert.com",
    cost: "~$349/mo (client-billed)",
    desc: "Dedicated A/B testing platform. SMB-priced, privacy-focused, purpose-built for conversion testing.",
    why: "VWO and AB Tasty merged into enterprise-tier platforms at $10K+/yr. Convert is the right fit for brands under $5M.",
  },
];

const keyMetrics = [
  { name: "CVR", desc: "Primary goal. Every engagement benchmarked here from day one." },
  { name: "Scroll depth", desc: "Where users disengage before reaching the CTA." },
  { name: "CTR", desc: "CTA visibility and copy effectiveness on key elements." },
  { name: "Form abandonment", desc: "Last drop-off before the sale. Often the most fixable." },
  { name: "Core Web Vitals", desc: "LCP, FID, CLS — speed and stability affect conversion directly." },
  { name: "Mobile vs desktop", desc: "Most paid traffic is mobile. Most sites are built for desktop." },
  { name: "Micro-conversions", desc: "Add-to-cart, wishlist — leading indicators before the final sale." },
];

const faqs = [
  { q: "How long before we see results?", a: "The setup phase typically takes 4–6 weeks. First A/B test results come in 3–6 weeks after that, depending on traffic volume. Meaningful CVR movement is usually visible within 90 days — though the change log starts from day one, so you're never waiting to see what's happening." },
  { q: "How do we know the changes you make actually caused the improvement?", a: "Everything runs through Convert.com — a dedicated A/B testing platform that isolates variables and measures statistical significance before a test is called. Every result is documented with the test parameters, sample size, and confidence level. You see the methodology, not just the number." },
  { q: "What if our traffic drops mid-engagement?", a: "If traffic drops below the 500-session threshold, A/B testing pauses — running tests on insufficient data produces misleading results and we won't do it. The retainer shifts to audit, analysis, and preparation work until traffic recovers. You're not paying for noise." },
  { q: "Who owns the work when the retainer ends?", a: "You do. All design files, documentation, and change logs are yours. The Convert.com account is client-billed and stays with you. There's no lock-in on assets or data." },
  { q: "How much of our team's time does this require?", a: "Minimal. We work in a dedicated Slack channel and deliver async Loom updates. Bi-weekly check-ins are 30 minutes. Monthly report reviews are optional. Most clients spend under 2 hours a month on active involvement." },
  { q: "What does the first 30 days actually look like?", a: "Week 1: GA4 audit and tracking fix. Week 2: Clarity and heatmap baseline review. Weeks 3–4: CRO audit delivered with prioritised hypothesis backlog. By day 30 you have a complete picture of what's broken and a ranked list of what to fix first." },
  { q: "Can we pause the retainer?", a: "Pauses can be arranged with 30 days written notice for circumstances outside your control. Standard retainers don't include pause terms by default. This is discussed and agreed during onboarding." },
  { q: "How is this different from hiring a CRO consultant?", a: "A consultant gives you a report. We give you a documented, running system — tested changes, a live change log, and a hypothesis backlog that keeps producing results after the initial work is done. The retainer is designed to compound, not repeat itself each month." },
];

export default function ClassBPage() {
  return (
    <>
      <Header activePage="Services" />
      <main id="main-content">
        {/* Hero */}
        <PageHero
          label="Class B · CRO Core"
          heading={"\u201CData-driven conversion rate optimisation \u2014 turning your existing traffic into measurable revenue.\u201D"}
          headingSize="sm"
          subhead="For Shopify stores with existing traffic and paid campaigns. We systematically improve what happens after the click."
          meta="Setup fee + $1,500/mo retainer · Min. 500 monthly sessions to qualify"
        />

        {/* Prerequisites */}
        <section className="bg-brand-offwhite px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Prerequisites</p>
              <h2 className="text-2xl font-bold text-brand-ink mb-3" style={{ letterSpacing: "-0.01em" }}>Class B requires a qualifying site.</h2>
              <p className="text-base text-brand-ink/60 leading-relaxed mb-8">
                We won&apos;t take on an engagement that can&apos;t produce statistically meaningful results. These aren&apos;t arbitrary thresholds — they&apos;re the conditions under which CRO actually works.
              </p>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              {prerequisites.map((p, index) => (
                <ScrollReveal key={p.title} delay={index * 80}>
                  <div className="bg-white border border-black/10 rounded-sm p-5">
                    <p className="font-mono text-4xl font-bold text-brand-crimson mb-2">{p.num}</p>
                    <p className="font-bold text-brand-ink text-base mb-3">{p.title}</p>
                    <p className="text-sm text-brand-ink/60 leading-relaxed border-t border-black/10 pt-3 italic">{p.why}</p>
                    {p.num === "500+" && (
                      <p className="font-mono text-[10px] text-brand-ink/40 mt-2">Under 500 sessions → noise · 500+ sessions → signal</p>
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
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Retainer — $1,500/mo ongoing</p>
              <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: "-0.01em" }}>What you get every month.</h2>
            </ScrollReveal>
            <div className="grid grid-cols-4 gap-3">
              <div className="grid grid-cols-4 gap-3 col-span-4 mb-2">
                {["Week 1", "Week 2", "Week 3", "Week 4"].map((w) => (
                  <p key={w} className="font-mono text-[10px] text-brand-ink/40">{w}</p>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <div className="bg-brand-crimson text-white rounded-sm px-2 py-1 font-mono text-[11px] text-center">UX updates live</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="bg-brand-magenta text-white rounded-sm px-2 py-1 font-mono text-[11px] text-center">A/B test check</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="bg-brand-offwhite text-brand-ink rounded-sm px-2 py-1 font-mono text-[11px] text-center" style={{ borderWidth: "0.5px", borderStyle: "solid", borderColor: "#c20e59" }}>Check-in call</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="bg-brand-ink text-white rounded-sm px-2 py-1 font-mono text-[11px] text-center">Monthly report</div>
                <div className="bg-brand-offwhite text-brand-ink rounded-sm px-2 py-1 font-mono text-[11px] text-center border border-black/20">Roadmap update</div>
              </div>
            </div>
            <p className="font-mono text-[11px] text-brand-ink/40 mt-4">Cadence repeats every month. Slack + Loom async between calls.</p>
          </div>
        </section>

        {/* Documentation */}
        <section className="bg-white px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">How we document the work</p>
            <h2 className="text-2xl font-bold text-brand-ink mb-3" style={{ letterSpacing: "-0.01em" }}>Every change has a paper trail. Always.</h2>
            <p className="text-base text-brand-ink/60 leading-relaxed mb-10">Every change is logged before traffic sees it. Every test is recorded win or lose. Documentation runs continuously — not delivered at the end of the engagement.</p>

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

        {/* Tool stack */}
        <section className="bg-white px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Tool stack</p>
              <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: "-0.01em" }}>Enterprise-grade insight at SMB pricing.</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <ScrollReveal delay={0}>
                <div className="border border-black/10 rounded-sm p-5">
                  <p className="font-mono text-sm font-medium text-brand-ink mb-1">Microsoft Clarity</p>
                  <p className="font-mono text-xs text-brand-ink/40 mb-3">Free</p>
                  <p className="text-sm text-brand-ink/60 leading-relaxed mb-3">Session recording, heatmaps, UTM campaign filtering. Installed at Class C — data collecting before Class B begins.</p>
                  <p className="text-[11px] italic text-brand-ink/50 leading-relaxed border-l-[3px] pl-3 mt-3" style={{ borderColor: "#c20e59" }}>Free, privacy-compliant, integrates directly with Convert.com for combined experiment + session analysis.</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={80}>
                <div className="border border-black/10 rounded-sm p-5">
                  <p className="font-mono text-sm font-medium text-brand-ink mb-1">Convert.com</p>
                  <p className="font-mono text-xs text-brand-ink/40 mb-3">~$349/mo (client-billed)</p>
                  <p className="text-sm text-brand-ink/60 leading-relaxed mb-3">Dedicated A/B testing platform. SMB-priced, privacy-focused, purpose-built for conversion testing.</p>
                  <p className="text-[11px] italic text-brand-ink/50 leading-relaxed border-l-[3px] pl-3 mt-3" style={{ borderColor: "#e82561" }}>VWO and AB Tasty merged into enterprise-tier platforms at $10K+/yr. Convert is the right fit for brands under $5M.</p>
                </div>
              </ScrollReveal>
            </div>
            <div className="mt-6 border-t border-black/10 pt-6">
              <p className="font-mono text-[10px] text-brand-ink/40 mb-3">Platform comparison</p>
              <div className="flex items-center gap-3 py-2 border-b border-black/10">
                <p className="font-mono text-[11px] text-brand-ink min-w-[120px]">VWO / AB Tasty</p>
                <div className="flex-1 h-2 rounded-full bg-brand-ink/12" />
                <p className="font-mono text-[11px] text-brand-ink/60">$10,000+/yr</p>
                <p className="font-mono text-[10px] text-brand-ink/40 min-w-[80px] text-right">Enterprise tier</p>
              </div>
              <div className="flex items-center gap-3 py-2 border-b border-black/10">
                <p className="font-mono text-[11px] text-brand-ink min-w-[120px]">Convert.com</p>
                <div className="flex-1 h-2 rounded-full relative">
                  <div className="w-[42%] h-2 bg-brand-crimson/20 rounded-full" />
                </div>
                <p className="font-mono text-[11px] text-brand-crimson">~$4,188/yr</p>
                <p className="font-mono text-[10px] text-brand-crimson min-w-[80px] text-right">Right fit</p>
              </div>
              <div className="flex items-center gap-3 py-2">
                <p className="font-mono text-[11px] text-brand-ink min-w-[120px]">Clarity</p>
                <div className="flex-1 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-brand-ink/40" />
                </div>
                <p className="font-mono text-[11px] text-brand-ink/60">Free</p>
                <p className="font-mono text-[10px] text-brand-ink/40 min-w-[80px] text-right">Included</p>
              </div>
            </div>
            <p className="font-mono text-xs text-brand-ink/40 border-t border-black/10 pt-4 mt-2">
              Convert.com is billed directly to the client — separate from the Duha Media retainer. No markup.
            </p>
          </div>
        </section>

        {/* Key metrics */}
        <section className="bg-brand-offwhite px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">What we track</p>
              <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: "-0.01em" }}>Seven metrics. All tied to revenue.</h2>
            </ScrollReveal>
            <div className="flex items-center gap-4 min-h-[200px]">
              {/* Left metrics */}
              <div className="flex flex-col gap-2 flex-1">
                {[keyMetrics[1], keyMetrics[2], keyMetrics[3]].map((m) => (
                  <div key={m.name} className="bg-brand-offwhite border border-black/10 rounded-sm p-3">
                    <p className="font-mono text-[11px] font-bold text-brand-ink">{m.name}</p>
                    <p className="font-mono text-[11px] text-brand-ink/50 mt-0.5">{m.desc}</p>
                  </div>
                ))}
              </div>
              {/* Center: CVR circle */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-brand-ink flex flex-col items-center justify-center">
                  <p className="font-mono text-[13px] font-bold text-white leading-none">CVR</p>
                  <p className="font-mono text-[10px] text-white/60 leading-none mt-0.5">Primary goal</p>
                </div>
              </div>
              {/* Right metrics */}
              <div className="flex flex-col gap-2 flex-1">
                {[keyMetrics[4], keyMetrics[5], keyMetrics[6]].map((m) => (
                  <div key={m.name} className="bg-brand-offwhite border border-black/10 rounded-sm p-3">
                    <p className="font-mono text-[11px] font-bold text-brand-ink">{m.name}</p>
                    <p className="font-mono text-[11px] text-brand-ink/50 mt-0.5">{m.desc}</p>
                  </div>
                ))}
              </div>
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
