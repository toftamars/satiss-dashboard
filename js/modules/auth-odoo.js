/**
 * 🔐 Odoo Authentication Module
 * Odoo kullanıcı doğrulama ve session yönetimi
 */

class OdooAuth {
    constructor() {
        this.apiUrl = 'https://zuhal-mu.vercel.app/api/odoo-login';
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

            // Vercel API üzerinden Odoo'ya istek (CORS çözümü)
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password,
                    totp: totpCode
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('📡 Vercel API response:', result);

            // Vercel API response formatı: { success, token, user }
            if (result.success && result.token) {
                const sessionId = result.token;
                const userId = result.user.id;
                const userName = result.user.name || username;

                console.log('✅ Odoo authentication başarılı!');
                console.log('User ID:', userId);
                console.log('User Name:', userName);

                // Session kaydet
                this.saveSession({
                    token: sessionId,
                    user: {
                        id: userId,
                        name: userName,
                        username: username
                    },
                    loginTime: Date.now()
                });

                return {
                    success: true,
                    user: {
                        id: userId,
                        name: userName,
                        username: username
                    }
                };
            } else if (result.error) {
                throw new Error(result.error.data?.message || result.error.message || 'Giriş başarısız');
            } else {
                throw new Error('Giriş başarısız - Geçersiz yanıt');
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

