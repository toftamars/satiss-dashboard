/**
 * Virtual Scroller
 * Büyük listeler için performanslı rendering
 */

class VirtualScroller {
    constructor(container, options = {}) {
        this.container = container;
        this.items = [];
        this.renderedItems = new Map();

        // Configuration
        this.itemHeight = options.itemHeight || 50;
        this.bufferSize = options.bufferSize || 5;
        this.renderItem = options.renderItem || this.defaultRenderItem;

        // State
        this.scrollTop = 0;
        this.containerHeight = 0;
        this.visibleStart = 0;
        this.visibleEnd = 0;

        // Elements
        this.viewport = null;
        this.content = null;

        this.init();
    }

    /**
     * Initialize virtual scroller
     */
    init() {
        // Create viewport
        this.viewport = document.createElement('div');
        this.viewport.style.cssText = `
            position: relative;
            overflow-y: auto;
            height: 100%;
            width: 100%;
        `;

        // Create content container
        this.content = document.createElement('div');
        this.content.style.cssText = `
            position: relative;
            width: 100%;
        `;

        this.viewport.appendChild(this.content);
        this.container.appendChild(this.viewport);

        // Bind scroll handler
        this.viewport.addEventListener('scroll', this.handleScroll.bind(this));

        // Get container height
        this.containerHeight = this.viewport.clientHeight;

        console.log('[VirtualScroller] Initialized');
    }

    /**
     * Set items
     */
    setItems(items) {
        this.items = items;
        this.updateContentHeight();
        this.render();
    }

    /**
     * Update content height
     */
    updateContentHeight() {
        const totalHeight = this.items.length * this.itemHeight;
        this.content.style.height = `${totalHeight}px`;
    }

    /**
     * Handle scroll
     */
    handleScroll() {
        this.scrollTop = this.viewport.scrollTop;
        this.render();
    }

    /**
     * Calculate visible range
     */
    calculateVisibleRange() {
        const start = Math.floor(this.scrollTop / this.itemHeight);
        const end = Math.ceil((this.scrollTop + this.containerHeight) / this.itemHeight);

        // Add buffer
        this.visibleStart = Math.max(0, start - this.bufferSize);
        this.visibleEnd = Math.min(this.items.length, end + this.bufferSize);
    }

    /**
     * Render visible items
     */
    render() {
        this.calculateVisibleRange();

        // Remove items outside visible range
        this.renderedItems.forEach((element, index) => {
            if (index < this.visibleStart || index >= this.visibleEnd) {
                element.remove();
                this.renderedItems.delete(index);
            }
        });

        // Render visible items
        for (let i = this.visibleStart; i < this.visibleEnd; i++) {
            if (!this.renderedItems.has(i)) {
                const element = this.renderItem(this.items[i], i);
                element.style.cssText = `
                    position: absolute;
                    top: ${i * this.itemHeight}px;
                    left: 0;
                    right: 0;
                    height: ${this.itemHeight}px;
                `;
                this.content.appendChild(element);
                this.renderedItems.set(i, element);
            }
        }
    }

    /**
     * Default render item
     */
    defaultRenderItem(item, index) {
        const div = document.createElement('div');
        div.textContent = `Item ${index}: ${JSON.stringify(item)}`;
        return div;
    }

    /**
     * Scroll to index
     */
    scrollToIndex(index) {
        const scrollTop = index * this.itemHeight;
        this.viewport.scrollTop = scrollTop;
    }

    /**
     * Update item height
     */
    setItemHeight(height) {
        this.itemHeight = height;
        this.updateContentHeight();
        this.render();
    }

    /**
     * Destroy
     */
    destroy() {
        this.viewport.removeEventListener('scroll', this.handleScroll);
        this.container.innerHTML = '';
        this.renderedItems.clear();
    }
}

export { VirtualScroller };
