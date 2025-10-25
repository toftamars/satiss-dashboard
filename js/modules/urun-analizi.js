/**
 * 🎸 Ürün/Marka/Kategori Analizi Modülü
 * Ürün bazlı detaylı satış analizi
 */

class UrunAnalizi {
    constructor() {
        this.productChart = null;
        this.brandChart = null;
        this.categoryChart = null;
        this.currentView = 'product'; // product, brand, category
        this.init();
    }

    init() {
        console.log('🎸 UrunAnalizi initialized');
    }

    /**
     * Ürün analizi sekmesini yükle
     */
    async loadUrunAnalizi() {
        console.log('📊 Ürün Analizi yükleniyor...');
        
        try {
            const allData = window.DataLoader?.allData || [];
            
            if (allData.length === 0) {
                console.warn('⚠️ Veri bulunamadı');
                return;
            }

            // Ürün verilerini analiz et
            const analysis = this.analyzeProducts(allData);
            
            // Render et
            this.renderProductAnalysis(analysis);
            
        } catch (error) {
            console.error('❌ Ürün analizi hatası:', error);
            if (window.ErrorHandler) {
                window.ErrorHandler.handleError(error);
            }
        }
    }

    /**
     * Ürünleri analiz et
     */
    analyzeProducts(data) {
        const productData = {};
        const brandData = {};
        const categoryData = {};
        
        data.forEach(item => {
            // Ürün analizi
            const product = item.product || 'Bilinmiyor';
            if (!productData[product]) {
                productData[product] = {
                    name: product,
                    sales: 0,
                    quantity: 0,
                    orderCount: 0,
                    brand: item.brand || 'Bilinmiyor',
                    category: item.category || 'Bilinmiyor'
                };
            }
            productData[product].sales += parseFloat(item.usd_amount || 0);
            productData[product].quantity += parseInt(item.quantity || 0);
            productData[product].orderCount += 1;
            
            // Marka analizi
            const brand = item.brand || 'Bilinmiyor';
            if (!brandData[brand]) {
                brandData[brand] = {
                    name: brand,
                    sales: 0,
                    quantity: 0,
                    orderCount: 0,
                    products: new Set()
                };
            }
            brandData[brand].sales += parseFloat(item.usd_amount || 0);
            brandData[brand].quantity += parseInt(item.quantity || 0);
            brandData[brand].orderCount += 1;
            if (item.product) brandData[brand].products.add(item.product);
            
            // Kategori analizi
            const category = item.category || 'Bilinmiyor';
            if (!categoryData[category]) {
                categoryData[category] = {
                    name: category,
                    sales: 0,
                    quantity: 0,
                    orderCount: 0,
                    products: new Set(),
                    brands: new Set()
                };
            }
            categoryData[category].sales += parseFloat(item.usd_amount || 0);
            categoryData[category].quantity += parseInt(item.quantity || 0);
            categoryData[category].orderCount += 1;
            if (item.product) categoryData[category].products.add(item.product);
            if (item.brand) categoryData[category].brands.add(item.brand);
        });

        // Hesaplamalar ve sıralama
        const products = Object.values(productData)
            .filter(p => p.name !== 'Bilinmiyor')
            .sort((a, b) => b.sales - a.sales);
            
        const brands = Object.values(brandData).map(b => ({
            ...b,
            productCount: b.products.size
        })).filter(b => b.name !== 'Bilinmiyor')
          .sort((a, b) => b.sales - a.sales);
          
        const categories = Object.values(categoryData).map(c => ({
            ...c,
            productCount: c.products.size,
            brandCount: c.brands.size
        })).filter(c => c.name !== 'Bilinmiyor')
          .sort((a, b) => b.sales - a.sales);

        return { products, brands, categories };
    }

