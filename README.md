# 📊 Sales Dashboard - Satış Raporlama Sistemi

Modern, hızlı ve kullanıcı dostu satış raporlama dashboard'u. Odoo ERP entegrasyonu ile gerçek zamanlı veri analizi.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/toftamars/satiss-dashboard)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Vercel](https://img.shields.io/badge/deploy-vercel-black.svg)](https://vercel.com)

---

## 🎯 Özellikler

### 📈 Raporlama
- **Gerçek Zamanlı Veriler:** Odoo ERP'den otomatik veri çekme
- **Yıllık Karşılaştırma:** 2023-2025 satış trendleri
- **Kategori Analizi:** Ürün kategorilerine göre detaylı raporlar
- **Müşteri Analizi:** Top 10 müşteriler ve şehir bazlı satışlar
- **Satış Temsilcisi Performansı:** Kişisel satış hedefleri ve gerçekleşmeler

### 🎨 Kullanıcı Arayüzü
- **Responsive Tasarım:** Mobil, tablet ve masaüstü uyumlu
- **Modern UI/UX:** Chart.js ile interaktif grafikler
- **Hızlı Filtreler:** Tarih, kategori, mağaza, şehir filtreleri
- **Dark Mode:** Göz dostu karanlık tema (yakında)

### 🔐 Güvenlik
- **Odoo Authentication:** 2FA destekli giriş sistemi
- **Session Management:** Güvenli oturum yönetimi
- **Rate Limiting:** Brute force koruması
- **CORS Protection:** Cross-origin güvenlik

### ⚡ Performans
- **GZIP Compression:** Veriler sıkıştırılmış (~90% azalma)
- **Lazy Loading:** İhtiyaç olunca veri yükleme
- **Caching:** Browser cache optimizasyonu
- **CDN:** Vercel Edge Network

---

## 🚀 Hızlı Başlangıç

### Gereksinimler

```bash
Node.js >= 14.0.0
npm >= 6.0.0
Git
```

### Kurulum

```bash
# 1. Repoyu klonla
git clone https://github.com/toftamars/satiss-dashboard.git
cd satiss-dashboard

# 2. Bağımlılıkları yükle
npm install

# 3. Environment variables ayarla
cp .env.example .env
# .env dosyasını düzenle

# 4. Local sunucuyu başlat
npm start
# veya
python -m http.server 8000

# 5. Tarayıcıda aç
open http://localhost:8000
```

### Environment Variables

```bash
# .env dosyası
ODOO_URL=https://erp.zuhalmuzik.com
ODOO_DATABASE=erp.zuhalmuzik.com
ODOO_USERNAME=user@example.com
ODOO_API_KEY=your-api-key-here
JWT_SECRET=your-jwt-secret
```

---

## 📁 Proje Yapısı

```
satiss-dashboard/
├── index.html                 # Ana sayfa
├── styles.css                 # Global stiller
├── package.json              # Dependencies
├── vercel.json               # Vercel config
│
├── api/                      # Serverless Functions
│   ├── odoo-login.js         # Authentication API
│   └── config.js             # Config API
│
├── js/                       # JavaScript Modülleri
│   └── modules/
│       ├── app-init.js       # Uygulama başlatma
│       ├── app-state.js      # Global state
│       ├── auth-odoo.js      # Authentication
│       ├── charts.js         # Chart.js wrapper
│       ├── dashboard.js      # Dashboard logic
│       ├── data-loader.js    # Data fetching
│       ├── filters.js        # Filtering logic
│       ├── ui-login.js       # Login UI
│       └── utils.js          # Helper functions
│
├── data/                     # Veri Dosyaları
│   ├── data-2023.json.gz     # 2023 satış verileri
│   ├── data-2024.json.gz     # 2024 satış verileri
│   ├── data-2025.json.gz     # 2025 satış verileri
│   ├── data-metadata.json    # Metadata
│   ├── inventory.json.gz     # Envanter verileri
│   ├── stock-locations.json  # Stok konumları
│   └── targets.json          # Satış hedefleri
│
├── docs/                     # Dokümantasyon
│   ├── API.md                # API dokümantasyonu
│   └── CONTRIBUTING.md       # Katkı rehberi
│
└── .github/
    └── workflows/
        └── update-data-workflow.yml  # Otomatik veri güncelleme
```

