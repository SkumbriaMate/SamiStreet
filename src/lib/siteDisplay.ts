import {
  MAPS_EMBED_SRC,
  MAPS_SEARCH_URL,
  SOCIAL_LINKS,
  STREET_ADDRESS_KA,
  type SocialNetworkId,
} from '@/data/content';
import type { SiteSettings } from '@/types/siteSettings';

export function brandLogoSrc(site: SiteSettings): string {
  return (
    (site.brandLogoUrl ?? '').trim() ||
    (site.navLogoUrl ?? '').trim() ||
    (site.footerLogoUrl ?? '').trim() ||
    (site.aboutLogoUrl ?? '').trim()
  );
}

export function mapsEmbedSrc(site: SiteSettings): string {
  return (site.mapsEmbedUrl ?? '').trim() || MAPS_EMBED_SRC;
}

export function mapsOpenHref(site: SiteSettings): string {
  return (site.mapsOpenUrl ?? '').trim() || MAPS_SEARCH_URL;
}

export function locationAddressText(site: SiteSettings): string {
  return (site.locationAddressLine ?? '').trim() || STREET_ADDRESS_KA;
}

export function locationPhoneDisplay(site: SiteSettings): string {
  return (site.locationPhoneDisplay ?? '').trim() || '+995 557 05 33 11';
}

export function locationPhoneHref(site: SiteSettings): string {
  const t = (site.locationPhoneTel ?? '').trim();
  if (t) return t.startsWith('tel:') ? t : `tel:${t.replace(/\s/g, '')}`;
  return 'tel:+995557053311';
}

export function openingHoursWeekdays(site: SiteSettings): string {
  return (site.openingHoursWeekdays ?? '').trim() || '10:00–22:00';
}

export function openingHoursWeekend(site: SiteSettings): string {
  return (site.openingHoursWeekend ?? '').trim() || '11:00–23:00';
}

export function socialLinksResolved(site: SiteSettings): { id: SocialNetworkId; href: string; label: string }[] {
  return SOCIAL_LINKS.map((item) => {
    let href: string = item.href;
    if (item.id === 'facebook' && (site.socialFacebookUrl ?? '').trim()) href = site.socialFacebookUrl!.trim();
    if (item.id === 'instagram' && (site.socialInstagramUrl ?? '').trim()) href = site.socialInstagramUrl!.trim();
    if (item.id === 'tiktok' && (site.socialTiktokUrl ?? '').trim()) href = site.socialTiktokUrl!.trim();
    return { id: item.id, label: item.label, href };
  });
}
