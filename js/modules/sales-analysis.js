/**
 * @fileoverview Sales Analysis Module
 * @description Satış analizi ve özet fonksiyonları
 * @module sales-analysis
 */

import { formatCurrency, formatNumber } from './utils.js';

/**
 * Sales Analysis Manager
 */
export class SalesAnalysis {
    constructor() {
        this.filteredData = [];
    }

    /**
     * Veriyi ayarla
     * @param {Array} data - Filtrelenmiş veri
     */
    setData(data) {
        this.filteredData = data;
    }

    /**
     * Özet istatistikleri hesapla
     * @returns {Object} Özet istatistikler
     */
    calculateSummary() {
        console.log('updateSummary - Filtrelenmis veri sayisi:', this.filteredData.length);

        const totalUSD = this.filteredData.reduce(
            (sum, item) => sum + (parseFloat(item.usd_amount) || 0),
            0
        );
        const totalQty = this.filteredData.reduce(
            (sum, item) => sum + (parseFloat(item.quantity) || 0),
            0
        );
        const uniquePartners = new Set(this.filteredData.map(item => item.partner)).size;
        const uniqueProducts = new Set(this.filteredData.map(item => item.product)).size;

        console.log('Ozet:', { totalUSD, totalQty, uniquePartners, uniqueProducts });

        return {
            totalUSD,
            totalQty,
            uniquePartners,
            uniqueProducts
        };
    }

    /**
     * Özet kartlarını güncelle
     */
    updateSummaryCards() {
        const summary = this.calculateSummary();

        // Eski Sales sekmesi elementleri - null check
        const summaryUSD = document.getElementById('summaryUSD');
        const summaryQuantity = document.getElementById('summaryQuantity');
        const summaryPartners = document.getElementById('summaryPartners');
        const summaryProducts = document.getElementById('summaryProducts');

        if (summaryUSD) summaryUSD.textContent = formatCurrency(summary.totalUSD);
        if (summaryQuantity) summaryQuantity.textContent = formatNumber(summary.totalQty);
        if (summaryPartners) summaryPartners.textContent = formatNumber(summary.uniquePartners);
        if (summaryProducts) summaryProducts.textContent = formatNumber(summary.uniqueProducts);
    }

    /**
     * Veriyi kategorilere göre analiz et
     * @returns {Object} Kategori, marka, ürün, satış temsilcisi verileri
     */
    analyzeData() {
        const categoryData = {};
        const brandData = {};
        const productData = {};
        const salesPersonData = {};

        this.filteredData.forEach(item => {
            // Kategori
            const cat = item.category_1 || 'Bilinmiyor';
            if (!categoryData[cat]) categoryData[cat] = 0;
            categoryData[cat] += parseFloat(item.usd_amount || 0);

            // Marka
            const brand = item.brand || 'Bilinmiyor';
            if (!brandData[brand]) brandData[brand] = 0;
            brandData[brand] += parseFloat(item.usd_amount || 0);

            // Ürün
            const product = item.product || 'Bilinmiyor';
            if (!productData[product]) productData[product] = 0;
            productData[product] += parseFloat(item.usd_amount || 0);

            // Satış Temsilcisi
            const person = item.sales_person || 'Bilinmiyor';
            if (!salesPersonData[person]) salesPersonData[person] = 0;
            salesPersonData[person] += parseFloat(item.usd_amount || 0);
        });

        return {
            categoryData,
            brandData,
            productData,
            salesPersonData
        };
    }

    /**
     * Top 10 listelerini al
     * @returns {Object} Top 10 listeleri
     */
    getTop10Lists() {
        const analysis = this.analyzeData();

        const topCategories = Object.entries(analysis.categoryData)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        const topBrands = Object.entries(analysis.brandData)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        const topProducts = Object.entries(analysis.productData)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        const topSalesPersons = Object.entries(analysis.salesPersonData)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        return {
            topCategories,
            topBrands,
            topProducts,
            topSalesPersons
        };
    }
}

// Global instance
export const salesAnalysis = new SalesAnalysis();

console.log('✅ SalesAnalysis modülü yüklendi');
