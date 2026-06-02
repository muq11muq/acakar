// ===== Smooth & Eye-Friendly JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
  initSmoothAnimations();
  initGentleInteractions();
  initComfortableScrolling();
  initSoftMicroInteractions();
  initEyeFriendlyFeatures();
  initPolishedUI();
});

// ===== Smooth Animations =====
function initSmoothAnimations() {
  // Gentle scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Stagger animations for multiple elements
        if (entry.target.classList.contains('property-card')) {
          const cards = document.querySelectorAll('.property-card.visible');
          cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.15}s`;
          });
        }
      }
    });
  }, observerOptions);

  // Observe elements with scroll animations
  document.querySelectorAll('.scroll-animate').forEach(el => {
    observer.observe(el);
  });
}

// ===== Gentle Interactions =====
function initGentleInteractions() {
  // Smooth hover effects
  document.querySelectorAll('.btn, .property-card, .card').forEach(element => {
    element.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
    
    element.addEventListener('mouseleave', function() {
      this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
  });

  // Gentle navbar scroll
  let lastScrollY = window.scrollY;
  const navbar = document.querySelector('.navbar');
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
      navbar.style.background = 'rgba(255, 255, 255, 0.98)';
      navbar.style.backdropFilter = 'blur(16px)';
      navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
    } else {
      navbar.style.background = 'rgba(255, 255, 255, 0.95)';
      navbar.style.backdropFilter = 'blur(12px)';
      navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }

    // Gentle hide/show on scroll
    if (currentScrollY > lastScrollY && currentScrollY > 300) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }

    lastScrollY = currentScrollY;
  });
}

// ===== Comfortable Scrolling =====
function initComfortableScrolling() {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // Parallax effect for hero section (subtle)
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallax = scrolled * 0.3;
      
      hero.style.transform = `translateY(${parallax}px)`;
    });
  }
}

// ===== Soft Micro-interactions =====
function initSoftMicroInteractions() {
  // Form focus effects
  const formInputs = document.querySelectorAll('input, select, textarea');
  
  formInputs.forEach(input => {
    // Gentle focus effect
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
      input.style.transform = 'scale(1.02)';
    });

    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
      input.style.transform = 'scale(1)';
    });

    // Validation feedback
    input.addEventListener('input', () => {
      if (input.checkValidity()) {
        input.style.borderColor = 'var(--success)';
      } else if (input.value.length > 0) {
        input.style.borderColor = 'var(--danger)';
      } else {
        input.style.borderColor = 'var(--border)';
      }
    });
  });

  // Button click feedback
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      // Create ripple effect
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

// ===== Eye-Friendly Features =====
function initEyeFriendlyFeatures() {
  // Reading mode indicator
  let readingMode = false;
  
  // Create reading mode toggle
  const readingToggle = document.createElement('button');
  readingToggle.innerHTML = '📖';
  readingToggle.title = 'وضع القراءة';
  readingToggle.style.cssText = `
    position: fixed;
    bottom: 2rem;
    left: 2rem;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: var(--gradient-primary);
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  document.body.appendChild(readingToggle);
  
  readingToggle.addEventListener('click', () => {
    readingMode = !readingMode;
    document.body.classList.toggle('reading-mode');
    
    if (readingMode) {
      document.body.style.cssText += `
        font-size: 18px;
        line-height: 1.8;
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
      `;
      readingToggle.innerHTML = '🔍';
      readingToggle.title = 'وضع العرض';
    } else {
      document.body.style.cssText = document.body.style.cssText.replace(/font-size:.*?;/, '').replace(/line-height:.*?;/, '').replace(/max-width:.*?;/, '').replace(/margin:.*?;/, '').replace(/padding:.*?;/, '');
      readingToggle.innerHTML = '📖';
      readingToggle.title = 'وضع القراءة';
    }
    
    // Add animation
    readingToggle.style.transform = 'scale(1.2) rotate(360deg)';
    setTimeout(() => {
      readingToggle.style.transform = 'scale(1) rotate(0deg)';
    }, 300);
  });

  // Eye strain reminder
  let eyeStrainTimer;
  
  function startEyeStrainReminder() {
    eyeStrainTimer = setTimeout(() => {
      showEyeStrainReminder();
    }, 20 * 60 * 1000); // 20 minutes
  }
  
  function showEyeStrainReminder() {
    const reminder = document.createElement('div');
    reminder.innerHTML = `
      <div style="text-align: center;">
        <div style="font-size: 2rem; margin-bottom: 1rem;">👁️</div>
        <h3 style="margin-bottom: 0.5rem;">وقت الراحة!</h3>
        <p style="margin-bottom: 1rem;">خذ استراحة لراحة عينيك</p>
        <button onclick="this.parentElement.parentElement.remove()" style="padding: 0.5rem 1rem; border: none; border-radius: 8px; background: var(--primary); color: white; cursor: pointer;">حسناً</button>
      </div>
    `;
    reminder.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 2rem;
      border-radius: 16px;
      box-shadow: var(--shadow-lg);
      z-index: 10000;
      text-align: center;
      min-width: 300px;
    `;
    
    document.body.appendChild(reminder);
    
    // Auto remove after 10 seconds
    setTimeout(() => {
      if (reminder.parentElement) {
        reminder.remove();
      }
    }, 10000);
    
    // Restart timer
    startEyeStrainReminder();
  }
  
  startEyeStrainReminder();
}

// ===== Polished UI =====
function initPolishedUI() {
  // Smooth page transitions
  document.querySelectorAll('a:not([href^="#"])').forEach(link => {
    link.addEventListener('click', function(e) {
      if (this.hostname === window.location.hostname) {
        e.preventDefault();
        
        // Add fade out effect
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease-out';
        
        setTimeout(() => {
          window.location.href = this.href;
        }, 300);
      }
    });
  });

  // Image lazy loading with fade in
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('fade-in');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));

  // Enhanced search functionality
  const searchInputs = document.querySelectorAll('input[type="search"], input[placeholder*="بحث"], input[placeholder*="الموقع"]');
  
  searchInputs.forEach(input => {
    let timeout;
    
    input.addEventListener('input', () => {
      clearTimeout(timeout);
      const query = input.value.trim();
      
      if (query.length > 2) {
        timeout = setTimeout(() => {
          showSearchSuggestions(input, query);
        }, 300);
      } else {
        hideSearchSuggestions(input);
      }
    });

    input.addEventListener('blur', () => {
      setTimeout(() => hideSearchSuggestions(input), 200);
    });
  });
}

// ===== Search Suggestions =====
function showSearchSuggestions(input, query) {
  // Sample suggestions - in real app, this would come from API
  const locations = ['بغداد', 'البصرة', 'أربيل', 'السليمانية', 'دهوك', 'النجف', 'كربلاء', 'الديوانية'];
  const suggestions = locations.filter(loc => loc.includes(query));
  
  if (suggestions.length > 0) {
    const dropdown = createSuggestionsDropdown(suggestions, input);
    input.parentElement.appendChild(dropdown);
  }
}

function createSuggestionsDropdown(suggestions, input) {
  // Remove existing dropdown
  const existing = input.parentElement.querySelector('.suggestions-dropdown');
  if (existing) existing.remove();

  const dropdown = document.createElement('div');
  dropdown.className = 'suggestions-dropdown';
  dropdown.style.cssText = `
    position: absolute;
    top: 100%;
    right: 0;
    left: 0;
    background: white;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-lg);
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
    margin-top: 0.5rem;
  `;

  suggestions.forEach(suggestion => {
    const item = document.createElement('div');
    item.textContent = suggestion;
    item.style.cssText = `
      padding: 0.75rem 1rem;
      cursor: pointer;
      transition: var(--transition);
      border-bottom: 1px solid var(--border-soft);
    `;
    
    item.addEventListener('mouseenter', () => {
      item.style.background = 'var(--bg-soft)';
    });
    
    item.addEventListener('mouseleave', () => {
      item.style.background = 'white';
    });
    
    item.addEventListener('click', () => {
      input.value = suggestion;
      hideSearchSuggestions(input);
      input.focus();
    });

    dropdown.appendChild(item);
  });

  return dropdown;
}

function hideSearchSuggestions(input) {
  const dropdown = input.parentElement.querySelector('.suggestions-dropdown');
  if (dropdown) {
    dropdown.style.opacity = '0';
    dropdown.style.transform = 'translateY(-10px)';
    setTimeout(() => dropdown.remove(), 300);
  }
}

// ===== Enhanced Toast Notifications =====
function showToast(message, type = 'info', duration = 3000) {
  const container = document.querySelector('.toast-container') || createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${getToastIcon(type)}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; font-size: 1.2rem; margin-right: 0.5rem;">×</button>
  `;
  
  container.appendChild(toast);
  
  // Auto remove
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-100%)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

