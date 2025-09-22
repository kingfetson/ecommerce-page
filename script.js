// Dark mode toggle
const darkToggle = document.getElementById("darkToggle");
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  darkToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// Cart system
const addCartButtons = document.querySelectorAll(".add-cart");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartDropdown = document.getElementById("cartDropdown");
const cartContainer = document.querySelector(".cart-container");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Render cart
function renderCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <p>${item.name} - $${item.price} x ${item.qty}</p>
    `;
    cartItems.appendChild(div);
    total += item.price * item.qty;
  });

  cartTotal.textContent = `Total: $${total}`;
  cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  localStorage.setItem("cart", JSON.stringify(cart));
}

addCartButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".product-card");
    const id = card.dataset.id;
    const name = card.dataset.name;
    const price = parseFloat(card.dataset.price);

    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ id, name, price, qty: 1 });
    }

    renderCart();
  });
});

// Toggle cart dropdown
cartContainer.addEventListener("click", () => {
  cartDropdown.style.display =
    cartDropdown.style.display === "block" ? "none" : "block";
});

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!cartContainer.contains(e.target)) {
    cartDropdown.style.display = "none";
  }
});

renderCart();
