
// This is a basic service worker file for PWA capabilities.
// It helps in making the "Add to Home Screen" prompt available.
// For a full offline experience, this file would need a more complex caching strategy.

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
  // event.waitUntil(
  //   caches.open('oso-app-cache-v1').then((cache) => {
  //     // Pre-cache essential assets here
  //     // return cache.addAll(['/', '/index.html', '/styles/main.css']);
  //   })
  // );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
});

self.addEventListener('fetch', (event) => {
  // console.log('Service Worker: Fetching', event.request.url);
  // Basic fetch handler (network first)
  event.respondWith(fetch(event.request));
});
