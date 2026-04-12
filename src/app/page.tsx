import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import TrustSignals from "@/components/sections/TrustSignals";
import CROBridge from "@/components/sections/CROBridge";
import Methodology from "@/components/sections/Methodology";
import ServicesOverview from "@/components/sections/ServicesOverview";
import Results from "@/components/sections/Results";
import FinalCTA from "@/components/sections/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <TrustSignals />
        <CROBridge />
        <Methodology />
        <div className="bg-brand-ink px-6 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-mono text-xs text-white/30 uppercase tracking-widest mb-4">Core principle</p>
            <p className="text-xl md:text-2xl font-bold text-white leading-snug" style={{ letterSpacing: "-0.01em" }}>
              &ldquo;Every change has a rationale. Every test has a record. You always know what&apos;s happening and why.&rdquo;
            </p>
          </div>
        </div>
        <ServicesOverview />
        <Results />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
