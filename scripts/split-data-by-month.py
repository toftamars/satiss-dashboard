#!/usr/bin/env python3
"""
📦 Veriyi Aylara Böl
48 MB tek dosya → 12 adet 4 MB dosya
"""

import json
import gzip
import os
from datetime import datetime
from collections import defaultdict

def split_data_by_month(input_file, output_dir):
    """
    Veriyi aylara göre böl
    """
    print(f"📂 Dosya okunuyor: {input_file}")
    
    # GZIP dosyasını aç ve oku
    with gzip.open(input_file, 'rt', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"✅ {len(data.get('details', []))} kayıt okundu")
    
    # Aylara göre grupla
    monthly_data = defaultdict(list)
    
    for record in data.get('details', []):
        try:
            # Tarih alanını bul (date, invoice_date, vb.)
            date_str = record.get('date') or record.get('invoice_date') or record.get('create_date')
            
            if not date_str:
                print(f"⚠️ Tarih bulunamadı: {record.get('id', 'unknown')}")
                continue
            
            # Tarihi parse et
            if isinstance(date_str, str):
                # Farklı tarih formatlarını dene
                for fmt in ['%Y-%m-%d', '%Y-%m-%d %H:%M:%S', '%d.%m.%Y', '%d/%m/%Y']:
                    try:
                        date_obj = datetime.strptime(date_str.split()[0], fmt)
                        break
                    except:
                        continue
                else:
                    print(f"⚠️ Tarih formatı tanınmadı: {date_str}")
                    continue
            else:
                date_obj = date_str
            
            # Yıl ve ay
            year = date_obj.year
            month = date_obj.month
            
            # Aylık gruba ekle
            key = f"{year}-{month:02d}"
            monthly_data[key].append(record)
            
        except Exception as e:
            print(f"❌ Hata: {e} - Kayıt: {record.get('id', 'unknown')}")
            continue
    
    print(f"\n📊 {len(monthly_data)} ay bulundu")
    
    # Her ay için ayrı dosya oluştur
    for month_key, records in monthly_data.items():
        year, month = month_key.split('-')
        
        # Klasör oluştur
        month_dir = os.path.join(output_dir, year)
        os.makedirs(month_dir, exist_ok=True)
        
        # Dosya yolu
        output_file = os.path.join(month_dir, f"{month}.json.gz")
        
        # Veriyi hazırla
        month_data = {
            'year': int(year),
            'month': int(month),
            'total_records': len(records),
            'details': records,
            'summary': data.get('summary', {}),
            'metadata': {
                'generated_at': datetime.now().isoformat(),
                'source': input_file,
                'record_count': len(records)
            }
        }
        
        # GZIP ile sıkıştır ve kaydet
        with gzip.open(output_file, 'wt', encoding='utf-8') as f:
            json.dump(month_data, f, ensure_ascii=False)
        
        # Dosya boyutu
        file_size = os.path.getsize(output_file) / (1024 * 1024)  # MB
        print(f"✅ {month_key}: {len(records):,} kayıt → {output_file} ({file_size:.2f} MB)")
    
    print(f"\n🎉 Tamamlandı! {len(monthly_data)} dosya oluşturuldu")
    return monthly_data

def main():
    """
    Ana fonksiyon
    """
    print("=" * 60)
    print("📦 VERİYİ AYLARA BÖLME SCRIPT'İ")
    print("=" * 60)
    
    # Input dosyası
    input_file = "data/data-2025.json.gz"
    
    # Output klasörü
    output_dir = "data"
    
    # Dosya var mı kontrol et
    if not os.path.exists(input_file):
        print(f"❌ Dosya bulunamadı: {input_file}")
        print("Lütfen önce veri dosyasını oluşturun!")
        return
    
    # Dosya boyutu
    file_size = os.path.getsize(input_file) / (1024 * 1024)  # MB
    print(f"\n📁 Input: {input_file} ({file_size:.2f} MB)")
    print(f"📂 Output: {output_dir}/YYYY/MM.json.gz")
    print()
    
    # Başla
    try:
        monthly_data = split_data_by_month(input_file, output_dir)
        
        # Özet
        print("\n" + "=" * 60)
        print("📊 ÖZET")
        print("=" * 60)
        total_records = sum(len(records) for records in monthly_data.values())
        print(f"Toplam Kayıt: {total_records:,}")
        print(f"Toplam Ay: {len(monthly_data)}")
        print(f"Ortalama Kayıt/Ay: {total_records // len(monthly_data):,}")
        
    except Exception as e:
        print(f"\n❌ HATA: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()

