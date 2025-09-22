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
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartCount() {
  cartCount.textContent = cart.length;
  localStorage.setItem("cart", JSON.stringify(cart));
}

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
    updateCartCount();
  });
});

// Initialize count on load
updateCartCount();
