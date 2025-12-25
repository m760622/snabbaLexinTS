/**
 * SnabbaLexin Service Worker
 * Professional Edition - High Performance Caching
 */

const CACHE_NAME = 'snabba-lexin-v4';
const STATIC_ASSETS = [
    './',
    './index.html',
    './games/games.html',
    './learn/learn.html',
    './assets/css/style.css',
    './assets/css/details-premium.css',
    './assets/css/points-style.css',
    './assets/images/icon.svg',
    './assets/images/icon.png',
    './manifest.json'
];

// Add data files to dynamic cache
const DYNAMIC_ASSETS = [
    './data/data.json',
    './data/wordConnectData.js'
];

const ALL_ASSETS = [...STATIC_ASSETS, ...DYNAMIC_ASSETS];

// Access self as any to bypass TS strict matching for Window vs Worker
const sw = self as any;

// Install Event - Cache all assets
sw.addEventListener('install', (event: any) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching all assets');
                return cache.addAll(ALL_ASSETS);
            })
            .then(() => sw.skipWaiting())
    );
});

// Activate Event - Clean up old caches
sw.addEventListener('activate', (event: any) => {
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
sw.addEventListener('fetch', (event: any) => {
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
                            console.log('[SW] Network failed, using cache for:', event.request.url);
                        });

                    // Return cached response immediately
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
                        console.log('[SW] Network failed and no cache for:', event.request.url);
                        // For HTML requests, try to return the main page
                        const acceptValue = event.request.headers.get('accept');
                        if (acceptValue && acceptValue.includes('text/html')) {
                            return caches.match('./index.html') as Promise<Response>;
                        }
                        // Re-throw to avoid returning undefined to the browser
                        throw error;
                    });
            })
    );
});

// Handle messages from main thread
sw.addEventListener('message', (event: any) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        sw.skipWaiting();
    }

    // Handle notification request from main thread
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const { title, body, icon, badge, tag, data } = event.data;

        sw.registration.showNotification(title, {
            body: body,
            icon: icon || './assets/images/icon.png',
            badge: badge || './assets/images/icon.png',
            tag: tag || 'snabba-lexin-notification',
            data: data || { url: './' },
            vibrate: [100, 50, 100],
            requireInteraction: false
        }).then(() => {
            console.log('[SW] Notification shown:', title);
        }).catch((err: any) => {
            console.error('[SW] Error showing notification:', err);
        });
    }

    if (event.data && event.data.type === 'SHOW_WOD_NOTIFICATION') {
        const { word, translation, wordId } = event.data;

        sw.registration.showNotification('📚 Dagens Ord / كلمة اليوم', {
            body: `${word}\n${translation}`,
            icon: './assets/images/icon.png',
            badge: './assets/images/icon.png',
            tag: 'word-of-day',
            data: { url: `./details.html?id=${wordId}` },
            vibrate: [100, 50, 100],
            requireInteraction: false,
            actions: [
                { action: 'view', title: 'Visa / عرض' },
                { action: 'dismiss', title: 'Stäng / إغلاق' }
            ]
        }).then(() => {
            console.log('[SW] WOD Notification shown:', word);
        }).catch((err: any) => {
            console.error('[SW] Error showing WOD notification:', err);
        });
    }
});

// Handle notification click - open the app
sw.addEventListener('notificationclick', (event: any) => {
    console.log('[SW] Notification clicked');
    event.notification.close();

    const urlToOpen = event.notification.data?.url || './';

    event.waitUntil(
        sw.clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((windowClients: any[]) => {
                // Check if there's already a window open
                for (let i = 0; i < windowClients.length; i++) {
                    const client = windowClients[i];
                    if (client.url.includes('snabbaLexin') || client.url.includes('index.html')) {
                        // Focus existing window
                        return client.focus();
                    }
                }
                // Open new window if none found
                return sw.clients.openWindow(urlToOpen);
            })
    );
});

// Handle notification close (optional tracking)
sw.addEventListener('notificationclose', (_event: any) => {
    console.log('[SW] Notification closed');
});
