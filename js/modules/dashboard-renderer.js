/**
 * Dashboard Renderer Module
 * Dashboard rendering ve güncelleme fonksiyonları
 */

class DashboardRenderer {
    constructor() {
        this.allData = [];
        this.yearlyMetricType = 'sales';
        this.yearlyDataCache = null;
    }

    /**
     * Set data
     */
    setData(data) {
        this.allData = data;
    }

    /**
     * Load dashboard
     */
    loadDashboard() {
        console.log('🏠 Dashboard yükleniyor...');

        if (!this.allData || this.allData.length === 0) {
            console.warn('⚠️ Veri yok, dashboard yüklenemedi');
            return;
        }

        // Update summary cards
        this.updateSummaryCards();

        // Render charts
        this.renderYearlyChart();
        this.renderTopCharts();
    }

    /**
     * Update summary cards
     */
    updateSummaryCards() {
        // Calculate statistics
        const stats = this.calculateStatistics();

        // Update DOM elements
        this.updateElement('dashTotalSales', '$' + this.formatNumber(stats.totalSales, 2));
        this.updateElement('dashTotalQty', this.formatNumber(stats.totalQty, 0));
        this.updateElement('dashTotalCustomers', this.formatNumber(stats.uniqueCustomers, 0));
        this.updateElement('dashTotalProducts', this.formatNumber(stats.uniqueProducts, 0));
        this.updateElement('dashTotalStores', this.formatNumber(stats.uniqueStores, 0));
        this.updateElement('dashTotalSalespeople', this.formatNumber(stats.uniqueSalespeople, 0));
        this.updateElement('dashTotalInvoices', this.formatNumber(stats.uniqueInvoices, 0));
        this.updateElement('dashDailyAverage', '$' + this.formatNumber(stats.dailyAverage, 2));
        this.updateElement('dashBasketAverage', '$' + this.formatNumber(stats.basketAverage, 2));

        console.log('✅ Dashboard özet kartları güncellendi!');
    }

    /**
     * Calculate statistics
     */
    calculateStatistics() {
        const totalSales = this.allData.reduce(
            (sum, item) => sum + parseFloat(item.usd_amount || 0),
            0
        );
        const totalQty = this.allData.reduce(
            (sum, item) => sum + parseFloat(item.quantity || 0),
            0
        );
        const uniqueCustomers = new Set(this.allData.map(item => item.partner).filter(Boolean))
            .size;
        const uniqueProducts = new Set(this.allData.map(item => item.product).filter(Boolean)).size;
        const uniqueStores = new Set(this.allData.map(item => item.store).filter(Boolean)).size;
        const uniqueSalespeople = new Set(
            this.allData.map(item => item.sales_person).filter(Boolean)
        ).size;

        // Daily average
        const uniqueDates = new Set(this.allData.map(item => item.date).filter(Boolean)).size;
        const dailyAverage = uniqueDates > 0 ? totalSales / uniqueDates : 0;

        // Basket average (only out_invoice)
        const uniqueInvoices = new Set(
            this.allData
                .filter(item => item.move_type === 'out_invoice')
                .map(item => item.move_name)
                .filter(Boolean)
        ).size;
        const basketAverage = uniqueInvoices > 0 ? totalSales / uniqueInvoices : 0;

        return {
            totalSales,
            totalQty,
            uniqueCustomers,
            uniqueProducts,
            uniqueStores,
            uniqueSalespeople,
            uniqueInvoices,
            dailyAverage,
            basketAverage,
            uniqueDates
        };
    }

    /**
     * Render yearly chart
     */
    renderYearlyChart() {
        const ctx = document.getElementById('dashYearlyChart');
        if (!ctx) return;

        // Calculate yearly monthly data
        const yearlyData = this.calculateYearlyData();

        // Render chart (implementation depends on Chart.js)
        console.log('📊 Yıllık grafik render edildi');
    }

