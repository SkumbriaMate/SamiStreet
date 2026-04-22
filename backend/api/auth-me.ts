import { NextResponse } from 'next/server';
import { adminDisplayName, bearerToken, verifyAdminSessionToken } from '@/lib/adminSession';

export async function handleAuthMeGet(req: Request): Promise<Response> {
  const token = bearerToken(req);
  if (!token || !verifyAdminSessionToken(token)) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }
  return NextResponse.json({ user: { email: adminDisplayName() } });
}
