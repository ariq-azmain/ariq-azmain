// C Programming IDE JavaScript - Fixed Version
document.addEventListener("DOMContentLoaded", function () {
    // Initialize CodeMirror editor
    const codeEditor = CodeMirror.fromTextArea(
        document.getElementById("codeEditor"),
        {
            mode: "text/x-csrc",
            theme: "dracula",
            lineNumbers: true,
            lineWrapping: true,
            autoCloseBrackets: true,
            matchBrackets: true,
            indentUnit: 4,
            tabSize: 4,
            indentWithTabs: false,
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            extraKeys: {
                "Ctrl-Enter": runCode,
                "Ctrl-S": saveFile,
                "Ctrl-N": showNewFileModal,
                "Ctrl-O": openFile,
                F11: function (cm) {
                    cm.setOption("fullScreen", !cm.getOption("fullScreen"));
                },
                Esc: function (cm) {
                    if (cm.getOption("fullScreen"))
                        cm.setOption("fullScreen", false);
                },
                "Ctrl-/": function (cm) {
                    cm.toggleComment();
                }
            },
            styleActiveLine: true,
            showCursorWhenSelecting: true
        }
    );

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

    console.log("C IDE Initialized Successfully");
});

// Initialize UI components
function initUI() {
    // Update cursor position
    window.codeEditor.on("cursorActivity", function (cm) {
        const cursor = cm.getCursor();
        const posElement = document.querySelector(".cursor-position");
        if (posElement) {
            posElement.textContent = `Ln ${cursor.line + 1}, Col ${
                cursor.ch + 1
            }`;
        }
    });

    // Update file size on change
    window.codeEditor.on("change", updateFileSize);

    // Initialize theme toggle
    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            const currentTheme = window.codeEditor.getOption("theme");
            const newTheme = currentTheme === "dracula" ? "default" : "dracula";
            window.codeEditor.setOption("theme", newTheme);
            this.innerHTML =
                newTheme === "dracula"
                    ? '<i class="fas fa-sun"></i>'
                    : '<i class="fas fa-moon"></i>';
            showNotification(
                `Switched to ${
                    newTheme === "dracula" ? "Dark" : "Light"
                } theme`,
                "info"
            );
        });
    }

    // Initialize fullscreen button
    const fullscreenBtn = document.getElementById("fullscreenBtn");
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener("click", function () {
            const isFullscreen = window.codeEditor.getOption("fullScreen");
            window.codeEditor.setOption("fullScreen", !isFullscreen);
            this.innerHTML = isFullscreen
                ? '<i class="fas fa-expand"></i>'
                : '<i class="fas fa-compress"></i>';
        });
    }

    // Initialize examples toggle
    const toggleExamplesBtn = document.getElementById("toggleExamplesBtn");
    if (toggleExamplesBtn) {
        toggleExamplesBtn.addEventListener("click", function () {
            const examplesContainer =
                document.getElementById("examplesContainer");
            const ideBottom = document.getElementById("ideBottom");

            if (ideBottom.classList.contains("collapsed")) {
                ideBottom.classList.remove("collapsed");
                examplesContainer.style.display = "grid";
                this.innerHTML = '<i class="fas fa-chevron-down"></i>';
                showNotification("Examples panel expanded", "info");
            } else {
                ideBottom.classList.add("collapsed");
                examplesContainer.style.display = "none";
                this.innerHTML = '<i class="fas fa-chevron-up"></i>';
                showNotification("Examples panel collapsed", "info");
            }
        });
    }
}

function updateFileSize() {
    const content = window.codeEditor.getValue();
    const sizeElement = document.querySelector(".file-size");
    if (sizeElement) {
        const size = new Blob([content]).size;
        sizeElement.textContent = `${size} bytes`;
    }
}

