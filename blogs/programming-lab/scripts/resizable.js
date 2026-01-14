// Resizable panels functionality for IDE
class ResizablePanels {
    constructor(options = {}) {
        this.options = {
            container: '.ide-container',
            verticalResizer: '.vertical-resizer',
            horizontalResizer: '.horizontal-resizer',
            minWidth: 200,
            minHeight: 150,
            ...options
        };
        
        this.isDragging = false;
        this.currentResizer = null;
        this.startPos = { x: 0, y: 0 };
        this.startSize = { width: 0, height: 0 };
        this.panels = [];
        this.resizers = [];
        
        this.init();
    }
    
    init() {
        this.container = document.querySelector(this.options.container);
        if (!this.container) return;
        
        // Find all resizable panels
        this.panels = Array.from(this.container.querySelectorAll('.ide-panel'));
        this.resizers = Array.from(this.container.querySelectorAll('.panel-resizer'));
        
        if (this.panels.length < 2 || this.resizers.length === 0) {
            console.warn('Not enough panels or resizers found');
            return;
        }
        
        // Add event listeners to resizers
        this.resizers.forEach(resizer => {
            resizer.addEventListener('mousedown', this.startDrag.bind(this));
            resizer.addEventListener('touchstart', this.startDrag.bind(this, { touches: [{}] }));
        });
        
        // Add global event listeners
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('touchmove', this.drag.bind(this));
        document.addEventListener('mouseup', this.stopDrag.bind(this));
        document.addEventListener('touchend', this.stopDrag.bind(this));
        
        // Save initial sizes in localStorage
        this.saveLayout();
    }
    
    startDrag(e) {
        e.preventDefault();
        e.stopPropagation();
        
        this.isDragging = true;
        this.currentResizer = e.target;
        
        // Get starting position
        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        
        this.startPos = { x: clientX, y: clientY };
        
        // Get panels to resize
        const resizerIndex = this.resizers.indexOf(this.currentResizer);
        this.firstPanel = this.panels[resizerIndex];
        this.secondPanel = this.panels[resizerIndex + 1];
        
        if (!this.firstPanel || !this.secondPanel) return;
        
        // Get initial sizes
        const firstRect = this.firstPanel.getBoundingClientRect();
        const secondRect = this.secondPanel.getBoundingClientRect();
        
        this.startSize = {
            firstWidth: firstRect.width,
            firstHeight: firstRect.height,
            secondWidth: secondRect.width,
            secondHeight: secondRect.height
        };
        
        // Add active class
        this.currentResizer.classList.add('active');
        document.body.style.cursor = this.currentResizer.classList.contains('vertical-resizer') 
            ? 'col-resize' 
            : 'row-resize';
        document.body.style.userSelect = 'none';
    }
    
    drag(e) {
        if (!this.isDragging || !this.currentResizer) return;
        
        e.preventDefault();
        
        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        
        const deltaX = clientX - this.startPos.x;
        const deltaY = clientY - this.startPos.y;
        
        if (this.currentResizer.classList.contains('vertical-resizer')) {
            this.resizeHorizontal(deltaX);
        } else {
            this.resizeVertical(deltaY);
        }
    }
    
    resizeHorizontal(deltaX) {
        if (!this.firstPanel || !this.secondPanel) return;
        
        const newFirstWidth = this.startSize.firstWidth + deltaX;
        const newSecondWidth = this.startSize.secondWidth - deltaX;
        
        // Check minimum width
        if (newFirstWidth < this.options.minWidth || newSecondWidth < this.options.minWidth) {
            return;
        }
        
        // Apply new widths
        this.firstPanel.style.width = `${newFirstWidth}px`;
        this.secondPanel.style.width = `${newSecondWidth}px`;
        
        // Update flex basis
        this.firstPanel.style.flex = `0 0 ${newFirstWidth}px`;
        this.secondPanel.style.flex = `0 0 ${newSecondWidth}px`;
    }
    
