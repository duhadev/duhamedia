import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DualCTA from "@/components/sections/DualCTA";
import PageHero from "@/components/sections/PageHero";
import TierProgression from "@/components/sections/TierProgression";
import ScrollReveal from "@/components/ui/ScrollReveal";

const tiers = [
  {
    super: "Foundation",
    name: "Class C",
    tagline: '"The minimum a self-respecting company needs for online success."',
    who: "Shopify brands that lack a properly designed website — or have one that doesn't reflect the quality of their product.",
    meta: "One-time · ~3 months",
    includes: [
      "Conversion-informed UI design",
      "Engineered UX",
      "CMS + CRM integration",
      "Content creation",
      "Clarity + GA4 at launch",
    ],
    href: "/services/class-c",
    featured: false,
  },
  {
    super: "CRO Core",
    name: "Class B",
    tagline: '"Data-driven CRO — turning your existing traffic into measurable revenue."',
    who: "Shopify stores with 500+ monthly sessions running or planning paid social ads.",
    meta: "Setup fee + $1,500/mo retainer",
    includes: [
      "Full CRO audit",
      "A/B testing via Convert.com",
      "Landing page redesigns",
      "Monthly performance reports",
      "Full change log",
    ],
    href: "/services/class-b",
    featured: true,
  },
  {
    super: "Growth Intensive",
    name: "Class A",
    tagline: '"A 12-week transformation that builds your growth system from the ground up."',
    who: "Scaling brands ($500K–$5M) with active paid campaigns across multiple channels.",
    meta: "Fixed 12-week + $3–5K/mo retainer",
    includes: [
      "Full marketing audit",
      "Conversion funnel map",
      "Campaign playbook",
      "90-day strategic roadmap",
      "Full client dashboard handoff",
    ],
    href: "/services/class-a",
    featured: false,
  },
];

const steps = [
  { bar: "#c20e59", title: "Audit", body: "Clarity heatmaps, GA4 data, session recordings. We find the drop-offs before we touch anything." },
  { bar: "#e82561", title: "Build", body: "UX and UI designed around conversion architecture — not aesthetics first." },
  { bar: "#f5c842", title: "Optimize", body: "A/B tests via Convert.com. Every variant documented. Every winner shipped." },
  { bar: "#0F172A", title: "Report", body: "Monthly performance reports. Full change log. You always know what changed and why." },
];

export default function ServicesPage() {
  return (
    <>
      <Header activePage="Services" />
      <main id="main-content">
        {/* Hero */}
        <PageHero
          label="Services"
          heading="Three ways to work together."
          subhead="Every engagement is scoped to where you are. Class C builds the foundation. Class B optimizes it. Class A connects your entire growth system."
        />

        {/* Tier blocks */}
        <section className="bg-brand-offwhite px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-10">
                Choose your tier
              </p>
            </ScrollReveal>
            <div className="flex flex-col gap-6">
              {tiers.map((t, index) => (
                <ScrollReveal key={t.name} delay={index * 80}>
                  <div
                    className={`bg-white rounded-sm overflow-hidden ${
                      t.featured ? "border-2 border-brand-crimson" : "border border-black/10"
                    }`}
                  >
                    <div className="px-6 py-5 border-b border-black/10 flex items-start justify-between gap-4">
                      <div>
                        {t.featured && (
                          <span className="font-mono text-xs bg-brand-crimson text-white px-2 py-0.5 rounded-sm inline-block mb-2">
                            MOST COMMON
                          </span>
                        )}
                        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-wide mb-1">{t.super}</p>
                        <p className="text-xl font-bold text-brand-ink mb-2">{t.name}</p>
                        <p className="text-sm text-brand-ink/60 italic">{t.tagline}</p>
                      </div>
                      <p className="font-mono text-xs text-brand-ink/40 text-right flex-shrink-0">{t.meta}</p>
                    </div>
                    <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-wide mb-3">Who it&apos;s for</p>
                        <p className="text-base text-brand-ink/60 leading-relaxed">{t.who}</p>
                      </div>
                      <div>
                        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-wide mb-3">What&apos;s included</p>
                        <ul className="space-y-1.5">
                          {t.includes.map((i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-brand-ink/60">
                              <span className="text-brand-crimson mt-0.5 flex-shrink-0">→</span>{i}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="px-6 py-3 border-t border-black/10 flex justify-end">
                      <Link href={t.href} className="font-mono text-xs text-brand-crimson underline underline-offset-2">
                        See full details →
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-white px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">How it works</p>
              <h2 className="text-2xl font-bold text-brand-ink mb-3" style={{ letterSpacing: "-0.01em" }}>
                The methodology behind every engagement.
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 mb-6">
              {steps.map((s, index) => (
                <ScrollReveal key={s.title} delay={index * 80}>
                  <div className="flex gap-3 items-start border border-black/10 rounded-sm p-5">
                    <div className="w-0.5 h-8 flex-shrink-0 mt-0.5" style={{ background: s.bar }} />
                    <div>
                      <p className="font-bold text-brand-ink text-base mb-1">{s.title}</p>
                      <p className="text-sm text-brand-ink/60 leading-relaxed">{s.body}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            <Link href="/how-it-works" className="font-mono text-xs text-brand-crimson underline underline-offset-2">
              See how it works in full →
            </Link>
          </div>
        </section>

        <TierProgression />

        <DualCTA heading="Ready to start?" />
      </main>
      <Footer />
    </>
  );
}