// Initialize examples
function initExamples() {
    const examples = {
        hello: {
            name: "Hello World",
            description: "The classic first program in C language",
            category: "basic",
            code: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`
        },
        variables: {
            name: "Variables and Data Types",
            description: "Demonstrates different data types and variables in C",
            category: "basic",
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
        conditions: {
            name: "If-Else Conditions",
            description: "Demonstrates conditional statements in C",
            category: "basic",
            code: `#include <stdio.h>

int main() {
    int number = 10;
    
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
        loops: {
            name: "For and While Loops",
            description: "Demonstrates different types of loops in C",
            category: "basic",
            code: `#include <stdio.h>

int main() {
    // For loop
    printf("For loop (1 to 5):\\n");
    for (int i = 1; i <= 5; i++) {
        printf("Count: %d\\n", i);
    }
    
    // While loop
    printf("\\nWhile loop (5 to 1):\\n");
    int j = 5;
    while (j > 0) {
        printf("Countdown: %d\\n", j);
        j--;
    }
    
    // Do-while loop
    printf("\\nDo-while loop (1 to 3):\\n");
    int k = 1;
    do {
        printf("Number: %d\\n", k);
        k++;
    } while (k <= 3);
    
    return 0;
}`
        },
        functions: {
            name: "Functions and Recursion",
            description: "Demonstrates function usage and recursion",
            category: "intermediate",
            code: `#include <stdio.h>

// Function declaration
int add(int a, int b);
int factorial(int n);

int main() {
    int x = 10, y = 20;
    
    // Function call
    int sum = add(x, y);
    printf("Sum of %d and %d is: %d\\n", x, y, sum);
    
    // Recursive function
    int num = 5;
    printf("Factorial of %d is: %d\\n", num, factorial(num));
    
    return 0;
}

// Function definition
int add(int a, int b) {
    return a + b;
}

// Recursive function
int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}`
        },
        arrays: {
            name: "Arrays and Strings",
            description: "Demonstrates array and string operations",
            category: "intermediate",
            code: `#include <stdio.h>
#include <string.h>

int main() {
    // Integer array
    int numbers[5] = {10, 20, 30, 40, 50};
    
    printf("Array elements: ");
    for (int i = 0; i < 5; i++) {
        printf("%d ", numbers[i]);
    }
    printf("\\n");
    
    // 2D array
    int matrix[2][3] = {
        {1, 2, 3},
        {4, 5, 6}
    };
    
    printf("\\n2D Array:\\n");
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 3; j++) {
            printf("%d ", matrix[i][j]);
        }
        printf("\\n");
    }
    
    // Strings
    char greeting[] = "Hello, C Programming!";
    char name[50];
    
    printf("\\nString: %s\\n", greeting);
    printf("Length: %lu\\n", strlen(greeting));
    
    // String copy
    strcpy(name, "John Doe");
    printf("Name: %s\\n", name);
    
    return 0;
}`
        }
    };

    // Store examples globally
    window.cExamples = examples;

    // Populate examples container
    populateExamples();

    // Search functionality
    const searchInput = document.getElementById("exampleSearch");
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const searchTerm = this.value.toLowerCase();
            const cards = document.querySelectorAll(".example-card");

            cards.forEach(card => {
                const title = card
                    .querySelector("h4")
                    .textContent.toLowerCase();
                const description = card
                    .querySelector("p")
                    .textContent.toLowerCase();

                if (
                    title.includes(searchTerm) ||
                    description.includes(searchTerm)
                ) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        });
    }

    // Add event listeners to example buttons
    document.querySelectorAll(".example-btn").forEach(button => {
        button.addEventListener("click", function () {
            const exampleKey = this.dataset.example;
            showExampleModal(exampleKey);
        });
    });
}

function populateExamples() {
    const examplesContainer = document.getElementById("examplesContainer");
    if (!examplesContainer) return;

    examplesContainer.innerHTML = "";

    Object.entries(window.cExamples).forEach(([key, example]) => {
        const card = document.createElement("div");
        card.className = "example-card";
        card.dataset.key = key;
        card.innerHTML = `
            <h4>${example.name}</h4>
            <p>${example.description}</p>
            <span class="example-language">C - ${example.category}</span>
        `;
        card.addEventListener("click", () => showExampleModal(key));
        examplesContainer.appendChild(card);
    });
}

// File Manager functionality
function initFileManager() {
    // File menu button
    const fileMenuBtn = document.getElementById("fileMenuBtn");
    const fileDropdown = document.getElementById("fileDropdown");

    if (fileMenuBtn && fileDropdown) {
        fileMenuBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            fileDropdown.classList.toggle("show");
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", function () {
            fileDropdown.classList.remove("show");
        });
    }

    // File operations
    document
        .getElementById("newFileBtn")
        ?.addEventListener("click", showNewFileModal);
    document.getElementById("openFileBtn")?.addEventListener("click", openFile);
    document.getElementById("saveFileBtn")?.addEventListener("click", saveFile);
    document.getElementById("saveAsBtn")?.addEventListener("click", saveFileAs);
    document
        .getElementById("exportCodeBtn")
        ?.addEventListener("click", exportCode);
}

