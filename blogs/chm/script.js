// script.js - Main JavaScript file for Virtual Lab

// Global variables
let elementsData = [];
let selectedElements = [];
let isModalOpen = false;
let scene, camera, renderer, controls, atoms = [], bonds = [];
let autoRotate = false;

// DOM elements
const elementsGrid = document.getElementById('elementsGrid');
const selectedElementsContainer = document.getElementById('selectedElements');
const compoundFormula = document.getElementById('compoundFormula');
const compoundName = document.getElementById('compoundName');
const periodicTable = document.getElementById('periodicTable');
const elementModal = document.getElementById('elementModal');
const closeModalBtn = document.getElementById('closeModal');
const closeModalBtn2 = document.getElementById('closeModalBtn');
const useInLabBtn = document.getElementById('useInLab');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Load elements data from JSON file
        await loadElementsData();
        
        // Initialize mobile menu - FIXED
        initMobileMenu();
        
        // Initialize counters - FIXED
        initCounters();
        
        // Generate periodic table
        generatePeriodicTable();
        
        // Initialize chemistry lab
        initChemistryLab();
        
        // Initialize 3D model
        init3DModel();
        
        // Initialize modal events
        initModalEvents();
        
        // Initialize chemical background
        initChemicalBackground();
        
        // Initialize smooth scrolling
        initSmoothScrolling();
        
    } catch (error) {
        console.error('Error initializing application:', error);
        showErrorMessage('Failed to load application. Please refresh the page.');
    }
});

// Load elements data from JSON file
async function loadElementsData() {
    try {
        const response = await fetch('elements.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        elementsData = await response.json();
        console.log(`Loaded ${elementsData.length} elements from JSON file`);
        
        // Sort elements by atomic number
        elementsData.sort((a, b) => a.number - b.number);
    } catch (error) {
        console.error('Error loading elements data:', error);
        showErrorMessage('Failed to load elements data. Using default data.');
        elementsData = getDefaultElementsData();
    }
}

// Get default elements data (fallback)
function getDefaultElementsData() {
    return [
        {
            "id": 1,
            "number": 1,
            "symbol": "H",
            "name": "Hydrogen",
            "category": "nonmetal",
            "atomic_mass": 1.008,
            "phase": "Gas",
            "density": "0.08988 g/L",
            "melt": 14.01,
            "boil": 20.28,
            "electronegativity_pauling": 2.20,
            "discovery_year": 1766,
            "electron_configuration": "1s¹",
            "summary": "Hydrogen is the lightest and most abundant chemical element in the universe."
        },
        {
            "id": 2,
            "number": 2,
            "symbol": "He",
            "name": "Helium",
            "category": "noble",
            "atomic_mass": 4.0026,
            "phase": "Gas",
            "density": "0.1786 g/L",
            "melt": 0.95,
            "boil": 4.22,
            "electronegativity_pauling": null,
            "discovery_year": 1868,
            "electron_configuration": "1s²",
            "summary": "Helium is a noble gas, colorless, odorless, tasteless, non-toxic, inert, monatomic."
        }
    ];
}

// FIXED: Initialize mobile menu
function initMobileMenu() {
    console.log('Initializing mobile menu...');
    
    // Check if elements exist
    if (!mobileMenuBtn || !navLinks) {
        console.error('Mobile menu elements not found');
        return;
    }
    
    console.log('Mobile menu button found:', mobileMenuBtn);
    console.log('Nav links found:', navLinks);
    
    // Add click event to mobile menu button
    mobileMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent event bubbling
        console.log('Mobile menu button clicked');
        
        // Toggle active class on nav links
        navLinks.classList.toggle('active');
        
        // Change icon based on state
        if (navLinks.classList.contains('active')) {
            mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
            mobileMenuBtn.setAttribute('aria-expanded', 'true');
        } else {
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(event.target) && 
            !mobileMenuBtn.contains(event.target)) {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Close mobile menu with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });
}

