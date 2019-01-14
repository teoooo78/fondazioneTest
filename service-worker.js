// Copyright 2016 Google Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var dataCacheName = 'app-v1';
var cacheName = 'appFinal-1';
var filesToCache = [
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



self.addEventListener('fetch', function (e) {
  console.log('[Service Worker] Fetch', e.request.url);
  var dataUrl = 'https://query.yahooapis.com/v1/public/yql';
  if (e.request.url.indexOf(dataUrl) > -1) {
    /*
     * When the request URL contains dataUrl, the app is asking for fresh
     * weather data. In this case, the service worker always goes to the
     * network and then caches the response. This is called the "Cache then
     * network" strategy:
     * https://jakearchibald.com/2014/offline-cookbook/#cache-then-network
     */
    e.respondWith(
      caches.open(dataCacheName).then(function (cache) {
        return fetch(e.request).then(function (response) {
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    /*
     * The app is asking for app shell files. In this scenario the app uses the
     * "Cache, falling back to the network" offline strategy:
     * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
     */
    e.respondWith(
      caches.match(e.request).then(function (response) {
        return response || fetch(e.request);
      })
    );
  }
});
