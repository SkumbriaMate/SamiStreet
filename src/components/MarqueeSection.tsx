import { useCms } from '../context/CmsProvider';
import { ka } from '../locale/ka';

export function MarqueeSection() {
  const { site } = useCms();
  const base = site.marqueeLines?.length ? site.marqueeLines : [...ka.marquee];
  const items = [...base, ...base];
  return (
    <div className="marquee-strip overflow-hidden bg-brand-orange py-3">
      <div className="marquee-track flex w-max whitespace-nowrap">
        {items.map((item, idx) => (
          <span
            key={`${item}-${idx}`}
            className="flex items-center font-bebas text-[20px] uppercase tracking-[4px] text-black"
          >
            <span className="px-6">{item}</span>
            <span className="text-black/60">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
