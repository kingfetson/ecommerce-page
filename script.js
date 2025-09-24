
    // Your ENTIRE JS code, wrapped in DOMContentLoaded for safety
    document.addEventListener("DOMContentLoaded", function() {
      // Select elements (DOM is now ready—no nulls!)
      const shop = document.getElementById("shop");
      const cartIcon = document.getElementById("cart-icon");
      const cartModal = document.getElementById("cart-modal");
      const closeCartBtn = document.getElementById("close-cart");
      const cartItemsContainer = document.getElementById("cart-items");
      const totalPriceElement = document.getElementById("total-price");

      // Debug: Log if elements are found (remove after testing)
      console.log("Elements loaded:", { shop, cartIcon, cartModal, closeCartBtn, cartItemsContainer, totalPriceElement });

      let basket = [];

      // Update cart icon badge
      function updateCartBadge() {
        const badge = cartIcon.querySelector("span") || document.createElement("span");
        badge.textContent = basket.reduce((sum, item) => sum + item.qty, 0);
        if (!cartIcon.querySelector("span")) {
          badge.className = "ml-1 bg-red-500 text-xs rounded-full px-1";
          cartIcon.appendChild(badge);
        }
      }

      // Toggle cart modal
      if (cartIcon) {
        cartIcon.addEventListener("click", () => {
          cartModal.classList.toggle("hidden");
          updateCartBadge(); // Refresh badge
        });
      }

      if (closeCartBtn) {
        closeCartBtn.addEventListener("click", () => {
          cartModal.classList.add("hidden");
        });
      }

      // Close on outside click (bonus feature)
      if (cartModal) {
        cartModal.addEventListener("click", (e) => {
          if (e.target === cartModal) {
            cartModal.classList.add("hidden");
          }
        });
      }

      // Fetch products from Fake Store API
      async function fetchProducts() {
        try {
          const res = await fetch("https://fakestoreapi.com/products");
          if (!res.ok) throw new Error("API responded with " + res.status);
          const products = await res.json();
          console.log("Products fetched successfully:", products.length, "items");
          generateShop(products);
        } catch (err) {
          console.error("API fetch error:", err);
          if (shop) {
            shop.innerHTML = "<p class='col-span-full text-center text-red-500 text-lg'>Failed to load products. Check your connection and try again. (Error: " + err.message + ")</p>";
          }
        }
      }

      // Generate product cards dynamically
      function generateShop(products) {
        if (!shop) {
          console.error("Shop element not found!");
          return;
        }
        shop.innerHTML = products
          .map((product) => {
            const safeTitle = product.title.replace(/'/g, "\\'").replace(/"/g, '\\"');
            const safeImage = product.image.replace(/'/g, "\\'").replace(/"/g, '\\"');
            return `
              <div class="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center hover:shadow-xl transition-shadow">
                <img src="${product.image}" alt="${product.title}" class="h-48 w-full object-contain mb-3 rounded">
                <h3 class="text-base font-bold text-center mb-2 line-clamp-2">${product.title}</h3>
                <p class="text-gray-500 text-sm mb-2">${product.category}</p>
                <p class="text-lg font-semibold text-green-600 mb-3">$${product.price.toFixed(2)}</p>
                <button onclick="addToCart(${product.id}, '${safeTitle}', ${product.price}, '${safeImage}')" 
                  class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                  Add to Cart
                </button>
              </div>
            `;
          })
          .join("");
      }

      // Make functions global for onclick handlers
      window.addToCart = function(id, title, price, image) {
        console.log("Adding to cart:", { id, title, price }); // Debug
        let existingItem = basket.find((x) => x.id === id);
        if (existingItem) {
          existingItem.qty += 1;
        } else {
          basket.push({ id, title, price, image, qty: 1 });
        }
        updateCart();
        updateCartBadge();
      };

      // Update cart UI
      function updateCart() {
        if (!cartItemsContainer) return;
        if (basket.length === 0) {
          cartItemsContainer.innerHTML = "<p class='text-gray-500 text-center'>Your cart is empty.</p>";
          if (totalPriceElement) totalPriceElement.textContent = "0.00";
          return;
        }

        cartItemsContainer.innerHTML = basket
          .map((item) => {
            return `
              <div class="flex items-center justify-between border-b py-3 last:border-b-0">
                <img src="${item.image}" alt="${item.title}" class="h-16 w-16 object-contain rounded">
                <div class="flex-1 px-3">
                  <h4 class="text-sm font-semibold mb-1 line-clamp-2">${item.title}</h4>
                  <p class="text-gray-600 mb-2">$${item.price.toFixed(2)} each</p>
                  <div class="flex items-center space-x-3">
                    <button onclick="decreaseQty(${item.id})" class="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded">-</button>
                    <span class="font-semibold w-8 text-center">${item.qty}</span>
                    <button onclick="increaseQty(${item.id})" class="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded">+</button>
                  </div>
                </div>
                <button onclick="removeFromCart(${item.id})" class="text-red-500 font-bold text-xl hover:text-red-700 ml-2">×</button>
              </div>
            `;
          })
          .join("");

        // Calculate total price
        let total = basket.reduce((acc, item) => acc + (item.price * item.qty), 0);
        if (totalPriceElement) totalPriceElement.textContent = total.toFixed(2);
      }

      window.increaseQty = function(id) {
        let item = basket.find((x) => x.id === id);
        if (item) {
          item.qty += 1;
          updateCart();
          updateCartBadge();
        }
      };

      window.decreaseQty = function(id) {
        let item = basket.find((x) => x.id === id);
        if (item) {
          if (item.qty > 1) {
            item.qty -= 1;
          } else {
            basket = basket.filter((x) => x.id !== id);
          }
          updateCart();
          updateCartBadge();
        }
      };

      window.removeFromCart = function(id) {
        basket = basket.filter((x) => x.id !== id);
        updateCart();
        updateCartBadge();
      };

      // Load products on page load
      fetchProducts();
    });
 
