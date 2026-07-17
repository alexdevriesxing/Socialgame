'use strict';

const CACHE_VERSION = 'sakura-crest-v1.8.1';
const CORE_FILES = [
  './','./index.html','./styles.css','./manifest.webmanifest','./assets/favicon.svg',
  './assets/anime/keyart.webp','./assets/anime/campus.webp','./assets/anime/characters.webp','./assets/anime/portraits.webp','./assets/anime/objects.webp','./assets/anime/manifest.json',
  './src/content-1.js','./src/content-2.js','./src/content-3.js','./src/content-4.js','./src/content-5.js','./src/content-6.js',
  './src/save.js','./src/art.js','./src/anime-art-v18.js','./src/game-1.js','./src/anime-sprite-cleanup-v18.js','./src/game-2.js','./src/game-3.js','./src/game-4.js','./src/game-5.js',
  './src/campus.js','./src/activity.js','./src/visual.js','./src/world.js','./src/world-polish.js','./src/world-title.js',
  './src/commercial-ui.js','./src/commercial-campus.js','./src/walkable-world.js','./src/commercial-world-ui.js','./src/anime-campus-v18.js',
  './src/accessibility-core.js','./src/accessibility-preferences.js','./src/accessibility-history.js','./src/accessibility-performance.js','./src/accessibility-ui.js',
  './src/release-readiness.js','./src/platform.js'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_VERSION).then(cache => cache.addAll(CORE_FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_VERSION).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('message', event => { if (event.data?.type === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch', event => {
  const request=event.request;if(request.method!=='GET')return;const url=new URL(request.url);if(url.origin!==self.location.origin)return;
  if(request.mode==='navigate'){
    event.respondWith(fetch(request).then(response=>{const copy=response.clone();caches.open(CACHE_VERSION).then(cache=>cache.put('./index.html',copy));return response;}).catch(()=>caches.match('./index.html')));return;
  }
  event.respondWith(caches.match(request).then(cached=>{const network=fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE_VERSION).then(cache=>cache.put(request,copy));}return response;}).catch(()=>cached);return cached||network;}));
});
