# 🌐 KENDİ HOSTİNGİNİZE TAŞIMA REHBERİ

## ✅ EVET, ÇALIŞIR! 

Bu proje **statik bir web sitesi** - her hostingde çalışır! 🎉

---

## 📋 GEREKLİLER

### Hostinginizde Olması Gerekenler:
- ✅ Web sunucu (Apache/Nginx - zaten var)
- ✅ PHP (gerekli değil)
- ✅ SSL sertifikası (HTTPS için - önerilen)
- ✅ FTP/SFTP erişimi veya cPanel

### GitHub Actions Workflow İçin:
- ⚠️ Cron job desteği (alternatif: webhook)

---

## 🚀 TAŞIMA YÖNTEMLERİ

### YÖNTEM 1: MANUEL YÜKLEME (En Kolay)

#### Adım 1: Dosyaları İndirin
```bash
# Terminalden (Mac):
cd ~/Desktop
zip -r dashboard.zip "Genel Analiz" -x "*.git*" "node_modules/*"
```

#### Adım 2: FTP/cPanel ile Yükleyin
```
Yüklenecek dosyalar:
├── index.html
├── login.html
├── styles.css
├── performance-optimizer.js
├── ai-analyzer-enhanced.js
├── time-analysis-enhanced.js
├── data-2023.json.gz
├── data-2024.json.gz
├── data-2025.json.gz
├── data-metadata.json
├── inventory.json.gz
├── targets.json
└── stock-locations.json
```

#### Adım 3: Domain Ayarı
```
Örnek: dashboard.sirketiniz.com
veya: sirketiniz.com/dashboard/
```

**Süre:** 10 dakika ⏱️
**Maliyet:** $0 (zaten hostinginiz var)

---

### YÖNTEM 2: GIT AUTO-DEPLOY (Otomatik)

#### Adım 1: Hostinginizde Git Kurulumu
```bash
# SSH ile bağlanın
ssh kullanici@hostinginiz.com

# Klasör oluşturun
mkdir -p /home/kullanici/public_html/dashboard
cd /home/kullanici/public_html/dashboard

# Repo'yu klonlayın (ÖNCE PRİVATE YAPIN!)
git clone https://github.com/toftamars/satiss-dashboard.git .
```

#### Adım 2: Auto-Deploy Script
```bash
# deploy.sh oluşturun
nano deploy.sh

# İçeriği:
#!/bin/bash
cd /home/kullanici/public_html/dashboard
git pull origin main
echo "✅ Deploy tamamlandı: $(date)"
```

```bash
# Çalıştırılabilir yapın
chmod +x deploy.sh
```

#### Adım 3: Cron Job (Otomatik Güncelleme)
```bash
# cPanel → Cron Jobs
# Veya: crontab -e

# Her 10 dakikada bir kontrol et:
*/10 * * * * /home/kullanici/public_html/dashboard/deploy.sh
```

**Avantaj:** Workflow çalışınca 10 dakika içinde otomatik güncellenir! 🔄

---

### YÖNTEM 3: WEBHOOK (En Profesyonel)

#### Adım 1: PHP Webhook Dosyası
```php
<?php
// webhook.php
$secret = 'sizin_gizli_anahtariniz'; // GitHub Secret ile aynı olmalı

// GitHub'dan gelen request'i doğrula
$headers = getallheaders();
$signature = $headers['X-Hub-Signature-256'] ?? '';

$payload = file_get_contents('php://input');
$hash = 'sha256=' . hash_hmac('sha256', $payload, $secret);

if (hash_equals($signature, $hash)) {
    // Git pull yap
    shell_exec('cd /home/kullanici/public_html/dashboard && git pull origin main 2>&1');
    echo "✅ Deploy başarılı!";
} else {
    http_response_code(403);
    echo "❌ Hatalı signature";
}
?>
```

#### Adım 2: GitHub Webhook Ayarı
```
1. GitHub repo → Settings → Webhooks → Add webhook
2. Payload URL: https://sirketiniz.com/webhook.php
3. Content type: application/json
4. Secret: sizin_gizli_anahtariniz
5. Events: Just the push event
```

**Avantaj:** Workflow bitince ANINDA güncellenir! ⚡

---

