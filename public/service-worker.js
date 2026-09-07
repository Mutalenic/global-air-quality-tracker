const CACHE_NAME = 'air-quality-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).catch((err) => {
      console.error('[Service Worker] Cache failed:', err);
    })
  );
  
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[Service Worker] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Strategy for API calls: Network first, then cache
  if (url.hostname.includes('openweathermap.org') || 
      url.hostname.includes('restcountries.com')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone the response before caching
          const responseClone = response.clone();
          
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          
          return response;
        })
        .catch(() => {
          // Return cached version if network fails
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              console.log('[Service Worker] Serving API from cache:', url.pathname);
              return cachedResponse;
            }
            
            // Return offline fallback for API
            return new Response(
              JSON.stringify({
                error: 'Offline',
                message: 'You are currently offline. Some data may be unavailable.',
              }),
              {
                headers: { 'Content-Type': 'application/json' },
              }
            );
          });
        })
    );
    return;
  }
  
  // Strategy for navigation requests (HTML): Network first, then cache.
  // This ensures users always get the latest HTML with up-to-date asset
  // hashes after a deploy, instead of a stale cached page referencing
  // old (now-nonexistent) bundle hashes.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });

          return response;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              console.log('[Service Worker] Serving navigation from cache:', url.pathname);
              return cachedResponse;
            }

            return caches.match('/index.html');
          });
        })
    );
    return;
  }

  // Strategy for static assets: Cache first, then network.
  // Hashed assets (e.g. /assets/index-*.js) are immutable, so cache-first
  // is safe and fast. Unhashed assets fall through here too and get
  // refreshed in the background.
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version immediately
        // Then update cache in background
        fetch(request)
          .then((response) => {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, response);
            });
          })
          .catch(() => {
            // Network failed, but we have cached version
          });

        return cachedResponse;
      }

      // Not in cache, fetch from network
      return fetch(request)
        .then((response) => {
          const responseClone = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });

          return response;
        })
        .catch(() => {
          // Network failed and not in cache
          console.log('[Service Worker] Network failed, no cache:', url.pathname);

          return new Response('Offline', { status: 503 });
        });
    })
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
  // Get favorites from IndexedDB and sync when back online
  // This is a placeholder - actual implementation would use IndexedDB
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
        {
          action: 'open',
          title: 'View Details',
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
        },
      ],
    };
    
    event.waitUntil(
      self.registration.showNotification(
        data.title || 'Air Quality Alert',
        options
      )
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
