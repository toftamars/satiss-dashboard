/**
 * @fileoverview Session Manager Module
 * @description Session ve authentication yönetimi
 * @module session-manager
 */

import { logger } from './logger.js';
import { securityManager } from './security-manager.js';

/**
 * Session Manager - Session yönetimi
 */
export class SessionManager {
    constructor() {
        this.sessionKey = 'zuhal_session';
        this.tokenKey = 'zuhal_token';
        this.sessionTimeout = 120 * 60 * 1000; // 120 dakika
        this.encryptionKey = 'zuhal-musik-2025'; // Production'da env'den alınmalı
    }

    /**
     * Session kaydet
     * @param {Object} sessionData - Session verileri
     */
    saveSession(sessionData) {
        try {
            const sessionWithTimestamp = {
                ...sessionData,
                timestamp: Date.now(),
                expiresAt: Date.now() + this.sessionTimeout
            };

            // Güvenli şekilde kaydet
            securityManager.secureSetItem(
                this.sessionKey,
                sessionWithTimestamp,
                this.encryptionKey
            );

            logger.log('✅ Session kaydedildi');
        } catch (error) {
            logger.error('❌ Session kaydetme hatası:', error);
        }
    }

    /**
     * Session oku
     * @returns {Object|null} Session verileri
     */
    getSession() {
        try {
            const session = securityManager.secureGetItem(this.sessionKey, this.encryptionKey);

            if (!session) {
                return null;
            }

            // Expiry kontrolü
            if (Date.now() > session.expiresAt) {
                logger.warn('⚠️ Session süresi dolmuş');
                this.clearSession();
                return null;
            }

            return session;
        } catch (error) {
            logger.error('❌ Session okuma hatası:', error);
            return null;
        }
    }

    /**
     * Session temizle
     */
    clearSession() {
        sessionStorage.clear();
        localStorage.removeItem(this.sessionKey);
        localStorage.removeItem(this.tokenKey);
        logger.log('✅ Session temizlendi');
    }

    /**
     * Token kaydet
     * @param {string} token - JWT token
     */
    saveToken(token) {
        localStorage.setItem(this.tokenKey, token);
        logger.log('✅ Token kaydedildi');
    }

    /**
     * Token oku
     * @returns {string|null} JWT token
     */
    getToken() {
        return localStorage.getItem(this.tokenKey);
    }

    /**
     * Token doğrula
     * @returns {boolean} Geçerli mi?
     */
    validateToken() {
        const token = this.getToken();
        if (!token) {
            return false;
        }

        const payload = securityManager.verifyJWT(token);
        return payload !== null;
    }

    /**
     * Session yenile
     */
    refreshSession() {
        const session = this.getSession();
        if (session) {
            this.saveSession(session);
            logger.log('✅ Session yenilendi');
        }
    }

    /**
     * Logout
     * @param {Function} callback - Logout sonrası callback
     */
    logout(callback) {
        if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
            this.clearSession();

            if (callback) {
                callback();
            }

            logger.log('✅ Çıkış yapıldı');
            return true;
        }
        return false;
    }

    /**
     * Auto-logout timer başlat
     * @param {Function} onLogout - Logout callback
     */
    startAutoLogoutTimer(onLogout) {
        // Her 5 dakikada bir session kontrolü
        setInterval(
            () => {
                const session = this.getSession();
                if (!session) {
                    logger.warn('⚠️ Session süresi doldu, otomatik çıkış yapılıyor...');
                    this.logout(() => {
                        // Callback çağır
                        if (onLogout && typeof onLogout === 'function') {
                            onLogout();
                        }
                    });
                }
            },
            5 * 60 * 1000
        );
    }

    /**
     * Session bilgilerini al
     * @returns {Object} Session bilgileri
     */
    getSessionInfo() {
        const session = this.getSession();
        if (!session) {
            return {
                isActive: false,
                user: null,
                expiresIn: 0
            };
        }

        return {
            isActive: true,
            user: {
                id: session.userId,
                name: session.userName,
                username: session.username
            },
            expiresIn: Math.max(0, session.expiresAt - Date.now()),
            expiresAt: new Date(session.expiresAt).toLocaleString('tr-TR')
        };
    }

    /**
     * Session aktif mi?
     * @returns {boolean} Aktif mi?
     */
    isSessionActive() {
        return this.getSession() !== null;
    }
}

// Global instance
export const sessionManager = new SessionManager();

console.log('✅ SessionManager modülü yüklendi');
