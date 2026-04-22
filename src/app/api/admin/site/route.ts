import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/adminSession';
import { getSupabaseAdmin } from '@/lib/supabaseServer';

export async function PUT(req: Request) {
  const denied = requireAdminSession(req);
  if (denied) return denied;
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Server missing SUPABASE_SERVICE_ROLE_KEY for admin routes.' },
      { status: 503 },
    );
  }
  try {
    const body = (await req.json()) as { data?: unknown };
    if (body.data === undefined) return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    const { error } = await supabaseAdmin.from('site_settings').upsert({ id: 1, data: body.data });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Save failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
