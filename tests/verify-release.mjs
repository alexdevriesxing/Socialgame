import { readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const RELEASE_VERSION = '1.8.0';
const manifest = JSON.parse(await readFile('build-manifest.json', 'utf8'));
if (manifest.version !== RELEASE_VERSION) throw new Error(`Expected release ${RELEASE_VERSION}, received ${manifest.version}.`);
if (!Array.isArray(manifest.files) || manifest.files.length < 50) throw new Error(`Release inventory is incomplete: ${manifest.files?.length || 0} files.`);
if (new Set(manifest.files).size !== manifest.files.length) throw new Error('Release inventory contains duplicate paths.');

const digests = {};
for (const path of manifest.files) {
  const details = await stat(path);
  if (!details.isFile() || details.size <= 0) throw new Error(`${path}: required release file is empty or missing.`);
  const bytes = await readFile(path);
  digests[path] = createHash('sha256').update(bytes).digest('hex');
}

const index = await readFile(manifest.entrypoint, 'utf8');
const scripts = [...index.matchAll(/<script src="([^"]+)"><\/script>/g)].map(match => match[1]);
if (scripts.length < 32) throw new Error(`Expected at least 32 production scripts; found ${scripts.length}.`);
for (const script of scripts) if (!manifest.files.includes(script)) throw new Error(`${script}: referenced by index.html but absent from build-manifest.json.`);
if (!index.includes(`name="sakura-release" content="${RELEASE_VERSION}"`)) throw new Error('The release metadata marker is missing from index.html.');
if (!index.includes('orientation-hint')) throw new Error('Portrait orientation guidance is missing from index.html.');
if (!index.includes('aria-label="Interactive anime school-life game canvas')) throw new Error('Accessible canvas description is missing from index.html.');
if (!index.includes('assets/anime/keyart.webp')) throw new Error('Permanent key art is not exposed through release metadata.');

const serviceWorker = await readFile(manifest.offline, 'utf8');
for (const path of manifest.files) {
  if (!/^(?:index\.html|styles\.css|manifest\.webmanifest|assets\/|src\/)/.test(path)) continue;
  const cachePath = path === 'index.html' ? './index.html' : `./${path}`;
  if (!serviceWorker.includes(`'${cachePath}'`)) throw new Error(`${path}: deployable runtime file is missing from the service-worker core cache.`);
}
if (!serviceWorker.includes(`sakura-crest-v${RELEASE_VERSION}`)) throw new Error(`Service-worker cache version does not match release ${RELEASE_VERSION}.`);

for (const required of [
  'src/anime-art-v18.js',
  'src/campus.js','src/activity.js','src/visual.js','src/world.js','src/world-polish.js','src/world-title.js',
  'src/commercial-ui.js','src/commercial-campus.js','src/walkable-world.js','src/commercial-world-ui.js','src/anime-campus-v18.js',
  'src/accessibility-core.js','src/accessibility-preferences.js','src/accessibility-history.js','src/accessibility-performance.js','src/accessibility-ui.js',
  'src/release-readiness.js'
]) if (!index.includes(required)) throw new Error(`${required}: required v1.8 runtime is not wired into index.html.`);

const animeManifestPath = 'assets/anime/manifest.json';
if (!manifest.files.includes(animeManifestPath)) throw new Error('Permanent anime-art manifest is absent from the release inventory.');
const animeManifest = JSON.parse(await readFile(animeManifestPath, 'utf8'));
if (animeManifest.version !== RELEASE_VERSION) throw new Error(`Anime-art manifest version mismatch: ${animeManifest.version}.`);
if (animeManifest.proceduralFallbacks !== false) throw new Error('Anime-art manifest enables procedural fallbacks.');
if (animeManifest.externalRuntimeDependency !== false) throw new Error('Anime-art manifest has an external runtime dependency.');
const expectedAnimeAssets = {
  'keyart.webp': [960, 540],
  'campus.webp': [4096, 768],
  'characters.webp': [1728, 1024],
  'portraits.webp': [512, 512],
  'objects.webp': [1024, 512]
};
for (const [name, [width, height]] of Object.entries(expectedAnimeAssets)) {
  const path = `assets/anime/${name}`;
  const record = animeManifest.assets?.[name];
  if (!manifest.files.includes(path)) throw new Error(`${path}: permanent artwork is absent from the release inventory.`);
  if (!record || record.width !== width || record.height !== height) throw new Error(`${path}: expected ${width}x${height}, received ${record?.width}x${record?.height}.`);
  if (!Number.isInteger(record.bytes) || record.bytes < 4096) throw new Error(`${path}: invalid byte-size record.`);
  if (!/^[a-f0-9]{64}$/.test(record.sha256 || '')) throw new Error(`${path}: invalid SHA-256 record.`);
  if (digests[path] !== record.sha256) throw new Error(`${path}: repository digest does not match the anime-art manifest.`);
}

const headers = await readFile('_headers', 'utf8');
for (const required of ['Content-Security-Policy:', 'X-Content-Type-Options: nosniff', 'X-Frame-Options: DENY', 'Strict-Transport-Security:', 'Service-Worker-Allowed: /']) {
  if (!headers.includes(required)) throw new Error(`_headers is missing required production directive: ${required}`);
}
const redirects = await readFile('_redirects', 'utf8');
for (const alias of ['/play / 302', '/game / 302', '/sakura-crest / 302']) if (!redirects.includes(alias)) throw new Error(`_redirects is missing ${alias}.`);

for (const document of ['docs/release-v1.7.md','docs/release-v1.8-art.md','docs/cloudflare-release-runbook.md','docs/known-issues.md']) {
  const text = await readFile(document, 'utf8');
  if (text.length < 400) throw new Error(`${document}: release documentation is incomplete.`);
}
const knownIssues = await readFile('docs/known-issues.md', 'utf8');
if (!knownIssues.includes('Known critical defects: **0**') || !knownIssues.includes('Known high-severity defects: **0**')) throw new Error('Known-issues severity register is incomplete.');

console.log(`Release inventory passed for ${manifest.files.length} files and ${scripts.length} production scripts.`);
console.log(`Permanent anime artwork passed for ${Object.keys(expectedAnimeAssets).length} assets.`);
console.log(`Runtime digests generated for audit: ${Object.keys(digests).length}.`);
console.log('Cloudflare headers, redirects, release notes, known issues and rollback documentation passed.');
