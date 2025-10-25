/**
 * @fileoverview Global Application State Management
 * @description Tüm global değişkenler ve state yönetimi
 * @module AppState
 */

/**
 * Global veri depolama
 */
export const AppData = {
    allData: [],
    inventoryData: null,
    stockLocations: {},
    metadata: null
};

/**
 * Global grafik instance'ları
 */
export const ChartInstances = {
    inventory: {},
    dashboard: {
        yearly: null,
        topSalespeople: null,
        topCategories: null,
        topBrands: null,
        topCities: null,
        topProducts: null
    }
};

/**
 * Satış kanalı filtresi state
 */
export const ChannelFilters = {
    all: true,
    retail: false,
    wholesale: false,
    online: false,
    corporate: false,
    central: false
};

/**
 * Veri yükleme progress takibi
 */
export const DataLoadProgress = {
    pageInit: false,
    dataFiles: false,
    targets: false,
    ready: false
};

/**
 * Mağaza çalışma saatleri
 */
export const STORE_WORKING_HOURS = {
    // Özel saatli mağazalar (10:00-20:00, Pazar kapalı)
    'Tünel': { openHour: 10, closeHour: 20, closedDays: [0] }, // 0 = Pazar
    'İzmir': { openHour: 10, closeHour: 20, closedDays: [0] },
    'Antalya': { openHour: 10, closeHour: 20, closedDays: [0] },
    'Kızılay': { openHour: 10, closeHour: 20, closedDays: [0] },
    // Default: Tüm diğer mağazalar (10:00-22:00, 7 gün açık)
    'default': { openHour: 10, closeHour: 22, closedDays: [] }
};

/**
 * Satış kanalı tanımları
 */
export const CHANNEL_DEFINITIONS = {
    retail: ['Tünel', 'Beyoğlu', 'Kadıköy', 'Bakırköy', 'Ümraniye', 'Kartal', 'Bostancı', 
             'Maltepe', 'Pendik', 'Tuzla', 'Çekmeköy', 'Ataşehir'],
    wholesale: ['Toptan', 'Wholesale', 'B2B'],
    online: ['Online', 'E-Ticaret', 'Web', 'İnternet'],
    corporate: ['Kurumsal', 'Corporate', 'Proje'],
    central: ['Merkez', 'Central', 'Ana']
};

console.log('✅ AppState modülü yüklendi');

