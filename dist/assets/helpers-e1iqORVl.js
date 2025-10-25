/**
 * Helper Functions Module
 * Genel amaçlı yardımcı fonksiyonlar
 */

/**
 * Mağaza adını normalize et
 * @param {string} storeName - Mağaza adı
 * @returns {string} Normalize edilmiş ad
 */
export function normalizeStoreName(storeName) {
    if (!storeName) return '';
    
    // Küçük harfe çevir ve boşlukları temizle
    const normalized = storeName.toLowerCase().trim();
    
    // Mapping tablosu
    const storeMapping = {
        'kentpark': 'KENTPARK',
        'akasya': 'AKASYA',
        'tünel': 'TÜNEL',
        'izmir': 'İzmir',
        'kızılay': 'KIZILAY',
        'hilltown': 'Hilltown',
        'kanyon': 'KANYON',
        'antalya': 'ANTALYA',
        'adana': 'ADANA',
        'bursa': 'BURSA',
        'uniq': 'UNIQ',
        'mavibahçe': 'MAVİBAHÇE',
        'temaworld': 'TEMAWORLD',
        'bodrum': 'BODRUM',
        'outlet': 'OUTLET'
    };
    
    // Eşleşme ara
    for (const [key, value] of Object.entries(storeMapping)) {
        if (normalized.includes(key)) {
            return value;
        }
    }
    
    return storeName; // Eşleşme yoksa orijinal ismi döndür
}

/**
 * Fuzzy match - Benzer metin arama
 * @param {string} query - Arama sorgusu
 * @param {string} target - Hedef metin
 * @returns {boolean} Eşleşiyor mu?
 */
export function fuzzyMatch(query, target) {
    const queryWords = query.split(/\s+/);
    const targetLower = target.toLowerCase();
    
    return queryWords.some(word => {
        if (word.length < 3) return false;
        return targetLower.includes(word) || levenshteinDistance(word, targetLower) < 3;
    });
}

/**
 * Levenshtein Distance - Düzenleme mesafesi
 * @param {string} a - İlk string
 * @param {string} b - İkinci string
 * @returns {number} Mesafe
 */
export function levenshteinDistance(a, b) {
    const matrix = [];
    
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    
    return matrix[b.length][a.length];
}

/**
 * Günlük versiyon oluştur (cache için)
 * @returns {string} YYYYMMDD formatında tarih
 */
export function getDailyVersion() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

/**
 * Saatlik versiyon oluştur (cache için)
 * @returns {string} YYYYMMDDHH formatında tarih
 */
export function getHourlyVersion() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    return `${year}${month}${day}${hour}`;
}

/**
 * Seçili değerleri al (multi-select için)
 * @param {string} containerId - Container ID
 * @returns {Array} Seçili değerler
 */
export function getSelectedValues(containerId) {
    const checkboxes = document.querySelectorAll(`#${containerId} input[type="checkbox"]:checked`);
    return Array.from(checkboxes).map(cb => cb.value);
}

/**
 * Checkbox'ları filtrele (arama için)
 * @param {string} containerId - Container ID
 * @param {string} searchText - Arama metni
 */
export function filterCheckboxes(containerId, searchText) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const labels = container.querySelectorAll('label');
    const search = searchText.toLowerCase().trim();
    
    labels.forEach(label => {
        const text = label.textContent.toLowerCase();
        if (search === '' || text.includes(search)) {
            label.style.display = '';
        } else {
            label.style.display = 'none';
        }
    });
}

/**
 * Seçim sayısını güncelle
 * @param {string} containerId - Container ID
 * @param {string} countId - Count element ID
 */
export function updateSelectionCount(containerId, countId) {
    const selected = getSelectedValues(containerId);
    const countElement = document.getElementById(countId);
    
    if (countElement) {
        countElement.textContent = selected.length;
    }
}

/**
 * Multi-select populate et
 * @param {string} id - Container ID
 * @param {Array} values - Değerler
 * @param {string} countId - Count element ID
 */
