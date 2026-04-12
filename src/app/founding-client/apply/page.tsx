"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/sections/PageHero";

const revenueOptions = [
  { value: "", label: "Select a range" },
  { value: "under-300k", label: "Under $300K" },
  { value: "300k-750k", label: "$300K–$750K" },
  { value: "750k-2m", label: "$750K–$2M" },
  { value: "2m-5m", label: "$2M–$5M" },
  { value: "over-5m", label: "Over $5M" },
];

const sessionOptions = [
  { value: "", label: "Select a range" },
  { value: "under-500", label: "Under 500" },
  { value: "500-2000", label: "500–2,000" },
  { value: "2000-10000", label: "2,000–10,000" },
  { value: "10000-plus", label: "10,000+" },
];

const adsOptions = [
  { value: "facebook-instagram", label: "Yes — Facebook or Instagram" },
  { value: "google", label: "Yes — Google" },
  { value: "multiple", label: "Yes — multiple channels" },
  { value: "planning", label: "No — but planning to" },
  { value: "none", label: "No paid ads currently" },
];

const sidebarBullets = [
  "Full Class B engagement — no cost",
  "Clarity + GA4 + CRO audit + UX improvements + one A/B test",
  "In exchange for a case study, testimonial, and permission to document",
  "One spot only — goes to the best fit, not the first to apply",
  "12 weeks from kickoff to close",
];

