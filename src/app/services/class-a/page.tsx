import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DualCTA from "@/components/sections/DualCTA";
import TierProgression from "@/components/sections/TierProgression";
import CommonQuestions from "@/components/sections/CommonQuestions";
import PDFLeadCapture from "@/components/ui/PDFLeadCapture";
import CaseStudiesComingSoon from "@/components/ui/CaseStudiesComingSoon";
import PageHero from "@/components/sections/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { serviceSchema, faqSchema, breadcrumbSchema, jsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Class A — Growth Intensive | Duha Media",
  description:
    "A 12-week intensive plus retainer for scaling Shopify brands ($300K–$1M+ revenue, 25,000+ monthly sessions). GrowthBook A/B testing, attribution, campaign playbook, and a live client dashboard.",
};

const qualifiers = [
  "Revenue in the $300K–$1M+ range",
  "25,000+ monthly sessions — the threshold where A/B testing becomes statistically productive",
  "Active paid ad spend across Facebook, Instagram, or Google",
  "Campaigns not connected to conversion data on-site",
  "A team that needs a documented playbook — not just monthly reports",
  "Ready for a committed 12-week engagement",
];

const phase1Deliverables = [
  {
    title: "Full marketing audit",
    body: "Every active channel reviewed — campaign history, spend breakdown, performance to date, creative direction, and attribution gaps. The audit surfaces what's being spent, what's working, and where money is leaking.",
  },
  {
    title: "CRO baseline report",
    body: "Current conversion rates, funnel drop-offs, Core Web Vitals, and a ranked list of prioritised quick wins — each with a documented hypothesis before any test begins.",
  },
  {
    title: "UTM taxonomy + three-layer tracking setup",
    body: "Shopify Analytics, GA4, Microsoft Clarity, and campaign attribution configured and verified across every active source. Without a clean UTM structure and reconciled measurement, you can't connect ad spend to on-site outcomes — this is the infrastructure everything else runs on.",
  },
];

const phase2Deliverables = [
  {
    title: "Full site CRO overhaul",
    body: "UX/UI redesign, landing page rebuilds, and GrowthBook A/B testing framework — all live and running by the end of Phase 2. Every design decision tied to a specific audit finding.",
  },
  {
    title: "Conversion funnel map",
    body: "The complete journey from ad impression to closed sale — fully documented. Every step, every drop-off point, every variable that affects the outcome. Your team can use this map independently of Duha Media.",
  },
  {
    title: "Campaign playbook",
    body: "UTM naming rules, attribution model, channel-specific optimisation guidelines, and creative alignment standards — written for your team to follow without needing to interpret.",
  },
];

const phase3Deliverables = [
  {
    title: "90-day strategic roadmap",
    body: "A prioritised list of A/B tests, campaign actions, and CRO initiatives — ready to execute from day one of the retainer. Not a wish list. A sequenced, data-backed plan with rationale for every item.",
  },
  {
    title: "Full documentation package",
    body: "Everything from the intensive — audit findings, change log, playbook, funnel map, and roadmap — delivered via your client dashboard. Every decision documented with its rationale.",
  },
  {
    title: "Live strategy session",
    body: "A dedicated session with your team — walkthrough of the full system, Q&A, and alignment on retainer priorities. Decision-makers need to be in the room.",
  },
];

const beforeAfterRows = [
  { before: "Campaigns running", after: "Campaigns connected to CVR" },
  { before: "No CVR baseline", after: "Full funnel baseline tracked" },
  { before: "Ad spend tracked by channel", after: "Ad spend tied to on-site outcomes" },
  { before: "CRO done separately", after: "CRO runs continuously" },
  { before: "No attribution model", after: "UTM attribution verified" },
  { before: "Monthly report from agency", after: "Live client dashboard — always on" },
  { before: "No documented system", after: "Playbook your team can run" },
];

const playbookComponents = [
  { title: "UTM naming rules", body: "A standardised taxonomy for every campaign, ad set, and creative — consistent attribution across channels and over time." },
  { title: "Attribution model", body: "How credit is assigned across touchpoints — documented and agreed so reporting is consistent regardless of who runs it." },
  { title: "Channel guidelines", body: "Facebook, Instagram, Google — optimisation rules based on what Phase 1 revealed about your audience." },
  { title: "Creative alignment standards", body: "What ad creative should do, how it connects to landing page messaging, and how to test creative variables systematically." },
];

