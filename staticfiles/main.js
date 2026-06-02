// ===== Modern JavaScript for Enhanced Interactions =====

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all animations and interactions
  initScrollAnimations();
  initNavbarScroll();
  initParallaxEffects();
  initSmoothScrolling();
  initFormAnimations();
  initLoadingStates();
  initParticleEffects();
  initKeyboardNavigation();
  initDarkModeToggle();
  initSearchSuggestions();
});

// ===== Scroll Animations =====
function initScrollAnimations() {
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
            card.style.animationDelay = `${index * 0.1}s`;
          });
        }
      }
    });
  }, observerOptions);

  // Observe all elements with scroll animations
  document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right').forEach(el => {
    observer.observe(el);
  });
}

// ===== Navbar Scroll Effects =====
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
      navbar.style.background = 'rgba(255, 255, 255, 0.98)';
      navbar.style.backdropFilter = 'blur(20px)';
      navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
      navbar.style.background = 'rgba(255, 255, 255, 0.95)';
      navbar.style.backdropFilter = 'blur(10px)';
      navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }

    // Hide/show navbar on scroll
    if (currentScrollY > lastScrollY && currentScrollY > 300) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }

    lastScrollY = currentScrollY;
  });
}

// ===== Parallax Effects =====
function initParallaxEffects() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = scrolled * 0.5;
    
    hero.style.transform = `translateY(${parallax}px)`;
    
    // Parallax for hero content
    const heroContent = hero.querySelector('h1, p');
    if (heroContent) {
      heroContent.style.transform = `translateY(${parallax * 0.3}px)`;
      heroContent.style.opacity = 1 - scrolled / 600;
    }
  });
}

// ===== Smooth Scrolling =====
function initSmoothScrolling() {
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
}

// ===== Form Animations =====
function initFormAnimations() {
  const inputs = document.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    // Add focus effects
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
      input.style.transform = 'scale(1.02)';
    });

    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
      input.style.transform = 'scale(1)';
    });

    // Add typing animation for search inputs
    if (input.type === 'search' || input.placeholder?.includes('بحث')) {
      input.addEventListener('input', () => {
        if (input.value.length > 0) {
          input.classList.add('typing-animation');
        } else {
          input.classList.remove('typing-animation');
        }
      });
    }
  });

  // Form submission animations
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> جاري الإرسال...';
      }
    });
  });
}

// ===== Loading States =====
function initLoadingStates() {
  // Add skeleton loading for property cards
  const propertyGrid = document.querySelector('.properties-grid');
  if (propertyGrid && propertyGrid.children.length === 0) {
    // Show skeleton loaders
    for (let i = 0; i < 6; i++) {
      const skeleton = createSkeletonCard();
      propertyGrid.appendChild(skeleton);
    }
  }

  // Image lazy loading
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
}

// ===== Create Skeleton Card =====
function createSkeletonCard() {
  const card = document.createElement('div');
  card.className = 'property-card skeleton';
  card.innerHTML = `
    <div class="skeleton skeleton-text" style="height: 250px;"></div>
    <div class="property-info">
      <div class="skeleton skeleton-title" style="width: 60%;"></div>
      <div class="skeleton skeleton-text" style="width: 40%;"></div>
      <div class="skeleton skeleton-text" style="width: 80%;"></div>
      <div class="skeleton skeleton-text" style="width: 50%;"></div>
    </div>
  `;
  return card;
}

// ===== Particle Effects =====
function initParticleEffects() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  hero.classList.add('particles');
  
  // Create floating particles
  for (let i = 0; i < 20; i++) {
    createParticle(hero);
  }
}

function createParticle(container) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  
  const size = Math.random() * 4 + 2;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.right = `${Math.random() * 100}%`;
  particle.style.animationDelay = `${Math.random() * 4}s`;
  particle.style.animationDuration = `${Math.random() * 3 + 4}s`;
  
  container.appendChild(particle);
  
  // Remove particle after animation
  setTimeout(() => {
    particle.remove();
    createParticle(container);
  }, 7000);
}

// ===== Keyboard Navigation =====
function initKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    // Escape key to close modals
    if (e.key === 'Escape') {
      const modals = document.querySelectorAll('.modal.active');
      modals.forEach(modal => {
        modal.classList.remove('active');
      });
    }

    // Ctrl+K for search
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.querySelector('input[type="search"], input[placeholder*="بحث"]');
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }

    // Arrow key navigation for property cards
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const focusedCard = document.querySelector('.property-card:focus');
      if (focusedCard) {
        const cards = Array.from(document.querySelectorAll('.property-card'));
        const currentIndex = cards.indexOf(focusedCard);
        let nextIndex;

        if (e.key === 'ArrowRight') {
          nextIndex = (currentIndex + 1) % cards.length;
        } else {
          nextIndex = (currentIndex - 1 + cards.length) % cards.length;
        }

        cards[nextIndex].focus();
        e.preventDefault();
      }
    }
  });

  // Make property cards focusable
  document.querySelectorAll('.property-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const link = card.querySelector('a');
        if (link) link.click();
      }
    });
  });
}

// ===== Dark Mode Toggle =====
function initDarkModeToggle() {
  // Create dark mode toggle button
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'dark-mode-toggle';
  toggleBtn.innerHTML = '🌙';
  toggleBtn.setAttribute('aria-label', 'تبديل الوضع الليلي');
  toggleBtn.style.cssText = `
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
  `;

  document.body.appendChild(toggleBtn);

  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    toggleBtn.innerHTML = '☀️';
  }

  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    
    toggleBtn.innerHTML = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Add animation
    toggleBtn.style.transform = 'scale(1.2) rotate(360deg)';
    setTimeout(() => {
      toggleBtn.style.transform = 'scale(1) rotate(0deg)';
    }, 300);
  });
}

// ===== Search Suggestions =====
function initSearchSuggestions() {
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
      transition: var(--transition-fast);
      border-bottom: 1px solid var(--border-light);
    `;
    
    item.addEventListener('mouseenter', () => {
      item.style.background = 'var(--bg-light)';
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

// ===== Toast Notifications Enhancement =====
function showToast(message, type = 'info', duration = 3000) {
  const container = document.querySelector('.toast-container') || createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${getToastIcon(type)}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">×</button>
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

// ===== Performance Optimization =====
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ===== Utility Functions =====
function animateValue(element, start, end, duration) {
  const range = end - start;
  const startTime = performance.now();
  
  function updateValue(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.floor(start + range * progress);
    
    element.textContent = value.toLocaleString('ar-IQ');
    
    if (progress < 1) {
      requestAnimationFrame(updateValue);
    }
  }
  
  requestAnimationFrame(updateValue);
}

// Export functions for global use
window.showToast = showToast;
window.animateValue = animateValue;
