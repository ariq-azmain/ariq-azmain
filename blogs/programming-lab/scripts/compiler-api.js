// Compiler API integration for multiple languages
class CompilerAPI {
    constructor(options = {}) {
        this.options = {
            apiUrl: 'https://api.codex.jaagrav.in',
            fallbackApi: 'https://emkc.org/api/v2/piston',
            timeout: 30000,
            languages: {
                'c': { name: 'c', version: '10.2.0' },
                'cpp': { name: 'cpp', version: '10.2.0' },
                'java': { name: 'java', version: '15.0.2' },
                'csharp': { name: 'csharp', version: '5.0.201' },
                'go': { name: 'go', version: '1.16.2' },
                'python': { name: 'python', version: '3.10.0' },
                'javascript': { name: 'javascript', version: '18.15.0' },
                'php': { name: 'php', version: '8.2.3' },
                'ruby': { name: 'ruby', version: '3.0.1' },
                'typescript': { name: 'typescript', version: '5.0.3' }
            },
            ...options
        };
        
        this.cache = new Map();
        this.queue = [];
        this.isProcessing = false;
    }
    
    // Main execution method
    async execute(language, code, input = '', options = {}) {
        const cacheKey = `${language}-${this.hashCode(code)}-${this.hashCode(input)}`;
        
        // Check cache first
        if (this.cache.has(cacheKey) && !options.force) {
            return this.cache.get(cacheKey);
        }
        
        // Add to queue
        const request = {
            language,
            code,
            input,
            options,
            resolve: null,
            reject: null
        };
        
        const promise = new Promise((resolve, reject) => {
            request.resolve = resolve;
            request.reject = reject;
        });
        
        this.queue.push(request);
        this.processQueue();
        
        return promise;
    }
    
    async processQueue() {
        if (this.isProcessing || this.queue.length === 0) {
            return;
        }
        
        this.isProcessing = true;
        
        while (this.queue.length > 0) {
            const request = this.queue.shift();
            await this.processRequest(request);
        }
        
        this.isProcessing = false;
    }
    
    async processRequest(request) {
        const { language, code, input, options } = request;
        
        try {
            // Try primary API first
            let result = await this.executePrimaryAPI(language, code, input, options);
            
            // If primary fails, try fallback
            if (!result.success) {
                result = await this.executeFallbackAPI(language, code, input, options);
            }
            
            // Cache the result
            const cacheKey = `${language}-${this.hashCode(code)}-${this.hashCode(input)}`;
            this.cache.set(cacheKey, result);
            
            // Clean old cache entries
            this.cleanCache();
            
            request.resolve(result);
            
        } catch (error) {
            request.reject({
                success: false,
                output: `API Error: ${error.message}`,
                error: error.message,
                language,
                timestamp: Date.now()
            });
        }
    }
    
    async executePrimaryAPI(language, code, input, options) {
        const langConfig = this.options.languages[language];
        if (!langConfig) {
            throw new Error(`Unsupported language: ${language}`);
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.options.timeout);
        
        try {
            const response = await fetch(this.options.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: code,
                    language: langConfig.name,
                    input: input
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`API responded with status ${response.status}`);
            }
            
            const data = await response.json();
            
            return {
                success: data.error ? false : true,
                output: data.output || data.error,
                error: data.error || null,
                language: language,
                timestamp: Date.now(),
                executionTime: data.time || null,
                memory: data.memory || null
            };
            
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }
    
