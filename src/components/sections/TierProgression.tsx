import Link from "next/link";

const tiers = [
  {
    label: "Class C",
    name: "Foundation",
    meta: "One-time · ~3 months",
    accent: "brand-crimson" as const,
    watermark: "C",
    inclusion: null,
    description:
      "Builds the site right — with conversion architecture, analytics, and measurement infrastructure already in place. The platform everything else runs on.",
    includes: [
      "Conversion-informed UI design",
      "Engineered UX",
      "CMS + CRM integration",
      "Content creation",
      "Clarity + GA4 at launch",
    ],
    href: "/services/class-c",
    linkLabel: "Class C details",
    stackBars: ["brand-crimson", "dim", "dim"] as const,
  },
  {
    label: "Class B",
    name: "CRO Core",
    meta: "Setup + $1,500/mo retainer",
    accent: "brand-magenta" as const,
    watermark: "B",
    inclusion: { text: "Includes Class C", color: "brand-crimson" as const },
    description:
      "Continuous optimisation on the foundation already built. A/B testing, monthly reporting, and a live roadmap — no ramp-up needed.",
    includes: [
      "Full CRO audit",
      "A/B testing via Convert.com",
      "Landing page redesigns",
      "Monthly performance reports",
      "Full change log",
    ],
    href: "/services/class-b",
    linkLabel: "Class B details",
    stackBars: ["brand-crimson", "brand-magenta", "dim"] as const,
  },
  {
    label: "Class A",
    name: "Growth Intensive",
    meta: "Fixed 12-week + $3–5K/mo retainer",
    accent: "brand-gold" as const,
    watermark: "A",
    inclusion: { text: "Includes Class B", color: "brand-magenta" as const },
    description:
      "Connects the full growth system — paid channels, attribution, and CRO working together on a site already optimised to receive traffic.",
    includes: [
      "Full marketing audit",
      "Conversion funnel map",
      "Campaign playbook",
      "90-day strategic roadmap",
      "Full client dashboard handoff",
    ],
    href: "/services/class-a",
    linkLabel: "Class A details",
    stackBars: ["brand-crimson", "brand-magenta", "brand-gold"] as const,
  },
];

const connectors = [
  { label: ["builds", "into"] },
  { label: ["scales", "into"] },
];

const accentClasses = {
  "brand-crimson": {
    bar: "bg-brand-crimson",
    hoverBorder: "group-hover:border-brand-crimson/40",
    label: "text-brand-crimson",
    tick: "bg-brand-crimson/50",
    badge: "bg-brand-crimson/10 border-brand-crimson/20 text-brand-crimson",
    badgeDot: "bg-brand-crimson",
    watermark: "text-brand-crimson/[0.06]",
    link: "text-brand-crimson",
  },
  "brand-magenta": {
    bar: "bg-brand-magenta",
    hoverBorder: "group-hover:border-brand-magenta/40",
    label: "text-brand-magenta",
    tick: "bg-brand-magenta/50",
    badge: "bg-brand-magenta/10 border-brand-magenta/20 text-brand-magenta",
    badgeDot: "bg-brand-magenta",
    watermark: "text-brand-magenta/[0.06]",
    link: "text-brand-magenta",
  },
  "brand-gold": {
    bar: "bg-brand-gold",
    hoverBorder: "group-hover:border-brand-gold/40",
    label: "text-brand-gold",
    tick: "bg-brand-gold/50",
    badge: "bg-brand-gold/10 border-brand-gold/20 text-brand-gold",
    badgeDot: "bg-brand-gold",
    watermark: "text-brand-gold/[0.06]",
    link: "text-brand-gold",
  },
};

const stackBarClass = (bar: "brand-crimson" | "brand-magenta" | "brand-gold" | "dim") =>
  bar === "dim" ? "bg-white/10" : `bg-${bar}`;

interface TierProgressionProps {
  label?: string;
  heading?: string;
  description?: string;
}

