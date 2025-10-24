/**
 * Jest Configuration
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/tests'],
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    collectCoverageFrom: [
        'js/**/*.js',
        '!js/**/*.min.js',
        '!**/node_modules/**'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['html', 'text', 'lcov'],
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 50,
            lines: 50,
            statements: 50
        }
    },
    verbose: true,
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};
