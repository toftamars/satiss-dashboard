/**
 * 🎯 Hedef Takip Modülü
 * Mağaza hedeflerini yönetir, gerçekleşmeleri takip eder
 */

class HedefTakip {
    constructor() {
        this.targetChart = null;
        this.centralTargets = {};
        this.init();
    }

    init() {
        console.log('🎯 HedefTakip initialized');
    }

    /**
     * Hedef takip sekmesini yükle
     */
    async loadHedefTakip() {
        console.log('📊 Hedef Takip yükleniyor...');
        
        try {
            // Merkezi hedefleri yükle
            await this.loadCentralTargets();
            
            // Tüm mağazaların hedeflerini göster
            this.loadAllStoresTargets();
            
        } catch (error) {
            console.error('❌ Hedef takip yükleme hatası:', error);
            if (window.ErrorHandler) {
                window.ErrorHandler.handleError(error);
            }
        }
    }

    /**
     * Merkezi hedefleri yükle (targets.json)
     */
    async loadCentralTargets() {
        try {
            const response = await fetch('data/targets.json?' + Date.now());
            if (response.ok) {
                this.centralTargets = await response.json();
                console.log('✅ Merkezi hedefler yüklendi:', this.centralTargets);
                return true;
            }
        } catch (error) {
            console.warn('⚠️ targets.json yüklenemedi, varsayılan hedefler kullanılacak');
            this.centralTargets = {
                yearly: {},
                monthly: {}
            };
        }
        return false;
    }

    /**
     * Tüm mağazaların hedeflerini göster
     */
    loadAllStoresTargets() {
        const year = document.getElementById('targetFilterYear')?.value || new Date().getFullYear();
        const month = document.getElementById('targetFilterMonth')?.value || '';
        const container = document.getElementById('allStoresTargetsContainer');
        
        if (!container) {
            console.warn('⚠️ allStoresTargetsContainer bulunamadı');
            return;
        }

        console.log('📊 Mağaza hedefleri yükleniyor:', {year, month});

        // Tüm mağazaları bul
        const allStores = new Set();
        const allData = window.DataLoader?.allData || [];
        
        allData.forEach(item => {
            if (item.store && item.store !== 'Analitik' && !item.store.toLowerCase().includes('eğitim')) {
                allStores.add(item.store);
            }
        });

        const storesList = Array.from(allStores).sort();

        // Her mağaza için hedef ve gerçekleşme hesapla
        const storesData = storesList.map(storeName => {
            const cleanStoreName = storeName.replace(/^\[\d+\]\s*/, '');
            
            // Hedefi al
            let target = this.getTarget(year, month, cleanStoreName);
            
            // Gerçekleşmeyi hesapla
            const storeData = allData.filter(item => {
                if (item.store !== storeName) return false;
                if (!item.date) return false;
                
                if (month) {
                    return item.date.startsWith(`${year}-${month}`);
                } else {
                    return item.date.startsWith(year);
                }
            });
            
            const achieved = storeData.reduce((sum, item) => sum + parseFloat(item.usd_amount || 0), 0);
            const percentage = target > 0 ? (achieved / target * 100) : 0;
            const remaining = target - achieved;
            
            // Kalan gün hesapla
            const today = new Date();
            let daysLeft = 0;
            
            if (month) {
                const lastDay = new Date(year, parseInt(month), 0);
                daysLeft = Math.max(0, Math.ceil((lastDay - today) / (1000 * 60 * 60 * 24)));
            } else {
                const lastDay = new Date(year, 11, 31);
                daysLeft = Math.max(0, Math.ceil((lastDay - today) / (1000 * 60 * 60 * 24)));
            }
            
            const dailyRequired = daysLeft > 0 ? remaining / daysLeft : 0;
            
            return {
                name: storeName,
                target,
                achieved,
                percentage,
                remaining,
                daysLeft,
                dailyRequired
            };
        });

        // Sırala (yüzdeye göre)
        storesData.sort((a, b) => b.percentage - a.percentage);

        // HTML oluştur
        this.renderStoresTargets(container, storesData, month);
    }

