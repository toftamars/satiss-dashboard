/* global navigator, performance, PerformanceObserver */
/**
 * Monitoring Module
 * Error tracking, performance monitoring, analytics
 */

class Monitoring {
    constructor() {
        this.isInitialized = false;
        this.sentryEnabled = false;
        this.analyticsEnabled = false;
        this.performanceMetrics = [];
    }

    /**
     * Initialize monitoring
     */
    async init(config = {}) {
        if (this.isInitialized) {
            return;
        }

        this.config = {
            sentryDsn: config.sentryDsn || null,
            environment: config.environment || 'production',
            release: config.release || '1.0.0',
            sampleRate: config.sampleRate || 1.0,
            enableAnalytics: config.enableAnalytics !== false,
            enablePerformance: config.enablePerformance !== false
        };

        // Initialize Sentry (if DSN provided)
        if (this.config.sentryDsn) {
            await this.initSentry();
        }

        // Initialize performance monitoring
        if (this.config.enablePerformance) {
            this.initPerformanceMonitoring();
        }

        // Initialize analytics
        if (this.config.enableAnalytics) {
            this.initAnalytics();
        }

        this.isInitialized = true;
        console.log('[Monitoring] Initialized', this.config);
    }

    /**
     * Initialize Sentry
     */
    async initSentry() {
        try {
            // Sentry will be loaded via CDN or bundled
            // This is a placeholder for configuration
            this.sentryEnabled = true;
            console.log('[Monitoring] Sentry enabled');
        } catch (error) {
            console.error('[Monitoring] Sentry initialization failed:', error);
        }
    }

    /**
     * Initialize performance monitoring
     */
    initPerformanceMonitoring() {
        // Web Vitals monitoring
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint (LCP)
            this.observeLCP();

            // First Input Delay (FID)
            this.observeFID();

            // Cumulative Layout Shift (CLS)
            this.observeCLS();

            // Time to First Byte (TTFB)
            this.observeTTFB();
        }

        // Navigation timing
        if (performance && performance.timing) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    this.captureNavigationTiming();
                }, 0);
            });
        }

        console.log('[Monitoring] Performance monitoring enabled');
    }

    /**
     * Observe Largest Contentful Paint
     */
    observeLCP() {
        try {
            const observer = new PerformanceObserver(list => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.trackMetric('LCP', lastEntry.renderTime || lastEntry.loadTime);
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (error) {
            console.error('[Monitoring] LCP observation failed:', error);
        }
    }

    /**
     * Observe First Input Delay
     */
    observeFID() {
        try {
            const observer = new PerformanceObserver(list => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.trackMetric('FID', entry.processingStart - entry.startTime);
                });
            });
            observer.observe({ entryTypes: ['first-input'] });
        } catch (error) {
            console.error('[Monitoring] FID observation failed:', error);
        }
    }

    /**
     * Observe Cumulative Layout Shift
     */
    observeCLS() {
        try {
            let clsScore = 0;
            const observer = new PerformanceObserver(list => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsScore += entry.value;
                    }
                });
                this.trackMetric('CLS', clsScore);
            });
            observer.observe({ entryTypes: ['layout-shift'] });
        } catch (error) {
            console.error('[Monitoring] CLS observation failed:', error);
        }
    }

    /**
     * Observe Time to First Byte
     */
    observeTTFB() {
        try {
            const observer = new PerformanceObserver(list => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.trackMetric('TTFB', entry.responseStart - entry.requestStart);
                });
            });
            observer.observe({ entryTypes: ['navigation'] });
        } catch (error) {
            console.error('[Monitoring] TTFB observation failed:', error);
        }
    }

    /**
     * Capture navigation timing
     */
    captureNavigationTiming() {
        const timing = performance.timing;
        const metrics = {
            dns: timing.domainLookupEnd - timing.domainLookupStart,
            tcp: timing.connectEnd - timing.connectStart,
            request: timing.responseStart - timing.requestStart,
            response: timing.responseEnd - timing.responseStart,
            dom: timing.domComplete - timing.domLoading,
            load: timing.loadEventEnd - timing.loadEventStart,
            total: timing.loadEventEnd - timing.navigationStart
        };

        Object.entries(metrics).forEach(([key, value]) => {
            this.trackMetric(`navigation_${key}`, value);
        });

        console.log('[Monitoring] Navigation timing:', metrics);
    }

    /**
     * Initialize analytics
     */
    initAnalytics() {
        // Google Analytics placeholder
        // Will be configured separately
        this.analyticsEnabled = true;
        console.log('[Monitoring] Analytics enabled');
    }

    /**
     * Track metric
     */
    trackMetric(name, value) {
        const metric = {
            name,
            value,
            timestamp: Date.now()
        };

        this.performanceMetrics.push(metric);

        // Send to analytics/monitoring service
        console.log(`[Monitoring] Metric: ${name} = ${value.toFixed(2)}ms`);
    }

    /**
     * Track error
     */
    trackError(error, context = {}) {
        const errorData = {
            message: error.message,
            stack: error.stack,
            context,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        console.error('[Monitoring] Error tracked:', errorData);

        // Send to Sentry or error tracking service
        if (this.sentryEnabled) {
            // Sentry.captureException(error, { extra: context });
        }
    }

    /**
     * Track event
     */
    trackEvent(category, action, label = null, value = null) {
        const event = {
            category,
            action,
            label,
            value,
            timestamp: Date.now()
        };

        console.log('[Monitoring] Event:', event);

        // Send to analytics
        if (this.analyticsEnabled) {
            // gtag('event', action, { event_category: category, event_label: label, value });
        }
    }

    /**
     * Get performance metrics
     */
    getMetrics() {
        return this.performanceMetrics;
    }

    /**
     * Clear metrics
     */
    clearMetrics() {
        this.performanceMetrics = [];
    }
}

// Singleton instance
const monitoring = new Monitoring();

export { monitoring };
