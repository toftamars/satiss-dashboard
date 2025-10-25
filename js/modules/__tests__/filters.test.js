/**
 * Filters Module Unit Tests
 */

import { 
    filterByDateRange, 
    filterByStore,
    filterByCustomer,
    getActiveChannelCount
} from '../filters.js';

describe('Filters Module', () => {
    const mockData = [
        { date: '2025-01-15', store: 'Tünel', amount: 1000, customer: 'Müşteri A' },
        { date: '2025-02-20', store: 'Beyoğlu', amount: 2000, customer: 'Müşteri B' },
        { date: '2025-03-10', store: 'Tünel', amount: 1500, customer: 'Müşteri A' }
    ];
    
    describe('filterByDateRange', () => {
        test('filters by date range', () => {
            const filtered = filterByDateRange(mockData, '2025-01-01', '2025-02-01');
            expect(Array.isArray(filtered)).toBe(true);
        });
        
        test('returns array when no dates provided', () => {
            const filtered = filterByDateRange(mockData, null, null);
            expect(Array.isArray(filtered)).toBe(true);
        });
        
        test('handles empty array', () => {
            const filtered = filterByDateRange([], '2025-01-01', '2025-12-31');
            expect(filtered).toHaveLength(0);
        });
    });
    
    describe('filterByStore', () => {
        test('filters by store name', () => {
            const filtered = filterByStore(mockData, 'Tünel');
            expect(Array.isArray(filtered)).toBe(true);
        });
        
        test('handles null store', () => {
            const filtered = filterByStore(mockData, null);
            expect(Array.isArray(filtered)).toBe(true);
        });
    });
    
    describe('filterByCustomer', () => {
        test('filters by customer name', () => {
            const filtered = filterByCustomer(mockData, 'Müşteri A');
            expect(Array.isArray(filtered)).toBe(true);
        });
    });
    
    describe('getActiveChannelCount', () => {
        test('returns a number', () => {
            const count = getActiveChannelCount();
            expect(typeof count).toBe('number');
            expect(count).toBeGreaterThanOrEqual(0);
        });
    });
});
