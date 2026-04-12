"use client";

import { useState } from "react";

interface PDFLeadCaptureProps {
  tier: string;
  description: string;
}

export default function PDFLeadCapture({ tier, description }: PDFLeadCaptureProps) {
  const [email, setEmail] = useState("");
  const [url, setUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/pdf-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, url, tier }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="bg-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-5">
          Share internally
        </p>
        <div className="bg-black/5 border border-black/10 rounded-sm p-6">
          {/* PDF icon + title */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-8 h-10 bg-white border border-black/10 rounded-sm flex flex-col items-center justify-end pb-1.5 flex-shrink-0" aria-hidden="true">
              <div className="space-y-0.5 w-5">
                <div className="h-px bg-black/15 w-full" />
                <div className="h-px bg-black/15 w-3" />
                <div className="h-px bg-black/15 w-full" />
                <div className="h-px bg-black/15 w-3" />
              </div>
              <p className="font-mono font-bold text-brand-crimson mt-1" style={{ fontSize: "7px" }}>
                PDF
              </p>
            </div>
            <div>
              <p className="font-bold text-brand-ink text-base mb-1">{tier} — Full engagement brief</p>
              <p className="text-sm text-brand-ink/60 leading-relaxed">{description}</p>
            </div>
          </div>

          {submitted ? (
            <div className="bg-white border border-brand-crimson/20 rounded-sm px-5 py-4 text-center">
              <p className="font-bold text-brand-ink text-base mb-1">Check your inbox.</p>
              <p className="text-xs text-brand-ink/60">
                We&apos;ll follow up within 1 business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3" aria-label={`Download ${tier} brief`}>
              <div>
                <label htmlFor={`email-${tier}`} className="sr-only">Work email</label>
                <input
                  id={`email-${tier}`}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Work email"
                  className="w-full bg-white border border-black/10 rounded-sm px-4 py-2.5 font-mono text-xs text-brand-ink placeholder:text-brand-ink/30 focus:outline-none focus:border-brand-ink/40 min-h-[44px]"
                />
              </div>
              <div>
                <label htmlFor={`url-${tier}`} className="sr-only">Your website URL</label>
                <input
                  id={`url-${tier}`}
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Your website URL"
                  className="w-full bg-white border border-black/10 rounded-sm px-4 py-2.5 font-mono text-xs text-brand-ink placeholder:text-brand-ink/30 focus:outline-none focus:border-brand-ink/40 min-h-[44px]"
                />
              </div>
              {error && (
                <p className="font-mono text-xs text-brand-crimson" role="alert">{error}</p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-ink text-white font-bold text-sm py-2.5 rounded-sm hover:bg-brand-ink/90 transition-colors min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting…" : "Download the brief"}
              </button>
            </form>
          )}

          <p className="font-mono text-xs text-brand-ink/40 mt-3 leading-relaxed">
            We&apos;ll send the PDF to your inbox. Your URL helps us personalise any follow-up — no pitch, just context.
          </p>
        </div>
      </div>
    </section>
  );
}
