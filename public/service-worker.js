const CACHE_NAME = 'air-quality-v3';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
];

// Install event - cache static assets and take control immediately
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .catch((err) => console.error('[Service Worker] Cache failed:', err))
      .then(() => self.skipWaiting()),
  );
});

// Activate event - clean up old caches and claim all clients
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[Service Worker] Deleting old cache:', name);
            return caches.delete(name);
          }),
      ))
      .then(() => self.clients.claim()),
  );
});

// Listen for SKIP_WAITING from the app UI to activate a waiting worker immediately
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[Service Worker] Skip waiting message received');
    self.skipWaiting();
  }
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension requests and unsupported schemes
  if (url.protocol === 'chrome-extension:' || !url.protocol.startsWith('http')) {
    return;
  }

  // Strategy for API calls: Network first, then cache
  if (url.hostname.includes('openweathermap.org') ||
      url.hostname.includes('restcountries.com')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(() => caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[Service Worker] Serving API from cache:', url.pathname);
            return cachedResponse;
          }

          return new Response(
            JSON.stringify({
              error: 'Offline',
              message: 'You are currently offline. Some data may be unavailable.',
            }),
            { headers: { 'Content-Type': 'application/json' } },
          );
        })),
    );
    return;
  }

  // Strategy for navigation requests (HTML): Network first, then cache.
  // This ensures users always get the latest HTML with current asset hashes
  // after a deploy, instead of stale cached HTML referencing old bundles.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(() => caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[Service Worker] Serving navigation from cache:', url.pathname);
            return cachedResponse;
          }
          return caches.match('/index.html');
        })),
    );
    return;
  }

  // Strategy for static assets: Stale-while-revalidate.
  // Return cached version immediately (fast), then update cache in background.
  // Hashed JS/CSS assets are immutable, so cache-first is safe. Unhashed assets
  // (e.g. images) get refreshed in the background without blocking the UI.
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const networkFetch = fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(() => {
          console.log('[Service Worker] Network failed, no cache:', url.pathname);
        });

      return cachedResponse || networkFetch.then((response) => {
        if (response) {
          return response;
        }
        return new Response('Offline', { status: 503 });
      });
    }),
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-favorites') {
    console.log('[Service Worker] Background sync: sync-favorites');
    event.waitUntil(syncFavorites());
  }
});

async function syncFavorites() {
  console.log('[Service Worker] Syncing favorites...');
}

// Push notifications (for future AQI alerts)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();

    const options = {
      body: data.body || 'Air quality alert',
      icon: '/logo192.png',
      badge: '/favicon.ico',
      tag: data.tag || 'aqi-alert',
      requireInteraction: true,
      actions: [
        { action: 'open', title: 'View Details' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
    };

    event.waitUntil(
      self.registration.showNotification(
        data.title || 'Air Quality Alert',
        options,
      ),
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(clients.openWindow('/'));
  }
});
