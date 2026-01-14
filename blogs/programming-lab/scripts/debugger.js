// Debugger functionality for IDE
class CodeDebugger {
    constructor(options = {}) {
        this.options = {
            editor: null,
            output: null,
            breakpoints: [],
            currentLine: 0,
            isRunning: false,
            isPaused: false,
            variables: {},
            callStack: [],
            ...options
        };
        
        this.breakpoints = new Set();
        this.variables = new Map();
        this.callStack = [];
        this.watchExpressions = new Set();
        
        this.init();
    }
    
    init() {
        // Initialize breakpoint gutter
        this.initBreakpointGutter();
        
        // Initialize debug controls
        this.initControls();
        
        // Initialize variable watcher
        this.initVariableWatcher();
    }
    
    initBreakpointGutter() {
        if (!this.options.editor) return;
        
        // Add breakpoint gutter to editor
        this.options.editor.on('gutterClick', (cm, line, gutter, clickEvent) => {
            if (gutter === 'CodeMirror-gutter-breakpoints') {
                this.toggleBreakpoint(line);
            }
        });
    }
    
    initControls() {
        // Debug controls will be added to the UI
        this.controls = {
            stepOver: () => this.stepOver(),
            stepInto: () => this.stepInto(),
            stepOut: () => this.stepOut(),
            continue: () => this.continue(),
            pause: () => this.pause(),
            stop: () => this.stop()
        };
    }
    
    initVariableWatcher() {
        // Create variable watch panel
        this.variableWatcher = document.createElement('div');
        this.variableWatcher.className = 'variable-watcher';
        this.variableWatcher.innerHTML = `
            <h4>Variables</h4>
            <div class="variables-list"></div>
            <div class="add-watch">
                <input type="text" placeholder="Add expression to watch...">
                <button>Add</button>
            </div>
        `;
    }
    
    // Breakpoint management
    toggleBreakpoint(line) {
        if (this.breakpoints.has(line)) {
            this.removeBreakpoint(line);
        } else {
            this.addBreakpoint(line);
        }
    }
    
    addBreakpoint(line) {
        this.breakpoints.add(line);
        this.highlightBreakpoint(line);
        this.saveBreakpoints();
    }
    
    removeBreakpoint(line) {
        this.breakpoints.delete(line);
        this.removeHighlight(line);
        this.saveBreakpoints();
    }
    
    highlightBreakpoint(line) {
        if (!this.options.editor) return;
        
        // Add breakpoint marker in gutter
        const marker = document.createElement('div');
        marker.className = 'breakpoint-marker';
        marker.innerHTML = '●';
        marker.style.color = '#ef4444';
        marker.style.fontSize = '12px';
        
        this.options.editor.setGutterMarker(line, 'breakpoints', marker);
    }
    
    removeHighlight(line) {
        if (!this.options.editor) return;
        this.options.editor.setGutterMarker(line, 'breakpoints', null);
    }
    
    // Debug execution
    async startDebugging(code) {
        if (!code || this.isRunning) return;
        
        this.isRunning = true;
        this.isPaused = false;
        this.currentLine = 0;
        this.variables.clear();
        this.callStack = [];
        
        // Parse code into lines
        this.codeLines = code.split('\n');
        
        // Clear output
        if (this.options.output) {
            this.options.output.innerHTML = '<div class="debug-start">Debugging started...</div>';
        }
        
        // Run until first breakpoint or end
        await this.run();
    }
    
    async run() {
        while (this.isRunning && this.currentLine < this.codeLines.length) {
            // Check for breakpoints
            if (this.breakpoints.has(this.currentLine)) {
                this.pauseAtLine(this.currentLine);
                await this.waitForContinue();
            }
            
            // Execute current line
            await this.executeLine(this.codeLines[this.currentLine]);
            
            // Move to next line
            this.currentLine++;
            
            // Small delay for visualization
            if (this.isRunning) {
                await this.delay(100);
            }
        }
        
        if (this.isRunning) {
            this.stop();
            this.log('Debugging finished');
        }
    }
    
