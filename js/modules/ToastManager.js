export class ToastManager {
  constructor() {
    this.container = document.getElementById('toastContainer');
    this.toasts = [];
    this.maxToasts = 5;
    this.defaultDuration = 4000;
  }

  show(message, type = 'info', duration = this.defaultDuration) {
    const toast = this.createToast(message, type, duration);
    this.addToast(toast);
    return toast;
  }

  createToast(message, type, duration) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = this.getIcon(type);
    
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close" aria-label="Close notification">×</button>
    `;

    // Add close functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      this.removeToast(toast);
    });

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.removeToast(toast);
      }, duration);
    }

    // Add click to dismiss
    toast.addEventListener('click', (e) => {
      if (e.target !== closeBtn) {
        this.removeToast(toast);
      }
    });

    return toast;
  }

  addToast(toast) {
    if (!this.container) {
      console.warn('Toast container not found');
      return;
    }

    // Remove oldest toast if at max capacity
    if (this.toasts.length >= this.maxToasts) {
      this.removeToast(this.toasts[0]);
    }

    this.toasts.push(toast);
    this.container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
    });
  }

  removeToast(toast) {
    if (!toast || !toast.parentNode) return;

    const index = this.toasts.indexOf(toast);
    if (index > -1) {
      this.toasts.splice(index, 1);
    }

    // Animate out
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  getIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || icons.info;
  }

  // Convenience methods
  success(message, duration) {
    return this.show(message, 'success', duration);
  }

  error(message, duration) {
    return this.show(message, 'error', duration);
  }

  warning(message, duration) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration) {
    return this.show(message, 'info', duration);
  }

  // Clear all toasts
  clear() {
    this.toasts.forEach(toast => {
      this.removeToast(toast);
    });
  }

  // Show loading toast
  showLoading(message = 'Loading...') {
    const toast = this.createToast(message, 'info', 0); // 0 duration = persistent
    toast.classList.add('loading-toast');
    
    // Add loading spinner
    const icon = toast.querySelector('.toast-icon');
    icon.innerHTML = '<div class="loading-spinner"></div>';
    
    this.addToast(toast);
    return toast;
  }

  // Update existing toast
  updateToast(toast, message, type) {
    if (!toast) return;

    const messageEl = toast.querySelector('.toast-message');
    const iconEl = toast.querySelector('.toast-icon');
    
    if (messageEl) {
      messageEl.textContent = message;
    }
    
    if (iconEl && type) {
      iconEl.textContent = this.getIcon(type);
      toast.className = `toast ${type}`;
    }
  }

  // Show confirmation toast with actions
  showConfirmation(message, onConfirm, onCancel) {
    const toast = document.createElement('div');
    toast.className = 'toast confirmation';
    
    toast.innerHTML = `
      <span class="toast-icon">❓</span>
      <span class="toast-message">${message}</span>
      <div class="toast-actions">
        <button class="toast-btn confirm-btn">Yes</button>
        <button class="toast-btn cancel-btn">No</button>
      </div>
    `;

    const confirmBtn = toast.querySelector('.confirm-btn');
    const cancelBtn = toast.querySelector('.cancel-btn');

    confirmBtn.addEventListener('click', () => {
      if (onConfirm) onConfirm();
      this.removeToast(toast);
    });

    cancelBtn.addEventListener('click', () => {
      if (onCancel) onCancel();
      this.removeToast(toast);
    });

    this.addToast(toast);
    return toast;
  }

  // Show progress toast
  showProgress(message, progress = 0) {
    const toast = document.createElement('div');
    toast.className = 'toast progress';
    
    toast.innerHTML = `
      <span class="toast-icon">⏳</span>
      <div class="toast-content">
        <span class="toast-message">${message}</span>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
      </div>
    `;

    this.addToast(toast);
    return toast;
  }

  // Update progress toast
  updateProgress(toast, progress, message) {
    if (!toast) return;

    const progressFill = toast.querySelector('.progress-fill');
    const messageEl = toast.querySelector('.toast-message');

    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }

    if (messageEl && message) {
      messageEl.textContent = message;
    }

    // Auto remove when complete
    if (progress >= 100) {
      setTimeout(() => {
        this.removeToast(toast);
      }, 1000);
    }
  }
}