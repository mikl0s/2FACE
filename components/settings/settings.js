import { createModal } from '../modal/modal.js';
import { pinManager } from './pin-manager.js';
import '../pin-input/pin-input.js';
import { PinVerify } from '../pin-input/pin-verify.js';
import { hidMonitor } from '../../core/hid_monitor.js';

export function openSettingsModal() {
  const content = `
    <div class="modal-header">
      <h2>Settings</h2>
      <button class="close-button" title="Close">✕</button>
    </div>
    <div class="modal-body">
      <div class="settings-section">
        <h3>Security Settings</h3>
        <div class="hid-settings">
          <div class="setting-row">
            <div class="setting-label">
              <label for="hidMonitoring">HID Device Protection</label>
              <p class="setting-description">
                Disable TOTP display when unknown USB devices are detected
              </p>
            </div>
            <div class="setting-control">
              <label class="switch">
                <input type="checkbox" id="hidMonitoring">
                <span class="slider round"></span>
              </label>
            </div>
          </div>
          <div class="setting-row">
            <button id="trustDevices" class="secondary-button">Trust Current Devices</button>
            <p class="setting-description">
              Mark all currently connected devices as trusted
            </p>
          </div>
        </div>
      </div>
      <div class="settings-section">
        <h3>Keyboard Shortcuts</h3>
        <div class="setting-row">
          <div class="setting-label">
            <label>Quick Access Shortcut</label>
            <p class="setting-description">
              Default: Ctrl+Shift+2 (Windows/Linux) or Command+Shift+2 (Mac)
            </p>
          </div>
          <div class="setting-control">
            <button id="configureShortcuts" class="secondary-button">Configure</button>
          </div>
        </div>
      </div>
      <div class="settings-section">
        <h3>PIN Protection</h3>
        <div class="pin-settings">
          <div class="pin-timer-setting">
            <label for="pinTimer">PIN Re-entry Timer (minutes)</label>
            <select id="pinTimer" class="pin-timer-select">
              <option value="0">Always require PIN</option>
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
            </select>
            <p class="setting-description">
              If you've entered your PIN within this time, you won't need to enter it again.
            </p>
          </div>
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
    </div>
  `;

  const modal = createModal(content);

  // Set up HID monitoring
  const hidMonitoringToggle = modal.querySelector('#hidMonitoring');
  const trustDevicesButton = modal.querySelector('#trustDevices');

  // Initialize HID monitoring state
  chrome.storage.sync.get(['hidMonitoringEnabled'], result => {
    hidMonitoringToggle.checked = result.hidMonitoringEnabled || false;
  });

  // Handle HID monitoring toggle
  hidMonitoringToggle.addEventListener('change', async () => {
    if (hidMonitoringToggle.checked) {
      try {
        // Request HID device permission
        await navigator.hid.requestDevice({
          filters: [] // Empty array to see all devices
        });
        await hidMonitor.enable();
      } catch (error) {
        console.error('Failed to enable HID monitoring:', error);
        hidMonitoringToggle.checked = false;
      }
    } else {
      await hidMonitor.disable();
    }
  });

  // Handle trust devices button
  trustDevicesButton.addEventListener('click', async () => {
    try {
      await hidMonitor.trustCurrentDevices();
      showMessage('Current devices trusted successfully', 'success');
    } catch (error) {
      console.error('Failed to trust devices:', error);
      showMessage('Failed to trust devices', 'error');
    }
  });

  // Handle configure shortcuts button
  const configureShortcuts = modal.querySelector('#configureShortcuts');
  configureShortcuts.addEventListener('click', () => {
    chrome.tabs.create({
      url: 'chrome://extensions/shortcuts',
    });
  });

  // Set up PIN timer
  const pinTimer = modal.querySelector('#pinTimer');
  chrome.storage.sync.get(['pinReentryMinutes'], result => {
    const minutes = result.pinReentryMinutes || 0;
    pinTimer.value = minutes.toString();
  });

  pinTimer.addEventListener('change', () => {
    const minutes = parseInt(pinTimer.value, 10);
    chrome.storage.sync.set({ pinReentryMinutes: minutes });
  });

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
