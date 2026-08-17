import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Known critical initial redirects fallback
const STATIC_REDIRECTS: Record<string, { target: string; status: number }> = {
  '/about': { target: '/about-us', status: 301 },
  '/contact': { target: '/contact-us', status: 301 },
};

export async function middleware(request: NextRequest) {
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
  } catch (e) {
    // ignore cookie parse error
  }

  // 2. Fast static fallback check
  const staticRule = STATIC_REDIRECTS[normalizedPath];
  if (staticRule) {
    const targetUrl = staticRule.target.startsWith('http')
      ? staticRule.target
      : new URL(staticRule.target, request.url);
    return NextResponse.redirect(targetUrl, { status: staticRule.status });
  }

  // 3. Dynamic API check for admin-created redirects with 500ms timeout
  try {
    const origin = request.nextUrl.origin;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 500);

    const res = await fetch(`${origin}/api/redirects?activeOnly=true`, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const redirects: any[] = await res.json();
      const match = redirects.find(
        (r) => r.isActive && r.sourcePath?.toLowerCase() === normalizedPath
      );

      if (match && match.targetPath) {
        const targetUrl = match.targetPath.startsWith('http')
          ? match.targetPath
          : new URL(match.targetPath, request.url);
        return NextResponse.redirect(targetUrl, { status: Number(match.statusCode) || 301 });
      }
    }
  } catch {
    // If internal fetch fails or aborts, proceed normally
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