    resizeVertical(deltaY) {
        if (!this.firstPanel || !this.secondPanel) return;
        
        const newFirstHeight = this.startSize.firstHeight + deltaY;
        const newSecondHeight = this.startSize.secondHeight - deltaY;
        
        // Check minimum height
        if (newFirstHeight < this.options.minHeight || newSecondHeight < this.options.minHeight) {
            return;
        }
        
        // Apply new heights
        this.firstPanel.style.height = `${newFirstHeight}px`;
        this.secondPanel.style.height = `${newSecondHeight}px`;
        
        // Update flex basis
        this.firstPanel.style.flex = `0 0 ${newFirstHeight}px`;
        this.secondPanel.style.flex = `0 0 ${newSecondHeight}px`;
    }
    
    stopDrag() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        
        if (this.currentResizer) {
            this.currentResizer.classList.remove('active');
        }
        
        // Reset cursor and selection
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        
        // Save layout
        this.saveLayout();
    }
    
    saveLayout() {
        const layout = {
            panels: this.panels.map(panel => ({
                width: panel.style.width || panel.offsetWidth,
                height: panel.style.height || panel.offsetHeight,
                flex: panel.style.flex
            })),
            timestamp: Date.now()
        };
        
        try {
            localStorage.setItem('ide-layout', JSON.stringify(layout));
        } catch (e) {
            console.warn('Failed to save layout:', e);
        }
    }
    
    loadLayout() {
        try {
            const saved = localStorage.getItem('ide-layout');
            if (!saved) return;
            
            const layout = JSON.parse(saved);
            
            // Check if layout is not too old (7 days)
            if (Date.now() - layout.timestamp > 7 * 24 * 60 * 60 * 1000) {
                return;
            }
            
            layout.panels.forEach((panelData, index) => {
                if (this.panels[index]) {
                    if (panelData.width) {
                        this.panels[index].style.width = panelData.width;
                    }
                    if (panelData.height) {
                        this.panels[index].style.height = panelData.height;
                    }
                    if (panelData.flex) {
                        this.panels[index].style.flex = panelData.flex;
                    }
                }
            });
            
        } catch (e) {
            console.warn('Failed to load layout:', e);
        }
    }
    
    resetLayout() {
        this.panels.forEach(panel => {
            panel.style.width = '';
            panel.style.height = '';
            panel.style.flex = '';
        });
        
        localStorage.removeItem('ide-layout');
    }
    
    // Layout presets
    setLayout(layoutType) {
        const containerWidth = this.container.offsetWidth;
        const containerHeight = this.container.offsetHeight;
        
        switch (layoutType) {
            case 'horizontal':
                // Editor on left, console on right
                this.panels[0].style.width = `${containerWidth * 0.6}px`;
                this.panels[1].style.width = `${containerWidth * 0.4}px`;
                break;
                
            case 'vertical':
                // Editor on top, console on bottom
                this.panels[0].style.height = `${containerHeight * 0.6}px`;
                this.panels[1].style.height = `${containerHeight * 0.4}px`;
                break;
                
            case 'editor-only':
                // Only editor visible
                this.panels[0].style.width = '100%';
                this.panels[1].style.width = '0';
                break;
                
            case 'console-only':
                // Only console visible
                this.panels[0].style.width = '0';
                this.panels[1].style.width = '100%';
                break;
                
            case 'equal':
                // Equal split
                this.panels[0].style.width = `${containerWidth * 0.5}px`;
                this.panels[1].style.width = `${containerWidth * 0.5}px`;
                break;
        }
        
        this.saveLayout();
    }
}

// Initialize resizable panels when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.resizablePanels = new ResizablePanels();
    
    // Load saved layout
    setTimeout(() => {
        window.resizablePanels.loadLayout();
    }, 100);
    
    // Add layout buttons if they exist
    const layoutButtons = document.querySelectorAll('[data-layout]');
    layoutButtons.forEach(button => {
        button.addEventListener('click', () => {
            const layoutType = button.dataset.layout;
            window.resizablePanels.setLayout(layoutType);
        });
    });
    
    // Add reset button
    const resetButton = document.getElementById('resetLayout');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            window.resizablePanels.resetLayout();
        });
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResizablePanels;
}