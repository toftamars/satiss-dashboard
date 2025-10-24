// ==================== DASHBOARD MODULE ====================
// Dashboard UI, özet kartları, loading yönetimi

// ===== DASHBOARD SUMMARY CARDS UPDATE FUNCTION =====
window.updateDashboardSummaryCards = function() {
    console.log('📊 Özet kartları güncelleniyor...');
    console.log('📦 loadedDataCache:', Object.keys(window.loadedDataCache || {}));
    
    try {
        let totalSales = 0;
        let totalQty = 0;
        let totalCustomers = new Set();
        let totalProducts = new Set();
        let totalStores = new Set();
        let totalSalespeople = new Set();
        let totalTransactions = 0;
        
        // Tüm yılların verilerini topla
        for (const year in window.loadedDataCache) {
            const yearData = loadedDataCache[year];
            if (yearData && yearData.details) {
                yearData.details.forEach(record => {
                    // Satış tutarı (KDV hariç)
                    const salesAmount = parseFloat(record['Satış Tutarı (KDV Hariç)']) || 0;
                    totalSales += salesAmount;
                    
                    // Miktar
                    const qty = parseFloat(record['Miktar']) || 0;
                    totalQty += qty;
                    
                    // Müşteri
                    if (record['Müşteri']) {
                        totalCustomers.add(record['Müşteri']);
                    }
                    
                    // Ürün
                    if (record['Ürün']) {
                        totalProducts.add(record['Ürün']);
                    }
                    
                    // Mağaza
                    if (record['Mağaza']) {
                        totalStores.add(record['Mağaza']);
                    }
                    
                    // Temsilci
                    if (record['Temsilci']) {
                        totalSalespeople.add(record['Temsilci']);
                    }
                    
                    // İşlem sayısı (her kayıt bir işlem)
                    totalTransactions++;
                });
            }
        }
        
        // Günlük ortalama hesapla (toplam gün sayısı)
        const totalDays = Object.keys(loadedDataCache).length * 365; // Yaklaşık
        const dailyAverage = totalDays > 0 ? totalSales / totalDays : 0;
        
        // Sepet ortalaması hesapla
        const basketAverage = totalTransactions > 0 ? totalSales / totalTransactions : 0;
        
        // DOM elementlerini güncelle
        const elements = {
            dashTotalSales: document.getElementById('dashTotalSales'),
            dashTotalQty: document.getElementById('dashTotalQty'),
            dashTotalCustomers: document.getElementById('dashTotalCustomers'),
            dashTotalProducts: document.getElementById('dashTotalProducts'),
            dashTotalStores: document.getElementById('dashTotalStores'),
            dashTotalSalespeople: document.getElementById('dashTotalSalespeople'),
            dashDailyAverage: document.getElementById('dashDailyAverage'),
            dashBasketAverage: document.getElementById('dashBasketAverage')
        };
        
        // Değerleri güncelle
        if (elements.dashTotalSales) {
            elements.dashTotalSales.textContent = '$' + totalSales.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        }
        
        if (elements.dashTotalQty) {
            elements.dashTotalQty.textContent = totalQty.toLocaleString('tr-TR');
        }
        
        if (elements.dashTotalCustomers) {
            elements.dashTotalCustomers.textContent = totalCustomers.size.toLocaleString('tr-TR');
        }
        
        if (elements.dashTotalProducts) {
            elements.dashTotalProducts.textContent = totalProducts.size.toLocaleString('tr-TR');
        }
        
        if (elements.dashTotalStores) {
            elements.dashTotalStores.textContent = totalStores.size.toLocaleString('tr-TR');
        }
        
        if (elements.dashTotalSalespeople) {
            elements.dashTotalSalespeople.textContent = totalSalespeople.size.toLocaleString('tr-TR');
        }
        
        if (elements.dashDailyAverage) {
            elements.dashDailyAverage.textContent = '$' + dailyAverage.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        }
        
        if (elements.dashBasketAverage) {
            elements.dashBasketAverage.textContent = '$' + basketAverage.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        }
        
        console.log('✅ Özet kartları güncellendi:', {
            totalSales: totalSales,
            totalQty: totalQty,
            totalCustomers: totalCustomers.size,
            totalProducts: totalProducts.size,
            totalStores: totalStores.size,
            totalSalespeople: totalSalespeople.size,
            dailyAverage: dailyAverage,
            basketAverage: basketAverage
        });
        
    } catch (error) {
        console.error('❌ Özet kartları güncelleme hatası:', error);
    }
};

