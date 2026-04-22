'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { FILTERS } from '../data/content';
import { mapProductDbToMenuItem, type ProductDb, type ProductSizeDb } from '../cms/mapDbProduct';
import { apiFetch } from '../lib/api';
import { productImagePath } from '../lib/storage';
import { AdminImageUpload } from './AdminImageUpload';

const PRODUCT_CATEGORIES = FILTERS.filter((f) => f !== 'ყველა') as string[];

type SizeDraft = { label: string; price: string };

function emptyProductDraft() {
  return {
    id: '' as string,
    product_type: '',
    name: '',
    description: '',
    image_url: '',
    emoji: '🍽️',
    tags: '',
    sort_order: '0',
    is_active: true,
    sizes: [{ label: 'S', price: '0' }] as SizeDraft[],
  };
}

type ProductDraft = ReturnType<typeof emptyProductDraft>;

function dbRowToDraft(row: ProductDb): ProductDraft {
  const sizes = [...(row.product_sizes ?? [])].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  ) as ProductSizeDb[];
  return {
    id: row.id,
    product_type: row.product_type,
    name: row.name,
    description: row.description ?? '',
    image_url: row.image_url ?? '',
    emoji: row.emoji ?? '🍽️',
    tags: (row.tags ?? []).join(', '),
    sort_order: String(row.sort_order ?? 0),
    is_active: row.is_active !== false,
    sizes: sizes.length
      ? sizes.map((s) => ({
          label: s.label ?? '',
          price: String(typeof s.price === 'string' ? s.price : s.price),
        }))
      : [{ label: '', price: '0' }],
  };
}

const inputClass =
  'mt-1 w-full min-h-[44px] rounded-lg border border-white/15 bg-[#0c0c0a] px-3 py-2.5 text-sm text-cream outline-none transition-colors focus:border-brand-green focus:ring-1 focus:ring-brand-green/30';
const labelClass = 'flex flex-col text-[11px] font-semibold uppercase tracking-wider text-muted';
const panelSurface = 'rounded-xl border border-white/10 bg-black/25 shadow-sm shadow-black/20';
const selectClass = `${inputClass} appearance-none bg-[length:1rem_1rem] bg-[right_0.65rem_center] bg-no-repeat pr-10`;

function sortProducts(list: ProductDb[]): ProductDb[] {
  const rank = (t: string) => {
    const i = PRODUCT_CATEGORIES.indexOf(t);
    return i === -1 ? 999 : i;
  };
  return [...list].sort((a, b) => {
    const c = rank(a.product_type) - rank(b.product_type);
    if (c !== 0) return c;
    const s = (a.sort_order ?? 0) - (b.sort_order ?? 0);
    if (s !== 0) return s;
    return a.name.localeCompare(b.name, 'ka');
  });
}

function useWideLayout() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const apply = () => setWide(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  return wide;
}

type Props = { pushToast: (kind: 'ok' | 'err', message: string) => void };

