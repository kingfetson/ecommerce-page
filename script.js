// Full dynamic cart logic + dark mode, wrapped for DOM ready (no null errors)
document.addEventListener("DOMContentLoaded", function() {
  // Select elements (DOM is loaded—safe!)
  const shop = document.getElementById("shop");
  const cartIcon = document.getElementById("cart-icon");
  const cartDropdown = document.getElementById("cartDropdown");
  const closeCartBtn = document.getElementById("close-cart");
  const cartItemsContainer = document.getElementById("cartItems");
  const totalPriceElement = document.getElementById("cartTotal");
  const cartCountElement = document.getElementById("cartCount");
  const darkToggle = document.getElementById("darkToggle");

  // Debug log (remove after testing)
  console.log("Elements loaded:", { 
    shop, cartIcon, cartDropdown, closeCartBtn, cartItemsContainer, 
    totalPriceElement, cartCountElement, darkToggle 
  });

  // Safety checks
  if (!shop) console.error("Shop element (#shop) not found! Add id='shop' to .product-grid in HTML.");
  if (!cartIcon) console.error("Cart icon (#cart-icon) not found! Add id='cart-icon' to .cart-container.");

  let basket = JSON.parse(localStorage.getItem("basket")) || []; // Persistent cart

  // Dark mode toggle (integrates with CSS body.dark)
  if (darkToggle) {
    const isDark = localStorage.getItem("darkMode") === "true";
    document.body.classList.toggle("dark", isDark);
    darkToggle.textContent = isDark ? "☀️" : "🌙";

    darkToggle.addEventListener("click", () => {
      const currentDark = document.body.classList.contains("dark");
      const newDark = !currentDark;
      document.body.classList.toggle("dark", newDark);
      darkToggle.textContent = newDark ? "☀️" : "🌙";
      localStorage.setItem("darkMode", newDark);
    });
  }

  // Load initial dark mode from storage
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
    if (darkToggle) darkToggle.textContent = "☀️";
  }

  // Toggle cart dropdown (uses CSS .show)
  if (cartIcon) {
    cartIcon.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent nav clicks
      cartDropdown.classList.toggle("show");
    });
  }

  if (closeCartBtn) {
    closeCartBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      cartDropdown.classList.remove("show");
    });
  }

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!cartIcon.contains(e.target) && !cartDropdown.contains(e.target)) {
      cartDropdown.classList.remove("show");
    }
  });

  // Update cart count badge
  function updateCartBadge() {
    if (cartCountElement) {
      const count = basket.reduce((sum, item) => sum + item.qty, 0);
      cartCountElement.textContent = count;
    }
  }

  // Save basket to localStorage
  function saveBasket() {
    localStorage.setItem("basket", JSON.stringify(basket));
  }

  // Fetch products from Fake Store API
  async function fetchProducts() {
    try {
      const res = await fetch("https://fakestoreapi.com/products");
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const products = await res.json();
      console.log("Products fetched:", products.length, "items");
      generateShop(products);
    } catch (err) {
      console.error("API fetch error:", err);
      if (shop) {
        shop.innerHTML = `<div class="error-message">Failed to load products. Check your connection. (Error: ${err.message})</div>`;
      }
    }
  }

  // Generate dynamic product cards (uses .product-card CSS)
  function generateShop(products) {
    if (!shop) return;
    shop.innerHTML = products
      .map((product) => {
        const safeTitle = product.title.replace(/'/g, "\\'").replace(/"/g, '\\"');
        const safeImage = product.image.replace(/'/g, "\\'").replace(/"/g, '\\"');
        return `
          <div class="product-card" data-id="${product.id}" data-name="${product.title}" data-price="${product.price}" data-img="${product.image}">
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p class="category">${product.category}</p>
            <p class="price">$${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id}, '${safeTitle}', ${product.price}, '${safeImage}')" class="add-cart">
              Add to Cart
            </button>
          </div>
        `;
      })
      .join("");
  }

  // Global functions for onclick (add, qty, remove—styled via CSS)
  window.addToCart = function(id, title, price, image) {
    console.log("Adding:", { id, title });
    let existingItem = basket.find((x) => x.id === id);
    if (existingItem) {
      existingItem.qty += 1;
    } else {
      basket.push({ id, title, price, image, qty: 1 });
    }
    updateCart();
    updateCartBadge();
    saveBasket();
  };

  window.increaseQty = function(id) {
    let item = basket.find((x) => x.id === id);
    if (item) {
