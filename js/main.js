// Import modules
import { ProductManager } from './modules/ProductManager.js';
import { CartManager } from './modules/CartManager.js';
import { WishlistManager } from './modules/WishlistManager.js';
import { ThemeManager } from './modules/ThemeManager.js';
import { UIManager } from './modules/UIManager.js';
import { SearchManager } from './modules/SearchManager.js';
import { ToastManager } from './modules/ToastManager.js';

class App {
  constructor() {
    this.productManager = new ProductManager();
    this.cartManager = new CartManager();
    this.wishlistManager = new WishlistManager();
    this.themeManager = new ThemeManager();
    this.uiManager = new UIManager();
    this.searchManager = new SearchManager();
    this.toastManager = new ToastManager();
    
    this.currentProducts = [];
    this.filteredProducts = [];
    this.displayedProducts = [];
    this.productsPerPage = 12;
    this.currentPage = 1;
    
    this.init();
  }

  async init() {
    try {
      // Show loading screen
      this.uiManager.showLoading();
      
      // Initialize managers
      this.themeManager.init();
      this.cartManager.init();
      this.wishlistManager.init();
      
      // Load products
      await this.loadProducts();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Initialize UI
      this.updateCartBadge();
      this.updateWishlistBadge();
      
      // Hide loading screen
      setTimeout(() => {
        this.uiManager.hideLoading();
      }, 1000);
      
    } catch (error) {
      console.error('App initialization failed:', error);
      this.toastManager.show('Failed to initialize app', 'error');
      this.uiManager.hideLoading();
    }
  }

  async loadProducts() {
    try {
      this.currentProducts = await this.productManager.fetchProducts();
      this.filteredProducts = [...this.currentProducts];
      this.populateCategories();
      this.displayProducts();
    } catch (error) {
      console.error('Failed to load products:', error);
      this.toastManager.show('Failed to load products', 'error');
    }
  }

  populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (!categoryFilter) return;

