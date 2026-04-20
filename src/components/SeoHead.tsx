import { useEffect } from 'react';
import {
  META_DESCRIPTION,
  META_KEYWORDS,
  SITE_TITLE,
  buildRestaurantJsonLd,
  DEFAULT_OG_IMAGE_PATH,
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

function upsertLink(rel: string, href: string) {
  const sel = `link[rel="${rel}"][data-seo-injected="1"]`;
  let el = document.head.querySelector(sel) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    el.dataset.seoInjected = '1';
    document.head.appendChild(el);
  }
  el.href = href;
}

/**
 * Canonical, Open Graph, Twitter, and Restaurant JSON-LD.
 * Crawlers that execute JS (Google) see updates; base meta also lives in index.html.
 */
export function SeoHead() {
  useEffect(() => {
    const origin = getPublicOrigin();
    if (!origin) return;

    const canonical = `${origin}/`;
    const ogImage = `${origin}${DEFAULT_OG_IMAGE_PATH}`;

    document.title = SITE_TITLE;
    upsertMeta('name', 'description', META_DESCRIPTION);
    upsertMeta('name', 'keywords', META_KEYWORDS);
    upsertLink('canonical', canonical);

    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', SITE_TITLE.split('—')[0]?.trim() ?? SITE_TITLE);
    upsertMeta('property', 'og:title', SITE_TITLE);
    upsertMeta('property', 'og:description', META_DESCRIPTION);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:image', ogImage);
    upsertMeta('property', 'og:image:alt', 'სამი სტრიტ ბისტრო — ლოგო');
    upsertMeta('property', 'og:locale', 'ka_GE');

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', SITE_TITLE);
    upsertMeta('name', 'twitter:description', META_DESCRIPTION);
    upsertMeta('name', 'twitter:image', ogImage);

    const existing = document.getElementById('seo-restaurant-jsonld');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'seo-restaurant-jsonld';
    script.dataset.seoInjected = '1';
    script.textContent = JSON.stringify(buildRestaurantJsonLd(origin));
    document.head.appendChild(script);

    return () => {
      document.head.querySelectorAll('[data-seo-injected="1"]').forEach((n) => n.remove());
    };
  }, []);

  return null;
}
