import { NextResponse } from 'next/server';
import { adminCredentialsOk, adminDisplayName, mintAdminSessionToken } from '@/lib/adminSession';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { username?: string; password?: string; email?: string };
    const username = String(body?.username ?? body?.email ?? '').trim();
    const password = String(body?.password ?? '');
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }
    if (!adminCredentialsOk(username, password)) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }
    return NextResponse.json({
      access_token: mintAdminSessionToken(),
      refresh_token: '',
      user: { email: adminDisplayName() },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Login failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
