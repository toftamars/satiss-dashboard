/**
 * @fileoverview Security Manager Module
 * @description Güvenlik yönetimi: JWT, CSRF, CSP, Input Validation
 * @module security-manager
 */

/* global crypto, atob, btoa, URL */
import { logger } from './logger.js';
import { errorHandler } from './error-handler.js';

/**
 * Security Manager - Güvenlik yönetimi
 */
export class SecurityManager {
    constructor() {
        this.csrfToken = null;
        this.jwtSecret = null; // Server-side'da olmalı
        this.sessionTimeout = 120 * 60 * 1000; // 120 dakika
    }

    /**
     * JWT Token oluştur (server-side için template)
     * NOT: Bu fonksiyon sadece örnek, gerçek JWT server-side oluşturulmalı
     * @returns {string} JWT token
     */
    createJWT() {
        // Bu fonksiyon client-side'da KULLANILMAMALI
        // Server-side'da jsonwebtoken paketi ile yapılmalı
        logger.warn('⚠️ JWT oluşturma server-side yapılmalı!');
        return null;
    }

    /**
     * JWT Token doğrula
     * @param {string} token - JWT token
     * @returns {Object|null} Decoded payload veya null
     */
    verifyJWT(token) {
        try {
            // Client-side'da sadece decode edebiliriz, verify edemeyiz
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid JWT format');
            }

            const payload = JSON.parse(atob(parts[1]));

            // Expiry kontrolü
            if (payload.exp && Date.now() >= payload.exp * 1000) {
                logger.warn('⚠️ Token süresi dolmuş');
                return null;
            }

            return payload;
        } catch (error) {
            errorHandler.handleError(error, 'JWT verification failed');
            return null;
        }
    }

    /**
     * CSRF Token oluştur
     * @returns {string} CSRF token
     */
    generateCSRFToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        this.csrfToken = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        sessionStorage.setItem('csrf_token', this.csrfToken);
        logger.log('✅ CSRF token oluşturuldu');
        return this.csrfToken;
    }

    /**
     * CSRF Token doğrula
     * @param {string} token - Gelen token
     * @returns {boolean} Geçerli mi?
     */
    verifyCSRFToken(token) {
        const storedToken = sessionStorage.getItem('csrf_token');
        if (!storedToken) {
            logger.error('❌ CSRF token bulunamadı');
            return false;
        }
        return token === storedToken;
    }

    /**
     * Input sanitization - XSS koruması
     * @param {string} input - Kullanıcı inputu
     * @returns {string} Temizlenmiş input
     */
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;

        // HTML karakterlerini escape et
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    /**
     * SQL Injection koruması (basit kontrol)
     * @param {string} input - Kullanıcı inputu
     * @returns {boolean} Güvenli mi?
     */
    isSafeSQLInput(input) {
        if (typeof input !== 'string') return true;

        const dangerousPatterns = [
            /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
            /(--|;|\/\*|\*\/|xp_|sp_)/gi,
            /('|(\\')|(--)|(-)|(\+)|(\|\|))/gi
        ];

        return !dangerousPatterns.some(pattern => pattern.test(input));
    }

    /**
     * Email validasyonu
     * @param {string} email - Email adresi
     * @returns {boolean} Geçerli mi?
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * URL validasyonu
     * @param {string} url - URL
     * @returns {boolean} Geçerli mi?
     */
    isValidURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Form validasyonu
     * @param {Object} formData - Form verileri
     * @param {Object} rules - Validation kuralları
     * @returns {Object} {valid: boolean, errors: Array}
     */
    validateForm(formData, rules) {
        const errors = [];

        Object.entries(rules).forEach(([field, rule]) => {
            const value = formData[field];

            // Required kontrolü
            if (rule.required && (!value || value.trim() === '')) {
                errors.push(`${field} alanı zorunludur`);
                return;
            }

            if (!value) return;

            // Min length kontrolü
            if (rule.minLength && value.length < rule.minLength) {
                errors.push(`${field} en az ${rule.minLength} karakter olmalıdır`);
            }

            // Max length kontrolü
            if (rule.maxLength && value.length > rule.maxLength) {
                errors.push(`${field} en fazla ${rule.maxLength} karakter olmalıdır`);
            }

            // Email kontrolü
            if (rule.email && !this.isValidEmail(value)) {
                errors.push(`${field} geçerli bir email adresi olmalıdır`);
            }

            // URL kontrolü
            if (rule.url && !this.isValidURL(value)) {
                errors.push(`${field} geçerli bir URL olmalıdır`);
            }

            // Pattern kontrolü
            if (rule.pattern && !rule.pattern.test(value)) {
                errors.push(`${field} geçersiz format`);
            }

            // SQL Injection kontrolü
            if (!this.isSafeSQLInput(value)) {
                errors.push(`${field} güvenli olmayan karakterler içeriyor`);
            }
        });

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Sensitive data şifreleme (basit XOR encryption)
     * NOT: Production'da AES gibi güçlü bir algoritma kullanılmalı
     * @param {string} data - Şifrelenecek veri
     * @param {string} key - Şifreleme anahtarı
     * @returns {string} Şifrelenmiş veri (base64)
     */
    encryptData(data, key) {
        try {
            const encrypted = [];
            for (let i = 0; i < data.length; i++) {
                const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
                encrypted.push(String.fromCharCode(charCode));
            }
            return btoa(encrypted.join(''));
        } catch (error) {
            errorHandler.handleError(error, 'Encryption failed');
            return null;
        }
    }

    /**
     * Sensitive data şifre çözme
     * @param {string} encryptedData - Şifrelenmiş veri (base64)
     * @param {string} key - Şifreleme anahtarı
     * @returns {string} Çözülmüş veri
     */
    decryptData(encryptedData, key) {
        try {
            const data = atob(encryptedData);
            const decrypted = [];
            for (let i = 0; i < data.length; i++) {
                const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
                decrypted.push(String.fromCharCode(charCode));
            }
            return decrypted.join('');
        } catch (error) {
            errorHandler.handleError(error, 'Decryption failed');
            return null;
        }
    }

    /**
     * Secure localStorage - Şifreli kaydetme
     * @param {string} key - Key
     * @param {any} value - Value
     * @param {string} encryptionKey - Şifreleme anahtarı
     */
    secureSetItem(key, value, encryptionKey) {
        try {
            const jsonValue = JSON.stringify(value);
            const encrypted = this.encryptData(jsonValue, encryptionKey);
            if (encrypted) {
                localStorage.setItem(key, encrypted);
                logger.log(`✅ ${key} güvenli şekilde kaydedildi`);
            }
        } catch (error) {
            errorHandler.handleError(error, 'Secure storage failed');
        }
    }

    /**
     * Secure localStorage - Şifreli okuma
     * @param {string} key - Key
     * @param {string} encryptionKey - Şifreleme anahtarı
     * @returns {any} Değer
     */
    secureGetItem(key, encryptionKey) {
        try {
            const encrypted = localStorage.getItem(key);
            if (!encrypted) return null;

            const decrypted = this.decryptData(encrypted, encryptionKey);
            return decrypted ? JSON.parse(decrypted) : null;
        } catch (error) {
            errorHandler.handleError(error, 'Secure retrieval failed');
            return null;
        }
    }

    /**
     * CSP Meta tag ekle
     */
    addCSPMetaTag() {
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https:",
            "connect-src 'self' https://erp.zuhalmuzik.com https://*.vercel.app"
        ].join('; ');

        document.head.appendChild(meta);
        logger.log('✅ CSP meta tag eklendi');
    }

    /**
     * Rate limiting (basit client-side)
     * @param {string} action - Action adı
     * @param {number} maxAttempts - Max deneme sayısı
     * @param {number} timeWindow - Zaman penceresi (ms)
     * @returns {boolean} İzin verildi mi?
     */
    checkRateLimit(action, maxAttempts = 5, timeWindow = 60000) {
        const key = `rate_limit_${action}`;
        const now = Date.now();
        let attempts = JSON.parse(sessionStorage.getItem(key) || '[]');

        // Eski denemeleri temizle
        attempts = attempts.filter(timestamp => now - timestamp < timeWindow);

        if (attempts.length >= maxAttempts) {
            logger.warn(`⚠️ Rate limit aşıldı: ${action}`);
            return false;
        }

        attempts.push(now);
        sessionStorage.setItem(key, JSON.stringify(attempts));
        return true;
    }
}

// Global instance
export const securityManager = new SecurityManager();

console.log('✅ SecurityManager modülü yüklendi');
