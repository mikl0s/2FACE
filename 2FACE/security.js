class SecurityManager {
  constructor() {
    this.clipboardTimeout = 30000; // 30 seconds
    this.sessionTimeout = 5 * 60 * 1000; // 5 minutes
    this.lastActivity = Date.now();
    this.setupActivityTracking();
  }

  // Track user activity
  setupActivityTracking() {
    ['mousedown', 'keydown', 'touchstart'].forEach(eventType => {
      document.addEventListener(eventType, () => {
        this.lastActivity = Date.now();
      });
    });

    // Check for inactivity every minute
    setInterval(() => {
      if (Date.now() - this.lastActivity > this.sessionTimeout) {
        this.lockExtension();
      }
    }, 60000);
  }

  // Copy text to clipboard and clear after timeout
  async copyToClipboardWithTimeout(text) {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Copied to clipboard:', text);
      
      // Clear clipboard after timeout
      setTimeout(async () => {
        try {
          const currentClipboard = await navigator.clipboard.readText();
          if (currentClipboard === text) {
            await navigator.clipboard.writeText('');
            console.log('Clipboard cleared');
          }
        } catch (error) {
          console.error('Error clearing clipboard:', error);
        }
      }, this.clipboardTimeout);

      return true;
    } catch (error) {
      console.error('Could not copy text:', error);
      return false;
    }
  }

  // Lock the extension
  lockExtension() {
    // Hide main container
    const container = document.querySelector('.container');
    if (container) {
      container.style.display = 'none';
    }

    // Show PIN entry
    if (window.pinManager) {
      window.pinManager.initializePinUI();
    }
  }

  // Clear sensitive data from memory
  clearSensitiveData() {
    // Clear any variables that might contain sensitive data
    if (window.totpManager) {
      window.totpManager.clearSecrets();
    }
  }
}

// Export for use in other files
window.SecurityManager = SecurityManager;