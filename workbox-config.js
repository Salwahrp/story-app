// workbox-config.js
module.exports = {
    globDirectory: './',
    globPatterns: [
      '**/*.{html,js,css,png,jpg,svg,json}',
      'offline.html',
      './public/fallback-image.png'
    ],
    swDest: 'sw.js',
    ignoreURLParametersMatching: [
      /^utm_/,
      /^fbclid$/
    ],
    runtimeCaching: [
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
          },
        },
      },
      {
        urlPattern: /\.(?:js|css)$/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'static-resources',
          expiration: {
            maxEntries: 30,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
          },
        },
      },
      {
        urlPattern: /\.(?:html)$/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'pages',
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 24 * 60 * 60, // 24 Hours
          },
          networkTimeoutSeconds: 3,
        },
      },
      {
        urlPattern: new RegExp('^https://fonts.(?:googleapis|gstatic).com/(.*)'),
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'google-fonts',
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
          },
        },
      },
      {
        urlPattern: new RegExp('^https://unpkg.com/'),
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'cdn-assets',
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
          },
        },
      },
    ],
    navigationPreload: true,
    clientsClaim: true,
    skipWaiting: true,
  };