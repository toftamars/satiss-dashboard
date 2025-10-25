#!/bin/bash

# index.html'deki tüm fonksiyonları bul ve satır sayılarını hesapla
echo "🔍 En Büyük Fonksiyonları Buluyorum..."
echo ""

# Fonksiyon başlangıç satırlarını bul
grep -n "function " index.html | while read line; do
    line_num=$(echo "$line" | cut -d: -f1)
    func_name=$(echo "$line" | sed 's/.*function \([a-zA-Z_][a-zA-Z0-9_]*\).*/\1/')
    
    # Sonraki fonksiyonun başlangıcını bul
    next_func=$(grep -n "function " index.html | awk -v ln="$line_num" '$1 > ln' | head -1 | cut -d: -f1)
    
    if [ -z "$next_func" ]; then
        # Son fonksiyon ise dosya sonuna kadar
        next_func=$(wc -l < index.html)
    fi
    
    # Satır sayısını hesapla
    lines=$((next_func - line_num))
    
    # 50 satırdan büyük fonksiyonları göster
    if [ $lines -gt 50 ]; then
        echo "$lines satır - $func_name (satır $line_num)"
    fi
done | sort -rn | head -20

echo ""
echo "✅ Analiz tamamlandı"
