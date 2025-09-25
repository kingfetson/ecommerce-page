export class CartManager {
  constructor() {
    this.items = [];
    this.storageKey = 'modernshop_cart';
  }

  init() {
    this.loadFromStorage();
  }

  addItem(product, quantity = 1) {
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: quantity
      });
    }
    
    this.saveToStorage();
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveToStorage();
  }

  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
        this.saveToStorage();
      }
    }
  }

  getItem(productId) {
    return this.items.find(item => item.id === productId);
  }

  getItems() {
    return [...this.items];
  }

  getItemCount() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  clear() {
    this.items = [];
    this.saveToStorage();
  }

  isEmpty() {
    return this.items.length === 0;
  }

  isInCart(productId) {
    return this.items.some(item => item.id === productId);
  }

  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.items = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      this.items = [];
    }
  }

  // Get cart summary for checkout
  getCartSummary() {
    return {
      items: this.getItems(),
      itemCount: this.getItemCount(),
      subtotal: this.getTotal(),
      tax: this.getTotal() * 0.08, // 8% tax
      shipping: this.getTotal() > 50 ? 0 : 9.99, // Free shipping over $50
      total: this.getTotal() + (this.getTotal() * 0.08) + (this.getTotal() > 50 ? 0 : 9.99)
    };
  }
}