// Initialize event listeners
function initEventListeners() {
    // Run button
    const runBtn = document.getElementById("runBtn");
    if (runBtn) {
        runBtn.addEventListener("click", runCode);
    }

    // Debug button
    const debugBtn = document.getElementById("debugBtn");
    if (debugBtn) {
        debugBtn.addEventListener("click", debugCode);
    }

    // Layout button
    const layoutBtn = document.getElementById("layoutBtn");
    if (layoutBtn) {
        layoutBtn.addEventListener("click", toggleLayout);
    }

    // Clear console button
    const clearConsoleBtn = document.getElementById("clearConsoleBtn");
    if (clearConsoleBtn) {
        clearConsoleBtn.addEventListener("click", clearConsole);
    }

    // Copy output button
    const copyOutputBtn = document.getElementById("copyOutputBtn");
    if (copyOutputBtn) {
        copyOutputBtn.addEventListener("click", copyOutput);
    }

    // Download output button
    const downloadOutputBtn = document.getElementById("downloadOutputBtn");
    if (downloadOutputBtn) {
        downloadOutputBtn.addEventListener("click", downloadOutput);
    }

    // Format button
    const formatBtn = document.getElementById("formatBtn");
    if (formatBtn) {
        formatBtn.addEventListener("click", formatCode);
    }

    // Send input button
    const sendInputBtn = document.getElementById("sendInputBtn");
    if (sendInputBtn) {
        sendInputBtn.addEventListener("click", sendInput);
    }

    // Console input enter key
    const consoleInput = document.getElementById("consoleInput");
    if (consoleInput) {
        consoleInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                sendInput();
            }
        });
    }

    // Add tab button
    const addTabBtn = document.getElementById("addTabBtn");
    if (addTabBtn) {
        addTabBtn.addEventListener("click", addNewTab);
    }

    // Close tab button
    const closeTabBtn = document.getElementById("closeTabBtn");
    if (closeTabBtn) {
        closeTabBtn.addEventListener("click", closeCurrentTab);
    }

    // Tab switching
    document.querySelectorAll(".tab[data-tab]").forEach(tab => {
        tab.addEventListener("click", function () {
            const tabName = this.dataset.tab;
            switchTab(tabName);
        });
    });

    // Modal close buttons
    document.querySelectorAll(".close-modal").forEach(button => {
        button.addEventListener("click", function () {
            this.closest(".modal-overlay").style.display = "none";
        });
    });

    // Modal overlays
    document.querySelectorAll(".modal-overlay").forEach(overlay => {
        overlay.addEventListener("click", function (e) {
            if (e.target === this) {
                this.style.display = "none";
            }
        });
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", function (e) {
        // Ctrl+Enter to run code
        if (e.ctrlKey && e.key === "Enter") {
            e.preventDefault();
            runCode();
        }

        // Ctrl+S to save
        if (e.ctrlKey && e.key === "s") {
            e.preventDefault();
            saveFile();
        }

        // Ctrl+N for new file
        if (e.ctrlKey && e.key === "n") {
            e.preventDefault();
            showNewFileModal();
        }

        // Ctrl+O to open file
        if (e.ctrlKey && e.key === "o") {
            e.preventDefault();
            openFile();
        }

        // Ctrl+F to format
        if (e.ctrlKey && e.key === "f") {
            e.preventDefault();
            formatCode();
        }

        // Escape to close modals
        if (e.key === "Escape") {
            document.querySelectorAll(".modal-overlay").forEach(modal => {
                modal.style.display = "none";
            });
        }
    });
}

