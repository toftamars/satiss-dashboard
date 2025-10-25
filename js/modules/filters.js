/**
 * @fileoverview Filters Module
 * @description Filtre fonksiyonları ve kanal yönetimi
 * @module Filters
 */

import { AppData, ChannelFilters } from './app-state.js';
import { determineChannel } from './utils.js';

/**
 * Satış kanalı filtresini güncelle
 * @param {string} channelId - Kanal ID
 */
export function handleChannelFilter(channelId) {
    const checkbox = document.getElementById(channelId);
    if (!checkbox) return;
    
    if (channelId === 'channelAll') {
        // Tümü seçildiğinde
        ChannelFilters.all = checkbox.checked;
        if (checkbox.checked) {
            // Tüm kanalları kapat
            Object.keys(ChannelFilters).forEach(key => {
                if (key !== 'all') ChannelFilters[key] = false;
            });
            // Diğer checkbox'ları kapat
            ['channelRetail', 'channelWholesale', 'channelOnline', 'channelCorporate', 'channelCentral']
                .forEach(id => {
                    const cb = document.getElementById(id);
                    if (cb) cb.checked = false;
                });
        }
    } else {
        // Belirli bir kanal seçildiğinde
        const channelKey = channelId.replace('channel', '').toLowerCase();
        ChannelFilters[channelKey] = checkbox.checked;
        
        // Herhangi bir kanal seçiliyse "Tümü"nü kapat
        const anyChannelSelected = Object.keys(ChannelFilters)
            .filter(key => key !== 'all')
            .some(key => ChannelFilters[key]);
        
        if (anyChannelSelected) {
            ChannelFilters.all = false;
            const allCheckbox = document.getElementById('channelAll');
            if (allCheckbox) allCheckbox.checked = false;
        } else {
            // Hiçbir kanal seçili değilse "Tümü"nü aç
            ChannelFilters.all = true;
            const allCheckbox = document.getElementById('channelAll');
            if (allCheckbox) allCheckbox.checked = true;
        }
    }
    
    console.log('🏢 Kanal filtreleri güncellendi:', ChannelFilters);
    
    // Dashboard'ı güncelle
    if (typeof window.loadDashboard === 'function') {
        window.loadDashboard();
    }
}

/**
 * Filtrelenmiş veriyi al
 * @returns {Array}
 */
export function getFilteredData() {
    if (ChannelFilters.all) {
        return AppData.allData;
    }
    
    return AppData.allData.filter(item => {
        const channel = determineChannel(item.store || '');
        return ChannelFilters[channel] === true;
    });
}

/**
 * Aktif kanal sayısını al
 * @returns {number}
 */
export function getActiveChannelCount() {
    if (ChannelFilters.all) return 19; // Toplam kanal sayısı
    
    return Object.keys(ChannelFilters)
        .filter(key => key !== 'all' && ChannelFilters[key])
        .length;
}

/**
 * Tarih aralığına göre filtrele
 * @param {Array} data - Veri
 * @param {string} startDate - Başlangıç tarihi
 * @param {string} endDate - Bitiş tarihi
 * @returns {Array}
 */
export function filterByDateRange(data, startDate, endDate) {
    if (!startDate && !endDate) return data;
    
    return data.filter(item => {
        if (!item.date) return false;
        const itemDate = new Date(item.date);
        
        if (startDate && itemDate < new Date(startDate)) return false;
        if (endDate && itemDate > new Date(endDate)) return false;
        
        return true;
    });
}

/**
 * Mağazaya göre filtrele
 * @param {Array} data - Veri
 * @param {string} storeName - Mağaza adı
 * @returns {Array}
 */
export function filterByStore(data, storeName) {
    if (!storeName) return data;
    return data.filter(item => item.store === storeName);
}

/**
 * Müşteriye göre filtrele
 * @param {Array} data - Veri
 * @param {string} customerName - Müşteri adı
 * @returns {Array}
 */
export function filterByCustomer(data, customerName) {
    if (!customerName) return data;
    return data.filter(item => item.partner === customerName);
}

/**
 * Satış temsilcisine göre filtrele
 * @param {Array} data - Veri
 * @param {string} salesperson - Temsilci adı
 * @returns {Array}
 */
export function filterBySalesperson(data, salesperson) {
    if (!salesperson) return data;
    return data.filter(item => item.sales_person === salesperson);
}

/**
 * Şehre göre filtrele
 * @param {Array} data - Veri
 * @param {string} city - Şehir adı
 * @returns {Array}
 */
export function filterByCity(data, city) {
    if (!city) return data;
    return data.filter(item => item.partner_city === city);
}

/**
 * Ürüne göre filtrele
 * @param {Array} data - Veri
 * @param {string} product - Ürün adı
 * @returns {Array}
 */
export function filterByProduct(data, product) {
    if (!product) return data;
    return data.filter(item => 
        item.product && item.product.toLowerCase().includes(product.toLowerCase())
    );
}

/**
 * Markaya göre filtrele
 * @param {Array} data - Veri
 * @param {string} brand - Marka adı
 * @returns {Array}
 */
export function filterByBrand(data, brand) {
    if (!brand) return data;
    return data.filter(item => item.brand === brand);
}

/**
 * Kategoriye göre filtrele
 * @param {Array} data - Veri
 * @param {string} category - Kategori adı
 * @returns {Array}
 */
export function filterByCategory(data, category) {
    if (!category) return data;
    return data.filter(item => 
        item.category_1 === category || item.category_2 === category
    );
}

console.log('✅ Filters modülü yüklendi');