export default function TierProgression({
  label = "How the tiers connect",
  heading = "\u201cThese aren\u2019t just options. They\u2019re a system.\u201d",
  description = "A client who starts at Class C and grows into Class B has a compounding advantage \u2014 the UX is already built for optimisation, and Clarity is already collecting data. No teardown. Just the next layer added on top.",
}: TierProgressionProps) {
  return (
    <section className="bg-brand-ink px-6 py-20">
      <div className="max-w-5xl mx-auto">

        <div className="mb-14 max-w-2xl">
          <p className="font-mono text-xs text-white/30 uppercase tracking-widest mb-4">{label}</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-4" style={{ letterSpacing: "-0.01em" }}>
            {heading}
          </h2>
          <p className="text-base text-white/50 leading-relaxed">{description}</p>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch">
          {tiers.map((tier, i) => {
            const ac = accentClasses[tier.accent];
            return (
              <>
                {/* Card */}
                <div key={tier.label} className="flex-1 min-w-0 group relative overflow-hidden">
                  <div className="absolute right-4 bottom-4 font-mono font-bold text-[96px] leading-none select-none pointer-events-none aria-hidden" aria-hidden="true" style={{ opacity: 1 }}>
                    <span className={`${ac.watermark}`}>{tier.watermark}</span>
                  </div>
                  <div className={`relative h-full flex flex-col bg-white/[0.03] border border-white/10 ${ac.hoverBorder} transition-colors duration-200 rounded-sm overflow-hidden`}>
                    <div className={`h-1 ${ac.bar} flex-shrink-0`} />
                    <div className="p-7 flex flex-col flex-1">

                      {/* Stack bars */}
                      <div className="flex gap-1.5 mb-7" aria-hidden="true">
                        {tier.stackBars.map((bar, bi) => (
                          <div key={bi} className={`h-1.5 w-10 rounded-sm ${stackBarClass(bar)}`} />
                        ))}
                      </div>

                      <p className={`font-mono text-xs tracking-widest ${ac.label} uppercase mb-1`}>{tier.label}</p>
                      <h3 className="text-xl font-bold text-white mb-1" style={{ letterSpacing: "-0.01em" }}>{tier.name}</h3>
                      <p className="font-mono text-xs text-white/25 mb-3">{tier.meta}</p>

                      {tier.inclusion && (
                        <div className={`inline-flex items-center gap-1.5 border rounded-sm px-2 py-1 mb-6 self-start ${accentClasses[tier.inclusion.color].badge}`}>
                          <div className={`w-1 h-1 rounded-sm ${accentClasses[tier.inclusion.color].badgeDot}`} aria-hidden="true" />
                          <span className="font-mono text-xs">{tier.inclusion.text}</span>
                        </div>
                      )}

                      {!tier.inclusion && <div className="mb-6" />}

                      <p className="text-sm text-white/50 leading-relaxed flex-1 mb-8">{tier.description}</p>

                      <div className="space-y-2.5 mb-8">
                        {tier.includes.map((f) => (
                          <div key={f} className="flex items-start gap-2.5">
                            <div className={`w-px h-4 rounded-sm ${ac.tick} mt-0.5 flex-shrink-0`} aria-hidden="true" />
                            <span className="text-xs text-white/45">{f}</span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-white/10 pt-5 mt-auto">
                        <Link href={tier.href} className={`font-mono text-xs ${ac.link} hover:text-white transition-colors inline-flex items-center gap-2`}>
                          {tier.linkLabel} <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connector */}
                {i < tiers.length - 1 && (
                  <div key={`connector-${i}`} className="flex lg:flex-col items-center justify-center py-6 lg:py-0 lg:px-3" aria-hidden="true">
                    <div className="w-8 h-px lg:w-px lg:h-8 bg-white/10" />
                    <div className="mx-3 lg:mx-0 lg:my-2 flex flex-col items-center gap-1">
                      <div className="w-9 h-9 rounded-sm bg-white/[0.04] border border-white/10 flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M7 2v10M2 7h10" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                      <p className="font-mono text-[9px] text-white/20 uppercase tracking-widest text-center leading-tight hidden lg:block">
                        {connectors[i].label[0]}<br />{connectors[i].label[1]}
                      </p>
                    </div>
                    <div className="w-8 h-px lg:w-px lg:h-8 bg-white/10" />
                  </div>
                )}
              </>
            );
          })}
        </div>

      </div>
    </section>
  );
}
