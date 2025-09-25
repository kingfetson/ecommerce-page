export class ProductManager {
  constructor() {
    this.products = [];
    this.apiUrl = 'https://fakestoreapi.com/products';
  }

  async fetchProducts() {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.products = await response.json();
      return this.products;
    } catch (error) {
      console.error('Error fetching products:', error);
      // Return fallback products if API fails
      return this.getFallbackProducts();
    }
  }

  getProductById(id) {
    return this.products.find(product => product.id === id);
  }

  getProductsByCategory(category) {
    return this.products.filter(product => product.category === category);
  }

  searchProducts(query) {
    const lowercaseQuery = query.toLowerCase();
    return this.products.filter(product =>
      product.title.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  sortProducts(products, sortBy) {
    const sortedProducts = [...products];
    
    switch (sortBy) {
      case 'price-low':
        return sortedProducts.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sortedProducts.sort((a, b) => b.price - a.price);
      case 'name':
        return sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
      case 'rating':
        return sortedProducts.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
      default:
        return sortedProducts;
    }
  }

  filterByPriceRange(products, minPrice, maxPrice) {
    return products.filter(product => 
      product.price >= minPrice && product.price <= maxPrice
    );
  }

  getCategories() {
    return [...new Set(this.products.map(product => product.category))];
  }

  getFallbackProducts() {
    return [
      {
        id: 1,
        title: "Premium Wireless Headphones",
        price: 99.99,
        description: "High-quality wireless headphones with noise cancellation",
        category: "electronics",
        image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400",
        rating: { rate: 4.5, count: 120 }
      },
      {
        id: 2,
        title: "Smart Fitness Watch",
        price: 199.99,
        description: "Advanced fitness tracking with heart rate monitor",
        category: "electronics",
        image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400",
        rating: { rate: 4.3, count: 89 }
      },
      {
        id: 3,
        title: "Comfortable Running Shoes",
        price: 79.99,
        description: "Lightweight running shoes for daily training",
        category: "footwear",
        image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400",
        rating: { rate: 4.7, count: 156 }
      },
      {
        id: 4,
        title: "Stylish Backpack",
        price: 49.99,
        description: "Durable backpack perfect for work and travel",
        category: "accessories",
        image: "https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=400",
        rating: { rate: 4.2, count: 73 }
      }
    ];
  }
}