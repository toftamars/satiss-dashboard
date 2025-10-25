/**
 * @fileoverview Data Loading Module
 * @description Veri yükleme ve cache yönetimi
 * @module DataLoader
 */

import { AppData, DataLoadProgress } from './app-state.js';
import { applyDiscountLogic } from './utils.js';

/**
 * Yüklenen yılları takip et
 */
const loadedYears = new Set();
const loadedDataCache = {};

/**
 * Günlük versiyon oluştur (cache için)
 * @returns {string}
 */
function getDailyVersion() {
    const now = new Date();
    return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
}

/**
 * Metadata yükle
 * @returns {Promise<Object>}
 */
export async function loadMetadata() {
    try {
        console.log('📊 Metadata yükleniyor...');
        const response = await fetch('data/data-metadata.json?' + Date.now());
        if (!response.ok) throw new Error('Metadata yüklenemedi');
        const metadata = await response.json();
        AppData.metadata = metadata;
        console.log('✅ Metadata yüklendi:', metadata);
        return metadata;
    } catch (error) {
        console.error('❌ Metadata yükleme hatası:', error);
        return null;
    }
}

/**
 * Yıl verisini yükle
 * @param {number} year - Yıl
 * @returns {Promise<Object>}
 */
export async function loadYearData(year) {
    // Çift yükleme önleme
    if (loadedYears.has(year) && loadedDataCache[year]) {
        console.log(`⏭️ ${year} zaten yüklü, cache'den döndürülüyor...`);
        return loadedDataCache[year];
    }
    
    loadedYears.add(year);
    
    try {
        const version = getDailyVersion();
        const response = await fetch(`data/data-${year}.json.gz?v=${version}`, {
            headers: {
                'Cache-Control': 'public, max-age=86400'
            }
        });
        
        if (!response.ok) throw new Error(`${year} verisi bulunamadı`);
        
        const arrayBuffer = await response.arrayBuffer();
        let decompressed;
        
        // Modern tarayıcılar için DecompressionStream
        if (typeof DecompressionStream !== 'undefined') {
            try {
                const blob = new Blob([arrayBuffer]);
                const ds = new DecompressionStream('gzip');
                const stream = blob.stream().pipeThrough(ds);
                decompressed = await new Response(stream).text();
            } catch (e) {
                console.warn('DecompressionStream başarısız, pako kullanılıyor:', e);
                const uint8Array = new Uint8Array(arrayBuffer);
                const decompressedArray = pako.inflate(uint8Array);
                decompressed = new TextDecoder().decode(decompressedArray);
            }
        } else {
            // Fallback: Pako.js
            if (typeof pako === 'undefined') {
                throw new Error('GZIP açma kütüphanesi yüklenmedi');
            }
            const uint8Array = new Uint8Array(arrayBuffer);
            const decompressedArray = pako.inflate(uint8Array);
            decompressed = new TextDecoder().decode(decompressedArray);
        }
        
        const yearData = JSON.parse(decompressed);
        console.log(`✅ ${year} yüklendi: ${yearData?.details?.length || 0} kayıt`);
        
        loadedDataCache[year] = yearData;
        return yearData;
        
    } catch (error) {
        console.error(`❌ ${year} yükleme hatası:`, error);
        throw error;
    }
}

/**
 * Tüm yılların verisini yükle
 * @param {Object} metadata - Metadata
 * @returns {Promise<void>}
 */
export async function loadAllYearsData(metadata) {
    console.log('📊 Tüm yıllar yükleniyor...');
    
    for (const year of metadata.years) {
        try {
            const yearData = await loadYearData(year);
            
            if (yearData && yearData.details && Array.isArray(yearData.details)) {
                // İndirim mantığını uygula ve allData'ya ekle
                const processedData = yearData.details.map(applyDiscountLogic);
                AppData.allData = AppData.allData.concat(processedData);
                
                console.log(`✅ ${year} yılı yüklendi: ${yearData.details.length} kayıt`);
            }
        } catch (error) {
            console.error(`⚠️ ${year} yüklenemedi:`, error);
        }
    }
    
    console.log('✅ Tüm yıllar yüklendi!');
    console.log('📊 Toplam kayıt:', AppData.allData.length);
    
    DataLoadProgress.dataFiles = true;
    DataLoadProgress.ready = true;
}

