// Dark Mode Toggle
const darkToggle = document.getElementById("darkToggle");
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  darkToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// Cart Elements
const cartCount = document.getElementById("cartCount");
const cartItemsTable = document.querySelector("#cartItems tbody");
const cartTotal = document.getElementById("cartTotal");
const clearCartBtn = document.getElementById("clearCart");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Add to Cart
document.querySelectorAll(".add-cart").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.parentElement;
    const product = {
      id: card.dataset.id,
      name: card.dataset.name,
      price: parseFloat(card.dataset.price),
      img: card.dataset.img,
      qty: 1,
    };

    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.qty++;
    } else {
      cart.push(product);
    }

    saveCart();
    renderCart();
  });
});

// Save Cart
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Render Cart
function renderCart() {
  cartItemsTable.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td><img src="${item.img}" alt="${item.name}"></td>
      <td>${item.name}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>
        <input type="number" min="1" value="${item.qty}" class="qty-input" data-index="${index}" style="width: 60px; padding: 5px;">
      </td>
      <td><button class="remove-btn" data-index="${index}">❌</button></td>
    `;

    cartItemsTable.appendChild(row);
    total += item.price * item.qty;
  });

  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
  cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);

  // Remove item
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      cart.splice(index, 1);
      saveCart();
      renderCart();
    });
  });

  // Update quantity
  document.querySelectorAll(".qty-input").forEach((input) => {
    input.addEventListener("change", (e) => {
      const index = e.target.dataset.index;
      let newQty = parseInt(e.target.value);
      if (isNaN(newQty) || newQty < 1) newQty = 1;
      cart[index].qty = newQty;
      saveCart();
      renderCart();
    });
  });
}

// Clear Cart
clearCartBtn.addEventListener("click", () => {
  cart = [];
  saveCart();
  renderCart();
});

// Initialize
renderCart();
