
// Banner Animation
function createBannerAnimation() {
    const container = document.getElementById('bannerContainer');
    const banners = ['⚔️', '🏰', '👑', '🛡️', '⚜️', '🗡️', '🏹', '🐉'];
    
    for (let i = 0; i < 12; i++) {
const banner = document.createElement('div');
banner.className = 'banner';
banner.textContent = banners[Math.floor(Math.random() * banners.length)];

// Random position and animation
banner.style.left = Math.random() * 100 + '%';
banner.style.fontSize = (Math.random() * 2 + 2) + 'rem';

const duration = Math.random() * 20 + 15;
banner.style.animationDuration = duration + 's';
banner.style.animationDelay = Math.random() * 10 + 's';

container.appendChild(banner);
    }
}

// Feudal Tax Calculator
document.getElementById('taxSlider').addEventListener('input', function() {
    const rate = this.value;
    document.getElementById('taxRate').textContent = rate + '%';
    
    // Update pyramid colors based on tax rate
    const pyramidLevels = document.querySelectorAll('.pyramid-level');
    if (rate > 70) {
pyramidLevels[3].style.background = 'linear-gradient(135deg, var(--manuscript-red), rgba(220, 38, 38, 0.8))';
    } else if (rate > 40) {
pyramidLevels[3].style.background = 'linear-gradient(135deg, var(--castle-gray), rgba(107, 114, 128, 0.8))';
    } else {
pyramidLevels[3].style.background = 'linear-gradient(135deg, #4B5563, rgba(75, 85, 99, 0.8))';
    }
});

// Peasant Revolt Button
document.getElementById('revoltBtn').addEventListener('click', function() {
    const taxRate = parseInt(document.getElementById('taxRate').textContent);
    
    if (taxRate > 60) {
// Successful revolt
this.innerHTML = '<i class="fas fa-crown me-2"></i>Revolt Successful!';
this.style.background = 'var(--knight-gold)';
this.style.color = '#000';

// Animate pyramid
const peasantLevel = document.querySelectorAll('.pyramid-level')[3];
peasantLevel.style.animation = 'shake 0.5s';
peasantLevel.innerHTML = `
    <h5>👑 NEW MONARCH</h5>
    <p><small>Peasant leader takes throne! Tax rate reduced to 30%.</small></p>
`;

setTimeout(() => {
    this.innerHTML = '<i class="fas fa-fist-raised me-2"></i>Start Peasant Revolt';
    this.style.background = 'var(--manuscript-red)';
    this.style.color = 'white';
    document.getElementById('taxSlider').value = 30;
    document.getElementById('taxSlider').dispatchEvent(new Event('input'));
    peasantLevel.style.animation = '';
}, 3000);
    } else {
// Failed revolt
this.innerHTML = '<i class="fas fa-skull me-2"></i>Revolt Crushed!';
this.style.background = '#000';

setTimeout(() => {
    this.innerHTML = '<i class="fas fa-fist-raised me-2"></i>Start Peasant Revolt';
    this.style.background = 'var(--manuscript-red)';
}, 2000);
    }
});

// Castle Builder Functionality
const castleParts = document.querySelectorAll('.castle-part');
const constructionArea = document.getElementById('castleConstructionArea');
let castleScore = 0;

castleParts.forEach(part => {
    part.addEventListener('dragstart', function(e) {
e.dataTransfer.setData('text/plain', this.dataset.part);
this.style.opacity = '0.5';
    });
    
    part.addEventListener('dragend', function() {
this.style.opacity = '1';
    });
});

constructionArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.style.borderStyle = 'solid';
    this.style.borderColor = 'var(--knight-gold)';
});

constructionArea.addEventListener('dragleave', function() {
    this.style.borderStyle = 'dashed';
    this.style.borderColor = 'var(--castle-gray)';
});

constructionArea.addEventListener('drop', function(e) {
    e.preventDefault();
    const part = e.dataTransfer.getData('text/plain');
    this.style.borderStyle = 'dashed';
    this.style.borderColor = 'var(--castle-gray)';
    
    // Add part to castle
    const partNames = {
'keep': 'Main Keep',
'wall': 'Defensive Wall',
'gate': 'Heavy Gate',
'moat': 'Water-Filled Moat'
    };
    
    const partDiv = document.createElement('div');
    partDiv.className = 'd-inline-block m-2 p-2 rounded';
    partDiv.style.background = 'rgba(245, 158, 11, 0.2)';
    partDiv.style.border = '2px solid var(--knight-gold)';
    partDiv.innerHTML = `
<i class="fas fa-${part === 'keep' ? 'tower' : part === 'wall' ? 'wall' : part === 'gate' ? 'door-closed' : 'water'}"></i>
<br><small>${partNames[part]}</small>
    `;
    
    this.appendChild(partDiv);
    castleScore += 25;
    
    // Update construction message
    const message = this.querySelector('p.text-muted');
    if (message) {
message.textContent = `Castle Strength: ${castleScore}/100`;
message.style.color = castleScore >= 100 ? 'var(--forest-green)' : 'var(--knight-gold)';
    }
});

