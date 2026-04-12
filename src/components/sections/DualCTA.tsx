import Link from "next/link";

interface DualCTAProps {
  heading: string;
}

export default function DualCTA({ heading }: DualCTAProps) {
  return (
    <section className="bg-brand-ink px-6 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <p className="font-mono text-xs text-white/30 uppercase tracking-widest mb-5">Ready to grow?</p>
        <h2
          className="text-2xl font-bold text-white mb-4 leading-snug"
          style={{ letterSpacing: "-0.01em" }}
        >
          {heading}
        </h2>
        <p className="text-base text-white/55 leading-relaxed mb-8 max-w-xl mx-auto">
          We&apos;ll look at your site, find where it&apos;s losing revenue, and tell you exactly what needs to change — before any engagement starts.
        </p>
        <div className="flex gap-4 flex-wrap items-center justify-center">
          <Link
            href="/free-audit"
            className="bg-brand-magenta text-white font-bold text-sm px-6 py-3 rounded-sm hover:bg-brand-crimson transition-colors min-h-[44px] flex items-center"
          >
            Show us your site. We&apos;ll find the leak.
          </Link>
          <Link
            href="/contact"
            className="border border-white/30 text-white text-sm px-6 py-3 rounded-sm hover:border-white/60 transition-colors min-h-[44px] flex items-center"
          >
            Book a call
          </Link>
        </div>
        <p className="font-mono text-xs text-white/25 mt-6">
          No pitch. No pricing. Just the finding.
        </p>
      </div>
    </section>
  );
}
