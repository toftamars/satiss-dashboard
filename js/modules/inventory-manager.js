/**
 * @fileoverview Inventory Manager Module
 * @description Stok ve envanter yönetimi
 * @module inventory-manager
 */

import { logger } from './logger.js';

/**
 * Inventory Manager - Stok yönetimi
 */
export class InventoryManager {
    constructor() {
        this.inventoryData = null;
        this.stockLocations = {};
    }

    /**
     * Envanter verilerini ayarla
     * @param {Array} data - Envanter verileri
     */
    setInventoryData(data) {
        this.inventoryData = data;
        logger.log(`✅ Envanter verileri ayarlandı: ${data.length} kayıt`);
    }

    /**
     * Stok konumlarını ayarla
     * @param {Object} locations - Stok konumları
     */
    setStockLocations(locations) {
        this.stockLocations = locations;
        logger.log(`✅ Stok konumları ayarlandı: ${Object.keys(locations).length} konum`);
    }

    /**
     * Mağaza adını normalize et
     * @param {string} storeName - Mağaza adı
     * @returns {string} Normalize edilmiş ad
     */
    normalizeStoreName(storeName) {
        if (!storeName) return '';

        return storeName
            .toLowerCase()
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/ş/g, 's')
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/ı/g, 'i');
    }

    /**
     * Mağaza için mevcut stok miktarını getir
     * @param {string} storeName - Mağaza adı
     * @param {string} productCode - Ürün kodu
     * @returns {number} Stok miktarı
     */
    getCurrentStock(storeName, productCode) {
        if (!this.inventoryData || this.inventoryData.length === 0) {
            return 0;
        }

        // Mağaza ismini normalize et
        const normalizedStore = this.normalizeStoreName(storeName);

        // stock-locations'da bu mağazaya karşılık gelen location_id'leri bul
        const matchingLocations = [];
        for (const [locationId, mappedStore] of Object.entries(this.stockLocations)) {
            if (mappedStore === normalizedStore) {
                matchingLocations.push(locationId);
            }
        }

        if (matchingLocations.length === 0) {
            logger.warn(`⚠️ "${storeName}" için stok konumu bulunamadı`);
            return 0;
        }

        // Inventory verilerinde bu lokasyonlarda ve bu üründe ne kadar stok var?
        let totalStock = 0;
        this.inventoryData.forEach(item => {
            const itemLocation = item.location || '';
            const itemProduct = (item.product_name || item.product || '').toLowerCase();
            const searchProduct = productCode.toLowerCase();

            // Lokasyon eşleşmesi ve ürün eşleşmesi
            if (matchingLocations.includes(itemLocation) && itemProduct.includes(searchProduct)) {
                totalStock += parseFloat(item.quantity || 0);
            }
        });

        return totalStock;
    }

    /**
     * Ürün için toplam stok miktarını getir
     * @param {string} productCode - Ürün kodu
     * @returns {number} Toplam stok
     */
    getTotalStock(productCode) {
        if (!this.inventoryData || this.inventoryData.length === 0) {
            return 0;
        }

        let totalStock = 0;
        const searchProduct = productCode.toLowerCase();

        this.inventoryData.forEach(item => {
            const itemProduct = (item.product_name || item.product || '').toLowerCase();
            if (itemProduct.includes(searchProduct)) {
                totalStock += parseFloat(item.quantity || 0);
            }
        });

        return totalStock;
    }

    /**
     * Mağaza için tüm ürünlerin stok listesini getir
     * @param {string} storeName - Mağaza adı
     * @returns {Array} Stok listesi
     */
    getStoreInventory(storeName) {
        if (!this.inventoryData || this.inventoryData.length === 0) {
            return [];
        }

        const normalizedStore = this.normalizeStoreName(storeName);
        const matchingLocations = [];

        for (const [locationId, mappedStore] of Object.entries(this.stockLocations)) {
            if (mappedStore === normalizedStore) {
                matchingLocations.push(locationId);
            }
        }

        if (matchingLocations.length === 0) {
            return [];
        }

        return this.inventoryData.filter(item => {
            const itemLocation = item.location || '';
            return matchingLocations.includes(itemLocation);
        });
    }

    /**
     * Düşük stoklu ürünleri getir
     * @param {number} threshold - Eşik değeri
     * @returns {Array} Düşük stoklu ürünler
     */
    getLowStockProducts(threshold = 10) {
        if (!this.inventoryData || this.inventoryData.length === 0) {
            return [];
        }

        return this.inventoryData
            .filter(item => {
                const quantity = parseFloat(item.quantity || 0);
                return quantity > 0 && quantity <= threshold;
            })
            .sort((a, b) => parseFloat(a.quantity || 0) - parseFloat(b.quantity || 0));
    }

    /**
     * Stok dışı ürünleri getir
     * @returns {Array} Stok dışı ürünler
     */
    getOutOfStockProducts() {
        if (!this.inventoryData || this.inventoryData.length === 0) {
            return [];
        }

        return this.inventoryData.filter(item => {
            const quantity = parseFloat(item.quantity || 0);
            return quantity <= 0;
        });
    }

    /**
     * Envanter özeti getir
     * @returns {Object} Envanter özeti
     */
    getInventorySummary() {
        if (!this.inventoryData || this.inventoryData.length === 0) {
            return {
                totalProducts: 0,
                totalQuantity: 0,
                lowStock: 0,
                outOfStock: 0,
                totalValue: 0
            };
        }

        const lowStockProducts = this.getLowStockProducts();
        const outOfStockProducts = this.getOutOfStockProducts();

        const totalQuantity = this.inventoryData.reduce(
            (sum, item) => sum + parseFloat(item.quantity || 0),
            0
        );

        const totalValue = this.inventoryData.reduce(
            (sum, item) => sum + parseFloat(item.quantity || 0) * parseFloat(item.price || 0),
            0
        );

        return {
            totalProducts: this.inventoryData.length,
            totalQuantity,
            lowStock: lowStockProducts.length,
            outOfStock: outOfStockProducts.length,
            totalValue
        };
    }
}

// Global instance
export const inventoryManager = new InventoryManager();

console.log('✅ InventoryManager modülü yüklendi');
