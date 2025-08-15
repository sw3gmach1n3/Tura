self.addEventListener('install', e => {
  self.skipWaiting();
});
self.addEventListener('fetch', event => {
  // network-first for dynamic content; minimal offline fallback
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
