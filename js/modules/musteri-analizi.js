/**
 * 👥 Müşteri Analizi Modülü
 * Müşteri segmentasyonu, satın alma davranışları ve sadakat analizi
 */

class MusteriAnalizi {
    constructor() {
        this.customerChart = null;
        this.init();
    }

    init() {
        console.log('👥 MusteriAnalizi initialized');
    }

    /**
     * Müşteri analizi sekmesini yükle
     */
    async loadMusteriAnalizi() {
        console.log('📊 Müşteri Analizi yükleniyor...');
        
        try {
            const allData = window.DataLoader?.allData || [];
            
            if (allData.length === 0) {
                console.warn('⚠️ Veri bulunamadı');
                return;
            }

            // Müşteri verilerini analiz et
            const customerAnalysis = this.analyzeCustomers(allData);
            
            // Render et
            this.renderCustomerAnalysis(customerAnalysis);
            this.renderCustomerChart(customerAnalysis);
            
        } catch (error) {
            console.error('❌ Müşteri analizi hatası:', error);
            if (window.ErrorHandler) {
                window.ErrorHandler.handleError(error);
            }
        }
    }

    /**
     * Müşterileri analiz et
     */
    analyzeCustomers(data) {
        const customerData = {};
        
        data.forEach(item => {
            const customer = item.partner || 'Bilinmiyor';
            
            if (!customerData[customer]) {
                customerData[customer] = {
                    name: customer,
                    sales: 0,
                    quantity: 0,
                    orderCount: 0,
                    stores: new Set(),
                    products: new Set(),
                    brands: new Set(),
                    firstOrder: item.date,
                    lastOrder: item.date
                };
            }
            
            customerData[customer].sales += parseFloat(item.usd_amount || 0);
            customerData[customer].quantity += parseInt(item.quantity || 0);
            customerData[customer].orderCount += 1;
            
            if (item.store) customerData[customer].stores.add(item.store);
            if (item.product) customerData[customer].products.add(item.product);
            if (item.brand) customerData[customer].brands.add(item.brand);
            
            // İlk ve son sipariş tarihi
            if (item.date < customerData[customer].firstOrder) {
                customerData[customer].firstOrder = item.date;
            }
            if (item.date > customerData[customer].lastOrder) {
                customerData[customer].lastOrder = item.date;
            }
        });

        // Hesaplamalar
        Object.values(customerData).forEach(customer => {
            customer.avgOrderValue = customer.orderCount > 0 ? customer.sales / customer.orderCount : 0;
            customer.storeCount = customer.stores.size;
            customer.productCount = customer.products.size;
            customer.brandCount = customer.brands.size;
            
            // Müşteri yaşı (gün)
            const firstDate = new Date(customer.firstOrder);
            const lastDate = new Date(customer.lastOrder);
            customer.customerAge = Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24));
            
            // Segmentasyon
            if (customer.sales > 50000) {
                customer.segment = 'VIP';
                customer.segmentColor = '#dc2626';
            } else if (customer.sales > 20000) {
                customer.segment = 'Premium';
                customer.segmentColor = '#ea580c';
            } else if (customer.sales > 5000) {
                customer.segment = 'Sadık';
                customer.segmentColor = '#ca8a04';
            } else {
                customer.segment = 'Standart';
                customer.segmentColor = '#65a30d';
            }
            
            delete customer.stores;
            delete customer.products;
            delete customer.brands;
        });

        // Sırala
        const sortedCustomers = Object.values(customerData)
            .filter(c => c.name !== 'Bilinmiyor')
            .sort((a, b) => b.sales - a.sales);

        return sortedCustomers;
    }

    /**
     * Müşteri analizini render et
     */
    renderCustomerAnalysis(customers) {
        const container = document.getElementById('customerAnalysisContainer');
        if (!container) return;

        // Segmentasyon özeti
        const segments = {
            'VIP': customers.filter(c => c.segment === 'VIP'),
            'Premium': customers.filter(c => c.segment === 'Premium'),
            'Sadık': customers.filter(c => c.segment === 'Sadık'),
            'Standart': customers.filter(c => c.segment === 'Standart')
        };

        let html = `
            <!-- Segmentasyon Özeti -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
                <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <div style="font-size: 14px; opacity: 0.9; margin-bottom: 5px;">👑 VIP Müşteriler</div>
                    <div style="font-size: 32px; font-weight: 700;">${segments.VIP.length}</div>
                    <div style="font-size: 14px; opacity: 0.9; margin-top: 10px;">$${segments.VIP.reduce((sum, c) => sum + c.sales, 0).toLocaleString('tr-TR', {maximumFractionDigits: 0})}</div>
                </div>
                <div style="background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%); color: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <div style="font-size: 14px; opacity: 0.9; margin-bottom: 5px;">💎 Premium Müşteriler</div>
                    <div style="font-size: 32px; font-weight: 700;">${segments.Premium.length}</div>
                    <div style="font-size: 14px; opacity: 0.9; margin-top: 10px;">$${segments.Premium.reduce((sum, c) => sum + c.sales, 0).toLocaleString('tr-TR', {maximumFractionDigits: 0})}</div>
                </div>
                <div style="background: linear-gradient(135deg, #ca8a04 0%, #a16207 100%); color: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <div style="font-size: 14px; opacity: 0.9; margin-bottom: 5px;">⭐ Sadık Müşteriler</div>
                    <div style="font-size: 32px; font-weight: 700;">${segments['Sadık'].length}</div>
                    <div style="font-size: 14px; opacity: 0.9; margin-top: 10px;">$${segments['Sadık'].reduce((sum, c) => sum + c.sales, 0).toLocaleString('tr-TR', {maximumFractionDigits: 0})}</div>
                </div>
                <div style="background: linear-gradient(135deg, #65a30d 0%, #4d7c0f 100%); color: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <div style="font-size: 14px; opacity: 0.9; margin-bottom: 5px;">👤 Standart Müşteriler</div>
                    <div style="font-size: 32px; font-weight: 700;">${segments.Standart.length}</div>
                    <div style="font-size: 14px; opacity: 0.9; margin-top: 10px;">$${segments.Standart.reduce((sum, c) => sum + c.sales, 0).toLocaleString('tr-TR', {maximumFractionDigits: 0})}</div>
                </div>
            </div>
            
            <!-- Müşteri Detayları -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px;">
        `;
        
        // Top 50 müşteri
        customers.slice(0, 50).forEach((customer, index) => {
            const rank = index + 1;
            
            html += `
                <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); position: relative;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                        <div style="flex: 1; padding-right: 10px;">
                            <div style="font-size: 12px; color: #6b7280; margin-bottom: 5px;">#${rank}</div>
                            <h4 style="margin: 0; color: #333; font-size: 16px; line-height: 1.4;">${customer.name}</h4>
                        </div>
                        <div style="background: ${customer.segmentColor}; color: white; padding: 5px 12px; border-radius: 20px; font-weight: 700; font-size: 12px; white-space: nowrap;">
                            ${customer.segment}
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px;">
                        <div>
                            <div style="color: #6b7280; font-size: 11px; margin-bottom: 3px;">💰 Toplam Satış</div>
                            <div style="font-weight: 700; color: #16a34a;">$${customer.sales.toLocaleString('tr-TR', {maximumFractionDigits: 0})}</div>
                        </div>
                        <div>
                            <div style="color: #6b7280; font-size: 11px; margin-bottom: 3px;">🛒 Sipariş</div>
                            <div style="font-weight: 700;">${customer.orderCount}</div>
                        </div>
                        <div>
                            <div style="color: #6b7280; font-size: 11px; margin-bottom: 3px;">💵 Ort. Sepet</div>
                            <div style="font-weight: 700;">$${customer.avgOrderValue.toLocaleString('tr-TR', {maximumFractionDigits: 0})}</div>
                        </div>
                        <div>
                            <div style="color: #6b7280; font-size: 11px; margin-bottom: 3px;">📦 Miktar</div>
                            <div style="font-weight: 700;">${customer.quantity}</div>
                        </div>
                        <div>
                            <div style="color: #6b7280; font-size: 11px; margin-bottom: 3px;">🏪 Mağaza</div>
                            <div style="font-weight: 700;">${customer.storeCount}</div>
                        </div>
                        <div>
                            <div style="color: #6b7280; font-size: 11px; margin-bottom: 3px;">🎸 Ürün</div>
                            <div style="font-weight: 700;">${customer.productCount}</div>
                        </div>
                        <div style="grid-column: 1 / -1;">
                            <div style="color: #6b7280; font-size: 11px; margin-bottom: 3px;">📅 Müşteri Yaşı</div>
                            <div style="font-weight: 700;">${customer.customerAge} gün</div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
        
        console.log('✅ Müşteri analizi render edildi:', customers.length, 'müşteri');
    }

    /**
     * Müşteri grafiğini render et
     */
    renderCustomerChart(customers) {
        const canvas = document.getElementById('customerSegmentChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Eski grafiği temizle
        if (this.customerChart) {
            this.customerChart.destroy();
        }

        // Segmentasyon verileri
        const segments = {
            'VIP': customers.filter(c => c.segment === 'VIP'),
            'Premium': customers.filter(c => c.segment === 'Premium'),
            'Sadık': customers.filter(c => c.segment === 'Sadık'),
            'Standart': customers.filter(c => c.segment === 'Standart')
        };

        this.customerChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['VIP', 'Premium', 'Sadık', 'Standart'],
                datasets: [{
                    data: [
                        segments.VIP.reduce((sum, c) => sum + c.sales, 0),
                        segments.Premium.reduce((sum, c) => sum + c.sales, 0),
                        segments['Sadık'].reduce((sum, c) => sum + c.sales, 0),
                        segments.Standart.reduce((sum, c) => sum + c.sales, 0)
                    ],
                    backgroundColor: [
                        '#dc2626',
                        '#ea580c',
                        '#ca8a04',
                        '#65a30d'
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
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            font: {
                                size: 14,
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
                                return `${label}: $${value.toLocaleString('tr-TR', {maximumFractionDigits: 0})} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
}

// Global MusteriAnalizi instance
window.MusteriAnalizi = new MusteriAnalizi();

console.log('👥 Müşteri Analizi module loaded successfully');
