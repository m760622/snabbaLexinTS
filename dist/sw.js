/**
 * SnabbaLexin Service Worker
 * Professional Edition - High Performance Caching
 */

const CACHE_NAME = 'snabba-lexin-v4';
const STATIC_ASSETS = [
    './',
    './index.html',
    './assets/images/icon.svg',
    './assets/images/icon.png',
    './manifest.json'
];

// Add data files to dynamic cache
const DYNAMIC_ASSETS = [
    './data/data.json'
];

const ALL_ASSETS = [...STATIC_ASSETS, ...DYNAMIC_ASSETS];

// Access self
const sw = self;

// Install Event - Cache all assets
sw.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching all assets');
                return cache.addAll(ALL_ASSETS).catch(err => console.warn('[SW] Cache addAll failed:', err));
            })
            .then(() => sw.skipWaiting())
    );
});

// Activate Event - Clean up old caches
sw.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => {
                return Promise.all(
                    keys.map((key) => {
                        if (key !== CACHE_NAME) {
                            console.log('[SW] Removing old cache:', key);
                            return caches.delete(key);
                        }
                    })
                );
            })
            .then(() => sw.clients.claim())
    );
});

// Fetch Event - Cache First with Network Fallback strategy
sw.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip external requests (fonts, analytics, etc.)
    if (!event.request.url.startsWith(sw.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Return cached version immediately
                    // Also fetch from network to update cache in background (Stale While Revalidate)
                    fetch(event.request)
                        .then((networkResponse) => {
                            // Only cache successful responses
                            if (networkResponse && networkResponse.status === 200) {
                                const responseClone = networkResponse.clone();
                                caches.open(CACHE_NAME)
                                    .then((cache) => {
                                        cache.put(event.request, responseClone);
                                    });
                            }
                            return networkResponse;
                        })
                        .catch(() => {
                            // Network failed, but we already returned cache
                        });

                    return cachedResponse;
                }

                // No cache, fetch from network
                return fetch(event.request)
                    .then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            const responseClone = networkResponse.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, responseClone);
                                });
                        }
                        return networkResponse;
                    })
                    .catch((error) => {
                        // Network failed and no cache
                        const acceptValue = event.request.headers.get('accept');
                        if (acceptValue && acceptValue.includes('text/html')) {
                            return caches.match('./index.html');
                        }
                        throw error;
                    });
            })
    );
});

// Handle messages from main thread
sw.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        sw.skipWaiting();
    }

    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const { title, body, icon, badge, tag, data } = event.data;

        sw.registration.showNotification(title, {
            body: body,
            icon: icon || './assets/images/icon.png',
            badge: badge || './assets/images/icon.png',
            tag: tag || 'snabba-lexin-notification',
            data: data || { url: './' },
            vibrate: [100, 50, 100]
        });
    }
});

// Handle notification click
sw.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const urlToOpen = event.notification.data?.url || './';

    event.waitUntil(
        sw.clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((windowClients) => {
                for (let i = 0; i < windowClients.length; i++) {
                    const client = windowClients[i];
                    if (client.url.includes('index.html') || client.url === sw.location.origin + '/') {
                        return client.focus();
                    }
                }
                return sw.clients.openWindow(urlToOpen);
            })
    );
});