    async executeFallbackAPI(language, code, input, options) {
        const langConfig = this.options.languages[language];
        if (!langConfig) {
            throw new Error(`Unsupported language: ${language}`);
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.options.timeout);
        
        try {
            const response = await fetch(`${this.options.fallbackApi}/execute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    language: langConfig.name,
                    version: langConfig.version,
                    files: [
                        {
                            name: `main.${this.getFileExtension(language)}`,
                            content: code
                        }
                    ],
                    stdin: input,
                    args: options.args || []
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`Fallback API responded with status ${response.status}`);
            }
            
            const data = await response.json();
            
            return {
                success: data.run.code === 0,
                output: data.run.output || data.run.stderr,
                error: data.run.code !== 0 ? data.run.stderr : null,
                language: language,
                timestamp: Date.now(),
                executionTime: data.run.time,
                memory: data.run.memory
            };
            
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }
    
    // Helper methods
    getFileExtension(language) {
        const extensions = {
            'c': 'c',
            'cpp': 'cpp',
            'java': 'java',
            'csharp': 'cs',
            'go': 'go',
            'python': 'py',
            'javascript': 'js',
            'php': 'php',
            'ruby': 'rb',
            'typescript': 'ts'
        };
        
        return extensions[language] || 'txt';
    }
    
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash;
    }
    
    cleanCache() {
        const maxCacheSize = 100;
        const maxCacheAge = 5 * 60 * 1000; // 5 minutes
        
        if (this.cache.size > maxCacheSize) {
            // Remove oldest entries
            const entries = Array.from(this.cache.entries());
            entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
            
            const toRemove = entries.slice(0, this.cache.size - maxCacheSize);
            toRemove.forEach(([key]) => this.cache.delete(key));
        }
        
        // Remove expired entries
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp > maxCacheAge) {
                this.cache.delete(key);
            }
        }
    }
    
    // Batch execution
    async executeBatch(requests) {
        const results = [];
        
        for (const request of requests) {
            try {
                const result = await this.execute(
                    request.language,
                    request.code,
                    request.input,
                    request.options
                );
                results.push(result);
            } catch (error) {
                results.push({
                    success: false,
                    output: `Error: ${error.message}`,
                    error: error.message,
                    language: request.language,
                    timestamp: Date.now()
                });
            }
        }
        
        return results;
    }
    
    // Language detection
    detectLanguage(code) {
        // Simple language detection based on code patterns
        const patterns = {
            'c': /#include\s*<.*\.h>/,
            'cpp': /#include\s*<.*>|std::|using\s+namespace\s+std/,
            'java': /public\s+class|import\s+java\./,
            'csharp': /using\s+System|namespace\s+\w+/,
            'go': /package\s+main|func\s+main/,
            'python': /def\s+\w+|import\s+\w+|print\(/,
            'javascript': /function\s+\w+|const\s+|let\s+|console\.log/,
            'php': /<\?php|\$\w+\s*=/,
            'ruby': /def\s+\w+|puts\s+/,
            'typescript': /interface\s+|type\s+\w+|:\s*\w+/
        };
        
        for (const [lang, pattern] of Object.entries(patterns)) {
            if (pattern.test(code)) {
                return lang;
            }
        }
        
        return 'javascript'; // Default fallback
    }
    
    // Code validation
    validateCode(language, code) {
        const validators = {
            'java': (code) => code.includes('public class'),
            'c': (code) => code.includes('int main'),
            'cpp': (code) => code.includes('int main'),
            'csharp': (code) => code.includes('class Program') || code.includes('static void Main'),
            'go': (code) => code.includes('package main') && code.includes('func main'),
            'python': () => true,
            'javascript': () => true,
            'php': (code) => code.includes('<?php'),
            'ruby': () => true,
            'typescript': () => true
        };
        
        const validator = validators[language];
        if (validator) {
            return validator(code);
        }
        
        return true;
    }
    
    // Format code
    async formatCode(language, code) {
        // This would typically call a formatting API
        // For now, implement basic formatting
        
        switch (language) {
            case 'python':
                return this.formatPython(code);
            case 'javascript':
            case 'typescript':
                return this.formatJavaScript(code);
            case 'java':
            case 'c':
            case 'cpp':
            case 'csharp':
                return this.formatCurlyBrace(code);
            default:
                return code;
        }
    }
    
    formatPython(code) {
        // Basic Python indentation fix
        const lines = code.split('\n');
        let indentLevel = 0;
        
        return lines.map(line => {
            const trimmed = line.trim();
            
            if (trimmed.endsWith(':')) {
                const result = '    '.repeat(indentLevel) + line.trim();
                indentLevel++;
                return result;
            } else if (trimmed === '' && indentLevel > 0) {
                indentLevel--;
                return '';
            } else {
                return '    '.repeat(indentLevel) + line.trim();
            }
        }).join('\n');
    }
    
    formatJavaScript(code) {
        // Basic JS formatting
        return code
            .replace(/\s*{\s*/g, ' { ')
            .replace(/\s*}\s*/g, ' } ')
            .replace(/\s*\(\s*/g, '(')
            .replace(/\s*\)\s*/g, ')')
            .replace(/;\s*/g, ';\n')
            .replace(/\n\s*\n/g, '\n');
    }
    
    formatCurlyBrace(code) {
        // Basic curly brace language formatting
        return code
            .replace(/\s*{\s*/g, ' {\n')
            .replace(/\s*}\s*/g, '\n}\n')
            .replace(/;\s*/g, ';\n')
            .replace(/\n\s*\n/g, '\n');
    }
    
    // Statistics
    getStats() {
        return {
            cacheSize: this.cache.size,
            queueSize: this.queue.length,
            languagesSupported: Object.keys(this.options.languages).length,
            lastCleanup: this.lastCleanup || null
        };
    }
    
    // Clear cache
    clearCache() {
        this.cache.clear();
    }
    
    // Test API connectivity
    async testConnection() {
        try {
            const response = await fetch(this.options.apiUrl, {
                method: 'HEAD',
                timeout: 5000
            });
            
            return {
                primary: response.ok,
                timestamp: Date.now()
            };
        } catch (error) {
            try {
                const response = await fetch(this.options.fallbackApi, {
                    method: 'HEAD',
                    timeout: 5000
                });
                
                return {
                    primary: false,
                    fallback: response.ok,
                    timestamp: Date.now()
                };
            } catch (fallbackError) {
                return {
                    primary: false,
                    fallback: false,
                    error: error.message,
                    timestamp: Date.now()
                };
            }
        }
    }
}

// Initialize compiler API when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.compilerAPI = new CompilerAPI();
    
    // Test connection on startup
    window.compilerAPI.testConnection().then(status => {
        console.log('Compiler API Status:', status);
        
        if (!status.primary && !status.fallback) {
            console.warn('Compiler API is not available. Using simulated execution.');
        }
    });
    
    // Add global error handler for API calls
    window.addEventListener('unhandledrejection', (event) => {
        if (event.reason && event.reason.message && event.reason.message.includes('API')) {
            console.error('API Error:', event.reason);
            
            // Show user-friendly error
            const notification = document.createElement('div');
            notification.className = 'api-error-notification';
            notification.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <span>Compiler service temporarily unavailable. Using simulated execution.</span>
            `;
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #f59e0b;
                color: white;
                padding: 1rem;
                border-radius: 8px;
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 10000;
                animation: slideUp 0.3s ease-out;
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideDown 0.3s ease-out forwards';
                setTimeout(() => notification.remove(), 300);
            }, 5000);
        }
    });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CompilerAPI;
}

