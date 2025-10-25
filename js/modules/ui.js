/**
 * @fileoverview UI Module
 * @description Tab yönetimi, filtreler ve UI güncellemeleri
 * @module UI
 */

import { AppData } from './app-state.js';
import { loadDashboard } from './dashboard.js';

/**
 * Tab değiştir
 * @param {string} tabName - Tab adı
 */
export function switchTab(tabName) {
    console.log('🔄 switchTab çağrıldı:', tabName);
    
    // Tüm tab içeriklerini gizle
    const allTabContents = document.querySelectorAll('.tab-content');
    allTabContents.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Tüm tab butonlarını pasif yap
    const allTabs = document.querySelectorAll('.tab');
    allTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Seçilen tab'ı aktif et
    const selectedTab = document.getElementById(tabName + 'Tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
        console.log('✅ Tab aktif edildi:', tabName + 'Tab');
    } else {
        console.error('❌ Tab bulunamadı:', tabName + 'Tab');
    }
    
    // İlgili tab butonunu aktif et
    const tabButtons = {
        'dashboard': 0,
        'targets': 1,
        'customers': 2,
        'salesperson': 3,
        'store': 4,
        'city': 5,
        'stock': 6,
        'time': 7,
        'product': 8
    };
    
    if (tabButtons[tabName] !== undefined) {
        allTabs[tabButtons[tabName]].classList.add('active');
    }
    
    // Tab'a göre özel işlemler
    handleTabSpecificActions(tabName);
}

/**
 * Tab'a özel işlemleri yönet
 * @param {string} tabName - Tab adı
 */
function handleTabSpecificActions(tabName) {
    switch (tabName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'targets':
            if (typeof window.loadAllStoresTargets === 'function') {
                window.loadAllStoresTargets();
            }
            break;
        case 'customers':
            if (typeof window.analyzeCustomers === 'function') {
                window.analyzeCustomers();
            }
            break;
        case 'time':
            if (typeof window.analyzeTime === 'function') {
                window.analyzeTime();
            }
            break;
        case 'city':
            console.log('🌍 Şehir analizi sekmesi açılıyor...');
            if (AppData.allData && AppData.allData.length > 0) {
                if (typeof window.populateCitySelect === 'function') {
                    window.populateCitySelect();
                }
            } else {
                console.warn('⚠️ Veriler henüz yüklenmedi');
                setTimeout(() => {
                    if (AppData.allData && AppData.allData.length > 0) {
                        if (typeof window.populateCitySelect === 'function') {
                            window.populateCitySelect();
                        }
                    }
                }, 2000);
            }
            break;
        case 'stock':
            console.log('📦 Stok dağılım sekmesi açılıyor...');
            if (!AppData.inventoryData) {
                console.log('🔄 Envanter verileri lazy loading ile yükleniyor...');
                if (typeof window.loadInventoryData === 'function') {
                    window.loadInventoryData();
                }
            }
            if (Object.keys(AppData.stockLocations).length === 0) {
                console.log('🔄 Stok konumları yükleniyor...');
                if (typeof window.loadStockLocations === 'function') {
                    window.loadStockLocations();
                }
            }
            break;
    }
}

/**
 * Özet kartları güncelle
 * @param {Object} stats - İstatistikler
 */
export function updateSummaryCards(stats) {
    const elements = {
        'dataStatus': stats.dataStatus || '',
        'lastUpdate': stats.lastUpdate || '-',
        'totalRecords': stats.totalRecords || '-',
        'totalUSD': stats.totalUSD || '-',
        'dailyAverage': stats.dailyAverage || '-',
        'basketAverage': stats.basketAverage || '-'
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = value;
        }
    });
}

/**
 * Filtreleri doldur
 * @param {Array} data - Veri
 */
export function populateFilters(data) {
    if (!data || data.length === 0) return;
    
    // Benzersiz değerleri al
    const stores = [...new Set(data.map(item => item.store).filter(Boolean))].sort();
    const customers = [...new Set(data.map(item => item.partner).filter(Boolean))].sort();
    const salespeople = [...new Set(data.map(item => item.sales_person).filter(Boolean))].sort();
    const brands = [...new Set(data.map(item => item.brand).filter(Boolean))].sort();
    const categories = [...new Set(data.map(item => item.category_1).filter(Boolean))].sort();
    
    console.log('🔧 Filtreler dolduruluyor:');
    console.log('   🏪 Mağaza:', stores.length);
    console.log('   👥 Müşteri:', customers.length);
    console.log('   👨‍💼 Temsilci:', salespeople.length);
    console.log('   🏷️ Marka:', brands.length);
    console.log('   📂 Kategori:', categories.length);
}

/**
 * Loading göster/gizle
 * @param {boolean} show - Göster/gizle
 */
export function toggleLoading(show) {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = show ? 'flex' : 'none';
    }
}

/**
 * Progress güncelle
 * @param {number} percent - Yüzde (0-100)
 * @param {string} message - Mesaj
 */
export function updateProgress(percent, message) {
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    
    if (progressBar) {
        progressBar.style.width = percent + '%';
    }
    
    if (progressText) {
        progressText.textContent = percent + '%';
    }
    
    if (message) {
        console.log(`📊 Progress: ${percent}% - ${message}`);
    }
}

/**
 * UI fonksiyonlarını global yap
 */
window.switchTab = switchTab;
window.updateSummaryCards = updateSummaryCards;
window.populateFilters = populateFilters;

console.log('✅ UI modülü yüklendi');