function getToastIcon(type) {
  const icons = {
    'success': '✅',
    'error': '❌',
    'warning': '⚠️',
    'info': 'ℹ️'
  };
  return icons[type] || 'ℹ️';
}

// ===== Loading States =====
function showLoading(element, text = 'جاري التحميل...') {
  const loader = document.createElement('div');
  loader.className = 'smooth-loader';
  loader.innerHTML = `
    <div class="loader-content">
      <div class="loader-spinner"></div>
      <div class="loader-text">${text}</div>
    </div>
  `;
  
  loader.style.cssText = `
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    border-radius: inherit;
  `;
  
  element.style.position = 'relative';
  element.appendChild(loader);
  
  return loader;
}

function hideLoading(element) {
  const loader = element.querySelector('.smooth-loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 300);
  }
}

// ===== Utility Functions =====
function animateValue(element, start, end, duration) {
  const range = end - start;
  const startTime = performance.now();
  
  function updateValue(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.floor(start + range * easeOutCubic(progress));
    
    element.textContent = value.toLocaleString('ar-IQ');
    
    if (progress < 1) {
      requestAnimationFrame(updateValue);
    }
  }
  
  requestAnimationFrame(updateValue);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// Add CSS for ripple effect
const rippleCSS = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .fade-in {
    animation: fade-in 0.5s ease-out;
  }
  
  .smooth-loader .loader-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--border);
    border-top: 3px solid var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .smooth-loader .loader-text {
    color: var(--text);
    font-weight: 500;
  }
  
  .reading-mode {
    background: #fefefe !important;
  }
  
  .suggestions-dropdown {
    animation: slideUp 0.3s ease-out;
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = rippleCSS;
document.head.appendChild(styleSheet);

// Export functions for global use
window.showToast = showToast;
window.animateValue = animateValue;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
