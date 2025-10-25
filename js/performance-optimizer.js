/**
 * 🚀 PERFORMANCE OPTIMIZER
 * Zuhal Müzik Dashboard - Performans İyileştirme Modülü
 * 
 * ÖZELLİKLER:
 * 1. Global Loading Spinner
 * 2. Debouncing (Arama gecikme)
 * 3. Memoization (Hesaplama önbellek)
 * 4. IndexedDB Cache (Veri önbellek)
 * 5. Performance Monitoring
 */

// ============================================
// 1. GLOBAL LOADING SPINNER YÖNETİMİ
// ============================================
const LoadingManager = {
    spinner: null,
    loadingText: null,
    activeOperations: 0,
    
    init() {
        // Eğer zaten varsa kullan, yoksa oluştur
        this.spinner = document.getElementById('channelLoadingSpinner');
        this.loadingText = document.getElementById('channelLoadingText');
        
        if (!this.spinner) {
            this.createSpinner();
        }
    },
    
    createSpinner() {
        const spinnerHTML = `
            <div id="globalLoadingSpinner" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9999; justify-content: center; align-items: center;">
                <div style="text-align: center;">
                    <div style="width: 80px; height: 80px; border: 8px solid rgba(255,255,255,0.2); border-top: 8px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                    <div style="color: white; font-size: 1.3em; font-weight: bold;" id="globalLoadingText">🔄 Yükleniyor...</div>
                    <div style="color: rgba(255,255,255,0.7); font-size: 0.9em; margin-top: 10px;">Lütfen bekleyin</div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', spinnerHTML);
        this.spinner = document.getElementById('globalLoadingSpinner');
        this.loadingText = document.getElementById('globalLoadingText');
    },
    
    show(message = '🔄 Yükleniyor...') {
        this.activeOperations++;
        if (this.spinner) {
            this.spinner.style.display = 'flex';
            if (this.loadingText) {
                this.loadingText.textContent = message;
            }
        }
    },
    
    hide() {
        this.activeOperations = Math.max(0, this.activeOperations - 1);
        if (this.activeOperations === 0 && this.spinner) {
            setTimeout(() => {
                if (this.activeOperations === 0) {
                    this.spinner.style.display = 'none';
                }
            }, 300);
        }
    }
};

// ============================================
// 2. DEBOUNCING - Arama Optimizasyonu
// ============================================
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// 3. MEMOIZATION - Hesaplama Önbelleği
// ============================================
const MemoCache = {
    cache: new Map(),
    maxSize: 100, // Maximum 100 kayıt
    
    get(key) {
        const item = this.cache.get(key);
        if (item && Date.now() - item.timestamp < 300000) { // 5 dakika geçerli
            return item.value;
        }
        return null;
    },
    
    set(key, value) {
        // Cache boyutu kontrolü
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        
        this.cache.set(key, {
            value: value,
            timestamp: Date.now()
        });
    },
    
    clear() {
        this.cache.clear();
    },
    
    // Fonksiyon memoization wrapper
    memoize(fn, keyGenerator) {
        return (...args) => {
            const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
            const cached = this.get(key);
            if (cached !== null) {
                console.log(`📦 Cache hit: ${key}`);
                return cached;
            }
            
            const result = fn(...args);
            this.set(key, result);
            return result;
        };
    }
};

// ============================================
// 4. INDEXEDDB CACHE - Veri Önbellekleme
// ============================================
const DataCache = {
    dbName: 'ZuhalMuzikDB',
    dbVersion: 1,
    db: null,
    
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onerror = () => {
                console.warn('⚠️ IndexedDB açılamadı, cache devre dışı');
                resolve(false);
            };
            
            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('✅ IndexedDB hazır');
                resolve(true);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Data store oluştur
                if (!db.objectStoreNames.contains('dataFiles')) {
                    const objectStore = db.createObjectStore('dataFiles', { keyPath: 'year' });
                    objectStore.createIndex('timestamp', 'timestamp', { unique: false });
                }
                
                // Metadata store
                if (!db.objectStoreNames.contains('metadata')) {
                    db.createObjectStore('metadata', { keyPath: 'key' });
                }
            };
        });
    },
    
    async getData(year) {
        if (!this.db) return null;
        
        return new Promise((resolve) => {
            const transaction = this.db.transaction(['dataFiles'], 'readonly');
            const objectStore = transaction.objectStore('dataFiles');
            const request = objectStore.get(String(year));
            
            request.onsuccess = () => {
                const result = request.result;
                if (result && Date.now() - result.timestamp < 3600000) { // 1 saat geçerli
                    console.log(`📦 Cache'den yüklendi: ${year}`);
                    resolve(result.data);
                } else {
                    resolve(null);
                }
            };
            
            request.onerror = () => resolve(null);
        });
    },
    
    async setData(year, data) {
        if (!this.db) return false;
        
        return new Promise((resolve) => {
            const transaction = this.db.transaction(['dataFiles'], 'readwrite');
            const objectStore = transaction.objectStore('dataFiles');
            const request = objectStore.put({
                year: String(year),
                data: data,
                timestamp: Date.now()
            });
            
            request.onsuccess = () => {
                console.log(`💾 Cache'e kaydedildi: ${year}`);
                resolve(true);
            };
            
            request.onerror = () => resolve(false);
        });
    },
    
    async clearOldCache() {
        if (!this.db) return;
        
        const transaction = this.db.transaction(['dataFiles'], 'readwrite');
        const objectStore = transaction.objectStore('dataFiles');
        const index = objectStore.index('timestamp');
        const oneHourAgo = Date.now() - 3600000;
        
        const request = index.openCursor();
        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                if (cursor.value.timestamp < oneHourAgo) {
                    objectStore.delete(cursor.primaryKey);
                }
                cursor.continue();
            }
        };
    }
};

