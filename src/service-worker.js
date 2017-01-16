/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["/elements/404.html","b5a9c5870fb1e0409ae5a01cff0cf646"],["/elements/admin-page.html","e3bbc996cc87b293df367bb9d8a9037d"],["/elements/admin/manage-icons/manage-icons.html","7e2244ac334aec045f4c32f1eeab8098"],["/elements/admin/recipe-converter/recipe-converter.html","435ca0e54fd76dcf21527530f191dcb4"],["/elements/app-state/app-state.html","2d9804def6972e8affb6fd0afb2bf845"],["/elements/app-state/app-state.js","8eb69ad3e3172d65830dcc5767f2d859"],["/elements/app-state/async-actions.js","0e4547c63da4646713e478d35ff94811"],["/elements/app-state/firebase-setup.js","ae37179c85b68d963516b11d69b23fc9"],["/elements/categories-page.html","8684d70691cdd98a1d72fbe302e0bf6c"],["/elements/category-page.html","0d70f1c2afe84be324d2c712ce00730e"],["/elements/category-picker/category-picker.html","d203732c4677dd3cea059f489e16614c"],["/elements/cookbook-icon/cookbook-icon.html","66c410e5a93d31515f27d37a35ba07a6"],["/elements/cookbook-icons/cookbook-icons.html","5750b8e2d636a47c06529bbb688d6fa2"],["/elements/favorite-recipe/favorite-recipe.html","50791e43b435736ff014112fbc142236"],["/elements/favorites-page.html","9d4dd2a83fd0d31c456b36fc3e86ce47"],["/elements/generate-uuid/generate-uuid.html","8d2759ab6e1d31cb6d8352dcd371492c"],["/elements/generate-uuid/generate-uuid.js","1323eb1346a98e539ef493caa1427eb6"],["/elements/icon-picker/icon-picker.html","b45f57fabff811cde7c33d7fd99fdcc1"],["/elements/my-app.html","e73885aadb51250ecb0e18c31292022c"],["/elements/polymer-dropzone/polymer-dropzone.html","14e71f2119a9571951bf214dbb1e613f"],["/elements/recipe-card/recipe-card.html","0c302a5b9149c41750545f84a3f8dab9"],["/elements/recipe-form-page.html","4ecac812baace252f17dcb05a7cf4eb7"],["/elements/recipe-page.html","f9f9e012845a8a39ddfdff5b26811f08"],["/elements/recipe-router.html","314f480dda837fec426a6d67531dc672"],["/elements/results-page.html","3c4df23aa917d5d0ca4faf35d5789b7c"],["/elements/search-bar/search-bar.html","fb23eea441559e3b014cce5be79925ac"],["/elements/sign-in/sign-in.html","52f8a7734adf64c163ac67faa78401fa"],["/elements/subcategory-page.html","e213b61d0fe5bc3263c4c581c529817e"],["/elements/taxonomy-path/taxonomy-path.html","8bd0c75fd9c52589737976a8e819fd7b"],["/images/manifest/icon-144x144.png","3b339262d2ca82c5ad688b2972f35ecb"],["/images/manifest/icon-192x192.png","7b7162f40bf4876a1e5bbf40dc8b1399"],["/images/manifest/icon-48x48.png","d2d1b3be3caa2a4ec382cc7566378168"],["/images/manifest/icon-512x512.png","8abae22f25ae3771d0973ba79d602ef7"],["/images/manifest/icon-72x72.png","9fabe2b23cadf6eba9d6077e7b902f32"],["/images/manifest/icon-96x96.png","5df0be2470b6378e7c116bcf43774292"],["/index.html","79ccfe4ac8c3baaec7ad7802065a563d"],["/manifest.json","73e02e6cc5abd6304c07fe42db2b5721"],["/scripts/analytics.js","123d47b4788b0fab1eeecbbcca4332ce"]];
var cacheName = 'sw-precache-v2--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var createCacheKey = function (originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.toString().match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              return cache.add(new Request(cacheKey, {credentials: 'same-origin'}));
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameter and see if we have that URL
    // in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = 'src/index.html';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







