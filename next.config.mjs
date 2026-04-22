import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Local: load `backend/.env` if present. `override: false` so Railway/host env vars are never replaced by an empty or stale file. */
const envPath = path.join(__dirname, 'backend', '.env');
if (existsSync(envPath)) {
  config({ path: envPath, override: false });
}

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
