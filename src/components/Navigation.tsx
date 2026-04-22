import { useCms } from '../context/CmsProvider';
import { brandLogoSrc } from '../lib/siteDisplay';
import { ka } from '../locale/ka';
import { smoothScrollToHash } from '../utils/smoothScrollToHash';

type Props = { scrolled: boolean };

export function Navigation({ scrolled }: Props) {
  const { site } = useCms();
  const navBg = scrolled
    ? 'bg-[rgba(10,10,8,0.97)] backdrop-blur-[12px]'
    : 'bg-gradient-to-b from-[rgba(10,10,8,0.95)] to-transparent';

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-[100] px-6 py-6 transition-all duration-300 md:px-[60px] md:py-6 ${navBg}`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
        <a
          href="#"
          onClick={smoothScrollToHash}
          className="group flex items-center gap-3 font-playfair text-2xl font-bold tracking-tight text-cream md:text-[26px]"
        >
          {brandLogoSrc(site) ? (
            <img
              src={brandLogoSrc(site)}
              alt={site.navLogoAlt ?? ka.nav.logoAlt}
              className="h-9 w-auto max-w-[2.85rem] object-contain md:h-10 md:max-w-[3.1rem]"
            />
          ) : null}
          <span className="flex items-center gap-2">
            {site.navBrand ?? 'SAMI'}
            <span className="inline-block h-2 w-2 rounded-full bg-brand-green" aria-hidden="true" />
          </span>
        </a>
        <div className="hidden items-center gap-10 md:flex">
          <a
            href="#menu"
            onClick={smoothScrollToHash}
            className="text-[13px] font-medium uppercase tracking-[2px] text-muted transition-colors hover:text-brand-green"
          >
            {site.navMenu ?? ka.nav.menu}
          </a>
          <a
            href="#location"
            onClick={smoothScrollToHash}
            className="text-[13px] font-medium uppercase tracking-[2px] text-muted transition-colors hover:text-brand-green"
          >
            {site.navFindUs ?? ka.nav.findUs}
          </a>
        </div>
        <a
          href="#location"
          onClick={smoothScrollToHash}
          className="shrink-0 rounded-[2px] bg-brand-orange px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
        >
          {site.navContacts ?? ka.nav.contacts}
        </a>
      </nav>
    </header>
  );
}
