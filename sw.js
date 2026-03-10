const CACHE_NAME = 'venneys-v16';
const BASE = '/venneys-notes/';
const ASSETS = ['index.html', 'data.js', 'app.js', 'style.css', 'manifest.json', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'].map(f => BASE + f);
ASSETS.push(BASE);

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
