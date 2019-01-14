importScripts ('polyfil.js')

var dataCacheName = 'app-v1';
var cacheName = 'appFinal-1';
var filesToCache = [
  'manifest.json',
  /* HTML */
  'index.html'
  ,'audio.html',
  'testo.html',

  // CSS 
  'styles/bootstrap.min.css',
  // 'styles/bootstrap.min.css.map',

  // JS
  'scripts/app.js',
  // '/service-worker.js',


  // IMMAGNI 
  'images/icon_blind.png',
  'images/icon_noblind.png',
  'images/cavallo.jpg',
  'images/cane.jpg',
  'images/gatto.jpg',


  // AUDIO 
  'audio/cavallo.mp3',
  'audio/cane.mp3',
  'audio/gatto.mp3'
];

self.addEventListener('install', function (e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});



self.addEventListener('activate', function(event) {
  console.log('[ServiceWorker] Activate NUOVA');

  event.waitUntil(
    // console.log('[ServiceWorker] event.waitUntil');
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    }).then(function() {
    console.log('[ServiceWorker] clients.claim()');
      return clients.claim();
    }).then(function() {
    console.log('[ServiceWorker] client.postMessage');
      return self.clients.matchAll().then(function(clients) {
        return Promise.all(clients.map(function(client) {
          console.log('[ServiceWorker] client.postMessage XXXXXX');
          return client.postMessage('The service worker has activated and ' +
            'taken control.');
        }));
      });
    })
  );
});


/*self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;     // if valid response is found in cache return it
        } else {
          return fetch(event.request)     //fetch from internet
            .then(function(res) {
              return caches.open(dataCacheName)
                .then(function(cache) {
                  cache.put(event.request.url, res.clone());    //save the response for future
                  return res;   // return the fetched data
                })
            })
            .catch(function(err) {       // fallback mechanism
              return caches.open(dataCacheName)
                .then(function(cache) {
                  return cache.match('/offline.html');
                });
            });
        }
      })
  );
});   */     


self.addEventListener('fetch', function (e) {
  console.log('[Service Worker] Fetch', e.request.url);
  var dataUrl = 'https://query.yahooapis.com/v1/public/yql';
  if (e.request.url.indexOf(dataUrl) > -1) {
    e.respondWith(
      caches.open(dataCacheName).then(function (cache) {
        return fetch(e.request).then(function (response) {
          cache.put(e.request.url, response.clone());
          console.log('cache di ' + e.request.url)
          return response;
        });
      })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function (response) {
        return response || fetch(e.request);
      })
    );
  }
});
