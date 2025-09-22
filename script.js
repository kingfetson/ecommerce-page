// Elements
const cartCount = document.getElementById("cartCount");
const cartDropdown = document.getElementById("cartDropdown");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const darkToggle = document.getElementById("darkToggle");

let cart = [];
let total = 0;

// Handle "Add to Cart" button clicks
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

// Remove item from cart
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

// Increase item quantity
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
      <span>${item.name} (x${item.quantity})</span>
      <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
      <div>
        <button class="decrease" data-id="${item.id}">-</button>
        <button class="increase" data-id="${item.id}">+</button>
      </div>
    `;
    cartItemsContainer.appendChild(div);
  });

  // Attach events for - and +, and stop propagation
  document.querySelectorAll(".decrease").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      removeFromCart(e.target.dataset.id);
    });
  });

  document.querySelectorAll(".increase").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      increaseQuantity(e.target.dataset.id);
    });
  });

  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Toggle cart dropdown (open/close on icon click)
document.querySelector(".cart-container").addEventListener("click", (e) => {
  if (e.target.closest("#cartDropdown")) return; // ignore clicks inside cart
  cartDropdown.classList.toggle("show");
});

// Prevent clicks inside cart from closing it
cartDropdown.addEventListener("click", (e) => {
  e.stopPropagation();
});

// Close cart only when clicking outside
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
