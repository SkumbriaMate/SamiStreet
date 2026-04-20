import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Writes robots.txt + sitemap.xml into dist when VITE_SITE_URL is set at build time. */
function seoDistFilesPlugin() {
  return {
    name: 'seo-dist-files',
    closeBundle() {
      const base = process.env.VITE_SITE_URL?.replace(/\/$/, '');
      const dist = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(dist)) return;
      if (!base) {
        console.warn(
          '[seo] Set VITE_SITE_URL (e.g. https://yoursite.ge) before `npm run build` to emit sitemap.xml and Sitemap line in robots.txt.',
        );
        return;
      }
      const today = new Date().toISOString().slice(0, 10);
      fs.writeFileSync(
        path.join(dist, 'robots.txt'),
        `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`,
        'utf8',
      );
      fs.writeFileSync(
        path.join(dist, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${base}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`,
        'utf8',
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), seoDistFilesPlugin()],
  // Phone on same Wi‑Fi: run `npm run dev`, then open the “Network” URL (http://YOUR_LAN_IP:5173)
  server: {
    host: true, // 0.0.0.0 — not only localhost
    port: 5173,
    strictPort: false,
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: false,
  },
});
