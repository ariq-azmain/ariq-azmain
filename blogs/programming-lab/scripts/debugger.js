// debugger.js - Enhanced debugger with breakpoints and step execution

class CodeDebugger {
    constructor(options = {}) {
        this.editor = options.editor;
        this.output = options.output;
        this.breakpoints = new Set();
        this.isDebugging = false;
        this.currentLine = 0;
        this.codeLines = [];
        this.variables = new Map();
        this.callStack = [];
        
        this.init();
    }
    
    init() {
        this.setupGutterClick();
        this.setupDebugStyles();
    }
    
    setupGutterClick() {
        if (!this.editor) return;
        
        // Add gutter for breakpoints
        this.editor.setOption('gutters', [
            'CodeMirror-linenumbers',
            'breakpoints',
            'CodeMirror-foldgutter'
        ]);
        
        // Handle gutter clicks
        this.editor.on('gutterClick', (cm, line, gutter) => {
            if (gutter === 'breakpoints') {
                this.toggleBreakpoint(line);
            }
        });
    }
    
    setupDebugStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .CodeMirror-gutter-breakpoints {
                width: 20px;
            }
            
            .breakpoint {
                color: #ef4444;
                cursor: pointer;
                font-size: 16px;
                line-height: 16px;
                text-align: center;
            }
            
            .breakpoint::before {
                content: "●";
            }
            
            .current-line {
                background-color: rgba(245, 158, 11, 0.2) !important;
            }
            
            .breakpoint-line {
                background-color: rgba(239, 68, 68, 0.1) !important;
            }
            
            .debug-info {
                padding: 8px;
                margin: 4px 0;
                background: rgba(59, 130, 246, 0.1);
                border-left: 3px solid #3b82f6;
                border-radius: 4px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 12px;
            }
            
            .debug-warning {
                background: rgba(245, 158, 11, 0.1);
                border-left-color: #f59e0b;
            }
            
            .debug-error {
                background: rgba(239, 68, 68, 0.1);
                border-left-color: #ef4444;
            }
            
            .debug-success {
                background: rgba(16, 185, 129, 0.1);
                border-left-color: #10b981;
            }
            
            .variable-watch {
                display: flex;
                justify-content: space-between;
                padding: 4px 8px;
                background: rgba(148, 163, 184, 0.1);
                border-radius: 4px;
                margin: 2px 0;
                font-size: 11px;
            }
            
            .variable-name {
                color: #cbd5e1;
                font-weight: 500;
            }
            
