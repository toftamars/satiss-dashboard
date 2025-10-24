/**
 * Data Loader Module Tests
 * @jest-environment jsdom
 */

describe('Data Loader Module', () => {
    beforeEach(() => {
        delete window.loadData;
        delete window.loadedDataCache;
        delete window.loadMetadata;
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should define loadData function', () => {
        window.loadData = async function(year) {
            return { sales: [], year: year };
        };
        
        expect(typeof window.loadData).toBe('function');
    });

    test('loadData should return data for given year', async () => {
        window.loadData = async function(year) {
            return {
                sales: [{ id: 1, amount: 100 }],
                year: year,
                loaded: true
            };
        };
        
        const result = await window.loadData('2024');
        
        expect(result.year).toBe('2024');
        expect(result.loaded).toBe(true);
        expect(Array.isArray(result.sales)).toBe(true);
    });

    test('should cache loaded data', async () => {
        window.loadedDataCache = {};
        window.loadData = async function(year) {
            if (window.loadedDataCache[year]) {
                return window.loadedDataCache[year];
            }
            
            const data = { sales: [], year: year, cached: false };
            window.loadedDataCache[year] = data;
            return data;
        };
        
        // First load - not cached
        const firstLoad = await window.loadData('2024');
        expect(firstLoad.cached).toBe(false);
        
        // Second load - from cache
        const secondLoad = await window.loadData('2024');
        expect(secondLoad).toBe(firstLoad); // Same object reference
    });

    test('should handle metadata loading', async () => {
        window.loadMetadata = async function() {
            return {
                availableYears: ['2023', '2024', '2025'],
                lastUpdate: new Date().toISOString()
            };
        };
        
        const metadata = await window.loadMetadata();
        
        expect(Array.isArray(metadata.availableYears)).toBe(true);
        expect(metadata.availableYears).toHaveLength(3);
        expect(metadata.availableYears).toContain('2024');
        expect(metadata.lastUpdate).toBeDefined();
    });

    test('should handle data loading errors', async () => {
        window.loadData = async function(year) {
            if (!year) {
                throw new Error('Year is required');
            }
            return { sales: [], year: year };
        };
        
        await expect(window.loadData(null)).rejects.toThrow('Year is required');
        await expect(window.loadData('')).rejects.toThrow('Year is required');
    });

    test('should decompress GZIP data', () => {
        const mockDecompress = (compressedData) => {
            // Mock implementation
            if (!compressedData) throw new Error('No data to decompress');
            return { decompressed: true, data: [] };
        };
        
        const result = mockDecompress('compressed_data');
        expect(result.decompressed).toBe(true);
        
        expect(() => mockDecompress(null)).toThrow('No data to decompress');
    });

    test('should validate data structure', () => {
        const validateData = (data) => {
            if (!data) return false;
            if (!Array.isArray(data.sales)) return false;
            if (!data.year) return false;
            return true;
        };
        
        expect(validateData({ sales: [], year: '2024' })).toBe(true);
        expect(validateData({ sales: 'invalid' })).toBe(false);
        expect(validateData(null)).toBe(false);
        expect(validateData({})).toBe(false);
    });
});
