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


(function () {
  'use strict';

  var app = {
    isLoading: true
  };

  var main = document.getElementById("main");
  main.style.display = "none";


  if ('serviceWorker' in navigator) {
    // Handler for messages coming from the service worker
    navigator.serviceWorker.addEventListener('message', function (event) {
      /* TOLGO LOADING*/   
      console.log(event)
      /* MOSTRO LA PAGINA */
        var main = document.getElementById("main");
        var loading = document.getElementById("loading");
        loading.style.display = "none";
        main.style.display = "block";
    });
  }

  // TODO add service worker code here
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then(function () {
        console.log('Service Worker Registered');
      })
  }

  if ('serviceWorker' in navigator) {
    // Handler for messages coming from the service worker
    navigator.serviceWorker.addEventListener('install', function (event) {
      /* TOLGO LOADING*/   
      console.log('INSTALLATO')
      
    });
  }

  



})();