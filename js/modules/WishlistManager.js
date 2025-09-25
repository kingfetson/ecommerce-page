export class WishlistManager {
  constructor() {
    this.items = [];
    this.storageKey = 'modernshop_wishlist';
  }

  init() {
    this.loadFromStorage();
  }

  addItem(product) {
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (!existingItem) {
      this.items.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        dateAdded: new Date().toISOString()
      });
      this.saveToStorage();
      return true;
    }
    return false;
  }

  removeItem(productId) {
    const initialLength = this.items.length;
    this.items = this.items.filter(item => item.id !== productId);
    
    if (this.items.length !== initialLength) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  getItem(productId) {
    return this.items.find(item => item.id === productId);
  }

  getItems() {
    return [...this.items];
  }

  getItemCount() {
    return this.items.length;
  }

  clear() {
    this.items = [];
    this.saveToStorage();
  }

  isEmpty() {
    return this.items.length === 0;
  }

  isInWishlist(productId) {
    return this.items.some(item => item.id === productId);
  }

  toggleItem(product) {
    if (this.isInWishlist(product.id)) {
      return this.removeItem(product.id);
    } else {
      return this.addItem(product);
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.items = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error);
      this.items = [];
    }
  }

  // Get recently added items
  getRecentItems(limit = 5) {
    return this.items
      .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
      .slice(0, limit);
  }

  // Get items by category
  getItemsByCategory(category) {
    return this.items.filter(item => item.category === category);
  }
}