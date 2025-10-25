/**
 * 🔐 Authentication Module
 * Kullanıcı girişi, çıkışı ve session yönetimi
 */

class AuthManager {
    constructor() {
        this.sessionDuration = 60 * 60 * 1000; // 1 saat (milisaniye)
        this.init();
    }

    /**
     * Authentication sistemini başlat
     */
    init() {
        this.checkSession();
        this.setupEventListeners();
    }

    /**
     * Mevcut session'ı kontrol et
     */
    checkSession() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        const loginTime = sessionStorage.getItem('loginTime');
        const userEmail = sessionStorage.getItem('userEmail');

        if (isLoggedIn === 'true' && loginTime && userEmail) {
            const now = Date.now();
            const sessionTime = parseInt(loginTime);
            const timeDiff = now - sessionTime;

            if (timeDiff < this.sessionDuration) {
                // Session hala geçerli
                this.showDashboard(userEmail);
                return true;
            } else {
                // Session süresi dolmuş
                this.logout();
                return false;
            }
        }

        // Session yok, giriş formunu göster
        this.showAuthForm();
        return false;
    }

    /**
     * Giriş formunu göster
     */
    showAuthForm() {
        // Tüm formları gizle
        this.hideAllForms();
        
        // Auth formunu göster
        const authForm = document.getElementById('authForm');
        if (authForm) {
            authForm.style.display = 'block';
        }

        // Main container'ı gizle
        const mainContainer = document.getElementById('mainContainer');
        if (mainContainer) {
            mainContainer.style.display = 'none';
        }
    }

    /**
     * OTP formunu göster
     */
    showOTPForm(email) {
        this.hideAllForms();
        
        const otpForm = document.getElementById('otpForm');
        const otpEmailDisplay = document.getElementById('otpEmailDisplay');
        
        if (otpForm) {
            otpForm.style.display = 'block';
        }
        
        if (otpEmailDisplay) {
            otpEmailDisplay.textContent = email;
        }
    }

    /**
     * Dashboard'ı göster
     */
    showDashboard(userEmail) {
        this.hideAllForms();
        
        // Main container'ı göster
        const mainContainer = document.getElementById('mainContainer');
        if (mainContainer) {
            mainContainer.style.display = 'block';
        }

        // Kullanıcı bilgilerini güncelle
        this.updateUserInfo(userEmail);

        // Veri yükleme işlemini başlat
        if (window.DataLoader) {
            window.DataLoader.loadAllData();
        }
    }

    /**
     * Kullanıcı bilgilerini güncelle
     */
    updateUserInfo(userEmail) {
        const userNameElement = document.getElementById('currentUserName');
        if (userNameElement && userEmail) {
            // Email'den kullanıcı adını çıkar
            const username = userEmail.split('@')[0];
            userNameElement.textContent = username.charAt(0).toUpperCase() + username.slice(1);
        }
    }

    /**
     * Tüm formları gizle
     */
    hideAllForms() {
        const forms = ['authForm', 'otpForm'];
        forms.forEach(formId => {
            const form = document.getElementById(formId);
            if (form) {
                form.style.display = 'none';
            }
        });
    }

    /**
     * Loading durumunu göster
     */
    showAuthLoading(message = 'İşlem yapılıyor...') {
        const loadingElement = document.getElementById('authLoading');
        if (loadingElement) {
            loadingElement.textContent = message;
            loadingElement.style.display = 'block';
        }
    }

    /**
     * Loading durumunu gizle
     */
    hideAuthLoading() {
        const loadingElement = document.getElementById('authLoading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }

    /**
     * Hata mesajını göster
     */
    showAuthError(message, type = 'error') {
        const errorElement = document.getElementById('authError');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.className = `auth-error ${type}`;
            errorElement.style.display = 'block';
            
            // 5 saniye sonra otomatik gizle
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 5000);
        }
    }

    /**
     * Başarı mesajını göster
     */
    showAuthSuccess(message) {
        this.showAuthError(message, 'success');
    }

    /**
     * Session oluştur
     */
    createSession(userEmail) {
        const now = Date.now();
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userEmail', userEmail);
        sessionStorage.setItem('loginTime', now.toString());
        
        console.log('✅ Session oluşturuldu:', userEmail);
    }

    /**
     * Çıkış yap
     */
    logout() {
        // Session ve local storage'ı temizle
        sessionStorage.clear();
        localStorage.clear();
        
        console.log('🚪 Çıkış yapıldı');
        
        // Giriş formunu göster
        this.showAuthForm();
    }

    /**
     * Event listener'ları kur
     */
    setupEventListeners() {
        // Çıkış butonu
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
                    this.logout();
                }
            });
        }

        // Sayfa kapatılırken session temizle
        window.addEventListener('beforeunload', () => {
            // Session'ı temizle (isteğe bağlı)
            // sessionStorage.clear();
        });
    }

    /**
     * Session süresini kontrol et
     */
    isSessionValid() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        const loginTime = sessionStorage.getItem('loginTime');
        
        if (isLoggedIn === 'true' && loginTime) {
            const now = Date.now();
            const sessionTime = parseInt(loginTime);
            const timeDiff = now - sessionTime;
            
            return timeDiff < this.sessionDuration;
        }
        
        return false;
    }

    /**
     * Kalan session süresini al
     */
    getRemainingSessionTime() {
        const loginTime = sessionStorage.getItem('loginTime');
        if (loginTime) {
            const now = Date.now();
            const sessionTime = parseInt(loginTime);
            const timeDiff = now - sessionTime;
            const remaining = this.sessionDuration - timeDiff;
            
            return Math.max(0, remaining);
        }
        
        return 0;
    }
}

// Global AuthManager instance oluştur
window.AuthManager = new AuthManager();

// Global fonksiyonlar (geriye uyumluluk için)
window.logout = () => window.AuthManager.logout();
window.showAuthForm = () => window.AuthManager.showAuthForm();
window.showOTPForm = (email) => window.AuthManager.showOTPForm(email);
window.showDashboard = (userEmail) => window.AuthManager.showDashboard(userEmail);
window.updateUserInfo = (userEmail) => window.AuthManager.updateUserInfo(userEmail);
window.showAuthLoading = (message) => window.AuthManager.showAuthLoading(message);
window.showAuthError = (message, type) => window.AuthManager.showAuthError(message, type);
window.showAuthSuccess = (message) => window.AuthManager.showAuthSuccess(message);

console.log('🔐 Auth module loaded successfully');