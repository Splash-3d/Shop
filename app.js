// Global variables
let products = [];
let cart = [];
let totalSales = 0;
let customerSatisfaction = 0;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadCart();
    updateStats();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Cart functionality
    document.getElementById('cartCount')?.addEventListener('click', () => {
        const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
        cartModal.show();
    });
}

// Load products from API
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        if (response.ok) {
            products = await response.json();
            displayProducts();
            displayFeaturedProducts();
            updateStats();
        } else {
            console.error('Error loading products');
            products = [];
            displayProducts();
            displayFeaturedProducts();
        }
    } catch (error) {
        console.error('Error loading products:', error);
        products = [];
        displayProducts();
        displayFeaturedProducts();
    }
}

// Display products in products page
function displayProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    if (products.length === 0) {
        container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No hay productos disponibles.</p></div>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="col-md-4 mb-4">
            <div class="card product-card h-100">
                <img src="${product.image || 'https://picsum.photos/seed/product' + product.id + '/400/300'}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-secondary">${product.category}</span>
                        <span class="badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}">${product.stock > 0 ? 'En stock' : 'Agotado'}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="fw-bold text-success">$${parseFloat(product.price).toFixed(2)}</span>
                        <button class="btn btn-sm btn-success" onclick="addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i> Añadir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Display featured products in home page
function displayFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    const featuredProducts = products.slice(0, 6);
    if (featuredProducts.length === 0) {
        container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No hay productos destacados.</p></div>';
        return;
    }
    
    container.innerHTML = featuredProducts.map(product => `
        <div class="col-md-4 mb-4">
            <div class="card product-card h-100">
                <img src="${product.image || 'https://picsum.photos/seed/product' + product.id + '/400/300'}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description.substring(0, 80)}...</p>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-secondary">${product.category}</span>
                        <span class="badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}">${product.stock > 0 ? 'En stock' : 'Agotado'}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="fw-bold text-success">$${parseFloat(product.price).toFixed(2)}</span>
                        <button class="btn btn-sm btn-success" onclick="addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i> Añadir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            image: product.image,
            quantity: 1
        });
    }
    
    updateCart();
    showToast('Producto añadido al carrito', 'success');
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showToast('Producto eliminado del carrito', 'info');
}

// Update cart display
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center text-muted">Tu carrito está vacío.</p>';
        cartCount.textContent = '0';
        cartTotal.textContent = '0';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="d-flex align-items-center mb-3">
            <img src="${item.image || 'https://picsum.photos/seed/product' + item.id + '/100/100'}" alt="${item.name}" class="rounded me-3" style="width: 50px; height: 50px; object-fit: cover;">
            <div class="flex-grow-1">
                <h6 class="mb-0">${item.name}</h6>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="badge bg-secondary">Cantidad: ${item.quantity}</span>
                    <span class="fw-bold text-success">$${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="btn btn-sm btn-danger" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartTotal.textContent = total.toFixed(2);
}

// Update stats
function updateStats() {
    const totalProductsEl = document.getElementById('totalProducts');
    if (totalProductsEl) {
        totalProductsEl.textContent = products.length;
    }
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showToast('Tu carrito está vacío', 'warning');
        return;
    }
    
    // In a real application, this would process the payment
    showToast('¡Gracias por tu compra! 🛍️', 'success');
    cart = [];
    updateCart();
    
    // Close modal
    const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
    cartModal.hide();
}

// Show toast notification
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `alert alert-${type === 'success' ? 'alert-success' : 'alert-info'} alert-dismissible fade show position-fixed`;
    toast.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
    toast.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Create toast container if it doesn't exist
function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 1050;';
    document.body.appendChild(container);
    return container;
}

// Real-time updates (simulate WebSocket connection)
function setupRealTimeUpdates() {
    // In a real application, this would connect to a WebSocket
    // For demo purposes, we'll simulate updates every 30 seconds
    
    setInterval(() => {
        // Simulate new product additions or updates
        // This would normally come from a WebSocket connection
        console.log('Checking for updates...');
    }, 30000);
}

// Initialize real-time updates
setupRealTimeUpdates();
