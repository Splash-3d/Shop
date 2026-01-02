// Additional JavaScript for products.html
document.addEventListener('DOMContentLoaded', function() {
    setupProductFilters();
});

function setupProductFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    const searchInput = document.getElementById('searchInput');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', filterProducts);
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }
}

function filterProducts() {
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    const searchInput = document.getElementById('searchInput');
    
    let filteredProducts = [...products];
    
    // Filter by category
    if (categoryFilter && categoryFilter.value) {
        filteredProducts = filteredProducts.filter(p => p.category === categoryFilter.value);
    }
    
    // Filter by search
    if (searchInput && searchInput.value) {
        const searchTerm = searchInput.value.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm) || 
            p.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Sort products
    if (sortFilter && sortFilter.value) {
        switch(sortFilter.value) {
            case 'price-low':
                filteredProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                break;
            case 'name':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
    }
    
    displayFilteredProducts(filteredProducts);
}

function displayFilteredProducts(filteredProducts) {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    if (filteredProducts.length === 0) {
        container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No se encontraron productos con los filtros seleccionados.</p></div>';
        return;
    }
    
    container.innerHTML = filteredProducts.map(product => `
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
