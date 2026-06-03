// ===== Global State =====
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
let compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
let recentViews = JSON.parse(localStorage.getItem('recentViews') || '[]');

// ===== UI Functions =====
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) {
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = 'position:fixed;top:20px;right:20px;z-index:10000';
    document.body.appendChild(toastContainer);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.style.cssText = 'background:var(--card-bg);padding:1rem;margin-bottom:0.5rem;border-radius:8px;box-shadow:var(--shadow);border-right:4px solid var(--primary)';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function formatPrice(price) {
  return new Intl.NumberFormat('ar-IQ').format(price) + ' د.ع';
}

// ===== Favorites =====
function toggleFavorite(id, url, title) {
  const index = favorites.findIndex(f => f.id === id);
  if (index > -1) {
    favorites.splice(index, 1);
    showToast('تم الإزالة من المفضلة');
  } else {
    favorites.push({ id, url, title });
    showToast('تمت الإضافة إلى المفضلة');
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  updateFavoriteButtons();
  updateFavoritesGrid();
}

function updateFavoriteButtons() {
  document.querySelectorAll('.btn-favorite').forEach(btn => {
    const id = parseInt(btn.dataset.favId);
    if (favorites.some(f => f.id === id)) {
      btn.textContent = '❤️';
    } else {
      btn.textContent = '🤍';
    }
  });
}

function updateFavoritesGrid() {
  const grid = document.getElementById('favorites-grid');
  const section = document.getElementById('favorites-section');
  const count = document.getElementById('fav-count');
  
  if (count) {
    count.textContent = favorites.length;
    count.hidden = favorites.length === 0;
  }
  
  if (!grid || favorites.length === 0) {
    if (section) section.style.display = 'none';
    return;
  }
  
  section.style.display = 'block';
  grid.innerHTML = favorites.map(fav => `
    <div class="property-card">
      <a href="${fav.url}" class="property-card-body">
        <h3 class="property-card-title">${fav.title}</h3>
      </a>
    </div>
  `).join('');
}

// ===== Compare =====
function toggleCompare(id, url, title, price, area, city, type) {
  const index = compareList.findIndex(c => c.id === id);
  if (index > -1) {
    compareList.splice(index, 1);
    showToast('تم الإزالة من المقارنة');
  } else {
    if (compareList.length >= 3) {
      showToast('يمكنك مقارنة 3 عقارات كحد أقصى', 'error');
      return;
    }
    compareList.push({ id, url, title, price, area, city, type });
    showToast('تمت الإضافة للمقارنة');
  }
  localStorage.setItem('compareList', JSON.stringify(compareList));
  updateCompareBar();
}

function updateCompareBar() {
  const bar = document.getElementById('compare-bar');
  const count = document.getElementById('compare-count');
  
  if (!bar) return;
  
  if (compareList.length === 0) {
    bar.hidden = true;
  } else {
    bar.hidden = false;
    count.textContent = `${compareList.length} عقارات للمقارنة`;
  }
}

function clearCompare() {
  compareList = [];
  localStorage.setItem('compareList', JSON.stringify(compareList));
  updateCompareBar();
  showToast('تم مسح قائمة المقارنة');
}

function openCompareModal() {
  const modal = document.getElementById('compare-modal');
  const content = document.getElementById('compare-content');
  
  if (!modal || !content) return;
  
  if (compareList.length === 0) {
    showToast('لا توجد عقارات للمقارنة', 'error');
    return;
  }
  
  content.innerHTML = `
    <table style="width:100%;border-collapse:collapse">
      <tr>
        <th style="padding:0.5rem;border-bottom:1px solid var(--border)">العقار</th>
        <th style="padding:0.5rem;border-bottom:1px solid var(--border)">السعر</th>
        <th style="padding:0.5rem;border-bottom:1px solid var(--border)">المساحة</th>
        <th style="padding:0.5rem;border-bottom:1px solid var(--border)">المدينة</th>
      </tr>
      ${compareList.map(item => `
        <tr>
          <td style="padding:0.5rem;border-bottom:1px solid var(--border)">${item.title}</td>
          <td style="padding:0.5rem;border-bottom:1px solid var(--border)">${item.price}</td>
          <td style="padding:0.5rem;border-bottom:1px solid var(--border)">${item.area} م²</td>
          <td style="padding:0.5rem;border-bottom:1px solid var(--border)">${item.city}</td>
        </tr>
      `).join('')}
    </table>
  `;
  
  modal.style.display = 'block';
}

// ===== Recent Views =====
function addToRecent(id, url, title) {
  recentViews = recentViews.filter(r => r.id !== id);
  recentViews.unshift({ id, url, title });
  if (recentViews.length > 10) recentViews.pop();
  localStorage.setItem('recentViews', JSON.stringify(recentViews));
  updateRecentGrid();
}

function updateRecentGrid() {
  const grid = document.getElementById('recent-grid');
  const section = document.getElementById('recent-section');
  
  if (!grid || recentViews.length === 0) {
    if (section) section.style.display = 'none';
    return;
  }
  
  section.style.display = 'block';
  grid.innerHTML = recentViews.map(view => `
    <div class="property-card">
      <a href="${view.url}" class="property-card-body">
        <h3 class="property-card-title">${view.title}</h3>
      </a>
    </div>
  `).join('');
}

// ===== Search =====
function updateCityList(province) {
  const datalist = document.getElementById('city-list');
  if (!datalist || !window.GOVERNORATE_CITIES) return;
  
  const cities = window.GOVERNORATE_CITIES[province] || [];
  datalist.innerHTML = cities.map(city => `<option value="${city}">`).join('');
}

// ===== Gallery =====
function initGallery() {
  const mainImg = document.getElementById('gallery-main-img');
  const thumbs = document.querySelectorAll('.gallery-thumbs img');
  const prevBtn = document.querySelector('.gallery-nav.prev');
  const nextBtn = document.querySelector('.gallery-nav.next');
  
  if (!mainImg || thumbs.length === 0) return;
  
  let currentIndex = 0;
  const images = Array.from(thumbs).map(img => img.dataset.full);
  
  thumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
      currentIndex = index;
      mainImg.src = images[index];
    });
  });
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      mainImg.src = images[currentIndex];
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % images.length;
      mainImg.src = images[currentIndex];
    });
  }
}

