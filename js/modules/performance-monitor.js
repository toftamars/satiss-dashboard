/**
 * 📊 Performance Monitor
 * Sayfa performansını izler ve raporlar
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            pageLoad: 0,
            dataLoad: 0,
            chartRender: 0,
            memoryUsage: 0,
            networkRequests: 0
        };
        this.startTime = performance.now();
        this.init();
    }

    init() {
        console.log('📊 Performance Monitor initialized');
        
        // Sayfa yükleme süresini ölç
        window.addEventListener('load', () => {
            this.measurePageLoad();
        });
        
        // Memory usage izle
        this.startMemoryMonitoring();
        
        // Network requests izle
        this.startNetworkMonitoring();
    }

    /**
     * Sayfa yükleme süresini ölç
     */
    measurePageLoad() {
        const loadTime = performance.now() - this.startTime;
        this.metrics.pageLoad = loadTime;
        
        console.log(`📊 Sayfa yükleme süresi: ${loadTime.toFixed(2)}ms`);
        
        // Sentry'ye gönder
        if (window.Sentry) {
            window.Sentry.addBreadcrumb({
                message: `Page load time: ${loadTime.toFixed(2)}ms`,
                category: 'performance'
            });
        }
        
        // Yavaş yükleme uyarısı
        if (loadTime > 5000) {
            console.warn('⚠️ Yavaş yükleme tespit edildi!');
            this.reportSlowLoad(loadTime);
        }
    }

    /**
     * Veri yükleme süresini ölç
     */
    measureDataLoad(startTime) {
        const loadTime = performance.now() - startTime;
        this.metrics.dataLoad = loadTime;
        
        console.log(`📊 Veri yükleme süresi: ${loadTime.toFixed(2)}ms`);
        
        // Sentry'ye gönder
        if (window.Sentry) {
            window.Sentry.addBreadcrumb({
                message: `Data load time: ${loadTime.toFixed(2)}ms`,
                category: 'performance'
            });
        }
    }

    /**
     * Chart render süresini ölç
     */
    measureChartRender(startTime) {
        const renderTime = performance.now() - startTime;
        this.metrics.chartRender = renderTime;
        
        console.log(`📊 Chart render süresi: ${renderTime.toFixed(2)}ms`);
        
        // Sentry'ye gönder
        if (window.Sentry) {
            window.Sentry.addBreadcrumb({
                message: `Chart render time: ${renderTime.toFixed(2)}ms`,
                category: 'performance'
            });
        }
    }

    /**
     * Memory usage izle
     */
    startMemoryMonitoring() {
        // İlk kontrol
        if (performance.memory) {
            const memory = performance.memory;
            this.metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
            console.log(`📊 Memory kullanımı: ${this.metrics.memoryUsage.toFixed(2)}MB`);
        }
        
        // Periyodik kontrol - daha az sıklıkta ve daha yüksek threshold
        setInterval(() => {
            if (performance.memory) {
                const memory = performance.memory;
                this.metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
                
                // Kritik memory kullanımı uyarısı (500MB üzeri)
                if (this.metrics.memoryUsage > 500) {
                    console.warn(`⚠️ Kritik memory kullanımı: ${this.metrics.memoryUsage.toFixed(2)}MB`);
                    this.reportHighMemory(this.metrics.memoryUsage);
                }
            }
        }, 120000); // 2 dakikada bir kontrol
    }

    /**
     * Network requests izle
     */
    startNetworkMonitoring() {
        const originalFetch = window.fetch;
        window.fetch = (...args) => {
            this.metrics.networkRequests++;
            const startTime = performance.now();
            
            return originalFetch(...args).then(response => {
                const duration = performance.now() - startTime;
                
                // Yavaş network uyarısı
                if (duration > 5000) {
                    console.warn(`⚠️ Yavaş network request: ${duration.toFixed(2)}ms - ${args[0]}`);
                }
                
                return response;
            });
        };
    }

    /**
     * Yavaş yükleme raporu
     */
    reportSlowLoad(loadTime) {
        const report = {
            type: 'slow_load',
            loadTime: loadTime,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        };
        
        console.error('🐌 Yavaş yükleme raporu:', report);
        
        // Sentry'ye gönder
        if (window.Sentry) {
            window.Sentry.captureMessage('Slow page load detected', 'warning');
            window.Sentry.setContext('performance', report);
        }
    }

    /**
     * Yüksek memory raporu
     */
    reportHighMemory(memoryUsage) {
        const report = {
            type: 'high_memory',
            memoryUsage: memoryUsage,
            timestamp: new Date().toISOString()
        };
        
        console.error('🧠 Yüksek memory raporu:', report);
        
        // Sentry'ye gönder
        if (window.Sentry) {
            window.Sentry.captureMessage('High memory usage detected', 'warning');
            window.Sentry.setContext('performance', report);
        }
    }

    /**
     * Performans raporu al
     */
    getPerformanceReport() {
        return {
            ...this.metrics,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink
            } : null
        };
    }

    /**
     * Performans raporunu gönder
     */
    sendPerformanceReport() {
        const report = this.getPerformanceReport();
        
        console.log('📊 Performans raporu:', report);
        
        // Sentry'ye gönder
        if (window.Sentry) {
            window.Sentry.setContext('performance_report', report);
            window.Sentry.captureMessage('Performance report generated', 'info');
        }
        
        return report;
    }
}

// Global PerformanceMonitor instance
window.PerformanceMonitor = new PerformanceMonitor();

console.log('📊 Performance Monitor module loaded successfully');
