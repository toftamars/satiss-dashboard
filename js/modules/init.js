/**
 * 🚀 Init Module
 * Sayfa başlatma, event listeners ve genel uygulama başlatma
 */

class AppInitializer {
    constructor() {
        this.isInitialized = false;
        this.loadingSteps = {
            pageInit: false,
            metadata: false,
            targets: false,
            data: false
        };
        this.init();
    }

    /**
     * Uygulamayı başlat
     */
    init() {
        console.log('🚀 AppInitializer starting...');
        
        // DOM yüklendiğinde çalıştır
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.startApp());
        } else {
            this.startApp();
        }
    }

    /**
     * Uygulamayı başlat
     */
    async startApp() {
        try {
            console.log('🚀 Uygulama başlatılıyor...');
            
            // 1. Sayfa başlatma
            this.initializePage();
            
            // 2. Authentication kontrolü
            await this.checkAuthentication();
            
            // 3. Veri yükleme
            await this.loadApplicationData();
            
            // 4. UI başlatma
            this.initializeUI();
            
            // 5. Event listener'ları kur
            this.setupGlobalEventListeners();
            
            this.isInitialized = true;
            console.log('✅ Uygulama başarıyla başlatıldı');
            
        } catch (error) {
            console.error('❌ Uygulama başlatma hatası:', error);
            this.showError('Uygulama başlatılamadı. Lütfen sayfayı yenileyin.');
        }
    }

    /**
     * Sayfa başlatma
     */
    initializePage() {
        console.log('📄 Sayfa başlatılıyor...');
        
        // Loading screen'i göster
        this.showLoadingScreen();
        
        // Progress tracking
        this.loadingSteps.pageInit = true;
        this.updateLoadingProgress();
        
        console.log('✅ Sayfa başlatıldı');
    }

    /**
     * Authentication kontrolü
     */
    async checkAuthentication() {
        console.log('🔐 Authentication kontrol ediliyor...');
        
        if (window.AuthManager) {
            const isAuthenticated = window.AuthManager.checkSession();
            
            if (!isAuthenticated) {
                console.log('🔑 Giriş gerekli');
                return;
            }
        }
        
        console.log('✅ Authentication tamamlandı');
    }

    /**
     * Uygulama verilerini yükle
     */
    async loadApplicationData() {
        console.log('📊 Uygulama verileri yükleniyor...');
        
        try {
            if (window.DataLoader) {
                const result = await window.DataLoader.loadAllData();
                console.log('✅ Veri yükleme tamamlandı:', result);
                
                // Dashboard'ı hemen güncelle
                if (window.Dashboard) {
                    console.log('🔄 Dashboard güncelleniyor...');
                    window.Dashboard.updateDashboard();
                }
            } else {
                console.warn('⚠️ DataLoader bulunamadı');
            }
        } catch (error) {
            console.error('❌ Veri yükleme hatası:', error);
            throw error;
        }
    }

    /**
     * UI başlatma
     */
    initializeUI() {
        console.log('🎨 UI başlatılıyor...');
        
        // Dashboard'ı güncelle
        if (window.Dashboard) {
            window.Dashboard.updateDashboard();
        }
        
        // UI Manager'ı başlat
        if (window.UIManager) {
            // UI zaten init() ile başlatıldı
        }
        
        console.log('✅ UI başlatıldı');
    }

    /**
     * Global event listener'ları kur
     */
    setupGlobalEventListeners() {
        console.log('👂 Global event listener\'lar kuruluyor...');
        
        // Window resize
        window.addEventListener('resize', this.handleWindowResize.bind(this));
        
        // Before unload
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
        
        // Online/offline
        window.addEventListener('online', this.handleOnline.bind(this));
        window.addEventListener('offline', this.handleOffline.bind(this));
        
        // Error handling
        window.addEventListener('error', this.handleGlobalError.bind(this));
        window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
        
        console.log('✅ Event listener\'lar kuruldu');
    }

    /**
     * Loading screen'i göster
     */
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
    }

    /**
     * Loading screen'i gizle
     */
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }

    /**
     * Loading progress güncelle
     */
    updateLoadingProgress() {
        const completedSteps = Object.values(this.loadingSteps).filter(step => step).length;
        const totalSteps = Object.keys(this.loadingSteps).length;
        const progress = (completedSteps / totalSteps) * 100;
        
        // Progress bar güncelle
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        // Progress text güncelle
        const progressText = document.getElementById('progressText');
        if (progressText) {
            progressText.textContent = `${Math.round(progress)}%`;
        }
        
        // Loading message güncelle
        const loadingMessage = document.getElementById('loadingMessage');
        if (loadingMessage) {
            if (progress < 25) {
                loadingMessage.textContent = '🔄 Sayfa başlatılıyor...';
            } else if (progress < 50) {
                loadingMessage.textContent = '📊 Veri dosyaları yükleniyor...';
            } else if (progress < 75) {
                loadingMessage.textContent = '🎯 Hedefler yükleniyor...';
            } else {
                loadingMessage.textContent = '✅ Hazırlanıyor...';
            }
        }
        
        // Tüm adımlar tamamlandıysa loading screen'i gizle
        if (progress >= 100) {
            setTimeout(() => {
                this.hideLoadingScreen();
                this.showMainContainer();
            }, 1000);
        }
    }

    /**
     * Main container'ı göster
     */
    showMainContainer() {
        const mainContainer = document.getElementById('mainContainer');
        if (mainContainer) {
            mainContainer.style.display = 'block';
        }
    }

    /**
     * Hata göster
     */
    showError(message) {
        console.error('❌ Hata:', message);
        
        // Loading screen'i gizle
        this.hideLoadingScreen();
        
        // Hata mesajını göster
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ff6b6b;
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 10001;
            text-align: center;
        `;
        errorDiv.innerHTML = `
            <h3>❌ Hata</h3>
            <p>${message}</p>
            <button onclick="location.reload()" style="
                background: white;
                color: #ff6b6b;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 10px;
            ">Sayfayı Yenile</button>
        `;
        
        document.body.appendChild(errorDiv);
    }

    /**
     * Window resize handler
     */
    handleWindowResize() {
        // Chart'ları yeniden boyutlandır
        if (window.ChartManager) {
            Object.keys(window.ChartManager.chartInstances).forEach(chartId => {
                window.ChartManager.redrawChart(chartId);
            });
        }
    }

    /**
     * Before unload handler
     */
    handleBeforeUnload(event) {
        // Cache'i kaydet
        if (window.CacheManager) {
            window.CacheManager.saveToLocalStorage();
        }
        
        // Session'ı temizle (isteğe bağlı)
        // sessionStorage.clear();
    }

    /**
     * Online handler
     */
    handleOnline() {
        console.log('🌐 İnternet bağlantısı geri geldi');
        // Gerekirse veri yenile
    }

    /**
     * Offline handler
     */
    handleOffline() {
        console.log('📴 İnternet bağlantısı kesildi');
        // Offline moda geç
    }

    /**
     * Global error handler
     */
    handleGlobalError(event) {
        console.error('❌ Global hata:', event.error);
        // Hata raporlama
    }

    /**
     * Unhandled promise rejection handler
     */
    handleUnhandledRejection(event) {
        console.error('❌ Yakalanmamış promise rejection:', event.reason);
        // Hata raporlama
    }

    /**
     * Uygulama durumunu kontrol et
     */
    getAppStatus() {
        return {
            isInitialized: this.isInitialized,
            loadingSteps: this.loadingSteps,
            modules: {
                auth: !!window.AuthManager,
                dataLoader: !!window.DataLoader,
                dashboard: !!window.Dashboard,
                ui: !!window.UIManager,
                charts: !!window.ChartManager,
                cache: !!window.CacheManager
            }
        };
    }

    /**
     * Debug bilgilerini göster
     */
    showDebugInfo() {
        const status = this.getAppStatus();
        console.log('🔍 Uygulama Durumu:', status);
        
        if (window.DataLoader) {
            const dataStats = window.DataLoader.getDataStats();
            console.log('📊 Veri İstatistikleri:', dataStats);
        }
        
        if (window.CacheManager) {
            const cacheStats = window.CacheManager.getStats();
            console.log('💾 Cache İstatistikleri:', cacheStats);
        }
    }
}

// Global AppInitializer instance oluştur
window.AppInitializer = new AppInitializer();

// Global fonksiyonlar
window.showDebugInfo = () => window.AppInitializer.showDebugInfo();

console.log('🚀 Init module loaded successfully');