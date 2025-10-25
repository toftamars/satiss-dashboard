/**
 * 🏠 Dashboard Module
 * Dashboard UI, özet kartları, loading yönetimi ve genel dashboard işlevleri
 */

class Dashboard {
    constructor() {
        this.isInitialized = false;
        this.summaryData = {};
        this.charts = {};
        this.init();
    }

    /**
     * Dashboard'ı başlat
     */
    init() {
        console.log('🏠 Dashboard initialized');
        this.setupEventListeners();
    }

    /**
     * Dashboard'ı güncelle
     */
    updateDashboard() {
        console.log('🔄 Dashboard güncelleniyor...');
        
        // Veri yükleme kontrolü
        if (!window.DataLoader) {
            console.warn('⚠️ DataLoader bulunamadı');
            return;
        }
        
        if (!window.DataLoader.allData || window.DataLoader.allData.length === 0) {
            // Sonsuz döngü önleme - maksimum 10 deneme
            if (!this.retryCount) {
                this.retryCount = 0;
            }
            
            if (this.retryCount < 10) {
                this.retryCount++;
                console.warn(`⚠️ Veri henüz yüklenmedi, ${this.retryCount}/10 deneme - 2 saniye sonra tekrar denenecek...`);
                setTimeout(() => this.updateDashboard(), 2000);
                return;
            } else {
                console.error('❌ Veri yükleme başarısız - maksimum deneme sayısına ulaşıldı');
                this.showDataLoadError();
                return;
            }
        }
        
        // Başarılı yükleme sonrası retry count'u sıfırla
        this.retryCount = 0;
    
        console.log(`📊 Veri yüklendi: ${window.DataLoader.allData.length} kayıt`);
        
        // Özet verilerini hesapla
        this.calculateSummaryData();
        
        // Özet kartlarını güncelle
        this.updateSummaryCards();
        
        // Grafikleri oluştur
        this.createDashboardCharts();
        
        // AI analizini başlat
        this.performAIAnalysis();
        
        console.log('✅ Dashboard güncellendi');
    }

    /**
     * Özet verilerini hesapla
     */
    calculateSummaryData() {
        const data = window.DataLoader.allData;
        
        if (!data || data.length === 0) {
            console.warn('⚠️ Veri bulunamadı');
            return;
        }

        // Toplam satış
        const totalSales = data.reduce((sum, item) => sum + (parseFloat(item.usd_amount) || 0), 0);
        
        // Toplam miktar
        const totalQty = data.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);
        
        // Benzersiz müşteri sayısı
        const uniqueCustomers = new Set(data.map(item => item.customer_id)).size;
        
        // Benzersiz ürün sayısı
        const uniqueProducts = new Set(data.map(item => item.product)).size;
        
        // Benzersiz mağaza sayısı
        const uniqueStores = new Set(data.map(item => item.partner)).size;
        
        // Benzersiz temsilci sayısı
        const uniqueSalespeople = new Set(data.map(item => item.salesperson)).size;
        
        // Günlük ortalama
        const dailyAverage = totalSales / 365; // Yaklaşık
        
        // Sepet ortalaması
        const basketAverage = totalSales / data.length;
        
