// ==================== GLOBAL CONFIGURATION ====================
// Global değişkenler ve konfigürasyon

// Veri cache
window.loadedDataCache = {};
window.loadedYears = new Set();

// Metadata
window.metadata = {};

// Hedefler
window.centralTargets = {};
window.allStoresTargets = {};
window.yearlyTarget = {};
window.monthlyTarget = {};
window.stockLocations = {};

// Loading progress takibi
window.dataLoadProgress = {
    pageInit: false,
    dataFiles: false,
    targets: false,
    ready: false
};

// Cache versiyonlama fonksiyonları
window.getDailyVersion = function() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
};

window.getHourlyVersion = function() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    return `${year}${month}${day}${hour}`;
};

console.log('✅ Config module loaded');

