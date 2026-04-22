import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'სამი სტრიტ ბისტრო · Sami Street Bistro — ქუთაისი | შაურმა, თასები, ჰოთდოგები',
  description:
    'სამი სტრიტ ბისტრო — ქუთაისის სტრიტ ფუდი: შაურმა, რაისის თასები, ჰოთდოგები და სნეკები. დავით აღმაშენებლის გამზირი 111. მენიუ, საათები და მდებარეობა საიტზე.',
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
    icon:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%230a0a08'/%3E%3Cpath fill='%233ECF8E' d='M8 22V10h4l4 7 4-7h4v12h-3.5v-7.5L15 22l-3.5-7.5V22H8z'/%3E%3C/svg%3E",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
