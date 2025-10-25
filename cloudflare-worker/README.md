# Cloudflare Worker - Odoo CORS Proxy

## 🚀 Kurulum

### 1. Cloudflare Hesabı Aç
- https://dash.cloudflare.com/sign-up
- Ücretsiz plan yeterli

### 2. Worker Oluştur
1. Dashboard → Workers & Pages → Create Application
2. Create Worker
3. İsim ver: `odoo-auth-proxy`
4. Deploy

### 3. Kodu Yapıştır
1. Worker'ı aç → Quick Edit
2. `worker.js` içeriğini kopyala yapıştır
3. Save and Deploy

### 4. URL'yi Kopyala
- Worker URL: `https://odoo-auth-proxy.YOUR-SUBDOMAIN.workers.dev`
- Bu URL'yi `auth-odoo.js` dosyasına ekle

## 📝 Frontend Entegrasyonu

```javascript
// js/modules/auth-odoo.js
class OdooAuth {
    constructor() {
        this.apiUrl = 'https://odoo-auth-proxy.YOUR-SUBDOMAIN.workers.dev';
        // ...
    }
}
```

## ✅ Test

```bash
curl -X POST https://odoo-auth-proxy.YOUR-SUBDOMAIN.workers.dev \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test@example.com",
    "password": "test123",
    "totp": "123456"
  }'
```

## 🔒 Güvenlik

- ✅ CORS sadece `toftamars.github.io` için açık
- ✅ Sadece POST metodu
- ✅ Rate limiting (Cloudflare otomatik)
- ✅ SSL/TLS (Cloudflare otomatik)

## 💰 Maliyet

- **ÜCRETSİZ:** 100,000 request/gün
- Senin kullanımın: ~100-200 request/gün
- Yeterli! 🎉

