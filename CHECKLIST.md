# ✅ PROJE İYİLEŞTİRME CHECKLIST

**Başlangıç Puanı:** 5.6/10  
**Hedef Puan:** 8.5/10  
**Süre:** 6 ay

---

## 🔴 HAFTA 1-2: KRİTİK (ACIL MÜDAHALE)

### Gün 1
- [ ] `npm install` - Bağımlılıkları yükle
- [ ] `npm test` - Testleri çalıştır ve doğrula
- [ ] `npm run lint` - Linting kontrol
- [ ] Test sonuçlarını dokümante et

### Gün 2-3
- [ ] `api/odoo-login.js` - SSL sertifika kontrolünü aç
  - [ ] `rejectUnauthorized: false` kaldır
  - [ ] Test et
  - [ ] Production'a deploy et
- [ ] JWT token implementasyonu
  - [ ] `npm install jsonwebtoken`
  - [ ] `api/odoo-login.js`'de JWT'ye geç
  - [ ] Refresh token endpoint ekle
  - [ ] Frontend token yönetimini güncelle

### Gün 4-5
- [ ] Console.log cleanup başlat
  - [ ] 165+ console.log'u logger'a çevir
  - [ ] Production'da console.log'ları devre dışı bırak
- [ ] CI/CD Pipeline kur
  - [ ] `.github/workflows/ci.yml` oluştur
  - [ ] Lint check ekle
  - [ ] Test run ekle
  - [ ] Coverage report ekle

**Hedef Sonuç:**
- ✅ Testler çalışıyor
- ✅ Güvenlik açıkları kapatıldı
- ✅ CI/CD aktif

---

## ⚠️ HAFTA 3-4: MODÜLERLEŞTIRME BAŞLANGICI

### UI Components
- [ ] `js/modules/ui-components.js` oluştur
  - [ ] showLoadingSpinner()
  - [ ] hideLoadingSpinner()
  - [ ] updateProgressBar()
  - [ ] showNotification()
- [ ] index.html'den UI fonksiyonlarını taşı (300 satır)

### Event Handlers
- [ ] `js/modules/event-handlers.js` oluştur
  - [ ] setupEventListeners()
  - [ ] handleFilterChange()
  - [ ] handleDateChange()
  - [ ] handleStoreChange()
- [ ] index.html'den event handler'ları taşı (400 satır)

### Progress Tracking
- [ ] index.html başlangıç: 15,483 satır
- [ ] Hedef: 14,800 satır (700 satır azalma)

---

## ⚠️ HAFTA 5-6: VERİ OPTİMİZASYONU

### Backend API
- [ ] Pagination endpoint oluştur
  - [ ] `GET /api/sales?page=1&limit=1000`
  - [ ] Cache implementasyonu
  - [ ] Error handling
- [ ] Filtering endpoint oluştur
  - [ ] `GET /api/sales?year=2025&month=1`
  - [ ] SQL optimization

### Frontend Pagination
- [ ] `js/modules/data-pagination.js` oluştur
  - [ ] DataPagination class
  - [ ] Cache yönetimi
  - [ ] Error handling
- [ ] `js/modules/infinite-scroll.js` oluştur
  - [ ] IntersectionObserver kullan
  - [ ] Loading state yönetimi

### Testing
- [ ] Pagination testleri yaz
- [ ] Performance testleri yap
- [ ] Memory leak kontrolü

**Hedef Sonuç:**
- ✅ İlk yükleme: 49MB → 1MB
- ✅ Yükleme süresi: 5-10s → 1-2s

---

## 💡 HAFTA 7-8: MODÜLERLEŞTIRME DEVAM

### Dashboard Logic
- [ ] `js/modules/dashboard-logic.js` oluştur
  - [ ] loadDashboard()
  - [ ] updateDashboard()
  - [ ] calculateMetrics()
- [ ] index.html'den dashboard logic taşı (500 satır)

### Chart Management
- [ ] `js/modules/chart-init.js` oluştur
  - [ ] initAllCharts()
  - [ ] destroyChart()
  - [ ] updateChartData()
- [ ] index.html'den chart kodu taşı (300 satır)

### Filter Logic
- [ ] `js/modules/filter-logic.js` oluştur
  - [ ] applyFilters()
  - [ ] updateFilterUI()
  - [ ] resetFilters()
- [ ] index.html'den filter logic taşı (400 satır)

**Progress:**
- [ ] index.html: 14,800 → 13,600 satır (1,200 satır azalma)

---

## 💡 HAFTA 9-10: BUILD PIPELINE

### Vite Setup
- [ ] `npm install --save-dev vite`
- [ ] `vite.config.js` oluştur
- [ ] Code splitting yapılandır
- [ ] Minification ayarla
- [ ] Build script'leri güncelle

### Bundle Optimization
- [ ] Vendor chunks ayır
- [ ] Feature chunks oluştur
- [ ] Dynamic imports ekle
- [ ] Tree shaking aktif et