// Simulated execution for offline/demo mode
class SimulatedCompiler {
    static execute(language, code, input = '') {
        return new Promise((resolve) => {
            setTimeout(() => {
                const output = this.simulateExecution(language, code, input);
                resolve({
                    success: true,
                    output: output,
                    error: null,
                    language: language,
                    timestamp: Date.now(),
                    executionTime: '100ms',
                    memory: '1MB',
                    simulated: true
                });
            }, 500);
        });
    }
    
    static simulateExecution(language, code, input) {
        const examples = {
            'c': `Compiled C program successfully.\nOutput:\nHello, World!\nExecution time: 0.002s`,
            'cpp': `Compiled C++ program successfully.\nOutput:\nHello, C++ World!\nExecution time: 0.003s`,
            'java': `Compiled Java program successfully.\nOutput:\nHello from Java!\nExecution time: 0.5s`,
            'csharp': `Compiled C# program successfully.\nOutput:\nHello, C#!\nExecution time: 0.2s`,
            'go': `Compiled Go program successfully.\nOutput:\nHello, Go!\nExecution time: 0.1s`,
            'python': `Python execution completed.\nOutput:\nHello, Python!\nExecution time: 0.05s`,
            'javascript': `JavaScript execution completed.\nOutput:\nHello, JavaScript!\nExecution time: 0.01s`,
            'php': `PHP execution completed.\nOutput:\nHello, PHP!\nExecution time: 0.02s`,
            'ruby': `Ruby execution completed.\nOutput:\nHello, Ruby!\nExecution time: 0.03s`,
            'typescript': `TypeScript compiled and executed.\nOutput:\nHello, TypeScript!\nExecution time: 0.02s`
        };
        
        return examples[language] || `Simulated execution for ${language}\nCode length: ${code.length} characters`;
    }
}

// Add simulated execution fallback
CompilerAPI.prototype.executeWithFallback = async function(language, code, input, options) {
    try {
        return await this.execute(language, code, input, options);
    } catch (error) {
        console.warn('Using simulated execution due to API error:', error);
        return SimulatedCompiler.execute(language, code, input);
    }
};