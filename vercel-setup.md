# 🚀 VERCEL KURULUM VE ÖZELLEŞTIRME REHBERİ

## 1️⃣ VERCEL'E DEPLOY (İlk Kurulum)

### Adım 1.1: Vercel Hesabı Oluştur
```
https://vercel.com/signup
```
- **"Continue with GitHub"** seçin
- GitHub hesabınızla giriş yapın

### Adım 1.2: Repository İmport Et
- Vercel Dashboard'da **"Add New Project"**
- **"Import Git Repository"**
- `satiss-dashboard` seçin
- **"Import"** butonuna tıklayın

### Adım 1.3: Deploy Ayarları
```
Framework Preset: Other
Build Command: (boş bırakın)
Output Directory: (boş bırakın)
Install Command: (boş bırakın)
```
- **"Deploy"** butonuna tıklayın
- 1-2 dakika bekleyin

✅ **Deploy tamamlandı!**

---

## 2️⃣ VERCEL LİNKİNİ ÖZELLEŞTİRME

### 🎯 3 Seçenek Var:

---

### SEÇENEK A: Vercel Alt Domain (Ücretsiz)
**Örnek:** `satis-dashboard.vercel.app` → `zuhal-rapor.vercel.app`

#### Adım A.1: Project Settings
- Vercel Dashboard → Your Project → **Settings**

#### Adım A.2: Project Name Değiştir
- **"General"** sekmesi
- **Project Name:** `zuhal-rapor`
- **"Save"**

#### Sonuç:
```
https://zuhal-rapor.vercel.app
```

✅ **Ücretsiz, hemen aktif!**

---

### SEÇENEK B: Kendi Domain'iniz (Önerilen)
**Örnek:** `rapor.zuhalmuzik.com`

#### Adım B.1: Vercel'de Domain Ekle
- Vercel Dashboard → Your Project → **Settings**
- **"Domains"** sekmesi
- **"Add"** butonuna tıklayın
- Domain girin: `rapor.zuhalmuzik.com`
- **"Add"**

#### Adım B.2: DNS Ayarı
Vercel size 2 seçenek sunar:

**SEÇENEK 1: CNAME (Önerilen)**
```
Tip: CNAME
Host: rapor
Value: cname.vercel-dns.com
TTL: 3600
```

**SEÇENEK 2: A Record**
```
Tip: A
Host: rapor
Value: 76.76.21.21
TTL: 3600
```

#### Adım B.3: DNS Panelinde Ayarla
- Domain sağlayıcınızın paneline girin (Hosting firmanız)
- DNS ayarlarına git
- Yukarıdaki kayıtları ekle
- Kaydet

#### Adım B.4: SSL Bekle
- Vercel otomatik SSL sertifikası ekler
- 5-10 dakika bekleyin
- DNS yayılması: 1-24 saat

#### Sonuç:
```
https://rapor.zuhalmuzik.com
```

✅ **Profesyonel, SSL dahil!**

---

### SEÇENEK C: Birden Fazla Domain
**Örnek:** `rapor.zuhalmuzik.com` + `dashboard.zuhalmuzik.com`

#### Aynı projeye birden fazla domain ekleyebilirsiniz:
```
rapor.zuhalmuzik.com (Ana)
dashboard.zuhalmuzik.com (Alternatif)
zuhal-rapor.vercel.app (Yedek)
```

---

## 3️⃣ VERCEL VS GITHUB PAGES

### Domain Karşılaştırma:

| Platform | Default Domain | Custom Domain |
|----------|---------------|---------------|
| **GitHub Pages** | `toftamars.github.io/satiss-dashboard` | ✅ `rapor.zuhalmuzik.com` |
| **Vercel** | `satis-dashboard.vercel.app` | ✅ `rapor.zuhalmuzik.com` |

### 🎯 Sonuç:
**HER İKİSİNDE DE** `rapor.zuhalmuzik.com` kullanabilirsiniz!

**Vercel Farkı:**
- ✅ Daha hızlı (Global CDN)
- ✅ Analytics ücretsiz
- ✅ Preview URL'leri (her commit için)
- ✅ Otomatik HTTPS
- ✅ Daha kolay domain yönetimi

---

## 4️⃣ HANGİ PLATFORMU SEÇMELİYİM?

### GitHub Pages İçin Kal:
- ✅ Zaten çalışıyor
- ✅ Basit proje
- ✅ Değişiklik gerektirmiyor

### Vercel'e Geç:
- ✅ Analytics istiyorsanız
- ✅ Daha hızlı site
- ✅ Preview URL'leri
- ✅ Gelecekte backend ekleyebilirsiniz

---

## 5️⃣ VERCEL ANALYTICS AKTIF ET (Ücretsiz)

### Adım 5.1: Analytics Ekle
- Vercel Dashboard → Your Project
- **"Analytics"** sekmesi
- **"Enable"** butonuna tıklayın

### Adım 5.2: Script Ekle
Vercel otomatik olarak analytics ekler, hiçbir kod değişikliği gerekmez!

### Görebileceğiniz Veriler:
```
📊 Ziyaretçi sayısı
🌍 Hangi ülkelerden geliyor
⏱️ Sayfa yükleme süresi
📱 Mobil / Desktop oranı
🔗 En çok ziyaret edilen sayfalar
```

✅ **Ücretsiz, limitsiz!**

---

## 6️⃣ VERCEL + FIREBASE AUTH (Uyumluluk)

### ✅ Tam Uyumlu!

Firebase Auth, Vercel'de sorunsuz çalışır.

**Tek Yapmanız Gereken:**
1. Firebase Console → Project Settings → Authorized domains
2. Vercel domain'inizi ekleyin:
```
zuhal-rapor.vercel.app
rapor.zuhalmuzik.com (eğer ekliyseniz)
```

✅ **Hepsi bu!**

---

## 7️⃣ OTOMATIK DEPLOY

### ✅ Vercel Otomatik Deploy Yapar!

**Her `git push` yaptığınızda:**
1. Vercel otomatik deploy başlatır
2. 1-2 dakika içinde canlıya alır
3. Email ile bildirim alırsınız

**Ekstra bir şey yapmanıza gerek yok!**

---

## 🎯 ÖZET

### Vercel Domain Özelleştirme:

| Yöntem | Domain | Süre | Maliyet |
|--------|--------|------|---------|
| **A: Alt Domain** | `zuhal-rapor.vercel.app` | 2 dk | Ücretsiz |
| **B: Kendi Domain** | `rapor.zuhalmuzik.com` | 1 saat | Ücretsiz |
| **C: Birden Fazla** | İkisi birden | 1 saat | Ücretsiz |

### 💡 Önerim:
**Önce Alt Domain ile test edin (A)**, sonra kendi domain'inizi ekleyin (B).

---

## 📞 DESTEK

### Domain DNS Ayarı için:
1. Hosting firmanızın (domain aldığınız yer) paneline girin
2. DNS ayarları veya "DNS Management"
3. CNAME kaydı ekleyin
4. 1-24 saat bekleyin (genelde 1 saat yeter)

### Vercel Destek:
- Vercel Dashboard → Help
- Canlı chat desteği var (İngilizce)

**Developed by Tofta** 🚀
