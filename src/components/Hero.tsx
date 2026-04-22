import { useCms } from '../context/CmsProvider';
import { useOpenStatus } from '../hooks/useOpenStatus';
import { ka } from '../locale/ka';
import { smoothScrollToHash } from '../utils/smoothScrollToHash';

export function Hero() {
  const status = useOpenStatus();
  const { site } = useCms();
  const heroBg = (site.heroImageUrl ?? '').trim();

  return (
    <section className="hero-section relative flex min-h-screen min-h-[100dvh] flex-col justify-center overflow-x-hidden overflow-y-hidden pt-28 md:min-h-screen md:pt-0">
      {/* Full-bleed hero — URL from CMS / Storage only */}
      {heroBg ? (
        <div
          className="hero-bg-photo pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-0"
          style={{ backgroundImage: `url('${heroBg}')` }}
          aria-hidden
        />
      ) : null}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/88 via-black/65 to-black/55 md:bg-gradient-to-r md:from-black/90 md:via-black/55 md:to-black/35"
        aria-hidden
      />
      <div className="hero-grid pointer-events-none absolute inset-0 hero-grid-bg opacity-[0.12]" aria-hidden="true" />

      {/* Left-aligned copy: no mx-auto; min-w-0 + width caps avoid vw overflow */}
      <div className="relative z-[2] flex w-full min-w-0 max-w-[min(40rem,100%)] flex-col gap-6 self-start px-[max(1.25rem,env(safe-area-inset-left))] pb-20 pr-[max(1.25rem,env(safe-area-inset-right))] text-left md:max-w-[min(36rem,52%)] md:gap-8 md:pl-[60px] md:pr-6 md:pb-0">
        <p className="hero-tag mb-0 flex flex-wrap items-center gap-4 text-xs font-medium uppercase tracking-[3px] text-brand-green opacity-0 drop-shadow-[0_1px_12px_rgba(0,0,0,0.85)]">
          <span className="h-px w-[30px] shrink-0 bg-brand-green" />
          {site.heroTag ?? ka.hero.tag}
        </p>
        <h1
          className="hero-title mt-0 font-playfair font-bold leading-[1.08] tracking-tight text-cream opacity-0 drop-shadow-[0_2px_24px_rgba(0,0,0,0.9)]"
          style={{ fontSize: 'clamp(2rem, 2.2vw + 1.25rem, 4rem)' }}
        >
          <span className="text-cream">{site.heroTitlePart1 ?? 'Sami '}</span>
          <span className="text-brand-green">{site.heroTitlePart2 ?? 'Street '}</span>
          <span className="text-cream">{site.heroTitlePart3 ?? 'Bistro'}</span>
        </h1>

        <p className="hero-sub mt-0 max-w-lg text-base font-light leading-relaxed text-cream/95 opacity-0 drop-shadow-[0_1px_16px_rgba(0,0,0,0.88)]">
          {site.heroBody ?? ka.hero.body}
        </p>
        <div className="hero-actions mt-0 flex flex-wrap items-center gap-4 opacity-0">
          <a
            href="#menu"
            onClick={smoothScrollToHash}
            className="inline-flex rounded-[2px] bg-brand-orange px-8 py-3.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            {site.heroViewMenu ?? ka.hero.viewMenu}
          </a>
          <a
            href="#location"
            onClick={smoothScrollToHash}
            className="text-sm font-medium text-cream underline-offset-4 transition-colors hover:text-brand-green drop-shadow-[0_1px_12px_rgba(0,0,0,0.85)]"
          >
            {site.heroFindUs ?? ka.hero.findUs}
          </a>
        </div>
      </div>

      <div
        className="hero-visual pointer-events-none absolute right-[max(0.75rem,env(safe-area-inset-right))] top-28 z-[3] flex max-w-[calc(100%-1.5rem)] flex-col items-end gap-3 opacity-0 md:right-[max(1.5rem,env(safe-area-inset-right))] md:top-32 md:max-w-[min(20rem,calc(100%-5rem))]"
        aria-hidden="true"
      >
        <div
          className={`float-badge-1 flex w-full min-w-0 flex-wrap items-center justify-end gap-2 rounded-full border-2 bg-surface-dark/95 px-3 py-1.5 text-[10px] font-semibold text-cream backdrop-blur-sm sm:px-4 sm:py-2 sm:text-xs ${
            status.isOpen ? 'border-brand-green' : 'border-red-500/80'
          }`}
        >
          <span
            className={`inline-block h-2 w-2 shrink-0 rounded-full ${
              status.isOpen ? 'bg-brand-green' : 'bg-red-500'
            } ${status.isOpen ? 'animate-pulse' : ''}`}
            aria-hidden="true"
          />
          {status.isOpen ? (site.heroOpenNow ?? ka.hero.openNow) : (site.heroClosedNow ?? ka.hero.closedNow)}
          {status.nextChangeAt && (
            <span className="min-w-0 text-[10px] font-medium text-muted">
              {status.isOpen ? (site.heroClosesAt ?? ka.hero.closesAt) : (site.heroOpensAt ?? ka.hero.opensAt)}{' '}
              {status.nextChangeAt}
            </span>
          )}
        </div>
        <div className="float-badge-2 shrink-0 rounded-full border-2 border-brand-orange bg-surface-dark px-3 py-1.5 text-[10px] font-semibold text-cream sm:px-4 sm:py-2 sm:text-xs">
          {site.heroTopRated ?? ka.hero.topRated}
        </div>
      </div>
    </section>
  );
}
