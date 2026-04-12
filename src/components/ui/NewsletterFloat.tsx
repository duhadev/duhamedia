"use client";

import { useState } from "react";

interface Props {
  copy: string;
}

export default function NewsletterFloat({ copy }: Props) {
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
        body: JSON.stringify({ email, source: "newsletter-float" }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setError("Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="hidden lg:block fixed right-6 top-1/2 -translate-y-1/2 z-30 w-56">
      <div className="bg-brand-ink border border-white/10 rounded-sm p-5 shadow-lg">
        <p className="font-mono text-xs text-white/30 uppercase tracking-widest mb-3">Newsletter</p>
        {submitted ? (
          <p className="text-sm text-white/70 leading-snug">You&apos;re in. One issue per month.</p>
        ) : (
          <>
            <p className="text-sm font-bold text-white leading-snug mb-4" style={{ letterSpacing: "-0.01em" }}>
              {copy}
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                aria-label="Email address"
                className="w-full bg-white/10 border border-white/20 rounded-sm px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 min-h-[40px]"
              />
              {error && <p className="font-mono text-xs text-brand-cream" role="alert">{error}</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-magenta text-white font-bold text-xs py-2 rounded-sm hover:bg-brand-crimson transition-colors min-h-[40px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "…" : "Subscribe"}
              </button>
            </form>
            <p className="font-mono text-xs text-white/20 mt-3 leading-snug">No filler. Unsubscribe any time.</p>
          </>
        )}
      </div>
    </div>
  );
}
