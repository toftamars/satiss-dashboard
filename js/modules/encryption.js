/**
 * 🔐 Encryption Module
 * Veri şifreleme ve şifre çözme
 */

class EncryptionManager {
    constructor() {
        // Güvenli anahtar oluştur (production'da .env'den al)
        this.secretKey = this.getSecretKey();
        this.init();
    }

    /**
     * Encryption manager'ı başlat
     */
    init() {
        console.log('🔐 EncryptionManager initialized');
        // Web Crypto API kontrolü
        if (!window.crypto || !window.crypto.subtle) {
            console.error('❌ Web Crypto API desteklenmiyor!');
        }
    }

    /**
     * Secret key al (production'da .env'den gelecek)
     */
    getSecretKey() {
        // 1. Önce environment variable'dan al (en güvenli)
        const envKey = window.Config?.encryption?.secretKey;
        if (envKey && envKey !== 'ZUHAL_MUZIK_SECRET_KEY_2024_CHANGE_THIS_IN_PRODUCTION') {
            console.log('✅ Production encryption key kullanılıyor');
            return envKey;
        }
        
        // 2. LocalStorage'dan al (daha güvenli)
        const storedKey = localStorage.getItem('encryption_key');
        if (storedKey && storedKey.length > 32) {
            console.log('✅ Stored encryption key kullanılıyor');
            return storedKey;
        }
        
        // 3. Development fallback
        if (window.location.hostname === 'localhost') {
            console.warn('⚠️ Development encryption key kullanılıyor');
        }
        return 'ZUHAL_MUZIK_SECRET_KEY_2024_CHANGE_THIS_IN_PRODUCTION';
    }

