// C Programming IDE JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize CodeMirror editor
    const codeEditor = CodeMirror.fromTextArea(document.getElementById('codeEditor'), {
        mode: 'text/x-csrc',
        theme: 'dracula',
        lineNumbers: true,
        lineWrapping: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: false,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'breakpoints'],
        extraKeys: {
            'Ctrl-Space': 'autocomplete',
            'Ctrl-Enter': runCode,
            'Ctrl-S': saveFile,
            'Ctrl-N': showNewFileModal,
            'Ctrl-O': openFile,
            'F11': function(cm) {
                cm.setOption('fullScreen', !cm.getOption('fullScreen'));
            },
            'Esc': function(cm) {
                if (cm.getOption('fullScreen')) cm.setOption('fullScreen', false);
            },
            'Ctrl-/': function(cm) {
                cm.toggleComment();
            }
        },
        styleActiveLine: true,
        showCursorWhenSelecting: true
    });
    
    // Set initial code
    const initialCode = `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`;
    codeEditor.setValue(initialCode);
    
    // Store editor instance globally
    window.codeEditor = codeEditor;
    
    // Initialize components
    initUI();
    initExamples();
    initEventListeners();
    initFileManager();
    initResizable();
    
    // Update file size
    updateFileSize();
});

// Initialize UI components
function initUI() {
    // Update cursor position
    window.codeEditor.on('cursorActivity', function(cm) {
        const cursor = cm.getCursor();
        const posElement = document.querySelector('.cursor-position');
        if (posElement) {
            posElement.textContent = `Ln ${cursor.line + 1}, Col ${cursor.ch + 1}`;
        }
    });
    
    // Update file size on change
    window.codeEditor.on('change', updateFileSize);
    
    // Initialize theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = window.codeEditor.getOption('theme');
            const newTheme = currentTheme === 'dracula' ? 'default' : 'dracula';
            window.codeEditor.setOption('theme', newTheme);
            this.innerHTML = newTheme === 'dracula' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            showNotification(`Switched to ${newTheme === 'dracula' ? 'Dark' : 'Light'} theme`);
        });
    }
    
    // Initialize fullscreen button
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', function() {
            const isFullscreen = window.codeEditor.getOption('fullScreen');
            window.codeEditor.setOption('fullScreen', !isFullscreen);
            this.innerHTML = isFullscreen ? '<i class="fas fa-expand"></i>' : '<i class="fas fa-compress"></i>';
        });
    }
}

function updateFileSize() {
    const content = window.codeEditor.getValue();
    const sizeElement = document.querySelector('.file-size');
    if (sizeElement) {
        const size = new Blob([content]).size;
        sizeElement.textContent = `${size} bytes`;
    }
}

