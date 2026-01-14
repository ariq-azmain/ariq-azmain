// C++ Programming IDE JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize CodeMirror editor
    const codeEditor = CodeMirror.fromTextArea(document.getElementById('codeEditor'), {
        mode: 'text/x-c++src',
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
    const initialCode = `#include <iostream>

int main() {
    std::cout << "Hello, C++ World!" << std::endl;
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
            description: 'Basic C++ program with console output',
            category: 'basic',
            code: `#include <iostream>

int main() {
    std::cout << "Hello, C++ World!" << std::endl;
    return 0;
}`
        },
        'variables': {
            name: 'Variables and Data Types',
            description: 'Different data types and variables in C++',
            category: 'basic',
            code: `#include <iostream>
#include <string>

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
    
    // Boolean type
    bool isCppFun = true;
    
    // String type
    std::string message = "Hello, C++!";
    
    // Auto type deduction (C++11)
    auto x = 42;        // int
    auto y = 3.14;      // double
    auto z = "C++";     // const char*
    
    // Print variables
    std::cout << "Age: " << age << std::endl;
    std::cout << "Temperature: " << temperature << "°C" << std::endl;
    std::cout << "World Population: " << population << std::endl;
    std::cout << "Pi: " << pi << std::endl;
    std::cout << "Gravity: " << gravity << " m/s²" << std::endl;
    std::cout << "Grade: " << grade << std::endl;
    std::cout << "Is C++ fun? " << (isCppFun ? "Yes!" : "No") << std::endl;
    std::cout << "Message: " << message << std::endl;
    
    return 0;
}`
        },
        'oop': {
            name: 'Object-Oriented Programming',
            description: 'Classes, objects, inheritance, and polymorphism',
            category: 'intermediate',
            code: `#include <iostream>
#include <string>

// Base class
class Animal {
protected:
    std::string name;
    int age;
    
public:
    Animal(const std::string& name, int age) : name(name), age(age) {}
    
    virtual void makeSound() {
        std::cout << "Animal makes a sound" << std::endl;
    }
    
    void displayInfo() {
        std::cout << "Name: " << name << ", Age: " << age << std::endl;
    }
    
    virtual ~Animal() = default;
};

// Derived class
class Dog : public Animal {
private:
    std::string breed;
    
public:
    Dog(const std::string& name, int age, const std::string& breed) 
        : Animal(name, age), breed(breed) {}
    
    void makeSound() override {
        std::cout << "Woof! Woof!" << std::endl;
    }
    
    void displayBreed() {
        std::cout << "Breed: " << breed << std::endl;
    }
};

// Another derived class
class Cat : public Animal {
public:
    Cat(const std::string& name, int age) : Animal(name, age) {}
    
    void makeSound() override {
        std::cout << "Meow!" << std::endl;
    }
};

int main() {
    // Create objects
    Dog myDog("Buddy", 3, "Golden Retriever");
    Cat myCat("Whiskers", 2);
    
    // Using polymorphism
    Animal* animals[2] = {&myDog, &myCat};
    
    std::cout << "=== Animal Information ===" << std::endl;
    for (int i = 0; i < 2; i++) {
        animals[i]->displayInfo();
        animals[i]->makeSound();
        std::cout << std::endl;
    }
    
    // Direct object usage
    std::cout << "=== Dog Details ===" << std::endl;
    myDog.displayInfo();
    myDog.displayBreed();
    myDog.makeSound();
    
    return 0;
}`
        },
        'stl': {
            name: 'STL Containers',
            description: 'Standard Template Library containers and algorithms',
            category: 'intermediate',
            code: `#include <iostream>
#include <vector>
#include <list>
#include <map>
#include <set>
#include <algorithm>
#include <string>

int main() {
    // Vector (dynamic array)
    std::vector<int> numbers = {5, 2, 8, 1, 9};
    std::cout << "Vector elements: ";
    for (int num : numbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    // Sort the vector
    std::sort(numbers.begin(), numbers.end());
    std::cout << "Sorted vector: ";
    for (int num : numbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    // List (doubly linked list)
    std::list<std::string> names = {"Alice", "Bob", "Charlie"};
    names.push_back("Diana");
    names.push_front("Eve");
    
    std::cout << "\\nList elements: ";
    for (const auto& name : names) {
        std::cout << name << " ";
    }
    std::cout << std::endl;
    
    // Map (key-value pairs)
    std::map<std::string, int> ages;
    ages["Alice"] = 25;
    ages["Bob"] = 30;
    ages["Charlie"] = 35;
    
    std::cout << "\\nMap contents:" << std::endl;
    for (const auto& pair : ages) {
        std::cout << pair.first << ": " << pair.second << " years" << std::endl;
    }
    
    // Set (unique elements)
    std::set<int> uniqueNumbers = {1, 2, 3, 2, 1, 4, 5, 3};
    std::cout << "\\nSet elements (unique): ";
    for (int num : uniqueNumbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    // Using algorithms
    auto it = std::find(numbers.begin(), numbers.end(), 8);
    if (it != numbers.end()) {
        std::cout << "\\nFound number 8 in vector" << std::endl;
    }
    
    // Count elements
    int count = std::count(numbers.begin(), numbers.end(), 2);
    std::cout << "Number 2 appears " << count << " times in vector" << std::endl;
    
    return 0;
}`
        },
        'templates': {
            name: 'Function and Class Templates',
            description: 'Generic programming with templates',
            category: 'advanced',
            code: `#include <iostream>
#include <string>

// Function template
template <typename T>
T maximum(T a, T b) {
    return (a > b) ? a : b;
}

// Class template
template <typename T>
class Calculator {
private:
    T value1;
    T value2;
    
public:
    Calculator(T v1, T v2) : value1(v1), value2(v2) {}
    
    T add() {
        return value1 + value2;
    }
    
    T subtract() {
        return value1 - value2;
    }
    
    T multiply() {
        return value1 * value2;
    }
    
    T divide() {
        if (value2 != 0) {
            return value1 / value2;
        }
        return 0;
    }
};

// Template specialization for strings
template <>
class Calculator<std::string> {
private:
    std::string value1;
    std::string value2;
    
public:
    Calculator(std::string v1, std::string v2) : value1(v1), value2(v2) {}
    
    std::string concatenate() {
        return value1 + value2;
    }
    
    std::string add() {
        return concatenate();
    }
};

int main() {
    std::cout << "=== Function Templates ===" << std::endl;
    std::cout << "Maximum of 5 and 10: " << maximum(5, 10) << std::endl;
    std::cout << "Maximum of 3.14 and 2.71: " << maximum(3.14, 2.71) << std::endl;
    std::cout << "Maximum of 'A' and 'B': " << maximum('A', 'B') << std::endl;
    
    std::cout << "\\n=== Class Templates ===" << std::endl;
    
    // Integer calculator
    Calculator<int> intCalc(20, 5);
    std::cout << "Integer Calculator (20, 5):" << std::endl;
    std::cout << "Add: " << intCalc.add() << std::endl;
    std::cout << "Subtract: " << intCalc.subtract() << std::endl;
    std::cout << "Multiply: " << intCalc.multiply() << std::endl;
    std::cout << "Divide: " << intCalc.divide() << std::endl;
    
    // Double calculator
    Calculator<double> doubleCalc(10.5, 2.5);
    std::cout << "\\nDouble Calculator (10.5, 2.5):" << std::endl;
    std::cout << "Add: " << doubleCalc.add() << std::endl;
    std::cout << "Subtract: " << doubleCalc.subtract() << std::endl;
    
    // String calculator (specialized)
    Calculator<std::string> stringCalc("Hello, ", "C++!");
    std::cout << "\\nString Calculator:" << std::endl;
    std::cout << "Concatenate: " << stringCalc.concatenate() << std::endl;
    
    return 0;
}`
        },
        'smart-pointers': {
            name: 'Smart Pointers',
            description: 'RAII with unique_ptr, shared_ptr, and weak_ptr',
            category: 'advanced',
            code: `#include <iostream>
#include <memory>
#include <vector>

class Resource {
private:
    std::string name;
    
public:
    Resource(const std::string& name) : name(name) {
        std::cout << "Resource '" << name << "' created" << std::endl;
    }
    
    ~Resource() {
        std::cout << "Resource '" << name << "' destroyed" << std::endl;
    }
    
    void use() {
        std::cout << "Using resource: " << name << std::endl;
    }
    
    std::string getName() const {
        return name;
    }
};

int main() {
    std::cout << "=== Smart Pointers in C++ ===" << std::endl;
    
    // Unique pointer (exclusive ownership)
    std::cout << "\\n1. Unique Pointer:" << std::endl;
    {
        std::unique_ptr<Resource> uniquePtr = std::make_unique<Resource>("Unique Resource");
        uniquePtr->use();
        
        // Transfer ownership
        std::unique_ptr<Resource> anotherPtr = std::move(uniquePtr);
        if (!uniquePtr) {
            std::cout << "uniquePtr is now empty (ownership transferred)" << std::endl;
        }
        anotherPtr->use();
    } // Resource automatically destroyed here
    
    // Shared pointer (shared ownership)
    std::cout << "\\n2. Shared Pointer:" << std::endl;
    {
        std::shared_ptr<Resource> sharedPtr1 = std::make_shared<Resource>("Shared Resource");
        std::shared_ptr<Resource> sharedPtr2 = sharedPtr1; // Share ownership
        
        std::cout << "Use count: " << sharedPtr1.use_count() << std::endl;
        sharedPtr1->use();
        sharedPtr2->use();
        
        // Reset one shared pointer
        sharedPtr1.reset();
        std::cout << "After reset - Use count: " << sharedPtr2.use_count() << std::endl;
        sharedPtr2->use();
    } // Resource destroyed when last shared_ptr is destroyed
    
    // Weak pointer (non-owning reference)
    std::cout << "\\n3. Weak Pointer:" << std::endl;
    {
        std::shared_ptr<Resource> sharedPtr = std::make_shared<Resource>("Resource for Weak Ptr");
        std::weak_ptr<Resource> weakPtr = sharedPtr;
        
        // Check if resource still exists
        if (auto lockedPtr = weakPtr.lock()) {
            std::cout << "Resource is alive: " << lockedPtr->getName() << std::endl;
            std::cout << "Use count: " << sharedPtr.use_count() << std::endl;
        }
        
        // Reset shared pointer
        sharedPtr.reset();
        
        // Check again
        if (weakPtr.expired()) {
            std::cout << "Resource has been destroyed" << std::endl;
        }
    }
    
    // Vector of smart pointers
    std::cout << "\\n4. Vector of Smart Pointers:" << std::endl;
    {
        std::vector<std::unique_ptr<Resource>> resources;
        
        resources.push_back(std::make_unique<Resource>("Resource 1"));
        resources.push_back(std::make_unique<Resource>("Resource 2"));
        resources.push_back(std::make_unique<Resource>("Resource 3"));
        
        for (const auto& resource : resources) {
            resource->use();
        }
    } // All resources automatically destroyed
    
    return 0;
}`
        },
        'lambda': {
            name: 'Lambda Expressions',
            description: 'Anonymous functions and functional programming',
            category: 'intermediate',
            code: `#include <iostream>
#include <vector>
#include <algorithm>
#include <functional>

int main() {
    std::cout << "=== Lambda Expressions in C++ ===" << std::endl;
    
    // Basic lambda
    std::cout << "\\n1. Basic Lambda:" << std::endl;
    auto greet = []() {
        std::cout << "Hello from lambda!" << std::endl;
    };
    greet();
    
    // Lambda with parameters
    std::cout << "\\n2. Lambda with Parameters:" << std::endl;
    auto add = [](int a, int b) {
        return a + b;
    };
    std::cout << "5 + 3 = " << add(5, 3) << std::endl;
    
    // Lambda with capture by value
    std::cout << "\\n3. Capture by Value:" << std::endl;
    int multiplier = 5;
    auto times = [multiplier](int x) {
        return x * multiplier;
    };
    std::cout << "10 * " << multiplier << " = " << times(10) << std::endl;
    
    // Lambda with capture by reference
    std::cout << "\\n4. Capture by Reference:" << std::endl;
    int counter = 0;
    auto increment = [&counter]() {
        counter++;
    };
    for (int i = 0; i < 5; i++) {
        increment();
    }
    std::cout << "Counter: " << counter << std::endl;
    
    // Using lambda with STL algorithms
    std::cout << "\\n5. Lambda with STL Algorithms:" << std::endl;
    std::vector<int> numbers = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    
    // Filter even numbers
    std::cout << "Even numbers: ";
    std::for_each(numbers.begin(), numbers.end(), [](int n) {
        if (n % 2 == 0) {
            std::cout << n << " ";
        }
    });
    std::cout << std::endl;
    
    // Square all numbers
    std::cout << "Squared numbers: ";
    std::for_each(numbers.begin(), numbers.end(), [](int n) {
        std::cout << n * n << " ";
    });
    std::cout << std::endl;
    
    // Find numbers greater than 5
    auto it = std::find_if(numbers.begin(), numbers.end(), [](int n) {
        return n > 5;
    });
    if (it != numbers.end()) {
        std::cout << "First number > 5: " << *it << std::endl;
    }
    
    // Sort with custom comparator
    std::vector<std::string> words = {"apple", "banana", "cherry", "date", "elderberry"};
    std::sort(words.begin(), words.end(), [](const std::string& a, const std::string& b) {
        return a.length() < b.length();
    });
    
    std::cout << "Words sorted by length: ";
    for (const auto& word : words) {
        std::cout << word << " ";
    }
    std::cout << std::endl;
    
    // Mutable lambda (can modify captured variables)
    std::cout << "\\n6. Mutable Lambda:" << std::endl;
    auto sequence = [n = 0]() mutable {
        return ++n;
    };
    std::cout << "Sequence: ";
    for (int i = 0; i < 5; i++) {
        std::cout << sequence() << " ";
    }
    std::cout << std::endl;
    
    return 0;
}`
        }
    };
    
    // Store examples globally
    window.cppExamples = examples;
    
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
    
    Object.entries(window.cppExamples).forEach(([key, example]) => {
        const card = document.createElement('div');
        card.className = 'example-card';
        card.dataset.key = key;
        card.innerHTML = `
            <h4>${example.name}</h4>
            <p>${example.description}</p>
            <span class="example-language">C++ - ${example.category}</span>
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
    status.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Compiling and running C++ code...';
    output.appendChild(status);
    
    // Update editor status
    const editorStatus = document.querySelector('.editor-status span');
    const statusIcon = document.querySelector('.status-ready');
    if (editorStatus && statusIcon) {
        editorStatus.textContent = 'Running...';
        statusIcon.style.color = '#f59e0b';
        statusIcon.classList.add('fa-spin');
    }
    
    // Disable run button
    const runBtn = document.getElementById('runBtn');
    const originalText = runBtn.innerHTML;
    runBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running...';
    runBtn.disabled = true;
    
    try {
        // Check if compilerAPI is available
        if (!window.compilerAPI) {
            throw new Error('Compiler API is not initialized');
        }
        
        // Use compiler API
        const result = await window.compilerAPI.execute('cpp', code, input);
        
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
                    ${result.simulated ? `<span class="simulated-badge">Simulated</span>` : ''}
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
            statusIcon.classList.remove('fa-spin');
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
                <span>Error</span>
            </div>
            <pre class="error-content">${escapeHtml(error.message)}</pre>
            <div class="error-help">
                <p><i class="fas fa-info-circle"></i> Try using simulated execution or check your internet connection</p>
            </div>
        `;
        
        output.appendChild(errorDiv);
        output.scrollTop = output.scrollHeight;
        
        // Update editor status
        const editorStatus = document.querySelector('.editor-status span');
        const statusIcon = document.querySelector('.status-ready');
        if (editorStatus && statusIcon) {
            editorStatus.textContent = 'Error';
            statusIcon.style.color = '#ef4444';
            statusIcon.classList.remove('fa-spin');
        }
        
        showNotification('Error: ' + error.message, 'error');
        
    } finally {
        // Re-enable run button
        if (runBtn) {
            runBtn.innerHTML = originalText;
            runBtn.disabled = false;
        }
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
    
    // Simple formatting for C++ code
    const formatted = formatCppCode(code);
    window.codeEditor.setValue(formatted);
    
    showNotification('Code formatted!', 'success');
}

function formatCppCode(code) {
    // Basic C++ code formatting
    let formatted = code
        .replace(/\s*{\s*/g, ' {\n')
        .replace(/\s*}\s*/g, '\n}\n')
        .replace(/;\s*/g, ';\n')
        .replace(/\n\s*\n/g, '\n')
        .replace(/^\s+/gm, '')
        .replace(/#include\s+/g, '#include ')
        .replace(/std::/g, 'std::');
    
    // Add proper indentation
    let indentLevel = 0;
    const lines = formatted.split('\n');
    formatted = lines.map(line => {
        line = line.trim();
        
        // Decrease indent before closing braces
        if (line.startsWith('}') || line === '};') {
            indentLevel--;
        }
        
        const indentedLine = '    '.repeat(Math.max(0, indentLevel)) + line;
        
        // Increase indent after opening braces
        if (line.endsWith('{') || line === '{') {
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
        
        // Process command
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
                    <span>C++ IDE Console Commands</span>
                </div>
                <pre>clear      - Clear console
help       - Show this help
version    - Show IDE version
date       - Show current date
time       - Show current time
examples   - List available examples
about      - About this IDE</pre>
            `;
            output.appendChild(helpDiv);
            output.scrollTop = output.scrollHeight;
            break;
        case 'version':
            const versionDiv = document.createElement('div');
            versionDiv.className = 'console-info';
            versionDiv.textContent = 'C++ IDE v1.0.0 | Powered by Ariq Azmain Lab';
            output.appendChild(versionDiv);
            output.scrollTop = output.scrollHeight;
            break;
        case 'examples':
            const examplesDiv = document.createElement('div');
            examplesDiv.className = 'console-info';
            examplesDiv.innerHTML = `
                <div class="result-header">
                    <i class="fas fa-code"></i>
                    <span>Available C++ Examples</span>
                </div>
                <pre>• hello         - Hello World program
• variables     - Variables and data types
• oop           - Object-oriented programming
• stl           - STL containers and algorithms
• templates     - Function and class templates
• smart-pointers - RAII with smart pointers
• lambda        - Lambda expressions</pre>
            `;
            output.appendChild(examplesDiv);
            output.scrollTop = output.scrollHeight;
            break;
        case 'about':
            const aboutDiv = document.createElement('div');
            aboutDiv.className = 'console-info';
            aboutDiv.innerHTML = `
                <div class="result-header">
                    <i class="fas fa-info-circle"></i>
                    <span>About C++ IDE</span>
                </div>
                <pre>A fully-featured C++ programming environment
with real-time compilation and execution.

Features:
• Syntax highlighting
• Code completion
• Real-time execution
• Debugging tools
• Multiple examples
• Responsive design

Created by Ariq Azmain</pre>
            `;
            output.appendChild(aboutDiv);
            output.scrollTop = output.scrollHeight;
            break;
        default:
            // Try to evaluate as C++ expression
            const exprDiv = document.createElement('div');
            exprDiv.className = 'console-info';
            exprDiv.textContent = `Command not recognized: ${command}`;
            output.appendChild(exprDiv);
            output.scrollTop = output.scrollHeight;
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
    
    showNotification(`Switched to ${tabName} tab`, 'info');
}

// Add new tab
function addNewTab() {
    const tabsContainer = document.querySelector('.panel-tabs');
    const tabCount = document.querySelectorAll('.tab').length;
    const newTabName = `file${tabCount}.cpp`;
    
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
    // Create modal dynamically
    const modalHTML = `
        <div class="modal" id="newFileModalInstance">
            <div class="modal-header">
                <h3>Create New C++ File</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="newFileName">File Name</label>
                    <input type="text" id="newFileName" placeholder="program.cpp" value="main.cpp">
                </div>
                <div class="form-group">
                    <label for="newFileTemplate">Template</label>
                    <select id="newFileTemplate">
                        <option value="empty">Empty File</option>
                        <option value="hello">Hello World</option>
                        <option value="oop">OOP Template</option>
                        <option value="stl">STL Template</option>
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="cancelNewFile">Cancel</button>
                <button class="btn btn-primary" id="createNewFile">Create File</button>
            </div>
        </div>
    `;
    
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = modalHTML;
    document.body.appendChild(modalOverlay);
    
    // Add event listeners
    modalOverlay.querySelector('.close-modal').addEventListener('click', () => {
        modalOverlay.remove();
    });
    
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.remove();
        }
    });
    
    document.getElementById('cancelNewFile').addEventListener('click', () => {
        modalOverlay.remove();
    });
    
    document.getElementById('createNewFile').addEventListener('click', createNewFile);
}

function createNewFile() {
    const fileName = document.getElementById('newFileName').value || 'program.cpp';
    const template = document.getElementById('newFileTemplate').value;
    
    let newCode = '';
    
    switch (template) {
        case 'hello':
            newCode = `#include <iostream>

int main() {
    std::cout << "Hello, C++ World!" << std::endl;
    return 0;
}`;
            break;
        case 'oop':
            newCode = `#include <iostream>
#include <string>

class MyClass {
private:
    std::string name;
    int value;
    
public:
    MyClass(const std::string& n, int v) : name(n), value(v) {}
    
    void display() {
        std::cout << "Name: " << name << ", Value: " << value << std::endl;
    }
};

int main() {
    MyClass obj("Test", 42);
    obj.display();
    return 0;
}`;
            break;
        case 'stl':
            newCode = `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> numbers = {5, 2, 8, 1, 9};
    
    std::cout << "Original: ";
    for (int n : numbers) {
        std::cout << n << " ";
    }
    std::cout << std::endl;
    
    std::sort(numbers.begin(), numbers.end());
    
    std::cout << "Sorted: ";
    for (int n : numbers) {
        std::cout << n << " ";
    }
    std::cout << std::endl;
    
    return 0;
}`;
            break;
        default:
            newCode = '// New C++ file\n';
    }
    
    // Update editor
    window.codeEditor.setValue(newCode);
    
    // Update tab name
    const activeTab = document.querySelector('.tab.active');
    if (activeTab) {
        activeTab.textContent = fileName;
        activeTab.dataset.tab = fileName;
    }
    
    // Close modal
    document.querySelector('.modal-overlay').remove();
    showNotification(`Created new file: ${fileName}`, 'success');
}

// Save file
function saveFile() {
    const currentTab = document.querySelector('.tab.active');
    const fileName = currentTab ? currentTab.dataset.tab : 'program.cpp';
    const code = window.codeEditor.getValue();
    
    const blob = new Blob([code], { type: 'text/x-c++' });
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
    const fileName = prompt('Enter file name:', 'program.cpp');
    if (fileName) {
        const code = window.codeEditor.getValue();
        const blob = new Blob([code], { type: 'text/x-c++' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        showNotification(`File downloaded as ${fileName}`, 'success');
        
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
    input.accept = '.cpp,.cc,.cxx,.h,.hpp,.txt';
    
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
    const blob = new Blob([code], { type: 'text/x-c++' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.cpp';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
    showNotification('Code exported as export.cpp', 'success');
}

// Show example modal
function showExampleModal(exampleKey) {
    const example = window.cppExamples[exampleKey];
    if (!example) return;
    
    // Create modal dynamically
    const modalHTML = `
        <div class="modal modal-lg" id="exampleModalInstance">
            <div class="modal-header">
                <h3>Load Example Code</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="example-preview">
                    <div class="preview-header">
                        <div class="preview-title">
                            <div class="lang-icon cpp small">C++</div>
                            <h4>${escapeHtml(example.name)}</h4>
                        </div>
                        <div class="preview-actions">
                            <button class="btn btn-sm" id="modalCopyExampleBtn">
                                <i class="fas fa-copy"></i> Copy
                            </button>
                        </div>
                    </div>
                    <div class="preview-content">
                        <pre id="modalExampleCode">${escapeHtml(example.code)}</pre>
                    </div>
                    <div class="preview-description">
                        <p>${escapeHtml(example.description)}</p>
                        <p><strong>Category:</strong> ${example.category}</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="modalCancelLoad">Cancel</button>
                <button class="btn btn-primary" id="modalConfirmLoad">Load into Editor</button>
            </div>
        </div>
    `;
    
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = modalHTML;
    modalOverlay.dataset.exampleKey = exampleKey;
    document.body.appendChild(modalOverlay);
    
    // Add event listeners
    modalOverlay.querySelector('.close-modal').addEventListener('click', () => {
        modalOverlay.remove();
    });
    
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.remove();
        }
    });
    
    modalOverlay.querySelector('#modalCancelLoad').addEventListener('click', () => {
        modalOverlay.remove();
    });
    
    modalOverlay.querySelector('#modalConfirmLoad').addEventListener('click', () => {
        loadExample(modalOverlay.dataset.exampleKey);
        modalOverlay.remove();
    });
    
    modalOverlay.querySelector('#modalCopyExampleBtn').addEventListener('click', () => {
        const code = example.code;
        navigator.clipboard.writeText(code).then(() => {
            showNotification('Example code copied to clipboard!', 'success');
        }).catch(err => {
            showNotification('Failed to copy code: ' + err.message, 'error');
        });
    });
}

// Load example
function loadExample(exampleKey) {
    const example = window.cppExamples[exampleKey];
    if (example) {
        window.codeEditor.setValue(example.code);
        showNotification(`Loaded example: ${example.name}`, 'success');
    }
}

// Show notification
function showNotification(message, type = 'success') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${icons[type] || 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Add animation styles
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 10000;
                animation: slideInRight 0.3s ease;
                backdrop-filter: blur(10px);
                max-width: 350px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .notification.success {
                background: rgba(16, 185, 129, 0.9);
                color: white;
                border-left: 4px solid #059669;
            }
            
            .notification.error {
                background: rgba(239, 68, 68, 0.9);
                color: white;
                border-left: 4px solid #dc2626;
            }
            
            .notification.warning {
                background: rgba(245, 158, 11, 0.9);
                color: white;
                border-left: 4px solid #d97706;
            }
            
            .notification.info {
                background: rgba(59, 130, 246, 0.9);
                color: white;
                border-left: 4px solid #2563eb;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
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
        `;
        document.head.appendChild(style);
    }
    
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