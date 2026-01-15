// Java IDE Main Script
class JavaIDE {
    constructor() {
        this.editor = null;
        this.currentFile = 'Main.java';
        this.files = {
            'Main.java': `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
        System.out.println("Welcome to Java IDE");
        
        // Example: Simple calculation
        int a = 10;
        int b = 20;
        int sum = a + b;
        System.out.println("Sum: " + sum);
        
        // Example: Loop
        for (int i = 1; i <= 5; i++) {
            System.out.println("Count: " + i);
        }
    }
}`,
            'Example.java': `import java.util.Scanner;
import java.util.ArrayList;

public class Example {
    private String name;
    private int value;
    
    public Example(String name, int value) {
        this.name = name;
        this.value = value;
    }
    
    public void display() {
        System.out.println("Name: " + name);
        System.out.println("Value: " + value);
    }
    
    public static void main(String[] args) {
        Example example = new Example("Test", 100);
        example.display();
        
        // Using ArrayList
        ArrayList<String> list = new ArrayList<>();
        list.add("Java");
        list.add("Programming");
        list.add("IDE");
        
        for (String item : list) {
            System.out.println(item);
        }
    }
}`,
            'Utils.java': `public class Utils {
    
    public static int add(int a, int b) {
        return a + b;
    }
    
    public static int subtract(int a, int b) {
        return a - b;
    }
    
    public static int multiply(int a, int b) {
        return a * b;
    }
    
    public static double divide(int a, int b) {
        if (b == 0) {
            throw new ArithmeticException("Cannot divide by zero");
        }
        return (double) a / b;
    }
    
    public static boolean isEven(int number) {
        return number % 2 == 0;
    }
    
    public static String reverseString(String str) {
        return new StringBuilder(str).reverse().toString();
    }
}`,
            'HelloWorld.java': `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        System.out.println("This is a simple Java program.");
    }
}`,
            'Calculator.java': `import java.util.Scanner;

public class Calculator {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.println("Java Calculator");
        System.out.println("===============");
        
        System.out.print("Enter first number: ");
        double num1 = scanner.nextDouble();
        
        System.out.print("Enter second number: ");
        double num2 = scanner.nextDouble();
        
        System.out.println("\\nOperations:");
        System.out.println("1. Addition (+)");
        System.out.println("2. Subtraction (-)");
        System.out.println("3. Multiplication (*)");
        System.out.println("4. Division (/)");
        
        System.out.print("Choose operation (1-4): ");
        int choice = scanner.nextInt();
        
        double result = 0;
        String operation = "";
        
        switch (choice) {
            case 1:
                result = num1 + num2;
                operation = "+";
                break;
            case 2:
                result = num1 - num2;
                operation = "-";
                break;
            case 3:
                result = num1 * num2;
                operation = "*";
                break;
            case 4:
                if (num2 != 0) {
                    result = num1 / num2;
                    operation = "/";
                } else {
                    System.out.println("Error: Division by zero!");
                    scanner.close();
                    return;
                }
                break;
            default:
                System.out.println("Invalid choice!");
                scanner.close();
                return;
        }
        
        System.out.printf("\\nResult: %.2f %s %.2f = %.2f\\n", 
                         num1, operation, num2, result);
        
        scanner.close();
    }
}`
        };
        
        this.isCompiling = false;
        this.isRunning = false;
        this.theme = 'vs-dark';
        this.javaVersion = '17';
        
        this.init();
    }
    
    async init() {
        await this.loadMonacoEditor();
        this.setupEventListeners();
        this.loadInitialFile();
        this.updateUI();
        this.setupFolderToggle();
        
        console.log('Java IDE initialized');
    }
    
