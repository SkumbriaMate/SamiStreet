/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Production origin, no trailing slash — e.g. https://samistreetbistro.ge */
  readonly VITE_SITE_URL?: string;
}
