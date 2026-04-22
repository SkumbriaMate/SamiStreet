/**
 * Wipe local Next / tooling caches so the next `next dev` or `next build` starts from a clean graph.
 * Run: `npm run clean` (or use `npm run dev:clean` which runs this then starts the dev server).
 */
import { rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dirs = [path.join(root, '.next'), path.join(root, 'node_modules', '.cache')];

for (const dir of dirs) {
  try {
    rmSync(dir, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
}
