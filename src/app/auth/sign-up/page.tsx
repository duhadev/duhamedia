import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-brand-offwhite flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-2">
          Duha Media
        </p>
        <h1 className="text-2xl font-bold text-brand-ink mb-3" style={{ letterSpacing: '-0.02em' }}>
          Account setup
        </h1>
        <p className="text-sm text-brand-ink/55 mb-6">
          Client accounts are created by invitation. If you&apos;re the site owner,{' '}
          <Link href="/auth/sign-in" className="text-brand-magenta underline">
            sign in here
          </Link>{' '}
          with your owner email.
        </p>
        <Link
          href="/auth/sign-in"
          className="inline-block bg-brand-magenta text-white font-bold text-sm rounded-sm px-5 py-2.5 min-h-[44px] leading-none items-center justify-center"
        >
          Go to sign in
        </Link>
      </div>
    </div>
  );
}
