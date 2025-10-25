# 🎯 CURSOR KULLANIM REHBERİ

Bu rehber, SORUNLAR_VE_COZUMLER.md dosyasını Cursor AI ile nasıl kullanacağınızı adım adım gösterir.

---

## 📋 YÖNTEM 1: CURSOR CHAT İLE (ÖNERİLEN)

### Adım 1: Dosyayı Aç

```bash
# Cursor'da terminal aç (Ctrl + `)
cd /workspace
cursor SORUNLAR_VE_COZUMLER.md
```

### Adım 2: Chat'i Aç

- Klavye: `Ctrl + L` (Windows/Linux) veya `Cmd + L` (Mac)
- Veya sağ üstteki chat ikonu

### Adım 3: Dosyaya Referans Ver

Chat'e şunu yaz:

```
@SORUNLAR_VE_COZUMLER.md Sorun 1'i çözmeye başla
```

**Cursor şunu yapacak:**
1. config.json'dan API key'leri tespit edecek
2. Environment variable yapısını önerecek
3. Gerekli kod değişikliklerini gösterecek
4. Adım adım rehberlik edecek

### Adım 4: Kodu Uygula

Cursor'un önerdiği kodu:
- `Accept` tuşuna bas (otomatik uygular)
- veya kopyala-yapıştır

### Adım 5: Test Et

```bash
# Terminal'de
git add .
git commit -m "fix: Remove API key from config.json"
git push origin main
```

---

## 📋 YÖNTEM 2: COMPOSER İLE (TOPLU DEĞİŞİKLİK)

Composer çok dosyada değişiklik yapmanızı sağlar.

### Adım 1: Composer'ı Aç

- Klavye: `Ctrl + I` (Windows/Linux) veya `Cmd + I` (Mac)
- Veya: View → Composer

### Adım 2: Talimat Ver

```
@SORUNLAR_VE_COZUMLER.md dosyasındaki Sorun 1, 2 ve 3'ü çöz.

Şunları yap:
1. config.json'ı git'ten kaldır
2. .gitignore'a ekle  
3. Environment variable yapısını kur
4. Mock authentication'ı kaldır
5. Duplicate saveSession'ı düzelt

Tüm değişiklikleri göster ve uygula.
```

**Cursor şunu yapacak:**
1. Çoklu dosyaları düzenleyecek
2. Değişiklikleri önizleme gösterecek
3. Tek tuşla hepsini uygulayacak

### Adım 3: Önizleme ve Uygula

- `Review Changes` düğmesine bas
- Değişiklikleri gözden geçir
- `Accept All` ile hepsini uygula

---

## 📋 YÖNTEM 3: INLINE DÜZENLEME

Dosya üzerinde direkt düzenleme.

### Adım 1: Dosyayı Aç

```bash
cursor js/modules/auth-odoo.js
```

### Adım 2: Sorunlu Kodu Seç

- LINE 150-193 arası mock authentication kodunu seç
- Sağ tık → `Ask Cursor`

### Adım 3: Talimat Ver

```
@SORUNLAR_VE_COZUMLER.md Sorun 2'ye göre bu kodu düzelt.
Mock authentication yerine gerçek Odoo API kullan.
```

### Adım 4: Değişikliği Uygula

- `Accept` tuşuna bas
- Veya `Ctrl + Z` ile geri al

---

## 🎯 ÖRNEK KULLANIM SENARYOLARı

### Senaryo 1: Lazy Load Inventory (5 dakika)

**Chat'e yaz:**
```
@SORUNLAR_VE_COZUMLER.md Sorun 4'ü çöz.

js/modules/data-loader.js dosyasını düzenle:
1. loadAllData() fonksiyonundan loadInventoryData() çağrısını kaldır
2. loadInventoryDataLazy() fonksiyonunu ekle
3. index.html'e switchTab() fonksiyonunu ekle

Adım adım göster.
```

**Cursor yapacağı:**
1. ✅ data-loader.js'i açacak
2. ✅ LINE 249'u bulacak ve silecek
3. ✅ Yeni fonksiyon ekleyecek
4. ✅ index.html'e kod ekleyecek
5. ✅ Test kodu önerecek

---

### Senaryo 2: Error Handler Ekle (30 dakika)

**Composer'da yaz:**
```
@SORUNLAR_VE_COZUMLER.md Sorun 6'yı çöz.

Şunları yap:
1. js/modules/error-handler.js dosyası oluştur
2. Tüm chart fonksiyonlarına try-catch ekle
3. dashboard.js'e error handling ekle
4. Global error handler başlat

Dosya dosya göster.
```

**Cursor yapacağı:**
1. ✅ error-handler.js oluşturacak
2. ✅ charts.js'i güncelleyecek (7 fonksiyon)
3. ✅ dashboard.js'i güncelleyecek
4. ✅ app-init.js'e import ekleyecek

---

### Senaryo 3: Test Kurulumu (1 saat)

**Chat'e yaz:**
```
@SORUNLAR_VE_COZUMLER.md Sorun 8'i çöz.

Jest kurulumunu yap:
1. package.json'a devDependencies ekle
2. jest.config.js oluştur
3. .babelrc oluştur
4. İlk test dosyası: utils.test.js
5. npm test komutunu çalıştır

