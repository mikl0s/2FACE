import { createModal } from '../modal/modal.js';
import { pinManager } from './pin-manager.js';
import '../pin-input/pin-input.js';
import { PinVerify } from '../pin-input/pin-verify.js';

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
            <pin-input id="currentPin"></pin-input>
          </div>
          <div>
            <label>New PIN (4 digits)</label>
            <pin-input id="newPin"></pin-input>
          </div>
          <div>
            <label>Confirm PIN</label>
            <pin-input id="confirmPin"></pin-input>
          </div>
          <div class="pin-actions">
            <button id="setPinButton">Set PIN</button>
            <button id="removePinButton">Remove PIN</button>
          </div>
          <div id="pinSettingsMessage" class="pin-message"></div>
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

  // Get PIN input elements
  const currentPinInput = modal.querySelector('#currentPin');
  const newPinInput = modal.querySelector('#newPin');
  const confirmPinInput = modal.querySelector('#confirmPin');
  const setPinButton = modal.querySelector('#setPinButton');
  const removePinButton = modal.querySelector('#removePinButton');
  const pinMessage = modal.querySelector('#pinSettingsMessage');
  const toggleDarkMode = modal.querySelector('#toggleDarkMode');

  const showMessage = (text, type = 'error') => {
    pinMessage.textContent = text;
    pinMessage.className = `pin-message ${type}`;
  };

  const clearInputs = () => {
    currentPinInput.clear();
    newPinInput.clear();
    confirmPinInput.clear();
  };

  const closeModalWithSuccess = () => {
    setTimeout(() => {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    }, 1000);
  };

  setPinButton.addEventListener('click', async () => {
    // Clear previous error states
    [currentPinInput, newPinInput, confirmPinInput].forEach(input => input.setError(false));

    const currentPin = currentPinInput.value;
    const newPin = newPinInput.value;
    const confirmPin = confirmPinInput.value;

    if (!/^\d{4}$/.test(newPin)) {
      showMessage('PIN must be exactly 4 digits');
      newPinInput.setError();
      return;
    }

    if (newPin !== confirmPin) {
      showMessage('PINs do not match');
      confirmPinInput.setError();
      return;
    }

    const verifyResult = await pinManager.verifyPin(currentPin);
    if (!verifyResult.success && verifyResult.locked) {
      showMessage(`Too many attempts. Locked for ${Math.ceil(verifyResult.remainingTime / 60)} minutes.`);
      currentPinInput.setError();
      return;
    }

    chrome.storage.sync.get(['hashedPin'], async result => {
      if (!result.hashedPin || verifyResult.success) {
        await pinManager.setPin(newPin);
        showMessage('PIN set successfully', 'success');
        clearInputs();
        closeModalWithSuccess();
      } else {
        showMessage(`Incorrect PIN. ${verifyResult.remaining} attempts remaining.`);
        currentPinInput.setError();
      }
    });
  });

  removePinButton.addEventListener('click', async () => {
    currentPinInput.setError(false);
    const currentPin = currentPinInput.value;

    const verifyResult = await pinManager.verifyPin(currentPin);
    if (!verifyResult.success && verifyResult.locked) {
      showMessage(`Too many attempts. Locked for ${Math.ceil(verifyResult.remainingTime / 60)} minutes.`);
      currentPinInput.setError();
      return;
    }

    chrome.storage.sync.get(['hashedPin'], async result => {
      if (!result.hashedPin || verifyResult.success) {
        await pinManager.removePin();
        showMessage('PIN removed successfully', 'success');
        clearInputs();
        closeModalWithSuccess();
      } else {
        showMessage(`Incorrect PIN. ${verifyResult.remaining} attempts remaining.`);
        currentPinInput.setError();
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
