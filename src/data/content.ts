import type { MenuItem } from '../types/menu';

/**
 * Menu items — static fallback when Supabase has no rows yet.
 * - `cat` must match one of `FILTERS` (except „ყველა“) for filtering.
 * - `emoji`: fallback if no image
 * - `image`: optional path (put image in /public)
 */
export type { MenuItem };

export const FILTERS = [
  'ყველა',
  'შაურმა',
  'თასები',
  'ჰოთდოგები',
  'სნეკები',
  'სოუსები',
] as const;

export const MENU_ITEMS: MenuItem[] = [
  // ——— შაურმა ———
  {
    emoji: '🥙',
    cat: 'შაურმა',
    name: 'ქათმის შაურმა',
    desc: 'ზომები: S · M · L — ლავაში, სოუსი, ბოსტნეული',
    price: 'S ₾11 · M ₾14 · L ₾18',
  },
  {
    emoji: '🥙',
    cat: 'შაურმა',
    name: 'საქონლის შაურმა',
    desc: 'ზომები: S · M · L',
    price: 'S ₾12 · M ₾15 · L ₾19',
  },
  {
    emoji: '🥙',
    cat: 'შაურმა',
    name: 'შერეული შაურმა',
    desc: 'ქათამი და საქონელი — ზომები: S · M · L',
    price: 'S ₾14.5 · M ₾17 · L ₾20',
  },
  {
    emoji: '🥙',
    cat: 'შაურმა',
    name: 'ლოდირებული შაურმის თასი',
    desc: 'შაურმის ხორცი, გარნირი, სოუსები თასში',
    price: '₾13.5',
    badge: 'თასი',
    badgeStyle: 'green',
  },
  {
    emoji: '🥙',
    cat: 'შაურმა',
    name: 'ფრეშიანი შაურმა ლავაში',
    desc: 'შაურმა + ფრი ერთ ლავაში',
    price: '₾12',
  },
  {
    emoji: '🥙',
    cat: 'შაურმა',
    name: 'პატარა შაურმა ლავაში',
    desc: 'სპეციალური შეთავაზება',
    price: '₾9',
    badge: 'სპეციალური',
    badgeStyle: 'green',
  },
  {
    emoji: '🥙',
    cat: 'შაურმა',
    name: 'დიდი შაურმა ლავაში',
    desc: 'სპეციალური შეთავაზება',
    price: '₾10',
    badge: 'სპეციალური',
    badgeStyle: 'green',
  },
  // ——— თასები (რაისის / სალათის თასები) ———
  {
    emoji: '🍚',
    cat: 'თასები',
    name: 'ცხარე რაისის თასი ქათმით',
    desc: 'რაისი, ცხარე სოუსი, ქათამი, ბოსტნეული',
    price: '₾12.5',
    badge: 'ცხარე',
    badgeStyle: 'green',
  },
  {
    emoji: '🍚',
    cat: 'თასები',
    name: 'BBQ რაისის თასი',
    desc: 'რაისი, BBQ სოუსი, ხორცი/ქათამი',
    price: '₾15',
  },
  {
    emoji: '🍚',
    cat: 'თასები',
    name: 'მექსიკური თასი',
    desc: 'რაისი, ლობიო, სალსა, ყველი, სანელებლები',
    price: '₾13.5',
  },
  {
    emoji: '🍚',
    cat: 'თასები',
    name: 'ცეარზის თასი ქათმით',
    desc: 'სალათა, ქათამი, ცეარზის სოუსი, პარმეზანი',
    price: '₾16.5',
  },
  {
    emoji: '🍚',
    cat: 'თასები',
    name: 'თევზი და ჩიფსის თასი',
    desc: 'ჩიფსი, თევზი, ტარტარი',
    price: '₾15',
  },
  {
    emoji: '🍚',
    cat: 'თასები',
    name: 'ბოსტნეულის თასი',
    desc: 'რაისი ან ბაზა ბოსტნეულით, სოუსი',
    price: '₾13.5',
    badge: 'ვეგეტარიანული',
    badgeStyle: 'green',
  },
  // ——— ჰოთდოგები და დატვირთული ———
  {
    emoji: '🌭',
    cat: 'ჰოთდოგები',
    name: 'კლასიკური ჰოთდოგი',
    desc: 'ფუნთუშა, სოსისი, ახალი ბოსტნეული',
    price: '₾11.5',
  },
  {
    emoji: '🌭',
    cat: 'ჰოთდოგები',
    name: 'ყველით დატვირთული ჰოთდოგი',
    desc: 'სოსისი, ზედ ყველი და სოუსი',
    price: '₾13.5',
  },
  {
    emoji: '🌭',
    cat: 'ჰოთდოგები',
    name: 'გრილის სოსისის ჰოთდოგი',
    desc: 'გრილზე სოსისი, ფუნთუშა, ტოპინგები',
    price: '₾14.5',
  },
  {
    emoji: '🌭',
    cat: 'ჰოთდოგები',
    name: 'ქათმით დატვირთული ჰოთდოგი',
    desc: 'ქათმის ხორცი, სოუსი, ბოსტნეული',
    price: '₾12.5',
  },
  {
    emoji: '🍟',
    cat: 'ჰოთდოგები',
    name: 'ფრი',
    desc: 'ზომა S ან L — ხრაშული, მარილიანი',
    price: 'S ₾4 · L ₾6',
  },
  {
    emoji: '🍟',
    cat: 'ჰოთდოგები',
    name: 'კარტოფილის ვეჯები',
    desc: 'ღრმა ტაფაში — ჩიზის სოუსი ცალკე',
    price: '₾6',
  },
  // ——— სნეკები / ქუჩის საკვები ———
  {
    emoji: '🍟',
    cat: 'სნეკები',
    name: 'სპირალური კარტოფილი',
    desc: 'თვისტერი / სპირალი ჩიფსი ჯოხზე',
    price: '₾7',
  },
  {
    emoji: '🍟',
    cat: 'სნეკები',
    name: 'სპირალური ყველის სპაირი',
    desc: 'ცხარე, ყველით დატვირთული ჯოხი',
    price: '₾9',
  },
  {
    emoji: '🌭',
    cat: 'სნეკები',
    name: 'კორნდოგი / ყველის ცხარე ჯოხი',
    desc: 'კლასიკური კორნდოგი ან ყველის ვარიანტი',
    price: '₾12',
  },
  {
    emoji: '🍗',
    cat: 'სნეკები',
    name: 'ქათმის ნაგეტები',
    desc: 'ზომები: S · M · L',
    price: 'S ₾5 · M ₾8 · L ₾10',
  },
  // ——— სოუსები ———
  {
    emoji: '🥫',
    cat: 'სოუსები',
    name: 'ნიორის სოუსი',
    desc: 'კლასიკული ნიორ-ზეთის ბაზა',
    price: '₾3',
  },
  {
    emoji: '🥫',
    cat: 'სოუსები',
    name: 'მაიონეზის სოუსი',
    desc: 'კრემიანი',
    price: '₾3',
  },
  {
    emoji: '🥫',
    cat: 'სოუსები',
    name: 'კეჩუპი',
    desc: 'ტომატის კლასიკა',
    price: '₾2',
  },
  {
    emoji: '🥫',
    cat: 'სოუსები',
    name: 'BBQ სოუსი',
    desc: 'შებოლილი, ტკბილი',
    price: '₾2',
  },
  {
    emoji: '🥫',
    cat: 'სოუსები',
    name: 'ცხარე სოუსი',
    desc: 'სიცხით — ფრთხილად',
    price: '₾2',
    badge: 'ცხარე',
    badgeStyle: 'green',
  },
];

