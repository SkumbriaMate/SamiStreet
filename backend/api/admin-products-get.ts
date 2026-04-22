import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/adminSession';
import { getSupabaseAdminOr503 } from './supabase-admin';

export async function handleAdminProductsGet(req: Request): Promise<Response> {
  const denied = requireAdminSession(req);
  if (denied) return denied;
  const admin = getSupabaseAdminOr503();
  if (!admin.ok) return admin.response;
  try {
    const { data, error } = await admin.client
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
