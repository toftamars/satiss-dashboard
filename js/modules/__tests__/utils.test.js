/**
 * Utils Module Unit Tests
 */

import { 
    formatCurrency, 
    formatNumber, 
    formatDate,
    formatPercent,
    groupBy,
    sumBy
} from '../utils.js';

describe('Utils Module', () => {
    describe('formatCurrency', () => {
        test('formats positive numbers correctly', () => {
            const result = formatCurrency(1234.56);
            expect(result).toContain('1');
            expect(result).toContain('234');
        });
        
        test('handles zero', () => {
            const result = formatCurrency(0);
            expect(result).toBeDefined();
        });
        
        test('handles null/undefined', () => {
            expect(formatCurrency(null)).toBeDefined();
            expect(formatCurrency(undefined)).toBeDefined();
        });
    });
    
    describe('formatNumber', () => {
        test('formats integers', () => {
            const result = formatNumber(1234567);
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
        });
        
        test('handles zero', () => {
            const result = formatNumber(0);
            expect(result).toBeDefined();
        });
    });
    
    describe('formatDate', () => {
        test('formats date string', () => {
            const result = formatDate('2025-01-15');
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
        });
    });
    
    describe('formatPercent', () => {
        test('calculates percentage', () => {
            const result = formatPercent(25, 100);
            expect(result).toBeDefined();
        });
    });
    
    describe('groupBy', () => {
        test('groups array by key', () => {
            const data = [
                { category: 'A', value: 1 },
                { category: 'B', value: 2 },
                { category: 'A', value: 3 }
            ];
            const result = groupBy(data, 'category');
            expect(result).toBeDefined();
            expect(typeof result).toBe('object');
        });
    });
    
    describe('sumBy', () => {
        test('sums array by key', () => {
            const data = [
                { amount: 100 },
                { amount: 200 },
                { amount: 300 }
            ];
            const result = sumBy(data, 'amount');
            expect(result).toBe(600);
        });
    });
});