    async loadMonacoEditor() {
        return new Promise((resolve) => {
            require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' } });
            
            require(['vs/editor/editor.main'], () => {
                this.editor = monaco.editor.create(document.getElementById('codeEditor'), {
                    value: this.files[this.currentFile],
                    language: 'java',
                    theme: this.theme,
                    fontSize: 14,
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    formatOnPaste: true,
                    formatOnType: true,
                    suggestOnTriggerCharacters: true,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    renderLineHighlight: 'all',
                    scrollbar: {
                        vertical: 'visible',
                        horizontal: 'visible',
                        useShadows: true
                    },
                    overviewRulerLanes: 3,
                    fixedOverflowWidgets: true
                });
                
                // Add Java language configuration
                monaco.languages.registerCompletionItemProvider('java', {
                    provideCompletionItems: (model, position) => {
                        const suggestions = [
                            // System methods
                            { label: 'System.out.println()', kind: monaco.languages.CompletionItemKind.Method, insertText: 'System.out.println(${1:text});', detail: 'Print to console' },
                            { label: 'System.out.print()', kind: monaco.languages.CompletionItemKind.Method, insertText: 'System.out.print(${1:text});', detail: 'Print without newline' },
                            
                            // Common classes
                            { label: 'Scanner', kind: monaco.languages.CompletionItemKind.Class, insertText: 'Scanner ${1:scanner} = new Scanner(System.in);', detail: 'Scanner class for input' },
                            { label: 'ArrayList', kind: monaco.languages.CompletionItemKind.Class, insertText: 'ArrayList<${1:String}> ${2:list} = new ArrayList<>();', detail: 'ArrayList class' },
                            { label: 'String', kind: monaco.languages.CompletionItemKind.Class, insertText: 'String ${1:str} = "${2:text}";', detail: 'String class' },
                            
                            // Control structures
                            { label: 'public static void main', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'public static void main(String[] args) {\n\t${1:// code}\n}', detail: 'Main method' },
                            { label: 'for loop', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n\t${3:// code}\n}', detail: 'For loop' },
                            { label: 'if statement', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'if (${1:condition}) {\n\t${2:// code}\n}', detail: 'If statement' },
                            { label: 'try-catch', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'try {\n\t${1:// code}\n} catch (Exception e) {\n\t${2:// handle exception}\n}', detail: 'Try-catch block' }
                        ];
                        
                        return { suggestions };
                    }
                });
                
                // Track cursor position
                this.editor.onDidChangeCursorPosition((e) => {
                    const position = e.position;
                    document.getElementById('cursorPosition').innerHTML = 
                        `<i class="fas fa-i-cursor"></i> Ln ${position.lineNumber}, Col ${position.column}`;
                });
                
                // Track content changes
                this.editor.onDidChangeModelContent(() => {
                    this.updateFileSize();
                    this.updateLineCount();
                });
                
                // Update editor layout on resize
                window.addEventListener('resize', () => {
                    setTimeout(() => {
                        this.editor.layout();
                    }, 100);
                });
                
                resolve();
            });
        });
    }
    
    setupEventListeners() {
        // File explorer
        document.querySelectorAll('.file-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const fileName = e.currentTarget.dataset.file;
                this.openFile(fileName);
            });
        });
        
