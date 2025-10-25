/**
 * 🏪 Mağaza Analizi Modülü
 * Mağaza performans analizi, karşılaştırma ve detaylı raporlar
 */

class MagazaAnalizi {
    constructor() {
        this.storeChart = null;
        this.init();
    }

    init() {
        console.log('🏪 MagazaAnalizi initialized');
    }

    /**
     * Mağaza analizi sekmesini yükle
     */
    async loadMagazaAnalizi() {
        console.log('📊 Mağaza Analizi yükleniyor...');
        
        try {
            const allData = window.DataLoader?.allData || [];
            
            if (allData.length === 0) {
                console.warn('⚠️ Veri bulunamadı');
                return;
            }

            // Mağaza verilerini analiz et
            const storeAnalysis = this.analyzeStores(allData);
            
            // Render et
            this.renderStoreAnalysis(storeAnalysis);
            this.renderStoreChart(storeAnalysis);
            
        } catch (error) {
            console.error('❌ Mağaza analizi hatası:', error);
            if (window.ErrorHandler) {
                window.ErrorHandler.handleError(error);
            }
        }
    }

    /**
     * Mağazaları analiz et
     */
    analyzeStores(data) {
        const storeData = {};
        
        data.forEach(item => {
            const store = item.store || 'Bilinmiyor';
            
            if (!storeData[store]) {
                storeData[store] = {
                    name: store,
                    sales: 0,
                    quantity: 0,
                    orderCount: 0,
                    customers: new Set(),
                    products: new Set(),
                    avgOrderValue: 0
                };
            }
            
            storeData[store].sales += parseFloat(item.usd_amount || 0);
            storeData[store].quantity += parseInt(item.quantity || 0);
            storeData[store].orderCount += 1;
            
            if (item.partner) {
                storeData[store].customers.add(item.partner);
            }
            if (item.product) {
                storeData[store].products.add(item.product);
            }
        });

        // Ortalama sipariş değerini hesapla
        Object.values(storeData).forEach(store => {
            store.avgOrderValue = store.orderCount > 0 ? store.sales / store.orderCount : 0;
            store.customerCount = store.customers.size;
            store.productCount = store.products.size;
            delete store.customers;
            delete store.products;
        });

        // Sırala
        const sortedStores = Object.values(storeData)
            .filter(s => s.name !== 'Analitik' && !s.name.toLowerCase().includes('eğitim'))
            .sort((a, b) => b.sales - a.sales);

        return sortedStores;
    }

    /**
     * Mağaza analizini render et
     */
    renderStoreAnalysis(stores) {
        const container = document.getElementById('storeAnalysisContainer');
        if (!container) return;

        let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px;">';
        
        stores.forEach((store, index) => {
            const rank = index + 1;
            const rankColor = rank === 1 ? '#fbbf24' : rank === 2 ? '#9ca3af' : rank === 3 ? '#f97316' : '#6b7280';
            const rankIcon = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
            
            html += `
                <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); position: relative;">
                    <div style="position: absolute; top: 15px; right: 15px; background: ${rankColor}; color: white; padding: 5px 12px; border-radius: 20px; font-weight: 700; font-size: 14px;">
                        ${rankIcon}
                    </div>
                    
                    <h3 style="margin: 0 0 20px 0; color: #333; padding-right: 60px;">${store.name}</h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                        <div style="background: #f0fdf4; padding: 15px; border-radius: 10px;">
                            <div style="color: #16a34a; font-size: 12px; font-weight: 600; margin-bottom: 5px;">💰 TOPLAM SATIŞ</div>
                            <div style="font-size: 18px; font-weight: 700; color: #15803d;">$${store.sales.toLocaleString('tr-TR', {maximumFractionDigits: 0})}</div>
                        </div>
                        
                        <div style="background: #eff6ff; padding: 15px; border-radius: 10px;">
                            <div style="color: #2563eb; font-size: 12px; font-weight: 600; margin-bottom: 5px;">📦 MİKTAR</div>
                            <div style="font-size: 18px; font-weight: 700; color: #1e40af;">${store.quantity.toLocaleString('tr-TR')}</div>
                        </div>
                        
                        <div style="background: #fef3c7; padding: 15px; border-radius: 10px;">
                            <div style="color: #d97706; font-size: 12px; font-weight: 600; margin-bottom: 5px;">🛒 SİPARİŞ</div>
                            <div style="font-size: 18px; font-weight: 700; color: #b45309;">${store.orderCount.toLocaleString('tr-TR')}</div>
                        </div>
                        
                        <div style="background: #fce7f3; padding: 15px; border-radius: 10px;">
                            <div style="color: #db2777; font-size: 12px; font-weight: 600; margin-bottom: 5px;">💵 ORT. SEPET</div>
                            <div style="font-size: 18px; font-weight: 700; color: #be185d;">$${store.avgOrderValue.toLocaleString('tr-TR', {maximumFractionDigits: 0})}</div>
                        </div>
                        
                        <div style="background: #f3e8ff; padding: 15px; border-radius: 10px;">
                            <div style="color: #9333ea; font-size: 12px; font-weight: 600; margin-bottom: 5px;">👥 MÜŞTERİ</div>
                            <div style="font-size: 18px; font-weight: 700; color: #7e22ce;">${store.customerCount}</div>
                        </div>
                        
                        <div style="background: #ecfccb; padding: 15px; border-radius: 10px;">
                            <div style="color: #65a30d; font-size: 12px; font-weight: 600; margin-bottom: 5px;">🎸 ÜRÜN</div>
                            <div style="font-size: 18px; font-weight: 700; color: #4d7c0f;">${store.productCount}</div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
        
        console.log('✅ Mağaza analizi render edildi:', stores.length, 'mağaza');
    }

    /**
     * Mağaza grafiğini render et
     */
    renderStoreChart(stores) {
        const canvas = document.getElementById('storeComparisonChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Eski grafiği temizle
        if (this.storeChart) {
            this.storeChart.destroy();
        }

        // Top 10 mağaza
        const top10 = stores.slice(0, 10);

        this.storeChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: top10.map(s => s.name),
                datasets: [{
                    label: 'Toplam Satış (USD)',
                    data: top10.map(s => s.sales),
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return '$' + context.parsed.y.toLocaleString('tr-TR', {maximumFractionDigits: 0});
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + (value / 1000).toFixed(0) + 'K';
                            }
                        }
                    }
                }
            }
        });
    }
}

// Global MagazaAnalizi instance
window.MagazaAnalizi = new MagazaAnalizi();

console.log('🏪 Mağaza Analizi module loaded successfully');
