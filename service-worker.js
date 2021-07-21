/* global self, caches, fetch */
/* eslint-disable no-restricted-globals */

const CACHE = 'cache-9924c09';

self.addEventListener('install', e => {
  e.waitUntil(precache()).then(() => self.skipWaiting());
});

self.addEventListener('activate', event => {
  self.clients
    .matchAll({
      includeUncontrolled: true,
    })
    .then(clientList => {
      const urls = clientList.map(client => client.url);
      console.log('[ServiceWorker] Matching clients:', urls.join(', '));
    });

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
            return null;
          })
        )
      )
      .then(() => {
        console.log('[ServiceWorker] Claiming clients for version', CACHE);
        return self.clients.claim();
      })
  );
});

function precache() {
  return caches.open(CACHE).then(cache => cache.addAll(["./","./colophon.html","./favicon.png","./index.html","./manifest.json","./postriziny_001.html","./postriziny_002.html","./postriziny_003.html","./postriziny_004.html","./postriziny_005.html","./postriziny_006.html","./postriziny_007.html","./postriziny_008.html","./postriziny_010.html","./postriziny_011.html","./postriziny_009.html","./postriziny_012.html","./postriziny_013.html","./postriziny_014.html","./postriziny_015.html","./postriziny_016.html","./postriziny_017.html","./postriziny_019.html","./resources.html","./resources/image001_fmt.png","./resources/image002_fmt.png","./resources/index.xml","./resources/kocka_fmt.png","./resources/obalka_postriziny_fmt.png","./resources/upoutavka_eknihy_fmt.png","./scripts/bundle.js","./style/style.min.css"]));
}

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.open(CACHE).then(cache => {
      return cache.match(e.request).then(matching => {
        if (matching) {
          console.log('[ServiceWorker] Serving file from cache.');
          console.log(e.request);
          return matching;
        }

        return fetch(e.request);
      });
    })
  );
});
