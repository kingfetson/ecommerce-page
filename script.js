/* RESET */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: Arial, sans-serif;
  background: #f9f9f9;
  color: #333;
  line-height: 1.6;
  transition: background 0.3s, color 0.3s;
}
.dark {
  background: #1a1a1a;
  color: #f1f1f1;
}

/* NAVBAR */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #2c3e50;
  color: white;
  position: sticky;
  top: 0;
  z-index: 10;
}
.logo {
  font-weight: bold;
  font-size: 1.3rem;
}
.nav-links {
  display: flex;
  list-style: none;
  gap: 1.5rem;
}
.nav-links a {
  color: white;
  text-decoration: none;
  transition: color 0.2s;
}
.nav-links a:hover {
  color: #f39c12;
}
.nav-actions {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}
#darkToggle {
  border: none;
  background: transparent;
  font-size: 1.3rem;
  cursor: pointer;
  color: white;
}

/* CART */
.cart-container {
  position: relative;
  cursor: pointer;
}
#cartCount {
  background: red;
  color: white;
  border-radius: 50%;
  padding: 2px 8px;
  font-size: 0.8rem;
  font-weight: bold;
  position: absolute;
  top: -10px;
  left: 12px;
}
.cart-dropdown {
  position: absolute;
  right: 0;
  top: 150%;
  background: white;
  color: #333;
  width: 320px;
  border-radius: 8px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.2);
  padding: 1rem;
  display: none;
  z-index: 20;
}
.cart-container:hover .cart-dropdown,
.cart-dropdown.active {
  display: block;
}
.cart-dropdown h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.5rem;
}
#cartItems {
  max-height: 240px;
  overflow-y: auto;
  margin-bottom: 1rem;
}
.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}
.cart-item img {
  height: 40px;
  width: 40px;
  object-fit: contain;
  margin-right: 0.5rem;
}
.cart-details {
  flex: 1;
}
.cart-actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.cart-actions button {
  border: none;
  background: #ddd;
  padding: 2px 6px;
  cursor: pointer;
  border-radius: 4px;
}
.cart-actions button:hover {
  background: #bbb;
}
.remove-btn {
  background: transparent;
  color: red;
  font-size: 1.2rem;
  margin-left: 0.3rem;
  cursor: pointer;
}
#cartTotal {
  font-weight: bold;
  text-align: right;
  margin-top: 0.5rem;
}

/* HERO */
.hero {
  text-align: center;
  padding: 3rem 1rem;
  background: linear-gradient(135deg, #3498db, #2ecc71);
  color: white;
}
.hero h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}
.hero p {
  font-size: 1.2rem;
}

/* PRODUCTS */
.products {
  padding: 2rem;
  text-align: center;
}
.products h2 {
  font-size: 1.6rem;
  margin-bottom: 1.5rem;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}
.product-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  padding: 1rem;
  transition: transform 0.2s;
}
.product-card:hover {
  transform: translateY(-4px);
}
.product-card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 0.8rem;
}
.product-card h3 {
  font-size: 1.1rem;
  margin-bottom: 0.4rem;
}
.product-card p {
  margin-bottom: 0.6rem;
}
.product-card button {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
.product-card button:hover {
  background: #2980b9;
}

/* ABOUT / CONTACT */
.about, .contact {
  padding: 2rem;
  text-align: center;
}
.about h2, .contact h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

/* FOOTER */
.footer {
  text-align: center;
  padding: 1rem;
  background: #2c3e50;
  color: white;
  margin-top: 2rem;
}

/* DARK MODE */
.dark .navbar {
  background: #111;
}
.dark .nav-links a {
  color: #f1f1f1;
}
.dark .cart-dropdown {
  background: #2c2c2c;
  color: #f1f1f1;
}
.dark .product-card {
  background: #2c2c2c;
  color: #f1f1f1;
}
.dark .footer {
  background: #111;
}
