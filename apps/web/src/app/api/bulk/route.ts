import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  const cursor = searchParams.get('cursor') || '0';
  const count = searchParams.get('count') || '20';

  if (!username) {
    return NextResponse.json({ error: 'username parameter is required' }, { status: 400 });
  }

  const cleanUsername = username.replace('@', '').trim();

  try {
    const apiUrl = `https://tikwm.com/api/user/posts?unique_id=${encodeURIComponent(cleanUsername)}&count=${count}&cursor=${cursor}`;
    const res = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Referer': 'https://tikwm.com/',
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Provider unavailable', code: res.status }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch user videos' }, { status: 500 });
  }
}
