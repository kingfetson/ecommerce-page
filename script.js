// E-commerce Product Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('ShopHub E-commerce loaded successfully!');
    
    // Initialize all functionality
    initializeNavigation();
    initializeTheme();
    initializeCart();
    initializeContactForm();
    initializeSmoothScrolling();
});

// Sample product data
const products = [
    {
        id: 1,
        name: "Premium Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
        price: 199.99,
        icon: "fas fa-headphones"
    },
    {
        id: 2,
        name: "Smart Fitness Watch",
        description: "Advanced fitness tracker with heart rate monitoring and GPS functionality.",
        price: 299.99,
        icon: "fas fa-clock"
    },
    {
        id: 3,
        name: "Professional Camera Lens",
        description: "High-performance camera lens perfect for professional photography.",
        price: 899.99,
        icon: "fas fa-camera"
    },
    {
        id: 4,
        name: "Gaming Mechanical Keyboard",
        description: "RGB backlit mechanical keyboard designed for gaming enthusiasts.",
        price: 149.99,
        icon: "fas fa-keyboard"
    },
    {
        id: 5,
        name: "Wireless Charging Pad",
        description: "Fast wireless charging pad compatible with all Qi-enabled devices.",
        price: 49.99,
        icon: "fas fa-charging-station"
    },
    {
        id: 6,
        name: "Bluetooth Speaker",
        description: "Portable Bluetooth speaker with 360-degree sound and waterproof design.",
        price: 79.99,
        icon: "fas fa-volume-up"
    }
];

// Shopping cart functionality
let cart = JSON.parse(localStorage.getItem('shophub-cart')) || [];

function initializeCart() {
    updateCartUI();
    
    // Cart button click handler
    const cartBtn = document.getElementById('cart-btn');
    const cartDropdown = document.getElementById('cart-dropdown');
    
    if (cartBtn && cartDropdown) {
        cartBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            cartDropdown.classList.toggle('active');
        });
        
        // Close cart dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!cartDropdown.contains(e.target) && !cartBtn.contains(e.target)) {
                cartDropdown.classList.remove('active');
            }
        });
    }
    
    // Add to cart button handlers
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart-btn') || e.target.closest('.add-to-cart-btn')) {
            const button = e.target.classList.contains('add-to-cart-btn') ? e.target : e.target.closest('.add-to-cart-btn');
            const productId = parseInt(button.getAttribute('data-product-id'));
            if (productId) {
                addToCart(productId);
            }
        }
    });
    
    // Checkout button handler
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            
            const total = cart.reduce((sum, item) => sum + item.price, 0);
            alert(`Thank you for your purchase! Total: $${total.toFixed(2)}\n\nThis is a demo - no actual payment was processed.`);
            
            // Clear cart after "purchase"
            cart = [];
            localStorage.setItem('shophub-cart', JSON.stringify(cart));
            updateCartUI();
            document.getElementById('cart-dropdown').classList.remove('active');
        });
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            icon: product.icon
        });
        
        localStorage.setItem('shophub-cart', JSON.stringify(cart));
        updateCartUI();
        
        // Show feedback
        showAddToCartFeedback(product.name);
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('shophub-cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartCount || !cartItems || !cartTotal) return;
    
    // Update cart count
    cartCount.textContent = cart.length;
    if (cart.length > 0) {
        cartCount.classList.add('show');
    } else {
        cartCount.classList.remove('show');
    }
    
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-icon">
                    <i class="${item.icon}"></i>
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
    
    // Update total
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = total.toFixed(2);
}

function showAddToCartFeedback(productName) {
    // Create and show a temporary feedback message
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-large);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    feedback.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${productName} added to cart!</span>
    `;
    
    document.body.appendChild(feedback);
    
    // Remove feedback after 3 seconds
    setTimeout(() => {
        feedback.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(feedback)) {
                document.body.removeChild(feedback);
            }
        }, 300);
    }, 3000);
}

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');
    
    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Sticky navbar on scroll
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// Theme toggle functionality
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    if (!themeToggle) return;
    
    const icon = themeToggle.querySelector('i');
    
    // Load saved theme
    const savedTheme = localStorage.getItem('shophub-theme') || 'light';
    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        if (icon) icon.className = 'fas fa-sun';
    }
    
    // Theme toggle handler
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            body.removeAttribute('data-theme');
            if (icon) icon.className = 'fas fa-moon';
            localStorage.setItem('shophub-theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            if (icon) icon.className = 'fas fa-sun';
            localStorage.setItem('shophub-theme', 'dark');
        }
    });
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = contactForm.querySelector('input[type="text"]').value;
            const email = contactForm.querySelector('input[type="email"]').value;
            const message = contactForm.querySelector('textarea').value;
            
            if (name && email && message) {
                alert(`Thank you for your message, ${name}!\n\nWe'll get back to you at ${email} as soon as possible.\n\nThis is a demo form - no actual email was sent.`);
                contactForm.reset();
            }
        });
    }
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
setTimeout(() => {
    document.querySelectorAll('.product-card, .feature, .contact-item').forEach(el => {
        observer.observe(el);
    });
}, 100);

// Global functions for inline event handlers
window.removeFromCart = removeFromCart;
