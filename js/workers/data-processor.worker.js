/* global self, performance */
/**
 * Web Worker - Data Processing
 * Heavy computation için background thread
 */

// Message handler
self.addEventListener('message', event => {
    const { type, data } = event.data;

    try {
        switch (type) {
            case 'FILTER_DATA':
                handleFilterData(data);
                break;

            case 'AGGREGATE_DATA':
                handleAggregateData(data);
                break;

            case 'SORT_DATA':
                handleSortData(data);
                break;

            case 'CALCULATE_STATS':
                handleCalculateStats(data);
                break;

            default:
                self.postMessage({
                    type: 'ERROR',
                    error: `Unknown message type: ${type}`
                });
        }
    } catch (error) {
        self.postMessage({
            type: 'ERROR',
            error: error.message
        });
    }
});

/**
 * Filter data based on criteria
 */
function handleFilterData(data) {
    const { items, filters } = data;
    const startTime = performance.now();

    const filtered = items.filter(item => {
        // Date filter
        if (filters.startDate && new Date(item.date) < new Date(filters.startDate)) {
            return false;
        }
        if (filters.endDate && new Date(item.date) > new Date(filters.endDate)) {
            return false;
        }

        // Category filter
        if (filters.category && item.category !== filters.category) {
            return false;
        }

        // Store filter
        if (filters.store && item.store !== filters.store) {
            return false;
        }

        // Sales rep filter
        if (filters.salesRep && item.salesRep !== filters.salesRep) {
            return false;
        }

        return true;
    });

    const endTime = performance.now();

    self.postMessage({
        type: 'FILTER_DATA_COMPLETE',
        result: filtered,
        processingTime: endTime - startTime
    });
}

/**
 * Aggregate data by key
 */
function handleAggregateData(data) {
    const { items, groupBy } = data;
    const startTime = performance.now();

    const aggregated = items.reduce((acc, item) => {
        const key = item[groupBy];
        if (!acc[key]) {
            acc[key] = {
                count: 0,
                total: 0,
                items: []
            };
        }
        acc[key].count++;
        acc[key].total += item.amount || 0;
        acc[key].items.push(item);
        return acc;
    }, {});

    const endTime = performance.now();

    self.postMessage({
        type: 'AGGREGATE_DATA_COMPLETE',
        result: aggregated,
        processingTime: endTime - startTime
    });
}

/**
 * Sort data
 */
function handleSortData(data) {
    const { items, sortBy, order } = data;
    const startTime = performance.now();

    const sorted = [...items].sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];

        if (order === 'asc') {
            return aVal > bVal ? 1 : -1;
        }
        return aVal < bVal ? 1 : -1;
    });

    const endTime = performance.now();

    self.postMessage({
        type: 'SORT_DATA_COMPLETE',
        result: sorted,
        processingTime: endTime - startTime
    });
}

/**
 * Calculate statistics
 */
function handleCalculateStats(data) {
    const { items, field } = data;
    const startTime = performance.now();

    const values = items.map(item => item[field] || 0);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    // Calculate median
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

    // Calculate standard deviation
    const variance = values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    const endTime = performance.now();

    self.postMessage({
        type: 'CALCULATE_STATS_COMPLETE',
        result: {
            count: values.length,
            sum,
            avg,
            min,
            max,
            median,
            stdDev
        },
        processingTime: endTime - startTime
    });
}

console.log('[Worker] Data processor worker loaded');
