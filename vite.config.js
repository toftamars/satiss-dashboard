/* global process */
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            external: [
                // CDN'den yüklenen kütüphaneler
                'chart.js',
                'pako',
                'xlsx',
                'crypto-js',
                'dompurify'
            ],
            output: {
                manualChunks: {
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
        // Minification (esbuild - Vite default, daha hızlı)
        minify: 'esbuild',
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
