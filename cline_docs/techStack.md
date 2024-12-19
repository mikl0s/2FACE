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
  - Hashed PIN storage
  - TOTP secrets management
  - Sort preferences
- **CryptoJS:**
  - HMAC-SHA1 for TOTP
  - SHA-256 for PIN
  - Base32 encoding/decoding
  - Future: AES for backups

### Security Features
- **PIN Protection:**
  - 4-digit separate input fields
  - Auto-focus navigation
  - Masked input display
  - Current field highlighting
  - Secure hashing
  - Failed attempt tracking
- **Access Control:**
  - Session management
  - Automatic logout
  - Clipboard security
  - Input validation

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