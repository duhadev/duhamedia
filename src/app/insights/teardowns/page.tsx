import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DualCTA from "@/components/sections/DualCTA";
import NewsletterFloat from "@/components/ui/NewsletterFloat";
import CaseStudiesComingSoon from "@/components/ui/CaseStudiesComingSoon";
import PageHero from "@/components/sections/PageHero";

const ALL_TEARDOWNS = [
  {
    slug: "apparel-checkout-teardown",
    storeType: "Shopify · Apparel",
    revenueContext: "$800K–1.2M revenue",
    industry: "Apparel",
    topic: "Checkout",
    primaryFinding: "CTA placed below the fold on mobile — visible to 34% of visitors.",
    metric: "CVR",
  },
  {
    slug: "supplements-pdp-teardown",
    storeType: "Shopify · Supplements",
    revenueContext: "$500K–800K revenue",
    industry: "Supplements",
    topic: "Landing pages",
    primaryFinding: "Product page hero image displaced the primary CTA on all screen widths under 390px.",
    metric: "Mobile CVR",
  },
  {
    slug: "beauty-form-teardown",
    storeType: "Shopify · Beauty",
    revenueContext: "Sub-$500K revenue",
    industry: "Beauty",
    topic: "Forms",
    primaryFinding: "Nine-field checkout form with no progress indicator — 61% abandonment at billing step.",
    metric: "Form abandonment",
  },
  {
    slug: "outdoor-nav-teardown",
    storeType: "Shopify · Outdoor",
    revenueContext: "$1.2M–2M revenue",
    industry: "Outdoor",
    topic: "Navigation",
    primaryFinding: "Category structure buried product collections two levels deep — bounce rate on category pages at 74%.",
    metric: "Scroll depth",
  },
  {
    slug: "homegoods-mobile-teardown",
    storeType: "Shopify · Home & Garden",
    revenueContext: "$300K–500K revenue",
    industry: "Home & Garden",
    topic: "Mobile",
    primaryFinding: "Add-to-cart button required two taps on iOS Safari — first tap opened a variant selector that wasn't visible.",
    metric: "Mobile CVR",
  },
];

// INDUSTRIES and TOPICS arrays for filter UI — restore with TeardownsList when teardowns are live
// const INDUSTRIES = ["All industries", "Apparel", "Supplements", "Beauty", "Outdoor", "Home & Garden"];
// const TOPICS = ["All topics", "Checkout", "Landing pages", "Mobile", "Forms", "Navigation"];

// TODO: restore TeardownsList when teardowns are live
// ALL_TEARDOWNS array above contains placeholder data ready to populate

export default function TeardownsPage() {
  return (
    <>
      <Header activePage="Insights" />
      <NewsletterFloat copy="Get the next teardown in your inbox. One per month." />
      <main id="main-content">
        {/* Hero */}
        <PageHero
          label="Teardowns"
          heading="A documented CRO review of a real Shopify store."
          subhead="Specific findings. Specific hypotheses. Specific recommendations. No generics, no invented examples — every teardown is a real store with real traffic data."
        />

        <section className="bg-white px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <CaseStudiesComingSoon
              heading="Teardowns in progress."
              description="Documented CRO reviews of real Shopify stores will be published here as they're completed. Enter your email to be notified when the first teardown goes live."
              confirmationText="We'll let you know when the first teardown is published."
              ariaLabel="Notify me when teardowns are published"
              id="teardowns"
            />
          </div>
        </section>

        <DualCTA heading="Want us to tear down your store?" />
      </main>
      <Footer />
    </>
  );
}
