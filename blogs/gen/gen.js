
document.addEventListener('DOMContentLoaded', function() {
    // Generate DNA sequence
    const dnaSequence = document.getElementById('dnaSequence');
    const bases = ['A', 'T', 'C', 'G'];
    let sequenceHTML = '';
    
    for (let i = 0; i < 40; i++) {
const base = bases[Math.floor(Math.random() * bases.length)];
sequenceHTML += `<span class="base-pair base-${base.toLowerCase()}">${base}</span>`;
    }
    
    dnaSequence.innerHTML = sequenceHTML;
    
    // Add click events to base pairs
    const basePairs = document.querySelectorAll('.base-pair');
    basePairs.forEach(pair => {
pair.addEventListener('click', function() {
    const base = this.textContent;
    let complement;
    
    switch(base) {
case 'A': complement = 'T'; break;
case 'T': complement = 'A'; break;
case 'C': complement = 'G'; break;
case 'G': complement = 'C'; break;
default: complement = '';
    }
    
    // Highlight effect
    this.style.transform = 'scale(1.3)';
    this.style.boxShadow = '0 0 15px currentColor';
    
    setTimeout(() => {
this.style.transform = '';
this.style.boxShadow = '';
    }, 500);
    
    // Show complement in a tooltip
    const originalColor = this.style.color;
    this.style.color = '#fff';
    this.textContent = `${base}:${complement}`;
    
    setTimeout(() => {
this.style.color = originalColor;
this.textContent = base;
    }, 1000);
});
    });
    
    // Gene Editor Functionality
    const geneOptions = document.querySelectorAll('.gene-option');
    const editButton = document.getElementById('editGene');
    const resetButton = document.getElementById('resetGene');
    const resultDisplay = document.getElementById('resultDisplay');
    
    let selectedGenes = [];
    
    // Gene selection
    geneOptions.forEach(option => {
option.addEventListener('click', function() {
    const gene = this.getAttribute('data-gene');
    
    if (this.classList.contains('active')) {
// Deselect
this.classList.remove('active');
selectedGenes = selectedGenes.filter(g => g !== gene);
    } else {
// Select
this.classList.add('active');
selectedGenes.push(gene);
    }
    
    // Update button text
    if (selectedGenes.length > 0) {
editButton.innerHTML = `<i class="fas fa-bolt"></i> Edit ${selectedGenes.length} Gene${selectedGenes.length > 1 ? 's' : ''}`;
    } else {
editButton.innerHTML = `<i class="fas fa-bolt"></i> Apply Genetic Changes`;
    }
});
    });
    
    // Edit gene button
    editButton.addEventListener('click', function() {
if (selectedGenes.length === 0) {
    resultDisplay.innerHTML = `<div class="result-text" style="color: var(--dna-pink);">
<i class="fas fa-exclamation-triangle"></i> Please select at least one trait to edit!
    </div>`;
    return;
}

// Random outcomes
const outcomes = [
    `Success! The organism now expresses ${selectedGenes.length} new trait${selectedGenes.length > 1 ? 's' : ''}. It's thriving in the lab environment.`,
    `Interesting result! The genetic modifications were successful, but the organism has developed a peculiar preference for jazz music. Further study needed.`,
    `Breakthrough! The ${selectedGenes.join(', ')} genes integrated perfectly. Publication in Nature Genetics is pending.`,
    `Partial success. Traits are expressed, but the organism now photosynthesizes only during full moons. Back to the drawing board.`,
    `Remarkable! The edited organism is not only viable but has become 37% more charming. Nobel Prize committee notified.`
];

const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
const randomSuccess = Math.random() > 0.3 ? 'success' : 'partial';

if (randomSuccess === 'success') {
    resultDisplay.innerHTML = `<div class="result-text" style="color: var(--gene-green);">
<i class="fas fa-check-circle"></i> ${randomOutcome}
    </div>`;
} else {
    resultDisplay.innerHTML = `<div class="result-text" style="color: #ffd700;">
<i class="fas fa-exclamation-circle"></i> ${randomOutcome}
    </div>`;
}

// Add some animation
resultDisplay.style.transform = 'scale(0.95)';
setTimeout(() => {
    resultDisplay.style.transition = 'transform 0.3s';
    resultDisplay.style.transform = 'scale(1)';
}, 10);
    });
    
    // Reset button
    resetButton.addEventListener('click', function() {
// Deselect all genes
geneOptions.forEach(option => {
    option.classList.remove('active');
});

// Reset arrays and display
selectedGenes = [];
editButton.innerHTML = `<i class="fas fa-bolt"></i> Apply Genetic Changes`;

resultDisplay.innerHTML = `<div class="result-text">
    <i class="fas fa-redo"></i> Organism reset to wild type. Ready for new experiments!
</div>`;

// Animation
resultDisplay.style.transform = 'scale(0.95)';
setTimeout(() => {
    resultDisplay.style.transition = 'transform 0.3s';
    resultDisplay.style.transform = 'scale(1)';
}, 10);
    });
    
    // DNA strand animation speed based on scroll
    let lastScrollTop = 0;
    const dnaStrands = document.querySelectorAll('.dna-strand');
    
    window.addEventListener('scroll', function() {
const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
const scrollDiff = scrollTop - lastScrollTop;

// Adjust animation speed based on scroll speed
dnaStrands.forEach(strand => {
    const currentSpeed = getComputedStyle(strand).animationDuration;
    const speedNum = parseFloat(currentSpeed);
    
    let newSpeed = speedNum;
    if (Math.abs(scrollDiff) > 5) {
newSpeed = Math.max(10, Math.min(30, speedNum - (scrollDiff * 0.01)));
    } else {
newSpeed = 20; // Default speed
    }
    
    strand.style.animationDuration = `${newSpeed}s`;
});

lastScrollTop = scrollTop;
    });
});
