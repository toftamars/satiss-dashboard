/**
 * 🔧 Service Worker
 * Offline çalışma ve cache yönetimi
 */

const CACHE_NAME = 'zuhal-muzik-v2.0.0';
const CACHE_URLS = [
    '/',
    '/index.html',
    '/css/dashboard.css',
    '/js/modules/config.js',
    '/js/modules/cache.js',
    '/js/modules/auth.js',
    '/js/modules/error-handler.js',
    '/js/modules/input-validator.js',
    '/js/modules/rate-limiter.js',
    '/js/modules/encryption.js',
    '/js/modules/api.js',
    '/js/modules/data-loader.js',
    '/js/modules/lazy-loader.js',
    '/js/modules/progressive-loader.js',
    '/js/modules/charts.js',
    '/js/modules/dashboard.js',
    '/js/modules/ui.js',
    '/js/modules/init.js'
];

/**
 * Service Worker kurulumu
 */
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker kuruluyor...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Cache açıldı');
                return cache.addAll(CACHE_URLS);
            })
            .then(() => {
                console.log('✅ Tüm dosyalar cache\'lendi');
                return self.skipWaiting();
            })
    );
});

/**
 * Eski cache'leri temizle
 */
self.addEventListener('activate', (event) => {
    console.log('🔄 Service Worker aktifleştiriliyor...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Eski cache siliniyor:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✅ Service Worker aktif');
            return self.clients.claim();
        })
    );
});

/**
 * Fetch isteklerini yakala
 * Stratej: Cache First (önce cache'e bak, yoksa network'ten al)
 */
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // Sadece kendi domain'imiz için cache kullan
    if (url.origin !== location.origin) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    console.log('⚡ Cache\'den alındı:', event.request.url);
                    return cachedResponse;
                }
                
                // Cache'de yok, network'ten al
                return fetch(event.request)
                    .then((response) => {
                        // Başarılı response'u cache'le
                        if (response && response.status === 200) {
                            const responseToCache = response.clone();
                            
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, responseToCache);
                                });
                        }
                        
                        return response;
                    })
                    .catch((error) => {
                        console.error('❌ Fetch hatası:', error);
                        
                        // Offline fallback
                        if (event.request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                        
                        throw error;
                    });
            })
    );
});

/**
 * Background sync (arka plan senkronizasyonu)
 */
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-data') {
        console.log('🔄 Arka plan senkronizasyonu başlatılıyor...');
        
        event.waitUntil(
            // Veri senkronizasyonu yap
            fetch('/data-metadata.json')
                .then((response) => response.json())
                .then((data) => {
                    console.log('✅ Veri senkronize edildi');
                })
                .catch((error) => {
                    console.error('❌ Senkronizasyon hatası:', error);
                })
        );
    }
});

/**
 * Push notification
 */
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    
    const options = {
        body: data.body || 'Yeni veri mevcut!',
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        vibrate: [200, 100, 200],
        data: {
            url: data.url || '/'
        }
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'Zuhal Müzik Dashboard', options)
    );
});

/**
 * Notification click
 */
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});

console.log('🔧 Service Worker yüklendi');

