# 🤖 GPT ENTEGRASYONU KILAVUZU

## Dashboard'a GPT-4 Entegrasyonu Nasıl Yapılır?

---

## 📋 **İÇİNDEKİLER**

1. [GPT Nedir ve Neden Kullanmalıyız?](#gpt-nedir)
2. [Mevcut AI vs GPT Karşılaştırması](#karşılaştırma)
3. [GPT Entegrasyon Yöntemleri](#entegrasyon-yöntemleri)
4. [Adım Adım Implementasyon](#implementasyon)
5. [Maliyet Analizi](#maliyet)
6. [Örnek Kullanım Senaryoları](#senaryolar)
7. [Güvenlik ve Best Practices](#güvenlik)

---

## 🧠 **GPT Nedir ve Neden Kullanmalıyız?** {#gpt-nedir}

### **GPT (Generative Pre-trained Transformer)**

GPT, OpenAI tarafından geliştirilen, doğal dil işleme konusunda en gelişmiş yapay zeka modelidir.

### **Mevcut AI Sistemimiz:**
```javascript
// Şu anki sistemimiz:
- Kural tabanlı analiz
- Önceden tanımlanmış şablonlar
- Sabit eşik değerleri (örn: %30, %50)
- Sınırlı içgörü üretimi
```

### **GPT ile Neler Değişir:**
```javascript
// GPT ile:
✅ Dinamik analiz
✅ Bağlama duyarlı öneriler
✅ Doğal dil ile sohbet
✅ Tahmin ve projeksiyon
✅ Sektörel bilgi
✅ Karmaşık soru-cevap
```

---

## ⚖️ **Mevcut AI vs GPT Karşılaştırması** {#karşılaştırma}

### **Mevcut Sistemimiz (Rule-Based AI):**

**Avantajlar:**
- ✅ Ücretsiz
- ✅ Hızlı (50-200ms)
- ✅ Offline çalışır
- ✅ Veri gizliliği (veriler dışarı çıkmaz)
- ✅ Öngörülebilir sonuçlar

**Dezavantajlar:**
- ❌ Sınırlı içgörü
- ❌ Sabit şablonlar
- ❌ Bağlam anlayışı yok
- ❌ Öğrenme yok
- ❌ Karmaşık sorulara cevap veremez

### **GPT Entegrasyonu:**

**Avantajlar:**
- ✅ Çok derin analiz
- ✅ Doğal dil anlama
- ✅ Bağlama duyarlı
- ✅ Tahmin yapabilir
- ✅ Sektörel bilgi
- ✅ Sohbet edebilir

**Dezavantajlar:**
- ❌ Ücretli ($0.01-0.06 per 1K token)
- ❌ Yavaş (2-5 saniye)
- ❌ İnternet gerekli
- ❌ Veriler OpenAI'ye gider
- ❌ API key gerekli

---

## 🔌 **GPT Entegrasyon Yöntemleri** {#entegrasyon-yöntemleri}

### **Yöntem 1: OpenAI API (Direkt)**

**Nasıl Çalışır:**
```
Dashboard → OpenAI API → GPT-4 → Analiz → Dashboard
```

**Avantajlar:**
- En güçlü model (GPT-4 Turbo)
- Resmi API
- Güvenilir

**Dezavantajlar:**
- Ücretli
- API key gerekli
- CORS sorunları (frontend'den)

**Maliyet:**
- GPT-4 Turbo: $0.01 / 1K input token, $0.03 / 1K output token
- GPT-3.5 Turbo: $0.0005 / 1K input token, $0.0015 / 1K output token

---

### **Yöntem 2: Backend Proxy (Önerilen)**

**Nasıl Çalışır:**
```
Dashboard → Backend API → OpenAI API → GPT-4 → Backend → Dashboard
```

**Avantajlar:**
- API key gizli kalır
- CORS yok
- Rate limiting kontrol
- Caching yapılabilir
- Kullanıcı bazlı limit

**Dezavantajlar:**
- Backend gerekli (Node.js, Python, vb.)
- Deploy gerekli

**Örnek Backend (Node.js):**
```javascript
// server.js
const express = require('express');
const OpenAI = require('openai');

const app = express();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/analyze', async (req, res) => {
  const { data, query } = req.body;
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "Sen bir satış analisti AI'sın. Verilen satış verilerini analiz edip içgörüler üret."
        },
        {
          role: "user",
          content: `Satış Verileri:\n${JSON.stringify(data)}\n\nSoru: ${query}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });
    
    res.json({ analysis: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
```

---

### **Yöntem 3: Serverless Functions (Vercel, Netlify)**

**Nasıl Çalışır:**
```
Dashboard → Serverless Function → OpenAI API → GPT-4 → Function → Dashboard
```

**Avantajlar:**
- Ücretsiz tier (Vercel: 100GB-hours/month)
- Otomatik scaling
- Deploy kolay
- API key gizli

**Örnek (Vercel):**
```javascript
// api/analyze.js
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  const { data, query } = req.body;
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      { role: "system", content: "Sen bir satış analisti AI'sın." },
      { role: "user", content: `Veri: ${JSON.stringify(data)}\nSoru: ${query}` }
    ]
  });
  
  res.json({ analysis: completion.choices[0].message.content });
}
```

---

## 🛠️ **Adım Adım Implementasyon** {#implementasyon}

### **Seçenek A: Basit Entegrasyon (Frontend Only - Test İçin)**

**⚠️ DİKKAT: API key açıkta kalır, sadece test için kullanın!**

```javascript
// index.html içine ekleyin

// GPT Analiz Fonksiyonu
async function analyzeWithGPT(data, query) {
    const API_KEY = 'sk-...'; // ⚠️ PRODUCTION'DA KULLANMAYIN!
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'Sen bir satış analisti AI\'sın. Türkçe cevap ver.'
                },
                {
                    role: 'user',
                    content: `Satış Verileri:\nToplam Satış: $${data.totalUSD}\nKayıt Sayısı: ${data.recordCount}\nOrtalama Sipariş: $${data.avgOrderValue}\n\nSoru: ${query}`
                }
            ],
            temperature: 0.7,
            max_tokens: 500
        })
    });
    
    const result = await response.json();
    return result.choices[0].message.content;
}

