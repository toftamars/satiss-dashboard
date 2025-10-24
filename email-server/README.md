# Zuhal Müzik Email Servisi

Bu servis Zuhal Müzik Dashboard için email gönderimi yapar.

## Özellikler

- ✅ OTP (6 haneli kod) gönderimi
- ✅ Magic Link gönderimi
- ✅ Profesyonel email template'leri
- ✅ Güvenlik kontrolleri
- ✅ Rate limiting

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Environment dosyasını oluşturun:
```bash
cp env.example .env
```

3. `.env` dosyasını düzenleyin:
```
EMAIL_HOST=mail.zuhalmuzik.com
EMAIL_PORT=587
EMAIL_USER=noreply@zuhalmuzik.com
EMAIL_PASS=your-password
EMAIL_FROM=Zuhal Müzik <noreply@zuhalmuzik.com>
FRONTEND_URL=https://toftamars.github.io/satiss-dashboard
```

4. Servisi başlatın:
```bash
npm start
```

## API Endpoints

### OTP Gönderme
```
POST /send-otp
Body: { "email": "user@example.com" }
```

### OTP Doğrulama
```
POST /verify-otp
Body: { "email": "user@example.com", "otp": "123456" }
```

### Magic Link Gönderme
```
POST /send-login-link
Body: { "email": "user@example.com" }
```

### Magic Link Doğrulama
```
POST /verify-login-link
Body: { "token": "abc123..." }
```

## Güvenlik

- OTP kodları 10 dakika geçerlidir
- Magic linkler 1 saat geçerlidir
- Maksimum 3 deneme hakkı
- Rate limiting aktif

## Canlı Ortam Kurulumu

### 1. Frontend Konfigürasyonu
`index.html` dosyasında email servis URL'ini güncelleyin:
```javascript
const EMAIL_SERVICE_URL = 'https://mail.trmail.info/';
```

### 2. CORS Ayarları
`server.js` dosyasında CORS origin'lerini güncelleyin:
```javascript
origin: ['https://toftamars.github.io', 'https://your-frontend-domain.com']
```

### 3. Environment Değişkenleri
`.env` dosyası oluşturun:
```env
EMAIL_HOST=mail.zuhalmuzik.com
EMAIL_PORT=587
EMAIL_USER=noreply@zuhalmuzik.com
EMAIL_PASS=your-secure-password
EMAIL_FROM=Zuhal Müzik <noreply@zuhalmuzik.com>
FRONTEND_URL=https://toftamars.github.io/satiss-dashboard
PORT=3000
NODE_ENV=production
JWT_SECRET=your-production-secret
```

### 4. Deployment

#### Heroku
```bash
heroku create zuhal-muzik-email
heroku config:set EMAIL_HOST=mail.zuhalmuzik.com
heroku config:set EMAIL_USER=noreply@zuhalmuzik.com
heroku config:set EMAIL_PASS=your-password
heroku config:set FRONTEND_URL=https://toftamars.github.io/satiss-dashboard
heroku config:set NODE_ENV=production
git push heroku main
```

#### VPS (PM2 ile)
```bash
# PM2'yi global olarak yükle
npm install -g pm2

# Uygulamayı başlat
pm2 start server.js --name "zuhal-email-service"

# Sistem başlangıcında otomatik başlatma
pm2 startup
pm2 save

# Logları görüntüle
pm2 logs zuhal-email-service
```

#### Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name mail.trmail.info;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. SSL Sertifikası
```bash
# Let's Encrypt ile SSL
sudo certbot --nginx -d mail.trmail.info
```

### 6. Test Etme
```bash
# Health check
curl https://mail.trmail.info/health

# OTP test
curl -X POST https://mail.trmail.info/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@zuhalmuzik.com"}'
```
