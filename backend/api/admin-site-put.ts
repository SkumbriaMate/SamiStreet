import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/adminSession';
import { getSupabaseAdminOr503 } from './supabase-admin';

export async function handleAdminSitePut(req: Request): Promise<Response> {
  const denied = requireAdminSession(req);
  if (denied) return denied;
  const admin = getSupabaseAdminOr503();
  if (!admin.ok) return admin.response;
  try {
    const body = (await req.json()) as { data?: unknown };
    if (body.data === undefined) return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    const { error } = await admin.client.from('site_settings').upsert({ id: 1, data: body.data });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Save failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
