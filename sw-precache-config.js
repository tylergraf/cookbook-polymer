/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

/* eslint-env node */
// const path = '/hn';
const path = 'https://gretchenscookbook-api.herokuapp.com';

module.exports = {
  staticFileGlobs: [
    '/index.html',
    '/cb-*.html',
    '/manifest.json',
    '/node_modules/@webcomponents/webcomponentsjs/webcomponents*.js',
    '/node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js'
  ],
  runtimeCaching: [
    {
      urlPattern: new RegExp(`${path}/api/(categories|category|subcategory|recipe)`),
      handler: 'networkFirst',
      options: {
        cache: {
          name: 'data-cache'
        }
      }
    }, {
      urlPattern: new RegExp(`${path}/item/`),
      handler: 'networkFirst',
      options: {
        cache: {
          maxEntries: 30,
          name: 'comments-cache'
        }
      }
    }
  ],
  navigateFallback: 'index.html',
};
