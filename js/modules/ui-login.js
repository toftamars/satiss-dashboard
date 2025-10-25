/**
 * 🎨 Login UI Module
 * Login formu ve UI yönetimi
 */

class LoginUI {
    constructor() {
        this.authForm = null;
        this.usernameInput = null;
        this.passwordInput = null;
        this.loginBtn = null;
        this.errorDiv = null;
        this.init();
    }

    init() {
        console.log('🎨 LoginUI initialized');
        
        // DOM elementlerini bul
        this.authForm = document.getElementById('authForm');
        this.usernameInput = document.getElementById('odooUsername');
        this.passwordInput = document.getElementById('odooPassword');
        this.loginBtn = document.getElementById('authLoginBtn');
        this.errorDiv = document.getElementById('authError');
    }

    /**
     * Login formunu göster
     */
    show() {
        if (this.authForm) {
            this.authForm.style.display = 'flex';
            console.log('🔐 Login formu gösteriliyor');
            
            // Focus username input
            setTimeout(() => {
                if (this.usernameInput) {
                    this.usernameInput.focus();
                }
            }, 100);
        }
    }

    /**
     * Login formunu gizle
     */
    hide() {
        if (this.authForm) {
            this.authForm.style.display = 'none';
            console.log('✅ Login formu gizlendi');
        }
    }

    /**
     * Loading durumu göster
     */
    showLoading() {
        if (this.loginBtn) {
            this.loginBtn.textContent = '⏳ Giriş yapılıyor...';
            this.loginBtn.disabled = true;
        }
    }

    /**
     * Loading durumunu kaldır
     */
    hideLoading() {
        if (this.loginBtn) {
            this.loginBtn.textContent = '🔓 Giriş Yap';
            this.loginBtn.disabled = false;
        }
    }

    /**
     * Hata mesajı göster
     */
    showError(message) {
        if (this.errorDiv) {
            this.errorDiv.textContent = message;
            this.errorDiv.style.display = 'block';
            this.errorDiv.style.background = '#fee';
            this.errorDiv.style.color = '#c33';
        }
        this.hideLoading();
    }

    /**
     * Başarı mesajı göster
     */
    showSuccess(message) {
        if (this.errorDiv) {
            this.errorDiv.textContent = message;
            this.errorDiv.style.display = 'block';
            this.errorDiv.style.background = '#efe';
            this.errorDiv.style.color = '#3c3';
        }
    }

    /**
     * Hata mesajını temizle
     */
    clearError() {
        if (this.errorDiv) {
            this.errorDiv.style.display = 'none';
        }
    }

    /**
     * Form değerlerini al
     */
    getCredentials() {
        return {
            username: this.usernameInput?.value.trim() || '',
            password: this.passwordInput?.value || '',
            totp: document.getElementById('odooTotp')?.value.trim() || ''
        };
    }

    /**
     * Form değerlerini temizle
     */
    clearForm() {
        if (this.usernameInput) this.usernameInput.value = '';
        if (this.passwordInput) this.passwordInput.value = '';
        if (document.getElementById('odooTotp')) document.getElementById('odooTotp').value = '';
        this.clearError();
    }

    /**
     * Login işlemini başlat
     */
    async handleLogin() {
        try {
            this.clearError();
            this.showLoading();

            const { username, password, totp } = this.getCredentials();

            if (!username || !password) {
                this.showError('❌ Kullanıcı adı ve şifre gerekli');
                return;
            }
            
            if (!totp || totp.length !== 6) {
                this.showError('❌ 6 haneli 2FA kodu gerekli');
                return;
            }

            // OdooAuth ile login (2FA ile)
            const result = await window.OdooAuth.login(username, password, totp);

            if (result.success) {
                this.showSuccess('✅ Giriş başarılı! Yönlendiriliyorsunuz...');
                this.clearForm();
                
                // Dashboard'ı göster
                setTimeout(() => {
                    this.hide();
                    if (window.showDashboardAfterAuth) {
                        window.showDashboardAfterAuth(result.user);
                    }
                }, 1000);
            }

        } catch (error) {
            console.error('❌ Login hatası:', error);
            this.showError(error.message || 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.');
        }
    }
}

// Global instance
window.LoginUI = new LoginUI();

// Global fonksiyon (eski kod uyumluluğu için)
window.odooLogin = function(username, password) {
    window.LoginUI.handleLogin();
};

console.log('✅ Login UI module loaded');