// Loading ekranı yönetimi
window.checkLoadingComplete = function() {
    let progress = 0;
    if (dataLoadProgress.pageInit) progress += 25;
    if (dataLoadProgress.dataFiles) progress += 50;
    if (dataLoadProgress.targets) progress += 20;
    if (dataLoadProgress.ready) progress += 5;
    
    // Progress'i güncelle
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('progressText').textContent = Math.round(progress) + '%';
    
    // Step'leri güncelle
    if (dataLoadProgress.pageInit) {
        document.getElementById('step1').style.display = 'block';
        document.getElementById('step1').style.opacity = '1';
        document.getElementById('step1').style.color = '#4ade80';
    }
    
    if (dataLoadProgress.dataFiles) {
        document.getElementById('step2').style.display = 'block';
        document.getElementById('step2').style.opacity = '1';
        document.getElementById('step2').style.color = '#4ade80';
    }
    
    if (dataLoadProgress.targets) {
        document.getElementById('step3').style.display = 'block';
        document.getElementById('step3').style.opacity = '1';
        document.getElementById('step3').style.color = '#4ade80';
    }
    
    if (dataLoadProgress.ready) {
        document.getElementById('step4').style.display = 'block';
        document.getElementById('step4').style.opacity = '1';
        document.getElementById('step4').style.color = '#4ade80';
        
        // %100'e ulaştıysak loading'i gizle - TÜM VERİLER YÜKLENENE KADAR BEKLE
        if (progress >= 100) {
            console.log('✅ Tüm veriler yüklendi, loading ekranı kapatılıyor...');
            
            // Final progress update
            updateLoadingProgress(100, '🎉 Hazır!');
            
            // Loading ekranını kapat
            setTimeout(() => {
                const loadingScreen = document.getElementById('loadingScreen');
                const mainContainer = document.getElementById('mainContainer');
                
                if (loadingScreen) {
                    loadingScreen.style.opacity = '0';
                    loadingScreen.style.transition = 'opacity 0.5s ease';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        if (mainContainer) mainContainer.style.display = 'block';
                    }, 500);
                }
            }, 1000); // 1 saniye ekstra bekle
        }
    }
};

// Dashboard başlatma fonksiyonu
window.startRealLoading = function() {
    console.log('🚀 startRealLoading başlatıldı');
    
    // Step 1: Session kontrolü
    const sessionData = sessionStorage.getItem('otpVerified');
    const sessionExpiry = sessionStorage.getItem('sessionExpiry');
    
    if (sessionData === 'true' && sessionExpiry && new Date().getTime() < parseInt(sessionExpiry)) {
        // Session geçerli, dashboard'ı göster
        console.log('✅ Geçerli session bulundu, dashboard yükleniyor...');
        window.showDashboardAfterAuth();
    } else {
        // Session yok veya süresi dolmuş, direkt dashboard aç
        console.log('🔐 Session yok veya süresi dolmuş, direkt dashboard açılıyor...');
        // Direkt dashboard açılacak - authentication bypass
    }
    
    // Step 2: Sayfa başlatılıyor
    dataLoadProgress.pageInit = true;
    checkLoadingComplete();
    
    // Gerçek veri yükleme işlemini başlat - HER DURUMDA
    console.log('📊 loadData fonksiyonu çağrılıyor...');
    if (typeof window.loadData === 'function') {
        window.loadData();
    } else {
        console.error('❌ loadData fonksiyonu bulunamadı!');
    }
};

console.log('✅ Dashboard module loaded');

