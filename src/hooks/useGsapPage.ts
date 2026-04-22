/**
 * All page ScrollTrigger / scrub animations live here.
 * Wired from `App.tsx` via `useGsapPage(rootRef)` — `rootRef` must wrap every
 * section that uses selectors below (hero, about story, menu, location, footer).
 *
 * @see https://gsap.com/docs/v3/Plugins/ScrollTrigger/
 */
import { useLayoutEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DEBUG_ST = process.env.NODE_ENV === 'development' && false; // flip to `true` to show start/end markers

/**
 * `layoutKey` should change when async CMS data affects the DOM before GSAP measures
 * (e.g. `heroImageUrl` appears after `/api/site`). Otherwise `.hero-bg-photo` mounts later
 * with `opacity-0` and never gets its entrance tween.
 */
export function useGsapPage(scope: RefObject<HTMLElement | null>, layoutKey?: string | boolean) {
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;

    // Mobile URL bar show/hide can thrash layouts; avoid normalizeScroll (often fights
    // native wheel/momentum and feels jumpy when reversing scrub timelines).
    ScrollTrigger.config({ ignoreMobileResize: true });

    const ctx = gsap.context(() => {
      const heroBgEl = root.querySelector<HTMLElement>('.hero-bg-photo');

      // ===== Hero entrance =====
      const heroTl = gsap.timeline({ delay: 0.2 });
      heroTl.fromTo('.hero-tag', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }).fromTo(
        '.hero-title',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' },
        '-=0.4',
      );
      if (heroBgEl) {
        heroTl.fromTo(
          heroBgEl,
          { opacity: 0 },
          { opacity: 1, duration: 0.95, ease: 'power2.out' },
          '-=0.35',
        );
      }
      heroTl
        .fromTo(
          '.hero-visual',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' },
          '-=0.75',
        )
        .fromTo(
          '.hero-sub',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.55',
        )
        .fromTo(
          '.hero-actions',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.4',
        );

      // Hero parallax: background photo + light grid drift
      if (heroBgEl) {
        gsap.to(heroBgEl, {
          yPercent: -3,
          ease: 'none',
          scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: 1.05 },
        });
      }
      gsap.to('.hero-grid', {
        y: -32,
        ease: 'none',
        scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: 1.2 },
      });

      // ===== Generic reveals =====
      const reveals = gsap.utils.toArray<HTMLElement>('.reveal');
      reveals.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            delay: (i % 3) * 0.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
          },
        );
      });

      // ===== About: pinned sentences — words light up, next line cross-fades =====
      const storyPin = root.querySelector<HTMLElement>('.about-story-pin');
      const lineEls = gsap.utils.toArray<HTMLElement>('.about-story-line');

      if (storyPin && lineEls.length) {
        const wordsPerLine = lineEls.map((line) =>
          Array.from(line.querySelectorAll<HTMLElement>('.about-story-word')),
        );

        gsap.set(lineEls[0], { y: 0, autoAlpha: 1 });
        gsap.set(wordsPerLine[0], { color: '#2f2f2a' });
        for (let i = 1; i < lineEls.length; i++) {
          gsap.set(lineEls[i], { y: 80, autoAlpha: 0 });
          gsap.set(wordsPerLine[i], { color: '#2f2f2a' });
        }

        const storyTl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: storyPin,
            start: 'top top',
            end: () => `+=${window.innerHeight * lineEls.length * 1.1}`,
            pin: true,
            pinSpacing: true,
            pinReparent: false,
            anticipatePin: 0,
            scrub: 0.55,
            markers: DEBUG_ST,
            invalidateOnRefresh: true,
          },
        });

        lineEls.forEach((line, i) => {
          const words = wordsPerLine[i];
          if (!words.length) return;

          storyTl.to(
            words,
            {
              color: '#f5f0e8',
              duration: 1,
              stagger: 1 / words.length,
            },
            '+=0.05',
          );

          storyTl.to({}, { duration: 0.4 });

          if (i < lineEls.length - 1) {
            const label = `xfade-${i}`;
            storyTl.add(label);
            storyTl.to(
              line,
              { y: -80, autoAlpha: 0, duration: 0.7, ease: 'power2.in' },
              label,
            );
            storyTl.to(
              lineEls[i + 1],
              { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power2.out' },
              label,
            );
          }
        });

        requestAnimationFrame(() => {
          storyTl.scrollTrigger?.refresh();
        });
      }

      // ===== Menu: pinned horizontal carousel (desktop) =====
      const mm = gsap.matchMedia();

      mm.add('(min-width: 768px)', () => {
        const pin = root.querySelector<HTMLElement>('.menu-pin');
        const track = root.querySelector<HTMLElement>('.menu-track');
        if (!pin || !track) return;

        const cards = gsap.utils.toArray<HTMLElement>('.menu-card');
        const counterActive = root.querySelector<HTMLElement>('.menu-counter-active');
        const counterBar = root.querySelector<HTMLElement>('.menu-counter-bar');
        const counterName = root.querySelector<HTMLElement>('.menu-counter-name');
        const scrollHint = root.querySelector<HTMLElement>('.menu-scroll-hint');
        const lifts = cards.map((c) => c.querySelector<HTMLElement>('.menu-card-lift'));
        const emojis = cards.map((c) => c.querySelector<HTMLElement>('.menu-card-emoji'));
        const copies = cards.map((c) => c.querySelector<HTMLElement>('.menu-card-copy'));

        const clamp01 = gsap.utils.clamp(0, 1);
        const smoothstep = (t: number) => {
          const x = clamp01(t);
          return x * x * (3 - 2 * x);
        };

        let distance = 1;
        let holdPad = 480;
        let cardOffsets: Array<{ left: number; width: number }> = [];

        const measure = () => {
          gsap.set(track, { x: 0 });
          const trackW = track.scrollWidth;
          const pinW = pin.clientWidth || window.innerWidth || 1;
          distance = Math.max(1, trackW - pinW);
          // Extra pinned scroll AFTER the track hits max-x so the last card’s “drop / flip”
          // can finish before #location — without this, pin end === horizontal end and u < 1.
          holdPad = Math.max(520, pinW * 0.58);
          cardOffsets = cards.map((c) => ({ left: c.offsetLeft, width: c.offsetWidth }));
        };

        const totalScroll = () => distance + holdPad;

        const updateHud = (xProgress: number) => {
          const p = clamp01(xProgress);
          const n = cards.length;
          const idx = n <= 1 ? 0 : Math.min(n - 1, Math.round(p * (n - 1)));
          if (counterActive) counterActive.textContent = String(idx + 1).padStart(2, '0');
          if (counterName) {
            const nameEl = cards[idx]?.querySelector<HTMLElement>('h3');
            if (nameEl) counterName.textContent = nameEl.textContent || '';
          }
          if (counterBar) counterBar.style.width = `${p * 100}%`;
        };

        /** holdSettle: 0..1 during pinned “hold” after horizontal move — forces last card landing to complete */
        const updateCards = (trackX: number, holdSettle = 0) => {
          const pinW = pin.clientWidth || 1;
          const centerX = pinW / 2;
          const clamp = gsap.utils.clamp(-1, 1);
          const edge = pinW * 1.02;
          const travel = Math.max(pinW * 0.72, 1);
          const lastIdx = cards.length - 1;
          const settle = smoothstep(clamp01(holdSettle));

          for (let i = 0; i < cards.length; i++) {
            const pos = cardOffsets[i];
            if (!pos) continue;
            const cardLeftInPin = pos.left + trackX;
            const cardCenterInPin = cardLeftInPin + pos.width / 2;
            const dxNorm = clamp((cardCenterInPin - centerX) / (pinW * 0.58));
            const dir = i % 2 === 0 ? 1 : -1;

            let uRaw = (edge - cardLeftInPin) / travel;
            let u = smoothstep(uRaw);
            if (i === lastIdx) {
              u = Math.max(u, settle);
            }

            const uForm = smoothstep(u / 0.32);
            const uFlip = smoothstep((u - 0.04) / 0.58);
            const flipY = dir * (1 - uFlip) * 58;
            const fallX = (1 - smoothstep(u / 0.5)) * -11;
            const parallaxY = dxNorm * -10;
            gsap.set(cards[i], {
              rotationY: flipY + parallaxY,
              rotationX: fallX,
              scale: 0.72 + 0.28 * uForm,
              autoAlpha: 0.06 + 0.94 * uForm,
              transformOrigin: '50% 85%',
              force3D: true,
            });

            const uLift = smoothstep((u - 0.1) / 0.52);
            const lift = lifts[i];
            if (lift) {
              gsap.set(lift, {
                y: -260 * (1 - uLift),
                scale: 0.82 + 0.18 * uLift,
                transformOrigin: '50% 0%',
                force3D: true,
              });
            }

            const uEmoji = smoothstep((u - 0.2) / 0.48);
            const emoji = emojis[i];
            if (emoji) {
              gsap.set(emoji, {
                y: -110 * (1 - uEmoji),
                scale: 0.28 + 0.72 * uEmoji,
                rotate: dir * (1 - uEmoji) * 22 + dxNorm * 10,
                transformOrigin: '50% 55%',
                force3D: true,
              });
            }

            const uCopy = smoothstep((u - 0.34) / 0.48);
            const copy = copies[i];
            if (copy) {
              gsap.set(copy, {
                y: 38 * (1 - uCopy),
                autoAlpha: clamp01(0.05 + uCopy * 0.95),
                force3D: true,
              });
            }
          }
        };

        measure();

        const moveEnd = () => distance / totalScroll();

        const st = ScrollTrigger.create({
          trigger: pin,
          start: 'top top',
          end: () => `+=${totalScroll()}`,
          pin: true,
          pinSpacing: true,
          pinReparent: true,
          anticipatePin: 0,
          scrub: 0.52,
          markers: DEBUG_ST,
          invalidateOnRefresh: true,
          onRefreshInit: () => {
            measure();
          },
          onRefresh: () => {
            measure();
          },
          onUpdate: (self) => {
            const t = clamp01(self.progress);
            const m = moveEnd();
            const xProg = m <= 0.0001 ? t : Math.min(1, t / m);
            const trackX = -xProg * distance;
            gsap.set(track, { x: trackX });
            const holdSettle = t <= m ? 0 : clamp01((t - m) / (1 - m));
            updateHud(xProg);
            updateCards(trackX, holdSettle);
          },
          onEnter: () => {
            if (scrollHint) gsap.to(scrollHint, { opacity: 0, duration: 0.5, ease: 'power2.out' });
          },
          onLeaveBack: () => {
            if (scrollHint) gsap.to(scrollHint, { opacity: 1, duration: 0.5, ease: 'power2.out' });
          },
        });

        updateHud(0);
        updateCards(0, 0);

        requestAnimationFrame(() => {
          measure();
          st.refresh();
        });

        return () => {
          st.kill();
        };
      });

      // Mobile menu row scrub lives in `useMenuMobileScrollAnim` (MenuSection) so it re-binds when filters change.

      // ===== Location rows =====
      const locRows = gsap.utils.toArray<HTMLElement>('.loc-row');
      locRows.forEach((row, i) => {
        const x = i % 2 === 0 ? -48 : 48;
        gsap.fromTo(
          row,
          { opacity: 0, x, rotateY: i % 2 === 0 ? 12 : -12 },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 88%', toggleActions: 'play none none none' },
          },
        );
      });

      // Map card
      const mapCard = root.querySelector<HTMLElement>('.map-card');
      if (mapCard) {
        gsap.fromTo(
          mapCard,
          { opacity: 0, scale: 0.92, rotateX: 10, y: 40 },
          {
            opacity: 1,
            scale: 1,
            rotateX: 0,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: mapCard, start: 'top 85%', toggleActions: 'play none none none' },
          },
        );
        // (Removed long scrub rotateY on map — extra scrub + iframe often fights native scroll when
        // scrolling back up quickly, which can feel like the contact block is “skipped”.)
      }

      // Marquee strip entrance
      const marquee = root.querySelector<HTMLElement>('.marquee-strip');
      if (marquee) {
        gsap.fromTo(
          marquee,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: { trigger: marquee, start: 'top 95%', toggleActions: 'play none none none' },
          },
        );
      }

      // Footer
      const footerCols = gsap.utils.toArray<HTMLElement>('.footer-col');
      gsap.fromTo(
        footerCols,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: 'footer', start: 'top 92%', toggleActions: 'play none none none' },
        },
      );
    }, root);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    let lastInnerWidth = window.innerWidth;
    let resizeDebounce = 0;

    const isCoarseOrTouch =
      typeof navigator !== 'undefined' &&
      (navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches ||
        'ontouchstart' in window);

    const onResize = () => {
      const w = window.innerWidth;
      // iOS/Android: rubber-band + URL bar fire resize with same width but new height.
      // Full ScrollTrigger.refresh() then re-measures pins and scroll can jump to the wrong place.
      const narrow = window.matchMedia('(max-width: 1024px)').matches;
      if (narrow && isCoarseOrTouch && w === lastInnerWidth) return;
      lastInnerWidth = w;
      window.clearTimeout(resizeDebounce);
      resizeDebounce = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    };
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);
    if (document.readyState !== 'complete') {
      window.addEventListener('load', onLoad, { once: true });
    } else {
      // Avoid delayed refresh() while user may already be scrolled — that recalculates pin
      // spacing and can jump past whole sections (e.g. #location) in one frame.
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', onLoad);
      window.clearTimeout(resizeDebounce);
      ctx.revert();
    };
  }, [scope, layoutKey]);
}
