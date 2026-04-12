import Link from "next/link";
import CaseStudiesComingSoon from "@/components/ui/CaseStudiesComingSoon";

const studies = [
  {
    metric: "+XX%",
    label: "CVR · Class B",
    tag: "Shopify · Apparel",
    desc: "Landing page redesign + checkout optimisation.",
    slug: "apparel-landing-page",
  },
  {
    metric: "−XX%",
    label: "Form abandon · Class B",
    tag: "Shopify · Supplements",
    desc: "Checkout flow and field reduction.",
    slug: "supplements-form",
  },
  {
    metric: "+XX%",
    label: "Mobile CVR · Class C",
    tag: "Shopify · Beauty",
    desc: "Full site foundation + Clarity install.",
    slug: "beauty-foundation",
  },
];

export default function CaseStudies() {
  return (
    <section className="bg-brand-offwhite px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-2">
              Results
            </p>
            <h2
              className="text-2xl font-bold text-brand-ink"
              style={{ letterSpacing: "-0.01em" }}
            >
              Every engagement documented.
            </h2>
          </div>
          <Link
            href="/results/case-studies"
            className="font-mono text-xs text-brand-crimson underline underline-offset-2 flex-shrink-0 ml-6"
          >
            View all →
          </Link>
        </div>
        {/* Case study cards — TODO: restore when live (studies array above has placeholder data) */}
        <CaseStudiesComingSoon />
      </div>
    </section>
  );
}
