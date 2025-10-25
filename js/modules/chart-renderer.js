/**
 * @fileoverview Chart Renderer Module
 * @description Sales sekmesi için chart render fonksiyonları
 * @module chart-renderer
 */

/**
 * Chart Renderer - Sales sekmesi grafikleri
 */
export class ChartRenderer {
    constructor() {
        this.charts = {
            topCategory: null,
            topBrand: null,
            topProduct: null,
            topSalesPerson: null
        };
    }

    /**
     * Tüm chart'ları yok et
     */
    destroyAll() {
        Object.keys(this.charts).forEach(key => {
            if (this.charts[key]) {
                this.charts[key].destroy();
                this.charts[key] = null;
            }
        });
    }

    /**
     * Generic bar chart oluştur
     * @param {string} canvasId - Canvas element ID
     * @param {Array} data - [label, value] formatında veri
     * @param {Object} options - Chart seçenekleri
     * @returns {Chart} Chart instance
     */
    createBarChart(canvasId, data, options = {}) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const {
            backgroundColor = 'rgba(102, 126, 234, 0.8)',
            borderColor = 'rgba(102, 126, 234, 1)',
            truncateLabels = false,
            maxLabelLength = 30
        } = options;

        const labels = data.map(d => {
            const label = d[0];
            if (truncateLabels && label.length > maxLabelLength) {
                return label.substring(0, maxLabelLength) + '...';
            }
            return label;
        });

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Satış ($ - KDV Hariç)',
                        data: data.map(d => d[1]),
                        backgroundColor,
                        borderColor,
                        borderWidth: 1
                    }
                ]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: truncateLabels
                        ? {
                              callbacks: {
                                  title: function (context) {
                                      return data[context[0].dataIndex][0];
                                  }
                              }
                          }
                        : undefined
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            callback: function (value) {
                                return '$' + value.toLocaleString('tr-TR');
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Top Kategori chart'ı render et
     * @param {Array} data - [kategori, tutar] formatında veri
     */
    renderTopCategoryChart(data) {
        if (this.charts.topCategory) {
            this.charts.topCategory.destroy();
        }

        this.charts.topCategory = this.createBarChart('topCategoryChart', data, {
            backgroundColor: 'rgba(102, 126, 234, 0.8)',
            borderColor: 'rgba(102, 126, 234, 1)'
        });
    }

    /**
     * Top Marka chart'ı render et
     * @param {Array} data - [marka, tutar] formatında veri
     */
    renderTopBrandChart(data) {
        if (this.charts.topBrand) {
            this.charts.topBrand.destroy();
        }

        this.charts.topBrand = this.createBarChart('topBrandChart', data, {
            backgroundColor: 'rgba(56, 239, 125, 0.8)',
            borderColor: 'rgba(56, 239, 125, 1)'
        });
    }

    /**
     * Top Ürün chart'ı render et
     * @param {Array} data - [ürün, tutar] formatında veri
     */
    renderTopProductChart(data) {
        if (this.charts.topProduct) {
            this.charts.topProduct.destroy();
        }

        this.charts.topProduct = this.createBarChart('topProductChart', data, {
            backgroundColor: 'rgba(245, 87, 108, 0.8)',
            borderColor: 'rgba(245, 87, 108, 1)',
            truncateLabels: true,
            maxLabelLength: 30
        });
    }

    /**
     * Top Satış Temsilcisi chart'ı render et
     * @param {Array} data - [temsilci, tutar] formatında veri
     */
    renderTopSalesPersonChart(data) {
        if (this.charts.topSalesPerson) {
            this.charts.topSalesPerson.destroy();
        }

        this.charts.topSalesPerson = this.createBarChart('topSalesPersonChart', data, {
            backgroundColor: 'rgba(240, 147, 251, 0.8)',
            borderColor: 'rgba(240, 147, 251, 1)'
        });
    }

    /**
     * Tüm chart'ları render et
     * @param {Object} data - Top 10 listeleri
     */
    renderAll(data) {
        const { topCategories, topBrands, topProducts, topSalesPersons } = data;

        if (topCategories) this.renderTopCategoryChart(topCategories);
        if (topBrands) this.renderTopBrandChart(topBrands);
        if (topProducts) this.renderTopProductChart(topProducts);
        if (topSalesPersons) this.renderTopSalesPersonChart(topSalesPersons);
    }
}

// Global instance
export const chartRenderer = new ChartRenderer();

console.log('✅ ChartRenderer modülü yüklendi');
