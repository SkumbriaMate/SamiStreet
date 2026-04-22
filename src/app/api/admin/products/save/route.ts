import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/adminSession';
import { getSupabaseAdmin } from '@/lib/supabaseServer';

export async function POST(req: Request) {
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
    const body = (await req.json()) as Record<string, unknown>;
    const id = body.id ? String(body.id) : null;
    const tags = Array.isArray(body.tags) ? body.tags : [];
    const sizes = Array.isArray(body.sizes) ? body.sizes : [];
    const payload = {
      product_type: String(body.product_type ?? '').trim(),
      name: String(body.name ?? '').trim(),
      description: String(body.description ?? ''),
      image_url: body.image_url ? String(body.image_url).trim() : null,
      emoji: String(body.emoji ?? '🍽️').trim() || '🍽️',
      tags,
      sort_order: Number.parseInt(String(body.sort_order ?? '0'), 10) || 0,
      is_active: Boolean(body.is_active),
    };
    if (!payload.product_type || !payload.name) {
      return NextResponse.json({ error: 'product_type and name are required' }, { status: 400 });
    }
    if (!sizes.length) return NextResponse.json({ error: 'At least one size required' }, { status: 400 });

    let productId = id;
    if (productId) {
      const { error: uErr } = await supabaseAdmin.from('products').update(payload).eq('id', productId);
      if (uErr) throw uErr;
      await supabaseAdmin.from('product_sizes').delete().eq('product_id', productId);
    } else {
      const { data: ins, error: iErr } = await supabaseAdmin.from('products').insert(payload).select('id').single();
      if (iErr || !ins?.id) throw iErr ?? new Error('Insert failed');
      productId = ins.id;
    }

    const sizeRows = sizes.map((s: { label?: string; price?: number }, i: number) => ({
      product_id: productId,
      label: String(s.label ?? '').trim(),
      price: Number(s.price),
      sort_order: i,
    }));
    const { error: sErr } = await supabaseAdmin.from('product_sizes').insert(sizeRows);
    if (sErr) throw sErr;
    return NextResponse.json({ id: productId });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Save failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