// ===== Calculator =====
function initCalculator() {
  const slider = document.getElementById('calc-years');
  const display = document.getElementById('calc-years-val');
  const result = document.getElementById('calc-monthly');
  
  if (!slider || !display || !result || !window.PROPERTY_PRICE) return;
  
  slider.addEventListener('input', () => {
    const years = parseInt(slider.value);
    display.textContent = `${years} سنة`;
    const monthly = Math.round(window.PROPERTY_PRICE / (years * 12));
    result.textContent = `${formatPrice(monthly)} شهرياً`;
  });
  
  // Initial calculation
  const years = parseInt(slider.value);
  const monthly = Math.round(window.PROPERTY_PRICE / (years * 12));
  result.textContent = `${formatPrice(monthly)} شهرياً`;
}

// ===== Map =====
function initPropertyMap() {
  const mapEl = document.getElementById('property-map');
  if (!mapEl || !mapEl.dataset.lat || !mapEl.dataset.lng) return;
  
  const lat = parseFloat(mapEl.dataset.lat);
  const lng = parseFloat(mapEl.dataset.lng);
  
  if (typeof L !== 'undefined') {
    const map = L.map(mapEl).setView([lat, lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);
    L.marker([lat, lng]).addTo(map);
  }
}

// ===== Theme Toggle =====
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;
  
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  toggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  
  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    toggle.textContent = next === 'dark' ? '☀️' : '🌙';
  });
}

// ===== Back to Top =====
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  
  window.addEventListener('scroll', () => {
    btn.style.display = window.scrollY > 300 ? 'block' : 'none';
  });
  
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== Mobile Navigation =====
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  
  if (!toggle || !links) return;
  
  toggle.addEventListener('click', () => {
    links.classList.toggle('active');
    toggle.setAttribute('aria-expanded', links.classList.contains('active'));
  });
}

// ===== Search Panel Toggle =====
function initSearchToggle() {
  const toggle = document.getElementById('search-toggle');
  const panel = document.getElementById('search');
  
  if (!toggle || !panel) return;
  
  toggle.addEventListener('click', () => {
    panel.classList.toggle('collapsed');
  });
}

// ===== Province Change =====
function initProvinceSelect() {
  const provinceSelect = document.getElementById('id_province');
  if (!provinceSelect) return;
  
  provinceSelect.addEventListener('change', () => {
    updateCityList(provinceSelect.value);
  });
  
  // Initialize on load
  updateCityList(provinceSelect.value);
}

// ===== Dashboard Tabs =====
function initDashboardTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.panel');
  
  if (tabs.length === 0) return;
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(`panel-${target}`).classList.add('active');
    });
  });
}

// ===== Compare Modal Close =====
function initCompareModal() {
  const modal = document.getElementById('compare-modal');
  const closeBtn = document.getElementById('compare-close');
  
  if (!modal || !closeBtn) return;
  
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}

// ===== Share Button =====
function initShareButton() {
  const btn = document.getElementById('btn-share');
  if (!btn) return;
  
  btn.addEventListener('click', async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('تم نسخ الرابط');
    }
  });
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  updateFavoriteButtons();
  updateFavoritesGrid();
  updateRecentGrid();
  updateCompareBar();
  initGallery();
  initCalculator();
  initPropertyMap();
  initThemeToggle();
  initBackToTop();
  initMobileNav();
  initSearchToggle();
  initProvinceSelect();
  initDashboardTabs();
  initCompareModal();
  initShareButton();
  
  // Track property view
  const propertyCard = document.querySelector('.property-card[data-property-url]');
  if (propertyCard) {
    const id = parseInt(propertyCard.dataset.propertyId);
    const url = propertyCard.dataset.propertyUrl;
    const title = propertyCard.dataset.propertyTitle;
    if (id && url && title) {
      addToRecent(id, url, title);
    }
  }
  
  // Event delegation for dynamic elements
  document.addEventListener('click', (e) => {
    const favBtn = e.target.closest('.btn-favorite');
    if (favBtn) {
      e.preventDefault();
      toggleFavorite(
        parseInt(favBtn.dataset.favId),
        favBtn.dataset.favUrl,
        favBtn.dataset.favTitle
      );
    }
    
    const compareBtn = e.target.closest('.btn-compare-add');
    if (compareBtn) {
      e.preventDefault();
      toggleCompare(
        parseInt(compareBtn.dataset.compareId),
        compareBtn.dataset.compareUrl,
        compareBtn.dataset.compareTitle,
        compareBtn.dataset.comparePrice,
        compareBtn.dataset.compareArea,
        compareBtn.dataset.compareCity,
        compareBtn.dataset.compareType
      );
    }
  });
  
  document.getElementById('compare-clear')?.addEventListener('click', clearCompare);
  document.getElementById('compare-open')?.addEventListener('click', openCompareModal);
});