// Initialize resizable panels - Fixed Version
function initResizable() {
    const verticalResizer = document.getElementById("verticalResizer");
    const editorPanel = document.getElementById("editorPanel");
    const consolePanel = document.getElementById("consolePanel");
    const ideMain = document.getElementById("ideMain");

    if (!verticalResizer || !editorPanel || !consolePanel) return;

    let isDragging = false;

    verticalResizer.addEventListener("mousedown", startDrag);
    verticalResizer.addEventListener("touchstart", startDrag);

    function startDrag(e) {
        e.preventDefault();
        isDragging = true;
        verticalResizer.classList.add("dragging");

        document.addEventListener("mousemove", doDrag);
        document.addEventListener("touchmove", doDrag);
        document.addEventListener("mouseup", stopDrag);
        document.addEventListener("touchend", stopDrag);
    }

    function doDrag(e) {
        if (!isDragging) return;

        e.preventDefault();
        const containerRect = ideMain.getBoundingClientRect();
        let clientX;

        if (e.type === "touchmove") {
            clientX = e.touches[0].clientX;
        } else {
            clientX = e.clientX;
        }

        // Calculate new widths
        const containerWidth = containerRect.width;
        let editorWidth =
            ((clientX - containerRect.left) / containerWidth) * 100;

        // Apply constraints
        editorWidth = Math.max(20, Math.min(80, editorWidth));
        const consoleWidth = 100 - editorWidth;

        editorPanel.style.width = `${editorWidth}%`;
        consolePanel.style.width = `${consoleWidth}%`;
    }

    function stopDrag() {
        isDragging = false;
        verticalResizer.classList.remove("dragging");

        document.removeEventListener("mousemove", doDrag);
        document.removeEventListener("touchmove", doDrag);
        document.removeEventListener("mouseup", stopDrag);
        document.removeEventListener("touchend", stopDrag);
    }

    // Horizontal resizer for bottom panel
    const horizontalResizer = document.getElementById("horizontalResizer");
    const ideBottom = document.getElementById("ideBottom");

    if (horizontalResizer && ideBottom) {
        let isHorizontalDragging = false;

        horizontalResizer.addEventListener("mousedown", startHorizontalDrag);
        horizontalResizer.addEventListener("touchstart", startHorizontalDrag);

        function startHorizontalDrag(e) {
            e.preventDefault();
            isHorizontalDragging = true;
            horizontalResizer.classList.add("dragging");

            document.addEventListener("mousemove", doHorizontalDrag);
            document.addEventListener("touchmove", doHorizontalDrag);
            document.addEventListener("mouseup", stopHorizontalDrag);
            document.addEventListener("touchend", stopHorizontalDrag);
        }

        function doHorizontalDrag(e) {
            if (!isHorizontalDragging) return;

            e.preventDefault();
            const containerRect = document
                .querySelector(".ide-container")
                .getBoundingClientRect();
            let clientY;

            if (e.type === "touchmove") {
                clientY = e.touches[0].clientY;
            } else {
                clientY = e.clientY;
            }

            const containerHeight = containerRect.height;
            const mainHeight =
                ((clientY - containerRect.top - 70) / containerHeight) * 100;

            // Apply constraints
            const adjustedMainHeight = Math.max(30, Math.min(90, mainHeight));
            const bottomHeight = 100 - adjustedMainHeight;

            ideMain.style.height = `${adjustedMainHeight}%`;
            ideBottom.style.height = `${bottomHeight}%`;
        }

        function stopHorizontalDrag() {
            isHorizontalDragging = false;
            horizontalResizer.classList.remove("dragging");

            document.removeEventListener("mousemove", doHorizontalDrag);
            document.removeEventListener("touchmove", doHorizontalDrag);
            document.removeEventListener("mouseup", stopHorizontalDrag);
            document.removeEventListener("touchend", stopHorizontalDrag);
        }
    }
}

