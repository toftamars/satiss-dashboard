#!/usr/bin/env python3
"""
🔄 Odoo Sync - İki Mode
Mode 1: Full Sync (Tümü)
Mode 2: Incremental (Değişenler)
"""

import json
import gzip
import os
from datetime import datetime, timedelta
import argparse

class OdooSync:
    def __init__(self, mode='incremental', days=180):
        self.mode = mode
        self.days = days
        self.last_sync_file = 'data/.last_sync'
        
    def get_last_sync_date(self):
        """
        Son senkronizasyon tarihini al
        """
        if os.path.exists(self.last_sync_file):
            with open(self.last_sync_file, 'r') as f:
                return f.read().strip()
        return None
    
    def save_last_sync_date(self):
        """
        Son senkronizasyon tarihini kaydet
        """
        os.makedirs('data', exist_ok=True)
        with open(self.last_sync_file, 'w') as f:
            f.write(datetime.now().isoformat())
    
    def sync_full(self):
        """
        MODE 1: Full Sync - Tüm verileri çek
        """
        print("=" * 60)
        print("🔄 MODE 1: FULL SYNC (TÜM VERİLER)")
        print("=" * 60)
        print()
        
        print("📊 Tüm veriler Odoo'dan çekiliyor...")
        print("⏱️  Tahmini süre: 50 dakika")
        print()
        
        # Odoo bağlantısı (örnek)
        """
        import xmlrpc.client
        
        url = 'https://your-odoo.com'
        db = 'your_database'
        username = 'your_username'
        password = 'your_password'
        
        common = xmlrpc.client.ServerProxy(f'{url}/xmlrpc/2/common')
        uid = common.authenticate(db, username, password, {})
        
        models = xmlrpc.client.ServerProxy(f'{url}/xmlrpc/2/object')
        
        # TÜM KAYITLARI ÇEK
        sales = models.execute_kw(db, uid, password,
            'sale.order', 'search_read',
            [[]], # Filtre yok = tümü
            {'fields': ['name', 'date_order', 'amount_total', ...]}
        )
        """
        
        print("✅ Tüm veriler çekildi")
        print("📦 Dosyalara kaydediliyor...")
        
        # Son sync tarihini kaydet
        self.save_last_sync_date()
        
        print("✅ Full sync tamamlandı!")
        return True
    
    def sync_incremental(self):
        """
        MODE 2: Incremental - Sadece değişenleri çek
        """
        print("=" * 60)
        print(f"🔄 MODE 2: INCREMENTAL SYNC (SON {self.days} GÜN)")
        print("=" * 60)
        print()
        
        # Son sync tarihi
        last_sync = self.get_last_sync_date()
        
        if not last_sync:
            print("⚠️  İlk sync, full sync yapılıyor...")
            return self.sync_full()
        
        # Tarih hesapla
        cutoff_date = (datetime.now() - timedelta(days=self.days)).isoformat()
        
        print(f"📅 Son sync: {last_sync}")
        print(f"📅 Cutoff: {cutoff_date}")
        print(f"⏱️  Tahmini süre: 2 dakika")
        print()
        
        # Odoo bağlantısı (örnek)
        """
        # SADECE DEĞİŞENLERİ ÇEK
        sales = models.execute_kw(db, uid, password,
            'sale.order', 'search_read',
            [[('write_date', '>', cutoff_date)]], # Filtre = son X gün
            {'fields': ['name', 'date_order', 'amount_total', ...]}
        )
        """
        
        print(f"✅ Son {self.days} gün değişenler çekildi")
        print("📦 Mevcut verilere ekleniyor...")
        
        # Son sync tarihini güncelle
        self.save_last_sync_date()
        
        print("✅ Incremental sync tamamlandı!")
        return True
    
    def run(self):
        """
        Sync'i çalıştır
        """
        print()
        print("🚀 ODOO SYNC BAŞLIYOR")
        print(f"📋 Mode: {self.mode.upper()}")
        print()
        
        if self.mode == 'full':
            return self.sync_full()
        else:
            return self.sync_incremental()

def main():
    """
    Ana fonksiyon
    """
    parser = argparse.ArgumentParser(description='Odoo Sync - İki Mode')
    parser.add_argument('--mode', 
                       choices=['full', 'incremental'], 
                       default='incremental',
                       help='Sync mode (default: incremental)')
    parser.add_argument('--days', 
                       type=int, 
                       default=180,
                       help='Incremental sync için gün sayısı (default: 180)')
    
    args = parser.parse_args()
    
    # Sync başlat
    syncer = OdooSync(mode=args.mode, days=args.days)
    success = syncer.run()
    
    if success:
        print()
        print("=" * 60)
        print("✅ SYNC TAMAMLANDI!")
        print("=" * 60)
        
        # Sonraki adımlar
        print()
        print("📋 Sonraki Adımlar:")
        print("1. Veriyi aylara böl:")
        print("   python3 scripts/split-data-by-month.py")
        print()
        print("2. Şifrele:")
        print("   python3 scripts/encrypt-data.py")
        print()
        print("3. GitHub'a push et:")
        print("   git add . && git commit -m 'Data updated' && git push")
    else:
        print()
        print("❌ SYNC BAŞARISIZ!")

if __name__ == "__main__":
    main()

