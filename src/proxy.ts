import { type NextRequest, NextResponse } from 'next/server';

export async function proxy(req: NextRequest) {
  if (!process.env.NEON_AUTH_BASE_URL || !process.env.NEON_AUTH_COOKIE_SECRET) {
    // Env vars not configured — block protected routes
    return NextResponse.redirect(new URL('/auth/sign-in', req.url));
  }
  const { neonAuthMiddleware } = await import('@neondatabase/auth/next/server');
  return neonAuthMiddleware({ loginUrl: '/auth/sign-in' })(req);
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};
