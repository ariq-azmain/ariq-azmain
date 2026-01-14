
// Timeline Slider
document.getElementById('timelineSlider').addEventListener('input', function() {
    const year = this.value;
    document.getElementById('timelineYear').textContent = year;
    
    // Update battle lines based on year
    const lines = document.querySelectorAll('.battle-line');
    if (year < 1918) {
lines.forEach(line => line.style.background = 'linear-gradient(90deg, transparent, var(--ww1-khaki), transparent)');
    } else if (year < 1945) {
lines.forEach(line => line.style.background = 'linear-gradient(90deg, transparent, var(--ww2-olive), transparent)');
    } else {
lines.forEach(line => line.style.background = 'linear-gradient(90deg, transparent, var(--cold-war-blue), transparent)');
    }
});

// Strategy Simulator
const strategies = {
    trench: {
title: "Trench Warfare Strategy",
description: "You dig extensive trench networks! Defense improves but mobility suffers. Casualties are high due to stalemate conditions. Historically: Led to years of deadlock in WWI."
    },
    blitz: {
title: "Blitzkrieg Strategy",
description: "Rapid mobile warfare! You achieve quick victories but overextend supply lines. Works well initially but vulnerable to counterattacks. Historically: Germany's early WWII success."
    },
    naval: {
title: "Naval Blockade Strategy",
description: "Control the seas! You strangle enemy supply lines but require massive naval investment. Effective against island nations. Historically: Allied strategy against Japan."
    },
    air: {
title: "Air Superiority Strategy",
description: "Dominate the skies! You gain reconnaissance advantage and can bomb strategic targets. Expensive but decisive. Historically: Key to Allied victory in WWII."
    }
};

document.querySelectorAll('.strategy-card').forEach(card => {
    card.addEventListener('click', function() {
const strategy = this.dataset.strategy;
const result = strategies[strategy];

const resultDiv = document.getElementById('strategyResult');
const title = document.getElementById('resultTitle');
const description = document.getElementById('resultDescription');

title.textContent = result.title;
description.textContent = result.description;
resultDiv.style.display = 'block';

// Highlight selected card
document.querySelectorAll('.strategy-card').forEach(c => {
    c.style.boxShadow = 'none';
    c.style.border = '2px solid var(--victory-gold)';
});

this.style.boxShadow = '0 0 20px var(--victory-gold)';
this.style.border = '2px solid var(--victory-gold)';
    });
});

// Casualty Counter
document.getElementById('casualtySlider').addEventListener('input', function() {
    const year = parseInt(this.value);
    let casualties = 0;
    
    if (year <= 1918) {
// WWI casualties
casualties = Math.floor(20000000 * ((year - 1914) / 4));
    } else {
// WWII casualties
casualties = 20000000 + Math.floor(55000000 * ((year - 1918) / 27));
    }
    
    // Format number with commas
    document.getElementById('casualtyNumber').textContent = 
casualties.toLocaleString('en-US');
    
    // Update color based on era
    const display = document.getElementById('casualtyNumber');
    if (year <= 1918) {
display.style.color = 'var(--ww1-khaki)';
    } else {
display.style.color = 'var(--ww2-olive)';
    }
});

// War Quiz
document.getElementById('checkWarQuiz').addEventListener('click', function() {
    const answer = document.querySelector('input[name="warQuiz"]:checked');
    let result = '';
    
    if (!answer) {
result = 'Please select an answer!';
    } else if (answer.id === 'quiz2') {
result = 'Correct! The Soviet Union suffered approximately 27 million deaths (military and civilian) in WWII.';
this.style.background = 'var(--ww2-olive)';
this.style.color = 'white';
    } else {
result = 'Incorrect. The Soviet Union suffered the most casualties (27 million), followed by China (20 million).';
this.style.background = 'var(--memorial-red)';
this.style.color = 'white';
    }
    
    alert(result);
    
    // Reset button after 2 seconds
    setTimeout(() => {
this.style.background = 'var(--victory-gold)';
this.style.color = '#000';
    }, 2000);
});

// Initialize values
window.addEventListener('load', function() {
    // Set initial values
    document.getElementById('timelineSlider').dispatchEvent(new Event('input'));
    document.getElementById('casualtySlider').dispatchEvent(new Event('input'));
    
    // Initialize accordion
    const firstAccordion = new bootstrap.Collapse(document.getElementById('battle1'));
    
    // Touch device optimizations
    if ('ontouchstart' in window) {
document.querySelectorAll('.strategy-card').forEach(card => {
    card.style.padding = '1.8rem 1rem';
});

document.querySelectorAll('.accordion-button').forEach(button => {
    button.style.padding = '1.2rem 1rem';
});
    }
});

// Handle reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.battle-line').forEach(line => {
line.style.animation = 'none';
    });
    
    document.querySelectorAll('.front-line::before, .front-line::after').forEach(dot => {
dot.style.animation = 'none';
    });
}

// Handle window resize for layout adjustments
function adjustWarLayout() {
    const strategicGrid = document.querySelector('.strategic-grid');
    const battleMap = document.querySelector('.battle-map');
    
    if (window.innerWidth < 1400 && strategicGrid && battleMap) {
// Ensure battle map is in correct position
if (strategicGrid.children[2] === battleMap) {
    strategicGrid.insertBefore(battleMap, strategicGrid.children[0]);
}
    }
}

window.addEventListener('resize', adjustWarLayout);
window.addEventListener('load', adjustWarLayout);

// Add pulse animation for front line dots
const style = document.createElement('style');
style.textContent = `
    @keyframes pulseDot {
0%, 100% { transform: translateY(-50%) scale(1); opacity: 0.7; }
50% { transform: translateY(-50%) scale(1.3); opacity: 1; }
    }
`;
document.head.appendChild(style);