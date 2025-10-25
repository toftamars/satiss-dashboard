/**
 * @fileoverview Charts Module
 * @description Chart.js wrapper ve tüm grafik fonksiyonları
 * @module Charts
 */

import { AppData } from './app-state.js';
import { formatCurrency, formatNumber, groupBy, sumBy } from './utils.js';

/**
 * Chart instance'larını sakla
 */
const chartInstances = {
    dashYearly: null,
    dashTopStores: null,
    dashTopSalespeople: null,
    dashTopBrands: null,
    dashTopCategories: null,
    dashTopCities: null,
    dashTopProducts: null
};

/**
 * Chart renkler
 */
const CHART_COLORS = {
    primary: 'rgba(102, 126, 234, 1)',
    secondary: 'rgba(245, 87, 108, 1)',
    success: 'rgba(56, 239, 125, 1)',
    warning: 'rgba(255, 206, 86, 1)',
    info: 'rgba(79, 172, 254, 1)',
    purple: 'rgba(153, 102, 255, 1)',
    orange: 'rgba(255, 159, 64, 1)',
    pink: 'rgba(255, 99, 132, 1)'
};

/**
 * Ay isimleri
 */
const MONTH_NAMES = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                     'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

/**
 * Chart'ı yok et
 * @param {string} key - Chart key
 */
function destroyChart(key) {
    if (chartInstances[key]) {
        chartInstances[key].destroy();
        chartInstances[key] = null;
    }
}

/**
 * Yıllık karşılaştırma grafiği
 * @param {string} metricType - 'sales' veya 'qty'
 */
export function renderYearlyComparisonChart(metricType = 'sales') {
    const ctx = document.getElementById('dashYearlyChart');
    if (!ctx) return;
    
    const yearlyMonthlyData = {};
    const yearlyMonthlyQty = {};
    
    AppData.allData.forEach(item => {
        if (item.date) {
            const year = item.date.substring(0, 4);
            const month = item.date.substring(5, 7);
            
            // Satış tutarı
            if (!yearlyMonthlyData[year]) yearlyMonthlyData[year] = {};
            if (!yearlyMonthlyData[year][month]) yearlyMonthlyData[year][month] = 0;
            yearlyMonthlyData[year][month] += parseFloat(item.usd_amount || 0);
            
            // Miktar
            if (!yearlyMonthlyQty[year]) yearlyMonthlyQty[year] = {};
            if (!yearlyMonthlyQty[year][month]) yearlyMonthlyQty[year][month] = 0;
            yearlyMonthlyQty[year][month] += parseFloat(item.quantity || 0);
        }
    });
    
    const allMonthKeys = new Set();
    Object.values(yearlyMonthlyData).forEach(yearData => {
        Object.keys(yearData).forEach(month => allMonthKeys.add(month));
    });
    
    const sortedMonths = Array.from(allMonthKeys).sort();
    const sourceData = metricType === 'sales' ? yearlyMonthlyData : yearlyMonthlyQty;
    
    const datasets = [];
    const colors = [
        {border: CHART_COLORS.primary, bg: 'rgba(102, 126, 234, 0.1)'},
        {border: CHART_COLORS.secondary, bg: 'rgba(245, 87, 108, 0.1)'},
        {border: CHART_COLORS.success, bg: 'rgba(56, 239, 125, 0.1)'},
        {border: CHART_COLORS.warning, bg: 'rgba(255, 206, 86, 0.1)'}
    ];
    
    Object.keys(sourceData).sort().forEach((year, idx) => {
        const yearData = sourceData[year];
        const values = sortedMonths.map(month => yearData[month] || 0);
        const color = colors[idx % colors.length];
        
        datasets.push({
            label: `${year}`,
            data: values,
            borderColor: color.border,
            backgroundColor: color.bg,
            borderWidth: 3,
            fill: true,
            tension: 0.4
        });
    });
    
    destroyChart('dashYearly');
    
    const labels = sortedMonths.map(m => MONTH_NAMES[parseInt(m) - 1]);
    const isSales = metricType === 'sales';
    
    chartInstances.dashYearly = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: { display: true, position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (isSales) {
                                return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
                            } else {
                                return context.dataset.label + ': ' + formatNumber(context.parsed.y) + ' adet';
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: isSales ? 'Satış (USD - KDV Hariç)' : 'Miktar (Adet)',
                        color: isSales ? CHART_COLORS.primary : CHART_COLORS.orange,
                        font: { weight: 'bold', size: 12 }
                    },
                    ticks: {
                        callback: function(value) {
                            return isSales ? formatCurrency(value) : formatNumber(value) + ' adet';
                        }
                    }
                }
            }
        }
    });
}

