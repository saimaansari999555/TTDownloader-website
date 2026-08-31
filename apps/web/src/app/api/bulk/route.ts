import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

function extractUsername(input: string): string {
  let cleaned = input.trim();
  if (!cleaned) return '';

  // Extract from TikTok URL containing @username
  if (cleaned.includes('tiktok.com')) {
    const match = cleaned.match(/@([a-zA-Z0-9_.-]+)/);
    if (match && match[1]) {
      return match[1];
    }
  }

  // Strip leading @, query parameters, trailing slashes
  cleaned = cleaned.replace(/^@+/, '');
  cleaned = cleaned.split('?')[0].split('/')[0];

  // Avoid treating domain paths as usernames
  if (cleaned.includes('http') || cleaned.includes('.com') || cleaned.includes('/')) {
    return '';
  }

  return cleaned.trim();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawUsername = searchParams.get('username') || '';
  const cursor = searchParams.get('cursor') || '0';
  const count = searchParams.get('count') || '20';

  if (!rawUsername.trim()) {
    return NextResponse.json({ error: 'Username parameter is required' }, { status: 400 });
  }

  const trimmedInput = rawUsername.trim();

  // 1. Check if user pasted a TikTok Music / Sound link
  if (trimmedInput.includes('/music/') || trimmedInput.includes('/sound/')) {
    return NextResponse.json({
      error: 'This is a TikTok Music/Audio link (not a user profile). Please use our Audio Extractor tool to download MP3 sound tracks.',
      isMusicLink: true,
    }, { status: 400 });
  }

  let cleanUsername = extractUsername(trimmedInput);

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json',
    'Referer': 'https://tikwm.com/',
  };

  // 2. If user pasted a video URL without @username (e.g. vt.tiktok.com or /video/123), resolve author username first
  if (!cleanUsername && (trimmedInput.includes('tiktok.com') || trimmedInput.includes('vt.tiktok.com'))) {
    try {
      const videoRes = await fetch(`https://tikwm.com/api/?url=${encodeURIComponent(trimmedInput)}`, { headers });
      if (videoRes.ok) {
        const videoData = await videoRes.json();
        if (videoData && videoData.code === 0 && videoData.data?.author?.unique_id) {
          cleanUsername = videoData.data.author.unique_id;
        }
      }
    } catch {}
  }

  if (!cleanUsername) {
    return NextResponse.json({
      error: 'Could not detect a valid TikTok username from this link. Please enter a profile handle (e.g. @khaby.lame) or profile link.',
    }, { status: 400 });
  }

  try {
    // Attempt 1: Official user posts API
    const userPostsUrl = `https://tikwm.com/api/user/posts?unique_id=${encodeURIComponent(cleanUsername)}&count=${count}&cursor=${cursor}`;
    const res = await fetch(userPostsUrl, { headers, next: { revalidate: 0 } });

    if (res.ok) {
      const data = await res.json();
      if (data && data.code === 0 && data.data) {
        return NextResponse.json(data, {
          headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' },
        });
      }
    }

    // Attempt 2: Search feed fallback if user/posts returned code != 0
    const searchUrl = `https://tikwm.com/api/feed/search?keywords=${encodeURIComponent(cleanUsername)}&count=${count}&cursor=${cursor}`;
    const searchRes = await fetch(searchUrl, { headers, next: { revalidate: 0 } });

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      if (searchData && searchData.code === 0 && searchData.data) {
        const videos = searchData.data.videos || searchData.data || [];
        const firstVid = Array.isArray(videos) && videos.length > 0 ? videos[0] : null;

        const formatted = {
          code: 0,
          msg: 'success',
          data: {
            videos: Array.isArray(videos) ? videos : [],
            cursor: searchData.data.cursor || Number(cursor) + 20,
            hasMore: searchData.data.hasMore ?? false,
            userInfo: searchData.data.userInfo || (firstVid ? {
              user: {
                unique_id: firstVid.author?.unique_id || cleanUsername,
                nickname: firstVid.author?.nickname || cleanUsername,
                avatar: firstVid.author?.avatar || firstVid.cover,
              },
              stats: {
                videoCount: videos.length,
                followerCount: 0,
              }
            } : null),
          }
        };

        return NextResponse.json(formatted, {
          headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' },
        });
      }
    }

    return NextResponse.json(
      { error: `Could not fetch videos for profile @${cleanUsername}. Please verify the profile is public.` },
      { status: 404 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}
