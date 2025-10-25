/**
 * @fileoverview Secure Configuration Loader
 * @description Environment variables'dan config yükle
 * @module config-loader
 */

/**
 * Güvenli Configuration Loader
 * Production'da environment variables kullanır
 * Development'ta config.json fallback'i var
 */
export class ConfigLoader {
    static config = null;
    static isLoading = false;
    static loadPromise = null;

    /**
     * Config'i yükle (singleton pattern)
     * @returns {Promise<Object>} Configuration object
     */
    static async load() {
        // Zaten yüklüyse bekle
        if (this.isLoading) {
            return this.loadPromise;
        }

        // Zaten yüklenmişse direkt dön
        if (this.config) {
            return this.config;
        }

        this.isLoading = true;
        this.loadPromise = this._loadConfig();

        try {
            this.config = await this.loadPromise;
            return this.config;
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Config'i yükle (internal)
     * @private
     */
    static async _loadConfig() {
        try {
            // 1. Environment variables'ı kontrol et (Vercel, production)
            if (this._hasEnvironmentVariables()) {
                console.log('✅ Environment variables kullanılıyor');
                return this._loadFromEnvironment();
            }

            // 2. config.json'dan yükle (development fallback)
            console.warn('⚠️ config.json kullanılıyor (sadece development için!)');
            return await this._loadFromFile();

        } catch (error) {
            console.error('❌ Config yükleme hatası:', error);
            throw new Error('Configuration loading failed: ' + error.message);
        }
    }

    /**
     * Environment variables var mı kontrol et
     * @private
     */
    static _hasEnvironmentVariables() {
        // Node.js environment (GitHub Actions, Vercel serverless)
        if (typeof process !== 'undefined' && process.env) {
            return !!(process.env.ODOO_URL && process.env.ODOO_API_KEY);
        }

        // Browser environment - Vercel'den inject edilen env vars
        if (typeof window !== 'undefined' && window.__ENV__) {
            return !!(window.__ENV__.ODOO_URL && window.__ENV__.ODOO_API_KEY);
        }

        return false;
    }

    /**
     * Environment variables'dan yükle
     * @private
     */
    static _loadFromEnvironment() {
        const env = (typeof process !== 'undefined' && process.env) 
            ? process.env 
            : window.__ENV__ || {};

        return {
            odoo: {
                url: env.ODOO_URL || 'https://erp.zuhalmuzik.com',
                database: env.ODOO_DATABASE || 'erp.zuhalmuzik.com',
                username: env.ODOO_USERNAME || '',
                api_key: env.ODOO_API_KEY || ''
            },
            github: {
                repo_path: env.GITHUB_REPO_PATH || '.',
                html_file: env.GITHUB_HTML_FILE || 'analiz_2024_2025.html',
                commit_message: env.GITHUB_COMMIT_MESSAGE || 'Veriler güncellendi - {date}'
            },
            schedule: {
                auto_commit: env.AUTO_COMMIT !== 'false',
                log_file: env.LOG_FILE || 'update_log.txt'
            }
        };
    }

    /**
     * config.json'dan yükle (development fallback)
     * @private
     */
    static async _loadFromFile() {
        try {
            const response = await fetch('/config.json');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const config = await response.json();

            // ⚠️ Database adını düzelt (eğer yanlışsa)
            if (config.odoo && config.odoo.database === 'zuhalmuzik') {
                console.warn('⚠️ Database adı düzeltiliyor: zuhalmuzik → erp.zuhalmuzik.com');
                config.odoo.database = 'erp.zuhalmuzik.com';
            }

            return config;

        } catch (error) {
            console.error('❌ config.json yüklenemedi:', error);
            throw new Error('config.json bulunamadı veya okunamadı. Lütfen config.example.json\'dan kopyalayın.');
        }
    }

    /**
     * Config değeri al
     * @param {string} path - Nokta notasyonu ile path (örn: 'odoo.url')
     * @returns {*} Config değeri
     */
    static get(path) {
        if (!this.config) {
            throw new Error('Config henüz yüklenmedi! ConfigLoader.load() çağırın.');
        }

        const keys = path.split('.');
        let value = this.config;

        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return undefined;
            }
        }

        return value;
    }

    /**
     * Tüm config'i al
     * @returns {Object} Configuration object
     */
    static getAll() {
        if (!this.config) {
            throw new Error('Config henüz yüklenmedi! ConfigLoader.load() çağırın.');
        }
        return this.config;
    }

    /**
     * Config'i sıfırla (test için)
     */
    static reset() {
        this.config = null;
        this.isLoading = false;
        this.loadPromise = null;
    }
}

console.log('✅ ConfigLoader modülü yüklendi');