// Run code - Fixed with better output handling
async function runCode() {
    const code = window.codeEditor.getValue();
    const input = document.getElementById("consoleInput")?.value || "";

    // Clear previous output
    clearConsole();

    // Show running status
    const output = document.getElementById("consoleOutput");
    const status = document.createElement("div");
    status.className = "console-status loading";
    status.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Compiling C code...';
    output.appendChild(status);

    // Update editor status
    const editorStatus = document.querySelector(".editor-status span");
    const statusIcon = document.querySelector(".status-ready");
    if (editorStatus && statusIcon) {
        editorStatus.textContent = "Running...";
        statusIcon.style.color = "#f59e0b";
    }

    // Disable run button
    const runBtn = document.getElementById("runBtn");
    const originalHTML = runBtn.innerHTML;
    if (runBtn) {
        runBtn.disabled = true;
        runBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running...';
    }

    try {
        // Use compiler API
        const result = await window.compilerAPI.execute("c", code, input);

        // Remove status
        if (status.parentNode) {
            status.remove();
        }

        // Display result
        displayResult(result);
    } catch (error) {
        console.error("Execution error:", error);

        // Remove status
        if (status.parentNode) {
            status.remove();
        }

        // Display error
        const errorDiv = document.createElement("div");
        errorDiv.className = "console-result error";
        errorDiv.innerHTML = `
            <div class="result-header">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Execution Error</span>
            </div>
            <pre class="output-content">${escapeHtml(error.message)}</pre>
        `;

        output.appendChild(errorDiv);
        output.scrollTop = output.scrollHeight;

        // Update editor status
        if (editorStatus && statusIcon) {
            editorStatus.textContent = "Error";
            statusIcon.style.color = "#ef4444";
        }

        showNotification("Error: " + error.message, "error");
    } finally {
        // Re-enable run button
        if (runBtn) {
            runBtn.disabled = false;
            runBtn.innerHTML = originalHTML;
        }
    }

    function displayResult(result) {
        const resultDiv = document.createElement("div");
        resultDiv.className = `console-result ${
            result.success ? "success" : "error"
        }`;

        if (result.success) {
            resultDiv.innerHTML = `
                <div class="result-header">
                    <i class="fas fa-check-circle"></i>
                    <span>Execution Successful</span>
                    <span class="execution-time">${result.executionTime}</span>
                </div>
                <pre class="output-content">${escapeHtml(result.output)}</pre>
                <div style="margin-top: 10px; color: #94a3b8; font-size: 0.9em;">
                    <i class="fas fa-clock"></i> Completed in ${
                        result.executionTime
                    }
                </div>
            `;
        } else {
            resultDiv.innerHTML = `
                <div class="result-header">
                    <i class="fas fa-times-circle"></i>
                    <span>Execution Failed</span>
                </div>
                <pre class="output-content">${escapeHtml(result.output)}</pre>
            `;
        }

        output.appendChild(resultDiv);
        output.scrollTop = output.scrollHeight;

        // Update editor status
        if (editorStatus && statusIcon) {
            editorStatus.textContent = result.success ? "Ready" : "Error";
            statusIcon.style.color = result.success ? "#10b981" : "#ef4444";
        }

        showNotification(
            result.success
                ? "Code executed successfully!"
                : "Execution failed!",
            result.success ? "success" : "error"
        );
    }
}

// Debug code
function debugCode() {
    const code = window.codeEditor.getValue();

    // Switch to debug tab
    switchTab("debug");

    showNotification(
        "Debugging started. Set breakpoints in the gutter.",
        "info"
    );

    // Simple debug simulation
    const output = document.getElementById("consoleOutput");
    const debugInfo = document.createElement("div");
    debugInfo.className = "console-result info";
    debugInfo.innerHTML = `
        <div class="result-header">
            <i class="fas fa-bug"></i>
            <span>Debug Session Started</span>
        </div>
        <pre class="output-content">Debugger initialized...
Breakpoint set at line 1
Ready for step-by-step execution</pre>
    `;

    output.appendChild(debugInfo);
    output.scrollTop = output.scrollHeight;
}

// Toggle layout
function toggleLayout() {
    const ideMain = document.getElementById("ideMain");
    const currentLayout = ideMain.dataset.layout || "horizontal";
    const layoutBtn = document.getElementById("layoutBtn");

    if (currentLayout === "horizontal") {
        // Switch to vertical
        ideMain.style.flexDirection = "column";
        ideMain.dataset.layout = "vertical";

        // Update resizer
        const verticalResizer = document.getElementById("verticalResizer");
        verticalResizer.style.width = "100%";
        verticalResizer.style.height = "8px";
        verticalResizer.style.cursor = "row-resize";

        layoutBtn.innerHTML = '<i class="fas fa-columns"></i> Horizontal';
        showNotification("Switched to vertical layout", "info");
    } else {
        // Switch to horizontal
        ideMain.style.flexDirection = "row";
        ideMain.dataset.layout = "horizontal";

        // Update resizer
        const verticalResizer = document.getElementById("verticalResizer");
        verticalResizer.style.width = "8px";
        verticalResizer.style.height = "100%";
        verticalResizer.style.cursor = "col-resize";

        layoutBtn.innerHTML = '<i class="fas fa-exchange-alt"></i> Vertical';
        showNotification("Switched to horizontal layout", "info");
    }
}