// Reset Castle
document.getElementById('resetCastleBtn').addEventListener('click', function() {
    constructionArea.innerHTML = '<p class="text-muted mb-0">Drag castle parts here to build</p>';
    castleScore = 0;
});

// Siege Test
document.getElementById('siegeBtn').addEventListener('click', function() {
    const result = castleScore >= 75 ? 'success' : castleScore >= 50 ? 'partial' : 'failure';
    const messages = {
'success': '🏰 Castle withstood the siege! Your defenses are impenetrable!',
'partial': '⚠️ Castle damaged but standing. Consider adding more defenses.',
'failure': '💥 Castle breached! Maybe start with a smaller fortress next time.'
    };
    
    constructionArea.innerHTML = `
<div class="text-center">
    <h5 style="color: ${result === 'success' ? 'var(--forest-green)' : result === 'partial' ? 'var(--knight-gold)' : 'var(--manuscript-red)'}">
${messages[result]}
    </h5>
    <small>Castle Score: ${castleScore}/100</small>
</div>
    `;
});

// Plague Spread Simulator
document.getElementById('plagueSlider').addEventListener('input', function() {
    const infectionRate = this.value;
    const population = 1000;
    const deaths = Math.floor(population * (infectionRate / 100) * 0.6); // 60% mortality
    
    document.getElementById('plagueBar').style.width = infectionRate + '%';
    document.getElementById('population').textContent = population - deaths;
    document.getElementById('deathCount').textContent = `Deaths: ${deaths}`;
    
    // Color based on infection rate
    if (infectionRate > 70) {
document.getElementById('plagueBar').style.background = 'linear-gradient(90deg, #000, var(--manuscript-red))';
    } else if (infectionRate > 30) {
document.getElementById('plagueBar').style.background = 'linear-gradient(90deg, var(--manuscript-red), #8B0000)';
    } else {
document.getElementById('plagueBar').style.background = 'linear-gradient(90deg, var(--manuscript-red), #DC2626)';
    }
});

// Feudal Tax Calculator
document.getElementById('calculateTaxBtn').addEventListener('click', function() {
    const land = parseInt(document.getElementById('landInput').value) || 100;
    const taxRate = parseInt(document.getElementById('taxSlider').value) || 50;
    const tax = Math.floor(land * 0.3 * (taxRate / 100) * 10); // Simplified formula
    
    document.getElementById('taxResult').textContent = tax;
    
    // Animation
    this.innerHTML = '<i class="fas fa-check me-2"></i>Calculated!';
    setTimeout(() => {
this.innerHTML = '<i class="fas fa-calculator me-2"></i>Calculate Annual Tax';
    }, 1500);
});

// Medieval Quiz
document.getElementById('checkQuizBtn').addEventListener('click', function() {
    const answer = document.querySelector('input[name="quiz"]:checked');
    let result = '';
    
    if (!answer) {
result = 'Please select an answer!';
    } else if (answer.id === 'quiz2') {
result = 'Correct! A jongleur was a traveling entertainer, similar to a minstrel.';
this.style.background = 'var(--forest-green)';
    } else {
result = 'Incorrect! A jongleur was actually a traveling entertainer.';
this.style.background = 'var(--manuscript-red)';
    }
    
    alert(result);
    setTimeout(() => {
this.style.background = 'var(--royal-purple)';
    }, 2000);
});

// Responsive Layout Adjustments
function adjustMedievalLayout() {
    const layout = document.querySelector('.manuscript-layout');
    const rightColumn = document.querySelector('.manuscript-column:last-child');
    
    if (window.innerWidth < 1200 && layout && rightColumn) {
// Move right column before main content on medium screens
layout.insertBefore(rightColumn, layout.children[1]);
    }
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
0%, 100% { transform: translateX(0); }
10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Initialize
window.addEventListener('load', function() {
    createBannerAnimation();
    adjustMedievalLayout();
    
    // Initialize plague simulator
    document.getElementById('plagueSlider').dispatchEvent(new Event('input'));
    
    // Initialize tax calculator
    document.getElementById('taxSlider').dispatchEvent(new Event('input'));
    
    // Check for touch devices
    if ('ontouchstart' in window) {
// Make castle parts easier to tap
document.querySelectorAll('.castle-part').forEach(part => {
    part.style.padding = '1.5rem';
    part.style.margin = '0.5rem';
});
    }
});

window.addEventListener('resize', adjustMedievalLayout);

// Reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.banner').forEach(banner => {
banner.style.animation = 'none';
banner.style.opacity = '0.05';
    });
}
    </script>