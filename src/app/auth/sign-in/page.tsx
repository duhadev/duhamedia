'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth/client';
import LogoMark from '@/components/ui/LogoMark';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: err } = await authClient.emailOtp.sendVerificationOtp({
        email: email.trim().toLowerCase(),
        type: 'sign-in',
      });
      if (err) {
        setError(err.message ?? 'Something went wrong. Please try again.');
        return;
      }
      sessionStorage.setItem('auth_email', email.trim().toLowerCase());
      router.push('/auth/email-otp');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-offwhite flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Link href="/" aria-label="Back to homepage">
            <LogoMark size={40} />
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">
            Duha Media Portal
          </p>
          <h1
            className="text-2xl font-bold text-brand-ink mb-2"
            style={{ letterSpacing: '-0.02em' }}
          >
            Sign in
          </h1>
          <p className="text-sm text-brand-ink/55 leading-relaxed">
            Enter your email and we&apos;ll send you a one-time code.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block font-mono text-xs font-medium text-brand-ink/50 uppercase tracking-widest mb-2"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-11 px-4 text-base text-brand-ink bg-white border border-neutral-200 rounded-sm outline-none focus-visible:border-brand-ink transition-colors placeholder:text-brand-ink/25"
            />
          </div>

          {error && (
            <p role="alert" className="mb-4 text-sm text-brand-magenta leading-snug">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full h-11 bg-brand-magenta hover:bg-brand-crimson text-white text-sm font-bold rounded-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending…' : 'Send code'}
          </button>
        </form>

        <p className="mt-10 text-center text-xs text-brand-ink/35">
          Don&apos;t have access?{' '}
          <Link href="/contact" className="text-brand-ink/50 underline underline-offset-2 hover:text-brand-ink transition-colors">
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
}
