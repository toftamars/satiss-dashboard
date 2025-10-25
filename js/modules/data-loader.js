/**
 * 📊 Data Loader Module
 * Veri yükleme, metadata, cache yönetimi ve hedef yükleme
 */

class DataLoader {
    constructor() {
        this.loadedYears = new Set();
        this.loadedDataCache = {};
        this.centralTargets = {yearly: {}, monthly: {}};
        this.metadata = null;
        this.allData = [];
        this.baseData = [];
        this.filteredData = [];
        this.inventoryData = [];
        
        // Loading progress tracking
        this.dataLoadProgress = {
            metadata: false,
            targets: false,
            data: false,
            pageInit: false
        };
        
        this.init();
    }

    /**
     * Data loader'ı başlat
     */
    init() {
        console.log('📊 DataLoader initialized');
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
     * Metadata yükle
     */
    async loadMetadata() {
        try {
            // Rate limiting kontrolü
            if (window.RateLimiter && !window.RateLimiter.canMakeRequest('metadata')) {
                throw new Error('Çok fazla istek gönderildi. Lütfen bekleyin.');
            }
            
            console.log('📋 Metadata yükleniyor...');
            const version = this.getHourlyVersion();
            const response = await fetch(`data-metadata.json?v=${version}`, {
                headers: {
                    'Cache-Control': 'public, max-age=3600' // 1 saat cache
                }
            });
            
            if (!response.ok) {
                throw new Error('Metadata yüklenemedi');
            }
            
            this.metadata = await response.json();
            console.log('✅ Metadata yüklendi:', this.metadata);
            
            this.dataLoadProgress.metadata = true;
            this.checkLoadingComplete();
            
            return this.metadata;
        } catch (error) {
            console.error('❌ Metadata yükleme hatası:', error);
            
            // Error handler'a gönder
            if (window.ErrorHandler) {
                window.ErrorHandler.handleDataError(error);
            }
            
            throw error;
        }
    }

    /**
     * Merkezi hedefleri yükle
     */
    async loadCentralTargets() {
        try {
            console.log('🎯 Merkezi hedefler yükleniyor...');
            const response = await fetch('data/targets.json?' + Date.now()); // Cache bypass
            if (response.ok) {
                this.centralTargets = await response.json();
                console.log('✅ Merkezi hedefler yüklendi:', this.centralTargets);
                
                this.dataLoadProgress.targets = true;
                this.checkLoadingComplete();
                
                return true;
            } else {
                console.warn('⚠️ targets.json yüklenemedi, varsayılan hedefler kullanılacak');
                return false;
            }
    } catch (error) {
            console.error('❌ Hedef yükleme hatası:', error);
            return false;
        }
    }

    /**
     * Belirli bir yılın verisini yükle
     */
    async loadYearData(year) {
        // Çift yükleme önleme kontrolü
        if (this.loadedYears.has(year) && this.loadedDataCache[year]) {
            console.log(`⏭️ ${year} zaten yüklü, cache'den döndürülüyor...`);
            return this.loadedDataCache[year];
        }
        
        // Loading flag ekle - race condition önleme
        this.loadedYears.add(year);
        
        try {
            console.log(`📦 ${year} yükleniyor...`);
            
            // GZIP dosyasını indir - Akıllı Cache ile
            const version = this.getDailyVersion();
            const response = await fetch(`data-${year}.json.gz?v=${version}`, {
                headers: {
                    'Cache-Control': 'public, max-age=86400' // 24 saat cache
                }
            });
            if (!response.ok) throw new Error(`${year} verisi bulunamadı`);
            
            // ArrayBuffer olarak al
            const arrayBuffer = await response.arrayBuffer();
            
            // GZIP açma - Evrensel yöntem
            let decompressed;
            
            // Yöntem 1: DecompressionStream (modern tarayıcılar)
            if (typeof DecompressionStream !== 'undefined') {
                try {
                    const blob = new Blob([arrayBuffer]);
                    const ds = new DecompressionStream('gzip');
                    const stream = blob.stream().pipeThrough(ds);
                    decompressed = await new Response(stream).text();
                } catch (e) {
                    console.warn('DecompressionStream başarısız, pako kullanılıyor:', e);
                    // Fallback to pako
                    const uint8Array = new Uint8Array(arrayBuffer);
                    const decompressedArray = pako.inflate(uint8Array);
                    decompressed = new TextDecoder().decode(decompressedArray);
                }
            }
            // Yöntem 2: Pako.js (tüm tarayıcılar için fallback)
            else {
                if (typeof pako === 'undefined') {
                    throw new Error('GZIP açma kütüphanesi yüklenmedi. Lütfen sayfayı yenileyin.');
                }
                const uint8Array = new Uint8Array(arrayBuffer);
                const decompressedArray = pako.inflate(uint8Array);
                decompressed = new TextDecoder().decode(decompressedArray);
            }
            
            // JSON'a çevir
            const yearData = JSON.parse(decompressed);
            
            console.log(`✅ ${year} yüklendi: ${yearData?.details?.length || 0} kayıt`);
            if (!yearData?.details) {
                console.warn(`⚠️ ${year} verisi boş veya geçersiz`);
            }
            
            // Cache'e kaydet
            this.loadedDataCache[year] = yearData;
            
            return yearData;
            
        } catch (error) {
            console.error(`❌ ${year} yükleme hatası:`, error);
            // Hata durumunda loading flag'i temizle
            this.loadedYears.delete(year);
            delete this.loadedDataCache[year];
            throw error;
        }
    }

    /**
     * Tüm yılların verisini paralel olarak yükle
     */
    async loadAllYearsData() {
        if (!this.metadata || !this.metadata.years) {
            throw new Error('Metadata yüklenmedi');
        }

        console.log('📊 Tüm yılların verisi yükleniyor...');
        const years = this.metadata.years;
        
        try {
            // Paralel yükleme
            const yearPromises = years.map(year => this.loadYearData(year));
            const yearDataArray = await Promise.all(yearPromises);
            
            // Tüm veriyi birleştir
            this.allData = [];
            yearDataArray.forEach(yearData => {
                if (yearData && yearData.details) {
                    this.allData = this.allData.concat(yearData.details);
                }
            });
            
            console.log(`✅ Tüm veriler yüklendi: ${this.allData.length} kayıt`);
            
            // Base data'yı ayarla
            this.baseData = [...this.allData];
            this.filteredData = [...this.allData];
            
            this.dataLoadProgress.data = true;
            this.checkLoadingComplete();
            
            return this.allData;
        } catch (error) {
            console.error('❌ Tüm veri yükleme hatası:', error);
            throw error;
        }
    }

    /**
     * Stok verilerini yükle
     */
    async loadInventoryData() {
        try {
            console.log('📦 Stok verileri yükleniyor...');
            const response = await fetch('inventory.json.gz?' + Date.now());
            if (!response.ok) {
                console.warn('⚠️ Stok verisi bulunamadı');
                return [];
            }
            
            const arrayBuffer = await response.arrayBuffer();
            let decompressed;
            
            if (typeof DecompressionStream !== 'undefined') {
                try {
                    const blob = new Blob([arrayBuffer]);
                    const ds = new DecompressionStream('gzip');
                    const stream = blob.stream().pipeThrough(ds);
                    decompressed = await new Response(stream).text();
                } catch (e) {
                    const uint8Array = new Uint8Array(arrayBuffer);
                    const decompressedArray = pako.inflate(uint8Array);
                    decompressed = new TextDecoder().decode(decompressedArray);
                }
            } else {
                const uint8Array = new Uint8Array(arrayBuffer);
                const decompressedArray = pako.inflate(uint8Array);
                decompressed = new TextDecoder().decode(decompressedArray);
            }
            
            this.inventoryData = JSON.parse(decompressed);
            console.log(`✅ Stok verileri yüklendi: ${this.inventoryData.length} kayıt`);
            
            return this.inventoryData;
        } catch (error) {
            console.error('❌ Stok veri yükleme hatası:', error);
            return [];
        }
    }

    /**
     * Tüm verileri yükle (ana fonksiyon)
     */
    async loadAllData() {
        try {
            console.log('🚀 Tüm veri yükleme işlemi başlatılıyor...');
            
            // 1. Metadata yükle
            await this.loadMetadata();
            
            // 2. Hedefleri yükle (paralel)
            const targetsPromise = this.loadCentralTargets();
            
            // 3. Stok verilerini yükle (paralel)
            const inventoryPromise = this.loadInventoryData();
            
            // 4. Tüm yılların verisini yükle
            await this.loadAllYearsData();
            
            // 5. Hedefleri bekle
            await targetsPromise;
            
            // 6. Stok verilerini bekle
            await inventoryPromise;
            
            console.log('✅ Tüm veriler başarıyla yüklendi!');
            
            // Dashboard'ı güncelle
            if (window.Dashboard) {
                console.log('🔄 Dashboard güncelleniyor...');
                window.Dashboard.updateDashboard();
            }
            
            return {
                allData: this.allData,
                metadata: this.metadata,
                centralTargets: this.centralTargets,
                inventoryData: this.inventoryData
            };
            
    } catch (error) {
            console.error('❌ Veri yükleme hatası:', error);
            throw error;
        }
    }

    /**
     * Loading tamamlanma kontrolü
     */
    checkLoadingComplete() {
        const allComplete = Object.values(this.dataLoadProgress).every(complete => complete);
        
        if (allComplete) {
            console.log('✅ Tüm veriler yüklendi!');
            
            // Loading screen'i gizle
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
            
            // Main container'ı göster
            const mainContainer = document.getElementById('mainContainer');
            if (mainContainer) {
                mainContainer.style.display = 'block';
            }
        }
    }

    /**
     * Veri filtreleme
     */
    filterData(filters = {}) {
        let filtered = [...this.baseData];
        
        // Yıl filtresi
        if (filters.years && filters.years.length > 0) {
            filtered = filtered.filter(item => {
                const itemYear = new Date(item.date).getFullYear().toString();
                return filters.years.includes(itemYear);
            });
        }
        
        // Ay filtresi
        if (filters.months && filters.months.length > 0) {
            filtered = filtered.filter(item => {
                const itemMonth = new Date(item.date).getMonth() + 1;
                return filters.months.includes(itemMonth.toString());
            });
        }
        
        // Mağaza filtresi
        if (filters.stores && filters.stores.length > 0) {
            filtered = filtered.filter(item => {
                return filters.stores.includes(item.partner);
            });
        }
        
        // Kanal filtresi
        if (filters.channels && filters.channels.length > 0) {
            filtered = filtered.filter(item => {
                return filters.channels.includes(item.channel);
            });
        }
        
        this.filteredData = filtered;
        return filtered;
    }

    /**
     * Cache temizle
     */
    clearCache() {
        this.loadedYears.clear();
        this.loadedDataCache = {};
        console.log('🗑️ Cache temizlendi');
    }

    /**
     * Veri istatistikleri
     */
    getDataStats() {
        return {
            totalRecords: this.allData.length,
            filteredRecords: this.filteredData.length,
            loadedYears: Array.from(this.loadedYears),
            cacheSize: Object.keys(this.loadedDataCache).length,
            metadata: this.metadata,
            hasTargets: Object.keys(this.centralTargets.yearly).length > 0
        };
    }
}

// Global DataLoader instance oluştur
window.DataLoader = new DataLoader();

// Global fonksiyonlar (geriye uyumluluk için)
window.loadData = () => window.DataLoader.loadAllData();
window.loadMetadata = () => window.DataLoader.loadMetadata();
window.loadYearData = (year) => window.DataLoader.loadYearData(year);
window.loadCentralTargets = () => window.DataLoader.loadCentralTargets();
window.loadAllYearsData = () => window.DataLoader.loadAllYearsData();

console.log('📊 DataLoader module loaded successfully');