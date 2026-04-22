import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/adminSession';
import { getSupabaseAdmin } from '@/lib/supabaseServer';

type RouteCtx = { params: Promise<{ id: string }> };

export async function DELETE(req: Request, ctx: RouteCtx) {
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
    const { id } = await ctx.params;
    const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Delete failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
