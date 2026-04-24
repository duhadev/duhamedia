import Link from "next/link";

export default function CROBridge() {
  return (
    <section className="bg-brand-ink px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-white/35 uppercase tracking-widest mb-4">
          What is CRO?
        </p>
        <h2
          className="text-2xl md:text-3xl font-bold text-white leading-snug mb-5"
          style={{ letterSpacing: "-0.01em" }}
        >
          More traffic isn&apos;t the answer.
          <br />
          Making the traffic you have work harder is.
        </h2>
        <p className="text-base text-white/60 leading-relaxed mb-6">
          Conversion Rate Optimisation is the practice of systematically
          improving what happens after someone lands on your site. Not guessing,
          not redesigning because it looks outdated — testing specific changes
          against real user behaviour, measuring the outcome, and only shipping
          what works.
        </p>
        <p className="text-base text-white/60 leading-relaxed mb-8">
          For a Shopify brand doing $500K a year, lifting conversion from 2% to
          2.5% — a 25% relative improvement — is roughly $125,000 in additional
          annual revenue. From traffic you&apos;re already paying for.
        </p>
        <div className="flex items-start gap-4 border-t border-white/10 pt-6">
          <div>
            <p className="font-mono text-3xl font-bold text-brand-magenta">+25%</p>
          </div>
          <p className="text-xs text-white/50 leading-relaxed">
            Relative CVR lift on a $500K Shopify store ≈ $125K in additional
            annual revenue — from traffic you&apos;re already paying for.
          </p>
        </div>
        <Link
          href="/how-it-works"
          className="inline-block font-mono text-xs text-brand-gold underline underline-offset-2 mt-6"
        >
          See exactly how we do it →
        </Link>
      </div>
    </section>
  );
}