### Testing
- [ ] Build'i test et
- [ ] Bundle size analizi yap
- [ ] Performance karşılaştırması

**Hedef:**
- ✅ Bundle: 750KB → 300KB

---

## 💡 HAFTA 11-12: TEST COVERAGE ARTIRMA

### Unit Tests
- [ ] `data-loader.test.js` yaz (10+ test)
- [ ] `auth-odoo.test.js` yaz (10+ test)
- [ ] `charts.test.js` yaz (8+ test)
- [ ] `dashboard.test.js` yaz (8+ test)
- [ ] `error-handler.test.js` yaz (6+ test)

### Integration Tests
- [ ] `data-flow.test.js` yaz
- [ ] `filter-chain.test.js` yaz
- [ ] `auth-flow.test.js` yaz

### E2E Tests
- [ ] `npm install --save-dev @playwright/test`
- [ ] `e2e/login.spec.js` yaz
- [ ] `e2e/dashboard.spec.js` yaz
- [ ] `e2e/filters.spec.js` yaz

**Hedef:**
- ✅ Coverage: 0% → 40%

---

## 🎯 AY 4: GÜVENLİK VE OPTİMİZASYON

### Security Headers
- [ ] `vercel.json` güncelle
  - [ ] CSP header ekle
  - [ ] X-Frame-Options
  - [ ] X-Content-Type-Options
  - [ ] Strict-Transport-Security
- [ ] CSRF protection ekle
  - [ ] `js/modules/csrf.js` oluştur
  - [ ] Backend doğrulama ekle

### Service Worker
- [ ] `sw.js` oluştur
- [ ] Cache stratejisi belirle
- [ ] Offline support ekle
- [ ] index.html'de register et

### Web Workers
- [ ] `js/workers/data-processor.worker.js` oluştur
- [ ] `js/modules/worker-manager.js` oluştur
- [ ] Heavy computation'ları taşı
- [ ] Test et

---

## 🎯 AY 5: PERFORMANS İYİLEŞTİRME

### Virtual Scrolling
- [ ] `js/modules/virtual-list.js` oluştur
- [ ] Büyük listelerde implement et
- [ ] Performance testleri

### Image Optimization
- [ ] Lazy loading ekle
- [ ] WebP format kullan
- [ ] Responsive images
- [ ] Compression

### CSS/JS Optimization
- [ ] Critical CSS inline
- [ ] CSS minification
- [ ] JS minification
- [ ] Resource hints ekle

**Hedef:**
- ✅ Lighthouse Score: 65 → 85

---

## 🎯 AY 6: PRODUCTION READY

### Documentation
- [ ] Architecture diagram oluştur
- [ ] API documentation tamamla
- [ ] User guide yaz
- [ ] Troubleshooting guide
- [ ] Contributing guide

### Monitoring
- [ ] Sentry integration
- [ ] Google Analytics
- [ ] Performance monitoring
- [ ] Error alerting

### Final Cleanup
- [ ] index.html: 13,600 → 500 satır
- [ ] Tüm console.log'ları kaldır
- [ ] Unused code temizle
- [ ] Comment'leri düzenle

### Production Deployment
- [ ] Security audit
- [ ] Performance audit
- [ ] Accessibility audit (WCAG 2.1)
- [ ] SEO optimization
- [ ] Final testing
- [ ] Production deploy

---

## 📊 METRİK TAKİBİ

### Haftalık Kontrol
- [ ] Test coverage oranı
- [ ] Bundle size
- [ ] index.html satır sayısı
- [ ] Lighthouse score
- [ ] Build süresi

### Aylık Kontrol
- [ ] Genel puan hesapla
- [ ] Performans metrikleri
- [ ] Memory usage
- [ ] Load time

---

## 🎯 BAŞARI KRİTERLERİ

### 3 Ay Sonra
- [ ] index.html < 10,000 satır
- [ ] Test coverage > 40%
- [ ] CI/CD çalışıyor
- [ ] Güvenlik açıkları kapatıldı
- [ ] Genel puan > 7.0/10

### 6 Ay Sonra
- [ ] index.html < 500 satır ✅
- [ ] Test coverage > 60% ✅
- [ ] Bundle size < 300KB ✅
- [ ] Load time < 3s ✅
- [ ] Lighthouse score > 85 ✅
- [ ] Genel puan > 8.5/10 ✅

---

## 🚨 BLOCKER'LAR

Eğer aşağıdaki sorunlarla karşılaşırsan, DURDUR ve çöz:

- [ ] Testler fail oluyor
- [ ] Production'da critical bug
- [ ] Build pipeline bozuldu
- [ ] Security vulnerability tespit edildi
- [ ] Performance ciddi düştü

---

## 📝 NOTLAR

- Her hafta progress güncelle
- Blocker'ları hemen raporla
- Code review yap
- Git branch kullan
- Documentation güncelle

---

**Başlangıç:** 25 Ekim 2025  
**Bitiş:** 25 Nisan 2026 (6 ay)  
**Sorumlu:** Development Team  
**Durum:** 🟡 Başlamadı
