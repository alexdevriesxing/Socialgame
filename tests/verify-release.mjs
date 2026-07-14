import { readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const manifest = JSON.parse(await readFile('build-manifest.json', 'utf8'));
if (manifest.version !== '1.1.0') throw new Error(`Expected release 1.1.0, received ${manifest.version}.`);

for (const [path, expected] of Object.entries(manifest.files)) {
  const bytes = await readFile(path);
  const details = await stat(path);
  const digest = createHash('sha256').update(bytes).digest('hex');

  if (details.size !== expected.bytes) {
    throw new Error(`${path}: expected ${expected.bytes} bytes, received ${details.size}.`);
  }
  if (digest !== expected.sha256) {
    throw new Error(`${path}: SHA-256 mismatch. Expected ${expected.sha256}, received ${digest}.`);
  }
}

const index = await readFile('index.html', 'utf8');
const scripts = [...index.matchAll(/<script src="([^"]+)"><\/script>/g)].map(match => match[1]);
for (const script of scripts) {
  if (!manifest.files[script]) throw new Error(`${script}: referenced by index.html but absent from build-manifest.json.`);
}

const serviceWorker = await readFile('sw.js', 'utf8');
for (const path of Object.keys(manifest.files)) {
  if (!/^(?:index\.html|styles\.css|manifest\.webmanifest|assets\/|src\/)/.test(path)) continue;
  const cachePath = path === 'index.html' ? './index.html' : `./${path}`;
  if (!serviceWorker.includes(`'${cachePath}'`)) {
    throw new Error(`${path}: deployable runtime file is missing from the service-worker core cache.`);
  }
}

console.log(`Release integrity passed for ${Object.keys(manifest.files).length} files and ${scripts.length} production scripts.`);
