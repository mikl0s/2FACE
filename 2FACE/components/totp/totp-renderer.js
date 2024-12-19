import '../../jsOTP.js';

// TOTP list rendering functionality
export function renderTotpList(secrets) {
  const totpList = document.getElementById('totpList');
  if (!totpList) {
    return;
  }

  totpList.innerHTML = '';

  if (!secrets || secrets.length === 0) {
    totpList.innerHTML = `
      <div class="empty-state">
        <p>No TOTP secrets added yet.</p>
        <p>Click the "Add New Secret" button to get started.</p>
      </div>
    `;
    return;
  }

  // Setup keyboard navigation
  const handleKeyboardNavigation = e => {
    const cards = Array.from(totpList.querySelectorAll('.totp-card'));
    const currentIndex = cards.findIndex(card => card === document.activeElement);

    if (e.key === 'Enter' && currentIndex !== -1) {
      e.preventDefault();
      // Trigger click on focused card
      cards[currentIndex].click();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      let targetIndex;

      if (currentIndex === -1) {
        // No card focused, start from top
        targetIndex = 0;
      } else if (e.key === 'ArrowDown') {
        targetIndex = Math.min(currentIndex + 1, cards.length - 1);
      } else {
        targetIndex = Math.max(currentIndex - 1, 0);
      }

      // Focus and scroll target into view
      const targetCard = cards[targetIndex];
      targetCard.focus();
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Remove any existing event listener and add the new one
  document.removeEventListener('keydown', handleKeyboardNavigation);
  document.addEventListener('keydown', handleKeyboardNavigation);

  secrets.forEach(secret => {
    const totpCode = generateTotpCode(secret.secret);
    const timeRemaining = getTimeRemaining();
    const div = document.createElement('div');
    div.classList.add('totp-item');
    div.innerHTML = `
      <div class="totp-card" tabindex="0" role="button" aria-label="Copy TOTP code for ${secret.name}">
        <div class="totp-info">
          <div class="service-name">${secret.name}</div>
          <div class="totp-code">${totpCode.replace(/(\d{3})(\d{3})/, '$1 $2')}</div>
        </div>
        <button class="copy-button" title="Copy TOTP code">
          <span class="button-icon">📋</span>
        </button>
      </div>
      <div class="totp-progress">
        <div class="progress-bar" style="width: ${(timeRemaining / 30) * 100}%"></div>
      </div>
    `;

    const card = div.querySelector('.totp-card');
    card.tabIndex = 0; // Enable keyboard focus

    // Function to copy code
    const copyCode = async () => {
      try {
        await navigator.clipboard.writeText(totpCode);
        const copyButton = div.querySelector('.copy-button');
        copyButton.classList.add('copied');
        copyButton.innerHTML = '<span class="button-icon">✓</span>';

        // Close the popup after copying
        setTimeout(() => {
          window.close();
        }, 500);
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    };

    // Click handler
    div.addEventListener('click', copyCode);

    // Keyboard handler for Enter/Space
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        copyCode();
      }
    });

    totpList.appendChild(div);
  });
}

function getTimeRemaining() {
  return 30 - (Math.floor(Date.now() / 1000) % 30);
}

function generateTotpCode(secret) {
  try {
    // Remove spaces and convert to uppercase
    const cleanSecret = secret.replace(/\s+/g, '').toUpperCase();

    // Create TOTP object (jsOTP uses SHA1, 6 digits, and 30s interval by default)
    const totp = new jsOTP.totp();
    const token = totp.getOtp(cleanSecret);

    // Ensure 6 digits with leading zeros
    return token.toString().padStart(6, '0');
  } catch (error) {
    console.error('Error generating TOTP code:', error);
    console.error('Secret:', secret);
    return '------';
  }
}

// Auto-refresh TOTP codes and progress bars
export function startTotpAutoRefresh() {
  // Update progress bars every second
  setInterval(() => {
    const progressBars = document.querySelectorAll('.progress-bar');
    const timeRemaining = getTimeRemaining();
    progressBars.forEach(bar => {
      bar.style.width = `${(timeRemaining / 30) * 100}%`;
    });
  }, 1000);

  // Refresh TOTP codes when they expire
  setInterval(() => {
    const timeRemaining = getTimeRemaining();
    if (timeRemaining === 30) {
      chrome.storage.sync.get(['secrets'], result => {
        if (result.secrets) {
          renderTotpList(result.secrets);
        }
      });
    }
  }, 1000);
}
