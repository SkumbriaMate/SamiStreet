'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { MENU_ITEMS } from '../data/content';
import { defaultSiteSettings, mergeSiteSettings } from '../data/defaultSiteSettings';
import { mapProductDbToMenuItem, type ProductDb } from '../cms/mapDbProduct';
import { apiUrl } from '../lib/api';
import type { MenuItem } from '../types/menu';
import type { SiteSettings } from '../types/siteSettings';

type CmsContextValue = {
  site: SiteSettings;
  menuItems: MenuItem[];
  menuFilters: string[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  source: 'api' | 'static';
};

const CmsContext = createContext<CmsContextValue | null>(null);

function buildFiltersFromItems(items: MenuItem[], allLabel: string): string[] {
  const seen = new Set<string>();
  const types: string[] = [];
  for (const it of items) {
    const t = it.cat.trim();
    if (!t || seen.has(t)) continue;
    seen.add(t);
    types.push(t);
  }
  return [allLabel, ...types];
}

export function CmsProvider({ children }: { children: ReactNode }) {
  const [site, setSite] = useState<SiteSettings>(() => defaultSiteSettings());
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [menuFilters, setMenuFilters] = useState<string[]>(() =>
    buildFiltersFromItems(MENU_ITEMS, defaultSiteSettings().menuAllFilterLabel ?? 'ყველა'),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'api' | 'static'>('static');

  const reload = useCallback(async () => {
    const base = defaultSiteSettings();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl('/api/site'));
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || `CMS HTTP ${res.status}`);
      }
      const json = (await res.json()) as { siteData?: unknown; products?: ProductDb[] };
      const mergedSite = mergeSiteSettings(base, json.siteData ?? {});
      setSite(mergedSite);

      const rows = (json.products ?? []) as ProductDb[];
      if (rows.length) {
        const items = rows.map(mapProductDbToMenuItem);
        setMenuItems(items);
        setMenuFilters(buildFiltersFromItems(items, mergedSite.menuAllFilterLabel ?? base.menuAllFilterLabel!));
        setSource('api');
      } else {
        setMenuItems(MENU_ITEMS);
        const allLabel = mergedSite.menuAllFilterLabel ?? base.menuAllFilterLabel!;
        setMenuFilters(buildFiltersFromItems(MENU_ITEMS, allLabel));
        setSource('static');
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load site data';
      setError(msg);
      setSite(base);
      setMenuItems(MENU_ITEMS);
      const allLabel = base.menuAllFilterLabel ?? 'ყველა';
      setMenuFilters(buildFiltersFromItems(MENU_ITEMS, allLabel));
      setSource('static');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const value = useMemo(
    () => ({ site, menuItems, menuFilters, loading, error, reload, source }),
    [site, menuItems, menuFilters, loading, error, reload, source],
  );

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms(): CmsContextValue {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error('useCms must be used within CmsProvider');
  return ctx;
}
