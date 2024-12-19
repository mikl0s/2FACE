# 2FACE
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Security](https://img.shields.io/badge/security-PIN%20protected-green.svg)](README.md#security-features)
[![Platform](https://img.shields.io/badge/platform-Chrome-yellow.svg)](README.md#installation)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-brightgreen.svg)](README.md#technologies)
[![Dark Mode](https://img.shields.io/badge/theme-light%20%2F%20dark-blueviolet.svg)](README.md#features)
[![TOTP](https://img.shields.io/badge/2FA-TOTP-orange.svg)](README.md#features)
[![Keyboard](https://img.shields.io/badge/navigation-keyboard-lightgrey.svg)](README.md#features)
[![Storage](https://img.shields.io/badge/sync-cross--browser-blue.svg)](README.md#features)

A modern, secure Chrome extension for managing Time-Based One-Time Passwords (TOTP). Features a clean interface, keyboard navigation, and cross-browser sync.

## Features

- 🔒 PIN protection for secure access
- 🌙 Dark/Light theme with cross-browser sync
- ⌨️ Full keyboard navigation support
- 📋 Quick TOTP code copying
- 🔄 Auto-refresh of TOTP codes
- 🏷️ URL filters for each secret
- 🎨 Modern, responsive UI
- 💾 Secure local storage
- 🔄 Cross-browser synchronization
- 🎯 Accessibility focused

## Technologies

- **Frontend:**
  - HTML5 with semantic markup
  - CSS3 with CSS Variables and Flexbox
  - ES6+ JavaScript with modules
  
- **Security:**
  - CryptoJS for TOTP generation
  - PIN-based access control
  - Secure storage handling

- **Chrome APIs:**
  - Storage Sync API
  - Clipboard API
  - Extension API

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mikl0s/2FACE.git
   ```

2. Open Chrome and navigate to:
   ```
   chrome://extensions
   ```

3. Enable "Developer mode" in the top right

4. Click "Load unpacked" and select the `2FACE` directory

## Usage

1. Click the 2FACE icon in your browser toolbar
2. First time setup:
   - Set a 4-digit PIN for security
   - Choose your preferred theme
3. Managing TOTP:
   - Click "🏛️" to add/edit TOTP secrets
   - Enter service name and Base32 secret
   - Add optional URL filters
4. Daily use:
   - Enter PIN to access your codes
   - Click a code to copy to clipboard
   - Use keyboard navigation (↑/↓/Enter)
   - Toggle theme with 🌙

## Keyboard Navigation

- `Tab`: Navigate between elements
- `↑/↓`: Move between TOTP codes
- `Enter`: Copy selected code
- `Esc`: Close popups

## Security Features

- 4-digit PIN protection
- Secure local storage
- Auto-logout
- Clipboard clearing
- No external dependencies

## Development

1. Clone the repository
2. Make your changes
3. Test in Chrome
4. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