// Kullanım
async function performGPTAnalysis() {
    const analysis = analyzeData(filteredData);
    
    const gptResponse = await analyzeWithGPT(analysis, 
        'Bu satış verilerini analiz et ve 3 önemli içgörü ver.'
    );
    
    console.log('GPT Analizi:', gptResponse);
    // UI'a ekle
}
```

---

### **Seçenek B: Güvenli Entegrasyon (Backend ile)**

#### **1. Backend Kurulumu (Node.js + Express)**

```bash
# Yeni proje oluştur
mkdir sales-dashboard-backend
cd sales-dashboard-backend
npm init -y

# Gerekli paketleri yükle
npm install express openai cors dotenv
```

#### **2. Backend Kodu (server.js)**

```javascript
require('dotenv').config();
const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Rate limiting (basit)
const requestCounts = new Map();
const RATE_LIMIT = 10; // 10 request per hour
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

app.post('/api/analyze', async (req, res) => {
  const { data, query, userId = 'anonymous' } = req.body;
  
  // Rate limiting kontrolü
  const now = Date.now();
  const userRequests = requestCounts.get(userId) || [];
  const recentRequests = userRequests.filter(time => now - time < RATE_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT) {
    return res.status(429).json({ 
      error: 'Rate limit aşıldı. 1 saat sonra tekrar deneyin.' 
    });
  }
  
  recentRequests.push(now);
  requestCounts.set(userId, recentRequests);
  
  try {
    // Veriyi özetle (token tasarrufu)
    const summary = {
      totalSales: data.totalUSD,
      recordCount: data.recordCount,
      avgOrder: data.avgOrderValue,
      topStores: data.topStores?.slice(0, 3).map(s => ({
        name: s[0],
        sales: s[1].sales
      })),
      topBrands: data.topBrands?.slice(0, 3).map(b => ({
        name: b[0],
        count: b[1].count
      }))
    };
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Daha ucuz
      messages: [
        {
          role: "system",
          content: `Sen bir satış analisti AI'sın. Verilen satış verilerini analiz edip Türkçe olarak:
          1. En önemli 3 içgörüyü
          2. 2 risk faktörünü
          3. 3 aksiyon önerisini ver.
          
          Kısa ve öz cevaplar ver. Emoji kullan.`
        },
        {
          role: "user",
          content: `Satış Verileri:\n${JSON.stringify(summary, null, 2)}\n\nSoru: ${query}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });
    
    const analysis = completion.choices[0].message.content;
    const tokensUsed = completion.usage.total_tokens;
    
    res.json({ 
      analysis,
      tokensUsed,
      cost: (tokensUsed / 1000 * 0.002).toFixed(4) // Yaklaşık maliyet
    });
    
  } catch (error) {
    console.error('GPT Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend çalışıyor: http://localhost:${PORT}`);
});
```

#### **3. .env Dosyası**

```env
OPENAI_API_KEY=sk-your-api-key-here
PORT=3000
```

#### **4. Frontend Entegrasyonu**

```javascript
// index.html içine ekleyin

const BACKEND_URL = 'http://localhost:3000'; // veya production URL

async function analyzeWithGPT(data, query) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: {
                    totalUSD: data.totalUSD,
                    recordCount: data.recordCount,
                    avgOrderValue: data.avgOrderValue,
                    topStores: data.topStores,
                    topBrands: data.topBrands
                },
                query: query,
                userId: 'user123' // Kullanıcı ID'si
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        return result;
        
    } catch (error) {
        console.error('GPT Analiz Hatası:', error);
        return { 
            analysis: '❌ GPT analizi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.',
            error: error.message
        };
    }
}

