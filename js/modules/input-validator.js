/**
 * ✅ Input Validator Module
 * Form input'larını validate eder ve sanitize eder
 */

class InputValidator {
    constructor() {
        this.init();
    }

    /**
     * Validator'ı başlat
     */
    init() {
        console.log('✅ InputValidator initialized');
    }

    /**
     * Email validasyonu
     */
    static validateEmail(email) {
        if (!email || typeof email !== 'string') {
            return false;
        }
        
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email.trim());
    }

    /**
     * String sanitization
     */
    static sanitizeString(str) {
        if (!str || typeof str !== 'string') {
            return '';
        }
        
        // HTML karakterlerini escape et
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }

    /**
     * HTML sanitization (DOMPurify kullanarak)
     */
    static sanitizeHTML(html) {
        if (!html || typeof html !== 'string') {
            return '';
        }
        
        if (typeof DOMPurify !== 'undefined') {
            return DOMPurify.sanitize(html, {
                ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'span', 'div'],
                ALLOWED_ATTR: ['href', 'title', 'class', 'id']
            });
        }
        
        // DOMPurify yoksa basit sanitization
        return this.sanitizeString(html);
    }

    /**
     * Number validasyonu
     */
    static validateNumber(num, min = -Infinity, max = Infinity) {
        const n = parseFloat(num);
        
        if (isNaN(n)) {
            return false;
        }
        
        return n >= min && n <= max;
    }

    /**
     * Integer validasyonu
     */
    static validateInteger(num, min = -Infinity, max = Infinity) {
        const n = parseInt(num, 10);
        
        if (isNaN(n) || n !== parseFloat(num)) {
            return false;
        }
        
        return n >= min && n <= max;
    }

    /**
     * URL validasyonu
     */
    static validateURL(url) {
        if (!url || typeof url !== 'string') {
            return false;
        }
        
        try {
            const urlObj = new URL(url);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch {
            return false;
        }
    }

    /**
     * Telefon numarası validasyonu (Türkiye)
     */
    static validatePhone(phone) {
        if (!phone || typeof phone !== 'string') {
            return false;
        }
        
        // Türkiye telefon formatı: +90 5XX XXX XX XX
        const regex = /^(\+90|0)?5\d{9}$/;
        return regex.test(phone.replace(/\s/g, ''));
    }

    /**
     * Tarih validasyonu
     */
    static validateDate(dateString) {
        if (!dateString) {
            return false;
        }
        
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }

    /**
     * String uzunluk validasyonu
     */
    static validateLength(str, min = 0, max = Infinity) {
        if (!str || typeof str !== 'string') {
            return false;
        }
        
        const length = str.trim().length;
        return length >= min && length <= max;
    }

    /**
     * Regex pattern validasyonu
     */
    static validatePattern(str, pattern) {
        if (!str || typeof str !== 'string') {
            return false;
        }
        
        return pattern.test(str);
    }

    /**
     * SQL Injection koruması
     */
    static preventSQLInjection(str) {
        if (!str || typeof str !== 'string') {
            return '';
        }
        
        // Tehlikeli SQL karakterlerini temizle
        return str
            .replace(/['";\\]/g, '')
            .replace(/--/g, '')
            .replace(/\/\*/g, '')
            .replace(/\*\//g, '')
            .replace(/xp_/gi, '')
            .replace(/exec/gi, '')
            .replace(/execute/gi, '')
            .replace(/drop/gi, '')
            .replace(/delete/gi, '')
            .replace(/insert/gi, '')
            .replace(/update/gi, '')
            .replace(/union/gi, '');
    }

    /**
     * XSS koruması
     */
    static preventXSS(str) {
        if (!str || typeof str !== 'string') {
            return '';
        }
        
        // Script tag'lerini ve event handler'ları temizle
        return str
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/data:text\/html/gi, '');
    }

    /**
     * Dosya adı sanitization
     */
    static sanitizeFilename(filename) {
        if (!filename || typeof filename !== 'string') {
            return '';
        }
        
        return filename
            .replace(/[^a-zA-Z0-9._-]/g, '_')
            .replace(/\.{2,}/g, '.')
            .substring(0, 255);
    }

    /**
     * Form validasyonu
     */
    static validateForm(formData, rules) {
        const errors = {};
        
        for (const [field, rule] of Object.entries(rules)) {
            const value = formData[field];
            
            // Required kontrolü
            if (rule.required && (!value || value.trim() === '')) {
                errors[field] = `${field} alanı zorunludur`;
                continue;
            }
            
            // Type kontrolü
            if (value && rule.type) {
                switch (rule.type) {
                    case 'email':
                        if (!this.validateEmail(value)) {
                            errors[field] = 'Geçerli bir email adresi giriniz';
                        }
                        break;
                    case 'number':
                        if (!this.validateNumber(value, rule.min, rule.max)) {
                            errors[field] = `Geçerli bir sayı giriniz (${rule.min}-${rule.max})`;
                        }
                        break;
                    case 'url':
                        if (!this.validateURL(value)) {
                            errors[field] = 'Geçerli bir URL giriniz';
                        }
                        break;
                    case 'phone':
                        if (!this.validatePhone(value)) {
                            errors[field] = 'Geçerli bir telefon numarası giriniz';
                        }
                        break;
                }
            }
            
            // Length kontrolü
            if (value && rule.minLength && !this.validateLength(value, rule.minLength)) {
                errors[field] = `En az ${rule.minLength} karakter olmalıdır`;
            }
            
            if (value && rule.maxLength && !this.validateLength(value, 0, rule.maxLength)) {
                errors[field] = `En fazla ${rule.maxLength} karakter olmalıdır`;
            }
            
            // Pattern kontrolü
            if (value && rule.pattern && !this.validatePattern(value, rule.pattern)) {
                errors[field] = rule.patternMessage || 'Geçersiz format';
            }
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    /**
     * Güvenli veri dönüşümü
     */
    static safeTransform(value, type) {
        try {
            switch (type) {
                case 'number':
                    return parseFloat(value) || 0;
                case 'integer':
                    return parseInt(value, 10) || 0;
                case 'boolean':
                    return Boolean(value);
                case 'string':
                    return String(value || '');
                case 'date':
                    return new Date(value);
                default:
                    return value;
            }
        } catch (error) {
            console.error('Safe transform error:', error);
            return null;
        }
    }
}

// Global InputValidator instance oluştur
window.InputValidator = InputValidator;

// Global fonksiyonlar
window.validateEmail = (email) => InputValidator.validateEmail(email);
window.sanitizeString = (str) => InputValidator.sanitizeString(str);
window.sanitizeHTML = (html) => InputValidator.sanitizeHTML(html);
window.validateNumber = (num, min, max) => InputValidator.validateNumber(num, min, max);

console.log('✅ Input Validator module loaded successfully');
