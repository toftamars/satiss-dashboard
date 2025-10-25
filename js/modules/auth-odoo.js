/**
 * 🔐 Odoo Authentication Module
 * Odoo kullanıcı doğrulama ve session yönetimi
 * ✅ Direkt Odoo bağlantısı (Vercel kaldırıldı)
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
        
        // Sayfa yüklendiğinde session kontrolü yap
        this.checkSessionOnLoad();
    }

    /**
     * Sayfa yüklendiğinde session kontrolü
     */
    checkSessionOnLoad() {
        try {
            console.log('🔍 Session kontrolü başlatılıyor...');
            console.log('🔍 Session key:', this.sessionKey);
            console.log('🔍 Session duration:', this.sessionDuration / 60000, 'dakika');
            
            const session = this.checkSession();
            console.log('🔍 Session sonucu:', session);
            
            if (session.valid) {
                console.log('✅ Geçerli session bulundu, dashboard açılıyor...');
                console.log(`⏰ Session süresi: ${session.remainingTime} dakika kaldı`);
                
                // Kullanıcı bilgisini göster
                this.updateUserInfo(session.user);
                
                // Dashboard'ı göster
                this.showDashboard();
                
                return true;
            } else {
                console.log('❌ Geçerli session yok, login gerekli');
                console.log('❌ Session neden geçersiz:', session);
                this.showLoginForm();
                return false;
            }
        } catch (error) {
            console.error('❌ Session kontrol hatası:', error);
            this.showLoginForm();
            return false;
        }
    }
    
    /**
     * Kullanıcı bilgisini güncelle
     */
    updateUserInfo(user) {
        const currentUserName = document.getElementById('currentUserName');
        
        if (currentUserName && user) {
            currentUserName.textContent = user.name || user.username || user.email || 'Kullanıcı';
            console.log('✅ Kullanıcı bilgisi güncellendi:', user.name || user.username || user.email);
        }
    }
    
    /**
     * Dashboard'ı göster
     */
    showDashboard() {
        const authForm = document.getElementById('authForm');
        const mainContainer = document.getElementById('mainContainer');
        
        if (authForm) authForm.style.display = 'none';
        if (mainContainer) mainContainer.style.display = 'block';
        
        // Dashboard'ı yükle
        if (typeof window.loadData === 'function') {
            console.log('🚀 loadData fonksiyonu çağrılıyor...');
            window.loadData();
        } else {
            console.log('⚠️ loadData fonksiyonu henüz yüklenmedi, 2 saniye bekleniyor...');
            setTimeout(() => {
                if (typeof window.loadData === 'function') {
                    console.log('🚀 loadData fonksiyonu çağrılıyor (gecikmeli)...');
                    window.loadData();
                } else {
                    console.error('❌ loadData fonksiyonu bulunamadı!');
                }
            }, 2000);
        }
    }
    
    /**
     * Login formunu göster
     */
    showLoginForm() {
        const authForm = document.getElementById('authForm');
        const mainContainer = document.getElementById('mainContainer');
        const userInfo = document.getElementById('userInfo');
        
        if (authForm) authForm.style.display = 'flex';
        if (mainContainer) mainContainer.style.display = 'none';
        if (userInfo) userInfo.style.display = 'none';
    }

    /**
     * Odoo ile login (2FA destekli)
     */
    async login(username, password, totpCode = null) {
        try {
            if (!username || !password) {
                throw new Error('Kullanıcı adı ve şifre gerekli');
            }

            // Rate limiting kontrolü
            const now = Date.now();
            const lastAttempt = localStorage.getItem('lastLoginAttempt');
            const attemptCount = parseInt(localStorage.getItem('loginAttemptCount') || '0');
            
            if (lastAttempt && (now - parseInt(lastAttempt)) < 5000) { // 5 saniye bekle
                throw new Error('Çok hızlı deneme yapıyorsunuz. 5 saniye bekleyin.');
            }
            
            if (attemptCount >= 3) {
                throw new Error('Çok fazla deneme yapıldı. 10 dakika bekleyin.');
            }

            console.log('🔐 Odoo login başlatılıyor...');
            console.log('URL:', this.odooUrl);
            console.log('DB:', this.odooDb);
            console.log('Username:', username);

            // ✅ Direkt Odoo API'ye istek (Vercel kaldırıldı)
            const authPayload = {
                jsonrpc: '2.0',
                method: 'call',
                params: {
                    db: this.odooDb,
                    login: username,
                    password: password,
                    totp_token: totpCode // Odoo 2FA field
                },
                id: 1
            };

            console.log('📡 Odoo\'ya direkt istek atılıyor...');
            
            const response = await fetch(`${this.odooUrl}/web/session/authenticate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(authPayload),
                credentials: 'include' // Cookie desteği
            });

            if (!response.ok) {
                console.error('❌ Odoo HTTP hatası:', response.status);
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('📡 Odoo response:', JSON.stringify(result).substring(0, 200));

            // Odoo response kontrolü
            if (result.result && result.result.uid) {
                const userId = result.result.uid;
                const userName = result.result.name || username;
                const sessionId = result.result.session_id;
                
                console.log('✅ Odoo authentication başarılı!');
                console.log('User ID:', userId);
                console.log('User Name:', userName);
                console.log('Session ID:', sessionId);

                // Başarılı login - attempt count sıfırla
                localStorage.setItem('lastLoginAttempt', now.toString());
                localStorage.setItem('loginAttemptCount', '0');

                // Session kaydet
                this.saveSession({
                    token: sessionId, // Odoo session_id kullan
                    user: {
                        id: userId,
                        name: userName,
                        username: username,
                        email: username
                    },
                    loginTime: now
                });

                return {
                    success: true,
                    user: {
                        id: userId,
                        name: userName,
                        username: username
                    }
                };
            } else {
                // Başarısız login - attempt count artır
                localStorage.setItem('lastLoginAttempt', now.toString());
                localStorage.setItem('loginAttemptCount', (attemptCount + 1).toString());
                
                const errorMsg = result.error?.data?.message || result.error?.message || 'Geçersiz kullanıcı adı, şifre veya 2FA kodu';
                console.error('❌ Odoo authentication başarısız:', errorMsg);
                throw new Error(errorMsg);
            }

        } catch (error) {
            console.error('❌ Odoo login hatası:', error);
            throw error;
        }
    }

    /**
     * Session kaydet (DUPLICATE REMOVED - SORUN 3 ÇÖZÜLDÜ)
     */
    saveSession(sessionData) {
        try {
            const session = {
                ...sessionData,
                timestamp: Date.now()
            };
            
            console.log('🔍 Session kaydediliyor:', session);
            
            sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
            sessionStorage.setItem('userId', sessionData.user.id);
            sessionStorage.setItem('userName', sessionData.user.name);
            sessionStorage.setItem('userEmail', sessionData.user.email || sessionData.user.username);
            sessionStorage.setItem('authToken', sessionData.token);
            
            console.log('✅ Session kaydedildi:', sessionData.user.name);
            console.log('✅ Session key:', this.sessionKey);
            console.log('✅ Session data:', JSON.stringify(session));
        } catch (error) {
            console.error('❌ Session kaydetme hatası:', error);
        }
    }

    /**
     * Session kontrolü
     */
    checkSession() {
        try {
            console.log('🔍 Session kontrolü yapılıyor...');
            console.log('🔍 Session key:', this.sessionKey);
            console.log('🔍 Session duration:', this.sessionDuration / 60000, 'dakika');
            
            const sessionData = sessionStorage.getItem(this.sessionKey);
            console.log('🔍 Session data:', sessionData);
            
            if (!sessionData) {
                console.log('❌ Session data yok - sessionStorage boş');
                console.log('🔍 Tüm sessionStorage:', sessionStorage);
                return { valid: false };
            }

            const session = JSON.parse(sessionData);
            console.log('🔍 Parsed session:', session);
            
            const timeDiff = Date.now() - session.timestamp;
            console.log('🔍 Time diff:', timeDiff, 'ms');
            console.log('🔍 Session duration:', this.sessionDuration, 'ms');
            console.log('🔍 Time diff < session duration:', timeDiff < this.sessionDuration);
            console.log('🔍 Time diff dakika:', Math.round(timeDiff / 60000));
            console.log('🔍 Session duration dakika:', Math.round(this.sessionDuration / 60000));

            if (timeDiff < this.sessionDuration) {
                // Session geçerli
                const remainingTime = Math.round((this.sessionDuration - timeDiff) / 60000);
                console.log(`✅ Geçerli session, kalan: ${remainingTime} dakika`);
                console.log(`⏰ Session süresi: ${this.sessionDuration / 60000} dakika (120 dakika)`);

                return {
                    valid: true,
                    user: session.user,
                    remainingTime: remainingTime
                };
            } else {
                // Session süresi dolmuş
                console.log('⏰ Session süresi dolmuş (120 dakika)');
                console.log('⏰ Time diff:', timeDiff, 'ms > Session duration:', this.sessionDuration, 'ms');
                console.log('⏰ Time diff dakika:', Math.round(timeDiff / 60000));
                console.log('⏰ Session duration dakika:', Math.round(this.sessionDuration / 60000));
                this.logout();
                return { valid: false };
            }
        } catch (error) {
            console.error('❌ Session kontrol hatası:', error);
            return { valid: false };
        }
    }

    /**
     * Logout
     */
    logout() {
        sessionStorage.clear();
        console.log('🚪 Logout yapıldı');
        
        // Kullanıcı bilgisini gizle
        const userInfo = document.getElementById('userInfo');
        if (userInfo) {
            userInfo.style.display = 'none';
        }
        
        // Login formunu göster
        if (window.LoginUI) {
            window.LoginUI.show();
        }
        
        // Ana container'ı gizle
        const mainContainer = document.getElementById('mainContainer');
        if (mainContainer) {
            mainContainer.style.display = 'none';
        }
        
        console.log('🔄 Login ekranına yönlendiriliyor...');
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

