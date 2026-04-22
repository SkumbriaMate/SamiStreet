import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/adminSession';
import { getSupabaseAdminOr503 } from './supabase-admin';

const MAX_BYTES = 5 * 1024 * 1024;

export async function handleAdminStorageUploadPost(req: Request): Promise<Response> {
  const denied = requireAdminSession(req);
  if (denied) return denied;
  const admin = getSupabaseAdminOr503();
  if (!admin.ok) return admin.response;
  const supabaseAdmin = admin.client;
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
