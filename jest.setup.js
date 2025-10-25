/**
 * Jest Setup File
 * Global test configuration and mocks
 */

// Mock localStorage
const localStorageMock = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
};
global.sessionStorage = sessionStorageMock;

// Mock IndexedDB
global.indexedDB = {
    open: () => {},
    deleteDatabase: () => {},
};

// Mock fetch
global.fetch = () =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(''),
    });

// Mock Chart.js
global.Chart = function() {
    return {
        destroy: () => {},
        update: () => {},
        data: { datasets: [] },
    };
};
