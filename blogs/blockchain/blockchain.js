// Chain Animation
function createChainAnimation() {
    const container = document.getElementById('chainAnimation');
    const chainCount = 20;
    
    for (let i = 0; i < chainCount; i++) {
const link = document.createElement('div');
link.style.position = 'absolute';
link.style.width = '40px';
link.style.height = '40px';
link.style.border = '2px solid rgba(0, 102, 204, 0.3)';
link.style.borderRadius = '50%';
link.style.left = Math.random() * 100 + '%';
link.style.top = Math.random() * 100 + '%';
link.style.animation = `chainFloat ${Math.random() * 5 + 3}s infinite alternate ease-in-out`;
link.style.animationDelay = Math.random() * 3 + 's';
container.appendChild(link);

// Add animation style
const style = document.createElement('style');
style.textContent = `
    @keyframes chainFloat {
0% { transform: translate(0, 0) rotate(0deg); }
100% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(360deg); }
    }
`;
document.head.appendChild(style);
    }
}

// Block Adding System
let blockCount = 3;
document.getElementById('addBlockBtn').addEventListener('click', function() {
    blockCount++;
    const progress = (blockCount / 10) * 100;
    document.getElementById('blockProgress').style.width = Math.min(100, progress) + '%';
    
    // Add new block visually
    const blockVisual = document.querySelector('.block-visual');
    const newBlock = document.createElement('div');
    newBlock.className = 'block';
    newBlock.innerHTML = `
<h6>Block #${blockCount}</h6>
<small>Contains: ${blockCount * 1500} transactions<br>Hash: ${generateRandomHash()}</small>
    `;
    blockVisual.insertBefore(newBlock, blockVisual.querySelector('.progress-chain'));
    
    // Animate button
    this.innerHTML = '<i class="fas fa-sync fa-spin me-2"></i>Adding Block...';
    setTimeout(() => {
this.innerHTML = '<i class="fas fa-plus-circle me-2"></i>Add New Block';
    }, 1000);
    
    // Update block number in mining simulator
    document.getElementById('blockNumber').textContent = 789123 + blockCount;
});

// Mining Simulator
let blocksMined = 0;
let bitcoinEarned = 0;
let energyUsed = 0;
let isMining = false;
let miningInterval;

document.getElementById('mineBtn').addEventListener('click', function() {
    if (isMining) {
stopMining();
this.innerHTML = '<i class="fas fa-hammer me-2"></i>Start Mining';
return;
    }
    
    isMining = true;
    this.innerHTML = '<i class="fas fa-stop-circle me-2"></i>Stop Mining';
    
    const miningPower = parseInt(document.getElementById('miningSlider').value);
    let attempts = 0;
    
    miningInterval = setInterval(() => {
attempts++;
energyUsed += miningPower * 0.001;

document.getElementById('attemptCount').textContent = attempts;
document.getElementById('energyUsed').textContent = energyUsed.toFixed(2);
document.getElementById('miningStatus').textContent = 'Mining...';
document.getElementById('miningStatus').style.color = '#ff9900';

// Random chance of finding a block
if (Math.random() < 0.01 * miningPower / 10) {
    blocksMined++;
    bitcoinEarned += 6.25;
    
    document.getElementById('blocksMined').textContent = blocksMined;
    document.getElementById('bitcoinEarned').textContent = bitcoinEarned.toFixed(2);
    document.getElementById('miningStatus').textContent = 'BLOCK FOUND! +6.25 BTC';
    document.getElementById('miningStatus').style.color = '#00cc66';
    
    // Update block number
    const currentBlock = parseInt(document.getElementById('blockNumber').textContent);
    document.getElementById('blockNumber').textContent = currentBlock + 1;
    
    // Flash animation
    document.getElementById('miningOutput').style.animation = 'flashGreen 0.5s';
    setTimeout(() => {
document.getElementById('miningOutput').style.animation = '';
    }, 500);
    
    // Add to blockchain visual
    blockCount++;
    const progress = (blockCount / 10) * 100;
    document.getElementById('blockProgress').style.width = Math.min(100, progress) + '%';
}

// Update hash display occasionally
if (attempts % 10 === 0) {
    document.getElementById('miningOutput').innerHTML = `
Mining block #<span id="blockNumber">${document.getElementById('blockNumber').textContent}</span>...
<br>Target: 0000000000000000000${generateRandomHash().substring(0, 10)}...
<br>Attempts: <span id="attemptCount">${attempts}</span>
<br>Status: <span id="miningStatus">${document.getElementById('miningStatus').textContent}</span>
    `;
}
    }, 100);
});

document.getElementById('resetMineBtn').addEventListener('click', function() {
    stopMining();
    blocksMined = 0;
    bitcoinEarned = 0;
    energyUsed = 0;
    
    document.getElementById('blocksMined').textContent = '0';
    document.getElementById('bitcoinEarned').textContent = '0';
    document.getElementById('energyUsed').textContent = '0';
    document.getElementById('attemptCount').textContent = '0';
    document.getElementById('miningStatus').textContent = 'Ready';
    document.getElementById('miningStatus').style.color = '#ffffff';
    
    document.getElementById('mineBtn').innerHTML = '<i class="fas fa-hammer me-2"></i>Start Mining';
});

function stopMining() {
    isMining = false;
    clearInterval(miningInterval);
}

document.getElementById('miningSlider').addEventListener('input', function() {
    document.getElementById('miningPower').textContent = this.value;
});

// Helper Functions
function generateRandomHash() {
    const chars = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 64; i++) {
hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
}

// Add flash animation
const style = document.createElement('style');
style.textContent = `
    @keyframes flashGreen {
0%, 100% { background-color: #000; }
50% { background-color: rgba(0, 204, 102, 0.3); }
    }
`;
document.head.appendChild(style);

// Initialize
window.addEventListener('load', function() {
    createChainAnimation();
});