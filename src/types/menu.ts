/**
 * Menu card model — used by static `content.ts` and Supabase-backed CMS.
 * - `cat` is the product type string (filter chip + category label).
 * - `badges` / `badge`: small labels like „ცხარე“, „NEW“.
 */
export type MenuItem = {
  emoji: string;
  image?: string;
  cat: string;
  name: string;
  desc: string;
  price: string;
  badge?: string;
  badges?: string[];
  badgeStyle?: 'green';
};