    /**
     * Veriyi şifrele
     */
    async encrypt(data) {
        try {
            if (data === undefined) return null;
            const jsonString = JSON.stringify(data);

            // Web Crypto AES-GCM
            const iv = new Uint8Array(12);
            window.crypto.getRandomValues(iv);
            const salt = new Uint8Array(16);
            window.crypto.getRandomValues(salt);

            const key = await this.deriveAesGcmKey(salt);
            const encoded = new TextEncoder().encode(jsonString);
            const cipherBuffer = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);

            const payload = {
                v: 1,
                alg: 'AES-GCM',
                s: this.arrayBufferToBase64(salt),
                i: this.arrayBufferToBase64(iv),
                c: this.arrayBufferToBase64(cipherBuffer)
            };

            console.log('✅ Veri şifrelendi');
            return JSON.stringify(payload);
        } catch (error) {
            // Geriye dönük uyumluluk için CryptoJS'e düş
            try {
                if (typeof CryptoJS !== 'undefined') {
                    const jsonString = JSON.stringify(data);
                    const encrypted = CryptoJS.AES.encrypt(jsonString, this.secretKey).toString();
                    console.warn('⚠️ Web Crypto başarısız, CryptoJS ile şifrelendi');
                    return encrypted;
                }
            } catch (_) {}
            console.error('❌ Şifreleme hatası:', error);
            if (window.ErrorHandler) {
                window.ErrorHandler.handleError(error);
            }
            return null;
        }
    }

    /**
     * Şifreyi çöz
     */
    async decrypt(encryptedData) {
        try {
            if (!encryptedData) return null;

            // AES-GCM formatını dene
            try {
                const payload = JSON.parse(encryptedData);
                if (payload && payload.v === 1 && payload.alg === 'AES-GCM') {
                    const salt = this.base64ToArrayBuffer(payload.s);
                    const iv = this.base64ToArrayBuffer(payload.i);
                    const cipher = this.base64ToArrayBuffer(payload.c);
                    const key = await this.deriveAesGcmKey(new Uint8Array(salt));
                    const plainBuffer = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(iv) }, key, cipher);
                    const jsonString = new TextDecoder().decode(plainBuffer);
                    const data = JSON.parse(jsonString);
                    console.log('✅ Veri şifresi çözüldü (AES-GCM)');
                    return data;
                }
            } catch (_) {
                // JSON değilse CryptoJS format olabilir
            }

            // Geriye dönük: CryptoJS ile çözmeyi dene
            if (typeof CryptoJS !== 'undefined') {
                const decrypted = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
                const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
                if (!jsonString) {
                    throw new Error('Şifre çözme başarısız - yanlış anahtar?');
                }
                const data = JSON.parse(jsonString);
                console.log('✅ Veri şifresi çözüldü (CryptoJS)');
                return data;
            }

            throw new Error('Geçersiz şifreli veri formatı');
        } catch (error) {
            console.error('❌ Şifre çözme hatası:', error);
            if (window.ErrorHandler) {
                window.ErrorHandler.handleError(error);
            }
            return null;
        }
    }

    /**
     * Dosyayı şifrele ve indir
     */
    async encryptAndDownload(data, filename = 'encrypted-data.enc') {
        try {
            const encrypted = await this.encrypt(data);
            if (!encrypted) {
                throw new Error('Şifreleme başarısız');
            }
            const blob = new Blob([encrypted], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
            console.log('✅ Şifreli dosya indirildi:', filename);
            if (window.showToast) {
                window.showToast('Şifreli dosya indirildi', 'success');
            }
        } catch (error) {
            console.error('❌ Dosya şifreleme hatası:', error);
            if (window.ErrorHandler) {
                window.ErrorHandler.handleError(error);
            }
        }
    }

    /**
     * Şifreli dosyayı oku
     */
    async readEncryptedFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const encryptedData = e.target.result;
                    const decryptedData = await this.decrypt(encryptedData);
                    if (!decryptedData) {
                        throw new Error('Şifre çözme başarısız');
                    }
                    resolve(decryptedData);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Dosya okuma hatası'));
            reader.readAsText(file);
        });
    }

    /**
     * LocalStorage'a şifreli kaydet
     */
    async setEncrypted(key, data) {
        try {
            const encrypted = await this.encrypt(data);
            if (!encrypted) {
                throw new Error('Şifreleme başarısız');
            }
            localStorage.setItem(key, encrypted);
            console.log('✅ Şifreli veri kaydedildi:', key);
        } catch (error) {
            console.error('❌ Şifreli kaydetme hatası:', error);
            if (window.ErrorHandler) {
                window.ErrorHandler.handleError(error);
            }
        }
    }

    /**
     * LocalStorage'dan şifreli oku
     */
    async getEncrypted(key) {
        try {
            const encrypted = localStorage.getItem(key);
            if (!encrypted) {
                return null;
            }
            return await this.decrypt(encrypted);
        } catch (error) {
            console.error('❌ Şifreli okuma hatası:', error);
            if (window.ErrorHandler) {
                window.ErrorHandler.handleError(error);
            }
            return null;
        }
    }

    /**
     * Hash oluştur (tek yönlü)
     */
    hash(data) {
        try {
            const jsonString = JSON.stringify(data);
            return CryptoJS.SHA256(jsonString).toString();
        } catch (error) {
            console.error('❌ Hash oluşturma hatası:', error);
            return null;
        }
    }

    /**
     * Güvenli random string oluştur
     */
    generateSecureToken(length = 32) {
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Veri bütünlüğünü kontrol et
     */
    verifyIntegrity(data, expectedHash) {
        const actualHash = this.hash(data);
        return actualHash === expectedHash;
    }

    // === Yardımcılar ===
    async deriveAesGcmKey(salt) {
        const enc = new TextEncoder();
        const keyMaterial = await window.crypto.subtle.importKey(
            'raw',
            enc.encode(this.secretKey),
            'PBKDF2',
            false,
            ['deriveKey']
        );
        return await window.crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt,
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    }

    arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    base64ToArrayBuffer(base64) {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }
}

// Global EncryptionManager instance oluştur
window.EncryptionManager = new EncryptionManager();

// Global fonksiyonlar
window.encryptData = (data) => window.EncryptionManager.encrypt(data);
window.decryptData = (data) => window.EncryptionManager.decrypt(data);
window.hashData = (data) => window.EncryptionManager.hash(data);

console.log('🔐 Encryption module loaded successfully');

