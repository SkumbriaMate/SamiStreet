import { Clock, MapPin, Phone, Share2 } from 'lucide-react';
import { LOCATION_ROWS, MAPS_EMBED_SRC, MAPS_SEARCH_URL } from '../data/content';
import { useOpenStatus } from '../hooks/useOpenStatus';
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

  return (
    <section
      id="location"
      className="scroll-mt-24 border-t border-white/[0.06] bg-surface-black px-6 py-12 md:scroll-mt-28 md:px-[60px] md:py-20 lg:py-[100px]"
    >
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
                      {status.isOpen ? ka.hero.openNow : ka.hero.closedNow}
                      {status.nextChangeAt && (
                        <span className="font-medium text-muted">
                          · {status.isOpen ? ka.hero.closesAt : ka.hero.opensAt} {status.nextChangeAt}
                        </span>
                      )}
                    </span>
                  )}
                </div>
                {(() => {
                  switch (row.kind) {
                    case 'grid':
                      return (
                        <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-cream">
                          <div>
                            <p className="text-muted">{ka.location.weekdays}</p>
                            <p className="font-medium">10:00–22:00</p>
                          </div>
                          <div>
                            <p className="text-muted">{ka.location.weekend}</p>
                            <p className="font-medium">11:00–23:00</p>
                          </div>
                        </div>
                      );
                    case 'address':
                      return (
                        <div className="mt-2 space-y-2">
                          <p className="text-[15px] font-medium leading-snug tracking-wide text-cream">{row.primary}</p>
                          {row.secondary ? (
                            <p className="text-sm leading-relaxed text-muted">{row.secondary}</p>
                          ) : null}
                          <a
                            href={row.link}
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
                          {row.items.map((item) => (
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
                      return row.link ? (
                        <a href={row.link} className="mt-1 block text-base text-cream hover:text-brand-green">
                          {row.value}
                        </a>
                      ) : null;
                    default:
                      return null;
                  }
                })()}
              </div>
            </div>
          ))}
        </div>

        {/* Map: same grid column flow on mobile (below info); md+ sits in second column aligned to section top */}
        <div className="map-card relative w-full max-md:mx-auto max-md:max-w-lg overflow-hidden rounded bg-surface-dark md:sticky md:top-28 md:w-auto h-[min(38vh,320px)] min-h-[220px] sm:h-[min(40vh,360px)] sm:min-h-[240px] md:h-[min(88vh,820px)] md:min-h-[480px]">
          <iframe
            title={ka.location.mapFrameTitle}
            src={MAPS_EMBED_SRC}
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
              href={MAPS_SEARCH_URL}
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
