"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/sections/PageHero";

const reasons = [
  "Book a discovery call",
  "Free audit — show me where my site is leaking",
  "Ask about a specific service tier",
  "Other",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!reason) {
      setError("Please select a reason for reaching out.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      website: (form.elements.namedItem("website") as HTMLInputElement).value,
      reason,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
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
      <Header activePage="Contact" />
      <main id="main-content">
        {/* Hero */}
        <PageHero
          label="Get in touch"
          heading="Tell us about your site. We'll tell you where it's losing revenue."
          headingSize="sm"
          subhead="No pitch. No pricing call. Just an honest look at your site and a clear answer on whether we can help — and how."
        />

        {/* Form + What happens next */}
        <section className="bg-brand-offwhite px-6 py-16">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

            {/* Left — What happens next */}
            <div>
              <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">What happens next</p>
              <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: "-0.01em" }}>No surprises after you hit send.</h2>
              <div className="flex flex-col gap-0 divide-y divide-black/10 border border-black/10 rounded-sm overflow-hidden bg-white">
                {[
                  { step: "01", title: "We review your site", desc: "Before any call, we look at your site, run it through Clarity if it's installed, and form an honest view of where the leaks are." },
                  { step: "02", title: "You get a finding — not a pitch", desc: "If we can help, we'll say exactly how. If you're not a fit for CRO yet, we'll tell you that too and explain what would need to change first." },
                  { step: "03", title: "Discovery call — if it makes sense", desc: "30 minutes. Your questions, our questions, and a clear picture of whether there's an engagement worth starting." },
                ].map((s) => (
                  <div key={s.step} className="flex gap-5 p-5">
                    <p className="font-mono text-xs font-medium text-brand-crimson flex-shrink-0 mt-0.5 w-6">{s.step}</p>
                    <div>
                      <p className="font-bold text-brand-ink text-base mb-1.5">{s.title}</p>
                      <p className="text-base text-brand-ink/60 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Form */}
            <div>
              {submitted ? (
                <div className="bg-white border border-black/10 rounded-sm p-8 text-center">
                  <div className="w-10 h-10 rounded-full bg-brand-offwhite border border-black/10 flex items-center justify-center mx-auto mb-4">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                      <path d="M3 9l4 4 8-8" stroke="#c20e59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="font-bold text-brand-ink text-base mb-2">We&apos;ll be in touch shortly.</p>
                  <p className="text-base text-brand-ink/60 leading-relaxed">
                    Expect a response within one business day. If you requested a free audit, we&apos;ll send findings before any call is booked.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white border border-black/10 rounded-sm p-6 md:p-8 space-y-5">
                  <div>
                    <label htmlFor="name" className="block font-mono text-xs text-brand-ink/60 uppercase tracking-wide mb-2">
                      Full name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      className="w-full bg-brand-offwhite border border-black/10 rounded-sm px-4 py-3 text-sm text-brand-ink placeholder:text-brand-ink/30 focus:outline-none focus:border-brand-ink/30 min-h-[44px]"
                      placeholder="Jane Smith"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block font-mono text-xs text-brand-ink/60 uppercase tracking-wide mb-2">
                      Work email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="w-full bg-brand-offwhite border border-black/10 rounded-sm px-4 py-3 text-sm text-brand-ink placeholder:text-brand-ink/30 focus:outline-none focus:border-brand-ink/30 min-h-[44px]"
                      placeholder="jane@yourcompany.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="website" className="block font-mono text-xs text-brand-ink/60 uppercase tracking-wide mb-2">
                      Website URL
                    </label>
                    <input
                      id="website"
                      name="website"
                      type="text"
                      required
                      autoComplete="url"
                      className="w-full bg-brand-offwhite border border-black/10 rounded-sm px-4 py-3 text-sm text-brand-ink placeholder:text-brand-ink/30 focus:outline-none focus:border-brand-ink/30 min-h-[44px]"
                      placeholder="https://yourshop.com"
                    />
                  </div>

                  <div>
                    <p className="font-mono text-xs text-brand-ink/60 uppercase tracking-wide mb-3">What are you reaching out about?</p>
                    <div className="space-y-2">
                      {reasons.map((r) => (
                        <label key={r} className="flex items-center gap-3 cursor-pointer group min-h-[44px]">
                          <div
                            className={`w-4 h-4 rounded-sm border flex-shrink-0 flex items-center justify-center transition-colors ${
                              reason === r ? "bg-brand-crimson border-brand-crimson" : "bg-white border-black/20 group-hover:border-black/40"
                            }`}
                            aria-hidden="true"
                          >
                            {reason === r && (
                              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                          <input
                            type="radio"
                            name="reason"
                            value={r}
                            checked={reason === r}
                            onChange={() => setReason(r)}
                            className="sr-only"
                          />
                          <span className="text-sm text-brand-ink/70">{r}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block font-mono text-xs text-brand-ink/60 uppercase tracking-wide mb-2">
                      Anything else we should know? <span className="text-brand-ink/30 normal-case">(optional)</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="w-full bg-brand-offwhite border border-black/10 rounded-sm px-4 py-3 text-sm text-brand-ink placeholder:text-brand-ink/30 focus:outline-none focus:border-brand-ink/30 resize-none"
                      placeholder="Revenue range, current traffic, what's not working..."
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
                    {isSubmitting ? "Sending…" : "Send message"}
                  </button>

                  <p className="font-mono text-xs text-brand-ink/40 leading-relaxed text-center">
                    We respond within one business day. No pitch until you&apos;re ready for one.
                  </p>
                </form>
              )}
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
