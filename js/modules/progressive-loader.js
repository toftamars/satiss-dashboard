/**
 * 📈 Progressive Loader Module
 * Veriyi aşamalı olarak yükler ve gösterir
 */

class ProgressiveLoader {
    constructor() {
        this.loadingStages = [
            { name: 'Sayfa başlatılıyor', progress: 0 },
            { name: 'Özet veriler yükleniyor', progress: 20 },
            { name: 'Grafik hazırlanıyor', progress: 40 },
            { name: 'Dashboard oluşturuluyor', progress: 60 },
            { name: 'Son dokunuşlar', progress: 80 },
            { name: 'Hazır!', progress: 100 }
        ];
        this.currentStage = 0;
        this.init();
    }

    init() {
        console.log('📈 ProgressiveLoader initialized');
    }

    /**
     * AŞAMA 1: Skeleton Screen (İskelet Ekran)
     * Kullanıcı hemen bir şeyler görür, beklemez
     */
    showSkeletonScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (!loadingScreen) return;

        // Progress bar güncelle
        this.updateProgress(0, 'Sayfa başlatılıyor...');
        
        console.log('💀 Skeleton screen gösteriliyor');
    }

    /**
     * AŞAMA 2: Özet verileri göster (1 saniye içinde)
     */
    async loadAndShowSummary() {
        try {
            this.updateProgress(20, '📊 Özet veriler yükleniyor...');
            
            // Sadece özet yükle (hızlı!)
            const summary = await window.LazyLoader.loadInitialSummary();
            
            // Özet kartları hemen göster
            this.showSummaryCards(summary);
            
            this.updateProgress(40, '✅ Özet hazır!');
            
            return summary;
        } catch (error) {
            console.error('❌ Özet yükleme hatası:', error);
            throw error;
        }
    }

    /**
     * AŞAMA 3: Grafikler için placeholder göster
     */
    showChartPlaceholders() {
        this.updateProgress(60, '📊 Grafikler hazırlanıyor...');
        
        // Chart container'lara placeholder ekle
        const chartContainers = document.querySelectorAll('canvas');
        chartContainers.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#999';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Yükleniyor...', canvas.width / 2, canvas.height / 2);
        });
        
        console.log('📊 Chart placeholders gösteriliyor');
    }

    /**
     * AŞAMA 4: Gerçek verileri arka planda yükle
     */
    async loadFullDataInBackground() {
        try {
            this.updateProgress(80, '📦 Detaylı veriler yükleniyor...');
            
            // Mevcut ay/yıl verilerini yükle
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1;
            
            const data = await window.LazyLoader.loadMonth(currentYear, currentMonth);
            
            this.updateProgress(100, '✅ Hazır!');
            
            // Loading screen'i gizle
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 500);
            
            return data;
        } catch (error) {
            console.error('❌ Tam veri yükleme hatası:', error);
            throw error;
        }
    }

    /**
     * Progress bar güncelle
     */
    updateProgress(percent, message) {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        const loadingMessage = document.getElementById('loadingMessage');
        
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${percent}%`;
        }
        
        if (loadingMessage) {
            loadingMessage.textContent = message;
        }
        
        console.log(`📈 Progress: ${percent}% - ${message}`);
    }

    /**
     * Özet kartları göster
     */
    showSummaryCards(summary) {
        // Toplam satış
        const totalSalesEl = document.getElementById('dashTotalSales');
        if (totalSalesEl && summary.totalSales) {
            totalSalesEl.textContent = `$${summary.totalSales.toLocaleString('tr-TR')}`;
        }
        
        // Toplam müşteri
        const totalCustomersEl = document.getElementById('dashTotalCustomers');
        if (totalCustomersEl && summary.totalCustomers) {
            totalCustomersEl.textContent = summary.totalCustomers.toLocaleString('tr-TR');
        }
        
        console.log('✅ Özet kartları gösterildi');
    }

    /**
     * Loading screen'i gizle
     */
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const mainContainer = document.getElementById('mainContainer');
        
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 300);
        }
        
        if (mainContainer) {
            mainContainer.style.display = 'block';
            mainContainer.style.opacity = '0';
            setTimeout(() => {
                mainContainer.style.opacity = '1';
            }, 100);
        }
        
        console.log('✅ Loading screen gizlendi, dashboard gösteriliyor');
    }

    /**
     * Tüm progressive loading sürecini başlat
     */
    async startProgressiveLoading() {
        try {
            console.log('🚀 Progressive loading başlıyor...');
            
            // 1. Skeleton screen
            this.showSkeletonScreen();
            
            // 2. Özet veriler (1 saniye)
            await this.loadAndShowSummary();
            
            // 3. Chart placeholders
            this.showChartPlaceholders();
            
            // 4. Tam veriler (arka planda)
            await this.loadFullDataInBackground();
            
            console.log('✅ Progressive loading tamamlandı!');
            
        } catch (error) {
            console.error('❌ Progressive loading hatası:', error);
            if (window.ErrorHandler) {
                window.ErrorHandler.handleError(error);
            }
        }
    }
}

// Global ProgressiveLoader instance
window.ProgressiveLoader = new ProgressiveLoader();

console.log('📈 Progressive Loader module loaded successfully');

