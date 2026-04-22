import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';

const TTL_MS = 7 * 24 * 60 * 60 * 1000;

/** In-repo pepper so the signing key is never equal to the raw password. */
const DERIVED_KEY_PEPPER = 'sami-bistro-admin-token-pepper-v1';

function resolvedUsername(): string {
  if (process.env.ADMIN_USERNAME === undefined) return 'admin';
  const t = process.env.ADMIN_USERNAME.trim();
  return t || 'admin';
}

function resolvedPassword(): string {
  if (process.env.ADMIN_PASSWORD === undefined) return 'admin';
  return process.env.ADMIN_PASSWORD;
}

/** Signing key for session tokens — derived from `ADMIN_USERNAME` + `ADMIN_PASSWORD` (never the raw password). */
export function getAdminSigningSecret(): string {
  const u = resolvedUsername();
  const p = resolvedPassword();
  return createHmac('sha256', DERIVED_KEY_PEPPER).update(`${u}\x00${p}`).digest('base64url');
}

export function adminDisplayName(): string {
  return resolvedUsername();
}

function timingSafeStringEq(a: string, b: string): boolean {
  const ba = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export function adminCredentialsOk(username: string, password: string): boolean {
  return timingSafeStringEq(username, resolvedUsername()) && timingSafeStringEq(password, resolvedPassword());
}

export function mintAdminSessionToken(): string {
  const secret = getAdminSigningSecret();
  const exp = Date.now() + TTL_MS;
  const payload = Buffer.from(JSON.stringify({ exp, v: 1 }), 'utf8').toString('base64url');
  const sig = createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifyAdminSessionToken(token: string): boolean {
  const secret = getAdminSigningSecret();
  const i = token.lastIndexOf('.');
  if (i <= 0) return false;
  const payload = token.slice(0, i);
  const sig = token.slice(i + 1);
  const expected = createHmac('sha256', secret).update(payload).digest('base64url');
  if (!timingSafeStringEq(sig, expected)) return false;
  try {
    const raw = Buffer.from(payload, 'base64url').toString('utf8');
    const body = JSON.parse(raw) as { exp?: number; v?: number };
    if (body.v !== 1 || typeof body.exp !== 'number') return false;
    if (body.exp < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

export function bearerToken(req: Request): string | null {
  const raw = req.headers.get('authorization');
  if (!raw?.startsWith('Bearer ')) return null;
  return raw.slice(7).trim();
}

/** Returns a NextResponse to return early, or null if the session is valid. */
export function requireAdminSession(req: Request): NextResponse | null {
  const token = bearerToken(req);
  if (!token || !verifyAdminSessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
