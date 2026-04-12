"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DualCTA from "@/components/sections/DualCTA";
import PageHero from "@/components/sections/PageHero";
import CaseStudiesComingSoon from "@/components/ui/CaseStudiesComingSoon";

const teardownPreviews = [
  {
    slug: "apparel-checkout-teardown",
    storeType: "Shopify · Apparel",
    revenueContext: "$800K–1.2M",
    topic: "Checkout",
    primaryFinding: "CTA placed below the fold on mobile — visible to 34% of visitors.",
    metric: "CVR",
  },
  {
    slug: "supplements-pdp-teardown",
    storeType: "Shopify · Supplements",
    revenueContext: "$500K–800K",
    topic: "Landing pages",
    primaryFinding: "Product page hero image displaced the primary CTA on all screen widths under 390px.",
    metric: "Mobile CVR",
  },
  {
    slug: "beauty-form-teardown",
    storeType: "Shopify · Beauty",
    revenueContext: "Sub-$500K",
    topic: "Forms",
    primaryFinding: "Nine-field checkout form with no progress indicator — 61% abandonment at billing step.",
    metric: "Form abandonment",
  },
];

const blogPreviews = [
  {
    slug: "what-is-cro",
    topic: "CRO basics",
    title: "What conversion rate optimisation actually is — and what it isn't",
    desc: "Most CRO advice is recycled best practices. Here's what the discipline actually demands.",
    readTime: "6 min read",
  },
  {
    slug: "ab-testing-significance",
    topic: "A/B testing",
    title: "Statistical significance without enough traffic is noise, not signal",
    desc: "Running tests on 200 sessions a week and calling results at 80% significance is how bad decisions get made.",
    readTime: "8 min read",
  },
  {
    slug: "clarity-heatmaps-shopify",
    topic: "Shopify-specific",
    title: "How to read Microsoft Clarity heatmaps on a Shopify PDP",
    desc: "Session recordings and heatmaps tell different stories. Here's which to trust for which decisions.",
    readTime: "5 min read",
  },
];

// TODO: restore teardownPreviews and blogPreviews grid rendering when content is live

export default function InsightsPage() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterError, setNewsletterError] = useState<string | null>(null);

  async function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNewsletterSubmitting(true);
    setNewsletterError(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail, source: "insights-newsletter" }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setNewsletterSubmitted(true);
    } catch {
      setNewsletterError("Something went wrong. Please try again.");
    } finally {
      setNewsletterSubmitting(false);
    }
  }

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
            {/* Teardown cards — TODO: restore when teardowns are live (teardownPreviews array above has placeholder data) */}
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

        {/* Newsletter — full-width block */}
        <section className="bg-brand-ink px-6 py-14">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex-1">
                <p className="font-mono text-xs text-white/30 uppercase tracking-widest mb-3">Insights newsletter</p>
                <p className="text-xl font-bold text-white leading-snug" style={{ letterSpacing: "-0.01em" }}>
                  One teardown or CRO insight per month. No filler.
                </p>
              </div>
              {newsletterSubmitted ? (
                <div className="bg-white/10 border border-white/20 rounded-sm px-5 py-4 flex-1 max-w-sm">
                  <p className="font-bold text-white text-sm mb-1">You&apos;re on the list.</p>
                  <p className="font-mono text-xs text-white/50">We&apos;ll send the next insight your way.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-1 flex-1 max-w-sm">
                  <form
                    onSubmit={handleNewsletterSubmit}
                    className="flex gap-2"
                    aria-label="Subscribe to insights newsletter"
                  >
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="your@email.com"
                      aria-label="Email address"
                      className="flex-1 bg-white/10 border border-white/20 rounded-sm px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 min-h-[44px]"
                    />
                    <button
                      type="submit"
                      disabled={newsletterSubmitting}
                      className="bg-brand-magenta text-white font-bold text-xs px-4 py-3 rounded-sm hover:bg-brand-crimson transition-colors min-h-[44px] flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {newsletterSubmitting ? "…" : "Subscribe"}
                    </button>
                  </form>
                  {newsletterError && (
                    <p className="font-mono text-xs text-brand-cream" role="alert">{newsletterError}</p>
                  )}
                </div>
              )}
            </div>
            <p className="font-mono text-xs text-white/25 mt-5">No filler. Unsubscribe any time.</p>
          </div>
        </section>

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
            {/* Blog cards — TODO: restore when posts are live (blogPreviews array above has placeholder data) */}
            <CaseStudiesComingSoon
              heading="Posts in progress."
              description="Articles on CRO, A/B testing, and Shopify-specific guidance will be published here. Enter your email to be notified when the first post goes live."
              confirmationText="We'll let you know when the first post is published."
              ariaLabel="Notify me when blog posts are published"
              id="insights-blog"
              source="notify-blog"
            />
          </div>
        </section>

        <DualCTA heading="See where your site is losing revenue." />
      </main>
      <Footer />
    </>
  );
}
