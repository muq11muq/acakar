// ===== Cyberpunk Enhanced JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
  initCyberpunkEffects();
  initHolographicAnimations();
  initNeonGlow();
  init3DCards();
  initMatrixRain();
  initCyberSounds();
  initAdvancedParticles();
  initGlitchEffects();
  initHolographicUI();
});

// ===== Cyberpunk Visual Effects =====
function initCyberpunkEffects() {
  // Add cyberpunk loading screen
  createLoadingScreen();
  
  // Initialize neon pulse effects
  document.querySelectorAll('.btn, .logo').forEach(element => {
    element.classList.add('neon-pulse');
  });
  
  // Add scanline effect
  createScanlines();
  
  // Add digital rain background
  initDigitalRain();
}

// ===== Holographic Animations =====
function initHolographicAnimations() {
  // Animate holographic buttons
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.animation = 'holographicShift 0.5s linear infinite';
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.animation = '';
    });
  });
  
  // Add floating animation to cards
  document.querySelectorAll('.property-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`;
    card.classList.add('floating-cyber');
  });
}

// ===== Neon Glow Effects =====
function initNeonGlow() {
  // Add interactive neon glow
  document.querySelectorAll('.property-card, .card').forEach(element => {
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      element.style.setProperty('--mouse-x', `${x}px`);
      element.style.setProperty('--mouse-y', `${y}px`);
      
      // Create dynamic glow effect
      const glow = document.createElement('div');
      glow.className = 'dynamic-glow';
      glow.style.cssText = `
        position: absolute;
        top: ${y}px;
        left: ${x}px;
        width: 100px;
        height: 100px;
        background: radial-gradient(circle, rgba(0, 212, 255, 0.8) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        transform: translate(-50%, -50%);
        animation: glowPulse 1s ease-out forwards;
      `;
      
      element.appendChild(glow);
      setTimeout(() => glow.remove(), 1000);
    });
  });
}

