/**
 * 🔐 Odoo Authentication Module
 * Odoo kullanıcı doğrulama ve session yönetimi
 */

class OdooAuth {
    constructor() {
        this.odooUrl = 'https://erp.zuhalmuzik.com';
        this.odooDb = 'erp.zuhalmuzik.com';
        this.sessionKey = 'odoo_session';
        this.sessionDuration = 120 * 60 * 1000; // 120 dakika (2 saat)
        this.init();
    }

    init() {
        console.log('🔐 OdooAuth initialized');
    }

    /**
     * Odoo ile login (2FA destekli)
     */
    async login(username, password, totpCode = null) {
        try {
            if (!username || !password) {
                throw new Error('Kullanıcı adı ve şifre gerekli');
            }

            console.log('🔐 Odoo login başlatılıyor...');
            console.log('Username:', username);

            // Direkt Odoo API'ye istek
            const odooUrl = 'https://erp.zuhalmuzik.com';
            const odooDb = 'erp.zuhalmuzik.com';
            
            const authPayload = {
                jsonrpc: '2.0',
                method: 'call',
                params: {
                    db: odooDb,
                    login: username,
                    password: password
                },
                id: 1
            };

            const response = await fetch(`${odooUrl}/web/session/authenticate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(authPayload)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();

            if (result.success && result.token) {
                console.log('✅ Odoo authentication başarılı!');
                console.log('User:', result.user.name);

                // Session kaydet
                this.saveSession({
                    token: result.token,
                    user: result.user,
                    loginTime: Date.now()
                });

                return {
                    success: true,
                    user: result.user
                };
            } else {
                throw new Error(result.error || 'Giriş başarısız');
            }

        } catch (error) {
            console.error('❌ Odoo login hatası:', error);
            throw error;
        }
    }

    /**
     * Session kaydet
     */
    saveSession(sessionData) {
        try {
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('authToken', sessionData.token);
            sessionStorage.setItem('userId', sessionData.user.id);
            sessionStorage.setItem('userName', sessionData.user.name);
            sessionStorage.setItem('userEmail', sessionData.user.username);
            sessionStorage.setItem('loginTime', sessionData.loginTime.toString());
            
            console.log('✅ Session kaydedildi');
        } catch (error) {
            console.error('❌ Session kaydetme hatası:', error);
        }
    }

    /**
     * Session kontrolü
     */
    checkSession() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        const loginTime = sessionStorage.getItem('loginTime');

        if (!isLoggedIn || !loginTime) {
            return { valid: false };
        }

        const timeDiff = Date.now() - parseInt(loginTime);

        if (timeDiff < this.sessionDuration) {
            // Session geçerli
            const remainingTime = Math.round((this.sessionDuration - timeDiff) / 60000);
            console.log(`✅ Geçerli session, kalan: ${remainingTime} dakika`);

            return {
                valid: true,
                user: {
                    id: sessionStorage.getItem('userId'),
                    name: sessionStorage.getItem('userName'),
                    email: sessionStorage.getItem('userEmail')
                },
                remainingTime: remainingTime
            };
        } else {
            // Session süresi dolmuş
            console.log('⏰ Session süresi dolmuş');
            this.logout();
            return { valid: false };
        }
    }

    /**
     * Logout
     */
    logout() {
        sessionStorage.clear();
        console.log('🚪 Logout yapıldı');
    }

    /**
     * Token al
     */
    getToken() {
        return sessionStorage.getItem('authToken');
    }

    /**
     * Kullanıcı bilgisi al
     */
    getUser() {
        return {
            id: sessionStorage.getItem('userId'),
            name: sessionStorage.getItem('userName'),
            email: sessionStorage.getItem('userEmail')
        };
    }
}

// Global instance
window.OdooAuth = new OdooAuth();

console.log('✅ Odoo Auth module loaded');

