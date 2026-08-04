import { NextResponse } from 'next/server';

let globalPosts: any[] = [
  {
    id: 'sample-post-1',
    title: 'TikTok Video Downloader Without Watermark in HD Quality | Free & Fast',
    slug: 'tiktok-video-downloader-without-watermark-hd-quality',
    summary: 'Download TikTok videos without watermark in HD quality for free. Learn how it works, save videos safely, preserve quality, and discover the best features.',
    content: `A reliable TikTok video downloader without watermark in HD quality makes it easy to save your favorite TikTok videos for offline viewing while preserving the best available video quality.\n\nVisit Tik-TokDownloader.xyz in your web browser. Paste the copied TikTok URL into the download box. Click the Download button. Choose the available HD version and save it to your device. That's it! Your video will be ready to watch offline within seconds.\n\nWhy Choose Tik-TokDownloader.xyz?\nThere are many TikTok download tools online, but not all of them provide a smooth and secure experience. Tik-TokDownloader.xyz is designed to make downloading videos fast, simple, and convenient for users worldwide.`,
    status: 'PUBLISHED',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    author: { username: 'admin' },
    imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80',
    featuredImage: { url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80' }
  }
];

export async function GET() {
  return NextResponse.json(globalPosts);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const generatedSlug = body.slug || body.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `post-${Date.now()}`;
    
    const newPost = {
      id: body.id || `post-${Date.now()}`,
      title: body.title || 'Untitled Post',
      slug: generatedSlug,
      summary: body.summary || '',
      content: body.content || '',
      status: body.status || 'PUBLISHED',
      publishedAt: body.publishedAt || new Date().toISOString(),
      createdAt: body.createdAt || new Date().toISOString(),
      author: { username: 'admin' },
      imageUrl: body.imageUrl || body.featuredImage?.url || null,
      featuredImage: body.imageUrl ? { url: body.imageUrl } : (body.featuredImage || null)
    };

    globalPosts = [newPost, ...globalPosts.filter(p => p.slug !== generatedSlug && p.id !== newPost.id)];

    return NextResponse.json(newPost);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
