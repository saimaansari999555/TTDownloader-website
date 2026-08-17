import { NextResponse } from 'next/server';

let globalRedirects: any[] = [
  {
    id: 'redir-about-initial',
    sourcePath: '/about',
    targetPath: '/about-us',
    statusCode: 301,
    isActive: true,
    notes: 'Permanent 301 redirect for About Us page migration',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'redir-contact-initial',
    sourcePath: '/contact',
    targetPath: '/contact-us',
    statusCode: 301,
    isActive: true,
    notes: 'Permanent 301 redirect for Contact Us page migration',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function getRedirectsStore() {
  return globalRedirects;
}

export function saveRedirectsStore(redirects: any[]) {
  globalRedirects = redirects;
  return globalRedirects;
}

function normalizePath(p: string): string {
  if (!p) return '';
  const trimmed = p.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const activeOnly = searchParams.get('activeOnly') === 'true';

  if (activeOnly) {
    return NextResponse.json(globalRedirects.filter(r => r.isActive));
  }
  return NextResponse.json(globalRedirects);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const source = normalizePath(body.sourcePath);
    const target = normalizePath(body.targetPath);
    const statusCode = Number(body.statusCode) || 301;
    const isActive = body.isActive !== undefined ? Boolean(body.isActive) : true;
    const notes = body.notes ? String(body.notes).trim() : null;

    if (!source || !target) {
      return NextResponse.json({ error: 'Source URL and Destination URL are required.' }, { status: 400 });
    }

    if (source.toLowerCase() === target.toLowerCase()) {
      return NextResponse.json({ error: 'Source and Destination cannot be identical.' }, { status: 400 });
    }

    // Dangerous scheme rejection
    if (/^(javascript|data|vbscript):/i.test(target)) {
      return NextResponse.json({ error: 'Dangerous URL scheme rejected.' }, { status: 400 });
    }

    // Direct loop detection
    const reverse = globalRedirects.find(
      r => r.isActive && normalizePath(r.sourcePath).toLowerCase() === target.toLowerCase()
    );
    if (reverse && normalizePath(reverse.targetPath).toLowerCase() === source.toLowerCase()) {
      return NextResponse.json(
        { error: `Redirect loop detected: ${source} redirects to ${target}, but ${target} redirects back to ${source}.` },
        { status: 400 }
      );
    }

    const existingIndex = globalRedirects.findIndex(
      r => normalizePath(r.sourcePath).toLowerCase() === source.toLowerCase()
    );

    const newRedirect = {
      id: body.id || `redir-${Date.now()}`,
      sourcePath: source,
      targetPath: target,
      statusCode,
      isActive,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex !== -1) {
      globalRedirects[existingIndex] = {
        ...globalRedirects[existingIndex],
        ...newRedirect,
        id: globalRedirects[existingIndex].id,
      };
      return NextResponse.json(globalRedirects[existingIndex]);
    }

    globalRedirects = [newRedirect, ...globalRedirects];
    return NextResponse.json(newRedirect);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
