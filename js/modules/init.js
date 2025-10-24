/**
 * @fileoverview Initialization Module
 * @description Handles page initialization, event listeners, and session management
 * @version 1.0.0
 * @author Zuhal Müzik Dashboard Team
 */

/**
 * Session check interval in milliseconds (5 minutes)
 * @const {number}
 */
const SESSION_CHECK_INTERVAL = 5 * 60 * 1000;

/**
 * Main initialization function
 * Runs when DOM content is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Content Loaded');
    
    if (typeof window.initAuth === 'function') {
        window.initAuth();
    }
    
    if (typeof window.startRealLoading === 'function') {
        window.startRealLoading();
    }
    
    if (typeof window.initMobileTableScrollHint === 'function') {
        window.initMobileTableScrollHint();
    }
    
    updateUsernameDisplay();
    setupTabObserver();
    setupSessionCheck();
    
    console.log('✅ Initialization complete');
});

/**
 * Updates username display from session storage
 */
function updateUsernameDisplay() {
    const username = sessionStorage.getItem('username');
    const currentUserNameElement = document.getElementById('currentUserName');
    
    if (username && currentUserNameElement) {
        const capitalizedName = username.charAt(0).toUpperCase() + username.slice(1);
        currentUserNameElement.textContent = capitalizedName;
    }
}

/**
 * Sets up mutation observer for tab changes
 * Updates mobile scroll hints when tabs change
 */
function setupTabObserver() {
    const observer = new MutationObserver(function() {
        if (typeof window.initMobileTableScrollHint === 'function') {
            window.initMobileTableScrollHint();
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

/**
 * Sets up periodic session expiry check
 * Logs out user if session has expired
 */
function setupSessionCheck() {
    setInterval(function() {
        const session = localStorage.getItem('session');
        if (!session) return;
        
        try {
            const sessionData = JSON.parse(session);
            const now = new Date().getTime();
            
            if (now > sessionData.expiry) {
                alert('Oturum süreniz doldu. Lütfen tekrar giriş yapın.');
                if (typeof window.logout === 'function') {
                    window.logout();
                }
            }
        } catch (error) {
            console.error('Session check error:', error);
        }
    }, SESSION_CHECK_INTERVAL);
}

console.log('✅ Init module loaded');

