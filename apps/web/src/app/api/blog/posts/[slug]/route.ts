import { NextResponse } from 'next/server';
import { getPostsStore, savePostsStore } from '../route';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = getPostsStore();
  const decodedSlug = decodeURIComponent(slug);
  const post = posts.find((p: any) => p.slug === slug || p.slug === decodedSlug || p.id === slug);

  if (post) {
    return NextResponse.json(post, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      },
    });
  }
  return NextResponse.json({ error: 'Post not found' }, { status: 404 });
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const posts = getPostsStore();
    const decodedSlug = decodeURIComponent(slug);

    const index = posts.findIndex((p: any) => p.id === slug || p.slug === slug || p.slug === decodedSlug);
    if (index !== -1) {
      posts[index] = { ...posts[index], ...body, updatedAt: new Date().toISOString() };
      savePostsStore(posts);
      return NextResponse.json(posts[index]);
    }

    // If not found, add as new
    const newPost = {
      id: slug.startsWith('post-') ? slug : `post-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    posts.unshift(newPost);
    savePostsStore(posts);
    return NextResponse.json(newPost);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const posts = getPostsStore();
    const decodedSlug = decodeURIComponent(slug);
    const updated = posts.filter((p: any) => p.id !== slug && p.slug !== slug && p.slug !== decodedSlug);
    savePostsStore(updated);
    return NextResponse.json({ success: true, deleted: slug });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
