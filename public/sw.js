const CACHE_NAME = 'camino-de-fe-v14';
const urlsToCache = ['/manifest.json', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(cacheNames.map(cache => caches.delete(cache)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = event.request.url;

  // APIs y navegación siempre van a la red, nunca al caché
  if (
    event.request.mode === 'navigate' ||
    url.includes('/api/') ||
    url.includes('.js') ||
    url.includes('.jsx')
  ) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Para otros recursos (imágenes, CSS, fuentes) usa caché primero
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
