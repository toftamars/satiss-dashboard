/**
 * Jest Test Configuration
 * @type {import('jest').Config}
 */
export default {
    // Test environment
    testEnvironment: 'jsdom',
    
    // Coverage configuration
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'js/modules/**/*.js',
        '!js/modules/**/*.test.js',
        '!js/modules/**/__tests__/**',
        '!js/modules/**/index.js'
    ],
    
    // Coverage thresholds
    coverageThreshold: {
        global: {
            branches: 60,
            functions: 60,
            lines: 60,
            statements: 60
        }
    },
    
    // Test match patterns
    testMatch: [
        '**/__tests__/**/*.js',
        '**/?(*.)+(spec|test).js'
    ],
    
    // Transform configuration
    transform: {},
    
    // Module paths
    moduleDirectories: ['node_modules', 'js'],
    
    // Setup files
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    
    // Ignore patterns
    testPathIgnorePatterns: [
        '/node_modules/',
        '/coverage/',
        '/data/'
    ],
    
    // Verbose output
    verbose: true,
    
    // Clear mocks between tests
    clearMocks: true,
    
    // Collect coverage
    collectCoverage: false, // Manuel olarak --coverage ile çalıştırılacak
    
    // Coverage reporters
    coverageReporters: [
        'text',
        'text-summary',
        'html',
        'lcov'
    ]
};

