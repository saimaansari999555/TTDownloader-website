import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Known critical initial redirects fallback
const STATIC_REDIRECTS: Record<string, { target: string; status: number }> = {
  '/about': { target: '/about-us', status: 301 },
  '/contact': { target: '/contact-us', status: 301 },
  '/video': { target: '/', status: 301 },
  '/audio': { target: '/audio-extractor', status: 301 },
  '/bulk': { target: '/bulk-downloader', status: 301 },
  '/apk': { target: '/android-apk', status: 301 },
};

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const normalizedPath = pathname.toLowerCase();

  // Skip Next.js internal files, api routes, and static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 1. Check synchronous cookie-cached active redirects (0ms latency)
  try {
    const cookieVal = request.cookies.get('active_redirects')?.value;
    if (cookieVal) {
      const decoded = decodeURIComponent(cookieVal);
      const redirects: any[] = JSON.parse(decoded);
      if (Array.isArray(redirects)) {
        const match = redirects.find(
          (r) => r.isActive !== false && r.sourcePath?.toLowerCase() === normalizedPath
        );
        if (match && match.targetPath) {
          const targetUrl = match.targetPath.startsWith('http')
            ? match.targetPath
            : new URL(match.targetPath, request.url);
          return NextResponse.redirect(targetUrl, { status: Number(match.statusCode) || 301 });
        }
      }
    }
  } catch {
    // ignore cookie parse error
  }

  // 2. Static redirect rules (no async, no self-fetch — safe for Vercel Edge Runtime)
  const staticRule = STATIC_REDIRECTS[normalizedPath];
  if (staticRule) {
    const targetUrl = staticRule.target.startsWith('http')
      ? staticRule.target
      : new URL(staticRule.target, request.url);
    return NextResponse.redirect(targetUrl, { status: staticRule.status });
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
