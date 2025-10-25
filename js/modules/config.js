/**
 * ⚙️ Config Module
 * Global değişkenler, konfigürasyon ve sabitler
 */

class Config {
    constructor() {
        this.app = {
            name: 'Zuhal Müzik Raporlama',
            version: '2.0.0',
            author: 'Zuhal Müzik',
            description: 'Müzik Enstrüman Sektörü Raporlama Sistemi'
        };

        this.api = {
            baseUrl: window.location.origin,
            endpoints: {
                metadata: 'data-metadata.json',
                targets: 'data/targets.json',
                inventory: 'inventory.json.gz',
                data: (year) => `data-${year}.json.gz`
            },
            timeout: 30000, // 30 saniye
            retryAttempts: 3
        };

        this.cache = {
            daily: 24 * 60 * 60 * 1000,    // 24 saat
            hourly: 60 * 60 * 1000,        // 1 saat
            session: 60 * 60 * 1000,       // 1 saat
            maxSize: 50 * 1024 * 1024,     // 50MB
            maxItems: 1000
        };

        this.ui = {
            theme: {
                primary: '#667eea',
                secondary: '#764ba2',
                success: '#4ade80',
                warning: '#fbbf24',
                error: '#f87171',
                info: '#60a5fa'
            },
            animations: {
                duration: 300,
                easing: 'ease-in-out'
            },
            charts: {
                colors: [
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(255, 159, 64, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)'
                ]
            }
        };

        this.features = {
            aiAnalysis: true,
            realTimeUpdates: false,
            offlineMode: true,
            dataExport: true,
            advancedFilters: true,
            customCharts: true
        };

        this.security = {
            sessionTimeout: 60 * 60 * 1000, // 1 saat
            maxLoginAttempts: 5,
            allowedDomains: ['zuhalmuzik.com'],
            requireHTTPS: window.location.protocol === 'https:'
        };

        this.performance = {
            lazyLoading: true,
            dataChunkSize: 1000,
            maxConcurrentRequests: 5,
            debounceDelay: 300
        };

        this.init();
    }

    /**
     * Config'i başlat
     */
    init() {
        console.log('⚙️ Config initialized');
        this.setupEnvironment();
        this.validateConfig();
    }

    /**
     * Ortam ayarlarını yap
     */
    setupEnvironment() {
        // Development/Production ortamı belirle
        this.environment = this.detectEnvironment();
        
        // Debug modu
        this.debug = this.environment === 'development' || 
                    window.location.hostname === 'localhost' ||
                    window.location.hostname.includes('127.0.0.1');
        
        // Console log'ları
        if (!this.debug) {
            console.log = () => {};
            console.warn = () => {};
            console.info = () => {};
        }
    }

    /**
     * Ortamı tespit et
     */
    detectEnvironment() {
        const hostname = window.location.hostname;
        
        if (hostname === 'localhost' || hostname.includes('127.0.0.1')) {
            return 'development';
        } else if (hostname.includes('github.io')) {
            return 'staging';
        } else {
            return 'production';
        }
    }

    /**
     * Config'i doğrula
     */
    validateConfig() {
        const errors = [];
        
        // API endpoints kontrolü
        if (!this.api.endpoints.metadata) {
            errors.push('Metadata endpoint tanımlanmamış');
        }
        
        // Cache ayarları kontrolü
        if (this.cache.maxSize <= 0) {
            errors.push('Cache max size geçersiz');
        }
        
        // UI tema kontrolü
        if (!this.ui.theme.primary) {
            errors.push('Primary theme color tanımlanmamış');
        }
        
        if (errors.length > 0) {
            console.error('❌ Config validation errors:', errors);
        } else {
            console.log('✅ Config validation passed');
        }
    }

    /**
     * Konfigürasyon değeri al
     */
    get(path, defaultValue = null) {
        const keys = path.split('.');
        let value = this;
        
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return defaultValue;
            }
        }
        
        return value;
    }

    /**
     * Konfigürasyon değeri ayarla
     */
    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let target = this;
        
        for (const key of keys) {
            if (!(key in target) || typeof target[key] !== 'object') {
                target[key] = {};
            }
            target = target[key];
        }
        
        target[lastKey] = value;
    }

    /**
     * API endpoint URL'i al
     */
    getApiUrl(endpoint, params = {}) {
        let url = this.api.baseUrl + '/' + endpoint;
        
        // Parametreleri ekle
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            queryParams.append(key, value);
        });
        
        if (queryParams.toString()) {
            url += '?' + queryParams.toString();
        }
        
        return url;
    }

    /**
     * Cache key oluştur
     */
    createCacheKey(type, identifier, version = null) {
        const v = version || this.getDailyVersion();
        return `${type}:${identifier}:${v}`;
    }

    /**
     * Günlük versiyon al
     */
    getDailyVersion() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }

    /**
     * Saatlik versiyon al
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
     * Tema rengi al
     */
    getThemeColor(colorName) {
        return this.ui.theme[colorName] || this.ui.theme.primary;
    }

    /**
     * Chart rengi al
     */
    getChartColor(index) {
        return this.ui.charts.colors[index % this.ui.charts.colors.length];
    }

    /**
     * Özellik aktif mi kontrol et
     */
    isFeatureEnabled(featureName) {
        return this.features[featureName] === true;
    }

    /**
     * Güvenlik kontrolü
     */
    isSecure() {
        return this.security.requireHTTPS ? 
               window.location.protocol === 'https:' : true;
    }

    /**
     * Debug modu aktif mi
     */
    isDebugMode() {
        return this.debug;
    }

    /**
     * Ortam bilgisi
     */
    getEnvironment() {
        return this.environment;
    }

    /**
     * Uygulama bilgileri
     */
    getAppInfo() {
        return {
            name: this.app.name,
            version: this.app.version,
            author: this.app.author,
            environment: this.environment,
            debug: this.debug,
            secure: this.isSecure()
        };
    }

    /**
     * Config'i dışa aktar
     */
    export() {
        return {
            app: this.app,
            api: this.api,
            cache: this.cache,
            ui: this.ui,
            features: this.features,
            security: this.security,
            performance: this.performance,
            environment: this.environment,
            debug: this.debug
        };
    }

    /**
     * Config'i içe aktar
     */
    import(configData) {
        try {
            Object.assign(this, configData);
            this.validateConfig();
            console.log('✅ Config imported successfully');
        } catch (error) {
            console.error('❌ Config import failed:', error);
        }
    }
}

// Global Config instance oluştur
window.Config = new Config();

// Global fonksiyonlar (geriye uyumluluk için)
window.getDailyVersion = () => window.Config.getDailyVersion();
window.getHourlyVersion = () => window.Config.getHourlyVersion();

console.log('⚙️ Config module loaded successfully');