// Initialize examples
function initExamples() {
    const examples = {
        'hello': {
            name: 'Hello World',
            description: 'The classic first program in C language',
            category: 'basic',
            code: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`
        },
        'variables': {
            name: 'Variables and Data Types',
            description: 'Demonstrates different data types and variables in C',
            category: 'basic',
            code: `#include <stdio.h>

int main() {
    // Integer types
    int age = 25;
    short temperature = -5;
    long population = 7800000000L;
    
    // Floating point types
    float pi = 3.14159f;
    double gravity = 9.80665;
    
    // Character type
    char grade = 'A';
    char message[] = "Hello, C!";
    
    // Print variables
    printf("Age: %d\\n", age);
    printf("Temperature: %d°C\\n", temperature);
    printf("World Population: %ld\\n", population);
    printf("Pi: %.5f\\n", pi);
    printf("Gravity: %lf m/s²\\n", gravity);
    printf("Grade: %c\\n", grade);
    printf("Message: %s\\n", message);
    
    return 0;
}`
        },
        'conditions': {
            name: 'If-Else Conditions',
            description: 'Demonstrates conditional statements in C',
            category: 'basic',
            code: `#include <stdio.h>

int main() {
    int number;
    
    printf("Enter a number: ");
    scanf("%d", &number);
    
    if (number > 0) {
        printf("%d is positive\\n", number);
    } 
    else if (number < 0) {
        printf("%d is negative\\n", number);
    }
    else {
        printf("The number is zero\\n");
    }
    
    // Check even or odd
    if (number % 2 == 0) {
        printf("%d is even\\n", number);
    } else {
        printf("%d is odd\\n", number);
    }
    
    return 0;
}`
        },
        'loops': {
            name: 'Loops (for, while, do-while)',
            description: 'Demonstrates different types of loops in C',
            category: 'basic',
            code: `#include <stdio.h>

int main() {
    int i;
    
    printf("For loop (1 to 5):\\n");
    for (i = 1; i <= 5; i++) {
        printf("%d ", i);
    }
    printf("\\n\\n");
    
    printf("While loop (5 to 1):\\n");
    i = 5;
    while (i >= 1) {
        printf("%d ", i);
        i--;
    }
    printf("\\n\\n");
    
    printf("Do-while loop (1 to 3):\\n");
    i = 1;
    do {
        printf("%d ", i);
        i++;
    } while (i <= 3);
    printf("\\n");
    
    // Nested loops for multiplication table
    printf("\\nMultiplication Table (1-3):\\n");
    for (int row = 1; row <= 3; row++) {
        for (int col = 1; col <= 3; col++) {
            printf("%d\t", row * col);
        }
        printf("\\n");
    }
    
    return 0;
}`
        },
        'arrays': {
            name: 'Arrays',
            description: 'Working with arrays in C programming',
            category: 'intermediate',
            code: `#include <stdio.h>

int main() {
    // Integer array
    int numbers[5] = {10, 20, 30, 40, 50};
    
    // Character array (string)
    char name[] = "C Programming";
    
    // 2D array
    int matrix[2][3] = {
        {1, 2, 3},
        {4, 5, 6}
    };
    
    printf("Array elements:\\n");
    for (int i = 0; i < 5; i++) {
        printf("numbers[%d] = %d\\n", i, numbers[i]);
    }
    
    printf("\\nString: %s\\n", name);
    printf("Length of string: %d\\n", sizeof(name) - 1);
    
    printf("\\n2D Array:\\n");
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 3; j++) {
            printf("%d ", matrix[i][j]);
        }
        printf("\\n");
    }
    
    // Array operations
    int sum = 0;
    for (int i = 0; i < 5; i++) {
        sum += numbers[i];
    }
    printf("\\nSum of array elements: %d\\n", sum);
    printf("Average: %.2f\\n", sum / 5.0);
    
    return 0;
}`
        },
        'functions': {
            name: 'Functions',
            description: 'Creating and using functions in C',
            category: 'intermediate',
            code: `#include <stdio.h>

// Function declarations
int add(int a, int b);
void printMessage();
int factorial(int n);
void swap(int *a, int *b);

int main() {
    printMessage();
    
    int x = 10, y = 20;
    int sum = add(x, y);
    printf("Sum of %d and %d is %d\\n", x, y, sum);
    
    int num = 5;
    printf("Factorial of %d is %d\\n", num, factorial(num));
    
    printf("\\nBefore swap: x = %d, y = %d\\n", x, y);
    swap(&x, &y);
    printf("After swap: x = %d, y = %d\\n", x, y);
    
    return 0;
}

// Function definitions
int add(int a, int b) {
    return a + b;
}

void printMessage() {
    printf("Welcome to C Functions!\\n");
}

int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}`
        },
        'pointers': {
            name: 'Pointers',
            description: 'Understanding pointers in C programming',
            category: 'intermediate',
            code: `#include <stdio.h>

int main() {
    int number = 42;
    int *ptr = &number;
    
    printf("Variable 'number':\\n");
    printf("Value: %d\\n", number);
    printf("Address: %p\\n", (void*)&number);
    
    printf("\\nPointer 'ptr':\\n");
    printf("Value (address stored): %p\\n", (void*)ptr);
    printf("Dereferenced value: %d\\n", *ptr);
    printf("Address of pointer: %p\\n", (void*)&ptr);
    
    // Pointer arithmetic
    int arr[] = {10, 20, 30, 40, 50};
    int *arrPtr = arr;
    
    printf("\\nArray using pointers:\\n");
    for (int i = 0; i < 5; i++) {
        printf("arr[%d] = %d (using pointer: %d)\\n", 
               i, arr[i], *(arrPtr + i));
    }
    
    // Pointer to pointer
    int **ptrToPtr = &ptr;
    printf("\\nPointer to pointer:\\n");
    printf("Value: %p\\n", (void*)ptrToPtr);
    printf("Dereferenced once: %p\\n", (void*)*ptrToPtr);
    printf("Dereferenced twice: %d\\n", **ptrToPtr);
    
    return 0;
}`
        },
        'structures': {
            name: 'Structures',
            description: 'Working with structures in C',
            category: 'intermediate',
            code: `#include <stdio.h>