// ===== 3D Card Transformations =====
function init3DCards() {
  document.querySelectorAll('.property-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * 10;
      const rotateY = ((centerX - x) / centerX) * 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ===== Matrix Rain Effect =====
function initMatrixRain() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    opacity: 0.1;
  `;
  
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
  const matrixArray = matrix.split("");
  
  const fontSize = 10;
  const columns = canvas.width / fontSize;
  
  const drops = [];
  for(let x = 0; x < columns; x++) {
    drops[x] = 1;
  }
  
  function drawMatrix() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#00d4ff';
    ctx.font = fontSize + 'px monospace';
    
    for(let i = 0; i < drops.length; i++) {
      const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      
      if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }
  
  setInterval(drawMatrix, 35);
  
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ===== Cyberpunk Sound Effects =====
function initCyberSounds() {
  // Create audio context for sound effects
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Add click sounds to buttons
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => {
      playCyberSound(audioContext, 'click');
    });
  });
  
  // Add hover sounds
  document.querySelectorAll('.property-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      playCyberSound(audioContext, 'hover');
    });
  });
}

function playCyberSound(audioContext, type) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  switch(type) {
    case 'click':
      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.1;
      oscillator.type = 'square';
      break;
    case 'hover':
      oscillator.frequency.value = 1200;
      gainNode.gain.value = 0.05;
      oscillator.type = 'sine';
      break;
  }
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.1);
}

// ===== Advanced Particle System =====
function initAdvancedParticles() {
  const particleContainer = document.createElement('div');
  particleContainer.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  `;
  
  document.body.appendChild(particleContainer);
  
  // Create multiple particle types
  for (let i = 0; i < 50; i++) {
    createAdvancedParticle(particleContainer);
  }
}

function createAdvancedParticle(container) {
  const particle = document.createElement('div');
  particle.className = 'advanced-particle';
  
  const size = Math.random() * 6 + 2;
  const color = ['#00d4ff', '#ff00ff', '#ffff00', '#00ff88'][Math.floor(Math.random() * 4)];
  
  particle.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    background: ${color};
    border-radius: 50%;
    right: ${Math.random() * 100}%;
    top: ${Math.random() * 100}%;
    box-shadow: 0 0 ${size * 2}px ${color};
    animation: particleFloat ${Math.random() * 5 + 5}s linear infinite;
    opacity: ${Math.random() * 0.5 + 0.3};
  `;
  
  container.appendChild(particle);
  
  // Remove and recreate particle after animation
  setTimeout(() => {
    particle.remove();
    createAdvancedParticle(container);
  }, 10000);
}

// ===== Glitch Effects =====
function initGlitchEffects() {
  // Add random glitch to text elements
  setInterval(() => {
    const textElements = document.querySelectorAll('h1, h2, .logo');
    const randomElement = textElements[Math.floor(Math.random() * textElements.length)];
    
    randomElement.classList.add('glitch-effect');
    setTimeout(() => {
      randomElement.classList.remove('glitch-effect');
    }, 200);
  }, 5000);
}

// ===== Holographic UI Components =====
function initHolographicUI() {
  // Create holographic loading bars
  document.querySelectorAll('form').forEach(form => {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        createHolographicLoader(submitBtn);
      });
    }
  });
  
  // Add holographic hover states
  document.querySelectorAll('input, select, textarea').forEach(element => {
    element.addEventListener('focus', () => {
      element.classList.add('holographic-focus');
    });
    
    element.addEventListener('blur', () => {
      element.classList.remove('holographic-focus');
    });
  });
}

// ===== Helper Functions =====
function createLoadingScreen() {
  const loader = document.createElement('div');
  loader.className = 'cyberpunk-loader';
  loader.innerHTML = `
    <div class="loader-container">
      <div class="cyber-logo">🏠 دلال</div>
      <div class="loading-bar">
        <div class="loading-progress"></div>
      </div>
      <div class="loading-text">INITIALIZING CYBER SYSTEM...</div>
    </div>
  `;
  
  loader.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    font-family: 'Orbitron', monospace;
  `;
  
  document.body.appendChild(loader);
  
  // Animate loading progress
  const progress = loader.querySelector('.loading-progress');
  let width = 0;
  
  const interval = setInterval(() => {
    width += Math.random() * 15;
    if (width >= 100) {
      width = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
      }, 500);
    }
    progress.style.width = width + '%';
  }, 100);
}

function createScanlines() {
  const scanlines = document.createElement('div');
  scanlines.className = 'scanlines';
  scanlines.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 2;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 212, 255, 0.03) 2px,
      rgba(0, 212, 255, 0.03) 4px
    );
    animation: scanlines 8s linear infinite;
  `;
  
  document.body.appendChild(scanlines);
}

function initDigitalRain() {
  const rainContainer = document.createElement('div');
  rainContainer.className = 'digital-rain';
  rainContainer.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    opacity: 0.05;
    overflow: hidden;
  `;
  
  document.body.appendChild(rainContainer);
  
  // Create digital rain drops
  for (let i = 0; i < 20; i++) {
    const drop = document.createElement('div');
    drop.style.cssText = `
      position: absolute;
      right: ${Math.random() * 100}%;
      top: -20px;
      color: #00d4ff;
      font-family: monospace;
      font-size: 14px;
      animation: digitalRain ${Math.random() * 3 + 2}s linear infinite;
      animation-delay: ${Math.random() * 2}s;
    `;
    drop.textContent = Math.random() > 0.5 ? '1' : '0';
    
    rainContainer.appendChild(drop);
  }
}

function createHolographicLoader(button) {
  const loader = document.createElement('div');
  loader.className = 'holographic-loader';
  loader.innerHTML = `
    <div class="loader-ring"></div>
    <div class="loader-ring"></div>
    <div class="loader-ring"></div>
  `;
  
  loader.style.cssText = `
    position: absolute;
    top: 50%;
    right: 50%;
    transform: translate(50%, -50%);
    width: 40px;
    height: 40px;
    pointer-events: none;
  `;
  
  button.style.position = 'relative';
  button.appendChild(loader);
  
  setTimeout(() => {
    loader.remove();
  }, 2000);
}