// Clear console
function clearConsole() {
    const output = document.getElementById("consoleOutput");
    output.innerHTML = "";
    showNotification("Console cleared", "info");
}

// Copy output
function copyOutput() {
    const output = document.getElementById("consoleOutput");
    const text = output.innerText;

    navigator.clipboard
        .writeText(text)
        .then(() => {
            showNotification("Output copied to clipboard!", "success");
        })
        .catch(err => {
            showNotification("Failed to copy output: " + err.message, "error");
        });
}

// Download output
function downloadOutput() {
    const output = document.getElementById("consoleOutput");
    const text = output.innerText;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "output.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
    showNotification("Output downloaded as output.txt", "success");
}

// Format code
function formatCode() {
    const code = window.codeEditor.getValue();

    if (window.cCompiler && window.cCompiler.formatCode) {
        const formatted = window.cCompiler.formatCode(code);
        window.codeEditor.setValue(formatted);
        showNotification("Code formatted!", "success");
    } else {
        // Fallback formatting
        const formatted = formatCCode(code);
        window.codeEditor.setValue(formatted);
        showNotification("Code formatted!", "success");
    }
}

function formatCCode(code) {
    let formatted = code
        .replace(/\s*{\s*/g, " {\n")
        .replace(/\s*}\s*/g, "\n}\n")
        .replace(/;\s*/g, ";\n")
        .replace(/\n\s*\n/g, "\n")
        .replace(/^\s+/gm, "");

    let indentLevel = 0;
    const lines = formatted.split("\n");
    formatted = lines
        .map(line => {
            line = line.trim();

            if (line.startsWith("}") || line === "};") {
                indentLevel = Math.max(0, indentLevel - 1);
            }

            const indentedLine = "    ".repeat(indentLevel) + line;

            if (line.endsWith("{") || line === "{") {
                indentLevel++;
            }

            return indentedLine;
        })
        .join("\n");

    return formatted;
}

// Send input
function sendInput() {
    const input = document.getElementById("consoleInput");
    const value = input.value.trim();

    if (value) {
        const output = document.getElementById("consoleOutput");
        const inputDiv = document.createElement("div");
        inputDiv.className = "console-input-line";
        inputDiv.innerHTML = `<span class="input-prefix"><i class="fas fa-terminal"></i>$</span> ${escapeHtml(
            value
        )}`;
        output.appendChild(inputDiv);
        output.scrollTop = output.scrollHeight;

        // Clear input
        input.value = "";

        // Process command
        processConsoleCommand(value);
    }
}

function processConsoleCommand(command) {
    const output = document.getElementById("consoleOutput");

    switch (command.toLowerCase()) {
        case "clear":
            clearConsole();
            break;
        case "help":
            const helpDiv = document.createElement("div");
            helpDiv.className = "console-help";
            helpDiv.innerHTML = `
                <div class="result-header">
                    <i class="fas fa-question-circle"></i>
                    <span>Available Commands</span>
                </div>
                <pre>clear    - Clear console
help     - Show this help
version  - Show IDE version
examples - List available examples
run      - Run current code
format   - Format current code</pre>
            `;
            output.appendChild(helpDiv);
            output.scrollTop = output.scrollHeight;
            break;
        case "version":
            const versionDiv = document.createElement("div");
            versionDiv.className = "console-info";
            versionDiv.textContent =
                "C IDE v1.0.0 | Built with CodeMirror | By Ariq Azmain";
            output.appendChild(versionDiv);
            output.scrollTop = output.scrollHeight;
            break;
        case "examples":
            const examplesDiv = document.createElement("div");
            examplesDiv.className = "console-info";
            examplesDiv.innerHTML = `
                <div class="result-header">
                    <i class="fas fa-code"></i>
                    <span>Available C Examples</span>
                </div>
                <pre>• hello     - Hello World program
• variables - Variables and data types
• conditions - If-else conditions
• loops     - For, while, do-while loops
• functions - Function examples
• arrays    - Array examples</pre>
            `;
            output.appendChild(examplesDiv);
            output.scrollTop = output.scrollHeight;
            break;
        case "run":
            runCode();
            break;
        case "format":
            formatCode();
            break;
        default:
            const exprDiv = document.createElement("div");
            exprDiv.className = "console-info";
            exprDiv.textContent = `Command: ${command}`;
            output.appendChild(exprDiv);
            output.scrollTop = output.scrollHeight;
    }
}

