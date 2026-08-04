import { NextResponse } from 'next/server';

let globalMedia: any[] = [];

export async function GET() {
  return NextResponse.json(globalMedia);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newMedia = {
      id: `media-${Date.now()}`,
      originalName: body.name || 'image.png',
      filename: `img-${Date.now()}`,
      url: body.url,
      mimeType: 'image/jpeg',
      size: 0,
      createdAt: new Date().toISOString()
    };
    globalMedia = [newMedia, ...globalMedia.filter(m => m.url !== body.url)];
    return NextResponse.json(newMedia);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
