/* EcoRuta service worker: app shell + mapa sin conexión */
const SHELL = 'ecoruta-shell-v9-vinculo';
const TILES = 'ecoruta-tiles-v1';
const FILES = ['./', './index.html', './app.js', './app.css', './eco-extras.js', './native-geo.js', './puente/api.js', './puente/storage.js', './puente/renderers.js', './puente/receptora.js', './puente/vincular.js', './icon.svg', './manifest.webmanifest', './fonts/Poppins-Medium.woff', './fonts/Poppins-Bold.woff'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('ecoruta-shell-') && k !== SHELL).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

async function tile(req) {
  const cache = await caches.open(TILES);
  const hit = await cache.match(req.url);
  if (hit) return hit;
  try {
    const res = await fetch(req.url, { mode: 'cors' });
    if (res.ok) {
      cache.put(req.url, res.clone());
      cache.keys().then((ks) => { if (ks.length > 4000) cache.delete(ks[0]); });
    }
    return res;
  } catch {
    return new Response('', { status: 504 });
  }
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET') return;
  if (url.hostname === 'tile.openstreetmap.org' || url.pathname.startsWith('/tiles/')) { e.respondWith(tile(req)); return; }
  if (url.origin !== location.origin || url.pathname.startsWith('/api/')) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(
    caches.match(req).then((hit) => {
      const net = fetch(req).then((res) => { if (res.ok) caches.open(SHELL).then((c) => c.put(req, res.clone())); return res; }).catch(() => hit);
      return hit || net;
    }),
  );
});
