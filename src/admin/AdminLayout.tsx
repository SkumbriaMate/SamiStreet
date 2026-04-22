'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch, apiReachable, clearSessionTokens } from '../lib/api';

type MeUser = { email?: string };

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<MeUser | null | undefined>(undefined);
  const [apiOk, setApiOk] = useState<boolean | null>(null);

  useEffect(() => {
    void (async () => {
      const ok = await apiReachable();
      setApiOk(ok);
      if (!ok) {
        setUser(null);
        return;
      }
      const token = sessionStorage.getItem('cms_access_token');
      if (!token) {
        setUser(null);
        return;
      }
      const res = await apiFetch('/api/auth/me');
      if (!res.ok) {
        clearSessionTokens();
        setUser(null);
        return;
      }
      const data = (await res.json()) as { user: MeUser };
      setUser(data.user);
    })();
  }, []);

  useEffect(() => {
    if (apiOk === null || user === undefined) return;
    if (!apiOk || !user) {
      router.replace('/admin/login');
    }
  }, [apiOk, user, router]);

  if (apiOk === null || user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a08] text-cream">
        <p className="text-sm text-muted">იტვირთება…</p>
      </div>
    );
  }

  if (!apiOk || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a08] text-cream">
        <p className="text-sm text-muted">იტვირთება…</p>
      </div>
    );
  }

  function signOut() {
    clearSessionTokens();
    router.replace('/admin/login');
  }

  return (
    <div className="min-h-screen min-w-0 bg-[#0a0a08] text-cream">
      <header className="border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
          <h1 className="font-playfair text-lg font-bold sm:text-xl">ადმინ პანელი</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm">
            <span className="max-w-[200px] truncate text-muted sm:max-w-xs" title={user.email}>
              {user.email}
            </span>
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center rounded-lg px-2 text-brand-green underline decoration-brand-green/50 underline-offset-2 hover:bg-white/5 sm:min-h-0 sm:py-1"
            >
              საიტი
            </Link>
            <button
              type="button"
              onClick={() => signOut()}
              className="min-h-[44px] rounded-lg px-2 text-muted underline decoration-white/30 underline-offset-2 hover:bg-white/5 hover:text-cream sm:min-h-0 sm:py-1"
            >
              გასვლა
            </button>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
