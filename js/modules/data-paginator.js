/**
 * Data Paginator
 * Büyük veri setleri için pagination ve lazy loading
 */

class DataPaginator {
    constructor(options = {}) {
        this.pageSize = options.pageSize || 1000;
        this.currentPage = 0;
        this.totalPages = 0;
        this.allData = [];
        this.filteredData = [];
        this.currentPageData = [];
        this.observers = [];
    }

    /**
     * Set all data
     */
    setData(data) {
        this.allData = data;
        this.filteredData = data;
        this.totalPages = Math.ceil(data.length / this.pageSize);
        this.currentPage = 0;
        this.loadPage(0);
        this.notifyObservers();
    }

    /**
     * Apply filters
     */
    applyFilters(filterFn) {
        this.filteredData = this.allData.filter(filterFn);
        this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
        this.currentPage = 0;
        this.loadPage(0);
        this.notifyObservers();
    }

    /**
     * Load specific page
     */
    loadPage(pageNumber) {
        if (pageNumber < 0 || pageNumber >= this.totalPages) {
            return;
        }

        this.currentPage = pageNumber;
        const start = pageNumber * this.pageSize;
        const end = Math.min(start + this.pageSize, this.filteredData.length);
        this.currentPageData = this.filteredData.slice(start, end);
        this.notifyObservers();
    }

    /**
     * Next page
     */
    nextPage() {
        if (this.currentPage < this.totalPages - 1) {
            this.loadPage(this.currentPage + 1);
        }
    }

    /**
     * Previous page
     */
    prevPage() {
        if (this.currentPage > 0) {
            this.loadPage(this.currentPage - 1);
        }
    }

    /**
     * First page
     */
    firstPage() {
        this.loadPage(0);
    }

    /**
     * Last page
     */
    lastPage() {
        this.loadPage(this.totalPages - 1);
    }

    /**
     * Get current page data
     */
    getCurrentPageData() {
        return this.currentPageData;
    }

    /**
     * Get all filtered data (use with caution for large datasets)
     */
    getAllFilteredData() {
        return this.filteredData;
    }

    /**
     * Get pagination info
     */
    getPaginationInfo() {
        return {
            currentPage: this.currentPage + 1,
            totalPages: this.totalPages,
            pageSize: this.pageSize,
            totalItems: this.filteredData.length,
            startIndex: this.currentPage * this.pageSize + 1,
            endIndex: Math.min((this.currentPage + 1) * this.pageSize, this.filteredData.length),
            hasNext: this.currentPage < this.totalPages - 1,
            hasPrev: this.currentPage > 0
        };
    }

    /**
     * Subscribe to data changes
     */
    subscribe(callback) {
        this.observers.push(callback);
        return () => {
            this.observers = this.observers.filter(cb => cb !== callback);
        };
    }

    /**
     * Notify observers
     */
    notifyObservers() {
        const info = this.getPaginationInfo();
        this.observers.forEach(callback => {
            callback(this.currentPageData, info);
        });
    }

    /**
     * Search in data
     */
    search(query, fields = []) {
        if (!query || query.trim() === '') {
            this.filteredData = this.allData;
        } else {
            const lowerQuery = query.toLowerCase();
            this.filteredData = this.allData.filter(item => {
                if (fields.length === 0) {
                    // Search in all fields
                    return Object.values(item).some(value =>
                        String(value).toLowerCase().includes(lowerQuery)
                    );
                }
                // Search in specific fields
                return fields.some(field => String(item[field]).toLowerCase().includes(lowerQuery));
            });
        }

        this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
        this.currentPage = 0;
        this.loadPage(0);
        this.notifyObservers();
    }

    /**
     * Sort data
     */
    sort(field, order = 'asc') {
        this.filteredData.sort((a, b) => {
            const aVal = a[field];
            const bVal = b[field];

            if (aVal === bVal) return 0;

            if (order === 'asc') {
                return aVal > bVal ? 1 : -1;
            }
            return aVal < bVal ? 1 : -1;
        });

        this.loadPage(this.currentPage);
        this.notifyObservers();
    }

    /**
     * Reset to original data
     */
    reset() {
        this.filteredData = this.allData;
        this.totalPages = Math.ceil(this.allData.length / this.pageSize);
        this.currentPage = 0;
        this.loadPage(0);
        this.notifyObservers();
    }

    /**
     * Get statistics
     */
    getStats() {
        return {
            total: this.allData.length,
            filtered: this.filteredData.length,
            currentPage: this.currentPageData.length,
            pages: this.totalPages,
            memoryUsage: this.estimateMemoryUsage()
        };
    }

    /**
     * Estimate memory usage
     */
    estimateMemoryUsage() {
        const sampleSize = Math.min(100, this.allData.length);
        const sample = this.allData.slice(0, sampleSize);
        const avgItemSize = JSON.stringify(sample).length / sampleSize;
        const totalSize = avgItemSize * this.allData.length;
        return {
            total: this.formatBytes(totalSize),
            perPage: this.formatBytes(avgItemSize * this.pageSize),
            avgItem: this.formatBytes(avgItemSize)
        };
    }

    /**
     * Format bytes
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }
}

export { DataPaginator };