    const categories = [...new Set(this.currentProducts.map(p => p.category))];
    categoryFilter.innerHTML = '<option value="">All Categories</option>';
    
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      categoryFilter.appendChild(option);
    });
  }

  displayProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    // Show skeleton loading
    this.showSkeletonProducts();

    setTimeout(() => {
      const startIndex = (this.currentPage - 1) * this.productsPerPage;
      const endIndex = startIndex + this.productsPerPage;
      this.displayedProducts = this.filteredProducts.slice(0, endIndex);

      productsGrid.innerHTML = '';
      
      if (this.displayedProducts.length === 0) {
        productsGrid.innerHTML = `
          <div class="no-products">
            <div class="no-products-icon">🔍</div>
            <h3>No products found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        `;
        return;
      }

      this.displayedProducts.forEach(product => {
        const productCard = this.createProductCard(product);
        productsGrid.appendChild(productCard);
      });

      this.updateLoadMoreButton();
    }, 500);
  }

  showSkeletonProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';
    for (let i = 0; i < 8; i++) {
      const skeleton = document.createElement('div');
      skeleton.className = 'skeleton-card';
      skeleton.innerHTML = `
        <div class="skeleton-image skeleton"></div>
        <div class="skeleton-content">
          <div class="skeleton-text short skeleton"></div>
          <div class="skeleton-text long skeleton"></div>
          <div class="skeleton-text short skeleton"></div>
        </div>
      `;
      productsGrid.appendChild(skeleton);
    }
  }

  createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-product-id', product.id);

    const isInWishlist = this.wishlistManager.isInWishlist(product.id);
    const rating = product.rating ? product.rating.rate : 4.0;
    const ratingCount = product.rating ? product.rating.count : 0;

    card.innerHTML = `
      <div class="product-image-container">
        <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy">
        <div class="product-actions">
          <button class="product-action-btn wishlist-toggle-btn" data-product-id="${product.id}" title="${isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}">
            ${isInWishlist ? '❤️' : '🤍'}
          </button>
          <button class="product-action-btn quick-view-btn" data-product-id="${product.id}" title="Quick view">
            👁️
          </button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3 class="product-title">${product.title}</h3>
        <div class="product-rating">
          <div class="stars">${this.generateStars(rating)}</div>
          <span class="rating-text">(${ratingCount})</span>
        </div>
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <div class="product-buttons">
          <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>
      </div>
    `;

    return card;
  }

  generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
      stars += '⭐';
    }
    if (hasHalfStar) {
      stars += '⭐';
    }
    for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
      stars += '☆';
    }

    return stars;
  }

  updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (!loadMoreBtn) return;

    const hasMore = this.displayedProducts.length < this.filteredProducts.length;
    loadMoreBtn.style.display = hasMore ? 'block' : 'none';
  }

  setupEventListeners() {
    // Navigation
    this.setupNavigation();
    
    // Search
    this.setupSearch();
    
    // Filters
    this.setupFilters();
    
    // Product interactions
    this.setupProductInteractions();
    
    // Cart
    this.setupCart();
    
    // Wishlist
    this.setupWishlist();
    
    // Modals
    this.setupModals();
    
    // Load more
    this.setupLoadMore();
    
    // Mobile menu
    this.setupMobileMenu();
  }

  setupNavigation() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
      const navbar = document.getElementById('navbar');
      if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
      } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
      }
    });
  }

  setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchManager.setQuery(e.target.value);
        this.applyFilters();
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        this.applyFilters();
      });
    }
  }

  setupFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');

    if (categoryFilter) {
      categoryFilter.addEventListener('change', () => {
        this.applyFilters();
      });
    }

    if (sortFilter) {
      sortFilter.addEventListener('change', () => {
        this.applyFilters();
      });
    }

    if (priceRange) {
      priceRange.addEventListener('input', (e) => {
        if (priceValue) {
          priceValue.textContent = e.target.value;
        }
        this.applyFilters();
      });
    }
  }

  setupProductInteractions() {
    document.addEventListener('click', (e) => {
      // Add to cart
      if (e.target.classList.contains('add-to-cart-btn')) {
        const productId = parseInt(e.target.dataset.productId);
        this.addToCart(productId);
      }

      // Wishlist toggle
      if (e.target.classList.contains('wishlist-toggle-btn')) {
        const productId = parseInt(e.target.dataset.productId);
        this.toggleWishlist(productId);
      }

      // Quick view
      if (e.target.classList.contains('quick-view-btn')) {
        const productId = parseInt(e.target.dataset.productId);
        this.showProductDetail(productId);
      }
    });
  }

  setupCart() {
    const cartBtn = document.getElementById('cartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const clearCartBtn = document.getElementById('clearCartBtn');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (cartBtn) {
      cartBtn.addEventListener('click', () => {
        this.showCartModal();
      });
    }

    if (closeCartBtn) {
      closeCartBtn.addEventListener('click', () => {
        this.hideCartModal();
      });
    }

    if (clearCartBtn) {
      clearCartBtn.addEventListener('click', () => {
        this.clearCart();
      });
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        this.checkout();
      });
    }
  }

  setupWishlist() {
    const wishlistBtn = document.getElementById('wishlistBtn');
    const closeWishlistBtn = document.getElementById('closeWishlistBtn');

    if (wishlistBtn) {
      wishlistBtn.addEventListener('click', () => {
        this.showWishlistModal();
      });
    }

    if (closeWishlistBtn) {
      closeWishlistBtn.addEventListener('click', () => {
        this.hideWishlistModal();
      });
    }
  }

  setupModals() {
    // Close modals when clicking overlay
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        const modal = e.target.closest('.modal');
        if (modal) {
          modal.classList.add('hidden');
        }
      }
    });

    // Close modals with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal:not(.hidden)').forEach(modal => {
          modal.classList.add('hidden');
        });
      }
    });
  }

  setupLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        this.currentPage++;
        this.displayProducts();
      });
    }
  }

  setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuBtn && navMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
      });
    }
  }

  applyFilters() {
    const searchQuery = this.searchManager.getQuery();
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    const sortFilter = document.getElementById('sortFilter')?.value || 'default';
    const priceRange = parseFloat(document.getElementById('priceRange')?.value || '200');

    // Filter products
    this.filteredProducts = this.currentProducts.filter(product => {
      const matchesSearch = !searchQuery || 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      const matchesPrice = product.price <= priceRange;

      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort products
    this.sortProducts(sortFilter);

    // Reset pagination
    this.currentPage = 1;
    this.displayProducts();
  }

  sortProducts(sortBy) {
    switch (sortBy) {
      case 'price-low':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        this.filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'rating':
        this.filteredProducts.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
        break;
      default:
        // Keep original order
        break;
    }
  }

  addToCart(productId) {
    const product = this.currentProducts.find(p => p.id === productId);
    if (product) {
      this.cartManager.addItem(product);
      this.updateCartBadge();
      this.toastManager.show(`${product.title} added to cart!`, 'success');
    }
  }

  toggleWishlist(productId) {
    const product = this.currentProducts.find(p => p.id === productId);
    if (!product) return;

    const isInWishlist = this.wishlistManager.isInWishlist(productId);
    
    if (isInWishlist) {
      this.wishlistManager.removeItem(productId);
      this.toastManager.show(`${product.title} removed from wishlist`, 'success');
    } else {
      this.wishlistManager.addItem(product);
      this.toastManager.show(`${product.title} added to wishlist!`, 'success');
    }

    this.updateWishlistBadge();
    this.updateProductCard(productId);
  }

  updateProductCard(productId) {
    const card = document.querySelector(`[data-product-id="${productId}"]`);
    if (!card) return;

    const wishlistBtn = card.querySelector('.wishlist-toggle-btn');
    if (wishlistBtn) {
      const isInWishlist = this.wishlistManager.isInWishlist(productId);
      wishlistBtn.innerHTML = isInWishlist ? '❤️' : '🤍';
      wishlistBtn.title = isInWishlist ? 'Remove from wishlist' : 'Add to wishlist';
    }
  }

  showProductDetail(productId) {
    const product = this.currentProducts.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('productModal');
    const productDetail = document.getElementById('productDetail');
    
    if (!modal || !productDetail) return;

    const rating = product.rating ? product.rating.rate : 4.0;
    const ratingCount = product.rating ? product.rating.count : 0;
    const isInWishlist = this.wishlistManager.isInWishlist(productId);

    productDetail.innerHTML = `
      <div class="product-detail-content">
        <div class="product-detail-image">
          <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="product-detail-info">
          <div class="product-category">${product.category}</div>
          <h2 class="product-title">${product.title}</h2>
          <div class="product-rating">
            <div class="stars">${this.generateStars(rating)}</div>
            <span class="rating-text">(${ratingCount} reviews)</span>
          </div>
          <div class="product-price">$${product.price.toFixed(2)}</div>
          <div class="product-description">
            <p>${product.description}</p>
          </div>
          <div class="product-actions">
            <button class="btn btn-primary add-to-cart-btn" data-product-id="${productId}">
              Add to Cart
            </button>
            <button class="btn btn-secondary wishlist-toggle-btn" data-product-id="${productId}">
              ${isInWishlist ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
  }

  showCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
      this.updateCartDisplay();
      modal.classList.remove('hidden');
    }
  }

  hideCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  showWishlistModal() {
    const modal = document.getElementById('wishlistModal');
    if (modal) {
      this.updateWishlistDisplay();
      modal.classList.remove('hidden');
    }
  }

  hideWishlistModal() {
    const modal = document.getElementById('wishlistModal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartTotal) return;

    const items = this.cartManager.getItems();
    const total = this.cartManager.getTotal();

    if (items.length === 0) {
      cartItems.innerHTML = `
        <div class="empty-cart">
          <div class="empty-cart-icon">🛒</div>
          <p>Your cart is empty</p>
          <button class="continue-shopping-btn" onclick="document.getElementById('cartModal').classList.add('hidden')">Continue Shopping</button>
        </div>
      `;
    } else {
      cartItems.innerHTML = items.map(item => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.title}" class="cart-item-image">
          <div class="cart-item-info">
            <h4 class="cart-item-title">${item.title}</h4>
            <p class="cart-item-price">$${item.price.toFixed(2)}</p>
            <div class="quantity-controls">
              <button class="quantity-btn decrease-qty" data-product-id="${item.id}">-</button>
              <span class="quantity-display">${item.quantity}</span>
              <button class="quantity-btn increase-qty" data-product-id="${item.id}">+</button>
            </div>
          </div>
          <button class="remove-btn" data-product-id="${item.id}">Remove</button>
        </div>
      `).join('');

      // Add event listeners for cart item controls
      cartItems.addEventListener('click', (e) => {
        const productId = parseInt(e.target.dataset.productId);
        
        if (e.target.classList.contains('increase-qty')) {
          this.cartManager.updateQuantity(productId, this.cartManager.getItem(productId).quantity + 1);
          this.updateCartDisplay();
          this.updateCartBadge();
        } else if (e.target.classList.contains('decrease-qty')) {
          const currentQty = this.cartManager.getItem(productId).quantity;
          if (currentQty > 1) {
            this.cartManager.updateQuantity(productId, currentQty - 1);
          } else {
            this.cartManager.removeItem(productId);
          }
          this.updateCartDisplay();
          this.updateCartBadge();
        } else if (e.target.classList.contains('remove-btn')) {
          this.cartManager.removeItem(productId);
          this.updateCartDisplay();
          this.updateCartBadge();
          this.toastManager.show('Item removed from cart', 'success');
        }
      });
    }

    cartTotal.textContent = `$${total.toFixed(2)}`;
  }

  updateWishlistDisplay() {
    const wishlistItems = document.getElementById('wishlistItems');
    if (!wishlistItems) return;

    const items = this.wishlistManager.getItems();

    if (items.length === 0) {
      wishlistItems.innerHTML = `
        <div class="empty-wishlist">
          <div class="empty-wishlist-icon">❤️</div>
          <p>Your wishlist is empty</p>
        </div>
      `;
    } else {
      wishlistItems.innerHTML = items.map(item => `
        <div class="wishlist-item">
          <img src="${item.image}" alt="${item.title}" class="wishlist-item-image">
          <div class="wishlist-item-info">
            <h4 class="wishlist-item-title">${item.title}</h4>
            <p class="wishlist-item-price">$${item.price.toFixed(2)}</p>
            <div class="wishlist-item-actions">
              <button class="btn btn-primary add-to-cart-btn" data-product-id="${item.id}">Add to Cart</button>
              <button class="btn btn-secondary remove-wishlist-btn" data-product-id="${item.id}">Remove</button>
            </div>
          </div>
        </div>
      `).join('');

      // Add event listeners for wishlist item controls
      wishlistItems.addEventListener('click', (e) => {
        const productId = parseInt(e.target.dataset.productId);
        
        if (e.target.classList.contains('add-to-cart-btn')) {
          this.addToCart(productId);
        } else if (e.target.classList.contains('remove-wishlist-btn')) {
          this.wishlistManager.removeItem(productId);
          this.updateWishlistDisplay();
          this.updateWishlistBadge();
          this.updateProductCard(productId);
          this.toastManager.show('Item removed from wishlist', 'success');
        }
      });
    }
  }

  updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
      const count = this.cartManager.getItemCount();
      badge.textContent = count;
      badge.classList.toggle('hidden', count === 0);
    }
  }

  updateWishlistBadge() {
    const badge = document.getElementById('wishlistBadge');
    if (badge) {
      const count = this.wishlistManager.getItemCount();
      badge.textContent = count;
      badge.classList.toggle('hidden', count === 0);
    }
  }

  clearCart() {
    this.cartManager.clear();
    this.updateCartDisplay();
    this.updateCartBadge();
    this.toastManager.show('Cart cleared', 'success');
  }

  checkout() {
    const items = this.cartManager.getItems();
    if (items.length === 0) {
      this.toastManager.show('Your cart is empty', 'warning');
      return;
    }

    // Simulate checkout process
    this.toastManager.show('Redirecting to checkout...', 'success');
    
    // In a real app, you would redirect to a checkout page
    setTimeout(() => {
      this.toastManager.show('Checkout feature coming soon!', 'warning');
    }, 1500);
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new App();
});