        this.summaryData = {
            totalSales,
            totalQty,
            uniqueCustomers,
            uniqueProducts,
            uniqueStores,
            uniqueSalespeople,
            dailyAverage,
            basketAverage,
            totalRecords: data.length
        };
    }

    /**
     * Özet kartlarını güncelle
     */
    updateSummaryCards() {
        const data = this.summaryData;
        
        console.log('📊 Özet verileri güncelleniyor:', data);
        
        // Toplam satış
        this.updateElement('dashTotalSales', `$${data.totalSales.toLocaleString('tr-TR', {minimumFractionDigits: 2})}`);
        
        // Toplam miktar
        this.updateElement('dashTotalQty', data.totalQty.toLocaleString('tr-TR'));
        
        // Müşteri sayısı
        this.updateElement('dashTotalCustomers', data.uniqueCustomers.toLocaleString('tr-TR'));
        
        // Ürün sayısı
        this.updateElement('dashTotalProducts', data.uniqueProducts.toLocaleString('tr-TR'));
        
        // Mağaza sayısı
        this.updateElement('dashTotalStores', data.uniqueStores.toLocaleString('tr-TR'));
        
        // Temsilci sayısı
        this.updateElement('dashTotalSalespeople', data.uniqueSalespeople.toLocaleString('tr-TR'));
        
        // Günlük ortalama
        this.updateElement('dashDailyAverage', `$${data.dailyAverage.toLocaleString('tr-TR', {minimumFractionDigits: 2})}`);
        
        // Sepet ortalaması
        this.updateElement('dashBasketAverage', `$${data.basketAverage.toLocaleString('tr-TR', {minimumFractionDigits: 2})}`);
        
        // Cache versiyonu
        this.updateElement('cacheVersion', window.CacheManager?.getDailyVersion() || 'N/A');
        
        console.log('✅ Özet kartları güncellendi');
    }

    /**
     * Dashboard grafiklerini oluştur
     */
    createDashboardCharts() {
        const data = window.DataLoader.allData;
        
        if (!data || data.length === 0) {
            console.warn('⚠️ Veri bulunamadı, grafikler oluşturulamıyor');
            return;
        }

        // Yıllık karşılaştırma grafiği
        this.createYearlyComparisonChart(data);
        
        // Top 10 mağaza grafiği
        this.createTopStoresChart(data);
        
        // Top 10 temsilci grafiği
        this.createTopSalespeopleChart(data);
        
        // Top 10 marka grafiği
        this.createTopBrandsChart(data);
        
        // Top 10 kategori grafiği
        this.createTopCategoriesChart(data);
        
        // Top 10 şehir grafiği
        this.createTopCitiesChart(data);
        
        // Top 10 ürün grafiği
        this.createTopProductsChart(data);
    }

    /**
     * Yıllık karşılaştırma grafiği
     */
    createYearlyComparisonChart(data) {
        const yearlyData = this.groupDataByYear(data);
        const years = Object.keys(yearlyData).sort();
        
        const salesData = years.map(year => {
            return yearlyData[year].reduce((sum, item) => sum + (parseFloat(item.usd_amount) || 0), 0);
        });
        
        const qtyData = years.map(year => {
            return yearlyData[year].reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);
        });

        const chartData = {
            labels: years,
            datasets: [{
                label: 'Satış (USD)',
                data: salesData,
                borderColor: 'rgba(102, 126, 234, 1)',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Miktar (Adet)',
                data: qtyData,
                borderColor: 'rgba(255, 159, 64, 1)',
                backgroundColor: 'rgba(255, 159, 64, 0.1)',
                tension: 0.4,
                fill: true
            }]
        };

        if (window.ChartManager) {
            window.ChartManager.createLineChart('dashYearlyChart', chartData);
        }
    }

    /**
     * Top 10 mağaza grafiği
     */
    createTopStoresChart(data) {
        const storeData = this.groupDataByField(data, 'partner');
        const topStores = this.getTop10(storeData, 'usd_amount');
        
        if (window.ChartManager) {
            window.ChartManager.createBarChart('dashTopStoresChart', {
                labels: topStores.map(s => s[0]),
                values: topStores.map(s => s[1]),
                label: 'Satış (USD)',
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: 'rgba(102, 126, 234, 1)'
            });
        }
    }

    /**
     * Top 10 temsilci grafiği
     */
    createTopSalespeopleChart(data) {
        const salespersonData = this.groupDataByField(data, 'salesperson');
        const topSalespeople = this.getTop10(salespersonData, 'usd_amount');
        
        if (window.ChartManager) {
            window.ChartManager.createBarChart('dashTopSalespeopleChart', {
                labels: topSalespeople.map(s => s[0]),
                values: topSalespeople.map(s => s[1]),
                label: 'Satış (USD)',
                backgroundColor: 'rgba(255, 159, 64, 0.8)',
                borderColor: 'rgba(255, 159, 64, 1)'
            });
        }
    }

    /**
     * Top 10 marka grafiği
     */
    createTopBrandsChart(data) {
        const brandData = this.groupDataByField(data, 'brand');
        const topBrands = this.getTop10(brandData, 'usd_amount');
        
        if (window.ChartManager) {
            window.ChartManager.createDoughnutChart('dashTopBrandsChart', {
                labels: topBrands.map(b => b[0]),
                values: topBrands.map(b => b[1]),
                backgroundColor: window.ChartManager.getDefaultColors(10)
            });
        }
    }

    /**
     * Top 10 kategori grafiği
     */
    createTopCategoriesChart(data) {
        const categoryData = this.groupDataByField(data, 'category_1');
        const topCategories = this.getTop10(categoryData, 'usd_amount');
        
        if (window.ChartManager) {
            window.ChartManager.createDoughnutChart('dashTopCategoriesChart', {
                labels: topCategories.map(c => c[0]),
                values: topCategories.map(c => c[1]),
                backgroundColor: window.ChartManager.getDefaultColors(10)
            });
        }
    }

    /**
     * Top 10 şehir grafiği
     */
    createTopCitiesChart(data) {
        const cityData = this.groupDataByField(data, 'city');
        const topCities = this.getTop10(cityData, 'usd_amount');
        
        if (window.ChartManager) {
            window.ChartManager.createBarChart('dashTopCitiesChart', {
                labels: topCities.map(c => c[0]),
                values: topCities.map(c => c[1]),
                label: 'Satış (USD)',
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
                borderColor: 'rgba(75, 192, 192, 1)'
            });
        }
    }

    /**
     * Top 10 ürün grafiği
     */
    createTopProductsChart(data) {
        const productData = this.groupDataByField(data, 'product');
        const topProducts = this.getTop10(productData, 'usd_amount');
        
        if (window.ChartManager) {
            window.ChartManager.createHorizontalBarChart('dashTopProductsChart', {
                labels: topProducts.map(p => p[0].substring(0, 30) + (p[0].length > 30 ? '...' : '')),
                values: topProducts.map(p => p[1]),
                label: 'Satış (USD)',
                backgroundColor: 'rgba(153, 102, 255, 0.8)',
                borderColor: 'rgba(153, 102, 255, 1)'
            });
        }
    }

    /**
     * AI analizi yap
     */
    performAIAnalysis() {
        const data = window.DataLoader.allData;
        
        if (!data || data.length === 0) {
            console.warn('⚠️ Veri bulunamadı, AI analizi yapılamıyor');
            return;
        }

        // Basit analiz (GPT entegrasyonu olmadan)
        const analysis = this.performBasicAnalysis(data);
        this.displayAIAnalysis(analysis);
    }

    /**
     * Basit analiz yap
     */
    performBasicAnalysis(data) {
        const totalSales = data.reduce((sum, item) => sum + (parseFloat(item.usd_amount) || 0), 0);
        const avgBasket = totalSales / data.length;
        
        // En yüksek satış yapan mağaza
        const storeData = this.groupDataByField(data, 'partner');
        const topStore = this.getTop10(storeData, 'usd_amount')[0];
        
        // En popüler kategori
        const categoryData = this.groupDataByField(data, 'category_1');
        const topCategory = this.getTop10(categoryData, 'usd_amount')[0];
        
        return {
            totalSales,
            avgBasket,
            topStore: topStore ? topStore[0] : 'N/A',
            topCategory: topCategory ? topCategory[0] : 'N/A',
            totalRecords: data.length
        };
    }

    /**
     * AI analiz sonuçlarını göster
     */
    displayAIAnalysis(analysis) {
        const container = document.getElementById('dashAIAnalysis');
        if (!container) return;

        const html = `
            <div style="background: white; padding: 20px; border-radius: 10px; line-height: 1.8;">
                <h4 style="color: #667eea; margin-bottom: 15px;">📊 Dashboard Analizi</h4>
                <p><strong>Toplam Satış:</strong> $${analysis.totalSales.toLocaleString('tr-TR', {minimumFractionDigits: 2})}</p>
                <p><strong>Ortalama Sepet:</strong> $${analysis.avgBasket.toLocaleString('tr-TR', {minimumFractionDigits: 2})}</p>
                <p><strong>En Başarılı Mağaza:</strong> ${window.sanitizeString ? window.sanitizeString(analysis.topStore) : analysis.topStore}</p>
                <p><strong>En Popüler Kategori:</strong> ${window.sanitizeString ? window.sanitizeString(analysis.topCategory) : analysis.topCategory}</p>
                <p><strong>Toplam İşlem:</strong> ${analysis.totalRecords.toLocaleString('tr-TR')}</p>
            </div>
        `;
        
        // XSS koruması ile HTML ekle
        if (window.sanitizeHTML) {
            container.innerHTML = window.sanitizeHTML(html);
        } else {
            container.innerHTML = html;
        }
    }

    /**
     * Veriyi yıla göre grupla
     */
    groupDataByYear(data) {
        const grouped = {};
        data.forEach(item => {
            const year = new Date(item.date).getFullYear().toString();
            if (!grouped[year]) grouped[year] = [];
            grouped[year].push(item);
        });
        return grouped;
    }

    /**
     * Veriyi belirli bir alana göre grupla
     */
    groupDataByField(data, field) {
        const grouped = {};
        data.forEach(item => {
            const value = item[field] || 'Bilinmeyen';
            if (!grouped[value]) grouped[value] = [];
            grouped[value].push(item);
        });
        return grouped;
    }

    /**
     * Top 10 veri al
     */
    getTop10(groupedData, valueField) {
        return Object.entries(groupedData)
            .map(([key, items]) => [
                key,
                items.reduce((sum, item) => sum + (parseFloat(item[valueField]) || 0), 0)
            ])
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
    }

    /**
     * Element güncelle
     */
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    /**
     * Veri yükleme hatası göster
     */
    showDataLoadError() {
        const container = document.getElementById('mainContainer');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 50px; color: #ff6b6b;">
                    <h2>❌ Veri Yükleme Hatası</h2>
                    <p>Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.</p>
                    <button onclick="location.reload()" style="
                        background: #667eea; 
                        color: white; 
                        border: none; 
                        padding: 12px 24px; 
                        border-radius: 8px; 
                        cursor: pointer; 
                        font-size: 16px;
                        margin-top: 20px;
                    ">Sayfayı Yenile</button>
                </div>
            `;
        }
    }

    /**
     * Event listener'ları kur
     */
    setupEventListeners() {
        // Dashboard metric değiştirme
        const salesBtn = document.getElementById('dashYearlyMetricSales');
        const qtyBtn = document.getElementById('dashYearlyMetricQty');
        
        if (salesBtn) {
            salesBtn.addEventListener('click', () => this.changeYearlyMetric('sales'));
        }
        
        if (qtyBtn) {
            qtyBtn.addEventListener('click', () => this.changeYearlyMetric('qty'));
        }
    }

    /**
     * Yıllık metrik değiştir
     */
    changeYearlyMetric(metric) {
        // Buton stillerini güncelle
        const salesBtn = document.getElementById('dashYearlyMetricSales');
        const qtyBtn = document.getElementById('dashYearlyMetricQty');
        
        if (salesBtn && qtyBtn) {
            if (metric === 'sales') {
                salesBtn.style.background = '#667eea';
                salesBtn.style.color = 'white';
                qtyBtn.style.background = 'white';
                qtyBtn.style.color = '#667eea';
    } else {
                qtyBtn.style.background = '#667eea';
                qtyBtn.style.color = 'white';
                salesBtn.style.background = 'white';
                salesBtn.style.color = '#667eea';
            }
        }
        
        // Grafiği yeniden oluştur
        this.createYearlyComparisonChart(window.DataLoader.allData);
    }
}

// Global Dashboard instance oluştur
window.Dashboard = new Dashboard();

// Global fonksiyonlar (geriye uyumluluk için)
window.updateDashboard = () => window.Dashboard.updateDashboard();
window.changeDashYearlyMetric = (metric) => window.Dashboard.changeYearlyMetric(metric);

console.log('🏠 Dashboard module loaded successfully');