// Switch tab
function switchTab(tabName) {
    document.querySelectorAll(".tab").forEach(tab => {
        if (tab.dataset.tab === tabName) {
            tab.classList.add("active");
        } else {
            tab.classList.remove("active");
        }
    });

    showNotification(`Switched to ${tabName} tab`, "info");
}

// Add new tab
function addNewTab() {
    const tabsContainer = document.querySelector(".panel-tabs");
    const tabCount = document.querySelectorAll(".tab").length;
    const newTabName = `file${tabCount}.c`;

    const newTab = document.createElement("button");
    newTab.className = "tab";
    newTab.dataset.tab = newTabName;
    newTab.textContent = newTabName;
    newTab.addEventListener("click", function () {
        switchTab(newTabName);
    });

    const tabActions = document.querySelector(".tab-actions");
    tabsContainer.insertBefore(newTab, tabActions);

    switchTab(newTabName);
    showNotification(`Created new tab: ${newTabName}`, "info");
}

// Close current tab
function closeCurrentTab() {
    const activeTab = document.querySelector(".tab.active");
    if (activeTab && document.querySelectorAll(".tab").length > 1) {
        const tabName = activeTab.dataset.tab;
        activeTab.remove();

        const firstTab = document.querySelector(".tab");
        if (firstTab) {
            switchTab(firstTab.dataset.tab);
        }

        showNotification(`Closed tab: ${tabName}`, "info");
    }
}

