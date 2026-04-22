import { Clock, MapPin, Phone, Share2 } from 'lucide-react';
import { LOCATION_ROWS } from '../data/content';
import { useCms } from '../context/CmsProvider';
import { useOpenStatus } from '../hooks/useOpenStatus';
import {
  locationAddressText,
  locationPhoneDisplay,
  locationPhoneHref,
  mapsEmbedSrc,
  mapsOpenHref,
  openingHoursWeekend,
  openingHoursWeekdays,
  socialLinksResolved,
} from '../lib/siteDisplay';
import { ka } from '../locale/ka';
import { SocialBrandIcon } from './SocialBrandIcons';

const locIconClass = 'h-5 w-5 text-brand-green';
const locIconStroke = 1.6;

function LocationRowIcon({ kind }: { kind: (typeof LOCATION_ROWS)[number]['kind'] }) {
  switch (kind) {
    case 'address':
      return <MapPin className={locIconClass} strokeWidth={locIconStroke} aria-hidden />;
    case 'text':
      return <Phone className={locIconClass} strokeWidth={locIconStroke} aria-hidden />;
    case 'grid':
      return <Clock className={locIconClass} strokeWidth={locIconStroke} aria-hidden />;
    case 'socials':
      return <Share2 className={locIconClass} strokeWidth={locIconStroke} aria-hidden />;
  }
}

export function LocationSection() {
  const status = useOpenStatus();
  const { site } = useCms();
  const embed = mapsEmbedSrc(site);
  const mapsLink = mapsOpenHref(site);
  const addressLine = locationAddressText(site);
  const phoneDisplay = locationPhoneDisplay(site);
  const phoneHref = locationPhoneHref(site);
  const hoursWd = openingHoursWeekdays(site);
  const hoursWe = openingHoursWeekend(site);
  const socials = socialLinksResolved(site);

  return (
    <section
      id="location"
      className="scroll-mt-24 border-t border-white/[0.06] bg-surface-black px-6 py-12 md:scroll-mt-28 md:px-[60px] md:py-20 lg:py-[100px]"
    >
      <h2 className="mx-auto mb-10 max-w-[1200px] font-playfair text-3xl font-bold text-cream md:text-[2.25rem]">
        {site.locationTitle ?? ka.location.title}
      </h2>
      <div
        className="loc-perspective mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-8 md:grid-cols-[minmax(0,1fr)_minmax(280px,520px)] md:gap-12 lg:gap-16 max-md:[perspective:none]"
        style={{ perspective: '1400px' }}
      >
        <div className="min-w-0">
          {LOCATION_ROWS.map((row, i) => (
            <div
              key={row.kind === 'socials' ? 'loc-socials' : `${row.label}-${i}`}
              className={`loc-row flex gap-4 py-6 ${i > 0 ? 'border-t border-white/[0.06]' : ''}`}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded bg-brand-green/15">
                <LocationRowIcon kind={row.kind} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-green">{row.label}</p>
                  {row.kind === 'grid' && (
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[2px] ${
                        status.isOpen
                          ? 'border-brand-green/50 bg-brand-green/10 text-brand-green'
                          : 'border-red-500/50 bg-red-500/10 text-red-400'
                      }`}
                    >
                      <span
                        className={`inline-block h-1.5 w-1.5 rounded-full ${
                          status.isOpen ? 'bg-brand-green animate-pulse' : 'bg-red-500'
                        }`}
                        aria-hidden="true"
                      />
                      {status.isOpen ? (site.heroOpenNow ?? ka.hero.openNow) : (site.heroClosedNow ?? ka.hero.closedNow)}
                      {status.nextChangeAt && (
                        <span className="font-medium text-muted">
                          · {status.isOpen ? (site.heroClosesAt ?? ka.hero.closesAt) : (site.heroOpensAt ?? ka.hero.opensAt)}{' '}
                          {status.nextChangeAt}
                        </span>
                      )}
                    </span>
                  )}
                </div>
                {(() => {
                  switch (row.kind) {
                    case 'grid':
                      return (
                        <div className="mt-3 grid grid-cols-1 gap-3 text-sm text-cream sm:grid-cols-2">
                          <div>
                            <p className="text-muted">{ka.location.weekdays}</p>
                            <p className="font-medium">{hoursWd}</p>
                          </div>
                          <div>
                            <p className="text-muted">{ka.location.weekend}</p>
                            <p className="font-medium">{hoursWe}</p>
                          </div>
                        </div>
                      );
                    case 'address':
                      return (
                        <div className="mt-2 space-y-2">
                          <p className="text-[15px] font-medium leading-snug tracking-wide text-cream">{addressLine}</p>
                          <a
                            href={mapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-xs font-semibold uppercase tracking-wider text-brand-green underline-offset-2 hover:underline"
                          >
                            {ka.location.openMaps}
                          </a>
                        </div>
                      );
                    case 'socials':
                      return (
                        <div className="mt-3 flex flex-wrap gap-3">
                          {socials.map((item) => (
                            <a
                              key={item.id}
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={ka.footer.socialAria[item.id]}
                              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-muted transition-colors hover:border-brand-green hover:text-brand-green"
                            >
                              <SocialBrandIcon id={item.id} />
                            </a>
                          ))}
                        </div>
                      );
                    case 'text':
                      return (
                        <a href={phoneHref} className="mt-1 block text-base text-cream hover:text-brand-green">
                          {phoneDisplay}
                        </a>
                      );
                    default:
                      return null;
                  }
                })()}
              </div>
            </div>
          ))}
        </div>

        <div className="map-card relative h-[min(38vh,320px)] min-h-[220px] w-full overflow-hidden rounded bg-surface-dark max-md:mx-auto max-md:max-w-lg sm:h-[min(40vh,360px)] sm:min-h-[240px] md:sticky md:top-28 md:h-[min(88vh,820px)] md:min-h-[480px] md:w-auto">
          <iframe
            title={site.locationMapFrameTitle ?? ka.location.mapFrameTitle}
            src={embed}
            className="pointer-events-auto absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center px-4 pb-6 pt-24 md:pb-8">
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto inline-flex rounded-[2px] bg-brand-orange px-8 py-3.5 text-sm font-semibold text-black shadow-lg transition-opacity hover:opacity-90"
            >
              {ka.location.openMaps}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
