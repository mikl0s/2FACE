/**
 * 2FACE - Main Extension Popup
 * Core functionality for the 2FACE Chrome extension
 * 
 * @copyright 2024 Mikkel Georgsen / Dataløs
 * @license MIT
 */

import { hidMonitor } from './core/hid_monitor.js';

// ... existing imports ...

async function initializeApp() {
  // Initialize HID monitor
  await hidMonitor.initialize();
  
  // Set callback for unknown devices
  hidMonitor.setCallback(() => {
    const totpContainer = document.querySelector('.totp-container');
    if (totpContainer) {
      totpContainer.style.display = 'none';
      
      // Show warning message
      const warning = document.createElement('div');
      warning.className = 'hid-warning';
      warning.innerHTML = `
        <div class="warning-icon">⚠️</div>
        <div class="warning-message">
          <h3>Unknown USB Device Detected</h3>
          <p>TOTP codes are hidden for your security. Please remove any untrusted USB devices or trust them in settings.</p>
        </div>
      `;
      
      document.body.appendChild(warning);
    }
  });

  if (hidMonitor.isEnabled) {
    hidMonitor.startMonitoring();
  }

  // ... rest of initialization code ...
}

// ... rest of existing code ... 