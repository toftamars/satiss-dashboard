/**
 * @fileoverview UI Management Module
 * @description Handles user interface interactions, tab switching, sidebar, and date updates
 * @version 1.0.0
 * @author Zuhal Müzik Dashboard Team
 */

/**
 * Shows specified tab and updates navigation
 * @param {string} tabId - Tab element ID to show
 * @param {HTMLElement} element - Navigation element that was clicked
 */
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

/**
 * Toggles sidebar visibility
 */
window.toggleSidebar = function() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebar) sidebar.classList.toggle('hidden');
    if (mainContent) mainContent.classList.toggle('full-width');
};

/**
 * Updates date range display
 * @param {Date} [startDate] - Start date of range
 * @param {Date} [endDate] - End date of range
 */
window.updateDateRange = function(startDate, endDate) {
    const dateRangeElement = document.getElementById('currentDateRange');
    
    if (dateRangeElement) {
        if (startDate && endDate) {
            const start = startDate.toLocaleDateString('tr-TR');
            const end = endDate.toLocaleDateString('tr-TR');
            dateRangeElement.textContent = `${start} - ${end}`;
        } else {
            dateRangeElement.textContent = 'Tüm Zamanlar';
        }
    }
};

/**
 * Updates user information in the UI
 */
window.updateUserInfo = function() {
    if (!window.currentUser || !window.currentUserType) return;
    
    const userInfoElement = document.getElementById('userInfo');
    const userTypeElement = document.getElementById('userType');
    
    if (userInfoElement) {
        const displayName = window.currentUser.name || window.currentUser.username || 'Kullanıcı';
        userInfoElement.textContent = displayName;
    }
    
    if (userTypeElement) {
        const userTypeText = window.currentUserType === 'admin' ? '👑 Yönetici' : '👤 Kullanıcı';
        userTypeElement.textContent = userTypeText;
    }
    
    const securityInfoElement = document.getElementById('securityInfo');
    if (securityInfoElement && window.currentUser.twoFactorEnabled !== undefined) {
        const securityText = window.currentUser.twoFactorEnabled ? '🔐 2FA Aktif' : '🛡️ Güvenli Oturum';
        securityInfoElement.textContent = securityText;
    }
};

/**
 * Shows security information dialog
 */
window.showSecurityInfo = function() {
    const session = localStorage.getItem('session');
    if (!session) return;
    
    try {
        const sessionData = JSON.parse(session);
        const twoFAStatus = window.currentUser?.twoFactorEnabled ? 'Aktif' : 'Pasif';
        const loginTime = new Date(sessionData.loginTime).toLocaleString('tr-TR');
        const sessionId = sessionData.sessionId.substring(0, 20);
        
        const securityInfo = `
Güvenlik Bilgileri:
• Oturum Durumu: Aktif
• 2FA Durumu: ${twoFAStatus}
• Giriş Zamanı: ${loginTime}
• Oturum ID: ${sessionId}...
        `;
        
        alert(securityInfo);
    } catch (error) {
        alert('Güvenlik bilgileri alınamadı.');
    }
};

/**
 * Initializes mobile table scroll hint
 * Adds visual indicator for horizontally scrollable tables
 */
window.initMobileTableScrollHint = function() {
    const tables = document.querySelectorAll('.data-table');
    tables.forEach(table => {
        if (table.scrollWidth > table.clientWidth) {
            table.classList.add('scrollable');
        }
    });
};

console.log('✅ UI module loaded');

