#!/bin/bash

# 🚀 Otomatik Deploy Script
# Tüm değişiklikleri otomatik olarak commit, push ve deploy eder

set -e  # Hata durumunda dur

echo "🚀 Otomatik Deploy Başlıyor..."
echo ""

# 1. Git durumunu kontrol et
echo "📊 Git durumu kontrol ediliyor..."
git status --short

# 2. Değişiklik var mı kontrol et
if [[ -z $(git status --porcelain) ]]; then
    echo "✅ Değişiklik yok, deploy gerekmiyor."
    exit 0
fi

# 3. Tüm değişiklikleri stage'e al
echo ""
echo "📦 Değişiklikler stage'e alınıyor..."
git add -A

# 4. Commit mesajı oluştur (timestamp ile)
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
COMMIT_MSG="Auto-deploy: Updates at $TIMESTAMP"

echo ""
echo "💾 Commit yapılıyor..."
echo "   Mesaj: $COMMIT_MSG"
git commit -m "$COMMIT_MSG" --no-verify

# 5. Build al
echo ""
echo "🔨 Production build alınıyor..."
npm run build

# 6. Build değişikliklerini commit et
if [[ -n $(git status --porcelain dist/) ]]; then
    echo ""
    echo "📦 Build dosyaları commit ediliyor..."
    git add dist/
    git commit -m "Build: Auto-generated dist files" --no-verify
fi

# 7. Main branch'e push
echo ""
echo "⬆️  Main branch'e push ediliyor..."
git push origin main

# 8. gh-pages'e deploy
echo ""
echo "🌐 GitHub Pages'e deploy ediliyor..."
git push origin main:gh-pages --force

# 9. Başarı mesajı
echo ""
echo "✅ Deploy tamamlandı!"
echo ""
echo "📊 Son commit:"
git log --oneline -1
echo ""
echo "🌐 Canlı URL: https://toftamars.github.io/satiss-dashboard/"
echo "⏳ GitHub Pages 2-3 dakika içinde güncellenecek..."
echo ""

