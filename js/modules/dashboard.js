/**
 * @fileoverview Dashboard Module
 * @description Dashboard yükleme, özet kartlar ve AI analiz
 * @module Dashboard
 */

import { AppData } from './app-state.js';
import { formatCurrency, formatNumber } from './utils.js';
import {
    renderYearlyComparisonChart,
    renderTopCustomersChart,
    renderTopSalespeopleChart,
    renderTopBrandsChart,
    renderTopCategoriesChart,
    renderTopCitiesChart,
    renderTopProductsChart
} from './charts.js';

/**
 * Dashboard metrik tipi (sales veya qty)
 */
let dashboardMetricType = 'sales';

/**
 * Dashboard'ı yükle
 */
export function loadDashboard() {
    console.log('🏠 Dashboard yükleniyor...');
    
    if (!AppData.allData || AppData.allData.length === 0) {
        console.warn('⚠️ Veri yok, dashboard yüklenemedi');
        return;
    }
    
    // Özet kartları güncelle
    updateSummaryCards();
    
    // Grafikleri çiz
    renderYearlyComparisonChart(dashboardMetricType);
    renderTopCustomersChart(AppData.allData);
    renderTopSalespeopleChart(AppData.allData);
    renderTopBrandsChart(AppData.allData);
    renderTopCategoriesChart(AppData.allData);
    renderTopCitiesChart(AppData.allData);
    renderTopProductsChart(AppData.allData);
    
    // AI Analizi
    performAIAnalysis();
    
    console.log('✅ Dashboard yüklendi');
}

/**
 * Özet kartları güncelle
 */
function updateSummaryCards() {
    const data = AppData.allData;
    
    // İstatistikleri hesapla
    const totalSales = data.reduce((sum, item) => sum + parseFloat(item.usd_amount || 0), 0);
    const totalQty = data.reduce((sum, item) => sum + parseFloat(item.quantity || 0), 0);
    const uniqueCustomers = new Set(data.map(item => item.partner).filter(Boolean)).size;
    const uniqueProducts = new Set(data.map(item => item.product).filter(Boolean)).size;
    const uniqueStores = new Set(data.map(item => item.store).filter(Boolean)).size;
    const uniqueSalespeople = new Set(data.map(item => item.sales_person).filter(Boolean)).size;
    
    // Günlük Ortalama
    const uniqueDates = new Set(data.map(item => item.date).filter(Boolean)).size;
    const dailyAverage = uniqueDates > 0 ? totalSales / uniqueDates : 0;
    
    // Sepet Ortalaması (Sadece out_invoice)
    const uniqueInvoices = new Set(
        data.filter(item => item.move_type === 'out_invoice')
            .map(item => item.move_name)
            .filter(Boolean)
    ).size;
    const basketAverage = uniqueInvoices > 0 ? totalSales / uniqueInvoices : 0;
    
    // Debug
    console.log('📊 Dashboard İstatistikleri:');
    console.log('   💰 Toplam Satış:', formatCurrency(totalSales));
    console.log('   📦 Toplam Ürün:', formatNumber(totalQty));
    console.log('   👥 Müşteri:', uniqueCustomers);
    console.log('   🎸 Ürün Çeşidi:', uniqueProducts);
    console.log('   🏪 Mağaza:', uniqueStores);
    console.log('   👨‍💼 Temsilci:', uniqueSalespeople);
    console.log('   📅 Günlük Ortalama:', formatCurrency(dailyAverage));
    console.log('   🛒 Sepet Ortalaması:', formatCurrency(basketAverage));
    console.log('   🧾 Fatura Sayısı:', uniqueInvoices);
    
    // DOM'u güncelle
    updateElement('dashTotalSales', formatCurrency(totalSales));
    updateElement('dashTotalQty', formatNumber(totalQty));
    updateElement('dashTotalCustomers', formatNumber(uniqueCustomers));
    updateElement('dashTotalProducts', formatNumber(uniqueProducts));
    updateElement('dashTotalStores', formatNumber(uniqueStores));
    updateElement('dashTotalSalespeople', formatNumber(uniqueSalespeople));
    updateElement('dashDailyAverage', formatCurrency(dailyAverage));
    updateElement('dashBasketAverage', formatCurrency(basketAverage));
    updateElement('dashTotalInvoices', formatNumber(uniqueInvoices));
}

