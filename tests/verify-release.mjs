import { readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const manifest = JSON.parse(await readFile('build-manifest.json', 'utf8'));
if (manifest.version !== '1.2.0') throw new Error(`Expected release 1.2.0, received ${manifest.version}.`);
if (!Array.isArray(manifest.files) || manifest.files.length < 20) throw new Error('Release inventory is incomplete.');

const digests = {};
for (const path of manifest.files) {
  const details = await stat(path);
  if (!details.isFile() || details.size <= 0) throw new Error(`${path}: required release file is empty or missing.`);
  const bytes = await readFile(path);
  digests[path] = createHash('sha256').update(bytes).digest('hex');
}

const index = await readFile(manifest.entrypoint, 'utf8');
const scripts = [...index.matchAll(/<script src="([^"]+)"><\/script>/g)].map(match => match[1]);
if (scripts.length < 15) throw new Error(`Expected at least 15 production scripts; found ${scripts.length}.`);
for (const script of scripts) {
  if (!manifest.files.includes(script)) throw new Error(`${script}: referenced by index.html but absent from build-manifest.json.`);
}

const serviceWorker = await readFile(manifest.offline, 'utf8');
for (const path of manifest.files) {
  if (!/^(?:index\.html|styles\.css|manifest\.webmanifest|assets\/|src\/)/.test(path)) continue;
  const cachePath = path === 'index.html' ? './index.html' : `./${path}`;
  if (!serviceWorker.includes(`'${cachePath}'`)) {
    throw new Error(`${path}: deployable runtime file is missing from the service-worker core cache.`);
  }
}

if (!serviceWorker.includes("sakura-crest-v1.2.0")) throw new Error('Service-worker cache version does not match release 1.2.0.');
if (!index.includes('src/campus.js')) throw new Error('Living Campus runtime is not wired into index.html.');

console.log(`Release inventory passed for ${manifest.files.length} files and ${scripts.length} production scripts.`);
console.log(`Runtime digests generated for audit: ${Object.keys(digests).length}.`);
