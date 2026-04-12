import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="bg-brand-ink px-6 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <p className="font-mono text-xs text-white/30 uppercase tracking-widest mb-4">Free offer</p>
        <h2
          className="text-2xl font-bold text-white mb-4 leading-snug"
          style={{ letterSpacing: "-0.01em" }}
        >
          15-Minute Shopify Conversion Leak Audit
        </h2>
        <p className="text-base text-white/55 leading-relaxed mb-8 max-w-md mx-auto">
          Submit your store URL. We&apos;ll review your highest-traffic landing page, identify
          the one or two conversion leaks costing you the most revenue, and specify
          one concrete fix to test first - delivered as a Loom walkthrough or a PDF
          one-pager. No pitch. No pricing. No commitment.
        </p>
        <div className="flex gap-3 items-center flex-wrap justify-center">
          <input
            type="text"
            placeholder="yourstore.com"
            aria-label="Your store URL"
            className="bg-white/10 border border-white/20 rounded-sm px-4 py-2.5 font-mono text-xs text-white/40 placeholder:text-white/30 min-w-52 focus:outline-none focus:border-white/40 h-[44px]"
          />
          <Link
            href="/15-minute-audit"
            className="bg-brand-magenta text-white font-bold text-xs px-5 py-2.5 rounded-sm hover:bg-brand-crimson transition-colors h-[44px] flex items-center whitespace-nowrap"
          >
            Claim your free audit
          </Link>
        </div>
        <p className="font-mono text-xs text-white/30 mt-3">
          Delivered within 2 business days. Time investment for you: zero.
        </p>
      </div>
    </section>
  );
}
