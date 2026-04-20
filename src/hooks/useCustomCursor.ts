import { useEffect } from 'react';

export function useCustomCursor() {
  useEffect(() => {
    const cursor = document.getElementById('cursor');
    const ringEl = document.getElementById('cursor-ring');
    if (!cursor || !ringEl) return;

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: mouse.x, y: mouse.y };
    let raf = 0;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      ring.x = lerp(ring.x, mouse.x, 0.12);
      ring.y = lerp(ring.y, mouse.y, 0.12);
      cursor.style.left = `${mouse.x}px`;
      cursor.style.top = `${mouse.y}px`;
      ringEl.style.left = `${ring.x}px`;
      ringEl.style.top = `${ring.y}px`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement | null)?.closest?.('a, button, [data-cursor-hover]');
      cursor.classList.toggle('cursor-hover', Boolean(t));
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
    };
  }, []);
}
