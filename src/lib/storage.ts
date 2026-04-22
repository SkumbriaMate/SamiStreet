import { apiFetch } from './api';

/** Single public bucket: site assets at root; product files under this prefix. */
export const WEBSITE_IMAGES_BUCKET = 'website-images';
export const PRODUCT_IMAGES_STORAGE_PREFIX = 'product-images';

function safeExt(file: File): string {
  const i = file.name.lastIndexOf('.');
  if (i < 0) return '.webp';
  const ext = file.name.slice(i).toLowerCase().replace(/[^a-z0-9.]/g, '');
  return ext.length <= 8 && ext.startsWith('.') ? ext : '.webp';
}

function slug(s: string, max = 40): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')
    .slice(0, max) || 'image';
}

/**
 * Upload via backend API (credentials stay in `backend/.env`).
 * `storagePath` is the object key inside `website-images` (e.g. `nav-logo.png` or `product-images/…`).
 */
export async function uploadPublicWebsiteImage(
  storagePath: string,
  file: File,
): Promise<{ publicUrl: string } | { error: string }> {
  const normalized = storagePath.replace(/^\/+/, '');
  const fd = new FormData();
  fd.append('path', normalized);
  fd.append('file', file);
  const res = await apiFetch('/api/admin/storage/upload', { method: 'POST', body: fd });
  if (!res.ok) {
    const t = await res.text();
    return { error: t || res.statusText };
  }
  return res.json();
}

export const SITE_IMAGE_KEYS = {
  brandLogo: 'brand-logo',
  navLogo: 'nav-logo',
  hero: 'hero',
  aboutLogo: 'about-logo',
  footerLogo: 'footer-logo',
  favicon: 'favicon',
  ogImage: 'og-image',
} as const;

export function siteAssetPath(key: (typeof SITE_IMAGE_KEYS)[keyof typeof SITE_IMAGE_KEYS], file: File): string {
  return `${key}${safeExt(file)}`;
}

export function productImagePath(productName: string, file: File): string {
  const id =
    typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : String(Date.now());
  return `${PRODUCT_IMAGES_STORAGE_PREFIX}/${id}-${slug(productName)}${safeExt(file)}`;
}
