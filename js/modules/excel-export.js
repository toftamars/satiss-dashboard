/**
 * Excel Export Module
 * SheetJS (XLSX) wrapper for exporting data to Excel
 */

/**
 * Excel'e veri aktar
 * @param {Array} data - Aktarılacak veri
 * @param {Object} options - Export seçenekleri
 * @returns {boolean} Başarılı mı?
 */
export function exportToExcel(data, options = {}) {
    // Varsayılan seçenekler
    const {
        filename = `Satis_Analizi_${new Date().toISOString().split('T')[0]}.xlsx`,
        sheetName = 'Satış Verileri',
        includeTimestamp = true,
        showAlert = true,
        columnMapping = null,
        columnWidths = null,
        includeSummary = true
    } = options;
    
    // Veri kontrolü
    if (!data || data.length === 0) {
        if (showAlert) {
            alert('⚠️ Dışa aktarılacak veri yok!');
        }
        console.warn('⚠️ Excel export: Veri yok');
        return false;
    }
    
    // XLSX kontrolü
    if (typeof XLSX === 'undefined') {
        console.error('❌ XLSX kütüphanesi yüklü değil!');
        if (showAlert) {
            alert('❌ Excel export için gerekli kütüphane yüklü değil!');
        }
        return false;
    }
    
    console.log('📥 Excel export başlatılıyor...', {
        rows: data.length,
        filename
    });
    
    try {
        // Veriyi Excel formatına dönüştür
        const excelData = formatDataForExcel(data, columnMapping);
        
        // Özet satırı ekle
        if (includeSummary) {
            const summary = createSummaryRow(data, columnMapping);
            excelData.push(summary);
        }
        
        // Workbook oluştur
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);
        
        // Sütun genişliklerini ayarla
        if (columnWidths) {
            ws['!cols'] = columnWidths;
        } else {
            ws['!cols'] = getDefaultColumnWidths();
        }
        
        // Sheet'i ekle
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        
        // Dosyayı indir
        XLSX.writeFile(wb, filename);
        
        console.log(`✅ Excel dosyası indirildi: ${filename}`);
        
        if (showAlert) {
            alert(`✅ ${data.length} kayıt Excel'e aktarıldı!\nDosya: ${filename}`);
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ Excel export hatası:', error);
        if (showAlert) {
            alert('❌ Excel dosyası oluşturulurken hata oluştu!');
        }
        return false;
    }
}

/**
 * Veriyi Excel formatına dönüştür
 * @param {Array} data - Veri
 * @param {Object} mapping - Sütun mapping
 * @returns {Array}
 */
function formatDataForExcel(data, mapping) {
    const defaultMapping = {
        'İş Ortağı': 'partner',
        'Ürün': 'product',
        'Marka': 'brand',
        'Kategori 1': 'category_2',
        'Kategori 2': 'category_3',
        'Kategori 3': 'category_4',
        'Satış Temsilcisi': 'sales_person',
        'Mağaza': 'store',
        'Şehir': 'city',
        'Tarih': 'date',
        'Miktar': 'quantity',
        'USD (KDV Hariç)': 'usd_amount'
    };
    
    const columnMap = mapping || defaultMapping;
    
    return data.map(item => {
        const row = {};
        
        for (const [excelColumn, dataKey] of Object.entries(columnMap)) {
            const value = item[dataKey];
            
            // Sayısal değerler
            if (dataKey === 'quantity' || dataKey === 'usd_amount') {
                row[excelColumn] = parseFloat(value || 0);
            } else {
                row[excelColumn] = value || '';
            }
        }
        
        return row;
    });
}

/**
 * Özet satırı oluştur
 * @param {Array} data - Veri
 * @param {Object} mapping - Sütun mapping
 * @returns {Object}
 */
function createSummaryRow(data, mapping) {
    const summary = {
        'İş Ortağı': 'TOPLAM',
        'Ürün': '',
        'Marka': '',
        'Kategori 1': '',
        'Kategori 2': '',
        'Kategori 3': '',
        'Satış Temsilcisi': '',
        'Mağaza': '',
        'Şehir': '',
        'Tarih': '',
        'Miktar': data.reduce((sum, item) => sum + parseFloat(item.quantity || 0), 0),
        'USD (KDV Hariç)': data.reduce((sum, item) => sum + parseFloat(item.usd_amount || 0), 0)
    };
    
    return summary;
}

/**
 * Varsayılan sütun genişlikleri
 * @returns {Array}
 */
function getDefaultColumnWidths() {
    return [
        {wch: 30}, // İş Ortağı
        {wch: 40}, // Ürün
        {wch: 15}, // Marka
        {wch: 20}, // Kategori 1
        {wch: 20}, // Kategori 2
        {wch: 20}, // Kategori 3
        {wch: 20}, // Satış Temsilcisi
        {wch: 30}, // Mağaza
        {wch: 15}, // Şehir
        {wch: 12}, // Tarih
        {wch: 12}, // Miktar
        {wch: 18}  // USD (KDV Hariç)
    ];
}

/**
 * Özel sütun mapping ile export
 * @param {Array} data - Veri
 * @param {Object} mapping - Sütun mapping
 * @param {string} filename - Dosya adı
 * @returns {boolean}
 */
export function exportWithCustomMapping(data, mapping, filename) {
    return exportToExcel(data, {
        filename,
        columnMapping: mapping
    });
}

/**
 * Hızlı export (varsayılan ayarlarla)
 * @param {Array} data - Veri
 * @returns {boolean}
 */
export function quickExport(data) {
    return exportToExcel(data, {
        showAlert: false
    });
}

/**
 * Birden fazla sheet ile export
 * @param {Object} sheets - {sheetName: data} formatında
 * @param {string} filename - Dosya adı
 * @returns {boolean}
 */
export function exportMultipleSheets(sheets, filename) {
    if (!sheets || Object.keys(sheets).length === 0) {
        console.warn('⚠️ Excel export: Sheet verisi yok');
        return false;
    }
    
    if (typeof XLSX === 'undefined') {
        console.error('❌ XLSX kütüphanesi yüklü değil!');
        return false;
    }
    
    try {
        const wb = XLSX.utils.book_new();
        
        for (const [sheetName, data] of Object.entries(sheets)) {
            if (data && data.length > 0) {
                const excelData = formatDataForExcel(data);
                const ws = XLSX.utils.json_to_sheet(excelData);
                ws['!cols'] = getDefaultColumnWidths();
                XLSX.utils.book_append_sheet(wb, ws, sheetName);
            }
        }
        
        const finalFilename = filename || `Satis_Analizi_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, finalFilename);
        
        console.log(`✅ Multi-sheet Excel dosyası indirildi: ${finalFilename}`);
        return true;
        
    } catch (error) {
        console.error('❌ Multi-sheet export hatası:', error);
        return false;
    }
}

console.log('✅ Excel Export modülü yüklendi');
