import { ChevronsDown } from 'lucide-react';
import { ABOUT_STORY_LINES } from '../data/aboutStory';
import { ka } from '../locale/ka';

/** Scroll-driven sentence story directly under the hero (no extra nav links here). */
export function AboutSection() {
  return (
    <section className="relative border-t border-white/[0.06] bg-surface-black">
      <div id="about-story" className="relative">
        <div className="about-story-pin relative flex h-screen w-full items-center px-6 md:px-[60px]">
          <div className="pointer-events-none absolute left-6 top-8 flex items-center gap-3 md:left-[60px] md:top-12">
            <img
              src="/sami-logo.png"
              alt={ka.nav.logoAlt}
              className="h-12 w-12 object-contain opacity-90 md:h-16 md:w-16"
            />
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[4px] text-brand-green">
              <span className="h-px w-[24px] bg-brand-green" aria-hidden="true" />
              {ka.about.label}
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[1400px]">
            <div className="relative h-[40vh] md:h-[45vh]">
              {ABOUT_STORY_LINES.map((line, idx) => (
                <div
                  key={`${line}-${idx}`}
                  className="about-story-line absolute inset-0 flex flex-wrap content-center items-center gap-x-3 gap-y-2 md:gap-x-4"
                  data-line={idx}
                >
                  {line.split(' ').map((word, wi) => (
                    <span
                      key={`${idx}-${word}-${wi}`}
                      className="about-story-word font-sans text-[clamp(2.25rem,8vw,4rem)] font-bold leading-[1.12] tracking-tight md:text-[clamp(2.5rem,5.5vw,5rem)]"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-20 left-0 right-0 z-10 flex justify-center px-4 md:bottom-28">
            <div className="flex items-center gap-2.5 opacity-80 md:gap-3 md:opacity-90">
              <ChevronsDown
                className="about-scroll-hint-icon size-5 shrink-0 text-brand-green md:size-6"
                strokeWidth={1.65}
                aria-hidden
              />
              <span className="max-w-[min(92vw,22rem)] text-center text-[11px] font-medium uppercase tracking-[0.2em] text-cream md:text-xs md:tracking-[0.24em]">
                {ka.about.scrollHint}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
