class SettingsManager {
  constructor() {
    this.modal = null;
    this.darkMode = true; // Default to dark mode
  }

  // Initialize settings
  initialize() {
    this.loadSettings();
    this.setupEventListeners();
  }

  // Load saved settings
  loadSettings() {
    chrome.storage.sync.get(['darkMode'], result => {
      this.darkMode = result.darkMode !== undefined ? result.darkMode : true;
      document.body.classList.toggle('dark-mode', this.darkMode);
    });
  }

  // Set up event listeners
  setupEventListeners() {
    const settingsButton = document.getElementById('settingsButton');
    const darkModeToggle = document.getElementById('darkModeToggle');

    if (settingsButton) {
      settingsButton.addEventListener('click', () => this.openSettingsModal());
    }

    if (darkModeToggle) {
      darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
    }
  }

  // Toggle dark mode
  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark-mode', this.darkMode);
    chrome.storage.sync.set({ darkMode: this.darkMode });
  }

  // Open settings modal
  openSettingsModal() {
    this.modal = document.createElement('div');
    this.modal.classList.add('modal');
    this.modal.innerHTML = `
      <div class="modal-content">
        <button class="close-button">&times;</button>
        <div class="settings-tabs">
          <button class="tab-button active" data-tab="pin">PIN Management</button>
          <button class="tab-button" data-tab="secrets">TOTP Secrets</button>
        </div>
        <div class="tab-content">
          <div id="pinTab" class="tab-pane active">
            <h3>PIN Management</h3>
            <div class="pin-management">
              <div class="pin-form">
                <input type="password" id="currentPin" placeholder="Current PIN" maxlength="4" pattern="[0-9]*" inputmode="numeric" />
                <input type="password" id="newPin" placeholder="New PIN" maxlength="4" pattern="[0-9]*" inputmode="numeric" />
                <input type="password" id="confirmPin" placeholder="Confirm PIN" maxlength="4" pattern="[0-9]*" inputmode="numeric" />
                <div class="pin-actions">
                  <button id="changePinButton">Change PIN</button>
                  <button id="removePinButton">Remove PIN</button>
                </div>
                <div id="pinMessage" class="settings-message"></div>
              </div>
            </div>
          </div>
          <div id="secretsTab" class="tab-pane">
            <h3>Manage TOTP Secrets</h3>
            <div id="secretList"></div>
            <div class="add-secret-form">
              <h4>Add New Secret</h4>
              <input type="text" id="newSecretName" placeholder="Name (e.g., GitHub, Google)" />
              <input type="text" id="newSecret" placeholder="Secret key" />
              <input type="text" id="newUrlFilter" placeholder="URL filter (e.g., github.com)" />
              <div class="secret-actions">
                <button id="addSecretButton">Add Secret</button>
                <button id="clearSecretsButton">Clear All</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(this.modal);

    this.setupModalEventListeners();
    this.loadSecretsToModal();
  }

  // Set up modal event listeners
  setupModalEventListeners() {
    const closeButton = this.modal.querySelector('.close-button');
    const tabButtons = this.modal.querySelectorAll('.tab-button');
    const changePinButton = this.modal.querySelector('#changePinButton');
    const removePinButton = this.modal.querySelector('#removePinButton');
    const addSecretButton = this.modal.querySelector('#addSecretButton');
    const clearSecretsButton = this.modal.querySelector('#clearSecretsButton');

    closeButton.addEventListener('click', () => this.closeSettingsModal());

    tabButtons.forEach(button => {
      button.addEventListener('click', e => {
        const tabId = e.target.dataset.tab;
        this.switchTab(tabId);
      });
    });

    changePinButton.addEventListener('click', () => this.handlePinChange());
    removePinButton.addEventListener('click', () => this.handlePinRemoval());
    addSecretButton.addEventListener('click', () => this.handleAddSecret());
    clearSecretsButton.addEventListener('click', () => this.handleClearSecrets());
  }

  // Switch between tabs
  switchTab(tabId) {
    const tabs = this.modal.querySelectorAll('.tab-pane');
    const buttons = this.modal.querySelectorAll('.tab-button');

    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(button => button.classList.remove('active'));

    this.modal.querySelector(`#${tabId}Tab`).classList.add('active');
    this.modal.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
  }

  // Handle PIN change
  async handlePinChange() {
    const currentPin = this.modal.querySelector('#currentPin').value;
    const newPin = this.modal.querySelector('#newPin').value;
    const confirmPin = this.modal.querySelector('#confirmPin').value;
    const message = this.modal.querySelector('#pinMessage');

    if (newPin !== confirmPin) {
      message.textContent = 'New PINs do not match';
      return;
    }

    if (!/^\d{4}$/.test(newPin)) {
      message.textContent = 'PIN must be 4 digits';
      return;
    }

    if (window.pinManager) {
      const success = await window.pinManager.changePin(currentPin, newPin);
      message.textContent = success ? 'PIN changed successfully' : 'Current PIN is incorrect';
      if (success) {
        this.modal.querySelector('#currentPin').value = '';
        this.modal.querySelector('#newPin').value = '';
        this.modal.querySelector('#confirmPin').value = '';
      }
    }
  }

  // Handle PIN removal
  async handlePinRemoval() {
    const currentPin = this.modal.querySelector('#currentPin').value;
    const message = this.modal.querySelector('#pinMessage');

    if (window.pinManager) {
      const success = await window.pinManager.removePin(currentPin);
      message.textContent = success ? 'PIN removed successfully' : 'Current PIN is incorrect';
      if (success) {
        this.modal.querySelector('#currentPin').value = '';
        this.modal.querySelector('#newPin').value = '';
        this.modal.querySelector('#confirmPin').value = '';
      }
    }
  }

  // Handle adding new secret
  async handleAddSecret() {
    const nameInput = this.modal.querySelector('#newSecretName');
    const secretInput = this.modal.querySelector('#newSecret');
    const urlFilterInput = this.modal.querySelector('#newUrlFilter');

    const name = nameInput.value.trim();
    const secret = secretInput.value.trim();
    const urlFilter = urlFilterInput.value.trim();

    if (window.totpManager) {
      const success = await window.totpManager.addSecret(name, secret, urlFilter);
      if (success) {
        nameInput.value = '';
        secretInput.value = '';
        urlFilterInput.value = '';
        this.loadSecretsToModal();
      }
    }
  }

  // Handle clearing all secrets
  async handleClearSecrets() {
    if (window.totpManager) {
      await window.totpManager.clearSecrets();
      this.loadSecretsToModal();
    }
  }

  // Load secrets to modal
  loadSecretsToModal() {
    const secretList = this.modal.querySelector('#secretList');
    if (!secretList) {
      return;
    }

    chrome.storage.sync.get(['secrets'], result => {
      const secrets = result.secrets || [];
      secretList.innerHTML = '';

      secrets.forEach((secret, index) => {
        const div = document.createElement('div');
        div.classList.add('secret-item');
        div.innerHTML = `
          <div class="secret-fields">
            <input type="text" class="secret-name" value="${secret.name}" placeholder="Name" data-index="${index}" />
            <input type="text" class="secret-key" value="${secret.secret}" placeholder="Secret key" data-index="${index}" />
            <input type="text" class="url-filter" value="${secret.urlFilter}" placeholder="URL filter" data-index="${index}" />
          </div>
          <div class="secret-actions">
            <button class="save-secret-button" data-index="${index}">Save</button>
            <button class="remove-secret-button" data-index="${index}">Remove</button>
          </div>
        `;
        secretList.appendChild(div);
      });

      this.setupSecretEventListeners();
    });
  }

  // Set up secret management event listeners
  setupSecretEventListeners() {
    this.modal.querySelectorAll('.save-secret-button').forEach(button => {
      button.addEventListener('click', e => this.handleSaveSecret(e));
    });

    this.modal.querySelectorAll('.remove-secret-button').forEach(button => {
      button.addEventListener('click', e => this.handleRemoveSecret(e));
    });
  }

  // Handle saving secret changes
  handleSaveSecret(event) {
    const index = event.target.dataset.index;
    const secretItem = event.target.closest('.secret-item');
    const name = secretItem.querySelector('.secret-name').value.trim();
    const secret = secretItem.querySelector('.secret-key').value.trim();
    const urlFilter = secretItem.querySelector('.url-filter').value.trim();

    if (name && secret) {
      chrome.storage.sync.get(['secrets'], result => {
        const secrets = result.secrets || [];
        secrets[index] = { name, secret, urlFilter };
        chrome.storage.sync.set({ secrets }, () => {
          if (window.totpManager) {
            window.totpManager.loadSecrets();
          }
          this.loadSecretsToModal();
        });
      });
    }
  }

  // Handle removing secret
  handleRemoveSecret(event) {
    const index = event.target.dataset.index;
    if (window.totpManager) {
      window.totpManager.removeSecret(index).then(() => {
        this.loadSecretsToModal();
      });
    }
  }

  // Close settings modal
  closeSettingsModal() {
    if (this.modal) {
      this.modal.remove();
      this.modal = null;
    }
  }
}

// Export for use in other files
window.SettingsManager = SettingsManager;
