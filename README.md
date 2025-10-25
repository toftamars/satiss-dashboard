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
- ✅ JWT token authentication (jose paketi)
- ✅ SSL/TLS enforced (production)
- ✅ Security headers (CSP, HSTS, X-Frame-Options)
- ✅ XSS + CSRF protection (DOMPurify)
- ✅ Session management (120 dakika)
- ✅ Rate limiting
- ✅ Input validation
- ✅ Secure environment variables

### ⚡ Performans
- ✅ Modüler JavaScript yapısı (20 modül - 4,600+ satır)
- ✅ Vite code splitting (6 chunks)
- ✅ Service Worker (PWA support)
- ✅ Web Workers (background processing)
- ✅ Virtual Scrolling (-99% memory)
- ✅ Data Pagination (49MB → 500KB/page)
- ✅ Brotli compression
- ✅ Resource hints (preconnect, dns-prefetch)
- ✅ Chart.js ile optimize edilmiş grafikler

### 🧪 Kod Kalitesi
- ✅ ESLint 9.x + Prettier
- ✅ Husky + lint-staged (git hooks)
- ✅ Error handling & logging
- ✅ Monitoring & APM (Sentry ready)
- ✅ Web Vitals tracking
- ✅ Clean code architecture
- ✅ 20 modül, 4,600+ satır temiz kod

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
# Vite development server (önerilen)
npm run dev

# Veya basit HTTP server
python3 -m http.server 8000

# Veya Node.js ile
npx serve .
\`\`\`

Tarayıcıda aç: `http://localhost:5173` (Vite) veya `http://localhost:8000`

## 📦 Production Deployment

### Vercel Deployment (Önerilen)

**Detaylı deployment guide için: [DEPLOYMENT.md](DEPLOYMENT.md)**

#### Method 1: GitHub Integration (Otomatik)

1. GitHub'a push yapın:
\`\`\`bash
git push origin main
\`\`\`

2. Vercel otomatik deploy eder
3. Environment variables'ı Vercel Dashboard'dan ekleyin

#### Method 2: Vercel CLI

\`\`\`bash
# Vercel CLI kur
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
\`\`\`

#### Environment Variables

Vercel Dashboard → Settings → Environment Variables:

\`\`\`env
NODE_ENV=production
VITE_API_URL=https://zuhal-mu.vercel.app
VITE_ODOO_URL=https://erp.zuhalmuzik.com
VITE_ODOO_DB=zuhalmusic
VITE_SESSION_TIMEOUT=7200000
VITE_ENABLE_PWA=true
VITE_ENABLE_WORKERS=true
VITE_ENABLE_MONITORING=true
\`\`\`

#### Build Configuration

- **Framework:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Node Version:** 18.x

### Production Build (Local)

\`\`\`bash
# Build oluştur
npm run build

# Preview
npm run preview
\`\`\`

## 🔨 Build & Scripts

\`\`\`bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Build CSS
npm run build:css
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
├── sw.js                   # Service Worker (PWA)
├── manifest.json           # PWA manifest
├── vite.config.js          # Vite configuration
├── postcss.config.js       # PostCSS configuration
├── vercel.json             # Vercel deployment config
├── js/
│   ├── modules/            # 20 modül (4,600+ satır)
│   │   ├── logger.js               # Logging sistemi
│   │   ├── error-handler.js        # Error handling
│   │   ├── config-loader.js        # Config yönetimi
│   │   ├── filter-manager.js       # Filtre sistemi
│   │   ├── sales-analysis.js       # Satış analizi
│   │   ├── chart-renderer.js       # Grafik rendering
│   │   ├── tab-manager.js          # Tab yönetimi
│   │   ├── security-manager.js     # Güvenlik
│   │   ├── session-manager.js      # Session yönetimi
│   │   ├── inventory-manager.js    # Envanter
│   │   ├── excel-export.js         # Excel export
│   │   ├── helpers.js              # Yardımcı fonksiyonlar
│   │   ├── voice-search.js         # Sesli arama
│   │   ├── data-loader.js          # Veri yükleme
│   │   ├── worker-manager.js       # Web Workers
│   │   ├── monitoring.js           # Monitoring & APM
│   │   ├── virtual-scroller.js     # Virtual scrolling
│   │   ├── data-paginator.js       # Data pagination
│   │   ├── dashboard-renderer.js   # Dashboard rendering
│   │   └── ui-utils.js             # UI utilities
│   └── workers/
│       └── data-processor.worker.js # Web Worker
├── data/
│   ├── data-*.json.gz              # Yıllık satış verileri
│   ├── data-metadata.json          # Metadata
│   ├── stock-locations.json        # Mağaza lokasyonları
│   └── targets.json                # Hedefler
├── api/
│   └── odoo-login.js               # Vercel serverless function
├── .eslintrc.js                    # ESLint config
├── .prettierrc.json                # Prettier config
├── package.json                    # NPM dependencies
├── README.md                       # Bu dosya
├── DEPLOYMENT.md                   # Deployment guide
├── PROGRESS_REPORT.md              # İlerleme raporu
└── FINAL_REPORT.md                 # Final rapor
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
