'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { MAPS_EMBED_SRC, MAPS_SEARCH_URL } from '../data/content';
import { defaultSiteSettings, mergeSiteSettings } from '../data/defaultSiteSettings';
import { apiFetch, apiUrl } from '../lib/api';
import { brandLogoSrc } from '../lib/siteDisplay';
import { SITE_IMAGE_KEYS, siteAssetPath } from '../lib/storage';
import type { SiteSettings } from '../types/siteSettings';
import { AdminImageUpload } from './AdminImageUpload';
import { AdminProductsPanel } from './AdminProductsPanel';
import { AdminToasts, type ToastItem } from './AdminToasts';

type Tab = 'website' | 'products';

const inputClass =
  'mt-1 w-full rounded border border-white/15 bg-[#0c0c0a] px-3 py-2 text-sm text-cream outline-none focus:border-brand-green';
const labelClass = 'flex flex-col text-xs font-semibold uppercase tracking-wider text-muted';
const sectionClass =
  'rounded-xl border border-white/10 bg-black/20 p-4 sm:p-5 md:p-6 shadow-sm shadow-black/20';
const sectionTitleClass = 'mb-4 border-b border-white/10 pb-2 font-playfair text-base font-bold text-cream sm:text-lg';

export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('website');
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const pushToast = useCallback((kind: 'ok' | 'err', message: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((t) => [...t, { id, kind, message }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === 'ok' ? 4000 : 7500);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const [form, setForm] = useState<SiteSettings>(() => defaultSiteSettings());
  const [aboutStoryText, setAboutStoryText] = useState('');
  const [siteLoading, setSiteLoading] = useState(true);
  const [siteSaving, setSiteSaving] = useState(false);

  const loadSite = useCallback(async () => {
    setSiteLoading(true);
    const base = defaultSiteSettings();
    try {
      const res = await fetch(apiUrl('/api/site'));
      if (!res.ok) throw new Error(await res.text());
      const json = (await res.json()) as { siteData?: unknown };
      const merged = mergeSiteSettings(base, json.siteData ?? {});
      const logo = brandLogoSrc(merged);
      setForm({
        ...merged,
        brandLogoUrl: (merged.brandLogoUrl || logo || '').trim() || undefined,
      });
      setAboutStoryText((merged.aboutStoryLines ?? base.aboutStoryLines ?? []).join('\n'));
    } catch (e) {
      pushToast('err', e instanceof Error ? e.message : 'საიტის ჩატვირთვა ვერ მოხერხდა');
    } finally {
      setSiteLoading(false);
    }
  }, [pushToast]);

  useEffect(() => {
    void loadSite();
  }, [loadSite]);

  const f = (k: keyof SiteSettings, v: string) => setForm((prev) => ({ ...prev, [k]: v }));

  function buildWebsiteSavePayload(): SiteSettings {
    const base = defaultSiteSettings();
    const logo = (form.brandLogoUrl ?? '').trim();
    const storyLines = aboutStoryText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    return {
      ...base,
      brandLogoUrl: logo || undefined,
      navLogoUrl: logo || undefined,
      footerLogoUrl: logo || undefined,
      aboutLogoUrl: logo || undefined,
      faviconUrl: logo || undefined,
      seoOgImageUrl: logo || undefined,
      heroImageUrl: (form.heroImageUrl ?? '').trim() || undefined,
      heroTag: form.heroTag ?? base.heroTag,
      heroTitlePart1: form.heroTitlePart1 ?? base.heroTitlePart1,
      heroTitlePart2: form.heroTitlePart2 ?? base.heroTitlePart2,
      heroTitlePart3: form.heroTitlePart3 ?? base.heroTitlePart3,
      heroBody: form.heroBody ?? base.heroBody,
      heroViewMenu: form.heroViewMenu ?? base.heroViewMenu,
      heroFindUs: form.heroFindUs ?? base.heroFindUs,
      aboutStoryLines: storyLines.length ? storyLines : base.aboutStoryLines,
      mapsEmbedUrl: (form.mapsEmbedUrl ?? '').trim() || base.mapsEmbedUrl,
      mapsOpenUrl: (form.mapsOpenUrl ?? '').trim() || base.mapsOpenUrl,
      locationAddressLine: (form.locationAddressLine ?? '').trim() || base.locationAddressLine,
      locationPhoneDisplay: (form.locationPhoneDisplay ?? '').trim() || base.locationPhoneDisplay,
      locationPhoneTel: (form.locationPhoneTel ?? '').trim() || base.locationPhoneTel,
      openingHoursWeekdays: (form.openingHoursWeekdays ?? '').trim() || base.openingHoursWeekdays,
      openingHoursWeekend: (form.openingHoursWeekend ?? '').trim() || base.openingHoursWeekend,
      socialFacebookUrl: (form.socialFacebookUrl ?? '').trim() || undefined,
      socialInstagramUrl: (form.socialInstagramUrl ?? '').trim() || undefined,
      socialTiktokUrl: (form.socialTiktokUrl ?? '').trim() || undefined,
      locationTitle: form.locationTitle ?? base.locationTitle,
      locationMapFrameTitle: form.locationMapFrameTitle ?? base.locationMapFrameTitle,
    };
  }

  async function saveSite(e: FormEvent) {
    e.preventDefault();
    setSiteSaving(true);
    try {
      const dataToSave = buildWebsiteSavePayload();
      const res = await apiFetch('/api/admin/site', {
        method: 'PUT',
        body: JSON.stringify({ data: dataToSave }),
      });
      if (!res.ok) {
        const t = await res.text();
        pushToast('err', t || 'შენახვა ვერ მოხერხდა');
        return;
      }
      const merged = mergeSiteSettings(defaultSiteSettings(), dataToSave);
      const logo = brandLogoSrc(merged);
      setForm({ ...merged, brandLogoUrl: (merged.brandLogoUrl || logo || '').trim() || undefined });
      setAboutStoryText((merged.aboutStoryLines ?? []).join('\n'));
      pushToast('ok', 'საიტის პარამეტრები შენახულია.');
    } finally {
      setSiteSaving(false);
    }
  }

  return (
    <>
      <AdminToasts items={toasts} onDismiss={dismissToast} />
      <main
        className={`mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-10 ${tab === 'products' ? 'max-w-7xl' : 'max-w-6xl'}`}
      >
        <div className="mb-6 flex flex-wrap gap-2 border-b border-white/10 pb-4 sm:mb-8">
          {(['website', 'products'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTab(t);
              }}
              className={`min-h-[44px] rounded px-4 py-2.5 text-xs font-semibold uppercase tracking-wider sm:text-sm ${
                tab === t ? 'bg-brand-green text-black' : 'text-muted hover:bg-white/5 hover:text-cream'
              }`}
            >
              {t === 'website' ? 'საიტი' : 'პროდუქტები'}
            </button>
          ))}
        </div>

        {tab === 'website' ? (
          <form className="flex flex-col gap-6 sm:gap-8" onSubmit={saveSite}>
            {siteLoading ? (
              <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/30 px-4 py-6 text-sm text-muted">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-brand-green border-t-transparent" />
                იტვირთება…
              </div>
            ) : null}

            {!siteLoading ? (
              <>
                <section className={sectionClass}>
                  <h2 className={sectionTitleClass}>ლოგო (ნავიგაცია, ფუტერი, ჩანართი, OG)</h2>
                  <p className="mb-4 text-xs text-muted">
                    ერთი სურათი გამოიყენება ყველგან. ატვირთეთ ფაილი — ბმულის ხელით შეყვანა არ არის საჭირო.
                  </p>
                  <AdminImageUpload
                    buildPath={(file) => siteAssetPath(SITE_IMAGE_KEYS.brandLogo, file)}
                    value={form.brandLogoUrl || brandLogoSrc(form)}
                    uploadAriaLabel="ლოგო — სურათის ატვირთვა"
                    onUrl={(url) => {
                      f('brandLogoUrl', url);
                      pushToast('ok', 'ლოგო აიტვირთა.');
                    }}
                    onError={(m) => pushToast('err', m)}
                  />
                </section>

                <section className={sectionClass}>
                  <h2 className={sectionTitleClass}>Hero</h2>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="lg:col-span-2">
                      <div className={labelClass}>
                        <span className="text-inherit">Hero სურათი</span>
                        <AdminImageUpload
                          buildPath={(file) => siteAssetPath(SITE_IMAGE_KEYS.hero, file)}
                          value={form.heroImageUrl}
                          uploadAriaLabel="Hero სურათი"
                          onUrl={(url) => {
                            f('heroImageUrl', url);
                            pushToast('ok', 'სურათი აიტვირთა.');
                          }}
                          onError={(m) => pushToast('err', m)}
                        />
                      </div>
                    </div>
                    <label className={labelClass}>
                      ტეგის ხაზი
                      <input className={inputClass} value={form.heroTag ?? ''} onChange={(e) => f('heroTag', e.target.value)} />
                    </label>
                    <label className={labelClass}>
                      სათაური — ნაწილი 1
                      <input
                        className={inputClass}
                        value={form.heroTitlePart1 ?? ''}
                        onChange={(e) => f('heroTitlePart1', e.target.value)}
                      />
                    </label>
                    <label className={labelClass}>
                      სათაური — ნაწილი 2 (მწვანე)
                      <input
                        className={inputClass}
                        value={form.heroTitlePart2 ?? ''}
                        onChange={(e) => f('heroTitlePart2', e.target.value)}
                      />
                    </label>
                    <label className={labelClass}>
                      სათაური — ნაწილი 3
                      <input
                        className={inputClass}
                        value={form.heroTitlePart3 ?? ''}
                        onChange={(e) => f('heroTitlePart3', e.target.value)}
                      />
                    </label>
                    <label className={`${labelClass} lg:col-span-2`}>
                      აღწერის ტექსტი
                      <textarea
                        rows={4}
                        className={inputClass}
                        value={form.heroBody ?? ''}
                        onChange={(e) => f('heroBody', e.target.value)}
                      />
                    </label>
                    <label className={labelClass}>
                      ღილაკი — მენიუ
                      <input
                        className={inputClass}
                        value={form.heroViewMenu ?? ''}
                        onChange={(e) => f('heroViewMenu', e.target.value)}
                      />
                    </label>
                    <label className={labelClass}>
                      ღილაკი — მდებარეობა
                      <input
                        className={inputClass}
                        value={form.heroFindUs ?? ''}
                        onChange={(e) => f('heroFindUs', e.target.value)}
                      />
                    </label>
                  </div>
                </section>

                <section className={sectionClass}>
                  <h2 className={sectionTitleClass}>ანიმაციის წინადადებები (About)</h2>
                  <p className="mb-2 text-xs text-muted">თითო წინადადება ახალ ხაზზე — სიტყვებად იყოფა ანიმაციაში.</p>
                  <textarea
                    rows={6}
                    className={`${inputClass} font-mono text-xs leading-relaxed`}
                    value={aboutStoryText}
                    onChange={(e) => setAboutStoryText(e.target.value)}
                  />
                </section>

                <section className={sectionClass}>
                  <h2 className={sectionTitleClass}>რუკა და მისამართი</h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <label className={`${labelClass} md:col-span-2`}>
                      Google Maps embed URL (iframe src)
                      <input
                        className={`${inputClass} font-mono text-[11px]`}
                        value={form.mapsEmbedUrl ?? ''}
                        onChange={(e) => f('mapsEmbedUrl', e.target.value)}
                        placeholder={MAPS_EMBED_SRC}
                      />
                    </label>
                    <label className={`${labelClass} md:col-span-2`}>
                      „გახსენი რუკაში“ ბმული
                      <input
                        className={`${inputClass} font-mono text-[11px]`}
                        value={form.mapsOpenUrl ?? ''}
                        onChange={(e) => f('mapsOpenUrl', e.target.value)}
                        placeholder={MAPS_SEARCH_URL}
                      />
                    </label>
                    <label className={`${labelClass} md:col-span-2`}>
                      მისამართის ტექსტი (საიტზე ჩვენება)
                      <textarea
                        rows={2}
                        className={inputClass}
                        value={form.locationAddressLine ?? ''}
                        onChange={(e) => f('locationAddressLine', e.target.value)}
                      />
                    </label>
                    <label className={labelClass}>
                      სექციის სათაური
                      <input
                        className={inputClass}
                        value={form.locationTitle ?? ''}
                        onChange={(e) => f('locationTitle', e.target.value)}
                      />
                    </label>
                    <label className={labelClass}>
                      რუკის iframe title
                      <input
                        className={inputClass}
                        value={form.locationMapFrameTitle ?? ''}
                        onChange={(e) => f('locationMapFrameTitle', e.target.value)}
                      />
                    </label>
                  </div>
                </section>

                <section className={sectionClass}>
                  <h2 className={sectionTitleClass}>სამუშაო საათები</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className={labelClass}>
                      ორშ–პარ
                      <input
                        className={inputClass}
                        value={form.openingHoursWeekdays ?? ''}
                        onChange={(e) => f('openingHoursWeekdays', e.target.value)}
                        placeholder="10:00–22:00"
                      />
                    </label>
                    <label className={labelClass}>
                      შაბ–კვი
                      <input
                        className={inputClass}
                        value={form.openingHoursWeekend ?? ''}
                        onChange={(e) => f('openingHoursWeekend', e.target.value)}
                        placeholder="11:00–23:00"
                      />
                    </label>
                  </div>
                </section>

                <section className={sectionClass}>
                  <h2 className={sectionTitleClass}>ტელეფონი</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className={labelClass}>
                      ნომერი (რაც ჩანს)
                      <input
                        className={inputClass}
                        value={form.locationPhoneDisplay ?? ''}
                        onChange={(e) => f('locationPhoneDisplay', e.target.value)}
                        placeholder="+995 557 05 33 11"
                      />
                    </label>
                    <label className={labelClass}>
                      ზარი (tel: ან ნომერი)
                      <input
                        className={inputClass}
                        value={form.locationPhoneTel ?? ''}
                        onChange={(e) => f('locationPhoneTel', e.target.value)}
                        placeholder="tel:+995557053311"
                      />
                    </label>
                  </div>
                </section>

                <section className={sectionClass}>
                  <h2 className={sectionTitleClass}>სოციალური ბმულები</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <label className={labelClass}>
                      Facebook
                      <input
                        className={`${inputClass} font-mono text-[11px]`}
                        value={form.socialFacebookUrl ?? ''}
                        onChange={(e) => f('socialFacebookUrl', e.target.value)}
                        placeholder="https://facebook.com/…"
                      />
                    </label>
                    <label className={labelClass}>
                      Instagram
                      <input
                        className={`${inputClass} font-mono text-[11px]`}
                        value={form.socialInstagramUrl ?? ''}
                        onChange={(e) => f('socialInstagramUrl', e.target.value)}
                        placeholder="https://instagram.com/…"
                      />
                    </label>
                    <label className={labelClass}>
                      TikTok
                      <input
                        className={`${inputClass} font-mono text-[11px]`}
                        value={form.socialTiktokUrl ?? ''}
                        onChange={(e) => f('socialTiktokUrl', e.target.value)}
                        placeholder="https://tiktok.com/…"
                      />
                    </label>
                  </div>
                </section>

                <div className="sticky bottom-4 z-10 flex justify-center sm:justify-start">
                  <button
                    type="submit"
                    disabled={siteSaving || siteLoading}
                    className="flex min-h-[48px] min-w-[200px] items-center justify-center gap-2 rounded-[2px] bg-brand-orange px-8 py-3 text-sm font-semibold text-black shadow-lg disabled:opacity-50"
                  >
                    {siteSaving ? (
                      <>
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                        ინახება…
                      </>
                    ) : (
                      'შენახვა'
                    )}
                  </button>
                </div>
              </>
            ) : null}
          </form>
        ) : (
          <AdminProductsPanel pushToast={pushToast} />
        )}
      </main>
    </>
  );
}
