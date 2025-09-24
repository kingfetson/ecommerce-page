// Select elements
const shop = document.getElementById("shop");
const cartIcon = document.getElementById("cart-icon");
const cartModal = document.getElementById("cart-modal");
const closeCartBtn = document.getElementById("close-cart");
const cartItemsContainer = document.getElementById("cart-items");
const totalPriceElement = document.getElementById("total-price");

let basket = [];

// Toggle cart modal
cartIcon.addEventListener("click", () => {
  cartModal.classList.toggle("hidden");
});

closeCartBtn.addEventListener("click", () => {
  cartModal.classList.add("hidden");
});

// Fetch products from Fake Store API
async function fetchProducts() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    const products = await res.json();
    generateShop(products);
  } catch (err) {
    console.error("API fetch error:", err);
    shop.innerHTML = "<p class='text-red-500'>Failed to load products. Try again later.</p>";
  }
}

// Generate product cards dynamically
function generateShop(products) {
  shop.innerHTML = products
    .map((product) => {
      return `
        <div class="bg-white shadow rounded p-4 flex flex-col items-center">
          <img src="${product.image}" alt="${product.title}" class="h-40 object-contain mb-2">
          <h3 class="text-sm font-bold text-center mb-1">${product.title}</h3>
          <p class="text-gray-500 text-sm mb-2">${product.category}</p>
          <p class="font-semibold mb-2">$${product.price}</p>
          <button onclick="addToCart(${product.id}, '${product.title.replace(/'/g, "\\'")}', ${product.price}, '${product.image}')" 
            class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
            Add to Cart
          </button>
        </div>
      `;
    })
    .join("");
}

// Add item to cart
function addToCart(id, title, price, image) {
  let existingItem = basket.find((x) => x.id === id);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    basket.push({ id, title, price, image, qty: 1 });
  }
  updateCart();
}

// Update cart UI
function updateCart() {
  cartItemsContainer.innerHTML = basket
    .map((item) => {
      return `
        <div class="flex items-center justify-between border-b py-2">
          <img src="${item.image}" alt="${item.title}" class="h-12 w-12 object-contain">
          <div class="flex-1 px-2">
            <h4 class="text-sm font-semibold">${item.title}</h4>
            <p class="text-gray-600">$${item.price}</p>
            <div class="flex items-center space-x-2 mt-1">
              <button onclick="decreaseQty(${item.id})" class="bg-gray-300 px-2 rounded">-</button>
              <span>${item.qty}</span>
              <button onclick="increaseQty(${item.id})" class="bg-gray-300 px-2 rounded">+</button>
            </div>
          </div>
          <button onclick="removeFromCart(${item.id})" class="text-red-500 font-bold">X</button>
        </div>
      `;
    })
    .join("");

  // Calculate total price
  let total = basket.reduce((acc, item) => acc + item.price * item.qty, 0);
  totalPriceElement.textContent = `$${total.toFixed(2)}`;
}

// Increase quantity
function increaseQty(id) {
  let item = basket.find((x) => x.id === id);
  if (item) {
    item.qty += 1;
    updateCart();
  }
}

// Decrease quantity
function decreaseQty(id) {
  let item = basket.find((x) => x.id === id);
  if (item && item.qty > 1) {
    item.qty -= 1;
  } else {
    basket = basket.filter((x) => x.id !== id);
  }
  updateCart();
}

// Remove item completely
function removeFromCart(id) {
  basket = basket.filter((x) => x.id !== id);
  updateCart();
}

// Load products on page load
fetchProducts();
