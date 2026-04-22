import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Load env from `backend/.env` — that folder is only env + SQL; it is not part of the Next bundle. Chunk errors come from `.next/`. */
config({ path: path.join(__dirname, 'backend', '.env'), override: true });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /** Avoid picking a parent-folder lockfile as the monorepo root on Windows. */
  outputFileTracingRoot: path.join(__dirname),
  eslint: {
    ignoreDuringBuilds: true,
  },
  /**
   * Dev: disable webpack persistent cache so chunk ids / files do not reference deleted `.next`
   * entries (common on Windows with restarts or two `next dev` processes on the same repo).
   * Use one terminal: `npm run dev`. If chunks are still missing: stop all node dev servers, then
   * `npm run dev:clean`.
   */
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
