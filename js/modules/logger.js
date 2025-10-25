/**
 * @fileoverview Logger Module
 * @description Production-safe logging
 * @module logger
 */

class Logger {
    constructor() {
        this.isDevelopment =
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.hostname === '';
        this.isDebugMode = localStorage.getItem('debug') === 'true';
    }

    /**
     * Log mesajı (sadece development/debug modda)
     */
    log(...args) {
        if (this.isDevelopment || this.isDebugMode) {
            console.log(...args);
        }
    }

    /**
     * Warning mesajı (sadece development/debug modda)
     */
    warn(...args) {
        if (this.isDevelopment || this.isDebugMode) {
            console.warn(...args);
        }
    }

    /**
     * Error mesajı (her zaman logla)
     */
    error(...args) {
        // Error'ları her zaman logla
        console.error(...args);
    }

    /**
     * Info mesajı (sadece development/debug modda)
     */
    info(...args) {
        if (this.isDevelopment || this.isDebugMode) {
            console.info(...args);
        }
    }

    /**
     * Debug mode aç
     */
    enableDebug() {
        localStorage.setItem('debug', 'true');
        this.isDebugMode = true;
        console.log('🐛 Debug mode: AÇIK');
    }

    /**
     * Debug mode kapat
     */
    disableDebug() {
        localStorage.removeItem('debug');
        this.isDebugMode = false;
        console.log('🐛 Debug mode: KAPALI');
    }

    /**
     * Development modda mı kontrol et
     */
    isDev() {
        return this.isDevelopment || this.isDebugMode;
    }
}

export const logger = new Logger();

// Global debug fonksiyonları
if (typeof window !== 'undefined') {
    window.enableDebug = () => logger.enableDebug();
    window.disableDebug = () => logger.disableDebug();
}

console.log('✅ Logger modülü yüklendi');

