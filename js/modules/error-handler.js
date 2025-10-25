/**
 * Global Error Handler Module
 * Tüm hataları yakalar ve kullanıcıya bildirir
 */

class ErrorHandler {
    constructor() {
        this.errors = [];
        this.maxErrors = 50;
        this.isInitialized = false;
    }
    
    /**
     * Error handler'ı başlat
     */
    init() {
        if (this.isInitialized) {
            return;
        }
        
        this.setupGlobalHandlers();
        this.addStyles();
        this.isInitialized = true;
        console.log('✅ Error Handler başlatıldı');
    }
    
    /**
     * Global error handler'ları kur
     */
    setupGlobalHandlers() {
        // Uncaught errors
        window.addEventListener('error', (event) => {
            this.handleError({
                type: 'error',
                message: event.message,
                source: event.filename,
                line: event.lineno,
                column: event.colno,
                error: event.error,
                stack: event.error?.stack
            });
            
            // Prevent default browser error handling
            event.preventDefault();
        });
        
        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError({
                type: 'promise',
                message: 'Unhandled Promise Rejection',
                reason: event.reason,
                error: event.reason,
                stack: event.reason?.stack
            });
            
            // Prevent default browser error handling
            event.preventDefault();
        });
        
        // Console error override (optional)
        const originalError = console.error;
        console.error = (...args) => {
            originalError.apply(console, args);
            
            // Log critical errors
            if (args[0]?.includes?.('CRITICAL') || args[0]?.includes?.('FATAL')) {
                this.handleError({
                    type: 'console',
                    message: args.join(' '),
                    timestamp: new Date().toISOString()
                });
            }
        };
    }
    
    /**
     * Hatayı işle
     * @param {Object} errorInfo - Hata bilgisi
     */
    handleError(errorInfo) {
        const error = {
            ...errorInfo,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        // Store error
        this.errors.push(error);
        
        // Limit stored errors
        if (this.errors.length > this.maxErrors) {
            this.errors.shift();
        }
        
        // Log to console
        console.error('🔴 Global Error:', error);
        
        // Show user-friendly message
        this.showErrorToUser(this.getUserFriendlyMessage(error));
        
        // Optional: Send to monitoring service
        // this.sendToMonitoring(error);
    }
    
    /**
     * Kullanıcı dostu hata mesajı oluştur
     * @param {Object} error - Hata
     * @returns {string}
     */
    getUserFriendlyMessage(error) {
        // Network errors
        if (error.message?.includes?.('fetch') || error.message?.includes?.('network')) {
            return 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.';
        }
        
        // Data loading errors
        if (error.message?.includes?.('data') || error.message?.includes?.('load')) {
            return 'Veri yüklenirken hata oluştu. Lütfen sayfayı yenileyin.';
        }
        
        // Chart errors
        if (error.message?.includes?.('chart') || error.message?.includes?.('Chart')) {
            return 'Grafik oluşturulurken hata oluştu.';
        }
        
        // Generic error
        return 'Bir hata oluştu. Lütfen sayfayı yenileyin veya destek ekibiyle iletişime geçin.';
    }
    
    /**
     * Kullanıcıya hata göster
     * @param {string} message - Mesaj
     */
    showErrorToUser(message) {
        // Check if toast already exists
        const existingToast = document.querySelector('.error-toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-toast';
        errorDiv.innerHTML = `
            <div class="error-toast-content">
                <span class="error-toast-icon">⚠️</span>
                <span class="error-toast-message">${message}</span>
                <button class="error-toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => errorDiv.remove(), 300);
            }
        }, 5000);
    }
    
    /**
     * CSS stillerini ekle
     */
    addStyles() {
        if (document.getElementById('error-handler-styles')) {
            return;
        }
        
        const style = document.createElement('style');
        style.id = 'error-handler-styles';
        style.textContent = `
            .error-toast {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #f44336 0%, #e53935 100%);
                color: white;
                padding: 0;
                border-radius: 12px;
                box-shadow: 0 8px 24px rgba(244, 67, 54, 0.3);
                z-index: 10000;
                animation: slideIn 0.3s ease-out;
                max-width: 400px;
                min-width: 300px;
            }
            
            .error-toast-content {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px 20px;
            }
            
            .error-toast-icon {
                font-size: 24px;
                flex-shrink: 0;
            }
            
            .error-toast-message {
                flex: 1;
                font-size: 14px;
                line-height: 1.5;
            }
            
            .error-toast-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                font-size: 24px;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s;
                flex-shrink: 0;
            }
            
            .error-toast-close:hover {
                background: rgba(255, 255, 255, 0.3);
            }
            
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
            
            @media (max-width: 768px) {
                .error-toast {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    max-width: none;
                    min-width: 0;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    /**
     * Tüm hataları getir
     * @returns {Array}
     */
    getErrors() {
        return [...this.errors];
    }
    
    /**
     * Hataları temizle
     */
    clearErrors() {
        this.errors = [];
    }
    
    /**
     * Son N hatayı getir
     * @param {number} count - Hata sayısı
     * @returns {Array}
     */
    getRecentErrors(count = 10) {
        return this.errors.slice(-count);
    }
}

// Singleton instance
export const errorHandler = new ErrorHandler();

// Auto-initialize
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => errorHandler.init());
    } else {
        errorHandler.init();
    }
}

console.log('✅ Error Handler modülü yüklendi');
