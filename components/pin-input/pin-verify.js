import { pinManager } from '../settings/pin-manager.js';

export class PinVerify extends HTMLElement {
  constructor() {
    super();
    this.attempts = 0;
  }

  connectedCallback() {
    this.classList.add('pin-container');
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.innerHTML = `
      <div class="pin-input-container">
        <h2>Enter PIN</h2>
        <pin-input id="verifyPin"></pin-input>
        <div class="pin-message"></div>
      </div>
    `;
  }

  setupEventListeners() {
    const pinInput = this.querySelector('pin-input');
    const messageEl = this.querySelector('.pin-message');

    const showMessage = (text, type = 'error') => {
      messageEl.textContent = text;
      messageEl.className = `pin-message ${type}`;
    };

    pinInput.addEventListener('change', async ({ detail: pin }) => {
      if (pin.length === 4) {
        const verifyResult = await pinManager.verifyPin(pin);
        
        if (verifyResult.success) {
          showMessage('PIN verified', 'success');
          // Dispatch pinverified event
          this.dispatchEvent(new CustomEvent('pinverified', {
            bubbles: true,
            composed: true
          }));
          setTimeout(() => {
            this.remove();
          }, 500);
        } else if (verifyResult.locked) {
          showMessage(`Too many attempts. Locked for ${Math.ceil(verifyResult.remainingTime / 60)} minutes.`);
          pinInput.setError();
        } else {
          if (verifyResult.remaining === 0) {
            // On last failed attempt, remove PIN and show notification
            pinManager.removePin().then(() => {
              const notification = document.createElement('div');
              notification.className = 'pin-notification';
              notification.innerHTML = `
                <div class="pin-notification-content">
                  <h3>PIN Verification Failed</h3>
                  <p>PIN has been removed due to too many failed attempts.</p>
                  <button class="pin-notification-button">OK</button>
                </div>
              `;
              
              notification.querySelector('button').addEventListener('click', () => {
                notification.remove();
                this.remove();
              });
              
              document.body.appendChild(notification);
            });
          } else {
            showMessage(`Incorrect PIN. ${verifyResult.remaining} attempts remaining.`);
            pinInput.setError();
            setTimeout(() => {
              pinInput.setError(false);
              pinInput.clear();
            }, 1000);
          }
        }
      }
    });
  }

  // Public method to check if PIN is required
  static async isRequired() {
    return new Promise(resolve => {
      chrome.storage.sync.get(['hashedPin'], result => {
        resolve(!!result.hashedPin);
      });
    });
  }
}

// Register the custom element
customElements.define('pin-verify', PinVerify);