#!/usr/bin/env python3
"""
🔐 Veriyi Şifrele
AES-256 ile güvenli şifreleme
"""

import os
import json
import gzip
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2
from cryptography.hazmat.backends import default_backend
import base64

def generate_key(password, salt=None):
    """
    Password'den encryption key oluştur
    """
    if salt is None:
        salt = os.urandom(16)
    
    kdf = PBKDF2(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
        backend=default_backend()
    )
    
    key = base64.urlsafe_b64encode(kdf.derive(password.encode()))
    return key, salt

def encrypt_file(input_file, output_file, password):
    """
    Dosyayı şifrele
    """
    print(f"🔐 Şifreleniyor: {input_file}")
    
    # Key oluştur
    key, salt = generate_key(password)
    fernet = Fernet(key)
    
    # Dosyayı oku
    with open(input_file, 'rb') as f:
        data = f.read()
    
    # Şifrele
    encrypted_data = fernet.encrypt(data)
    
    # Salt + encrypted data kaydet
    with open(output_file, 'wb') as f:
        f.write(salt)  # İlk 16 byte salt
        f.write(encrypted_data)
    
    # Dosya boyutları
    input_size = os.path.getsize(input_file) / (1024 * 1024)
    output_size = os.path.getsize(output_file) / (1024 * 1024)
    
    print(f"✅ Şifrelendi: {output_file}")
    print(f"   Input: {input_size:.2f} MB → Output: {output_size:.2f} MB")
    
    return True

def encrypt_directory(input_dir, password):
    """
    Klasördeki tüm .json.gz dosyalarını şifrele
    """
    print("=" * 60)
    print("🔐 TOPLU ŞİFRELEME")
    print("=" * 60)
    
    encrypted_count = 0
    
    # Tüm .json.gz dosyalarını bul
    for root, dirs, files in os.walk(input_dir):
        for file in files:
            if file.endswith('.json.gz') and not file.endswith('.enc'):
                input_file = os.path.join(root, file)
                output_file = input_file + '.enc'
                
                try:
                    encrypt_file(input_file, output_file, password)
                    encrypted_count += 1
                except Exception as e:
                    print(f"❌ Hata: {e}")
    
    print(f"\n🎉 {encrypted_count} dosya şifrelendi!")
    return encrypted_count

def main():
    """
    Ana fonksiyon
    """
    print("=" * 60)
    print("🔐 VERİ ŞİFRELEME SCRIPT'İ")
    print("=" * 60)
    
    # Password (production'da .env'den alınacak)
    password = os.getenv('ENCRYPTION_PASSWORD', 'ZUHAL_MUZIK_SECRET_KEY_2024_CHANGE_THIS')
    
    print(f"\n⚠️  ÖNEMLİ: Encryption password kullanılıyor")
    print(f"🔑 Password uzunluğu: {len(password)} karakter")
    print()
    
    # Data klasörünü şifrele
    data_dir = "data"
    
    if not os.path.exists(data_dir):
        print(f"❌ Klasör bulunamadı: {data_dir}")
        return
    
    # Şifrele
    try:
        encrypted_count = encrypt_directory(data_dir, password)
        
        if encrypted_count > 0:
            print("\n" + "=" * 60)
            print("✅ ŞİFRELEME TAMAMLANDI!")
            print("=" * 60)
            print(f"📦 {encrypted_count} dosya güvenli bir şekilde şifrelendi")
            print(f"🔐 Sadece doğru password ile açılabilir")
            print(f"⚠️  Password'u güvenli bir yerde saklayın!")
        
    except Exception as e:
        print(f"\n❌ HATA: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()

