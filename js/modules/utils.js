/**
 * @fileoverview Utility Functions
 * @description Yardımcı fonksiyonlar ve genel işlemler
 * @module Utils
 */

import { STORE_WORKING_HOURS, CHANNEL_DEFINITIONS } from './app-state.js';

/**
 * İndirim ürünlerini tespit eden fonksiyon
 * @param {Object} item - Ürün verisi
 * @returns {boolean}
 */
export function isDiscountProduct(item) {
    const productName = (item.product || '').toLowerCase();
    return productName.includes('[disc]') ||
           productName.includes('indirim') || 
           productName.includes('discount') ||
           productName.includes('toplam tutarda indirim');
}

/**
 * İndirim ürünlerinin tutarını negatif yapan fonksiyon
 * @param {Object} item - Ürün verisi
 * @returns {Object}
 */
export function applyDiscountLogic(item) {
    if (isDiscountProduct(item)) {
        return {
            ...item,
            usd_amount: -Math.abs(parseFloat(item.usd_amount || 0)),
            quantity: Math.abs(parseFloat(item.quantity || 0)),
            _isDiscount: true
        };
    }
    return item;
}

/**
 * Mağaza çalışma saatlerini getir
 * @param {string} storeName - Mağaza adı
 * @returns {Object}
 */
export function getStoreWorkingHours(storeName) {
    const cleanName = storeName.replace(/\[.*?\]\s*/g, '').trim();
    
    for (const [key, hours] of Object.entries(STORE_WORKING_HOURS)) {
        if (key !== 'default' && cleanName.toLowerCase().includes(key.toLowerCase())) {
            return hours;
        }
    }
    
    return STORE_WORKING_HOURS.default;
}

/**
 * Satış verisinin çalışma saatleri içinde olup olmadığını kontrol et
 * @param {Object} item - Satış verisi
 * @returns {boolean}
 */
export function isWithinWorkingHours(item) {
    const hours = getStoreWorkingHours(item.store || '');
    
    if (!item.date) return true;
    
    try {
        const date = new Date(item.date);
        const dayOfWeek = date.getDay();
        const hour = date.getHours();
        
        if (hours.closedDays.includes(dayOfWeek)) {
            return false;
        }
        
        if (hour < hours.openHour || hour >= hours.closeHour) {
            return false;
        }
        
        return true;
    } catch (error) {
        console.warn('Tarih parse hatası:', item.date, error);
        return true;
    }
}

/**
 * Satış kanalını belirle
 * @param {string} storeName - Mağaza adı
 * @returns {string}
 */
export function determineChannel(storeName) {
    if (!storeName) return 'unknown';
    
    const cleanName = storeName.toLowerCase();
    
    for (const [channel, keywords] of Object.entries(CHANNEL_DEFINITIONS)) {
        if (keywords.some(keyword => cleanName.includes(keyword.toLowerCase()))) {
            return channel;
        }
    }
    
    return 'retail'; // Default
}

/**
 * Tarih formatla (YYYY-MM-DD)
 * @param {Date|string} date - Tarih
 * @returns {string}
 */
export function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
}

/**
 * Para formatla (USD)
 * @param {number} amount - Tutar
 * @returns {string}
 */
export function formatCurrency(amount) {
    return '$' + (amount || 0).toLocaleString('tr-TR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

/**
 * Sayı formatla
 * @param {number} num - Sayı
 * @returns {string}
 */
export function formatNumber(num) {
    return (num || 0).toLocaleString('tr-TR');
}

/**
 * Yüzde formatla
 * @param {number} value - Değer
 * @param {number} total - Toplam
 * @returns {string}
 */
export function formatPercent(value, total) {
    if (!total || total === 0) return '0%';
    return ((value / total) * 100).toFixed(1) + '%';
}

/**
 * Debounce fonksiyonu
 * @param {Function} func - Fonksiyon
 * @param {number} wait - Bekleme süresi (ms)
 * @returns {Function}
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Array'i gruplara böl
 * @param {Array} array - Dizi
 * @param {string} key - Gruplama anahtarı
 * @returns {Object}
 */
export function groupBy(array, key) {
    return array.reduce((result, item) => {
        const group = item[key] || 'Bilinmeyen';
        if (!result[group]) {
            result[group] = [];
        }
        result[group].push(item);
        return result;
    }, {});
}

/**
 * Benzersiz değerleri al
 * @param {Array} array - Dizi
 * @param {string} key - Anahtar
 * @returns {Array}
 */
export function getUniqueValues(array, key) {
    return [...new Set(array.map(item => item[key]).filter(Boolean))];
}

/**
 * Toplam hesapla
 * @param {Array} array - Dizi
 * @param {string} key - Anahtar
 * @returns {number}
 */
export function sumBy(array, key) {
    return array.reduce((sum, item) => sum + (parseFloat(item[key]) || 0), 0);
}

console.log('✅ Utils modülü yüklendi');

