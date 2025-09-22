// Dark mode toggle
const toggleBtn = document.getElementById("darkToggle");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// Keep theme on reload
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

// Cart logic
const addCartBtns = document.querySelectorAll(".add-cart");
const cartCount = document.getElementById("cartCount");
const cartDropdown = document.getElementById("cartDropdown");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update cart UI
function updateCart() {
  cartCount.textContent = cart.length;
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += parseFloat(item.price);

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <span>${item.name} - $${item.price}</span>
      <button data-index="${index}">x</button>
    `;
    cartItemsContainer.appendChild(div);
  });

  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Add to cart
addCartBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const product = btn.parentElement;
    const item = {
      id: product.dataset.id,
      name: product.dataset.name,
      price: product.dataset.price,
      img: product.dataset.img
    };
    cart.push(item);
    updateCart();
  });
});

// Remove from cart
cartItemsContainer.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const index = e.target.dataset.index;
    cart.splice(index, 1);
    updateCart();
  }
});

// Toggle cart dropdown
document.querySelector(".cart-container").addEventListener("click", () => {
  cartDropdown.style.display =
    cartDropdown.style.display === "block" ? "none" : "block";
});

// Initialize on load
updateCart();