    async executeLine(line) {
        // Highlight current line
        this.highlightCurrentLine();
        
        // Log execution
        this.log(`Executing line ${this.currentLine + 1}: ${line.trim()}`);
        
        try {
            // Parse and execute line
            const result = this.parseLine(line);
            
            // Update variables
            if (result.variable) {
                this.variables.set(result.variable.name, result.variable.value);
                this.updateVariableDisplay();
            }
            
            // Evaluate expressions
            if (result.expression) {
                const value = this.evaluateExpression(result.expression);
                this.log(`Expression result: ${value}`);
            }
            
        } catch (error) {
            this.log(`Error at line ${this.currentLine + 1}: ${error.message}`, 'error');
        }
    }
    
    parseLine(line) {
        line = line.trim();
        
        // Remove comments
        line = line.split('//')[0].trim();
        
        // Check for variable assignment
        const varAssignment = line.match(/(?:var|let|const)\s+(\w+)\s*=\s*(.+)/);
        if (varAssignment) {
            return {
                type: 'assignment',
                variable: {
                    name: varAssignment[1],
                    value: this.evaluateExpression(varAssignment[2])
                }
            };
        }
        
        // Check for reassignment
        const reassignment = line.match(/(\w+)\s*=\s*(.+)/);
        if (reassignment && this.variables.has(reassignment[1])) {
            return {
                type: 'reassignment',
                variable: {
                    name: reassignment[1],
                    value: this.evaluateExpression(reassignment[2])
                }
            };
        }
        
        // Check for function call
        const functionCall = line.match(/(\w+)\((.*)\)/);
        if (functionCall) {
            return {
                type: 'function',
                expression: line
            };
        }
        
        // Check for console.log
        if (line.includes('console.log')) {
            return {
                type: 'log',
                expression: line
            };
        }
        
        return {
            type: 'expression',
            expression: line
        };
    }
    
    evaluateExpression(expression) {
        // Create a safe evaluation context
        const context = {
            console: {
                log: (...args) => {
                    this.log(args.join(' '));
                }
            },
            Math: Math,
            Date: Date,
            JSON: JSON,
            ...Object.fromEntries(this.variables)
        };
        
        // Wrap in try-catch for safety
        try {
            // Use Function constructor for safe evaluation
            const func = new Function(...Object.keys(context), `return ${expression}`);
            return func(...Object.values(context));
        } catch (error) {
            throw new Error(`Evaluation error: ${error.message}`);
        }
    }
    
    // Debug controls
    stepOver() {
        if (this.isPaused) {
            this.isPaused = false;
            this.resume();
        }
    }
    
    stepInto() {
        if (this.isPaused) {
            // For simple debugger, stepInto is same as stepOver
            this.stepOver();
        }
    }
    
    stepOut() {
        if (this.isPaused) {
            // Continue to next breakpoint or end
            this.isPaused = false;
            this.resume();
        }
    }
    
    continue() {
        if (this.isPaused) {
            this.isPaused = false;
            this.resume();
        }
    }
    
    pause() {
        if (this.isRunning && !this.isPaused) {
            this.isPaused = true;
            this.pauseAtLine(this.currentLine);
        }
    }
    
    stop() {
        this.isRunning = false;
        this.isPaused = false;
        this.clearHighlights();
        this.log('Debugging stopped');
    }
    
    // Internal methods
    pauseAtLine(line) {
        this.isPaused = true;
        this.highlightCurrentLine();
        this.log(`Paused at line ${line + 1}`);
        this.updateControls();
    }
    
    highlightCurrentLine() {
        if (!this.options.editor) return;
        
        // Clear previous highlights
        this.clearHighlights();
        
        // Add highlight to current line
        this.currentLineMarker = this.options.editor.markText(
            { line: this.currentLine, ch: 0 },
            { line: this.currentLine + 1, ch: 0 },
            { className: 'current-line' }
        );
        
        // Scroll to line
        this.options.editor.scrollIntoView(
            { line: this.currentLine, ch: 0 },
            100
        );
    }
    
    clearHighlights() {
        if (this.currentLineMarker) {
            this.currentLineMarker.clear();
        }
    }
    
    async waitForContinue() {
        return new Promise(resolve => {
            this.continueResolve = resolve;
        });
    }
    
