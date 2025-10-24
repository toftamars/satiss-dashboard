// ==================== UI MODULE ====================
// UI yönetimi, tab switching, sidebar, vb.

// Aktif tab'ı yönet
window.showTab = function(tabId, element) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => {
        tab.style.display = 'none';
    });
    const tabElement = document.getElementById(tabId);
    if (tabElement) {
        tabElement.style.display = 'block';
    }
    
    const navLinks = document.querySelectorAll('.sidebar-menu ul li a');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    if (element) {
        element.classList.add('active');
    }
};

// Sidebar toggle
window.toggleSidebar = function() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    if (sidebar) sidebar.classList.toggle('hidden');
    if (mainContent) mainContent.classList.toggle('full-width');
};

// Tarih aralığını güncelle
window.updateDateRange = function(startDate, endDate) {
    const dateRangeElement = document.getElementById('currentDateRange');
    if (dateRangeElement) {
        if (startDate && endDate) {
            dateRangeElement.textContent = `${startDate.toLocaleDateString('tr-TR')} - ${endDate.toLocaleDateString('tr-TR')}`;
        } else {
            dateRangeElement.textContent = 'Tüm Zamanlar';
        }
    }
};

// Kullanıcı bilgilerini güncelle
window.updateUserInfo = function() {
    if (window.currentUser && window.currentUserType) {
        const userInfoElement = document.getElementById('userInfo');
        const userTypeElement = document.getElementById('userType');
        
        if (userInfoElement) {
            userInfoElement.textContent = window.currentUser.name || window.currentUser.username || 'Kullanıcı';
        }
        
        if (userTypeElement) {
            const userTypeText = window.currentUserType === 'admin' ? '👑 Yönetici' : '👤 Kullanıcı';
            userTypeElement.textContent = userTypeText;
        }
        
        // Güvenlik bilgilerini güncelle
        const securityInfoElement = document.getElementById('securityInfo');
        if (securityInfoElement && window.currentUser.twoFactorEnabled !== undefined) {
            const securityText = window.currentUser.twoFactorEnabled ? '🔐 2FA Aktif' : '🛡️ Güvenli Oturum';
            securityInfoElement.textContent = securityText;
        }
    }
};

// Güvenlik bilgilerini göster
window.showSecurityInfo = function() {
    const session = localStorage.getItem('session');
    if (!session) return;
    
    try {
        const sessionData = JSON.parse(session);
        const securityInfo = `
Güvenlik Bilgileri:
• Oturum Durumu: Aktif
• 2FA Durumu: ${window.currentUser?.twoFactorEnabled ? 'Aktif' : 'Pasif'}
• Giriş Zamanı: ${new Date(sessionData.loginTime).toLocaleString('tr-TR')}
• Oturum ID: ${sessionData.sessionId.substring(0, 20)}...
        `;
        
        alert(securityInfo);
    } catch (error) {
        alert('Güvenlik bilgileri alınamadı.');
    }
};

// Mobil tablo scroll hint
window.initMobileTableScrollHint = function() {
    const tables = document.querySelectorAll('.data-table');
    tables.forEach(table => {
        if (table.scrollWidth > table.clientWidth) {
            table.classList.add('scrollable');
        }
    });
};

console.log('✅ UI module loaded');

