import { formatSizePrices, type SizeRow } from './formatPrice';
import type { MenuItem } from '../types/menu';

export type ProductSizeDb = {
  id: string;
  label: string;
  price: number | string;
  sort_order: number | null;
};

export type ProductDb = {
  id: string;
  product_type: string;
  name: string;
  description: string | null;
  image_url: string | null;
  emoji: string | null;
  tags: string[] | null;
  sort_order: number | null;
  is_active: boolean | null;
  product_sizes?: ProductSizeDb[] | null;
};

export function mapProductDbToMenuItem(p: ProductDb): MenuItem {
  const sizes = [...(p.product_sizes ?? [])].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  ) as ProductSizeDb[];

  const normalized: SizeRow[] = sizes.map((s) => ({
    label: s.label ?? '',
    price: typeof s.price === 'string' ? Number(s.price) : s.price,
  }));

  const tags = (p.tags ?? []).map((t) => t.trim()).filter(Boolean);

  return {
    emoji: p.emoji?.trim() || '🍽️',
    image: p.image_url?.trim() || undefined,
    cat: p.product_type,
    name: p.name,
    desc: p.description?.trim() ?? '',
    price: formatSizePrices(normalized),
    badges: tags.length ? tags : undefined,
    badge: tags[0],
    badgeStyle: 'green',
  };
}
