/**
 * 🚦 Rate Limiter Module
 * API çağrılarını ve kullanıcı isteklerini sınırlandırır
 */

class RateLimiter {
    constructor(maxRequests = 100, timeWindow = 60000) {
        this.maxRequests = maxRequests;
        this.timeWindow = timeWindow;
        this.requests = new Map();
        this.globalRequests = [];
        this.init();
    }

    /**
     * Rate limiter'ı başlat
     */
    init() {
        console.log('🚦 RateLimiter initialized');
        this.startCleanup();
    }

    /**
     * İstek yapılabilir mi kontrol et
     */
    canMakeRequest(identifier = 'global') {
        const now = Date.now();
        
        // Identifier için istek listesi
        if (!this.requests.has(identifier)) {
            this.requests.set(identifier, []);
        }
        
        const userRequests = this.requests.get(identifier);
        
        // Eski istekleri temizle
        const validRequests = userRequests.filter(
            time => now - time < this.timeWindow
        );
        
        this.requests.set(identifier, validRequests);
        
        // Limit kontrolü
        if (validRequests.length >= this.maxRequests) {
            console.warn(`⚠️ Rate limit aşıldı: ${identifier}`);
            return false;
        }
        
        // Yeni isteği ekle
        validRequests.push(now);
        this.requests.set(identifier, validRequests);
        
        return true;
    }

    /**
     * Global rate limit kontrolü
     */
    canMakeGlobalRequest() {
        const now = Date.now();
        
        // Eski istekleri temizle
        this.globalRequests = this.globalRequests.filter(
            time => now - time < this.timeWindow
        );
        
        // Limit kontrolü (global için daha yüksek limit)
        if (this.globalRequests.length >= this.maxRequests * 10) {
            console.warn('⚠️ Global rate limit aşıldı');
            return false;
        }
        
        this.globalRequests.push(now);
        return true;
    }

    /**
     * Kalan istek sayısını al
     */
    getRemainingRequests(identifier = 'global') {
        const now = Date.now();
        
        if (!this.requests.has(identifier)) {
            return this.maxRequests;
        }
        
        const userRequests = this.requests.get(identifier);
        const validRequests = userRequests.filter(
            time => now - time < this.timeWindow
        );
        
        return Math.max(0, this.maxRequests - validRequests.length);
    }

    /**
     * Rate limit sıfırlanma süresini al
     */
    getResetTime(identifier = 'global') {
        if (!this.requests.has(identifier)) {
            return 0;
        }
        
        const userRequests = this.requests.get(identifier);
        if (userRequests.length === 0) {
            return 0;
        }
        
        const oldestRequest = Math.min(...userRequests);
        const resetTime = oldestRequest + this.timeWindow;
        
        return Math.max(0, resetTime - Date.now());
    }

    /**
     * Rate limit istatistikleri
     */
    getStats() {
        const stats = {
            totalUsers: this.requests.size,
            globalRequests: this.globalRequests.length,
            maxRequests: this.maxRequests,
            timeWindow: this.timeWindow,
            users: {}
        };
        
        for (const [identifier, requests] of this.requests) {
            const now = Date.now();
            const validRequests = requests.filter(
                time => now - time < this.timeWindow
            );
            
            stats.users[identifier] = {
                requests: validRequests.length,
                remaining: this.maxRequests - validRequests.length,
                resetIn: this.getResetTime(identifier)
            };
        }
        
        return stats;
    }

    /**
     * Otomatik temizlik başlat
     */
    startCleanup() {
        setInterval(() => {
            const now = Date.now();
            
            // Eski kullanıcıları temizle
            for (const [identifier, requests] of this.requests) {
                const validRequests = requests.filter(
                    time => now - time < this.timeWindow
                );
                
                if (validRequests.length === 0) {
                    this.requests.delete(identifier);
                } else {
                    this.requests.set(identifier, validRequests);
                }
            }
            
            // Global istekleri temizle
            this.globalRequests = this.globalRequests.filter(
                time => now - time < this.timeWindow
            );
            
        }, this.timeWindow);
    }

    /**
     * Belirli bir identifier'ı sıfırla
     */
    reset(identifier) {
        this.requests.delete(identifier);
        console.log(`🔄 Rate limiter sıfırlandı: ${identifier}`);
    }

    /**
     * Tüm rate limiter'ı sıfırla
     */
    resetAll() {
        this.requests.clear();
        this.globalRequests = [];
        console.log('🔄 Tüm rate limiter sıfırlandı');
    }

    /**
     * Rate limit aşıldı mesajı
     */
    getRateLimitMessage(identifier = 'global') {
        const resetTime = this.getResetTime(identifier);
        const minutes = Math.ceil(resetTime / 60000);
        
        return `⚠️ Çok fazla istek gönderdiniz. Lütfen ${minutes} dakika sonra tekrar deneyin.`;
    }
}

// Global RateLimiter instance oluştur
window.RateLimiter = new RateLimiter(100, 60000); // 100 istek / dakika

// Global fonksiyonlar
window.canMakeRequest = (identifier) => window.RateLimiter.canMakeRequest(identifier);
window.getRateLimitStats = () => window.RateLimiter.getStats();

console.log('🚦 Rate Limiter module loaded successfully');
