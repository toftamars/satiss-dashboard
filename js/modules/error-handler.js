/**
 * 🚨 Error Handler Module
 * Global error handling ve user-friendly error messages
 */

class ErrorHandler {
    constructor() {
        this.errors = [];
        this.maxErrors = 100;
        this.init();
    }

    /**
     * Error handler'ı başlat
     */
    init() {
        console.log('🚨 ErrorHandler initialized');
        this.setupGlobalHandlers();
    }

    /**
     * Global error handler'ları kur
     */
    setupGlobalHandlers() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.handleError(event.error || event.message, {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, {
                type: 'unhandled_promise_rejection'
            });
        });

        // Console error override
        const originalError = console.error;
        console.error = (...args) => {
            this.logError('console_error', args);
            originalError.apply(console, args);
        };
    }

    /**
     * Hata işle
     */
    handleError(error, context = {}) {
        const errorInfo = this.parseError(error, context);
        
        // Hatayı kaydet
        this.logError(errorInfo.type, errorInfo);
        
        // Kullanıcıya göster
        this.showUserError(errorInfo);
        
        // External service'e gönder (Sentry, vb.)
        this.reportError(errorInfo);
        
        return errorInfo;
    }

    /**
     * Hatayı parse et
     */
    parseError(error, context = {}) {
        const errorInfo = {
            timestamp: new Date().toISOString(),
            type: 'unknown',
            message: 'Bilinmeyen bir hata oluştu',
            stack: null,
            context: context,
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        if (error instanceof Error) {
            errorInfo.type = error.name;
            errorInfo.message = error.message;
            errorInfo.stack = error.stack;
        } else if (typeof error === 'string') {
            errorInfo.message = error;
        } else if (typeof error === 'object') {
            errorInfo.message = JSON.stringify(error);
        }

        return errorInfo;
    }

    /**
     * Hatayı logla
     */
    logError(type, errorInfo) {
        this.errors.push({
            type,
            errorInfo,
            timestamp: Date.now()
        });

        // Max error limitini kontrol et
        if (this.errors.length > this.maxErrors) {
            this.errors.shift();
        }

        console.error('🚨 Error logged:', type, errorInfo);
    }

    /**
     * Kullanıcıya hata göster
     */
    showUserError(errorInfo) {
        const userMessage = this.getUserFriendlyMessage(errorInfo);
        
        // Toast notification göster
        this.showToast(userMessage, 'error');
    }

    /**
     * User-friendly mesaj oluştur
     */
    getUserFriendlyMessage(errorInfo) {
        const errorMessages = {
            'NetworkError': 'İnternet bağlantınızı kontrol edin',
            'TypeError': 'Bir veri hatası oluştu',
            'ReferenceError': 'Bir kaynak bulunamadı',
            'SyntaxError': 'Bir format hatası oluştu',
            'RangeError': 'Geçersiz bir değer girildi',
            'SecurityError': 'Güvenlik hatası oluştu',
            'TimeoutError': 'İşlem zaman aşımına uğradı',
            'AbortError': 'İşlem iptal edildi',
            'QuotaExceededError': 'Depolama alanı dolu',
            'NotFoundError': 'İstenen kaynak bulunamadı',
            'PermissionDeniedError': 'İzin reddedildi'
        };

        return errorMessages[errorInfo.type] || 'Bir hata oluştu. Lütfen tekrar deneyin.';
    }

    /**
     * Toast notification göster
     */
    showToast(message, type = 'info') {
        // Mevcut toast'ları temizle
        const existingToasts = document.querySelectorAll('.error-toast');
        existingToasts.forEach(toast => toast.remove());

        const toast = document.createElement('div');
        toast.className = `error-toast error-toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ff6b6b' : '#4ade80'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10001;
            animation: slideIn 0.3s ease;
            max-width: 400px;
            font-weight: 500;
        `;
        
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1.2em;">${type === 'error' ? '❌' : '✅'}</span>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 1.2em;
                    padding: 0;
                    margin-left: auto;
                ">×</button>
            </div>
        `;

        document.body.appendChild(toast);

        // 5 saniye sonra otomatik kaldır
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    /**
     * Hatayı external service'e gönder
     */
    reportError(errorInfo) {
        // Sentry entegrasyonu
        if (window.Sentry) {
            Sentry.captureException(errorInfo);
        }

        // Custom error reporting
        if (window.Config && window.Config.environment === 'production') {
            // Production'da error reporting API'sine gönder
            this.sendToErrorReportingService(errorInfo);
        }
    }

    /**
     * Error reporting service'e gönder
     */
    async sendToErrorReportingService(errorInfo) {
        try {
            // Rate limiting kontrolü
            if (window.RateLimiter && !window.RateLimiter.canMakeRequest('error_reporting')) {
                return;
            }

            // API endpoint'e gönder (örnek)
            // await fetch('/api/errors', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(errorInfo)
            // });
            
            console.log('📤 Error reported:', errorInfo);
        } catch (error) {
            console.error('Error reporting failed:', error);
        }
    }

    /**
     * Hata istatistikleri
     */
    getStats() {
        const stats = {
            totalErrors: this.errors.length,
            errorsByType: {},
            recentErrors: this.errors.slice(-10)
        };

        this.errors.forEach(error => {
            const type = error.type;
            stats.errorsByType[type] = (stats.errorsByType[type] || 0) + 1;
        });

        return stats;
    }

    /**
     * Hataları temizle
     */
    clearErrors() {
        this.errors = [];
        console.log('🗑️ Errors cleared');
    }

    /**
     * Specific error handler'lar
     */
    handleNetworkError(error) {
        return this.handleError(error, { type: 'network' });
    }

    handleAuthError(error) {
        return this.handleError(error, { type: 'authentication' });
    }

    handleDataError(error) {
        return this.handleError(error, { type: 'data' });
    }

    handleValidationError(error) {
        return this.handleError(error, { type: 'validation' });
    }
}

// Global ErrorHandler instance oluştur
window.ErrorHandler = new ErrorHandler();

// Global fonksiyonlar
window.handleError = (error, context) => window.ErrorHandler.handleError(error, context);
window.showToast = (message, type) => window.ErrorHandler.showToast(message, type);
window.getErrorStats = () => window.ErrorHandler.getStats();

// CSS animasyonları ekle
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('🚨 Error Handler module loaded successfully');