    /**
     * Ürün analizini render et
     */
    renderProductAnalysis(analysis) {
        const container = document.getElementById('productAnalysisContainer');
        if (!container) return;

        let html = `
            <!-- View Selector -->
            <div style="background: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 30px;">
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button onclick="window.UrunAnalizi.switchView('product')" id="viewProduct" style="padding: 12px 30px; border: 2px solid #667eea; background: #667eea; color: white; border-radius: 10px; cursor: pointer; font-weight: 600; transition: all 0.3s;">
                        🎸 Ürünler (${analysis.products.length})
                    </button>
                    <button onclick="window.UrunAnalizi.switchView('brand')" id="viewBrand" style="padding: 12px 30px; border: 2px solid #667eea; background: white; color: #667eea; border-radius: 10px; cursor: pointer; font-weight: 600; transition: all 0.3s;">
                        🏷️ Markalar (${analysis.brands.length})
                    </button>
                    <button onclick="window.UrunAnalizi.switchView('category')" id="viewCategory" style="padding: 12px 30px; border: 2px solid #667eea; background: white; color: #667eea; border-radius: 10px; cursor: pointer; font-weight: 600; transition: all 0.3s;">
                        📂 Kategoriler (${analysis.categories.length})
                    </button>
                </div>
            </div>
            
            <!-- Product View -->
            <div id="productView" style="display: block;">
                ${this.renderProductCards(analysis.products)}
            </div>
            
            <!-- Brand View -->
            <div id="brandView" style="display: none;">
                ${this.renderBrandCards(analysis.brands)}
            </div>
            
            <!-- Category View -->
            <div id="categoryView" style="display: none;">
                ${this.renderCategoryCards(analysis.categories)}
            </div>
        `;
        
        container.innerHTML = html;
        
        console.log('✅ Ürün analizi render edildi');
    }

