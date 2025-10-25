/**
 * 🎨 UI Module
 * Tab switching, sidebar, filtreler ve genel UI yönetimi
 */

class UIManager {
    constructor() {
        this.currentTab = 'dashboard';
        this.activeFilters = {
            years: [],
            months: [],
            stores: [],
            channels: [],
            categories: []
        };
        this.init();
    }

    /**
     * UI Manager'ı başlat
     */
    init() {
        console.log('🎨 UIManager initialized');
        this.setupEventListeners();
        this.initializeFilters();
    }

    /**
     * Tab değiştir
     */
    switchTab(tabName) {
        console.log(`🔄 Tab değiştiriliyor: ${this.currentTab} → ${tabName}`);
        
        // Eski tab'ı gizle
        const oldTab = document.getElementById(`${this.currentTab}Tab`);
        if (oldTab) {
            oldTab.classList.remove('active');
        }
        
        // Eski tab butonunu deaktif et
        const oldButton = document.querySelector(`[onclick="switchTab('${this.currentTab}')"]`);
        if (oldButton) {
            oldButton.classList.remove('active');
        }
        
        // Yeni tab'ı göster
        const newTab = document.getElementById(`${tabName}Tab`);
        if (newTab) {
            newTab.classList.add('active');
        }
        
        // Yeni tab butonunu aktif et
        const newButton = document.querySelector(`[onclick="switchTab('${tabName}')"]`);
        if (newButton) {
            newButton.classList.add('active');
        }
        
        this.currentTab = tabName;
        
        // Tab'a özel işlemler
        this.handleTabSwitch(tabName);
    }

