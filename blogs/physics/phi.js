
// ===== মোবাইল টোগল সিস্টেম =====
document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('mobileToggle');
    const toggleLabel = document.getElementById('toggleLabel');
    const projectsSection = document.getElementById('projectsSection');
    const projectsGrid = document.getElementById('projectsGrid');
    const showMoreBtn = document.getElementById('showMoreBtn');
    
    let isExpanded = false;
    
    // চেক করি যদি মোবাইল ডিভাইস হয়
    function isMobileDevice() {
return window.innerWidth <= 768;
    }
    
    // টগল ফাংশন
    function toggleProjects() {
if (isMobileDevice()) {
    if (isExpanded) {
// কোলাপ্স করি
projectsSection.classList.add('projects-collapsed');
toggleBtn.innerHTML = '<i class="fas fa-expand-alt"></i>';
toggleLabel.textContent = 'Expand Projects';
isExpanded = false;

// স্ক্রল টপে নিয়ে যাই
projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
// এক্সপান্ড করি
projectsSection.classList.remove('projects-collapsed');
toggleBtn.innerHTML = '<i class="fas fa-compress-alt"></i>';
toggleLabel.textContent = 'Collapse Projects';
isExpanded = true;
    }
}
    }
    
    // টগল বাটনে ইভেন্ট যোগ করি
    if (toggleBtn) {
toggleBtn.addEventListener('click', toggleProjects);
    }
    
    // প্রারম্ভিকভাবে মোবাইলে কোলাপ্স করে রাখি
    if (isMobileDevice()) {
projectsSection.classList.add('projects-collapsed');
isExpanded = false;
    }
    
    // রিসাইজ ইভেন্টে আপডেট করি
    window.addEventListener('resize', function() {
if (!isMobileDevice()) {
    // ডেস্কটপে সবসময় এক্সপান্ডেড
    projectsSection.classList.remove('projects-collapsed');
    isExpanded = true;
    toggleLabel.textContent = 'Projects Expanded';
    toggleBtn.innerHTML = '<i class="fas fa-compress-alt"></i>';
} else {
    // মোবাইলে পূর্বের স্টেটে রাখি
    if (!isExpanded) {
projectsSection.classList.add('projects-collapsed');
toggleBtn.innerHTML = '<i class="fas fa-expand-alt"></i>';
toggleLabel.textContent = 'Expand Projects';
    }
}
    });
    
    // ===== ব্যাকগ্রাউন্ড এনিমেশন জেনারেটর =====
    createPhysicsBackground();
    
    // ===== ফিজিক্স প্রজেক্ট ইনিশিয়ালাইজ =====
    drawQuantumWave();
    initGravitySimulation();
    initDoubleSlit();
    drawRelativity();
    createQuantumChart();
});

// ===== ব্যাকগ্রাউন্ড এনিমেশন জেনারেটর =====
function createPhysicsBackground() {
    const background = document.getElementById('physicsBackground');
    if (!background) return;
    
    // পার্টিকেল তৈরি
    for (let i = 0; i < 30; i++) {
const particle = document.createElement('div');
particle.className = 'particle';
const size = Math.random() * 4 + 2;
particle.style.width = `${size}px`;
particle.style.height = `${size}px`;
particle.style.left = `${Math.random() * 100}%`;
particle.style.top = `${Math.random() * 100}%`;
particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
particle.style.animationDelay = `${Math.random() * 5}s`;
background.appendChild(particle);
    }
    
    // ওয়েভ তৈরি
    for (let i = 0; i < 5; i++) {
const wave = document.createElement('div');
wave.className = 'wave';
wave.style.width = `${Math.random() * 150 + 80}px`;
wave.style.top = `${Math.random() * 100}%`;
wave.style.animationDuration = `${Math.random() * 30 + 15}s`;
wave.style.opacity = Math.random() * 0.08 + 0.03;
background.appendChild(wave);
    }
}

// ===== কোয়ান্টাম ওয়েভ ফাংশন ভিজুয়ালাইজার =====
let quantumAnimation = null;
let quantumTime = 0;

function drawQuantumWave() {
    const canvas = document.getElementById('quantumCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    const n = parseInt(document.getElementById('energySlider').value);
    
    ctx.clearRect(0, 0, width, height);
    
    // গ্রিড আঁকা
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.2)';
    ctx.lineWidth = 1;
    
    // এক্স-অক্ষ
    ctx.beginPath();
    ctx.moveTo(0, height/2);
    ctx.lineTo(width, height/2);
    ctx.stroke();
    
    // ওয়েভ ফাংশন আঁকা
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let x = 0; x < width; x++) {
const xNorm = (x / width) * 4 * Math.PI - 2 * Math.PI;
const psi = 0.6 * Math.sin(n * xNorm) * Math.sin(quantumTime * 2);
const y = height/2 - psi * 40;

if (x === 0) {
    ctx.moveTo(x, y);
} else {
    ctx.lineTo(x, y);
}
    }
    
    ctx.stroke();
    
    // টেক্সট আপডেট
    document.getElementById('energyValue').textContent = n;
    
    if (quantumAnimation) {
quantumTime += 0.05;
requestAnimationFrame(drawQuantumWave);
    }
}

