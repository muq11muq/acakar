// ===== Global State =====
let currentUser = null;
let currentFilters = {
  type: '',
  status: '',
  priceMin: '',
  priceMax: '',
  location: ''
};

// ===== UI Functions =====
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function openModal(modalId) {
  document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

function formatPrice(price) {
  return new Intl.NumberFormat('ar-IQ').format(price) + ' د.ع';
}

function getTypeLabel(type) {
  const labels = {
    'land': 'قطعة أرض',
    'house': 'بيت',
    'building': 'بناية'
  };
  return labels[type] || type;
}

function getStatusLabel(status) {
  const labels = {
    'ready': 'جاهز',
    'under-construction': 'قيد الإنشاء',
    'sold': 'مباع'
  };
  return labels[status] || status;
}

// ===== Authentication =====
function initApp() {
  const user = localStorage.getItem('currentUser');
  if (user) {
    currentUser = JSON.parse(user);
    updateNavbar();
  }
}

function updateNavbar() {
  const dashboardLink = document.getElementById('dashboard-link');
  const loginNav = document.getElementById('login-nav');
  const logoutNav = document.getElementById('logout-nav');
  
  if (currentUser) {
    if (dashboardLink) dashboardLink.style.display = 'block';
    if (loginNav) loginNav.style.display = 'none';
    if (logoutNav) logoutNav.style.display = 'block';
  } else {
    if (dashboardLink) dashboardLink.style.display = 'none';
    if (loginNav) loginNav.style.display = 'block';
    if (logoutNav) logoutNav.style.display = 'none';
  }
}

function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  if (username === 'admin' && password === 'admin') {
    currentUser = { username, role: 'broker' };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateNavbar();
    closeModal('loginModal');
    showToast('تم تسجيل الدخول بنجاح', 'success');
    if (window.location.pathname.includes('index.html')) {
      window.location.reload();
    } else {
      window.location.href = 'dashboard.html';
    }
  } else {
    showToast('بيانات الدخول غير صحيحة', 'error');
  }
}

function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  updateNavbar();
  showToast('تم تسجيل الخروج', 'info');
  if (!window.location.pathname.includes('index.html')) {
    window.location.href = 'index.html';
  }
}

