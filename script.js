// Elements
const cartCount = document.getElementById("cartCount");
const cartDropdown = document.getElementById("cartDropdown");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const darkToggle = document.getElementById("darkToggle");
const productGrid = document.getElementById("productGrid");

let cart = [];
let total = 0;

// Fetch products from FakeStoreAPI
async function loadProducts() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    const products = await res.json();

    productGrid.innerHTML = ""; // clear loading text

    products.forEach(product => {
      const div = document.createElement("div");
      div.classList.add("product-card");
      div.dataset.id = product.id;
      div.dataset.name = product.title;
      div.dataset.price = product.price;
      div.dataset.img = product.image;

      div.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p>$${product.price.toFixed(2)}</p>
        <button class="add-cart">Add to Cart</button>
      `;

      productGrid.appendChild(div);
    });

    // Attach add-to-cart events after products load
    document.querySelectorAll(".add-cart").forEach(button => {
      button.addEventListener("click", (e) => {
        const productCard = e.target.closest(".product-card");

        const product = {
          id: productCard.dataset.id,
          name: productCard.dataset.name,
          price: parseFloat(productCard.dataset.price),
          img: productCard.dataset.img,
          quantity: 1
        };

        addToCart(product);
      });
    });

  } catch (error) {
    productGrid.innerHTML = "<p>⚠️ Failed to load products. Try again later.</p>";
    console.error("Error loading products:", error);
  }
}

// Add item to cart
function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push(product);
  }

  updateCart();
}

// Decrease quantity
function removeFromCart(productId) {
  const item = cart.find(p => p.id === productId);
  if (item) {
    item.quantity--;
    if (item.quantity <= 0) {
      cart = cart.filter(p => p.id !== productId);
    }
  }
  updateCart();
}

// Increase quantity inside cart
function increaseQuantity(productId) {
  const item = cart.find(p => p.id === productId);
  if (item) {
    item.quantity++;
  }
  updateCart();
}

// Update cart UI
function updateCart() {
  cartItemsContainer.innerHTML = "";
  total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}" width="40">
      <span>${item.name}</span>
      <div>
        <button onclick="removeFromCart('${item.id}')">➖</button>
        <span>${item.quantity}</span>
        <button onclick="increaseQuantity('${item.id}')">➕</button>
      </div>
      <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
    `;
    cartItemsContainer.appendChild(div);
  });

  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Toggle cart dropdown (only when cart icon is clicked)
document.querySelector(".cart-container").addEventListener("click", (e) => {
  if (e.target.closest("#cartDropdown")) return; // ignore clicks inside dropdown
  cartDropdown.classList.toggle("show");
});

// Close cart when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".cart-container")) {
    cartDropdown.classList.remove("show");
  }
});

// Dark mode toggle
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  darkToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// Load products on page load
loadProducts();
