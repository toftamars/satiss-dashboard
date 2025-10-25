# 🔌 API Documentation

Sales Dashboard API dokümantasyonu.

## Odoo Login API

### Endpoint: POST /api/odoo-login

Request:
\`\`\`json
{
  "username": "user@example.com",
  "password": "password123",
  "totp": "123456"
}
\`\`\`

Response (Success):
\`\`\`json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 123,
    "name": "John Doe",
    "username": "user@example.com"
  }
}
\`\`\`

## Data Loading API

- loadAllData() - Tüm verileri yükle
- loadInventoryDataLazy() - Envanter lazy load
- loadMetadata() - Metadata yükle

## Config Loader API

- ConfigLoader.load() - Config yükle
- ConfigLoader.get(path) - Config değeri al
- ConfigLoader.getAll() - Tüm config

## Filter Manager API

- filterManager.setData(data) - Veri ayarla
- filterManager.applyFilters() - Filtreleri uygula
- filterManager.resetFilters() - Filtreleri sıfırla
- filterManager.getDebugInfo() - Debug bilgisi

Detaylı dokümantasyon için README.md'ye bakın.