/**
 * Top 10 doughnut chart oluştur
 * @param {string} canvasId - Canvas ID
 * @param {Object} data - Veri {label: value}
 * @param {string} chartKey - Chart instance key
 */
function createTopChart(canvasId, data, chartKey) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    
    const sortedData = Object.entries(data)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    const labels = sortedData.map(([label]) => label);
    const values = sortedData.map(([, value]) => value);
    const total = values.reduce((sum, val) => sum + val, 0);
    
    destroyChart(chartKey);
    
    chartInstances[chartKey] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    CHART_COLORS.primary,
                    CHART_COLORS.secondary,
                    CHART_COLORS.success,
                    CHART_COLORS.warning,
                    CHART_COLORS.info,
                    CHART_COLORS.purple,
                    CHART_COLORS.orange,
                    CHART_COLORS.pink,
                    'rgba(201, 203, 207, 1)',
                    'rgba(75, 192, 192, 1)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: true, position: 'right' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed;
                            const percentage = ((value / total) * 100).toFixed(1);
                            return context.label + ': ' + formatCurrency(value) + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

/**
 * Top 10 Müşteri grafiği
 * @param {Array} data - Veri
 */
export function renderTopCustomersChart(data) {
    const customerSales = {};
    data.forEach(item => {
        const customer = item.partner || 'Bilinmeyen';
        customerSales[customer] = (customerSales[customer] || 0) + parseFloat(item.usd_amount || 0);
    });
    createTopChart('dashTopStoresChart', customerSales, 'dashTopStores');
}

/**
 * Top 10 Satış Temsilcisi grafiği
 * @param {Array} data - Veri
 */
export function renderTopSalespeopleChart(data) {
    const salespersonSales = {};
    data.forEach(item => {
        const salesperson = item.sales_person || 'Bilinmeyen';
        salespersonSales[salesperson] = (salespersonSales[salesperson] || 0) + parseFloat(item.usd_amount || 0);
    });
    createTopChart('dashTopSalespeopleChart', salespersonSales, 'dashTopSalespeople');
}

/**
 * Top 10 Marka grafiği
 * @param {Array} data - Veri
 */
export function renderTopBrandsChart(data) {
    const brandSales = {};
    data.forEach(item => {
        const brand = item.brand || 'Bilinmeyen';
        brandSales[brand] = (brandSales[brand] || 0) + parseFloat(item.usd_amount || 0);
    });
    createTopChart('dashTopBrandsChart', brandSales, 'dashTopBrands');
}

/**
 * Top 10 Kategori grafiği
 * @param {Array} data - Veri
 */
export function renderTopCategoriesChart(data) {
    const categorySales = {};
    data.forEach(item => {
        const category = item.category_2 || item.category_1 || 'Bilinmeyen';
        // "ALL", "Bilinmeyen", "Analitik", "Eğitim" kategorilerini filtrele
        if (!['ALL', 'Bilinmeyen', 'Analitik', 'Eğitim'].includes(category)) {
            categorySales[category] = (categorySales[category] || 0) + parseFloat(item.usd_amount || 0);
        }
    });
    createTopChart('dashTopCategoriesChart', categorySales, 'dashTopCategories');
}

/**
 * Top 10 Şehir grafiği
 * @param {Array} data - Veri
 */
export function renderTopCitiesChart(data) {
    const citySales = {};
    data.forEach(item => {
        const city = item.partner_city || 'Bilinmeyen';
        citySales[city] = (citySales[city] || 0) + parseFloat(item.usd_amount || 0);
    });
    createTopChart('dashTopCitiesChart', citySales, 'dashTopCities');
}

/**
 * Top 10 Ürün grafiği
 * @param {Array} data - Veri
 */
export function renderTopProductsChart(data) {
    const productSales = {};
    data.forEach(item => {
        const product = item.product || 'Bilinmeyen';
        productSales[product] = (productSales[product] || 0) + parseFloat(item.usd_amount || 0);
    });
    createTopChart('dashTopProductsChart', productSales, 'dashTopProducts');
}

/**
 * Tüm chart instance'larını yok et
 */
export function destroyAllCharts() {
    Object.keys(chartInstances).forEach(key => destroyChart(key));
}

console.log('✅ Charts modülü yüklendi');