export function AdminProductsPanel({ pushToast }: Props) {
  const isWide = useWideLayout();

  const [products, setProducts] = useState<ProductDb[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [draft, setDraft] = useState<ProductDraft>(() => emptyProductDraft());
  const [editing, setEditing] = useState(false);
  const [productSaving, setProductSaving] = useState(false);
  const [productDeletingId, setProductDeletingId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  const loadProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const res = await apiFetch('/api/admin/products');
      if (!res.ok) throw new Error(await res.text());
      const json = (await res.json()) as { products?: ProductDb[] };
      setProducts(json.products ?? []);
    } catch (e) {
      pushToast('err', e instanceof Error ? e.message : 'პროდუქტების ჩატვირთვა ვერ მოხერხდა');
    } finally {
      setProductsLoading(false);
    }
  }, [pushToast]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const categoryOptions = useMemo(() => {
    const extra = new Set<string>();
    for (const p of products) {
      if (p.product_type && !PRODUCT_CATEGORIES.includes(p.product_type)) extra.add(p.product_type);
    }
    return [...PRODUCT_CATEGORIES, ...[...extra].sort((a, b) => a.localeCompare(b, 'ka'))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products;
    if (categoryFilter) list = list.filter((p) => p.product_type === categoryFilter);
    if (q) {
      list = list.filter((p) => {
        const hay = `${p.name} ${p.product_type} ${p.description ?? ''}`.toLowerCase();
        return hay.includes(q);
      });
    }
    return sortProducts(list);
  }, [products, query, categoryFilter]);

  const grouped = useMemo(() => {
    if (categoryFilter) return null;
    const map = new Map<string, ProductDb[]>();
    for (const p of filteredProducts) {
      const k = p.product_type || '—';
      const arr = map.get(k) ?? [];
      arr.push(p);
      map.set(k, arr);
    }
    const keys = [...map.keys()].sort((a, b) => {
      const ia = PRODUCT_CATEGORIES.indexOf(a);
      const ib = PRODUCT_CATEGORIES.indexOf(b);
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib) || a.localeCompare(b, 'ka');
    });
    return keys.map((k) => ({ type: k, items: map.get(k)! }));
  }, [filteredProducts, categoryFilter]);

  function startNew() {
    setDraft(emptyProductDraft());
    setEditing(true);
  }

  function startEdit(row: ProductDb) {
    setDraft(dbRowToDraft(row));
    setEditing(true);
  }

  function closeEditor() {
    setEditing(false);
    setDraft(emptyProductDraft());
  }

  async function saveProduct(e: FormEvent) {
    e.preventDefault();
    setProductSaving(true);
    try {
      const tags = draft.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const sortOrder = Number.parseInt(draft.sort_order, 10) || 0;
      const sizes = draft.sizes
        .map((s) => ({
          label: s.label.trim(),
          price: Number.parseFloat(s.price.replace(',', '.')),
        }))
        .filter((s) => !Number.isNaN(s.price));

      if (!draft.name.trim() || !draft.product_type.trim()) {
        pushToast('err', 'სახელი და კატეგორია სავალდებულოა.');
        return;
      }
      if (!sizes.length) {
        pushToast('err', 'მინიმუმ ერთი ზომა/ფასი დაუმატეთ.');
        return;
      }

      const body = {
        id: draft.id || null,
        product_type: draft.product_type.trim(),
        name: draft.name.trim(),
        description: draft.description.trim(),
        image_url: draft.image_url.trim() || null,
        emoji: draft.emoji.trim() || '🍽️',
        tags,
        sort_order: sortOrder,
        is_active: draft.is_active,
        sizes,
      };

      const res = await apiFetch('/api/admin/products/save', { method: 'POST', body: JSON.stringify(body) });
      if (!res.ok) {
        pushToast('err', await res.text());
        return;
      }

      pushToast('ok', 'პროდუქტი შენახულია.');
      closeEditor();
      await loadProducts();
    } finally {
      setProductSaving(false);
    }
  }

  async function deleteProduct(id: string) {
    if (!window.confirm('წავშალოთ ეს პროდუქტი?')) return;
    setProductDeletingId(id);
    try {
      const res = await apiFetch(`/api/admin/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) {
        pushToast('err', await res.text());
        return;
      }
      pushToast('ok', 'პროდუქტი წაიშალა.');
      if (draft.id === id) closeEditor();
      await loadProducts();
    } finally {
      setProductDeletingId(null);
    }
  }

  const listSection = (
    <div className={`flex min-h-0 flex-col ${isWide ? 'lg:max-h-[calc(100vh-7.5rem)]' : ''}`}>
      <div className={`${panelSurface} p-4 sm:p-5`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="font-playfair text-lg font-bold text-cream sm:text-xl">მენიუს პროდუქტები</h2>
            <p className="mt-1 text-xs text-muted">
              {products.length} ჩანაწერი · ფილტრი და ძებნა · რედაქტირება მარჯვნივ (დიდ ეკრანზე)
            </p>
          </div>
          <button
            type="button"
            onClick={startNew}
            className="inline-flex min-h-[44px] w-full shrink-0 items-center justify-center rounded-lg bg-brand-green px-4 py-2.5 text-sm font-semibold text-black shadow-md shadow-brand-green/20 transition hover:brightness-110 sm:w-auto"
          >
            + ახალი პროდუქტი
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className={labelClass}>
            ძებნა
            <input
              className={inputClass}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="სახელი, კატეგორია, აღწერა…"
              autoComplete="off"
            />
          </label>
          <label className={labelClass}>
            კატეგორიის ფილტრი
            <select
              className={selectClass}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a3a39a'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">ყველა კატეგორია</option>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div
        className={`mt-4 min-h-0 flex-1 overflow-y-auto rounded-xl border border-white/10 bg-black/20 ${isWide ? 'lg:max-h-[calc(100vh-20rem)]' : 'max-h-[55vh] sm:max-h-[60vh]'}`}
      >
        {productsLoading ? (
          <div className="flex items-center gap-3 p-6 text-sm text-muted">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-brand-green border-t-transparent" />
            იტვირთება…
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted">შედეგი არ მოიძებნა. სცადეთ სხვა ძებნა ან ფილტრი.</div>
        ) : grouped ? (
          <div className="divide-y divide-white/10">
            {grouped.map(({ type, items }) => (
              <div key={type}>
                <div className="sticky top-0 z-[1] border-b border-white/10 bg-[#121210]/95 px-4 py-2.5 backdrop-blur-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-green">{type}</span>
                  <span className="ml-2 text-xs text-muted">({items.length})</span>
                </div>
                <ul className="p-2">
                  {items.map((p) => (
                    <ProductRow
                      key={p.id}
                      product={p}
                      active={editing && draft.id === p.id}
                      deleting={productDeletingId === p.id}
                      onEdit={() => startEdit(p)}
                      onDelete={() => void deleteProduct(p.id)}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <ul className="divide-y divide-white/10 p-2">
            {filteredProducts.map((p) => (
              <ProductRow
                key={p.id}
                product={p}
                active={editing && draft.id === p.id}
                deleting={productDeletingId === p.id}
                onEdit={() => startEdit(p)}
                onDelete={() => void deleteProduct(p.id)}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  const editorForm = (
    <form id="admin-product-form" className="flex min-h-0 flex-1 flex-col lg:min-h-0" onSubmit={saveProduct}>
      <div
        className={`px-4 pb-28 pt-4 sm:px-6 sm:pb-8 lg:px-0 lg:pb-4 lg:pt-0 ${isWide ? 'lg:overflow-visible' : 'min-h-0 flex-1 overflow-y-auto'}`}
      >
        <div className={`${panelSurface} p-4 sm:p-6`}>
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <h3 className="font-playfair text-xl font-bold text-cream">
                {draft.id ? 'პროდუქტის რედაქტირება' : 'ახალი პროდუქტი'}
              </h3>
              <p className="mt-1 max-w-prose text-xs text-muted">
                კატეგორია უნდა ემთხვეოდეს საიტის ფილტრებს. ფასები ინახება რიცხვებად (₾ საიტზე ემატება ავტომატურად).
              </p>
            </div>
            {!isWide ? (
              <button
                type="button"
                onClick={closeEditor}
                className="min-h-[44px] rounded-lg border border-white/20 px-4 py-2 text-sm text-cream hover:bg-white/5"
              >
                ← სია
              </button>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <label className={labelClass}>
              კატეგორია (საიტის ფილტრი)
              <select
                required
                className={selectClass}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a3a39a'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                }}
                value={draft.product_type}
                onChange={(e) => setDraft((d) => ({ ...d, product_type: e.target.value }))}
              >
                <option value="" disabled>
                  აირჩიეთ…
                </option>
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              დასახელება
              <input
                className={inputClass}
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                required
              />
            </label>
            <label className={`${labelClass} lg:col-span-2`}>
              აღწერა
              <textarea
                rows={3}
                className={`${inputClass} min-h-[88px] resize-y`}
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              />
            </label>
            <div className={`${labelClass} lg:col-span-2`}>
              <span className="text-inherit">სურათი</span>
              <AdminImageUpload
                buildPath={(file) => productImagePath(draft.name || 'product', file)}
                value={draft.image_url}
                uploadAriaLabel="პროდუქტის სურათი"
                onUrl={(url) => {
                  setDraft((d) => ({ ...d, image_url: url }));
                  pushToast('ok', 'სურათი აიტვირთა.');
                }}
                onError={(m) => pushToast('err', m)}
              />
            </div>
            <label className={labelClass}>
              ემოჯი (თუ სურათი არაა)
              <input
                className={inputClass}
                value={draft.emoji}
                onChange={(e) => setDraft((d) => ({ ...d, emoji: e.target.value }))}
                maxLength={8}
              />
            </label>
            <label className={labelClass}>
              ტეგები (მძიმით)
              <input
                className={inputClass}
                value={draft.tags}
                onChange={(e) => setDraft((d) => ({ ...d, tags: e.target.value }))}
                placeholder="მაგ: Special, Spicy"
              />
            </label>
            <label className={labelClass}>
              რიგი (sort)
              <input
                className={inputClass}
                inputMode="numeric"
                value={draft.sort_order}
                onChange={(e) => setDraft((d) => ({ ...d, sort_order: e.target.value }))}
              />
            </label>
            <label className={`${labelClass} flex flex-row flex-wrap items-center gap-3 lg:col-span-2`}>
              <span className="mt-0.5 shrink-0">აქტიური (საიტზე ჩანს)</span>
              <input
                type="checkbox"
                className="h-5 w-5 shrink-0 accent-brand-green"
                checked={draft.is_active}
                onChange={(e) => setDraft((d) => ({ ...d, is_active: e.target.checked }))}
              />
            </label>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-green">ზომები და ფასები (₾)</p>
              <button
                type="button"
                className="min-h-[40px] rounded-lg border border-brand-green/40 px-3 py-1.5 text-xs font-semibold text-brand-green hover:bg-brand-green/10"
                onClick={() => setDraft((d) => ({ ...d, sizes: [...d.sizes, { label: '', price: '0' }] }))}
              >
                + ზომა / ვარიანტი
              </button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full min-w-[320px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-black/40 text-[11px] uppercase tracking-wider text-muted">
                    <th className="px-3 py-2.5 font-semibold">იარლიყი</th>
                    <th className="px-3 py-2.5 font-semibold">ფასი</th>
                    <th className="w-24 px-3 py-2.5 text-end font-semibold">მოქმედება</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {draft.sizes.map((s, idx) => (
                    <tr key={idx} className="bg-black/20">
                      <td className="px-3 py-2 align-middle">
                        <input
                          placeholder="S, M, L ან ცარიელი"
                          className={`${inputClass} mt-0`}
                          value={s.label}
                          onChange={(e) => {
                            const next = [...draft.sizes];
                            next[idx] = { ...next[idx], label: e.target.value };
                            setDraft((d) => ({ ...d, sizes: next }));
                          }}
                          aria-label={`ზომის იარლიყი ${idx + 1}`}
                        />
                      </td>
                      <td className="px-3 py-2 align-middle">
                        <input
                          placeholder="0"
                          className={`${inputClass} mt-0 max-w-[140px]`}
                          inputMode="decimal"
                          value={s.price}
                          onChange={(e) => {
                            const next = [...draft.sizes];
                            next[idx] = { ...next[idx], price: e.target.value };
                            setDraft((d) => ({ ...d, sizes: next }));
                          }}
                          aria-label={`ფასი ${idx + 1}`}
                        />
                      </td>
                      <td className="px-3 py-2 align-middle text-end">
                        <button
                          type="button"
                          className="min-h-[40px] rounded px-2 text-xs text-red-400 hover:underline disabled:opacity-40"
                          disabled={draft.sizes.length <= 1}
                          onClick={() =>
                            setDraft((d) => ({
                              ...d,
                              sizes: d.sizes.filter((_, j) => j !== idx),
                            }))
                          }
                        >
                          წაშლა
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[11px] text-muted">
              ერთი ფასისთვის დატოვეთ ერთი რიგი და იარლიყი ცარიელი — საიტზე გამოჩნდება მხოლოდ ₾ და თანხა.
            </p>
          </div>

          {draft.id ? (
            <div className="mt-8 rounded-lg border border-red-500/25 bg-red-500/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-red-400">საშიში ზონა</p>
              <p className="mt-1 text-xs text-muted">წაშლა სამუდამოა — სურათი საცავში რჩება, ჩანაწერი იშლება.</p>
              <button
                type="button"
                disabled={productDeletingId === draft.id}
                className="mt-3 min-h-[44px] rounded-lg border border-red-400/50 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/10 disabled:opacity-50"
                onClick={() => void deleteProduct(draft.id)}
              >
                {productDeletingId === draft.id ? 'იშლება…' : 'პროდუქტის წაშლა'}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-[60] flex justify-center bg-gradient-to-t from-[#0a0a08] via-[#0a0a08]/95 to-transparent px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-10 lg:static lg:z-0 lg:bg-transparent lg:p-0 lg:pt-4">
        <div className="pointer-events-auto flex w-full max-w-lg flex-col gap-2 sm:flex-row sm:justify-end lg:max-w-none">
          <button
            type="button"
            onClick={closeEditor}
            className="order-2 min-h-[48px] w-full rounded-lg border border-white/20 px-5 py-3 text-sm font-medium text-cream hover:bg-white/5 sm:order-1 sm:w-auto"
          >
            გაუქმება
          </button>
          <button
            type="submit"
            disabled={productSaving}
            className="order-1 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-brand-orange px-6 py-3 text-sm font-semibold text-black shadow-lg disabled:opacity-50 sm:order-2 sm:min-w-[180px]"
          >
            {productSaving ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                ინახება…
              </>
            ) : (
              'შენახვა'
            )}
          </button>
        </div>
      </div>
    </form>
  );

  const editorPlaceholder = (
    <div
      className={`${panelSurface} flex min-h-[280px] flex-col items-center justify-center p-8 text-center sm:min-h-[360px]`}
    >
      <p className="font-playfair text-lg text-cream">აირჩიეთ პროდუქტი</p>
      <p className="mt-2 max-w-sm text-sm text-muted">
        მარცხნივ სიიდან აირჩიეთ ჩანაწერი ან დააჭირეთ „ახალი პროდუქტი“. აქ გამოჩნდება ფორმა.
      </p>
    </div>
  );

  const mobileEditorShell =
    editing ? (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#0a0a08] pt-[env(safe-area-inset-top)] lg:hidden">
        <header className="flex shrink-0 items-center gap-2 border-b border-white/10 px-3 py-3">
          <button
            type="button"
            onClick={closeEditor}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-cream hover:bg-white/10"
            aria-label="უკან სიაში"
          >
            ←
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-cream">{draft.name.trim() || 'ახალი პროდუქტი'}</p>
            <p className="truncate text-xs text-muted">{draft.product_type || 'კატეგორია'}</p>
          </div>
          <button
            type="submit"
            form="admin-product-form"
            disabled={productSaving}
            className="shrink-0 rounded-lg bg-brand-orange px-4 py-2.5 text-xs font-bold text-black disabled:opacity-50"
          >
            {productSaving ? '…' : 'შენახვა'}
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-hidden">{editorForm}</div>
      </div>
    ) : null;

  return (
    <div className="w-full">
      {mobileEditorShell}

      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-8">
        <div className="min-w-0">{listSection}</div>

        <div className="hidden min-h-0 lg:block">
          {editing ? (
            <div className="sticky top-6 max-h-[calc(100vh-7.5rem)] overflow-y-auto overscroll-contain pr-1">
              {editorForm}
            </div>
          ) : (
            editorPlaceholder
          )}
        </div>
      </div>
    </div>
  );
}

function ProductRow({
  product,
  active,
  deleting,
  onEdit,
  onDelete,
}: {
  product: ProductDb;
  active: boolean;
  deleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const menu = mapProductDbToMenuItem(product);
  const thumb = (product.image_url ?? '').trim();
  return (
    <li
      className={`rounded-lg border transition ${
        active ? 'border-brand-green/50 bg-brand-green/10' : 'border-transparent hover:border-white/10 hover:bg-white/[0.04]'
      }`}
    >
      <div className="flex items-stretch gap-0.5 p-1.5 sm:gap-1">
        <button
          type="button"
          onClick={onEdit}
          className="flex min-h-[56px] min-w-0 flex-1 items-center gap-3 rounded-md px-1 py-1 text-left sm:gap-4"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-black/40 text-xl sm:h-14 sm:w-14">
            {thumb ? (
              <img src={thumb} alt="" className="h-full w-full object-cover" />
            ) : (
              <span aria-hidden>{menu.emoji}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="truncate font-medium text-cream">{product.name}</span>
              {!product.is_active ? (
                <span className="shrink-0 rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-red-300">
                  off
                </span>
              ) : null}
            </div>
            <p className="truncate text-xs text-brand-green">{product.product_type}</p>
            <p className="truncate text-[11px] text-muted">{menu.price}</p>
          </div>
          <span className="hidden shrink-0 self-center text-xs text-muted sm:inline">→</span>
        </button>
        <button
          type="button"
          disabled={deleting}
          className="flex min-w-[48px] shrink-0 items-center justify-center rounded-md px-2 text-xs font-medium text-red-400/90 hover:bg-red-500/10 hover:underline disabled:opacity-50 sm:min-w-[56px] sm:flex-col sm:justify-center sm:py-2"
          onClick={(e) => {
            e.preventDefault();
            onDelete();
          }}
        >
          {deleting ? '…' : 'წაშლა'}
        </button>
      </div>
    </li>
  );
}
