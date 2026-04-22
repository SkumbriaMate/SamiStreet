import { useCms } from '../context/CmsProvider';
import { brandLogoSrc, socialLinksResolved } from '../lib/siteDisplay';
import { ka } from '../locale/ka';
import { SocialBrandIcon } from './SocialBrandIcons';

export function FooterBar() {
  const { site } = useCms();
  const socials = socialLinksResolved(site);
  const logo = brandLogoSrc(site);
  return (
    <footer className="border-t border-white/[0.06] bg-surface-black px-6 py-12 md:px-[60px]">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-8 text-center md:flex-row md:justify-between md:text-left">
        <div className="footer-col flex items-center gap-3">
          {logo ? (
            <img
              src={logo}
              alt=""
              className="h-10 w-auto max-w-[3.25rem] object-contain"
            />
          ) : null}
          <div className="font-playfair text-lg font-bold">
            <span className="text-cream">{site.footerBrandCream ?? 'SAMI '}</span>
            <span className="text-brand-orange">{site.footerBrandAccent ?? 'STREET BISTRO'}</span>
          </div>
        </div>
        <p className="footer-col text-xs text-muted">{site.footerCopyright ?? ka.footer.copyright}</p>
        <div className="footer-col flex gap-3">
          {socials.map((item) => (
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
