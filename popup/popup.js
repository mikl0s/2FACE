import { openSettingsModal } from '../components/settings/settings.js';
import { openTotpModal } from '../components/totp/totp.js';
import { renderTotpList, startTotpAutoRefresh } from '../components/totp/totp-renderer.js';
import '../components/pin-input/pin-input.js';
import { PinVerify } from '../components/pin-input/pin-verify.js';

// Initialize theme mode
chrome.storage.sync.get(['darkMode'], result => {
  if (result.darkMode) {
    document.body.classList.remove('light-mode');
  } else {
    document.body.classList.add('light-mode');
  }
});

// Initialize TOTP list and search functionality
let currentSecrets = [];
const searchInput = document.getElementById('searchInput');

const updateList = (searchText = '') => {
  renderTotpList(currentSecrets, searchText.trim());
};

// Load initial TOTP list only after PIN verification if required
const loadTotpList = () => {
  chrome.storage.sync.get(['secrets'], result => {
    if (result.secrets) {
      currentSecrets = result.secrets;
      updateList();
      startTotpAutoRefresh();
      
      // Focus search input after loading
      if (searchInput) {
        searchInput.focus();
      }
    }
  });
};

// Check if PIN verification is required before loading TOTPs
const initializeApp = async () => {
  if (await PinVerify.isRequired()) {
    const pinVerify = new PinVerify();
    // Add event listener for successful verification
    pinVerify.addEventListener('pinverified', () => {
      loadTotpList();
    });
    document.body.appendChild(pinVerify);
  } else {
    loadTotpList();
  }
};

// Start the app
initializeApp();

// Set up search functionality
if (searchInput) {
  // Immediate search on each keystroke
  searchInput.addEventListener('input', (e) => {
    updateList(e.target.value);
  });

  // Handle keyboard navigation
  searchInput.addEventListener('keydown', (e) => {
    const totpList = document.getElementById('totpList');
    const cards = Array.from(totpList.querySelectorAll('.totp-card'));
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cards.length > 0) {
        cards[0].focus();
      }
    }
  });

  // Also handle paste events
  searchInput.addEventListener('paste', (e) => {
    // Use setTimeout to get the pasted value after the paste event
    setTimeout(() => updateList(e.target.value), 0);
  });

  // Focus search input when / is pressed
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
  });
}

// Set up event listeners
const settingsButton = document.getElementById('settingsButton');
const totpButton = document.getElementById('totpButton');
const darkModeToggle = document.getElementById('darkModeToggle');

if (settingsButton) {
  settingsButton.addEventListener('click', () => {
    console.log('Settings button clicked');
    openSettingsModal();
  });
}

if (totpButton) {
  totpButton.addEventListener('click', () => {
    console.log('TOTP button clicked');
    openTotpModal();
  });
}

if (darkModeToggle) {
  // Update button text based on current mode
  darkModeToggle.textContent = document.body.classList.contains('light-mode') ? '🌙' : '🌞';

  darkModeToggle.addEventListener('click', () => {
    console.log('Theme toggle clicked');
    const isLightMode = document.body.classList.contains('light-mode');
    document.body.classList.toggle('light-mode', !isLightMode);
    chrome.storage.sync.set({ darkMode: isLightMode }, () => {
      darkModeToggle.textContent = !isLightMode ? '🌙' : '🌞';
    });
  });
}

// Handle add new secret form
const addSecretForm = document.querySelector('.add-secret-form');
const expandButton = addSecretForm?.querySelector('.expand-button');
const cancelAddButton = document.getElementById('cancelAddButton');
const addSecretButton = document.getElementById('addSecretButton');
const newUrlFilter = document.getElementById('newUrlFilter');

if (expandButton) {
  expandButton.addEventListener('click', () => {
    addSecretForm.classList.toggle('collapsed');
  });
}

if (cancelAddButton) {
  cancelAddButton.addEventListener('click', () => {
    addSecretForm.classList.add('collapsed');
    // Clear form
    document.getElementById('newSecretName').value = '';
    document.getElementById('newSecret').value = '';
    document.getElementById('newUrlFilter').value = '';
    // Clear tags
    const tagContainer = addSecretForm.querySelector('.tag-container');
    Array.from(tagContainer.querySelectorAll('.tag')).forEach(tag => tag.remove());
  });
}

if (addSecretButton && newUrlFilter) {
  const tags = new Set();

  newUrlFilter.addEventListener('keydown', e => {
    if (e.key === 'Enter' && newUrlFilter.value.trim()) {
      e.preventDefault();
      const tag = newUrlFilter.value.trim();
      if (!tags.has(tag)) {
        tags.add(tag);
        const tagElement = document.createElement('span');
        tagElement.classList.add('tag');
        tagElement.innerHTML = `
          ${tag}
          <span class="tag-remove" data-tag="${tag}">×</span>
        `;
        newUrlFilter.parentElement.insertBefore(tagElement, newUrlFilter);
        newUrlFilter.value = '';
      }
    }
  });

  addSecretForm.querySelector('.tag-container').addEventListener('click', e => {
    if (e.target.classList.contains('tag-remove')) {
      const tag = e.target.dataset.tag;
      tags.delete(tag);
      e.target.parentElement.remove();
    }
  });

  addSecretButton.addEventListener('click', () => {
    const name = document.getElementById('newSecretName').value.trim();
    const secret = document.getElementById('newSecret').value.trim();
    const urlFilters = Array.from(tags);

    if (name && secret) {
      chrome.storage.sync.get(['secrets'], result => {
        const secrets = result.secrets || [];
        secrets.push({ name, secret, urlFilters });
        chrome.storage.sync.set({ secrets }, () => {
          // Clear form
          document.getElementById('newSecretName').value = '';
          document.getElementById('newSecret').value = '';
          document.getElementById('newUrlFilter').value = '';
          // Clear tags
          const tagContainer = addSecretForm.querySelector('.tag-container');
          Array.from(tagContainer.querySelectorAll('.tag')).forEach(tag => tag.remove());
          tags.clear();
          // Collapse form
          addSecretForm.classList.add('collapsed');
          // Update list
          renderTotpList(secrets);
        });
      });
    }
  });
}
