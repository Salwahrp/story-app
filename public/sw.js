if(!self.define){let e,s={};const n=(n,c)=>(n=new URL(n+".js",c).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn't register its module`);return e})));self.define=(c,i)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let a={};const o=e=>n(e,t),r={module:{uri:t},exports:a,require:o};s[t]=Promise.all(c.map((e=>r[e]||o(e)))).then((e=>(i(...e),a)))}}define(["./workbox-fc8d3aac"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/fallback-image.png",revision:"283e6d640096d400e4629b9b20fc4372"},{url:"assets/icon-128.png",revision:"9b2b5470c089802ed74729e070c11c53"},{url:"assets/icon-144.png",revision:"6bc5f0c66119b44ceb80b30c26e0064e"},{url:"assets/icon-152.png",revision:"6b19d119fced4ac6eb0a2c4d6ef187c8"},{url:"assets/icon-192.png",revision:"3f8feb20ecb1832fa6bb1f11318a5043"},{url:"assets/icon-384.png",revision:"ffdfc52c998bb6f382a9e201accee806"},{url:"assets/icon-512.png",revision:"d809f6d17ff294e9c1f2fa6c1d465210"},{url:"assets/icon-72.png",revision:"391ba6d9af9892383d9111edf32935d6"},{url:"assets/icon-96.png",revision:"bb047204662254cf2329c13cbe1cfb19"},{url:"assets/vite.svg",revision:"8e3a10e157f75ada21ab742c022d5430"},{url:"offline.html",revision:"bac6ba1f548f46dc281bfb281e58587e"}],{}),e.registerRoute(/\.(?:png|jpg|jpeg|svg|gif|webp)$/,new e.CacheFirst({cacheName:"images",plugins:[new e.ExpirationPlugin({maxEntries:100,maxAgeSeconds:2592e3}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET"),e.registerRoute(/\.(?:js|css)$/,new e.StaleWhileRevalidate({cacheName:"static-resources",plugins:[new e.ExpirationPlugin({maxEntries:50,maxAgeSeconds:604800}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET"),e.registerRoute(/\.(?:html)$/,new e.NetworkFirst({cacheName:"pages",networkTimeoutSeconds:3,plugins:[new e.ExpirationPlugin({maxEntries:30,maxAgeSeconds:86400}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET"),e.registerRoute(/^https:\/\/story-api\.dicoding\.dev\/v1\/(stories|auth)/,new e.NetworkFirst({cacheName:"api-cache",networkTimeoutSeconds:5,plugins:[new e.ExpirationPlugin({maxEntries:50,maxAgeSeconds:300}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/(.*)/,new e.StaleWhileRevalidate({cacheName:"google-fonts",plugins:[new e.ExpirationPlugin({maxEntries:20,maxAgeSeconds:2592e3}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET"),e.registerRoute(/^https:\/\/unpkg\.com\//,new e.StaleWhileRevalidate({cacheName:"cdn-cache",plugins:[new e.ExpirationPlugin({maxEntries:30,maxAgeSeconds:604800}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET")}));

self.addEventListener('push', function(event) {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { body: event.data.text() };
    }
  }
  const title = data.title || 'Push Notification';
  const options = {
    body: data.body || 'You have a new message!',
    icon: '/assets/icon-192.png',
    badge: '/assets/icon-96.png',
    data: data.url || '/'
  };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data)
  );
});

//# sourceMappingURL=sw.js.map