// UI'a GPT butonu ekle
function addGPTButton() {
    const html = `
        <button class="export-btn" onclick="performGPTAnalysis()" 
                style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
            🤖 GPT Analiz
        </button>
    `;
    // Arama çubuğuna ekle
    document.querySelector('.search-box').insertAdjacentHTML('beforeend', html);
}

async function performGPTAnalysis() {
    const btn = event.target;
    btn.disabled = true;
    btn.textContent = '⏳ Analiz ediliyor...';
    
    const analysis = analyzeData(filteredData);
    
    const result = await analyzeWithGPT(analysis, 
        'Bu satış verilerini detaylı analiz et ve öneriler sun.'
    );
    
    // Sonucu göster
    showGPTResult(result);
    
    btn.disabled = false;
    btn.textContent = '🤖 GPT Analiz';
}

function showGPTResult(result) {
    const panel = document.getElementById('aiAnalysisPanel');
    
    const html = `
        <div class="analysis-panel" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
            <h2>🤖 GPT-4 Analizi</h2>
            <div style="background: rgba(255,255,255,0.2); padding: 20px; border-radius: 10px; white-space: pre-wrap;">
                ${result.analysis}
            </div>
            <p style="margin-top: 15px; opacity: 0.8; font-size: 0.9em;">
                💰 Maliyet: $${result.cost} | 🔢 Token: ${result.tokensUsed}
            </p>
        </div>
    `;
    
    panel.innerHTML = html;
    panel.style.display = 'block';
}

// Sayfa yüklendiğinde butonu ekle
window.addEventListener('load', addGPTButton);
```

---

## 💰 **Maliyet Analizi** {#maliyet}

### **GPT-3.5 Turbo (Önerilen)**

```
Input:  $0.0005 / 1K token
Output: $0.0015 / 1K token