#include <string.h>

// Structure definition
struct Student {
    char name[50];
    int age;
    float gpa;
    int id;
};

// Function to print student details
void printStudent(struct Student s) {
    printf("Name: %s\\n", s.name);
    printf("Age: %d\\n", s.age);
    printf("GPA: %.2f\\n", s.gpa);
    printf("ID: %d\\n\\n", s.id);
}

int main() {
    // Structure initialization
    struct Student student1 = {"Alice Johnson", 20, 3.8, 1001};
    struct Student student2;
    
    // Assign values to structure members
    strcpy(student2.name, "Bob Smith");
    student2.age = 21;
    student2.gpa = 3.6;
    student2.id = 1002;
    
    // Array of structures
    struct Student students[3] = {
        {"Charlie Brown", 22, 3.9, 1003},
        {"Diana Prince", 19, 3.7, 1004},
        {"Edward Stark", 20, 3.5, 1005}
    };
    
    printf("Individual Students:\\n");
    printStudent(student1);
    printStudent(student2);
    
    printf("Array of Students:\\n");
    for (int i = 0; i < 3; i++) {
        printf("Student %d:\\n", i + 1);
        printStudent(students[i]);
    }
    
    // Structure pointer
    struct Student *ptr = &student1;
    printf("Using structure pointer:\\n");
    printf("Name via pointer: %s\\n", ptr->name);
    printf("Age via pointer: %d\\n", ptr->age);
    
    return 0;
}`
        }
    };
    
    // Store examples globally
    window.cExamples = examples;
    
    // Populate examples container
    populateExamples();
    
    // Search functionality
    const searchInput = document.getElementById('exampleSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const cards = document.querySelectorAll('.example-card');
            
            cards.forEach(card => {
                const title = card.querySelector('h4').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // Add event listeners to example buttons
    document.querySelectorAll('.example-btn').forEach(button => {
        button.addEventListener('click', function() {
            const exampleKey = this.dataset.example;
            showExampleModal(exampleKey);
        });
    });
}

function populateExamples() {
    const examplesContainer = document.getElementById('examplesContainer');
    if (!examplesContainer) return;
    
    examplesContainer.innerHTML = '';
    
    Object.entries(window.cExamples).forEach(([key, example]) => {
        const card = document.createElement('div');
        card.className = 'example-card';
        card.dataset.key = key;
        card.innerHTML = `
            <h4>${example.name}</h4>
            <p>${example.description}</p>
            <span class="example-language">C - ${example.category}</span>
        `;
        card.addEventListener('click', () => showExampleModal(key));
        examplesContainer.appendChild(card);
    });
}

// File Manager functionality
function initFileManager() {
    // File menu button
    const fileMenuBtn = document.getElementById('fileMenuBtn');
    const fileDropdown = document.getElementById('fileDropdown');
    
    if (fileMenuBtn && fileDropdown) {
        fileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            fileDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            fileDropdown.classList.remove('show');
        });
    }
    
    // File operations
    document.getElementById('newFileBtn')?.addEventListener('click', showNewFileModal);
    document.getElementById('openFileBtn')?.addEventListener('click', openFile);
    document.getElementById('saveFileBtn')?.addEventListener('click', saveFile);
    document.getElementById('saveAsBtn')?.addEventListener('click', saveFileAs);
    document.getElementById('exportCodeBtn')?.addEventListener('click', exportCode);
}

// Initialize event listeners
function initEventListeners() {
    // Run button
    const runBtn = document.getElementById('runBtn');
    if (runBtn) {
        runBtn.addEventListener('click', runCode);
    }
    
    // Debug button
    const debugBtn = document.getElementById('debugBtn');
    if (debugBtn) {
        debugBtn.addEventListener('click', debugCode);
    }
    
    // Layout button
    const layoutBtn = document.getElementById('layoutBtn');
    if (layoutBtn) {
        layoutBtn.addEventListener('click', toggleLayout);
    }
    
    // Clear console button
    const clearConsoleBtn = document.getElementById('clearConsoleBtn');
    if (clearConsoleBtn) {
        clearConsoleBtn.addEventListener('click', clearConsole);
    }
    
    // Copy output button
    const copyOutputBtn = document.getElementById('copyOutputBtn');
    if (copyOutputBtn) {
        copyOutputBtn.addEventListener('click', copyOutput);
    }
    
    // Download output button
    const downloadOutputBtn = document.getElementById('downloadOutputBtn');
    if (downloadOutputBtn) {
        downloadOutputBtn.addEventListener('click', downloadOutput);
    }
    
    // Format button
    const formatBtn = document.getElementById('formatBtn');
    if (formatBtn) {
        formatBtn.addEventListener('click', formatCode);
    }
    
    // Send input button
    const sendInputBtn = document.getElementById('sendInputBtn');
    if (sendInputBtn) {
        sendInputBtn.addEventListener('click', sendInput);
    }
    
    // Console input enter key
    const consoleInput = document.getElementById('consoleInput');
    if (consoleInput) {
        consoleInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendInput();
            }
        });
    }
    
    // Add tab button
    const addTabBtn = document.getElementById('addTabBtn');
    if (addTabBtn) {
        addTabBtn.addEventListener('click', addNewTab);
    }
    
    // Close tab button
    const closeTabBtn = document.getElementById('closeTabBtn');
    if (closeTabBtn) {
        closeTabBtn.addEventListener('click', closeCurrentTab);
    }
    
    // Modal close buttons
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal-overlay').style.display = 'none';
        });
    });
    
    // Modal overlays
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
    
    // New file modal
    const cancelNewFile = document.getElementById('cancelNewFile');
    if (cancelNewFile) {
        cancelNewFile.addEventListener('click', function() {
            document.getElementById('newFileModal').style.display = 'none';
        });
    }
    
    const createFile = document.getElementById('createFile');
    if (createFile) {
        createFile.addEventListener('click', createNewFile);
    }
    
    // Save file modal
    const cancelSave = document.getElementById('cancelSave');
    if (cancelSave) {
        cancelSave.addEventListener('click', function() {
            document.getElementById('saveFileModal').style.display = 'none';
        });
    }
    
    const confirmSave = document.getElementById('confirmSave');
    if (confirmSave) {
        confirmSave.addEventListener('click', confirmSaveFile);
    }
    
    // Example modal
    const cancelLoad = document.getElementById('cancelLoad');
    if (cancelLoad) {
        cancelLoad.addEventListener('click', function() {
            document.getElementById('exampleModal').style.display = 'none';
        });
    }
    
    const confirmLoad = document.getElementById('confirmLoad');
    if (confirmLoad) {
        confirmLoad.addEventListener('click', loadSelectedExample);
    }
    
    const copyExampleBtn = document.getElementById('copyExampleBtn');
    if (copyExampleBtn) {
        copyExampleBtn.addEventListener('click', copyExampleCode);
    }
    
    // Tab switching
    document.querySelectorAll('.tab[data-tab]').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            switchTab(tabName);
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+Enter to run code
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            runCode();
        }
        
        // Ctrl+S to save
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveFile();
        }
        
        // Ctrl+N for new file
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            showNewFileModal();
        }
        
        // Ctrl+O to open file
        if (e.ctrlKey && e.key === 'o') {
            e.preventDefault();
            openFile();
        }
        
        // Ctrl+F to format
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            formatCode();
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay').forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });
}

// Initialize resizable panels
function initResizable() {
    // This will be handled by the resizable.js script
    if (typeof window.ResizablePanels !== 'undefined') {
        window.resizablePanels = new window.ResizablePanels();
    }
}

// Run code
async function runCode() {
    const code = window.codeEditor.getValue();
    const input = document.getElementById('consoleInput')?.value || '';
    
    // Clear previous output
    clearConsole();
    
    // Show running status
    const output = document.getElementById('consoleOutput');
    const status = document.createElement('div');
    status.className = 'console-status loading';
    status.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Compiling and running C code...';
    output.appendChild(status);
    
    // Update editor status
    const editorStatus = document.querySelector('.editor-status span');
    const statusIcon = document.querySelector('.status-ready');
    if (editorStatus && statusIcon) {
        editorStatus.textContent = 'Running...';
        statusIcon.style.color = '#f59e0b';
    }
    
    // Disable run button
    const runBtn = document.getElementById('runBtn');
    const originalText = runBtn.innerHTML;
    runBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running...';
    runBtn.disabled = true;
    
    try {
        // Use compiler API
        const result = await window.compilerAPI.execute('c', code, input);
        
        // Remove status
        status.remove();
        
        // Display result
        const resultDiv = document.createElement('div');
        resultDiv.className = `console-result ${result.success ? 'success' : 'error'}`;
        
        if (result.success) {
            resultDiv.innerHTML = `
                <div class="result-header">
                    <i class="fas fa-check-circle success"></i>
                    <span>Execution Successful</span>
                    ${result.executionTime ? `<span class="execution-time">${result.executionTime}</span>` : ''}
                </div>
                <pre class="output-content">${escapeHtml(result.output)}</pre>
            `;
        } else {
            resultDiv.innerHTML = `
                <div class="result-header">
                    <i class="fas fa-times-circle error"></i>
                    <span>Execution Failed</span>
                </div>
                <pre class="error-content">${escapeHtml(result.output)}</pre>
            `;
        }
        
        output.appendChild(resultDiv);
        output.scrollTop = output.scrollHeight;
        
        // Update editor status
        if (editorStatus && statusIcon) {
            editorStatus.textContent = result.success ? 'Ready' : 'Error';
            statusIcon.style.color = result.success ? '#10b981' : '#ef4444';
        }
        
        showNotification(result.success ? 'Code executed successfully!' : 'Execution failed!', 
                        result.success ? 'success' : 'error');
        
    } catch (error) {
        status.remove();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'console-result error';
        errorDiv.innerHTML = `
            <div class="result-header">
                <i class="fas fa-exclamation-triangle error"></i>
                <span>API Error</span>
            </div>
            <pre class="error-content">${escapeHtml(error.message)}</pre>
        `;
        
        output.appendChild(errorDiv);
        output.scrollTop = output.scrollHeight;
        
        // Update editor status
        const editorStatus = document.querySelector('.editor-status span');
        const statusIcon = document.querySelector('.status-ready');
        if (editorStatus && statusIcon) {
            editorStatus.textContent = 'Error';
            statusIcon.style.color = '#ef4444';
        }
        
        showNotification('API Error: ' + error.message, 'error');
        
    } finally {
        // Re-enable run button
        runBtn.innerHTML = originalText;
        runBtn.disabled = false;
    }
}

// Debug code
function debugCode() {
    const code = window.codeEditor.getValue();
    
    // Switch to debug tab
    switchTab('debug');
    
    // Initialize debugger
    if (!window.codeDebugger) {
        window.codeDebugger = new CodeDebugger({
            editor: window.codeEditor,
            output: document.getElementById('consoleOutput')
        });
    }
    
    // Start debugging
    window.codeDebugger.startDebugging(code);
    showNotification('Debugging started. Set breakpoints in the gutter.', 'info');
}

// Toggle layout
function toggleLayout() {
    const ideMain = document.getElementById('ideMain');
    const currentLayout = ideMain.dataset.layout || 'horizontal';
    const layoutBtn = document.getElementById('layoutBtn');
    
    if (currentLayout === 'horizontal') {
        // Switch to vertical
        ideMain.style.flexDirection = 'column';
        ideMain.dataset.layout = 'vertical';
        
        // Update resizer
        const verticalResizer = document.getElementById('verticalResizer');
        verticalResizer.style.width = '100%';
        verticalResizer.style.height = '8px';
        verticalResizer.style.cursor = 'row-resize';
        
        layoutBtn.innerHTML = '<i class="fas fa-columns"></i> Horizontal';
        showNotification('Switched to vertical layout', 'info');
        
    } else {
        // Switch to horizontal
        ideMain.style.flexDirection = 'row';
        ideMain.dataset.layout = 'horizontal';
        
        // Update resizer
        const verticalResizer = document.getElementById('verticalResizer');
        verticalResizer.style.width = '8px';
        verticalResizer.style.height = '100%';
        verticalResizer.style.cursor = 'col-resize';
        
        layoutBtn.innerHTML = '<i class="fas fa-exchange-alt"></i> Vertical';
        showNotification('Switched to horizontal layout', 'info');
    }
}

// Clear console
function clearConsole() {
    const output = document.getElementById('consoleOutput');
    output.innerHTML = '';
    showNotification('Console cleared', 'info');
}

// Copy output
function copyOutput() {
    const output = document.getElementById('consoleOutput');
    const text = output.innerText;
    
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Output copied to clipboard!', 'success');
    }).catch(err => {
        showNotification('Failed to copy output: ' + err.message, 'error');
    });
}

// Download output
function downloadOutput() {
    const output = document.getElementById('consoleOutput');
    const text = output.innerText;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
    showNotification('Output downloaded as output.txt', 'success');
}

// Format code
function formatCode() {
    const code = window.codeEditor.getValue();
    
    // Simple formatting for C code
    const formatted = formatCCode(code);
    window.codeEditor.setValue(formatted);
    
    showNotification('Code formatted!', 'success');
}

function formatCCode(code) {
    // Basic C code formatting
    let formatted = code
        .replace(/\s*{\s*/g, ' {\n')
        .replace(/\s*}\s*/g, '\n}\n')
        .replace(/;\s*/g, ';\n')
        .replace(/\n\s*\n/g, '\n')
        .replace(/^\s+/gm, ''); // Remove leading whitespace
    
    // Add proper indentation
    let indentLevel = 0;
    const lines = formatted.split('\n');
    formatted = lines.map(line => {
        line = line.trim();
        if (line.startsWith('}') || line.startsWith('} else') || line.endsWith('}')) {
            indentLevel--;
        }
        
        const indentedLine = '    '.repeat(Math.max(0, indentLevel)) + line;
        
        if (line.endsWith('{') || line.startsWith('{')) {
            indentLevel++;
        }
        
        return indentedLine;
    }).join('\n');
    
    return formatted;
}

// Send input
function sendInput() {
    const input = document.getElementById('consoleInput');
    const value = input.value.trim();
    
    if (value) {
        const output = document.getElementById('consoleOutput');
        const inputDiv = document.createElement('div');
        inputDiv.className = 'console-input-line';
        inputDiv.innerHTML = `<span class="input-prefix"><i class="fas fa-terminal"></i>$</span> ${escapeHtml(value)}`;
        output.appendChild(inputDiv);
        output.scrollTop = output.scrollHeight;
        
        // Clear input
        input.value = '';
        
        // Process command if it's a console command
        processConsoleCommand(value);
    }
}

function processConsoleCommand(command) {
    const output = document.getElementById('consoleOutput');
    
    switch (command.toLowerCase()) {
        case 'clear':
            clearConsole();
            break;
        case 'help':
            const helpDiv = document.createElement('div');
            helpDiv.className = 'console-help';
            helpDiv.innerHTML = `
                <div class="result-header">
                    <i class="fas fa-question-circle"></i>
                    <span>Available Commands</span>
                </div>
                <pre>clear    - Clear console
