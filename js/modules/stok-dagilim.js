/**
 * 📦 Stok Dağılım Modülü
 * Stok lokasyonları ve dağılım analizi
 */

class StokDagilim {
    constructor() {
        this.stockChart = null;
        this.stockLocations = {};
        this.init();
    }

    init() {
        console.log('📦 StokDagilim initialized');
    }

    /**
     * Stok dağılım sekmesini yükle
     */
    async loadStokDagilim() {
        console.log('📊 Stok Dağılım yükleniyor...');
        
        try {
            // Stok lokasyonlarını yükle
            await this.loadStockLocations();
            
            const allData = window.DataLoader?.allData || [];
            
            if (allData.length === 0) {
                console.warn('⚠️ Veri bulunamadı');
                return;
            }

            // Stok verilerini analiz et
            const stockAnalysis = this.analyzeStock(allData);
            
            // Render et
            this.renderStockAnalysis(stockAnalysis);
            this.renderStockChart(stockAnalysis);
            
        } catch (error) {
            console.error('❌ Stok dağılım hatası:', error);
            if (window.ErrorHandler) {
                window.ErrorHandler.handleError(error);
            }
        }
    }

    /**
     * Stok lokasyonlarını yükle
     */
    async loadStockLocations() {
        try {
            const response = await fetch('data/stock-locations.json?' + Date.now());
            if (response.ok) {
                this.stockLocations = await response.json();
                console.log('✅ Stok lokasyonları yüklendi');
            }
        } catch (error) {
            console.warn('⚠️ stock-locations.json yüklenemedi');
            this.stockLocations = {};
        }
    }

    /**
     * Stok verilerini analiz et
     */
    analyzeStock(data) {
        const locationData = {};
        
        data.forEach(item => {
            const location = item.location || 'Bilinmiyor';
            
            if (!locationData[location]) {
                locationData[location] = {
                    name: location,
                    quantity: 0,
                    sales: 0,
                    orderCount: 0,
                    products: new Set(),
                    brands: new Set(),
                    stores: new Set()
                };
            }
            
            locationData[location].quantity += parseInt(item.quantity || 0);
            locationData[location].sales += parseFloat(item.usd_amount || 0);
            locationData[location].orderCount += 1;
            
            if (item.product) locationData[location].products.add(item.product);
            if (item.brand) locationData[location].brands.add(item.brand);
            if (item.store) locationData[location].stores.add(item.store);
        });

        // Hesaplamalar
        Object.values(locationData).forEach(location => {
            location.productCount = location.products.size;
            location.brandCount = location.brands.size;
            location.storeCount = location.stores.size;
            location.avgQuantityPerOrder = location.orderCount > 0 ? location.quantity / location.orderCount : 0;
            
            delete location.products;
            delete location.brands;
            delete location.stores;
        });

        // Sırala
        const sortedLocations = Object.values(locationData)
            .filter(l => l.name !== 'Bilinmiyor')
            .sort((a, b) => b.quantity - a.quantity);

        return sortedLocations;
    }

    /**
     * Stok analizini render et
     */
    renderStockAnalysis(locations) {
        const container = document.getElementById('stockAnalysisContainer');
        if (!container) return;

        let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px;">';
        
        locations.forEach((location, index) => {
            const rank = index + 1;
            const rankColor = rank === 1 ? '#fbbf24' : rank === 2 ? '#9ca3af' : rank === 3 ? '#f97316' : '#6b7280';
            const rankIcon = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
            
            html += `
                <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); position: relative;">
                    <div style="position: absolute; top: 15px; right: 15px; background: ${rankColor}; color: white; padding: 5px 12px; border-radius: 20px; font-weight: 700; font-size: 14px;">
                        ${rankIcon}
                    </div>
                    
                    <h3 style="margin: 0 0 20px 0; color: #333; padding-right: 60px;">
                        📦 ${location.name}
                    </h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                        <div style="background: #eff6ff; padding: 15px; border-radius: 10px;">
                            <div style="color: #2563eb; font-size: 12px; font-weight: 600; margin-bottom: 5px;">📦 TOPLAM MİKTAR</div>
                            <div style="font-size: 18px; font-weight: 700; color: #1e40af;">${location.quantity.toLocaleString('tr-TR')}</div>
                        </div>
                        
                        <div style="background: #f0fdf4; padding: 15px; border-radius: 10px;">
                            <div style="color: #16a34a; font-size: 12px; font-weight: 600; margin-bottom: 5px;">💰 SATIŞ</div>
                            <div style="font-size: 18px; font-weight: 700; color: #15803d;">$${location.sales.toLocaleString('tr-TR', {maximumFractionDigits: 0})}</div>
                        </div>
                        
                        <div style="background: #fef3c7; padding: 15px; border-radius: 10px;">
                            <div style="color: #d97706; font-size: 12px; font-weight: 600; margin-bottom: 5px;">🛒 SİPARİŞ</div>
                            <div style="font-size: 18px; font-weight: 700; color: #b45309;">${location.orderCount.toLocaleString('tr-TR')}</div>
                        </div>
                        
                        <div style="background: #fce7f3; padding: 15px; border-radius: 10px;">
                            <div style="color: #db2777; font-size: 12px; font-weight: 600; margin-bottom: 5px;">📊 ORT. MİKTAR</div>
                            <div style="font-size: 18px; font-weight: 700; color: #be185d;">${location.avgQuantityPerOrder.toFixed(1)}</div>
                        </div>
                        
                        <div style="background: #f3e8ff; padding: 15px; border-radius: 10px;">
                            <div style="color: #9333ea; font-size: 12px; font-weight: 600; margin-bottom: 5px;">🎸 ÜRÜN</div>
                            <div style="font-size: 18px; font-weight: 700; color: #7e22ce;">${location.productCount}</div>
                        </div>
                        
                        <div style="background: #ecfccb; padding: 15px; border-radius: 10px;">
                            <div style="color: #65a30d; font-size: 12px; font-weight: 600; margin-bottom: 5px;">🏪 MAĞAZA</div>
                            <div style="font-size: 18px; font-weight: 700; color: #4d7c0f;">${location.storeCount}</div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
        
        console.log('✅ Stok analizi render edildi:', locations.length, 'lokasyon');
    }

    /**
     * Stok grafiğini render et
     */
    renderStockChart(locations) {
        const canvas = document.getElementById('stockDistributionChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Eski grafiği temizle
        if (this.stockChart) {
            this.stockChart.destroy();
        }

        // Top 10 lokasyon
        const top10 = locations.slice(0, 10);

        this.stockChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: top10.map(l => l.name),
                datasets: [{
                    data: top10.map(l => l.quantity),
                    backgroundColor: [
                        '#ef4444',
                        '#f97316',
                        '#f59e0b',
                        '#eab308',
                        '#84cc16',
                        '#22c55e',
                        '#10b981',
                        '#14b8a6',
                        '#06b6d4',
                        '#0ea5e9'
                    ],
                    borderWidth: 3,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12,
                                weight: '600'
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value.toLocaleString('tr-TR')} adet (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
}

// Global StokDagilim instance
window.StokDagilim = new StokDagilim();

console.log('📦 Stok Dağılım module loaded successfully');