    /**
     * Ürün kartlarını render et
     */
    renderProductCards(products) {
        let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px;">';
        
        products.slice(0, 50).forEach((product, index) => {
            const rank = index + 1;
            const rankColor = rank === 1 ? '#fbbf24' : rank === 2 ? '#9ca3af' : rank === 3 ? '#f97316' : '#6b7280';
            const rankIcon = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
            
            html += `
                <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); position: relative;">
                    <div style="position: absolute; top: 15px; right: 15px; background: ${rankColor}; color: white; padding: 5px 12px; border-radius: 20px; font-weight: 700; font-size: 14px;">
                        ${rankIcon}
                    </div>
                    
                    <h4 style="margin: 0 0 10px 0; color: #333; padding-right: 60px; font-size: 15px; line-height: 1.4;">
                        ${product.name}
                    </h4>
                    <div style="color: #6b7280; font-size: 12px; margin-bottom: 15px;">
                        🏷️ ${product.brand} • 📂 ${product.category}
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px;">
                        <div style="background: #f0fdf4; padding: 12px; border-radius: 8px;">
                            <div style="color: #16a34a; font-size: 11px; margin-bottom: 3px;">💰 Satış</div>
                            <div style="font-weight: 700; color: #15803d;">$${product.sales.toLocaleString('tr-TR', {maximumFractionDigits: 0})}</div>
                        </div>
                        <div style="background: #eff6ff; padding: 12px; border-radius: 8px;">
                            <div style="color: #2563eb; font-size: 11px; margin-bottom: 3px;">📦 Miktar</div>
                            <div style="font-weight: 700; color: #1e40af;">${product.quantity}</div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    /**
     * Marka kartlarını render et
     */
    renderBrandCards(brands) {
        let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px;">';
        
        brands.slice(0, 30).forEach((brand, index) => {
            const rank = index + 1;
            const rankColor = rank === 1 ? '#fbbf24' : rank === 2 ? '#9ca3af' : rank === 3 ? '#f97316' : '#6b7280';
            const rankIcon = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
            
            html += `
                <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); position: relative;">
                    <div style="position: absolute; top: 15px; right: 15px; background: ${rankColor}; color: white; padding: 5px 12px; border-radius: 20px; font-weight: 700; font-size: 14px;">
                        ${rankIcon}
                    </div>
                    
                    <h3 style="margin: 0 0 20px 0; color: #333; padding-right: 60px;">
                        🏷️ ${brand.name}
                    </h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                        <div style="background: #f0fdf4; padding: 15px; border-radius: 10px;">
                            <div style="color: #16a34a; font-size: 12px; font-weight: 600; margin-bottom: 5px;">💰 SATIŞ</div>
                            <div style="font-size: 18px; font-weight: 700; color: #15803d;">$${brand.sales.toLocaleString('tr-TR', {maximumFractionDigits: 0})}</div>
                        </div>
                        <div style="background: #eff6ff; padding: 15px; border-radius: 10px;">
                            <div style="color: #2563eb; font-size: 12px; font-weight: 600; margin-bottom: 5px;">📦 MİKTAR</div>
                            <div style="font-size: 18px; font-weight: 700; color: #1e40af;">${brand.quantity.toLocaleString('tr-TR')}</div>
                        </div>
                        <div style="background: #fef3c7; padding: 15px; border-radius: 10px;">
                            <div style="color: #d97706; font-size: 12px; font-weight: 600; margin-bottom: 5px;">🎸 ÜRÜN</div>
                            <div style="font-size: 18px; font-weight: 700; color: #b45309;">${brand.productCount}</div>
                        </div>
                        <div style="background: #fce7f3; padding: 15px; border-radius: 10px;">
                            <div style="color: #db2777; font-size: 12px; font-weight: 600; margin-bottom: 5px;">🛒 SİPARİŞ</div>
                            <div style="font-size: 18px; font-weight: 700; color: #be185d;">${brand.orderCount.toLocaleString('tr-TR')}</div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    /**
     * Kategori kartlarını render et
     */
    renderCategoryCards(categories) {
        let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px;">';
        
        categories.forEach((category, index) => {
            const rank = index + 1;
            const rankColor = rank === 1 ? '#fbbf24' : rank === 2 ? '#9ca3af' : rank === 3 ? '#f97316' : '#6b7280';
            const rankIcon = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
            
            html += `
                <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); position: relative;">
                    <div style="position: absolute; top: 15px; right: 15px; background: ${rankColor}; color: white; padding: 5px 12px; border-radius: 20px; font-weight: 700; font-size: 14px;">
                        ${rankIcon}
                    </div>
                    
                    <h3 style="margin: 0 0 20px 0; color: #333; padding-right: 60px;">
                        📂 ${category.name}
                    </h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                        <div style="background: #f0fdf4; padding: 15px; border-radius: 10px;">
                            <div style="color: #16a34a; font-size: 12px; font-weight: 600; margin-bottom: 5px;">💰 SATIŞ</div>
                            <div style="font-size: 18px; font-weight: 700; color: #15803d;">$${category.sales.toLocaleString('tr-TR', {maximumFractionDigits: 0})}</div>
                        </div>
                        <div style="background: #eff6ff; padding: 15px; border-radius: 10px;">
                            <div style="color: #2563eb; font-size: 12px; font-weight: 600; margin-bottom: 5px;">📦 MİKTAR</div>
                            <div style="font-size: 18px; font-weight: 700; color: #1e40af;">${category.quantity.toLocaleString('tr-TR')}</div>
                        </div>
                        <div style="background: #fef3c7; padding: 15px; border-radius: 10px;">
                            <div style="color: #d97706; font-size: 12px; font-weight: 600; margin-bottom: 5px;">🎸 ÜRÜN</div>
                            <div style="font-size: 18px; font-weight: 700; color: #b45309;">${category.productCount}</div>
                        </div>
                        <div style="background: #fce7f3; padding: 15px; border-radius: 10px;">
                            <div style="color: #db2777; font-size: 12px; font-weight: 600; margin-bottom: 5px;">🏷️ MARKA</div>
                            <div style="font-size: 18px; font-weight: 700; color: #be185d;">${category.brandCount}</div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    /**
     * Görünüm değiştir
     */
    switchView(view) {
        this.currentView = view;
        
        // Butonları güncelle
        ['product', 'brand', 'category'].forEach(v => {
            const btn = document.getElementById(`view${v.charAt(0).toUpperCase() + v.slice(1)}`);
            if (btn) {
                if (v === view) {
                    btn.style.background = '#667eea';
                    btn.style.color = 'white';
                } else {
                    btn.style.background = 'white';
                    btn.style.color = '#667eea';
                }
            }
        });
        
        // View'ları göster/gizle
        document.getElementById('productView').style.display = view === 'product' ? 'block' : 'none';
        document.getElementById('brandView').style.display = view === 'brand' ? 'block' : 'none';
        document.getElementById('categoryView').style.display = view === 'category' ? 'block' : 'none';
    }
}

// Global UrunAnalizi instance
window.UrunAnalizi = new UrunAnalizi();

console.log('🎸 Ürün Analizi module loaded successfully');