const dashboardModules = [
  { title: "Audit findings", desc: "Phase 1 report + baseline" },
  { title: "Change log", desc: "Every update + rationale" },
  { title: "A/B test results", desc: "Winners, losers, next tests" },
  { title: "90-day roadmap", desc: "Live + updated each quarter" },
  { title: "Campaign playbook", desc: "UTM rules + attribution" },
  { title: "Monthly reports", desc: "Performance vs baseline" },
];

const retainerCards = [
  { title: "Campaign-to-CVR correlation report", body: "Monthly — how each channel drives behaviour and outcomes on-site.", unique: true },
  { title: "Cross-channel funnel analysis", body: "Segmented by UTM/source — paid vs organic vs social visitor behaviour.", unique: true },
  { title: "Continuous CRO optimisation", body: "Live traffic data drives all changes — no scheduled sprints.", unique: false },
  { title: "Strategic marketing recommendations", body: "Budget allocation, creative direction, targeting decisions — monthly.", unique: false },
  { title: "Weekly calls + async updates", body: "RocketChat + Loom between calls. Quarterly strategic review + refreshed roadmap.", unique: false },
  { title: "Full documentation updates", body: "Every change logged with rationale — dashboard stays live and current.", unique: false },
];

const pricingRows = [
  {
    label: "Intensive",
    value: "From $15,000 — three tiers based on traffic volume, ad spend, and team size. Fixed scope, the three phases as defined. Any changes are quoted separately and agreed in writing before work begins.",
  },
  {
    label: "Retainer start",
    value: "Begins automatically at week 13 unless the client opts out in writing by week 10. This structure ensures continuity — the intensive is designed to feed the retainer, not stand alone.",
  },
  {
    label: "Retainer rate",
    value: "From $1,500/mo (sliding scale). Final rate agreed at the end of Phase 1 when channel complexity, ad spend, and team size are fully known. Agreed in writing before the retainer begins.",
  },
  {
    label: "Opt-out window",
    value: "Written opt-out required by week 10. Opt-out keeps all deliverables — dashboard, playbook, funnel map, change log. No clawback on completed work.",
  },
];

const notIncludedItems = [
  "Paid media buying or direct ad campaign management",
  "SEO content production or organic content strategy",
  "CRM development or custom CRM builds",
  "Creative production — ad copy, video, photography",
];

const faqs = [
  {
    q: "What's the difference between the intensive and the retainer?",
    a: "The intensive builds the system — 12 weeks of audits, site rebuild, tracking infrastructure, and documented playbook. The retainer runs and optimises it continuously. You can't do the retainer without the intensive, and the intensive is designed to make the retainer immediately productive from week 13.",
  },
  {
    q: "We already have a media buyer running our ads. How does that work?",
    a: "That's the typical Class A setup. Duha Media doesn't run ads — we connect the campaigns your media buyer is running to on-site behaviour and conversion data. Your media buyer gets cleaner attribution data. You get a clearer picture of which spend is actually producing revenue.",
  },
  {
    q: "How is the retainer rate finalised?",
    a: "The final rate is agreed at the end of Phase 1 when channel complexity, ad spend volume, and team size are fully understood. The rate is confirmed in writing before the retainer begins.",
  },
  {
    q: "What happens if our priorities shift mid-engagement?",
    a: "Phase 1 is the alignment point. If major business priorities shift before Phase 2 begins, scope can be adjusted with written agreement. Once Phase 2 is underway, changes outside the defined scope are quoted separately — the fixed-scope structure protects both sides from scope creep.",
  },
  {
    q: "How much internal time does this require from our team?",
    a: "During the intensive — 2–3 hours per week for reviews and approvals, plus the Phase 3 strategy session which requires decision-makers present. During the retainer — under 2 hours per month. Weekly calls are 30 minutes. Reports are delivered async.",
  },
  {
    q: "What if we opt out of the retainer after the intensive?",
    a: "Written opt-out by week 10. You keep everything — the dashboard, playbook, funnel map, audit findings, change log, and 90-day roadmap. The GrowthBook account is client-billed and stays with you. No clawback on completed work.",
  },
  {
    q: "What does \"fixed scope\" actually mean when things come up?",
    a: "The intensive covers the three phases as defined. If new channels need to be added, the rebuild scope expands, or additional deliverables are requested mid-engagement, those are quoted separately and agreed in writing. Nothing is added to scope without your sign-off.",
  },
  {
    q: "Who owns the work when the engagement ends?",
    a: "You own everything. Dashboard access, the campaign playbook, funnel map, all design files, and the change log. The GrowthBook account is client-billed in your name. If the retainer ends, you have a fully operational system your team can run — or hand to any other partner.",
  },
];

