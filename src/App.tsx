import { useEffect, useRef, useState } from 'react';
import { useGsapPage } from './hooks/useGsapPage';
import { SeoHead } from './components/SeoHead';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { MarqueeSection } from './components/MarqueeSection';
import { MenuSection } from './components/MenuSection';
import { LocationSection } from './components/LocationSection';
import { FooterBar } from './components/FooterBar';

export default function App() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll / pin animations (GSAP + ScrollTrigger): src/hooks/useGsapPage.ts
  useGsapPage(rootRef);

  return (
    <div ref={rootRef} className="min-h-screen min-w-0 overflow-x-hidden bg-surface-black">
      <SeoHead />
      <Navigation scrolled={scrolled} />
      <main id="main-content" className="min-w-0">
        <Hero />
        <AboutSection />
        <MarqueeSection />
        {/* #menu anchor: flow boundary before menu’s negative margin */}
        <div
          id="menu"
          tabIndex={-1}
          className="pointer-events-none h-px w-full shrink-0 scroll-mt-28 md:scroll-mt-32"
          aria-hidden
        />
        <MenuSection />
        <LocationSection />
        <FooterBar />
      </main>
    </div>
  );
}
