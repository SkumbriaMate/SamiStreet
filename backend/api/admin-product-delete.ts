import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/adminSession';
import { getSupabaseAdminOr503 } from './supabase-admin';

export async function handleAdminProductDelete(req: Request, productId: string): Promise<Response> {
  const denied = requireAdminSession(req);
  if (denied) return denied;
  const admin = getSupabaseAdminOr503();
  if (!admin.ok) return admin.response;
  try {
    const { error } = await admin.client.from('products').delete().eq('id', productId);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Delete failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
