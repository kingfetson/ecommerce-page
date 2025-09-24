css and html for this:
// ENTIRE JS code, wrapped in DOMContentLoaded for safety
document.addEventListener("DOMContentLoaded", function() {
  // Select elements
  const shop = document.getElementById("shop");
  const cartIcon = document.getElementById("cart-icon");
  const cartModal = document.getElementById("cart-modal");
  const closeCartBtn = document.getElementById("close-cart");
  const cartItemsContainer = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("total-price");
  const cartBadge = document.getElementById("cart-badge");
  const darkToggle = document.getElementById("dark-toggle");

  let basket = JSON.parse(localStorage.getItem("basket")) || [];

  // Save basket to localStorage
  function saveBasket() {
    localStorage.setItem("basket", JSON.stringify(basket));
  }

  // Update cart badge
  function updateCartBadge() {
    const count = basket.reduce((sum, item) => sum + item.qty, 0);
    if (cartBadge) {
      cartBadge.textContent = count;
      count > 0 ? cartBadge.classList.remove("hidden") : cartBadge.classList.add("hidden");
    }
  }

  // Toggle cart modal
  if (cartIcon) {
    cartIcon.addEventListener("click", () => {
      cartModal.classList.toggle("hidden");
      updateCartBadge();
    });
  }

  if (closeCartBtn) {
    closeCartBtn.addEventListener("click", () => {
      cartModal.classList.add("hidden");
    });
  }

  // Close when clicking outside modal
  if (cartModal) {
    cartModal.addEventListener("click", (e) => {
      if (e.target === cartModal) cartModal.classList.add("hidden");
    });
  }

  // Dark mode toggle
  if (darkToggle) {
    const isDark = localStorage.getItem("darkMode") === "true";
    document.body.classList.toggle("dark", isDark);
    darkToggle.textContent = isDark ? "☀️" : "🌙";

    darkToggle.addEventListener("click", () => {
      const newDark = !document.body.classList.contains("dark");
      document.body.classList.toggle("dark", newDark);
      darkToggle.textContent = newDark ? "☀️" : "🌙";
      localStorage.setItem("darkMode", newDark);
    });
  }

  // Fetch products
  async function fetchProducts() {
    try {
      const res = await fetch("https://fakestoreapi.com/products");
      if (!res.ok) throw new Error("API responded with " + res.status);
      const products = await res.json();
      generateShop(products);
    } catch (err) {
      console.error("API fetch error:", err);
      if (shop) {
        shop.innerHTML = `<div class='error-message'>Failed to load products. ${err.message}</div>`;
      }
    }
  }

  // Generate product cards dynamically
  function generateShop(products) {
    if (!shop) return;

    shop.innerHTML = "";
    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card bg-white shadow-lg rounded-lg p-4 flex flex-col items-center hover:shadow-xl transition-shadow";

      card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="h-48 w-full object-contain mb-3 rounded">
        <h3 class="text-base font-bold text-center mb-2 line-clamp-2">${product.title}</h3>
        <p class="text-gray-500 text-sm mb-2">${product.category}</p>
        <p class="text-lg font-semibold text-green-600 mb-3">$${product.price.toFixed(2)}</p>
      `;

      // Create Add to Cart button separately
      const btn = document.createElement("button");
      btn.textContent = "Add to Cart";
      btn.className = "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors w-full";
      btn.addEventListener("click", () => addToCart(product.id, product.title, product.price, product.image));

      card.appendChild(btn);
      shop.appendChild(card);
    });
  }

  // Add to cart
  function addToCart(id, title, price, image) {
    let existingItem = basket.find(x => x.id === id);
    if (existingItem) {
      existingItem.qty += 1;
    } else {
      basket.push({ id, title, price, image, qty: 1 });
    }
    updateCart();
    updateCartBadge();
    saveBasket();
  }

  // Update cart UI
  function updateCart() {
    if (!cartItemsContainer) return;

    if (basket.length === 0) {
      cartItemsContainer.innerHTML = "<p class='text-gray-500 text-center py-4'>Your cart is empty.</p>";
      if (totalPriceElement) totalPriceElement.textContent = "0.00";
      return;
    }

    cartItemsContainer.innerHTML = "";
    basket.forEach(item => {
      const div = document.createElement("div");
      div.className = "flex items-center justify-between border-b py-3 last:border-b-0";

      div.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="h-16 w-16 object-contain rounded mr-4">
        <div class="flex-1">
          <h4 class="text-sm font-semibold mb-1 line-clamp-2">${item.title}</h4>
          <p class="text-gray-600 mb-2">$${item.price.toFixed(2)} each</p>
        </div>
      `;

      // Quantity controls
      const qtyControls = document.createElement("div");
      qtyControls.className = "flex items-center space-x-3";

      const decBtn = document.createElement("button");
      decBtn.textContent = "-";
      decBtn.className = "bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded";
      decBtn.addEventListener("click", () => decreaseQty(item.id));

      const qtySpan = document.createElement("span");
      qtySpan.textContent = item.qty;
      qtySpan.className = "font-semibold w-8 text-center";

      const incBtn = document.createElement("button");
      incBtn.textContent = "+";
      incBtn.className = "bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded";
      incBtn.addEventListener("click", () => increaseQty(item.id));

      qtyControls.append(decBtn, qtySpan, incBtn);

      // Remove button
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "×";
      removeBtn.className = "text-red-500 font-bold text-xl hover:text-red-700 ml-4";
      removeBtn.addEventListener("click", () => removeFromCart(item.id));

      div.appendChild(qtyControls);
      div.appendChild(removeBtn);
      cartItemsContainer.appendChild(div);
    });

    let total = basket.reduce((acc, item) => acc + (item.price * item.qty), 0);
    if (totalPriceElement) totalPriceElement.textContent = total.toFixed(2);
  }

  // Quantity and remove functions
  function increaseQty(id) {
    let item = basket.find(x => x.id === id);
    if (item) {
      item.qty += 1;
      updateCart();
      updateCartBadge();
      saveBasket();
    }
  }

  function decreaseQty(id) {
    let item = basket.find(x => x.id === id);
    if (item) {
      if (item.qty > 1) {
        item.qty -= 1;
      } else {
        basket = basket.filter(x => x.id !== id);
      }
      updateCart();
      updateCartBadge();
      saveBasket();
    }
  }

  function removeFromCart(id) {
    basket = basket.filter(x => x.id !== id);
    updateCart();
    updateCartBadge();
    saveBasket();
  }

  // Initial load
  updateCart();
  updateCartBadge();
  fetchProducts();
});
