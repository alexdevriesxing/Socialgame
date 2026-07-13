import { access, readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const out = 'dist';
const required = ['index.html', 'styles.css', 'manifest.webmanifest', '_headers', 'src/main.js', 'src/content.js', 'src/save.js'];
for (const file of required) await access(join(out, file));

const index = await readFile(join(out, 'index.html'), 'utf8');
if (!index.includes('src/main.js')) throw new Error('Release index does not load canonical main.js.');
if (/part-\d+\.js|release-\d+\.js|DecompressionStream/.test(index)) throw new Error('Release index still references compressed payload modules.');

const main = await readFile(join(out, 'src/main.js'), 'utf8');
if (main.includes('embedded-assets')) throw new Error('Release main.js still imports embedded assets.');

const rootEntries = await readdir(out);
if (rootEntries.some(name => /^(part|release)-\d+/.test(name))) throw new Error('Obsolete payload chunks found in release root.');

const manifest = JSON.parse(await readFile(join(out, 'build-manifest.json'), 'utf8'));
if (!manifest.files['src/main.js'] || !manifest.files['assets/keyart.png']) throw new Error('Build manifest is incomplete.');
console.log(`Release verification passed for ${Object.keys(manifest.files).length} files.`);
