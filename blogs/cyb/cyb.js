// Matrix Rain Effect
function createMatrixRain() {
    const container = document.getElementById('matrixRain');
    const characters = '01';
    const drops = [];
    
    for (let i = 0; i < 100; i++) {
const drop = document.createElement('div');
drop.style.position = 'absolute';
drop.style.color = 'rgba(0, 255, 0, 0.3)';
drop.style.fontSize = '14px';
drop.style.left = Math.random() * 100 + '%';
drop.style.top = '-20px';
drop.style.animation = `fall ${Math.random() * 3 + 2}s linear infinite`;
drop.style.animationDelay = Math.random() * 5 + 's';
drop.textContent = characters[Math.floor(Math.random() * characters.length)];
container.appendChild(drop);

// Add animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
to { transform: translateY(100vh); }
    }
`;
document.head.appendChild(style);
    }
}

// Password Strength Checker
document.getElementById('passwordInput').addEventListener('input', function() {
    const password = this.value;
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 10;
    
    // Complexity checks
    if (/[a-z]/.test(password)) strength += 10;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    // Common password penalty
    const common = ['password', '123456', 'qwerty', 'letmein', 'welcome'];
    if (common.some(c => password.toLowerCase().includes(c))) strength = Math.max(10, strength - 30);
    
    // Update meter
    document.getElementById('passwordStrength').style.width = Math.min(100, strength) + '%';
    
    // Color based on strength
    const meter = document.getElementById('passwordStrength');
    if (strength < 30) {
meter.style.background = 'linear-gradient(90deg, #ff0000, #ff4444)';
    } else if (strength < 70) {
meter.style.background = 'linear-gradient(90deg, #ff8800, #ffaa44)';
    } else {
meter.style.background = 'linear-gradient(90deg, #00ff00, #44ff44)';
    }
});

// Encryption Animation
function createEncryptionAnimation() {
    const container = document.getElementById('encryptionDemo');
    container.innerHTML = '';
    
    for (let i = 0; i < 50; i++) {
const bit = document.createElement('div');
bit.className = 'data-bit';
bit.style.left = '0%';
bit.style.top = Math.random() * 140 + 'px';
bit.style.animationDelay = Math.random() * 3 + 's';
bit.style.animationDuration = Math.random() * 2 + 2 + 's';
container.appendChild(bit);
    }
}

// Hacker Simulator
let hackAttempts = 0;
let successfulHacks = 0;
let failedHacks = 0;
let securityLevel = 85;

document.getElementById('hackBtn').addEventListener('click', function() {
    hackAttempts++;
    document.getElementById('hackAttempts').textContent = hackAttempts;
    
    const terminal = document.getElementById('hackerTerminal');
    const target = document.getElementById('targetSelect').value;
    
    let successChance;
    let message;
    
    switch(target) {
case 'home-pc':
    successChance = 0.7;
    message = 'Target: Home PC (Windows 7, no updates since 2015)';
    break;
case 'company-server':
    successChance = 0.4;
    message = 'Target: Company Server (IT department takes coffee breaks seriously)';
    break;
case 'government-db':
    successChance = 0.05;
    message = 'Target: Government Database (Protected by men in black suits)';
    break;
    }
    
    // Add to terminal
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.textContent = `$ Attempting to hack ${target}...`;
    terminal.appendChild(line);
    
    // Simulate hack attempt
    setTimeout(() => {
const success = Math.random() < successChance;
const resultLine = document.createElement('div');

if (success) {
    successfulHacks++;
    document.getElementById('successfulHacks').textContent = successfulHacks;
    securityLevel = Math.max(10, securityLevel - 10);
    resultLine.textContent = '$ SUCCESS: Access granted! (This is a simulation)';
    resultLine.style.color = '#ff0000';
} else {
    failedHacks++;
    document.getElementById('failedHacks').textContent = failedHacks;
    securityLevel = Math.min(95, securityLevel + 5);
    resultLine.textContent = '$ FAILED: Firewall blocked the attempt';
    resultLine.style.color = '#00ff00';
}

terminal.appendChild(resultLine);
document.getElementById('securityLevel').textContent = securityLevel + '%';
terminal.scrollTop = terminal.scrollHeight;

// Button animation
this.innerHTML = '<i class="fas fa-sync fa-spin me-2"></i>Hacking...';
setTimeout(() => {
    this.innerHTML = '<i class="fas fa-skull-crossbones me-2"></i>Attempt Hack';
}, 1000);
    }, 1500);
});

document.getElementById('defendBtn').addEventListener('click', function() {
    securityLevel = Math.min(100, securityLevel + 15);
    document.getElementById('securityLevel').textContent = securityLevel + '%';
    
    const terminal = document.getElementById('hackerTerminal');
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.textContent = '$ Defense systems upgraded!';
    line.style.color = '#00ff00';
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
    
    this.innerHTML = '<i class="fas fa-check me-2"></i>Defenses Upgraded!';
    setTimeout(() => {
this.innerHTML = '<i class="fas fa-shield-alt me-2"></i>Strengthen Defenses';
    }, 1500);
});

// Initialize
window.addEventListener('load', function() {
    createMatrixRain();
    createEncryptionAnimation();
    
    // Auto-add some terminal lines
    const terminal = document.getElementById('hackerTerminal');
    const commands = [
"$ Scanning network...",
"$ Found 3 vulnerable systems",
"$ Running vulnerability assessment...",
"$ Remember: Only hack systems you own!",
"$ Type 'start' to begin simulation"
    ];
    
    let i = 0;
    const interval = setInterval(() => {
if (i < commands.length) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.textContent = commands[i];
    terminal.appendChild(line);
    i++;
    terminal.scrollTop = terminal.scrollHeight;
} else {
    clearInterval(interval);
}
    }, 800);
});