/** დავით აღმაშენებლის გამზირი 111 — იგივე წერტილი რაც ბარათზე ჩასმული რუკა (ძველი ტექსტი სხვაგან ხვდებოდა) */
export const STREET_ADDRESS_KA = 'დავით აღმაშენებლის გამზირი 111, ქუთაისი, საქართველო' as const;

/** იგივე შენობა რაც „გახსენი რუკაში“ — embed იჭერს lat/lng-ით */
export const MAPS_COORDS = { lat: 42.2615312, lng: 42.6791191 } as const;

/** Maps search — human-readable query */
export const MAPS_SEARCH_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STREET_ADDRESS_KA)}`;

/** Text-only embed q= often drifts; ll+q lat,lng matches the pinned point */
export const MAPS_EMBED_SRC =
  `https://www.google.com/maps?ll=${MAPS_COORDS.lat},${MAPS_COORDS.lng}&q=${MAPS_COORDS.lat},${MAPS_COORDS.lng}&hl=ka&z=17&output=embed` as const;

export const SOCIAL_LINKS = [
  {
    id: 'facebook' as const,
    href: 'https://www.facebook.com/p/Sami-Street-Bistro-61581153371086/',
    label: 'Facebook',
  },
  {
    id: 'instagram' as const,
    href: 'https://www.instagram.com/sami.street.bistro',
    label: 'Instagram',
  },
  {
    id: 'tiktok' as const,
    href: 'https://www.tiktok.com/@sami.street.bistro',
    label: 'TikTok',
  },
] as const;

export type SocialNetworkId = (typeof SOCIAL_LINKS)[number]['id'];

export const LOCATION_ROWS = [
  {
    label: 'მისამართი',
    primary: STREET_ADDRESS_KA,
    secondary: '',
    link: MAPS_SEARCH_URL,
    kind: 'address' as const,
  },
  {
    label: 'ტელეფონი',
    value: '+995 557 05 33 11',
    link: 'tel:+995557053311',
    kind: 'text' as const,
  },
  {
    label: 'საათები',
    value: '',
    link: null,
    kind: 'grid' as const,
  },
  {
    label: 'სოციალური ქსელი',
    kind: 'socials' as const,
    items: SOCIAL_LINKS,
  },
] as const;
