export class ThemeManager {
  constructor() {
    this.storageKey = 'modernshop_theme';
    this.currentTheme = 'light';
  }

  init() {
    this.loadTheme();
    this.setupThemeToggle();
    this.detectSystemTheme();
  }

  loadTheme() {
    try {
      const savedTheme = localStorage.getItem(this.storageKey);
      if (savedTheme) {
        this.currentTheme = savedTheme;
      } else {
        // Use system preference if no saved theme
        this.currentTheme = this.getSystemTheme();
      }
      this.applyTheme();
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  }

  saveTheme() {
    try {
      localStorage.setItem(this.storageKey, this.currentTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }

  applyTheme() {
    document.body.classList.toggle('dark', this.currentTheme === 'dark');
    this.updateThemeButton();
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme();
    this.saveTheme();
  }

  setTheme(theme) {
    if (theme === 'light' || theme === 'dark') {
      this.currentTheme = theme;
      this.applyTheme();
      this.saveTheme();
    }
  }

  getCurrentTheme() {
    return this.currentTheme;
  }

  getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  detectSystemTheme() {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        const savedTheme = localStorage.getItem(this.storageKey);
        if (!savedTheme) {
          this.currentTheme = e.matches ? 'dark' : 'light';
          this.applyTheme();
        }
      });
    }
  }

  setupThemeToggle() {
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        this.toggleTheme();
      });
    }
  }

  updateThemeButton() {
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
      const icon = themeBtn.querySelector('.icon');
      if (icon) {
        icon.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
      }
      themeBtn.title = `Switch to ${this.currentTheme === 'dark' ? 'light' : 'dark'} mode`;
    }
  }

  // Get theme-appropriate colors
  getThemeColors() {
    return {
      primary: this.currentTheme === 'dark' ? '#3b82f6' : '#2563eb',
      background: this.currentTheme === 'dark' ? '#0f172a' : '#ffffff',
      surface: this.currentTheme === 'dark' ? '#1e293b' : '#f8fafc',
      text: this.currentTheme === 'dark' ? '#f1f5f9' : '#0f172a',
      textSecondary: this.currentTheme === 'dark' ? '#cbd5e1' : '#64748b'
    };
  }
}