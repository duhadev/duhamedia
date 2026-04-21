export const dynamic = 'force-dynamic';

// Lazily imported so NEON_AUTH_BASE_URL is only validated at request time, not build time.
async function getRoutes() {
  const { authApiHandler } = await import('@neondatabase/auth/next/server');
  return authApiHandler();
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(req: Request, ctx: Ctx) {
  return (await getRoutes()).GET(req, ctx);
}

export async function POST(req: Request, ctx: Ctx) {
  return (await getRoutes()).POST(req, ctx);
}
