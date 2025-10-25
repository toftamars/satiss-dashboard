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
        
        // CryptoJS kontrolü
        if (typeof CryptoJS === 'undefined') {
            console.error('❌ CryptoJS bulunamadı!');
            return;
        }
    }

    /**
     * Secret key al (production'da .env'den gelecek)
     */
    getSecretKey() {
        // Production'da environment variable'dan al
        const envKey = window.Config?.encryption?.secretKey;
        
        if (envKey) {
            return envKey;
        }
        
        // Development için varsayılan (GÜVENSİZ - sadece development)
        console.warn('⚠️ Development encryption key kullanılıyor!');
        return 'ZUHAL_MUZIK_SECRET_KEY_2024_CHANGE_THIS_IN_PRODUCTION';
    }

    /**
     * Veriyi şifrele
     */
    encrypt(data) {
        try {
            if (!data) return null;
            
            // Veriyi string'e çevir
            const jsonString = JSON.stringify(data);
            
            // AES ile şifrele
            const encrypted = CryptoJS.AES.encrypt(jsonString, this.secretKey).toString();
            
            console.log('✅ Veri şifrelendi');
            return encrypted;
        } catch (error) {
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
    decrypt(encryptedData) {
        try {
            if (!encryptedData) return null;
            
            // AES şifresini çöz
            const decrypted = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
            
            // UTF8 string'e çevir
            const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
            
            if (!jsonString) {
                throw new Error('Şifre çözme başarısız - yanlış anahtar?');
            }
            
            // JSON'a parse et
            const data = JSON.parse(jsonString);
            
            console.log('✅ Veri şifresi çözüldü');
            return data;
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
    encryptAndDownload(data, filename = 'encrypted-data.enc') {
        try {
            const encrypted = this.encrypt(data);
            
            if (!encrypted) {
                throw new Error('Şifreleme başarısız');
            }
            
            // Blob oluştur
            const blob = new Blob([encrypted], { type: 'text/plain' });
            
            // İndir
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
            
            reader.onload = (e) => {
                try {
                    const encryptedData = e.target.result;
                    const decryptedData = this.decrypt(encryptedData);
                    
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
    setEncrypted(key, data) {
        try {
            const encrypted = this.encrypt(data);
            
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
    getEncrypted(key) {
        try {
            const encrypted = localStorage.getItem(key);
            
            if (!encrypted) {
                return null;
            }
            
            return this.decrypt(encrypted);
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
}

// Global EncryptionManager instance oluştur
window.EncryptionManager = new EncryptionManager();

// Global fonksiyonlar
window.encryptData = (data) => window.EncryptionManager.encrypt(data);
window.decryptData = (data) => window.EncryptionManager.decrypt(data);
window.hashData = (data) => window.EncryptionManager.hash(data);

console.log('🔐 Encryption module loaded successfully');
