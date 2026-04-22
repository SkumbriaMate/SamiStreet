import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let anonClient: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;

export function getSupabaseAnon(): SupabaseClient {
  if (anonClient) return anonClient;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY (expected in backend/.env, loaded via next.config.mjs).');
  }
  anonClient = createClient(url, key);
  return anonClient;
}

/** Same as getSupabaseAnon when keys exist; otherwise null (no throw). */
export function tryGetSupabaseAnon(): SupabaseClient | null {
  try {
    return getSupabaseAnon();
  } catch {
    return null;
  }
}

/** Service-role client for admin routes; null if key missing. */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  if (!adminClient) {
    adminClient = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return adminClient;
}
