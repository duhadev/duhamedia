import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DualCTA from "@/components/sections/DualCTA";
import PageHero from "@/components/sections/PageHero";
import CaseStudiesComingSoon from "@/components/ui/CaseStudiesComingSoon";
import InsightsNewsletter from "@/components/sections/InsightsNewsletter";
import BlogPreviews from "@/components/sections/BlogPreviews";

export default function InsightsPage() {
  return (
    <>
      <Header activePage="Insights" />
      <main id="main-content">
        {/* Hero */}
        <PageHero
          label="Insights"
          heading="Practitioner-level CRO content. From people running tests every week."
          subhead="Not a blog of repackaged best practices. Teardowns of real Shopify stores, documented test results, and specific guidance for the decisions that actually move conversion rate."
        />

        {/* Teardowns section */}
        <section className="bg-brand-offwhite px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Teardowns</p>
                <h2 className="text-2xl font-bold text-brand-ink" style={{ letterSpacing: "-0.01em" }}>
                  CRO reviews of real Shopify stores.
                </h2>
              </div>
              <Link href="/insights/teardowns" className="font-mono text-xs text-brand-crimson underline underline-offset-2 flex-shrink-0 ml-6">
                Browse all →
              </Link>
            </div>
            <p className="text-sm text-brand-ink/55 leading-relaxed mb-8 max-w-xl">
              Specific findings. Specific hypotheses. Specific recommendations — not generic advice.
            </p>
            <CaseStudiesComingSoon
              heading="Teardowns in progress."
              description="Documented CRO reviews of real Shopify stores will be published here as they're completed. Enter your email to be notified when the first teardown goes live."
              confirmationText="We'll let you know when the first teardown is published."
              ariaLabel="Notify me when teardowns are published"
              id="insights-teardowns"
              source="notify-teardowns"
            />
          </div>
        </section>

        {/* Newsletter */}
        <InsightsNewsletter />

        {/* Blog section */}
        <section className="bg-white px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Blog</p>
                <h2 className="text-2xl font-bold text-brand-ink" style={{ letterSpacing: "-0.01em" }}>
                  CRO thinking, written plainly.
                </h2>
              </div>
              <Link href="/insights/blog" className="font-mono text-xs text-brand-crimson underline underline-offset-2 flex-shrink-0 ml-6">
                Browse all →
              </Link>
            </div>
            <p className="text-sm text-brand-ink/55 leading-relaxed mb-8 max-w-xl">
              Concepts, frameworks, and Shopify-specific guidance. Written for people running or commissioning optimisation work.
            </p>
            <BlogPreviews />
          </div>
        </section>

        <DualCTA heading="See where your site is losing revenue." />
      </main>
      <Footer />
    </>
  );
}