---

## 🔧 Geliştirme

### Yeni Modül Eklemek

```javascript
// js/modules/my-module.js
/**
 * @fileoverview My Module
 * @description Modül açıklaması
 * @module MyModule
 */

export function myFunction() {
    // Kodunuz
}

console.log('✅ MyModule yüklendi');
```

### Test Yazmak

```javascript
// js/modules/__tests__/my-module.test.js
import { myFunction } from '../my-module.js';

describe('MyModule', () => {
    test('should do something', () => {
        expect(myFunction()).toBe(expected);
    });
});
```

### Test Çalıştırma

```bash
npm test                # Tüm testler
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage raporu
```

### Linting

```bash
npm run lint            # Lint kontrolü
npm run lint:fix        # Otomatik düzelt
npm run format          # Prettier formatla
```

---

## 📊 Veri Güncelleme

### Manuel Güncelleme

```bash
# GitHub Actions'dan manuel tetikle
GitHub → Actions → "Odoo Veri Güncelleme" → Run workflow
```

### Otomatik Güncelleme

Veriler her gece saat **05:00 (İstanbul)** otomatik güncellenir.

```yaml
# .github/workflows/update-data-workflow.yml
schedule:
  - cron: '0 2 * * *'  # UTC 02:00 = İstanbul 05:00
```

---

## 🎨 Ekran Görüntüleri

### Dashboard Ana Sayfa
![Dashboard](docs/images/dashboard.png)

### Yıllık Karşılaştırma
![Yearly Comparison](docs/images/yearly-chart.png)

### Mobil Görünüm
![Mobile](docs/images/mobile.png)

---

## 🐛 Bilinen Sorunlar ve Çözümler

Detaylı teknik analiz için: **[SORUNLAR_VE_COZUMLER.md](SORUNLAR_VE_COZUMLER.md)**

### Kritik Sorunlar
- ⚠️ API key environment variable'a taşınmalı
- ⚠️ Inventory lazy loading eklenmeli
- ⚠️ Mock authentication kaldırılmalı

### Performans İyileştirmeleri
- 📈 İlk yükleme: 54MB → 49MB (lazy load ile)
- 📈 Pagination: 49MB → 1-2MB/sayfa
- 📈 HTML minify: %30-40 boyut azaltma

---

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen [CONTRIBUTING.md](docs/CONTRIBUTING.md) dosyasını okuyun.

### Geliştirme Süreci

1. **Fork** edin
2. **Feature branch** oluşturun (`git checkout -b feature/amazing-feature`)
3. **Commit** edin (`git commit -m 'Add amazing feature'`)
4. **Push** edin (`git push origin feature/amazing-feature`)
5. **Pull Request** açın

### Commit Mesajları

```bash
feat: Yeni özellik ekle
fix: Bug düzelt
docs: Dokümantasyon güncelle
style: Code formatting
refactor: Code refactoring
test: Test ekle
chore: Build process güncelle
```

---

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır - detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## 📞 İletişim

**Proje Sahibi:** Zuhal Müzik  
**Email:** alper.tofta@zuhalmuzik.com  
**Website:** [https://zuhalmuzik.com](https://zuhalmuzik.com)

---

## 🙏 Teşekkürler

- [Chart.js](https://www.chartjs.org/) - Grafikler için
- [Vercel](https://vercel.com) - Hosting için
- [Odoo](https://www.odoo.com/) - ERP sistemi
- [Pako.js](https://github.com/nodeca/pako) - GZIP decompression

---

## 📈 Yol Haritası

### v1.1.0 (Gelecek ay)
- [ ] Lazy loading inventory
- [ ] Error handling iyileştirmeleri
- [ ] Unit testler (%60 coverage)
- [ ] ESLint + Prettier

### v1.2.0 (2 ay sonra)
- [ ] Pagination
- [ ] Virtual scrolling
- [ ] Dark mode
- [ ] PWA (Offline support)

### v2.0.0 (Gelecek)
- [ ] Real-time updates (WebSocket)
- [ ] Excel export
- [ ] PDF raporlar
- [ ] Email notifications
- [ ] Multi-language support

---

**Son Güncelleme:** 2025-10-25  
**Versiyon:** 1.0.0  
**Durum:** Production