/**
 * Element içeriğini güncelle
 * @param {string} id - Element ID
 * @param {string} value - Değer
 */
function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

/**
 * Dashboard metrik tipini değiştir
 * @param {string} type - 'sales' veya 'qty'
 */
export function changeDashboardMetric(type) {
    dashboardMetricType = type;
    
    // Buton stillerini güncelle
    const salesBtn = document.getElementById('dashYearlyMetricSales');
    const qtyBtn = document.getElementById('dashYearlyMetricQty');
    
    if (type === 'sales') {
        salesBtn.style.background = '#667eea';
        salesBtn.style.color = 'white';
        qtyBtn.style.background = 'white';
        qtyBtn.style.color = '#667eea';
    } else {
        salesBtn.style.background = 'white';
        salesBtn.style.color = '#667eea';
        qtyBtn.style.background = '#667eea';
        qtyBtn.style.color = 'white';
    }
    
    // Grafiği yeniden çiz
    renderYearlyComparisonChart(type);
}

/**
 * AI Analizi yap
 */
function performAIAnalysis() {
    const data = AppData.allData;
    
    if (!data || data.length === 0) {
        updateElement('dashAIAnalysis', '⚠️ Veri yok, analiz yapılamadı.');
        return;
    }
    
    // Basit AI analizi
    const totalSales = data.reduce((sum, item) => sum + parseFloat(item.usd_amount || 0), 0);
    const avgSale = totalSales / data.length;
    
    // En iyi performans gösteren kategori
    const categorySales = {};
    data.forEach(item => {
        const category = item.category_2 || item.category_1 || 'Bilinmeyen';
        categorySales[category] = (categorySales[category] || 0) + parseFloat(item.usd_amount || 0);
    });
    
    const topCategory = Object.entries(categorySales)
        .sort((a, b) => b[1] - a[1])[0];
    
    // En iyi mağaza
    const storeSales = {};
    data.forEach(item => {
        const store = item.store || 'Bilinmeyen';
        storeSales[store] = (storeSales[store] || 0) + parseFloat(item.usd_amount || 0);
    });
    
    const topStore = Object.entries(storeSales)
        .sort((a, b) => b[1] - a[1])[0];
    
    const analysis = `
        <div style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; color: white;">
            <h4 style="margin: 0 0 15px 0;">🤖 AI Dashboard Analizi</h4>
            <p style="margin: 10px 0;">📊 <strong>Toplam Satış:</strong> ${formatCurrency(totalSales)}</p>
            <p style="margin: 10px 0;">📈 <strong>Ortalama İşlem:</strong> ${formatCurrency(avgSale)}</p>
            <p style="margin: 10px 0;">🏆 <strong>En İyi Kategori:</strong> ${topCategory ? topCategory[0] + ' (' + formatCurrency(topCategory[1]) + ')' : 'Bilinmeyen'}</p>
            <p style="margin: 10px 0;">🏪 <strong>En İyi Mağaza:</strong> ${topStore ? topStore[0] + ' (' + formatCurrency(topStore[1]) + ')' : 'Bilinmeyen'}</p>
            <p style="margin: 10px 0;">💡 <strong>Öneri:</strong> ${topCategory ? topCategory[0] : 'Kategori'} kategorisine odaklanın ve ${topStore ? topStore[0] : 'mağaza'} stratejisini diğer mağazalara uygulayın.</p>
        </div>
    `;
    
    const aiElement = document.getElementById('dashAIAnalysis');
    if (aiElement) {
        aiElement.innerHTML = analysis;
    }
}

/**
 * Dashboard'ı global yap
 */
window.loadDashboard = loadDashboard;
window.changeDashYearlyMetric = changeDashboardMetric;

console.log('✅ Dashboard modülü yüklendi');

