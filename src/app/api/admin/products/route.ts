import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/adminSession';
import { getSupabaseAdmin } from '@/lib/supabaseServer';

export async function GET(req: Request) {
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
    const { data, error } = await supabaseAdmin
      .from('products')
      .select(
        'id,product_type,name,description,image_url,emoji,tags,sort_order,is_active,product_sizes(id,label,price,sort_order)',
      )
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return NextResponse.json({ products: data ?? [] });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Load failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
