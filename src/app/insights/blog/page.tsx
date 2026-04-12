import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DualCTA from "@/components/sections/DualCTA";
import NewsletterFloat from "@/components/ui/NewsletterFloat";
import CaseStudiesComingSoon from "@/components/ui/CaseStudiesComingSoon";
import PageHero from "@/components/sections/PageHero";

const ALL_POSTS = [
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
    desc: "Running tests on 200 sessions a week and calling results at 80% confidence is how bad decisions get made.",
    readTime: "8 min read",
  },
  {
    slug: "clarity-heatmaps-shopify",
    topic: "Shopify-specific",
    title: "How to read Microsoft Clarity heatmaps on a Shopify PDP",
    desc: "Session recordings and heatmaps tell different stories. Here's which to trust for which decisions.",
    readTime: "5 min read",
  },
  {
    slug: "ga4-shopify-events",
    topic: "Analytics",
    title: "The GA4 events every Shopify store should be tracking — and most aren't",
    desc: "Default Shopify GA4 integration misses the events that actually matter for CRO decisions.",
    readTime: "7 min read",
  },
  {
    slug: "mobile-conversion-gap",
    topic: "CRO basics",
    title: "Why mobile CVR is almost always lower — and what to do about it",
    desc: "Mobile traffic dominates Shopify stores. Mobile conversion rate usually doesn't follow. This is why.",
    readTime: "6 min read",
  },
  {
    slug: "case-study-commentary-form-abandonment",
    topic: "Case commentary",
    title: "What a 61% form abandonment rate looked like before we fixed it",
    desc: "Behind the data from one of our Class B engagements — the specific decisions that drove the result.",
    readTime: "9 min read",
  },
];

// TOPICS array for filter UI — restore with BlogList when posts are live
// const TOPICS = ["All topics", "CRO basics", "A/B testing", "Analytics", "Shopify-specific", "Case commentary"];

// TODO: restore BlogList when blog posts are live
// ALL_POSTS array above contains placeholder data ready to populate

export default function BlogPage() {
  return (
    <>
      <Header activePage="Insights" />
      <NewsletterFloat copy="CRO tips and teardowns straight to your inbox. One per month." />
      <main id="main-content">
        {/* Hero */}
        <PageHero
          label="Blog"
          heading="CRO thinking, written plainly."
          subhead="Concepts, frameworks, and Shopify-specific guidance. Written for people running or commissioning optimisation work."
        />

        <section className="bg-white px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <CaseStudiesComingSoon
              heading="Posts in progress."
              description="Articles on CRO, A/B testing, and Shopify-specific guidance will be published here. Enter your email to be notified when the first post goes live."
              confirmationText="We'll let you know when the first post is published."
              ariaLabel="Notify me when blog posts are published"
              id="blog"
            />
          </div>
        </section>

        <DualCTA heading="Ready to stop guessing and start optimising?" />
      </main>
      <Footer />
    </>
  );
}
