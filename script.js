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
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
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
      <button class="remove-btn" data-id="${item.id}">❌</button>
    `;
    cartItemsContainer.appendChild(div);
  });

  // Attach remove button listeners
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      removeFromCart(id);
    });
  });

  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Toggle cart dropdown on click
document.querySelector(".cart-container").addEventListener("click", () => {
  cartDropdown.classList.toggle("show");
});

// Dark mode toggle
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  darkToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});
