const CACHE_NAME = 'banana-leclerc-cache-v1';
const ASSETS_TO_CACHE = [
  'banana_leclerc.html',
  'manifest.json',
  'banana_leclerc.png',
  'audio.mp3' // Cached so your click sounds don't break offline
];

// Install Event - Caching all critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching core game assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Cleaning up old caches if versions update
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing old cache structure...');
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Serving cached files instantly when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return local asset match, otherwise fallback to network fetch
      return cachedResponse || fetch(event.request);
    })
  );
});