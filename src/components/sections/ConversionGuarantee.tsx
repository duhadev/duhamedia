const eligibilityItems = [
  "Minimum 10,000 monthly sessions to your store",
  "GA4, Clarity, and Shopify Analytics installed before the engagement starts",
  "Fixes approved within 7 business days of delivery each cycle",
  "Traffic remains within ±25% of the engagement-start baseline",
  "No client-side UX changes to pages in scope without coordination",
];

export default function ConversionGuarantee() {
  return (
    <section id="conversion-guarantee" className="bg-brand-offwhite px-6 py-16 scroll-mt-20">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Guarantee</p>
          <h2
            className="text-2xl font-bold text-brand-ink leading-snug"
            style={{ letterSpacing: "-0.01em" }}
          >
            We back the work.
          </h2>
          <p className="text-sm text-brand-ink/50 mt-2">
            Applies to Class B — CRO Core engagements.
          </p>
        </div>

        {/* Guarantee card */}
        <div className="bg-brand-ink rounded-sm px-8 py-7 mb-6">
          <p className="font-mono text-xs text-white/25 uppercase tracking-widest mb-4">
            The Duha Media Conversion Guarantee
          </p>
          <blockquote className="text-base md:text-lg text-white leading-relaxed font-medium">
            &ldquo;If your conversion rate does not measurably improve within 90
            days of the first deployed fix — measured against the 60-day baseline
            captured before that fix went live — we keep working at no additional
            cost for up to 90 more days, until it does. You will always be able to
            see exactly what we changed, what moved, and what did not. The answer
            is always in the data, not in our word.&rdquo;
          </blockquote>
        </div>

        {/* Eligibility */}
        <div>
          <p className="font-mono text-xs text-brand-ink/30 uppercase tracking-widest mb-4">
            Eligibility
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {eligibilityItems.map((item) => (
              <div
                key={item}
                className="bg-white border border-black/10 rounded-sm px-4 py-3 flex items-start gap-3"
              >
                {/* Dot */}
                <div
                  className="w-1.5 h-1.5 rounded-full bg-brand-magenta flex-shrink-0 mt-[5px]"
                  aria-hidden="true"
                />
                <p className="text-sm text-brand-ink/65 leading-snug">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why it works */}
        <p className="font-mono text-xs text-brand-ink/30 mt-6 leading-relaxed max-w-xl">
          The guarantee is credible because the methodology is documented. Every
          decision is logged, every test recorded, every result measured against
          baseline. An agency operating in a black box cannot offer this. We can.
        </p>

      </div>
    </section>
  );
}