    /**
     * Tab değişim işlemleri
     */
    handleTabSwitch(tabName) {
        switch (tabName) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'targets':
                if (window.HedefTakip) {
                    window.HedefTakip.loadHedefTakip();
                }
                break;
            case 'customers':
                if (window.MusteriAnalizi) {
                    window.MusteriAnalizi.loadMusteriAnalizi();
                }
                break;
            case 'salesperson':
                if (window.SatisTemsilcisi) {
                    window.SatisTemsilcisi.loadSatisTemsilcisi();
                }
                break;
            case 'store':
                if (window.MagazaAnalizi) {
                    window.MagazaAnalizi.loadMagazaAnalizi();
                }
                break;
            case 'city':
                this.loadCityData();
                break;
            case 'stock':
                this.loadStockData();
                break;
            case 'time':
                this.loadTimeData();
                break;
            case 'product':
                this.loadProductData();
                break;
            default:
                console.warn(`⚠️ Bilinmeyen tab: ${tabName}`);
        }
    }

    /**
     * Dashboard verilerini yükle
     */
    loadDashboardData() {
        if (window.Dashboard) {
            window.Dashboard.updateDashboard();
        }
    }

    /**
     * Hedef verilerini yükle
     */
    loadTargetsData() {
        console.log('🎯 Hedef verileri yükleniyor...');
        // Hedef verilerini yükle ve göster
        this.renderTargetsTab();
    }

    /**
     * Müşteri verilerini yükle
     */
    loadCustomersData() {
        console.log('👥 Müşteri verileri yükleniyor...');
        // Müşteri verilerini yükle ve göster
        this.renderCustomersTab();
    }

    /**
     * Satış temsilcisi verilerini yükle
     */
    loadSalespersonData() {
        console.log('👨‍💼 Satış temsilcisi verileri yükleniyor...');
        // Satış temsilcisi verilerini yükle ve göster
        this.renderSalespersonTab();
    }

    /**
     * Mağaza verilerini yükle
     */
    loadStoreData() {
        console.log('🏪 Mağaza verileri yükleniyor...');
        // Mağaza verilerini yükle ve göster
        this.renderStoreTab();
    }

    /**
     * Şehir verilerini yükle
     */
    loadCityData() {
        console.log('🌍 Şehir verileri yükleniyor...');
        // Şehir verilerini yükle ve göster
        this.renderCityTab();
    }

    /**
     * Stok verilerini yükle
     */
    loadStockData() {
        console.log('📦 Stok verileri yükleniyor...');
        // Stok verilerini yükle ve göster
        this.renderStockTab();
    }

    /**
     * Zaman verilerini yükle
     */
    loadTimeData() {
        console.log('⏰ Zaman verileri yükleniyor...');
        // Zaman verilerini yükle ve göster
        this.renderTimeTab();
    }

    /**
     * Ürün verilerini yükle
     */
    loadProductData() {
        console.log('🎸 Ürün verileri yükleniyor...');
        // Ürün verilerini yükle ve göster
        this.renderProductTab();
    }

    /**
     * Filtreleri başlat
     */
    initializeFilters() {
        this.initializeYearFilters();
        this.initializeMonthFilters();
        this.initializeStoreFilters();
        this.initializeChannelFilters();
        this.initializeCategoryFilters();
    }

    /**
     * Yıl filtrelerini başlat
     */
    initializeYearFilters() {
        const yearContainer = document.getElementById('filterYear');
        if (!yearContainer) return;

        // Mevcut yılları al
        const years = this.getAvailableYears();
        
        years.forEach(year => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = year;
            checkbox.id = `year_${year}`;
            checkbox.addEventListener('change', () => this.handleFilterChange('years', year, checkbox.checked));
            
            const label = document.createElement('label');
            label.htmlFor = `year_${year}`;
            label.textContent = year;
            
            const div = document.createElement('div');
            div.appendChild(checkbox);
            div.appendChild(label);
            yearContainer.appendChild(div);
        });
    }

    /**
     * Ay filtrelerini başlat
     */
    initializeMonthFilters() {
        const monthContainer = document.getElementById('filterMonth');
        if (!monthContainer) return;

        const months = [
            { value: '1', label: 'Ocak' },
            { value: '2', label: 'Şubat' },
            { value: '3', label: 'Mart' },
            { value: '4', label: 'Nisan' },
            { value: '5', label: 'Mayıs' },
            { value: '6', label: 'Haziran' },
            { value: '7', label: 'Temmuz' },
            { value: '8', label: 'Ağustos' },
            { value: '9', label: 'Eylül' },
            { value: '10', label: 'Ekim' },
            { value: '11', label: 'Kasım' },
            { value: '12', label: 'Aralık' }
        ];
        
        months.forEach(month => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = month.value;
            checkbox.id = `month_${month.value}`;
            checkbox.addEventListener('change', () => this.handleFilterChange('months', month.value, checkbox.checked));
            
            const label = document.createElement('label');
            label.htmlFor = `month_${month.value}`;
            label.textContent = month.label;
            
            const div = document.createElement('div');
            div.appendChild(checkbox);
            div.appendChild(label);
            monthContainer.appendChild(div);
        });
    }

    /**
     * Mağaza filtrelerini başlat
     */
    initializeStoreFilters() {
        const storeContainer = document.getElementById('filterStore');
        if (!storeContainer) return;

        const stores = this.getAvailableStores();
        
        stores.forEach(store => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = store;
            checkbox.id = `store_${store.replace(/\s+/g, '_')}`;
            checkbox.addEventListener('change', () => this.handleFilterChange('stores', store, checkbox.checked));
            
            const label = document.createElement('label');
            label.htmlFor = `store_${store.replace(/\s+/g, '_')}`;
            label.textContent = store;
            
            const div = document.createElement('div');
            div.appendChild(checkbox);
            div.appendChild(label);
            storeContainer.appendChild(div);
        });
    }

    /**
     * Kanal filtrelerini başlat
     */
    initializeChannelFilters() {
        // Kanal filtreleri zaten HTML'de tanımlı
        const channelAll = document.getElementById('channelAll');
        const channelRetail = document.getElementById('channelRetail');
        const channelWholesale = document.getElementById('channelWholesale');
        const channelOnline = document.getElementById('channelOnline');
        const channelCorporate = document.getElementById('channelCorporate');
        const channelCentral = document.getElementById('channelCentral');

        if (channelAll) {
            channelAll.addEventListener('change', () => this.handleChannelFilter('channelAll'));
        }
        if (channelRetail) {
            channelRetail.addEventListener('change', () => this.handleChannelFilter('channelRetail'));
        }
        if (channelWholesale) {
            channelWholesale.addEventListener('change', () => this.handleChannelFilter('channelWholesale'));
        }
        if (channelOnline) {
            channelOnline.addEventListener('change', () => this.handleChannelFilter('channelOnline'));
        }
        if (channelCorporate) {
            channelCorporate.addEventListener('change', () => this.handleChannelFilter('channelCorporate'));
        }
        if (channelCentral) {
            channelCentral.addEventListener('change', () => this.handleChannelFilter('channelCentral'));
        }
    }

    /**
     * Kategori filtrelerini başlat
     */
    initializeCategoryFilters() {
        const categoryContainer = document.getElementById('filterCategory');
        if (!categoryContainer) return;

        const categories = this.getAvailableCategories();
        
        categories.forEach(category => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = category;
            checkbox.id = `category_${category.replace(/\s+/g, '_')}`;
            checkbox.addEventListener('change', () => this.handleFilterChange('categories', category, checkbox.checked));
            
            const label = document.createElement('label');
            label.htmlFor = `category_${category.replace(/\s+/g, '_')}`;
            label.textContent = category;
            
            const div = document.createElement('div');
            div.appendChild(checkbox);
            div.appendChild(label);
            categoryContainer.appendChild(div);
        });
    }

    /**
     * Filtre değişikliğini işle
     */
    handleFilterChange(filterType, value, isChecked) {
        if (isChecked) {
            if (!this.activeFilters[filterType].includes(value)) {
                this.activeFilters[filterType].push(value);
            }
        } else {
            this.activeFilters[filterType] = this.activeFilters[filterType].filter(v => v !== value);
        }
        
        console.log(`🔍 Filtre güncellendi: ${filterType}`, this.activeFilters[filterType]);
        
        // Veriyi yeniden filtrele
        this.applyFilters();
    }

    /**
     * Kanal filtresini işle
     */
    handleChannelFilter(clickedId) {
        console.log('🔄 Kanal filtresi değiştiriliyor:', clickedId);
        
        const channelAll = document.getElementById('channelAll').checked;
        const channelRetail = document.getElementById('channelRetail').checked;
        const channelWholesale = document.getElementById('channelWholesale').checked;
        const channelOnline = document.getElementById('channelOnline').checked;
        const channelCorporate = document.getElementById('channelCorporate').checked;
        const channelCentral = document.getElementById('channelCentral').checked;
        
        // Tümü seçildiyse diğerlerini kapat
        if (clickedId === 'channelAll' && channelAll) {
            document.getElementById('channelRetail').checked = false;
            document.getElementById('channelWholesale').checked = false;
            document.getElementById('channelOnline').checked = false;
            document.getElementById('channelCorporate').checked = false;
            document.getElementById('channelCentral').checked = false;
        }
        // Diğer bir kanal seçildiyse Tümü'yü kapat
        else if (clickedId !== 'channelAll' && (channelRetail || channelWholesale || channelOnline || channelCorporate || channelCentral)) {
            document.getElementById('channelAll').checked = false;
        }
        // Hiçbiri seçili değilse Tümü'yü aktif et
        else if (!channelAll && !channelRetail && !channelWholesale && !channelOnline && !channelCorporate && !channelCentral) {
            document.getElementById('channelAll').checked = true;
        }
        
        // Filtreleri uygula
        this.applyChannelFilter();
    }

    /**
     * Kanal filtresini uygula
     */
    applyChannelFilter() {
        const channelAll = document.getElementById('channelAll').checked;
        const channelRetail = document.getElementById('channelRetail').checked;
        const channelWholesale = document.getElementById('channelWholesale').checked;
        const channelOnline = document.getElementById('channelOnline').checked;
        const channelCorporate = document.getElementById('channelCorporate').checked;
        const channelCentral = document.getElementById('channelCentral').checked;
        
        // Aktif kanalları belirle
        const activeChannels = {
            all: channelAll,
            retail: channelRetail,
            wholesale: channelWholesale,
            online: channelOnline,
            corporate: channelCorporate,
            central: channelCentral
        };
        
        console.log('🏢 Aktif kanallar:', activeChannels);
        
        // Veriyi filtrele ve güncelle
        this.filterDataByChannels(activeChannels);
    }

    /**
     * Veriyi kanallara göre filtrele
     */
    filterDataByChannels(activeChannels) {
        if (!window.DataLoader || !window.DataLoader.allData) {
            console.warn('⚠️ Veri yüklenmedi');
            return;
        }
        
        let filteredData = window.DataLoader.allData;
        
        // Tümü seçili değilse filtrele
        if (!activeChannels.all) {
            filteredData = filteredData.filter(item => {
                const channel = item.channel || '';
                
                if (activeChannels.retail && channel.toLowerCase().includes('perakende')) return true;
                if (activeChannels.wholesale && channel.toLowerCase().includes('toptan')) return true;
                if (activeChannels.online && channel.toLowerCase().includes('online')) return true;
                if (activeChannels.corporate && channel.toLowerCase().includes('kurumsal')) return true;
                if (activeChannels.central && channel.toLowerCase().includes('merkezi')) return true;
                
                return false;
            });
        }
        
        // Filtrelenmiş veriyi güncelle
        window.DataLoader.filteredData = filteredData;
        
        console.log(`📊 Filtrelenmiş veri: ${filteredData.length} kayıt`);
        
        // Dashboard'ı güncelle
        if (window.Dashboard) {
            window.Dashboard.updateDashboard();
        }
    }

    /**
     * Filtreleri uygula
     */
    applyFilters() {
        if (!window.DataLoader || !window.DataLoader.allData) {
            console.warn('⚠️ Veri yüklenmedi');
            return;
        }
        
        let filteredData = window.DataLoader.allData;
        
        // Yıl filtresi
        if (this.activeFilters.years.length > 0) {
            filteredData = filteredData.filter(item => {
                const year = new Date(item.date).getFullYear().toString();
                return this.activeFilters.years.includes(year);
            });
        }
        
        // Ay filtresi
        if (this.activeFilters.months.length > 0) {
            filteredData = filteredData.filter(item => {
                const month = (new Date(item.date).getMonth() + 1).toString();
                return this.activeFilters.months.includes(month);
            });
        }
        
        // Mağaza filtresi
        if (this.activeFilters.stores.length > 0) {
            filteredData = filteredData.filter(item => {
                return this.activeFilters.stores.includes(item.partner);
            });
        }
        
        // Kategori filtresi
        if (this.activeFilters.categories.length > 0) {
            filteredData = filteredData.filter(item => {
                return this.activeFilters.categories.includes(item.category_1);
            });
        }
        
        // Filtrelenmiş veriyi güncelle
        window.DataLoader.filteredData = filteredData;
        
        console.log(`📊 Filtrelenmiş veri: ${filteredData.length} kayıt`);
        
        // Dashboard'ı güncelle
        if (window.Dashboard) {
            window.Dashboard.updateDashboard();
        }
    }

    /**
     * Mevcut yılları al
     */
    getAvailableYears() {
        if (!window.DataLoader || !window.DataLoader.allData) {
            return [];
        }
        
        const years = new Set();
        window.DataLoader.allData.forEach(item => {
            const year = new Date(item.date).getFullYear();
            years.add(year.toString());
        });
        
        return Array.from(years).sort();
    }

    /**
     * Mevcut mağazaları al
     */
    getAvailableStores() {
        if (!window.DataLoader || !window.DataLoader.allData) {
            return [];
        }
        
        const stores = new Set();
        window.DataLoader.allData.forEach(item => {
            if (item.partner && item.partner !== 'Analitik') {
                stores.add(item.partner);
            }
        });
        
        return Array.from(stores).sort();
    }

    /**
     * Mevcut kategorileri al
     */
    getAvailableCategories() {
        if (!window.DataLoader || !window.DataLoader.allData) {
            return [];
        }
        
        const categories = new Set();
        window.DataLoader.allData.forEach(item => {
            if (item.category_1) {
                categories.add(item.category_1);
            }
        });
        
        return Array.from(categories).sort();
    }

    /**
     * Event listener'ları kur
     */
    setupEventListeners() {
        // Tab butonları
        const tabButtons = document.querySelectorAll('[onclick^="switchTab"]');
        tabButtons.forEach(button => {
            const onclick = button.getAttribute('onclick');
            const tabName = onclick.match(/switchTab\('([^']+)'\)/)?.[1];
            if (tabName) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.switchTab(tabName);
                });
            }
        });
    }

    /**
     * Tab render fonksiyonları (placeholder)
     */
    renderTargetsTab() {
        console.log('🎯 Hedef tab render ediliyor...');
    }

    renderCustomersTab() {
        console.log('👥 Müşteri tab render ediliyor...');
    }

    renderSalespersonTab() {
        console.log('👨‍💼 Satış temsilcisi tab render ediliyor...');
    }

    renderStoreTab() {
        console.log('🏪 Mağaza tab render ediliyor...');
    }

    renderCityTab() {
        console.log('🌍 Şehir tab render ediliyor...');
    }

    renderStockTab() {
        console.log('📦 Stok tab render ediliyor...');
    }

    renderTimeTab() {
        console.log('⏰ Zaman tab render ediliyor...');
    }

    renderProductTab() {
        console.log('🎸 Ürün tab render ediliyor...');
    }
}

// Global UIManager instance oluştur
window.UIManager = new UIManager();

// Global fonksiyonlar (geriye uyumluluk için)
window.switchTab = (tabName) => window.UIManager.switchTab(tabName);
window.handleChannelFilter = (channelId) => window.UIManager.handleChannelFilter(channelId);

console.log('🎨 UI module loaded successfully');