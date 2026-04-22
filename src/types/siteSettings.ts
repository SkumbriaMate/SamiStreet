/** CMS JSON stored in `site_settings.data` (merged with hardcoded defaults). */
export type SiteSettings = {
  /** One logo for nav, footer, about pin, favicon, OG (when set). */
  brandLogoUrl?: string;
  /** Google Maps embed iframe `src` (full URL). */
  mapsEmbedUrl?: string;
  /** “Open in Google Maps” link (full URL). */
  mapsOpenUrl?: string;
  locationAddressLine?: string;
  locationPhoneDisplay?: string;
  locationPhoneTel?: string;
  openingHoursWeekdays?: string;
  openingHoursWeekend?: string;
  socialFacebookUrl?: string;
  socialInstagramUrl?: string;
  socialTiktokUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  /** Open Graph / Twitter image — full public URL (e.g. Storage). */
  seoOgImageUrl?: string;
  /** Favicon — full public URL (e.g. Storage .png / .ico). */
  faviconUrl?: string;
  companyName?: string;
  navBrand?: string;
  navLogoUrl?: string;
  navLogoAlt?: string;
  navMenu?: string;
  navFindUs?: string;
  navContacts?: string;
  heroImageUrl?: string;
  heroTag?: string;
  heroTitlePart1?: string;
  heroTitlePart2?: string;
  heroTitlePart3?: string;
  heroBody?: string;
  heroViewMenu?: string;
  heroFindUs?: string;
  heroOpenNow?: string;
  heroClosedNow?: string;
  heroOpensAt?: string;
  heroClosesAt?: string;
  heroTopRated?: string;
  marqueeLines?: string[];
  aboutLabel?: string;
  aboutScrollHint?: string;
  aboutLogoUrl?: string;
  /** Scroll-story sentences (word-split animation per line). */
  aboutStoryLines?: string[];
  menuLabel?: string;
  menuTitle?: string;
  menuScrollHint?: string;
  menuScrollBrowse?: string;
  menuOrderTag?: string;
  /** First filter chip — “all”. */
  menuAllFilterLabel?: string;
  locationTitle?: string;
  locationMapFrameTitle?: string;
  footerLogoUrl?: string;
  footerBrandCream?: string;
  footerBrandAccent?: string;
  footerCopyright?: string;
};
