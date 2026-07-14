const CACHE_NAME = 'camino-de-fe-v18';

// Manifest e íconos — nunca se sirven desde caché. Tras una migración de
// marca (nombre, paleta, logo) deben reflejarse de inmediato; con
// cache-first (la estrategia por defecto de abajo) un usuario podía quedar
// viendo el ícono o el nombre viejo indefinidamente.
const ALWAYS_FRESH = ['/manifest.json', '/icon-192.png', '/icon-512.png', '/favicon.svg'];

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

  if (ALWAYS_FRESH.some(path => url.includes(path))) {
    event.respondWith(fetch(event.request, { cache: 'reload' }));
    return;
  }

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