function checkBrokerAuth() {
  if (!currentUser || currentUser.role !== 'broker') {
    showToast('يجب تسجيل الدخول كدلال', 'error');
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

// ===== Properties Display =====
function renderProperties(properties) {
  const grid = document.getElementById('properties-grid');
  const noResults = document.getElementById('no-results');
  
  if (!grid) return;
  
  if (properties.length === 0) {
    grid.innerHTML = '';
    if (noResults) noResults.style.display = 'block';
    return;
  }
  
  if (noResults) noResults.style.display = 'none';
  
  grid.innerHTML = properties.map(property => `
    <div class="property-card">
      ${property.images && property.images.length > 0 
        ? `<img src="${property.images[0]}" alt="${getTypeLabel(property.type)}" class="property-image">`
        : `<div class="property-image-placeholder">🏠</div>`
      }
      <div class="property-info">
        <span class="property-type type-${property.type}">${getTypeLabel(property.type)}</span>
        <span class="property-type status-${property.status}">${getStatusLabel(property.status)}</span>
        <h3 class="property-title">${property.location}</h3>
        <div class="property-meta">
          <span>📍 ${property.location}</span>
          <span>📐 ${property.area} م²</span>
        </div>
        <div class="property-price">${formatPrice(property.price)}</div>
        <div class="property-actions">
          <button class="btn btn-primary btn-sm" onclick="viewProperty(${property.id})">تفاصيل</button>
          <button class="btn btn-secondary btn-sm" onclick="contactBroker(${property.id})">تواصل</button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderPropertyDetail() {
  const container = document.getElementById('property-detail');
  if (!container) return;
  
  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get('id'));
  
  if (!id) {
    container.innerHTML = '<p>العقار غير موجود</p>';
    return;
  }
  
  const properties = getProperties();
  const property = properties.find(p => p.id === id);
  
  if (!property) {
    container.innerHTML = '<p>العقار غير موجود</p>';
    return;
  }
  
  container.innerHTML = `
    ${property.images && property.images.length > 0 
      ? `<img src="${property.images[0]}" alt="${getTypeLabel(property.type)}" class="detail-gallery">`
      : `<div class="detail-gallery-placeholder">🏠</div>`
    }
    <div class="detail-body">
      <div class="detail-header">
        <h1 class="detail-title">${property.location}</h1>
        <span class="property-type type-${property.type}">${getTypeLabel(property.type)}</span>
        <span class="property-type status-${property.status}">${getStatusLabel(property.status)}</span>
      </div>
      
      <div class="detail-meta-grid">
        <div class="detail-meta-item">
          <div class="detail-meta-label">الموقع</div>
          <div class="detail-meta-value">📍 ${property.location}</div>
        </div>
        <div class="detail-meta-item">
          <div class="detail-meta-label">المساحة</div>
          <div class="detail-meta-value">📐 ${property.area} م²</div>
        </div>
        <div class="detail-meta-item">
          <div class="detail-meta-label">السعر</div>
          <div class="detail-meta-value">${formatPrice(property.price)}</div>
        </div>
        <div class="detail-meta-item">
          <div class="detail-meta-label">الحالة</div>
          <div class="detail-meta-value">${getStatusLabel(property.status)}</div>
        </div>
        <div class="detail-meta-item">
          <div class="detail-meta-label">التاريخ</div>
          <div class="detail-meta-value">${property.date}</div>
        </div>
        <div class="detail-meta-item">
          <div class="detail-meta-label">التواصل</div>
          <div class="detail-meta-value">${property.phone}</div>
        </div>
      </div>
      
      <div class="detail-desc">
        <h3>وصف العقار</h3>
        <p>${property.description}</p>
      </div>
      
      <div class="property-actions">
        <button class="btn btn-primary" onclick="contactBroker(${property.id})">مراسلة الدلال</button>
      </div>
    </div>
  `;
}

function renderDashboardProperties() {
  const container = document.getElementById('dashboard-properties');
  if (!container) return;
  
  const properties = getProperties();
  
  container.innerHTML = properties.map(property => `
    <div class="dashboard-item">
      ${property.images && property.images.length > 0 
        ? `<img src="${property.images[0]}" alt="${getTypeLabel(property.type)}">`
        : `<div class="item-thumb">🏠</div>`
      }
      <div class="item-info">
        <div class="item-title">${getTypeLabel(property.type)} - ${property.location}</div>
        <div class="item-meta">
          ${formatPrice(property.price)} • ${property.area} م² • ${getStatusLabel(property.status)}
        </div>
      </div>
      <div class="item-actions">
        <button class="btn btn-warning btn-sm" onclick="editProperty(${property.id})">تعديل</button>
        <button class="btn btn-danger btn-sm" onclick="deletePropertyConfirm(${property.id})">حذف</button>
      </div>
    </div>
  `).join('');
}

function renderMessages() {
  const container = document.getElementById('messages-list');
  if (!container) return;
  
  const messages = getMessages();
  
  container.innerHTML = messages.map(message => `
    <div class="dashboard-item">
      <div class="item-info">
        <div class="item-title">${message.name}</div>
        <div class="item-meta">${message.message}</div>
        <div class="item-meta">${message.date}</div>
      </div>
    </div>
  `).join('');
}

// ===== Property Actions =====
function viewProperty(id) {
  window.location.href = `property.html?id=${id}`;
}

function contactBroker(propertyId) {
  const properties = getProperties();
  const property = properties.find(p => p.id === propertyId);
  
  if (property) {
    document.getElementById('broker-phone').innerHTML = `
      <p>📞 يمكنك التواصل مباشرة على: <strong>${property.phone}</strong></p>
    `;
    openModal('contactModal');
  }
}

function handleContact(event) {
  event.preventDefault();
  const name = document.getElementById('contact-name').value;
  const message = document.getElementById('contact-message').value;
  
  const urlParams = new URLSearchParams(window.location.search);
  const propertyId = urlParams.get('id') || '';
  
  addMessage({ name, message, propertyId: parseInt(propertyId) });
  
  showToast('تم إرسال رسالتك بنجاح', 'success');
  closeModal('contactModal');
  event.target.reset();
}

// ===== Dashboard Functions =====
function handleAddProperty(event) {
  event.preventDefault();
  
  const property = {
    type: document.getElementById('prop-type').value,
    status: document.getElementById('prop-status').value,
    location: document.getElementById('prop-location').value,
    area: parseInt(document.getElementById('prop-area').value),
    price: parseInt(document.getElementById('prop-price').value),
    description: document.getElementById('prop-desc').value,
    phone: document.getElementById('prop-phone').value,
    images: document.getElementById('prop-images').value
  };
  
  addProperty(property);
  showToast('تم نشر العقار بنجاح', 'success');
  event.target.reset();
  renderDashboardProperties();
}

function editProperty(id) {
  const properties = getProperties();
  const property = properties.find(p => p.id === id);
  
  if (!property) return;
  
  document.getElementById('edit-id').value = property.id;
  document.getElementById('edit-type').value = property.type;
  document.getElementById('edit-status').value = property.status;
  document.getElementById('edit-location').value = property.location;
  document.getElementById('edit-area').value = property.area;
  document.getElementById('edit-price').value = property.price;
  document.getElementById('edit-desc').value = property.description;
  document.getElementById('edit-phone').value = property.phone;
  document.getElementById('edit-images').value = property.images.join(', ');
  
  openModal('editModal');
}

function handleEditProperty(event) {
  event.preventDefault();
  
  const id = parseInt(document.getElementById('edit-id').value);
  const updates = {
    type: document.getElementById('edit-type').value,
    status: document.getElementById('edit-status').value,
    location: document.getElementById('edit-location').value,
    area: parseInt(document.getElementById('edit-area').value),
    price: parseInt(document.getElementById('edit-price').value),
    description: document.getElementById('edit-desc').value,
    phone: document.getElementById('edit-phone').value,
    images: document.getElementById('edit-images').value
  };
  
  updateProperty(id, updates);
  showToast('تم تحديث العقار بنجاح', 'success');
  closeModal('editModal');
  renderDashboardProperties();
}

function deletePropertyConfirm(id) {
  if (confirm('هل أنت متأكد من حذف هذا العقار؟')) {
    if (deleteProperty(id)) {
      showToast('تم حذف العقار بنجاح', 'success');
      renderDashboardProperties();
    }
  }
}

// ===== Filters =====
function getFilteredProperties() {
  let properties = getProperties();
  
  if (currentFilters.type) {
    properties = properties.filter(p => p.type === currentFilters.type);
  }
  
  if (currentFilters.status) {
    properties = properties.filter(p => p.status === currentFilters.status);
  }
  
  if (currentFilters.priceMin) {
    properties = properties.filter(p => p.price >= parseInt(currentFilters.priceMin));
  }
  
  if (currentFilters.priceMax) {
    properties = properties.filter(p => p.price <= parseInt(currentFilters.priceMax));
  }
  
  if (currentFilters.location) {
    properties = properties.filter(p => 
      p.location.toLowerCase().includes(currentFilters.location.toLowerCase())
    );
  }
  
  return properties;
}

function applyFilters() {
  currentFilters = {
    type: document.getElementById('filter-type').value,
    status: document.getElementById('filter-status').value,
    priceMin: document.getElementById('filter-price-min').value,
    priceMax: document.getElementById('filter-price-max').value,
    location: document.getElementById('filter-location').value
  };
  
  const filtered = getFilteredProperties();
  renderProperties(filtered);
}

function resetFilters() {
  document.getElementById('filter-type').value = '';
  document.getElementById('filter-status').value = '';
  document.getElementById('filter-price-min').value = '';
  document.getElementById('filter-price-max').value = '';
  document.getElementById('filter-location').value = '';
  
  currentFilters = {
    type: '',
    status: '',
    priceMin: '',
    priceMax: '',
    location: ''
  };
  
  renderProperties(getProperties());
}

// ===== Modal Close on Outside Click =====
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('modal')) {
    event.target.classList.remove('active');
  }
});
