/* global self, caches, URL, location, Response */
/**
 * Service Worker - PWA Support
 * Offline support + Cache management
 */

const CACHE_NAME = 'zuhal-musik-v1';
const STATIC_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/js/modules/logger.js',
    '/js/modules/error-handler.js',
    '/js/modules/config-loader.js',
    '/js/modules/data-loader.js',
    '/js/modules/tab-manager.js',
    '/js/modules/chart-renderer.js',
    '/js/modules/filter-manager.js',
    '/js/modules/security-manager.js',
    '/js/modules/session-manager.js',
    '/js/modules/inventory-manager.js',
    '/js/modules/sales-analysis.js',
    '/js/modules/excel-export.js',
    '/js/modules/voice-search.js',
    '/js/modules/helpers.js'
];

// Install event - Cache static assets
self.addEventListener('install', event => {
    console.log('[SW] Installing...');
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_CACHE);
            })
            .then(() => {
                console.log('[SW] Skip waiting');
                return self.skipWaiting();
            })
    );
});

// Activate event - Clean old caches
self.addEventListener('activate', event => {
    console.log('[SW] Activating...');
    event.waitUntil(
        caches
            .keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[SW] Claiming clients');
                return self.clients.claim();
            })
    );
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip API requests (always fetch from network)
    if (url.pathname.startsWith('/api/')) {
        return;
    }

    // Skip external requests
    if (url.origin !== location.origin) {
        return;
    }

    // Network first strategy
    event.respondWith(
        fetch(request)
            .then(response => {
                // Clone response for caching
                const responseClone = response.clone();

                // Cache successful responses
                if (response.status === 200) {
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(request, responseClone);
                    });
                }

                return response;
            })
            .catch(() => {
                // Network failed, try cache
                return caches.match(request).then(cachedResponse => {
                    if (cachedResponse) {
                        console.log('[SW] Serving from cache:', request.url);
                        return cachedResponse;
                    }

                    // No cache, return offline page
                    if (request.destination === 'document') {
                        return caches.match('/index.html');
                    }

                    // Return error response
                    return new Response('Network error', {
                        status: 408,
                        headers: { 'Content-Type': 'text/plain' }
                    });
                });
            })
    );
});

// Message event - Handle messages from clients
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
            })
        );
    }
});

console.log('[SW] Service Worker loaded');
