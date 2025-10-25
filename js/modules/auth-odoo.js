/**
 * 🔐 Odoo Authentication Module
 * Odoo kullanıcı doğrulama ve session yönetimi
 */

class OdooAuth {
    constructor() {
        this.apiUrl = 'https://your-project.vercel.app/api/odoo-login'; // Vercel deploy sonrası güncellenecek
        this.sessionKey = 'odoo_session';
        this.sessionDuration = 60 * 60 * 1000; // 1 saat
        this.init();
    }

    init() {
        console.log('🔐 OdooAuth initialized');
    }

    /**
     * Odoo ile login
     */
    async login(username, password) {
        try {
            if (!username || !password) {
                throw new Error('Kullanıcı adı ve şifre gerekli');
            }

            console.log('🔐 Odoo login başlatılıyor...');
            console.log('Username:', username);

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ 
                    username: username, 
                    password: password 
                })
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