// FIXED: Initialize counters with Intersection Observer
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const statsSection = document.getElementById('stats');
    
    if (!statsSection || counters.length === 0) {
        console.log('Counters not found, skipping...');
        return;
    }
    
    // Create Intersection Observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('Counters section is in view, starting animation...');
                
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-count'));
                    const duration = 2000; // 2 seconds
                    const step = Math.ceil(target / (duration / 16)); // 60fps
                    let current = 0;
                    
                    const updateCounter = () => {
                        current += step;
                        if (current < target) {
                            counter.textContent = current;
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    };
                    
                    // Start counting
                    requestAnimationFrame(updateCounter);
                });
                
                // Stop observing after animation starts
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3, // Trigger when 30% of section is visible
        rootMargin: '0px 0px -50px 0px' // Adjust trigger point
    });
    
    // Start observing the stats section
    observer.observe(statsSection);
}

// Generate periodic table from elements data
function generatePeriodicTable() {
    if (!periodicTable) return;
    
    // Clear existing table
    periodicTable.innerHTML = '';
    
    // Create periodic table layout
    const layout = [
        [1, 2, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 18], // Period 1
        [3, 4, null, null, null, null, null, null, null, null, null, null, 5, 6, 7, 8, 9, 10], // Period 2
        [11, 12, null, null, null, null, null, null, null, null, null, null, 13, 14, 15, 16, 17, 18], // Period 3
        [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36], // Period 4
        [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54], // Period 5
        [55, 56, 57, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86], // Period 6
        [87, 88, 89, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118], // Period 7
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], // Spacer
        [null, null, null, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, null], // Lanthanides
        [null, null, null, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, null]  // Actinides
    ];
    
    layout.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        
        row.forEach((atomicNumber, colIndex) => {
            const td = document.createElement('td');
            
            if (atomicNumber) {
                const element = elementsData.find(el => el.number === atomicNumber);
                
                if (element) {
                    // Set cell content
                    td.innerHTML = `
                        <span class="element-number">${element.number}</span>
                        <span class="element-symbol">${element.symbol}</span>
                        <span class="element-name">${element.name}</span>
                    `;
                    
                    // Set background color based on category
                    const categoryColor = getCategoryColor(element.category);
                    td.style.background = categoryColor;
                    
                    // Add hover effect
                    td.title = `${element.name} (${element.symbol}) - ${formatCategory(element.category)}`;
                    
                    // Add click event to show element details
                    td.addEventListener('click', () => showElementDetails(element));
                    
                    // Store element data in cell
                    td.dataset.atomicNumber = element.number;
                } else {
                    // Element not found in data
                    td.innerHTML = `<span class="element-number">${atomicNumber}</span>`;
                    td.style.background = 'rgba(255, 255, 255, 0.05)';
                    td.style.cursor = 'default';
                }
            } else {
                // Empty cell
                td.style.background = 'transparent';
                td.style.border = 'none';
                td.style.cursor = 'default';
            }
            
            tr.appendChild(td);
        });
        
        periodicTable.appendChild(tr);
    });
}

// Get color for element category
function getCategoryColor(category) {
    const colors = {
        'alkali': 'linear-gradient(135deg, var(--alkali), #FF8FA3)', // Red
        'alkaline': 'linear-gradient(135deg, var(--alkaline-earth), #FFE5A5)', // Yellow
        'transition': 'linear-gradient(135deg, var(--transition-metal), #5CE1E6)', // Teal
        'post-transition': 'linear-gradient(135deg, #7209B7, #B5179E)', // Purple
        'metalloid': 'linear-gradient(135deg, var(--metalloid), #FFE156)', // Gold
        'nonmetal': 'linear-gradient(135deg, var(--nonmetal), #7AE5E5)', // Light Blue
        'halogen': 'linear-gradient(135deg, #F72585, #B5179E)', // Pink
        'noble': 'linear-gradient(135deg, var(--noble-gas), #4CC9F0)', // Blue
        'lanthanide': 'linear-gradient(135deg, var(--lanthanide), #118AB2)', // Dark Blue
        'actinide': 'linear-gradient(135deg, var(--actinide), #9D4EDD)', // Violet
        'metal': 'linear-gradient(135deg, var(--metal), #FF9E6D)' // Orange
    };
    
    // Default to metal color if category not found
    return colors[category] || 'linear-gradient(135deg, #6A6A6A, #9E9E9E)';
}

