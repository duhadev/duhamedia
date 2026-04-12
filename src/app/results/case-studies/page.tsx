import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DualCTA from "@/components/sections/DualCTA";
import CaseStudiesComingSoon from "@/components/ui/CaseStudiesComingSoon";
import PageHero from "@/components/sections/PageHero";

const ALL_STUDIES = [
  {
    slug: "apparel-landing-page",
    metric: "+XX%",
    metricLabel: "CVR lift",
    tier: "Class B",
    industry: "Apparel",
    revenueContext: "$800K revenue",
    named: false,
    title: "Landing page redesign + checkout optimisation",
    desc: "CTA repositioned above fold. Checkout form reduced from 9 fields to 5. A/B tested over 3,200 sessions.",
  },
  {
    slug: "supplements-form",
    metric: "−XX%",
    metricLabel: "Form abandonment",
    tier: "Class B",
    industry: "Supplements",
    revenueContext: null,
    named: true,
    title: "Form field reduction and progress indicator test",
    desc: "Clarity revealed 58% of users abandoned at the billing step. Form restructured and progress bar added.",
  },
  {
    slug: "beauty-foundation",
    metric: "+XX%",
    metricLabel: "Mobile CVR",
    tier: "Class C",
    industry: "Beauty",
    revenueContext: "$450K revenue",
    named: false,
    title: "Full site foundation — conversion-informed build",
    desc: "Site rebuilt with CRO architecture from day one. Clarity and GA4 installed at launch. Baseline established for future Class B.",
  },
  {
    slug: "outdoor-class-a",
    metric: "+XX%",
    metricLabel: "CVR · 90 days",
    tier: "Class A",
    industry: "Outdoor",
    revenueContext: "$1.4M revenue",
    named: false,
    title: "12-week intensive — full system build + campaign attribution",
    desc: "Marketing audit, UTM taxonomy rebuild, CRO overhaul, and campaign playbook. All channels connected to on-site CVR data.",
  },
];

// TODO: restore CaseStudiesList when case studies are live
// ALL_STUDIES array above contains placeholder data ready to populate
// TIERS and INDUSTRIES arrays define the filter options

export default function CaseStudiesPage() {
  return (
    <>
      <Header activePage="Results" />
      <main id="main-content">
        {/* Hero */}
        <PageHero
          label="Case studies"
          heading="Every engagement. Every result. Documented."
          subhead="Filtered by tier or industry. Each result tied to a specific test, a specific change, and a specific outcome."
        />

        <section className="bg-white px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <CaseStudiesComingSoon />
          </div>
        </section>
        <DualCTA heading="Your site could be next." />
      </main>
      <Footer />
    </>
  );
}
