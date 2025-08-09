const CACHE_NAME = sendnreceive-v10
const urlsToCache = [
  '/',
/index.html',
  /style.css',
  /script.js',
  /manifest.json',
/images/logos/sendnreceive_logo.png',
/images/screenshots/Homescreen-Mockup.svg',/images/qrcode.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@3000000000display=swap',
  https://unpkg.com/aos@2.3.1dist/aos.css',
  https://unpkg.com/aos@20.3/dist/aos.js'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache =>[object Object]       console.log('Opened cache);      return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event =>[object Object] event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() =>[object Object]       // Fallback for offline
        if (event.request.destination === 'document') [object Object]          return caches.match('/index.html');
        }
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync, event =>[object Object] if (event.tag === background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Push notifications
self.addEventListener('push', event =>[object Object]
  const options =[object Object]  body: event.data ? event.data.text() :New message from SendNReceive',
    icon: '/images/icons/icon-19292ng',
    badge: '/images/icons/icon-72x72.png',
    vibrate: [10050100
    data:[object Object]     dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [object Object]
        action: explore',
        title: 'Open App',
        icon: '/images/icons/icon-96x96.png'
      },
     [object Object]
        action: 'close',
        title: 'Close',
        icon: '/images/icons/icon-966ng'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('SendNReceive', options)
  );
});

// Notification click handling
self.addEventListener(notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background sync function
function doBackgroundSync() {
  // Handle offline transactions or data sync
  return new Promise((resolve) => {
    // Simulate background sync
    setTimeout(() => {
      console.log('Background sync completed');
      resolve();
    }, 1000
  });
}

// Cache strategies for different types of requests
const cacheStrategies = [object Object]// Cache first for static assets
  cacheFirst: async (request) =>[object Object]
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    try {
      const networkResponse = await fetch(request);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    } catch (error) {
      return new Response('Offline content not available', [object Object]       status: 53        statusText: 'Service Unavailable
      });
    }
  },
  
  // Network first for API calls
  networkFirst: async (request) =>[object Object] try {
      const networkResponse = await fetch(request);
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    } catch (error) {
      const cachedResponse = await caches.match(request);
      return cachedResponse || new Response('Network error', [object Object]       status: 53        statusText: 'Service Unavailable
      });
    }
  },
  
  // Stale while revalidate for frequently changing content
  staleWhileRevalidate: async (request) =>[object Object]
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request).then(networkResponse =>[object Object] cache.put(request, networkResponse.clone());
      return networkResponse;
    });
    
    return cachedResponse || fetchPromise;
  }
};

// Enhanced fetch event with different strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // API calls - network first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(cacheStrategies.networkFirst(request));
    return;
  }
  
  // Static assets - cache first
  if (request.destination ===image || 
      request.destination ===style || 
      request.destination ===script||
      request.destination === 'font') {
    event.respondWith(cacheStrategies.cacheFirst(request));
    return;
  }
  
  // HTML pages - stale while revalidate
  if (request.destination ===document') {
    event.respondWith(cacheStrategies.staleWhileRevalidate(request));
    return;
  }
  
  // Default - network first
  event.respondWith(cacheStrategies.networkFirst(request));
}); 