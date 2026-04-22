import { MAPS_EMBED_SRC, MAPS_SEARCH_URL, STREET_ADDRESS_KA } from './content';
import { ka } from '../locale/ka';
import type { SiteSettings } from '../types/siteSettings';

export type { SiteSettings };

export function defaultSiteSettings(): SiteSettings {
  return {
    seoTitle: 'სამი სტრიტ ბისტრო · Sami Street Bistro — ქუთაისი | შაურმა, თასები, ჰოთდოგები',
    seoDescription:
      'სამი სტრიტ ბისტრო — ქუთაისის სტრიტ ფუდი: შაურმა, რაისის თასები, ჰოთდოგები და სნეკები. დავით აღმაშენებლის გამზირი 111. მენიუ, საათები და მდებარეობა საიტზე.',
    seoKeywords:
      'სამი სტრიტ ბისტრო, Sami Street Bistro, შაურმა ქუთაისი, სტრიტ ფუდი ქუთაისი, ჰოთდოგი, თასები, ქუთაისი რესტორანი, street food Kutaisi, shawarma Kutaisi',
    companyName: 'Sami Street Bistro',
    navBrand: 'SAMI',
    navLogoAlt: ka.nav.logoAlt,
    navMenu: ka.nav.menu,
    navFindUs: ka.nav.findUs,
    navContacts: ka.nav.contacts,
    heroTag: ka.hero.tag,
    heroTitlePart1: 'Sami ',
    heroTitlePart2: 'Street ',
    heroTitlePart3: 'Bistro',
    heroBody: ka.hero.body,
    heroViewMenu: ka.hero.viewMenu,
    heroFindUs: ka.hero.findUs,
    heroOpenNow: ka.hero.openNow,
    heroClosedNow: ka.hero.closedNow,
    heroOpensAt: ka.hero.opensAt,
    heroClosesAt: ka.hero.closesAt,
    heroTopRated: ka.hero.topRated,
    marqueeLines: [...ka.marquee],
    aboutLabel: ka.about.label,
    aboutScrollHint: ka.about.scrollHint,
    aboutStoryLines: [
      'გემო, რომელიც დიდხანს რჩება და ყოველთვის ბრუნდები მასთან.',
      'სწრაფი, ახალი და ყოველთვის გემრიელი - ზუსტად ისე, როგორც უნდა იყოს.',
    ],
    menuLabel: ka.menu.label,
    menuTitle: ka.menu.title,
    menuScrollHint: ka.menu.scrollHint,
    menuScrollBrowse: ka.menu.scrollBrowse,
    menuOrderTag: ka.menu.orderTag,
    menuAllFilterLabel: 'ყველა',
    locationTitle: ka.location.title,
    locationMapFrameTitle: ka.location.mapFrameTitle,
    mapsEmbedUrl: MAPS_EMBED_SRC,
    mapsOpenUrl: MAPS_SEARCH_URL,
    locationAddressLine: STREET_ADDRESS_KA,
    locationPhoneDisplay: '+995 557 05 33 11',
    locationPhoneTel: 'tel:+995557053311',
    openingHoursWeekdays: '10:00–22:00',
    openingHoursWeekend: '11:00–23:00',
    footerBrandCream: 'SAMI ',
    footerBrandAccent: 'STREET BISTRO',
    footerCopyright: ka.footer.copyright,
  };
}

/** Shallow merge JSON from Postgres over defaults. */
export function mergeSiteSettings(base: SiteSettings, patch: unknown): SiteSettings {
  if (!patch || typeof patch !== 'object' || Array.isArray(patch)) return { ...base };
  return { ...base, ...(patch as Partial<SiteSettings>) };
}
