import { useEffect, useMemo, useRef, useState } from 'react';
import { useCms } from '../context/CmsProvider';
import { useMenuMobileScrollAnim } from '../hooks/useMenuMobileScrollAnim';
import { ka } from '../locale/ka';
import type { MenuItem } from '../types/menu';
import { MenuPrice } from './MenuPrice';

function itemBadges(item: MenuItem): string[] {
  if (item.badges?.length) return item.badges;
  if (item.badge) return [item.badge];
  return [];
}

function chunkPairs<T>(items: T[]): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));
  return rows;
}

export function MenuSection() {
  const { menuItems, menuFilters, site } = useCms();
  const ALL = menuFilters[0] ?? 'ყველა';
  const [menuFilter, setMenuFilter] = useState<string>(ALL);
  const mobileStackRef = useRef<HTMLDivElement>(null);

  const visible = useMemo<MenuItem[]>(() => {
    if (menuFilter === ALL) return menuItems;
    return menuItems.filter((it) => it.cat === menuFilter);
  }, [menuFilter, menuItems, ALL]);

  useEffect(() => {
    if (!menuFilters.includes(menuFilter)) {
      setMenuFilter(menuFilters[0] ?? ALL);
    }
  }, [menuFilters, menuFilter, ALL]);

  const mobileAnimKey = useMemo(
    () => `${menuFilter}:${visible.map((i) => i.name).join('|')}`,
    [menuFilter, visible],
  );
  useMenuMobileScrollAnim(mobileStackRef, mobileAnimKey);

  const counterTotal = String(visible.length).padStart(2, '0');

  return (
    <section className="-mt-6 bg-surface-dark pt-6 md:-mt-10 md:pt-10" aria-labelledby="menu-heading">
      <div className="px-6 pt-12 md:px-[60px] md:pt-14">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="reveal">
            <p className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[4px] text-brand-green">
              <span className="h-px w-[24px] bg-brand-green" />
              {site.menuLabel ?? ka.menu.label}
            </p>
            <h2 id="menu-heading" className="font-playfair text-4xl font-bold text-cream md:text-[2.5rem]">
              {site.menuTitle ?? ka.menu.title}
            </h2>
            <p className="mt-3 hidden text-xs uppercase tracking-[3px] text-muted md:block">
              {site.menuScrollHint ?? ka.menu.scrollHint}: {visible.length}
            </p>
          </div>
          <div className="reveal flex flex-wrap gap-2">
            {menuFilters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setMenuFilter(f)}
                className={`rounded-[2px] border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                  menuFilter === f
                    ? 'border-brand-green bg-brand-green text-black'
                    : 'border-white/10 bg-transparent text-muted hover:border-brand-green hover:text-brand-green'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop pinned horizontal carousel */}
      <div className="menu-pin mt-8 hidden md:block">
        {/* Pinned HUD: counter + progress bar */}
        <div className="pointer-events-none absolute left-[6vw] top-[10vh] z-20 flex items-end gap-6">
          <div className="flex items-baseline font-bebas leading-none">
            <span className="menu-counter-active text-[90px] text-brand-green">01</span>
            <span className="ml-2 text-[28px] text-muted/40">/ {counterTotal}</span>
          </div>
          <div className="mb-3 flex flex-col gap-2">
            <div className="h-px w-48 bg-white/10">
              <div className="menu-counter-bar h-full w-0 bg-brand-green" />
            </div>
            <span className="menu-counter-name text-[11px] font-semibold uppercase tracking-[3px] text-cream">
              {visible[0]?.name ?? ''}
            </span>
          </div>
        </div>

        <div className="menu-scroll-hint pointer-events-none absolute bottom-[8vh] right-[6vw] z-20 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[4px] text-muted">
          <span>{site.menuScrollBrowse ?? ka.menu.scrollBrowse}</span>
          <span className="inline-block h-px w-10 bg-brand-green" />
          <span className="text-brand-green">→</span>
        </div>

        <div
          key={menuFilter}
          className="menu-track absolute left-0 top-[15vh] z-[1] flex h-[70vh] items-stretch gap-6 pl-[6vw] pr-[6vw]"
        >
          {visible.map((item, idx) => (
            <MenuCard
              key={`${item.name}-${idx}`}
              item={item}
              idx={idx}
              total={visible.length}
            />
          ))}
        </div>
      </div>

      {/* Mobile: 2 per row; scroll anims scoped here so filter changes re-create ScrollTriggers */}
      <div ref={mobileStackRef} className="menu-mobile-stack flex flex-col gap-[2px] px-6 pb-8 pt-10 md:hidden">
        {chunkPairs(visible).map((pair, rowIdx) => (
          <div key={`row-${rowIdx}`} className="menu-mobile-row grid grid-cols-2 gap-[2px]">
            {pair.map((item, colIdx) => {
              const idx = rowIdx * 2 + colIdx;
              const solo = pair.length === 1;
              return (
                <article
                  key={`${item.name}-${idx}`}
                  className={`menu-card-mobile relative overflow-hidden border border-white/[0.06] bg-[#0c0c0a] p-4 ${solo ? 'col-span-2' : ''}`}
                >
                  <div className="menu-card-lift flex h-full min-h-[240px] flex-col sm:min-h-[260px]">
                    <div className="menu-card-meta flex items-start justify-between gap-1">
                      <span className="text-[9px] font-bold uppercase tracking-[2px] text-brand-green sm:text-[10px]">
                        {String(idx + 1).padStart(2, '0')} / {counterTotal}
                      </span>
                      {itemBadges(item).length > 0 && (
                        <div className="flex max-w-[55%] flex-wrap justify-end gap-1">
                          {itemBadges(item).map((b) => (
                            <span
                              key={b}
                              className="shrink-0 rounded border border-brand-green px-1.5 py-0.5 text-[9px] font-semibold text-brand-green sm:px-2 sm:text-[10px]"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="menu-card-emoji mt-2 flex h-[4.5rem] items-center justify-center sm:mt-3 sm:h-24">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-auto max-w-full object-contain"
                        />
                      ) : (
                        <span className="text-[clamp(2.25rem,12vw,3rem)] leading-none">{item.emoji}</span>
                      )}
                    </div>
                    <div className="menu-card-copy mt-2 flex flex-1 flex-col">
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-green sm:text-[10px]">
                        {item.cat}
                      </p>
                      <h3 className="mt-1 line-clamp-2 font-playfair text-base font-bold leading-tight text-cream sm:text-lg">
                        {item.name}
                      </h3>
                      <p className="mt-1 line-clamp-3 text-[11px] font-light leading-snug text-muted sm:text-[12px]">
                        {item.desc}
                      </p>
                      <div className="mt-auto flex flex-wrap items-end justify-between gap-x-2 gap-y-1 pt-2">
                        <MenuPrice
                          price={item.price}
                          className="font-bebas text-[17px] text-brand-orange sm:text-[19px]"
                        />
                        <span className="shrink-0 text-[9px] uppercase tracking-[2px] text-muted sm:text-[10px]">
                          {site.menuOrderTag ?? ka.menu.orderTag}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ))}
        {/* Short buffer so last row’s scrub can finish; large pad was creating a gap before #location */}
        <div
          className="menu-mobile-scroll-pad pointer-events-none shrink-0"
          style={{ minHeight: 'clamp(3.5rem, 14vh, 8rem)' }}
          aria-hidden
        />
      </div>
    </section>
  );
}

function MenuCard({ item, idx, total }: { item: MenuItem; idx: number; total: number }) {
  const { site } = useCms();
  return (
    <article className="menu-card relative flex h-full w-[min(440px,calc(100vw-8rem))] max-w-[440px] shrink-0 flex-col overflow-hidden bg-black p-8 md:p-10">
      <div className="menu-card-lift flex h-full flex-col justify-between">
        <div className="menu-card-meta flex items-start justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-[3px] text-brand-green">
            {String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          {itemBadges(item).length > 0 && (
            <div className="flex max-w-[60%] flex-wrap justify-end gap-1.5">
              {itemBadges(item).map((b) => (
                <span
                  key={b}
                  className="rounded border border-brand-green px-2.5 py-1 text-[11px] font-semibold text-brand-green"
                >
                  {b}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="menu-card-emoji flex flex-1 items-center justify-center py-4">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="max-h-[220px] w-auto object-contain"
            />
          ) : (
            <span className="text-[140px] leading-none">{item.emoji}</span>
          )}
        </div>
        <div className="menu-card-copy">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-green">{item.cat}</p>
          <h3 className="mt-2 font-playfair text-[28px] font-bold text-cream">{item.name}</h3>
          <p className="mt-2 text-[13px] font-light leading-relaxed text-muted">{item.desc}</p>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-x-3 gap-y-2 border-t border-white/10 pt-4">
            <MenuPrice price={item.price} className="font-bebas text-[26px] text-brand-orange md:text-[30px]" />
            <span className="shrink-0 text-[10px] uppercase tracking-[3px] text-muted">
              {site.menuOrderTag ?? ka.menu.orderTag}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
