/** Keeps each size+price chunk on one line (e.g. „S ₾11“) so „L“ never orphans from „₾12“). */
export function MenuPrice({ price, className = '' }: { price: string; className?: string }) {
  const parts = price.includes(' · ') ? price.split(' · ') : [price];
  return (
    <div
      className={`flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 leading-none tracking-tight [font-variant-numeric:tabular-nums] ${className}`.trim()}
    >
      {parts.map((p) => (
        <span key={p} className="whitespace-nowrap">
          {p}
        </span>
      ))}
    </div>
  );
}
