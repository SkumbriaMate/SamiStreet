import { SOCIAL_LINKS } from '../data/content';
import { ka } from '../locale/ka';
import { SocialBrandIcon } from './SocialBrandIcons';

export function FooterBar() {
  return (
    <footer className="border-t border-white/[0.06] bg-surface-black px-6 py-12 md:px-[60px]">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-8 text-center md:flex-row md:justify-between md:text-left">
        <div className="footer-col flex items-center gap-3">
          <img
            src="/sami-logo-fotor-20260420123031.png"
            alt=""
            className="h-10 w-auto max-w-[3.25rem] object-contain"
          />
          <div className="font-playfair text-lg font-bold">
            <span className="text-cream">SAMI </span>
            <span className="text-brand-orange">STREET BISTRO</span>
          </div>
        </div>
        <p className="footer-col text-xs text-muted">{ka.footer.copyright}</p>
        <div className="footer-col flex gap-3">
          {SOCIAL_LINKS.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={ka.footer.socialAria[item.id]}
              className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/15 text-muted transition-colors hover:border-brand-green hover:text-brand-green"
            >
              <SocialBrandIcon id={item.id} className="h-[18px] w-[18px]" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
