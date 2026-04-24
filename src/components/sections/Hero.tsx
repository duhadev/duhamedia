import Link from "next/link";

function HeroGraphic() {
  return (
    <svg
      viewBox="0 0 440 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full h-full"
      preserveAspectRatio="xMaxYMid slice"
    >
      <defs>
        <pattern id="hero-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="white" fillOpacity="0.07" />
        </pattern>
      </defs>

      {/* Dot grid */}
      <rect width="440" height="400" fill="url(#hero-dots)" />

      {/* Concentric rings — top right anchor */}
      <circle cx="340" cy="130" r="170" stroke="white" strokeOpacity="0.03" strokeWidth="1" />
      <circle cx="340" cy="130" r="120" stroke="white" strokeOpacity="0.05" strokeWidth="1" />
      <circle cx="340" cy="130" r="72" stroke="white" strokeOpacity="0.07" strokeWidth="1" />
      <circle cx="340" cy="130" r="32" stroke="white" strokeOpacity="0.09" strokeWidth="1" />

      {/* Connection lines */}
      <line x1="56" y1="96" x2="210" y2="196" stroke="white" strokeOpacity="0.09" strokeWidth="1" />
      <line x1="210" y1="196" x2="370" y2="136" stroke="white" strokeOpacity="0.09" strokeWidth="1" />
      <line x1="210" y1="196" x2="136" y2="316" stroke="white" strokeOpacity="0.09" strokeWidth="1" />
      <line x1="210" y1="196" x2="358" y2="294" stroke="white" strokeOpacity="0.09" strokeWidth="1" />
      <line x1="56" y1="96" x2="136" y2="316" stroke="white" strokeOpacity="0.04" strokeWidth="1" />
      <line x1="370" y1="136" x2="358" y2="294" stroke="white" strokeOpacity="0.04" strokeWidth="1" />

      {/* Abstract funnel bars — left side */}
      <text x="40" y="116" fontFamily="monospace" fontSize="7" fill="white" fillOpacity="0.25" letterSpacing="1.5">FUNNEL</text>
      <rect x="40" y="124" width="108" height="5" rx="2.5" fill="white" fillOpacity="0.18" />
      <rect x="40" y="136" width="80" height="5" rx="2.5" fill="#c20e59" fillOpacity="0.75" />
      <rect x="40" y="148" width="52" height="5" rx="2.5" fill="#e82561" fillOpacity="0.75" />
      <rect x="40" y="160" width="28" height="5" rx="2.5" fill="#f5c842" fillOpacity="0.9" />

      {/* Central node */}
      <circle cx="210" cy="196" r="42" stroke="white" strokeOpacity="0.05" strokeWidth="1" />
      <circle cx="210" cy="196" r="26" stroke="white" strokeOpacity="0.1" strokeWidth="1" />
      <circle cx="210" cy="196" r="11" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" fill="none" />

      {/* Satellite nodes */}
      <circle cx="56" cy="96" r="6" fill="#c20e59" />
      <circle cx="370" cy="136" r="5" fill="#e82561" />
      <circle cx="136" cy="316" r="7" fill="#f5c842" />
      <circle cx="358" cy="294" r="4" fill="white" fillOpacity="0.35" />
      <circle cx="292" cy="72" r="3" fill="white" fillOpacity="0.22" />
      <circle cx="96" cy="232" r="2.5" fill="white" fillOpacity="0.18" />
      <circle cx="396" cy="244" r="3.5" fill="#c20e59" fillOpacity="0.45" />
      <circle cx="256" cy="348" r="2" fill="white" fillOpacity="0.14" />
      <circle cx="168" cy="56" r="2" fill="#f5c842" fillOpacity="0.4" />

      {/* Metric card — subtle, low contrast */}
      <rect x="286" y="238" width="130" height="70" rx="3" fill="white" fillOpacity="0.02" stroke="white" strokeOpacity="0.06" strokeWidth="1" />
      <text x="298" y="260" fontFamily="monospace" fontSize="7" fill="white" fillOpacity="0.15" letterSpacing="1">TEST #007</text>
      <text x="298" y="282" fontFamily="monospace" fontSize="20" fontWeight="700" fill="#e82561" fillOpacity="0.35">+14.2%</text>
      <text x="298" y="298" fontFamily="monospace" fontSize="7" fill="white" fillOpacity="0.1">CVR lift · 96% sig.</text>
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="relative bg-brand-ink px-6 py-20 md:py-28 overflow-hidden">
      {/* SVG — absolute, right side, behind text */}
      <div className="absolute inset-y-0 right-0 w-full md:w-1/2 pointer-events-none" style={{ zIndex: 0 }}>
        <HeroGraphic />
      </div>

      {/* Text */}
      <div className="relative max-w-5xl mx-auto" style={{ zIndex: 1 }}>
        <p className="font-mono text-xs text-white/35 uppercase tracking-widest mb-6">
          duhamedia.com
        </p>
        <h1
          className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6"
          style={{ letterSpacing: "-0.02em" }}
        >
          We engineer the foundation.
          <br />
          Then we prove it works.
        </h1>
        <p className="text-base text-white/55 leading-relaxed mb-8 max-w-lg">
          CRO and web design for Shopify brands that have traffic but
          aren&apos;t converting it.
        </p>
        <Link
          href="/free-audit"
          className="inline-flex items-center bg-brand-magenta text-white font-bold text-sm px-6 py-3 rounded-sm hover:bg-brand-crimson transition-colors mb-3 min-h-[44px]"
        >
          Show us your site. We&apos;ll find the leak.
        </Link>
        <p className="font-mono text-xs text-white/35">
          The 15-Minute Shopify Conversion Leak Audit — no pitch, no pricing, no commitment.
        </p>
      </div>
    </section>
  );
}
