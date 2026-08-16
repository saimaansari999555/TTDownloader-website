import { NextResponse } from 'next/server';
import { getPagesStore, savePagesStore } from '../route';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pages = getPagesStore();
  const decodedSlug = decodeURIComponent(slug).toLowerCase();
  let page = pages.find((p: any) => p.slug?.toLowerCase() === slug.toLowerCase() || p.slug?.toLowerCase() === decodedSlug || p.id === slug);

  if (!page && (decodedSlug === 'contact-us' || decodedSlug === 'contact')) {
    page = pages.find((p: any) => p.slug === 'contact-us' || p.slug === 'contact');
  }

  if (page) {
    return NextResponse.json(page);
  }
  return NextResponse.json({ error: 'Page not found' }, { status: 404 });
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const pages = getPagesStore();
    const decodedSlug = decodeURIComponent(slug).toLowerCase();

    let index = pages.findIndex((p: any) => p.id === slug || p.slug?.toLowerCase() === slug.toLowerCase() || p.slug?.toLowerCase() === decodedSlug);
    if (index === -1 && (decodedSlug === 'contact-us' || decodedSlug === 'contact')) {
      index = pages.findIndex((p: any) => p.slug === 'contact-us' || p.slug === 'contact');
    }
    if (index !== -1) {
      pages[index] = { ...pages[index], ...body, updatedAt: new Date().toISOString() };
      savePagesStore(pages);
      return NextResponse.json(pages[index]);
    }

    // If not found, add as new
    const newPage = {
      id: slug.startsWith('page-') ? slug : `page-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    pages.unshift(newPage);
    savePagesStore(pages);
    return NextResponse.json(newPage);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const pages = getPagesStore();
    const decodedSlug = decodeURIComponent(slug);
    const updated = pages.filter((p: any) => p.id !== slug && p.slug !== slug && p.slug !== decodedSlug);
    savePagesStore(updated);
    return NextResponse.json({ success: true, deleted: slug });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
