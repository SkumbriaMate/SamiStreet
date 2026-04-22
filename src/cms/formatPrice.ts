export type SizeRow = { label: string; price: number };

function formatLariAmount(n: number): string {
  const rounded = Math.round(n * 10) / 10;
  if (Number.isInteger(rounded)) return String(Math.trunc(rounded));
  return String(rounded);
}

/** Builds the same style the static menu used: „S ₾11 · M ₾14“ or „₾3“. */
export function formatSizePrices(sizes: SizeRow[]): string {
  if (!sizes.length) return '—';
  const parts = sizes.map(({ label, price }) => {
    const p = formatLariAmount(Number(price));
    const lbl = label.trim();
    return lbl ? `${lbl} ₾${p}` : `₾${p}`;
  });
  return parts.join(' · ');
}
