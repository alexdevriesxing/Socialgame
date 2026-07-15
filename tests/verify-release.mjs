import { readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const manifest = JSON.parse(await readFile('build-manifest.json', 'utf8'));
if (manifest.version !== '1.6.0') throw new Error(`Expected release 1.6.0, received ${manifest.version}.`);
if (!Array.isArray(manifest.files) || manifest.files.length < 37) throw new Error('Release inventory is incomplete.');

const digests = {};
for (const path of manifest.files) {
  const details = await stat(path);
  if (!details.isFile() || details.size <= 0) throw new Error(`${path}: required release file is empty or missing.`);
  const bytes = await readFile(path);
  digests[path] = createHash('sha256').update(bytes).digest('hex');
}

const index = await readFile(manifest.entrypoint, 'utf8');
const scripts = [...index.matchAll(/<script src="([^"]+)"><\/script>/g)].map(match => match[1]);
if (scripts.length < 28) throw new Error(`Expected at least 28 production scripts; found ${scripts.length}.`);
for (const script of scripts) {
  if (!manifest.files.includes(script)) throw new Error(`${script}: referenced by index.html but absent from build-manifest.json.`);
}

const serviceWorker = await readFile(manifest.offline, 'utf8');
for (const path of manifest.files) {
  if (!/^(?:index\.html|styles\.css|manifest\.webmanifest|assets\/|src\/)/.test(path)) continue;
  const cachePath = path === 'index.html' ? './index.html' : `./${path}`;
  if (!serviceWorker.includes(`'${cachePath}'`)) throw new Error(`${path}: deployable runtime file is missing from the service-worker core cache.`);
}

if (!serviceWorker.includes('sakura-crest-v1.6.0')) throw new Error('Service-worker cache version does not match release 1.6.0.');
for (const required of ['src/campus.js','src/activity.js','src/visual.js','src/world.js','src/world-polish.js','src/world-title.js','src/commercial-ui.js','src/commercial-campus.js','src/walkable-world.js','src/commercial-world-ui.js','src/accessibility-core.js','src/accessibility-preferences.js','src/accessibility-performance.js','src/accessibility-ui.js']) {
  if (!index.includes(required)) throw new Error(`${required}: required v1.6 runtime is not wired into index.html.`);
}
if (!index.includes('orientation-hint')) throw new Error('Portrait orientation guidance is missing from index.html.');
if (!index.includes('aria-label="Interactive game canvas')) throw new Error('Accessible canvas description is missing from index.html.');

console.log(`Release inventory passed for ${manifest.files.length} files and ${scripts.length} production scripts.`);
console.log(`Runtime digests generated for audit: ${Object.keys(digests).length}.`);
