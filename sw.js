let cacheName = 'cache-v2';

self.addEventListener('install', (e) => {
  let cache = caches.open(cacheName).then((c) => {
    c.addAll([
      'https://mikael326.github.io/calculadora-taxas/',
      'https://mikael326.github.io/calculadora-taxas/index.html',
      'https://mikael326.github.io/calculadora-taxas/style.css',
      'https://mikael326.github.io/calculadora-taxas/app.js',
      'https://mikael326.github.io/calculadora-taxas/manifest.json',
      'https://mikael326.github.io/calculadora-taxas/icon.png',
      'https://mikael326.github.io/calculadora-taxas/icon-192x192.png',
      'https://mikael326.github.io/calculadora-taxas/icon-256x256.png',
      'https://mikael326.github.io/calculadora-taxas/icon-384x384.png',
      'https://mikael326.github.io/calculadora-taxas/icon-512x512.png',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
      'https://cdn.jsdelivr.net/npm/decimal.js@10.3.1/decimal.min.js'
    ]);
  });

  e.waitUntil(cache);
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        return response || fetch(event.request)
          .then(function(response) {
            return caches.open(cacheName)
              .then(function(cache) {
                cache.put(event.request, response.clone());
                return response;
              });
          })
          .catch(function() {
            return caches.match('https://mikael326.github.io/calculadora-taxas/index.html');
          });
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [cacheName];
  event.waitUntil(
      caches.keys().then((cacheNames) => {
          return Promise.all(
              cacheNames.map((cache) => {
                  if (!cacheWhitelist.includes(cache)) {
                      return caches.delete(cache);
                  }
              })
          );
      })
  );
});