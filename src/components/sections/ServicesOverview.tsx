import Link from "next/link";

const tiers = [
  {
    label: "Class A",
    name: "Growth Intensive",
    accent: "#f5c842",
    badge: null,
    tagline: "Connect your paid spend to what actually happens on-site.",
    who: "You're spending on paid ads but your campaigns aren't connected to conversion data. Your media buyer and your site operate in separate silos.",
    what: "A 12-week intensive covering a full marketing audit, UTM taxonomy rebuild, site CRO overhaul, and a campaign playbook your team can run independently. From week 13, a retainer runs and optimises the full system.",
    outcome: "Every ad dollar traceable to on-site behaviour. A documented system that works whether or not we're involved.",
    model: "12-week intensive + ongoing retainer",
    href: "/services/class-a",
  },
  {
    label: "Class B",
    name: "CRO Core",
    accent: "#e82561",
    badge: "Most common",
    tagline: "Continuous optimisation against a documented baseline.",
    who: "You have traffic — 500+ sessions per month — but conversion rate is flat or unknown. You want to know what's actually stopping people from buying.",
    what: "Monthly A/B testing via GrowthBook. Clarity data reviewed every cycle. A 90-day rolling roadmap updated each month. Every test documented before it runs, every result recorded when it closes.",
    outcome: "A compounding CVR improvement — measured against your baseline every single month.",
    model: "One-time setup + ongoing retainer",
    href: "/services/class-b",
  },
  {
    label: "Class C",
    name: "Foundation",
    accent: "#c20e59",
    badge: null,
    tagline: "Build the right foundation before you optimise.",
    who: "Your site doesn't reflect the quality of your product. No CMS, no analytics, no conversion architecture — just a site that exists.",
    what: "A full redesign built with CRO in mind from day one. Clarity and GA4 installed at launch so behavioural data starts collecting immediately. CMS and CRM connected so your team can operate independently after handoff.",
    outcome: "A conversion-ready site your team controls — and a data baseline ready for Class B.",
    model: "One-time project · ~3 months",
    href: "/services/class-c",
  },
];

export default function ServicesOverview() {
  return (
    <section className="bg-brand-offwhite px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Services</p>
            <h2 className="text-2xl font-bold text-brand-ink" style={{ letterSpacing: "-0.01em" }}>
              Three ways to work together.
            </h2>
          </div>
          <Link href="/services" className="font-mono text-xs text-brand-crimson underline underline-offset-2">
            Full comparison →
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {tiers.map((t) => (
            <div
              key={t.name}
              className="bg-white border border-black/10 rounded-sm overflow-hidden"
              style={{ borderLeftColor: t.accent, borderLeftWidth: "3px" }}
            >
              {/* Header */}
              <div className="px-6 pt-5 pb-4 border-b border-black/10 flex items-start justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-mono text-xs font-medium" style={{ color: t.accent }}>{t.label}</p>
                    {t.badge && (
                      <span className="font-mono text-xs px-1.5 py-0.5 rounded-sm text-white leading-none" style={{ background: t.accent }}>
                        {t.badge}
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-brand-ink text-lg leading-snug" style={{ letterSpacing: "-0.01em" }}>{t.name}</p>
                  <p className="text-sm text-brand-ink/50 mt-1 italic">{t.tagline}</p>
                </div>
                <p className="font-mono text-xs text-brand-ink/35 flex-shrink-0 text-right hidden md:block">{t.model}</p>
              </div>

              {/* Body */}
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black/10">
                <div className="px-6 py-4">
                  <p className="font-mono text-xs text-brand-ink/30 uppercase tracking-widest mb-2">Who it&apos;s for</p>
                  <p className="text-sm text-brand-ink/65 leading-relaxed">{t.who}</p>
                </div>
                <div className="px-6 py-4">
                  <p className="font-mono text-xs text-brand-ink/30 uppercase tracking-widest mb-2">What happens</p>
                  <p className="text-sm text-brand-ink/65 leading-relaxed">{t.what}</p>
                </div>
                <div className="px-6 py-4">
                  <p className="font-mono text-xs text-brand-ink/30 uppercase tracking-widest mb-2">The outcome</p>
                  <p className="text-sm text-brand-ink/65 leading-relaxed mb-4">{t.outcome}</p>
                  <Link href={t.href} className="font-mono text-xs text-brand-crimson underline underline-offset-2">
                    See full scope →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
