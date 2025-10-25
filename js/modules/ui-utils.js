/* global navigator, Blob, URL */
/**
 * UI Utilities Module
 * UI yardımcı fonksiyonları ve DOM manipülasyonu
 */

class UIUtils {
    /**
     * Show loading indicator
     */
    showLoading(message = 'Yükleniyor...') {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            const messageEl = loadingScreen.querySelector('.loading-message');
            if (messageEl) {
                messageEl.textContent = message;
            }
            loadingScreen.style.display = 'flex';
        }
    }

    /**
     * Hide loading indicator
     */
    hideLoading() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }

    /**
     * Update loading progress
     */
    updateLoadingProgress(percent, message = '') {
        const progressBar = document.querySelector('.loading-progress');
        const messageEl = document.querySelector('.loading-message');

        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }

        if (messageEl && message) {
            messageEl.textContent = message;
        }
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${this.getToastColor(type)};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, duration);
    }

    /**
     * Get toast color
     */
    getToastColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || colors.info;
    }

    /**
     * Show modal
     */
    showModal(title, content, buttons = []) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        `;

        const modalTitle = document.createElement('h3');
        modalTitle.textContent = title;
        modalTitle.style.marginBottom = '20px';

        const modalBody = document.createElement('div');
        modalBody.innerHTML = content;
        modalBody.style.marginBottom = '20px';

        const modalFooter = document.createElement('div');
        modalFooter.style.cssText = 'display: flex; gap: 10px; justify-content: flex-end;';

        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.textContent = btn.text;
            button.className = btn.className || 'btn';
            button.onclick = () => {
                if (btn.onClick) btn.onClick();
                document.body.removeChild(modal);
            };
            modalFooter.appendChild(button);
        });

        modalContent.appendChild(modalTitle);
        modalContent.appendChild(modalBody);
        modalContent.appendChild(modalFooter);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Close on overlay click
        modal.onclick = e => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        };
    }

    /**
     * Confirm dialog
     */
    confirm(message, onConfirm, onCancel) {
        this.showModal('Onay', message, [
            {
                text: 'İptal',
                className: 'btn btn-secondary',
                onClick: onCancel
            },
            {
                text: 'Onayla',
                className: 'btn btn-primary',
                onClick: onConfirm
            }
        ]);
    }

    /**
     * Show error message
     */
    showError(message, details = null) {
        console.error('Error:', message, details);
        this.showToast(message, 'error', 5000);
    }

    /**
     * Show success message
     */
    showSuccess(message) {
        this.showToast(message, 'success', 3000);
    }

    /**
     * Toggle element visibility
     */
    toggleElement(elementId, show = null) {
        const element = document.getElementById(elementId);
        if (!element) return;

        if (show === null) {
            element.style.display = element.style.display === 'none' ? 'block' : 'none';
        } else {
            element.style.display = show ? 'block' : 'none';
        }
    }

    /**
     * Disable element
     */
    disableElement(elementId, disabled = true) {
        const element = document.getElementById(elementId);
        if (element) {
            element.disabled = disabled;
            if (disabled) {
                element.style.opacity = '0.5';
                element.style.cursor = 'not-allowed';
            } else {
                element.style.opacity = '1';
                element.style.cursor = 'pointer';
            }
        }
    }

    /**
     * Add loading state to button
     */
    setButtonLoading(buttonId, loading = true) {
        const button = document.getElementById(buttonId);
        if (!button) return;

        if (loading) {
            button.dataset.originalText = button.textContent;
            button.textContent = 'Yükleniyor...';
            button.disabled = true;
            button.style.opacity = '0.7';
        } else {
            button.textContent = button.dataset.originalText || button.textContent;
            button.disabled = false;
            button.style.opacity = '1';
        }
    }

    /**
     * Scroll to element
     */
    scrollToElement(elementId, behavior = 'smooth') {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior, block: 'start' });
        }
    }

    /**
     * Copy to clipboard
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showSuccess('Panoya kopyalandı!');
            return true;
        } catch {
            this.showError('Kopyalama başarısız!');
            return false;
        }
    }

    /**
     * Download as file
     */
    downloadFile(content, filename, type = 'text/plain') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showSuccess('Dosya indirildi!');
    }

    /**
     * Format file size
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * Debounce function
     */
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function
     */
    throttle(func, limit = 300) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    }
}

// Singleton instance
const uiUtils = new UIUtils();

export { uiUtils, UIUtils };
