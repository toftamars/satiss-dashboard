// ==================== AUTHENTICATION MODULE ====================
// Dashboard authentication ve user management

// ===== CRITICAL FUNCTIONS - EARLY DEFINITION =====
window.showDashboardAfterAuth = function(user) {
    console.log('🚀 showDashboardAfterAuth çağrıldı');
    const loadingScreen = document.getElementById('loadingScreen');
    const mainContainer = document.getElementById('mainContainer');
    
    // Loading ekranı ve main container'ı koru - checkLoadingComplete() kontrol edecek
    // Loading ekranı tüm veriler yüklenene kadar açık kalacak
    
    // Kullanıcı bilgilerini güncelle
    if (user) {
        window.updateUserInfo(user);
    }
    
    // Dashboard'ı yükle - loadData fonksiyonu zaten sayfa yüklendiğinde çalışacak
    console.log('✅ Dashboard başlatıldı, loadData fonksiyonu sayfa yüklendiğinde çalışacak');
};

window.updateUserInfo = function(user) {
    const userNameElement = document.getElementById('currentUserName');
    const userInfoElement = document.getElementById('userInfo');
    const userTypeElement = document.getElementById('userType');
    
    if (userNameElement) {
        userNameElement.textContent = user.name || user.email?.split('@')[0] || 'Kullanıcı';
    }
    
    if (userInfoElement) {
        userInfoElement.textContent = user.name || user.email?.split('@')[0] || 'Kullanıcı';
    }
    
    if (userTypeElement) {
        userTypeElement.textContent = '👤 Kullanıcı';
    }
};

window.logout = function() {
    // Session ve local storage'ı temizle
    sessionStorage.clear();
    localStorage.clear();
    
    // Sayfayı yenile
    location.reload();
    
    console.log('✅ Çıkış yapıldı, sayfa yenileniyor');
};

// Sayfa yüklendiğinde direkt dashboard aç
window.initAuth = function() {
    console.log('🚀 Dashboard direkt açılıyor...');
    
    // Mock user data
    const user = {
        email: 'demo@zuhalmuzik.com',
        name: 'Demo Kullanıcı'
    };
    
    // Session bilgilerini ayarla
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('loginTime', Date.now().toString());
    sessionStorage.setItem('userEmail', user.email);
    sessionStorage.setItem('username', user.name);
    sessionStorage.setItem('otpVerified', 'true');
    sessionStorage.setItem('sessionExpiry', (Date.now() + 24 * 60 * 60 * 1000).toString());
    
    // Dashboard'ı başlat
    setTimeout(() => {
        console.log('🚀 Dashboard başlatılıyor...');
        window.showDashboardAfterAuth(user);
    }, 100);
};

console.log('✅ Auth module loaded');

