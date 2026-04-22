'use client';

import { useState } from 'react';

export default function InsightsNewsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'insights-newsletter' }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="bg-brand-ink px-6 py-14">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center gap-8">
          <div className="flex-1">
            <p className="font-mono text-xs text-white/30 uppercase tracking-widest mb-3">Insights newsletter</p>
            <p className="text-xl font-bold text-white leading-snug" style={{ letterSpacing: '-0.01em' }}>
              One teardown or CRO insight per month. No filler.
            </p>
          </div>
          {submitted ? (
            <div className="bg-white/10 border border-white/20 rounded-sm px-5 py-4 flex-1 max-w-sm">
              <p className="font-bold text-white text-sm mb-1">You&apos;re on the list.</p>
              <p className="font-mono text-xs text-white/50">We&apos;ll send the next insight your way.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1 flex-1 max-w-sm">
              <form onSubmit={handleSubmit} className="flex gap-2" aria-label="Subscribe to insights newsletter">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  aria-label="Email address"
                  className="flex-1 bg-white/10 border border-white/20 rounded-sm px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 min-h-[44px]"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-brand-magenta text-white font-bold text-xs px-4 py-3 rounded-sm hover:bg-brand-crimson transition-colors min-h-[44px] flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? '…' : 'Subscribe'}
                </button>
              </form>
              {error && (
                <p className="font-mono text-xs text-brand-cream" role="alert">{error}</p>
              )}
            </div>
          )}
        </div>
        <p className="font-mono text-xs text-white/25 mt-5">No filler. Unsubscribe any time.</p>
      </div>
    </section>
  );
}
