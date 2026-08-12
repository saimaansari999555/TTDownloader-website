import { NextResponse } from 'next/server';
import { getPagesStore } from '../../pages/route';
import { getSettingsStore } from '../../settings/route';
import { getPostsStore } from '../../blog/posts/route';

export async function GET() {
  const pages = getPagesStore();
  const settingsStore = getSettingsStore();
  const posts = getPostsStore();

  const settings = Object.entries(settingsStore).map(([key, value]) => ({ key, value }));

  return NextResponse.json({
    version: '1.0',
    timestamp: new Date().toISOString(),
    data: {
      pages,
      settings,
      posts,
      releases: [],
      contacts: [],
      media: [],
    },
  });
}
