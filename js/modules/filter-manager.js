/**
 * @fileoverview Filter Manager Module
 * @description Gelişmiş filtreleme sistemi
 * @module filter-manager
 */

import { getSelectedValues } from './helpers.js';

/**
 * Filter Manager - Çoklu filtreleme sistemi
 */
export class FilterManager {
    constructor() {
        this.allData = [];
        this.filteredData = [];
        this.activeFilters = {};
    }

    /**
     * Veriyi ayarla
     * @param {Array} data - Tüm veri
     */
    setData(data) {
        this.allData = data;
        this.filteredData = [...data];
    }

    /**
     * Filtreleri uygula
     * @returns {Array} Filtrelenmiş veri
     */
    applyFilters() {
        const brands = getSelectedValues('filterBrand');
        const cat1s = getSelectedValues('filterCategory1'); // category_2 verisi
        const cat2s = getSelectedValues('filterCategory2'); // category_3 verisi
        const cat3s = getSelectedValues('filterCategory3'); // category_4 verisi
        const salesPersons = getSelectedValues('filterSalesPerson');
        const stores = getSelectedValues('filterStore');
        const cities = getSelectedValues('filterCity');
        const years = getSelectedValues('filterYear');
        const months = getSelectedValues('filterMonth');
        const days = getSelectedValues('filterDay');

        // Aktif filtreleri kaydet
        this.activeFilters = {
            brands,
            cat1s,
            cat2s,
            cat3s,
            salesPersons,
            stores,
            cities,
            years,
            months,
            days
        };

        console.log('🔍 Çoklu Filtreler:', {
            brands: brands.length,
            cat1s: cat1s.length,
            cat2s: cat2s.length,
            cat3s: cat3s.length,
            salesPersons: salesPersons.length,
            stores: stores.length,
            cities: cities.length,
            years: years.length,
            months: months.length,
            days: days.length
        });

        this.filteredData = this.allData.filter(item => {
            // Marka filtresi (çoklu)
            if (brands.length > 0 && !brands.includes(item.brand)) return false;

            // Kategori filtreleri (çoklu) - KAYDıRıLMıŞ
            if (cat1s.length > 0 && !cat1s.includes(item.category_2)) return false; // Kategori 1 = category_2
            if (cat2s.length > 0 && !cat2s.includes(item.category_3)) return false; // Kategori 2 = category_3
            if (cat3s.length > 0 && !cat3s.includes(item.category_4)) return false; // Kategori 3 = category_4

            // Satis temsilcisi filtresi (çoklu)
            if (salesPersons.length > 0 && !salesPersons.includes(item.sales_person)) return false;

            // Magaza filtresi (çoklu) - KISMI ESLEME
            if (stores.length > 0) {
                const itemStore = (item.store || '').toLowerCase();
                const matches = stores.some(store => itemStore.includes(store.toLowerCase()));
                if (!matches) return false;
            }

            // Sehir filtresi (çoklu)
            if (cities.length > 0 && !cities.includes(item.city)) return false;

            // Tarih filtreleri (çoklu)
            if (years.length > 0 || months.length > 0 || days.length > 0) {
                if (!item.date) return false;

                const dateParts = item.date.split('-');
                if (dateParts.length < 3) return false;

                if (years.length > 0 && !years.includes(dateParts[0])) return false;
                if (months.length > 0 && !months.includes(dateParts[1])) return false;
                if (days.length > 0 && !days.includes(dateParts[2])) return false;
            }

            return true;
        });

        console.log(`Filtreleme sonucu: ${this.filteredData.length} kayit`);

        return this.filteredData;
    }

