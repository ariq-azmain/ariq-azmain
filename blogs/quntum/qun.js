// Initialize variables
 let observations = 0;
 let collapses = 0;
 let entanglements = 0;
 let qubitCount = 5;
 
 // Generate qubit particles
 function generateQubits() {
     const container = document.getElementById('qubitAnimation');
     container.innerHTML = '';
     
     for (let i = 0; i < qubitCount; i++) {
  const qubit = document.createElement('div');
  qubit.className = 'qubit-particle';
  
  // Random position
  const x = Math.random() * 90 + 5;
  const y = Math.random() * 80 + 10;
  qubit.style.left = `${x}%`;
  qubit.style.top = `${y}%`;
  
  // Random animation
  const duration = Math.random() * 5 + 3;
  const delay = Math.random() * 2;
  qubit.style.animation = `float ${duration}s infinite alternate ease-in-out ${delay}s`;
  
  container.appendChild(qubit);
  
  // Add floating animation
  const style = document.createElement('style');
  style.textContent = `
      @keyframes float {
   0% { transform: translate(0, 0) scale(1); opacity: 0.7; }
   25% { transform: translate(${Math.random()*50}px, ${Math.random()*50}px) scale(1.2); opacity: 1; }
   50% { transform: translate(${Math.random()*50}px, ${Math.random()*50}px) scale(0.9); opacity: 0.8; }
   75% { transform: translate(${Math.random()*50}px, ${Math.random()*50}px) scale(1.1); opacity: 0.9; }
   100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
      }
  `;
  document.head.appendChild(style);
     }
 }
 
 // Observe quantum state
 document.getElementById('observeBtn').addEventListener('click', function() {
     observations++;
     collapses++;
     
     const states = ['|0⟩', '|1⟩', '|+⟩', '|-⟩', 'Superposition maintained!', 'Wave function collapsed to |0⟩', 'Wave function collapsed to |1⟩'];
     const result = states[Math.floor(Math.random() * states.length)];
     
     document.getElementById('collapseResult').textContent = `Observation ${observations}: ${result}`;
     document.getElementById('collapseAlert').style.display = 'block';
     
     // Update counters
     document.getElementById('observationCount').textContent = observations;
     document.getElementById('collapseCount').textContent = collapses;
     document.getElementById('confusionLevel').textContent = Math.floor(Math.random() * 100) + 50;
     
     // Animate button
     this.innerHTML = '<i class="fas fa-sync fa-spin me-2"></i>Observing...';
     setTimeout(() => {
  this.innerHTML = '<i class="fas fa-eye me-2"></i>Observe Quantum State';
     }, 800);
     
     // Regenerate qubits with different pattern
     setTimeout(generateQubits, 300);
 });
 
 // Entangle qubits
 document.getElementById('entangleBtn').addEventListener('click', function() {
     entanglements++;
     document.getElementById('entanglementCount').textContent = entanglements;
     document.getElementById('confusionLevel').textContent = '∞';
     
     // Create entanglement effect
     const particles = document.querySelectorAll('.qubit-particle');
     particles.forEach(particle => {
  particle.style.background = 'radial-gradient(circle at 30% 30%, #FF66B2, #FF0066)';
  particle.style.boxShadow = '0 0 30px #FF66B2';
     });
     
     // Show entanglement message
     document.getElementById('stateDisplay').innerHTML = 
  '|ψ⟩ = (1/√2)(|00⟩ + |11⟩) <span class="text-success">[ENTANGLED]</span>';
     
     this.innerHTML = '<i class="fas fa-check me-2"></i>Qubits Entangled!';
     setTimeout(() => {
  this.innerHTML = '<i class="fas fa-link me-2"></i>Entangle Qubits';
     }, 1500);
 });
 
 // Qubit slider
 document.getElementById('qubitSlider').addEventListener('input', function() {
     qubitCount = this.value;
     document.getElementById('qubitCount').textContent = qubitCount;
     generateQubits();
 });
 
 // Timeline progress animation
 window.addEventListener('load', function() {
     const timelineProgress = document.getElementById('timelineProgress');
     let width = 0;
     const interval = setInterval(() => {
  if (width >= 85) {
      clearInterval(interval);
      timelineProgress.style.width = '85%';
  } else {
      width++;
      timelineProgress.style.width = width + '%';
  }
     }, 20);
     
     // Initialize qubits
     generateQubits();
     
     // Update confusion level randomly
     setInterval(() => {
  const confusion = document.getElementById('confusionLevel');
  if (confusion.textContent !== '∞') {
      const current = parseInt(confusion.textContent);
      confusion.textContent = Math.min(999, current + Math.floor(Math.random() * 10) - 3);
  }
     }, 3000);
 });
