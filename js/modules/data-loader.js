// ==================== DATA LOADING MODULE ====================
// Veri yükleme, metadata, cache yönetimi

// ===== LOADING PROGRESS MANAGEMENT =====
window.updateLoadingProgress = function(percentage, message) {
    console.log(`📊 Loading: ${percentage}% - ${message}`);
    
    // Progress bar'ı güncelle
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const loadingMessage = document.getElementById('loadingMessage');
    
    if (progressBar) {
        progressBar.style.width = percentage + '%';
    }
    
    if (progressText) {
        progressText.textContent = Math.round(percentage) + '%';
    }
    
    if (loadingMessage) {
        loadingMessage.textContent = message;
    }
    
    // Step'leri güncelle
    updateLoadingSteps(percentage);
};

window.updateLoadingSteps = function(percentage) {
    const steps = [
        { id: 'step1', threshold: 10, text: '🔄 Sayfa başlatılıyor...' },
        { id: 'step2', threshold: 30, text: '📊 Veri dosyaları yükleniyor...' },
        { id: 'step3', threshold: 60, text: '🎯 Hedefler yükleniyor...' },
        { id: 'step4', threshold: 90, text: '✅ Hazırlanıyor...' }
    ];
    
    steps.forEach(step => {
        const element = document.getElementById(step.id);
        if (element) {
            if (percentage >= step.threshold) {
                element.style.display = 'block';
                element.style.opacity = '1';
                element.style.color = '#4ade80';
                element.textContent = step.text;
            }
        }
    });
};

// ===== GLOBAL DATA LOADING FUNCTION =====
window.loadData = async function() {
    console.log('🚀 loadData fonksiyonu çağrıldı');
    try {
        // Gerçekçi loading başlat
        updateLoadingProgress(10, '🔄 Sayfa başlatılıyor...');
        
        // Loading progress'i güncelle
        if (typeof dataLoadProgress !== 'undefined') {
            dataLoadProgress.dataFiles = true;
            checkLoadingComplete();
        }
        
        if (document.getElementById('dataStatus')) {
            document.getElementById('dataStatus').innerHTML = '<span class="status-badge" style="background:#ffc107;color:#000;">⏳ Yükleniyor...</span>';
        }
        
        // tableContainer artık Dashboard'da yok, null check ekledik
        const tableContainer = document.getElementById('tableContainer');
        if (tableContainer) {
            tableContainer.innerHTML = '<div style="text-align:center;padding:50px;font-size:1.2em;">⏳ Veriler yükleniyor, lütfen bekleyin...</div>';
        }
        
        // Hedefleri yükle (paralel olarak)
        updateLoadingProgress(20, '🎯 Hedefler yükleniyor...');
        if (typeof loadCentralTargets === 'function') {
            loadCentralTargets();
        }
        
        // İlk olarak metadata'yı yükle
        updateLoadingProgress(30, '📊 Metadata yükleniyor...');
        const metadata = await loadMetadata();
        console.log('📊 Metadata yüklendi:', metadata);
        
        if (!metadata || !metadata.years || metadata.years.length === 0) {
            throw new Error('Geçerli yıl verisi bulunamadı');
        }
        
        // Tüm yılları yükle
        updateLoadingProgress(40, '📦 Veri dosyaları yükleniyor...');
        await loadAllYearsData(metadata);
        
        // Final loading
        updateLoadingProgress(95, '✅ Son hazırlıklar...');
        
        console.log('✅ Veri yükleme tamamlandı');
        
    } catch (error) {
        console.error('❌ Veri yükleme hatası:', error);
        if (document.getElementById('dataStatus')) {
            document.getElementById('dataStatus').innerHTML = '<span class="status-badge" style="background:#dc3545;color:#fff;">❌ Hata</span>';
        }
    }
};

// ===== GLOBAL METADATA LOADING FUNCTION =====
window.loadMetadata = async function() {
    try {
        // Akıllı Cache: Metadata için saatlik versiyon
        const version = getHourlyVersion();
        const response = await fetch(`data-metadata.json?v=${version}`, {
            headers: {
                'Cache-Control': 'public, max-age=3600' // 1 saat cache
            }
        });
        if (!response.ok) throw new Error('Metadata yüklenemedi');
        metadata = await response.json();
        console.log('✅ Metadata yüklendi:', metadata);
        return metadata;
    } catch (error) {
        console.error('❌ Metadata yükleme hatası:', error);
        throw error;
    }
};

// ===== GLOBAL YEAR DATA LOADING FUNCTION =====
window.loadYearData = async function(year) {
    if (loadedYears.has(year) && loadedDataCache[year]) {
        console.log(`⏭️ ${year} zaten yüklü, cache'den döndürülüyor...`);
        return loadedDataCache[year];
    }
    
    try {
        console.log(`📦 ${year} yükleniyor...`);
        
        // GZIP dosyasını indir - Akıllı Cache ile
        const version = getDailyVersion(); // Günlük versiyon
        const response = await fetch(`data-${year}.json.gz?v=${version}`, {
            headers: {
                'Cache-Control': 'public, max-age=86400' // 24 saat cache
            }
        });
        if (!response.ok) throw new Error(`${year} verisi bulunamadı`);
        
        // ArrayBuffer olarak al
        const arrayBuffer = await response.arrayBuffer();
        
        // GZIP'i aç
        const decompressed = pako.ungzip(new Uint8Array(arrayBuffer), { to: 'string' });
        const yearData = JSON.parse(decompressed);
        
        // Cache'e kaydet
        loadedYears.add(year);
        loadedDataCache[year] = yearData;
        
        console.log(`✅ ${year} yılı yüklendi: ${yearData.details?.length || 0} kayıt`);
        return yearData;
        
    } catch (error) {
        console.error(`❌ ${year} yükleme hatası:`, error);
        throw error;
    }
};

