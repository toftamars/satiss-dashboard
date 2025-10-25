/**
 * ⏰ Zaman Analizi Modülü
 * Trend analizi, aylık/haftalık/günlük performans
 */

class ZamanAnalizi {
    constructor() {
        this.timeChart = null;
        this.init();
    }

    init() {
        console.log('⏰ ZamanAnalizi initialized');
    }

    /**
     * Zaman analizi sekmesini yükle
     */
    async loadZamanAnalizi() {
        console.log('📊 Zaman Analizi yükleniyor...');
        
        try {
            const allData = window.DataLoader?.allData || [];
            
            if (allData.length === 0) {
                console.warn('⚠️ Veri bulunamadı');
                return;
            }

            // Zaman verilerini analiz et
            const timeAnalysis = this.analyzeTime(allData);
            
            // Render et
            this.renderTimeAnalysis(timeAnalysis);
            this.renderTimeChart(timeAnalysis);
            
        } catch (error) {
            console.error('❌ Zaman analizi hatası:', error);
            if (window.ErrorHandler) {
                window.ErrorHandler.handleError(error);
            }
        }
    }

    /**
     * Zaman verilerini analiz et
     */
    analyzeTime(data) {
        const monthlyData = {};
        const weeklyData = {};
        const dailyData = {};
        
        data.forEach(item => {
            if (!item.date) return;
            
            // Aylık
            const month = item.date.substring(0, 7); // YYYY-MM
            if (!monthlyData[month]) {
                monthlyData[month] = {
                    period: month,
                    sales: 0,
                    quantity: 0,
                    orderCount: 0
                };
            }
            monthlyData[month].sales += parseFloat(item.usd_amount || 0);
            monthlyData[month].quantity += parseInt(item.quantity || 0);
            monthlyData[month].orderCount += 1;
            
            // Haftalık (ISO Week)
            const date = new Date(item.date);
            const weekNumber = this.getWeekNumber(date);
            const weekKey = `${date.getFullYear()}-W${weekNumber}`;
            if (!weeklyData[weekKey]) {
                weeklyData[weekKey] = {
                    period: weekKey,
                    sales: 0,
                    quantity: 0,
                    orderCount: 0
                };
            }
            weeklyData[weekKey].sales += parseFloat(item.usd_amount || 0);
            weeklyData[weekKey].quantity += parseInt(item.quantity || 0);
            weeklyData[weekKey].orderCount += 1;
            
            // Günlük
            const day = item.date.substring(0, 10); // YYYY-MM-DD
            if (!dailyData[day]) {
                dailyData[day] = {
                    period: day,
                    sales: 0,
                    quantity: 0,
                    orderCount: 0
                };
            }
            dailyData[day].sales += parseFloat(item.usd_amount || 0);
            dailyData[day].quantity += parseInt(item.quantity || 0);
            dailyData[day].orderCount += 1;
        });

        // Sırala
        const sortedMonthly = Object.values(monthlyData).sort((a, b) => a.period.localeCompare(b.period));
        const sortedWeekly = Object.values(weeklyData).sort((a, b) => a.period.localeCompare(b.period));
        const sortedDaily = Object.values(dailyData).sort((a, b) => a.period.localeCompare(b.period));

        return {
            monthly: sortedMonthly,
            weekly: sortedWeekly,
            daily: sortedDaily
        };
    }

    /**
     * ISO hafta numarasını hesapla
     */
    getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }

    /**
     * Zaman analizini render et
     */
    renderTimeAnalysis(analysis) {
        const container = document.getElementById('timeAnalysisContainer');
        if (!container) return;

        // Son 12 ay
        const last12Months = analysis.monthly.slice(-12);
        
        let html = `
            <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 30px;">
                <h3 style="margin: 0 0 20px 0;">📅 Son 12 Ay Performansı</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
        `;
        
        last12Months.forEach((month, index) => {
            const monthName = this.formatMonthName(month.period);
            const isLastMonth = index === last12Months.length - 1;
            const bgColor = isLastMonth ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f9fafb';
            const textColor = isLastMonth ? 'white' : '#333';
            
            html += `
                <div style="background: ${bgColor}; padding: 20px; border-radius: 12px; ${!isLastMonth ? 'border: 1px solid #e5e7eb;' : ''}">
                    <div style="color: ${isLastMonth ? 'rgba(255,255,255,0.9)' : '#6b7280'}; font-size: 13px; font-weight: 600; margin-bottom: 10px;">
                        ${monthName}
                    </div>
                    <div style="color: ${textColor}; font-size: 24px; font-weight: 700; margin-bottom: 8px;">
                        $${month.sales.toLocaleString('tr-TR', {maximumFractionDigits: 0})}
                    </div>
                    <div style="color: ${isLastMonth ? 'rgba(255,255,255,0.8)' : '#6b7280'}; font-size: 12px;">
                        📦 ${month.quantity.toLocaleString('tr-TR')} adet • 🛒 ${month.orderCount} sipariş
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
            
            <!-- Trend Özeti -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <div style="font-size: 14px; opacity: 0.9; margin-bottom: 5px;">📊 Toplam Ay</div>
                    <div style="font-size: 32px; font-weight: 700;">${analysis.monthly.length}</div>
                    <div style="font-size: 14px; opacity: 0.9; margin-top: 10px;">Veri Dönemi</div>
                </div>
                
                <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <div style="font-size: 14px; opacity: 0.9; margin-bottom: 5px;">💰 Ortalama Aylık</div>
                    <div style="font-size: 32px; font-weight: 700;">$${(analysis.monthly.reduce((sum, m) => sum + m.sales, 0) / analysis.monthly.length).toLocaleString('tr-TR', {maximumFractionDigits: 0})}</div>
                    <div style="font-size: 14px; opacity: 0.9; margin-top: 10px;">Satış</div>
                </div>
                
                <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <div style="font-size: 14px; opacity: 0.9; margin-bottom: 5px;">📈 En İyi Ay</div>
                    <div style="font-size: 32px; font-weight: 700;">$${Math.max(...analysis.monthly.map(m => m.sales)).toLocaleString('tr-TR', {maximumFractionDigits: 0})}</div>
                    <div style="font-size: 14px; opacity: 0.9; margin-top: 10px;">${this.formatMonthName(analysis.monthly.find(m => m.sales === Math.max(...analysis.monthly.map(x => x.sales))).period)}</div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        
        console.log('✅ Zaman analizi render edildi');
    }

    /**
     * Ay ismini formatla
     */
    formatMonthName(period) {
        const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                       'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
        const [year, month] = period.split('-');
        return `${months[parseInt(month) - 1]} ${year}`;
    }

    /**
     * Zaman grafiğini render et
     */
    renderTimeChart(analysis) {
        const canvas = document.getElementById('timeTrendChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Eski grafiği temizle
        if (this.timeChart) {
            this.timeChart.destroy();
        }

        // Son 12 ay
        const last12Months = analysis.monthly.slice(-12);

        this.timeChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: last12Months.map(m => this.formatMonthName(m.period)),
                datasets: [{
                    label: 'Satış (USD)',
                    data: last12Months.map(m => m.sales),
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
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

// Global ZamanAnalizi instance
window.ZamanAnalizi = new ZamanAnalizi();

console.log('⏰ Zaman Analizi module loaded successfully');
