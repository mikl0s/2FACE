// PIN management utilities
export const pinManager = {
  // Maximum failed attempts before lockout
  MAX_ATTEMPTS: 3,
  // Lockout duration in minutes
  LOCKOUT_DURATION: 5,

  hashPin(pin) {
    // Using SHA-256 for PIN hashing
    return CryptoJS.SHA256(pin.toString()).toString();
  },

  async verifyPin(pin) {
    return new Promise(resolve => {
      chrome.storage.sync.get(['hashedPin', 'failedAttempts', 'lockoutUntil'], result => {
        // Check if locked out
        if (result.lockoutUntil && Date.now() < result.lockoutUntil) {
          resolve({
            success: false,
            locked: true,
            remainingTime: Math.ceil((result.lockoutUntil - Date.now()) / 1000),
          });
          return;
        }

        // No PIN set
        if (!result.hashedPin) {
          resolve({ success: true });
          return;
        }

        const hashedInput = this.hashPin(pin);
        const success = hashedInput === result.hashedPin;

        if (!success) {
          const attempts = (result.failedAttempts || 0) + 1;
          if (attempts >= this.MAX_ATTEMPTS) {
            const lockoutUntil = Date.now() + this.LOCKOUT_DURATION * 60 * 1000;
            chrome.storage.sync.set({ failedAttempts: 0, lockoutUntil });
            resolve({ success: false, locked: true, remainingTime: this.LOCKOUT_DURATION * 60 });
          } else {
            chrome.storage.sync.set({ failedAttempts: attempts });
            resolve({ success: false, attempts, remaining: this.MAX_ATTEMPTS - attempts });
          }
        } else {
          chrome.storage.sync.set({ failedAttempts: 0, lockoutUntil: null });
          resolve({ success: true });
        }
      });
    });
  },

  createPinInput() {
    const container = document.createElement('div');
    container.className = 'pin-input-container';

    // Create 4 digit inputs
    for (let i = 0; i < 4; i++) {
      const input = document.createElement('input');
      input.type = 'password';
      input.maxLength = 1;
      input.className = 'pin-digit';
      input.dataset.index = i;
      input.pattern = '[0-9]';
      input.inputMode = 'numeric';

      // Handle digit input
      input.addEventListener('input', e => {
        // Only allow numbers
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
        if (e.target.value) {
          // Move to next input
          const next = container.querySelector(`[data-index="${i + 1}"]`);
          if (next) {
            next.focus();
          }
        }
      });

      // Handle backspace
      input.addEventListener('keydown', e => {
        if (e.key === 'Backspace' && !e.target.value) {
          // Move to previous input
          const prev = container.querySelector(`[data-index="${i - 1}"]`);
          if (prev) {
            prev.focus();
          }
        }
      });

      container.appendChild(input);
    }

    return container;
  },

  getFullPin(container) {
    const digits = Array.from(container.querySelectorAll('.pin-digit'));
    return digits.map(input => input.value).join('');
  },

  clearPin(container) {
    const digits = container.querySelectorAll('.pin-digit');
    digits.forEach(input => (input.value = ''));
    digits[0].focus();
  },

  async setPin(pin) {
    const hashedPin = this.hashPin(pin);
    await chrome.storage.sync.set({ hashedPin, failedAttempts: 0, lockoutUntil: null });
  },

  async removePin() {
    await chrome.storage.sync.set({ hashedPin: null, failedAttempts: 0, lockoutUntil: null });
  },
};