    resume() {
        if (this.continueResolve) {
            this.continueResolve();
            this.continueResolve = null;
        }
    }
    
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // UI updates
    updateControls() {
        const controls = document.querySelector('.debug-controls');
        if (!controls) return;
        
        const buttons = controls.querySelectorAll('button');
        buttons.forEach(btn => {
            const action = btn.dataset.action;
            if (action) {
                btn.disabled = !this.isRunning;
                
                if (this.isPaused) {
                    // Enable step controls when paused
                    if (['step-over', 'step-into', 'step-out', 'continue'].includes(action)) {
                        btn.disabled = false;
                    }
                }
            }
        });
    }
    
    updateVariableDisplay() {
        const varList = document.querySelector('.variables-list');
        if (!varList) return;
        
        varList.innerHTML = '';
        
        this.variables.forEach((value, name) => {
            const item = document.createElement('div');
            item.className = 'variable-item';
            item.innerHTML = `
                <span class="var-name">${name}</span>
                <span class="var-value">${JSON.stringify(value)}</span>
            `;
            varList.appendChild(item);
        });
    }
    
    log(message, type = 'info') {
        if (!this.options.output) return;
        
        const logEntry = document.createElement('div');
        logEntry.className = `debug-log debug-${type}`;
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        
        this.options.output.appendChild(logEntry);
        this.options.output.scrollTop = this.options.output.scrollHeight;
    }
    
    // Persistence
    saveBreakpoints() {
        const breakpoints = Array.from(this.breakpoints);
        try {
            localStorage.setItem('debugger-breakpoints', JSON.stringify(breakpoints));
        } catch (e) {
            console.warn('Failed to save breakpoints:', e);
        }
    }
    
    loadBreakpoints() {
        try {
            const saved = localStorage.getItem('debugger-breakpoints');
            if (saved) {
                const breakpoints = JSON.parse(saved);
                breakpoints.forEach(line => {
                    this.addBreakpoint(line);
                });
            }
        } catch (e) {
            console.warn('Failed to load breakpoints:', e);
        }
    }
    
    // Watch expressions
    addWatchExpression(expression) {
        this.watchExpressions.add(expression);
        this.updateWatchDisplay();
    }
    
    removeWatchExpression(expression) {
        this.watchExpressions.delete(expression);
        this.updateWatchDisplay();
    }
    
    updateWatchDisplay() {
        const watchList = document.querySelector('.watch-list');
        if (!watchList) return;
        
        watchList.innerHTML = '';
        
        this.watchExpressions.forEach(expression => {
            try {
                const value = this.evaluateExpression(expression);
                const item = document.createElement('div');
                item.className = 'watch-item';
                item.innerHTML = `
                    <span class="watch-expression">${expression}</span>
                    <span class="watch-value">${JSON.stringify(value)}</span>
                    <button class="remove-watch" data-expression="${expression}">×</button>
                `;
                watchList.appendChild(item);
            } catch (error) {
                // Skip invalid expressions
            }
        });
    }
    
    // Export for external use
    getState() {
        return {
            isRunning: this.isRunning,
            isPaused: this.isPaused,
            currentLine: this.currentLine,
            breakpoints: Array.from(this.breakpoints),
            variables: Object.fromEntries(this.variables),
            callStack: [...this.callStack]
        };
    }
    
    setState(state) {
        if (state.breakpoints) {
            this.breakpoints = new Set(state.breakpoints);
        }
        if (state.variables) {
            this.variables = new Map(Object.entries(state.variables));
        }
        if (state.currentLine !== undefined) {
            this.currentLine = state.currentLine;
        }
    }
}

// Initialize debugger when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.codeDebugger = new CodeDebugger({
        editor: window.codeEditor,
        output: document.getElementById('consoleOutput')
    });
    
    // Load saved breakpoints
    window.codeDebugger.loadBreakpoints();
    
    // Add debug control event listeners
    document.querySelectorAll('[data-debug-action]').forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.debugAction;
            if (window.codeDebugger[action]) {
                window.codeDebugger[action]();
            }
        });
    });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CodeDebugger;
}