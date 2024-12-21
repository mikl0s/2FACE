class TotpManager {
  constructor() {
    this.secrets = [];
    this.refreshInterval = 30000; // 30 seconds
    this.autoRefreshTimer = null;
  }

  // Initialize TOTP functionality
  initialize() {
    this.loadSecrets();
    this.startAutoRefresh();
  }

  // Load secrets from storage
  loadSecrets() {
    chrome.storage.sync.get(['secrets'], result => {
      this.secrets = result.secrets || [];
      this.renderTotpList();
    });
  }

  // Generate TOTP code
  generateTOTP(secret) {
    const base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '';
    for (let i = 0; i < secret.length; i++) {
      const val = base32chars.indexOf(secret[i].toUpperCase());
      if (val === -1) {
        throw new Error('Invalid base32 character in secret');
      }
      bits += val.toString(2).padStart(5, '0');
    }

    let hex = '';
    for (let i = 0; i + 4 <= bits.length; i += 4) {
      const chunk = bits.substr(i, 4);
      hex += parseInt(chunk, 2).toString(16);
    }

    const epoch = Math.floor(Date.now() / 1000);
    const counter = Math.floor(epoch / 30);
    const counterHex = counter.toString(16).padStart(16, '0');

    const wordArray = CryptoJS.enc.Hex.parse(hex);
    const counterArray = CryptoJS.enc.Hex.parse(counterHex);
    const hmac = CryptoJS.HmacSHA1(counterArray, wordArray);
    const hmacHex = hmac.toString(CryptoJS.enc.Hex);

    const offset = parseInt(hmacHex.slice(-1), 16);
    const truncatedHex = hmacHex.substr(offset * 2, 8);
    const truncatedDec = parseInt(truncatedHex, 16) & 0x7fffffff;

    return (truncatedDec % 1000000).toString().padStart(6, '0');
  }

  // Render TOTP list
  renderTotpList() {
    const totpList = document.getElementById('totpList');
    if (!totpList) {
      return;
    }

    totpList.innerHTML = '';
    if (!this.secrets || this.secrets.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.style.textAlign = 'center';
      emptyState.style.padding = '20px';
      emptyState.style.color = '#666';
      emptyState.innerHTML = 'No secrets added yet. Click the gear icon to add some.';
      totpList.appendChild(emptyState);
      return;
    }

    this.secrets.forEach(secretObj => {
      try {
        const code = this.generateTOTP(secretObj.secret);
        const totpItem = document.createElement('div');
        totpItem.classList.add('totp-item');
        totpItem.innerHTML = `
          <div class="account-name">${secretObj.name}</div>
          <div class="totp-code">${code}</div>
        `;
        totpItem.addEventListener('click', () => {
          if (window.securityManager) {
            window.securityManager.copyToClipboardWithTimeout(code);
          }
        });
        totpList.appendChild(totpItem);
      } catch (error) {
        console.error('Error generating TOTP:', error);
        const errorItem = document.createElement('div');
        errorItem.classList.add('totp-item');
        errorItem.innerHTML = `
          <div class="account-name">${secretObj.name}</div>
          <div class="totp-code">Invalid Secret</div>
        `;
        totpList.appendChild(errorItem);
      }
    });
  }

  // Start auto-refresh of TOTP codes
  startAutoRefresh() {
    this.stopAutoRefresh();
    this.autoRefreshTimer = setInterval(() => {
      this.renderTotpList();
    }, this.refreshInterval);
  }

  // Stop auto-refresh
  stopAutoRefresh() {
    if (this.autoRefreshTimer) {
      clearInterval(this.autoRefreshTimer);
      this.autoRefreshTimer = null;
    }
  }

  // Add new secret
  addSecret(name, secret, urlFilter) {
    return new Promise(resolve => {
      if (name && secret) {
        chrome.storage.sync.get(['secrets'], result => {
          const secrets = result.secrets || [];
          secrets.push({ name, secret, urlFilter });
          chrome.storage.sync.set({ secrets }, () => {
            this.secrets = secrets;
            this.renderTotpList();
            resolve(true);
          });
        });
      } else {
        resolve(false);
      }
    });
  }

  // Remove secret
  removeSecret(index) {
    return new Promise(resolve => {
      chrome.storage.sync.get(['secrets'], result => {
        const secrets = result.secrets || [];
        secrets.splice(index, 1);
        chrome.storage.sync.set({ secrets }, () => {
          this.secrets = secrets;
          this.renderTotpList();
          resolve(true);
        });
      });
    });
  }

  // Clear all secrets
  clearSecrets() {
    this.secrets = [];
    this.renderTotpList();
  }
}

// Export for use in other files
window.TotpManager = TotpManager;
