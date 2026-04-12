"use client";

import { useState } from "react";

export default function FooterNewsletter() {
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
        body: JSON.stringify({ email, source: "footer-newsletter" }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-brand-cream/10 border border-brand-cream/20 rounded-sm p-4">
      <p className="text-sm text-white/60 leading-relaxed mb-3">
        CRO tips and teardowns — straight to your inbox.
      </p>
      {submitted ? (
        <p className="font-mono text-sm text-brand-gold">You&apos;re in.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <label htmlFor="footer-email" className="sr-only">
            Email address
          </label>
          <input
            id="footer-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full bg-white/10 border border-white/20 rounded-sm px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 min-h-[44px]"
          />
          {error && (
            <p className="font-mono text-xs text-brand-cream" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-magenta text-white font-bold text-sm py-2 rounded-sm hover:bg-brand-crimson transition-colors min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "…" : "Subscribe"}
          </button>
        </form>
      )}
    </div>
  );
}