Hata alırsam düzelt.
```

**Cursor yapacağı:**
1. ✅ package.json güncelleyecek
2. ✅ Config dosyalarını oluşturacak
3. ✅ Test dosyası yazacak
4. ✅ Hataları debug edecek
5. ✅ Terminal komutlarını çalıştıracak

---

## 💡 İPUÇLARI

### İpucu 1: Spesifik Ol
❌ Kötü: "Performansı iyileştir"
✅ İyi: "@SORUNLAR_VE_COZUMLER.md Sorun 4'ü çöz - Lazy load inventory ekle"

### İpucu 2: Dosya Referansı Kullan
```
@SORUNLAR_VE_COZUMLER.md dosyasındaki Sorun 1
@js/modules/auth-odoo.js LINE 150-193
```

### İpucu 3: Adım Adım İste
```
Sorun 1'i çöz, ama adım adım:
1. Önce .gitignore'ı göster
2. Sonra config.json'ı nasıl sileceğimi göster
3. Environment variables'ı nasıl ayarlayacağımı göster
```

### İpucu 4: Önizleme İste
```
Değişiklikleri önce göster, uygulamadan önce onay iste.
```

### İpucu 5: Test Kodu İste
```
Her değişiklikten sonra test kodu da yaz.
```

---

## 🔧 SORUN GİDERME

### Cursor Dosyayı Bulamıyor

```bash
# Dosya yolunu tam ver
@/workspace/SORUNLAR_VE_COZUMLER.md Sorun 1
```

### Cursor Yanlış Dosyayı Değiştiriyor

```bash
# Dosya yolunu spesifik belirt
Sadece js/modules/auth-odoo.js dosyasını değiştir, başka hiçbir dosyaya dokunma.
```

### Cursor Kod Üretmiyor

```bash
# Daha spesifik ol
@SORUNLAR_VE_COZUMLER.md Sorun 1'deki "Adım 1" kısmını uygula.
config.json dosyasını git'ten kaldırmak için tam komutu ver.
```

### Değişiklik Uygulanmıyor

```bash
# Manuel uygula
1. Cursor'un önerdiği kodu kopyala
2. Dosyayı aç
3. Yapıştır
4. Kaydet (Ctrl + S)
```

---

## 📊 ÇALIŞMA AKIŞI

### Haftalık Plan

**1. Hafta (Pazartesi - Cuma):**
```bash
# Her gün 1 sorun çöz
Pazartesi:  Sorun 1 (API Key)
Salı:       Sorun 2 (Mock Auth)
Çarşamba:   Sorun 3 (Duplicate Function)
Perşembe:   Sorun 4 (Lazy Load)
Cuma:       Sorun 5 (Database)
```

**2. Hafta:**
```bash
Pazartesi:  Sorun 6 (Error Handler)
Salı:       Sorun 7 (Logger)
Çarşamba:   Sorun 8 (Jest)
Perşembe:   Sorun 9 (ESLint)
Cuma:       Sorun 10 (Prettier)
```

### Her Sorun İçin

1. **Oku** → SORUNLAR_VE_COZUMLER.md'deki sorunu oku
2. **Anla** → Risk seviyesini ve etkisini anla
3. **Sor** → Cursor'a "@SORUNLAR_VE_COZUMLER.md Sorun X"
4. **Uygula** → Cursor'un önerisini uygula
5. **Test Et** → Çalıştığını kontrol et
6. **Commit** → Git'e commit at
7. **İşaretle** → Checkbox'ı ✅ yap

---

## 🎓 GELİŞMİŞ KULLANIM

### Çoklu Sorun Çözme

```bash
@SORUNLAR_VE_COZUMLER.md 

"Acil Güvenlik Sorunları" bölümündeki TÜM sorunları (1,2,3) çöz.

Önce plan yap:
1. Hangi dosyaları değiştireceğini listele
2. Hangi sırayla yapacağını söyle
3. Beklenmeyen sorunları uyar

Sonra adım adım uygula.
```

### Otomatik Test Ekleme

```bash
@SORUNLAR_VE_COZUMLER.md Sorun 6'yı çöz.

Error handler ekle VE her fonksiyon için unit test yaz.
Test coverage %80+ olmalı.
```

### Dokümantasyon Güncelleme

```bash
Sorun 1'i çözdükten sonra:
1. README.md'yi güncelle
2. docs/API.md'yi güncelle
3. CHANGELOG.md'ye ekle
```

---

## 📝 NOTLAR

### Her Commit Sonrası

```bash
# Değişiklikleri kontrol et
git status
git diff

# Commit at
git add .
git commit -m "fix: [SORUN-1] API key'i environment variable'a taşı"
git push origin main
```

### Checkpoint'ler

Her 5 sorun sonrası:
```bash
git tag -a v1.0.1 -m "Güvenlik sorunları çözüldü"
git push origin v1.0.1
```

### İlerleme Takibi

SORUNLAR_VE_COZUMLER.md dosyasında:
```markdown
- [x] Sorun 1: API Key ✅ (2025-10-25)
- [x] Sorun 2: Mock Auth ✅ (2025-10-26)
- [ ] Sorun 3: Duplicate Function ⏳
```

---

## 🎯 HEDEFLER

### 1. Hafta Sonu
- ✅ Güvenlik: 40/100 → 80/100
- ✅ Performans: 50/100 → 70/100
- ✅ 5 kritik sorun çözüldü

### 3. Hafta Sonu
- ✅ Kod Kalitesi: 70/100 → 85/100
- ✅ Test: 0/100 → 60/100
- ✅ 11 sorun çözüldü

### 2. Ay Sonu
- ✅ **GENEL PUAN: 65/100 → 82/100**
- ✅ Production-ready
- ✅ 16 sorun çözüldü

---

## 🚀 BAŞARILAR

Cursor ile bu sorunları çözdüğünüzde:

✅ Daha güvenli bir sistem  
✅ 10x daha hızlı dashboard  
✅ Daha kolay bakım  
✅ Professional kod kalitesi  
✅ Test coverage  
✅ Happy team! 🎉

---

**Başarılar! 🚀**

Sorularınız için: Cursor Chat → "@CURSOR_KULLANIM_REHBERI.md"
