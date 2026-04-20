import { Facebook, Instagram } from 'lucide-react';
import type { SocialNetworkId } from '../data/content';

const defaultSize = 'h-5 w-5 shrink-0';

/** Brand icons for footer & location — stroke (Lucide) + TikTok glyph */
export function SocialBrandIcon({ id, className }: { id: SocialNetworkId; className?: string }) {
  const cn = (className?.trim() || defaultSize).trim();
  if (id === 'facebook') {
    return <Facebook className={cn} strokeWidth={1.65} aria-hidden />;
  }
  if (id === 'instagram') {
    return <Instagram className={cn} strokeWidth={1.65} aria-hidden />;
  }
  return (
    <svg className={cn} viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
  );
}
