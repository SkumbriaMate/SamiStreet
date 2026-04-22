import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/adminSession';
import { getSupabaseAdmin } from '@/lib/supabaseServer';

const MAX_BYTES = 5 * 1024 * 1024;

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
    const form = await req.formData();
    const storagePathRaw = form.get('path');
    const file = form.get('file');
    const storagePath =
      typeof storagePathRaw === 'string' ? storagePathRaw.replace(/^\/+/, '') : '';
    if (!storagePath || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'path and file are required' }, { status: 400 });
    }
    const buf = Buffer.from(await file.arrayBuffer());
    if (buf.length > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }
    const contentType = file.type || undefined;
    const { error } = await supabaseAdmin.storage
      .from('website-images')
      .upload(storagePath, buf, { contentType, upsert: true });
    if (error) throw error;
    const { data } = supabaseAdmin.storage.from('website-images').getPublicUrl(storagePath);
    return NextResponse.json({ publicUrl: data.publicUrl });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Upload failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
