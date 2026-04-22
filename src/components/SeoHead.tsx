import { useEffect } from 'react';
import { useCms } from '../context/CmsProvider';
import { brandLogoSrc } from '../lib/siteDisplay';
import {
  META_DESCRIPTION,
  META_KEYWORDS,
  SITE_TITLE,
  buildRestaurantJsonLd,
  getPublicOrigin,
} from '../seo/siteInfo';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const sel = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector(sel) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    el.dataset.seoInjected = '1';
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function removeMeta(attr: 'name' | 'property', key: string) {
  document.head.querySelector(`meta[${attr}="${key}"][data-seo-injected="1"]`)?.remove();
}

function upsertLink(rel: string, href: string, extra: Record<string, string> = {}) {
  const sel = `link[rel="${rel}"][data-seo-injected="1"]`;
  let el = document.head.querySelector(sel) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    el.dataset.seoInjected = '1';
    document.head.appendChild(el);
  }
  el.href = href;
  Object.entries(extra).forEach(([k, v]) => el?.setAttribute(k, v));
}

function removeSeoInjectedLinks(rel: string) {
  document.head.querySelectorAll(`link[rel="${rel}"][data-seo-injected="1"]`).forEach((n) => n.remove());
}

/**
 * Canonical, Open Graph, Twitter, and Restaurant JSON-LD.
 * Crawlers that execute JS (Google) see updates; base meta also lives in index.html.
 */
export function SeoHead() {
  const { site } = useCms();

  useEffect(() => {
    const origin = getPublicOrigin();
    if (!origin) return;

    const canonical = `${origin}/`;
    const logo = brandLogoSrc(site);
    const ogImage =
      (site.seoOgImageUrl || '').trim() || logo || (site.faviconUrl || '').trim() || '';

    const title = site.seoTitle ?? SITE_TITLE;
    const description = site.seoDescription ?? META_DESCRIPTION;
    const keywords = site.seoKeywords ?? META_KEYWORDS;

    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('name', 'keywords', keywords);
    upsertLink('canonical', canonical);

    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', title.split('—')[0]?.trim() ?? title);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', canonical);
    if (ogImage) {
      upsertMeta('property', 'og:image', ogImage);
      upsertMeta('property', 'og:image:alt', site.navLogoAlt ?? 'Logo');
    } else {
      removeMeta('property', 'og:image');
      removeMeta('property', 'og:image:alt');
    }
    upsertMeta('property', 'og:locale', 'ka_GE');

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    if (ogImage) {
      upsertMeta('name', 'twitter:image', ogImage);
    } else {
      removeMeta('name', 'twitter:image');
    }

    const fav = (site.faviconUrl || '').trim() || logo;
    if (fav) {
      const iconType = fav.endsWith('.svg')
        ? 'image/svg+xml'
        : fav.endsWith('.ico')
          ? 'image/x-icon'
          : 'image/png';
      upsertLink('icon', fav, { type: iconType });
      upsertLink('apple-touch-icon', fav);
    } else {
      removeSeoInjectedLinks('icon');
      removeSeoInjectedLinks('apple-touch-icon');
    }

    const jsonImage = (site.seoOgImageUrl || '').trim() || logo || null;
    const existing = document.getElementById('seo-restaurant-jsonld');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'seo-restaurant-jsonld';
    script.dataset.seoInjected = '1';
    script.textContent = JSON.stringify(buildRestaurantJsonLd(origin, jsonImage));
    document.head.appendChild(script);

    return () => {
      document.head.querySelectorAll('[data-seo-injected="1"]').forEach((n) => n.remove());
    };
  }, [
    site.seoTitle,
    site.seoDescription,
    site.seoKeywords,
    site.seoOgImageUrl,
    site.navLogoUrl,
    site.brandLogoUrl,
    site.footerLogoUrl,
    site.aboutLogoUrl,
    site.navLogoAlt,
    site.faviconUrl,
  ]);

  return null;
}
