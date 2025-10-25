/**
 * 📈 Charts Module
 * Chart.js ile grafik oluşturma ve yönetimi
 */

class ChartManager {
    constructor() {
        this.charts = {};
        this.chartInstances = {};
        this.init();
    }

    /**
     * Chart manager'ı başlat
     */
    init() {
        console.log('📈 ChartManager initialized');
    }

    /**
     * Mevcut chart'ı temizle
     */
    destroyChart(chartId) {
        if (this.chartInstances[chartId]) {
            this.chartInstances[chartId].destroy();
            delete this.chartInstances[chartId];
        }
    }

    /**
     * Tüm chart'ları temizle
     */
    destroyAllCharts() {
        Object.keys(this.chartInstances).forEach(chartId => {
            this.destroyChart(chartId);
        });
    }

    /**
     * Bar chart oluştur
     */
    createBarChart(canvasId, data, options = {}) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) {
            console.warn(`Canvas ${canvasId} bulunamadı`);
            return null;
        }

        this.destroyChart(canvasId);

        const defaultOptions = {
            type: 'bar',
            data: {
                labels: data.labels || [],
                datasets: [{
                    label: data.label || 'Veri',
                    data: data.values || [],
                    backgroundColor: data.backgroundColor || 'rgba(102, 126, 234, 0.8)',
                    borderColor: data.borderColor || 'rgba(102, 126, 234, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: options.showLegend !== false
                    },
                    datalabels: {
                        display: options.showLabels !== false,
                        color: '#fff',
                        font: {
                            weight: 'bold'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString('tr-TR');
                            }
                        }
                    }
                }
            }
        };

        const chartOptions = this.mergeOptions(defaultOptions, options);
        this.chartInstances[canvasId] = new Chart(ctx, chartOptions);
        
        return this.chartInstances[canvasId];
    }

    /**
     * Line chart oluştur
     */
    createLineChart(canvasId, data, options = {}) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) {
            console.warn(`Canvas ${canvasId} bulunamadı`);
            return null;
        }

        this.destroyChart(canvasId);

        const defaultOptions = {
            type: 'line',
            data: {
                labels: data.labels || [],
                datasets: data.datasets || [{
                    label: data.label || 'Veri',
                    data: data.values || [],
                    borderColor: data.borderColor || 'rgba(102, 126, 234, 1)',
                    backgroundColor: data.backgroundColor || 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: options.showLegend !== false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString('tr-TR');
                            }
                        }
                    }
                }
            }
        };

        const chartOptions = this.mergeOptions(defaultOptions, options);
        this.chartInstances[canvasId] = new Chart(ctx, chartOptions);
        
        return this.chartInstances[canvasId];
    }

    /**
     * Doughnut chart oluştur
     */
    createDoughnutChart(canvasId, data, options = {}) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) {
            console.warn(`Canvas ${canvasId} bulunamadı`);
            return null;
        }

        this.destroyChart(canvasId);

        const defaultOptions = {
            type: 'doughnut',
            data: {
                labels: data.labels || [],
                datasets: [{
                    data: data.values || [],
                    backgroundColor: data.backgroundColor || this.getDefaultColors(data.values?.length || 0),
                    borderColor: data.borderColor || '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: options.showLegend !== false,
                        position: 'bottom'
                    },
                    datalabels: {
                        display: options.showLabels !== false,
                        color: '#fff',
                        font: {
                            weight: 'bold',
                            size: 12
                        },
                        formatter: (value, ctx) => {
                            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return percentage + '%';
                        }
                    }
                }
            }
        };

        const chartOptions = this.mergeOptions(defaultOptions, options);
        this.chartInstances[canvasId] = new Chart(ctx, chartOptions);
        
        return this.chartInstances[canvasId];
    }

    /**
     * Horizontal bar chart oluştur
     */
    createHorizontalBarChart(canvasId, data, options = {}) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) {
            console.warn(`Canvas ${canvasId} bulunamadı`);
            return null;
        }

        this.destroyChart(canvasId);

        const defaultOptions = {
            type: 'bar',
            data: {
                labels: data.labels || [],
                datasets: [{
                    label: data.label || 'Veri',
                    data: data.values || [],
                    backgroundColor: data.backgroundColor || 'rgba(102, 126, 234, 0.8)',
                    borderColor: data.borderColor || 'rgba(102, 126, 234, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: options.showLegend !== false
                    },
                    datalabels: {
                        display: options.showLabels !== false,
                        color: '#333',
                        font: {
                            weight: 'bold'
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString('tr-TR');
                            }
                        }
                    }
                }
            }
        };

        const chartOptions = this.mergeOptions(defaultOptions, options);
        this.chartInstances[canvasId] = new Chart(ctx, chartOptions);
        
        return this.chartInstances[canvasId];
    }

    /**
     * Dashboard yıllık karşılaştırma chart'ı
     */
    createYearlyComparisonChart(data, metric = 'sales') {
        const isSales = metric === 'sales';
        const labels = data.labels || [];
        const datasets = data.datasets || [];

        const yAxisLabel = isSales ? 'Satış (USD - KDV Hariç)' : 'Miktar (Adet)';
        const yAxisColor = isSales ? 'rgba(102, 126, 234, 1)' : 'rgba(255, 159, 64, 1)';

        return this.createLineChart('dashYearlyChart', {
            labels: labels,
            datasets: datasets
        }, {
            showLegend: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: yAxisLabel,
                        color: yAxisColor
                    }
                }
            }
        });
    }

    /**
     * Top stores chart'ı
     */
    createTopStoresChart(data) {
        const top10 = data.slice(0, 10);
        
        return this.createBarChart('dashTopStoresChart', {
            labels: top10.map(s => s[0]),
            values: top10.map(s => s[1]),
            label: 'Satış (USD)',
            backgroundColor: 'rgba(102, 126, 234, 0.8)',
            borderColor: 'rgba(102, 126, 234, 1)'
        });
    }

    /**
     * Top salespeople chart'ı
     */
    createTopSalespeopleChart(data) {
        const top10 = data.slice(0, 10);
        
        return this.createBarChart('dashTopSalespeopleChart', {
            labels: top10.map(s => s[0]),
            values: top10.map(s => s[1]),
            label: 'Satış (USD)',
            backgroundColor: 'rgba(255, 159, 64, 0.8)',
            borderColor: 'rgba(255, 159, 64, 1)'
        });
    }

    /**
     * Top brands chart'ı
     */
    createTopBrandsChart(data) {
        const top10 = data.slice(0, 10);
        
        return this.createDoughnutChart('dashTopBrandsChart', {
            labels: top10.map(s => s[0]),
            values: top10.map(s => s[1]),
            backgroundColor: this.getDefaultColors(10)
        });
    }

    /**
     * Top categories chart'ı
     */
    createTopCategoriesChart(data) {
        const top10 = data.slice(0, 10);
        
        return this.createDoughnutChart('dashTopCategoriesChart', {
            labels: top10.map(s => s[0]),
            values: top10.map(s => s[1]),
            backgroundColor: this.getDefaultColors(10)
        });
    }

    /**
     * Top cities chart'ı
     */
    createTopCitiesChart(data) {
        const top10 = data.slice(0, 10);
        
        return this.createBarChart('dashTopCitiesChart', {
            labels: top10.map(s => s[0]),
            values: top10.map(s => s[1]),
            label: 'Satış (USD)',
            backgroundColor: 'rgba(75, 192, 192, 0.8)',
            borderColor: 'rgba(75, 192, 192, 1)'
        });
    }

    /**
     * Top products chart'ı
     */
    createTopProductsChart(data) {
        const top10 = data.slice(0, 10);
        
        return this.createHorizontalBarChart('dashTopProductsChart', {
            labels: top10.map(s => s[0].substring(0, 30) + (s[0].length > 30 ? '...' : '')),
            values: top10.map(s => s[1]),
            label: 'Satış (USD)',
            backgroundColor: 'rgba(153, 102, 255, 0.8)',
            borderColor: 'rgba(153, 102, 255, 1)'
        });
    }

    /**
     * Target chart'ı
     */
    createTargetChart(data) {
        const months = data.months || [];
        const targets = data.targets || [];
        const actuals = data.actuals || [];
        
        return this.createBarChart('targetChart', {
            labels: months,
            datasets: [{
                label: 'Hedef',
                data: targets,
                backgroundColor: 'rgba(255, 99, 132, 0.8)',
                borderColor: 'rgba(255, 99, 132, 1)'
            }, {
                label: 'Gerçekleşen',
                data: actuals,
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                borderColor: 'rgba(54, 162, 235, 1)'
            }]
        });
    }

    /**
     * Customer city chart'ı
     */
    createCustomerCityChart(data) {
        const sortedCities = data.sort((a, b) => b[1] - a[1]);
        
        return this.createDoughnutChart('customerCityChart', {
            labels: sortedCities.map(c => c[0]),
            values: sortedCities.map(c => c[1]),
            backgroundColor: this.getDefaultColors(sortedCities.length)
        });
    }

    /**
     * Customer trend chart'ı
     */
    createCustomerTrendChart(data) {
        const sortedYears = data.years || [];
        const datasets = data.datasets || [];
        
        return this.createLineChart('customerTrendChart', {
            labels: sortedYears,
            datasets: datasets
        });
    }

    /**
     * Inventory charts
     */
    createInventoryCharts(data) {
        // Brand chart
        this.createBarChart('invBrandChart', {
            labels: data.brands.map(b => b[0]),
            values: data.brands.map(b => b[1]),
            label: 'Stok Miktarı',
            backgroundColor: 'rgba(102, 126, 234, 0.8)'
        });

        // Category chart
        this.createDoughnutChart('invCategoryChart', {
            labels: data.categories.map(c => c[0]),
            values: data.categories.map(c => c[1]),
            backgroundColor: this.getDefaultColors(data.categories.length)
        });

        // Location chart
        this.createBarChart('invLocationChart', {
            labels: data.locations.map(l => l[0]),
            values: data.locations.map(l => l[1]),
            label: 'Stok Miktarı',
            backgroundColor: 'rgba(75, 192, 192, 0.8)'
        });

        // Top value products chart
        this.createHorizontalBarChart('invTopValueChart', {
            labels: data.topValue.map(p => (p.product || 'Bilinmeyen').substring(0, 30)),
            values: data.topValue.map(p => p.value),
            label: 'Değer (USD)',
            backgroundColor: 'rgba(255, 159, 64, 0.8)'
        });
    }

    /**
     * Varsayılan renk paleti
     */
    getDefaultColors(count) {
        const colors = [
            'rgba(102, 126, 234, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)'
        ];
        
        const result = [];
        for (let i = 0; i < count; i++) {
            result.push(colors[i % colors.length]);
        }
        return result;
    }

    /**
     * Options merge helper
     */
    mergeOptions(defaultOptions, customOptions) {
        return {
            ...defaultOptions,
            ...customOptions,
            data: {
                ...defaultOptions.data,
                ...customOptions.data
            },
            options: {
                ...defaultOptions.options,
                ...customOptions.options
            }
        };
    }

    /**
     * Chart'ı güncelle
     */
    updateChart(canvasId, newData) {
        if (this.chartInstances[canvasId]) {
            this.chartInstances[canvasId].data = newData;
            this.chartInstances[canvasId].update();
        }
    }

    /**
     * Chart'ı yeniden çiz
     */
    redrawChart(canvasId) {
        if (this.chartInstances[canvasId]) {
            this.chartInstances[canvasId].update();
        }
    }
}

// Global ChartManager instance oluştur
window.ChartManager = new ChartManager();

// Global fonksiyonlar (geriye uyumluluk için)
window.renderDashYearlyChart = (data) => window.ChartManager.createYearlyComparisonChart(data);
window.renderDashTopStoresChart = (data) => window.ChartManager.createTopStoresChart(data);
window.renderDashTopSalespeopleChart = (data) => window.ChartManager.createTopSalespeopleChart(data);
window.renderDashTopBrandsChart = (data) => window.ChartManager.createTopBrandsChart(data);
window.renderDashTopCategoriesChart = (data) => window.ChartManager.createTopCategoriesChart(data);
window.renderDashTopCitiesChart = (data) => window.ChartManager.createTopCitiesChart(data);
window.renderDashTopProductsChart = (data) => window.ChartManager.createTopProductsChart(data);
window.renderTargetChart = (data) => window.ChartManager.createTargetChart(data);
window.renderCustomerCityChart = (data) => window.ChartManager.createCustomerCityChart(data);
window.renderCustomerTrendChart = (data) => window.ChartManager.createCustomerTrendChart(data);
window.renderInventoryCharts = (data) => window.ChartManager.createInventoryCharts(data);

console.log('📈 Charts module loaded successfully');
