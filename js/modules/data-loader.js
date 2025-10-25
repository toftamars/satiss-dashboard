/**
 * @fileoverview Data Loader Module
 * @description Veri yükleme ve cache yönetimi
 * @module data-loader
 */

/* global Response, TextDecoder */
import { logger } from './logger.js';
import { errorHandler } from './error-handler.js';

/**
 * Data Loader - Veri yükleme ve cache
 */
export class DataLoader {
    constructor() {
        this.loadedYears = new Set();
        this.loadedDataCache = {};
        this.metadata = null;
    }

    /**
     * Metadata yükle
     * @returns {Promise<Object>} Metadata
     */
    async loadMetadata() {
        try {
            logger.log('📊 Metadata yükleniyor...');
            const response = await fetch('data/metadata.json');
            if (!response.ok) throw new Error('Metadata yüklenemedi');

            this.metadata = await response.json();
            logger.log('✅ Metadata yüklendi:', this.metadata);
            return this.metadata;
        } catch (error) {
            errorHandler.handleError(error, 'Metadata yükleme hatası');
            return null;
        }
    }

    /**
     * Yıl verisi yükle
     * @param {number} year - Yıl
     * @returns {Promise<Object>} Yıl verisi
     */
    async loadYearData(year) {
        // Cache kontrolü
        if (this.loadedYears.has(year) && this.loadedDataCache[year]) {
            logger.log(`⏭️ ${year} zaten yüklü, cache'den döndürülüyor...`);
            return this.loadedDataCache[year];
        }

        try {
            logger.log(`📦 ${year} yükleniyor...`);

            const response = await fetch(`data/data-${year}.json.gz`);
            if (!response.ok) throw new Error(`${year} verisi yüklenemedi`);

            // GZIP decompress
            const arrayBuffer = await response.arrayBuffer();
            const decompressed = await this.decompressGzip(arrayBuffer);

            // JSON parse
            const yearData = JSON.parse(decompressed);

            // Cache'e kaydet
            this.loadedDataCache[year] = yearData;
            this.loadedYears.add(year);

            logger.log(`✅ ${year} yılı yüklendi: ${yearData.details?.length || 0} kayıt`);
            return yearData;
        } catch (error) {
            errorHandler.handleError(error, `${year} yükleme hatası`);
            return null;
        }
    }

    /**
     * GZIP decompress
     * @param {ArrayBuffer} buffer - Compressed data
     * @returns {Promise<string>} Decompressed string
     */
    async decompressGzip(buffer) {
        try {
            // Modern browsers - DecompressionStream
            if (typeof DecompressionStream !== 'undefined') {
                const stream = new Response(buffer).body.pipeThrough(
                    new DecompressionStream('gzip')
                );
                const decompressed = await new Response(stream).arrayBuffer();
                return new TextDecoder().decode(decompressed);
            }

            // Fallback - pako
            if (typeof pako !== 'undefined') {
                const uint8Array = new Uint8Array(buffer);
                const decompressed = pako.inflate(uint8Array);
                return new TextDecoder().decode(decompressed);
            }

            throw new Error('Decompression not supported');
        } catch (error) {
            errorHandler.handleError(error, 'Decompression hatası');
            throw error;
        }
    }

    /**
     * Tüm yılları yükle
     * @param {Array} years - Yıl listesi
     * @returns {Promise<Array>} Tüm veriler
     */
    async loadAllYears(years) {
        try {
            logger.log(`📅 Tüm yıllar yükleniyor: ${years.join(', ')}`);

            // Paralel yükleme
            const yearPromises = years.map(year => this.loadYearData(year));
            const yearResults = await Promise.all(yearPromises);

            // Tüm verileri birleştir
            const allData = [];
            yearResults.forEach(yearData => {
                if (yearData && yearData.details) {
                    allData.push(...yearData.details);
                }
            });

            logger.log(`✅ Toplam ${allData.length} kayıt yüklendi`);
            return allData;
        } catch (error) {
            errorHandler.handleError(error, 'Tüm yıllar yükleme hatası');
            return [];
        }
    }

    /**
     * Cache temizle
     * @param {number} year - Temizlenecek yıl (opsiyonel)
     */
    clearCache(year = null) {
        if (year) {
            delete this.loadedDataCache[year];
            this.loadedYears.delete(year);
            logger.log(`🗑️ ${year} cache'i temizlendi`);
        } else {
            this.loadedDataCache = {};
            this.loadedYears.clear();
            logger.log('🗑️ Tüm cache temizlendi');
        }
    }

    /**
     * Cache durumu
     * @returns {Object} Cache bilgisi
     */
    getCacheInfo() {
        return {
            loadedYears: Array.from(this.loadedYears),
            cacheSize: Object.keys(this.loadedDataCache).length,
            totalRecords: Object.values(this.loadedDataCache).reduce(
                (sum, data) => sum + (data.details?.length || 0),
                0
            )
        };
    }
}

// Global instance
export const dataLoader = new DataLoader();

console.log('✅ DataLoader modülü yüklendi');