## 🔧 WORKFLOW AYARLARI (ODOO VERİ GÜNCELLEMESİ)

### SORUN: GitHub Actions hostinginizde çalışmaz

### ÇÖZÜM: Hosting Cron Job

#### Adım 1: Python Script
```bash
# Hostinginizde Python var mı kontrol edin:
python3 --version

# Yoksa: cPanel → Python App oluşturun
```

#### Adım 2: Odoo Veri Çekme Script
```bash
# update_odoo_data.py oluşturun
# (GitHub workflow'daki Python kodunu kopyalayın)

# Cron Job:
0 2 * * * cd /home/kullanici/dashboard && python3 update_odoo_data.py
```

---

## 🌐 DOMAIN AYARLARI

### Seçenek 1: Alt Domain
```
dashboard.sirketiniz.com → /home/kullanici/public_html/dashboard
```

**cPanel → Subdomains:**
1. Subdomain: dashboard
2. Document Root: public_html/dashboard

### Seçenek 2: Klasör
```
sirketiniz.com/dashboard/ → /home/kullanici/public_html/dashboard
```

**Direkt yükleme yeterli**

### Seçenek 3: Ana Domain
```
sirketiniz.com → /home/kullanici/public_html/
```

---

## 🔒 GÜVENLİK AYARLARI

### .htaccess Dosyası (Apache)
```apache
# .htaccess
# HTTPS zorla
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json
</IfModule>

# Cache control
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType application/json "access plus 1 day"
</IfModule>
```

### Login Sayfası Koruma
```apache
# login.html için ek güvenlik
<Files "login.html">
    # Rate limiting (çok fazla deneme engelle)
    # Hostinginizin firewall ayarlarından yapılmalı
</Files>
```

---

## 📊 PERFORMANS KARŞILAŞTIRMA

| Platform | Hız | Maliyet | Güvenilirlik | Kolay |
|----------|-----|---------|--------------|-------|
| **GitHub Pages** | ⭐⭐⭐⭐⭐ | Ücretsiz | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Kendi Hosting** | ⭐⭐⭐ | Zaten var | ⭐⭐⭐ | ⭐⭐⭐ |
| **Vercel/Netlify** | ⭐⭐⭐⭐⭐ | Ücretsiz | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 🎯 ÖNERİM

### SENARİYO 1: Hızlı Başlangıç
**YÖNTEM 1** (Manuel FTP) → 10 dakika

### SENARİYO 2: Otomatik Güncelleme
**YÖNTEM 2** (Git Auto-Deploy) → 30 dakika

### SENARİYO 3: Profesyonel
**YÖNTEM 3** (Webhook) → 1 saat

---

## 💡 BONUS: HİBRİT ÇÖZÜM

### En İyi Seçenek:
1. **Ana site:** Kendi hostinginizde (dashboard.sirketiniz.com)
2. **Veri güncelleme:** GitHub Actions (zaten çalışıyor)
3. **Auto-deploy:** Git pull ile senkronize

**Avantaj:**
- ✅ GitHub Actions ücretsiz (veri çekme)
- ✅ Kendi hostinginizde (kontrol)
- ✅ Otomatik senkronizasyon

---

## 🚀 HIZLI BAŞLANGIÇ

```bash
# 1. Dosyaları zip'le
cd ~/Desktop
zip -r dashboard.zip "Genel Analiz" -x "*.git*" "node_modules/*"

# 2. FTP ile yükle
# 3. https://dashboard.sirketiniz.com
# 4. ✅ Çalışıyor!
```

**Süre:** 10 dakika
**Maliyet:** $0

---

## ❓ SSS

**S: PHP gerekli mi?**
C: Hayır, sadece statik HTML/JS

**S: Database gerekli mi?**
C: Hayır, veriler JSON dosyalarında

**S: SSL gerekli mi?**
C: Zorunlu değil ama şiddetle önerili (HTTPS)

**S: Workflow çalışır mı?**
C: GitHub'da çalışır, hostinginize otomatik aktarılır

---

## 📞 DESTEK

Sorularınız için:
1. Hosting sağlayıcınızın desteği
2. cPanel dokümantasyonu
3. Ben size yardımcı olabilirim! 😊

**Taşıma konusunda yardım ister misiniz?**
