/**
 * Voice Search Module
 * Web Speech API wrapper for voice search functionality
 */

let recognition = null;
let isListening = false;

/**
 * Ses aramayı başlat
 * @param {Function} onResult - Sonuç callback
 * @param {Object} options - Seçenekler
 */
export function startVoiceSearch(onResult, options = {}) {
    const {
        lang = 'tr-TR',
        continuous = false,
        interimResults = false,
        buttonId = 'voiceBtn'
    } = options;
    
    // Tarayıcı desteği kontrolü
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('⚠️ Tarayıcınız ses tanıma özelliğini desteklemiyor!\nChrome veya Edge kullanın.');
        return false;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    // Zaten dinleniyorsa durdur
    if (isListening) {
        stopVoiceSearch();
        return false;
    }
    
    // Yeni recognition oluştur
    recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    
    const voiceBtn = document.getElementById(buttonId);
    
    // Event handlers
    recognition.onstart = () => {
        isListening = true;
        if (voiceBtn) {
            voiceBtn.classList.add('listening');
            voiceBtn.textContent = '🎙️';
        }
        console.log('🎤 Dinleniyor...');
    };
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        
        console.log('🗣️ Algılanan:', transcript, 'Güven:', confidence);
        
        if (onResult && typeof onResult === 'function') {
            onResult(transcript, confidence);
        }
    };
    
    recognition.onerror = (event) => {
        console.error('❌ Ses tanıma hatası:', event.error);
        
        if (event.error === 'no-speech') {
            alert('⚠️ Ses algılanamadı. Lütfen tekrar deneyin.');
        } else if (event.error === 'not-allowed') {
            alert('⚠️ Mikrofon izni verilmedi. Lütfen tarayıcı ayarlarından mikrofon izni verin.');
        } else if (event.error === 'network') {
            alert('⚠️ Ağ hatası. İnternet bağlantınızı kontrol edin.');
        }
    };
    
    recognition.onend = () => {
        isListening = false;
        if (voiceBtn) {
            voiceBtn.classList.remove('listening');
            voiceBtn.textContent = '🎤';
        }
        console.log('🎤 Dinleme bitti');
    };
    
    // Dinlemeyi başlat
    try {
        recognition.start();
        return true;
    } catch (error) {
        console.error('❌ Ses tanıma başlatılamadı:', error);
        return false;
    }
}

/**
 * Ses aramayı durdur
 */
export function stopVoiceSearch() {
    if (recognition && isListening) {
        recognition.stop();
        isListening = false;
        return true;
    }
    return false;
}

/**
 * Dinleme durumunu kontrol et
 * @returns {boolean}
 */
export function isVoiceSearchActive() {
    return isListening;
}

/**
 * Tarayıcı desteğini kontrol et
 * @returns {boolean}
 */
export function isVoiceSearchSupported() {
    return ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);
}

/**
 * Ses tanıma ayarlarını güncelle
 * @param {Object} settings - Ayarlar
 */
export function updateVoiceSettings(settings) {
    if (!recognition) return false;
    
    if (settings.lang) recognition.lang = settings.lang;
    if (settings.continuous !== undefined) recognition.continuous = settings.continuous;
    if (settings.interimResults !== undefined) recognition.interimResults = settings.interimResults;
    
    return true;
}

console.log('✅ Voice Search modülü yüklendi');