// Tüm yılları yükleyen fonksiyon
window.loadAllYearsData = async function(metadata) {
    console.log('⏳ Tüm yıllar yükleniyor...');
    const yearsToLoad = metadata.years;
    const totalYears = yearsToLoad.length;
    let loadedYears = 0;
    
    // En son yılı önce yükle
    const latestYear = Math.max(...yearsToLoad);
    updateLoadingProgress(50, `📦 ${latestYear} yılı yükleniyor...`);
    await loadYearData(latestYear);
    loadedYears++;
    
    // Progress güncelle
    const progress = 50 + (loadedYears / totalYears) * 30;
    updateLoadingProgress(progress, `📦 ${latestYear} yılı yüklendi (${loadedYears}/${totalYears})`);
    
    // Diğer yılları sırayla yükle
    for (const year of yearsToLoad.sort((a, b) => b - a)) {
        if (year !== latestYear) {
            updateLoadingProgress(50 + (loadedYears / totalYears) * 30, `📦 ${year} yılı yükleniyor...`);
            await loadYearData(year);
            loadedYears++;
            
            const currentProgress = 50 + (loadedYears / totalYears) * 30;
            updateLoadingProgress(currentProgress, `📦 ${year} yılı yüklendi (${loadedYears}/${totalYears})`);
        }
    }
    
    console.log('✅ Tüm yıllar yükleme işlemi tamamlandı.');
    
    // Data status'ü güncelle
    const allYears = metadata.years.sort().join(', ');
    document.getElementById('dataStatus').innerHTML = `<span class="status-badge status-success">✅ Tüm Yıllar (${allYears})</span>`;
    
    // KALICI ÇÖZÜM: Özet kartlarını burada güncelle
    console.log('📊 Özet kartları güncelleniyor (loadAllYearsData sonrası)...');
    if (typeof window.updateDashboardSummaryCards === 'function') {
        // setTimeout ile DOM'un hazır olmasını bekle
        setTimeout(() => {
            window.updateDashboardSummaryCards();
        }, 500);
    }
    
    // Loading progress'i tamamla
    dataLoadProgress.ready = true;
    checkLoadingComplete();
};

// Stok konumlarını yükleyen fonksiyon
window.loadStockLocations = async function() {
    try {
        const response = await fetch('stock-locations.json');
        if (!response.ok) throw new Error('Stock locations yüklenemedi');
        const data = await response.json();
        stockLocations = data.stock_locations || {};
        console.log('✅ Stok konumları yüklendi:', Object.keys(stockLocations).length, 'lokasyon');
        return stockLocations;
    } catch (error) {
        console.error('❌ Stock locations hatası:', error);
        return {};
    }
};

// Merkezi hedefleri yükleyen fonksiyon
window.loadCentralTargets = async function() {
    try {
        const response = await fetch('targets.json');
        if (response.ok) {
            centralTargets = await response.json();
            console.log('✅ Merkezi hedefler yüklendi:', centralTargets);
            
            // Loading progress'i güncelle
            dataLoadProgress.targets = true;
            checkLoadingComplete();
            
            return true;
        } else {
            console.warn('⚠️ targets.json yüklenemedi, varsayılan hedefler kullanılacak');
            return false;
        }
    } catch (error) {
        console.error('❌ Hedef yükleme hatası:', error);
        return false;
    }
};

// Tüm mağazaların hedeflerini yükleyen fonksiyon
window.loadAllStoresTargets = async function() {
    try {
        const response = await fetch('store-targets.json');
        if (response.ok) {
            allStoresTargets = await response.json();
            console.log('✅ Mağaza hedefleri yüklendi:', Object.keys(allStoresTargets).length, 'mağaza');
            return true;
        } else {
            console.warn('⚠️ store-targets.json yüklenemedi, varsayılan hedefler kullanılacak');
            return false;
        }
    } catch (error) {
        console.error('❌ Mağaza hedefleri yükleme hatası:', error);
        return false;
    }
};

// Yıllık hedefi yükleyen fonksiyon
window.loadYearlyTarget = async function() {
    try {
        const response = await fetch('yearly-target.json');
        if (response.ok) {
            yearlyTarget = await response.json();
            console.log('✅ Yıllık hedef yüklendi:', yearlyTarget);
            return true;
        } else {
            console.warn('⚠️ yearly-target.json yüklenemedi, varsayılan hedef kullanılacak');
            return false;
        }
    } catch (error) {
        console.error('❌ Yıllık hedef yükleme hatası:', error);
        return false;
    }
};

// Aylık hedefi yükleyen fonksiyon
window.loadMonthlyTarget = async function() {
    try {
        const response = await fetch('monthly-target.json');
        if (response.ok) {
            monthlyTarget = await response.json();
            console.log('✅ Aylık hedef yüklendi:', monthlyTarget);
            return true;
        } else {
            console.warn('⚠️ monthly-target.json yüklenemedi, varsayılan hedef kullanılacak');
            return false;
        }
    } catch (error) {
        console.error('❌ Aylık hedef yükleme hatası:', error);
        return false;
    }
};

console.log('✅ Data-loader module loaded');

