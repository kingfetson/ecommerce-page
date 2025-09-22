// Dark Mode Toggle
const toggleBtn = document.getElementById("darkToggle");
const body = document.body;
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark");
  toggleBtn.textContent = "☀️";
}
toggleBtn.addEventListener("click", () => {
  body.classList.toggle("dark");
  const isDark = body.classList.contains("dark");
  toggleBtn.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Cart System
const cartCount = document.getElementById("cartCount");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div>
        <h4>${item.name}</h4>
        <p>$${item.price} x ${item.qty}</p>
      </div>
      <button onclick="removeFromCart(${index})">X</button>
    `;
    cartItemsContainer.appendChild(cartItem);
  });

  cartCount.textContent = cart.length;
  cartTotal.textContent = `Total: $${total}`;
  localStorage.setItem("cart", JSON.stringify(cart));
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

// Add to Cart Buttons
document.querySelectorAll(".add-cart").forEach((btn) => {
  btn.addEventListener("click", () => {
    const product = btn.parentElement;
    const id = product.dataset.id;
    const name = product.dataset.name;
    const price = parseFloat(product.dataset.price);
    const img = product.dataset.img;

    const existing = cart.find((item) => item.id === id);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ id, name, price, img, qty: 1 });
    }
    updateCart();
  });
});

// Initial render
updateCart();