Örnek Analiz:
- Input: 500 token (veri özeti)
- Output: 300 token (analiz)
- Toplam: 800 token
- Maliyet: (500 * 0.0005 + 300 * 0.0015) / 1000 = $0.0007 (~0.02 TL)

Günlük 100 analiz: $0.07 (~2 TL)
Aylık 3000 analiz: $2.10 (~60 TL)
```

### **GPT-4 Turbo**

```
Input:  $0.01 / 1K token
Output: $0.03 / 1K token

Örnek Analiz:
- Input: 500 token
- Output: 300 token
- Maliyet: (500 * 0.01 + 300 * 0.03) / 1000 = $0.014 (~0.40 TL)

Günlük 100 analiz: $1.40 (~40 TL)
Aylık 3000 analiz: $42 (~1200 TL)
```

### **Maliyet Optimizasyonu:**

1. **Caching:** Aynı veri için 5 dakika cache
2. **Veri Özetleme:** Sadece özet gönder
3. **GPT-3.5 Kullan:** 20x daha ucuz
4. **Rate Limiting:** Kullanıcı başına limit
5. **Batch Processing:** Toplu analiz

---

## 🎯 **Örnek Kullanım Senaryoları** {#senaryolar}

### **Senaryo 1: Sohbet Tabanlı Analiz**

```javascript
// Kullanıcı soruyor:
"Akasya mağazasının performansı nasıl?"

// GPT cevaplıyor:
"🏪 Akasya Mağazası Analizi:

✅ Güçlü Yönler:
- Toplam satışların %42'sini gerçekleştirmiş ($125,340)
- Son 3 ayda %18 büyüme
- Ortalama sipariş değeri $156 (genel ortalama: $98)

⚠️ Dikkat Noktaları:
- Fender ürünlerinde stok sıkıntısı var (15 kayıp satış)
- Cumartesi günleri diğer günlere göre %30 daha düşük

🎯 Öneriler:
1. Fender stoklarını artırın
2. Cumartesi için özel kampanya düzenleyin
3. Yüksek sipariş değerini korumak için premium ürün çeşitliliğini artırın"
```

### **Senaryo 2: Tahmin ve Projeksiyon**

```javascript
// Kullanıcı soruyor:
"Bu ay hedefimize ulaşabilir miyiz?"

// GPT cevaplıyor:
"📊 Hedef Analizi (Ekim 2025):

🎯 Hedef: $50,000
✅ Gerçekleşen: $32,450 (15 gün)
⏰ Kalan: $17,550 (15 gün)

📈 Tahmin:
Mevcut günlük ortalama: $2,163
Gerekli günlük ortalama: $1,170

✅ HEDEF ULAŞILABİLİR!

Mevcut performansınız hedefin %85 üzerinde. Bu hızla ayı $32,445 fazlasıyla kapatırsınız.

💡 Öneriler:
- Mevcut tempoyu koruyun
- Son hafta için özel kampanya gerekmeyebilir
- Fazla performansı Kasım hedefine yansıtabilirsiniz"
```

### **Senaryo 3: Karşılaştırmalı Analiz**

```javascript
// Kullanıcı soruyor:
"Akasya ve Kadıköy mağazalarını karşılaştır"

// GPT cevaplıyor:
"🏪 Mağaza Karşılaştırması:

AKASYA:
- Satış: $125,340 (1. sıra)
- Sipariş sayısı: 804
- Ortalama sipariş: $156
- Güçlü kategoriler: Gitar (%45), Piyano (%30)

KADIKÖY:
- Satış: $89,230 (2. sıra)
- Sipariş sayısı: 1,120
- Ortalama sipariş: $80
- Güçlü kategoriler: Aksesuar (%52), Gitar (%28)

📊 Farklar:
- Akasya %40 daha yüksek satış
- Kadıköy %39 daha fazla sipariş
- Akasya'da ortalama sipariş 2x daha yüksek