// Format category name for display
function formatCategory(category) {
    const categoryNames = {
        'alkali': 'Alkali Metal',
        'alkaline': 'Alkaline Earth Metal',
        'transition': 'Transition Metal',
        'post-transition': 'Post-transition Metal',
        'metalloid': 'Metalloid',
        'nonmetal': 'Nonmetal',
        'halogen': 'Halogen',
        'noble': 'Noble Gas',
        'lanthanide': 'Lanthanide',
        'actinide': 'Actinide',
        'metal': 'Metal'
    };
    
    return categoryNames[category] || category;
}

// Show element details in modal
function showElementDetails(element) {
    if (!elementModal) return;
    
    console.log('Showing details for:', element.name);
    
    // Update modal content with element data
    document.getElementById('modalElementName').textContent = `${element.name} (${element.symbol})`;
    document.getElementById('modalElementSymbol').textContent = element.symbol;
    document.getElementById('modalElementFullName').textContent = element.name;
    document.getElementById('modalAtomicNumber').textContent = element.number;
    document.getElementById('modalAtomicMass').textContent = element.atomic_mass;
    document.getElementById('modalCategory').textContent = formatCategory(element.category);
    
    // Additional properties from your JSON structure
    document.getElementById('modalPeriod').textContent = getPeriod(element.number) || 'N/A';
    document.getElementById('modalGroup').textContent = getGroup(element.number) || 'N/A';
    document.getElementById('modalBlock').textContent = getBlock(element.number) || 'N/A';
    document.getElementById('modalState').textContent = element.phase || 'Unknown';
    document.getElementById('modalDensity').textContent = element.density || 'Unknown';
    document.getElementById('modalMeltingPoint').textContent = element.melt ? `${element.melt} K` : 'Unknown';
    document.getElementById('modalBoilingPoint').textContent = element.boil ? `${element.boil} K` : 'Unknown';
    document.getElementById('modalElectronegativity').textContent = element.electronegativity_pauling || 'N/A';
    document.getElementById('modalDescription').textContent = element.summary || 'No description available.';
    
    // Uses information
    const usesText = element.discovery_year ? 
        `Discovered in ${element.discovery_year}. ${element.summary || ''}` : 
        element.summary || 'No uses information available.';
    document.getElementById('modalUses').textContent = usesText;
    
    // Set modal symbol background color
    const symbolElement = document.getElementById('modalElementSymbol');
    const categoryColor = getCategoryColor(element.category);
    symbolElement.style.background = categoryColor;
    
    // Show modal
    elementModal.classList.add('active');
    isModalOpen = true;
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
}

// Helper function to get period from atomic number
function getPeriod(atomicNumber) {
    if (atomicNumber <= 2) return 1;
    if (atomicNumber <= 10) return 2;
    if (atomicNumber <= 18) return 3;
    if (atomicNumber <= 36) return 4;
    if (atomicNumber <= 54) return 5;
    if (atomicNumber <= 86) return 6;
    if (atomicNumber <= 118) return 7;
    return null;
}

// Helper function to get group from atomic number
function getGroup(atomicNumber) {
    // Simplified group determination
    const groups = {
        1: 1, 3: 1, 11: 1, 19: 1, 37: 1, 55: 1, 87: 1,
        4: 2, 12: 2, 20: 2, 38: 2, 56: 2, 88: 2,
        21: 3, 39: 3, 57: 3, 89: 3,
        22: 4, 40: 4, 72: 4, 104: 4,
        // Add more mappings as needed
    };
    
    return groups[atomicNumber] || 'N/A';
}

// Helper function to get block from atomic number
function getBlock(atomicNumber) {
    if (atomicNumber <= 2) return 's';
    if (atomicNumber <= 10) return 's/p';
    if (atomicNumber <= 18) return 's/p';
    if (atomicNumber <= 36) return 's/d/p';
    if (atomicNumber <= 54) return 's/d/p';
    if (atomicNumber <= 86) return 's/f/d/p';
    if (atomicNumber <= 118) return 's/f/d/p';
    return 'N/A';
}

// Initialize modal events
function initModalEvents() {
    // Close modal when clicking close button
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeElementModal);
    }
    
    if (closeModalBtn2) {
        closeModalBtn2.addEventListener('click', closeElementModal);
    }
    
    // Close modal when clicking outside modal content
    elementModal.addEventListener('click', function(event) {
        if (event.target === elementModal) {
            closeElementModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && isModalOpen) {
            closeElementModal();
        }
    });
    
    // Use in lab button
    if (useInLabBtn) {
        useInLabBtn.addEventListener('click', function() {
            const elementName = document.getElementById('modalElementFullName').textContent;
            const elementSymbol = document.getElementById('modalElementSymbol').textContent;
            
            // Find the element in the data
            const element = elementsData.find(el => 
                el.symbol === elementSymbol
            );
            
            if (element) {
                // Add element to chemistry lab
                addElementToChemistryLab(element);
                closeElementModal();
                
                // Scroll to chemistry lab section
                document.getElementById('labs').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }
        });
    }
}

