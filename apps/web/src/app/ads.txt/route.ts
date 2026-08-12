import { NextResponse } from 'next/server';
import { getSettingsStore } from '../api/settings/route';

export async function GET() {
  const store = getSettingsStore();
  const adsTxt = store['ads_txt_content'] || '';
  
  return new NextResponse(adsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
