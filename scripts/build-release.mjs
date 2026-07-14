import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join, relative } from 'node:path';

const root = process.cwd();
const out = join(root, 'dist');
const runtimeEntries = [
  'index.html', 'styles.css', 'manifest.webmanifest', '_headers', 'LICENSE',
  'assets', 'src'
];

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

for (const entry of runtimeEntries) {
  await cp(join(root, entry), join(out, entry), { recursive: true });
}

// Assemble the readable runtime fragments into the single browser module.
const runtimeDir = join(root, 'src', 'runtime');
const runtimeParts = (await readdir(runtimeDir)).filter(name => name.endsWith('.js')).sort();
const assembledRuntime = (await Promise.all(runtimeParts.map(name => readFile(join(runtimeDir, name), 'utf8')))).join('\n');
await writeFile(join(out, 'src', 'main.js'), assembledRuntime);
await rm(join(out, 'src', 'runtime'), { recursive: true, force: true });

// Development-only and obsolete payload files must never become release inputs.
await rm(join(out, 'src', 'embedded-assets.js'), { force: true });

async function filesIn(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await filesIn(path));
    else if (entry.isFile()) result.push(path);
  }
  return result;
}

const packageJson = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
const files = await filesIn(out);
const manifest = {
  name: packageJson.name,
  version: packageJson.version,
  files: {}
};
for (const path of files.sort()) {
  const data = await readFile(path);
  manifest.files[relative(out, path).replaceAll('\\', '/')] = {
    bytes: data.length,
    sha256: createHash('sha256').update(data).digest('hex')
  };
}
await writeFile(join(out, 'build-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Built ${Object.keys(manifest.files).length} runtime files in dist/.`);
