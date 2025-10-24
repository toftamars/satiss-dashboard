/**
 * Jest Test Setup
 * Global test configuration and mocks
 */

// Mock window.localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock window.sessionStorage
const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
};
global.sessionStorage = sessionStorageMock;

// Mock console methods if needed
global.console = {
    ...console,
    error: jest.fn(),
    warn: jest.fn()
};

// Mock Chart.js
global.Chart = jest.fn();

// Mock pako (gzip)
global.pako = {
    inflate: jest.fn()
};

// Mock XLSX
global.XLSX = {
    utils: {
        book_new: jest.fn(),
        json_to_sheet: jest.fn(),
        book_append_sheet: jest.fn()
    },
    writeFile: jest.fn()
};
