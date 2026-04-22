import { NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseAdmin } from '@/lib/supabaseServer';

export function getSupabaseAdminOr503():
  | { ok: true; client: SupabaseClient }
  | { ok: false; response: NextResponse } {
  const client = getSupabaseAdmin();
  if (!client) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Server missing SUPABASE_SERVICE_ROLE_KEY for admin routes.' },
        { status: 503 },
      ),
    };
  }
  return { ok: true, client };
}