// ===== Add CSS animations dynamically =====
const cyberpunkCSS = `
  @keyframes glowPulse {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
  }
  
  @keyframes floating-cyber {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes particleFloat {
    0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
    10% { opacity: 0.3; }
    90% { opacity: 0.3; }
    100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
  }
  
  @keyframes scanlines {
    0% { transform: translateY(0); }
    100% { transform: translateY(10px); }
  }
  
  @keyframes digitalRain {
    0% { transform: translateY(-20px); }
    100% { transform: translateY(100vh); }
  }
  
  @keyframes glitch-effect {
    0%, 90%, 100% { 
      text-shadow: 0 0 10px rgba(0, 212, 255, 0.8), 0 0 20px rgba(0, 212, 255, 0.6); 
      transform: translate(0);
    }
    92% { 
      text-shadow: -2px 0 #ff00ff, 2px 0 #00ff88; 
      transform: translate(2px, 2px);
    }
    94% { 
      text-shadow: 2px 0 #ff00ff, -2px 0 #00ff88; 
      transform: translate(-2px, -2px);
    }
    96% { 
      text-shadow: 0 0 10px rgba(0, 212, 255, 0.8), 0 0 20px rgba(0, 212, 255, 0.6); 
      transform: translate(0);
    }
  }
  
  .neon-pulse {
    animation: neonPulse 2s ease-in-out infinite alternate;
  }
  
  @keyframes neonPulse {
    0% { filter: brightness(1) drop-shadow(0 0 20px rgba(0, 212, 255, 0.8)); }
    100% { filter: brightness(1.3) drop-shadow(0 0 30px rgba(0, 212, 255, 1)); }
  }
  
  .holographic-focus {
    box-shadow: 0 0 30px rgba(0, 212, 255, 0.6), inset 0 0 20px rgba(0, 212, 255, 0.1);
    border-color: #00d4ff !important;
  }
  
  .loader-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 2px solid transparent;
    border-top-color: #00d4ff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  .loader-ring:nth-child(2) {
    border-top-color: #ff00ff;
    animation-delay: 0.2s;
    width: 80%;
    height: 80%;
    top: 10%;
    right: 10%;
  }
  
  .loader-ring:nth-child(3) {
    border-top-color: #ffff00;
    animation-delay: 0.4s;
    width: 60%;
    height: 60%;
    top: 20%;
    right: 20%;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .cyberpunk-loader .loader-container {
    text-align: center;
    color: #00d4ff;
  }
  
  .cyberpunk-loader .cyber-logo {
    font-size: 3rem;
    font-weight: 900;
    margin-bottom: 2rem;
    text-shadow: 0 0 30px rgba(0, 212, 255, 0.8);
    animation: neonPulse 1s ease-in-out infinite alternate;
  }
  
  .cyberpunk-loader .loading-bar {
    width: 300px;
    height: 4px;
    background: rgba(0, 212, 255, 0.2);
    border-radius: 2px;
    overflow: hidden;
    margin: 0 auto 1rem;
    border: 1px solid rgba(0, 212, 255, 0.5);
  }
  
  .cyberpunk-loader .loading-progress {
    height: 100%;
    background: linear-gradient(90deg, #00d4ff, #ff00ff, #ffff00);
    border-radius: 2px;
    transition: width 0.3s ease;
    box-shadow: 0 0 10px rgba(0, 212, 255, 0.8);
  }
  
  .cyberpunk-loader .loading-text {
    font-size: 0.9rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    animation: blink 1s infinite;
  }
  
  @keyframes blink {
    0%, 50%, 100% { opacity: 1; }
    25%, 75% { opacity: 0.5; }
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = cyberpunkCSS;
document.head.appendChild(styleSheet);

// ===== Export functions =====
window.createHolographicLoader = createHolographicLoader;
window.playCyberSound = playCyberSound;
