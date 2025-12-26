// Hieroglyph Animation
function createHieroglyphAnimation() {
    const container = document.getElementById('hieroglyphContainer');
    const hieroglyphs = ['𓀀', '𓀁', '𓀂', '𓀃', '𓀄', '𓀅', '𓀆', '𓀇', '𓀈', '𓀉'];
    
    for (let i = 0; i < 15; i++) {
const glyph = document.createElement('div');
glyph.className = 'hieroglyph';
glyph.textContent = hieroglyphs[Math.floor(Math.random() * hieroglyphs.length)];

// Random position
glyph.style.left = Math.random() * 100 + '%';

// Random animation duration
const duration = Math.random() * 15 + 10;
glyph.style.animationDuration = duration + 's';
glyph.style.animationDelay = Math.random() * 5 + 's';

container.appendChild(glyph);
    }
}

// Civilization Builder
const civilizations = {
    writing: {
title: "The Scriptorians",
description: "Your civilization masters the written word! You invent a complex writing system that records everything from epic poems to grocery lists. Future archaeologists will spend centuries deciphering your shopping lists."
    },
    architecture: {
title: "The Monument Builders",
description: "Your civilization erects colossal structures that defy engineering logic. Pyramids, ziggurats, and massive temples dot your landscape. Your construction projects make modern skyscrapers look like LEGO houses."
    },
    agriculture: {
title: "The Fertile Empire",
description: "You master farming and irrigation, creating surplus food that supports massive populations. Your granaries are always full, and you invent crop rotation 2,000 years before anyone else thinks of it."
    },
    mathematics: {
title: "The Calculati",
description: "Your civilization discovers advanced mathematics, including geometry, algebra, and possibly calculus (but you keep it secret). You measure the stars and build calendars more accurate than modern ones."
    }
};

document.getElementById('buildCivilizationBtn').addEventListener('click', function() {
    const innovation = document.getElementById('innovationSelect').value;
    const government = document.getElementById('govSelect').value;
    
    const resultDiv = document.getElementById('civilizationResult');
    const title = document.getElementById('resultTitle');
    const description = document.getElementById('resultDescription');
    
    const civ = civilizations[innovation];
    const govTypes = {
monarchy: "under a divine monarchy where the ruler claims direct lineage from the gods",
republic: "as an early republic with elected officials and public forums",
theocracy: "as a theocracy where priests interpret the will of the gods",
tribal: "through a tribal council of elders and wise leaders"
    };
    
    title.textContent = `🏛️ ${civ.title}`;
    description.textContent = `${civ.description} You are governed ${govTypes[government]}.`;
    
    resultDiv.style.display = 'block';
    
    // Animation
    this.innerHTML = '<i class="fas fa-check me-2"></i>Civilization Founded!';
    setTimeout(() => {
this.innerHTML = '<i class="fas fa-hammer me-2"></i>Found Civilization';
    }, 2000);
});

// Artifact Information Display
const artifacts = {
    rosetta: {
name: "Rosetta Stone",
year: "196 BCE",
description: "The key that unlocked Egyptian hieroglyphs. Contains the same text in three scripts: Egyptian hieroglyphs, Demotic script, and Ancient Greek. Basically, ancient Google Translate.",
location: "Discovered in Rosetta, Egypt. Now in the British Museum (controversially)."
    },
    code: {
name: "Code of Hammurabi",
year: "1754 BCE",
description: "One of the oldest deciphered writings of significant length. 282 laws with specific punishments. Features the famous 'eye for an eye' principle (literally).",
location: "Originally from Babylon, now in the Louvre Museum."
    },
    pyramid: {
name: "Pyramid Texts",
year: "2400–2300 BCE",
description: "The oldest ancient Egyptian funerary texts, intended to protect the pharaoh's remains and ensure his rebirth in the afterlife. Basically, a 'how to survive death' manual.",
location: "Found in pyramids at Saqqara, Egypt."
    },
    scroll: {
name: "Dead Sea Scrolls",
year: "300 BCE – 100 CE",
description: "Ancient Jewish religious manuscripts found in the Qumran Caves. Include the oldest known surviving manuscripts of the Hebrew Bible. Preserved for 2,000 years in desert caves.",
location: "Discovered near the Dead Sea, now in the Israel Museum."
    }
};

function showArtifactInfo(artifactKey) {
    const artifact = artifacts[artifactKey];
    const infoDiv = document.getElementById('artifactInfo');
    
    infoDiv.innerHTML = `
<div class="row align-items-center">
    <div class="col-md-3 text-center">
<i class="fas fa-${artifactKey === 'rosetta' ? 'stone' : artifactKey === 'code' ? 'balance-scale' : artifactKey === 'pyramid' ? 'monument' : 'scroll'} fa-4x mb-3" 
   style="color: var(--ancient-gold);"></i>
    </div>
    <div class="col-md-9">
<h4 style="color: var(--ancient-gold);">${artifact.name}</h4>
<p><strong>Date:</strong> ${artifact.year}</p>
<p>${artifact.description}</p>
<p><strong>Location:</strong> ${artifact.location}</p>
    </div>
</div>
    `;
    infoDiv.style.display = 'block';
    
    // Scroll to artifact info
    infoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Timeline Controls
document.getElementById('timelineRange').addEventListener('input', function() {
    const year = 4000 - this.value;
    document.getElementById('timelineYear').textContent = year + ' BCE';
    
    // Update timeline items visibility based on year
    const items = document.querySelectorAll('.timeline-item');
    items.forEach(item => {
const itemYear = parseInt(item.querySelector('h6').textContent);
if (itemYear <= year + 500 && itemYear >= year - 500) {
    item.style.opacity = '1';
} else {
    item.style.opacity = '0.3';
}
    });
});

document.getElementById('timelineZoomIn').addEventListener('click', function() {
    const range = document.getElementById('timelineRange');
    range.value = Math.max(500, parseInt(range.value) - 500);
    range.dispatchEvent(new Event('input'));
});

document.getElementById('timelineZoomOut').addEventListener('click', function() {
    const range = document.getElementById('timelineRange');
    range.value = Math.min(3500, parseInt(range.value) + 500);
    range.dispatchEvent(new Event('input'));
});

// Responsive Layout Adjustments
function adjustLayout() {
    const container = document.querySelector('.content-wrapper');
    const sidebar = document.querySelector('.timeline-container');
    
    if (window.innerWidth < 1200) {
if (sidebar && container.contains(sidebar)) {
    container.insertBefore(sidebar, container.firstChild);
}
    }
}

// Touch Device Optimizations
if ('ontouchstart' in window) {
    document.querySelectorAll('.artifact').forEach(artifact => {
artifact.style.padding = '1.8rem 1rem';
artifact.style.margin = '0.5rem 0';
    });
}

// Initialize
window.addEventListener('load', function() {
    createHieroglyphAnimation();
    adjustLayout();
    
    // Auto-scroll timeline on load
    setTimeout(() => {
document.getElementById('timelineRange').value = 2000;
document.getElementById('timelineRange').dispatchEvent(new Event('input'));
    }, 1000);
});

window.addEventListener('resize', adjustLayout);

// Reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.hieroglyph').forEach(glyph => {
glyph.style.animation = 'none';
glyph.style.opacity = '0.1';
    });
}
    </scrip>