// Show new file modal
function showNewFileModal() {
    const modalHTML = `
        <div class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <h3>Create New C File</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="fileName">File Name</label>
                        <input type="text" id="fileName" placeholder="program.c" value="main.c">
                    </div>
                    <div class="form-group">
                        <label for="fileTemplate">Template</label>
                        <select id="fileTemplate">
                            <option value="empty">Empty File</option>
                            <option value="hello">Hello World</option>
                            <option value="basic">Basic Structure</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" id="cancelNewFile">Cancel</button>
                    <button class="btn btn-primary" id="createFile">Create File</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const modal = document.querySelector(".modal-overlay:last-child");

    modal.querySelector(".close-modal").addEventListener("click", () => {
        modal.remove();
    });

    modal.querySelector("#cancelNewFile").addEventListener("click", () => {
        modal.remove();
    });

    modal.querySelector("#createFile").addEventListener("click", createNewFile);

    modal.addEventListener("click", function (e) {
        if (e.target === this) {
            this.remove();
        }
    });
}

function createNewFile() {
    const fileName = document.getElementById("fileName").value || "program.c";
    const template = document.getElementById("fileTemplate").value;

    let newCode = "";

    switch (template) {
        case "hello":
            newCode = `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`;
            break;
        case "basic":
            newCode = `#include <stdio.h>

int main() {
    // Your code here
    return 0;
}`;
            break;
        default:
            newCode = "// New C file\n";
    }

    window.codeEditor.setValue(newCode);

    const activeTab = document.querySelector(".tab.active");
    if (activeTab) {
        activeTab.textContent = fileName;
        activeTab.dataset.tab = fileName;
    }

    document.querySelector(".modal-overlay:last-child").remove();
    showNotification(`Created new file: ${fileName}`, "success");
}

// Save file
function saveFile() {
    const currentTab = document.querySelector(".tab.active");
    const fileName = currentTab ? currentTab.dataset.tab : "program.c";
    const code = window.codeEditor.getValue();

    const blob = new Blob([code], { type: "text/x-c" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
    showNotification(`File saved as ${fileName}`, "success");
}

// Save file as
function saveFileAs() {
    const fileName = prompt("Enter file name:", "program.c");
    if (fileName) {
        const code = window.codeEditor.getValue();
        const blob = new Blob([code], { type: "text/x-c" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
        showNotification(`File saved as ${fileName}`, "success");

        const activeTab = document.querySelector(".tab.active");
        if (activeTab) {
            activeTab.textContent = fileName;
            activeTab.dataset.tab = fileName;
        }
    }
}

// Open file
function openFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".c,.h,.txt";

    input.onchange = function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const content = e.target.result;
                window.codeEditor.setValue(content);

                const activeTab = document.querySelector(".tab.active");
                if (activeTab) {
                    activeTab.textContent = file.name;
                    activeTab.dataset.tab = file.name;
                }

                showNotification(`File loaded: ${file.name}`, "success");
            };
            reader.readAsText(file);
        }
    };

    input.click();
}

// Export code
function exportCode() {
    const code = window.codeEditor.getValue();
    const blob = new Blob([code], { type: "text/x-c" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "export.c";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
    showNotification("Code exported as export.c", "success");
}

// Show example modal
function showExampleModal(exampleKey) {
    const example = window.cExamples[exampleKey];
    if (!example) return;

    const modalHTML = `
        <div class="modal-overlay">
            <div class="modal modal-lg">
                <div class="modal-header">
                    <h3>Load Example Code</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="example-preview">
                        <div class="preview-header">
                            <div class="preview-title">
                                <i class="fab fa-c"></i>
                                <h4>${escapeHtml(example.name)}</h4>
                            </div>
                            <div class="preview-actions">
                                <button class="btn btn-sm" id="copyExampleBtn">
                                    <i class="fas fa-copy"></i> Copy
                                </button>
                            </div>
                        </div>
                        <div class="preview-content">
                            <pre>${escapeHtml(example.code)}</pre>
                        </div>
                        <div class="preview-description">
                            <p>${escapeHtml(example.description)}</p>
                            <p><strong>Category:</strong> ${
                                example.category
                            }</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" id="cancelLoad">Cancel</button>
                    <button class="btn btn-primary" id="confirmLoad">Load into Editor</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const modal = document.querySelector(".modal-overlay:last-child");

    modal.querySelector(".close-modal").addEventListener("click", () => {
        modal.remove();
    });

    modal.querySelector("#cancelLoad").addEventListener("click", () => {
        modal.remove();
    });

    modal.querySelector("#copyExampleBtn").addEventListener("click", () => {
        const code = example.code;
        navigator.clipboard
            .writeText(code)
            .then(() => {
                showNotification(
                    "Example code copied to clipboard!",
                    "success"
                );
            })
            .catch(err => {
                showNotification(
                    "Failed to copy code: " + err.message,
                    "error"
                );
            });
    });

    modal.querySelector("#confirmLoad").addEventListener("click", () => {
        window.codeEditor.setValue(example.code);
        modal.remove();
        showNotification(`Loaded example: ${example.name}`, "success");
    });

    modal.addEventListener("click", function (e) {
        if (e.target === this) {
            this.remove();
        }
    });
}

// Show notification
function showNotification(message, type = "success") {
    document.querySelectorAll(".notification").forEach(n => n.remove());

    const icons = {
        success: "check-circle",
        error: "exclamation-circle",
        warning: "exclamation-triangle",
        info: "info-circle"
    };

    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${icons[type] || "info-circle"}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = "slideOutRight 0.3s ease forwards";
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// Add CSS for animations
const style = document.createElement("style");
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
    
    .console-help, .console-info {
        padding: 1rem;
        background: rgba(148, 163, 184, 0.05);
        border-radius: 6px;
        margin-bottom: 0.5rem;
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        color: #94a3b8;
        border-left: 4px solid #3b82f6;
    }
    
    .console-help pre, .console-info pre {
        margin: 0.5rem 0 0 0;
        color: #cbd5e1;
        background: rgba(0, 0, 0, 0.1);
        padding: 0.75rem;
        border-radius: 4px;
        font-size: 11px;
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
`;
document.head.appendChild(style);
