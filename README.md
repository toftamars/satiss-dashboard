# 📊 Sales Dashboard - Satış Analiz Platformu

Modern, güvenli ve performanslı satış analiz dashboard'u. Odoo ERP entegrasyonu ile gerçek zamanlı veri analizi.

[![GitHub Stars](https://img.shields.io/github/stars/toftamars/satiss-dashboard?style=social)](https://github.com/toftamars/satiss-dashboard)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![Code Quality](https://img.shields.io/badge/code%20quality-A-brightgreen.svg)](.)

## ✨ Özellikler

### 📈 Analiz Modülleri
- **Dashboard**: Genel satış metrikleri, yıllık karşılaştırmalar, top 10 analizleri
- **Müşteri Analizi**: Segmentasyon, RFM analizi, müşteri davranışları
- **Satış Temsilcisi Performansı**: Kişisel ve takım performans metrikleri
- **Mağaza Performansı**: Mağaza bazlı satış ve stok analizleri
- **Ürün & Kategori Analizi**: Ürün performansı, kategori trendleri
- **Şehir Analizi**: Coğrafi satış dağılımı ve bölgesel performans

### 🔒 Güvenlik
- ✅ Environment variables ile API key yönetimi
- ✅ Gerçek Odoo authentication (mock authentication kaldırıldı)
- ✅ Rate limiting ve attempt tracking
- ✅ XSS protection
- ✅ Session management (120 dakika)
- ✅ Secure configuration loading

### ⚡ Performans
- ✅ Modüler JavaScript yapısı (15 modül)
- ✅ Lazy loading desteği
- ✅ Chart.js ile optimize edilmiş grafikler
- ✅ Gzip compression
- ✅ Error boundary ve graceful degradation

### 🧪 Kod Kalitesi
- ✅ Jest test framework (16 test)
- ✅ ESLint + Prettier
- ✅ Error handling
- ✅ Logger system
- ✅ Clean code architecture

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- NPM 9+
- Modern web browser (Chrome, Firefox, Safari, Edge)

### 1. Projeyi Klonla
\`\`\`bash
git clone https://github.com/toftamars/satiss-dashboard.git
cd satiss-dashboard
\`\`\`

### 2. Bağımlılıkları Yükle
\`\`\`bash
npm install
\`\`\`

### 3. Environment Variables Ayarla

\`\`\`bash
# .env.local dosyası oluştur
cp .env.example .env.local
\`\`\`

\`.env.local\` dosyasını düzenle:
\`\`\`env
ODOO_URL=https://erp.zuhalmuzik.com
ODOO_DATABASE=erp.zuhalmuzik.com
ODOO_USERNAME=your_username@zuhalmuzik.com
ODOO_API_KEY=your_api_key_here
\`\`\`

### 4. Development Server
\`\`\`bash
# Basit HTTP server
python3 -m http.server 8000

# Veya Node.js ile
npx serve .
\`\`\`

Tarayıcıda aç: `http://localhost:8000`

## 📦 Production Deployment

### Vercel Deployment

1. **Vercel'e Deploy Et**
\`\`\`bash
npm install -g vercel
vercel
\`\`\`

2. **Environment Variables Ekle**

Vercel Dashboard → Settings → Environment Variables:
\`\`\`
ODOO_URL=https://erp.zuhalmuzik.com
ODOO_DATABASE=erp.zuhalmuzik.com
ODOO_USERNAME=your_username@zuhalmuzik.com
ODOO_API_KEY=your_api_key_here
\`\`\`

3. **Redeploy**
\`\`\`bash
vercel --prod
\`\`\`

### GitHub Pages Deployment

⚠️ **Not**: GitHub Pages static hosting olduğu için environment variables desteklemez. Sadece frontend deploy edilebilir, backend API'ler Vercel'de olmalı.

\`\`\`bash
# gh-pages branch'ine deploy
npm run deploy
\`\`\`

## 🧪 Test

\`\`\`bash
# Tüm testleri çalıştır
npm test

# Watch mode
npm run test:watch

# Coverage raporu
npm run test:coverage
\`\`\`

## 🔍 Linting & Formatting

\`\`\`bash
# ESLint kontrolü
npm run lint

# ESLint otomatik düzeltme
npm run lint:fix

# Prettier formatting
npm run format

# Prettier kontrolü
npm run format:check
\`\`\`

## 📁 Proje Yapısı

\`\`\`
satiss-dashboard/
├── index.html              # Ana HTML dosyası
├── styles.css              # Global stiller
├── js/
│   └── modules/
│       ├── app-init.js           # Uygulama başlatma
│       ├── app-state.js          # Global state yönetimi
│       ├── auth-odoo.js          # Odoo authentication
│       ├── charts.js             # Chart.js wrapper
│       ├── config-loader.js      # Güvenli config yükleme
│       ├── dashboard.js          # Dashboard modülü
│       ├── data-loader.js        # Veri yükleme
│       ├── error-handler.js      # Error handling
│       ├── excel-export.js       # Excel export
│       ├── filter-manager.js     # Filtreleme sistemi
│       ├── helpers.js            # Yardımcı fonksiyonlar
│       ├── logger.js             # Logging sistemi
│       ├── ui-login.js           # Login UI
│       ├── utils.js              # Utility fonksiyonlar
│       └── voice-search.js       # Ses arama
├── data/
│   ├── data-2025.json.gz         # 2025 satış verileri
│   ├── inventory.json.gz         # Stok verileri
│   ├── metadata.json             # Metadata
│   ├── stock-locations.json      # Mağaza lokasyonları
│   └── targets.json              # Hedefler
├── api/
│   └── odoo-login.js             # Vercel serverless function
├── tests/
│   └── modules/
│       └── *.test.js             # Unit testler
├── .eslintrc.js                  # ESLint config
├── .prettierrc.json              # Prettier config
├── jest.config.js                # Jest config
├── package.json                  # NPM dependencies
└── README.md                     # Bu dosya
\`\`\`

## 🔧 Konfigürasyon

### ConfigLoader Kullanımı

\`\`\`javascript
import { ConfigLoader } from './js/modules/config-loader.js';

// Config'i yükle
await ConfigLoader.load();

// Config değeri al
const odooUrl = ConfigLoader.get('odoo.url');
const apiKey = ConfigLoader.get('odoo.api_key');

// Tüm config'i al
const config = ConfigLoader.getAll();
\`\`\`

### Logger Kullanımı

\`\`\`javascript
import { logger } from './js/modules/logger.js';

// Development/debug modda loglanır
logger.log('Normal log mesajı');
logger.info('Info mesajı');
logger.warn('Warning mesajı');

// Her zaman loglanır
logger.error('Error mesajı');

// Debug mode aç/kapat
window.enableDebug();   // Console'da çalıştır
window.disableDebug();  // Console'da çalıştır
\`\`\`

## 📊 Veri Yapısı

### Satış Verisi
\`\`\`json
{
  "date": "2025-01-15",
  "partner": "Müşteri Adı",
  "sales_person": "Satış Temsilcisi",
  "store": "Mağaza Adı",
  "city": "İstanbul",
  "brand": "Marka",
  "category_2": "Ana Kategori",
  "category_3": "Alt Kategori",
  "usd_amount": 1234.56,
  "quantity": 5
}
\`\`\`

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

### Commit Mesajları

Conventional Commits kullanıyoruz:
- `feat:` Yeni özellik
- `fix:` Bug düzeltme
- `docs:` Dokümantasyon
- `style:` Kod formatı
- `refactor:` Refactoring
- `test:` Test ekleme
- `chore:` Bakım işleri

## 📝 Lisans

ISC License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👥 İletişim

- **Proje**: [GitHub Repository](https://github.com/toftamars/satiss-dashboard)
- **Issues**: [GitHub Issues](https://github.com/toftamars/satiss-dashboard/issues)

## 🙏 Teşekkürler

- [Chart.js](https://www.chartjs.org/) - Grafik kütüphanesi
- [Odoo](https://www.odoo.com/) - ERP sistemi
- [Vercel](https://vercel.com/) - Hosting platform

---

**Made with ❤️ by Zuhal Müzik Team**
