## Project Structure

### Current Components
- **manifest.json:** Extension metadata and permissions
- **popup.html:** Main extension popup interface
- **popup.js:** Core functionality:
  - TOTP generation
  - Settings management
  - PIN handling
  - Theme management
- **popup.css:** Styling including:
  - Theme system
  - Component styles
  - Transitions
  - Layout
- **crypto.js:** Cryptographic operations

### Planned Components
- **components/:**
  - pin-input/: 4-digit PIN input component
  - totp-list/: TOTP management with sorting
  - collapsible/: Expandable sections
  - theme/: Theme management system
- **utils/:**
  - focus-management.js
  - theme-utils.js
  - storage-utils.js
  - validation.js

### Data Flow
Current:
1. Extension loads popup.html
2. Check for PIN requirement
3. Load settings and secrets
4. Initialize managers
5. Generate TOTP codes
6. Handle user interactions

Planned:
1. Extension loads popup.html
2. Load theme preferences
3. If PIN is set:
   - Show 4-digit PIN input
   - Handle digit-by-digit entry
   - Validate complete PIN
4. Load TOTP management:
   - Show collapsible add section
   - Load sorted TOTP list
   - Handle interactions

### Component Architecture
### Component Architecture
Header Section:
```html
<div class="header">
  <div class="search-container">
    <input type="text" class="search-input" placeholder="Search services and tags..." />
  </div>
  <div class="header-actions">
    <button class="header-button add-button" title="Add New TOTP">
      <span class="button-icon">+</span>
    </button>
    <button class="header-button theme-button" title="Toggle Theme">
      <span class="button-icon">☀️</span>
    </button>
    <button class="header-button settings-button" title="Settings">
      <span class="button-icon">⚙️</span>
    </button>
  </div>
</div>
```

TOTP Card:
```html
<div class="totp-card">
  <div class="totp-info">
    <div class="service-name">Service Name</div>
    <div class="totp-code">123 456</div>
  </div>
  <div class="totp-tags">
    <span class="tag">example.com</span>
    <span class="tag">work</span>
  </div>
  <div class="totp-progress">
    <div class="progress-bar"></div>
  </div>
</div>
```

Modal Header:
```html
<div class="modal-header">
  <h2>Modal Title</h2>
  <div class="modal-actions">
    <button class="modal-button close-button">
      <span class="button-icon">×</span>
    </button>
  </div>
</div>
```
### Theme System
Structure:
```css
:root {
  /* Light theme variables */
  --bg-color-light: #ffffff;
  --text-color-light: #000000;
  /* Dark theme variables */
  --bg-color-dark: #1a1a1a;
  --text-color-dark: #ffffff;
}

/* Theme application */
body {
  background-color: var(--bg-color-light);
  color: var(--text-color-light);
}

body.dark-mode {
  background-color: var(--bg-color-dark);
  color: var(--text-color-dark);
}
```

### Recent Changes
- Added PIN protection
- Implemented theme system
- Added TOTP management
- Improved modal system

### Planned Changes
UI Improvements:
- 4-digit PIN input system
- Collapsible add section
- Sort order functionality
- Theme consistency fixes

Component Updates:
- PIN input behavior
- TOTP list organization
- Theme implementation
- Modal styling

### Storage Schema
```javascript
{
  hashedPin: string,
  darkMode: boolean,
  sortOrder: 'newest' | 'oldest',
  secrets: [
    {
      name: string,
      secret: string,
      urlFilters: string[],
      createdAt: number
    }
  ]
}
```

### Event Handling
PIN Input:
```javascript
pinDigits.forEach((input, index) => {
  input.addEventListener('input', (e) => {
    if (e.target.value) {
      if (index < 3) pinDigits[index + 1].focus();
    }
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !e.target.value) {
      if (index > 0) pinDigits[index - 1].focus();
    }
  });
});
```

TOTP Management:
```javascript
// Keyboard navigation for TOTP list
const handleKeyboardNavigation = (e) => {
  const cards = Array.from(totpList.querySelectorAll('.totp-card'));
  const currentIndex = cards.findIndex(card => card === document.activeElement);
  
  if (e.key === 'Enter' && currentIndex !== -1) {
    e.preventDefault();
    cards[currentIndex].click();
  } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    let targetIndex = currentIndex === -1 ? 0 :
      e.key === 'ArrowDown'
        ? Math.min(currentIndex + 1, cards.length - 1)
        : Math.max(currentIndex - 1, 0);

    cards[targetIndex].focus();
    cards[targetIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
};

// Add/Remove section handling
addButton.addEventListener('click', () => {
  if (addSection.expanded) {
    // Handle form submission
    addSection.collapse();
  } else {
    addSection.expand();
  }
});
```

### Testing Strategy
Current:
- Manual testing
- Chrome DevTools
- Cross-browser checks

Planned:
- Component testing
- Theme validation
- Performance testing
- Accessibility checks

### Documentation
Current:
- Basic setup guide
- Security overview
- Theme documentation

Planned:
- Component API docs
- Theme customization
- Event handling
- Storage management