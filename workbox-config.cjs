// workbox-config.js
module.exports = {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{js,css,html,png,jpg,svg,json}',
    'offline.html',
    'assets/fallback-image.png'
  ],
  globIgnores: [
    '**/node_modules/**',
    'dist/**',
    'public/sw.js',
    'public/sw.js.map',
    'public/workbox-*.js',
    'workbox-config.cjs'
  ],
  swDest: 'dist/sw.js',
  modifyURLPrefix: {
    '': '/'
  },
  runtimeCaching: [
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images-cache',
      },
    },
    {
      urlPattern: /\.(?:js|css)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      },
    },
    {
      urlPattern: /\.(?:html)$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 24 * 60 * 60, // 24 Hours
        },
        networkTimeoutSeconds: 3,
        cacheableResponse: {
          statuses: [0, 200]
        }
      },
    },
    {
      urlPattern: /^https:\/\/story-api\.dicoding\.dev\/v1\/(stories|auth)/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // 5 minutes for API responses
        },
        networkTimeoutSeconds: 10,
        cacheableResponse: {
          statuses: [0, 200]
        }
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/(.*)/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      },
    },
    {
      urlPattern: /^https:\/\/unpkg\.com\//,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'cdn-cache',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      },
    }
  ],
  skipWaiting: true,
  clientsClaim: true,
  navigateFallback: '/offline.html',
};