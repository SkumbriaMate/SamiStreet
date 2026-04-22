'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch, apiReachable, setSessionTokens } from '../lib/api';

export function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [apiOk, setApiOk] = useState<boolean | null>(null);
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  useEffect(() => {
    void (async () => {
      const ok = await apiReachable();
      setApiOk(ok);
      if (!ok) return;
      const token = sessionStorage.getItem('cms_access_token');
      if (!token) {
        setHasSession(false);
        return;
      }
      const me = await apiFetch('/api/auth/me');
      setHasSession(me.ok);
    })();
  }, []);

  useEffect(() => {
    if (hasSession === true) {
      router.replace('/admin');
    }
  }, [hasSession, router]);

  if (apiOk === null || hasSession === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a08] text-cream">
        <p className="text-sm text-muted">იტვირთება…</p>
      </div>
    );
  }

  if (!apiOk) {
    return (
      <div className="min-h-screen bg-[#0a0a08] px-6 py-16 text-cream">
        <p className="max-w-md text-sm text-muted">
          API არ პასუხობს. გაუშვით <code className="text-brand-green">npm run dev</code> და დარწმუნდით რომ{' '}
          <code className="text-brand-green">backend/.env</code> შეიცავს Supabase URL და anon key (იხილეთ{' '}
          <code className="text-brand-green">backend/.env.example</code>).
        </p>
        <Link className="mt-6 inline-block text-brand-green underline" href="/">
          ← მთავარი
        </Link>
      </div>
    );
  }

  if (hasSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a08] text-cream">
        <p className="text-sm text-muted">იტვირთება…</p>
      </div>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: username.trim(), password }),
    });
    setBusy(false);
    if (!res.ok) {
      let msg = await res.text();
      try {
        const j = JSON.parse(msg) as { error?: string };
        if (j.error) msg = j.error;
      } catch {
        /* plain text */
      }
      setErr(msg || 'შესვლა ვერ მოხერხდა');
      return;
    }
    const data = (await res.json()) as { access_token: string; refresh_token: string };
    setSessionTokens(data.access_token, data.refresh_token);
    router.replace('/admin');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a08] px-6 text-cream">
      <div className="w-full max-w-sm rounded border border-white/10 bg-black/40 p-8">
        <h1 className="font-playfair text-2xl font-bold text-cream">ადმინის შესვლა</h1>
        <p className="mt-2 text-xs text-muted">
          ნაგულისხმევი: <code className="text-brand-green">admin</code> / <code className="text-brand-green">admin</code>.
          შეცვლა: <code className="text-brand-green">ADMIN_USERNAME</code> და{' '}
          <code className="text-brand-green">ADMIN_PASSWORD</code> მხოლოდ <code className="text-brand-green">backend/.env</code>-ში.
        </p>
        <form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit}>
          <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wider text-muted">
            მომხმარებლის სახელი
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(ev) => setUsername(ev.target.value)}
              className="rounded border border-white/15 bg-[#0c0c0a] px-3 py-2 text-sm text-cream outline-none focus:border-brand-green"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wider text-muted">
            პაროლი
            <input
              type="password"
              autoComplete="current-password"
              name="password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              className="rounded border border-white/15 bg-[#0c0c0a] px-3 py-2 text-sm text-cream outline-none focus:border-brand-green"
              required
            />
          </label>
          {err ? <p className="text-xs text-red-400">{err}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="rounded-[2px] bg-brand-orange py-3 text-sm font-semibold text-black disabled:opacity-50"
          >
            {busy ? '…' : 'შესვლა'}
          </button>
        </form>
        <Link className="mt-6 inline-block text-xs text-brand-green underline" href="/">
          ← საიტზე დაბრუნება
        </Link>
      </div>
    </div>
  );
}
