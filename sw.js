const CACHE_NAME = 'afri-link-ledger-v1';
const ASSETS = [
  'index.html',
  'approvisionnement.html',
  'transfert-envoi.html',
  'transfert-reception.html',
  'report-codes.html',
  'configuration.html',
  'logo.png',
  'logoarams.png'
];

// Installation du Service Worker et mise en cache des pages fondamentales
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Stratégie de cache : Network-first (données fraîches, secours en cache si hors ligne)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});
