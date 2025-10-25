/**
 * @fileoverview Application Initialization
 * @description Uygulama başlatma ve global fonksiyon tanımlamaları
 * @module AppInit
 */

import { AppData, DataLoadProgress } from './app-state.js';
import { loadAllData, loadTargets } from './data-loader.js';
import { handleChannelFilter, getFilteredData } from './filters.js';
import { formatCurrency, formatNumber } from './utils.js';

/**
 * Sayfa yüklendiğinde kullanıcı adını göster
 */
function initUserDisplay() {
    const username = sessionStorage.getItem('username');
    if (username) {
        const userNameElement = document.getElementById('currentUserName');
        if (userNameElement) {
            userNameElement.textContent = username.charAt(0).toUpperCase() + username.slice(1);
        }
    }
}

/**
 * Çıkış fonksiyonu
 */
window.logout = function() {
    if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
        sessionStorage.clear();
        localStorage.clear();
        
        if (typeof window.showAuthForm === 'function') {
            window.showAuthForm();
        }
        
        console.log('✅ Çıkış yapıldı');
    }
};

/**
 * Loading tamamlanma kontrolü
 */
window.checkLoadingComplete = function() {
    if (DataLoadProgress.ready) {
        console.log('✅ Tüm veriler hazır!');
        
        const loadingScreen = document.getElementById('loadingScreen');
        const mainContainer = document.getElementById('mainContainer');
        
        if (loadingScreen) loadingScreen.style.display = 'none';
        if (mainContainer) mainContainer.style.display = 'block';
        
        // Dashboard'ı yükle
        if (typeof window.loadDashboard === 'function') {
            window.loadDashboard();
        }
    }
};

/**
 * Veri yükleme ana fonksiyonu
 */
window.loadData = async function() {
    console.log('🚀 loadData fonksiyonu çağrıldı');
    
    try {
        const dataStatus = document.getElementById('dataStatus');
        if (dataStatus) {
            dataStatus.innerHTML = '<span class="status-badge" style="background:#ffc107;color:#000;">⏳ Yükleniyor...</span>';
        }
        
        // Hedefleri paralel yükle
        loadTargets();
        
        // Tüm verileri yükle
        await loadAllData();
        
        console.log('✅ Veri yükleme tamamlandı');
        console.log('📊 Toplam kayıt:', AppData.allData.length);
        
        // Dashboard'ı yükle
        if (typeof window.loadDashboard === 'function') {
            window.loadDashboard();
        }
        
        // Loading'i kapat
        DataLoadProgress.ready = true;
        window.checkLoadingComplete();
        
    } catch (error) {
        console.error('❌ Veri yükleme hatası:', error);
        alert('Veriler yüklenirken hata oluştu. Lütfen sayfayı yenileyin.');
    }
};

/**
 * Kanal filtresi handler'ını global yap
 */
window.handleChannelFilter = handleChannelFilter;

/**
 * Filtrelenmiş veriyi global yap
 */
window.getFilteredData = getFilteredData;

/**
 * Format fonksiyonlarını global yap
 */
window.formatCurrency = formatCurrency;
window.formatNumber = formatNumber;

/**
 * Sayfa yüklendiğinde başlat
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Uygulama başlatılıyor...');
    
    // Kullanıcı bilgisini göster
    initUserDisplay();
    
    // Page init tamamlandı
    DataLoadProgress.pageInit = true;
    
    console.log('✅ Uygulama hazır');
});

console.log('✅ AppInit modülü yüklendi');

