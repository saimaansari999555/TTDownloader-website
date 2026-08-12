import { NextResponse } from 'next/server';
import { getSettingsStore, saveSettingsStore } from '../route';

export async function PUT(req: Request, { params }: { params: Promise<{ key: string }> }) {
  try {
    const { key } = await params;
    const body = await req.json();
    const store = getSettingsStore();
    store[key] = body.value !== undefined ? String(body.value) : '';
    saveSettingsStore(store);
    return NextResponse.json({ success: true, key, value: store[key] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