// ============================================
// 5. PERFORMANCE MONITORING
// ============================================
const PerformanceMonitor = {
    metrics: {},
    performanceData: [],
    
    start(label) {
        this.metrics[label] = performance.now();
    },
    
    end(label) {
        if (this.metrics[label]) {
            const duration = performance.now() - this.metrics[label];
            console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
            
            // Performance verisini kaydet
            this.performanceData.push({
                label,
                duration,
                timestamp: Date.now(),
                url: window.location.href
            });
            
            // Sentry'ye gönder
            if (typeof Sentry !== 'undefined' && duration > 1000) { // 1 saniyeden uzun işlemler
                Sentry.addBreadcrumb({
                    message: `Slow operation: ${label}`,
                    level: 'warning',
                    data: { duration }
                });
            }
            
            delete this.metrics[label];
            return duration;
        }
        return 0;
    },
    
    measure(label, fn) {
        this.start(label);
        const result = fn();
        this.end(label);
        return result;
    },
    
    async measureAsync(label, fn) {
        this.start(label);
        const result = await fn();
        this.end(label);
        return result;
    },
    
    // Web Vitals ölçümü
    measureWebVitals() {
        // LCP (Largest Contentful Paint)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.performanceData.push({
                label: 'LCP',
                duration: lastEntry.startTime,
                timestamp: Date.now()
            });
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // FID (First Input Delay)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                this.performanceData.push({
                    label: 'FID',
                    duration: entry.processingStart - entry.startTime,
                    timestamp: Date.now()
                });
            });
        }).observe({ entryTypes: ['first-input'] });
        
        // CLS (Cumulative Layout Shift)
        new PerformanceObserver((entryList) => {
            let clsValue = 0;
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            this.performanceData.push({
                label: 'CLS',
                duration: clsValue,
                timestamp: Date.now()
            });
        }).observe({ entryTypes: ['layout-shift'] });
    },
    
    // Performance raporu al
    getPerformanceReport() {
        const report = {
            totalOperations: this.performanceData.length,
            averageDuration: 0,
            slowOperations: [],
            webVitals: {}
        };
        
        if (this.performanceData.length > 0) {
            report.averageDuration = this.performanceData.reduce((sum, item) => sum + item.duration, 0) / this.performanceData.length;
            report.slowOperations = this.performanceData.filter(item => item.duration > 1000);
            
            // Web Vitals'ı grupla
            this.performanceData.forEach(item => {
                if (['LCP', 'FID', 'CLS'].includes(item.label)) {
                    if (!report.webVitals[item.label]) {
                        report.webVitals[item.label] = [];
                    }
                    report.webVitals[item.label].push(item.duration);
                }
            });
        }
        
        return report;
    }
};

// ============================================
// 6. CHUNK PROCESSING - Büyük Veri İşleme
// ============================================
async function processInChunks(array, processor, chunkSize = 1000) {
    const results = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        const chunk = array.slice(i, i + chunkSize);
        const chunkResults = await new Promise(resolve => {
            setTimeout(() => {
                resolve(chunk.map(processor));
            }, 0);
        });
        results.push(...chunkResults);
        
        // Progress update
        const progress = Math.round((i + chunk.length) / array.length * 100);
        console.log(`📊 İşleniyor: %${progress}`);
    }
    return results;
}

// ============================================
// INITIALIZATION
// ============================================
(function() {
    console.log('🚀 Performance Optimizer yüklendi');
    
    // DOM hazır olduğunda başlat
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            LoadingManager.init();
            DataCache.init();
        });
    } else {
        LoadingManager.init();
        DataCache.init();
    }
    
    // Global erişim için
    window.PerformanceOptimizer = {
        LoadingManager,
        debounce,
        MemoCache,
        DataCache,
        PerformanceMonitor,
        processInChunks
    };
    
    console.log('✅ Performance Optimizer hazır');
})();

// ============================================
// EXPORT (Mevcut kodla uyumlu)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LoadingManager,
        debounce,
        MemoCache,
        DataCache,
        PerformanceMonitor,
        processInChunks
    };
}