// Close element modal
function closeElementModal() {
    elementModal.classList.remove('active');
    isModalOpen = false;
    document.body.style.overflow = 'auto';
}

// Initialize chemistry lab
function initChemistryLab() {
    // Create element buttons for chemistry lab
    createElementButtons();
    
    // Initialize event listeners
    const createCompoundBtn = document.getElementById('createCompound');
    const resetSelectionBtn = document.getElementById('resetSelection');
    
    if (createCompoundBtn) {
        createCompoundBtn.addEventListener('click', createCompound);
    }
    
    if (resetSelectionBtn) {
        resetSelectionBtn.addEventListener('click', resetSelection);
    }
    
    // Initialize 3D model controls
    const rotateBtn = document.getElementById('rotateModel');
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    
    if (rotateBtn) {
        rotateBtn.addEventListener('click', toggleRotation);
    }
    
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', zoomIn);
    }
    
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', zoomOut);
    }
}

// Create element buttons for chemistry lab
function createElementButtons() {
    if (!elementsGrid) return;
    
    // Clear existing buttons
    elementsGrid.innerHTML = '';
    
    // Get first 12 elements for the lab (or all if less than 12)
    const labElements = elementsData.slice(0, Math.min(12, elementsData.length));
    
    labElements.forEach(element => {
        const button = document.createElement('button');
        button.className = 'element-btn';
        button.innerHTML = `<strong>${element.symbol}</strong><br><small>${element.name}</small>`;
        
        // Set background color based on category
        const categoryColor = getCategoryColor(element.category);
        button.style.background = categoryColor.replace('gradient', 'gradient').replace('135deg', '135deg') + '40';
        button.style.border = `2px solid ${categoryColor.split(',')[1].trim()}`;
        
        // Add click event
        button.addEventListener('click', () => {
            addElementToChemistryLab(element);
        });
        
        elementsGrid.appendChild(button);
    });
}

// Add element to chemistry lab
function addElementToChemistryLab(element) {
    if (!selectedElements) return;
    
    console.log('Adding element to lab:', element.name);
    
    // Add element to selected elements array
    selectedElements.push(element);
    updateSelectedElementsDisplay();
    
    // Create compound formula
    createCompound();
}

