import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { MouseEvent } from 'react';

function navOffsetPx(): number {
  if (typeof window === 'undefined') return 96;
  return window.matchMedia('(min-width: 768px)').matches ? 112 : 92;
}

/** Scroll so target’s top clears fixed nav; avoids scrollIntoView + pin overlap quirks */
function scrollElementIntoViewSmooth(el: HTMLElement) {
  const y = el.getBoundingClientRect().top + window.scrollY - navOffsetPx();
  window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
}

/** In-page anchors: smooth scroll; light ST update after motion (full refresh can jump scroll) */
export function smoothScrollToHash(e: MouseEvent<HTMLAnchorElement>) {
  const href = e.currentTarget.getAttribute('href');
  if (!href) return;
  if (href === '#') {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    requestAnimationFrame(() => ScrollTrigger.update());
    return;
  }
  if (href.startsWith('#') && href.length > 1) {
    e.preventDefault();
    const el = document.querySelector<HTMLElement>(href);
    if (el) {
      scrollElementIntoViewSmooth(el);
      requestAnimationFrame(() => ScrollTrigger.update());
      // Menu scrub STs need positions after smooth scroll ends (one rAF is too early on mobile)
      if (href === '#menu') {
        let settled = false;
        let timeoutId = 0;
        const finish = () => {
          if (settled) return;
          settled = true;
          window.clearTimeout(timeoutId);
          window.removeEventListener('scrollend', onScrollEnd);
          ScrollTrigger.refresh();
          ScrollTrigger.update();
        };
        const onScrollEnd = () => finish();
        window.addEventListener('scrollend', onScrollEnd, { passive: true });
        timeoutId = window.setTimeout(finish, 700);
      }
    }
  }
}
