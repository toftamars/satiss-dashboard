/**
 * 👨‍💼 Satış Temsilcisi Analizi Modülü
 * Satış temsilcisi performans analizi ve karşılaştırma
 */

class SatisTemsilcisi {
    constructor() {
        this.salespersonChart = null;
        this.init();
    }

    init() {
        console.log('👨‍💼 SatisTemsilcisi initialized');
    }

    /**
     * Satış temsilcisi analizi sekmesini yükle
     */
    async loadSatisTemsilcisi() {
        console.log('📊 Satış Temsilcisi Analizi yükleniyor...');
        
        try {
            const allData = window.DataLoader?.allData || [];
            
            if (allData.length === 0) {
                console.warn('⚠️ Veri bulunamadı');
                return;
            }

            // Satış temsilcisi verilerini analiz et
            const salespersonAnalysis = this.analyzeSalespersons(allData);
            
            // Render et
            this.renderSalespersonAnalysis(salespersonAnalysis);
            this.renderSalespersonChart(salespersonAnalysis);
            
        } catch (error) {
            console.error('❌ Satış temsilcisi analizi hatası:', error);
            if (window.ErrorHandler) {
                window.ErrorHandler.handleError(error);
            }
        }
    }

    /**
     * Satış temsilcilerini analiz et
     */
    analyzeSalespersons(data) {
        const salespersonData = {};
        
        data.forEach(item => {
            const person = item.sales_person || 'Atanmamış';
            
            if (!salespersonData[person]) {
                salespersonData[person] = {
                    name: person,
                    sales: 0,
                    quantity: 0,
                    orderCount: 0,
                    customers: new Set(),
                    stores: new Set(),
                    products: new Set()
                };
            }
            
            salespersonData[person].sales += parseFloat(item.usd_amount || 0);
            salespersonData[person].quantity += parseInt(item.quantity || 0);
            salespersonData[person].orderCount += 1;
            
            if (item.partner) salespersonData[person].customers.add(item.partner);
            if (item.store) salespersonData[person].stores.add(item.store);
            if (item.product) salespersonData[person].products.add(item.product);
        });

        // Hesaplamalar
        Object.values(salespersonData).forEach(person => {
            person.avgOrderValue = person.orderCount > 0 ? person.sales / person.orderCount : 0;
            person.customerCount = person.customers.size;
            person.storeCount = person.stores.size;
            person.productCount = person.products.size;
            
            delete person.customers;
            delete person.stores;
            delete person.products;
        });

        // Sırala
        const sortedSalespersons = Object.values(salespersonData)
            .sort((a, b) => b.sales - a.sales);

        return sortedSalespersons;
    }

    /**
     * Satış temsilcisi analizini render et
     */
    renderSalespersonAnalysis(salespersons) {
        const container = document.getElementById('salespersonAnalysisContainer');
        if (!container) return;

        let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px;">';
        
        salespersons.forEach((person, index) => {
            const rank = index + 1;
            const rankColor = rank === 1 ? '#fbbf24' : rank === 2 ? '#9ca3af' : rank === 3 ? '#f97316' : '#6b7280';
            const rankIcon = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
            
            html += `
                <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); position: relative;">
                    <div style="position: absolute; top: 15px; right: 15px; background: ${rankColor}; color: white; padding: 5px 12px; border-radius: 20px; font-weight: 700; font-size: 14px;">
                        ${rankIcon}
                    </div>
                    
                    <h3 style="margin: 0 0 20px 0; color: #333; padding-right: 60px;">
                        👨‍💼 ${person.name}
                    </h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                        <div style="background: #f0fdf4; padding: 15px; border-radius: 10px;">
                            <div style="color: #16a34a; font-size: 12px; font-weight: 600; margin-bottom: 5px;">💰 TOPLAM SATIŞ</div>
                            <div style="font-size: 18px; font-weight: 700; color: #15803d;">$${person.sales.toLocaleString('tr-TR', {maximumFractionDigits: 0})}</div>
                        </div>
                        
                        <div style="background: #eff6ff; padding: 15px; border-radius: 10px;">
                            <div style="color: #2563eb; font-size: 12px; font-weight: 600; margin-bottom: 5px;">📦 MİKTAR</div>
                            <div style="font-size: 18px; font-weight: 700; color: #1e40af;">${person.quantity.toLocaleString('tr-TR')}</div>
                        </div>
                        
                        <div style="background: #fef3c7; padding: 15px; border-radius: 10px;">
                            <div style="color: #d97706; font-size: 12px; font-weight: 600; margin-bottom: 5px;">🛒 SİPARİŞ</div>
                            <div style="font-size: 18px; font-weight: 700; color: #b45309;">${person.orderCount.toLocaleString('tr-TR')}</div>
                        </div>
                        
                        <div style="background: #fce7f3; padding: 15px; border-radius: 10px;">
                            <div style="color: #db2777; font-size: 12px; font-weight: 600; margin-bottom: 5px;">💵 ORT. SEPET</div>
                            <div style="font-size: 18px; font-weight: 700; color: #be185d;">$${person.avgOrderValue.toLocaleString('tr-TR', {maximumFractionDigits: 0})}</div>
                        </div>
                        
                        <div style="background: #f3e8ff; padding: 15px; border-radius: 10px;">
                            <div style="color: #9333ea; font-size: 12px; font-weight: 600; margin-bottom: 5px;">👥 MÜŞTERİ</div>
                            <div style="font-size: 18px; font-weight: 700; color: #7e22ce;">${person.customerCount}</div>
                        </div>
                        
                        <div style="background: #ecfccb; padding: 15px; border-radius: 10px;">
                            <div style="color: #65a30d; font-size: 12px; font-weight: 600; margin-bottom: 5px;">🏪 MAĞAZA</div>
                            <div style="font-size: 18px; font-weight: 700; color: #4d7c0f;">${person.storeCount}</div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
        
        console.log('✅ Satış temsilcisi analizi render edildi:', salespersons.length, 'temsilci');
    }

    /**
     * Satış temsilcisi grafiğini render et
     */
    renderSalespersonChart(salespersons) {
        const canvas = document.getElementById('salespersonComparisonChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Eski grafiği temizle
        if (this.salespersonChart) {
            this.salespersonChart.destroy();
        }

        // Top 10 temsilci
        const top10 = salespersons.slice(0, 10);

        this.salespersonChart = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: top10.map(s => s.name),
                datasets: [{
                    label: 'Toplam Satış (USD)',
                    data: top10.map(s => s.sales),
                    backgroundColor: 'rgba(118, 75, 162, 0.8)',
                    borderColor: 'rgba(118, 75, 162, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return '$' + context.parsed.x.toLocaleString('tr-TR', {maximumFractionDigits: 0});
                            }
                        }
                    }
                },
                scales: {
                    x: {
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

// Global SatisTemsilcisi instance
window.SatisTemsilcisi = new SatisTemsilcisi();

console.log('👨‍💼 Satış Temsilcisi module loaded successfully');