// Update selected elements display
function updateSelectedElementsDisplay() {
    if (!selectedElementsContainer) return;
    
    selectedElementsContainer.innerHTML = '';
    
    if (selectedElements.length === 0) {
        selectedElementsContainer.innerHTML = '<p style="color: rgba(255,255,255,0.5);">Select elements...</p>';
        return;
    }
    
    // Count occurrences of each element
    const elementCounts = {};
    selectedElements.forEach(el => {
        elementCounts[el.symbol] = (elementCounts[el.symbol] || 0) + 1;
    });
    
    // Display grouped elements
    Object.keys(elementCounts).forEach(symbol => {
        const count = elementCounts[symbol];
        const element = elementsData.find(el => el.symbol === symbol);
        
        if (element) {
            const elementDiv = document.createElement('div');
            elementDiv.className = 'selected-element';
            
            const categoryColor = getCategoryColor(element.category);
            elementDiv.style.background = categoryColor.replace('gradient', 'gradient').replace('135deg', '135deg') + '80';
            
            elementDiv.innerHTML = `
                ${symbol}${count > 1 ? `<sub>${count}</sub>` : ''}
                <button class="remove-element" data-symbol="${symbol}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            selectedElementsContainer.appendChild(elementDiv);
        }
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-element').forEach(btn => {
        btn.addEventListener('click', function() {
            const symbol = this.getAttribute('data-symbol');
            removeElementFromSelection(symbol);
        });
    });
}

// Remove element from selection
function removeElementFromSelection(symbol) {
    const index = selectedElements.findIndex(el => el.symbol === symbol);
    if (index !== -1) {
        selectedElements.splice(index, 1);
        updateSelectedElementsDisplay();
        createCompound();
    }
}

// Create compound formula
function createCompound() {
    if (selectedElements.length === 0) {
        compoundFormula.textContent = 'No elements selected';
        compoundName.textContent = '';
        reset3DModel();
        return;
    }
    
    // Count element occurrences
    const elementCounts = {};
    selectedElements.forEach(el => {
        elementCounts[el.symbol] = (elementCounts[el.symbol] || 0) + 1;
    });
    
    // Create formula string
    let formula = '';
    Object.keys(elementCounts).forEach(symbol => {
        const count = elementCounts[symbol];
        formula += symbol + (count > 1 ? `<sub>${count}</sub>` : '');
    });
    
    compoundFormula.innerHTML = formula;
    
    // Determine compound name
    const formulaText = formula.replace(/<sub>(\d+)<\/sub>/g, '$1');
    const compoundNames = {
        'H2O': 'Water',
        'CO2': 'Carbon Dioxide',
        'NaCl': 'Sodium Chloride (Salt)',
        'CH4': 'Methane',
        'NH3': 'Ammonia',
        'C6H12O6': 'Glucose',
        'H2': 'Hydrogen Gas',
        'O2': 'Oxygen Gas',
        'Fe2O3': 'Iron Oxide (Rust)',
        'CaCO3': 'Calcium Carbonate (Limestone)'
    };
    
    let name = compoundNames[formulaText] || 'Unknown Compound';
    
    if (name === 'Unknown Compound') {
        const elementNames = selectedElements.map(el => el.name);
        const uniqueElements = [...new Set(elementNames)];
        name = uniqueElements.join('-') + ' Compound';
    }
    
    compoundName.textContent = name;
    
    // Create 3D model
    create3DModel(selectedElements);
}

// Reset selection
function resetSelection() {
    selectedElements = [];
    updateSelectedElementsDisplay();
    compoundFormula.textContent = 'H₂O';
    compoundName.textContent = 'Water';
    reset3DModel();
}

// Initialize chemical background
function initChemicalBackground() {
    const chemicalBg = document.getElementById('chemicalBg');
    if (!chemicalBg) return;
    
    for (let i = 0; i < 30; i++) {
        const molecule = document.createElement('div');
        molecule.className = 'molecule';
        molecule.style.width = `${Math.random() * 30 + 10}px`;
        molecule.style.height = molecule.style.width;
        molecule.style.left = `${Math.random() * 100}vw`;
        molecule.style.top = `${Math.random() * 100}vh`;
        molecule.style.background = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.1)`;
        molecule.style.animationDuration = `${Math.random() * 30 + 20}s`;
        molecule.style.animationDelay = `${Math.random() * 5}s`;
        chemicalBg.appendChild(molecule);
    }
}

// Initialize smooth scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 3D Model Functions
function init3DModel() {
    if (!document.getElementById('compoundModel')) return;
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a192f);
    
    const container = document.getElementById('compoundModel');
    camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    camera.position.z = 15;
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);
    
    // Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Initial model (water)
    createWaterModel();
    
    // Animation loop
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function createWaterModel() {
    // Clear previous model
    atoms.forEach(atom => scene.remove(atom));
    bonds.forEach(bond => scene.remove(bond));
    atoms = [];
    bonds = [];
    
    // Oxygen atom
    const oxygenGeometry = new THREE.SphereGeometry(1, 32, 32);
    const oxygenMaterial = new THREE.MeshPhongMaterial({ color: 0x4ECDC4 });
    const oxygenAtom = new THREE.Mesh(oxygenGeometry, oxygenMaterial);
    oxygenAtom.position.set(0, 0, 0);
    scene.add(oxygenAtom);
    atoms.push(oxygenAtom);
    
    // Hydrogen atoms (2)
    const hydrogenGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const hydrogenMaterial = new THREE.MeshPhongMaterial({ color: 0xFF6B6B });
    
    const hydrogenAtom1 = new THREE.Mesh(hydrogenGeometry, hydrogenMaterial);
    hydrogenAtom1.position.set(-1.5, 1, 0);
    scene.add(hydrogenAtom1);
    atoms.push(hydrogenAtom1);
    
    const hydrogenAtom2 = new THREE.Mesh(hydrogenGeometry, hydrogenMaterial);
    hydrogenAtom2.position.set(1.5, 1, 0);
    scene.add(hydrogenAtom2);
    atoms.push(hydrogenAtom2);
    
    // Bonds
    createBond(oxygenAtom.position, hydrogenAtom1.position);
    createBond(oxygenAtom.position, hydrogenAtom2.position);
}

function create3DModel(elements) {
    // Clear previous model
    atoms.forEach(atom => scene.remove(atom));
    bonds.forEach(bond => scene.remove(bond));
    atoms = [];
    bonds = [];
    
    if (elements.length === 0) {
        createWaterModel();
        return;
    }
    
    // Count element occurrences
    const elementCounts = {};
    elements.forEach(el => {
        elementCounts[el.symbol] = (elementCounts[el.symbol] || 0) + 1;
    });
    
    const uniqueElements = Object.keys(elementCounts);
    const totalAtoms = elements.length;
    
    // Arrange atoms in a circle
    const radius = Math.min(5, 2 + totalAtoms * 0.5);
    let angle = 0;
    const angleStep = (2 * Math.PI) / totalAtoms;
    
    // Create atoms
    uniqueElements.forEach(symbol => {
        const count = elementCounts[symbol];
        const element = elements.find(el => el.symbol === symbol);
        
        // Get color for element
        const color = getColorForElement(element);
        
        for (let i = 0; i < count; i++) {
            const geometry = new THREE.SphereGeometry(0.8, 32, 32);
            const material = new THREE.MeshPhongMaterial({ color: color });
            const atom = new THREE.Mesh(geometry, material);
            
            // Position in circle
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            atom.position.set(x, y, 0);
            
            scene.add(atom);
            atoms.push(atom);
            
            angle += angleStep;
        }
    });
    
    // Create bonds between atoms
    for (let i = 0; i < atoms.length - 1; i++) {
        createBond(atoms[i].position, atoms[i+1].position);
    }
    
    // Connect first and last atom if more than 2 atoms
    if (atoms.length > 2) {
        createBond(atoms[0].position, atoms[atoms.length-1].position);
    }
    
    // Reset camera
    camera.position.set(0, 0, 15);
    controls.update();
}

function getColorForElement(element) {
    const colorMap = {
        'H': 0xFF6B6B,    // Red
        'O': 0x4ECDC4,    // Teal
        'C': 0x45B7D1,    // Blue
        'N': 0x96CEB4,    // Green
        'Na': 0xFFEAA7,   // Yellow
        'Cl': 0xDDA0DD,   // Purple
        'Fe': 0xFFA07A,   // Orange
        'Cu': 0xCD853F,   // Brown
        'Ag': 0xC0C0C0,   // Silver
        'Au': 0xFFD700,   // Gold
        'Mg': 0x98FB98,   // Light Green
        'Ca': 0xFFB347    // Peach
    };
    
    return colorMap[element.symbol] || 0x888888; // Gray default
}

function createBond(pos1, pos2) {
    const distance = pos1.distanceTo(pos2);
    const geometry = new THREE.CylinderGeometry(0.2, 0.2, distance, 8);
    geometry.rotateZ(Math.PI / 2);
    
    const material = new THREE.MeshPhongMaterial({ color: 0xCCCCCC });
    const bond = new THREE.Mesh(geometry, material);
    
    const center = new THREE.Vector3().addVectors(pos1, pos2).multiplyScalar(0.5);
    bond.position.copy(center);
    bond.lookAt(pos2);
    
    scene.add(bond);
    bonds.push(bond);
}

function reset3DModel() {
    createWaterModel();
}

function toggleRotation() {
    autoRotate = !autoRotate;
    controls.autoRotate = autoRotate;
    
    const rotateBtn = document.getElementById('rotateModel');
    if (rotateBtn) {
        rotateBtn.style.background = autoRotate 
            ? 'rgba(255, 65, 108, 0.5)' 
            : 'rgba(255, 255, 255, 0.2)';
    }
}

function zoomIn() {
    camera.position.z -= 1;
    controls.update();
}

function zoomOut() {
    camera.position.z += 1;
    controls.update();
}

// Handle window resize
window.addEventListener('resize', function() {
    const container = document.getElementById('compoundModel');
    if (container && camera && renderer) {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    }
});

// Utility function to show error messages
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff416c;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}