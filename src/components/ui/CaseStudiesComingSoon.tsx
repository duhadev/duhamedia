"use client";

import { useState } from "react";

interface CaseStudiesComingSoonProps {
  /** "full" for standalone pages, "compact" for inline service page sections */
  variant?: "full" | "compact";
  heading?: string;
  description?: string;
  confirmationText?: string;
  ariaLabel?: string;
  /** Unique id suffix to avoid duplicate input ids on the same page */
  id?: string;
  /** Newsletter source key sent to /api/newsletter */
  source?: string;
}

export default function CaseStudiesComingSoon({
  variant = "full",
  heading = "Case studies in progress.",
  description = "Results from current engagements will be documented and published here once verified. Enter your email to be notified when the first case study goes live.",
  confirmationText = "We'll let you know when the first case study is published.",
  ariaLabel = "Notify me when case studies are published",
  id = "cs",
  source = "notify-case-studies",
}: CaseStudiesComingSoonProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (variant === "compact") {
    return (
      <div className="border border-dashed border-black/20 rounded-sm p-6">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-2">Coming soon</p>
        <p className="font-bold text-brand-ink text-base mb-1 leading-snug">{heading}</p>
        <p className="text-sm text-brand-ink/60 leading-relaxed mb-5">{description}</p>
        {submitted ? (
          <div className="bg-black/5 border border-black/10 rounded-sm px-4 py-3">
            <p className="font-mono text-xs text-brand-ink">
              You&apos;re on the list. {confirmationText}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <form onSubmit={handleSubmit} className="flex gap-2" aria-label={ariaLabel}>
              <div className="flex-1">
                <label htmlFor={`${id}-email-compact`} className="sr-only">Email address</label>
                <input
                  id={`${id}-email-compact`}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-full bg-white border border-black/10 rounded-sm px-4 py-2.5 font-mono text-xs text-brand-ink placeholder:text-brand-ink/30 focus:outline-none focus:border-brand-ink/40 min-h-[44px]"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-brand-ink text-white font-bold text-xs px-5 py-2.5 rounded-sm hover:bg-brand-ink/90 transition-colors min-h-[44px] whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "…" : "Notify me"}
              </button>
            </form>
            {error && <p className="font-mono text-xs text-brand-crimson" role="alert">{error}</p>}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="border border-dashed border-black/15 rounded-sm p-8 text-center">
      <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Coming soon</p>
      <h3 className="text-xl font-bold text-brand-ink mb-3" style={{ letterSpacing: "-0.01em" }}>
        {heading}
      </h3>
      <p className="text-sm text-brand-ink/60 leading-relaxed mb-6 max-w-md mx-auto">
        {description}
      </p>
      {submitted ? (
        <div className="bg-black/5 border border-black/10 rounded-sm px-5 py-4 max-w-sm mx-auto">
          <p className="font-bold text-brand-ink text-base mb-1">You&apos;re on the list.</p>
          <p className="font-mono text-xs text-brand-ink/60">{confirmationText}</p>
        </div>
      ) : (
        <div className="space-y-2 max-w-sm mx-auto">
          <form
            onSubmit={handleSubmit}
            className="flex gap-2"
            aria-label={ariaLabel}
          >
            <div className="flex-1">
              <label htmlFor={`${id}-email-full`} className="sr-only">Email address</label>
              <input
                id={`${id}-email-full`}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full bg-white border border-black/10 rounded-sm px-4 py-2.5 font-mono text-xs text-brand-ink placeholder:text-brand-ink/30 focus:outline-none focus:border-brand-ink/40 min-h-[44px]"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand-ink text-white font-bold text-xs px-5 py-2.5 rounded-sm hover:bg-brand-ink/90 transition-colors min-h-[44px] whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "…" : "Notify me"}
            </button>
          </form>
          {error && <p className="font-mono text-xs text-brand-crimson" role="alert">{error}</p>}
        </div>
      )}
    </div>
  );
}