    /**
     * Hedefi al (centralTargets veya localStorage)
     */
    getTarget(year, month, storeName) {
        let target = 0;
        
        if (month) {
            // Aylık hedef
            if (this.centralTargets.monthly && this.centralTargets.monthly[year]) {
                const targetKey = this.findTargetKey(this.centralTargets.monthly[year], storeName);
                if (targetKey && this.centralTargets.monthly[year][targetKey][month]) {
                    target = this.centralTargets.monthly[year][targetKey][month];
                }
            }
            
            // Fallback: localStorage
            if (target === 0) {
                const localTargets = JSON.parse(localStorage.getItem('monthlyTargets') || '{}');
                if (localTargets[year]) {
                    const targetKey = this.findTargetKey(localTargets[year], storeName);
                    if (targetKey && localTargets[year][targetKey][month]) {
                        target = localTargets[year][targetKey][month];
                    }
                }
            }
        } else {
            // Yıllık hedef
            if (this.centralTargets.yearly && this.centralTargets.yearly[year]) {
                const targetKey = this.findTargetKey(this.centralTargets.yearly[year], storeName);
                if (targetKey) {
                    target = this.centralTargets.yearly[year][targetKey];
                }
            }
            
            // Fallback: localStorage
            if (target === 0) {
                const localTargets = JSON.parse(localStorage.getItem('yearlyTargets') || '{}');
                if (localTargets[year]) {
                    const targetKey = this.findTargetKey(localTargets[year], storeName);
                    if (targetKey) {
                        target = localTargets[year][targetKey];
                    }
                }
            }
        }
        
        return target;
    }

    /**
     * Hedef anahtarını bul (esnek eşleştirme)
     */
    findTargetKey(targetObj, storeName) {
        if (!targetObj) return null;
        
        // Tam eşleşme
        if (targetObj[storeName]) return storeName;
        
        // Kısmi eşleşme (case-insensitive)
        const storeNameLower = storeName.toLowerCase();
        for (const key of Object.keys(targetObj)) {
            const keyLower = key.toLowerCase();
            if (keyLower.includes(storeNameLower) || storeNameLower.includes(keyLower)) {
                return key;
            }
        }
        return null;
    }

    /**
     * Mağaza hedeflerini render et
     */
    renderStoresTargets(container, storesData, month) {
        let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px;">';
        
        storesData.forEach(store => {
            if (store.target === 0) return; // Hedefi olmayan mağazaları gösterme
            
            const progressColor = store.percentage >= 100 ? '#10b981' : 
                                 store.percentage >= 80 ? '#f59e0b' : '#ef4444';
            
            html += `
                <div style="background: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <h3 style="margin: 0 0 15px 0; color: #333;">${store.name}</h3>
                    
                    <div style="margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span style="font-weight: 600;">Gerçekleşme:</span>
                            <span style="color: ${progressColor}; font-weight: 700;">${store.percentage.toFixed(1)}%</span>
                        </div>
                        <div style="background: #e5e7eb; height: 10px; border-radius: 5px; overflow: hidden;">
                            <div style="background: ${progressColor}; height: 100%; width: ${Math.min(store.percentage, 100)}%; transition: width 0.3s;"></div>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
                        <div>
                            <div style="color: #6b7280;">🎯 Hedef:</div>
                            <div style="font-weight: 600;">$${store.target.toLocaleString('tr-TR')}</div>
                        </div>
                        <div>
                            <div style="color: #6b7280;">📊 Gerçekleşen:</div>
                            <div style="font-weight: 600; color: ${progressColor};">$${store.achieved.toLocaleString('tr-TR')}</div>
                        </div>
                        <div>
                            <div style="color: #6b7280;">📈 Kalan:</div>
                            <div style="font-weight: 600;">$${Math.max(0, store.remaining).toLocaleString('tr-TR')}</div>
                        </div>
                        <div>
                            <div style="color: #6b7280;">📅 Kalan Gün:</div>
                            <div style="font-weight: 600;">${store.daysLeft}</div>
                        </div>
                        ${store.daysLeft > 0 ? `
                        <div style="grid-column: 1 / -1;">
                            <div style="color: #6b7280;">💰 Günlük Gerekli:</div>
                            <div style="font-weight: 600; color: #ef4444;">$${store.dailyRequired.toLocaleString('tr-TR', {maximumFractionDigits: 0})}</div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
        
        console.log('✅ Mağaza hedefleri render edildi:', storesData.length, 'mağaza');
    }
}

// Global HedefTakip instance
window.HedefTakip = new HedefTakip();

console.log('🎯 Hedef Takip module loaded successfully');
