import { NextResponse } from 'next/server';
import { getRedirectsStore, saveRedirectsStore } from '../route';

function normalizePath(p: string): string {
  if (!p) return '';
  const trimmed = p.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const redirects = getRedirectsStore();
    const index = redirects.findIndex(r => r.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Redirect not found' }, { status: 404 });
    }

    const current = redirects[index];
    const source = body.sourcePath ? normalizePath(body.sourcePath) : current.sourcePath;
    const target = body.targetPath ? normalizePath(body.targetPath) : current.targetPath;

    if (source.toLowerCase() === target.toLowerCase()) {
      return NextResponse.json({ error: 'Source and Destination cannot be identical.' }, { status: 400 });
    }

    if (/^(javascript|data|vbscript):/i.test(target)) {
      return NextResponse.json({ error: 'Dangerous URL scheme rejected.' }, { status: 400 });
    }

    // Direct loop detection
    const reverse = redirects.find(
      r => r.id !== id && r.isActive && normalizePath(r.sourcePath).toLowerCase() === target.toLowerCase()
    );
    if (reverse && normalizePath(reverse.targetPath).toLowerCase() === source.toLowerCase()) {
      return NextResponse.json(
        { error: `Redirect loop detected: ${source} redirects to ${target}, but ${target} redirects back to ${source}.` },
        { status: 400 }
      );
    }

    redirects[index] = {
      ...current,
      sourcePath: source,
      targetPath: target,
      statusCode: body.statusCode ? Number(body.statusCode) : current.statusCode,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : current.isActive,
      notes: body.notes !== undefined ? (body.notes ? String(body.notes).trim() : null) : current.notes,
      updatedAt: new Date().toISOString(),
    };

    saveRedirectsStore(redirects);
    return NextResponse.json(redirects[index]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const redirects = getRedirectsStore();
    const updated = redirects.filter(r => r.id !== id);
    saveRedirectsStore(updated);
    return NextResponse.json({ success: true, deleted: id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
