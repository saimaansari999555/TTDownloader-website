import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Known critical initial redirects fallback
const STATIC_REDIRECTS: Record<string, { target: string; status: number }> = {
  '/about': { target: '/about-us', status: 301 },
  '/contact': { target: '/contact-us', status: 301 },
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip Next.js internal files, api routes, and static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 1. Fast static check
  const staticRule = STATIC_REDIRECTS[pathname.toLowerCase()];
  if (staticRule) {
    const targetUrl = staticRule.target.startsWith('http')
      ? staticRule.target
      : new URL(staticRule.target, request.url);
    return NextResponse.redirect(targetUrl, { status: staticRule.status });
  }

  // 2. Dynamic API check for admin-created redirects
  try {
    const origin = request.nextUrl.origin;
    const res = await fetch(`${origin}/api/redirects?activeOnly=true`, {
      next: { revalidate: 10 },
    });

    if (res.ok) {
      const redirects: any[] = await res.json();
      const match = redirects.find(
        (r) => r.isActive && r.sourcePath.toLowerCase() === pathname.toLowerCase()
      );

      if (match) {
        const targetUrl = match.targetPath.startsWith('http')
          ? match.targetPath
          : new URL(match.targetPath, request.url);
        return NextResponse.redirect(targetUrl, { status: Number(match.statusCode) || 301 });
      }
    }
  } catch (err) {
    // If internal fetch fails, silently proceed without blocking request
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions (.png, .jpg, .svg, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
