/**
 * All Supabase access goes through Next Route Handlers — no DB keys in the client bundle.
 * Dev/prod: leave `NEXT_PUBLIC_API_URL` unset so requests stay same-origin (`/api/...` on this app).
 * If the site and API are split across origins, set `NEXT_PUBLIC_API_URL` to the API origin only (no `/api` suffix).
 */
function normalizeApiOrigin(raw: string | undefined): string {
  if (!raw?.trim()) return '';
  let o = raw.trim().replace(/\/+$/, '');
  if (o.endsWith('/api')) {
    o = o.slice(0, -4).replace(/\/+$/, '');
  }
  return o;
}

const apiOrigin = normalizeApiOrigin(
  typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_API_URL : undefined,
);

export function apiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${apiOrigin}${p}`;
}

function getToken(): string | null {
  if (typeof sessionStorage === 'undefined') return null;
  return sessionStorage.getItem('cms_access_token');
}

export function setSessionTokens(access: string, refresh: string) {
  sessionStorage.setItem('cms_access_token', access);
  sessionStorage.setItem('cms_refresh_token', refresh);
}

export function clearSessionTokens() {
  sessionStorage.removeItem('cms_access_token');
  sessionStorage.removeItem('cms_refresh_token');
}

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  const token = getToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  return fetch(apiUrl(path), { ...init, headers });
}

export async function apiReachable(): Promise<boolean> {
  try {
    const r = await fetch(apiUrl('/api/site'), { method: 'GET' });
    return r.ok;
  } catch {
    return false;
  }
}
