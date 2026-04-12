"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/sections/PageHero";


const painPoints = [
  "You're running ads but the return isn't matching the spend",
  "You're ranking for keywords but visitors aren't buying",
  "Email campaigns drive traffic — not revenue",
  "Your bounce rate is high and you don't know which page to fix first",
];

export default function FifteenMinuteAuditPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const data = {
      storeUrl: (form.elements.namedItem("store-url") as HTMLInputElement).value,
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
    };

    try {
      const res = await fetch("/api/audit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or email us at hello@duhamedia.com.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Header />
      <main id="main-content">

        {/* Hero */}
        <PageHero
          label="Free offer"
          heading="15-Minute Shopify Conversion Leak Audit"
          headingColor="magenta"
          subhead="Submit your store URL. We'll review your highest-traffic landing page, identify the one or two conversion leaks costing you the most revenue, and specify one concrete fix to test first — delivered as a Loom walkthrough or PDF one-pager. No pitch. No pricing. No commitment."
        />

        {/* Who this is for + Form */}
        <section className="bg-white px-6 py-16">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

            {/* Left */}
            <div>
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">
                Who this is for
              </p>
              <h2
                className="text-2xl font-bold text-brand-ink mb-6 leading-snug"
                style={{ letterSpacing: "-0.01em" }}
              >
                You have traffic.
                <br />It&apos;s not converting.
              </h2>
              <p className="text-base text-brand-ink/60 leading-relaxed mb-6">
                If any of these sound familiar, this audit will tell you exactly
                what to fix first:
              </p>
              <div className="flex flex-col gap-3 mb-8">
                {painPoints.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <div
                      className="w-1.5 h-1.5 rounded-full bg-brand-magenta flex-shrink-0 mt-[7px]"
                      aria-hidden="true"
                    />
                    <p className="text-base text-brand-ink/70 leading-snug">{point}</p>
                  </div>
                ))}
              </div>

              {/* What happens after */}
              <div className="border-t border-black/10 pt-6">
                <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-4">
                  What happens next
                </p>
                <div className="flex flex-col divide-y divide-black/8">
                  {[
                    { step: "01", text: "We review your highest-traffic page using your site data." },
                    { step: "02", text: "You get the finding — a Loom or PDF — within 2 business days." },
                    { step: "03", text: "We send a link to book a short call to walk through the results together." },
                  ].map((s) => (
                    <div key={s.step} className="flex gap-4 py-3">
                      <p className="font-mono text-xs font-medium text-brand-crimson flex-shrink-0 w-5 mt-0.5">{s.step}</p>
                      <p className="text-sm text-brand-ink/65 leading-relaxed">{s.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Form */}
            <div className="md:sticky md:top-24">
              {submitted ? (
                <div className="bg-brand-offwhite border border-black/10 rounded-sm p-8">
                  <div className="w-10 h-10 rounded-full bg-white border border-black/10 flex items-center justify-center mb-5">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                      <path d="M3 9l4 4 8-8" stroke="#c20e59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="font-bold text-brand-ink text-lg mb-3" style={{ letterSpacing: "-0.01em" }}>
                    We&apos;ve got your submission.
                  </p>
                  <p className="text-base text-brand-ink/60 leading-relaxed mb-5">
                    Expect an email from{" "}
                    <span className="text-brand-ink font-medium">hello@duhamedia.com</span>{" "}
                    within the next few hours with your audit findings. We&apos;ll include a
                    link to schedule a short call to walk through the results together — no
                    obligation, just a chance to ask questions and discuss next steps if it
                    makes sense.
                  </p>
                  <p className="font-mono text-xs text-brand-ink/40 leading-relaxed">
                    Check your spam folder if you don&apos;t see it. Time investment for you: still zero.
                  </p>
                </div>
              ) : (
                <div className="bg-brand-offwhite border border-black/10 rounded-sm overflow-hidden">
                  {/* Form header bar */}
                  <div className="bg-brand-ink px-6 py-5">
                    <p className="font-bold text-white text-lg leading-snug" style={{ letterSpacing: "-0.01em" }}>
                      Claim your free audit
                    </p>
                    <p className="font-mono text-xs text-white/40 mt-1">
                      Four fields. A few hours. Zero commitment.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                      <label
                        htmlFor="store-url"
                        className="block font-mono text-xs text-brand-ink/60 uppercase tracking-wide mb-2"
                      >
                        Your Shopify store URL
                      </label>
                      <input
                        id="store-url"
                        name="store-url"
                        type="text"
                        required
                        autoComplete="url"
                        className="w-full bg-white border border-black/10 rounded-sm px-4 py-3 text-sm text-brand-ink placeholder:text-brand-ink/30 focus:outline-none focus:border-brand-ink/30 min-h-[44px]"
                        placeholder="yourstore.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="name"
                        className="block font-mono text-xs text-brand-ink/60 uppercase tracking-wide mb-2"
                      >
                        Your name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        className="w-full bg-white border border-black/10 rounded-sm px-4 py-3 text-sm text-brand-ink placeholder:text-brand-ink/30 focus:outline-none focus:border-brand-ink/30 min-h-[44px]"
                        placeholder="Jane Smith"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block font-mono text-xs text-brand-ink/60 uppercase tracking-wide mb-2"
                      >
                        Email address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        className="w-full bg-white border border-black/10 rounded-sm px-4 py-3 text-sm text-brand-ink placeholder:text-brand-ink/30 focus:outline-none focus:border-brand-ink/30 min-h-[44px]"
                        placeholder="jane@yourstore.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block font-mono text-xs text-brand-ink/60 uppercase tracking-wide mb-2"
                      >
                        Phone number{" "}
                        <span className="text-brand-ink/30 normal-case">(optional)</span>
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        className="w-full bg-white border border-black/10 rounded-sm px-4 py-3 text-sm text-brand-ink placeholder:text-brand-ink/30 focus:outline-none focus:border-brand-ink/30 min-h-[44px]"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    {error && (
                      <p className="font-mono text-xs text-brand-crimson" role="alert">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-brand-crimson text-white font-bold text-sm py-3 rounded-sm hover:bg-brand-magenta transition-colors min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Submitting…" : "Send my store URL"}
                    </button>

                    <p className="font-mono text-xs text-brand-ink/40 leading-relaxed text-center">
                      No pitch until you&apos;re ready for one.
                    </p>
                  </form>
                </div>
              )}
            </div>

          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
