


# 🔍 Akıllı Arama Kılavuzu

## Dashboard'da Yapılan İyileştirmeler

### 1️⃣ **Görünüm İyileştirmeleri**

#### ✅ Tablo Responsive Yapıldı
- Tablo artık yatay kaydırma ile tam genişlikte görüntüleniyor
- Mobil ve küçük ekranlarda sorunsuz çalışıyor
- Başlıklar sabit kalıyor (sticky header)

#### ✅ Tam Metin Görüntüleme
- Hücrelere **HOVER** (fare ile üzerine gelince) yapınca tam metin görünüyor
- Örnek: `[1101404] Perakende - Aka...` → Hover → `[1101404] Perakende - Akasya`
- Tooltip'ler eklendi (title attribute)

#### ✅ Sayısal Alanlar
- Miktar ve USD Tutar sağa hizalandı
- Monospace font ile daha okunabilir

---

### 2️⃣ **Akıllı Arama Motoru** 🧠

Dashboard'daki arama çubuğu artık **doğal dil** anlıyor!

#### 🎯 Özellikler:

##### **A) Tarih Aralığı Tespiti**
```
"son 30 gün"        → Son 30 günün verileri
"son 1 ay"          → Son 1 ayın verileri
"son 3 ay"          → Son 3 ayın verileri
"son 90 gün"        → Son 90 günün verileri
```

##### **B) Ay İsmi Tespiti**
```
"ocak"              → Ocak ayı
"şubat" / "subat"   → Şubat ayı
"ekim"              → Ekim ayı
"aralık" / "aralik" → Aralık ayı
```
*Tüm Türkçe ay isimleri destekleniyor (hem ş/ç/ğ hem de s/c/g)*

##### **C) Yıl Tespiti**
```
"2025"              → 2025 yılı
"2024"              → 2024 yılı
```

##### **D) Mağaza Otomatik Tespiti**
```
"akasya"            → Akasya mağazası
"kadıköy"           → Kadıköy mağazası
"beylikdüzü"        → Beylikdüzü mağazası
```

##### **E) Genel Anahtar Kelime Arama**
Tüm alanlarda arama yapar:
- İş Ortağı (Müşteri)
- Ürün
- Marka
- Kategori 1-5
- Satış Temsilcisi
- Şehir
- Etiketler

---

### 3️⃣ **Örnek Aramalar**

#### 🔥 Popüler Arama Örnekleri:

```
"Akasya 2025 ekim"
→ Akasya mağazası, 2025 yılı, Ekim ayı

"son 1 ay Fender"
→ Son 1 aydaki tüm Fender satışları

"Kadıköy gitar son 30 gün"
→ Kadıköy mağazası, gitar kategorisi, son 30 gün

"2025 ocak yamaha"
→ 2025 Ocak ayındaki Yamaha satışları

"akasya son 3 ay"
→ Akasya mağazası, son 3 ay

"istanbul fender"
→ İstanbul'daki Fender satışları

"perakende son 90 gün"
→ Perakende müşterileri, son 90 gün
```

---

### 4️⃣ **Kullanım İpuçları**

#### ✨ **En İyi Sonuçlar İçin:**

1. **Doğal Dille Yazın**
   - ❌ "magaza=akasya AND yil=2025"
   - ✅ "Akasya 2025"

2. **Birden Fazla Kelime Kullanın**
   - ❌ "Fender"
   - ✅ "Akasya Fender son 1 ay"

3. **Enter Tuşu ile Arayın**
   - Arama kutusuna yazdıktan sonra **Enter** tuşuna basın
   - Veya 🔍 **Ara** butonuna tıklayın

4. **Filtreleri Kombine Edin**
   - Akıllı arama + Manuel filtreler birlikte çalışır
   - Önce akıllı arama yapın, sonra filtreleri ince ayar için kullanın

---

### 5️⃣ **Teknik Detaylar**

#### 🛠️ **Nasıl Çalışır?**

1. **Anahtar Kelime Analizi**
   - Arama metnini kelimelere böler
   - Her kelimeyi analiz eder

2. **Akıllı Tespit**
   - Tarih ifadelerini (`son X ay/gün`) tespit eder
   - Ay isimlerini (`ocak`, `şubat`) tespit eder
   - Yılları (`2025`, `2024`) tespit eder
   - Mağaza isimlerini (`akasya`, `kadıköy`) tespit eder

3. **Otomatik Filtreleme**
   - Tespit edilen değerleri filtrelere otomatik uygular
   - Kalan kelimeleri tüm alanlarda arar

4. **Sonuç Gösterimi**
   - Eşleşen kayıtları gösterir
   - Özet istatistikleri günceller
   - Debug panelinde detaylı bilgi verir

---

### 6️⃣ **Sorun Giderme**

#### ❓ **Arama Sonuç Vermiyor?**

1. **Console'u Kontrol Edin**
   - Tarayıcıda `F12` → Console
   - `🔍 Akıllı Arama:` loglarını inceleyin

2. **Filtreleri Sıfırlayın**
   - **Sıfırla** butonuna tıklayın
   - Tekrar arama yapın

3. **Daha Genel Arayın**
   - Çok spesifik aramalar sonuç vermeyebilir
   - Önce genel arayın, sonra filtreleri daraltın

#### ❓ **Mağaza İsmi Görünmüyor?**

- Hücreye **HOVER** (fare ile üzerine gelin)
- Tam metin görünecektir
- Örnek: `[1101404] Perakende - Akasya`

---

### 7️⃣ **Gelecek Özellikler** 🚀

- [ ] Tarih aralığı seçici (date picker)
- [ ] Favori aramalar kaydetme
- [ ] Excel export
- [ ] Grafik ve chart'lar
- [ ] Müşteri analizi sekmesi
- [ ] Hedef takip sistemi

---

## 📊 Dashboard Linki

**Canlı Dashboard:**  
https://toftamars.github.io/satiss-dashboard/

**GitHub Repository:**  
https://github.com/toftamars/satiss-dashboard

---

## 🆘 Destek

Sorun yaşarsanız veya yeni özellik önerileriniz varsa:
- GitHub Issues açın
- Veya doğrudan iletişime geçin

---

**Son Güncelleme:** 15 Ekim 2025  
**Versiyon:** 2.0 (Akıllı Arama)

