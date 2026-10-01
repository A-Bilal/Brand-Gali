// BrandGali Service Worker for PWA and Mobile Push Notifications
const CACHE_NAME = 'brandgali-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/brands.html',
  '/live-sales.html',
  '/assets/brandgali-logo.png',
  '/assets/brandgali-logo.jpeg',
  '/assets/favicon.png',
  '/assets/apple-touch-icon.png'
];

// Install: Cache critical shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {
        // Soft fail if any asset is missing during initial install
      });
    })
  );
  self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network first with fallback to cache for offline resilience
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  // Ignore chrome-extension and non-http schemes
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache).catch(() => {});
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// Push Notification Listener (Triggers when an OS push arrives)
self.addEventListener('push', (event) => {
  let data = {
    title: 'BrandGali Sale Alert! 🔥',
    body: 'One of your followed brands just went on sale!',
    icon: '/assets/brandgali-logo.png',
    badge: '/assets/favicon.png',
    tag: 'brandgali-sale-alert',
    data: { url: '/live-sales.html' }
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      data = Object.assign({}, data, payload);
    } catch (_) {
      data.body = event.data.text() || data.body;
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/assets/brandgali-logo.png',
    badge: data.badge || '/assets/favicon.png',
    tag: data.tag || 'brandgali-alert',
    renotify: true,
    vibrate: [200, 100, 200],
    data: data.data || { url: '/live-sales.html' }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification Click Handler: Open the live sale page when user taps notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/live-sales.html';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it and navigate
      for (const client of clientList) {
        if (client.url.includes('brandgali') || client.url.includes(self.location.origin)) {
          client.focus();
          return client.navigate(targetUrl);
        }
      }
      // Otherwise open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
