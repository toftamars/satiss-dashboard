/**
 * 🚀 Lazy Loader Module
 * Veriyi ihtiyaç anında yükler (Lazy Loading)
 */

class LazyLoader {
    constructor() {
        this.loadedMonths = new Map(); // Yüklenen aylar
        this.loadingPromises = new Map(); // Yükleme promise'leri
        this.currentYear = new Date().getFullYear();
        this.currentMonth = new Date().getMonth() + 1;
        this.init();
    }

    /**
     * Lazy Loader'ı başlat
     */
    init() {
        console.log('🚀 LazyLoader initialized');
    }

    /**
     * ADIM 1: İlk yükleme - Sadece özet veriler
     * 48 MB yerine sadece 500 KB yükle!
     */
    async loadInitialSummary() {
        try {
            console.log('📊 Özet veriler yükleniyor... (Hızlı!)');
            
            // Sadece özet metadata yükle
            const response = await fetch('data-metadata.json?' + Date.now());
            const metadata = await response.json();
            
            console.log('✅ Özet yüklendi! Sayfa hazır.');
            return metadata;
        } catch (error) {
            console.error('❌ Özet yükleme hatası:', error);
            throw error;
        }
    }

    /**
     * ADIM 2: Kullanıcı bir yıl seçince - O yılı yükle
     * Örnek: Kullanıcı "2024" seçti → Sadece 2024'ü yükle
     */
    async loadYear(year) {
        const cacheKey = `year-${year}`;
        
        // Zaten yüklü mü?
        if (this.loadedMonths.has(cacheKey)) {
            console.log(`⚡ ${year} cache'den alındı (anında!)`);
            return this.loadedMonths.get(cacheKey);
        }

        // Şu an yükleniyor mu?
        if (this.loadingPromises.has(cacheKey)) {
            console.log(`⏳ ${year} zaten yükleniyor, bekleniyor...`);
            return await this.loadingPromises.get(cacheKey);
        }

        // Yeni yükleme başlat
        const loadPromise = this._loadYearData(year);
        this.loadingPromises.set(cacheKey, loadPromise);

        try {
            const data = await loadPromise;
            this.loadedMonths.set(cacheKey, data);
            return data;
        } finally {
            this.loadingPromises.delete(cacheKey);
        }
    }

    /**
     * ADIM 3: Kullanıcı bir ay seçince - O ayı yükle
     * Örnek: Kullanıcı "Ocak 2024" seçti → Sadece Ocak'ı yükle (400 KB)
     */
    async loadMonth(year, month) {
        const cacheKey = `${year}-${String(month).padStart(2, '0')}`;
        
        // Zaten yüklü mü?
        if (this.loadedMonths.has(cacheKey)) {
            console.log(`⚡ ${cacheKey} cache'den alındı (anında!)`);
            return this.loadedMonths.get(cacheKey);
        }

        // Şu an yükleniyor mu?
        if (this.loadingPromises.has(cacheKey)) {
            console.log(`⏳ ${cacheKey} zaten yükleniyor...`);
            return await this.loadingPromises.get(cacheKey);
        }

        // Yeni yükleme başlat
        console.log(`📦 ${cacheKey} yükleniyor... (Sadece bu ay!)`);
        const loadPromise = this._loadMonthData(year, month);
        this.loadingPromises.set(cacheKey, loadPromise);

        try {
            const data = await loadPromise;
            this.loadedMonths.set(cacheKey, data);
            console.log(`✅ ${cacheKey} yüklendi!`);
            return data;
        } finally {
            this.loadingPromises.delete(cacheKey);
        }
    }

    /**
     * Yıl verisini yükle (internal)
     */
    async _loadYearData(year) {
        try {
            const version = this.getDailyVersion();
            const response = await fetch(`data-${year}.json.gz?v=${version}`);
            
            if (!response.ok) {
                throw new Error(`${year} verisi bulunamadı`);
            }

            const buffer = await response.arrayBuffer();
            const decompressed = pako.ungzip(new Uint8Array(buffer), { to: 'string' });
            const data = JSON.parse(decompressed);

            return data;
        } catch (error) {
            console.error(`❌ ${year} yükleme hatası:`, error);
            throw error;
        }
    }

    /**
     * Ay verisini yükle (internal)
     */
    async _loadMonthData(year, month) {
        try {
            const monthStr = String(month).padStart(2, '0');
            const version = this.getDailyVersion();
            
            // Önce aylık dosya var mı kontrol et
            const monthResponse = await fetch(`data/${year}/${monthStr}.json.gz?v=${version}`);
            
            if (monthResponse.ok) {
                // Aylık dosya var, onu yükle (HIZLI!)
                const buffer = await monthResponse.arrayBuffer();
                const decompressed = pako.ungzip(new Uint8Array(buffer), { to: 'string' });
                return JSON.parse(decompressed);
            } else {
                // Aylık dosya yok, tüm yılı yükle (YAVAŞ)
                console.warn(`⚠️ ${year}/${monthStr} dosyası yok, tüm yıl yükleniyor...`);
                const yearData = await this.loadYear(year);
                
                // Sadece o ayı filtrele
                if (yearData && yearData.details) {
                    return {
                        ...yearData,
                        details: yearData.details.filter(item => {
                            const itemDate = new Date(item.date);
                            return itemDate.getMonth() + 1 === month;
                        })
                    };
                }
                
                return yearData;
            }
        } catch (error) {
            console.error(`❌ ${year}/${month} yükleme hatası:`, error);
            throw error;
        }
    }

    /**
     * Günlük versiyon (cache için)
     */
    getDailyVersion() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }

    /**
     * Preload: Kullanıcı muhtemelen ihtiyaç duyacak veriyi arka planda yükle
     */
    async preloadNextMonth() {
        const nextMonth = this.currentMonth === 12 ? 1 : this.currentMonth + 1;
        const nextYear = this.currentMonth === 12 ? this.currentYear + 1 : this.currentYear;
        
        console.log(`🔮 Ön yükleme: ${nextYear}/${nextMonth} (arka planda)`);
        
        // Arka planda yükle (kullanıcı beklemez)
        this.loadMonth(nextYear, nextMonth).catch(err => {
            console.warn('Ön yükleme başarısız (sorun değil):', err);
        });
    }

    /**
     * Tüm cache'i temizle
     */
    clearCache() {
        this.loadedMonths.clear();
        this.loadingPromises.clear();
        console.log('🗑️ Lazy loader cache temizlendi');
    }

    /**
     * Cache istatistikleri
     */
    getCacheStats() {
        return {
            loadedMonths: this.loadedMonths.size,
            loadingNow: this.loadingPromises.size,
            cacheKeys: Array.from(this.loadedMonths.keys())
        };
    }
}

// Global LazyLoader instance
window.LazyLoader = new LazyLoader();

console.log('🚀 Lazy Loader module loaded successfully');

