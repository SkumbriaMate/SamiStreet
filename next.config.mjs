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
   * Default `npm run dev` uses **Turbopack** (`--turbo`) so dev does not use Webpack’s split-chunk
   * graph under `.next/server` — that graph is what breaks on Windows as `Cannot find module './NNN.js'`
   * when files are removed mid-compile (AV, two dev servers, interrupted HMR).
   * Production `next build` is unchanged. For Webpack dev: `npm run dev:webpack`.
   */
};

export default nextConfig;
