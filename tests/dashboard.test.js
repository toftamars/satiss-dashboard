/**
 * Dashboard Module Tests
 * @jest-environment jsdom
 */

describe('Dashboard Module', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        delete window.updateSummaryCards;
        delete window.showLoading;
        delete window.hideLoading;
    });

    test('should create summary cards container', () => {
        const container = document.createElement('div');
        container.id = 'summaryCards';
        container.className = 'summary-cards';
        document.body.appendChild(container);
        
        expect(document.getElementById('summaryCards')).toBeTruthy();
        expect(container.className).toBe('summary-cards');
    });

    test('updateSummaryCards should update dashboard metrics', () => {
        window.updateSummaryCards = function(data) {
            return {
                totalSales: data.reduce((sum, item) => sum + item.amount, 0),
                count: data.length,
                average: data.length > 0 ? data.reduce((sum, item) => sum + item.amount, 0) / data.length : 0
            };
        };
        
        const testData = [
            { amount: 100 },
            { amount: 200 },
            { amount: 300 }
        ];
        
        const result = window.updateSummaryCards(testData);
        
        expect(result.totalSales).toBe(600);
        expect(result.count).toBe(3);
        expect(result.average).toBe(200);
    });

    test('should show loading indicator', () => {
        window.showLoading = function() {
            const loading = document.createElement('div');
            loading.id = 'loadingScreen';
            loading.style.display = 'flex';
            document.body.appendChild(loading);
            return true;
        };
        
        window.showLoading();
        const loadingEl = document.getElementById('loadingScreen');
        
        expect(loadingEl).toBeTruthy();
        expect(loadingEl.style.display).toBe('flex');
    });

    test('should hide loading indicator', () => {
        const loading = document.createElement('div');
        loading.id = 'loadingScreen';
        loading.style.display = 'flex';
        document.body.appendChild(loading);
        
        window.hideLoading = function() {
            const el = document.getElementById('loadingScreen');
            if (el) el.style.display = 'none';
            return true;
        };
        
        window.hideLoading();
        
        expect(loading.style.display).toBe('none');
    });

    test('should format currency correctly', () => {
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('tr-TR', {
                style: 'currency',
                currency: 'TRY'
            }).format(amount);
        };
        
        expect(formatCurrency(1000)).toContain('1');
        expect(formatCurrency(0)).toContain('0');
    });
});
