import { NextResponse } from 'next/server';
import { savePagesStore } from '../../pages/route';
import { saveSettingsStore } from '../../settings/route';
import { savePostsStore } from '../../blog/posts/route';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    if (!payload || typeof payload !== 'object' || !payload.data) {
      return NextResponse.json({ error: 'Invalid backup file format.' }, { status: 400 });
    }

    const { pages, settings, posts } = payload.data;

    if (Array.isArray(pages)) {
      savePagesStore(pages);
    }
    if (Array.isArray(settings)) {
      const settingsMap: Record<string, string> = {};
      settings.forEach((s: any) => {
        if (s.key) settingsMap[s.key] = s.value !== undefined ? String(s.value) : '';
      });
      saveSettingsStore(settingsMap);
    }
    if (Array.isArray(posts)) {
      savePostsStore(posts);
    }

    return NextResponse.json({ message: 'Database backup restored successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to restore backup: ' + err.message }, { status: 500 });
  }
}
