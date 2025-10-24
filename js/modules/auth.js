/**
 * @fileoverview Authentication Module
 * @description Handles user authentication, session management, and dashboard access
 * @version 1.0.0
 * @author Zuhal Müzik Dashboard Team
 */

/**
 * Shows dashboard after successful authentication
 * @param {Object} user - User object
 * @param {string} user.email - User email
 * @param {string} user.name - User name
 */
window.showDashboardAfterAuth = function(user) {
    console.log('🚀 showDashboardAfterAuth called');
    
    if (user) {
        window.updateUserInfo(user);
    }
    
    console.log('✅ Dashboard initialized');
};

/**
 * Updates user information in the UI
 * @param {Object} user - User object
 * @param {string} user.email - User email
 * @param {string} user.name - User name
 */
window.updateUserInfo = function(user) {
    const userNameElement = document.getElementById('currentUserName');
    const userInfoElement = document.getElementById('userInfo');
    const userTypeElement = document.getElementById('userType');
    
    const displayName = user.name || user.email?.split('@')[0] || 'Kullanıcı';
    
    if (userNameElement) {
        userNameElement.textContent = displayName;
    }
    
    if (userInfoElement) {
        userInfoElement.textContent = displayName;
    }
    
    if (userTypeElement) {
        userTypeElement.textContent = '👤 Kullanıcı';
    }
};

/**
 * Logs out user and reloads the page
 */
window.logout = function() {
    sessionStorage.clear();
    localStorage.clear();
    location.reload();
    console.log('✅ Logged out');
};

/**
 * Initializes authentication and dashboard
 * Sets up demo user session for direct dashboard access
 */
window.initAuth = function() {
    console.log('🚀 Initializing dashboard...');
    
    const user = {
        email: 'demo@zuhalmuzik.com',
        name: 'Demo Kullanıcı'
    };
    
    const now = Date.now();
    const expiryTime = now + (24 * 60 * 60 * 1000); // 24 hours
    
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('loginTime', now.toString());
    sessionStorage.setItem('userEmail', user.email);
    sessionStorage.setItem('username', user.name);
    sessionStorage.setItem('otpVerified', 'true');
    sessionStorage.setItem('sessionExpiry', expiryTime.toString());
    
    setTimeout(() => {
        console.log('🚀 Starting dashboard...');
        window.showDashboardAfterAuth(user);
    }, 100);
};

console.log('✅ Auth module loaded');

