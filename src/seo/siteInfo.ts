import { LOCATION_ROWS, MAPS_COORDS, SOCIAL_LINKS, STREET_ADDRESS_KA } from '../data/content';

/** Public site URL — set in `.env` for production: `VITE_SITE_URL=https://yourdomain.ge` */
export const SITE_URL_ENV = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') ?? '';

export const SITE_NAME_KA = 'სამი სტრიტ ბისტრო';
export const SITE_NAME_EN = 'Sami Street Bistro';

/** Primary title for <title> and og:title */
export const SITE_TITLE =
  `${SITE_NAME_KA} · ${SITE_NAME_EN} — ქუთაისი | შაურმა, თასები, ჰოთდოგები, სტრიტ ფუდი`;

/**
 * Meta description (~155 chars) — natural language; avoid keyword stuffing.
 * Google uses this for snippets; include location + core offerings once.
 */
export const META_DESCRIPTION =
  'სამი სტრიტ ბისტრო — ქუთაისის სტრიტ ფუდი: შაურმა, რაისის თასები, ჰოთდოგები და სნეკები. დავით აღმაშენებლის გამზირი 111. შეკვეთა, მენიუ და საათები საიტზე.';

/**
 * Secondary engines / social scrapers; Google largely ignores meta keywords.
 * Keep a short, relevant list (comma-separated).
 */
export const META_KEYWORDS = [
  'სამი სტრიტ ბისტრო',
  'Sami Street Bistro',
  'შაურმა ქუთაისი',
  'სტრიტ ფუდი ქუთაისი',
  'ჰოთდოგი ქუთაისი',
  'თასები ქუთაისი',
  'ქუთაისი რესტორანი',
  'street food Kutaisi',
  'shawarma Kutaisi',
  'David Aghmashenebeli Avenue 111',
].join(', ');

export const DEFAULT_OG_IMAGE_PATH = '/sami-logo-fotor-20260420123031.png';

export function getPublicOrigin(): string {
  if (SITE_URL_ENV) return SITE_URL_ENV;
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

export function getTelephoneE164(): string {
  const row = LOCATION_ROWS.find((r) => r.kind === 'text' && r.link?.startsWith('tel:'));
  const raw = row?.link?.replace(/^tel:/, '') ?? '995557053311';
  return raw.startsWith('+') ? raw : `+${raw}`;
}

export function buildRestaurantJsonLd(origin: string): object {
  const url = origin ? `${origin}/` : '/';
  const image = origin ? `${origin}${DEFAULT_OG_IMAGE_PATH}` : DEFAULT_OG_IMAGE_PATH;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${url}#website`,
        url,
        name: SITE_NAME_KA,
        alternateName: SITE_NAME_EN,
        inLanguage: 'ka',
        publisher: { '@id': `${url}#restaurant` },
      },
      {
        '@type': 'Restaurant',
        '@id': `${url}#restaurant`,
        name: SITE_NAME_KA,
        alternateName: SITE_NAME_EN,
        url,
        image: [image],
        telephone: getTelephoneE164(),
        address: {
          '@type': 'PostalAddress',
          streetAddress: STREET_ADDRESS_KA,
          addressLocality: 'Kutaisi',
          addressRegion: 'Imereti',
          addressCountry: 'GE',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: MAPS_COORDS.lat,
          longitude: MAPS_COORDS.lng,
        },
        servesCuisine: ['Georgian', 'Street food', 'Fast casual', 'Shawarma'],
        priceRange: '₾',
        sameAs: SOCIAL_LINKS.map((s) => s.href),
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '10:00',
            closes: '22:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Saturday', 'Sunday'],
            opens: '11:00',
            closes: '23:00',
          },
        ],
        hasMenu: {
          '@type': 'Menu',
          url: `${url}#menu`,
        },
      },
    ],
  };
}
