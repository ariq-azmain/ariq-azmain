// resizable.js - Improved with proper touch support and constraints

class ResizablePanels {
    constructor() {
        this.verticalResizer = document.getElementById('verticalResizer');
        this.editorPanel = document.getElementById('editorPanel');
        this.consolePanel = document.getElementById('consolePanel');
        this.ideMain = document.getElementById('ideMain');
        this.horizontalResizer = document.getElementById('horizontalResizer');
        this.ideBottom = document.getElementById('ideBottom');
        
        this.isVerticalDragging = false;
        this.isHorizontalDragging = false;
        
        this.init();
    }
    
    init() {
        this.initVerticalResizer();
        this.initHorizontalResizer();
        this.setupMobileSupport();
    }
    
    initVerticalResizer() {
        if (!this.verticalResizer || !this.editorPanel || !this.consolePanel) return;
        
        const startDrag = (e) => {
            e.preventDefault();
            this.isVerticalDragging = true;
            this.verticalResizer.classList.add('dragging');
            
            document.addEventListener('mousemove', doDrag);
            document.addEventListener('touchmove', doDrag);
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchend', stopDrag);
        };
        
        const doDrag = (e) => {
            if (!this.isVerticalDragging) return;
            
            e.preventDefault();
            const containerRect = this.ideMain.getBoundingClientRect();
            let clientX;
            
            if (e.type === 'touchmove') {
                clientX = e.touches[0].clientX;
            } else {
                clientX = e.clientX;
            }
            
            // Calculate new widths
            const containerWidth = containerRect.width;
            let editorWidth = ((clientX - containerRect.left) / containerWidth) * 100;
            
            // Apply constraints (min 30%, max 70%)
            editorWidth = Math.max(30, Math.min(70, editorWidth));
            const consoleWidth = 100 - editorWidth;
            
            this.editorPanel.style.flex = `0 0 ${editorWidth}%`;
            this.consolePanel.style.flex = `0 0 ${consoleWidth}%`;
            
            // Force reflow
            this.ideMain.style.display = 'none';
            this.ideMain.offsetHeight;
            this.ideMain.style.display = 'flex';
        };
        
        const stopDrag = () => {
            this.isVerticalDragging = false;
            this.verticalResizer.classList.remove('dragging');
            
            document.removeEventListener('mousemove', doDrag);
            document.removeEventListener('touchmove', doDrag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchend', stopDrag);
        };
        
        this.verticalResizer.addEventListener('mousedown', startDrag);
        this.verticalResizer.addEventListener('touchstart', startDrag, { passive: false });
    }
    
    initHorizontalResizer() {
        if (!this.horizontalResizer || !this.ideBottom) return;
        
        const startDrag = (e) => {
            e.preventDefault();
            this.isHorizontalDragging = true;
            this.horizontalResizer.classList.add('dragging');
            
            document.addEventListener('mousemove', doDrag);
            document.addEventListener('touchmove', doDrag);
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchend', stopDrag);
        };
        
        const doDrag = (e) => {
            if (!this.isHorizontalDragging) return;
            
            e.preventDefault();
            const containerRect = document.querySelector('.ide-container').getBoundingClientRect();
            let clientY;
            
            if (e.type === 'touchmove') {
                clientY = e.touches[0].clientY;
            } else {
                clientY = e.clientY;
            }
            
            const containerHeight = containerRect.height;
            const topBarHeight = 70; // Approximate height of top bar
            const bottomHeight = ((containerRect.bottom - clientY) / containerHeight) * 100;
            
            // Apply constraints (min 20%, max 50%)
            const adjustedBottomHeight = Math.max(20, Math.min(50, bottomHeight));
            
            this.ideBottom.style.height = `${adjustedBottomHeight}%`;
            this.ideMain.style.height = `calc(${100 - adjustedBottomHeight}% - ${topBarHeight}px)`;
        };
        
        const stopDrag = () => {
            this.isHorizontalDragging = false;
            this.horizontalResizer.classList.remove('dragging');
            
            document.removeEventListener('mousemove', doDrag);
            document.removeEventListener('touchmove', doDrag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchend', stopDrag);
        };
        
        this.horizontalResizer.addEventListener('mousedown', startDrag);
        this.horizontalResizer.addEventListener('touchstart', startDrag, { passive: false });
    }
    
    setupMobileSupport() {
        // Handle mobile layout changes
        const checkMobileLayout = () => {
            const isMobile = window.innerWidth <= 768;
            
            if (isMobile) {
                // Force vertical layout on mobile
                if (this.ideMain) {
                    this.ideMain.style.flexDirection = 'column';
                    this.verticalResizer.style.width = '100%';
                    this.verticalResizer.style.height = '8px';
                    this.verticalResizer.style.cursor = 'row-resize';
                    
                    // Reset panel widths
                    this.editorPanel.style.flex = '1 1 100%';
                    this.consolePanel.style.flex = '1 1 100%';
                }
            } else {
                // Restore horizontal layout on desktop
                if (this.ideMain) {
                    this.ideMain.style.flexDirection = 'row';
                    this.verticalResizer.style.width = '8px';
                    this.verticalResizer.style.height = '100%';
                    this.verticalResizer.style.cursor = 'col-resize';
                    
                    // Reset to 60-40 split
                    this.editorPanel.style.flex = '0 0 60%';
                    this.consolePanel.style.flex = '0 0 40%';
                }
            }
        };
        
        // Check on load and resize
        checkMobileLayout();
        window.addEventListener('resize', checkMobileLayout);
    }
    
    resetLayout() {
        // Reset to default layout (60-40 split)
        if (this.editorPanel && this.consolePanel) {
            this.editorPanel.style.flex = '0 0 60%';
            this.consolePanel.style.flex = '0 0 40%';
            this.ideBottom.style.height = '250px';
            
            showNotification('Layout reset to default', 'info');
        }
    }
}

// Make globally available
window.ResizablePanels = ResizablePanels;