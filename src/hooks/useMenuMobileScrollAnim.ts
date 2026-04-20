import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Mobile menu row scrub (re-runs when `versionKey` changes so filter/sort keeps animations).
 * Scoped under `scope` so it does not fight desktop menu ST in `useGsapPage`.
 *
 * Uses `useEffect` (not `useLayoutEffect`) so triggers register after `useGsapPage` layout work;
 * plus load + delayed refresh so first scroll into #menu measures final layout.
 */
export function useMenuMobileScrollAnim(scope: RefObject<HTMLElement | null>, versionKey: string) {
  useEffect(() => {
    let cancelled = false;
    let rafId = 0;
    let attempts = 0;
    const mm = gsap.matchMedia();

    const refreshSoon = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled) ScrollTrigger.refresh();
        });
      });
    };

    const trySetup = () => {
      if (cancelled) return;
      const root = scope.current;
      if (!root) {
        if (attempts++ < 90) rafId = requestAnimationFrame(trySetup);
        return;
      }

      mm.add('(max-width: 767px)', () => {
        const rows = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.menu-mobile-row'));
        const tls: gsap.core.Timeline[] = [];

        rows.forEach((row, rowIndex) => {
          const cards = gsap.utils.toArray<HTMLElement>(row.querySelectorAll('.menu-card-mobile'));
          if (!cards.length) return;

          const isLastRow = rowIndex === rows.length - 1;
          const endPos = isLastRow ? 'top 18%' : 'top 42%';

          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: row,
              start: 'top bottom',
              end: endPos,
              scrub: 0.48,
              invalidateOnRefresh: true,
            },
          });

          cards.forEach((card, i) => {
            const lift = card.querySelector<HTMLElement>('.menu-card-lift');
            const emoji = card.querySelector<HTMLElement>('.menu-card-emoji');
            const copy = card.querySelector<HTMLElement>('.menu-card-copy');
            if (!lift || !emoji || !copy) return;
            const globalIdx = rowIndex * 2 + i;
            const dir = globalIdx % 2 === 0 ? 1 : -1;
            const ry = i === 0 ? -7 : 7;

            tl.fromTo(
              card,
              {
                rotateX: 78,
                rotateY: ry,
                y: 28,
                scale: 0.9,
                autoAlpha: 0.5,
                transformOrigin: '50% 100%',
                force3D: true,
              },
              {
                rotateX: 0,
                rotateY: 0,
                y: 0,
                scale: 1,
                autoAlpha: 1,
                duration: 0.36,
                force3D: true,
              },
              0,
            )
              .fromTo(
                lift,
                { y: -108, scale: 0.9, transformOrigin: '50% 0%', force3D: true },
                { y: 0, scale: 1, duration: 0.28, force3D: true },
                0.1,
              )
              .fromTo(
                emoji,
                {
                  y: -62,
                  scale: 0.48,
                  rotate: -10 * dir,
                  transformOrigin: '50% 55%',
                  force3D: true,
                },
                { y: 0, scale: 1, rotate: 0, duration: 0.28, force3D: true },
                0.16,
              )
              .fromTo(
                copy,
                { y: 26, autoAlpha: 0, force3D: true },
                { y: 0, autoAlpha: 1, duration: 0.24, force3D: true },
                0.22,
              );
          });

          tls.push(tl);
        });

        refreshSoon();

        return () => {
          tls.forEach((tl) => tl.kill());
        };
      });
    };

    trySetup();

    const onLoad = () => {
      if (!cancelled) ScrollTrigger.refresh();
    };
    if (document.readyState === 'complete') {
      requestAnimationFrame(onLoad);
    } else {
      window.addEventListener('load', onLoad, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener('load', onLoad);
      if (rafId) cancelAnimationFrame(rafId);
      mm.revert();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => ScrollTrigger.refresh());
      });
    };
  }, [versionKey, scope]);
}
