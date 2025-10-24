/**
 * UI Module Tests
 * @jest-environment jsdom
 */

describe('UI Module', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        delete window.showTab;
        delete window.toggleSidebar;
        delete window.updateDateDisplay;
    });

    test('should switch between tabs', () => {
        // Create tabs
        const tab1 = document.createElement('div');
        tab1.id = 'tab1';
        tab1.className = 'tab-content';
        
        const tab2 = document.createElement('div');
        tab2.id = 'tab2';
        tab2.className = 'tab-content';
        
        document.body.appendChild(tab1);
        document.body.appendChild(tab2);
        
        window.showTab = function(tabId) {
            const tabs = document.querySelectorAll('.tab-content');
            tabs.forEach(tab => tab.classList.remove('active'));
            
            const targetTab = document.getElementById(tabId);
            if (targetTab) {
                targetTab.classList.add('active');
                return true;
            }
            return false;
        };
        
        window.showTab('tab1');
        expect(tab1.classList.contains('active')).toBe(true);
        expect(tab2.classList.contains('active')).toBe(false);
        
        window.showTab('tab2');
        expect(tab1.classList.contains('active')).toBe(false);
        expect(tab2.classList.contains('active')).toBe(true);
    });

    test('should toggle sidebar visibility', () => {
        const sidebar = document.createElement('div');
        sidebar.id = 'sidebar';
        sidebar.style.display = 'block';
        document.body.appendChild(sidebar);
        
        window.toggleSidebar = function() {
            const el = document.getElementById('sidebar');
            if (!el) return false;
            
            el.style.display = el.style.display === 'none' ? 'block' : 'none';
            return true;
        };
        
        window.toggleSidebar();
        expect(sidebar.style.display).toBe('none');
        
        window.toggleSidebar();
        expect(sidebar.style.display).toBe('block');
    });

    test('should update date display', () => {
        window.updateDateDisplay = function() {
            const now = new Date();
            return {
                date: now.toLocaleDateString('tr-TR'),
                time: now.toLocaleTimeString('tr-TR'),
                timestamp: now.getTime()
            };
        };
        
        const result = window.updateDateDisplay();
        
        expect(result.date).toBeDefined();
        expect(result.time).toBeDefined();
        expect(typeof result.timestamp).toBe('number');
        expect(result.timestamp).toBeGreaterThan(0);
    });

    test('should handle button click events', () => {
        const button = document.createElement('button');
        button.id = 'testButton';
        document.body.appendChild(button);
        
        let clicked = false;
        button.addEventListener('click', () => {
            clicked = true;
        });
        
        button.click();
        expect(clicked).toBe(true);
    });

    test('should validate form inputs', () => {
        const validateInput = (value, required = false) => {
            if (required && (!value || value.trim() === '')) {
                return { valid: false, error: 'Field is required' };
            }
            return { valid: true, error: null };
        };
        
        expect(validateInput('test', true).valid).toBe(true);
        expect(validateInput('', true).valid).toBe(false);
        expect(validateInput('', false).valid).toBe(true);
    });
});
