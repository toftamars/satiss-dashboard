/**
 * Config Module Tests
 * @jest-environment jsdom
 */

describe('Config Module', () => {
    beforeEach(() => {
        delete window.loadedDataCache;
        delete window.currentFilters;
        delete window.availableYears;
    });

    test('should initialize global cache object', () => {
        window.loadedDataCache = {};
        expect(window.loadedDataCache).toBeDefined();
        expect(typeof window.loadedDataCache).toBe('object');
    });

    test('should initialize currentFilters with correct structure', () => {
        window.currentFilters = {
            year: null,
            storeCode: [],
            productCategory: [],
            city: []
        };
        
        expect(window.currentFilters).toBeDefined();
        expect(window.currentFilters.year).toBeNull();
        expect(Array.isArray(window.currentFilters.storeCode)).toBe(true);
        expect(Array.isArray(window.currentFilters.productCategory)).toBe(true);
        expect(Array.isArray(window.currentFilters.city)).toBe(true);
    });

    test('cache should store and retrieve data correctly', () => {
        window.loadedDataCache = {};
        const testData = { 
            sales: [{ id: 1, amount: 100 }],
            metadata: { year: 2024 }
        };
        
        window.loadedDataCache['2024'] = testData;
        
        expect(window.loadedDataCache['2024']).toEqual(testData);
        expect(window.loadedDataCache['2024'].sales).toHaveLength(1);
        expect(window.loadedDataCache['2024'].metadata.year).toBe(2024);
    });

    test('should handle multiple years in cache', () => {
        window.loadedDataCache = {
            '2023': { sales: [] },
            '2024': { sales: [] },
            '2025': { sales: [] }
        };
        
        expect(Object.keys(window.loadedDataCache)).toHaveLength(3);
        expect('2023' in window.loadedDataCache).toBe(true);
        expect('2024' in window.loadedDataCache).toBe(true);
        expect('2025' in window.loadedDataCache).toBe(true);
    });
});
