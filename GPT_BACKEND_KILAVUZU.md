# 🤖 GPT Backend Entegrasyon Kılavuzu

## 📋 İçindekiler
1. [Genel Bakış](#genel-bakış)
2. [Maliyet Analizi](#maliyet-analizi)
3. [Backend Kurulumu](#backend-kurulumu)
4. [Kullanım](#kullanım)
5. [Maliyet Takibi](#maliyet-takibi)

---

## 🎯 Genel Bakış

Dashboard'unuzda artık **3 seviyeli akıllı arama** var:

### **Seviye 1: Pattern Matching (ÜCRETSİZ)** ✅
- Basit sorular için
- Örnek: "Mustafa Kılıç en çok hangi ürünü sattı?"
- Örnek: "İstanbul en çok hangi marka aldı?"
- **Maliyet: $0**
- **Hız: Anında**
- **Kapsam: %70 sorguları karşılar**

### **Seviye 2: GPT-3.5 Turbo (UCUZ)** 💰
- Orta karmaşıklık sorular için
- Örnek: "Hangi mağazada bu ürünü satmalıyım?"
- **Maliyet: ~$0.0007/sorgu**
- **Hız: 1-2 saniye**
- **Kapsam: %25 sorguları karşılar**

### **Seviye 3: GPT-4 Turbo (GÜÇLÜ)** 💎
- Karmaşık analiz ve tahmin için
- Örnek: "Gelecek 3 ay için satış tahmini yap"
- **Maliyet: ~$0.007/sorgu**
- **Hız: 3-5 saniye**
- **Kapsam: %5 sorguları karşılar**

---

## 💰 Maliyet Analizi

### **10,000 Sorgu/Ay Senaryosu:**

| Senaryo | Pattern | GPT-3.5 | GPT-4 | Toplam Maliyet |
|---------|---------|---------|-------|----------------|
| **Akıllı Hibrit** | 7,000 | 2,500 | 500 | **$5.25/ay (~150 TL)** |
| **Sadece GPT-3.5** | 0 | 10,000 | 0 | $7/ay (~200 TL) |
| **Sadece GPT-4** | 0 | 0 | 10,000 | $70/ay (~2,000 TL) |

### **Gerçekçi Kullanım (Önerilen):**
```
Aylık Maliyet: $3-5 (~100-150 TL)
Günlük Maliyet: $0.10-0.17 (~3-5 TL)
Sorgu Başına: $0.0003-0.0005 (~0.01 TL)
```

---

## 🚀 Backend Kurulumu

### **Seçenek 1: Vercel Serverless Function (ÖNERİLEN)**

#### 1. Vercel Hesabı Oluştur
```bash
https://vercel.com/signup
```

#### 2. Proje Oluştur
```bash
mkdir gpt-backend
cd gpt-backend
npm init -y
npm install openai
```

#### 3. API Fonksiyonu Oluştur
`api/gpt.js` dosyası:

```javascript
import OpenAI from 'openai';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { query, context, model = 'gpt-3.5-turbo' } = req.body;
    
    // OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    // Prompt oluştur
    const prompt = `
Sen bir satış analiz asistanısın. Aşağıdaki satış verilerini analiz et ve soruyu cevapla.

VERİ ÖZETİ:
${JSON.stringify(context, null, 2)}

SORU:
${query}

CEVAP:
Lütfen kısa, net ve Türkçe cevap ver. Sayısal verilerle destekle.
    `.trim();
    
    // GPT çağrısı
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: 'Sen bir satış analiz uzmanısın.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    });
    
    const answer = completion.choices[0].message.content;
    
    // Maliyet hesapla
    const inputTokens = completion.usage.prompt_tokens;
    const outputTokens = completion.usage.completion_tokens;
    let cost = 0;
    
    if (model === 'gpt-3.5-turbo') {
      cost = (inputTokens / 1000 * 0.0005) + (outputTokens / 1000 * 0.0015);
    } else if (model === 'gpt-4-turbo') {
      cost = (inputTokens / 1000 * 0.01) + (outputTokens / 1000 * 0.03);
    } else if (model === 'gpt-4o-mini') {
      cost = (inputTokens / 1000 * 0.00015) + (outputTokens / 1000 * 0.0006);
    }
    
    return res.status(200).json({
      success: true,
      answer: answer,
      model: model,
      usage: {
        prompt_tokens: inputTokens,
        completion_tokens: outputTokens,
        total_tokens: inputTokens + outputTokens
      },
      cost: cost.toFixed(6)
    });
    
  } catch (error) {
    console.error('GPT API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
```

#### 4. Deploy Et
```bash
vercel
```

#### 5. Environment Variables Ekle
Vercel Dashboard → Settings → Environment Variables:
```
OPENAI_API_KEY = sk-your-api-key-here
```

#### 6. Dashboard'da URL'i Güncelle
`index.html` dosyasında:
```javascript
const BACKEND_URL = 'https://your-project.vercel.app/api/gpt';
```

---

### **Seçenek 2: Netlify Functions**

#### 1. Netlify Hesabı Oluştur
```bash
https://netlify.com/signup
```

#### 2. Proje Yapısı
```
netlify-functions/
├── netlify.toml
├── package.json
└── functions/
    └── gpt.js
```

#### 3. `netlify.toml`
```toml
[build]
  functions = "functions"

[functions]
  node_bundler = "esbuild"
```

#### 4. `functions/gpt.js`
```javascript
// Yukarıdaki Vercel fonksiyonu ile aynı
```

#### 5. Deploy
```bash
netlify deploy --prod
```

---

## 📊 Kullanım

### **Dashboard'da Kullanım:**

Dashboard otomatik olarak akıllı seçim yapar:

```javascript
// Basit soru → Pattern Matching (Ücretsiz)
"Mustafa Kılıç en çok hangi ürünü sattı?"

// Orta soru → GPT-3.5 (Ucuz)
"Hangi mağazada bu ürünü satmalıyım?"

// Karmaşık soru → GPT-4 (Güçlü)
"Gelecek 3 ay için satış tahmini ve strateji öner"
```

### **Manuel GPT Çağrısı:**

Konsol'da test etmek için:

```javascript
// Test sorgusu
const testQuery = "Hangi mağazada piyano satmalıyım?";
const testContext = {
  topStores: ['Akasya', 'Kadıköy', 'Beylikdüzü'],
  topCategories: ['Piyano', 'Gitar', 'Davul'],
  totalSales: 1000000
};

// GPT çağrısı
const result = await callGPTAPI(testQuery, testContext);
console.log('Cevap:', result.answer);
console.log('Maliyet:', result.cost);
```

---

## 💳 Maliyet Takibi

### **Otomatik Takip:**

Dashboard otomatik olarak her GPT çağrısının maliyetini takip eder ve `localStorage`'da saklar.

### **İstatistikleri Görüntüle:**

```javascript
// Konsol'da çalıştır
showGPTStats()
```

Çıktı:
```
💰 GPT Maliyet İstatistikleri:
Bu Ay: 245 sorgu, $1.23
Toplam: 1,234 sorgu, $6.78
Ortalama: $0.0050 per sorgu
```

### **İstatistikleri Sıfırla:**

```javascript
// Konsol'da çalıştır
resetGPTStats()
```

### **Dashboard'da Görüntüle:**

Maliyet istatistikleri, AI analiz panelinde otomatik olarak gösterilir.

---

## 🔒 Güvenlik

### **API Key Güvenliği:**

⚠️ **ÖNEMLİ:** OpenAI API key'inizi **ASLA** frontend kodunda saklamayın!

✅ **Doğru Yöntem:**
1. Backend'de (Vercel/Netlify) environment variable olarak sakla
2. Frontend sadece backend'e istek gönderir
3. Backend GPT API'ye key ile erişir

### **Rate Limiting:**

Backend'e rate limiting ekleyin:

```javascript
// Basit rate limiting örneği
const requestCounts = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = requestCounts.get(ip) || [];
  
  // Son 1 dakikadaki istekleri filtrele
  const recentRequests = userRequests.filter(time => now - time < 60000);
  
  if (recentRequests.length >= 10) {
    return false; // Rate limit aşıldı
  }
  
  recentRequests.push(now);
  requestCounts.set(ip, recentRequests);
  return true;
}
```

---

## 🎯 Sonraki Adımlar

### **1. OpenAI API Key Al:**
```
https://platform.openai.com/api-keys
```

### **2. Backend Deploy Et:**
- Vercel veya Netlify seç
- Yukarıdaki adımları takip et
- API key'i environment variable olarak ekle

### **3. Dashboard'ı Güncelle:**
- `index.html` içinde `BACKEND_URL` değiştir
- Test et: "Hangi mağazada piyano satmalıyım?"

### **4. Maliyet Takibi:**
- `showGPTStats()` ile düzenli kontrol et
- Aylık bütçe belirle (örn: $10)
- Gerekirse rate limiting ekle

---

## 📞 Destek

Sorularınız için:
- GitHub Issues: [Proje Repo]
- Email: [Email Adresiniz]

---

## 📝 Notlar

- **Pattern Matching** çoğu soruyu karşılar (ücretsiz)
- **GPT-3.5** orta karmaşıklık için yeterli (ucuz)
- **GPT-4** sadece karmaşık analizler için (pahalı)
- **Maliyet takibi** otomatik ve şeffaf
- **Backend** güvenli ve ölçeklenebilir

---

**✅ Hazırsınız!** Backend'i deploy edin ve akıllı arama sisteminin tüm gücünü kullanın! 🚀

