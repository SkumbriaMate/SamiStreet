import type { Metadata } from 'next';
import './globals.css';
import { defaultSiteSettings } from '@/data/defaultSiteSettings';
import {
  META_DESCRIPTION,
  META_KEYWORDS,
  SHARE_LOGO_PUBLIC_PATH,
  SITE_TITLE,
  SITE_URL_ENV,
  shareOgDescription,
  shareOgTitle,
} from '@/seo/siteInfo';

const defaults = defaultSiteSettings();
const metadataBaseUrl = `${(SITE_URL_ENV || 'http://localhost:3000').replace(/\/$/, '')}/`;

export const metadata: Metadata = {
  metadataBase: new URL(metadataBaseUrl),
  title: SITE_TITLE,
  description: META_DESCRIPTION,
  keywords: [
    'სამი სტრიტ ბისტრო',
    'Sami Street Bistro',
    'შაურმა ქუთაისი',
    'სტრიტ ფუდი ქუთაისი',
    'ჰოთდოგი',
    'თასები',
    'ქუთაისი რესტორანი',
    'street food Kutaisi',
    'shawarma Kutaisi',
  ],
  robots: { index: true, follow: true },
  authors: [{ name: 'სამი სტრიტ ბისტრო' }],
  other: {
    'geo.region': 'GE-IM',
    'geo.placename': 'Kutaisi',
    'theme-color': '#0a0a08',
    'color-scheme': 'dark',
    'format-detection': 'telephone=yes',
  },
  icons: {
    icon: [{ url: SHARE_LOGO_PUBLIC_PATH, type: 'image/png' }],
    apple: [{ url: SHARE_LOGO_PUBLIC_PATH, sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'ka_GE',
    url: '/',
    siteName: (defaults.companyName ?? 'Sami Street Bistro').trim(),
    title: shareOgTitle(defaults),
    description: shareOgDescription(defaults, META_DESCRIPTION),
    images: [
      {
        url: SHARE_LOGO_PUBLIC_PATH,
        alt: (defaults.navLogoAlt ?? 'Sami Street Bistro').trim(),
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: shareOgTitle(defaults),
    description: shareOgDescription(defaults, META_DESCRIPTION),
    images: [SHARE_LOGO_PUBLIC_PATH],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
