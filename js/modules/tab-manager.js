/**
 * @fileoverview Tab Manager Module
 * @description Sekme yönetimi ve navigasyon
 * @module tab-manager
 */

import { logger } from './logger.js';

/**
 * Tab Manager - Sekme yönetimi
 */
export class TabManager {
    constructor() {
        this.currentTab = 'dashboard';
        this.tabCallbacks = {};
        this.tabButtons = {
            dashboard: 0,
            targets: 1,
            customers: 2,
            salesperson: 3,
            store: 4,
            city: 5,
            stock: 6,
            time: 7,
            product: 8
        };
    }

    /**
     * Tab değiştir
     * @param {string} tabName - Tab adı
     */
    switchTab(tabName) {
        logger.log(`🔄 Tab değiştiriliyor: ${this.currentTab} → ${tabName}`);

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
            logger.log(`✅ Tab aktif edildi: ${tabName}Tab`);
        } else {
            logger.error(`❌ Tab bulunamadı: ${tabName}Tab`);
            return;
        }

        // İlgili tab butonunu aktif et
        if (this.tabButtons[tabName] !== undefined) {
            allTabs[this.tabButtons[tabName]].classList.add('active');
        }

        // Tab callback'ini çağır
        if (this.tabCallbacks[tabName]) {
            logger.log(`🔄 ${tabName} callback çağrılıyor...`);
            this.tabCallbacks[tabName]();
        }

        this.currentTab = tabName;
    }

    /**
     * Tab için callback kaydet
     * @param {string} tabName - Tab adı
     * @param {Function} callback - Callback fonksiyonu
     */
    registerCallback(tabName, callback) {
        this.tabCallbacks[tabName] = callback;
        logger.log(`✅ ${tabName} tab callback kaydedildi`);
    }

    /**
     * Birden fazla callback kaydet
     * @param {Object} callbacks - {tabName: callback} formatında
     */
    registerCallbacks(callbacks) {
        Object.entries(callbacks).forEach(([tabName, callback]) => {
            this.registerCallback(tabName, callback);
        });
    }

    /**
     * Mevcut tab'ı al
     * @returns {string} Aktif tab adı
     */
    getCurrentTab() {
        return this.currentTab;
    }

    /**
     * Tab'ı yenile (callback'i tekrar çağır)
     */
    refreshCurrentTab() {
        if (this.tabCallbacks[this.currentTab]) {
            logger.log(`🔄 ${this.currentTab} tab yenileniyor...`);
            this.tabCallbacks[this.currentTab]();
        }
    }

    /**
     * Tab butonlarına event listener ekle
     */
    initializeTabButtons() {
        const tabButtons = document.querySelectorAll('.tab');
        tabButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                const tabName = Object.keys(this.tabButtons).find(
                    key => this.tabButtons[key] === index
                );
                if (tabName) {
                    this.switchTab(tabName);
                }
            });
        });
        logger.log('✅ Tab butonları initialize edildi');
    }
}

// Global instance
export const tabManager = new TabManager();

console.log('✅ TabManager modülü yüklendi');
