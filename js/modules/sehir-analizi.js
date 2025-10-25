/**
 * 🌍 Şehir Analizi Modülü
 * Coğrafi satış analizi ve şehir bazlı performans
 */

class SehirAnalizi {
    constructor() {
        this.cityChart = null;
        this.init();
    }

    init() {
        console.log('🌍 SehirAnalizi initialized');
    }

    /**
     * Şehir analizi sekmesini yükle
     */
    async loadSehirAnalizi() {
        console.log('📊 Şehir Analizi yükleniyor...');
        
        try {
            const allData = window.DataLoader?.allData || [];
            
            if (allData.length === 0) {
                console.warn('⚠️ Veri bulunamadı');
                return;
            }

            // Şehir verilerini analiz et
            const cityAnalysis = this.analyzeCities(allData);
            
            // Render et
            this.renderCityAnalysis(cityAnalysis);
            this.renderCityChart(cityAnalysis);
            
        } catch (error) {
            console.error('❌ Şehir analizi hatası:', error);
            if (window.ErrorHandler) {
                window.ErrorHandler.handleError(error);
            }
        }
    }

    /**
     * Şehirleri analiz et
     */
    analyzeCities(data) {
        const cityData = {};
        
        data.forEach(item => {
            const city = item.city || 'Bilinmiyor';
            
            if (!cityData[city]) {
                cityData[city] = {
                    name: city,
                    sales: 0,
                    quantity: 0,
                    orderCount: 0,
                    customers: new Set(),
                    stores: new Set(),
                    products: new Set()
                };
            }
            
            cityData[city].sales += parseFloat(item.usd_amount || 0);
            cityData[city].quantity += parseInt(item.quantity || 0);
            cityData[city].orderCount += 1;
            
            if (item.partner) cityData[city].customers.add(item.partner);
            if (item.store) cityData[city].stores.add(item.store);
            if (item.product) cityData[city].products.add(item.product);
        });

        // Hesaplamalar
        Object.values(cityData).forEach(city => {
            city.avgOrderValue = city.orderCount > 0 ? city.sales / city.orderCount : 0;
            city.customerCount = city.customers.size;
            city.storeCount = city.stores.size;
            city.productCount = city.products.size;
            
            delete city.customers;
            delete city.stores;
            delete city.products;
        });

        // Sırala
        const sortedCities = Object.values(cityData)
            .filter(c => c.name !== 'Bilinmiyor')
            .sort((a, b) => b.sales - a.sales);

        return sortedCities;
    }

    /**
     * Şehir analizini render et
     */
    renderCityAnalysis(cities) {
        const container = document.getElementById('cityAnalysisContainer');
        if (!container) return;

        let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px;">';
        
        cities.forEach((city, index) => {
            const rank = index + 1;
            const rankColor = rank === 1 ? '#fbbf24' : rank === 2 ? '#9ca3af' : rank === 3 ? '#f97316' : '#6b7280';
            const rankIcon = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
            
            html += `
                <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); position: relative;">
                    <div style="position: absolute; top: 15px; right: 15px; background: ${rankColor}; color: white; padding: 5px 12px; border-radius: 20px; font-weight: 700; font-size: 14px;">
                        ${rankIcon}
                    </div>
                    
                    <h3 style="margin: 0 0 20px 0; color: #333; padding-right: 60px;">
                        🌍 ${city.name}
                    </h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                        <div style="background: #f0fdf4; padding: 15px; border-radius: 10px;">
                            <div style="color: #16a34a; font-size: 12px; font-weight: 600; margin-bottom: 5px;">💰 TOPLAM SATIŞ</div>
                            <div style="font-size: 18px; font-weight: 700; color: #15803d;">$${city.sales.toLocaleString('tr-TR', {maximumFractionDigits: 0})}</div>
                        </div>
                        
                        <div style="background: #eff6ff; padding: 15px; border-radius: 10px;">
                            <div style="color: #2563eb; font-size: 12px; font-weight: 600; margin-bottom: 5px;">📦 MİKTAR</div>
                            <div style="font-size: 18px; font-weight: 700; color: #1e40af;">${city.quantity.toLocaleString('tr-TR')}</div>
                        </div>
                        
                        <div style="background: #fef3c7; padding: 15px; border-radius: 10px;">
                            <div style="color: #d97706; font-size: 12px; font-weight: 600; margin-bottom: 5px;">🛒 SİPARİŞ</div>
                            <div style="font-size: 18px; font-weight: 700; color: #b45309;">${city.orderCount.toLocaleString('tr-TR')}</div>
                        </div>
                        
                        <div style="background: #fce7f3; padding: 15px; border-radius: 10px;">
                            <div style="color: #db2777; font-size: 12px; font-weight: 600; margin-bottom: 5px;">💵 ORT. SEPET</div>
                            <div style="font-size: 18px; font-weight: 700; color: #be185d;">$${city.avgOrderValue.toLocaleString('tr-TR', {maximumFractionDigits: 0})}</div>
                        </div>
                        
                        <div style="background: #f3e8ff; padding: 15px; border-radius: 10px;">
                            <div style="color: #9333ea; font-size: 12px; font-weight: 600; margin-bottom: 5px;">👥 MÜŞTERİ</div>
                            <div style="font-size: 18px; font-weight: 700; color: #7e22ce;">${city.customerCount}</div>
                        </div>
                        
                        <div style="background: #ecfccb; padding: 15px; border-radius: 10px;">
                            <div style="color: #65a30d; font-size: 12px; font-weight: 600; margin-bottom: 5px;">🏪 MAĞAZA</div>
                            <div style="font-size: 18px; font-weight: 700; color: #4d7c0f;">${city.storeCount}</div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
        
        console.log('✅ Şehir analizi render edildi:', cities.length, 'şehir');
    }

    /**
     * Şehir grafiğini render et
     */
    renderCityChart(cities) {
        const canvas = document.getElementById('cityComparisonChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Eski grafiği temizle
        if (this.cityChart) {
            this.cityChart.destroy();
        }

        // Top 15 şehir
        const top15 = cities.slice(0, 15);

        this.cityChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: top15.map(c => c.name),
                datasets: [{
                    label: 'Toplam Satış (USD)',
                    data: top15.map(c => c.sales),
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderColor: 'rgba(16, 185, 129, 1)',
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

// Global SehirAnalizi instance
window.SehirAnalizi = new SehirAnalizi();

console.log('🌍 Şehir Analizi module loaded successfully');