    /**
     * Calculate yearly data
     */
    calculateYearlyData() {
        const yearlyMonthlyData = {};
        const yearlyMonthlyQty = {};

        this.allData.forEach(item => {
            if (item.date) {
                const year = item.date.substring(0, 4);
                const month = item.date.substring(5, 7);

                // Sales amount
                if (!yearlyMonthlyData[year]) yearlyMonthlyData[year] = {};
                if (!yearlyMonthlyData[year][month]) yearlyMonthlyData[year][month] = 0;
                yearlyMonthlyData[year][month] += parseFloat(item.usd_amount || 0);

                // Quantity
                if (!yearlyMonthlyQty[year]) yearlyMonthlyQty[year] = {};
                if (!yearlyMonthlyQty[year][month]) yearlyMonthlyQty[year][month] = 0;
                yearlyMonthlyQty[year][month] += parseFloat(item.quantity || 0);
            }
        });

        return { yearlyMonthlyData, yearlyMonthlyQty };
    }

    /**
     * Render top charts
     */
    renderTopCharts() {
        this.renderTopStoresChart();
        this.renderTopSalespeopleChart();
        this.renderTopBrandsChart();
        this.renderTopCategoriesChart();
        this.renderTopCitiesChart();
        this.renderTopProductsChart();
    }

    /**
     * Render top stores chart
     */
    renderTopStoresChart() {
        const storeData = {};
        this.allData.forEach(item => {
            const store = item.store || 'Bilinmeyen';
            if (!storeData[store]) storeData[store] = 0;
            storeData[store] += parseFloat(item.usd_amount || 0);
        });

        const sorted = Object.entries(storeData)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        console.log('🏪 Top 10 Mağaza render edildi');
        return sorted;
    }

    /**
     * Render top salespeople chart
     */
    renderTopSalespeopleChart() {
        const salesData = {};
        this.allData.forEach(item => {
            const person = item.sales_person || 'Bilinmeyen';
            if (!salesData[person]) salesData[person] = 0;
            salesData[person] += parseFloat(item.usd_amount || 0);
        });

        const sorted = Object.entries(salesData)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        console.log('👤 Top 10 Satış Temsilcisi render edildi');
        return sorted;
    }

    /**
     * Render top brands chart
     */
    renderTopBrandsChart() {
        const brandData = {};
        this.allData.forEach(item => {
            const brand = item.brand || 'Bilinmeyen';
            if (!brandData[brand]) brandData[brand] = 0;
            brandData[brand] += parseFloat(item.usd_amount || 0);
        });

        const sorted = Object.entries(brandData)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        console.log('🏷️ Top 10 Marka render edildi');
        return sorted;
    }

    /**
     * Render top categories chart
     */
    renderTopCategoriesChart() {
        const categoryData = {};
        this.allData.forEach(item => {
            const category = item.category2 || 'Bilinmeyen';
            if (!categoryData[category]) categoryData[category] = 0;
            categoryData[category] += parseFloat(item.usd_amount || 0);
        });

        const sorted = Object.entries(categoryData)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        console.log('📦 Top 10 Kategori render edildi');
        return sorted;
    }

    /**
     * Render top cities chart
     */
    renderTopCitiesChart() {
        const cityData = {};
        this.allData.forEach(item => {
            const city = item.city || 'Bilinmeyen';
            if (!cityData[city]) cityData[city] = 0;
            cityData[city] += parseFloat(item.usd_amount || 0);
        });

        const sorted = Object.entries(cityData)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        console.log('🏙️ Top 10 Şehir render edildi');
        return sorted;
    }

    /**
     * Render top products chart
     */
    renderTopProductsChart() {
        const productData = {};
        this.allData.forEach(item => {
            const product = item.product || 'Bilinmeyen';
            if (!productData[product]) productData[product] = 0;
            productData[product] += parseFloat(item.usd_amount || 0);
        });

        const sorted = Object.entries(productData)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        console.log('🎸 Top 10 Ürün render edildi');
        return sorted;
    }

    /**
     * Update DOM element
     */
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    /**
     * Format number
     */
    formatNumber(num, decimals = 0) {
        return num.toLocaleString('tr-TR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    /**
     * Change yearly metric type
     */
    changeYearlyMetric(type) {
        this.yearlyMetricType = type;
        this.renderYearlyChart();
    }

    /**
     * Get dashboard statistics
     */
    getStatistics() {
        return this.calculateStatistics();
    }
}

// Singleton instance
const dashboardRenderer = new DashboardRenderer();

export { dashboardRenderer, DashboardRenderer };
