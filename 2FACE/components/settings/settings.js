import { createModal } from '../modal/modal.js';
import { pinManager } from './pin-manager.js';

export function openSettingsModal() {
  const content = `
    <div class="modal-header">
      <h2>Settings</h2>
      <button class="close-button" title="Close">✕</button>
    </div>
    <div class="modal-body">
      <div class="settings-section">
        <h3>PIN Protection</h3>
        <div class="pin-form">
          <div>
            <label>Current PIN</label>
            <div id="currentPinContainer"></div>
          </div>
          <div>
            <label>New PIN (4 digits)</label>
            <div id="newPinContainer"></div>
          </div>
          <div>
            <label>Confirm PIN</label>
            <div id="confirmPinContainer"></div>
          </div>
          <div class="pin-actions">
            <button id="setPinButton">Set PIN</button>
            <button id="removePinButton">Remove PIN</button>
          </div>
          <div id="pinSettingsMessage" class="settings-message"></div>
          <div class="pin-info">
            <p>PIN protection adds an extra layer of security to your TOTP codes.</p>
            <p>Your PIN will sync across all Chrome browsers where you're signed in.</p>
            <p>After 3 failed attempts, you'll be locked out for 5 minutes.</p>
          </div>
        </div>
      </div>
      <div class="settings-section">
        <h3>Theme</h3>
        <button id="toggleDarkMode" class="theme-button">
          ${document.body.classList.contains('light-mode') ? '🌙 Switch to Dark Mode' : '🌞 Switch to Light Mode'}
        </button>
      </div>
    </div>
  `;

  const modal = createModal(content);

  // Set up close button
  const closeButton = modal.querySelector('.close-button');
  closeButton.addEventListener('click', () => {
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 300);
  });

  // Initialize PIN input components
  const currentPinContainer = modal.querySelector('#currentPinContainer');
  const newPinContainer = modal.querySelector('#newPinContainer');
  const confirmPinContainer = modal.querySelector('#confirmPinContainer');

  // Create PIN inputs
  const currentPinInput = pinManager.createPinInput();
  const newPinInput = pinManager.createPinInput();
  const confirmPinInput = pinManager.createPinInput();

  currentPinContainer.appendChild(currentPinInput);
  newPinContainer.appendChild(newPinInput);
  confirmPinContainer.appendChild(confirmPinInput);

  const setPinButton = modal.querySelector('#setPinButton');
  const removePinButton = modal.querySelector('#removePinButton');
  const pinMessage = modal.querySelector('#pinSettingsMessage');
  const toggleDarkMode = modal.querySelector('#toggleDarkMode');

  setPinButton.addEventListener('click', async () => {
    const currentPin = pinManager.getFullPin(currentPinInput);
    const newPin = pinManager.getFullPin(newPinInput);
    const confirmPin = pinManager.getFullPin(confirmPinInput);

    if (!/^\d{4}$/.test(newPin)) {
      pinMessage.textContent = 'PIN must be exactly 4 digits';
      pinMessage.style.color = 'var(--error-color)';
      return;
    }

    if (newPin !== confirmPin) {
      pinMessage.textContent = 'PINs do not match';
      pinMessage.style.color = 'var(--error-color)';
      return;
    }

    const verifyResult = await pinManager.verifyPin(currentPin);
    if (!verifyResult.success && verifyResult.locked) {
      pinMessage.textContent = `Too many attempts. Locked for ${Math.ceil(verifyResult.remainingTime / 60)} minutes.`;
      pinMessage.style.color = 'var(--error-color)';
      return;
    }

    chrome.storage.sync.get(['hashedPin'], async result => {
      if (!result.hashedPin || verifyResult.success) {
        await pinManager.setPin(newPin);
        pinMessage.textContent = 'PIN set successfully';
        pinMessage.style.color = 'var(--success-color)';
        pinManager.clearPin(currentPinInput);
        pinManager.clearPin(newPinInput);
        pinManager.clearPin(confirmPinInput);
        setTimeout(() => {
          modal.classList.remove('show');
          setTimeout(() => modal.remove(), 300);
        }, 1000);
      } else {
        pinMessage.textContent = `Incorrect PIN. ${verifyResult.remaining} attempts remaining.`;
        pinMessage.style.color = 'var(--error-color)';
      }
    });
  });

  removePinButton.addEventListener('click', async () => {
    const currentPin = pinManager.getFullPin(currentPinInput);

    const verifyResult = await pinManager.verifyPin(currentPin);
    if (!verifyResult.success && verifyResult.locked) {
      pinMessage.textContent = `Too many attempts. Locked for ${Math.ceil(verifyResult.remainingTime / 60)} minutes.`;
      pinMessage.style.color = 'var(--error-color)';
      return;
    }

    chrome.storage.sync.get(['hashedPin'], async result => {
      if (!result.hashedPin || verifyResult.success) {
        await pinManager.removePin();
        pinMessage.textContent = 'PIN removed successfully';
        pinMessage.style.color = 'var(--success-color)';
        pinManager.clearPin(currentPinInput);
        pinManager.clearPin(newPinInput);
        pinManager.clearPin(confirmPinInput);
        setTimeout(() => {
          modal.classList.remove('show');
          setTimeout(() => modal.remove(), 300);
        }, 1000);
      } else {
        pinMessage.textContent = `Incorrect PIN. ${verifyResult.remaining} attempts remaining.`;
        pinMessage.style.color = 'var(--error-color)';
      }
    });
  });

  toggleDarkMode.addEventListener('click', () => {
    const isLightMode = document.body.classList.contains('light-mode');
    document.body.classList.toggle('light-mode', !isLightMode);
    chrome.storage.sync.set({ darkMode: isLightMode });
    toggleDarkMode.textContent = !isLightMode
      ? '🌙 Switch to Dark Mode'
      : '🌞 Switch to Light Mode';
  });
}
