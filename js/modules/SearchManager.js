export class SearchManager {
  constructor() {
    this.query = '';
    this.searchHistory = [];
    this.storageKey = 'modernshop_search_history';
    this.maxHistoryItems = 10;
  }

  init() {
    this.loadSearchHistory();
  }

  setQuery(query) {
    this.query = query.trim();
  }

  getQuery() {
    return this.query;
  }

  clearQuery() {
    this.query = '';
  }

  // Add search to history
  addToHistory(query) {
    if (!query || query.length < 2) return;

    // Remove if already exists
    this.searchHistory = this.searchHistory.filter(item => item.query !== query);
    
    // Add to beginning
    this.searchHistory.unshift({
      query: query,
      timestamp: new Date().toISOString(),
      count: 1
    });

    // Limit history size
    if (this.searchHistory.length > this.maxHistoryItems) {
      this.searchHistory = this.searchHistory.slice(0, this.maxHistoryItems);
    }

    this.saveSearchHistory();
  }

  // Get search history
  getHistory() {
    return [...this.searchHistory];
  }

  // Clear search history
  clearHistory() {
    this.searchHistory = [];
    this.saveSearchHistory();
  }

  // Get popular searches
  getPopularSearches(limit = 5) {
    return this.searchHistory
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  // Get recent searches
  getRecentSearches(limit = 5) {
    return this.searchHistory
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  // Search products with highlighting
  searchProducts(products, query) {
    if (!query) return products;

    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    return products.filter(product => {
      const searchableText = [
        product.title,
        product.description,
        product.category
      ].join(' ').toLowerCase();

      return searchTerms.every(term => searchableText.includes(term));
    });
  }

  // Highlight search terms in text
  highlightSearchTerms(text, query) {
    if (!query) return text;

    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    let highlightedText = text;

    searchTerms.forEach(term => {
      const regex = new RegExp(`(${this.escapeRegExp(term)})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
    });

    return highlightedText;
  }

  // Escape special regex characters
  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Get search suggestions
  getSuggestions(products, query, limit = 5) {
    if (!query || query.length < 2) return [];

    const suggestions = new Set();
    const queryLower = query.toLowerCase();

    products.forEach(product => {
      // Title suggestions
      if (product.title.toLowerCase().includes(queryLower)) {
        suggestions.add(product.title);
      }

      // Category suggestions
      if (product.category.toLowerCase().includes(queryLower)) {
        suggestions.add(product.category);
      }

      // Extract words from title for partial matches
      const words = product.title.toLowerCase().split(' ');
      words.forEach(word => {
        if (word.startsWith(queryLower) && word.length > queryLower.length) {
          suggestions.add(word);
        }
      });
    });

    return Array.from(suggestions).slice(0, limit);
  }

  // Save search history to localStorage
  saveSearchHistory() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.searchHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }

  // Load search history from localStorage
  loadSearchHistory() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.searchHistory = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading search history:', error);
      this.searchHistory = [];
    }
  }

  // Advanced search with filters
  advancedSearch(products, options = {}) {
    const {
      query = '',
      category = '',
      minPrice = 0,
      maxPrice = Infinity,
      minRating = 0,
      sortBy = 'relevance'
    } = options;

    let results = products;

    // Text search
    if (query) {
      results = this.searchProducts(results, query);
    }

    // Category filter
    if (category) {
      results = results.filter(product => product.category === category);
    }

    // Price range filter
    results = results.filter(product => 
      product.price >= minPrice && product.price <= maxPrice
    );

    // Rating filter
    if (minRating > 0) {
      results = results.filter(product => 
        (product.rating?.rate || 0) >= minRating
      );
    }

    // Sort results
    results = this.sortSearchResults(results, sortBy, query);

    return results;
  }

  // Sort search results
  sortSearchResults(products, sortBy, query = '') {
    const sortedProducts = [...products];

    switch (sortBy) {
      case 'relevance':
        if (query) {
          return this.sortByRelevance(sortedProducts, query);
        }
        return sortedProducts;
      
      case 'price-low':
        return sortedProducts.sort((a, b) => a.price - b.price);
      
      case 'price-high':
        return sortedProducts.sort((a, b) => b.price - a.price);
      
      case 'rating':
        return sortedProducts.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
      
      case 'name':
        return sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
      
      default:
        return sortedProducts;
    }
  }

  // Sort by relevance based on search query
  sortByRelevance(products, query) {
    const queryLower = query.toLowerCase();
    
    return products.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      // Title exact match gets highest score
      if (a.title.toLowerCase() === queryLower) scoreA += 100;
      if (b.title.toLowerCase() === queryLower) scoreB += 100;

      // Title starts with query
      if (a.title.toLowerCase().startsWith(queryLower)) scoreA += 50;
      if (b.title.toLowerCase().startsWith(queryLower)) scoreB += 50;

      // Title contains query
      if (a.title.toLowerCase().includes(queryLower)) scoreA += 25;
      if (b.title.toLowerCase().includes(queryLower)) scoreB += 25;

      // Category match
      if (a.category.toLowerCase().includes(queryLower)) scoreA += 10;
      if (b.category.toLowerCase().includes(queryLower)) scoreB += 10;

      // Description match
      if (a.description.toLowerCase().includes(queryLower)) scoreA += 5;
      if (b.description.toLowerCase().includes(queryLower)) scoreB += 5;

      return scoreB - scoreA;
    });
  }
}