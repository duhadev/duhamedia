import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content">
        <section className="bg-brand-ink px-6 py-24 min-h-[60vh] flex items-center">
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-xs text-white/35 uppercase tracking-widest mb-4">404</p>
            <h1
              className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5"
              style={{ letterSpacing: "-0.02em" }}
            >
              This page doesn&apos;t exist.
            </h1>
            <p className="text-base text-white/55 leading-relaxed max-w-xl mb-10">
              The page you&apos;re looking for has moved, been removed, or never existed. Check the URL or head back to find what you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/"
                className="bg-brand-magenta text-white font-bold text-sm px-5 py-3 rounded-sm hover:bg-brand-crimson transition-colors min-h-[44px] flex items-center justify-center"
              >
                Go to homepage
              </Link>
              <Link
                href="/contact"
                className="border border-white/30 text-white text-sm font-medium px-5 py-3 rounded-sm hover:border-white/60 transition-colors min-h-[44px] flex items-center justify-center"
              >
                Contact us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