export default function FoundingClientApplyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [adsValue, setAdsValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const data = {
      store: (form.elements.namedItem("store") as HTMLInputElement).value,
      revenue: (form.elements.namedItem("revenue") as HTMLSelectElement).value,
      sessions: (form.elements.namedItem("sessions") as HTMLSelectElement).value,
      ads: adsValue,
      problem: (form.elements.namedItem("problem") as HTMLTextAreaElement).value,
      other: (form.elements.namedItem("other") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/founding-client-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
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
          label="Founding client · Application"
          heading="Tell us about your store."
          subhead="Applications are reviewed as they come in. We're looking for the best fit — not the first to apply. Be specific. Vague answers make it harder to assess whether it's a match."
        />

        {/* Form + sidebar */}
        <section className="bg-white px-6 py-16">
          <div className="max-w-5xl mx-auto">
            {/* Sidebar — shown above form on mobile */}
            <div className="md:hidden mb-8">
              <SidebarCard />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-12 items-start">
              {/* Form column */}
              <div>
                {submitted ? (
                  <SuccessState />
                ) : (
                  <>
                    <p className="font-mono text-xs text-brand-ink/40 italic mb-8">
                      Six questions. Takes about 5 minutes. We read every application and respond to every one that
                      qualifies — even if the answer is not yet.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Field 01 — Store URL */}
                      <div>
                        <label
                          htmlFor="store"
                          className="block font-mono text-xs text-brand-ink/60 uppercase tracking-wide mb-2"
                        >
                          Your store
                        </label>
                        <input
                          id="store"
                          name="store"
                          type="text"
                          required
                          autoComplete="url"
                          placeholder="yourstore.com"
                          className="w-full bg-brand-offwhite border border-black/10 rounded-sm px-4 py-3 text-sm text-brand-ink placeholder:text-brand-ink/30 focus:outline-none focus:border-brand-ink/30 min-h-[44px]"
                        />
                        <p className="font-mono text-xs text-brand-ink/30 mt-1.5">
                          The URL we&apos;ll look at before we respond.
                        </p>
                      </div>

                      {/* Field 02 — Revenue */}
                      <div>
                        <label
                          htmlFor="revenue"
                          className="block font-mono text-xs text-brand-ink/60 uppercase tracking-wide mb-2"
                        >
                          Monthly revenue (approximate)
                        </label>
                        <select
                          id="revenue"
                          name="revenue"
                          required
                          defaultValue=""
                          className="w-full bg-brand-offwhite border border-black/10 rounded-sm px-4 py-3 text-sm text-brand-ink focus:outline-none focus:border-brand-ink/30 min-h-[44px] appearance-none"
                        >
                          {revenueOptions.map((o) => (
                            <option key={o.value} value={o.value} disabled={o.value === ""}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                        <p className="font-mono text-xs text-brand-ink/30 mt-1.5">
                          We work best with stores in the $300K–$5M range.
                        </p>
                      </div>

                      {/* Field 03 — Sessions */}
                      <div>
                        <label
                          htmlFor="sessions"
                          className="block font-mono text-xs text-brand-ink/60 uppercase tracking-wide mb-2"
                        >
                          Monthly sessions (approximate)
                        </label>
                        <select
                          id="sessions"
                          name="sessions"
                          required
                          defaultValue=""
                          className="w-full bg-brand-offwhite border border-black/10 rounded-sm px-4 py-3 text-sm text-brand-ink focus:outline-none focus:border-brand-ink/30 min-h-[44px] appearance-none"
                        >
                          {sessionOptions.map((o) => (
                            <option key={o.value} value={o.value} disabled={o.value === ""}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                        <p className="font-mono text-xs text-brand-ink/30 mt-1.5">
                          We need at least 500 monthly sessions for A/B testing to produce meaningful results.
                        </p>
                      </div>

                      {/* Field 04 — Paid ads (pill toggles) */}
                      <div>
                        <p className="font-mono text-xs text-brand-ink/60 uppercase tracking-wide mb-3">
                          Are you running paid ads?
                        </p>
                        <div
                          role="radiogroup"
                          aria-label="Are you running paid ads?"
                          className="flex flex-wrap gap-2"
                        >
                          {adsOptions.map((o) => (
                            <button
                              key={o.value}
                              type="button"
                              role="radio"
                              aria-checked={adsValue === o.value}
                              onClick={() => setAdsValue(o.value)}
                              className={`px-4 py-2 text-sm rounded-sm border transition-colors min-h-[44px] ${
                                adsValue === o.value
                                  ? "bg-brand-ink text-white border-brand-ink"
                                  : "bg-white border-black/15 text-brand-ink/60 hover:border-black/30 hover:text-brand-ink"
                              }`}
                            >
                              {o.label}
                            </button>
                          ))}
                        </div>
                        <p className="font-mono text-xs text-brand-ink/30 mt-1.5">
                          Paid traffic signals you&apos;re already investing in growth. It&apos;s not a hard
                          requirement.
                        </p>
                      </div>

                      {/* Field 05 — Conversion problem */}
                      <div>
                        <label
                          htmlFor="problem"
                          className="block font-mono text-xs text-brand-ink/60 uppercase tracking-wide mb-2"
                        >
                          What&apos;s the biggest conversion problem you&apos;re aware of?
                        </label>
                        <textarea
                          id="problem"
                          name="problem"
                          required
                          rows={5}
                          placeholder={`Be as specific as you can. "Traffic doesn't convert" is a start — but where does it drop off? What have you tried? What's your current CVR if you know it?`}
                          className="w-full bg-brand-offwhite border border-black/10 rounded-sm px-4 py-3 text-sm text-brand-ink placeholder:text-brand-ink/30 focus:outline-none focus:border-brand-ink/30 resize-none"
                          style={{ minHeight: "120px" }}
                        />
                        <p className="font-mono text-xs text-brand-ink/30 mt-1.5">
                          We&apos;re not looking for a polished answer. We&apos;re looking for a real problem.
                        </p>
                      </div>

                      {/* Field 06 — Anything else */}
                      <div>
                        <label
                          htmlFor="other"
                          className="block font-mono text-xs text-brand-ink/60 uppercase tracking-wide mb-2"
                        >
                          Anything else we should know?{" "}
                          <span className="text-brand-ink/30 normal-case">(optional)</span>
                        </label>
                        <textarea
                          id="other"
                          name="other"
                          rows={4}
                          placeholder="Optional — timing constraints, context about your business, why you think this is a fit."
                          className="w-full bg-brand-offwhite border border-black/10 rounded-sm px-4 py-3 text-sm text-brand-ink placeholder:text-brand-ink/30 focus:outline-none focus:border-brand-ink/30 resize-none"
                          style={{ minHeight: "80px" }}
                        />
                      </div>

                      {error && (
                        <p className="font-mono text-xs text-brand-crimson" role="alert">
                          {error}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-brand-ink text-white font-bold text-sm py-3 rounded-sm hover:bg-brand-ink/90 transition-colors min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Submitting…" : "Submit application"}
                      </button>

                      <p className="font-mono text-xs text-brand-ink/40 text-center leading-relaxed">
                        We respond to every qualifying application within 48 hours. If your store doesn&apos;t qualify
                        right now, we&apos;ll tell you what needs to be in place before it does.
                      </p>
                    </form>
                  </>
                )}
              </div>

              {/* Sidebar — sticky on desktop, hidden on mobile (shown above on mobile) */}
              <div className="hidden md:block sticky top-24">
                <SidebarCard />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function SidebarCard() {
  return (
    <div className="bg-brand-offwhite border border-black/10 rounded-sm p-6">
      <p className="font-bold text-brand-ink text-sm mb-4">What you&apos;re applying for</p>
      <ul className="space-y-2" aria-label="Programme summary">
        {sidebarBullets.map((b) => (
          <li key={b} className="flex gap-2 items-start">
            <span className="text-brand-crimson font-mono text-xs flex-shrink-0 mt-0.5" aria-hidden="true">
              →
            </span>
            <span className="font-mono text-xs text-brand-ink/60 leading-relaxed">{b}</span>
          </li>
        ))}
      </ul>
      <div className="border-t border-black/10 pt-4 mt-4">
        <p className="font-mono text-xs text-brand-ink/40 italic leading-relaxed">
          Already read the full programme details?{" "}
          <Link href="/founding-client" className="text-brand-crimson underline underline-offset-2 not-italic">
            ← Back to the founding client page
          </Link>
        </p>
      </div>
    </div>
  );
}

function SuccessState() {
  return (
    <div className="bg-brand-offwhite border border-black/10 rounded-sm p-8 text-center">
      <div className="w-10 h-10 rounded-full bg-white border border-black/10 flex items-center justify-center mx-auto mb-4">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M3 9l4 4 8-8" stroke="#c20e59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p className="font-bold text-brand-ink text-base mb-2">Application received.</p>
      <p className="text-base text-brand-ink/60 leading-relaxed">
        We&apos;ll review it and respond within 48 hours. If your store qualifies, you&apos;ll hear from us with next
        steps. If it doesn&apos;t, we&apos;ll tell you what needs to change first.
      </p>
    </div>
  );
}