            .variable-value {
                color: #10b981;
                font-family: 'JetBrains Mono', monospace;
            }
        `;
        document.head.appendChild(style);
    }
    
    toggleBreakpoint(line) {
        if (this.breakpoints.has(line)) {
            this.breakpoints.delete(line);
            this.editor.removeLineClass(line, 'background', 'breakpoint-line');
            this.log(`Breakpoint removed at line ${line + 1}`, 'info');
        } else {
            this.breakpoints.add(line);
            this.editor.addLineClass(line, 'background', 'breakpoint-line');
            this.log(`Breakpoint set at line ${line + 1}`, 'info');
        }
        
        // Update gutter
        const info = this.editor.lineInfo(line);
        if (info.gutterMarkers) {
            delete info.gutterMarkers.breakpoints;
        } else {
            const marker = document.createElement('div');
            marker.className = 'breakpoint';
            this.editor.setGutterMarker(line, 'breakpoints', marker);
        }
    }
    
    startDebugging(code) {
        if (!code || !this.output) return false;
        
        this.isDebugging = true;
        this.currentLine = 0;
        this.codeLines = code.split('\n');
        this.variables.clear();
        this.callStack = [];
        
        this.clearOutput();
        this.log('=== Debugging Session Started ===', 'info');
        this.log(`Total lines: ${this.codeLines.length}`, 'info');
        this.log(`Breakpoints: ${this.breakpoints.size}`, 'info');
        this.log('Commands: step, continue, stop, watch <var>', 'info');
        
        // Highlight first line
        this.highlightCurrentLine();
        
        return true;
    }
    
    step() {
        if (!this.isDebugging || this.currentLine >= this.codeLines.length) {
            this.stop();
            return;
        }
        
        // Check for breakpoint
        if (this.breakpoints.has(this.currentLine)) {
            this.log(`⏸️ Breakpoint hit at line ${this.currentLine + 1}`, 'warning');
            this.displayVariables();
            return;
        }
        
        const line = this.codeLines[this.currentLine].trim();
        
        if (line) {
            this.log(`→ Line ${this.currentLine + 1}: ${line}`, 'info');
            this.executeLine(line);
        }
        
        // Move to next line
        this.clearHighlight();
        this.currentLine++;
        
        if (this.currentLine < this.codeLines.length) {
            this.highlightCurrentLine();
        } else {
            this.log('✅ Program execution completed', 'success');
            this.stop();
        }
    }
    
    executeLine(line) {
        // Simple line execution simulation
        if (line.includes('int ') && line.includes('=')) {
            // Variable declaration
            const match = line.match(/(int|float|double|char)\s+(\w+)\s*=\s*(.+);/);
            if (match) {
                const [, type, name, value] = match;
                this.variables.set(name, { type, value: this.evaluateExpression(value) });
                this.log(`  Declared ${type} ${name} = ${this.variables.get(name).value}`, 'info');
            }
        } else if (line.includes('=') && !line.includes('int ') && !line.includes('float ') && !line.includes('double ')) {
            // Variable assignment
            const match = line.match(/(\w+)\s*=\s*(.+);/);
            if (match) {
                const [, name, value] = match;
                if (this.variables.has(name)) {
                    const oldValue = this.variables.get(name).value;
                    this.variables.get(name).value = this.evaluateExpression(value);
                    this.log(`  ${name} = ${oldValue} → ${this.variables.get(name).value}`, 'info');
                }
            }
        } else if (line.includes('printf') || line.includes('cout')) {
            // Output statement
            this.log(`  Output: ${this.extractOutput(line)}`, 'success');
        } else if (line.includes('if') || line.includes('for') || line.includes('while')) {
            // Control structure
            this.log(`  Control structure evaluated`, 'info');
        } else if (line.includes('return')) {
            // Return statement
            this.log(`  Return statement executed`, 'info');
        }
    }
    
    evaluateExpression(expr) {
        // Simple expression evaluation
        expr = expr.trim().replace(/;$/, '');
        
        // Handle basic arithmetic
        if (expr.match(/^\d+$/)) return parseInt(expr);
        if (expr.match(/^\d+\.\d+$/)) return parseFloat(expr);
        if (expr.match(/^".*"$/)) return expr.slice(1, -1);
        if (expr.match(/^'.'$/)) return expr[1];
        
        // Handle variable references
        if (this.variables.has(expr)) {
            return this.variables.get(expr).value;
        }
        
        return expr;
    }
    
    extractOutput(line) {
        // Extract string from printf/cout
        const stringMatch = line.match(/"([^"]+)"/);
        if (stringMatch) {
            return stringMatch[1].replace(/\\n/g, '\n').replace(/\\t/g, '\t');
        }
        return "Output generated";
    }
    
    continue() {
        if (!this.isDebugging) return;
        
        this.log('▶️ Continuing execution...', 'info');
        
        while (this.isDebugging && this.currentLine < this.codeLines.length) {
            if (this.breakpoints.has(this.currentLine)) {
                this.log(`⏸️ Breakpoint reached at line ${this.currentLine + 1}`, 'warning');
                this.highlightCurrentLine();
                this.displayVariables();
                break;
            }
            
            this.step();
            
            // Small delay for animation
            if (this.isDebugging) {
                setTimeout(() => {}, 100);
            }
        }
    }
    
    stop() {
        this.isDebugging = false;
        this.clearHighlight();
        this.log('🛑 Debugging session stopped', 'info');
    }
    
    highlightCurrentLine() {
        if (this.editor) {
            this.editor.addLineClass(this.currentLine, 'background', 'current-line');
        }
    }
    
    clearHighlight() {
        if (this.editor && this.currentLine < this.codeLines.length) {
            this.editor.removeLineClass(this.currentLine, 'background', 'current-line');
        }
    }
    
    displayVariables() {
        if (this.variables.size === 0) return;
        
        const varDiv = document.createElement('div');
        varDiv.className = 'debug-info';
        varDiv.innerHTML = '<strong>Variables:</strong>';
        
        this.variables.forEach((value, name) => {
            const varEl = document.createElement('div');
            varEl.className = 'variable-watch';
            varEl.innerHTML = `
                <span class="variable-name">${name}</span>
                <span class="variable-value">${value.value} (${value.type})</span>
            `;
            varDiv.appendChild(varEl);
        });
        
        this.output.appendChild(varDiv);
    }
    
    log(message, type = 'info') {
        if (!this.output) return;
        
        const div = document.createElement('div');
        div.className = `debug-info debug-${type}`;
        div.textContent = message;
        this.output.appendChild(div);
        this.output.scrollTop = this.output.scrollHeight;
    }
    
    clearOutput() {
        if (this.output) {
            this.output.innerHTML = '';
        }
    }
    
    watchVariable(name) {
        if (this.variables.has(name)) {
            const value = this.variables.get(name);
            this.log(`👀 Watching ${name}: ${value.value} (${value.type})`, 'info');
        } else {
            this.log(`Variable "${name}" not found`, 'error');
        }
    }
}

// Make globally available
window.CodeDebugger = CodeDebugger;