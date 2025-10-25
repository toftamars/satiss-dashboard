/* global process */
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // Vendor chunks - External libraries
                    'vendor-charts': ['chart.js'],

                    // Feature chunks - Modules
                    core: [
                        './js/modules/logger.js',
                        './js/modules/error-handler.js',
                        './js/modules/config-loader.js'
                    ],
                    data: ['./js/modules/data-loader.js', './js/modules/inventory-manager.js'],
                    ui: [
                        './js/modules/tab-manager.js',
                        './js/modules/chart-renderer.js',
                        './js/modules/filter-manager.js'
                    ],
                    security: [
                        './js/modules/security-manager.js',
                        './js/modules/session-manager.js'
                    ],
                    features: [
                        './js/modules/sales-analysis.js',
                        './js/modules/excel-export.js',
                        './js/modules/voice-search.js',
                        './js/modules/helpers.js'
                    ]
                }
            }
        },
        // Minification
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true, // Production'da console.log'ları kaldır
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info', 'console.debug']
            },
            mangle: {
                safari10: true
            }
        },
        // Source maps (development için)
        sourcemap: process.env.NODE_ENV === 'development',
        // Chunk size warnings
        chunkSizeWarningLimit: 500
    },
    // Development server
    server: {
        port: 8000,
        open: true,
        cors: true
    },
    // Preview server (production build test)
    preview: {
        port: 8080
    }
});