        // Tabs
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                if (!e.target.classList.contains('tab-close')) {
                    const fileName = e.currentTarget.dataset.file;
                    this.openFile(fileName);
                }
            });
            
            const closeBtn = tab.querySelector('.tab-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const fileName = e.target.closest('.tab').dataset.file;
                    this.closeFile(fileName);
                });
            }
        });
        
        // Buttons
        document.getElementById('runBtn').addEventListener('click', () => this.runJava());
        document.getElementById('compileBtn').addEventListener('click', () => this.compileJava());
        document.getElementById('debugBtn').addEventListener('click', () => this.debugJava());
        document.getElementById('formatBtn').addEventListener('click', () => this.formatCode());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveCurrentFile());
        document.getElementById('clearOutputBtn').addEventListener('click', () => this.clearOutput());
        document.getElementById('clearTerminalBtn').addEventListener('click', () => this.clearTerminal());
        document.getElementById('clearDebugBtn').addEventListener('click', () => this.clearDebug());
        document.getElementById('clearProblemsBtn').addEventListener('click', () => this.clearProblems());
        document.getElementById('copyOutputBtn').addEventListener('click', () => this.copyOutput());
        document.getElementById('copyTerminalBtn').addEventListener('click', () => this.copyTerminal());
        document.getElementById('copyDebugBtn').addEventListener('click', () => this.copyDebug());
        
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        
        // New file
        document.getElementById('newFileBtn').addEventListener('click', () => this.createNewFile());
        
        // Add tab
        document.getElementById('addTabBtn').addEventListener('click', () => this.createNewFile());
        
        // Output tabs
        document.querySelectorAll('.output-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab || e.target.closest('.output-tab').dataset.tab;
                this.switchOutputTab(tabName);
            });
        });
        
        // Settings buttons
        document.getElementById('settingsBtn').addEventListener('click', () => this.openSettings());
        document.getElementById('settingsBtn2').addEventListener('click', () => this.openSettings());
        document.getElementById('saveSettings').addEventListener('click', () => this.saveSettings());
        document.getElementById('cancelSettings').addEventListener('click', () => this.closeSettings());
        
        document.getElementById('themeSelect').addEventListener('change', (e) => {
            this.theme = e.target.value;
            this.updateEditorTheme();
        });
        
        document.getElementById('javaVersion').addEventListener('change', (e) => {
            this.javaVersion = e.target.value;
        });
        
        document.getElementById('fontSize').addEventListener('input', (e) => {
            document.getElementById('fontSizeValue').textContent = e.target.value;
            this.editor.updateOptions({ fontSize: parseInt(e.target.value) });
        });
        
        document.getElementById('lineNumbers').addEventListener('change', (e) => {
            this.editor.updateOptions({ lineNumbers: e.target.checked ? 'on' : 'off' });
        });
        
        document.getElementById('wordWrap').addEventListener('change', (e) => {
            this.editor.updateOptions({ wordWrap: e.target.checked ? 'on' : 'off' });
        });
        
        // Auto-save
        this.editor.onDidChangeModelContent(() => {
            if (document.getElementById('autoSave') && document.getElementById('autoSave').checked) {
                this.saveCurrentFile();
            }
        });
        
        // Fullscreen
        document.getElementById('fullscreenBtn').addEventListener('click', () => this.toggleFullscreen());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key.toLowerCase()) {
                    case 's':
                        e.preventDefault();
                        this.saveCurrentFile();
                        break;
                    case 'enter':
                        e.preventDefault();
                        this.runJava();
                        break;
                    case 'b':
                        e.preventDefault();
                        this.compileJava();
                        break;
                    case 'd':
                        e.preventDefault();
                        this.debugJava();
                        break;
                    case 'f':
                        e.preventDefault();
                        if (e.shiftKey) this.formatCode();
                        break;
                }
            }
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('settingsModal');
            if (e.target === modal) {
                this.closeSettings();
            }
        });
        
        // Handle escape key for modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSettings();
            }
        });
    }
    
    setupFolderToggle() {
        const folderToggle = document.querySelector('.folder-toggle');
        const folderContents = document.querySelector('.folder-contents');
        const folder = document.querySelector('.folder');
        
        if (folderToggle) {
            folderToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFolder();
            });
            
            folder.addEventListener('click', (e) => {
                if (!e.target.classList.contains('folder-toggle')) {
                    this.toggleFolder();
                }
            });
        }
    }
    
    toggleFolder() {
        const folderContents = document.querySelector('.folder-contents');
        const folder = document.querySelector('.folder');
        const folderToggle = document.querySelector('.folder-toggle');
        
        if (folderContents.style.display === 'none') {
            folderContents.style.display = 'block';
            folder.classList.add('open');
            folderToggle.style.transform = 'rotate(180deg)';
        } else {
            folderContents.style.display = 'none';
            folder.classList.remove('open');
            folderToggle.style.transform = 'rotate(0deg)';
        }
    }
    
    openFile(fileName) {
        if (this.files[fileName]) {
            this.currentFile = fileName;
            
            // Update editor content
            this.editor.setValue(this.files[fileName]);
            
            // Update file explorer
            document.querySelectorAll('.file-item').forEach(item => {
                item.classList.remove('active');
                const fileStatus = item.querySelector('.file-status');
                if (fileStatus) fileStatus.style.display = 'none';
                
                if (item.dataset.file === fileName) {
                    item.classList.add('active');
                    const status = item.querySelector('.file-status');
                    if (status) status.style.display = 'inline';
                }
            });
            
            // Update tabs
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
                if (tab.dataset.file === fileName) {
                    tab.classList.add('active');
                }
            });
            
            // Update UI
            this.updateFileSize();
            this.updateLineCount();
            
            console.log(`Opened file: ${fileName}`);
        }
    }
    
    closeFile(fileName) {
        if (fileName !== 'Main.java' && this.files[fileName]) {
            delete this.files[fileName];
            
            // Remove from DOM
            const fileItem = document.querySelector(`.file-item[data-file="${fileName}"]`);
            const tab = document.querySelector(`.tab[data-file="${fileName}"]`);
            
            if (fileItem) fileItem.remove();
            if (tab) tab.remove();
            
            // If closing current file, open Main.java
            if (this.currentFile === fileName) {
                this.openFile('Main.java');
            }
        }
    }
    
    createNewFile() {
        const fileCount = Object.keys(this.files).length + 1;
        const fileName = `NewFile${fileCount}.java`;
        this.files[fileName] = `public class NewFile${fileCount} {
    public static void main(String[] args) {
        System.out.println("New Java file created!");
    }
}`;
        
        // Add to file explorer
        const fileList = document.querySelector('.file-tree');
        const fileItem = document.createElement('li');
        fileItem.className = 'file-item';
        fileItem.dataset.file = fileName;
        fileItem.innerHTML = `<i class="fas fa-file-code"></i><span>${fileName}</span>`;
        fileItem.addEventListener('click', (e) => {
            this.openFile(fileName);
        });
        
        // Insert before the folder
        const folder = document.querySelector('.folder');
        if (folder) {
            fileList.insertBefore(fileItem, folder);
        } else {
            fileList.appendChild(fileItem);
        }
        
        // Add tab
        const tabsContainer = document.querySelector('.editor-tabs');
        const tab = document.createElement('div');
        tab.className = 'tab';
        tab.dataset.file = fileName;
        tab.innerHTML = `<i class="fas fa-file-code"></i><span>${fileName}</span><button class="tab-close"><i class="fas fa-times"></i></button>`;
        
        tab.addEventListener('click', (e) => {
            if (!e.target.classList.contains('tab-close')) {
                this.openFile(fileName);
            }
        });
        
        const closeBtn = tab.querySelector('.tab-close');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeFile(fileName);
        });
        
        tabsContainer.insertBefore(tab, document.getElementById('addTabBtn'));
        
        // Open the new file
        this.openFile(fileName);
    }
    
    async runJava() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.updateStatus('Running Java program...', 'running');
        
        const code = this.editor.getValue();
        const outputElement = document.getElementById('outputText');
        
        // Add loading animation
        const runBtn = document.getElementById('runBtn');
        const originalHTML = runBtn.innerHTML;
        runBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running...';
        runBtn.disabled = true;
        
        // Simulate compilation delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        try {
            // For demo purposes, simulate different outputs
            if (code.includes('System.out.println')) {
                const mockOutput = this.simulateJavaOutput(code);
                outputElement.textContent = mockOutput;
                outputElement.className = 'success';
            } else {
                throw new Error('No output statements found');
            }
            
            this.updateStatus('Program executed successfully', 'success');
            
            // Update execution time
            const randomTime = Math.floor(Math.random() * 100) + 50;
            document.getElementById('executionTime').textContent = `${randomTime} ms`;
            
        } catch (error) {
            outputElement.textContent = `Error: ${error.message}\n\nStack Trace:\n\tat Main.main(Main.java:1)`;
            outputElement.className = 'error';
            this.updateStatus('Execution failed', 'error');
        } finally {
            this.isRunning = false;
            runBtn.innerHTML = originalHTML;
            runBtn.disabled = false;
            
            // Switch to output tab
            this.switchOutputTab('output');
        }
    }
    
    async compileJava() {
        if (this.isCompiling) return;
        
        this.isCompiling = true;
        this.updateStatus('Compiling Java code...', 'compiling');
        
        const code = this.editor.getValue();
        const problemsList = document.getElementById('problemsList');
        
        // Add loading animation
        const compileBtn = document.getElementById('compileBtn');
        const originalHTML = compileBtn.innerHTML;
        compileBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Compiling...';
        compileBtn.disabled = true;
        
        // Simulate compilation
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Check for common Java errors
        const errors = this.checkJavaErrors(code);
        
        if (errors.length === 0) {
            problemsList.innerHTML = '<li class="problem-info"><i class="fas fa-check-circle"></i> Compilation successful - 0 errors, 0 warnings</li>';
            this.updateStatus('Compilation successful', 'success');
            
            // Show success in output
            document.getElementById('outputText').textContent = 
                `Compilation successful for ${this.currentFile}\nJava ${this.javaVersion} | Main class found\nReady to run...`;
            document.getElementById('outputText').className = 'success';
        } else {
            problemsList.innerHTML = '';
            errors.forEach(error => {
                const li = document.createElement('li');
                li.className = 'problem-error';
                li.innerHTML = `<i class="fas fa-times-circle"></i> ${error}`;
                problemsList.appendChild(li);
            });
            
            this.updateStatus('Compilation failed', 'error');
            
            // Show errors in output
            document.getElementById('outputText').textContent = 
                `Compilation failed with ${errors.length} error(s)\n${errors.join('\n')}`;
            document.getElementById('outputText').className = 'error';
        }
        
        this.isCompiling = false;
        compileBtn.innerHTML = originalHTML;
        compileBtn.disabled = false;
        
        // Switch to problems tab if there are errors
        if (errors.length > 0) {
            this.switchOutputTab('problems');
        } else {
            this.switchOutputTab('output');
        }
    }
    
    debugJava() {
        this.updateStatus('Starting debugger...', 'running');
        
        const code = this.editor.getValue();
        const debugText = document.getElementById('debugText');
        
        // Simulate debugger output
        const debugOutput = `Debugger started for ${this.currentFile}
Breakpoints set at:
  - Main.java:3 (System.out.println)
  - Main.java:7 (for loop start)
  
Variables in scope:
  - args: String[] (length: 0)
  - a: int = 10
  - b: int = 20
  - sum: int = 30
  
Ready to step through code...`;
        
        debugText.textContent = debugOutput;
        this.switchOutputTab('debug');
        
        this.updateStatus('Debugger ready', 'ready');
    }
    
    formatCode() {
        const code = this.editor.getValue();
        
        // Simple formatting simulation
        const formatted = code
            .replace(/\{\s*\n/g, ' {\n')
            .replace(/\s*\n\s*\}/g, '\n}')
            .replace(/\s{2,}/g, '    ')
            .replace(/\)\s*\{/g, ') {')
            .replace(/\s*\{\s*/g, ' { ')
            .replace(/\s*\}\s*/g, ' } ')
            .replace(/\s*;\s*/g, '; ')
            .replace(/\s*,\s*/g, ', ')
            .trim();
        
        this.editor.setValue(formatted);
        this.updateStatus('Code formatted', 'success');
    }
    
    toggleTheme() {
        const container = document.querySelector('.ide-container');
        const themeToggle = document.getElementById('themeToggle');
        const icon = themeToggle.querySelector('i');
        
        if (container.dataset.theme === 'dark') {
            container.dataset.theme = 'light';
            this.theme = 'vs';
            icon.className = 'fas fa-sun';
            themeToggle.title = 'Switch to Dark Theme';
        } else {
            container.dataset.theme = 'dark';
            this.theme = 'vs-dark';
            icon.className = 'fas fa-moon';
            themeToggle.title = 'Switch to Light Theme';
        }
        
        this.updateEditorTheme();
        this.updateStatus('Theme changed', 'info');
    }
    
    updateEditorTheme() {
        monaco.editor.setTheme(this.theme);
    }
    
    clearOutput() {
        document.getElementById('outputText').textContent = 'Output cleared. Ready for new output.';
        this.updateStatus('Output cleared', 'info');
    }
    
    clearTerminal() {
        document.getElementById('terminalText').textContent = '$ ';
        this.updateStatus('Terminal cleared', 'info');
    }
    
    clearDebug() {
        document.getElementById('debugText').textContent = 'Debug console cleared. Ready for debugging.';
        this.updateStatus('Debug console cleared', 'info');
    }
    
    clearProblems() {
        const problemsList = document.getElementById('problemsList');
        problemsList.innerHTML = '<li class="problem-info"><i class="fas fa-info-circle"></i> No problems detected</li>';
        this.updateStatus('Problems cleared', 'info');
    }
    
    copyOutput() {
        const outputText = document.getElementById('outputText').textContent;
        navigator.clipboard.writeText(outputText).then(() => {
            this.updateStatus('Output copied to clipboard', 'success');
        });
    }
    
    copyTerminal() {
        const terminalText = document.getElementById('terminalText').textContent;
        navigator.clipboard.writeText(terminalText).then(() => {
            this.updateStatus('Terminal output copied to clipboard', 'success');
        });
    }
    
    copyDebug() {
        const debugText = document.getElementById('debugText').textContent;
        navigator.clipboard.writeText(debugText).then(() => {
            this.updateStatus('Debug output copied to clipboard', 'success');
        });
    }
    
    switchOutputTab(tabName) {
        // Update tabs
        document.querySelectorAll('.output-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active');
            }
        });
        
        // Update panes
        document.querySelectorAll('.output-pane').forEach(pane => {
            pane.classList.remove('active');
            if (pane.id === `${tabName}Pane`) {
                pane.classList.add('active');
            }
        });
    }
    
    openSettings() {
        document.getElementById('settingsModal').style.display = 'flex';
    }
    
    closeSettings() {
        document.getElementById('settingsModal').style.display = 'none';
    }
    
    saveSettings() {
        // Save settings to localStorage
        localStorage.setItem('javaIDE_theme', this.theme);
        localStorage.setItem('javaIDE_version', this.javaVersion);
        localStorage.setItem('javaIDE_fontSize', document.getElementById('fontSize').value);
        localStorage.setItem('javaIDE_autoSave', document.getElementById('autoSave').checked);
        localStorage.setItem('javaIDE_lineNumbers', document.getElementById('lineNumbers').checked);
        localStorage.setItem('javaIDE_wordWrap', document.getElementById('wordWrap').checked);
        
        this.closeSettings();
        this.updateStatus('Settings saved', 'success');
    }
    
    toggleFullscreen() {
        const elem = document.documentElement;
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        const icon = fullscreenBtn.querySelector('i');
        
        if (!document.fullscreenElement) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
                icon.className = 'fas fa-compress';
                fullscreenBtn.title = 'Exit Fullscreen';
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                icon.className = 'fas fa-expand';
                fullscreenBtn.title = 'Fullscreen';
            }
        }
    }
    
    updateStatus(message, type = 'info') {
        const indicator = document.getElementById('statusIndicator');
        indicator.innerHTML = `<i class="fas fa-circle status-${type}"></i> ${message}`;
        
        // Clear status after 3 seconds if not running/compiling
        if (!this.isRunning && !this.isCompiling && type !== 'running' && type !== 'compiling') {
            setTimeout(() => {
                if (!this.isRunning && !this.isCompiling) {
                    indicator.innerHTML = '<i class="fas fa-circle status-ready"></i> Ready';
                }
            }, 3000);
        }
    }
    
    updateFileSize() {
        const content = this.editor.getValue();
        const size = new Blob([content]).size;
        document.getElementById('fileSize').innerHTML = `<i class="fas fa-database"></i> ${size} bytes`;
    }
    
    updateLineCount() {
        const lineCount = this.editor.getModel().getLineCount();
        document.getElementById('lineCount').innerHTML = `<i class="fas fa-bars"></i> ${lineCount} lines`;
        document.getElementById('lineCount2').textContent = `${lineCount} lines`;
        
        // Update last saved
        const now = new Date();
        document.getElementById('lastSaved').textContent = 
            `Last saved: ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
            
        // Update memory usage
        const memory = Math.floor(Math.random() * 50) + 20 + lineCount;
        document.getElementById('memoryUsage').textContent = `${memory} MB`;
    }
    
    saveCurrentFile() {
        this.files[this.currentFile] = this.editor.getValue();
        this.updateStatus('Auto-saved', 'success');
        this.updateFileSize();
    }
    
    simulateJavaOutput(code) {
        // Simple simulation of Java output
        let output = `Java ${this.javaVersion} Output:\n`;
        output += "=".repeat(40) + "\n\n";
        
        if (code.includes('Hello, Java!')) {
            output += "Hello, Java!\n";
            output += "Welcome to Java IDE\n";
        }
        
        if (code.includes('Sum:')) {
            output += "Sum: 30\n";
        }
        
        if (code.includes('Count:')) {
            for (let i = 1; i <= 5; i++) {
                output += `Count: ${i}\n`;
            }
        }
        
        if (code.includes('Hello, World!')) {
            output += "Hello, World!\n";
            output += "This is a simple Java program.\n";
        }
        
        output += `\nProgram executed successfully (Java ${this.javaVersion})`;
        output += "\n" + "=".repeat(40);
        return output;
    }
    
    checkJavaErrors(code) {
        const errors = [];
        
        // Check for missing main method
        if (!code.includes('public static void main')) {
            errors.push('Error: Main method not found in class');
        }
        
        // Check for missing semicolons (basic check)
        const lines = code.split('\n');
        lines.forEach((line, index) => {
            const trimmed = line.trim();
            if (trimmed.length > 0 && 
                !trimmed.startsWith('//') && 
                !trimmed.startsWith('*') && 
                !trimmed.startsWith('/*') &&
                !trimmed.endsWith('{') &&
                !trimmed.endsWith('}') &&
                !trimmed.includes('class ') &&
                !trimmed.includes('import ') &&
                !trimmed.includes('package ') &&
                !trimmed.endsWith(';') &&
                !trimmed.endsWith('*/') &&
                !trimmed.startsWith('@') &&
                !trimmed.includes(' if(') &&
                !trimmed.includes(' for(') &&
                !trimmed.includes(' while(') &&
                !trimmed.includes(' try{') &&
                !trimmed.includes(' catch(')) {
                errors.push(`Line ${index + 1}: Missing semicolon?`);
            }
        });
        
        // Check for unclosed brackets
        const openBrackets = (code.match(/\{/g) || []).length;
        const closeBrackets = (code.match(/\}/g) || []).length;
        if (openBrackets !== closeBrackets) {
            errors.push('Error: Unmatched curly brackets');
        }
        
        // Check for unclosed parentheses
        const openParen = (code.match(/\(/g) || []).length;
        const closeParen = (code.match(/\)/g) || []).length;
        if (openParen !== closeParen) {
            errors.push('Error: Unmatched parentheses');
        }
        
        return errors;
    }
    
    updateUI() {
        // Load saved settings
        const savedTheme = localStorage.getItem('javaIDE_theme');
        const savedVersion = localStorage.getItem('javaIDE_version');
        const savedFontSize = localStorage.getItem('javaIDE_fontSize');
        const savedAutoSave = localStorage.getItem('javaIDE_autoSave');
        const savedLineNumbers = localStorage.getItem('javaIDE_lineNumbers');
        const savedWordWrap = localStorage.getItem('javaIDE_wordWrap');
        
        if (savedTheme) {
            this.theme = savedTheme;
            document.getElementById('themeSelect').value = savedTheme;
            this.updateEditorTheme();
            
            // Update theme toggle icon
            const themeToggle = document.getElementById('themeToggle');
            const icon = themeToggle.querySelector('i');
            if (savedTheme === 'vs-dark') {
                document.querySelector('.ide-container').dataset.theme = 'dark';
                icon.className = 'fas fa-moon';
                themeToggle.title = 'Switch to Light Theme';
            } else {
                document.querySelector('.ide-container').dataset.theme = 'light';
                icon.className = 'fas fa-sun';
                themeToggle.title = 'Switch to Dark Theme';
            }
        }
        
        if (savedVersion) {
            this.javaVersion = savedVersion;
            document.getElementById('javaVersion').value = savedVersion;
        }
        
        if (savedFontSize) {
            document.getElementById('fontSize').value = savedFontSize;
            document.getElementById('fontSizeValue').textContent = savedFontSize;
            this.editor.updateOptions({ fontSize: parseInt(savedFontSize) });
        }
        
        if (savedAutoSave) {
            document.getElementById('autoSave').checked = savedAutoSave === 'true';
        }
        
        if (savedLineNumbers) {
            document.getElementById('lineNumbers').checked = savedLineNumbers === 'true';
            this.editor.updateOptions({ lineNumbers: savedLineNumbers === 'true' ? 'on' : 'off' });
        }
        
        if (savedWordWrap) {
            document.getElementById('wordWrap').checked = savedWordWrap === 'true';
            this.editor.updateOptions({ wordWrap: savedWordWrap === 'true' ? 'on' : 'off' });
        }
        
        // Initialize memory usage
        const memory = Math.floor(Math.random() * 50) + 20;
        document.getElementById('memoryUsage').textContent = `${memory} MB`;
    }
    
    loadInitialFile() {
        // Set initial values
        this.updateFileSize();
        this.updateLineCount();
        
        // Show folder contents by default
        this.toggleFolder();
    }
}

// Initialize IDE when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.javaIDE = new JavaIDE();
    
    // Make resizable
    if (window.makeResizable) {
        window.makeResizable('.left-sidebar', 'horizontal');
        window.makeResizable('.right-sidebar', 'horizontal');
    }
    
    // Initialize tooltips
    const tooltipElements = document.querySelectorAll('[title]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const title = e.target.getAttribute('title');
            if (title) {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = title;
                document.body.appendChild(tooltip);
                
                const rect = e.target.getBoundingClientRect();
                tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
                tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
                
                e.target._tooltip = tooltip;
            }
        });
        
        element.addEventListener('mouseleave', (e) => {
            if (e.target._tooltip) {
                e.target._tooltip.remove();
                e.target._tooltip = null;
            }
        });
    });
});