    /**
     * Filtreleri sıfırla
     */
    resetFilters() {
        // Tüm checkbox'ların seçimlerini temizle
        const filterIds = [
            'filterBrand',
            'filterCategory1',
            'filterCategory2',
            'filterCategory3',
            'filterCategory4',
            'filterSalesPerson',
            'filterStore',
            'filterCity',
            'filterYear',
            'filterMonth',
            'filterDay'
        ];

        filterIds.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                const checkboxes = container.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach(cb => (cb.checked = false));
            }
        });

        // Seçim sayılarını güncelle
        const countIds = [
            'countBrand',
            'countCategory1',
            'countCategory2',
            'countCategory3',
            'countCategory4',
            'countSalesPerson',
            'countStore',
            'countCity',
            'countYear',
            'countMonth',
            'countDay'
        ];

        countIds.forEach(id => {
            const countSpan = document.getElementById(id);
            if (countSpan) countSpan.textContent = '';
        });

        // Smart search temizle
        const smartSearch = document.getElementById('smartSearch');
        if (smartSearch) smartSearch.value = '';

        // Debug ve AI panellerini gizle
        const debugPanel = document.getElementById('debugPanel');
        const aiPanel = document.getElementById('aiAnalysisPanel');
        if (debugPanel) debugPanel.style.display = 'none';
        if (aiPanel) aiPanel.style.display = 'none';

        // Filtrelenmiş veriyi sıfırla
        this.filteredData = [...this.allData];
        this.activeFilters = {};

        return this.filteredData;
    }

    /**
     * Debug bilgisi oluştur
     * @returns {Object} Debug bilgileri
     */
    getDebugInfo() {
        if (this.filteredData.length === 0) {
            return null;
        }

        // Toplam USD ve Miktar hesapla
        const totalUSD = this.filteredData.reduce(
            (sum, item) => sum + (parseFloat(item.usd_amount) || 0),
            0
        );
        const totalQty = this.filteredData.reduce(
            (sum, item) => sum + (parseFloat(item.quantity) || 0),
            0
        );

        // Benzersiz magazalari say
        const uniqueStores = new Set(this.filteredData.map(item => item.store)).size;

        // Tarih dagilimi
        const dateDistribution = {};
        this.filteredData.forEach(item => {
            const date = item.date || 'Bilinmeyen';
            dateDistribution[date] = (dateDistribution[date] || 0) + 1;
        });
        const topDates = Object.entries(dateDistribution)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        // Örnek kayıtlar
        const sampleRecords = this.filteredData.slice(0, 3).map(item => ({
            date: item.date,
            store: item.store,
            usd: parseFloat(item.usd_amount).toFixed(2),
            quantity: item.quantity,
            partner: item.partner
        }));

        return {
            totalRecords: this.allData.length,
            filteredRecords: this.filteredData.length,
            totalUSD,
            totalQty,
            uniqueStores,
            activeFilters: this.activeFilters,
            topDates,
            sampleRecords
        };
    }

    /**
     * Debug panelini güncelle
     */
    updateDebugPanel() {
        const debugInfo = this.getDebugInfo();
        if (!debugInfo) return;

        const debugPanel = document.getElementById('debugPanel');
        const debugInfoEl = document.getElementById('debugInfo');

        if (!debugPanel || !debugInfoEl) return;

        let debugText = `<strong>Toplam Kayit:</strong> ${debugInfo.totalRecords.toLocaleString('tr-TR')}<br>`;
        debugText += `<strong>Filtrelenmis Kayit:</strong> ${debugInfo.filteredRecords.toLocaleString('tr-TR')}<br>`;
        debugText += `<strong>Toplam USD:</strong> $${debugInfo.totalUSD.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}<br>`;
        debugText += `<strong>Toplam Miktar:</strong> ${debugInfo.totalQty.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}<br>`;
        debugText += `<strong>Benzersiz Magaza:</strong> ${debugInfo.uniqueStores}<br><br>`;

        debugText += `<strong>Aktif Filtreler:</strong><br>`;
        const { activeFilters } = debugInfo;
        if (activeFilters.stores && activeFilters.stores.length > 0)
            debugText += `- Magaza: ${activeFilters.stores.join(', ')}<br>`;
        if (activeFilters.years && activeFilters.years.length > 0)
            debugText += `- Yil: ${activeFilters.years.join(', ')}<br>`;
        if (activeFilters.months && activeFilters.months.length > 0)
            debugText += `- Ay: ${activeFilters.months.join(', ')}<br>`;
        if (activeFilters.days && activeFilters.days.length > 0)
            debugText += `- Gun: ${activeFilters.days.join(', ')}<br>`;
        if (activeFilters.brands && activeFilters.brands.length > 0)
            debugText += `- Marka: ${activeFilters.brands.join(', ')}<br>`;
        if (activeFilters.cat1s && activeFilters.cat1s.length > 0)
            debugText += `- Kategori 1: ${activeFilters.cat1s.join(', ')}<br>`;

        debugText += `<br><strong>En Cok Kayit Olan 5 Gun:</strong><br>`;
        debugInfo.topDates.forEach(([date, count]) => {
            debugText += `- ${date}: ${count} kayit<br>`;
        });

        debugText += `<br><strong>Ornek Kayitlar (ilk 3):</strong><br>`;
        debugInfo.sampleRecords.forEach((record, i) => {
            debugText += `<br>${i + 1}. Tarih: ${record.date} | Magaza: ${record.store}<br>`;
            debugText += `   USD: $${record.usd} | Miktar: ${record.quantity}<br>`;
            debugText += `   Musteri: ${record.partner}<br>`;
        });

        debugInfoEl.innerHTML = debugText;
        debugPanel.style.display = 'block';
    }

    /**
     * Filtrelenmiş veriyi al
     * @returns {Array} Filtrelenmiş veri
     */
    getFilteredData() {
        return this.filteredData;
    }

    /**
     * Tüm veriyi al
     * @returns {Array} Tüm veri
     */
    getAllData() {
        return this.allData;
    }
}

// Global instance
export const filterManager = new FilterManager();

console.log('✅ FilterManager modülü yüklendi');