💡 İçgörüler:
- Akasya premium müşteri odaklı
- Kadıköy volume odaklı
- Kadıköy'de cross-selling potansiyeli yüksek"
```

---

## 🔒 **Güvenlik ve Best Practices** {#güvenlik}

### **1. API Key Güvenliği**

```javascript
// ❌ YANLIŞ - Frontend'de API key
const API_KEY = 'sk-...'; // Herkes görebilir!

// ✅ DOĞRU - Backend'de
// .env dosyasında
OPENAI_API_KEY=sk-...

// Server'da
const apiKey = process.env.OPENAI_API_KEY;
```

### **2. Rate Limiting**

```javascript
// Her kullanıcı için limit
const LIMITS = {
  free: 10,      // 10 request/hour
  premium: 100   // 100 request/hour
};
```

### **3. Input Validation**

```javascript
// Veri boyutu kontrolü
if (JSON.stringify(data).length > 10000) {
  throw new Error('Veri çok büyük');
}

// Zararlı içerik kontrolü
if (query.includes('ignore previous instructions')) {
  throw new Error('Geçersiz sorgu');
}
```

### **4. Error Handling**

```javascript
try {
  const result = await analyzeWithGPT(data, query);
} catch (error) {
  // Fallback: Mevcut AI sistemini kullan
  const result = performAIAnalysis();
}
```

### **5. Caching**

```javascript
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 dakika

async function analyzeWithCache(data, query) {
  const key = JSON.stringify({data, query});
  const cached = cache.get(key);
  
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return cached.result;
  }
  
  const result = await analyzeWithGPT(data, query);
  cache.set(key, { result, time: Date.now() });
  
  return result;
}
```

---

## 🚀 **Hızlı Başlangıç (5 Dakikada GPT)**

### **1. OpenAI API Key Al**
```
1. https://platform.openai.com/ adresine git
2. Sign up / Login
3. API Keys → Create new secret key
4. Key'i kopyala (sk-...)
```

### **2. Vercel Serverless Function Oluştur**
```bash
# Yeni proje
npx create-next-app@latest my-dashboard-api
cd my-dashboard-api

# OpenAI paketi
npm install openai

# api/analyze.js oluştur (yukarıdaki kodu kullan)

# Deploy
vercel
```

### **3. Dashboard'a Ekle**
```javascript
// index.html'e ekle
const BACKEND_URL = 'https://your-project.vercel.app';

// GPT butonu ekle (yukarıdaki kodu kullan)
```

### **4. Test Et**
```
Dashboard'ı aç → GPT Analiz butonuna tıkla → Sonucu gör
```

---

## 📚 **Kaynaklar**

- **OpenAI Docs:** https://platform.openai.com/docs
- **Pricing:** https://openai.com/pricing
- **Best Practices:** https://platform.openai.com/docs/guides/production-best-practices
- **Vercel Functions:** https://vercel.com/docs/functions

---

## 🎓 **Sonuç**

### **GPT Entegrasyonu Yapmalı mıyım?**

**EVET, eğer:**
- ✅ Çok derin analiz istiyorsanız
- ✅ Doğal dil ile sohbet özelliği istiyorsanız
- ✅ Tahmin ve projeksiyon istiyorsanız
- ✅ Aylık $10-50 bütçeniz varsa

**HAYIR, eğer:**
- ❌ Mevcut AI yeterliyse
- ❌ Bütçe sınırlıysa
- ❌ Veri gizliliği çok önemliyse
- ❌ Hız kritikse (2-5 saniye gecikme)

### **Önerim:**

**Hibrit Yaklaşım:**
```
1. Mevcut AI: Hızlı, ücretsiz, temel analizler
2. GPT: İsteğe bağlı, derin analizler, özel sorular
3. Kullanıcı seçsin: "Hızlı Analiz" vs "GPT Analiz"
```

---

**Son Güncelleme:** 15 Ekim 2025  
**Versiyon:** 1.0  
**Yazar:** AI Dashboard Team