/**
 * Stok konumlarını yükle
 * @returns {Promise<Object>}
 */
export async function loadStockLocations() {
    try {
        const response = await fetch('data/stock-locations.json');
        if (!response.ok) throw new Error('Stock locations yüklenemedi');
        const data = await response.json();
        AppData.stockLocations = data.stock_locations || {};
        console.log('✅ Stok konumları yüklendi:', Object.keys(AppData.stockLocations).length, 'lokasyon');
        return AppData.stockLocations;
    } catch (error) {
        console.error('❌ Stock locations hatası:', error);
        return {};
    }
}

/**
 * Envanter verisini yükle
 * @returns {Promise<void>}
 */
export async function loadInventoryData() {
    try {
        console.log('📦 Envanter verileri yükleniyor...');
        
        const version = getDailyVersion();
        const response = await fetch(`data/inventory.json.gz?v=${version}`, {
            headers: {
                'Cache-Control': 'public, max-age=86400'
            }
        });
        
        if (!response.ok) throw new Error('Envanter verisi bulunamadı');
        
        const arrayBuffer = await response.arrayBuffer();
        let decompressed;
        
        if (typeof DecompressionStream !== 'undefined') {
            try {
                const blob = new Blob([arrayBuffer]);
                const ds = new DecompressionStream('gzip');
                const stream = blob.stream().pipeThrough(ds);
                decompressed = await new Response(stream).text();
            } catch (e) {
                const uint8Array = new Uint8Array(arrayBuffer);
                const decompressedArray = pako.inflate(uint8Array);
                decompressed = new TextDecoder().decode(decompressedArray);
            }
        } else {
            const uint8Array = new Uint8Array(arrayBuffer);
            const decompressedArray = pako.inflate(uint8Array);
            decompressed = new TextDecoder().decode(decompressedArray);
        }
        
        const inventoryJson = JSON.parse(decompressed);
        AppData.inventoryData = inventoryJson.inventory || [];
        
        console.log('✅ Envanter yüklendi:', AppData.inventoryData.length, 'kayıt');
        
    } catch (error) {
        console.error('❌ Envanter yükleme hatası:', error);
        AppData.inventoryData = [];
    }
}

/**
 * Hedefleri yükle
 * @returns {Promise<Object>}
 */
export async function loadTargets() {
    try {
        console.log('🎯 Hedefler yükleniyor...');
        const response = await fetch('data/targets.json?' + Date.now());
        if (response.ok) {
            const targets = await response.json();
            console.log('✅ Hedefler yüklendi:', targets);
            DataLoadProgress.targets = true;
            return targets;
        } else {
            console.warn('⚠️ targets.json yüklenemedi');
            return { yearly: {}, monthly: {} };
        }
    } catch (error) {
        console.error('❌ Hedef yükleme hatası:', error);
        return { yearly: {}, monthly: {} };
    }
}

/**
 * Tüm verileri yükle (ana fonksiyon)
 * @returns {Promise<void>}
 */
export async function loadAllData() {
    try {
        console.log('🚀 Veri yükleme başlatılıyor...');
        
        // Paralel yükleme
        const [metadata, stockLocations, targets] = await Promise.all([
            loadMetadata(),
            loadStockLocations(),
            loadTargets()
        ]);
        
        if (!metadata || !metadata.years || metadata.years.length === 0) {
            throw new Error('Geçerli yıl verisi bulunamadı');
        }
        
        // Yıl verilerini yükle
        await loadAllYearsData(metadata);
        
        // Envanter verilerini yükle (paralel değil, çünkü büyük)
        await loadInventoryData();
        
        console.log('✅ Tüm veriler yüklendi!');
        console.log('📊 Toplam satış kaydı:', AppData.allData.length);
        console.log('📦 Envanter kaydı:', AppData.inventoryData?.length || 0);
        
        return {
            salesData: AppData.allData,
            inventoryData: AppData.inventoryData,
            metadata,
            targets
        };
        
    } catch (error) {
        console.error('❌ Veri yükleme hatası:', error);
        throw error;
    }
}

console.log('✅ DataLoader modülü yüklendi');

