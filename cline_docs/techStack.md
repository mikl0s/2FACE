## Technology Choices

### Core Technologies
- **Chrome Extension API:**
  - Storage sync for cross-browser data
  - Clipboard API for TOTP copying
  - Future: Content scripts for auto-fill
- **HTML:**
  - Semantic markup for accessibility
  - Dynamic content generation
  - Custom input components
- **CSS:**
  - CSS Grid & Flexbox for layouts
  - CSS Variables for theming
  - Transitions for smooth UX
- **JavaScript:**
  - ES6+ features
  - Async/await for better flow
  - Event delegation
  - Focus management

### Storage & Security
- **Chrome Storage API (`storage.sync`):**
  - Settings synchronization
  - Encrypted data storage
  - Cross-browser sync
  - Storage schema:
    ```javascript
    {
      hashedMasterPin: "sha256_of_master_pin",
      hashedAccessPin: "sha256_of_access_pin",
      encryptedMasterKey: "master_pin_encrypted_master_key",
      secrets: [
        {
          name: "Service Name",
          encryptedSecret: "master_key_encrypted_secret",
          urlFilters: ["example.com"]
        }
      ]
    }
    ```

- **Cryptography:**
  - AES-256 for secret encryption
  - HMAC-SHA1 for TOTP generation
  - SHA-256 for PIN hashing
  - Base32 encoding/decoding
  - Key derivation for master key encryption

### Security Features
- **Two-PIN System:**
  - **Master PIN (6-digit):**
    * Used for encrypting/decrypting master key
    * Required for adding/managing secrets
    * SHA-256 hashing with salt
    * Higher security for critical operations
  - **Access PIN (4-digit):**
    * Daily access to view TOTP codes
    * 3 attempts before lockout
    * 5-minute lockout duration
    * Quick access for frequent use
  - **Key Management:**
    * Random master key for secret encryption
    * Master key encrypted with Master PIN
    * Secrets encrypted with master key
    * PIN changes don't affect encrypted secrets

- **Access Control:**
  - Session management (5-minute timeout)
  - Automatic logout on inactivity
  - Clipboard auto-clear (30 seconds)
  - Input validation and sanitization
  - Activity tracking (mouse, keyboard, touch)

- **Storage Security:**
  - Chrome sync storage encryption
  - AES-256 for secret encryption
  - Encrypted master key storage
  - Secure secret backup/export

### UI/UX Features
- **PIN Input System:**
  - Separate digit fields
  - Auto-focus behavior
  - Masked input (*) display
  - Current field highlight
  - Keyboard navigation
- **TOTP Management:**
  - Collapsible add section
  - Sort order control
  - Newest-first display
  - Smooth transitions
  - Visual feedback
- **Theme System:**
  - Light/dark mode support
  - Consistent styling
  - Color transitions
  - Input field theming
  - Modal theming

### Component Architecture
- **Input Components:**
  - PIN digit inputs
  - TOTP secret fields
  - URL filter inputs
  - Form validation
- **Layout Components:**
  - Collapsible sections
  - Modal windows
  - List containers
  - Action buttons
- **Theme Components:**
  - Color schemes
  - Typography
  - Spacing system
  - Transitions

### Development Tools
- **Chrome Developer Tools:**
  - Extension debugging
  - Storage inspection
  - Theme testing
  - Performance monitoring
- **VSCode:**
  - Development environment
  - Extension testing
  - Live reload
- **Git:**
  - Version control
  - Feature branches
  - Code review

### Testing Strategy
- **Component Testing:**
  - PIN input behavior
  - Sort functionality
  - Theme consistency
  - Transitions
- **Integration Testing:**
  - Full workflows
  - Cross-browser sync
  - Theme switching
  - Data persistence

### Future Considerations
- **Auto-fill System:**
  - Content scripts
  - URL matching
  - DOM manipulation
- **Import/Export:**
  - Data format
  - Encryption
  - Validation
- **Search System:**
  - Filtering
  - Sorting
  - Indexing

### CSS Architecture
- **Base Styles:**
  - Reset/normalize
  - Typography
  - Colors
  - Spacing
- **Component Styles:**
  - PIN input
  - TOTP cards
  - Modals
  - Buttons
- **Theme Variables:**
  - Color schemes
  - Input styles
  - Transitions
  - Shadows
- **Utilities:**
  - Flexbox helpers
  - Spacing classes
  - Text alignment
  - Visibility

### JavaScript Architecture
- **Core Modules:**
  - PIN management
  - TOTP generation
  - Theme handling
  - Storage sync
- **UI Controllers:**
  - Input management
  - Focus handling
  - Sort control
  - Collapse behavior
- **Event Handlers:**
  - PIN input
  - Theme switching
  - List sorting
  - Form submission

### Performance Considerations
- **Transition Management:**
  - Hardware acceleration
  - Animation timing
  - State changes
  - Layout shifts
- **Event Handling:**
  - Debouncing
  - Throttling
  - Event delegation
  - Memory management
- **Storage Optimization:**
  - Data structure
  - Update frequency
  - Cache management
  - Sync timing