// ==================== INITIALIZATION MODULE ====================
// Sayfa başlatma, event listeners, DOMContentLoaded

// Sayfa yüklendiğinde çalışacak fonksiyon
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Content Loaded');
    
    // Auth başlat
    if (typeof window.initAuth === 'function') {
        window.initAuth();
    }
    
    // Loading başlat
    if (typeof window.startRealLoading === 'function') {
        window.startRealLoading();
    }
    
    // UI başlat
    if (typeof window.initMobileTableScrollHint === 'function') {
        window.initMobileTableScrollHint();
    }
    
    // Kullanıcı bilgilerini güncelle
    const username = sessionStorage.getItem('username');
    const currentUserNameElement = document.getElementById('currentUserName');
    if (username && currentUserNameElement) {
        currentUserNameElement.textContent = username.charAt(0).toUpperCase() + username.slice(1);
    }
    
    // Tab değişimlerinde mobile scroll hint'i güncelle
    const observer = new MutationObserver(function() {
        if (typeof window.initMobileTableScrollHint === 'function') {
            window.initMobileTableScrollHint();
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Oturum süresi kontrolü (her 5 dakikada bir)
    setInterval(function() {
        const session = localStorage.getItem('session');
        if (session) {
            try {
                const sessionData = JSON.parse(session);
                if (new Date().getTime() > sessionData.expiry) {
                    alert('Oturum süreniz doldu. Lütfen tekrar giriş yapın.');
                    if (typeof window.logout === 'function') {
                        window.logout();
                    }
                }
            } catch (error) {
                console.error('Session kontrolü hatası:', error);
            }
        }
    }, 5 * 60 * 1000); // Her 5 dakikada bir kontrol et
    
    console.log('✅ Initialization complete');
});

console.log('✅ Init module loaded');

