'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth/client';
import LogoMark from '@/components/ui/LogoMark';

const CODE_LENGTH = 6;

export default function EmailOtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [resent, setResent] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem('auth_email');
    if (!stored) {
      router.replace('/auth/sign-in');
      return;
    }
    setEmail(stored);
    inputRefs.current[0]?.focus();
  }, [router]);

  const verify = useCallback(
    async (code: string) => {
      setError('');
      setLoading(true);
      try {
        const { error: err } = await authClient.signIn.emailOtp({
          email,
          otp: code,
        });
        if (err) {
          setError('Incorrect code. Please try again.');
          setDigits(Array(CODE_LENGTH).fill(''));
          inputRefs.current[0]?.focus();
          return;
        }
        sessionStorage.removeItem('auth_email');
        router.push('/admin');
      } catch {
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [email, router],
  );

  function handleChange(index: number, value: string) {
    // Handle paste of full code
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, '').slice(0, CODE_LENGTH);
      const next = Array(CODE_LENGTH).fill('');
      pasted.split('').forEach((ch, i) => { next[i] = ch; });
      setDigits(next);
      const focusIdx = Math.min(pasted.length, CODE_LENGTH - 1);
      inputRefs.current[focusIdx]?.focus();
      if (pasted.length === CODE_LENGTH) verify(pasted);
      return;
    }

    const digit = value.replace(/\D/g, '');
    const next = [...digits];
    next[index] = digit;
    setDigits(next);

    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    const code = next.join('');
    if (code.length === CODE_LENGTH && next.every(d => d !== '')) {
      verify(code);
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = [...digits];
        next[index] = '';
        setDigits(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        const next = [...digits];
        next[index - 1] = '';
        setDigits(next);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  async function handleResend() {
    if (!email || resending) return;
    setResending(true);
    setError('');
    setResent(false);
    try {
      await authClient.emailOtp.sendVerificationOtp({ email, type: 'sign-in' });
      setDigits(Array(CODE_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
      setResent(true);
    } catch {
      setError('Failed to resend. Please try again.');
    } finally {
      setResending(false);
    }
  }

  const filled = digits.filter(d => d !== '').length;

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
            Check your email
          </h1>
          <p className="text-sm text-brand-ink/55 leading-relaxed">
            We sent a 6-digit code to{' '}
            <span className="text-brand-ink font-medium">{email || '…'}</span>
          </p>
        </div>

        {/* OTP boxes */}
        <div
          className="flex gap-2 mb-6"
          role="group"
          aria-label="One-time code"
        >
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]"
              maxLength={6}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              onFocus={e => e.target.select()}
              disabled={loading}
              aria-label={`Digit ${i + 1}`}
              className="w-11 h-12 text-center text-lg font-bold text-brand-ink bg-white border border-neutral-200 rounded-sm outline-none focus-visible:border-brand-ink transition-colors disabled:opacity-50 caret-transparent"
            />
          ))}
        </div>

        {error && (
          <p role="alert" className="mb-4 text-sm text-brand-magenta leading-snug">
            {error}
          </p>
        )}

        {resent && !error && (
          <p className="mb-4 text-sm text-brand-ink/55">
            Code resent — check your inbox.
          </p>
        )}

        {/* Verify button — shown when not auto-submitting */}
        <button
          type="button"
          onClick={() => verify(digits.join(''))}
          disabled={loading || filled < CODE_LENGTH}
          className="w-full h-11 bg-brand-magenta hover:bg-brand-crimson text-white text-sm font-bold rounded-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed mb-4"
        >
          {loading ? 'Verifying…' : 'Verify code'}
        </button>

        {/* Footer actions */}
        <div className="flex items-center justify-between text-xs text-brand-ink/40">
          <Link
            href="/auth/sign-in"
            className="hover:text-brand-ink transition-colors underline underline-offset-2"
          >
            Use a different email
          </Link>
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="hover:text-brand-ink transition-colors underline underline-offset-2 disabled:opacity-40"
          >
            {resending ? 'Sending…' : 'Resend code'}
          </button>
        </div>
      </div>
    </div>
  );
}
