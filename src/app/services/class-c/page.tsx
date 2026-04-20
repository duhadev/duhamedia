import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DualCTA from "@/components/sections/DualCTA";
import TierProgression from "@/components/sections/TierProgression";
import CommonQuestions from "@/components/sections/CommonQuestions";
import PDFLeadCapture from "@/components/ui/PDFLeadCapture";
import PageHero from "@/components/sections/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";

const qualifiers = [
  "Your website doesn't reflect the quality of your product",
  "You're on Shopify but the site was never properly designed",
  "Content changes require a developer — no CMS",
  "Your CRM isn't connected to your website",
  "You've never had Clarity or GA4 installed",
  "You want a foundation built to support future CRO",
];

const includedGroups = [
  {
    color: "#c20e59",
    label: "Design",
    items: [
      "Colors and typography update",
      "Conversion-informed UI — CTA placement, form structure, primary actions",
      "Engineered UX — flows built to support future optimization",
    ],
  },
  {
    color: "#e82561",
    label: "Integration",
    items: [
      "CMS integration — manage content independently after handoff",
      "CRM integration — connected to your existing system",
    ],
  },
  {
    color: "#f5c842",
    label: "Content",
    items: [
      "Copywriting handled by Duha Media",
      "Images sourced or produced by Duha Media",
    ],
  },
  {
    color: "#0F172A",
    label: "Analytics",
    items: [
      "Microsoft Clarity — session recording + heatmaps from day one",
      "GA4 — baseline traffic and conversion data from launch",
    ],
  },
];

const retainerItems = [
  { title: "Monthly Slack + Loom update", desc: "Check-in on site performance and any quick wins." },
  { title: "Clarity data review", desc: "Monthly heatmap review — flagging early behavioral insights." },
  { title: "Content guidance", desc: "Advice on copy updates and site maintenance." },
  { title: "Upgrade trigger monitoring", desc: "We tell you when the data says you're ready for Class B." },
];

const faqs = [
  { q: "How long does Class C take?", a: "Approximately 3 months from kickoff to launch. Timeline depends on content approvals and feedback cycles — the more responsive your team, the faster we move." },
  { q: "Do I need Class C before Class B?", a: "No. If your existing site is already solid, you may qualify to enter Class B directly. Eligibility is assessed case by case based on site quality and whether Clarity and GA4 are already installed." },
  { q: "Can I skip straight to Class B?", a: "Possibly. Book a call and we'll assess your site. If it's conversion-ready and already has behavioral data collecting, you may not need Class C at all." },
  { q: "What does onboarding look like?", a: "Week 1: brand, audience, and goals session. Weeks 2–4: design direction and first round of mockups. Weeks 5–10: build, content, and CMS setup. Weeks 11–12: review, revisions, and launch." },
  { q: "Who owns the deliverables?", a: "You do. All design files, content, and CMS access are yours. There's no lock-in — if the engagement ends, you have a fully operational site you control independently." },
  { q: "How much of our team's time is needed?", a: "Plan for 1–2 hours per week during the build phase for reviews and approvals. Content reviews require more attention — the more prepared your brand materials are upfront, the smoother this goes." },
];

