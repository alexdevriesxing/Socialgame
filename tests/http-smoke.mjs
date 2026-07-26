import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8'
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://127.0.0.1');
    const requestPath = url.pathname === '/' ? '/index.html' : url.pathname;
    const safePath = normalize(requestPath).replace(/^(\.\.(\/|\\|$))+/, '');
    const filePath = join(process.cwd(), 'dist', safePath);
    const info = await stat(filePath);
    if (!info.isFile()) throw new Error('Not a file');
    const body = await readFile(filePath);
    response.writeHead(200, { 'content-type': types[extname(filePath)] || 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain' });
    response.end('Not found');
  }
});

await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', resolve);
});

try {
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}`;
  const checks = [
    ['/', 'text/html', 'src/main.js'],
    ['/src/main.js', 'text/javascript', "from './save.js'"],
    ['/src/data/characters.js', 'text/javascript', 'Aiko Tanaka'],
    ['/assets/keyart.png', 'image/png', null],
    ['/build-manifest.json', 'application/json', 'sha256']
  ];
  for (const [path, expectedType, needle] of checks) {
    const response = await fetch(`${base}${path}`);
    if (!response.ok) throw new Error(`${path} returned HTTP ${response.status}.`);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes(expectedType)) throw new Error(`${path} returned unexpected content type ${contentType}.`);
    if (needle) {
      const body = await response.text();
      if (!body.includes(needle)) throw new Error(`${path} did not contain expected runtime content.`);
    } else {
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.length < 100) throw new Error(`${path} returned an implausibly small asset.`);
    }
  }
  console.log('Static HTTP smoke test passed for HTML, modules, content, assets and build manifest.');
} finally {
  await new Promise(resolve => server.close(resolve));
}