export function populateMultiSelect(id, values, countId) {
    const container = document.getElementById(id);
    if (!container) return;
    
    container.innerHTML = '';
    
    const uniqueValues = [...new Set(values)].filter(v => v).sort();
    
    uniqueValues.forEach(value => {
        const label = document.createElement('label');
        label.innerHTML = `
            <input type="checkbox" value="${value}" checked>
            ${value}
        `;
        
        label.querySelector('input').addEventListener('change', () => {
            updateSelectionCount(id, countId);
        });
        
        container.appendChild(label);
    });
    
    updateSelectionCount(id, countId);
}

/**
 * Tarih aralığı oluştur
 * @param {Date} startDate - Başlangıç tarihi
 * @param {Date} endDate - Bitiş tarihi
 * @returns {Array<string>} Tarih dizisi (YYYY-MM-DD)
 */
export function getDateRange(startDate, endDate) {
    const dates = [];
    const current = new Date(startDate);
    const end = new Date(endDate);
    
    while (current <= end) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
    }
    
    return dates;
}

/**
 * Ay adını al
 * @param {number} month - Ay (0-11)
 * @returns {string} Ay adı
 */
export function getMonthName(month) {
    const months = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    return months[month] || '';
}

/**
 * Yıl-ay formatı oluştur
 * @param {string} date - Tarih (YYYY-MM-DD)
 * @returns {string} YYYY-MM formatı
 */
export function getYearMonth(date) {
    if (!date) return '';
    return date.substring(0, 7); // YYYY-MM
}

/**
 * Veriyi gruplara ayır
 * @param {Array} data - Veri
 * @param {number} chunkSize - Grup boyutu
 * @returns {Array<Array>} Gruplar
 */
export function chunkArray(data, chunkSize) {
    const chunks = [];
    for (let i = 0; i < data.length; i += chunkSize) {
        chunks.push(data.slice(i, i + chunkSize));
    }
    return chunks;
}

/**
 * Benzersiz değerleri al ve say
 * @param {Array} data - Veri
 * @param {string} key - Anahtar
 * @returns {Object} {value: count}
 */
export function countUniqueValues(data, key) {
    const counts = {};
    
    data.forEach(item => {
        const value = item[key];
        if (value) {
            counts[value] = (counts[value] || 0) + 1;
        }
    });
    
    return counts;
}

/**
 * Top N değerleri al
 * @param {Object} counts - {value: count}
 * @param {number} n - Top N
 * @returns {Array} [{value, count}]
 */
export function getTopN(counts, n = 10) {
    return Object.entries(counts)
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, n);
}

/**
 * Yüzdelik hesapla
 * @param {number} value - Değer
 * @param {number} total - Toplam
 * @param {number} decimals - Ondalık basamak
 * @returns {number} Yüzde
 */
export function calculatePercentage(value, total, decimals = 2) {
    if (!total || total === 0) return 0;
    return parseFloat(((value / total) * 100).toFixed(decimals));
}

/**
 * Büyüme oranı hesapla
 * @param {number} current - Şimdiki değer
 * @param {number} previous - Önceki değer
 * @returns {number} Yüzde değişim
 */
export function calculateGrowthRate(current, previous) {
    if (!previous || previous === 0) return 0;
    return calculatePercentage(current - previous, previous);
}

/**
 * Ortalama hesapla
 * @param {Array<number>} values - Değerler
 * @returns {number} Ortalama
 */
export function calculateAverage(values) {
    if (!values || values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
    return sum / values.length;
}

/**
 * Medyan hesapla
 * @param {Array<number>} values - Değerler
 * @returns {number} Medyan
 */
export function calculateMedian(values) {
    if (!values || values.length === 0) return 0;
    
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    
    if (sorted.length % 2 === 0) {
        return (sorted[mid - 1] + sorted[mid]) / 2;
    }
    
    return sorted[mid];
}

/**
 * Deep clone object
 * @param {Object} obj - Obje
 * @returns {Object} Klon
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    
    const cloned = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
}

/**
 * Throttle fonksiyon
 * @param {Function} func - Fonksiyon
 * @param {number} limit - Limit (ms)
 * @returns {Function} Throttled fonksiyon
 */
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Sleep fonksiyon
 * @param {number} ms - Milisaniye
 * @returns {Promise}
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

console.log('✅ Helpers modülü yüklendi');