help     - Show this help
version  - Show IDE version
date     - Show current date
time     - Show current time</pre>
            `;
            output.appendChild(helpDiv);
            output.scrollTop = output.scrollHeight;
            break;
        case 'version':
            const versionDiv = document.createElement('div');
            versionDiv.className = 'console-info';
            versionDiv.textContent = 'C IDE v1.0.0';
            output.appendChild(versionDiv);
            output.scrollTop = output.scrollHeight;
            break;
        case 'date':
            const dateDiv = document.createElement('div');
            dateDiv.className = 'console-info';
            dateDiv.textContent = new Date().toLocaleDateString();
            output.appendChild(dateDiv);
            output.scrollTop = output.scrollHeight;
            break;
        case 'time':
            const timeDiv = document.createElement('div');
            timeDiv.className = 'console-info';
            timeDiv.textContent = new Date().toLocaleTimeString();
            output.appendChild(timeDiv);
            output.scrollTop = output.scrollHeight;
            break;
    }
}

// Switch tab
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Show corresponding content
    // In a real IDE, this would show different panels
    showNotification(`Switched to ${tabName} tab`, 'info');
}

// Add new tab
function addNewTab() {
    const tabsContainer = document.querySelector('.panel-tabs');
    const tabCount = document.querySelectorAll('.tab').length;
    const newTabName = `file${tabCount}.c`;
    
    const newTab = document.createElement('button');
    newTab.className = 'tab';
    newTab.dataset.tab = newTabName;
    newTab.textContent = newTabName;
    newTab.addEventListener('click', function() {
        switchTab(newTabName);
    });
    
    // Insert before the tab actions
    const tabActions = document.querySelector('.tab-actions');
    tabsContainer.insertBefore(newTab, tabActions);
    
    switchTab(newTabName);
    showNotification(`Created new tab: ${newTabName}`, 'info');
}

// Close current tab
function closeCurrentTab() {
    const activeTab = document.querySelector('.tab.active');
    if (activeTab && document.querySelectorAll('.tab').length > 1) {
        const tabName = activeTab.dataset.tab;
        activeTab.remove();
        
        // Switch to first tab
        const firstTab = document.querySelector('.tab');
        if (firstTab) {
            switchTab(firstTab.dataset.tab);
        }
        
        showNotification(`Closed tab: ${tabName}`, 'info');
    }
}

// Show new file modal
function showNewFileModal() {
    const modal = document.getElementById('newFileModal');
    modal.style.display = 'flex';
}

// Create new file
function createNewFile() {
    const fileName = document.getElementById('fileName').value || 'program.c';
    const template = document.getElementById('fileTemplate').value;
    const location = document.getElementById('fileLocation').value;
    
    let newCode = '';
    
    switch (template) {
        case 'hello':
            newCode = `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`;
            break;
        case 'basic':
            newCode = `#include <stdio.h>
