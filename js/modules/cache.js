/**
 * 💾 Cache Management Module
 * Akıllı cache sistemi, versiyonlama ve performans optimizasyonu
 */

class CacheManager {
    constructor() {
        this.cache = new Map();
        this.metadata = null;
        this.cacheConfig = {
            // Cache süreleri (milisaniye)
            daily: 24 * 60 * 60 * 1000,    // 24 saat
            hourly: 60 * 60 * 1000,        // 1 saat
            session: 60 * 60 * 1000,        // 1 saat (session)
            
            // Cache boyut limitleri
            maxCacheSize: 50 * 1024 * 1024, // 50MB
            maxItems: 1000,
            
            // Otomatik temizlik
            autoCleanup: true,
            cleanupInterval: 30 * 60 * 1000  // 30 dakika
        };
        
        this.init();
    }

    /**
     * Cache manager'ı başlat
     */
    init() {
        console.log('💾 CacheManager initialized');
        
        // Otomatik temizlik başlat
        if (this.cacheConfig.autoCleanup) {
            setInterval(() => {
                this.cleanup();
            }, this.cacheConfig.cleanupInterval);
        }
    }

    /**
     * Günlük cache versiyonu al
     */
    getDailyVersion() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }

    /**
     * Saatlik cache versiyonu al
     */
    getHourlyVersion() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        return `${year}${month}${day}${hour}`;
    }

    /**
     * Cache key oluştur
     */
    createCacheKey(type, identifier, version = null) {
        const v = version || this.getDailyVersion();
        return `${type}:${identifier}:${v}`;
    }

    /**
     * Cache'e veri kaydet
     */
    set(key, data, ttl = null) {
        const expiry = ttl ? Date.now() + ttl : null;
        const cacheItem = {
            data: data,
            timestamp: Date.now(),
            expiry: expiry,
            size: this.calculateSize(data),
            accessCount: 0,
            lastAccess: Date.now()
        };

        this.cache.set(key, cacheItem);
        
        // Boyut kontrolü
        this.checkCacheSize();
        
        console.log(`💾 Cache kaydedildi: ${key} (${this.formatSize(cacheItem.size)})`);
    }

    /**
     * Cache'den veri al
     */
    get(key) {
        const item = this.cache.get(key);
        
        if (!item) {
            return null;
        }

        // Expiry kontrolü
        if (item.expiry && Date.now() > item.expiry) {
            this.cache.delete(key);
            console.log(`🗑️ Cache süresi dolmuş: ${key}`);
            return null;
        }

        // Access tracking
        item.accessCount++;
        item.lastAccess = Date.now();
        
        console.log(`📖 Cache okundu: ${key} (${item.accessCount} kez erişildi)`);
        return item.data;
    }

    /**
     * Cache'de veri var mı kontrol et
     */
    has(key) {
        const item = this.cache.get(key);
        
        if (!item) {
            return false;
        }

        // Expiry kontrolü
        if (item.expiry && Date.now() > item.expiry) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }

    /**
     * Cache'den veri sil
     */
    delete(key) {
        const deleted = this.cache.delete(key);
        if (deleted) {
            console.log(`🗑️ Cache silindi: ${key}`);
        }
        return deleted;
    }

    /**
     * Tüm cache'i temizle
     */
    clear() {
        this.cache.clear();
        console.log('🗑️ Tüm cache temizlendi');
    }

    /**
     * Metadata cache'le
     */
    cacheMetadata(metadata) {
        const key = this.createCacheKey('metadata', 'main', this.getHourlyVersion());
        this.set(key, metadata, this.cacheConfig.hourly);
        this.metadata = metadata;
    }

    /**
     * Metadata cache'den al
     */
    getCachedMetadata() {
        const key = this.createCacheKey('metadata', 'main', this.getHourlyVersion());
        return this.get(key);
    }

    /**
     * Yıl verisi cache'le
     */
    cacheYearData(year, data) {
        const key = this.createCacheKey('year', year, this.getDailyVersion());
        this.set(key, data, this.cacheConfig.daily);
    }

    /**
     * Yıl verisi cache'den al
     */
    getCachedYearData(year) {
        const key = this.createCacheKey('year', year, this.getDailyVersion());
        return this.get(key);
    }

    /**
     * Hedef verisi cache'le
     */
    cacheTargets(targets) {
        const key = this.createCacheKey('targets', 'main', this.getHourlyVersion());
        this.set(key, targets, this.cacheConfig.hourly);
    }

    /**
     * Hedef verisi cache'den al
     */
    getCachedTargets() {
        const key = this.createCacheKey('targets', 'main', this.getHourlyVersion());
        return this.get(key);
    }

    /**
     * Stok verisi cache'le
     */
    cacheInventoryData(data) {
        const key = this.createCacheKey('inventory', 'main', this.getDailyVersion());
        this.set(key, data, this.cacheConfig.daily);
    }

    /**
     * Stok verisi cache'den al
     */
    getCachedInventoryData() {
        const key = this.createCacheKey('inventory', 'main', this.getDailyVersion());
        return this.get(key);
    }

    /**
     * Session cache'le
     */
    cacheSession(sessionData) {
        const key = this.createCacheKey('session', 'user', this.getDailyVersion());
        this.set(key, sessionData, this.cacheConfig.session);
    }

    /**
     * Session cache'den al
     */
    getCachedSession() {
        const key = this.createCacheKey('session', 'user', this.getDailyVersion());
        return this.get(key);
    }

    /**
     * Cache boyutunu hesapla
     */
    calculateSize(data) {
        try {
            const jsonString = JSON.stringify(data);
            return new Blob([jsonString]).size;
        } catch (error) {
            console.warn('Cache boyut hesaplama hatası:', error);
            return 0;
        }
    }

    /**
     * Cache boyutunu kontrol et
     */
    checkCacheSize() {
        let totalSize = 0;
        let itemCount = 0;

        for (const [key, item] of this.cache) {
            totalSize += item.size;
            itemCount++;
        }

        // Boyut limiti kontrolü
        if (totalSize > this.cacheConfig.maxCacheSize || itemCount > this.cacheConfig.maxItems) {
            console.warn('⚠️ Cache boyut limiti aşıldı, temizlik yapılıyor...');
            this.cleanup();
        }
    }

    /**
     * Cache temizliği
     */
    cleanup() {
        const now = Date.now();
        const itemsToDelete = [];

        // 1) Süresi dolanları temizle
        for (const [key, item] of this.cache) {
            if (item.expiry && now > item.expiry) {
                itemsToDelete.push(key);
            }
        }

        // 2) Gereksizse LRU temizlik yapma
        // Toplam boyutu ve öğe sayısını hesapla
        let totalSize = 0;
        for (const [, item] of this.cache) {
            totalSize += item.size || 0;
        }

        const overItemLimit = this.cache.size > this.cacheConfig.maxItems;
        const overSizeLimit = totalSize > this.cacheConfig.maxCacheSize;

        if (itemsToDelete.length === 0 && (overItemLimit || overSizeLimit)) {
            // Limitler aşıldıysa en az erişilen %20'yi kaldır
            const sortedItems = Array.from(this.cache.entries())
                .sort((a, b) => (a[1].lastAccess || 0) - (b[1].lastAccess || 0));
            const itemsToRemove = Math.max(1, Math.floor(this.cache.size * 0.2));
            for (let i = 0; i < itemsToRemove && i < sortedItems.length; i++) {
                itemsToDelete.push(sortedItems[i][0]);
            }
        }

        // 3) Silme işlemlerini uygula
        itemsToDelete.forEach(key => {
            this.cache.delete(key);
        });

        if (itemsToDelete.length > 0) {
            console.log(`🧹 Cache temizlendi: ${itemsToDelete.length} öğe silindi`);
        }
    }

    /**
     * Cache istatistikleri
     */
    getStats() {
        let totalSize = 0;
        let itemCount = 0;
        let expiredCount = 0;
        const now = Date.now();

        for (const [key, item] of this.cache) {
            totalSize += item.size;
            itemCount++;
            
            if (item.expiry && now > item.expiry) {
                expiredCount++;
            }
        }

        return {
            itemCount,
            totalSize: this.formatSize(totalSize),
            expiredCount,
            hitRate: this.calculateHitRate(),
            oldestItem: this.getOldestItem(),
            newestItem: this.getNewestItem()
        };
    }

    /**
     * Hit rate hesapla
     */
    calculateHitRate() {
        let totalAccess = 0;
        let totalItems = 0;

        for (const [key, item] of this.cache) {
            totalAccess += item.accessCount;
            totalItems++;
        }

        return totalItems > 0 ? (totalAccess / totalItems).toFixed(2) : 0;
    }

    /**
     * En eski öğeyi al
     */
    getOldestItem() {
        let oldest = null;
        let oldestTime = Date.now();

        for (const [key, item] of this.cache) {
            if (item.timestamp < oldestTime) {
                oldestTime = item.timestamp;
                oldest = { key, timestamp: item.timestamp };
            }
        }

        return oldest;
    }

    /**
     * En yeni öğeyi al
     */
    getNewestItem() {
        let newest = null;
        let newestTime = 0;

        for (const [key, item] of this.cache) {
            if (item.timestamp > newestTime) {
                newestTime = item.timestamp;
                newest = { key, timestamp: item.timestamp };
            }
        }

        return newest;
    }

    /**
     * Boyut formatla
     */
    formatSize(bytes) {
        if (bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Cache durumunu logla
     */
    logStats() {
        const stats = this.getStats();
        console.log('📊 Cache İstatistikleri:', stats);
    }

    /**
     * Cache'i localStorage'a kaydet
     */
    saveToLocalStorage() {
        try {
            const cacheData = {
                items: Array.from(this.cache.entries()),
                timestamp: Date.now(),
                version: this.getDailyVersion()
            };
            
            localStorage.setItem('zuhal_cache', JSON.stringify(cacheData));
            console.log('💾 Cache localStorage\'a kaydedildi');
        } catch (error) {
            console.error('❌ Cache localStorage kaydetme hatası:', error);
        }
    }

    /**
     * Cache'i localStorage'dan yükle
     */
    loadFromLocalStorage() {
        try {
            const cacheData = localStorage.getItem('zuhal_cache');
            if (!cacheData) return;

            const parsed = JSON.parse(cacheData);
            const currentVersion = this.getDailyVersion();
            
            // Versiyon kontrolü
            if (parsed.version !== currentVersion) {
                console.log('🔄 Cache versiyonu eski, temizleniyor...');
                localStorage.removeItem('zuhal_cache');
                return;
            }

            // Cache'i geri yükle
            this.cache.clear();
            for (const [key, item] of parsed.items) {
                this.cache.set(key, item);
            }
            
            console.log('📖 Cache localStorage\'dan yüklendi');
        } catch (error) {
            console.error('❌ Cache localStorage yükleme hatası:', error);
        }
    }
}

// Global CacheManager instance oluştur
window.CacheManager = new CacheManager();

// Global fonksiyonlar (geriye uyumluluk için)
window.getDailyVersion = () => window.CacheManager.getDailyVersion();
window.getHourlyVersion = () => window.CacheManager.getHourlyVersion();

console.log('💾 Cache module loaded successfully');