function animateQuantum() {
    if (quantumAnimation) {
clearInterval(quantumAnimation);
quantumAnimation = null;
return;
    }
    
    quantumAnimation = setInterval(() => {
quantumTime += 0.05;
drawQuantumWave();
    }, 50);
}

function resetQuantum() {
    document.getElementById('energySlider').value = 1;
    if (quantumAnimation) {
clearInterval(quantumAnimation);
quantumAnimation = null;
    }
    quantumTime = 0;
    drawQuantumWave();
}

// ===== গ্র্যাভিটি সিমুলেশন =====
let planets = [];
let gravityAnimation = null;

function initGravitySimulation() {
    const canvas = document.getElementById('gravityCanvas');
    if (!canvas) return;
    
    // সূর্য যোগ করুন
    planets = [
{x: canvas.width/2, y: canvas.height/2, vx: 0, vy: 0, mass: 100, radius: 12, color: '#fbbf24'}
    ];
    
    // শুরুর জন্য একটি গ্রহ যোগ করুন
    addPlanetAt(canvas.width/2 + 80, canvas.height/2, 0, 1.5, 5, '#00d4ff');
    
    drawGravity();
}

function addPlanet() {
    const canvas = document.getElementById('gravityCanvas');
    if (!canvas) return;
    
    const mass = Math.random() * 8 + 2;
    const radius = Math.sqrt(mass) * 2;
    const colors = ['#00d4ff', '#9d4edd', '#4ade80'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // এলোমেলো অবস্থানে গ্রহ যোগ করুন
    const x = Math.random() * (canvas.width - 80) + 40;
    const y = Math.random() * (canvas.height - 80) + 40;
    
    // কক্ষপথের বেগ গণনা করুন
    const dx = canvas.width/2 - x;
    const dy = canvas.height/2 - y;
    const distance = Math.sqrt(dx*dx + dy*dy);
    const speed = Math.sqrt(100 / distance) * 0.7;
    
    // স্পর্শক বেগ
    const vx = -dy/distance * speed;
    const vy = dx/distance * speed;
    
    addPlanetAt(x, y, vx, vy, mass, color);
}

function addPlanetAt(x, y, vx, vy, mass, color) {
    const radius = Math.sqrt(mass) * 2;
    planets.push({x, y, vx, vy, mass, radius, color});
    
    if (!gravityAnimation) {
startGravityAnimation();
    }
}

function startGravityAnimation() {
    if (gravityAnimation) return;
    
    gravityAnimation = setInterval(updateGravity, 40);
}

function updateGravity() {
    const canvas = document.getElementById('gravityCanvas');
    if (!canvas) return;
    
    const G = 0.4;
    
    // প্রতিটি গ্রহের জন্য বল গণনা করুন
    for (let i = 0; i < planets.length; i++) {
let fx = 0, fy = 0;

for (let j = 0; j < planets.length; j++) {
    if (i === j) continue;
    
    const dx = planets[j].x - planets[i].x;
    const dy = planets[j].y - planets[i].y;
    const distance = Math.sqrt(dx*dx + dy*dy);
    
    if (distance < planets[i].radius + planets[j].radius) continue;
    
    const force = G * planets[i].mass * planets[j].mass / (distance * distance);
    fx += force * dx / distance;
    fy += force * dy / distance;
}

planets[i].vx += fx / planets[i].mass;
planets[i].vy += fy / planets[i].mass;
    }
    
    // অবস্থান আপডেট করুন
    for (let i = 0; i < planets.length; i++) {
planets[i].x += planets[i].vx;
planets[i].y += planets[i].vy;

// সীমানা চেক করুন
if (planets[i].x < 0 || planets[i].x > canvas.width ||
    planets[i].y < 0 || planets[i].y > canvas.height) {
    planets[i].vx *= -0.5;
    planets[i].vy *= -0.5;
    
    if (planets[i].x < 0) planets[i].x = 0;
    if (planets[i].x > canvas.width) planets[i].x = canvas.width;
    if (planets[i].y < 0) planets[i].y = 0;
    if (planets[i].y > canvas.height) planets[i].y = canvas.height;
}
    }
    
    drawGravity();
}

function drawGravity() {
    const canvas = document.getElementById('gravityCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // গ্রহ আঁকুন
    for (let i = 0; i < planets.length; i++) {
ctx.fillStyle = planets[i].color;
ctx.beginPath();
ctx.arc(planets[i].x, planets[i].y, planets[i].radius, 0, Math.PI * 2);
ctx.fill();
    }
}

function clearPlanets() {
    planets = planets.slice(0, 1);
    if (gravityAnimation) {
clearInterval(gravityAnimation);
gravityAnimation = null;
    }
    drawGravity();
}

// ===== ডাবল-স্লিট এক্সপেরিমেন্ট =====
function initDoubleSlit() {
    drawDoubleSlit();
}

function drawDoubleSlit() {
    const canvas = document.getElementById('doubleSlitCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // ডাবল স্লিট ব্যারিয়ার আঁকুন
    ctx.fillStyle = 'rgba(100, 100, 100, 0.8)';
    ctx.fillRect(width/2 - 4, 0, 8, height);
    
    // স্লিট আঁকুন
    ctx.fillStyle = 'black';
    const slitSpacing = 30;
    const slitWidth = 8;
    
    ctx.fillRect(width/2 - slitSpacing/2 - slitWidth, 40, slitWidth, 25);
    ctx.fillRect(width/2 + slitSpacing/2, 40, slitWidth, 25);
    
    // পার্টিকেল আঁকুন
    const particleCount = parseInt(document.getElementById('particleSlider').value);
    
    for (let i = 0; i < Math.min(particleCount, 80); i++) {
const x = Math.random() * width;
const y = Math.random() * height;

if (x > width/2 - slitSpacing/2 - slitWidth && x < width/2 - slitSpacing/2 ||
    x > width/2 + slitSpacing/2 && x < width/2 + slitSpacing/2 + slitWidth) {
    if (y > 40 && y < 65) {
ctx.fillStyle = '#00d4ff';
ctx.beginPath();
ctx.arc(x, y, 1.5, 0, Math.PI * 2);
ctx.fill();
    }
}
    }
    
    // ক্যাপশন আপডেট করুন
    document.getElementById('particleCount').textContent = particleCount;
}

// ===== রিলেটিভিটি ভিজুয়ালাইজার =====
function drawRelativity() {
    const canvas = document.getElementById('relativityCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    const velocity = parseInt(document.getElementById('velocitySlider').value) / 100;
    const gamma = 1 / Math.sqrt(1 - velocity * velocity);
    const lengthFactor = 1 / gamma;
    
    ctx.clearRect(0, 0, width, height);
    
    // রেস্ট ফ্রেম আঁকুন
    ctx.fillStyle = 'rgba(157, 78, 221, 0.3)';
    ctx.fillRect(30, 40, 80, 80);
    ctx.strokeStyle = '#9d4edd';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 40, 80, 80);
    
    // মুভিং ফ্রেম আঁকুন
    ctx.fillStyle = 'rgba(0, 212, 255, 0.3)';
    const movingX = 150 + velocity * 30;
    const movingWidth = 80 * lengthFactor;
    ctx.fillRect(movingX, 40, movingWidth, 80);
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(movingX, 40, movingWidth, 80);
    
    // মান আপডেট করুন
    document.getElementById('velocityValue').textContent = (velocity * 100).toFixed(0);
}

// ===== কোয়ান্টাম থিওরি টাইমলাইন চার্ট =====
function createQuantumChart() {
    const canvas = document.getElementById('quantumChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // সরল চার্ট আঁকি
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // গ্রিড লাইন
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
    ctx.lineWidth = 1;
    
    // এক্স-অক্ষ
    ctx.beginPath();
    ctx.moveTo(20, height - 20);
    ctx.lineTo(width - 20, height - 20);
    ctx.stroke();
    
    // ওয়েভ আঁকি
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let x = 20; x < width - 20; x++) {
const xNorm = (x - 20) / (width - 40);
const y = height - 40 - Math.sin(xNorm * Math.PI * 3) * 30 + 
 Math.cos(xNorm * Math.PI * 1.5) * 15;

if (x === 20) {
    ctx.moveTo(x, y);
} else {
    ctx.lineTo(x, y);
}
    }
    
    ctx.stroke();
    
    // পয়েন্ট আঁকি
    const points = [0.1, 0.25, 0.4, 0.6, 0.8, 0.95];
    const labels = ['1900', '1920', '1940', '1970', '1990', '2020'];
    
    ctx.fillStyle = '#9d4edd';
    
    for (let i = 0; i < points.length; i++) {
const x = 20 + points[i] * (width - 40);
const y = height - 40 - Math.sin(points[i] * Math.PI * 3) * 30 + 
 Math.cos(points[i] * Math.PI * 1.5) * 15;

ctx.beginPath();
ctx.arc(x, y, 4, 0, Math.PI * 2);
ctx.fill();

// লেবেল
ctx.fillStyle = '#cbd5e1';
ctx.font = '10px Arial';
ctx.fillText(labels[i], x - 10, height - 5);
ctx.fillStyle = '#9d4edd';
    }
}

// ===== ইভেন্ট লিসেনার =====
// স্লাইডার ইভেন্ট
const energySlider = document.getElementById('energySlider');
const particleSlider = document.getElementById('particleSlider');
const velocitySlider = document.getElementById('velocitySlider');

if (energySlider) energySlider.addEventListener('input', drawQuantumWave);
if (particleSlider) particleSlider.addEventListener('input', drawDoubleSlit);
if (velocitySlider) velocitySlider.addEventListener('input', drawRelativity);