#include <stdlib.h>

// Function prototypes
void displayMenu();
int processChoice(int choice);

int main() {
    printf("Program: ${fileName}\\n");
    
    int choice;
    do {
        displayMenu();
        printf("Enter your choice: ");
        scanf("%d", &choice);
        processChoice(choice);
    } while (choice != 0);
    
    return 0;
}

void displayMenu() {
    printf("\\n=== MENU ===\\n");
    printf("1. Option 1\\n");
    printf("2. Option 2\\n");
    printf("0. Exit\\n");
    printf("=============\\n");
}

int processChoice(int choice) {
    switch(choice) {
        case 1:
            printf("Option 1 selected\\n");
            break;
        case 2:
            printf("Option 2 selected\\n");
            break;
        case 0:
            printf("Exiting...\\n");
            break;
        default:
            printf("Invalid choice\\n");
    }
    return 0;
}`;
            break;
        case 'advanced':
            newCode = `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Structure definitions
typedef struct {
    int id;
    char name[50];
    float score;
} Student;

// Function prototypes
void addStudent(Student *s);
void displayStudent(Student s);
float calculateAverage(Student students[], int count);

int main(int argc, char *argv[]) {
    printf("Advanced C Program\\n");
    printf("==================\\n");
    
    // Dynamic memory allocation
    int *numbers = (int*)malloc(5 * sizeof(int));
    if (numbers == NULL) {
        printf("Memory allocation failed!\\n");
        return 1;
    }
    
    // Initialize array
    for (int i = 0; i < 5; i++) {
        numbers[i] = i * 10;
    }
    
    // Display array
    printf("Array elements: ");
    for (int i = 0; i < 5; i++) {
        printf("%d ", numbers[i]);
    }
    printf("\\n");
    
    // Free memory
    free(numbers);
    
    return 0;
}

