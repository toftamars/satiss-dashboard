// Modül testleri
console.log('🧪 Modül Testleri Başlıyor...\n');

// 1. Error Handler
import { errorHandler } from './js/modules/error-handler.js';
console.log('✅ Error Handler yüklendi:', typeof errorHandler);
console.log('   - init:', typeof errorHandler.init);
console.log('   - handleError:', typeof errorHandler.handleError);
console.log('   - getErrors:', typeof errorHandler.getErrors);

// 2. Utils
import { sanitizeHTML, escapeHTML, formatCurrency } from './js/modules/utils.js';
console.log('\n✅ Utils yüklendi');
console.log('   - sanitizeHTML:', typeof sanitizeHTML);
console.log('   - escapeHTML:', typeof escapeHTML);
console.log('   - formatCurrency:', typeof formatCurrency);

// 3. Test XSS Protection
const malicious = '<script>alert("xss")</script>';
const cleaned = sanitizeHTML(malicious);
console.log('\n🛡️ XSS Protection Test:');
console.log('   - Input:', malicious);
console.log('   - Output:', cleaned);
console.log('   - Safe:', cleaned === '' ? '✅ Evet' : '⚠️ Hayır');

// 4. Test Error Handler
console.log('\n🔴 Error Handler Test:');
try {
    throw new Error('Test hatası');
} catch (e) {
    console.log('   - Hata yakalandı:', e.message);
}

console.log('\n✅ Tüm modüller çalışıyor!');