export default function ClassCPage() {
  return (
    <>
      <Header activePage="Services" />
      <main id="main-content">
        {/* Hero */}
        <PageHero
          label="Class C · Foundation"
          heading={"\u201CThe minimum a self-respecting company needs for online success.\u201D"}
          headingSize="sm"
          subhead="A conversion-informed website for Shopify brands whose digital presence doesn't reflect the quality of their product."
          subheadSize="sm"
          meta="One-time project · ~3 months · Starting at $5,000"
        />

        {/* Who it's for */}
        <section className="bg-brand-offwhite px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Who it&apos;s for</p>
              <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: "-0.01em" }}>You need Class C if...</h2>
            </ScrollReveal>
            <blockquote className="border-l-[3px] border-brand-crimson pl-4 mb-8">
              <p className="font-mono text-sm italic text-brand-ink/60">&ldquo;Most Shopify brands invest heavily in driving traffic. Very few invest in what happens after the click.&rdquo;</p>
            </blockquote>
            <div className="flex flex-col gap-3 mb-8">
              {qualifiers.map((q, index) => (
                <ScrollReveal key={q} delay={index * 60}>
                  <div className="flex gap-3 items-start">
                    <div className="w-0.5 bg-brand-crimson flex-shrink-0 mt-1.5" style={{ height: "1.1rem" }} />
                    <p className="text-sm text-brand-ink/60">{q}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            <div className="border-t border-black/10 pt-6">
              <p className="text-xs text-brand-ink/40 italic leading-relaxed">
                Not sure? Class C is not required before Class B. If your existing site is solid, you may qualify to enter at Class B directly.{" "}
                <Link href="/services/class-b" className="text-brand-crimson underline underline-offset-2 not-italic">See Class B →</Link>
              </p>
            </div>
          </div>
        </section>

        {/* What's included */}
        <section className="bg-white px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">What&apos;s included</p>
              <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: "-0.01em" }}>Everything in one engagement.</h2>
            </ScrollReveal>
            <div className="flex flex-col">
              {/* Node 1: Design */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center flex-shrink-0 w-7">
                  <div className="w-7 h-7 rounded-full bg-brand-crimson flex items-center justify-center flex-shrink-0">
                    <span className="font-mono text-[11px] text-white font-bold">1</span>
                  </div>
                  <div className="flex-1 w-0.5 min-h-[40px] mt-1" style={{ background: "linear-gradient(to bottom, #c20e59, #e82561)" }} />
                </div>
                <div className="pb-6 flex-1">
                  <p className="font-mono text-[10px] text-brand-crimson uppercase tracking-widest mb-1">Design</p>
                  <p className="font-bold text-brand-ink text-sm mb-2">Conversion-informed UI</p>
                  <ul className="space-y-1">
                    <li className="text-xs text-brand-ink/60 flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">·</span>Colors and typography update</li>
                    <li className="text-xs text-brand-ink/60 flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">·</span>Conversion-informed UI — CTA placement, form structure, primary actions</li>
                    <li className="text-xs text-brand-ink/60 flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">·</span>Engineered UX — flows built to support future optimization</li>
                  </ul>
                </div>
              </div>
              {/* Node 2: Integration */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center flex-shrink-0 w-7">
                  <div className="w-7 h-7 rounded-full bg-brand-magenta flex items-center justify-center flex-shrink-0">
                    <span className="font-mono text-[11px] text-white font-bold">2</span>
                  </div>
                  <div className="flex-1 w-0.5 min-h-[40px] mt-1" style={{ background: "linear-gradient(to bottom, #e82561, #f5c842)" }} />
                </div>
                <div className="pb-6 flex-1">
                  <p className="font-mono text-[10px] text-brand-magenta uppercase tracking-widest mb-1">Integration</p>
                  <p className="font-bold text-brand-ink text-sm mb-2">CMS + CRM connected</p>
                  <ul className="space-y-1">
                    <li className="text-xs text-brand-ink/60 flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">·</span>CMS integration — manage content independently after handoff</li>
                    <li className="text-xs text-brand-ink/60 flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">·</span>CRM integration — connected to your existing system</li>
                  </ul>
                </div>
              </div>
              {/* Node 3: Content */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center flex-shrink-0 w-7">
                  <div className="w-7 h-7 rounded-full bg-brand-gold flex items-center justify-center flex-shrink-0">
                    <span className="font-mono text-[11px] font-bold" style={{ color: "#a07800" }}>3</span>
                  </div>
                  <div className="flex-1 w-0.5 min-h-[40px] mt-1" style={{ background: "linear-gradient(to bottom, #f5c842, #0F172A)" }} />
                </div>
                <div className="pb-6 flex-1">
                  <p className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: "#a07800" }}>Content</p>
                  <p className="font-bold text-brand-ink text-sm mb-2">Copy and imagery handled</p>
                  <ul className="space-y-1">
                    <li className="text-xs text-brand-ink/60 flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">·</span>Copywriting handled by Duha Media</li>
                    <li className="text-xs text-brand-ink/60 flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">·</span>Images sourced or produced by Duha Media</li>
                  </ul>
                </div>
              </div>
              {/* Node 4: Analytics */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center flex-shrink-0 w-7">
                  <div className="w-7 h-7 rounded-full bg-brand-ink flex items-center justify-center flex-shrink-0">
                    <span className="font-mono text-[11px] text-white font-bold">4</span>
                  </div>
                </div>
                <div className="pb-0 flex-1">
                  <p className="font-mono text-[10px] text-brand-ink/60 uppercase tracking-widest mb-1">Analytics</p>
                  <p className="font-bold text-brand-ink text-sm mb-2">Behavioral data from day one</p>
                  <ul className="space-y-1">
                    <li className="text-xs text-brand-ink/60 flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">·</span>Microsoft Clarity — session recording + heatmaps from day one</li>
                    <li className="text-xs text-brand-ink/60 flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">·</span>GA4 — baseline traffic and conversion data from launch</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <p className="font-mono text-[10px] text-brand-ink/40 uppercase tracking-widest mb-3">Engagement timeline</p>
              <div className="flex gap-1">
                <div className="flex-1 h-1.5 bg-brand-crimson rounded-l-sm" />
                <div className="flex-1 h-1.5 bg-brand-magenta" />
                <div className="flex-1 h-1.5 bg-brand-gold" />
                <div className="flex-1 h-1.5 bg-brand-ink rounded-r-sm" />
              </div>
              <div className="grid grid-cols-4 gap-1 mt-3">
                <div>
                  <p className="font-mono text-[10px] text-brand-ink/40">Weeks 1–3</p>
                  <p className="font-mono text-[11px] font-bold text-brand-ink">Design</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-brand-ink/40">Weeks 4–6</p>
                  <p className="font-mono text-[11px] font-bold text-brand-ink">Integrate</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-brand-ink/40">Weeks 7–9</p>
                  <p className="font-mono text-[11px] font-bold text-brand-ink">Content</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-brand-ink/40">Weeks 10–12</p>
                  <p className="font-mono text-[11px] font-bold text-brand-ink">Launch</p>
                </div>
              </div>
              <p className="font-mono text-[11px] text-brand-ink/40 italic mt-4">Clarity + GA4 collecting from launch day →</p>
            </div>
          </div>
        </section>

        {/* Documentation */}
        <section className="bg-brand-offwhite px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">How we document the work</p>
            <h2 className="text-2xl font-bold text-brand-ink mb-3" style={{ letterSpacing: "-0.01em" }}>Every change has a paper trail. Always.</h2>
            <p className="text-base text-brand-ink/60 leading-relaxed mb-10">Analytics are installed from day one. Every behavioral finding is documented before Class B begins — so when the time comes, there&apos;s a baseline to build from, not a blank slate to fill.</p>

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

        {/* Not included */}
        <section className="bg-brand-offwhite px-6 py-12">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-5">Not included</p>
              <div className="bg-black/5 border border-black/10 rounded-sm p-5 space-y-3">
                {["CRM development or custom CRM builds", "A/B testing and active CRO — that's where Class B begins."].map((item) => (
                  <p key={item} className="text-sm text-brand-ink/50 line-through">{item}</p>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* PDF lead capture */}
        <PDFLeadCapture
          tier="Class C"
          description="Scope, deliverables, timeline, and pricing — ready to forward to your team."
        />


        {/* retainer */}
        <section className="bg-white px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Optional add-on</p>
              <h2 className="text-2xl font-bold text-brand-ink mb-3" style={{ letterSpacing: "-0.01em" }}>
                Stay connected after launch. $500/mo.
              </h2>
              <p className="text-base text-brand-ink/60 leading-relaxed mb-8">
                Not ready for Class B yet? The retainer keeps the relationship active and the upgrade conversation on your terms.
              </p>
            </ScrollReveal>
            <div className="flex items-center gap-0">
              {/* Left column */}
              <div className="flex flex-col gap-3 flex-1">
                <div className="bg-brand-offwhite border border-black/10 rounded-sm p-2.5">
                  <p className="font-mono text-[11px] font-bold text-brand-ink">Monthly Slack + Loom</p>
                  <p className="font-mono text-[11px] text-brand-ink/50 mt-1">Check-in on site performance and any quick wins.</p>
                </div>
                <div className="bg-brand-offwhite border border-black/10 rounded-sm p-2.5">
                  <p className="font-mono text-[11px] font-bold text-brand-ink">Clarity data review</p>
                  <p className="font-mono text-[11px] text-brand-ink/50 mt-1">Monthly heatmap review — flagging early behavioral insights.</p>
                </div>
              </div>
              {/* Center: price circle */}
              <div className="flex flex-col items-center justify-center px-4 flex-shrink-0">
                <div className="w-20 h-20 rounded-full border border-brand-crimson bg-white flex flex-col items-center justify-center">
                  <p className="font-mono text-lg font-bold text-brand-crimson leading-none">$500</p>
                  <p className="font-mono text-[11px] text-brand-ink/40 leading-none mt-0.5">/mo</p>
                </div>
              </div>
              {/* Right column */}
              <div className="flex flex-col gap-3 flex-1">
                <div className="bg-brand-offwhite border border-black/10 rounded-sm p-2.5">
                  <p className="font-mono text-[11px] font-bold text-brand-ink">Content guidance</p>
                  <p className="font-mono text-[11px] text-brand-ink/50 mt-1">Advice on copy updates and site maintenance.</p>
                </div>
                <div className="bg-brand-offwhite border border-black/10 rounded-sm p-2.5">
                  <p className="font-mono text-[11px] font-bold text-brand-ink">Upgrade trigger monitoring</p>
                  <p className="font-mono text-[11px] text-brand-ink/50 mt-1">We tell you when the data says you&apos;re ready for Class B.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CommonQuestions
          heading="What comes up before teams sign off."
          items={faqs}
        />

        <TierProgression />
        <DualCTA heading="Ready to build the foundation?" />
      </main>
      <Footer />
    </>
  );
}