export default function ClassAPage() {
  const schemas = [
    serviceSchema({
      name: "Class A — Growth Intensive",
      description:
        "A 12-week transformation plus retainer for scaling Shopify brands ($300K–$1M+ revenue, 25,000+ monthly sessions). GrowthBook A/B testing, attribution, and a live client dashboard.",
      path: "/services/class-a",
      tier: "A",
      priceDescription: "From $15,000 intensive + from $1,500/mo retainer",
    }),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "Class A — Growth Intensive", path: "/services/class-a" },
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
          label="Class A · Growth Intensive"
          heading={"\u201CA 12-week transformation that builds your growth system from the ground up \u2014 then we run it with you.\u201D"}
          headingSize="sm"
          subhead="For scaling Shopify brands with 25,000+ monthly sessions and active paid campaigns who want to stop running CRO and marketing in separate silos."
          meta="From $15,000 intensive + from $1,500/mo retainer · Min. 25,000 monthly sessions · Retainer begins week 13"
        />

        {/* Who it's for */}
        <section className="bg-brand-offwhite px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Who it&apos;s for</p>
              <h2 className="text-2xl font-bold text-brand-ink mb-5" style={{ letterSpacing: "-0.01em" }}>
                Class A is for brands ready to connect every marketing dollar to on-site behaviour.
              </h2>
              <p className="text-base text-brand-ink/60 leading-relaxed mb-8">
                Most businesses run paid campaigns and CRO in separate silos. Class A bridges that gap — every ad dollar gets connected to what actually happens after the click.
              </p>
            </ScrollReveal>
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
            <p className="text-xs text-brand-ink/40 italic border-t border-black/10 pt-5 leading-relaxed">
              Graduating from Class B? You skip or reduce Phase 1 scope — baseline and tracking are already in place. Retainer credit applied. Discussed at onboarding.
            </p>
          </div>
        </section>

        {/* Phase 1 */}
        <section className="px-6 py-16" style={{ background: "#fff5f8", borderTop: "3px solid #c20e59" }}>
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <div className="flex items-start justify-between mb-4">
                <p className="font-mono text-xs font-medium uppercase tracking-widest" style={{ color: "#c20e59" }}>Phase 01 — Discovery &amp; Foundation</p>
                <p className="font-mono text-xs text-brand-ink/40">Weeks 1–4</p>
              </div>
              <h2 className="text-2xl font-bold text-brand-ink mb-4" style={{ letterSpacing: "-0.01em" }}>Audit everything before touching anything.</h2>
              <p className="text-base text-brand-ink/60 leading-relaxed mb-8">
                No changes are made in Phase 1. The entire four weeks is diagnostic — building a complete, documented picture of where you are before a single pixel moves. Everything discovered here becomes the blueprint for Phase 2.
              </p>
            </ScrollReveal>
            <div className="mb-6">
              <div className="flex gap-1">
                <div className="flex-1 h-1.5 bg-brand-crimson rounded-l-sm" />
                <div className="flex-1 h-1.5 bg-brand-crimson" />
                <div className="flex-1 h-1.5 bg-brand-crimson" />
                <div className="flex-1 h-1.5 bg-brand-crimson rounded-r-sm" />
              </div>
              <div className="grid grid-cols-4 gap-1 mt-3">
                <div>
                  <p className="font-mono text-[10px] text-brand-ink/40">Week 1</p>
                  <p className="font-mono text-[11px] font-bold text-brand-ink">Channels</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-brand-ink/40">Week 2</p>
                  <p className="font-mono text-[11px] font-bold text-brand-ink">Baseline</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-brand-ink/40">Week 3</p>
                  <p className="font-mono text-[11px] font-bold text-brand-ink">Tracking</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-brand-ink/40">Week 4</p>
                  <p className="font-mono text-[11px] font-bold text-brand-ink">Audit</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 mb-8">
              {phase1Deliverables.map((d, index) => (
                <ScrollReveal key={d.title} delay={index * 80}>
                  <div className="border border-black/10 rounded-sm overflow-hidden bg-white">
                    <div className="bg-black/5 border-b border-black/10 px-5 py-3">
                      <p className="font-bold text-brand-ink text-base">{d.title}</p>
                    </div>
                    <p className="px-5 py-4 text-base text-brand-ink/60 leading-relaxed">{d.body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            <div className="border-t border-black/15 pt-6">
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-wide mb-3">Handoff at end of phase</p>
              <ul className="space-y-2">
                {["Marketing audit report", "CRO baseline + prioritised hypothesis backlog", "Tracking verified across all sources"].map((h) => (
                  <li key={h} className="flex gap-2 text-xs text-brand-ink/60">
                    <span style={{ color: "#c20e59" }} className="flex-shrink-0">→</span>{h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Phase 2 */}
        <section className="px-6 py-16" style={{ background: "#fff0f5", borderTop: "3px solid #e82561" }}>
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <div className="flex items-start justify-between mb-4">
                <p className="font-mono text-xs font-medium uppercase tracking-widest" style={{ color: "#e82561" }}>Phase 02 — Build</p>
                <p className="font-mono text-xs text-brand-ink/40">Weeks 5–10</p>
              </div>
              <h2 className="text-2xl font-bold text-brand-ink mb-4" style={{ letterSpacing: "-0.01em" }}>Rebuild the site and the system around what the data shows.</h2>
              <p className="text-base text-brand-ink/60 leading-relaxed mb-8">
                Phase 1 findings drive every Phase 2 decision. The site is rebuilt around conversion architecture, the A/B testing framework goes live, and the campaign playbook is documented for your internal team to follow independently.
              </p>
            </ScrollReveal>
            <div className="mb-6">
              <div className="flex gap-1">
                <div className="flex-1 h-1.5 bg-brand-magenta rounded-l-sm" />
                <div className="flex-1 h-1.5 bg-brand-magenta" />
                <div className="flex-1 h-1.5 bg-brand-magenta" />
                <div className="flex-1 h-1.5 bg-brand-magenta" />
                <div className="flex-1 h-1.5 bg-brand-magenta" />
                <div className="flex-1 h-1.5 bg-brand-magenta rounded-r-sm" />
              </div>
              <div className="grid grid-cols-6 gap-1 mt-3">
                <div>
                  <p className="font-mono text-[10px] text-brand-ink/40">Week 5</p>
                  <p className="font-mono text-[11px] font-bold text-brand-ink">UX</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-brand-ink/40">Week 6</p>
                  <p className="font-mono text-[11px] font-bold text-brand-ink">UX</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-brand-ink/40">Week 7</p>
                  <p className="font-mono text-[11px] font-bold text-brand-ink">A/B</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-brand-ink/40">Week 8</p>
                  <p className="font-mono text-[11px] font-bold text-brand-ink">Pages</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-brand-ink/40">Week 9</p>
                  <p className="font-mono text-[11px] font-bold text-brand-ink">Playbook</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-brand-ink/40">Week 10</p>
                  <p className="font-mono text-[11px] font-bold text-brand-ink">Funnel</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 mb-8">
              {phase2Deliverables.map((d, index) => (
                <ScrollReveal key={d.title} delay={index * 80}>
                  <div className="border border-black/10 rounded-sm overflow-hidden bg-white">
                    <div className="bg-black/5 border-b border-black/10 px-5 py-3">
                      <p className="font-bold text-brand-ink text-base">{d.title}</p>
                    </div>
                    <p className="px-5 py-4 text-base text-brand-ink/60 leading-relaxed">{d.body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            <div className="border-t border-black/15 pt-6">
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-wide mb-3">Handoff at end of phase</p>
              <ul className="space-y-2">
                {[
                  "Rebuilt site live — CRO architecture in place",
                  "A/B testing framework live — first test running",
                  "Conversion funnel map — complete and documented",
                  "Campaign playbook — ready for your team",
                ].map((h) => (
                  <li key={h} className="flex gap-2 text-xs text-brand-ink/60">
                    <span style={{ color: "#e82561" }} className="flex-shrink-0">→</span>{h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Phase 3 */}
        <section className="px-6 py-16" style={{ background: "#fffbeb", borderTop: "3px solid #f5c842" }}>
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <div className="flex items-start justify-between mb-4">
                <p className="font-mono text-xs font-medium uppercase tracking-widest" style={{ color: "#a07800" }}>Phase 03 — Launch &amp; Handoff</p>
                <p className="font-mono text-xs text-brand-ink/40">Weeks 11–12</p>
              </div>
              <h2 className="text-2xl font-bold text-brand-ink mb-4" style={{ letterSpacing: "-0.01em" }}>Hand off the system. Start the retainer ready on day one.</h2>
              <p className="text-base text-brand-ink/60 leading-relaxed mb-8">
                The intensive doesn&apos;t end with delivery — it ends with alignment. Your team walks away knowing exactly what was built, why every decision was made, and what happens next. The 90-day roadmap means the retainer starts with a full queue, not a blank slate.
              </p>
            </ScrollReveal>
            <div className="mb-6">
              <div className="flex gap-1">
                <div className="flex-1 h-1.5 bg-brand-gold rounded-l-sm" style={{ border: "0.5px solid #a07800" }} />
                <div className="flex-1 h-1.5 bg-brand-gold rounded-r-sm" style={{ border: "0.5px solid #a07800" }} />
              </div>
              <div className="grid grid-cols-2 gap-1 mt-3">
                <div>
                  <p className="font-mono text-[10px]" style={{ color: "#a07800" }}>Week 11</p>
                  <p className="font-mono text-[11px] font-bold text-brand-ink">Roadmap</p>
                </div>
                <div>
                  <p className="font-mono text-[10px]" style={{ color: "#a07800" }}>Week 12</p>
                  <p className="font-mono text-[11px] font-bold text-brand-ink">Session</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 mb-8">
              {phase3Deliverables.map((d, index) => (
                <ScrollReveal key={d.title} delay={index * 80}>
                  <div className="border border-black/10 rounded-sm overflow-hidden bg-white">
                    <div className="bg-black/5 border-b border-black/10 px-5 py-3">
                      <p className="font-bold text-brand-ink text-base">{d.title}</p>
                    </div>
                    <p className="px-5 py-4 text-base text-brand-ink/60 leading-relaxed">{d.body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            <div className="border-t border-black/15 pt-6">
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-wide mb-3">Handoff at end of phase</p>
              <ul className="space-y-2">
                {[
                  "90-day roadmap — prioritised and ready",
                  "Client dashboard — live with full documentation",
                  "Strategy session complete — team aligned",
                ].map((h) => (
                  <li key={h} className="flex gap-2 text-xs text-brand-ink/60">
                    <span style={{ color: "#f5c842" }} className="flex-shrink-0">→</span>{h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Before / After */}
        <section className="bg-white px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">What Class A changes</p>
              <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: "-0.01em" }}>Before and after the engagement.</h2>
              <div className="flex rounded-sm overflow-hidden border border-black/10">
                <div className="w-2/5" style={{ background: "rgba(0,0,0,0.06)" }}>
                  <div className="px-4 py-3 border-b border-black/10">
                    <p className="font-mono text-[11px] text-brand-ink/40 uppercase">Before</p>
                  </div>
                  {beforeAfterRows.map((r, i) => (
                    <div key={i} className={`py-2.5 px-4 ${i < beforeAfterRows.length - 1 ? "border-b border-black/10" : ""}`}>
                      <p className="text-sm text-brand-ink/50 line-through">{r.before}</p>
                    </div>
                  ))}
                </div>
                <div className="w-3/5 bg-white border-l-2 border-brand-crimson">
                  <div className="px-4 py-3 border-b border-black/10">
                    <p className="font-mono text-[11px] text-brand-crimson uppercase">After</p>
                  </div>
                  {beforeAfterRows.map((r, i) => (
                    <div key={i} className={`py-2.5 px-4 ${i < beforeAfterRows.length - 1 ? "border-b border-black/10" : ""}`}>
                      <p className="text-sm text-brand-ink">{r.after}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Campaign playbook */}
        <section className="bg-brand-offwhite px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">The campaign playbook</p>
              <h2 className="text-2xl font-bold text-brand-ink mb-4" style={{ letterSpacing: "-0.01em" }}>A system your team can run independently.</h2>
              <p className="text-base text-brand-ink/60 leading-relaxed mb-8">
                The playbook is one of the most distinctive Class A deliverables. It&apos;s not a report — it&apos;s operational documentation that makes your marketing team more effective whether or not the retainer continues.
              </p>
            </ScrollReveal>
            <div className="relative border border-black/10 rounded-sm overflow-hidden">
              <div className="grid grid-cols-2">
                {/* Top-left: UTM naming rules */}
                <div className="relative p-5 min-h-[120px] border-b border-r border-black/10">
                  <div className="w-2 h-2 rounded-full bg-brand-crimson mb-2" />
                  <p className="text-[12px] font-bold text-brand-ink mb-1">UTM naming rules</p>
                  <p className="text-[11px] text-brand-ink/50">A standardised taxonomy for every campaign, ad set, and creative — consistent attribution across channels and over time.</p>
                </div>
                {/* Top-right: Attribution model */}
                <div className="relative p-5 min-h-[120px] border-b border-black/10">
                  <div className="w-2 h-2 rounded-full bg-brand-magenta mb-2" />
                  <p className="text-[12px] font-bold text-brand-ink mb-1">Attribution model</p>
                  <p className="text-[11px] text-brand-ink/50">How credit is assigned across touchpoints — documented and agreed so reporting is consistent regardless of who runs it.</p>
                </div>
                {/* Bottom-left: Channel guidelines */}
                <div className="relative p-5 min-h-[120px] border-r border-black/10">
                  <div className="w-2 h-2 rounded-full bg-brand-gold mb-2" />
                  <p className="text-[12px] font-bold text-brand-ink mb-1">Channel guidelines</p>
                  <p className="text-[11px] text-brand-ink/50">Facebook, Instagram, Google — optimisation rules based on what Phase 1 revealed about your audience.</p>
                </div>
                {/* Bottom-right: Creative alignment */}
                <div className="relative p-5 min-h-[120px]">
                  <div className="w-2 h-2 rounded-full bg-brand-ink mb-2" />
                  <p className="text-[12px] font-bold text-brand-ink mb-1">Creative alignment standards</p>
                  <p className="text-[11px] text-brand-ink/50">What ad creative should do, how it connects to landing page messaging, and how to test creative variables systematically.</p>
                </div>
              </div>
              {/* Center Playbook label */}
              <div className="absolute w-8 h-8 rounded-full bg-white border border-black/15 flex items-center justify-center" style={{ top: "calc(50% - 16px)", left: "calc(50% - 16px)" }}>
                <p className="font-mono text-[9px] text-brand-ink/40 text-center leading-tight">Play&shy;book</p>
              </div>
            </div>
          </div>
        </section>

        {/* Client dashboard */}
        <section className="bg-white px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Client dashboard</p>
              <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: "-0.01em" }}>Everything in one place — always live.</h2>
              <div className="border border-black/10 rounded-sm overflow-hidden">
                <div className="bg-brand-ink px-5 py-4 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-magenta" />
                  <p className="font-bold text-white text-base">Duha Media Client Dashboard</p>
                  <span className="ml-auto font-mono text-xs bg-brand-magenta text-white px-2 py-0.5 rounded-sm">Live</span>
                </div>
                <div className="p-5">
                  <p className="text-base text-brand-ink/60 leading-relaxed mb-2">
                    Every client gets a live dashboard with full access to their documentation, reports, change log, and roadmap — viewable at any time, not just when a report lands in your inbox.
                  </p>
                  <p className="text-sm text-brand-ink/50 leading-relaxed mb-5">
                    Included with every Class A, B, and C engagement. <a href="/dashboard" className="text-brand-crimson underline underline-offset-2">See the full dashboard tour →</a>
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Column 1: crimson accent */}
                    <div className="border border-black/10 rounded-sm p-3 border-l-[3px] border-l-brand-crimson">
                      <p className="font-mono text-[11px] font-bold text-brand-ink">Audit findings</p>
                      <p className="font-mono text-[10px] text-brand-ink/50 mt-0.5">Phase 1 report + baseline</p>
                    </div>
                    {/* Column 2: magenta accent */}
                    <div className="border border-black/10 rounded-sm p-3 border-l-[3px] border-l-brand-magenta">
                      <p className="font-mono text-[11px] font-bold text-brand-ink">A/B test results</p>
                      <p className="font-mono text-[10px] text-brand-ink/50 mt-0.5">Winners, losers, next tests</p>
                    </div>
                    {/* Column 3: crimson accent */}
                    <div className="border border-black/10 rounded-sm p-3 border-l-[3px] border-l-brand-crimson">
                      <p className="font-mono text-[11px] font-bold text-brand-ink">Campaign playbook</p>
                      <p className="font-mono text-[10px] text-brand-ink/50 mt-0.5">UTM rules + attribution</p>
                    </div>
                    <div className="border border-black/10 rounded-sm p-3 border-l-[3px] border-l-brand-crimson">
                      <p className="font-mono text-[11px] font-bold text-brand-ink">Change log</p>
                      <p className="font-mono text-[10px] text-brand-ink/50 mt-0.5">Every update + rationale</p>
                    </div>
                    <div className="border border-black/10 rounded-sm p-3 border-l-[3px] border-l-brand-magenta">
                      <p className="font-mono text-[11px] font-bold text-brand-ink">90-day roadmap</p>
                      <p className="font-mono text-[10px] text-brand-ink/50 mt-0.5">Live + updated each quarter</p>
                    </div>
                    <div className="border border-black/10 rounded-sm p-3 border-l-[3px] border-l-brand-crimson">
                      <p className="font-mono text-[11px] font-bold text-brand-ink">Monthly reports</p>
                      <p className="font-mono text-[10px] text-brand-ink/50 mt-0.5">Performance vs baseline</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Documentation */}
        <section className="bg-brand-offwhite px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">How we document the work</p>
            <h2 className="text-2xl font-bold text-brand-ink mb-3" style={{ letterSpacing: "-0.01em" }}>Every change has a paper trail. Always.</h2>
            <p className="text-base text-brand-ink/60 leading-relaxed mb-10">Documentation runs across all three phases. The change log starts in Phase 1 and never stops — by the time the retainer begins, there&apos;s already a full record of every decision made and every finding surfaced.</p>

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

        {/* Retainer */}
        <section className="bg-brand-offwhite px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Retainer — begins week 13</p>
              <h2 className="text-2xl font-bold text-brand-ink mb-3" style={{ letterSpacing: "-0.01em" }}>Continuous optimisation built on the intensive.</h2>
              <p className="text-base text-brand-ink/60 leading-relaxed mb-8">
                The intensive feeds directly into the retainer. By week 13 the system is live, the first 90 days are planned, and the retainer starts with a full queue — not a blank slate.
              </p>
            </ScrollReveal>
            {/* Unique to Class A items */}
            <div className="mb-4">
              {retainerCards.filter((c) => c.unique).map((c, index) => (
                <ScrollReveal key={c.title} delay={index * 60}>
                  <div className="relative bg-white border border-black/10 border-l-[3px] border-l-brand-crimson rounded-sm p-5 mb-4">
                    <span className="absolute top-3 right-3 border border-brand-crimson rounded-sm px-1.5 py-0.5 font-mono text-[10px] text-brand-crimson">Unique to Class A</span>
                    <p className="font-bold text-brand-ink text-base mb-2 pr-28">{c.title}</p>
                    <p className="text-sm text-brand-ink/60 leading-relaxed">{c.body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            {/* Standard retainer items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {retainerCards.filter((c) => !c.unique).map((c, index) => (
                <ScrollReveal key={c.title} delay={index * 60}>
                  <div className="border border-black/10 rounded-sm p-5">
                    <p className="font-bold text-brand-ink text-base mb-2">{c.title}</p>
                    <p className="text-sm text-brand-ink/60 leading-relaxed">{c.body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing terms */}
        <section className="bg-white px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Terms</p>
              <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: "-0.01em" }}>Fixed scope. Written terms. No surprises.</h2>
              <div className="flex items-end gap-0 overflow-x-auto py-8">
                {/* Node 01: Kickoff */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-brand-crimson flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <p className="font-mono text-[11px] font-bold text-brand-ink mt-3 text-center">Kickoff</p>
                  <p className="font-mono text-[11px] text-brand-ink/40 text-center">Fixed scope agreed</p>
                </div>
                {/* Connector 1 */}
                <div className="flex-1 min-w-[60px] flex flex-col items-center gap-1 pb-10">
                  <p className="font-mono text-[10px] text-brand-ink/40 text-center mb-1">Fixed scope agreed</p>
                  <div className="w-full h-px bg-brand-ink/20" />
                </div>
                {/* Node 02: End of Phase 1 */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-white border border-brand-ink/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-brand-ink/20" />
                  </div>
                  <p className="font-mono text-[11px] font-bold text-brand-ink mt-3 text-center">End of Phase 1</p>
                  <p className="font-mono text-[11px] text-brand-ink/40 text-center">Rate confirmed</p>
                </div>
                {/* Connector 2 */}
                <div className="flex-1 min-w-[60px] flex flex-col items-center gap-1 pb-10">
                  <p className="font-mono text-[10px] text-brand-ink/40 text-center mb-1">Opt-out deadline</p>
                  <div className="w-full h-px bg-brand-ink/20" />
                </div>
                {/* Node 03: Week 10 */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-white border border-brand-ink/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-brand-ink/20" />
                  </div>
                  <p className="font-mono text-[11px] font-bold text-brand-ink mt-3 text-center">Week 10</p>
                  <p className="font-mono text-[11px] text-brand-ink/40 text-center">Written opt-out closes</p>
                </div>
                {/* Connector 3 */}
                <div className="flex-1 min-w-[60px] flex flex-col items-center gap-1 pb-10">
                  <p className="font-mono text-[10px] text-brand-ink/40 text-center mb-1">Retainer begins</p>
                  <div className="w-full h-px bg-brand-ink/20" />
                </div>
                {/* Node 04: Week 13 */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-brand-magenta flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <p className="font-mono text-[11px] font-bold text-brand-ink mt-3 text-center">Week 13</p>
                  <p className="font-mono text-[11px] text-brand-ink/40 text-center">Retainer begins</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* What Class A is not */}
        <section className="bg-brand-offwhite px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">What Class A is not</p>
              <h2 className="text-2xl font-bold text-brand-ink mb-4" style={{ letterSpacing: "-0.01em" }}>Advisory, not execution.</h2>
              <p className="text-base text-brand-ink/60 italic leading-relaxed mb-5">
                Duha Media advises on strategy. Execution of the following stays with your team or existing agency partners.
              </p>
              <div className="flex gap-0 border border-black/10 rounded-sm overflow-hidden">
                <div className="w-2/5 p-5">
                  <p className="font-mono text-[11px] text-brand-crimson mb-3">Duha Media</p>
                  <div className="space-y-2">
                    <p className="text-sm text-brand-ink"><span className="text-brand-crimson mr-2">→</span>Strategy + advisory</p>
                    <p className="text-sm text-brand-ink"><span className="text-brand-crimson mr-2">→</span>CRO + A/B testing</p>
                    <p className="text-sm text-brand-ink"><span className="text-brand-crimson mr-2">→</span>Attribution + tracking</p>
                    <p className="text-sm text-brand-ink"><span className="text-brand-crimson mr-2">→</span>Playbook + roadmap</p>
                  </div>
                </div>
                <div className="w-px bg-brand-ink/10 flex-shrink-0" />
                <div className="flex-1 p-5">
                  <p className="font-mono text-[11px] text-brand-ink/40 mb-3">Your team or agency partners</p>
                  <div className="space-y-2">
                    {notIncludedItems.map((item) => (
                      <p key={item} className="text-sm text-brand-ink/50 line-through"><span className="text-brand-ink/30 mr-2 no-underline" style={{ textDecoration: "none" }}>×</span>{item}</p>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Results — TODO: replace with real case study when live */}
        <section className="bg-white px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Results</p>
            <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: "-0.01em" }}>What Class A actually produces.</h2>
            <CaseStudiesComingSoon variant="compact" />
          </div>
        </section>

        <CommonQuestions
          heading="What comes up before leadership signs off."
          items={faqs}
        />

        {/* PDF lead capture */}
        <PDFLeadCapture
          tier="Class A"
          description="All three phases, retainer scope, playbook breakdown, pricing terms, and FAQ — ready to share with your leadership team."
        />

        <TierProgression />
        <DualCTA heading="Ready to build the system?" />
      </main>
      <Footer />
    </>
  );
}