void addStudent(Student *s) {
    // Implementation here
}

void displayStudent(Student s) {
    // Implementation here
}

float calculateAverage(Student students[], int count) {
    // Implementation here
    return 0.0;
}`;
            break;
        default:
            newCode = '// New C file\n';
    }
    
    // Update editor
    window.codeEditor.setValue(newCode);
    
    // Update tab name
    const activeTab = document.querySelector('.tab.active');
    if (activeTab) {
        activeTab.textContent = fileName;
        activeTab.dataset.tab = fileName;
    }
    
    // Handle save location
    if (location === 'download') {
        saveFileWithName(fileName);
    } else {
        // Save to browser storage
        try {
            localStorage.setItem(`c_file_${fileName}`, newCode);
            showNotification(`File '${fileName}' saved to browser storage`, 'success');
        } catch (e) {
            showNotification('Failed to save to browser storage', 'error');
        }
    }
    
    // Close modal
    document.getElementById('newFileModal').style.display = 'none';
    showNotification(`Created new file: ${fileName}`, 'success');
}

// Save file
function saveFile() {
    const currentTab = document.querySelector('.tab.active');
    const fileName = currentTab ? currentTab.dataset.tab : 'program.c';
    
    // Show save modal
    const modal = document.getElementById('saveFileModal');
    const fileNameInput = document.getElementById('saveFileName');
    const preview = document.getElementById('savePreview');
    
    fileNameInput.value = fileName;
    preview.textContent = window.codeEditor.getValue().substring(0, 200) + '...';
    
    modal.style.display = 'flex';
}

// Confirm save file
function confirmSaveFile() {
    const fileName = document.getElementById('saveFileName').value || 'program.c';
    const location = document.getElementById('saveLocation').value;
    
    if (location === 'computer') {
        saveFileWithName(fileName);
    } else {
        // Save to browser storage
        try {
            const code = window.codeEditor.getValue();
            localStorage.setItem(`c_file_${fileName}`, code);
            showNotification(`File '${fileName}' saved to browser storage`, 'success');
        } catch (e) {
            showNotification('Failed to save to browser storage: ' + e.message, 'error');
        }
    }
    
    // Update tab name
    const activeTab = document.querySelector('.tab.active');
    if (activeTab) {
        activeTab.textContent = fileName;
        activeTab.dataset.tab = fileName;
    }
    
    // Close modal
    document.getElementById('saveFileModal').style.display = 'none';
}

// Save file with name
function saveFileWithName(fileName) {
    const code = window.codeEditor.getValue();
    const blob = new Blob([code], { type: 'text/x-c' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
    showNotification(`File downloaded as ${fileName}`, 'success');
}

// Save file as
function saveFileAs() {
    const fileName = prompt('Enter file name:', 'program.c');
    if (fileName) {
        saveFileWithName(fileName);
        
        // Update tab name
        const activeTab = document.querySelector('.tab.active');
        if (activeTab) {
            activeTab.textContent = fileName;
            activeTab.dataset.tab = fileName;
        }
    }
}

// Open file
function openFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.c,.h,.txt';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                window.codeEditor.setValue(content);
                
                // Update tab name
                const activeTab = document.querySelector('.tab.active');
                if (activeTab) {
                    activeTab.textContent = file.name;
                    activeTab.dataset.tab = file.name;
                }
                
                showNotification(`File loaded: ${file.name}`, 'success');
            };
            reader.readAsText(file);
        }
    };
    
    input.click();
}

// Export code
function exportCode() {
    const code = window.codeEditor.getValue();
    const blob = new Blob([code], { type: 'text/x-c' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.c';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
    showNotification('Code exported as export.c', 'success');
}

// Show example modal
function showExampleModal(exampleKey) {
    const example = window.cExamples[exampleKey];
    if (!example) return;
    
    const modal = document.getElementById('exampleModal');
    const title = document.getElementById('exampleTitle');
    const code = document.getElementById('exampleCode');
    const description = document.getElementById('exampleDescription');
    
    title.textContent = example.name;
    code.textContent = example.code;
    description.textContent = example.description;
    modal.dataset.exampleKey = exampleKey;
    modal.style.display = 'flex';
}

// Load selected example
function loadSelectedExample() {
    const modal = document.getElementById('exampleModal');
    const exampleKey = modal.dataset.exampleKey;
    
    loadExample(exampleKey);
    modal.style.display = 'none';
}

// Load example
function loadExample(exampleKey) {
    const example = window.cExamples[exampleKey];
    if (example) {
        window.codeEditor.setValue(example.code);
        showNotification(`Loaded example: ${example.name}`, 'success');
    }
}

// Copy example code
function copyExampleCode() {
    const code = document.getElementById('exampleCode').textContent;
    
    navigator.clipboard.writeText(code).then(() => {
        showNotification('Example code copied to clipboard!', 'success');
    }).catch(err => {
        showNotification('Failed to copy code: ' + err.message, 'error');
    });
}

// Show notification
function showNotification(message, type = 'success') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 
                          type === 'error' ? 'exclamation-circle' : 
                          type === 'warning' ? 'exclamation-triangle' : 
                          'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add animation for notification removal
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .console-status {
        padding: 1rem;
        background: rgba(59, 130, 246, 0.1);
        border-radius: 8px;
        margin-bottom: 1rem;
        color: #3b82f6;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .console-result {
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        line-height: 1.5;
    }
    
    .console-result.success {
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.2);
    }
    
    .console-result.error {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.2);
    }
    
    .result-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 0.75rem;
        color: inherit;
        font-weight: 500;
    }
    
    .execution-time {
        margin-left: auto;
        font-size: 0.8rem;
        opacity: 0.8;
        background: rgba(0, 0, 0, 0.1);
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
    }
    
    .output-content,
    .error-content {
        margin: 0;
        white-space: pre-wrap;
        word-break: break-word;
        color: inherit;
    }
    
    .console-input-line {
        padding: 0.75rem;
        background: rgba(148, 163, 184, 0.05);
        border-radius: 6px;
        margin-bottom: 0.5rem;
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        color: #94a3b8;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .console-help,
    .console-info {
        padding: 1rem;
        background: rgba(148, 163, 184, 0.05);
        border-radius: 6px;
        margin-bottom: 0.5rem;
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        color: #94a3b8;
    }
    
    .console-help pre {
        margin: 0.5rem 0 0 0;
        color: #cbd5e1;
    }
`;
document.head.appendChild(style);